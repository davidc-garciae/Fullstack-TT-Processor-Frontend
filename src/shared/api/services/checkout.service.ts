import { apiRequest } from '../client'

type PreviewCheckoutRequest = {
  productId: string
  quantity: number
}

type PreviewCheckoutResponse = {
  productId: string
  quantity: number
  currency: string
  productAmountCents: number
  baseFeeCents: number
  deliveryFeeCents: number
  totalAmountCents: number
}

export function previewCheckout(payload: PreviewCheckoutRequest) {
  return apiRequest<PreviewCheckoutResponse>('/checkout/preview', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
