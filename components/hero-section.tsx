"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, CreditCard, Shield, TrendingUp, ChevronDown, Heart } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const logoBeltRef = useRef<HTMLDivElement>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [processingFile, setProcessingFile] = useState(false)
  const router = useRouter()
  
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

      // Animate the logo belt
      if (logoBeltRef.current) {
        gsap.to(logoBeltRef.current, {
          x: "-50%",
          duration: 20,
          repeat: -1,
          ease: "linear",
        })
      }
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

  // Sponsor logos with direct URLs
  const sponsorLogos = [
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-bh8p2bH5Qra3yVbeEBM1UsOajx1PQV.png",
      alt: "Ramblin' Hacks",
      width: 200,
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1FW87j5oB4eofAsZaxlFO5OoGazKpm.png",
      alt: "Goldman Sachs",
      width: 150,
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ME5Idt7QEXTVkBAPMCvqUwE0cBnLBP.png",
      alt: "Microsoft",
      width: 150,
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-fq3mAHVRKKv2WjP4kYEBMggzbieuQU.png",
      alt: "USA",
      width: 100,
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ellck8WUikm3RhD8v9CpGBbDU0HwYe.png",
      alt: "GEICO",
      width: 120,
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-q9UTe25SSiJYadibaZyRwBkbRO1rvy.png",
      alt: "Elevance Health",
      width: 150,
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-G94k5e4FE0vbbzH0vFmUPqWZpUlTT1.png",
      alt: "FanDuel",
      width: 100,
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9XfqpT3BTU5gf9F5kPVoQCEifSlhjt.png",
      alt: "The Trade Desk",
      width: 180,
    },
  ]

  // Scrolling functionality for navigation
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  // Open the upload modal or navigate to bank statement section
  const handleUploadClick = () => {
    setShowModal(true);
    
    // If there's a bank statement analysis section, make sure it's visible
    setTimeout(() => {
      const bankStatementSection = document.getElementById("bank-statement-analysis") || 
                                  document.getElementById("dashboard");
      if (bankStatementSection) {
        // Just make sure it's visible, we'll scroll there after uploading
        bankStatementSection.classList.remove("hidden");
      }
    }, 100);
  };
  
  // File upload functionality
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleFileUpload = () => {
    if (selectedFile) {
      setProcessingFile(true);
      
      // Simulate file processing
      setTimeout(() => {
        setProcessingFile(false);
        setShowModal(false);
        setSelectedFile(null);
        
        // Add a success message
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg z-50';
        successMessage.innerHTML = `<p>Successfully processed ${selectedFile.name}</p>`;
        document.body.appendChild(successMessage);
        
        // Remove the message after 3 seconds
        setTimeout(() => {
          document.body.removeChild(successMessage);
        }, 3000);
        
        // Scroll to bank statement analysis section or dashboard
        const bankStatementSection = document.getElementById("bank-statement-analysis") || 
                                    document.getElementById("dashboard");
        if (bankStatementSection) {
          scrollToSection(bankStatementSection.id);
        }
        
        // Trigger the dashboard/analysis to show analysis
        if (bankStatementSection) {
          const event = new CustomEvent('file-processed', { 
            detail: { filename: selectedFile.name }
          });
          bankStatementSection.dispatchEvent(event);
          
          // Also trigger any upload buttons in that section
          const uploadBtn = bankStatementSection.querySelector('input[type="file"]');
          if (uploadBtn) {
            // Create a new file and simulate an upload
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(selectedFile);
            
            // Set the files property on the input element
            if (uploadBtn instanceof HTMLInputElement) {
              // Create a change event to trigger the file input's change handler
              const changeEvent = new Event('change', { bubbles: true });
              Object.defineProperty(uploadBtn, 'files', {
                value: dataTransfer.files,
                writable: false
              });
              uploadBtn.dispatchEvent(changeEvent);
            }
          }
        }
      }, 2000);
    } else {
      alert("Please select a file first");
    }
  };
  
  // Handle drag and drop functionality
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

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
              <span className="text-sm font-medium text-gt-navy dark:text-gt-gold">
                Georgia Tech&apos;s first AI-powered spend-to-invest engine
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="reveal-text text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gt-gold via-gt-navy to-gs-blue dark:from-gt-gold dark:via-white dark:to-gs-blue animate-gradient-shift">
              Turn Spending Into Investing
            </h1>

            {/* Animated Subtitle */}
            <p className="reveal-text text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8">
              Turn your coffee runs into stock wins—automatically.
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
            <div className="reveal-text flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                data-upload-trigger="true"
                onClick={handleUploadClick}
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
                onClick={() => scrollToSection("url-security")}
                className="border-2 border-gt-gold text-gt-gold hover:bg-gt-gold/10 px-8 py-6 text-lg"
              >
                <Shield className="mr-2 h-5 w-5" />
                Check URL Safety
              </Button>
            </div>

            {/* Made with Love */}
            <div className="reveal-text flex items-center justify-center mb-8 text-gray-600 dark:text-gray-300">
              <span className="flex items-center text-lg">
                Made with <Heart className="h-5 w-5 mx-1 text-red-500 fill-red-500" /> at Ramblin&apos; Hacks 2025
              </span>
            </div>

            {/* Sponsor Logo Belt */}
            <div className="reveal-text w-full overflow-hidden mb-8">
              <div
                ref={logoBeltRef}
                className="flex items-center space-x-12 whitespace-nowrap"
                style={{ width: "200%" }}
              >
                {[...sponsorLogos, ...sponsorLogos].map((logo, index) => (
                  <div key={index} className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                    <img
                      src={logo.src || "/placeholder.svg"}
                      alt={logo.alt}
                      width={logo.width}
                      height={60}
                      className="h-12 object-contain"
                    />
                  </div>
                ))}
              </div>
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
              onClick={() => scrollToSection("features")}
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
            <p className="text-gray-600 dark:text-gray-400">Your Chipotle habit just became an investment strategy</p>
          </div>

          <div className="feature-card bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-gs-blue to-gs-blue/70 text-white p-3 rounded-lg inline-block mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Fraud Protection</h3>
            <p className="text-gray-600 dark:text-gray-400">Advanced security to protect your financial data</p>
          </div>

          <div className="feature-card bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-gt-navy to-gt-navy/70 text-white p-3 rounded-lg inline-block mb-4">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Spending Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400">
              No budgeting. Just spend normally and watch your portfolio grow
            </p>
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
            onClick={() => !processingFile && setShowModal(false)}
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
              
              <label 
                htmlFor="file-upload-hero"
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 mb-6 text-center hover:border-gt-gold dark:hover:border-gt-gold transition-colors cursor-pointer block"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  id="file-upload-hero" 
                  className="hidden" 
                  accept=".pdf,.csv,.ofx" 
                  onChange={handleFileChange}
                  disabled={processingFile}
                />
                <Upload className={`h-10 w-10 mx-auto mb-4 ${selectedFile ? 'text-gt-gold' : 'text-gray-400 dark:text-gray-600'}`} />
                {selectedFile ? (
                  <p className="font-medium text-gt-gold">{selectedFile.name}</p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Supported formats: PDF, CSV, OFX</p>
                )}
              </label>

              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowModal(false)}
                  disabled={processingFile}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-gt-gold hover:bg-gt-gold/90 text-white"
                  onClick={handleFileUpload}
                  disabled={!selectedFile || processingFile}
                >
                  {processingFile ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : "Upload & Analyze"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

