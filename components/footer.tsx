"use client"

import { motion } from "framer-motion"
import { Linkedin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-gt-gold">R</span>
            <span className="text-xl font-semibold ml-1">Ramblin&apos; Returns</span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mb-6">
            Ramblin&apos; Returns was a hackathon project built by Jeet Dekivadia during Ramblin&apos; Hacks 2025.
            Microsoft Excel integration: Your portfolio updates itself.
          </p>

          <div className="flex items-center mb-8">
            <a
              href="https://www.linkedin.com/in/jeetdekivadia/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gt-gold hover:underline"
            >
              <Linkedin className="h-5 w-5 mr-2" />
              <span>linkedin.com/in/jeetdekivadia</span>
            </a>
          </div>

          <div className="text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} Ramblin&apos; Returns. All rights reserved.
          </div>
        </div>

        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 1,
          }}
        >
          <div className="relative w-24 h-24">
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            >
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Georgia-Tech-Yellow-Jackets-logo-500x281-1%20%281%29-JQlXXRXH6mI5meLbd6CdZ6s7ZGyeTs.png"
                alt="Georgia Tech Yellow Jackets logo"
                className="w-24 h-24"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

