import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setCheckoutDraft } from '../../processes/checkout/model/checkout.slice'
import { selectCheckout } from '../../processes/checkout/model/checkout.selectors'
import { CheckoutStepper } from '../../processes/checkout/ui/CheckoutStepper'
import { useAppDispatch, useAppSelector } from '../../shared/hooks/redux'
import { CheckoutLayout } from '../../shared/ui/layouts/CheckoutLayout'
import { PaymentDeliveryForm, type PaymentDeliveryPayload } from '../../shared/ui/organisms/PaymentDeliveryForm'

export function CardDeliveryPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const checkout = useAppSelector(selectCheckout)
  useEffect(() => {
    if (!checkout.productId) {
      navigate('/product')
    }
  }, [checkout.productId, navigate])

  function onContinue(payload: PaymentDeliveryPayload) {
    dispatch(setCheckoutDraft(payload))
    navigate('/summary')
  }

  return (
    <CheckoutLayout title="Datos de pago y entrega">
      <CheckoutStepper step={2} />
      <PaymentDeliveryForm onSubmit={onContinue} submitLabel="Ir al resumen" />
    </CheckoutLayout>
  )
}
