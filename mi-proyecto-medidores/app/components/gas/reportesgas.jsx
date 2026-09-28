'use client'

import { useState } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'

import {
  FaChartLine,
  FaChartBar,
  FaFilePdf,
  FaArrowUp,
  FaArrowDown,
  FaGasPump,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCalendarAlt,
  FaFileExport,
  FaMoneyBillWave,
  FaCar,
  FaTachometerAlt,
  FaClock
} from 'react-icons/fa'

import { jsPDF } from 'jspdf'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;500;600;700&display=swap');

  .r-root {
    --white: #ffffff;
    --off: #f9f9f8;
    --border: #ebebea;
    --border-md: #d4d4d0;

    --ink: #111110;
    --ink-2: #3a3a38;
    --ink-3: #737370;
    --ink-4: #b0b0ac;

    --gas: #f97316;
    --gas-dk: #c2410c;
    --gas-bg: #fff7ed;
    --gas-bd: #fed7aa;

    --indigo: #4f46e5;
    --indigo-bg: #eef0fd;
    --indigo-bd: #c7c3f7;

    --amber: #d97706;
    --amber-bg: #fffbeb;
    --amber-bd: #fde68a;

    --red: #dc2626;
    --red-bg: #fef2f2;
    --red-bd: #fecaca;

    --green: #16a34a;
    --green-bg: #f0fdf4;
    --green-bd: #bbf7d0;

    font-family: 'Inter', system-ui, sans-serif;
    color: var(--ink);
    padding: 0;
  }

  .r-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 24px;
    border-bottom: 1.5px solid var(--border);
    margin-bottom: 28px;
  }

  .r-header-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: var(--ink);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gas);
    flex-shrink: 0;
  }

  .r-title {
    font-weight: 700;
    font-size: 28px;
    color: var(--ink);
    letter-spacing: -.02em;
    line-height: 1.1;
  }

  .r-subtitle {
    font-size: 13px;
    color: var(--ink-3);
    margin-top: 4px;
  }

  .r-controls {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .r-input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    padding: 0 12px;
    height: 38px;
    transition: border-color .15s;
  }

  .r-input-wrap:focus-within {
    border-color: var(--gas);
  }

  .r-input-wrap svg {
    color: var(--ink-3);
    font-size: 13px;
  }

  .r-input-wrap input {
    border: none;
    outline: none;
    background: transparent;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: var(--ink);
  }

  .r-export-wrap {
    display: flex;
    gap: 10px;
    margin-left: auto;
    flex-wrap: wrap;
  }

  .r-export-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    border-radius: 10px;
    border: 1.5px solid;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all .15s;
  }

  .r-btn-pdf {
    background: var(--red-bg);
    border-color: var(--red-bd);
    color: var(--red);
  }

  .r-btn-pdf:hover {
    background: #fce8e8;
  }

  .r-btn-csv {
    background: var(--green-bg);
    border-color: var(--green-bd);
    color: var(--green);
  }

  .r-btn-csv:hover {
    background: #d3f5e0;
  }

  .r-clear {
    padding: 7px 16px;
    border-radius: 8px;
    border: 1.5px solid var(--border-md);
    background: transparent;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    cursor: pointer;
    color: var(--ink-3);
  }

  .r-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 24px;
  }

  .r-stat {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 20px 18px;
    transition: border-color .2s, transform .15s;
  }

  .r-stat:hover {
    border-color: var(--border-md);
    transform: translateY(-2px);
  }

  .r-stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    font-size: 15px;
  }

  .icon-gas {
    background: var(--gas-bg);
    color: var(--gas);
  }

  .icon-red {
    background: var(--red-bg);
    color: var(--red);
  }

  .icon-green {
    background: var(--green-bg);
    color: var(--green);
  }

  .icon-ind {
    background: var(--indigo-bg);
    color: var(--indigo);
  }

  .r-stat-lbl {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--ink-4);
    margin-bottom: 6px;
  }

  .r-stat-val {
    font-weight: 700;
    font-size: 24px;
    color: var(--ink);
    letter-spacing: -.02em;
  }

  .r-stat-sub {
    font-size: 12px;
    color: var(--ink-3);
    margin-top: 5px;
  }

  .r-alerta {
    border-radius: 14px;
    padding: 16px 20px;
    margin-bottom: 16px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    border: 1.5px solid;
  }

  .r-alerta.warn {
    background: var(--amber-bg);
    border-color: var(--amber-bd);
  }

  .r-alerta.ok {
    background: var(--green-bg);
    border-color: var(--green-bd);
  }

  .r-alerta.info {
    background: var(--indigo-bg);
    border-color: var(--indigo-bd);
  }

  .r-alerta.gas {
    background: var(--gas-bg);
    border-color: var(--gas-bd);
  }

  .r-alerta-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .r-alerta.warn .r-alerta-icon {
    background: var(--amber-bd);
    color: var(--amber);
  }

  .r-alerta.ok .r-alerta-icon {
    background: var(--green-bd);
    color: var(--green);
  }

  .r-alerta.info .r-alerta-icon {
    background: var(--indigo-bd);
    color: var(--indigo);
  }

  .r-alerta.gas .r-alerta-icon {
    background: var(--gas-bd);
    color: var(--gas-dk);
  }

  .r-alerta-t {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 3px;
  }

  .r-alerta.warn .r-alerta-t {
    color: var(--amber);
  }

  .r-alerta.ok .r-alerta-t {
    color: var(--green);
  }

  .r-alerta.info .r-alerta-t {
    color: var(--indigo);
  }

  .r-alerta.gas .r-alerta-t {
    color: var(--gas-dk);
  }

  .r-alerta-b {
    font-size: 13px;
    color: var(--ink-2);
    line-height: 1.5;
  }

  .r-card {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 22px 24px;
    margin-bottom: 24px;
  }

  .r-card-title {
    font-weight: 600;
    font-size: 15px;
    color: var(--ink);
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .r-card-sub {
    font-size: 12px;
    color: var(--ink-3);
    margin-bottom: 20px;
  }

  .r-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 20px;
  }

  .r-tab {
    padding: 7px 16px;
    border-radius: 8px;
    border: 1.5px solid var(--border);
    background: transparent;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: var(--ink-3);
    cursor: pointer;
    transition: all .15s;
  }

  .r-tab:hover {
    background: var(--off);
    color: var(--ink);
  }

  .r-tab.on {
    background: var(--ink);
    color: #fff;
    border-color: var(--ink);
  }

  .r-ahorro-card {
    background: var(--ink);
    border-radius: 16px;
    padding: 22px 24px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .r-ahorro-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: rgba(255,255,255,.4);
    margin-bottom: 8px;
  }

  .r-ahorro-title {
    font-weight: 700;
    font-size: 20px;
    color: #fff;
    margin-bottom: 6px;
  }

  .r-ahorro-sub {
    font-size: 12px;
    color: rgba(255,255,255,.4);
    line-height: 1.5;
  }

  .r-ahorro-val {
    font-weight: 700;
    font-size: 40px;
    color: var(--gas);
    letter-spacing: -.03em;
  }

  .r-ahorro-unit {
    font-size: 14px;
    color: rgba(255,255,255,.4);
  }

  .r-distrib {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-top: 12px;
  }

  .r-dist-item {
    background: var(--off);
    border-radius: 12px;
    padding: 14px 16px;
    text-align: center;
    border: 1.5px solid var(--border);
  }

  .r-dist-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 0 auto 8px;
  }

  .r-dist-lbl {
    font-size: 11px;
    color: var(--ink-3);
    margin-bottom: 4px;
  }

  .r-dist-val {
    font-weight: 700;
    font-size: 22px;
  }

  .r-tips {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 22px 24px;
  }

  .r-tips-title {
    font-weight: 600;
    font-size: 14px;
    color: var(--ink);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .r-tip {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
    color: var(--ink-2);
    line-height: 1.55;
  }

  .r-tip:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .r-tip-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--gas);
    flex-shrink: 0;
    margin-top: 6px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 900px) {
    .r-stats {
      grid-template-columns: 1fr 1fr;
    }

    .r-distrib {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 600px) {
    .r-stats {
      grid-template-columns: 1fr;
    }

    .r-distrib {
      grid-template-columns: 1fr;
    }

    .r-ahorro-card {
      flex-direction: column;
      align-items: flex-start;
    }

    .r-export-wrap {
      margin-left: 0;
    }
  }
`

/*
  DATOS SIMULADOS
  Estos datos representan la operación de una estación de servicio GNV.
*/

const DATOS_MENSUALES = [
  {
    fecha: '2026-01',
    label: 'Ene 2026',
    volumen: 18450,
    ingresos: 55350,
    vehiculos: 1230
  },
  {
    fecha: '2026-02',
    label: 'Feb 2026',
    volumen: 19820,
    ingresos: 59460,
    vehiculos: 1320
  },
  {
    fecha: '2026-03',
    label: 'Mar 2026',
    volumen: 20550,
    ingresos: 61650,
    vehiculos: 1370
  },
  {
    fecha: '2026-04',
    label: 'Abr 2026',
    volumen: 21900,
    ingresos: 65700,
    vehiculos: 1460
  },
  {
    fecha: '2026-05',
    label: 'May 2026',
    volumen: 23150,
    ingresos: 69450,
    vehiculos: 1540
  },
  {
    fecha: '2026-06',
    label: 'Jun 2026',
    volumen: 22500,
    ingresos: 67500,
    vehiculos: 1500
  },
  {
    fecha: '2026-07',
    label: 'Jul 2026',
    volumen: 24100,
    ingresos: 72300,
    vehiculos: 1610
  },
  {
    fecha: '2026-08',
    label: 'Ago 2026',
    volumen: 25350,
    ingresos: 76050,
    vehiculos: 1690
  }
]

const SURTIDORES = [
  {
    nombre: 'Surtidor 01',
    volumen: 6850,
    ventas: 20550,
    porcentaje: 27
  },
  {
    nombre: 'Surtidor 02',
    volumen: 6420,
    ventas: 19260,
    porcentaje: 25
  },
  {
    nombre: 'Surtidor 03',
    volumen: 6180,
    ventas: 18540,
    porcentaje: 24
  },
  {
    nombre: 'Surtidor 04',
    volumen: 5900,
    ventas: 17700,
    porcentaje: 24
  }
]

const PRECIO_GNV = 3

export default function ReportesGas() {
  const [filtro, setFiltro] = useState('')
  const [vista, setVista] = useState('area')

  const filtrados = filtro
    ? DATOS_MENSUALES.filter(item => item.fecha === filtro)
    : DATOS_MENSUALES

  const totalVolumen = filtrados.reduce(
    (total, item) => total + item.volumen,
    0
  )

  const totalIngresos = filtrados.reduce(
    (total, item) => total + item.ingresos,
    0
  )

  const totalVehiculos = filtrados.reduce(
    (total, item) => total + item.vehiculos,
    0
  )

  const promedioVolumen = filtrados.length
    ? totalVolumen / filtrados.length
    : 0

  const promedioVehiculos = filtrados.length
    ? totalVehiculos / filtrados.length
    : 0

  const ultimo = filtrados[filtrados.length - 1]
  const anterior = filtrados[filtrados.length - 2]

  const tendencia = ultimo && anterior
    ? {
        diferencia: ultimo.volumen - anterior.volumen,
        porcentaje:
          ((ultimo.volumen - anterior.volumen) /
            (anterior.volumen || 1)) *
          100
      }
    : null

  const exportarPDF = () => {
    const doc = new jsPDF()

    doc.setFillColor(194, 65, 12)
    doc.rect(0, 0, 210, 45, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont(undefined, 'bold')

    doc.text(
      'Reporte de Operación · Estación GNV',
      15,
      20
    )

    doc.setFontSize(9)
    doc.setFont(undefined, 'normal')

    doc.text(
      `Fecha: ${new Date().toLocaleDateString('es-BO')}`,
      15,
      30
    )

    doc.text(
      `Período: ${filtro || 'Todos los registros'}`,
      15,
      37
    )

    let y = 60

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(13)
    doc.setFont(undefined, 'bold')

    doc.text('Resumen operativo', 15, y)

    y += 10

    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')

    const datos = [
      `Volumen despachado: ${totalVolumen.toLocaleString()} m³`,
      `Ingresos generados: Bs ${totalIngresos.toLocaleString()}`,
      `Vehículos atendidos: ${totalVehiculos.toLocaleString()}`,
      `Promedio mensual: ${promedioVolumen.toFixed(0)} m³`,
      `Promedio de vehículos: ${promedioVehiculos.toFixed(0)} vehículos`
    ]

    datos.forEach(texto => {
      doc.text(`• ${texto}`, 20, y)
      y += 8
    })

    y += 8

    doc.setFontSize(13)
    doc.setFont(undefined, 'bold')

    doc.text('Rendimiento por surtidor', 15, y)

    y += 10

    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')

    SURTIDORES.forEach(s => {
      doc.text(
        `• ${s.nombre}: ${s.volumen.toLocaleString()} m³ · Bs ${s.ventas.toLocaleString()}`,
        20,
        y
      )

      y += 8
    })

    doc.setFontSize(7)
    doc.setTextColor(100, 100, 100)

    doc.text(
      'Sistema de Digitalización de Servicios Básicos · Estación de Servicio GNV',
      15,
      280
    )

    doc.save(
      `Reporte_Estacion_GNV_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`
    )
  }

  const exportarCSV = () => {
    const headers = [
      'Fecha',
      'Volumen despachado (m³)',
      'Ingresos (Bs)',
      'Vehículos atendidos'
    ]

    let csv = headers.join(',') + '\n'

    filtrados.forEach(item => {
      csv += [
        item.fecha,
        item.volumen,
        item.ingresos,
        item.vehiculos
      ].join(',') + '\n'
    })

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    })

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')

    a.href = url
    a.download = `reporte_estacion_gnv_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`

    a.click()

    URL.revokeObjectURL(url)
  }

  const tooltipStyle = {
    contentStyle: {
      background: '#111110',
      border: 'none',
      borderRadius: 10,
      color: '#fff',
      fontSize: 12,
      fontFamily: 'Inter, sans-serif'
    },
    labelStyle: {
      color: 'rgba(255,255,255,.5)',
      marginBottom: 4
    }
  }

  const ChartComponent = () => {
    if (!filtrados.length) {
      return (
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#b0b0ac',
            fontSize: 13
          }}
        >
          No hay datos para el período seleccionado
        </div>
      )
    }

    if (vista === 'area') {
      return (
        <AreaChart data={filtrados}>
          <defs>
            <linearGradient
              id="gradGas"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#f97316"
                stopOpacity={0.25}
              />

              <stop
                offset="95%"
                stopColor="#f97316"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#ebebea"
          />

          <XAxis
            dataKey="label"
            stroke="#b0b0ac"
            tick={{ fontSize: 11 }}
          />

          <YAxis
            stroke="#b0b0ac"
            tick={{ fontSize: 11 }}
          />

          <Tooltip
            {...tooltipStyle}
            formatter={(value) => [
              `${Number(value).toLocaleString()} m³`,
              'Volumen'
            ]}
          />

          <Area
            type="monotone"
            dataKey="volumen"
            stroke="#f97316"
            strokeWidth={2.5}
            fill="url(#gradGas)"
          />
        </AreaChart>
      )
    }

    if (vista === 'linea') {
      return (
        <LineChart data={filtrados}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#ebebea"
          />

          <XAxis
            dataKey="label"
            stroke="#b0b0ac"
            tick={{ fontSize: 11 }}
          />

          <YAxis
            stroke="#b0b0ac"
            tick={{ fontSize: 11 }}
          />

          <Tooltip
            {...tooltipStyle}
            formatter={(value) => [
              `${Number(value).toLocaleString()} m³`,
              'Volumen'
            ]}
          />

          <Line
            type="monotone"
            dataKey="volumen"
            stroke="#f97316"
            strokeWidth={2.5}
            dot={{
              fill: '#f97316',
              r: 4
            }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      )
    }

    return (
      <BarChart data={filtrados}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#ebebea"
        />

        <XAxis
          dataKey="label"
          stroke="#b0b0ac"
          tick={{ fontSize: 11 }}
        />

        <YAxis
          stroke="#b0b0ac"
          tick={{ fontSize: 11 }}
        />

        <Tooltip
          {...tooltipStyle}
          formatter={(value) => [
            `${Number(value).toLocaleString()} m³`,
            'Volumen'
          ]}
        />

        <Bar
          dataKey="volumen"
          fill="#f97316"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    )
  }

  return (
    <div className="r-root">
      <style>{css}</style>

      {/* HEADER */}

      <div className="r-header">
        <div className="r-header-icon">
          <FaChartLine size={22} />
        </div>

        <div>
          <div className="r-title">
            Reportes y análisis
          </div>

          <div className="r-subtitle">
            Operación de estación de servicio GNV ·
            Volumen, ventas y atención vehicular
          </div>
        </div>
      </div>

      {/* CONTROLES */}

      <div className="r-controls">
        <div className="r-input-wrap">
          <FaCalendarAlt />

          <input
            type="month"
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
          />
        </div>

        {filtro && (
          <button
            className="r-clear"
            onClick={() => setFiltro('')}
          >
            Limpiar ×
          </button>
        )}

        <div className="r-export-wrap">
          <button
            className="r-export-btn r-btn-pdf"
            onClick={exportarPDF}
          >
            <FaFilePdf />
            PDF
          </button>

          <button
            className="r-export-btn r-btn-csv"
            onClick={exportarCSV}
          >
            <FaFileExport />
            CSV
          </button>
        </div>
      </div>

      {/* ESTADÍSTICAS */}

      <div className="r-stats">

        <div className="r-stat">
          <div className="r-stat-icon icon-gas">
            <FaGasPump />
          </div>

          <div className="r-stat-lbl">
            Volumen despachado
          </div>

          <div className="r-stat-val">
            {totalVolumen.toLocaleString()} m³
          </div>

          <div className="r-stat-sub">
            Gas GNV suministrado
          </div>
        </div>

        <div className="r-stat">
          <div className="r-stat-icon icon-green">
            <FaMoneyBillWave />
          </div>

          <div className="r-stat-lbl">
            Ingresos generados
          </div>

          <div className="r-stat-val">
            Bs {totalIngresos.toLocaleString()}
          </div>

          <div className="r-stat-sub">
            Ventas simuladas
          </div>
        </div>

        <div className="r-stat">
          <div className="r-stat-icon icon-ind">
            <FaCar />
          </div>

          <div className="r-stat-lbl">
            Vehículos atendidos
          </div>

          <div className="r-stat-val">
            {totalVehiculos.toLocaleString()}
          </div>

          <div className="r-stat-sub">
            Cargas realizadas
          </div>
        </div>

        <div className="r-stat">
          <div className="r-stat-icon icon-red">
            <FaTachometerAlt />
          </div>

          <div className="r-stat-lbl">
            Promedio por mes
          </div>

          <div className="r-stat-val">
            {promedioVolumen.toFixed(0)} m³
          </div>

          <div className="r-stat-sub">
            Despacho promedio
          </div>
        </div>

      </div>

      {/* TENDENCIA */}

      {tendencia && (
        <div
          className={
            `r-alerta ${
              tendencia.porcentaje >= 0
                ? 'ok'
                : 'info'
            }`
          }
        >
          <div className="r-alerta-icon">
            {tendencia.porcentaje >= 0
              ? <FaArrowUp />
              : <FaArrowDown />
            }
          </div>

          <div>
            <div className="r-alerta-t">
              Tendencia de despacho
            </div>

            <div className="r-alerta-b">
              El volumen despachado {
                tendencia.porcentaje >= 0
                  ? 'aumentó'
                  : 'disminuyó'
              } un{' '}
              <strong>
                {Math.abs(tendencia.porcentaje).toFixed(1)}%
              </strong>{' '}
              respecto al período anterior.
            </div>
          </div>
        </div>
      )}

      {/* ALERTA OPERATIVA */}

      <div className="r-alerta gas">
        <div className="r-alerta-icon">
          <FaGasPump />
        </div>

        <div>
          <div className="r-alerta-t">
            Estado general de la estación
          </div>

          <div className="r-alerta-b">
            La estación registra operación normal.
            Los cuatro surtidores se encuentran
            disponibles para despacho de GNV.
          </div>
        </div>
      </div>

      {/* ALERTA */}

      <div className="r-alerta warn">
        <div className="r-alerta-icon">
          <FaExclamationTriangle />
        </div>

        <div>
          <div className="r-alerta-t">
            Control de mantenimiento
          </div>

          <div className="r-alerta-b">
            Se recomienda revisar periódicamente
            mangueras, boquillas, surtidores y
            equipos de compresión para mantener
            la operación segura.
          </div>
        </div>
      </div>

      {/* INFORMACIÓN */}

      <div className="r-alerta info">
        <div className="r-alerta-icon">
          <FaInfoCircle />
        </div>

        <div>
          <div className="r-alerta-t">
            Reporte operativo
          </div>

          <div className="r-alerta-b">
            Este módulo permite visualizar el
            comportamiento de las ventas de GNV,
            volumen despachado y cantidad de
            vehículos atendidos.
          </div>
        </div>
      </div>

      {/* GRÁFICO */}

      <div className="r-card">

        <div className="r-card-title">
          <FaChartBar
            style={{ color: 'var(--gas)' }}
          />

          Volumen despachado de GNV
        </div>

        <div className="r-card-sub">
          Evolución del volumen suministrado
          por período · metros cúbicos
        </div>

        <div className="r-tabs">

          {[
            ['area', 'Área'],
            ['linea', 'Línea'],
            ['barras', 'Barras']
          ].map(([id, label]) => (
            <button
              key={id}
              className={`r-tab ${
                vista === id ? 'on' : ''
              }`}
              onClick={() => setVista(id)}
            >
              {label}
            </button>
          ))}

        </div>

        <div style={{ height: 280 }}>

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <ChartComponent />
          </ResponsiveContainer>

        </div>

      </div>

      {/* RENDIMIENTO SURTIDORES */}

      <div className="r-card">

        <div className="r-card-title">
          <FaTachometerAlt
            style={{ color: 'var(--indigo)' }}
          />

          Rendimiento por surtidor
        </div>

        <div className="r-card-sub">
          Distribución simulada del volumen
          despachado por equipo
        </div>

        <div className="r-distrib">

          {SURTIDORES.map((s, index) => (
            <div
              key={s.nombre}
              className="r-dist-item"
            >

              <div
                className="r-dist-dot"
                style={{
                  background:
                    index === 0
                      ? 'var(--gas)'
                      : index === 1
                        ? 'var(--indigo)'
                        : index === 2
                          ? 'var(--amber)'
                          : 'var(--green)'
                }}
              />

              <div className="r-dist-lbl">
                {s.nombre}
              </div>

              <div
                className="r-dist-val"
                style={{
                  color:
                    index === 0
                      ? 'var(--gas-dk)'
                      : index === 1
                        ? 'var(--indigo)'
                        : index === 2
                          ? 'var(--amber)'
                          : 'var(--green)'
                }}
              >
                {s.porcentaje}%
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: 'var(--ink-4)',
                  marginTop: 3
                }}
              >
                {s.volumen.toLocaleString()} m³
              </div>

            </div>
          ))}

        </div>

      </div>

      {/* INGRESOS */}

      <div className="r-ahorro-card">

        <div>
          <div className="r-ahorro-label">
            Facturación estimada
          </div>

          <div className="r-ahorro-title">
            Ingresos por venta de GNV
          </div>

          <div className="r-ahorro-sub">
            Estimación basada en el volumen
            despachado y un precio referencial
            de Bs {PRECIO_GNV.toFixed(2)} por m³.
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>

          <div className="r-ahorro-val">
            Bs {totalIngresos.toLocaleString()}
          </div>

          <div className="r-ahorro-unit">
            ingresos estimados
          </div>

        </div>

      </div>

      {/* CONSEJOS */}

      <div className="r-tips">

        <div className="r-tips-title">
          <FaInfoCircle
            style={{ color: 'var(--gas)' }}
          />

          ¿Para qué sirve este reporte?
        </div>

        {[
          'Permite conocer cuánto GNV despacha la estación durante un período determinado.',
          'Ayuda a controlar los ingresos generados por la venta de GNV.',
          'Permite conocer cuántos vehículos fueron atendidos en la estación.',
          'Facilita comparar el rendimiento de los diferentes surtidores.',
          'Ayuda a identificar aumentos o disminuciones en la demanda de GNV.',
          'Los reportes pueden exportarse en PDF o CSV para su revisión administrativa.'
        ].map((tip, index) => (
          <div
            key={index}
            className="r-tip"
          >
            <div className="r-tip-dot" />
            {tip}
          </div>
        ))}

      </div>

    </div>
  )
}