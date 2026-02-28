import { PaymentDeliveryForm, type PaymentDeliveryPayload } from './PaymentDeliveryForm'
import { Button } from '../atoms/Button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'

type PaymentDeliveryModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (payload: PaymentDeliveryPayload) => void
}

export function PaymentDeliveryModal({ open, onClose, onSubmit }: PaymentDeliveryModalProps) {
  return (
    <Dialog onOpenChange={(nextOpen) => (!nextOpen ? onClose() : undefined)} open={open}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-auto" hideClose>
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle>Pay with credit card</DialogTitle>
            <Button onClick={onClose} type="button" variant="outline">
              Cerrar
            </Button>
          </div>
          <DialogDescription className="sr-only">
            Formulario para datos de tarjeta y entrega para continuar al resumen.
          </DialogDescription>
        </DialogHeader>
        <PaymentDeliveryForm onSubmit={onSubmit} submitLabel="Ir al resumen" />
      </DialogContent>
    </Dialog>
  )
}
