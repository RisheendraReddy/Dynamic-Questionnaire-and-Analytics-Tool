import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { Question, QuestionResponse } from "@/types/question"
import { v4 as uuidv4 } from "uuid"

// Path to the questions file
const questionsFilePath = path.join(process.cwd(), "lib", "questions.ts")

export async function POST(request: Request): Promise<NextResponse<QuestionResponse>> {
  try {
    const newQuestion: Question = await request.json()

    // Validate the question data
    if (
      !newQuestion.text ||
      !newQuestion.category ||
      !newQuestion.answer1 ||
      !newQuestion.answer2 ||
      !newQuestion.points1 ||
      !newQuestion.points2
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required question fields",
        },
        { status: 400 },
      )
    }

    // Add a unique ID if not provided
    if (!newQuestion.id) {
      newQuestion.id = uuidv4()
    }

    // Read the current questions file
    const fileContent = await fs.readFile(questionsFilePath, "utf8")

    // Extract the questions array from the file content
    // This is a simple approach - in production you might want to use a proper parser
    const questionsMatch = fileContent.match(/export const questions = \[([\s\S]*?)\]/)

    if (!questionsMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not parse questions file",
        },
        { status: 500 },
      )
    }

    // Format the new question as a string to be inserted into the file
    const questionString = `
  {
    text: "${newQuestion.text}",
    answer1: "${newQuestion.answer1}",
    points1: "${newQuestion.points1}",
    answer2: "${newQuestion.answer2}",
    points2: "${newQuestion.points2}",
    category: "${newQuestion.category}",
    id: "${newQuestion.id}"
  },`

    // Insert the new question at the end of the array
    const updatedContent = fileContent.replace(
      /export const questions = \[([\s\S]*?)\]/,
      `export const questions = [$1${questionString}\n]`,
    )

    // Write the updated content back to the file
    await fs.writeFile(questionsFilePath, updatedContent, "utf8")

    return NextResponse.json({
      success: true,
      message: "Question added successfully",
      data: newQuestion,
    })
  } catch (error) {
    console.error("Error adding question:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
