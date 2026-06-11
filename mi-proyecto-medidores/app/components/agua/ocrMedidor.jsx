'use client'

import { useState } from 'react'
import Tesseract from 'tesseract.js'
import { FaUpload } from 'react-icons/fa'

export default function OCRMedidor({ onLecturaDetectada }) {
  const [imagen, setImagen] = useState(null)
  const [texto, setTexto] = useState('')
  const [procesando, setProcesando] = useState(false)

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImagen(URL.createObjectURL(file))
    setTexto('')
    setProcesando(false)
  }

  const procesarImagen = async () => {
    if (!imagen) return
    setProcesando(true)

    try {
      const { data: { text } } = await Tesseract.recognize(imagen, 'spa', { logger: m => console.log(m) })
      const lecturaDetectada = text.match(/\d+/)?.[0] || ''
      setTexto(lecturaDetectada)
      if (onLecturaDetectada) onLecturaDetectada(lecturaDetectada)
    } catch (err) {
      console.error(err)
      setTexto('❌ Error al leer la imagen')
    } finally {
      setProcesando(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-md mx-auto flex flex-col gap-4">
      <label className="flex items-center gap-2 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
        <FaUpload /> Subir imagen del medidor
        <input type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </label>

      {imagen && <img src={imagen} alt="Medidor" className="w-full rounded-xl shadow-md" />}

      {imagen && (
        <button
          onClick={procesarImagen}
          className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700"
          disabled={procesando}
        >
          {procesando ? 'Procesando...' : 'Leer Medidor'}
        </button>
      )}

      {texto && (
        <p className={`text-center mt-2 ${texto.includes('❌') ? 'text-red-600' : 'text-green-700'}`}>
          Lectura detectada: {texto}
        </p>
      )}
    </div>
  )
}
