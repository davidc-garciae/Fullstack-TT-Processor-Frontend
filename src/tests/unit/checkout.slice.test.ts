import { describe, expect, it } from 'vitest'
import {
  checkoutReducer,
  resetCheckout,
  selectProduct,
  setCheckoutDraft,
  setIdempotencyKey,
  setPaymentStatus,
  setPreview,
  setReference,
} from '../../processes/checkout/model/checkout.slice'

describe('checkout slice', () => {
  it('selecciona producto y cantidad', () => {
    const next = checkoutReducer(
      undefined,
      selectProduct({
        selectedProduct: {
          id: '1',
          name: 'Phone',
          description: 'desc',
          priceCents: 1000,
          currency: 'COP',
          stockAvailable: 3,
        },
        quantity: 2,
      }),
    )

    expect(next.productId).toBe('1')
    expect(next.quantity).toBe(2)
  })

  it('guarda draft y preview', () => {
    const withDraft = checkoutReducer(
      undefined,
      setCheckoutDraft({
        customer: {
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          phone: '300',
          documentType: 'CC',
          documentNumber: '123',
        },
        delivery: {
          addressLine1: 'Street 1',
          city: 'Medellin',
          region: 'Antioquia',
          country: 'CO',
          postalCode: '050001',
        },
        paymentDraft: {
          cardNumber: '4242424242424242',
          cvc: '123',
          expMonth: '12',
          expYear: '28',
          cardHolder: 'JANE DOE',
          installments: 1,
          email: 'jane@example.com',
        },
      }),
    )

    const withPreview = checkoutReducer(
      withDraft,
      setPreview({
        currency: 'COP',
        productAmountCents: 1000,
        baseFeeCents: 100,
        deliveryFeeCents: 200,
        totalAmountCents: 1300,
      }),
    )

    expect(withPreview.customer?.email).toBe('jane@example.com')
    expect(withPreview.preview?.totalAmountCents).toBe(1300)
  })

  it('setea estado de pago, referencia e idempotencia', () => {
    let state = checkoutReducer(undefined, setReference('TT-123'))
    state = checkoutReducer(state, setIdempotencyKey('idem-key'))
    state = checkoutReducer(state, setPaymentStatus('APPROVED'))

    expect(state.reference).toBe('TT-123')
    expect(state.idempotencyKey).toBe('idem-key')
    expect(state.status).toBe('APPROVED')
  })

  it('resetea el checkout', () => {
    const state = checkoutReducer(
      checkoutReducer(undefined, setReference('TT-123')),
      resetCheckout(),
    )
    expect(state.reference).toBeUndefined()
    expect(state.quantity).toBe(1)
  })
})
