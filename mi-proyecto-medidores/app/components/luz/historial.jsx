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
  FaFilePdf, FaCalendarAlt, FaBolt, FaArrowUp, FaArrowDown,
  FaDollarSign, FaInfoCircle, FaFileInvoiceDollar, FaLightbulb
} from 'react-icons/fa'
import { supabase } from '@/lib/supabaseClient'
import { calcularTarifaElectrica } from '@/lib/tariffUtils'

/* ─────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
   Paleta: negro profundo + amarillo eléctrico + grises neutros
   Tipografía: Space Grotesk (display) + Inter (body)
───────────────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  .el-root {
    --bg:        #0d0d0d;
    --surface:   #161616;
    --surface-2: #1f1f1f;
    --border:    #2a2a2a;
    --border-md: #3a3a3a;

    --ink:       #f5f5f0;
    --ink-2:     #c8c8c0;
    --ink-3:     #888880;
    --ink-4:     #4a4a45;

    --yellow:    #f5c800;
    --yellow-dk: #c9a200;
    --yellow-bg: #1a1600;
    --yellow-bd: #3d3200;

    --red:       #ff4d4d;
    --red-bg:    #1a0a0a;
    --red-bd:    #3d1515;

    --green:     #4ade80;
    --green-bg:  #061a0e;
    --green-bd:  #0d3d1e;

    --blue:      #60a5fa;
    --blue-bg:   #060f1a;
    --blue-bd:   #0d2340;

    font-family: 'Inter', system-ui, sans-serif;
    color: var(--ink);
    background: var(--bg);
    padding: 0;
    min-height: 100vh;
  }

  /* ── LOADER ── */
  .el-loader {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 80px 40px; gap: 16px;
  }
  .el-ring {
    width: 44px; height: 44px;
    border: 2.5px solid var(--border);
    border-top-color: var(--yellow);
    border-radius: 50%;
    animation: elspin .65s linear infinite;
  }
  @keyframes elspin { to { transform: rotate(360deg); } }
  .el-ring-lbl { font-size: 11px; color: var(--ink-3); letter-spacing: .12em; text-transform: uppercase; }

  /* ── HEADER ── */
  .el-header {
    display: flex; align-items: center; gap: 16px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 28px;
  }
  .el-header-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--yellow); display: flex; align-items: center;
    justify-content: center; color: #000; flex-shrink: 0;
  }
  .el-title {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 800; font-size: 26px;
    color: var(--ink); letter-spacing: -.03em; line-height: 1.1;
  }
  .el-subtitle { font-size: 12px; color: var(--ink-3); margin-top: 4px; }

  /* ── CLIENTE CARD ── */
  .el-cliente {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 18px 22px; margin-bottom: 24px;
    display: flex; align-items: center; gap: 18px; flex-wrap: wrap;
  }
  .el-cliente-avatar {
    width: 44px; height: 44px; border-radius: 11px;
    background: var(--yellow); color: #000;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 18px;
    flex-shrink: 0;
  }
  .el-cliente-info { flex: 1; min-width: 0; }
  .el-cliente-name {
    font-family: 'Space Grotesk', sans-serif; font-weight: 700;
    font-size: 15px; color: var(--ink);
  }
  .el-cliente-meta { font-size: 12px; color: var(--ink-3); margin-top: 2px; }
  .el-cliente-badge {
    padding: 5px 14px; border-radius: 99px; font-size: 12px; font-weight: 600;
    background: var(--yellow-bg); color: var(--yellow); border: 1px solid var(--yellow-bd);
    font-family: 'Space Grotesk', sans-serif;
  }

  /* ── STAT STRIP ── */
  .el-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .el-stat {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 20px 18px;
    transition: border-color .2s, transform .15s;
    position: relative; overflow: hidden;
  }
  .el-stat::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 2px; background: var(--border);
    transition: background .2s;
  }
  .el-stat:hover { border-color: var(--border-md); transform: translateY(-2px); }
  .el-stat:hover::after { background: var(--yellow); }
  .el-stat-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px; font-size: 14px;
  }
  .icon-yellow { background: var(--yellow-bg); color: var(--yellow); border: 1px solid var(--yellow-bd); }
  .icon-red    { background: var(--red-bg);    color: var(--red);    border: 1px solid var(--red-bd);    }
  .icon-green  { background: var(--green-bg);  color: var(--green);  border: 1px solid var(--green-bd);  }
  .icon-blue   { background: var(--blue-bg);   color: var(--blue);   border: 1px solid var(--blue-bd);   }

  .el-stat-lbl {
    font-size: 10px; font-weight: 600; letter-spacing: .1em;
    text-transform: uppercase; color: var(--ink-4); margin-bottom: 6px;
  }
  .el-stat-val {
    font-family: 'Space Grotesk', sans-serif; font-weight: 800;
    font-size: 24px; color: var(--ink); letter-spacing: -.03em; line-height: 1;
  }
  .el-stat-sub { font-size: 11px; color: var(--ink-3); margin-top: 5px; }

  /* ── TENDENCIA ── */
  .el-tend {
    border-radius: 14px; padding: 16px 20px; margin-bottom: 24px;
    display: flex; align-items: flex-start; gap: 14px;
    border: 1px solid;
  }
  .el-tend.up   { background: var(--red-bg);   border-color: var(--red-bd);   }
  .el-tend.down { background: var(--green-bg); border-color: var(--green-bd); }
  .el-tend-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0;
  }
  .el-tend.up   .el-tend-icon { background: var(--red-bd);   color: var(--red);   }
  .el-tend.down .el-tend-icon { background: var(--green-bd); color: var(--green); }
  .el-tend-title {
    font-family: 'Space Grotesk', sans-serif; font-weight: 700;
    font-size: 14px; margin-bottom: 3px;
  }
  .el-tend.up   .el-tend-title { color: var(--red);   }
  .el-tend.down .el-tend-title { color: var(--green); }
  .el-tend-body { font-size: 13px; color: var(--ink-2); line-height: 1.5; }
  .el-tend-tip  { font-size: 12px; color: var(--ink-3); margin-top: 6px; }

  /* ── CONTROLES ── */
  .el-controls {
    display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;
  }
  .el-input-wrap {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 0 12px; height: 38px;
    transition: border-color .15s;
  }
  .el-input-wrap:focus-within { border-color: var(--yellow); }
  .el-input-wrap svg { color: var(--ink-3); font-size: 12px; }
  .el-input-wrap input {
    border: none; outline: none; background: transparent;
    font-family: 'Inter', sans-serif; font-size: 13px; color: var(--ink);
    color-scheme: dark;
  }
  .el-tabs { display: flex; gap: 4px; margin-left: auto; }
  .el-tab {
    padding: 7px 16px; border-radius: 8px; border: 1px solid var(--border);
    background: transparent; font-family: 'Inter', sans-serif; font-size: 12px;
    font-weight: 500; color: var(--ink-3); cursor: pointer; transition: all .15s;
  }
  .el-tab:hover { background: var(--surface-2); color: var(--ink); }
  .el-tab.on { background: var(--yellow); color: #000; border-color: var(--yellow); font-weight: 700; }

  /* ── GRÁFICO ── */
  .el-chart-wrap {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 24px; margin-bottom: 24px;
  }
  .el-chart-title {
    font-family: 'Space Grotesk', sans-serif; font-weight: 700;
    font-size: 15px; color: var(--ink); margin-bottom: 4px;
  }
  .el-chart-sub { font-size: 12px; color: var(--ink-3); margin-bottom: 20px; }

  /* ── TABLA ── */
  .el-table-wrap {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden; margin-bottom: 24px;
  }
  .el-table-head {
    background: var(--yellow); padding: 18px 24px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .el-table-head-title {
    font-family: 'Space Grotesk', sans-serif; font-weight: 800;
    font-size: 15px; color: #000;
    display: flex; align-items: center; gap: 10px;
  }
  .el-table-head-count { font-size: 12px; color: rgba(0,0,0,.45); margin-top: 2px; font-weight: 500; }

  table.el-table { width: 100%; border-collapse: collapse; }
  table.el-table thead tr {
    background: var(--surface-2); border-bottom: 1px solid var(--border);
  }
  table.el-table thead th {
    padding: 12px 20px; text-align: left; font-size: 10px; font-weight: 600;
    letter-spacing: .1em; text-transform: uppercase; color: var(--ink-4);
  }
  table.el-table tbody tr {
    border-bottom: 1px solid var(--border); transition: background .12s;
  }
  table.el-table tbody tr:last-child { border-bottom: none; }
  table.el-table tbody tr:hover { background: var(--yellow-bg); }
  table.el-table td { padding: 14px 20px; vertical-align: middle; }

  .el-periodo { display: flex; align-items: center; gap: 10px; }
  .el-periodo-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--yellow); flex-shrink: 0;
    box-shadow: 0 0 6px var(--yellow);
  }
  .el-periodo-mes {
    font-family: 'Space Grotesk', sans-serif; font-weight: 700;
    font-size: 14px; color: var(--ink);
  }
  .el-periodo-año { font-size: 11px; color: var(--ink-3); }

  .el-consumo-val {
    font-family: 'Space Grotesk', sans-serif; font-weight: 800;
    font-size: 18px; color: var(--ink);
  }
  .el-consumo-bar {
    height: 3px; border-radius: 99px; background: var(--border);
    margin-top: 6px; overflow: hidden;
  }
  .el-consumo-bar-fill {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, var(--yellow-dk), var(--yellow));
  }

  .el-lectura-val { font-size: 13px; color: var(--ink-2); }
  .el-lectura-sub { font-size: 11px; color: var(--ink-4); margin-top: 2px; }

  .el-total-val {
    font-family: 'Space Grotesk', sans-serif; font-weight: 800;
    font-size: 18px; color: var(--yellow);
  }
  .el-total-sub { font-size: 11px; color: var(--ink-4); margin-top: 3px; }

  .el-nivel {
    display: inline-block; padding: 3px 10px; border-radius: 99px;
    font-size: 11px; font-weight: 600; border: 1px solid;
    font-family: 'Space Grotesk', sans-serif;
  }
  .el-nivel.opt  { background: var(--green-bg);  color: var(--green);  border-color: var(--green-bd);  }
  .el-nivel.nor  { background: var(--yellow-bg); color: var(--yellow); border-color: var(--yellow-bd); }
  .el-nivel.alt  { background: var(--red-bg);    color: var(--red);    border-color: var(--red-bd);    }

  .el-pdf-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    background: var(--surface-2); border: 1px solid var(--border);
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;
    color: var(--ink-2); cursor: pointer; transition: all .15s;
  }
  .el-pdf-btn:hover { background: var(--red-bg); border-color: var(--red-bd); color: var(--red); }

  /* ── TIPS ── */
  .el-tips {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 22px 24px;
  }
  .el-tips-title {
    font-family: 'Space Grotesk', sans-serif; font-weight: 700;
    font-size: 14px; color: var(--ink); margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .el-tip-item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 0; border-bottom: 1px solid var(--border);
    font-size: 13px; color: var(--ink-2); line-height: 1.55;
  }
  .el-tip-item:last-child { border-bottom: none; padding-bottom: 0; }
  .el-tip-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--yellow); flex-shrink: 0; margin-top: 6px;
    box-shadow: 0 0 4px var(--yellow);
  }

  /* ── EMPTY ── */
  .el-empty {
    display: flex; flex-direction: column; align-items: center;
    padding: 60px 40px; gap: 10px; text-align: center;
    background: var(--surface);
  }
  .el-empty-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--yellow-bg); border: 1px solid var(--yellow-bd);
    display: flex; align-items: center; justify-content: center;
    color: var(--yellow); font-size: 22px; margin-bottom: 6px;
  }
  .el-empty-t {
    font-family: 'Space Grotesk', sans-serif; font-weight: 700;
    font-size: 16px; color: var(--ink);
  }
  .el-empty-s { font-size: 13px; color: var(--ink-3); }

  @media (max-width: 820px) {
    .el-stats { grid-template-columns: 1fr 1fr; }
    .el-stat-val { font-size: 20px; }
  }
  @media (max-width: 520px) {
    .el-stats { grid-template-columns: 1fr; }
  }
`

const MESES = {
  '01': 'Enero', '02': 'Febrero', '03': 'Marzo',  '04': 'Abril',
  '05': 'Mayo',  '06': 'Junio',   '07': 'Julio',  '08': 'Agosto',
  '09': 'Sep.',  '10': 'Oct.',    '11': 'Nov.',    '12': 'Dic.'
}

/* Niveles de consumo eléctrico (kWh/mes) */
const nivelConsumo = (kwh) => kwh <= 100 ? 'opt' : kwh <= 300 ? 'nor' : 'alt'
const nivelLabel   = (kwh) => kwh <= 100 ? 'Eficiente' : kwh <= 300 ? 'Moderado' : 'Alto'

export default function HistorialLuz() {
  const [usuario,   setUsuario]   = useState(null)
  const [lecturas,  setLecturas]  = useState([])
  const [filtro,    setFiltro]    = useState('')
  const [filtrados, setFiltrados] = useState([])
  const [catU,      setCatU]      = useState('D')   // D=doméstico I=industrial
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
        setCatU(userData?.tipo_usuario === 'industrial' ? 'I' : 'D')

        const { data: rows } = await supabase
          .from('lecturas_luz').select('id, valor_lectura, fecha_lectura')
          .eq('id_usuario', userData.id)
          .order('fecha_lectura', { ascending: true })

        const historial = (rows || []).map((r, i) => {
          const ant = i > 0 ? rows[i - 1].valor_lectura : r.valor_lectura - 80
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

  /* ── Cálculo de tarifa eléctrica (ajustá según tu tariffUtils) ── */
  const calcTotal = (consumo) => {
    const tipo = catU === 'I' ? 'industrial' : 'domestico'
    const t = calcularTarifaElectrica(consumo, tipo, usuario?.descuento || 0)
    return { ...t, total: t.totalFinal }
  }

  const maxConsumo  = filtrados.length ? Math.max(...filtrados.map(i => i.consumo)) : 1
  const promedio    = filtrados.length ? (filtrados.reduce((s, i) => s + i.consumo, 0) / filtrados.length).toFixed(1) : '0'
  const maximo      = filtrados.length ? Math.max(...filtrados.map(i => i.consumo)).toFixed(1) : '0'
  const minimo      = filtrados.length ? Math.min(...filtrados.map(i => i.consumo)).toFixed(1) : '0'
  const totalAcum   = filtrados.reduce((s, i) => s + calcTotal(i.consumo).total, 0).toFixed(2)

  const tendencia = (() => {
    if (filtrados.length < 2) return null
    const ult = filtrados[filtrados.length - 1].consumo
    const pen = filtrados[filtrados.length - 2].consumo
    const dif = ult - pen
    return { dif, pct: ((dif / (pen || 1)) * 100).toFixed(1), sube: dif > 0 }
  })()

  /* ── Generador de factura PDF ── */
  const generarPDF = async (dato) => {
    if (!usuario) return
    const factura = calcTotal(dato.consumo)
    const pdf = new jsPDF()
    const W = 210, m = 15

    // Cabecera
    pdf.setFillColor(20, 20, 20)
    pdf.rect(0, 0, W, 50, 'F')
    pdf.setFillColor(245, 200, 0)
    pdf.rect(0, 47, W, 3, 'F')

    pdf.setTextColor(245, 200, 0)
    pdf.setFontSize(18); pdf.setFont(undefined, 'bold')
    pdf.text('Administración de Consumo por Sector', m, 20)
    pdf.setTextColor(200, 200, 200); pdf.setFontSize(9); pdf.setFont(undefined, 'normal')
    pdf.text('Servicio Municipal de Energía Eléctrica · Cochabamba, Bolivia', m, 28)
    pdf.text('NIT: 176695020', m, 34)

    pdf.setTextColor(245, 200, 0); pdf.setFontSize(11); pdf.setFont(undefined, 'bold')
    const fN = `FACT. N° ${dato.id.toString().padStart(8, '0')}`
    pdf.text(fN, W - m - pdf.getTextWidth(fN), 20)
    pdf.setTextColor(200, 200, 200); pdf.setFontSize(9); pdf.setFont(undefined, 'normal')
    const fe = `Fecha: ${new Date().toLocaleDateString('es-BO')}`
    pdf.text(fe, W - m - pdf.getTextWidth(fe), 28)
    const pe = `Período: ${dato.fecha}`
    pdf.text(pe, W - m - pdf.getTextWidth(pe), 34)

    // Datos del cliente
    let y = 60
    pdf.setFillColor(240, 240, 240); pdf.rect(m, y, W - m * 2, 35, 'F')
    pdf.setTextColor(0, 0, 0); pdf.setFontSize(10); pdf.setFont(undefined, 'bold')
    pdf.text('DATOS DEL CLIENTE', m + 3, y + 7)
    pdf.setFontSize(9); pdf.setFont(undefined, 'normal')
    pdf.text('Nombre:',    m + 3, y + 15); pdf.setFont(undefined, 'bold'); pdf.text(usuario.nombre || 'N/A', m + 30, y + 15)
    pdf.setFont(undefined, 'normal')
    pdf.text('Dirección:', m + 3, y + 22); pdf.text(usuario.direccion || 'N/A', m + 30, y + 22)
    pdf.text('Categoría:', m + 3, y + 29); pdf.setFont(undefined, 'bold')
    pdf.text(catU === 'D' ? 'DOMÉSTICO' : 'INDUSTRIAL', m + 30, y + 29)

    // Lectura del medidor
    y = 105
    pdf.setFillColor(20, 20, 20); pdf.rect(m, y, W - m * 2, 8, 'F')
    pdf.setTextColor(245, 200, 0); pdf.setFontSize(9); pdf.setFont(undefined, 'bold')
    pdf.text('LECTURA DEL MEDIDOR (kWh)', m + 3, y + 6)
    y += 12; pdf.setTextColor(0, 0, 0); pdf.setFontSize(9); pdf.setFont(undefined, 'normal')
    const ant = dato.valor_lectura - dato.consumo
    ;[
      { l: 'Lectura Anterior', v: ant,               x: m + 5  },
      { l: 'Lectura Actual',   v: dato.valor_lectura, x: m + 60 },
      { l: 'Consumo (kWh)',    v: dato.consumo,       x: m + 115 },
    ].forEach(c => {
      pdf.text(c.l, c.x, y)
      pdf.setFont(undefined, 'bold'); pdf.setFontSize(12)
      pdf.text(c.v.toString(), c.x, y + 7)
      pdf.setFont(undefined, 'normal'); pdf.setFontSize(9)
    })

    // Detalle de cálculo
    y = 140
    pdf.setFillColor(20, 20, 20); pdf.rect(m, y, W - m * 2, 8, 'F')
    pdf.setTextColor(245, 200, 0); pdf.setFont(undefined, 'bold')
    pdf.text('DETALLE DE CÁLCULO', m + 3, y + 6)
    y += 14; pdf.setTextColor(0, 0, 0); pdf.setFont(undefined, 'normal')
    ;(factura.detalle || []).forEach((l, i) => pdf.text(l, m + 5, y + i * 6))

    y += (factura.detalle?.length || 0) * 6 + 10
    const bW = 85, bX = W - m - bW
    ;[
      { l: 'Subtotal energía:', v: factura.subtotal           },
      { l: 'Tasa GAMC (12%):',  v: factura.tasaGAMC || 0     },
      { l: 'Cargo fijo:',       v: factura.cargoFijo || 0     },
    ].forEach((item, i) => {
      const ry = y + i * 8
      pdf.setDrawColor(200, 200, 200); pdf.rect(bX, ry, bW, 8)
      pdf.setTextColor(0, 0, 0); pdf.setFont(undefined, 'normal'); pdf.setFontSize(9)
      pdf.text(item.l, bX + 2, ry + 5.5)
      pdf.text(`Bs ${item.v.toFixed(2)}`, bX + bW - 2 - pdf.getTextWidth(`Bs ${item.v.toFixed(2)}`), ry + 5.5)
    })
    const tY = y + 24
    pdf.setFillColor(245, 200, 0); pdf.rect(bX, tY, bW, 11, 'F')
    pdf.setTextColor(0, 0, 0); pdf.setFont(undefined, 'bold'); pdf.setFontSize(11)
    pdf.text('TOTAL:', bX + 2, tY + 7.5)
    pdf.text(`Bs ${factura.total.toFixed(2)}`, bX + bW - 2 - pdf.getTextWidth(`Bs ${factura.total.toFixed(2)}`), tY + 7.5)

    // QR
    const qrUrl = await QRCode.toDataURL(`ACS-LUZ-${dato.id}-Bs${factura.total.toFixed(2)}-${usuario.nombre}`)
    pdf.addImage(qrUrl, 'PNG', W - m - 32, tY - 28, 28, 28)

    // Pie
    y = 265
    pdf.setTextColor(120, 120, 120); pdf.setFontSize(7); pdf.setFont(undefined, 'normal')
    pdf.text('Administración de Consumo por Sector · (4) 4258000 · Lunes–Viernes 8:00–16:00', m, y)
    pdf.text(`Generado el ${new Date().toLocaleString('es-BO')}`, m, y + 5)

    pdf.save(`Factura_Luz_${dato.fecha}_${(usuario.nombre || '').replace(/\s/g, '_')}.pdf`)

    try {
      await supabase.from('historial_cambios').insert([{
        tabla_afectada: 'lecturas_luz', id_registro: dato.id,
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
      background: '#161616', border: '1px solid #2a2a2a', borderRadius: 10,
      color: '#f5f5f0', fontSize: 12, fontFamily: 'Inter, sans-serif'
    },
    formatter: (v) => [`${v} kWh`, 'Consumo'],
    labelStyle: { color: 'rgba(245,245,240,.4)', marginBottom: 4 },
  }

  if (cargando) return (
    <div className="el-root">
      <style>{css}</style>
      <div className="el-loader">
        <div className="el-ring" />
        <p className="el-ring-lbl">Cargando historial</p>
      </div>
    </div>
  )

  return (
    <div className="el-root">
      <style>{css}</style>

      {/* HEADER */}
      <div className="el-header">
        <div className="el-header-icon"><FaBolt size={22} /></div>
        <div>
          <div className="el-title">Historial de consumo eléctrico</div>
          <div className="el-subtitle">Seguimiento mensual de energía · Administración de Consumo por Sector Cochabamba</div>
        </div>
      </div>

      {/* CLIENTE */}
      {usuario && (
        <div className="el-cliente">
          <div className="el-cliente-avatar">{usuario.nombre?.charAt(0)?.toUpperCase()}</div>
          <div className="el-cliente-info">
            <div className="el-cliente-name">{usuario.nombre}</div>
            <div className="el-cliente-meta">Cód. SEM-{String(usuario.id).padStart(6, '0')} · {usuario.direccion || 'Dirección no registrada'}</div>
          </div>
          <div className="el-cliente-badge">{catU === 'D' ? 'Doméstico' : 'Industrial'}</div>
        </div>
      )}

      {/* ESTADÍSTICAS */}
      <div className="el-stats">
        {[
          { icon: <FaBolt />,       cls: 'icon-yellow', lbl: 'Promedio mensual',  val: `${promedio} kWh`,  sub: 'Tu consumo típico'          },
          { icon: <FaArrowUp />,    cls: 'icon-red',    lbl: 'Consumo máximo',    val: `${maximo} kWh`,   sub: 'El mes que más consumiste'   },
          { icon: <FaArrowDown />,  cls: 'icon-green',  lbl: 'Consumo mínimo',    val: `${minimo} kWh`,   sub: 'Tu mes más eficiente'        },
          { icon: <FaDollarSign />, cls: 'icon-blue',   lbl: 'Total acumulado',   val: `Bs ${totalAcum}`, sub: 'Facturado en el período'     },
        ].map((s, i) => (
          <div key={i} className="el-stat">
            <div className={`el-stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="el-stat-lbl">{s.lbl}</div>
            <div className="el-stat-val">{s.val}</div>
            <div className="el-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* TENDENCIA */}
      {tendencia && (
        <div className={`el-tend ${tendencia.sube ? 'up' : 'down'}`}>
          <div className="el-tend-icon">
            {tendencia.sube ? <FaArrowUp /> : <FaArrowDown />}
          </div>
          <div>
            <div className="el-tend-title">
              {tendencia.sube ? 'Aumento' : 'Reducción'} del {Math.abs(tendencia.pct)}% respecto al mes anterior
            </div>
            <div className="el-tend-body">
              Tu consumo {tendencia.sube ? 'subió' : 'bajó'} <strong>{Math.abs(tendencia.dif).toFixed(1)} kWh</strong> comparado con el período previo.
            </div>
            <div className="el-tend-tip">
              {tendencia.sube
                ? '⚡ Revisá aparatos en standby o cambiá a iluminación LED para reducir tu factura.'
                : '✅ ¡Excelente! Seguí así para mantener la tarifa más baja posible.'}
            </div>
          </div>
        </div>
      )}

      {/* CONTROLES */}
      <div className="el-controls">
        <div className="el-input-wrap">
          <FaCalendarAlt />
          <input
            type="month" value={filtro}
            onChange={e => setFiltro(e.target.value)}
            placeholder="Filtrar por mes"
          />
        </div>
        {filtro && (
          <button className="el-tab" onClick={() => setFiltro('')} style={{ borderColor: 'var(--border-md)' }}>
            Limpiar ×
          </button>
        )}
        <div className="el-tabs">
          {[['area','Área'],['linea','Línea'],['barras','Barras']].map(([id, lbl]) => (
            <button key={id} className={`el-tab${vista === id ? ' on' : ''}`} onClick={() => setVista(id)}>{lbl}</button>
          ))}
        </div>
      </div>

      {/* GRÁFICO */}
      <div className="el-chart-wrap">
        <div className="el-chart-title">Consumo mensual de energía</div>
        <div className="el-chart-sub">
          {filtrados.length} {filtrados.length === 1 ? 'mes' : 'meses'} en el período seleccionado
        </div>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            {vista === 'linea' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="label" stroke="#4a4a45" tick={{ fontSize: 11, fill: '#888880' }} />
                <YAxis stroke="#4a4a45" tick={{ fontSize: 11, fill: '#888880' }} label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#888880' } }} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="consumo" stroke="#f5c800" strokeWidth={2.5} dot={{ fill: '#f5c800', r: 4 }} activeDot={{ r: 7, fill: '#f5c800' }} />
              </LineChart>
            ) : vista === 'area' ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gradYellow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f5c800" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f5c800" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="label" stroke="#4a4a45" tick={{ fontSize: 11, fill: '#888880' }} />
                <YAxis stroke="#4a4a45" tick={{ fontSize: 11, fill: '#888880' }} label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#888880' } }} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="consumo" stroke="#f5c800" strokeWidth={2.5} fill="url(#gradYellow)" />
              </AreaChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="label" stroke="#4a4a45" tick={{ fontSize: 11, fill: '#888880' }} />
                <YAxis stroke="#4a4a45" tick={{ fontSize: 11, fill: '#888880' }} label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#888880' } }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="consumo" fill="#f5c800" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLA */}
      <div className="el-table-wrap">
        <div className="el-table-head">
          <div>
            <div className="el-table-head-title"><FaFileInvoiceDollar /> Registro de lecturas</div>
            <div className="el-table-head-count">{filtrados.length} {filtrados.length === 1 ? 'registro' : 'registros'}</div>
          </div>
        </div>

        {filtrados.length === 0 ? (
          <div className="el-empty">
            <div className="el-empty-icon"><FaBolt /></div>
            <div className="el-empty-t">Sin registros</div>
            <div className="el-empty-s">No hay lecturas para el período seleccionado</div>
          </div>
        ) : (
          <table className="el-table">
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
                      <div className="el-periodo">
                        <div className="el-periodo-dot" />
                        <div>
                          <div className="el-periodo-mes">{MESES[month]}</div>
                          <div className="el-periodo-año">{year}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="el-consumo-val">{dato.consumo.toFixed(1)} kWh</div>
                      <div className="el-consumo-bar">
                        <div className="el-consumo-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td>
                      <div className="el-lectura-val">Actual: <strong>{dato.valor_lectura}</strong></div>
                      <div className="el-lectura-sub">Anterior: {dato.valor_lectura - dato.consumo}</div>
                    </td>
                    <td>
                      <span className={`el-nivel ${nivelConsumo(dato.consumo)}`}>
                        {nivelLabel(dato.consumo)}
                      </span>
                    </td>
                    <td>
                      <div className="el-total-val">Bs {factura.total.toFixed(2)}</div>
                      <div className="el-total-sub">Base Bs {factura.subtotal.toFixed(2)}</div>
                    </td>
                    <td>
                      <button className="el-pdf-btn" onClick={() => generarPDF(dato)}>
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
      <div className="el-tips">
        <div className="el-tips-title">
          <FaLightbulb style={{ color: 'var(--yellow)' }} /> Consejos para ahorrar energía
        </div>
        {[
          'Cambiá tus focos a LED: consumen hasta 80% menos que los incandescentes y duran más.',
          'Desenchufá los aparatos en standby — el TV, el cargador y el microondas gastan aunque estén "apagados".',
          'Usá el lavarropas en ciclo frío y cargado completo para reducir el consumo de agua caliente.',
          'Aprovechá la luz natural durante el día y apagá luces en habitaciones que no estés usando.',
        ].map((tip, i) => (
          <div key={i} className="el-tip-item">
            <div className="el-tip-dot" />
            {tip}
          </div>
        ))}
      </div>
    </div>
  )
}