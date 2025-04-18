import { NextResponse } from "next/server"
import type { QuestionResponse } from "@/types/question"
import { questions } from "@/lib/questions"

export async function GET(): Promise<NextResponse<QuestionResponse>> {
  try {
    return NextResponse.json({
      success: true,
      message: "Questions retrieved successfully",
      data: questions,
    })
  } catch (error) {
    console.error("Error retrieving questions:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
