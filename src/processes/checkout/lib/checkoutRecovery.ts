import type { AppDispatch } from '../../../app/store'
import type { Customer } from '../../../entities/customer/model/types'
import type { Delivery } from '../../../entities/delivery/model/types'
import { hydrateCheckout, setIdempotencyKey, setReference } from '../model/checkout.slice'

type PersistedCheckout = {
  productId?: string
  quantity?: number
  customer?: Customer
  delivery?: Delivery
  reference?: string
  idempotencyKey?: string
}

export function recoverCheckoutSession(dispatch: AppDispatch, draft: PersistedCheckout | null) {
  if (!draft) return

  dispatch(
    hydrateCheckout({
      productId: draft.productId,
      quantity: draft.quantity,
      customer: draft.customer,
      delivery: draft.delivery,
    }),
  )

  if (draft.reference) {
    dispatch(setReference(draft.reference))
  }

  if (draft.idempotencyKey) {
    dispatch(setIdempotencyKey(draft.idempotencyKey))
  }
}
