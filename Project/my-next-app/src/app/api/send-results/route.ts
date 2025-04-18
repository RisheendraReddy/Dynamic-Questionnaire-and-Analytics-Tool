import { NextResponse } from "next/server"
import { Resend } from "resend"

// Using the API key directly in the code as requested
const resend = new Resend("re_Y32YiziS_8bYA3iGswEr1DBtVtCr927no")

// Your ASU email address
const ASU_EMAIL = "aharish4@asu.edu"

export async function POST(request: Request) {
  try {
    const { email, percentages } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Generate a spider chart image URL using QuickChart.io
    const chartUrl = generateSpiderChartUrl(percentages)

    // Create a simple HTML email with just the chart and brief overview
    const htmlContent = generateSimplifiedEmailHTML(chartUrl)

    const { data, error } = await resend.emails.send({
      from: "ASU Business Venture Quiz <onboarding@resend.dev>", // This is the default Resend sender
      reply_to: ASU_EMAIL, // Set your email as the reply-to address
      to: email,
      subject: "Your ASU Business Venture Quiz Results",
      html: htmlContent,
    })

    if (error) {
      console.error("Resend API error:", error)
      return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}

function generateSpiderChartUrl(percentages: Record<string, number>): string {
  const labels = Object.keys(percentages)
  const data = Object.values(percentages)

  // Create a configuration for QuickChart.io
  const chartConfig = {
    type: "radar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Readiness Level (%)",
          data: data,
          backgroundColor: "rgba(164, 1, 69, 0.2)",
          borderColor: "rgba(164, 1, 69, 1)",
          borderWidth: 1,
          pointBackgroundColor: "rgba(164, 1, 69, 1)",
        },
      ],
    },
    options: {
      scale: {
        ticks: {
          beginAtZero: true,
          max: 100,
          stepSize: 20,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Business Venture Readiness",
          font: {
            size: 18,
            weight: "bold",
          },
        },
      },
    },
  }

  // Encode the chart configuration for the URL
  const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig))

  // Return the QuickChart.io URL
  return `https://quickchart.io/chart?c=${encodedConfig}&width=500&height=500`
}

function generateSimplifiedEmailHTML(chartUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your ASU Business Venture Quiz Results</title>
      </head>
      <body style="background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header with ASU branding color -->
          <div style="background-color: #a40145; padding: 25px 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 22px;">Arizona State University</h2>
            <p style="color: #ffffff; margin: 5px 0 0; font-size: 16px;">Business Venture Quiz Results</p>
          </div>

          <!-- Brief Overview -->
          <div style="padding: 30px 20px; text-align: center;">
            <h1 style="font-size: 24px; font-weight: bold; color: #a40145; margin: 0 0 20px;">Your Business Venture Readiness Results</h1>
            <p style="font-size: 16px; line-height: 24px; color: #333; margin: 0 0 30px;">
              Thank you for completing the ASU Business Venture Quiz. This assessment evaluates your business readiness across three key dimensions: Business Method, Product/Service, and Persona Spectrum.
            </p>
            
            <!-- Spider Chart -->
            <div style="text-align: center; margin: 0 auto 30px;">
              <img src="${chartUrl}" alt="Business Venture Readiness Spider Chart" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            </div>
            
            <p style="font-size: 16px; line-height: 24px; color: #333; margin: 0 0 20px;">
              The spider chart above shows your readiness level (%) in each area. For more information or to discuss your results, please visit <a href="https://entrepreneurship.asu.edu" style="color: #a40145; text-decoration: none; font-weight: bold;">ASU Entrepreneurship</a>.
            </p>
          </div>

          <!-- Footer -->
          <div style="padding: 20px; background-color: #f1f1f1; text-align: center;">
            <p style="font-size: 14px; color: #666; margin: 0;">© ${new Date().getFullYear()} Arizona State University. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
