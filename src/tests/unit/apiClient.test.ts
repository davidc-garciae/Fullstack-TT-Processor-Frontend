import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiRequest } from '../../shared/api/client'

describe('apiRequest', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('retorna json cuando la respuesta es exitosa', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const data = await apiRequest<{ ok: boolean }>('/health')
    expect(data.ok).toBe(true)
  })

  it('lanza ApiError con status cuando hay error', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () =>
      new Response(JSON.stringify({ message: 'invalid' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const error = await apiRequest('/broken').catch((err) => err)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 400 })
  })
})
