import { z } from 'zod'

const messages = {
  required: 'Este campo es obligatorio.',
  email: 'Ingresa un correo valido.',
  phone: 'Telefono invalido. Usa entre 7 y 15 digitos.',
  documentType: 'Tipo de documento invalido.',
  documentNumber: 'Numero de documento invalido.',
  country: 'Usa codigo de pais de 2 letras (ej: CO).',
  postalCode: 'Codigo postal invalido.',
  cardNumber: 'Numero de tarjeta invalido.',
  cvc: 'CVC invalido.',
  expMonth: 'Mes invalido. Usa MM.',
  expYear: 'Anio invalido.',
  cardHolder: 'Titular invalido.',
}

export const paymentDeliverySchema = z.object({
  fullName: z.string().trim().min(3, 'Nombre muy corto.').max(80, 'Nombre demasiado largo.'),
  email: z.email(messages.email),
  phone: z.string().regex(/^\+?\d{7,15}$/, messages.phone),
  documentType: z.string().regex(/^[A-Z]{1,4}$/, messages.documentType),
  documentNumber: z.string().regex(/^[A-Za-z0-9-]{5,20}$/, messages.documentNumber),
  addressLine1: z.string().trim().min(6, 'Direccion demasiado corta.').max(120, 'Direccion demasiado larga.'),
  addressLine2: z.string().trim().max(120, 'Direccion adicional demasiado larga.').optional().or(z.literal('')),
  city: z.string().trim().min(2, messages.required).max(80, 'Ciudad demasiado larga.'),
  region: z.string().trim().min(2, messages.required).max(80, 'Region demasiado larga.'),
  country: z.string().regex(/^[A-Z]{2}$/, messages.country),
  postalCode: z.string().regex(/^[A-Z0-9 -]{3,10}$/, messages.postalCode),
  instructions: z.string().trim().max(120, 'Instrucciones demasiado largas.').optional().or(z.literal('')),
  cardNumber: z.string().regex(/^\d{13,19}$/, messages.cardNumber),
  cvc: z.string().regex(/^\d{3,4}$/, messages.cvc),
  expMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, messages.expMonth),
  expYear: z.string().regex(/^\d{2,4}$/, messages.expYear),
  cardHolder: z.string().trim().min(3, messages.cardHolder).max(80, 'Titular demasiado largo.'),
  installments: z.number().int().min(1, 'Debes elegir al menos 1 cuota.').max(36, 'Maximo 36 cuotas.'),
})

export type PaymentDeliveryFormValues = z.infer<typeof paymentDeliverySchema>
