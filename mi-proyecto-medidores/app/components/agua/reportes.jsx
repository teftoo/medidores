'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  FaChartLine, FaChartBar, FaFilePdf, FaArrowUp, FaArrowDown,
  FaTint, FaInfoCircle, FaExclamationTriangle, FaCheckCircle,
  FaBolt, FaDollarSign, FaCalendarAlt, FaFileExport
} from 'react-icons/fa'
import { jsPDF } from 'jspdf'
import { supabase } from '@/lib/supabaseClient'
import { calcularTarifaCompleta } from '@/lib/tariffUtils'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  .r-root {
    --white:     #ffffff;
    --off:       #f9f9f8;
    --border:    #ebebea;
    --border-md: #d4d4d0;
    --ink:       #111110;
    --ink-2:     #3a3a38;
    --ink-3:     #737370;
    --ink-4:     #b0b0ac;
    --teal:      #0ea5b8;
    --teal-dk:   #0b7a8a;
    --teal-bg:   #e3f6fb;
    --teal-bd:   #a8e0ea;
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

  .r-header {
    display: flex; align-items: center; gap: 16px;
    padding-bottom: 24px; border-bottom: 1.5px solid var(--border); margin-bottom: 28px;
  }
  .r-header-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--ink); display: flex; align-items: center;
    justify-content: center; color: var(--teal); flex-shrink: 0;
  }
  .r-title {
    font-family: 'Inter', sans-serif; font-weight: 800; font-size: 28px;
    color: var(--ink); letter-spacing: -.02em; line-height: 1.1;
  }
  .r-subtitle { font-size: 13px; color: var(--ink-3); margin-top: 4px; }

  .r-export-wrap { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
  .r-export-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 10px; border: 1.5px solid;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all .15s;
  }
  .r-btn-pdf { background: var(--red-bg); border-color: var(--red-bd); color: var(--red); }
  .r-btn-pdf:hover { background: #fce8e8; }
  .r-btn-csv { background: var(--green-bg); border-color: var(--green-bd); color: var(--green); }
  .r-btn-csv:hover { background: #d3f5e0; }

  .r-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .r-stat {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 16px; padding: 20px 18px;
    transition: border-color .2s, transform .15s;
  }
  .r-stat:hover { border-color: var(--border-md); transform: translateY(-2px); }
  .r-stat-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px; font-size: 15px;
  }
  .icon-teal  { background: var(--teal-bg);   color: var(--teal);   }
  .icon-red   { background: var(--red-bg);    color: var(--red);    }
  .icon-green { background: var(--green-bg);  color: var(--green);  }
  .icon-ind   { background: var(--indigo-bg); color: var(--indigo); }
  .r-stat-lbl { font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-4); margin-bottom: 6px; }
  .r-stat-val { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 24px; color: var(--ink); letter-spacing: -.02em; }
  .r-stat-sub { font-size: 12px; color: var(--ink-3); margin-top: 5px; }

  .r-alerta {
    border-radius: 14px; padding: 16px 20px; margin-bottom: 16px;
    display: flex; align-items: flex-start; gap: 14px; border: 1.5px solid;
  }
  .r-alerta.warn { background: var(--amber-bg); border-color: var(--amber-bd); }
  .r-alerta.ok   { background: var(--green-bg); border-color: var(--green-bd); }
  .r-alerta.info { background: var(--indigo-bg); border-color: var(--indigo-bd); }
  .r-alerta-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .r-alerta.warn .r-alerta-icon { background: var(--amber-bd); color: var(--amber); }
  .r-alerta.ok   .r-alerta-icon { background: var(--green-bd); color: var(--green); }
  .r-alerta.info .r-alerta-icon { background: var(--indigo-bd); color: var(--indigo); }
  .r-alerta-t { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 14px; margin-bottom: 3px; }
  .r-alerta.warn .r-alerta-t { color: var(--amber); }
  .r-alerta.ok   .r-alerta-t { color: var(--green); }
  .r-alerta.info .r-alerta-t { color: var(--indigo); }
  .r-alerta-b { font-size: 13px; color: var(--ink-2); line-height: 1.5; }

  .r-card {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 16px; padding: 22px 24px; margin-bottom: 24px;
  }
  .r-card-title {
    font-family: 'Inter', sans-serif; font-weight: 700; font-size: 15px;
    color: var(--ink); margin-bottom: 4px; display: flex; align-items: center; gap: 8px;
  }
  .r-card-sub { font-size: 12px; color: var(--ink-3); margin-bottom: 20px; }

  .r-tabs { display: flex; gap: 4px; margin-bottom: 20px; }
  .r-tab {
    padding: 7px 16px; border-radius: 8px; border: 1.5px solid var(--border);
    background: transparent; font-family: 'Inter', sans-serif; font-size: 12px;
    font-weight: 500; color: var(--ink-3); cursor: pointer; transition: all .15s;
  }
  .r-tab:hover { background: var(--off); color: var(--ink); }
  .r-tab.on { background: var(--ink); color: #fff; border-color: var(--ink); }

  .r-distrib { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 12px; }
  .r-dist-item {
    background: var(--off); border-radius: 12px; padding: 14px 16px;
    text-align: center; border: 1.5px solid var(--border);
  }
  .r-dist-dot { width: 10px; height: 10px; border-radius: 50%; margin: 0 auto 8px; }
  .r-dist-lbl { font-size: 11px; color: var(--ink-3); margin-bottom: 4px; }
  .r-dist-val { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 22px; }

  .r-tips {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 16px; padding: 22px 24px;
  }
  .r-tips-title {
    font-family: 'Inter', sans-serif; font-weight: 700; font-size: 14px;
    color: var(--ink); margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .r-tip {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 0; border-bottom: 1px solid var(--border);
    font-size: 13px; color: var(--ink-2); line-height: 1.55;
  }
  .r-tip:last-child { border-bottom: none; padding-bottom: 0; }
  .r-tip-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--teal); flex-shrink: 0; margin-top: 6px; }

  .r-input-wrap {
    display: flex; align-items: center; gap: 8px;
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 10px; padding: 0 12px; height: 38px;
    transition: border-color .15s;
  }
  .r-input-wrap:focus-within { border-color: var(--teal); }
  .r-input-wrap svg { color: var(--ink-3); font-size: 13px; }
  .r-input-wrap input {
    border: none; outline: none; background: transparent;
    font-family: 'Inter', sans-serif; font-size: 13px; color: var(--ink);
  }

  @media (max-width: 820px) {
    .r-stats { grid-template-columns: 1fr 1fr; }
    .r-distrib { grid-template-columns: 1fr; }
  }
  @media (max-width: 520px) {
    .r-stats { grid-template-columns: 1fr; }
  }
`

const MESES = {
  '01':'Enero','02':'Febrero','03':'Marzo','04':'Abril',
  '05':'Mayo','06':'Junio','07':'Julio','08':'Agosto',
  '09':'Sep.','10':'Oct.','11':'Nov.','12':'Dic.'
}

const tooltipStyle = {
  contentStyle: {
    background: '#111110', border: 'none', borderRadius: 10,
    color: '#fff', fontSize: 12, fontFamily: 'Inter, sans-serif'
  },
  formatter: (v) => [`${v} m³`, 'Consumo'],
  labelStyle: { color: 'rgba(255,255,255,.5)', marginBottom: 4 },
}

export default function Reportes() {
  const [usuario,   setUsuario]   = useState(null)
  const [lecturas,  setLecturas]  = useState([])
  const [filtro,    setFiltro]    = useState('')
  const [filtrados, setFiltrados] = useState([])
  const [vista,     setVista]     = useState('area')
  const [catU,      setCatU]      = useState('R')
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
            label: `${MESES[String(f.getMonth() + 1).padStart(2, '0')]} ${f.getFullYear()}`,
            costo: consumo * 4.5,
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

  const estadisticas = {
    total:    filtrados.reduce((s, i) => s + i.consumo, 0).toFixed(2),
    promedio: filtrados.length ? (filtrados.reduce((s, i) => s + i.consumo, 0) / filtrados.length).toFixed(2) : '0',
    maximo:   filtrados.length ? Math.max(...filtrados.map(i => i.consumo)).toFixed(2) : '0',
    minimo:   filtrados.length ? Math.min(...filtrados.map(i => i.consumo)).toFixed(2) : '0',
    costoTotal: filtrados.reduce((s, i) => s + i.costo, 0).toFixed(2),
  }

  const tendencia = (() => {
    if (filtrados.length < 2) return null
    const ult = filtrados[filtrados.length - 1].consumo
    const pen = filtrados[filtrados.length - 2].consumo
    const dif = ult - pen
    return { dif, pct: ((dif / (pen || 1)) * 100).toFixed(1), sube: dif > 0 }
  })()

  const distribucion = {
    opt: filtrados.filter(i => i.consumo <= 10).length,
    nor: filtrados.filter(i => i.consumo > 10 && i.consumo <= 20).length,
    alt: filtrados.filter(i => i.consumo > 20).length,
  }

  const exportarPDF = () => {
    if (!usuario) return
    const doc = new jsPDF()
    doc.setFillColor(0, 51, 102); doc.rect(0, 0, 210, 45, 'F')
    doc.setTextColor(255, 255, 255); doc.setFontSize(16); doc.setFont(undefined, 'bold')
    doc.text('Reporte de Consumo de Agua', 15, 20)
    doc.setFontSize(9); doc.setFont(undefined, 'normal')
    doc.text(`Usuario: ${usuario.nombre || 'N/A'} · Fecha: ${new Date().toLocaleDateString('es-BO')}`, 15, 30)
    doc.text(`Período: ${filtro || 'Todos los registros'}`, 15, 37)
    let y = 60
    doc.setTextColor(0,0,0); doc.setFontSize(13); doc.setFont(undefined, 'bold')
    doc.text('Estadísticas', 15, y); y += 10
    doc.setFontSize(10); doc.setFont(undefined, 'normal')
    const items = [
      `Consumo total: ${estadisticas.total} m³`,
      `Consumo promedio: ${estadisticas.promedio} m³`,
      `Consumo máximo: ${estadisticas.maximo} m³`,
      `Consumo mínimo: ${estadisticas.minimo} m³`,
      `Costo total estimado: Bs ${estadisticas.costoTotal}`,
    ]
    items.forEach(t => { doc.text(`• ${t}`, 20, y); y += 8 })
    if (tendencia) {
      y += 5; doc.setFontSize(13); doc.setFont(undefined, 'bold')
      doc.text('Tendencia', 15, y); y += 10
      doc.setFontSize(10); doc.setFont(undefined, 'normal')
      doc.text(`• ${tendencia.sube ? 'Aumento' : 'Reducción'} del ${Math.abs(tendencia.pct)}%`, 20, y)
    }
    doc.setTextColor(100,100,100); doc.setFontSize(7)
    doc.text('Generado por ACS — Administración de Consumo por Sector · Cochabamba, Bolivia', 15, 280)
    doc.save(`Reporte_ACS_${new Date().toISOString().slice(0,10)}.pdf`)
  }

  const exportarCSV = () => {
    const headers = ['Fecha', 'Consumo (m³)', 'Costo estimado (Bs)']
    let csv = headers.join(',') + '\n'
    filtrados.forEach(i => { csv += `${i.fecha},${i.consumo.toFixed(2)},${i.costo.toFixed(2)}\n` })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `consumo_${new Date().toISOString().slice(0,10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  const ChartComponent = () => {
    if (vista === 'area') return (
      <AreaChart data={filtrados}>
        <defs>
          <linearGradient id="gradTeal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0ea5b8" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#0ea5b8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ebebea" />
        <XAxis dataKey="label" stroke="#b0b0ac" tick={{ fontSize: 11 }} />
        <YAxis stroke="#b0b0ac" tick={{ fontSize: 11 }} label={{ value: 'm³', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
        <Tooltip {...tooltipStyle} />
        <Area type="monotone" dataKey="consumo" stroke="#0ea5b8" strokeWidth={2.5} fill="url(#gradTeal)" />
      </AreaChart>
    )
    if (vista === 'linea') return (
      <LineChart data={filtrados}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ebebea" />
        <XAxis dataKey="label" stroke="#b0b0ac" tick={{ fontSize: 11 }} />
        <YAxis stroke="#b0b0ac" tick={{ fontSize: 11 }} label={{ value: 'm³', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
        <Tooltip {...tooltipStyle} />
        <Line type="monotone" dataKey="consumo" stroke="#0ea5b8" strokeWidth={2.5} dot={{ fill: '#0ea5b8', r: 4 }} activeDot={{ r: 7 }} />
      </LineChart>
    )
    return (
      <BarChart data={filtrados}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ebebea" />
        <XAxis dataKey="label" stroke="#b0b0ac" tick={{ fontSize: 11 }} />
        <YAxis stroke="#b0b0ac" tick={{ fontSize: 11 }} label={{ value: 'm³', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="consumo" fill="#0ea5b8" radius={[6, 6, 0, 0]} />
      </BarChart>
    )
  }

  if (cargando) return (
    <div className="r-root">
      <style>{css}</style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 40px', gap: 16 }}>
        <div style={{ width: 44, height: 44, border: '2.5px solid #ebebea', borderTopColor: '#0ea5b8', borderRadius: '50%', animation: 'spin .65s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: 12, color: '#b0b0ac', textTransform: 'uppercase', letterSpacing: '.1em' }}>Cargando reportes</p>
      </div>
    </div>
  )

  return (
    <div className="r-root">
      <style>{css}</style>

      {/* HEADER */}
      <div className="r-header">
        <div className="r-header-icon"><FaChartLine size={22} /></div>
        <div>
          <div className="r-title">Reportes y análisis</div>
          <div className="r-subtitle">Estadísticas detalladas de tu consumo · Administración de Consumo por Sector Cochabamba</div>
        </div>
      </div>

      {/* CONTROLES */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="r-input-wrap">
          <FaCalendarAlt />
          <input type="month" value={filtro} onChange={e => setFiltro(e.target.value)} />
        </div>
        {filtro && (
          <button className="r-tab" onClick={() => setFiltro('')} style={{ borderColor: 'var(--border-md)' }}>
            Limpiar ×
          </button>
        )}
        <div className="r-export-wrap" style={{ marginBottom: 0, marginLeft: 'auto' }}>
          <button className="r-export-btn r-btn-pdf" onClick={exportarPDF}><FaFilePdf /> PDF</button>
          <button className="r-export-btn r-btn-csv" onClick={exportarCSV}><FaFileExport /> CSV</button>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="r-stats">
        {[
          { icon: <FaTint />,       cls: 'icon-teal',  lbl: 'Consumo total',    val: `${estadisticas.total} m³`,    sub: 'Acumulado del período'       },
          { icon: <FaChartBar />,   cls: 'icon-ind',   lbl: 'Promedio mensual', val: `${estadisticas.promedio} m³`, sub: 'Tu consumo típico'           },
          { icon: <FaArrowUp />,    cls: 'icon-red',   lbl: 'Consumo máximo',   val: `${estadisticas.maximo} m³`,   sub: 'Mes pico registrado'         },
          { icon: <FaArrowDown />,  cls: 'icon-green', lbl: 'Consumo mínimo',   val: `${estadisticas.minimo} m³`,   sub: 'Mes más eficiente'           },
        ].map((s, i) => (
          <div key={i} className="r-stat">
            <div className={`r-stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="r-stat-lbl">{s.lbl}</div>
            <div className="r-stat-val">{s.val}</div>
            <div className="r-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ALERTAS */}
      {tendencia && tendencia.sube && parseFloat(tendencia.pct) > 20 && (
        <div className="r-alerta warn">
          <div className="r-alerta-icon"><FaExclamationTriangle /></div>
          <div>
            <div className="r-alerta-t">Consumo elevado detectado</div>
            <div className="r-alerta-b">Tu consumo subió {tendencia.pct}% respecto al mes anterior. Revisá posibles fugas.</div>
          </div>
        </div>
      )}
      {parseFloat(estadisticas.promedio) > 15 && (
        <div className="r-alerta warn">
          <div className="r-alerta-icon"><FaTint /></div>
          <div>
            <div className="r-alerta-t">Promedio por encima del referente</div>
            <div className="r-alerta-b">Tu promedio ({estadisticas.promedio} m³) supera el referente nacional de 10 m³/mes. Considerá revisar tus hábitos.</div>
          </div>
        </div>
      )}
      {tendencia && !tendencia.sube && parseFloat(tendencia.pct) > 15 && (
        <div className="r-alerta ok">
          <div className="r-alerta-icon"><FaCheckCircle /></div>
          <div>
            <div className="r-alerta-t">¡Excelente! Reducción de consumo</div>
            <div className="r-alerta-b">Reduciste tu consumo un {Math.abs(tendencia.pct)}%. Cada m³ ahorrado cuenta. ¡Seguí así!</div>
          </div>
        </div>
      )}
      <div className="r-alerta info">
        <div className="r-alerta-icon"><FaBolt /></div>
        <div>
          <div className="r-alerta-t">Predicciones con IA — Próximamente</div>
          <div className="r-alerta-b">Pronto tendrás proyecciones inteligentes de consumo y recomendaciones personalizadas con Machine Learning.</div>
        </div>
      </div>

      {/* GRÁFICO */}
      <div className="r-card">
        <div className="r-card-title"><FaChartBar style={{ color: 'var(--teal)' }} /> Consumo mensual de agua</div>
        <div className="r-card-sub">{filtrados.length} {filtrados.length === 1 ? 'mes' : 'meses'} en el período seleccionado</div>
        <div className="r-tabs">
          {[['area','Área'],['linea','Línea'],['barras','Barras']].map(([id, lbl]) => (
            <button key={id} className={`r-tab${vista === id ? ' on' : ''}`} onClick={() => setVista(id)}>{lbl}</button>
          ))}
        </div>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent />
          </ResponsiveContainer>
        </div>
      </div>

      {/* DISTRIBUCIÓN */}
      <div className="r-card">
        <div className="r-card-title"><FaChartLine style={{ color: 'var(--indigo)' }} /> Distribución por rango de consumo</div>
        <div className="r-card-sub">Clasificación de todas las lecturas del período</div>
        <div className="r-distrib">
          <div className="r-dist-item">
            <div className="r-dist-dot" style={{ background: 'var(--teal)' }} />
            <div className="r-dist-lbl">Óptimo · 0–10 m³</div>
            <div className="r-dist-val" style={{ color: 'var(--teal-dk)' }}>{distribucion.opt}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 3 }}>lecturas</div>
          </div>
          <div className="r-dist-item">
            <div className="r-dist-dot" style={{ background: 'var(--amber)' }} />
            <div className="r-dist-lbl">Normal · 10–20 m³</div>
            <div className="r-dist-val" style={{ color: 'var(--amber)' }}>{distribucion.nor}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 3 }}>lecturas</div>
          </div>
          <div className="r-dist-item">
            <div className="r-dist-dot" style={{ background: 'var(--red)' }} />
            <div className="r-dist-lbl">Alto · más de 20 m³</div>
            <div className="r-dist-val" style={{ color: 'var(--red)' }}>{distribucion.alt}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 3 }}>lecturas</div>
          </div>
        </div>
      </div>

      {/* TIPS */}
      <div className="r-tips">
        <div className="r-tips-title"><FaInfoCircle style={{ color: 'var(--teal)' }} /> Cómo interpretar tu reporte</div>
        {[
          'Un consumo mensual menor a 10 m³ se considera óptimo para una familia de 4 personas.',
          'Comparar tu consumo mes a mes te permite detectar fugas o cambios de hábitos a tiempo.',
          'Exportá el PDF para llevar un registro físico o para presentar reclamos en la oficina ACS.',
          'Si tu consumo sube más de 30% en un mes, es probable que exista una fuga no visible.',
        ].map((tip, i) => (
          <div key={i} className="r-tip">
            <div className="r-tip-dot" />{tip}
          </div>
        ))}
      </div>
    </div>
  )
}

