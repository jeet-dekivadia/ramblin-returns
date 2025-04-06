"use client"
import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Set default theme to light on initial load
  useEffect(() => {
    setTheme("light")
    setMounted(true)
  }, [setTheme])

  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
      <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} className="data-[state=checked]:bg-gt-navy" />
      <Moon className="h-[1.2rem] w-[1.2rem] text-gt-navy dark:text-gray-300" />
    </div>
  )
}

