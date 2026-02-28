import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  clearTransactionSession,
  setIdempotencyKey,
  setPaymentStatus,
  setPreview,
  setReference,
} from '../../processes/checkout/model/checkout.slice'
import { selectCheckout } from '../../processes/checkout/model/checkout.selectors'
import { CheckoutStepper } from '../../processes/checkout/ui/CheckoutStepper'
import { previewCheckout } from '../../shared/api/services/checkout.service'
import {
  createTransaction,
  getTransactionStatus,
  payTransaction,
} from '../../shared/api/services/transactions.service'
import { useAppDispatch, useAppSelector } from '../../shared/hooks/redux'
import { toUserMessage } from '../../shared/lib/httpError'
import { newIdempotencyKey } from '../../shared/lib/idempotency'
import { formatMoney } from '../../shared/lib/formatMoney'
import { Alert } from '../../shared/ui/atoms/Alert'
import { Button } from '../../shared/ui/atoms/Button'
import { CheckoutLayout } from '../../shared/ui/layouts/CheckoutLayout'
import { SummaryRow } from '../../shared/ui/molecules/SummaryRow'
import { Card, CardContent } from '../../shared/ui/ui/card'

export function SummaryPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const checkout = useAppSelector(selectCheckout)
  const [isLoading, setIsLoading] = useState(true)
  const [isPaying, setIsPaying] = useState(false)
  const [error, setError] = useState('')

  const canPay = useMemo(
    () => Boolean(checkout.productId && checkout.customer && checkout.delivery && checkout.paymentDraft),
    [checkout],
  )

  useEffect(() => {
    if (!checkout.productId || !checkout.quantity) {
      navigate('/product')
      return
    }
    if (!checkout.customer || !checkout.delivery || !checkout.paymentDraft) {
      navigate('/card-delivery')
      return
    }

    async function runPreview() {
      setIsLoading(true)
      setError('')
      try {
        const response = await previewCheckout({
          productId: checkout.productId!,
          quantity: checkout.quantity,
        })
        dispatch(
          setPreview({
            currency: response.currency,
            productAmountCents: response.productAmountCents,
            baseFeeCents: response.baseFeeCents,
            deliveryFeeCents: response.deliveryFeeCents,
            totalAmountCents: response.totalAmountCents,
          }),
        )
      } catch (err) {
        setError(toUserMessage(err))
      } finally {
        setIsLoading(false)
      }
    }

    void runPreview()
  }, [
    checkout.customer,
    checkout.delivery,
    checkout.paymentDraft,
    checkout.productId,
    checkout.quantity,
    dispatch,
    navigate,
  ])

  async function onPay() {
    if (!checkout.productId || !checkout.customer || !checkout.delivery || !checkout.paymentDraft) return

    setIsPaying(true)
    setError('')
    try {
      const idempotencyKey = checkout.idempotencyKey ?? newIdempotencyKey()
      if (!checkout.idempotencyKey) {
        dispatch(setIdempotencyKey(idempotencyKey))
      }

      const created = await createTransaction({
        productId: checkout.productId,
        quantity: checkout.quantity,
        idempotencyKey,
        customer: checkout.customer,
        delivery: checkout.delivery,
      })
      dispatch(setReference(created.reference))

      const payment = await payTransaction(created.reference, checkout.paymentDraft)
      dispatch(setPaymentStatus(payment.status))

      const status = await getTransactionStatus(created.reference)
      dispatch(setPaymentStatus(status.status))
      navigate('/status')
    } catch (err) {
      dispatch(clearTransactionSession())
      setError(toUserMessage(err))
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <CheckoutLayout title="Resumen">
      <CheckoutStepper step={3} />
      {isLoading && <Alert role="status">Cargando resumen...</Alert>}
      {error && <Alert>{error}</Alert>}
      {!isLoading && checkout.preview && (
        <Card>
          <CardContent className="space-y-2 p-4">
          <SummaryRow
            label="Producto"
            value={formatMoney(checkout.preview.productAmountCents, checkout.preview.currency)}
          />
          <SummaryRow
            label="Base fee"
            value={formatMoney(checkout.preview.baseFeeCents, checkout.preview.currency)}
          />
          <SummaryRow
            label="Delivery fee"
            value={formatMoney(checkout.preview.deliveryFeeCents, checkout.preview.currency)}
          />
          <SummaryRow
            label="Total"
            strong
            value={formatMoney(checkout.preview.totalAmountCents, checkout.preview.currency)}
          />
          </CardContent>
        </Card>
      )}
      <Button className="w-full" disabled={!canPay} loading={isPaying} onClick={() => void onPay()} type="button">
        Pagar
      </Button>
    </CheckoutLayout>
  )
}
