import { useEffect } from 'react'
import type { Customer } from '../entities/customer/model/types'
import type { Delivery } from '../entities/delivery/model/types'
import { useAppDispatch } from '../shared/hooks/redux'
import { loadCheckoutDraft } from '../processes/checkout/lib/checkoutPersistence'
import { recoverCheckoutSession } from '../processes/checkout/lib/checkoutRecovery'
import { AppRouter } from './router/routes'
import { StoreProvider } from './providers/StoreProvider'
import { ThemeProvider } from './providers/ThemeProvider'

function AppContent() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const draft = loadCheckoutDraft<{
      productId?: string
      quantity?: number
      customer?: Customer
      delivery?: Delivery
      reference?: string
      idempotencyKey?: string
    }>()
    recoverCheckoutSession(dispatch, draft)
  }, [dispatch])

  return <AppRouter />
}

export function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </ThemeProvider>
  )
}
