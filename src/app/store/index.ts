import { configureStore } from '@reduxjs/toolkit'
import { checkoutPersistenceMiddleware } from './middleware'
import { rootReducer } from './rootReducer'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(checkoutPersistenceMiddleware),
})

export type AppDispatch = typeof store.dispatch
