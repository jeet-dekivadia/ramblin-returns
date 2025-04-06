"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"

export function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    // Set default theme to light on initial load
    if (!theme || theme === "system") {
      setTheme("light")
    }
  }, [setTheme, theme])

  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  const isDark = resolvedTheme === "dark"

  return (
    <div className="flex items-center space-x-2">
      <Sun className={`h-[1.2rem] w-[1.2rem] ${isDark ? "text-gray-400" : "text-yellow-500"}`} />
      <Switch checked={isDark} onCheckedChange={toggleTheme} className="data-[state=checked]:bg-gt-navy" />
      <Moon className={`h-[1.2rem] w-[1.2rem] ${isDark ? "text-white" : "text-gray-400"}`} />
    </div>
  )
}

