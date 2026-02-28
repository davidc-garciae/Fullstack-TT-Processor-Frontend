import { onlyDigits, sanitizeCardNumber, sanitizeCvc, sanitizeMonth, sanitizeYear } from './sanitizeCardInput'

export function sanitizeText(value: string) {
  return value.replaceAll(/\s+/g, ' ').trimStart()
}

export function sanitizeLetters(value: string) {
  return value
    .replaceAll(/[^a-zA-Z\u00C0-\u017F\s'-]/g, '')
    .replaceAll(/\s+/g, ' ')
    .trimStart()
}

export function sanitizeAlphanumeric(value: string) {
  return value.replaceAll(/[^a-zA-Z0-9-]/g, '').trim()
}

export function sanitizeAddress(value: string) {
  return value
    .replaceAll(/[^a-zA-Z0-9\u00C0-\u017F\s#.,-]/g, '')
    .replaceAll(/\s+/g, ' ')
    .trimStart()
}

export function sanitizeCountry(value: string) {
  return value.replaceAll(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2)
}

export function sanitizeDocumentType(value: string) {
  return value.replaceAll(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4)
}

export function sanitizePhone(value: string) {
  const normalized = value.startsWith('+') ? `+${onlyDigits(value.slice(1))}` : onlyDigits(value)
  return normalized.slice(0, 15)
}

export function sanitizePostalCode(value: string) {
  return value.replaceAll(/[^a-zA-Z0-9 -]/g, '').toUpperCase().slice(0, 10)
}

export function sanitizeCardHolder(value: string) {
  return sanitizeLetters(value).toUpperCase().slice(0, 80)
}

export function sanitizeInstallments(value: string) {
  const digits = onlyDigits(value)
  if (!digits) return '1'
  const amount = Number(digits)
  if (Number.isNaN(amount) || amount < 1) return '1'
  return String(Math.min(amount, 36))
}

export function sanitizeByField(name: string, value: string) {
  switch (name) {
    case 'fullName':
      return sanitizeLetters(value)
    case 'email':
      return sanitizeText(value).trim().toLowerCase()
    case 'phone':
      return sanitizePhone(value)
    case 'documentType':
      return sanitizeDocumentType(value)
    case 'documentNumber':
      return sanitizeAlphanumeric(value).slice(0, 20)
    case 'addressLine1':
    case 'addressLine2':
    case 'instructions':
      return sanitizeAddress(value).slice(0, 120)
    case 'city':
    case 'region':
      return sanitizeLetters(value).slice(0, 80)
    case 'country':
      return sanitizeCountry(value)
    case 'postalCode':
      return sanitizePostalCode(value)
    case 'cardNumber':
      return sanitizeCardNumber(value)
    case 'cvc':
      return sanitizeCvc(value)
    case 'expMonth':
      return sanitizeMonth(value)
    case 'expYear':
      return sanitizeYear(value)
    case 'cardHolder':
      return sanitizeCardHolder(value)
    case 'installments':
      return sanitizeInstallments(value)
    default:
      return value
  }
}
