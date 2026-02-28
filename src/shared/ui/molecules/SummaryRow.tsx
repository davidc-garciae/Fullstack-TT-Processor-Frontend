type SummaryRowProps = {
  label: string
  value: string
  strong?: boolean
}

export function SummaryRow({ label, value, strong }: SummaryRowProps) {
  return (
    <p className="flex items-center justify-between py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {strong ? <strong>{value}</strong> : <span>{value}</span>}
    </p>
  )
}
