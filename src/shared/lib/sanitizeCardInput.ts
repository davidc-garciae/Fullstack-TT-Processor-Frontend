export function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

export function sanitizeCardNumber(value: string) {
  return onlyDigits(value).slice(0, 19)
}

export function sanitizeCvc(value: string) {
  return onlyDigits(value).slice(0, 4)
}

export function sanitizeMonth(value: string) {
  return onlyDigits(value).slice(0, 2)
}

export function sanitizeYear(value: string) {
  return onlyDigits(value).slice(0, 4)
}
