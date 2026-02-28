import type { PropsWithChildren } from 'react'
import { ThemeToggle } from '../atoms/ThemeToggle'
import { Card, CardContent, CardHeader } from '../ui/card'

type CheckoutLayoutProps = PropsWithChildren<{
  title: string
}>

export function CheckoutLayout({ title, children }: CheckoutLayoutProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl p-4 md:p-6">
      <div className="mb-4 flex justify-end">
        <ThemeToggle />
      </div>
      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <h1 className="text-2xl font-semibold leading-none tracking-tight">{title}</h1>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </main>
  )
}
