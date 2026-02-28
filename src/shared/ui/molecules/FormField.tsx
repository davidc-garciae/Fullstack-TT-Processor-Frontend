import type { PropsWithChildren } from 'react'

type FormFieldProps = PropsWithChildren<{
  label: string
  error?: string
}>

export function FormField({ label, children, error }: FormFieldProps) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </label>
  )
}
