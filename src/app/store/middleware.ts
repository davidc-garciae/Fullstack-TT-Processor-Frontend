import type { Middleware } from '@reduxjs/toolkit'
import { saveCheckoutDraft } from '../../processes/checkout/lib/checkoutPersistence'
import type { RootState } from './rootReducer'

export const checkoutPersistenceMiddleware: Middleware<object, RootState> =
  (storeApi) => (next) => (action) => {
    const result = next(action)
    const state = storeApi.getState().checkout

    // Card data is intentionally excluded from persistence.
    saveCheckoutDraft({
      productId: state.productId,
      quantity: state.quantity,
      customer: state.customer,
      delivery: state.delivery,
      reference: state.reference,
      idempotencyKey: state.idempotencyKey,
    })

    return result
  }
