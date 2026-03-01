import { useEffect, useReducer } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setPaymentStatus } from '../../processes/checkout/model/checkout.slice'
import { selectCheckout } from '../../processes/checkout/model/checkout.selectors'
import { CheckoutStepper } from '../../processes/checkout/ui/CheckoutStepper'
import { getTransactionStatus } from '../../shared/api/services/transactions.service'
import { useAppDispatch, useAppSelector } from '../../shared/hooks/redux'
import { formatMoney } from '../../shared/lib/formatMoney'
import { toUserMessage } from '../../shared/lib/httpError'
import { mapBackendStatusToUiStatus } from '../../shared/lib/statusMapper'
import { Alert } from '../../shared/ui/atoms/Alert'
import { Badge } from '../../shared/ui/ui/badge'
import { CheckoutLayout } from '../../shared/ui/layouts/CheckoutLayout'

type StatusPageState = {
  totalAmountCents: number | null
  error: string
}

const initialState: StatusPageState = {
  totalAmountCents: null,
  error: '',
}

type StatusPageAction =
  | { type: 'LOAD_SUCCESS'; totalAmountCents: number }
  | { type: 'LOAD_ERROR'; error: string }

function statusPageReducer(state: StatusPageState, action: StatusPageAction): StatusPageState {
  switch (action.type) {
    case 'LOAD_SUCCESS':
      return { ...state, totalAmountCents: action.totalAmountCents }
    case 'LOAD_ERROR':
      return { ...state, error: action.error }
    default:
      return state
  }
}

export function StatusPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const checkout = useAppSelector(selectCheckout)
  const [state, dispatchState] = useReducer(statusPageReducer, initialState)

  useEffect(() => {
    if (!checkout.reference) {
      navigate('/product')
      return
    }

    async function loadStatus() {
      try {
        const response = await getTransactionStatus(checkout.reference!)
        dispatchState({ type: 'LOAD_SUCCESS', totalAmountCents: response.totalAmountCents })
        dispatch(setPaymentStatus(response.status))
      } catch (err) {
        dispatchState({ type: 'LOAD_ERROR', error: toUserMessage(err) })
      }
    }

    void loadStatus()
  }, [checkout.reference, dispatch, navigate])

  const mappedStatus = mapBackendStatusToUiStatus(checkout.status)
  const statusVariant = mappedStatus.tone === 'success' ? 'default' : 'secondary'

  return (
    <CheckoutLayout title="Estado final">
      <CheckoutStepper step={4} />
      <div className="flex items-center gap-2" data-tone={mappedStatus.tone}>
        Estado:
        <Badge variant={statusVariant}>{mappedStatus.label}</Badge>
      </div>
      {state.totalAmountCents !== null && (
        <p className="text-sm text-muted-foreground">
          Total procesado: {formatMoney(state.totalAmountCents)}
        </p>
      )}
      {state.error && <Alert>{state.error}</Alert>}
      <Link className="text-sm font-medium underline underline-offset-4" to="/product">
        Volver al producto
      </Link>
    </CheckoutLayout>
  )
}
