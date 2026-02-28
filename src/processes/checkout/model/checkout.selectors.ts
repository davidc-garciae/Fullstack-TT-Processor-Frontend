import type { RootState } from '../../../app/store/rootReducer'

export const selectCheckout = (state: RootState) => state.checkout
export const selectSelectedProduct = (state: RootState) => state.checkout.selectedProduct
export const selectCheckoutReference = (state: RootState) => state.checkout.reference
export const selectCheckoutStatus = (state: RootState) => state.checkout.status
