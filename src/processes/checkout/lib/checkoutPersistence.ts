const CHECKOUT_STORAGE_KEY = 'tt.checkout'

type PersistedCheckout = {
  productId?: string
  quantity?: number
  customer?: unknown
  delivery?: unknown
  reference?: string
  idempotencyKey?: string
}

export function saveCheckoutDraft(value: PersistedCheckout) {
  localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(value))
}

export function loadCheckoutDraft<T>() {
  const data = localStorage.getItem(CHECKOUT_STORAGE_KEY)
  if (!data) return null
  return JSON.parse(data) as T
}
