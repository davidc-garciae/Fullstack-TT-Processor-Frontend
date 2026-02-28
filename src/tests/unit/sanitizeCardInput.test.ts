import { describe, expect, it } from 'vitest'
import {
  onlyDigits,
  sanitizeCardNumber,
  sanitizeCvc,
  sanitizeMonth,
  sanitizeYear,
} from '../../shared/lib/sanitizeCardInput'

describe('sanitizeCardInput', () => {
  it('filtra solo digitos', () => {
    expect(onlyDigits('12a3-4')).toBe('1234')
  })

  it('recorta numero de tarjeta a 19 digitos', () => {
    expect(sanitizeCardNumber('123456789012345678901')).toHaveLength(19)
  })

  it('recorta cvc a 4 digitos', () => {
    expect(sanitizeCvc('12345')).toBe('1234')
  })

  it('recorta mes y anio', () => {
    expect(sanitizeMonth('123')).toBe('12')
    expect(sanitizeYear('20255')).toBe('2025')
  })
})
