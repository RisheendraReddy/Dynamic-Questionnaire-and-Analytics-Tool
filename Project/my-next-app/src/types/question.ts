export interface Question {
    id?: string
    text: string
    answer1: string
    points1: string
    answer2: string
    points2: string
    category: string
  }
  
  export interface QuestionResponse {
    success: boolean
    message: string
    data?: Question | Question[] | null
  }
  