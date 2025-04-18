"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQuizStore } from "@/lib/store"
import Footer from "@/components/footer"

export default function Home() {
  const [email, setEmail] = useState("")

  // Check if user is returning to take the quiz again
  const { userEmail: existingEmail } = useQuizStore()
  const isReturningUser = Boolean(existingEmail)

  // Use existing email if available
  useEffect(() => {
    if (existingEmail && !email) {
      setEmail(existingEmail)
    }
  }, [existingEmail, email])

  const router = useRouter()
  const { setUserEmail } = useQuizStore()

  const handleEmailSubmit = () => {
    if (email && email.includes("@")) {
      setUserEmail(email)
      router.push("/quiz")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md mx-auto mb-6 sm:mb-8 px-4">
          <Image
            src="/asu_logo.png"
            alt="Arizona State University Logo"
            width={240}
            height={60}
            className="mx-auto w-[180px] sm:w-[240px] h-auto"
            priority
          />
        </div>

        <div className="w-full max-w-md p-4 sm:p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-3 sm:mb-4">
            {isReturningUser ? "Welcome Back! Ready for Another Quiz?" : "Welcome! Business Venture Quiz"}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 text-center">
            This quiz will help us learn more about your business and can help you know areas that might need
            improvement.
          </p>

          <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2 sm:mb-3">
            Please enter your email before starting:
          </h3>

          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="mb-4"
            required
          />

          <Button
            onClick={handleEmailSubmit}
            className="w-full bg-[#ffc324] hover:bg-[#a40145] text-sm sm:text-base py-2 sm:py-2.5"
          >
            {isReturningUser ? "Start Again" : "Submit"}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
