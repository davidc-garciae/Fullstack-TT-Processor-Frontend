import { describe, expect, it } from 'vitest'
import { getCardBrand } from '../../shared/lib/cardBrand'

describe('getCardBrand', () => {
  it('detecta VISA', () => {
    expect(getCardBrand('4242424242424242')).toBe('VISA')
  })

  it('detecta MASTERCARD', () => {
    expect(getCardBrand('5555555555554444')).toBe('MASTERCARD')
  })

  it('retorna UNKNOWN para tarjetas no soportadas', () => {
    expect(getCardBrand('123')).toBe('UNKNOWN')
  })
})
