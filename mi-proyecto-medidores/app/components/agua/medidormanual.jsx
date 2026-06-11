'use client'

import { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from 'qrcode'
import { FaClipboardCheck, FaTint, FaFilePdf, FaCheckCircle, FaChartLine, FaDollarSign, FaHashtag, FaExclamationTriangle } from 'react-icons/fa'
import { supabase } from '@/lib/supabaseClient'
import { calcularTarifaCompleta } from '@/lib/tariffUtils'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  .m-root {
    --white:     #ffffff;
    --off:       #f9f9f8;
    --border:    #ebebea;
    --border-md: #d4d4d0;
    --ink:       #111110;
    --ink-2:     #3a3a38;
    --ink-3:     #737370;
    --ink-4:     #b0b0ac;
    --teal:      #00a67e;
    --teal-dk:   #007a5e;
    --teal-bg:   #e6f7f2;
    --teal-bd:   #b3e8d8;
    --indigo:    #4f46e5;
    --indigo-bg: #eef0fd;
    --indigo-bd: #c7c3f7;
    --amber:     #d97706;
    --amber-bg:  #fffbeb;
    --amber-bd:  #fde68a;
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

  /* ── HEADER ── */
  .m-header {
    display: flex; align-items: center; gap: 16px;
    padding-bottom: 24px; border-bottom: 1.5px solid var(--border); margin-bottom: 28px;
  }
  .m-header-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--ink); display: flex; align-items: center;
    justify-content: center; color: var(--teal); flex-shrink: 0;
  }
  .m-title {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 28px;
    color: var(--ink); letter-spacing: -.02em; line-height: 1.1;
  }
  .m-subtitle { font-size: 13px; color: var(--ink-3); margin-top: 4px; }

  /* ── GRID ── */
  .m-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media (max-width: 820px) { .m-grid { grid-template-columns: 1fr; } }

  /* ── CARD ── */
  .m-card {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 16px; overflow: hidden;
  }
  .m-card-head {
    background: var(--ink); padding: 18px 22px;
    display: flex; align-items: center; gap: 10px;
  }
  .m-card-head-title {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: #fff;
  }
  .m-card-head-sub { font-size: 12px; color: rgba(255,255,255,.4); margin-top: 2px; }
  .m-card-body { padding: 22px; }

  /* ── INFO BOX ── */
  .m-info-box {
    background: var(--teal-bg); border: 1.5px solid var(--teal-bd);
    border-radius: 12px; padding: 14px 16px; margin-bottom: 20px;
    font-size: 13px; color: var(--teal-dk); line-height: 1.55;
  }
  .m-info-box strong { font-weight: 600; }

  /* ── LABEL ── */
  .m-label {
    font-size: 10px; font-weight: 600; letter-spacing: .08em;
    text-transform: uppercase; color: var(--ink-4); margin-bottom: 7px; display: block;
  }

  /* ── INPUT ── */
  .m-input-wrap {
    display: flex; align-items: center; gap: 10px;
    background: var(--off); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 0 16px; height: 56px;
    transition: border-color .15s, background .15s;
  }
  .m-input-wrap:focus-within {
    border-color: var(--teal); background: var(--white);
  }
  .m-input-wrap svg { color: var(--ink-4); font-size: 14px; flex-shrink: 0; }
  .m-input-wrap input {
    border: none; outline: none; background: transparent;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 22px;
    color: var(--ink); width: 100%; letter-spacing: .02em;
  }
  .m-input-hint {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 7px; font-size: 12px; color: var(--ink-3);
  }
  .m-input-valid { color: var(--green); font-weight: 600; display: flex; align-items: center; gap: 5px; }

  /* ── PREVIEW ── */
  .m-preview {
    background: var(--teal-bg); border: 1.5px solid var(--teal-bd);
    border-radius: 12px; padding: 16px 18px; margin-top: 16px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .m-preview-lbl { font-size: 11px; font-weight: 600; letter-spacing: .07em; text-transform: uppercase; color: var(--teal-dk); margin-bottom: 4px; }
  .m-preview-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 26px; color: var(--teal-dk); }

  /* ── ALERTA ── */
  .m-alert {
    background: var(--amber-bg); border: 1.5px solid var(--amber-bd);
    border-radius: 12px; padding: 14px 16px; margin-top: 16px;
    display: flex; align-items: flex-start; gap: 10px;
  }
  .m-alert-icon { color: var(--amber); margin-top: 1px; flex-shrink: 0; }
  .m-alert-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; color: var(--amber); margin-bottom: 2px; }
  .m-alert-body { font-size: 12px; color: var(--ink-2); line-height: 1.5; }

  /* ── MENSAJE ── */
  .m-msg {
    border-radius: 10px; padding: 13px 16px; margin-top: 14px;
    font-size: 13px; font-weight: 500; border-left: 3px solid;
  }
  .m-msg.ok  { background: var(--green-bg); border-color: var(--green); color: var(--green); }
  .m-msg.err { background: var(--red-bg);   border-color: var(--red);   color: var(--red);   }

  /* ── BTN ── */
  .m-btn {
    width: 100%; height: 48px; border-radius: 12px; border: none; cursor: pointer;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity .15s, transform .1s;
  }
  .m-btn:active { transform: scale(.98); }
  .m-btn-primary { background: var(--ink); color: #fff; margin-top: 20px; }
  .m-btn-primary:hover { opacity: .88; }
  .m-btn-pdf { background: var(--teal); color: #fff; margin-top: 12px; }
  .m-btn-pdf:hover { background: var(--teal-dk); }

  /* ── RESUMEN ── */
  .m-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 0; border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .m-row:last-child { border-bottom: none; }
  .m-row-lbl { color: var(--ink-3); }
  .m-row-val { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: var(--ink); }

  /* ── STAT CARDS ── */
  .m-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
  .m-stat {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 14px; padding: 18px 16px;
    transition: border-color .2s, transform .15s;
  }
  .m-stat:hover { border-color: var(--border-md); transform: translateY(-2px); }
  .m-stat-icon {
    width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; margin-bottom: 10px;
  }
  .icon-teal  { background: var(--teal-bg);   color: var(--teal);   }
  .icon-ind   { background: var(--indigo-bg); color: var(--indigo); }
  .m-stat-lbl { font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-4); margin-bottom: 5px; }
  .m-stat-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; color: var(--ink); letter-spacing: -.02em; }
  .m-stat-sub { font-size: 11px; color: var(--ink-3); margin-top: 4px; }

  /* ── TOTAL CARD ── */
  .m-total-card {
    background: var(--ink); border-radius: 14px; padding: 22px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .m-total-lbl { font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: rgba(255,255,255,.4); margin-bottom: 6px; }
  .m-total-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 32px; color: var(--teal); letter-spacing: -.02em; }
  .m-total-sub { font-size: 12px; color: rgba(255,255,255,.4); margin-top: 8px; line-height: 1.5; }
  .m-total-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(255,255,255,.08); display: flex; align-items: center; justify-content: center; color: var(--teal); font-size: 20px; }

  /* ── MEDIDOR VISUAL ── */
  .m-meter-display {
    background: var(--off); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 14px 18px; margin-bottom: 16px;
    display: flex; align-items: center; gap: 14px;
  }
  .m-meter-screen {
    background: var(--ink); color: var(--teal);
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px;
    letter-spacing: .12em; padding: 8px 14px; border-radius: 8px;
    border: 2px solid var(--border-md); flex-shrink: 0;
  }
  .m-meter-label { font-size: 12px; color: var(--ink-3); line-height: 1.5; }
  .m-meter-label strong { color: var(--ink-2); }

  /* ── TOAST ── */
  .m-toast {
    position: fixed; bottom: 24px; right: 24px;
    background: var(--ink); color: #fff;
    padding: 12px 20px; border-radius: 12px;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,.2);
    border-left: 3px solid var(--teal);
    z-index: 999;
  }
`

export default function MedidorManual() {
  const [usuario, setUsuario] = useState(null)
  const [medidor, setMedidor] = useState(null)
  const [lectura, setLectura] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [pdfGenerado, setPdfGenerado] = useState(false)
  const [lecturaAnterior, setLecturaAnterior] = useState(0)
  const [consumoCalculado, setConsumoCalculado] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user
        if (!user) return

        const { data: userData } = await supabase
          .from('usuarios').select('*').eq('correo', user.email).single()
        setUsuario(userData)

        const { data: medidorData } = await supabase
          .from('medidores').select('*').eq('id_usuario', userData.id).single()
        setMedidor(medidorData)

        if (medidorData) {
          const { data: lastReading } = await supabase
            .from('lecturas').select('valor_lectura')
            .eq('id_medidor', medidorData.id)
            .order('fecha_lectura', { ascending: false })
            .limit(1).single()
          setLecturaAnterior(lastReading?.valor_lectura || 0)
        }
      } catch (err) { console.error('Error:', err) }
    }
    fetchUsuario()
  }, [])

  useEffect(() => {
    if (lectura && !isNaN(lectura)) {
      setConsumoCalculado(Math.max(0, parseFloat(lectura) - lecturaAnterior))
    } else {
      setConsumoCalculado(0)
    }
  }, [lectura, lecturaAnterior])

  const validarLectura = async () => {
    if (!lectura || isNaN(lectura) || lectura <= 0) {
      setMensaje('err:Ingresá una lectura válida mayor que 0.')
      return
    }
    if (!usuario || !medidor) {
      setMensaje('err:No se pudo obtener usuario o medidor.')
      return
    }
    const consumoMes = parseFloat(lectura) - lecturaAnterior
    if (consumoMes < 0) {
      setMensaje('err:La lectura actual no puede ser menor a la anterior.')
      return
    }
    const { error } = await supabase.from('lecturas').insert([{
      id_medidor: medidor.id,
      id_usuario: usuario.id,
      valor_lectura: parseFloat(lectura),
      tipo_lectura: 'manual'
    }])
    if (error) { setMensaje('err:Error guardando la lectura.'); return }
    setPdfGenerado(true)
    setMensaje(`ok:Lectura registrada. Consumo: ${consumoMes.toFixed(2)} m³`)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const calcularTotal = () => {
    const consumo = Math.max(consumoCalculado, 0)
    if (!usuario) return '0.00'
    const tarifa = calcularTarifaCompleta(consumo, usuario.tipo_usuario || 'domestico', usuario.descuento || 0)
    return tarifa.totalFinal.toFixed(2)
  }

  const generarPDF = async () => {
    if (!usuario || !medidor) return
    const consumo = Math.max(consumoCalculado, 0)
    const tarifa = calcularTarifaCompleta(consumo, usuario.tipo_usuario || 'domestico', usuario.descuento || 0)
    const fechaActual = new Date()
    const mesActual = fechaActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    const numeroRecibo = `${medidor.numero_medidor}-${fechaActual.getFullYear()}${String(fechaActual.getMonth() + 1).padStart(2, '0')}`
    const fechaVencimiento = new Date(fechaActual)
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 15)

    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const W = 210

    // ── HEADER ──────────────────────────────────────────────────
    doc.setFillColor(10, 36, 72)
    doc.rect(0, 0, W, 48, 'F')
    doc.setFillColor(0, 166, 126)
    doc.rect(0, 0, 5, 48, 'F')
    doc.setFillColor(0, 166, 126)
    doc.rect(0, 46, W, 2, 'F')

    // Ícono círculo teal
    doc.setFillColor(0, 166, 126)
    doc.circle(22, 24, 10, 'F')
    doc.setTextColor(10, 36, 72)
    doc.setFontSize(16); doc.setFont('helvetica', 'bold')
    doc.text('~', 18.5, 27)

    // Títulos header
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(17); doc.setFont('helvetica', 'bold')
    doc.text('Administración de Consumo por Sector', 37, 20)
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal')
    doc.setTextColor(180, 210, 230)
    doc.text('Servicio Municipal de Agua Potable · Cochabamba, Bolivia', 37, 27)
    doc.setFontSize(7.5)
    doc.text('NIT: 176695020  |  Tel: (4) 4258000  |  www.acs.gob.bo', 37, 33)

    // Caja número recibo
    doc.setFillColor(0, 100, 80)
    doc.roundedRect(135, 10, 63, 28, 3, 3, 'F')
    doc.setTextColor(0, 255, 180)
    doc.setFontSize(7); doc.setFont('helvetica', 'bold')
    doc.text('RECIBO DE CONSUMO', 166, 18, { align: 'center' })
    doc.setFontSize(9); doc.setTextColor(255, 255, 255)
    doc.text(`Nº ${numeroRecibo}`, 166, 25, { align: 'center' })
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal')
    doc.text(`Período: ${mesActual}`, 166, 32, { align: 'center' })

    // ── DATOS DEL CLIENTE ────────────────────────────────────────
    let y = 56
    doc.setFillColor(240, 245, 250)
    doc.roundedRect(12, y, W - 24, 44, 3, 3, 'F')
    doc.setDrawColor(200, 218, 235)
    doc.setLineWidth(0.4)
    doc.roundedRect(12, y, W - 24, 44, 3, 3, 'S')

    doc.setFillColor(10, 36, 72)
    doc.roundedRect(12, y, 54, 7, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(7); doc.setFont('helvetica', 'bold')
    doc.text('DATOS DEL CLIENTE', 39, y + 5, { align: 'center' })

    y += 13
    const campos = [
      { l: 'Nombre:',    v: usuario.nombre?.toUpperCase() || 'N/A',           col: 0 },
      { l: 'Dirección:', v: medidor.direccion || 'N/A',                        col: 0 },
      { l: 'Nº Medidor:', v: medidor.numero_medidor,                           col: 1 },
      { l: 'Categoría:', v: (usuario.tipo_usuario || 'domestico').toUpperCase(), col: 1 },
    ]
    let rowLeft = 0, rowRight = 0
    campos.forEach(c => {
      const cx = c.col === 0 ? 18 : 115
      const cy = y + (c.col === 0 ? rowLeft : rowRight) * 9
      doc.setTextColor(120, 130, 145); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5)
      doc.text(c.l, cx, cy)
      doc.setTextColor(20, 30, 50); doc.setFont('helvetica', 'bold'); doc.setFontSize(9)
      doc.text(c.v, cx + 24, cy)
      if (c.col === 0) rowLeft++; else rowRight++
    })

    // ── LECTURA DEL MEDIDOR ──────────────────────────────────────
    y = 112
    doc.setFillColor(10, 36, 72)
    doc.roundedRect(12, y, W - 24, 8, 2, 2, 'F')
    doc.setFillColor(0, 166, 126)
    doc.roundedRect(12, y, 4, 8, 1, 1, 'F')
    doc.setTextColor(255, 255, 255); doc.setFontSize(8); doc.setFont('helvetica', 'bold')
    doc.text('LECTURA DEL MEDIDOR', 20, y + 5.5)

    y += 11
    const tarjetas = [
      { l: 'LECTURA ANTERIOR', v: String(lecturaAnterior), bg: [230, 240, 255] },
      { l: 'LECTURA ACTUAL',   v: String(lectura),          bg: [220, 255, 240] },
      { l: 'CONSUMO DEL MES',  v: `${consumo.toFixed(2)} m³`, bg: [255, 245, 215] },
    ]
    tarjetas.forEach((t, i) => {
      const bx = 12 + i * 62
      doc.setFillColor(...t.bg)
      doc.roundedRect(bx, y, 58, 26, 3, 3, 'F')
      doc.setDrawColor(190, 205, 220); doc.setLineWidth(0.3)
      doc.roundedRect(bx, y, 58, 26, 3, 3, 'S')
      doc.setTextColor(80, 95, 115); doc.setFontSize(6.5); doc.setFont('helvetica', 'bold')
      doc.text(t.l, bx + 29, y + 7, { align: 'center' })
      doc.setTextColor(10, 36, 72); doc.setFontSize(16); doc.setFont('helvetica', 'bold')
      doc.text(t.v, bx + 29, y + 20, { align: 'center' })
    })

    // ── TARIFA PROGRESIVA ────────────────────────────────────────
    y += 34
    doc.setFillColor(10, 36, 72)
    doc.roundedRect(12, y, W - 24, 8, 2, 2, 'F')
    doc.setFillColor(0, 166, 126)
    doc.roundedRect(12, y, 4, 8, 1, 1, 'F')
    doc.setTextColor(255, 255, 255); doc.setFontSize(8); doc.setFont('helvetica', 'bold')
    doc.text('DETALLE DE TARIFA PROGRESIVA', 20, y + 5.5)

    y += 10
    // Cabecera tabla
    doc.setFillColor(225, 235, 248)
    doc.rect(12, y, W - 24, 7, 'F')
    doc.setTextColor(10, 36, 72); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold')
    doc.text('Bloque',        22, y + 5)
    doc.text('Consumo',       88, y + 5, { align: 'center' })
    doc.text('Tarifa Bs/m³', 130, y + 5, { align: 'center' })
    doc.text('Subtotal Bs',  175, y + 5, { align: 'right' })

    y += 7
    const bloques = [
      { r: '0 – 10 m³',  cant: Math.min(consumo, 10),                   t: 1.50 },
      { r: '11 – 20 m³', cant: Math.max(0, Math.min(consumo - 10, 10)), t: 2.00 },
      { r: '21 – 30 m³', cant: Math.max(0, Math.min(consumo - 20, 10)), t: 3.00 },
      { r: '31+ m³',     cant: Math.max(0, consumo - 30),               t: 5.00 },
    ].filter(b => b.cant > 0)

    bloques.forEach((b, i) => {
      if (i % 2 === 0) { doc.setFillColor(248, 251, 255); doc.rect(12, y, W - 24, 7, 'F') }
      doc.setDrawColor(220, 228, 238); doc.setLineWidth(0.2)
      doc.rect(12, y, W - 24, 7, 'S')
      doc.setTextColor(30, 42, 62); doc.setFontSize(8.5); doc.setFont('helvetica', 'normal')
      doc.text(b.r,                   22, y + 5)
      doc.text(`${b.cant.toFixed(2)} m³`, 88, y + 5, { align: 'center' })
      doc.text(`${b.t.toFixed(2)}`,   130, y + 5, { align: 'center' })
      doc.setFont('helvetica', 'bold')
      doc.text(`${(b.cant * b.t).toFixed(2)}`, 175, y + 5, { align: 'right' })
      y += 7
    })

    // Cargo fijo
    if (tarifa.cargoFijo > 0) {
      doc.setFillColor(248, 251, 255); doc.rect(12, y, W - 24, 7, 'F')
      doc.setDrawColor(220, 228, 238); doc.rect(12, y, W - 24, 7, 'S')
      doc.setTextColor(30, 42, 62); doc.setFontSize(8.5); doc.setFont('helvetica', 'italic')
      doc.text('Cargo fijo mensual', 22, y + 5)
      doc.setFont('helvetica', 'bold')
      doc.text(`${tarifa.cargoFijo.toFixed(2)}`, 175, y + 5, { align: 'right' })
      y += 7
    }

    // Descuento
    if (usuario.descuento > 0) {
      const montoDesc = (tarifa.totalSinDescuento - tarifa.totalFinal).toFixed(2)
      doc.setFillColor(230, 255, 240); doc.rect(12, y, W - 24, 7, 'F')
      doc.setDrawColor(180, 230, 200); doc.rect(12, y, W - 24, 7, 'S')
      doc.setTextColor(0, 110, 60); doc.setFontSize(8.5); doc.setFont('helvetica', 'italic')
      doc.text(`Descuento (${(usuario.descuento * 100).toFixed(0)}%)`, 22, y + 5)
      doc.setFont('helvetica', 'bold')
      doc.text(`- ${montoDesc}`, 175, y + 5, { align: 'right' })
      y += 7
    }

    // ── TOTALES ──────────────────────────────────────────────────
    y += 5
    doc.setDrawColor(200, 215, 230); doc.setLineWidth(0.3)
    doc.line(110, y, W - 12, y)
    y += 6
    doc.setTextColor(80, 95, 115); doc.setFontSize(9); doc.setFont('helvetica', 'normal')
    doc.text('Subtotal:', 132, y)
    doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 42, 62)
    doc.text(`Bs ${tarifa.subtotal.toFixed(2)}`, 175, y, { align: 'right' })

    y += 9
    doc.setFillColor(10, 36, 72)
    doc.roundedRect(110, y - 6, W - 122, 16, 3, 3, 'F')
    doc.setFillColor(0, 166, 126)
    doc.roundedRect(110, y - 6, 4, 16, 1, 1, 'F')
    doc.setTextColor(180, 210, 230); doc.setFontSize(9); doc.setFont('helvetica', 'bold')
    doc.text('TOTAL A PAGAR:', 120, y + 3)
    doc.setTextColor(0, 255, 190); doc.setFontSize(13)
    doc.text(`Bs ${tarifa.totalFinal.toFixed(2)}`, 193, y + 4, { align: 'right' })

    // ── VENCIMIENTO + QR ─────────────────────────────────────────
    y += 18
    doc.setFillColor(255, 247, 228)
    doc.roundedRect(12, y, 105, 16, 3, 3, 'F')
    doc.setDrawColor(240, 160, 0); doc.setLineWidth(0.4)
    doc.roundedRect(12, y, 105, 16, 3, 3, 'S')
    doc.setTextColor(160, 90, 0); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold')
    doc.text('FECHA DE VENCIMIENTO', 64, y + 6, { align: 'center' })
    doc.setFontSize(10); doc.setTextColor(180, 80, 0)
    doc.text(
      fechaVencimiento.toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' }),
      64, y + 13, { align: 'center' }
    )

    // QR
    try {
      const qrData = `ACS|${numeroRecibo}|${usuario.nombre}|${consumo}m3|Bs${tarifa.totalFinal.toFixed(2)}|Vence:${fechaVencimiento.toLocaleDateString('es-BO')}`
      const qrUrl = await QRCode.toDataURL(qrData, { width: 80, margin: 1 })
      doc.addImage(qrUrl, 'PNG', 158, y - 4, 32, 32)
      doc.setTextColor(110, 120, 135); doc.setFontSize(6.5); doc.setFont('helvetica', 'normal')
      doc.text('Escanear para verificar', 174, y + 30, { align: 'center' })
    } catch (e) { console.error('QR error', e) }

    // ── FORMAS DE PAGO ───────────────────────────────────────────
    y += 24
    doc.setFillColor(245, 248, 253)
    doc.roundedRect(12, y, 140, 24, 3, 3, 'F')
    doc.setDrawColor(210, 222, 238); doc.setLineWidth(0.3)
    doc.roundedRect(12, y, 140, 24, 3, 3, 'S')
    doc.setFillColor(10, 36, 72)
    doc.roundedRect(12, y, 42, 7, 2, 2, 'F')
    doc.setTextColor(255, 255, 255); doc.setFontSize(7); doc.setFont('helvetica', 'bold')
    doc.text('FORMAS DE PAGO', 33, y + 5, { align: 'center' })
    doc.setFont('helvetica', 'normal'); doc.setTextColor(50, 65, 90); doc.setFontSize(7.5)
    doc.text('• Oficinas ACS: Lunes a Viernes 8:00 – 17:00', 17, y + 13)
    doc.text('• Bancos: Banco Unión, BNB, Banco FIE, Mercantil Santa Cruz', 17, y + 19)
    doc.text('• Pago en línea: www.acs.gob.bo', 17, y + 25)

    // ── PIE DE PÁGINA ────────────────────────────────────────────
    doc.setFillColor(10, 36, 72)
    doc.rect(0, 278, W, 19, 'F')
    doc.setFillColor(0, 166, 126)
    doc.rect(0, 278, W, 2, 'F')
    doc.setTextColor(150, 180, 210); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal')
    doc.text(
      'Administración de Consumo por Sector  ·  (4) 4258000  ·  info@acs.gob.bo  ·  www.acs.gob.bo',
      W / 2, 286, { align: 'center' }
    )
    doc.setTextColor(80, 110, 145); doc.setFontSize(6.5)
    doc.text(
      `Documento generado: ${fechaActual.toLocaleString('es-BO')}  ·  Válido con sello y firma oficial`,
      W / 2, 292, { align: 'center' }
    )

    doc.save(`Recibo_ACS_${numeroRecibo}.pdf`)
  }

  const [msgTipo, msgTexto] = mensaje.includes(':') ? mensaje.split(/:(.+)/) : ['', mensaje]
  const lecturaValida = lectura && !isNaN(lectura) && parseFloat(lectura) > lecturaAnterior
  const consumoVisible = consumoCalculado > 0 && consumoCalculado < 1000

  return (
    <div className="m-root">
      <style>{css}</style>

      {/* HEADER */}
      <div className="m-header">
        <div className="m-header-icon"><FaTint size={22} /></div>
        <div>
          <div className="m-title">Registro de lectura</div>
          <div className="m-subtitle">Ingresá la lectura actual de tu medidor físico · Administración de Consumo por Sector</div>
        </div>
      </div>

      <div className="m-grid">

        {/* ── COLUMNA IZQUIERDA ── */}
        <div>
          <div className="m-card" style={{ marginBottom: 20 }}>
            <div className="m-card-head">
              <FaClipboardCheck size={14} color="rgba(255,255,255,.6)" />
              <div>
                <div className="m-card-head-title">Ingresar lectura del medidor</div>
                <div className="m-card-head-sub">Escribí el número que aparece en la pantalla</div>
              </div>
            </div>
            <div className="m-card-body">

              <div className="m-info-box">
                <strong>¿Cómo leer tu medidor?</strong> El medidor tiene una pantalla con números que aumentan continuamente.
                Si muestra <strong>85045</strong>, ingresá ese número exacto. El sistema calcula tu consumo automáticamente.
              </div>

              <div className="m-meter-display">
                <div className="m-meter-screen">
                  {lecturaAnterior > 0 ? String(lecturaAnterior + 15).padStart(8, '0') : '00085045'}
                </div>
                <div className="m-meter-label">
                  Ejemplo de lectura<br />
                  <strong>Ingresá EXACTAMENTE lo que ves en tu medidor</strong>
                </div>
              </div>

              <label className="m-label">Lectura actual del medidor</label>
              <div className="m-input-wrap">
                <FaHashtag />
                <input
                  type="number"
                  value={lectura}
                  onChange={e => setLectura(e.target.value)}
                  placeholder={lecturaAnterior > 0 ? `Mayor a ${lecturaAnterior}` : 'Ej: 85045'}
                />
              </div>
              <div className="m-input-hint">
                <span>Lectura anterior: <strong style={{ color: 'var(--ink-2)' }}>{lecturaAnterior} m³</strong></span>
                {lecturaValida && (
                  <span className="m-input-valid"><FaCheckCircle size={11} /> Válida</span>
                )}
              </div>

              {consumoVisible && (
                <motion.div
                  className="m-preview"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div>
                    <div className="m-preview-lbl">Consumo estimado</div>
                    <div className="m-preview-val">{consumoCalculado.toFixed(2)} m³</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="m-preview-lbl">Total aprox.</div>
                    <div className="m-preview-val">Bs {calcularTotal()}</div>
                  </div>
                </motion.div>
              )}

              {consumoCalculado > 100 && (
                <motion.div className="m-alert" initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }}>
                  <FaExclamationTriangle className="m-alert-icon" size={14} />
                  <div>
                    <div className="m-alert-title">Consumo inusualmente alto</div>
                    <div className="m-alert-body">
                      {consumoCalculado.toFixed(2)} m³ es muy elevado. Verificá que hayas ingresado la lectura correcta.
                    </div>
                  </div>
                </motion.div>
              )}

              <button className="m-btn m-btn-primary" onClick={validarLectura}>
                <FaClipboardCheck size={14} /> Registrar lectura
              </button>

              <AnimatePresence mode="wait">
                {msgTexto && (
                  <motion.div
                    className={`m-msg ${msgTipo}`}
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  >
                    {msgTexto}
                  </motion.div>
                )}
              </AnimatePresence>

              {pdfGenerado && (
                <motion.button
                  className="m-btn m-btn-pdf"
                  onClick={generarPDF}
                  initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }}
                >
                  <FaFilePdf size={14} /> Descargar recibo PDF
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* ── COLUMNA DERECHA ── */}
        <div>
          <div className="m-card" style={{ marginBottom: 16 }}>
            <div className="m-card-head">
              <FaTint size={14} color="rgba(255,255,255,.6)" />
              <div>
                <div className="m-card-head-title">Resumen del medidor</div>
              </div>
            </div>
            <div className="m-card-body" style={{ padding: '6px 22px 18px' }}>
              {[
                { l: 'Usuario',     v: usuario?.nombre || 'Cargando…' },
                { l: 'Nº medidor',  v: medidor?.numero_medidor || 'N/A' },
                { l: 'Dirección',   v: medidor?.direccion || 'N/A' },
                { l: 'Categoría',   v: (usuario?.tipo_usuario || 'N/A').toUpperCase() },
              ].map((r, i) => (
                <div key={i} className="m-row">
                  <span className="m-row-lbl">{r.l}</span>
                  <span className="m-row-val">{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="m-stats">
            <div className="m-stat">
              <div className="m-stat-icon icon-teal"><FaChartLine /></div>
              <div className="m-stat-lbl">Lectura anterior</div>
              <div className="m-stat-val">{lecturaAnterior}</div>
              <div className="m-stat-sub">Último registro</div>
            </div>
            <div className="m-stat">
              <div className="m-stat-icon icon-ind"><FaTint /></div>
              <div className="m-stat-lbl">Consumo calculado</div>
              <div className="m-stat-val">{consumoVisible ? consumoCalculado.toFixed(1) : '0.00'} m³</div>
              <div className="m-stat-sub">Este período</div>
            </div>
          </div>

          <div className="m-total-card">
            <div>
              <div className="m-total-lbl">Total a pagar</div>
              <div className="m-total-val">Bs {calcularTotal()}</div>
              <div className="m-total-sub">
                Tarifa progresiva ACS
                {usuario?.descuento > 0 && ` · Descuento ${(usuario.descuento * 100).toFixed(0)}% aplicado`}
              </div>
            </div>
            <div className="m-total-icon"><FaDollarSign /></div>
          </div>
        </div>

      </div>

      {/* TOAST */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="m-toast"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
          >
            <FaCheckCircle color="var(--teal)" /> Lectura registrada con éxito
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}