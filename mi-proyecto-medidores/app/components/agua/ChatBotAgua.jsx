'use client'

import { useState } from 'react'
import { MessageCircle, X, Send, Droplets } from 'lucide-react'

export default function ChatBotAgua() {
  const [abierto, setAbierto] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [mensajes, setMensajes] = useState([
    {
      tipo: 'bot',
      texto: 'Hola 👋 Soy AquaBot 💧. ¿En qué puedo ayudarte?'
    }
  ])

  const responder = async () => {
    if (!mensaje.trim()) return

    const textoUsuario = mensaje

    setMensajes(prev => [
      ...prev,
      { tipo: 'usuario', texto: textoUsuario }
    ])

    setMensaje('')

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: textoUsuario })
      })

      const data = await res.json()

      setMensajes(prev => [
        ...prev,
        { tipo: 'bot', texto: data.respuesta }
      ])

    } catch (error) {
      setMensajes(prev => [
        ...prev,
        { tipo: 'bot', texto: '❌ Error de conexión' }
      ])
    }
  }

  return (
    <>
      <button
        onClick={() => setAbierto(!abierto)}
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          width: '65px',
          height: '65px',
          borderRadius: '50%',
          border: 'none',
          background: '#00a67e',
          color: 'white',
          zIndex: 9999
        }}
      >
        {abierto ? <X /> : <MessageCircle />}
      </button>

      {abierto && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '25px',
            width: '360px',
            height: '500px',
            background: 'white',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 40px rgba(0,0,0,.2)',
            zIndex: 9999
          }}
        >
          <div
            style={{
              background: '#00a67e',
              color: 'white',
              padding: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Droplets />
            AquaBot
          </div>

          <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
            {mensajes.map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent:
                    m.tipo === 'usuario' ? 'flex-end' : 'flex-start',
                  marginBottom: '10px'
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '10px',
                    borderRadius: '12px',
                    background:
                      m.tipo === 'usuario' ? '#00a67e' : '#f1f1f1',
                    color: m.tipo === 'usuario' ? 'white' : 'black'
                  }}
                >
                  {m.texto}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', padding: '10px', gap: '10px' }}>
            <input
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && responder()}
              placeholder="Escribe..."
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #ddd'
              }}
            />

            <button
              onClick={responder}
              style={{
                width: '45px',
                border: 'none',
                background: '#00a67e',
                color: 'white',
                borderRadius: '10px'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}