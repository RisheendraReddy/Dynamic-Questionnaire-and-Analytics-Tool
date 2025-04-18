"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useQuizStore } from "@/lib/store"
import { questions } from "@/lib/questions"
import Footer from "@/components/footer"

export default function QuizPage() {
  const router = useRouter()
  const { userEmail, responses, addResponse } = useQuizStore()
  const [currentQuestion, setCurrentQuestion] = useState(0)

  // Redirect to home if no email
  useEffect(() => {
    if (!userEmail) {
      router.push("/")
    }
  }, [userEmail, router])

  // Restart quiz functionality
  const handleRestartQuiz = () => {
    const { resetQuiz } = useQuizStore.getState()
    resetQuiz()
    router.push("/")
  }

  const handleAnswer = (category: string, score: string) => {
    addResponse(currentQuestion, {
      category,
      score: Number.parseInt(score),
    })

    // Move to the next question or complete the questionnaire
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      router.push("/results")
    }
  }

  // If no email, show loading or redirect
  if (!userEmail) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-md mx-auto mb-4 sm:mb-8">
          <Image
            src="/asu_logo.png"
            alt="Arizona State University Logo"
            width={240}
            height={60}
            className="mx-auto w-[160px] sm:w-[240px] h-auto"
          />
        </div>

        <div className="w-full max-w-xl flex justify-end mb-2">
          <Button
            onClick={handleRestartQuiz}
            variant="outline"
            size="sm"
            className="text-[#a40145] border-[#a40145] hover:bg-[#a40145] hover:text-white text-xs sm:text-sm"
          >
            Restart Quiz
          </Button>
        </div>

        <Card className="w-full max-w-xl">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-semibold">Category: {question.category}</h2>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200" indicatorClassName="bg-[#a40145]" />
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-center mb-4 sm:mb-6">{question.text}</h3>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => handleAnswer(question.category, question.points1)}
                className="py-4 sm:py-6 bg-[#ffc324] hover:bg-[#a40145] text-left justify-start h-auto text-sm sm:text-base"
              >
                {question.answer1}
              </Button>

              <Button
                onClick={() => handleAnswer(question.category, question.points2)}
                className="py-4 sm:py-6 bg-[#ffc324] hover:bg-[#a40145] text-left justify-start h-auto text-sm sm:text-base"
              >
                {question.answer2}
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between p-4 sm:p-6">
            <Button
              onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
              variant="ghost"
              disabled={currentQuestion === 0}
              className="text-[#a40145] text-xs sm:text-sm"
            >
              Previous
            </Button>

            <div className="text-xs text-muted-foreground">{Math.floor(progress)}% Complete</div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
