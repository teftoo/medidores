'use client'

import { useState, Suspense } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const accessToken = searchParams.get('access_token') // Supabase envía esto
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    if (!password) {
      setMensaje('❌ Ingresa una nueva contraseña')
      return
    }

    setLoading(true)
    setMensaje('')

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setMensaje('✅ Contraseña actualizada! Redirigiendo al login...')
      setTimeout(() => router.push('/login'), 1500)
    } catch (err) {
      setMensaje(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Restablecer Contraseña</h2>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {mensaje && <p className={`mb-2 text-center ${mensaje.startsWith('❌') ? 'text-red-500' : 'text-green-500'}`}>{mensaje}</p>}
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-2xl hover:bg-blue-700 transition-all"
        >
          {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
      </motion.div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
