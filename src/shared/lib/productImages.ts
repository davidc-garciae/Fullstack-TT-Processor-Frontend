const placeholderImages = [
  '/placeholders/product-1.svg',
  '/placeholders/product-2.svg',
  '/placeholders/product-3.svg',
]

export function getProductImage(productId: string) {
  const hash = Array.from(productId).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return placeholderImages[hash % placeholderImages.length]
}
