import type { Customer } from '../../../entities/customer/model/types'
import type { Delivery } from '../../../entities/delivery/model/types'
import type { TransactionStatus } from '../../../entities/transaction/model/types'
import { apiRequest } from '../client'

type CreateTransactionRequest = {
  productId: string
  quantity: number
  idempotencyKey: string
  customer: Customer
  delivery: Delivery
}

type CreateTransactionResponse = {
  reference: string
  status: TransactionStatus
}

type PayTransactionRequest = {
  cardNumber: string
  cvc: string
  expMonth: string
  expYear: string
  cardHolder: string
  installments: number
  email: string
}

type PayTransactionResponse = {
  reference: string
  status: TransactionStatus
  processorStatus?: string | null
}

type TransactionStatusResponse = {
  reference: string
  status: TransactionStatus
  processorStatus?: string | null
  totalAmountCents: number
  createdAt: string
  updatedAt: string
}

export function createTransaction(payload: CreateTransactionRequest) {
  return apiRequest<CreateTransactionResponse>('/transactions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function payTransaction(reference: string, payload: PayTransactionRequest) {
  return apiRequest<PayTransactionResponse>(`/transactions/${reference}/pay`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getTransactionStatus(reference: string) {
  return apiRequest<TransactionStatusResponse>(`/transactions/${reference}`)
}
