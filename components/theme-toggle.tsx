'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { IconMoon, IconSun } from '@/components/ui/icons'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [_, startTransition] = React.useTransition()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        startTransition(() => {
          setTheme(theme === 'light' ? 'dark' : 'light')
        })
      }}
    >
      {!theme ? null : theme === 'dark' ? (
        <Moon className="transition-all text-muted-foreground size-5" />
      ) : (
        <Sun className="transition-all text-muted-foreground size-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
