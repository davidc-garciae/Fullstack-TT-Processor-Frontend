export type TransactionStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR'

export type Transaction = {
  reference: string
  status: TransactionStatus
  processorStatus?: string | null
}
