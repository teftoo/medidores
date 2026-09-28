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
      {/* CHAT */}
      {abierto && (
        <div
          style={{
            position: 'fixed',
            bottom: '105px',
            right: '25px',
            width: '380px',
            height: '560px',
            background: '#ffffff',
            borderRadius: '22px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 18px 55px rgba(15, 23, 42, 0.20)',
            border: '1px solid #e5e7eb',
            zIndex: 9998,
            fontFamily: 'Inter, system-ui, sans-serif'
          }}
        >

          {/* HEADER */}
          <div
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: '#0ea5b8',
              color: 'white',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '13px',
                  background: 'rgba(255,255,255,.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Droplets size={23} strokeWidth={2.2} />
              </div>

              <div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    lineHeight: '1.2'
                  }}
                >
                  AquaBot
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    opacity: '.85',
                    marginTop: '3px'
                  }}
                >
                  Asistente de servicios de agua
                </div>
              </div>
            </div>

            <div
              style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: '#86efac',
                boxShadow: '0 0 0 4px rgba(134,239,172,.15)'
              }}
              title="AquaBot disponible"
            />
          </div>

          {/* MENSAJES */}
          <div
            style={{
              flex: 1,
              padding: '20px 16px',
              overflowY: 'auto',
              background: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {mensajes.map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent:
                    m.tipo === 'usuario' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '78%',
                    padding: '11px 14px',
                    borderRadius:
                      m.tipo === 'usuario'
                        ? '16px 16px 4px 16px'
                        : '16px 16px 16px 4px',
                    background:
                      m.tipo === 'usuario'
                        ? '#0ea5b8'
                        : '#ffffff',
                    color:
                      m.tipo === 'usuario'
                        ? '#ffffff'
                        : '#1f2937',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    boxShadow:
                      m.tipo === 'usuario'
                        ? 'none'
                        : '0 2px 8px rgba(15,23,42,.06)',
                    border:
                      m.tipo === 'usuario'
                        ? 'none'
                        : '1px solid #e5e7eb',
                    wordBreak: 'break-word'
                  }}
                >
                  {m.texto}
                </div>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div
            style={{
              padding: '14px 16px 16px',
              background: '#ffffff',
              borderTop: '1px solid #eef2f7',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexShrink: 0
            }}
          >
            <input
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && responder()}
              placeholder="Escribe tu consulta..."
              style={{
                flex: 1,
                minWidth: 0,
                height: '48px',
                boxSizing: 'border-box',
                padding: '0 15px',
                borderRadius: '14px',
                border: '1px solid #dbe2ea',
                outline: 'none',
                fontSize: '14px',
                color: '#1f2937',
                background: '#f8fafc',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            />

            <button
              onClick={responder}
              style={{
                width: '48px',
                height: '48px',
                minWidth: '48px',
                border: 'none',
                background: '#0ea5b8',
                color: 'white',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                cursor: 'pointer',
                boxShadow: '0 5px 14px rgba(14,165,184,.25)'
              }}
              title="Enviar mensaje"
            >
              <Send size={19} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setAbierto(!abierto)}
        aria-label={abierto ? 'Cerrar AquaBot' : 'Abrir AquaBot'}
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: 'none',
          background: '#0ea5b8',
          color: '#ffffff',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(14,165,184,.35)',
          transition: 'transform .2s ease, box-shadow .2s ease'
        }}
      >
        {abierto
          ? <X size={29} strokeWidth={2.1} />
          : <MessageCircle size={29} strokeWidth={2.1} />
        }
      </button>
    </>
  )
}
