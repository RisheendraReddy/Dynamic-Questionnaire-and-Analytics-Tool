import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { Question, QuestionResponse } from "@/types/question"
import { v4 as uuidv4 } from "uuid"

// Path to the questions file
const questionsFilePath = path.join(process.cwd(), "lib", "questions.ts")

export async function POST(request: Request): Promise<NextResponse<QuestionResponse>> {
  try {
    const newQuestions: Question[] = await request.json()

    // Validate the questions data
    if (!Array.isArray(newQuestions) || newQuestions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or empty questions array",
        },
        { status: 400 },
      )
    }

    // Validate each question
    for (const question of newQuestions) {
      if (
        !question.text ||
        !question.category ||
        !question.answer1 ||
        !question.answer2 ||
        !question.points1 ||
        !question.points2
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "One or more questions are missing required fields",
          },
          { status: 400 },
        )
      }

      // Add a unique ID if not provided
      if (!question.id) {
        question.id = uuidv4()
      }
    }

    // Read the current questions file
    const fileContent = await fs.readFile(questionsFilePath, "utf8")

    // Extract the questions array from the file content
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

    // Format the new questions as strings to be inserted into the file
    const questionsString = newQuestions
      .map(
        (q) => `
  {
    text: "${q.text}",
    answer1: "${q.answer1}",
    points1: "${q.points1}",
    answer2: "${q.answer2}",
    points2: "${q.points2}",
    category: "${q.category}",
    id: "${q.id}"
  },`,
      )
      .join("")

    // Insert the new questions at the end of the array
    const updatedContent = fileContent.replace(
      /export const questions = \[([\s\S]*?)\]/,
      `export const questions = [$1${questionsString}\n]`,
    )

    // Write the updated content back to the file
    await fs.writeFile(questionsFilePath, updatedContent, "utf8")

    return NextResponse.json({
      success: true,
      message: `${newQuestions.length} questions added successfully`,
      data: newQuestions,
    })
  } catch (error) {
    console.error("Error adding questions in bulk:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
