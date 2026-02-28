import type { ButtonProps } from '../ui/button'
import { Button as ShadcnButton } from '../ui/button'

type AppButtonProps = ButtonProps & {
  loading?: boolean
}

export function Button({ children, loading, disabled, ...props }: AppButtonProps) {
  return (
    <ShadcnButton disabled={Boolean(disabled || loading)} {...props}>
      {loading ? 'Procesando...' : children}
    </ShadcnButton>
  )
}
