import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { QuestionResponse } from "@/types/question"

// Path to the questions file
const questionsFilePath = path.join(process.cwd(), "lib", "questions.ts")

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse<QuestionResponse>> {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Question ID is required",
        },
        { status: 400 },
      )
    }

    // Read the current questions file
    const fileContent = await fs.readFile(questionsFilePath, "utf8")

    // Load the questions module to get the current questions
    // We need to use dynamic import to get the latest version
    const questionsModule = await import(`${process.cwd()}/lib/questions.ts`)
    const currentQuestions = questionsModule.questions

    // Find the question to remove
    const questionToRemove = currentQuestions.find((q: any) => q.id === id)

    if (!questionToRemove) {
      return NextResponse.json(
        {
          success: false,
          message: `Question with ID ${id} not found`,
        },
        { status: 404 },
      )
    }

    // Filter out the question to remove
    const updatedQuestions = currentQuestions.filter((q: any) => q.id !== id)

    // Format the updated questions array as a string
    const updatedQuestionsString = updatedQuestions
      .map(
        (q: any) => `
  {
    text: "${q.text}",
    answer1: "${q.answer1}",
    points1: "${q.points1}",
    answer2: "${q.answer2}",
    points2: "${q.points2}",
    category: "${q.category}",
    ${q.id ? `id: "${q.id}",` : ""}
  }`,
      )
      .join(",")

    // Replace the entire questions array in the file
    const updatedContent = fileContent.replace(
      /export const questions = \[([\s\S]*?)\]/,
      `export const questions = [${updatedQuestionsString}\n]`,
    )

    // Write the updated content back to the file
    await fs.writeFile(questionsFilePath, updatedContent, "utf8")

    return NextResponse.json({
      success: true,
      message: "Question removed successfully",
      data: questionToRemove,
    })
  } catch (error) {
    console.error("Error removing question:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
