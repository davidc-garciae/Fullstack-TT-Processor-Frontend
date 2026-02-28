import { describe, expect, it } from 'vitest'
import {
  sanitizeByField,
  sanitizeCountry,
  sanitizeDocumentType,
  sanitizePhone,
} from '../../shared/lib/formSanitizers'
import { paymentDeliverySchema } from '../../shared/lib/paymentDeliverySchema'

describe('payment form validation', () => {
  it('sanitiza campos sensibles', () => {
    expect(sanitizePhone('+57 300-111-22-33')).toBe('+573001112233')
    expect(sanitizeDocumentType('cc-12')).toBe('CC')
    expect(sanitizeCountry('co1')).toBe('CO')
    expect(sanitizeByField('cardNumber', '4242-4242 4242x4242')).toBe('4242424242424242')
  })

  it('rechaza payload invalido', () => {
    const invalid = paymentDeliverySchema.safeParse({
      fullName: 'A',
      email: 'correo-invalido',
      phone: '12',
      documentType: '123',
      documentNumber: '1',
      addressLine1: 'abc',
      addressLine2: '',
      city: '',
      region: '',
      country: 'COL',
      postalCode: '!',
      instructions: '',
      cardNumber: '123',
      cvc: '1',
      expMonth: '13',
      expYear: '',
      cardHolder: 'A',
      installments: 0,
    })
    expect(invalid.success).toBe(false)
  })

  it('acepta payload valido', () => {
    const valid = paymentDeliverySchema.safeParse({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '3001112233',
      documentType: 'CC',
      documentNumber: '12345678',
      addressLine1: 'Street 1 #2-3',
      addressLine2: 'Apto 401',
      city: 'Medellin',
      region: 'Antioquia',
      country: 'CO',
      postalCode: '050001',
      instructions: 'Porteria',
      cardNumber: '4242424242424242',
      cvc: '123',
      expMonth: '12',
      expYear: '28',
      cardHolder: 'JANE DOE',
      installments: 1,
    })
    expect(valid.success).toBe(true)
  })
})
