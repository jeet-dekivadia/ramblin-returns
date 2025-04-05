"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Twitter, Linkedin, Mail, ExternalLink } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gt-gold">R</span>
              <span className="text-xl font-semibold ml-1">Ramblin&apos; Returns</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">Built for the Modern Rambler.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gt-gold transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gt-gold transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gt-gold transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gt-gold transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gt-gold transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gt-gold transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gt-gold transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gt-gold transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gt-gold transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gt-gold transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gt-gold transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gt-gold transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <div className="flex space-x-2">
              <Input type="email" placeholder="Enter your email" className="bg-gray-100 dark:bg-gray-800 border-0" />
              <Button className="bg-gt-gold hover:bg-gt-gold/90 text-white">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              © {currentYear} Ramblin&apos; Returns. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gt-gold transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gt-gold transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gt-gold transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>

          {/* Sponsors Section */}
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Proudly sponsored by</p>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              <a
                href="https://www.gatech.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
              >
                <div className="bg-gt-gold text-white font-bold px-3 py-2 rounded">GT</div>
                <span className="text-gt-navy dark:text-gt-gold font-semibold">Georgia Tech</span>
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              <a
                href="https://www.goldmansachs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
              >
                <div className="bg-gs-blue text-white font-bold px-2 py-2 rounded">GS</div>
                <span className="text-gs-blue font-semibold">Goldman Sachs</span>
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              <a
                href="https://devpost.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
              >
                <div className="bg-gray-800 dark:bg-gray-700 text-white font-bold px-2 py-2 rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.002 1.61L0 12.004L6.002 22.39h11.996L24 12.004L17.998 1.61H6.002zm1.593 16.526h-1.58V5.864h1.58v12.272zm.794-10.311h4.872c2.48 0 4.012 1.546 4.012 4.131 0 2.585-1.533 4.131-4.012 4.131H8.389V7.825zm4.614 6.458c1.715 0 2.584-.869 2.584-2.327 0-1.457-.869-2.327-2.584-2.327h-2.937v4.654h2.937z" />
                  </svg>
                </div>
                <span className="text-gray-800 dark:text-gray-300 font-semibold">Devpost</span>
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
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

