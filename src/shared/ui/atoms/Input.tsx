import type { InputHTMLAttributes } from 'react'
import { Input as ShadcnInput } from '../ui/input'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <ShadcnInput {...props} />
}
