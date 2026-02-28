import { apiRequest } from '../client'

export type ProductDto = {
  id: string
  name: string
  description: string
  priceCents: number
  currency: string
  stockAvailable: number
}

export function getProducts() {
  return apiRequest<ProductDto[]>('/products', { cache: 'no-store' })
}
