import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Customer } from '../../../entities/customer/model/types'
import type { Delivery } from '../../../entities/delivery/model/types'
import type { Product } from '../../../entities/product/model/types'
import type { TransactionStatus } from '../../../entities/transaction/model/types'

export type PaymentDraft = {
  cardNumber: string
  cvc: string
  expMonth: string
  expYear: string
  cardHolder: string
  installments: number
  email: string
}

type CheckoutPreview = {
  currency: string
  productAmountCents: number
  baseFeeCents: number
  deliveryFeeCents: number
  totalAmountCents: number
}

type CheckoutState = {
  selectedProduct?: Product
  productId?: string
  quantity: number
  customer?: Customer
  delivery?: Delivery
  paymentDraft?: PaymentDraft
  preview?: CheckoutPreview
  reference?: string
  idempotencyKey?: string
  status?: TransactionStatus
}

const initialCheckoutState: CheckoutState = {
  quantity: 1,
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: initialCheckoutState,
  reducers: {
    hydrateCheckout(state, action: PayloadAction<Partial<CheckoutState>>) {
      return { ...state, ...action.payload }
    },
    selectProduct(
      state,
      action: PayloadAction<{ selectedProduct: Product; quantity: number }>,
    ) {
      state.selectedProduct = action.payload.selectedProduct
      state.productId = action.payload.selectedProduct.id
      state.quantity = action.payload.quantity
    },
    setCheckoutDraft(
      state,
      action: PayloadAction<{
        customer: Customer
        delivery: Delivery
        paymentDraft: PaymentDraft
      }>,
    ) {
      state.customer = action.payload.customer
      state.delivery = action.payload.delivery
      state.paymentDraft = action.payload.paymentDraft
    },
    setPreview(state, action: PayloadAction<CheckoutPreview>) {
      state.preview = action.payload
    },
    setReference(state, action: PayloadAction<string>) {
      state.reference = action.payload
    },
    setIdempotencyKey(state, action: PayloadAction<string>) {
      state.idempotencyKey = action.payload
    },
    setPaymentStatus(state, action: PayloadAction<TransactionStatus>) {
      state.status = action.payload
    },
    /** Clears transaction session so the next checkout creates a new transaction (new idempotency key). */
    clearTransactionSession(state) {
      state.reference = undefined
      state.idempotencyKey = undefined
      state.status = undefined
    },
    resetCheckout() {
      return initialCheckoutState
    },
  },
})

export const {
  hydrateCheckout,
  selectProduct,
  setCheckoutDraft,
  setPreview,
  setReference,
  setIdempotencyKey,
  setPaymentStatus,
  clearTransactionSession,
  resetCheckout,
} = checkoutSlice.actions
export const checkoutReducer = checkoutSlice.reducer
