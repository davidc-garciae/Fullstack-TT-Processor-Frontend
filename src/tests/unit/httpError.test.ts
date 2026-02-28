import { describe, expect, it } from 'vitest'
import { ApiError } from '../../shared/api/client'
import { toUserMessage } from '../../shared/lib/httpError'

describe('toUserMessage', () => {
  it('mapea 400, 429 y 500+', () => {
    expect(toUserMessage(new ApiError('bad-request', 400))).toContain('Solicitud invalida')
    expect(toUserMessage(new ApiError('rate-limit', 429))).toContain('Demasiadas solicitudes')
    expect(toUserMessage(new ApiError('server', 500))).toContain('Error interno')
  })

  it('mapea 404', () => {
    expect(toUserMessage(new ApiError('not-found', 404))).toContain('No encontramos')
  })

  it('retorna fallback para error desconocido', () => {
    expect(toUserMessage(new Error('x'))).toContain('Ocurrio un error')
  })
})
