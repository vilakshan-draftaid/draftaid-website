"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* Icon follows the .dark class via CSS, so it stays correct through
          hydration without needing a mounted guard. */}
      <Sun className="hidden dark:block" />
      <Moon className="block dark:hidden" />
    </Button>
  )
}

export { ThemeToggle }
