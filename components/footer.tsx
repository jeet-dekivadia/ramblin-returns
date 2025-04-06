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
          <div className="relative w-16 h-16">
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
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8Z"
                  fill="#B3A369"
                />
                <path
                  d="M32 48C40.8366 48 48 40.8366 48 32C48 23.1634 40.8366 16 32 16C23.1634 16 16 23.1634 16 32C16 40.8366 23.1634 48 32 48Z"
                  fill="#FFCC00"
                />
                <path
                  d="M32 40C36.4183 40 40 36.4183 40 32C40 27.5817 36.4183 24 32 24C27.5817 24 24 27.5817 24 32C24 36.4183 27.5817 40 32 40Z"
                  fill="#000000"
                />
                <path d="M28 28L24 20" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
                <path d="M36 28L40 20" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

