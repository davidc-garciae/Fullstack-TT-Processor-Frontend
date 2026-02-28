import { apiRequest } from '../client'

export type PreviewCheckoutRequest = {
  productId: string
  quantity: number
}

export type PreviewCheckoutResponse = {
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
