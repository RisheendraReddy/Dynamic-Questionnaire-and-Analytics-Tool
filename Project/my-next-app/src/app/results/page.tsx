"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuizStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { Radar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import Footer from "@/components/footer"
import { useToast } from "@/hooks/use-toast" // Updated import path
import dynamic from "next/dynamic"

// Dynamically import react-confetti to avoid SSR issues
const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false })

// Register ChartJS components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.6 },
  },
}

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8 },
  },
}

export default function ResultsPage() {
  const router = useRouter()
  const { userEmail, responses } = useQuizStore()
  const [loaded, setLoaded] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [animationComplete, setAnimationComplete] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Set window size for confetti
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    // Initial size
    updateWindowSize()

    // Update on resize
    window.addEventListener("resize", updateWindowSize)

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => {
      window.removeEventListener("resize", updateWindowSize)
      clearTimeout(timer)
    }
  }, [])

  // Redirect to home if no email or responses
  useEffect(() => {
    if (!userEmail || responses.length === 0) {
      router.push("/")
    } else {
      // Trigger animation after a delay
      setTimeout(() => setLoaded(true), 500)
    }
  }, [userEmail, responses, router])

  // Calculate scores by category and percentages using useMemo to stabilize dependencies
  const { categories, percentages, maxScores } = useMemo(() => {
    const categories: Record<string, number> = {}
    const maxScores: Record<string, number> = {
      "Business Method Levels": 4,
      "Product/Service Levels": 2,
      "Persona Spectrum Levels": 3,
    }

    responses.forEach((response) => {
      if (!categories[response.category]) categories[response.category] = 0
      categories[response.category] += response.score
    })

    // Calculate percentages for each category
    const percentages: Record<string, number> = {}
    Object.entries(categories).forEach(([category, score]) => {
      percentages[category] = Math.round((score / maxScores[category]) * 100)
    })

    return { categories, percentages, maxScores }
  }, [responses])

  // Create chart data using percentages instead of raw scores
  const chartData = useMemo(
    () => ({
      labels: Object.keys(percentages),
      datasets: [
        {
          label: "Readiness Level (%)",
          data: Object.values(percentages),
          backgroundColor: "rgba(164, 1, 69, 0.2)",
          borderColor: "rgba(164, 1, 69, 1)",
          borderWidth: 1,
        },
      ],
    }),
    [percentages],
  )

  // Update chart options to use percentage scale (0-100%)
  // Fixed type definition to match Chart.js expectations
  const chartOptions: ChartOptions<"radar"> = {
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: (tickValue) => `${tickValue}%`,
          font: {
            size: 10, // Smaller font size for mobile
          },
        },
        pointLabels: {
          font: {
            size: 10, // Smaller font size for mobile
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 12, // Smaller font size for mobile
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || ""
            const value = context.raw || 0
            return `${label}: ${value}%`
          },
        },
        titleFont: {
          size: 12, // Smaller font size for mobile
        },
        bodyFont: {
          size: 12, // Smaller font size for mobile
        },
      },
    },
    maintainAspectRatio: false,
    animation: {
      duration: 1500, // Longer animation for the chart
    },
  }

  // Export functionality: Download results as PDF
  const handleDownloadPDF = async () => {
    if (!resultsRef.current) return

    const element = resultsRef.current
    const canvas = await html2canvas(element, { scale: 2 })
    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF("p", "mm", "a4")
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 30

    pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    pdf.save("business-venture-results.pdf")
  }

  // Restart quiz functionality
  const handleRestartQuiz = () => {
    const { resetQuiz } = useQuizStore.getState()
    resetQuiz()
    router.push("/")
  }

  // Use useCallback to memoize the sendEmailResults function
  const sendEmailResults = useCallback(async () => {
    if (isEmailSending) return

    try {
      setIsEmailSending(true)

      const response = await fetch("/api/send-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          percentages, // Only send the percentages now
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Email Sent!",
          description: "Your results have been sent to your email.",
        })
        setEmailSent(true)
      } else {
        toast({
          title: "Error",
          description: typeof data.error === "string" ? data.error : "Failed to send email. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Email sending error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEmailSending(false)
    }
  }, [isEmailSending, userEmail, percentages, toast])

  // Send email results when the page loads
  useEffect(() => {
    let isMounted = true

    const sendInitialEmail = async () => {
      if (userEmail && responses.length > 0 && loaded && !emailSent && !isEmailSending) {
        try {
          setIsEmailSending(true)
          await sendEmailResults()
          if (isMounted) {
            setEmailSent(true)
          }
        } catch (error) {
          console.error("Failed to send initial email:", error)
        } finally {
          if (isMounted) {
            setIsEmailSending(false)
          }
        }
      }
    }

    // Use setTimeout to ensure the component is fully mounted
    const timer = setTimeout(() => {
      sendInitialEmail()
    }, 1000)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [loaded, emailSent, userEmail, responses.length, isEmailSending, sendEmailResults])

  // If no email or responses, show loading or redirect
  if (!userEmail || responses.length === 0) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Confetti animation */}
      {showConfetti && windowSize.width > 0 && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
          colors={["#a40145", "#ffc324", "#ffdb70", "#d4004c", "#ffffff"]} // ASU colors + white
        />
      )}

      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto mb-4 sm:mb-8"
        >
          <Image
            src="/asu_logo.png"
            alt="Arizona State University Logo"
            width={240}
            height={60}
            className="mx-auto w-[160px] sm:w-[240px] h-auto"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          onAnimationComplete={() => setAnimationComplete(true)}
          className="w-full max-w-4xl"
          ref={resultsRef}
        >
          <motion.div variants={cardVariants} className="mb-6 sm:mb-8">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <motion.h2 variants={itemVariants} className="text-xl sm:text-2xl font-bold text-center">
                  Your Results
                </motion.h2>
                <motion.p variants={itemVariants} className="text-center text-muted-foreground text-sm sm:text-base">
                  We&apos;ve sent a copy of your results to your email!
                </motion.p>
              </CardHeader>

              <CardContent className="p-3 sm:p-6">
                <motion.div
                  variants={itemVariants}
                  className={`radar-chart ${loaded ? "loaded" : ""} h-[300px] sm:h-[400px] w-full`}
                >
                  <Radar data={chartData} options={chartOptions} />
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
                >
                  {Object.entries(categories).map(([category, score], index) => {
                    const percentage = percentages[category]
                    return (
                      <motion.div
                        key={category}
                        variants={itemVariants}
                        custom={index}
                        className="bg-gray-50 p-3 sm:p-4 rounded-lg"
                        whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <h3 className="font-semibold text-[#a40145] text-sm sm:text-base">{category}</h3>
                        <div className="flex items-center justify-between mt-1 sm:mt-2">
                          <span className="text-xs sm:text-sm text-gray-600">
                            Score: {score}/{maxScores[category]}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-600">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mt-1 sm:mt-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.2, ease: "easeOut" }}
                            className="bg-[#a40145] h-2 sm:h-2.5 rounded-full"
                          ></motion.div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </CardContent>

              <CardFooter className="flex justify-center gap-2 sm:gap-4 flex-wrap p-4 sm:p-6">
                <AnimatePresence>
                  {animationComplete && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Button
                          onClick={handleDownloadPDF}
                          className="bg-[#ffc324] hover:bg-[#a40145] text-xs sm:text-sm px-2 sm:px-4"
                        >
                          Download Results as PDF
                        </Button>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Button
                          onClick={handleRestartQuiz}
                          variant="outline"
                          className="border-[#a40145] text-[#a40145] hover:bg-[#a40145] hover:text-white text-xs sm:text-sm px-2 sm:px-4"
                        >
                          Take Quiz Again
                        </Button>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Button
                          onClick={sendEmailResults}
                          disabled={isEmailSending}
                          variant="outline"
                          className="border-[#a40145] text-[#a40145] hover:bg-[#a40145] hover:text-white disabled:opacity-50 text-xs sm:text-sm px-2 sm:px-4"
                        >
                          {isEmailSending ? "Sending..." : "Resend Results to Email"}
                        </Button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <motion.h2 variants={itemVariants} className="text-xl sm:text-2xl font-bold text-center">
                  Results Meaning
                </motion.h2>
                <motion.p variants={itemVariants} className="text-center text-muted-foreground text-sm sm:text-base">
                  Each category tells you a bit about your business and where its strengths and weaknesses lie.
                </motion.p>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <h4 className="text-base sm:text-lg font-semibold">Business Method Levels</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    This shows how clear and developed your business plan and processes are. It covers your business
                    goals, priorities, and how you plan to create the product. A high score means you have a strong,
                    well-thought-out plan with a unique product and a good chance of finding a niche market. A low score
                    means you may need to work on your business strategy.
                  </p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <h4 className="text-base sm:text-lg font-semibold">Product/Service Levels</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    This measures how much value your product or service gives to your customers. A high score means
                    your product is new and keeps customers engaged over long periods of time. A low score suggests your
                    product may need improvements to better meet customer needs.
                  </p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <h4 className="text-base sm:text-lg font-semibold">Persona Spectrum Levels</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    This shows how much research you&apos;ve done on your target customers. A high score means
                    you&apos;ve done a lot of testing and interviews to understand your audience. A low score means you
                    might need to do more research to better identify your target market.
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
