import type { PropsWithChildren } from 'react'
import { Alert as ShadcnAlert, AlertDescription } from '../ui/alert'

type AlertProps = PropsWithChildren<{
  role?: 'alert' | 'status'
}>

export function Alert({ children, role = 'alert' }: AlertProps) {
  return (
    <ShadcnAlert role={role}>
      <AlertDescription>{children}</AlertDescription>
    </ShadcnAlert>
  )
}
