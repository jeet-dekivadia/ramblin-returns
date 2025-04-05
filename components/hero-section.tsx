"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, CreditCard, Shield, TrendingUp, ChevronDown } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [showModal, setShowModal] = useState(false)

  // Register ScrollTrigger plugin
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger)
    }
  }, [])

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the background gradient
      gsap.to(".hero-gradient", {
        backgroundPosition: "200% 50%",
        duration: 20,
        repeat: -1,
        ease: "linear",
      })

      // Animate the floating elements
      gsap.to(".floating-icon", {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.2,
      })

      // Animate the text reveal
      const textElements = textRef.current?.querySelectorAll(".reveal-text")
      if (textElements) {
        gsap.fromTo(
          textElements,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
          },
        )
      }

      // Create a scroll-triggered animation for the cards
      const cards = document.querySelectorAll(".feature-card")
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: card,
              start: "top bottom-=100",
              toggleActions: "play none none none",
            },
            delay: index * 0.1,
          },
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <motion.div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="hero-gradient absolute inset-0 bg-gradient-to-br from-white via-gt-gold/10 to-gs-blue/10 dark:from-gray-950 dark:via-gt-gold/20 dark:to-gs-blue/20 bg-[length:200%_200%]"></div>

        {/* Animated shapes */}
        <div className="absolute inset-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-morph bg-gradient-to-r from-gt-gold/10 to-gs-blue/10 dark:from-gt-gold/5 dark:to-gs-blue/5"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div ref={textRef} className="max-w-4xl mx-auto text-center">
          <motion.div style={{ opacity, y }} className="flex flex-col items-center">
            {/* Branded Badge */}
            <div className="reveal-text mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gt-gold/20 to-gs-blue/20 px-4 py-2 backdrop-blur-sm">
              <span className="text-sm font-medium text-gt-gold dark:text-gt-gold">Powered by</span>
              <div className="h-5 w-px bg-gray-300 dark:bg-gray-700"></div>
              <span className="text-sm font-medium text-gs-blue dark:text-gs-blue">Goldman Sachs</span>
            </div>

            {/* Main Headline */}
            <h1 className="reveal-text text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gt-gold via-gt-navy to-gs-blue dark:from-gt-gold dark:via-white dark:to-gs-blue animate-gradient-shift">
              Turn Spending Into Investing
            </h1>

            {/* Animated Subtitle */}
            <p className="reveal-text text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8">
              Upload your bank statement and let our AI transform your financial future
            </p>

            {/* Floating Icons */}
            <div className="reveal-text relative h-32 w-full max-w-md mb-10 flex items-center justify-center">
              <div className="floating-icon absolute left-10 top-0 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg">
                <CreditCard className="text-gt-gold h-10 w-10" />
              </div>
              <div className="floating-icon absolute left-1/2 -translate-x-1/2 top-4 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg">
                <ArrowRight className="text-gs-blue h-10 w-10" />
              </div>
              <div className="floating-icon absolute right-10 top-0 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg">
                <TrendingUp className="text-green-500 h-10 w-10" />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="reveal-text flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                onClick={() => setShowModal(true)}
                className="group relative overflow-hidden bg-gradient-to-r from-gt-gold to-gs-blue hover:from-gt-gold/90 hover:to-gs-blue/90 text-white px-8 py-6 text-lg"
              >
                <span className="relative z-10 flex items-center">
                  <Upload className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1" />
                  Upload Statement
                </span>
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </Button>

              <Button
                variant="outline"
                className="border-2 border-gt-gold text-gt-gold hover:bg-gt-gold/10 px-8 py-6 text-lg"
              >
                <Shield className="mr-2 h-5 w-5" />
                Check URL Safety
              </Button>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
              className="reveal-text cursor-pointer"
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              <ChevronDown className="h-8 w-8 text-gray-400 dark:text-gray-600" />
            </motion.div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div id="features" className="grid md:grid-cols-3 gap-6 mt-24">
          <div className="feature-card bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-gt-gold to-gt-gold/70 text-white p-3 rounded-lg inline-block mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Investments</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Automatically invest in stocks of companies you shop with
            </p>
          </div>

          <div className="feature-card bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-gs-blue to-gs-blue/70 text-white p-3 rounded-lg inline-block mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Fraud Protection</h3>
            <p className="text-gray-600 dark:text-gray-400">Verify URLs and protect yourself from phishing attempts</p>
          </div>

          <div className="feature-card bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-gt-navy to-gt-navy/70 text-white p-3 rounded-lg inline-block mb-4">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Spending Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400">Get detailed insights into your spending patterns</p>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4">Upload Your Statement</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Drag and drop your bank statement or click to browse files
              </p>

              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 mb-6 text-center hover:border-gt-gold dark:hover:border-gt-gold transition-colors cursor-pointer">
                <Upload className="h-10 w-10 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Supported formats: PDF, CSV, OFX</p>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-gt-gold hover:bg-gt-gold/90 text-white">Upload & Analyze</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

