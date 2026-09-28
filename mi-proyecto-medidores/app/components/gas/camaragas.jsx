'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCamera, FaUpload, FaRedo, FaFilePdf, FaCheckCircle,
  FaExclamationTriangle, FaTimesCircle, FaFire, FaHashtag,
  FaChartLine, FaSpinner, FaInfoCircle, FaShieldAlt
} from 'react-icons/fa'
import { jsPDF } from 'jspdf'
import Tesseract from 'tesseract.js'
import QRCode from 'qrcode'
import { supabase } from '@/lib/supabaseClient'
import { calcularTarifaGasCompleta } from '@/lib/tariffGasUtils'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  .c-root {
    --white:     #ffffff;
    --off:       #f9f9f8;
    --border:    #ebebea;
    --border-md: #d4d4d0;
    --ink:       #111110;
    --ink-2:     #3a3a38;
    --ink-3:     #737370;
    --ink-4:     #b0b0ac;
    --amber:     #f97316;
    --amber-dk:  #c2410c;
    --amber-bg:  #fff7ed;
    --amber-bd:  #fed7aa;
    --indigo:    #4f46e5;
    --indigo-bg: #eef0fd;
    --indigo-bd: #c7c3f7;
    --warn:      #d97706;
    --warn-bg:   #fffbeb;
    --warn-bd:   #fde68a;
    --red:       #dc2626;
    --red-bg:    #fef2f2;
    --red-bd:    #fecaca;
    --green:     #16a34a;
    --green-bg:  #f0fdf4;
    --green-bd:  #bbf7d0;
    font-family: 'Inter', system-ui, sans-serif;
    color: var(--ink);
    padding: 0;
  }

  .c-header {
    display: flex; align-items: center; gap: 16px;
    padding-bottom: 24px; border-bottom: 1.5px solid var(--border); margin-bottom: 28px;
  }
  .c-header-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--ink); display: flex; align-items: center;
    justify-content: center; color: var(--amber); flex-shrink: 0;
  }
  .c-title {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 28px;
    color: var(--ink); letter-spacing: -.02em; line-height: 1.1;
  }
  .c-subtitle { font-size: 13px; color: var(--ink-3); margin-top: 4px; }

  .c-grid { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }

  .c-cam-box {
    width: 100%; height: 400px; background: #111110;
    border-radius: 16px; overflow: hidden; position: relative; display: block;
  }
  .c-cam-video {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    object-fit: cover; border-radius: 16px; display: block; background: #000;
  }
  .c-cam-photo {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    object-fit: cover; border-radius: 16px; display: block;
  }
  .c-cam-placeholder {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 12px;
    color: rgba(255,255,255,.25); font-size: 13px; z-index: 1;
  }
  .c-cam-frame {
    position: absolute; inset: 28px; border: 2px dashed rgba(255,255,255,.2);
    border-radius: 12px; pointer-events: none; z-index: 2;
  }
  .c-cam-badge {
    position: absolute; top: 14px; right: 14px; z-index: 5;
    padding: 5px 12px; border-radius: 99px; font-size: 12px; font-weight: 600;
    display: flex; align-items: center; gap: 6px;
  }
  .c-cam-badge.live   { background: var(--amber); color: #fff; }
  .c-cam-badge.ok     { background: #16a34a; color: #fff; }
  .c-cam-badge.warn   { background: #d97706; color: #fff; }
  .c-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #fff; animation: blink 1.2s ease-in-out infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

  .c-cam-overlay {
    position: absolute; inset: 0; z-index: 6; background: rgba(0,0,0,.6);
    border-radius: 16px; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 14px;
  }
  .c-cam-overlay-text { color: #fff; font-size: 13px; font-weight: 500; text-align: center; padding: 0 32px; line-height: 1.5; }
  .c-cam-overlay-step {
    background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15);
    border-radius: 99px; padding: 4px 14px; font-size: 11px;
    color: rgba(255,255,255,.6); font-weight: 600; letter-spacing: .04em; text-transform: uppercase;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .c-btns { display: flex; gap: 10px; margin-top: 14px; }
  .c-btn {
    flex: 1; padding: 13px; border-radius: 12px; border: none;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all .15s;
  }
  .c-btn-primary { background: var(--amber); color: #fff; }
  .c-btn-primary:hover:not(:disabled) { background: var(--amber-dk); }
  .c-btn-primary:disabled { opacity: .45; cursor: not-allowed; }
  .c-btn-sec { background: var(--green-bg); border: 1.5px solid var(--green-bd); color: var(--green); }
  .c-btn-sec:hover { background: #d3f5e0; }
  .c-btn-ghost { background: var(--off); border: 1.5px solid var(--border); color: var(--ink-2); }
  .c-btn-ghost:hover { background: #f0f0ee; }

  .c-status {
    padding: 12px 16px; border-radius: 12px; margin-top: 14px;
    display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 500;
  }
  .c-status.loading { background: var(--indigo-bg); border: 1.5px solid var(--indigo-bd); color: var(--indigo); }
  .c-status.error   { background: var(--red-bg);    border: 1.5px solid var(--red-bd);    color: var(--red); }
  .c-status.success { background: var(--amber-bg);  border: 1.5px solid var(--amber-bd);  color: var(--amber-dk); }
  .c-status.warn    { background: var(--warn-bg);   border: 1.5px solid var(--warn-bd);   color: var(--warn); }

  .c-lectura-result {
    background: var(--amber-bg); border: 1.5px solid var(--amber-bd);
    border-radius: 14px; padding: 18px; margin-top: 14px;
    display: flex; align-items: center; gap: 14px;
  }
  .c-lectura-icon {
    width: 44px; height: 44px; border-radius: 12px; background: var(--amber);
    display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; flex-shrink: 0;
  }
  .c-lectura-num { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 30px; color: var(--amber-dk); }
  .c-lectura-lbl { font-size: 12px; color: var(--amber-dk); }

  .c-card { background: var(--white); border: 1.5px solid var(--border); border-radius: 16px; padding: 20px; }
  .c-card + .c-card { margin-top: 14px; }
  .c-card-title {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
    color: var(--ink); margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
  }
  .c-info-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid var(--border); }
  .c-info-row:last-child { border-bottom: none; }
  .c-info-k { font-size: 12px; color: var(--ink-3); }
  .c-info-v { font-size: 13px; font-weight: 600; color: var(--ink); }

  .c-consumo-card { background: var(--ink); border-radius: 16px; padding: 20px; margin-top: 14px; }
  .c-consumo-title {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
    color: rgba(255,255,255,.6); margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
  }
  .c-consumo-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,.07); }
  .c-consumo-row:last-child { border-bottom: none; }
  .c-consumo-k { font-size: 13px; color: rgba(255,255,255,.45); }
  .c-consumo-v { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 18px; color: #fff; }
  .c-consumo-total { font-size: 26px !important; color: var(--amber) !important; }

  .c-steps { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
  .c-step { display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; background: var(--off); border-radius: 12px; border: 1px solid var(--border); }
  .c-step-num { width: 24px; height: 24px; border-radius: 50%; background: var(--amber-bg); border: 1.5px solid var(--amber-bd); color: var(--amber-dk); font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .c-step-t { font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 2px; }
  .c-step-s { font-size: 12px; color: var(--ink-3); }

  .c-tips-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; color: var(--ink); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
  .c-tip { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 12px; color: var(--ink-2); line-height: 1.5; }
  .c-tip:last-child { border-bottom: none; padding-bottom: 0; }
  .c-tip-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--amber); flex-shrink: 0; margin-top: 5px; }

  .c-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.55);
    backdrop-filter: blur(4px); display: flex; align-items: center;
    justify-content: center; z-index: 50; padding: 20px;
  }
  .c-modal { background: var(--white); border-radius: 20px; box-shadow: 0 24px 64px rgba(0,0,0,.2); width: 100%; max-width: 460px; overflow: hidden; }
  .c-modal-header { background: var(--ink); padding: 22px 24px; display: flex; align-items: center; gap: 12px; }
  .c-modal-header-icon { color: var(--amber); font-size: 22px; }
  .c-modal-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 17px; color: #fff; }
  .c-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
  .c-modal-row { background: var(--off); border-radius: 12px; padding: 16px; border: 1.5px solid var(--border); }
  .c-modal-row-lbl { font-size: 12px; color: var(--ink-3); margin-bottom: 4px; }
  .c-modal-row-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 26px; color: var(--ink); }
  .c-modal-total { background: var(--amber-bg); border-radius: 12px; padding: 18px; border: 1.5px solid var(--amber-bd); }
  .c-modal-total-lbl { font-size: 12px; color: var(--amber-dk); margin-bottom: 4px; }
  .c-modal-total-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 34px; color: var(--amber-dk); }
  .c-modal-note { font-size: 12px; color: var(--ink-3); text-align: center; line-height: 1.6; }
  .c-modal-footer { padding: 16px 24px; background: var(--off); display: flex; gap: 10px; justify-content: flex-end; }
  .c-modal-cancel { padding: 10px 20px; border-radius: 10px; border: 1.5px solid var(--border); background: var(--white); font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: var(--ink-2); cursor: pointer; }
  .c-modal-cancel:hover { background: var(--off); }
  .c-modal-confirm { padding: 10px 20px; border-radius: 10px; border: none; background: var(--amber); color: #fff; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; }
  .c-modal-confirm:hover { background: var(--amber-dk); }

  .c-modal-danger .c-modal-header { background: var(--red); }
  .c-modal-danger .c-modal-header-icon { color: #fff; }
  .c-modal-danger-body { padding: 28px 24px; display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; }
  .c-modal-danger-icon { width: 64px; height: 64px; border-radius: 50%; background: var(--red-bg); border: 2px solid var(--red-bd); display: flex; align-items: center; justify-content: center; color: var(--red); font-size: 26px; }
  .c-modal-danger-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; color: var(--ink); }
  .c-modal-danger-msg { font-size: 14px; color: var(--ink-2); line-height: 1.6; max-width: 340px; }
  .c-modal-danger-hints { background: var(--off); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; width: 100%; text-align: left; }
  .c-modal-danger-hints-title { font-size: 12px; font-weight: 600; color: var(--ink); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .c-modal-danger-hint-item { display: flex; align-items: flex-start; gap: 8px; padding: 4px 0; font-size: 12px; color: var(--ink-2); }
  .c-hint-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--amber); flex-shrink: 0; margin-top: 5px; }
  .c-modal-danger-btn { width: 100%; padding: 13px; border-radius: 12px; border: none; background: var(--red); color: #fff; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .c-modal-danger-btn:hover { opacity: .88; }

  .c-toast {
    position: fixed; top: 24px; right: 24px; z-index: 100;
    border-radius: 14px; padding: 14px 20px; font-size: 13px; font-weight: 600;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,.15);
  }
  .c-toast.ok    { background: var(--green-bg); border: 1.5px solid var(--green-bd); color: var(--green); }
  .c-toast.error { background: var(--red-bg);   border: 1.5px solid var(--red-bd);   color: var(--red); }

  @media (max-width: 820px) { .c-grid { grid-template-columns: 1fr; } }
`

export default function CamaraGas() {
  const videoRef  = useRef(null)
  const canvasRef = useRef(null)

  const [mounted,          setMounted]          = useState(false)
  const [streamActive,     setStreamActive]     = useState(false)
  const [photo,            setPhoto]            = useState(null)
  const [isProcessing,     setIsProcessing]     = useState(false)
  const [processStep,      setProcessStep]      = useState('')
  const [isValid,          setIsValid]          = useState(false)
  const [status,           setStatus]           = useState(null)
  const [usuario,          setUsuario]          = useState(null)
  const [medidor,          setMedidor]          = useState(null)
  const [lecturaActual,    setLecturaActual]    = useState(null)
  const [lecturaAnterior,  setLecturaAnterior]  = useState(0)
  const [consumo,          setConsumo]          = useState(0)
  const [showPreview,      setShowPreview]      = useState(false)
  const [showInvalidModal, setShowInvalidModal] = useState(false)
  const [invalidReason,    setInvalidReason]    = useState('')
  const [toast,            setToast]            = useState(null)

  useEffect(() => { setMounted(true) }, [])

  const showToast = (type, msg) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    if (!mounted) return

    ;(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) return
        const { data: u } = await supabase.from('usuarios').select('*').eq('correo', session.user.email).single()
        setUsuario(u)
        const { data: m } = await supabase.from('medidores_gas').select('*').eq('id_usuario', u.id).single()
        setMedidor(m)
        if (m) {
          const { data: lr } = await supabase.from('lecturas_gas').select('valor_lectura')
            .eq('id_medidor', m.id).order('fecha_lectura', { ascending: false }).limit(1).single()
          setLecturaAnterior(Number(lr?.valor_lectura || 0))
        }
      } catch (e) { console.error('Supabase:', e) }
    })()

    if (!navigator.mediaDevices?.getUserMedia) {
      showToast('error', 'Tu navegador no soporta cámara.')
      return
    }

    navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
    }).then(stream => {
      const video = videoRef.current
      if (!video) return
      video.srcObject = stream
      video.onloadedmetadata = () => {
        video.play().then(() => setStreamActive(true)).catch(console.error)
      }
    }).catch(err => {
      console.error('Cámara error:', err)
      showToast('error', 'No se pudo acceder a la cámara. Verificá los permisos.')
    })

    return () => {
      if (videoRef.current?.srcObject)
        videoRef.current.srcObject.getTracks().forEach(t => t.stop())
    }
  }, [mounted])

  useEffect(() => {
    if (lecturaActual !== null && !isNaN(lecturaActual))
      setConsumo(Math.max(0, parseFloat(lecturaActual) - lecturaAnterior))
    else
      setConsumo(0)
  }, [lecturaActual, lecturaAnterior])

  const validarConIA = async (imageBase64) => {
    try {
      const b64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 200,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: b64 } },
              { type: 'text', text: 'Analizá esta imagen. ¿Es una fotografía de un medidor de gas domiciliario? Respondé SOLO con JSON sin markdown: {"es_medidor": true/false, "razon": "máximo 12 palabras en español"}' }
            ]
          }]
        })
      })
      if (!res.ok) return { es_medidor: true, razon: '' }
      const data = await res.json()
      const txt = data.content?.find(b => b.type === 'text')?.text || '{}'
      return JSON.parse(txt.replace(/```json|```/g, '').trim())
    } catch {
      return { es_medidor: true, razon: '' }
    }
  }

  const procesarFoto = async (imageData) => {
    setIsProcessing(true)
    setIsValid(false)
    setStatus(null)

    setProcessStep('Verificando imagen con IA...')
    const validacion = await validarConIA(imageData)

    if (!validacion.es_medidor) {
      setIsProcessing(false)
      setPhoto(imageData)
      setInvalidReason(validacion.razon || 'No parece ser un medidor de gas.')
      setShowInvalidModal(true)
      return
    }

    setProcessStep('Leyendo dígitos con OCR...')
    try {
      const result = await Tesseract.recognize(imageData, 'spa', { logger: () => {} })
      const nums = result.data.text.match(/\b\d{4,8}\b/g)
      const lectura = nums ? parseInt(nums[0]) : NaN

      setPhoto(imageData)
      if (!isNaN(lectura) && lectura >= 0 && lectura <= 99999999) {
        setLecturaActual(lectura)
        setIsValid(true)
        setStatus({ type: 'success', msg: `Lectura detectada: ${lectura} m³` })
      } else {
        setStatus({ type: 'error', msg: 'Medidor reconocido, pero no se pudieron leer los dígitos. Intentá con mejor luz.' })
      }
    } catch {
      setPhoto(imageData)
      setStatus({ type: 'error', msg: 'Error al procesar la imagen.' })
    }

    setIsProcessing(false)
    setProcessStep('')
  }

  const takePhoto = () => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width  = video.videoWidth  || 1280
    canvas.height = video.videoHeight || 720
    canvas.getContext('2d').drawImage(video, 0, 0)
    procesarFoto(canvas.toDataURL('image/jpeg', 0.95))
  }

  const uploadPhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file?.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onloadend = () => procesarFoto(reader.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const retakePhoto = () => {
    setPhoto(null); setIsValid(false); setLecturaActual(null)
    setStatus(null); setConsumo(0); setShowInvalidModal(false); setInvalidReason('')
  }

  const calcularTotal = () => {
    if (!usuario) return 0
    return calcularTarifaGasCompleta(consumo, usuario.tipo_usuario || 'domestico', usuario.descuento || 0).totalFinal
  }

  const generateReceipt = async () => {
    if (!usuario || !medidor || lecturaActual === null) return
    const lectNum   = Number(lecturaActual)
    const consumoM  = lectNum - lecturaAnterior
    const total     = calcularTotal()
    const fecha     = new Date()
    const numRecibo = `${medidor.numero_medidor}-${fecha.getFullYear()}${String(fecha.getMonth()+1).padStart(2,'0')}`

    try {
      await supabase.from('lecturas_gas').insert({
        id_medidor: medidor.id, id_usuario: usuario.id,
        valor_lectura: lectNum, fecha_lectura: fecha, tipo_lectura: 'camara'
      })
    } catch (e) { console.error(e); return }

    const doc = new jsPDF()
    doc.setFillColor(201, 65, 12); doc.rect(0,0,210,50,'F')
    doc.setTextColor(255,255,255); doc.setFontSize(22); doc.setFont(undefined,'bold')
    doc.text('GasNet · Recibo de Consumo de Gas', 15, 20)
    doc.setFontSize(9); doc.setFont(undefined,'normal')
    doc.text('Sistema de Digitalización · Cochabamba, Bolivia', 15, 28)
    doc.text(`N° ${numRecibo} · Fecha: ${fecha.toLocaleDateString('es-BO')}`, 15, 35)
    let y = 62
    doc.setTextColor(0,0,0); doc.setFontSize(11); doc.setFont(undefined,'bold')
    doc.text('DATOS DEL CLIENTE', 15, y); y += 10
    doc.setFontSize(9); doc.setFont(undefined,'normal')
    doc.text(`Nombre: ${usuario.nombre}`, 15, y); y += 6
    doc.text(`Medidor: ${medidor.numero_medidor} · Categoría: ${usuario.tipo_usuario}`, 15, y); y += 14
    doc.setFont(undefined,'bold'); doc.text('DETALLE DE CONSUMO', 15, y); y += 10
    doc.setFont(undefined,'normal')
    doc.text(`Lectura anterior: ${lecturaAnterior} m³`, 15, y); y += 6
    doc.text(`Lectura actual:   ${lectNum} m³`, 15, y); y += 6
    doc.text(`Consumo:          ${consumoM.toFixed(2)} m³`, 15, y); y += 14
    doc.setFillColor(201,65,12); doc.rect(15,y,180,12,'F')
    doc.setTextColor(255,255,255); doc.setFont(undefined,'bold'); doc.setFontSize(13)
    doc.text('TOTAL A PAGAR:', 20, y+8); doc.text(`Bs ${total.toFixed(2)}`, 170, y+8)
    const qrUrl = await QRCode.toDataURL(`GASNET-${numRecibo}-Bs${total.toFixed(2)}`)
    doc.addImage(qrUrl, 'PNG', 160, 30, 30, 30)
    doc.setTextColor(100,100,100); doc.setFontSize(7); doc.setFont(undefined,'normal')
    doc.text(`Generado el ${fecha.toLocaleString('es-BO')}`, 15, 280)
    doc.save(`Recibo_GasNet_${numRecibo}.pdf`)

    setShowPreview(false)
    showToast('ok', 'Recibo generado correctamente.')
    setTimeout(() => retakePhoto(), 2500)
  }

  return (
    <div className="c-root">
      <style>{css}</style>

      <div className="c-header">
        <div className="c-header-icon"><FaCamera size={22} /></div>
        <div>
          <div className="c-title">Lectura de medidor de gas</div>
          <div className="c-subtitle">Capturá o subí una foto — OCR + validación IA garantizan una lectura correcta</div>
        </div>
      </div>

      <div className="c-grid">
        <div>
          <div className="c-cam-box">
            <video
              ref={videoRef}
              className="c-cam-video"
              autoPlay playsInline muted
              style={{ opacity: (photo || isProcessing) ? 0 : 1 }}
            />
            {!streamActive && !photo && !isProcessing && (
              <div className="c-cam-placeholder">
                <FaFire size={44} />
                <p>Iniciando cámara…</p>
              </div>
            )}
            {streamActive && !photo && !isProcessing && <div className="c-cam-frame" />}
            {photo && <img src={photo} alt="Foto capturada" className="c-cam-photo" />}
            {isProcessing && (
              <div className="c-cam-overlay">
                <FaSpinner size={36} color="#f97316" style={{ animation: 'spin .7s linear infinite' }} />
                <div className="c-cam-overlay-step">{processStep}</div>
                <div className="c-cam-overlay-text">Analizando la imagen,<br />esto toma unos segundos…</div>
              </div>
            )}
            {!photo && !isProcessing && streamActive && (
              <div className="c-cam-badge live"><div className="c-live-dot" /> En vivo</div>
            )}
            {photo && isValid && !isProcessing && (
              <div className="c-cam-badge ok"><FaCheckCircle size={11} /> Lectura detectada</div>
            )}
            {photo && !isValid && !isProcessing && status?.type === 'error' && (
              <div className="c-cam-badge warn"><FaExclamationTriangle size={11} /> Sin lectura</div>
            )}
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {status && !isProcessing && (
            <div className={`c-status ${status.type}`}>
              {status.type === 'success' && <FaCheckCircle />}
              {status.type === 'error'   && <FaExclamationTriangle />}
              {status.msg}
            </div>
          )}

          <div className="c-btns">
            {!photo && !isProcessing && (
              <>
                <button className="c-btn c-btn-primary" onClick={takePhoto} disabled={!streamActive}>
                  <FaCamera /> Capturar foto
                </button>
                <label style={{ flex: 1, display: 'block' }}>
                  <span className="c-btn c-btn-sec" style={{ cursor: 'pointer' }}>
                    <FaUpload /> Subir imagen
                  </span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={uploadPhoto} />
                </label>
              </>
            )}
            {isProcessing && (
              <button className="c-btn c-btn-primary" disabled>
                <FaSpinner style={{ animation: 'spin .7s linear infinite' }} /> Procesando…
              </button>
            )}
            {photo && !isProcessing && (
              <>
                <button className="c-btn c-btn-ghost" onClick={retakePhoto}><FaRedo /> Tomar otra</button>
                {isValid && (
                  <button className="c-btn c-btn-primary" onClick={() => setShowPreview(true)}>
                    <FaFilePdf /> Generar recibo
                  </button>
                )}
              </>
            )}
          </div>

          {isValid && lecturaActual !== null && !isProcessing && (
            <div className="c-lectura-result">
              <div className="c-lectura-icon"><FaCheckCircle /></div>
              <div>
                <div className="c-lectura-lbl">Lectura detectada por OCR · validada por IA</div>
                <div className="c-lectura-num">{lecturaActual} m³</div>
                <div style={{ fontSize: 11, color: 'var(--amber-dk)', marginTop: 2 }}>
                  Consumo estimado: {consumo.toFixed(2)} m³ este período
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="c-card">
            <div className="c-card-title"><FaHashtag style={{ color: 'var(--amber)' }} /> Tu medidor</div>
            <div className="c-info-row"><span className="c-info-k">Titular</span><span className="c-info-v">{usuario?.nombre || '—'}</span></div>
            <div className="c-info-row"><span className="c-info-k">Número</span><span className="c-info-v" style={{ fontFamily: 'monospace' }}>{medidor?.numero_medidor || '—'}</span></div>
            <div className="c-info-row"><span className="c-info-k">Categoría</span><span className="c-info-v" style={{ color: 'var(--amber-dk)' }}>{usuario?.tipo_usuario || '—'}</span></div>
            <div className="c-info-row"><span className="c-info-k">Lectura anterior</span><span className="c-info-v">{lecturaAnterior} m³</span></div>
            {usuario?.descuento > 0 && (
              <div className="c-info-row"><span className="c-info-k">Descuento</span><span className="c-info-v" style={{ color: 'var(--green)' }}>{usuario.descuento}%</span></div>
            )}
          </div>

          {lecturaActual !== null && !isProcessing && (
            <div className="c-consumo-card">
              <div className="c-consumo-title"><FaChartLine style={{ color: 'var(--amber)' }} /> Consumo actual</div>
              <div className="c-consumo-row"><span className="c-consumo-k">Anterior</span><span className="c-consumo-v">{lecturaAnterior} m³</span></div>
              <div className="c-consumo-row"><span className="c-consumo-k">Actual</span><span className="c-consumo-v">{lecturaActual} m³</span></div>
              <div className="c-consumo-row"><span className="c-consumo-k">Consumo</span><span className="c-consumo-v c-consumo-total">{consumo.toFixed(2)} m³</span></div>
            </div>
          )}

          <div className="c-card" style={{ marginTop: 14 }}>
            <div className="c-card-title" style={{ fontSize: 13 }}><FaFire style={{ color: 'var(--amber)' }} /> Cómo funciona</div>
            <div className="c-steps">
              {[
                { t: 'Capturá o subí la foto',    s: 'JPG o PNG del visor del medidor' },
                { t: 'Validación con IA',          s: 'Verifica que sea un medidor de gas' },
                { t: 'Análisis OCR automático',    s: 'Detecta los dígitos automáticamente' },
                { t: 'Generá el recibo',           s: 'Descargá el PDF con un clic' },
              ].map((s, i) => (
                <div key={i} className="c-step">
                  <div className="c-step-num">{i + 1}</div>
                  <div><div className="c-step-t">{s.t}</div><div className="c-step-s">{s.s}</div></div>
                </div>
              ))}
            </div>
          </div>

          <div className="c-card" style={{ marginTop: 14 }}>
            <div className="c-tips-title"><FaInfoCircle style={{ color: 'var(--amber)' }} /> Tips para mejor lectura</div>
            {[
              'Fotografiá de frente, sin ángulo ni reflejos.',
              'Asegurate de que haya buena luz y sin sombras.',
              'Limpiá el visor antes de sacar la foto.',
            ].map((tip, i) => (
              <div key={i} className="c-tip"><div className="c-tip-dot" />{tip}</div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div className="c-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="c-modal"
              initial={{ scale: .88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .88, opacity: 0 }}>
              <div className="c-modal-header">
                <span className="c-modal-header-icon"><FaFilePdf /></span>
                <div className="c-modal-title">Confirmar y generar recibo</div>
              </div>
              <div className="c-modal-body">
                <div className="c-modal-row">
                  <div className="c-modal-row-lbl">Lectura detectada</div>
                  <div className="c-modal-row-val">{lecturaActual} m³</div>
                </div>
                <div className="c-modal-row">
                  <div className="c-modal-row-lbl">Consumo del período</div>
                  <div className="c-modal-row-val">{consumo.toFixed(2)} m³</div>
                </div>
                <div className="c-modal-total">
                  <div className="c-modal-total-lbl">Total a pagar</div>
                  <div className="c-modal-total-val">Bs {calcularTotal().toFixed(2)}</div>
                </div>
                <p className="c-modal-note">Al confirmar, la lectura quedará registrada y se descargará el PDF.</p>
              </div>
              <div className="c-modal-footer">
                <button className="c-modal-cancel" onClick={() => setShowPreview(false)}>Cancelar</button>
                <button className="c-modal-confirm" onClick={generateReceipt}><FaFilePdf /> Confirmar y descargar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInvalidModal && (
          <motion.div className="c-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="c-modal c-modal-danger"
              initial={{ scale: .88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .88, opacity: 0 }}>
              <div className="c-modal-header">
                <span className="c-modal-header-icon"><FaTimesCircle /></span>
                <div className="c-modal-title">Imagen no válida</div>
              </div>
              <div className="c-modal-danger-body">
                <div className="c-modal-danger-icon"><FaShieldAlt /></div>
                <div className="c-modal-danger-title">No es un medidor de gas</div>
                <p className="c-modal-danger-msg">{invalidReason || 'La imagen no fue reconocida como un medidor de gas domiciliario.'}</p>
                <div className="c-modal-danger-hints">
                  <div className="c-modal-danger-hints-title"><FaInfoCircle size={12} style={{ color: 'var(--amber)' }} /> Para una lectura correcta:</div>
                  {[
                    'Fotografiá el visor numérico del medidor de gas',
                    'Los dígitos deben ser visibles y nítidos',
                    'Evitá reflejos, sombras o imágenes borrosas',
                    'No subas facturas, pantallas u otros objetos',
                  ].map((h, i) => (
                    <div key={i} className="c-modal-danger-hint-item"><div className="c-hint-dot" />{h}</div>
                  ))}
                </div>
                <button className="c-modal-danger-btn" onClick={retakePhoto}><FaRedo /> Tomar otra foto</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div className={`c-toast ${toast.type}`}
            initial={{ opacity: 0, y: -30, scale: .9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: .9 }}>
            {toast.type === 'ok' ? <FaCheckCircle /> : <FaExclamationTriangle />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}