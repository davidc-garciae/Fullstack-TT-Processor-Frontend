import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setPaymentStatus } from '../../processes/checkout/model/checkout.slice'
import { selectCheckout } from '../../processes/checkout/model/checkout.selectors'
import { CheckoutStepper } from '../../processes/checkout/ui/CheckoutStepper'
import { getTransactionStatus } from '../../shared/api/services/transactions.service'
import { useAppDispatch, useAppSelector } from '../../shared/hooks/redux'
import { formatMoney } from '../../shared/lib/formatMoney'
import { toUserMessage } from '../../shared/lib/httpError'
import { mapBackendStatusToUiStatus } from '../../shared/lib/statusMapper'
import { Alert } from '../../shared/ui/atoms/Alert'
import { Badge } from '../../shared/ui/ui/badge'
import { CheckoutLayout } from '../../shared/ui/layouts/CheckoutLayout'

export function StatusPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const checkout = useAppSelector(selectCheckout)
  const [totalAmountCents, setTotalAmountCents] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!checkout.reference) {
      navigate('/product')
      return
    }

    async function loadStatus() {
      setError('')
      try {
        const response = await getTransactionStatus(checkout.reference!)
        setTotalAmountCents(response.totalAmountCents)
        dispatch(setPaymentStatus(response.status))
      } catch (err) {
        setError(toUserMessage(err))
      }
    }

    void loadStatus()
  }, [checkout.reference, dispatch, navigate])

  const mappedStatus = mapBackendStatusToUiStatus(checkout.status)
  const statusVariant = mappedStatus.tone === 'success' ? 'default' : 'secondary'

  return (
    <CheckoutLayout title="Estado final">
      <CheckoutStepper step={4} />
      <div className="flex items-center gap-2" data-tone={mappedStatus.tone}>
        Estado:
        <Badge variant={statusVariant}>{mappedStatus.label}</Badge>
      </div>
      {totalAmountCents !== null && (
        <p className="text-sm text-muted-foreground">Total procesado: {formatMoney(totalAmountCents)}</p>
      )}
      {error && <Alert>{error}</Alert>}
      <Link className="text-sm font-medium underline underline-offset-4" to="/product">
        Volver al producto
      </Link>
    </CheckoutLayout>
  )
}
