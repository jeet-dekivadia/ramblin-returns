"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to section functionality
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  // Handle start ramble click - shows upload modal
  const handleStartRamble = () => {
    // Trigger the upload modal in hero section by simulating a click on the upload button
    const uploadButton = document.querySelector('[data-upload-trigger="true"]');
    if (uploadButton instanceof HTMLElement) {
      uploadButton.click();
    } else {
      // Fallback - scroll to dashboard section
      scrollToSection("dashboard");
    }
  };

  const navItems = [
    { name: "Product Tour", href: "#product-tour", id: "product-tour" },
    { name: "Dashboard", href: "#dashboard", id: "dashboard" },
    { name: "URL Security", href: "#url-security", id: "url-security" },
    { name: "Technology", href: "#technology", id: "technology" },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <a href="#" onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} className="flex items-center">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-gt-gold to-gs-blue text-white font-bold text-xl w-8 h-8 rounded-md flex items-center justify-center mr-2">
                  R
                </div>
                <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gt-gold to-gs-blue">
                  Ramblin&apos; Returns
                </span>
              </div>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center space-x-6"
          >
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                className="text-sm font-medium hover:text-gt-gold transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gt-gold group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}

            <div className="relative group">
              <Button 
                onClick={handleStartRamble}
                className="bg-gradient-to-r from-gt-gold to-gs-blue hover:from-gt-gold/90 hover:to-gs-blue/90 text-white"
              >
                <span className="flex items-center">
                  Start Your Ramble
                  <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                </span>
              </Button>
              <div className="absolute right-0 mt-2 w-48 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                <div className="bg-white dark:bg-gray-900 rounded-md shadow-lg overflow-hidden">
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={(e) => {
                      e.preventDefault();
                      handleStartRamble();
                    }}
                  >
                    Upload Statement
                  </a>
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("dashboard");
                    }}
                  >
                    Connect Bank
                  </a>
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Sign up functionality would be implemented here");
                    }}
                  >
                    Create Account
                  </a>
                </div>
              </div>
            </div>

            <ModeToggle />
          </motion.nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-4">
            <ModeToggle />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700 dark:text-gray-200">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-950 shadow-lg"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className="block px-3 py-2 text-base font-medium hover:text-gt-gold transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-2">
                <Button 
                  className="w-full bg-gradient-to-r from-gt-gold to-gs-blue hover:from-gt-gold/90 hover:to-gs-blue/90 text-white"
                  onClick={handleStartRamble}
                >
                  Start Your Ramble
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

