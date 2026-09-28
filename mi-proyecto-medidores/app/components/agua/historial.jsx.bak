'use client'

import { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, BarChart, Bar
} from 'recharts'
import {
  FaFilePdf, FaCalendarAlt, FaTint, FaArrowUp, FaArrowDown,
  FaDollarSign, FaInfoCircle, FaFileInvoiceDollar, FaWater
} from 'react-icons/fa'
import { supabase } from '@/lib/supabaseClient'
import { calcularTarifaCompleta } from '@/lib/tariffUtils'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  .h-root {
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

  /* ── LOADER ── */
  .h-loader {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 80px 40px; gap: 16px;
  }
  .h-ring {
    width: 44px; height: 44px;
    border: 2.5px solid var(--border);
    border-top-color: var(--teal);
    border-radius: 50%;
    animation: hspin .65s linear infinite;
  }
  @keyframes hspin { to { transform: rotate(360deg); } }
  .h-ring-lbl { font-size: 12px; color: var(--ink-4); letter-spacing: .1em; text-transform: uppercase; }

  /* ── HEADER ── */
  .h-header {
    display: flex; align-items: center; gap: 16px;
    padding-bottom: 24px; border-bottom: 1.5px solid var(--border); margin-bottom: 28px;
  }
  .h-header-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--ink); display: flex; align-items: center;
    justify-content: center; color: var(--teal); flex-shrink: 0;
  }
  .h-title {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 28px;
    color: var(--ink); letter-spacing: -.02em; line-height: 1.1;
  }
  .h-subtitle { font-size: 13px; color: var(--ink-3); margin-top: 4px; }

  /* ── CLIENTE CARD ── */
  .h-cliente {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 16px; padding: 18px 22px; margin-bottom: 24px;
    display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
  }
  .h-cliente-avatar {
    width: 44px; height: 44px; border-radius: 11px;
    background: var(--teal); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px;
    flex-shrink: 0;
  }
  .h-cliente-info { flex: 1; min-width: 0; }
  .h-cliente-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: var(--ink); }
  .h-cliente-meta { font-size: 12px; color: var(--ink-3); margin-top: 2px; }
  .h-cliente-badge {
    padding: 5px 14px; border-radius: 99px; font-size: 12px; font-weight: 600;
    background: var(--teal-bg); color: var(--teal-dk); border: 1px solid var(--teal-bd);
  }

  /* ── STAT STRIP ── */
  .h-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .h-stat {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 16px; padding: 20px 18px;
    transition: border-color .2s, transform .15s;
  }
  .h-stat:hover { border-color: var(--border-md); transform: translateY(-2px); }
  .h-stat-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px; font-size: 15px;
  }
  .icon-teal  { background: var(--teal-bg);   color: var(--teal);   }
  .icon-red   { background: var(--red-bg);    color: var(--red);    }
  .icon-green { background: var(--green-bg);  color: var(--green);  }
  .icon-ind   { background: var(--indigo-bg); color: var(--indigo); }
  .h-stat-lbl { font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-4); margin-bottom: 6px; }
  .h-stat-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 24px; color: var(--ink); letter-spacing: -.02em; line-height: 1; }
  .h-stat-sub { font-size: 12px; color: var(--ink-3); margin-top: 5px; }

  /* ── TENDENCIA ── */
  .h-tend {
    border-radius: 14px; padding: 16px 20px; margin-bottom: 24px;
    display: flex; align-items: flex-start; gap: 14px;
    border: 1.5px solid;
  }
  .h-tend.up   { background: var(--red-bg);   border-color: var(--red-bd);   }
  .h-tend.down { background: var(--green-bg); border-color: var(--green-bd); }
  .h-tend-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .h-tend.up   .h-tend-icon { background: var(--red-bd);   color: var(--red);   }
  .h-tend.down .h-tend-icon { background: var(--green-bd); color: var(--green); }
  .h-tend-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; margin-bottom: 3px; }
  .h-tend.up   .h-tend-title { color: var(--red);   }
  .h-tend.down .h-tend-title { color: var(--green); }
  .h-tend-body { font-size: 13px; color: var(--ink-2); line-height: 1.5; }
  .h-tend-tip  { font-size: 12px; color: var(--ink-3); margin-top: 6px; }

  /* ── CONTROLES ── */
  .h-controls {
    display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;
  }
  .h-input-wrap {
    display: flex; align-items: center; gap: 8px;
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 10px; padding: 0 12px; height: 38px;
    transition: border-color .15s;
  }
  .h-input-wrap:focus-within { border-color: var(--teal); }
  .h-input-wrap svg { color: var(--ink-3); font-size: 13px; }
  .h-input-wrap input {
    border: none; outline: none; background: transparent;
    font-family: 'Inter', sans-serif; font-size: 13px; color: var(--ink);
  }
  .h-tabs { display: flex; gap: 4px; margin-left: auto; }
  .h-tab {
    padding: 7px 16px; border-radius: 8px; border: 1.5px solid var(--border);
    background: transparent; font-family: 'Inter', sans-serif; font-size: 12px;
    font-weight: 500; color: var(--ink-3); cursor: pointer; transition: all .15s;
  }
  .h-tab:hover { background: var(--off); color: var(--ink); }
  .h-tab.on { background: var(--ink); color: #fff; border-color: var(--ink); }

  /* ── GRÁFICO ── */
  .h-chart-wrap {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 16px; padding: 24px; margin-bottom: 24px;
  }
  .h-chart-title {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px;
    color: var(--ink); margin-bottom: 4px;
  }
  .h-chart-sub { font-size: 12px; color: var(--ink-3); margin-bottom: 20px; }

  /* ── TABLA ── */
  .h-table-wrap {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 16px; overflow: hidden; margin-bottom: 24px;
  }
  .h-table-head {
    background: var(--ink); padding: 18px 24px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .h-table-head-title {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: #fff;
    display: flex; align-items: center; gap: 10px;
  }
  .h-table-head-count { font-size: 12px; color: rgba(255,255,255,.4); margin-top: 2px; }

  table.h-table { width: 100%; border-collapse: collapse; }
  table.h-table thead tr {
    background: var(--off); border-bottom: 1.5px solid var(--border);
  }
  table.h-table thead th {
    padding: 12px 20px; text-align: left; font-size: 10px; font-weight: 600;
    letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3);
  }
  table.h-table tbody tr {
    border-bottom: 1px solid var(--border); transition: background .12s;
  }
  table.h-table tbody tr:last-child { border-bottom: none; }
  table.h-table tbody tr:hover { background: var(--teal-bg); }
  table.h-table td { padding: 14px 20px; vertical-align: middle; }

  .h-periodo { display: flex; align-items: center; gap: 10px; }
  .h-periodo-dot {
    width: 8px; height: 8px; border-radius: 50%; background: var(--teal); flex-shrink: 0;
  }
  .h-periodo-mes { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: var(--ink); }
  .h-periodo-año { font-size: 11px; color: var(--ink-3); }

  .h-consumo-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; color: var(--ink); }
  .h-consumo-bar { height: 4px; border-radius: 99px; background: var(--border); margin-top: 5px; overflow: hidden; }
  .h-consumo-bar-fill { height: 100%; background: var(--teal); border-radius: 99px; }

  .h-lectura-val { font-size: 13px; color: var(--ink-2); }
  .h-lectura-sub { font-size: 11px; color: var(--ink-4); margin-top: 2px; }

  .h-total-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; color: var(--teal-dk); }
  .h-total-sub { font-size: 11px; color: var(--ink-4); margin-top: 3px; }

  .h-nivel {
    display: inline-block; padding: 3px 10px; border-radius: 99px;
    font-size: 11px; font-weight: 600; border: 1px solid;
  }
  .h-nivel.opt  { background: var(--teal-bg);  color: var(--teal-dk); border-color: var(--teal-bd);  }
  .h-nivel.nor  { background: var(--amber-bg); color: var(--amber);   border-color: var(--amber-bd); }
  .h-nivel.alt  { background: var(--red-bg);   color: var(--red);     border-color: var(--red-bd);   }

  .h-pdf-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    background: var(--off); border: 1.5px solid var(--border);
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;
    color: var(--ink-2); cursor: pointer; transition: all .15s;
  }
  .h-pdf-btn:hover { background: var(--red-bg); border-color: var(--red-bd); color: var(--red); }

  /* ── TIPS ── */
  .h-tips {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 16px; padding: 22px 24px;
  }
  .h-tips-title {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
    color: var(--ink); margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .h-tip-item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 0; border-bottom: 1px solid var(--border);
    font-size: 13px; color: var(--ink-2); line-height: 1.55;
  }
  .h-tip-item:last-child { border-bottom: none; padding-bottom: 0; }
  .h-tip-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--teal); flex-shrink: 0; margin-top: 6px; }

  .h-empty {
    display: flex; flex-direction: column; align-items: center;
    padding: 60px 40px; gap: 10px; text-align: center;
  }
  .h-empty-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--teal-bg); border: 1.5px solid var(--teal-bd);
    display: flex; align-items: center; justify-content: center;
    color: var(--teal); font-size: 22px; margin-bottom: 6px;
  }
  .h-empty-t { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; color: var(--ink); }
  .h-empty-s { font-size: 13px; color: var(--ink-3); }

  @media (max-width: 820px) {
    .h-stats { grid-template-columns: 1fr 1fr; }
    .h-stat-val { font-size: 20px; }
  }
  @media (max-width: 520px) {
    .h-stats { grid-template-columns: 1fr; }
  }
`

const MESES = {
  '01': 'Enero', '02': 'Febrero', '03': 'Marzo',    '04': 'Abril',
  '05': 'Mayo',  '06': 'Junio',   '07': 'Julio',    '08': 'Agosto',
  '09': 'Sep.',  '10': 'Oct.',    '11': 'Nov.',      '12': 'Dic.'
}

const nivelConsumo = (m3) => m3 <= 10 ? 'opt' : m3 <= 20 ? 'nor' : 'alt'
const nivelLabel   = (m3) => m3 <= 10 ? 'Óptimo' : m3 <= 20 ? 'Normal' : 'Alto'

export default function Historial() {
  const [usuario,   setUsuario]   = useState(null)
  const [lecturas,  setLecturas]  = useState([])
  const [filtro,    setFiltro]    = useState('')
  const [filtrados, setFiltrados] = useState([])
  const [catU,      setCatU]      = useState('R')
  const [vista,     setVista]     = useState('area')
  const [cargando,  setCargando]  = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setCargando(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) { setCargando(false); return }

        const { data: userData } = await supabase
          .from('usuarios').select('*').eq('correo', session.user.email).single()
        setUsuario(userData)
        setCatU(userData?.tipo_usuario === 'industrial' ? 'I' : 'R')

        const { data: rows } = await supabase
          .from('lecturas').select('id, valor_lectura, fecha_lectura')
          .eq('id_usuario', userData.id)
          .order('fecha_lectura', { ascending: true })

        const historial = (rows || []).map((r, i) => {
          const ant = i > 0 ? rows[i - 1].valor_lectura : r.valor_lectura - 10
          const consumo = Math.max(r.valor_lectura - ant, 0)
          const f = new Date(r.fecha_lectura)
          return {
            id: r.id,
            fecha: `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}`,
            consumo,
            valor_lectura: r.valor_lectura,
          }
        })
        setLecturas(historial)
        setFiltrados(historial)
      } catch (e) { console.error(e) }
      finally { setCargando(false) }
    }
    load()
  }, [])

  useEffect(() => {
    setFiltrados(filtro ? lecturas.filter(i => i.fecha.includes(filtro)) : lecturas)
  }, [filtro, lecturas])

  const calcTotal = (consumo) => {
    const tipo = catU === 'I' ? 'industrial' : 'domestico'
    const t = calcularTarifaCompleta(consumo, tipo, usuario?.descuento || 0)
    return { ...t, total: t.totalFinal }
  }

  const maxConsumo = filtrados.length ? Math.max(...filtrados.map(i => i.consumo)) : 1

  const promedio      = filtrados.length ? (filtrados.reduce((s, i) => s + i.consumo, 0) / filtrados.length).toFixed(2) : '0'
  const maximo        = filtrados.length ? Math.max(...filtrados.map(i => i.consumo)).toFixed(2) : '0'
  const minimo        = filtrados.length ? Math.min(...filtrados.map(i => i.consumo)).toFixed(2) : '0'
  const totalAcum     = filtrados.reduce((s, i) => s + calcTotal(i.consumo).total, 0).toFixed(2)

  const tendencia = (() => {
    if (filtrados.length < 2) return null
    const ult = filtrados[filtrados.length - 1].consumo
    const pen = filtrados[filtrados.length - 2].consumo
    const dif = ult - pen
    return { dif, pct: ((dif / (pen || 1)) * 100).toFixed(1), sube: dif > 0 }
  })()

  const generarPDF = async (dato) => {
    if (!usuario) return
    const factura = calcTotal(dato.consumo)
    const pdf = new jsPDF()
    const W = 210, m = 15

    pdf.setFillColor(0, 51, 102)
    pdf.rect(0, 0, W, 50, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(18); pdf.setFont(undefined, 'bold')
    pdf.text('Administración de Consumo por Sector', m, 20)
    pdf.setFontSize(9); pdf.setFont(undefined, 'normal')
    pdf.text('Servicio Municipal de Agua Potable · Cochabamba, Bolivia', m, 28)
    pdf.text('NIT: 176695020', m, 34)
    pdf.setFontSize(11); pdf.setFont(undefined, 'bold')
    const fN = `FACT. N° ${dato.id.toString().padStart(8, '0')}`
    pdf.text(fN, W - m - pdf.getTextWidth(fN), 20)
    pdf.setFontSize(9); pdf.setFont(undefined, 'normal')
    const fe = `Fecha: ${new Date().toLocaleDateString('es-BO')}`
    pdf.text(fe, W - m - pdf.getTextWidth(fe), 28)
    const pe = `Período: ${dato.fecha}`
    pdf.text(pe, W - m - pdf.getTextWidth(pe), 34)

    let y = 60
    pdf.setFillColor(240, 240, 240); pdf.rect(m, y, W - m * 2, 35, 'F')
    pdf.setTextColor(0, 0, 0); pdf.setFontSize(10); pdf.setFont(undefined, 'bold')
    pdf.text('DATOS DEL CLIENTE', m + 3, y + 7)
    pdf.setFontSize(9); pdf.setFont(undefined, 'normal')
    pdf.text('Nombre:', m + 3, y + 15); pdf.setFont(undefined, 'bold'); pdf.text(usuario.nombre || 'N/A', m + 30, y + 15)
    pdf.setFont(undefined, 'normal'); pdf.text('Dirección:', m + 3, y + 22); pdf.text(usuario.direccion || 'N/A', m + 30, y + 22)
    pdf.text('Categoría:', m + 3, y + 29); pdf.setFont(undefined, 'bold'); pdf.text(catU === 'R' ? 'RESIDENCIAL' : 'INDUSTRIAL', m + 30, y + 29)

    y = 105
    pdf.setFillColor(0, 102, 153); pdf.rect(m, y, W - m * 2, 8, 'F')
    pdf.setTextColor(255, 255, 255); pdf.setFontSize(9); pdf.setFont(undefined, 'bold')
    pdf.text('LECTURA DEL MEDIDOR', m + 3, y + 6)
    y += 12; pdf.setTextColor(0, 0, 0); pdf.setFontSize(9); pdf.setFont(undefined, 'normal')
    const ant = dato.valor_lectura - dato.consumo
    ;[
      { l: 'Lectura Anterior', v: ant,              x: m + 5  },
      { l: 'Lectura Actual',   v: dato.valor_lectura, x: m + 60 },
      { l: 'Consumo (m³)',     v: dato.consumo,     x: m + 115 },
    ].forEach(c => {
      pdf.text(c.l, c.x, y)
      pdf.setFont(undefined, 'bold'); pdf.setFontSize(12)
      pdf.text(c.v.toString(), c.x, y + 7)
      pdf.setFont(undefined, 'normal'); pdf.setFontSize(9)
    })

    y = 140
    pdf.setFillColor(0, 102, 153); pdf.rect(m, y, W - m * 2, 8, 'F')
    pdf.setTextColor(255, 255, 255); pdf.setFont(undefined, 'bold')
    pdf.text('DETALLE DE CÁLCULO', m + 3, y + 6)
    y += 14; pdf.setTextColor(0, 0, 0); pdf.setFont(undefined, 'normal')
    ;(factura.detalle || []).forEach((l, i) => pdf.text(l, m + 5, y + i * 6))

    y += (factura.detalle?.length || 0) * 6 + 10
    const bW = 85, bX = W - m - bW
    ;[
      { l: 'Subtotal agua:',        v: factura.subtotal           },
      { l: 'Factor tipo usuario:',  v: factura.totalConFactorTipo },
      { l: 'Cargo fijo:',           v: factura.cargoFijo || 0     },
    ].forEach((item, i) => {
      const ry = y + i * 8
      pdf.setDrawColor(200, 200, 200); pdf.rect(bX, ry, bW, 8)
      pdf.text(item.l, bX + 2, ry + 5.5)
      pdf.text(`Bs ${item.v.toFixed(2)}`, bX + bW - 2 - pdf.getTextWidth(`Bs ${item.v.toFixed(2)}`), ry + 5.5)
    })
    const tY = y + 24
    pdf.setFillColor(0, 102, 153); pdf.rect(bX, tY, bW, 11, 'F')
    pdf.setTextColor(255, 255, 255); pdf.setFont(undefined, 'bold'); pdf.setFontSize(11)
    pdf.text('TOTAL:', bX + 2, tY + 7.5)
    pdf.text(`Bs ${factura.total.toFixed(2)}`, bX + bW - 2 - pdf.getTextWidth(`Bs ${factura.total.toFixed(2)}`), tY + 7.5)

    const qrUrl = await QRCode.toDataURL(`ACS-${dato.id}-Bs${factura.total.toFixed(2)}-${usuario.nombre}`)
    pdf.addImage(qrUrl, 'PNG', W - m - 32, tY - 28, 28, 28)

    y = 265
    pdf.setTextColor(100, 100, 100); pdf.setFontSize(7); pdf.setFont(undefined, 'normal')
    pdf.text('Administración de Consumo por Sector · (4) 4258000 · Lunes–Viernes 8:00–16:00', m, y)
    pdf.text(`Generado el ${new Date().toLocaleString('es-BO')}`, m, y + 5)

    pdf.save(`Factura_ACS_${dato.fecha}_${(usuario.nombre || '').replace(/\s/g, '_')}.pdf`)

    try {
      await supabase.from('historial_cambios').insert([{
        tabla_afectada: 'lecturas', id_registro: dato.id,
        accion: 'PDF generado', usuario_responsable: usuario.id
      }])
    } catch (e) { console.error(e) }
  }

  const chartData = filtrados.map(i => ({
    ...i,
    label: `${MESES[i.fecha.split('-')[1]]} ${i.fecha.split('-')[0]}`,
  }))

  const tooltipStyle = {
    contentStyle: {
      background: '#111110', border: 'none', borderRadius: 10,
      color: '#fff', fontSize: 12, fontFamily: 'Inter, sans-serif'
    },
    formatter: (v) => [`${v} m³`, 'Consumo'],
    labelStyle: { color: 'rgba(255,255,255,.5)', marginBottom: 4 },
  }

  if (cargando) return (
    <div className="h-root">
      <style>{css}</style>
      <div className="h-loader">
        <div className="h-ring" />
        <p className="h-ring-lbl">Cargando historial</p>
      </div>
    </div>
  )

  return (
    <div className="h-root">
      <style>{css}</style>

      {/* HEADER */}
      <div className="h-header">
        <div className="h-header-icon"><FaTint size={22} /></div>
        <div>
          <div className="h-title">Historial de consumo</div>
          <div className="h-subtitle">Seguimiento mensual de agua · Administración de Consumo por Sector Cochabamba</div>
        </div>
      </div>

      {/* CLIENTE */}
      {usuario && (
        <div className="h-cliente">
          <div className="h-cliente-avatar">{usuario.nombre?.charAt(0)?.toUpperCase()}</div>
          <div className="h-cliente-info">
            <div className="h-cliente-name">{usuario.nombre}</div>
            <div className="h-cliente-meta">Cód. SEM-{String(usuario.id).padStart(6, '0')} · {usuario.direccion || 'Dirección no registrada'}</div>
          </div>
          <div className="h-cliente-badge">{catU === 'R' ? 'Residencial' : 'Industrial'}</div>
        </div>
      )}

      {/* ESTADÍSTICAS */}
      <div className="h-stats">
        {[
          { icon: <FaTint />,        cls: 'icon-teal',  lbl: 'Promedio mensual', val: `${promedio} m³`,  sub: 'Tu consumo típico'           },
          { icon: <FaArrowUp />,     cls: 'icon-red',   lbl: 'Consumo máximo',   val: `${maximo} m³`,   sub: 'El mes que más consumiste'    },
          { icon: <FaArrowDown />,   cls: 'icon-green', lbl: 'Consumo mínimo',   val: `${minimo} m³`,   sub: 'Tu mes más eficiente'         },
          { icon: <FaDollarSign />,  cls: 'icon-ind',   lbl: 'Total acumulado',  val: `Bs ${totalAcum}`, sub: 'Facturado en el período'      },
        ].map((s, i) => (
          <div key={i} className="h-stat">
            <div className={`h-stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="h-stat-lbl">{s.lbl}</div>
            <div className="h-stat-val">{s.val}</div>
            <div className="h-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* TENDENCIA */}
      {tendencia && (
        <div className={`h-tend ${tendencia.sube ? 'up' : 'down'}`}>
          <div className="h-tend-icon">
            {tendencia.sube ? <FaArrowUp /> : <FaArrowDown />}
          </div>
          <div>
            <div className="h-tend-title">
              {tendencia.sube ? 'Aumento' : 'Reducción'} del {Math.abs(tendencia.pct)}% respecto al mes anterior
            </div>
            <div className="h-tend-body">
              Tu consumo {tendencia.sube ? 'subió' : 'bajó'} <strong>{Math.abs(tendencia.dif).toFixed(2)} m³</strong> comparado con el período previo.
            </div>
            <div className="h-tend-tip">
              {tendencia.sube
                ? '💡 Revisa posibles fugas o reducí el tiempo de ducha para bajar tu factura.'
                : '✅ ¡Vas por buen camino! Seguí así para mantener la tarifa más baja.'}
            </div>
          </div>
        </div>
      )}

      {/* CONTROLES */}
      <div className="h-controls">
        <div className="h-input-wrap">
          <FaCalendarAlt />
          <input
            type="month" value={filtro}
            onChange={e => setFiltro(e.target.value)}
            placeholder="Filtrar por mes"
          />
        </div>
        {filtro && (
          <button className="h-tab" onClick={() => setFiltro('')} style={{ borderColor: 'var(--border-md)' }}>
            Limpiar filtro ×
          </button>
        )}
        <div className="h-tabs">
          {[['area','Área'],['linea','Línea'],['barras','Barras']].map(([id, lbl]) => (
            <button key={id} className={`h-tab${vista === id ? ' on' : ''}`} onClick={() => setVista(id)}>{lbl}</button>
          ))}
        </div>
      </div>

      {/* GRÁFICO */}
      <div className="h-chart-wrap">
        <div className="h-chart-title">Consumo mensual de agua</div>
        <div className="h-chart-sub">
          {filtrados.length} {filtrados.length === 1 ? 'mes' : 'meses'} en el período seleccionado
        </div>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            {vista === 'linea' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ebebea" />
                <XAxis dataKey="label" stroke="#b0b0ac" tick={{ fontSize: 11 }} />
                <YAxis stroke="#b0b0ac" tick={{ fontSize: 11 }} label={{ value: 'm³', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="consumo" stroke="#00a67e" strokeWidth={2.5} dot={{ fill: '#00a67e', r: 4 }} activeDot={{ r: 7 }} />
              </LineChart>
            ) : vista === 'area' ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gradTeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00a67e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00a67e" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ebebea" />
                <XAxis dataKey="label" stroke="#b0b0ac" tick={{ fontSize: 11 }} />
                <YAxis stroke="#b0b0ac" tick={{ fontSize: 11 }} label={{ value: 'm³', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="consumo" stroke="#00a67e" strokeWidth={2.5} fill="url(#gradTeal)" />
              </AreaChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ebebea" />
                <XAxis dataKey="label" stroke="#b0b0ac" tick={{ fontSize: 11 }} />
                <YAxis stroke="#b0b0ac" tick={{ fontSize: 11 }} label={{ value: 'm³', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="consumo" fill="#00a67e" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLA */}
      <div className="h-table-wrap">
        <div className="h-table-head">
          <div>
            <div className="h-table-head-title"><FaFileInvoiceDollar /> Registro de lecturas</div>
            <div className="h-table-head-count">{filtrados.length} {filtrados.length === 1 ? 'registro' : 'registros'}</div>
          </div>
        </div>

        {filtrados.length === 0 ? (
          <div className="h-empty">
            <div className="h-empty-icon"><FaWater /></div>
            <div className="h-empty-t">Sin registros</div>
            <div className="h-empty-s">No hay lecturas para el período seleccionado</div>
          </div>
        ) : (
          <table className="h-table">
            <thead>
              <tr>
                <th>Período</th>
                <th>Consumo</th>
                <th>Lectura</th>
                <th>Nivel</th>
                <th>Total a pagar</th>
                <th>Factura</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((dato, idx) => {
                const [year, month] = dato.fecha.split('-')
                const factura = calcTotal(dato.consumo)
                const pct = Math.min((dato.consumo / maxConsumo) * 100, 100)
                return (
                  <motion.tr
                    key={dato.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <td>
                      <div className="h-periodo">
                        <div className="h-periodo-dot" />
                        <div>
                          <div className="h-periodo-mes">{MESES[month]}</div>
                          <div className="h-periodo-año">{year}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="h-consumo-val">{dato.consumo.toFixed(2)} m³</div>
                      <div className="h-consumo-bar">
                        <div className="h-consumo-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td>
                      <div className="h-lectura-val">Actual: <strong>{dato.valor_lectura}</strong></div>
                      <div className="h-lectura-sub">Anterior: {dato.valor_lectura - dato.consumo}</div>
                    </td>
                    <td>
                      <span className={`h-nivel ${nivelConsumo(dato.consumo)}`}>
                        {nivelLabel(dato.consumo)}
                      </span>
                    </td>
                    <td>
                      <div className="h-total-val">Bs {factura.total.toFixed(2)}</div>
                      <div className="h-total-sub">Base Bs {factura.subtotal.toFixed(2)}</div>
                    </td>
                    <td>
                      <button className="h-pdf-btn" onClick={() => generarPDF(dato)}>
                        <FaFilePdf /> PDF
                      </button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* TIPS */}
      <div className="h-tips">
        <div className="h-tips-title"><FaInfoCircle style={{ color: 'var(--teal)' }} /> Consejos para ahorrar agua</div>
        {[
          'Un grifo goteando puede desperdiciar hasta 30 litros por día. Repará las fugas a tiempo.',
          'Cada minuto menos en la ducha ahorra aproximadamente 12 litros de agua.',
          'Cerrá el grifo mientras te cepillás los dientes o lavás los platos.',
          'Usá la lavadora solo con cargas completas para maximizar cada uso del agua.',
        ].map((tip, i) => (
          <div key={i} className="h-tip-item">
            <div className="h-tip-dot" />
            {tip}
          </div>
        ))}
      </div>
    </div>
  )
}