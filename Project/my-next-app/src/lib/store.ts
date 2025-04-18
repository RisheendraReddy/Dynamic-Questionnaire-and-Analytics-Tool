"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type Response = {
  category: string
  score: number
}

type QuizState = {
  userEmail: string
  responses: Response[]
  setUserEmail: (email: string) => void
  addResponse: (index: number, response: Response) => void
  resetQuiz: () => void
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      userEmail: "",
      responses: [],
      setUserEmail: (email) => set({ userEmail: email }),
      addResponse: (index, response) =>
        set((state) => {
          const newResponses = [...state.responses]
          newResponses[index] = response
          return { responses: newResponses }
        }),
      resetQuiz: () => set((state) => ({ responses: [] })),
    }),
    {
      name: "business-quiz-storage",
    },
  ),
)
