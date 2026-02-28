import { useEffect, useMemo, useState } from 'react'
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

export function ProductPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const checkout = useAppSelector(selectCheckout)
  const [products, setProducts] = useState<Product[]>([])
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState(checkout.quantity || 1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({})

  useEffect(() => {
    dispatch(clearTransactionSession())
  }, [dispatch])

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true)
      setError('')
      try {
        const data = await getProducts()
        setProducts(data)
        const recovered = checkout.productId && data.find((item) => item.id === checkout.productId)
        if (recovered) {
          setProductId(recovered.id)
        } else if (data[0]) {
          setProductId(data[0].id)
        }
      } catch (err) {
        setError(toUserMessage(err))
      } finally {
        setIsLoading(false)
      }
    }

    void loadProducts()
  }, [checkout.productId])

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId),
    [productId, products],
  )

  function onPayWithCard() {
    if (!selectedProduct) return
    dispatch(selectProductAction({ selectedProduct, quantity }))
    setIsModalOpen(true)
  }

  function onModalSubmit(payload: PaymentDeliveryPayload) {
    dispatch(setCheckoutDraft(payload))
    setIsModalOpen(false)
    navigate('/summary')
  }

  return (
    <CheckoutLayout title="Producto">
      <CheckoutStepper step={1} />
      {isLoading && <Alert role="status">Cargando productos...</Alert>}
      {error && <Alert>{error}</Alert>}
      {!isLoading && !error && (
        <>
          <div className="grid gap-3">
            {products.map((product) => (
              <Card
                className={`cursor-pointer border transition ${
                  productId === product.id ? 'border-primary ring-1 ring-primary/40' : 'border-border'
                }`}
                key={product.id}
                onClick={() => setProductId(product.id)}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <input
                    checked={productId === product.id}
                    className="mt-1"
                    name="product"
                    onChange={() => setProductId(product.id)}
                    type="radio"
                    value={product.id}
                  />
                  <img
                    alt={product.name}
                    className="h-20 w-20 rounded-md border border-border object-cover"
                    loading="lazy"
                    onError={() => setBrokenImages((current) => ({ ...current, [product.id]: true }))}
                    src={brokenImages[product.id] ? '/vite.svg' : product.imageUrl ?? getProductImage(product.id)}
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
                setQuantity(Math.min(nextValue, selectedProduct?.stockAvailable ?? 1))
              }}
              type="text"
              value={quantity}
            />
          </FormField>

          <Button disabled={!selectedProduct || quantity < 1} onClick={onPayWithCard} type="button">
            Pay with credit card
          </Button>
        </>
      )}
      <PaymentDeliveryModal
        onClose={() => setIsModalOpen(false)}
        onSubmit={onModalSubmit}
        open={isModalOpen}
      />
    </CheckoutLayout>
  )
}
