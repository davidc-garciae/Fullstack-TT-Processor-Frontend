type CardBrand = 'VISA' | 'MASTERCARD' | 'UNKNOWN'

export function getCardBrand(cardNumber: string): CardBrand {
  const digits = cardNumber.replace(/\D/g, '')
  if (/^4\d{12}(\d{3})?(\d{3})?$/.test(digits)) return 'VISA'
  if (/^(5[1-5]\d{14}|2(2[2-9]|[3-6]\d|7[01])\d{12})$/.test(digits)) {
    return 'MASTERCARD'
  }
  return 'UNKNOWN'
}
