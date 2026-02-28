import { combineReducers } from '@reduxjs/toolkit'
import { checkoutReducer } from '../../processes/checkout/model/checkout.slice'

export const rootReducer = combineReducers({
  checkout: checkoutReducer,
})

export type RootState = ReturnType<typeof rootReducer>
