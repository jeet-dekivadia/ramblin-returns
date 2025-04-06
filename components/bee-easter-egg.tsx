"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

export function BeeEasterEgg() {
  const [showBee, setShowBee] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [beeMessage, setBeeMessage] = useState("")

  // Messages the bee can display
  const messages = [
    "Buzz! Great job saving!",
    "You're on your way to financial freedom!",
    "Keep investing, Rambler!",
    "Your portfolio is looking sweet!",
    "Hey Rambler! Looking good!",
  ]

  // Track scroll position to trigger the bee
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const pageHeight = document.body.scrollHeight - window.innerHeight
      const scrollPercentage = (scrollPosition / pageHeight) * 100

      // Show bee at certain scroll milestones
      if (scrollPercentage > 25 && scrollPercentage < 30) {
        triggerBee()
      } else if (scrollPercentage > 75 && scrollPercentage < 80) {
        triggerBee()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const triggerBee = () => {
    // Only trigger if not already showing
    if (showBee) return

    // Random position on the right side of the screen
    const x = window.innerWidth - 150
    const y = 100 + Math.random() * (window.innerHeight - 200)

    setPosition({ x, y })
    setBeeMessage(messages[Math.floor(Math.random() * messages.length)])
    setShowBee(true)

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 1, y: y / window.innerHeight },
    })

    // Hide after 4 seconds
    setTimeout(() => {
      setShowBee(false)
    }, 4000)
  }

  return (
    <AnimatePresence>
      {showBee && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed z-50 flex items-center"
          style={{ top: position.y, right: 20 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg mr-4 max-w-xs"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm font-medium">{beeMessage}</p>
          </motion.div>

          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
            className="w-16 h-16"
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Georgia-Tech-Yellow-Jackets-logo-500x281-1%20%281%29-JQlXXRXH6mI5meLbd6CdZ6s7ZGyeTs.png"
              alt="Georgia Tech Yellow Jackets logo"
              className="w-16 h-16"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

