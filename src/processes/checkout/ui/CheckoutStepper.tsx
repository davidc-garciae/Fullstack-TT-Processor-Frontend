import { Badge } from '../../../shared/ui/ui/badge'

type CheckoutStepperProps = {
  step: number
}

const steps = ['Producto', 'Datos', 'Resumen', 'Estado']

export function CheckoutStepper({ step }: CheckoutStepperProps) {
  return (
    <ol aria-label="Progreso del checkout" className="grid grid-cols-4 gap-2">
      {steps.map((label, index) => {
        const current = index + 1 === step
        return (
          <li
            className="flex flex-col items-center gap-1 text-center text-xs text-muted-foreground"
            data-current={current}
            key={label}
          >
            <Badge variant={current ? 'default' : 'secondary'}>{index + 1}</Badge>
            <small className={current ? 'font-semibold text-foreground' : ''}>{label}</small>
          </li>
        )
      })}
    </ol>
  )
}
