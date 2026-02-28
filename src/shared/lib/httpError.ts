import { ApiError } from '../api/client'

export function toUserMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 400) return 'Solicitud invalida. Verifica los datos e intenta de nuevo.'
    if (error.status === 404) return 'No encontramos el recurso solicitado o no hay stock disponible.'
    if (error.status === 429) return 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.'
    if (error.status >= 500) return 'Error interno del servidor. Intenta en unos minutos.'
    return error.message
  }

  return 'Ocurrio un error inesperado. Intenta de nuevo.'
}
