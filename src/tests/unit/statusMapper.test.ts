import { describe, expect, it } from 'vitest'
import { mapBackendStatusToUiStatus } from '../../shared/lib/statusMapper'

describe('mapBackendStatusToUiStatus', () => {
  it('mapea APPROVED', () => {
    expect(mapBackendStatusToUiStatus('APPROVED')).toEqual({
      label: 'Aprobada',
      tone: 'success',
    })
  })

  it('mapea estado desconocido como pendiente', () => {
    expect(mapBackendStatusToUiStatus()).toEqual({
      label: 'Pendiente',
      tone: 'warning',
    })
  })

  it('mapea DECLINED y ERROR', () => {
    expect(mapBackendStatusToUiStatus('DECLINED').tone).toBe('error')
    expect(mapBackendStatusToUiStatus('ERROR').tone).toBe('error')
  })
})
