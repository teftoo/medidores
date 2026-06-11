import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { mensaje } = await req.json()

    const prompt = `
Eres AquaBot 💧, asistente de un sistema de medidores de agua.

Reglas:
- Responde en español
- Sé corto, claro y amable
- Usa emojis ocasionalmente
- Ayuda sobre consumo, pagos, medidores y sistema

Usuario: ${mensaje}
`

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-r1:8b',
        prompt,
        stream: false
      })
    })

    const data = await response.json()

    return NextResponse.json({
      respuesta: data.response || 'No pude responder'
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json({
      respuesta: '❌ Error conectando con el modelo'
    })
  }
}