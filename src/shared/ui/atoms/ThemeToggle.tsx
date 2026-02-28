import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from './Button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Button
      aria-label="Cambiar tema"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      size="icon"
      type="button"
      variant="outline"
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  )
}
