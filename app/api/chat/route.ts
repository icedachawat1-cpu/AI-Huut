import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // ยิงคำขอจาก Server-side Next.js ไปยัง Ollama (จะไม่ติด CORS)
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Ollama responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ollama Proxy Error:", error)
    return NextResponse.json(
      { error: "Failed to connect to Ollama", details: error.message },
      { status: 500 }
    )
  }
}