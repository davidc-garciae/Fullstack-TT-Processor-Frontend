import type { TransactionStatus } from '../../entities/transaction/model/types'

export function mapBackendStatusToUiStatus(status?: TransactionStatus) {
  switch (status) {
    case 'APPROVED':
      return { label: 'Aprobada', tone: 'success' as const }
    case 'DECLINED':
      return { label: 'Rechazada', tone: 'error' as const }
    case 'ERROR':
      return { label: 'Con error', tone: 'error' as const }
    case 'PENDING':
    default:
      return { label: 'Pendiente', tone: 'warning' as const }
  }
}
