import { useEffect, useReducer, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../../entities/product/model/types'
import {
  clearTransactionSession,
  selectProduct as selectProductAction,
  setCheckoutDraft,
} from '../../processes/checkout/model/checkout.slice'
import { selectCheckout } from '../../processes/checkout/model/checkout.selectors'
import { CheckoutStepper } from '../../processes/checkout/ui/CheckoutStepper'
import { useAppDispatch, useAppSelector } from '../../shared/hooks/redux'
import { getProducts } from '../../shared/api/services/products.service'
import { toUserMessage } from '../../shared/lib/httpError'
import { formatMoney } from '../../shared/lib/formatMoney'
import { getProductImage } from '../../shared/lib/productImages'
import { sanitizeInstallments } from '../../shared/lib/formSanitizers'
import { Alert } from '../../shared/ui/atoms/Alert'
import { Button } from '../../shared/ui/atoms/Button'
import { Input } from '../../shared/ui/atoms/Input'
import { CheckoutLayout } from '../../shared/ui/layouts/CheckoutLayout'
import { FormField } from '../../shared/ui/molecules/FormField'
import type { PaymentDeliveryPayload } from '../../shared/ui/organisms/PaymentDeliveryForm'
import { PaymentDeliveryModal } from '../../shared/ui/organisms/PaymentDeliveryModal'
import { Card, CardContent } from '../../shared/ui/ui/card'

type ProductPageState = {
  products: Product[]
  productId: string
  quantity: number
  isModalOpen: boolean
  isLoading: boolean
  error: string
  brokenImages: Record<string, boolean>
}

const initialState: ProductPageState = {
  products: [],
  productId: '',
  quantity: 1,
  isModalOpen: false,
  isLoading: true,
  error: '',
  brokenImages: {},
}

type ProductPageAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; products: Product[]; productId: string }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'SET_PRODUCT_ID'; productId: string }
  | { type: 'SET_QUANTITY'; quantity: number }
  | { type: 'SET_MODAL_OPEN'; isModalOpen: boolean }
  | { type: 'SET_BROKEN_IMAGE'; productId: string; value: boolean }

function productPageReducer(state: ProductPageState, action: ProductPageAction): ProductPageState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, isLoading: true, error: '' }
    case 'LOAD_SUCCESS':
      return { ...state, products: action.products, productId: action.productId, isLoading: false, error: '' }
    case 'LOAD_ERROR':
      return { ...state, error: action.error, isLoading: false }
    case 'SET_PRODUCT_ID':
      return { ...state, productId: action.productId }
    case 'SET_QUANTITY':
      return { ...state, quantity: action.quantity }
    case 'SET_MODAL_OPEN':
      return { ...state, isModalOpen: action.isModalOpen }
    case 'SET_BROKEN_IMAGE':
      return {
        ...state,
        brokenImages: { ...state.brokenImages, [action.productId]: action.value },
      }
    default:
      return state
  }
}

export function ProductPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const checkout = useAppSelector(selectCheckout)
  const [state, dispatchState] = useReducer(productPageReducer, {
    ...initialState,
    quantity: checkout.quantity || 1,
  })

  useEffect(() => {
    dispatch(clearTransactionSession())
  }, [dispatch])

  useEffect(() => {
    async function loadProducts() {
      dispatchState({ type: 'LOAD_START' })
      try {
        const data = await getProducts()
        const recovered = checkout.productId
          ? data.find((item) => item.id === checkout.productId)
          : undefined
        const productId = recovered?.id ?? data[0]?.id ?? ''
        dispatchState({ type: 'LOAD_SUCCESS', products: data, productId })
      } catch (err) {
        dispatchState({ type: 'LOAD_ERROR', error: toUserMessage(err) })
      }
    }

    void loadProducts()
  }, [checkout.productId])

  const selectedProduct = useMemo(
    () => state.products.find((product) => product.id === state.productId),
    [state.productId, state.products],
  )

  function onPayWithCard() {
    if (!selectedProduct) return
    dispatch(selectProductAction({ selectedProduct, quantity: state.quantity }))
    dispatchState({ type: 'SET_MODAL_OPEN', isModalOpen: true })
  }

  function onModalSubmit(payload: PaymentDeliveryPayload) {
    dispatch(setCheckoutDraft(payload))
    dispatchState({ type: 'SET_MODAL_OPEN', isModalOpen: false })
    navigate('/summary')
  }

  return (
    <CheckoutLayout title="Producto">
      <CheckoutStepper step={1} />
      {state.isLoading && <Alert role="status">Cargando productos...</Alert>}
      {state.error && <Alert>{state.error}</Alert>}
      {!state.isLoading && !state.error && (
        <>
          <div className="grid gap-3">
            {state.products.map((product) => (
              <Card
                className={`cursor-pointer border transition ${
                  state.productId === product.id ? 'border-primary ring-1 ring-primary/40' : 'border-border'
                }`}
                key={product.id}
                onClick={() => dispatchState({ type: 'SET_PRODUCT_ID', productId: product.id })}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <input
                    checked={state.productId === product.id}
                    className="mt-1"
                    name="product"
                    onChange={() => dispatchState({ type: 'SET_PRODUCT_ID', productId: product.id })}
                    type="radio"
                    value={product.id}
                  />
                  <img
                    alt={product.name}
                    className="h-20 w-20 rounded-md border border-border object-cover"
                    loading="lazy"
                    onError={() =>
                      dispatchState({ type: 'SET_BROKEN_IMAGE', productId: product.id, value: true })
                    }
                    src={
                      state.brokenImages[product.id]
                        ? '/vite.svg'
                        : product.imageUrl ?? getProductImage(product.id)
                    }
                  />
                  <div className="space-y-1">
                    <strong>{product.name}</strong>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                    <small className="text-sm" data-testid={`stock-${product.id}`}>
                      {formatMoney(product.priceCents, product.currency)} - Stock: {product.stockAvailable}
                    </small>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <FormField label="Cantidad">
            <Input
              aria-label="Cantidad"
              inputMode="numeric"
              onChange={(event) => {
                const nextValue = Number(sanitizeInstallments(event.target.value))
                dispatchState({
                  type: 'SET_QUANTITY',
                  quantity: Math.min(nextValue, selectedProduct?.stockAvailable ?? 1),
                })
              }}
              type="text"
              value={state.quantity}
            />
          </FormField>

          <Button
            disabled={!selectedProduct || state.quantity < 1}
            onClick={onPayWithCard}
            type="button"
          >
            Pay with credit card
          </Button>
        </>
      )}
      <PaymentDeliveryModal
        onClose={() => dispatchState({ type: 'SET_MODAL_OPEN', isModalOpen: false })}
        onSubmit={onModalSubmit}
        open={state.isModalOpen}
      />
    </CheckoutLayout>
  )
}
