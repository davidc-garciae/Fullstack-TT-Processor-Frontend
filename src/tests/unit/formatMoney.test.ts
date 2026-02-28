import { describe, expect, it } from 'vitest'
import { formatMoney } from '../../shared/lib/formatMoney'

describe('formatMoney', () => {
  it('formatea montos en COP', () => {
    expect(formatMoney(10000)).toContain('$')
  })
})
