'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaCalendarAlt,
  FaChartLine,
  FaFileInvoiceDollar,
  FaFilePdf,
  FaFire,
  FaGasPump,
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown,
  FaDollarSign,
  FaIndustry,
  FaRoad,
  FaCheckCircle,
} from 'react-icons/fa'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .gas-root {
    --white: #ffffff;
    --bg: #f7f8f7;
    --border: #e5e7e6;
    --border-strong: #d1d5d2;

    --ink: #101211;
    --ink-2: #343735;
    --ink-3: #727773;
    --ink-4: #9da39f;

    --gas: #00a67e;
    --gas-dark: #007a5e;
    --gas-bg: #e7f8f3;
    --gas-border: #b9eadb;

    --red: #dc2626;
    --red-bg: #fef2f2;
    --red-border: #fecaca;

    --green: #16a34a;
    --green-bg: #f0fdf4;
    --green-border: #bbf7d0;

    --amber: #d97706;
    --amber-bg: #fffbeb;
    --amber-border: #fde68a;

    width: 100%;
    color: var(--ink);
    font-family: 'Inter', system-ui, sans-serif;
  }

  .gas-root * {
    box-sizing: border-box;
  }

  .gas-container {
    width: 100%;
  }

  /* HEADER */

  .gas-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 24px;
    margin-bottom: 22px;
    border-bottom: 1px solid var(--border);
  }

  .gas-header-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;

    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    background: #101211;
    color: var(--gas);

    box-shadow: 0 8px 24px rgba(0, 0, 0, .08);
  }

  .gas-title {
    font-size: clamp(21px, 4vw, 28px);
    font-weight: 800;
    letter-spacing: -.025em;
    line-height: 1.15;
  }

  .gas-subtitle {
    margin-top: 6px;
    color: var(--ink-3);
    font-size: 13px;
    line-height: 1.5;
  }

  /* ESTACIÓN */

  .gas-station {
    display: flex;
    align-items: center;
    gap: 16px;

    padding: 18px 20px;
    margin-bottom: 20px;

    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 18px;

    box-shadow: 0 4px 16px rgba(0, 0, 0, .025);
  }

  .gas-station-avatar {
    width: 48px;
    height: 48px;

    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    border-radius: 13px;

    background: var(--gas-bg);
    color: var(--gas-dark);

    border: 1px solid var(--gas-border);

    font-size: 19px;
  }

  .gas-station-info {
    min-width: 0;
    flex: 1;
  }

  .gas-station-name {
    font-size: 14px;
    font-weight: 800;
  }

  .gas-station-meta {
    margin-top: 5px;

    color: var(--ink-3);
    font-size: 11px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .gas-station-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;

    padding: 7px 12px;

    border-radius: 999px;

    background: var(--gas-bg);
    color: var(--gas-dark);

    border: 1px solid var(--gas-border);

    font-size: 10px;
    font-weight: 700;

    white-space: nowrap;
  }

  /* STATS */

  .gas-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 20px;
  }

  .gas-stat {
    padding: 18px;

    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 17px;

    transition:
      transform .2s ease,
      box-shadow .2s ease,
      border-color .2s ease;
  }

  .gas-stat:hover {
    transform: translateY(-3px);
    border-color: var(--border-strong);
    box-shadow: 0 10px 28px rgba(0, 0, 0, .06);
  }

  .gas-stat-icon {
    width: 36px;
    height: 36px;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-bottom: 13px;

    border-radius: 10px;

    font-size: 14px;
  }

  .gas-icon {
    background: var(--gas-bg);
    color: var(--gas);
  }

  .gas-icon-red {
    background: var(--red-bg);
    color: var(--red);
  }

  .gas-icon-green {
    background: var(--green-bg);
    color: var(--green);
  }

  .gas-icon-amber {
    background: var(--amber-bg);
    color: var(--amber);
  }

  .gas-stat-label {
    color: var(--ink-4);

    font-size: 10px;
    font-weight: 700;

    text-transform: uppercase;
    letter-spacing: .07em;
  }

  .gas-stat-value {
    margin-top: 6px;

    font-size: clamp(18px, 2.5vw, 24px);
    line-height: 1.1;

    font-weight: 800;
    letter-spacing: -.025em;

    font-variant-numeric: tabular-nums;
  }

  .gas-stat-description {
    margin-top: 6px;

    color: var(--ink-3);

    font-size: 11px;
    line-height: 1.4;
  }

  /* TENDENCIA */

  .gas-trend {
    display: flex;
    gap: 13px;
    align-items: flex-start;

    padding: 16px 18px;
    margin-bottom: 20px;

    border-radius: 16px;
    border: 1px solid;
  }

  .gas-trend.up {
    background: var(--red-bg);
    border-color: var(--red-border);
  }

  .gas-trend.down {
    background: var(--green-bg);
    border-color: var(--green-border);
  }

  .gas-trend-icon {
    width: 38px;
    height: 38px;

    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    border-radius: 11px;
  }

  .gas-trend.up .gas-trend-icon {
    background: var(--red-border);
    color: var(--red);
  }

  .gas-trend.down .gas-trend-icon {
    background: var(--green-border);
    color: var(--green);
  }

  .gas-trend-title {
    font-size: 13px;
    font-weight: 800;
  }

  .gas-trend.up .gas-trend-title {
    color: var(--red);
  }

  .gas-trend.down .gas-trend-title {
    color: var(--green);
  }

  .gas-trend-body {
    margin-top: 3px;

    color: var(--ink-2);

    font-size: 12px;
    line-height: 1.5;
  }

  .gas-trend-tip {
    margin-top: 5px;

    color: var(--ink-3);

    font-size: 11px;
  }

  /* CONTROLES */

  .gas-controls {
    display: flex;
    align-items: center;
    gap: 10px;

    flex-wrap: wrap;

    margin-bottom: 14px;
  }

  .gas-date {
    height: 38px;

    display: flex;
    align-items: center;
    gap: 8px;

    padding: 0 11px;

    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 10px;

    transition:
      border-color .2s,
      box-shadow .2s;
  }

  .gas-date:focus-within {
    border-color: var(--gas);
    box-shadow: 0 0 0 3px rgba(0, 166, 126, .08);
  }

  .gas-date svg {
    color: var(--ink-3);
    font-size: 13px;
  }

  .gas-date input {
    border: none;
    outline: none;

    background: transparent;

    color: var(--ink);

    font-family: inherit;
    font-size: 12px;
  }

  .gas-view-tabs {
    display: flex;
    gap: 4px;

    margin-left: auto;
    padding: 3px;

    border-radius: 11px;
    background: #f1f2f1;
  }

  .gas-tab {
    border: none;
    border-radius: 8px;

    padding: 7px 13px;

    background: transparent;
    color: var(--ink-3);

    font-family: inherit;
    font-size: 11px;
    font-weight: 600;

    cursor: pointer;

    transition: all .18s ease;
  }

  .gas-tab:hover {
    color: var(--ink);
  }

  .gas-tab.active {
    background: var(--white);
    color: var(--ink);

    box-shadow: 0 2px 7px rgba(0, 0, 0, .07);
  }

  /* GRÁFICO */

  .gas-chart {
    padding: 22px;
    margin-bottom: 20px;

    background: var(--white);

    border: 1px solid var(--border);
    border-radius: 18px;

    box-shadow: 0 4px 18px rgba(0, 0, 0, .025);
  }

  .gas-chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 12px;
    margin-bottom: 20px;
  }

  .gas-section-title {
    display: flex;
    align-items: center;
    gap: 9px;

    font-size: 14px;
    font-weight: 800;
  }

  .gas-section-title-icon {
    color: var(--gas);
  }

  .gas-section-subtitle {
    margin-top: 4px;

    color: var(--ink-3);

    font-size: 11px;
  }

  .gas-chart-badge {
    padding: 5px 9px;

    border-radius: 7px;

    background: var(--gas-bg);
    color: var(--gas-dark);

    font-size: 10px;
    font-weight: 700;
  }

  /* TABLA */

  .gas-table-card {
    overflow: hidden;

    margin-bottom: 20px;

    background: var(--white);

    border: 1px solid var(--border);
    border-radius: 18px;

    box-shadow: 0 4px 18px rgba(0, 0, 0, .025);
  }

  .gas-table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 17px 20px;

    background: #111211;
    color: white;
  }

  .gas-table-title {
    display: flex;
    align-items: center;
    gap: 9px;

    font-size: 13px;
    font-weight: 700;
  }

  .gas-table-title svg {
    color: var(--gas);
  }

  .gas-table-count {
    margin-top: 4px;

    color: rgba(255, 255, 255, .45);

    font-size: 10px;
  }

  .gas-table-scroll {
    overflow-x: auto;
  }

  .gas-table {
    width: 100%;
    min-width: 720px;

    border-collapse: collapse;
  }

  .gas-table thead {
    background: #f7f8f7;
  }

  .gas-table th {
    padding: 11px 18px;

    text-align: left;

    color: var(--ink-3);

    font-size: 10px;
    font-weight: 700;

    letter-spacing: .06em;
    text-transform: uppercase;

    white-space: nowrap;
  }

  .gas-table td {
    padding: 14px 18px;

    border-top: 1px solid var(--border);

    vertical-align: middle;
  }

  .gas-table tbody tr {
    transition: background .15s;
  }

  .gas-table tbody tr:hover {
    background: #f7fcfa;
  }

  .gas-period {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .gas-period-dot {
    width: 7px;
    height: 7px;

    flex-shrink: 0;

    border-radius: 50%;

    background: var(--gas);

    box-shadow: 0 0 0 4px var(--gas-bg);
  }

  .gas-period-month {
    font-size: 13px;
    font-weight: 700;
  }

  .gas-period-year {
    margin-top: 2px;

    color: var(--ink-4);

    font-size: 10px;
  }

  .gas-consumption {
    font-size: 15px;
    font-weight: 800;

    font-variant-numeric: tabular-nums;
  }

  .gas-bar {
    width: 95px;
    height: 4px;

    margin-top: 6px;

    overflow: hidden;

    border-radius: 99px;

    background: var(--border);
  }

  .gas-bar-fill {
    height: 100%;

    border-radius: inherit;

    background: var(--gas);

    transition: width .4s ease;
  }

  .gas-reading {
    color: var(--ink-2);

    font-size: 12px;
  }

  .gas-reading strong {
    font-weight: 800;
  }

  .gas-reading-sub {
    margin-top: 3px;

    color: var(--ink-4);

    font-size: 10px;
  }

  .gas-level {
    display: inline-flex;

    padding: 4px 9px;

    border-radius: 999px;

    border: 1px solid;

    font-size: 10px;
    font-weight: 700;
  }

  .gas-level.opt {
    background: var(--gas-bg);
    color: var(--gas-dark);
    border-color: var(--gas-border);
  }

  .gas-level.nor {
    background: var(--amber-bg);
    color: var(--amber);
    border-color: var(--amber-border);
  }

  .gas-level.alt {
    background: var(--red-bg);
    color: var(--red);
    border-color: var(--red-border);
  }

  .gas-total {
    color: var(--gas-dark);

    font-size: 15px;
    font-weight: 800;

    font-variant-numeric: tabular-nums;
  }

  .gas-total-sub {
    margin-top: 3px;

    color: var(--ink-4);

    font-size: 10px;
  }

  .gas-pdf {
    display: inline-flex;
    align-items: center;
    gap: 6px;

    padding: 7px 11px;

    border: 1px solid var(--border);
    border-radius: 8px;

    background: white;
    color: var(--ink-2);

    font-family: inherit;

    font-size: 11px;
    font-weight: 600;

    cursor: pointer;

    transition: all .18s;
  }

  .gas-pdf:hover {
    background: var(--red-bg);

    border-color: var(--red-border);

    color: var(--red);
  }

  /* EMPTY */

  .gas-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding: 60px 20px;

    text-align: center;
  }

  .gas-empty-icon {
    width: 52px;
    height: 52px;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-bottom: 12px;

    border-radius: 15px;

    background: var(--gas-bg);
    color: var(--gas);

    font-size: 21px;
  }

  .gas-empty-title {
    font-size: 14px;
    font-weight: 800;
  }

  .gas-empty-text {
    margin-top: 4px;

    color: var(--ink-3);

    font-size: 11px;
  }

  /* TIPS */

  .gas-tips {
    padding: 20px;

    background: var(--white);

    border: 1px solid var(--border);
    border-radius: 18px;
  }

  .gas-tips-title {
    display: flex;
    align-items: center;
    gap: 8px;

    margin-bottom: 12px;

    font-size: 13px;
    font-weight: 800;
  }

  .gas-tips-title svg {
    color: var(--gas);
  }

  .gas-tip {
    display: flex;
    align-items: flex-start;
    gap: 9px;

    padding: 9px 0;

    border-bottom: 1px solid var(--border);

    color: var(--ink-2);

    font-size: 11px;
    line-height: 1.55;
  }

  .gas-tip:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .gas-tip-dot {
    width: 5px;
    height: 5px;

    margin-top: 6px;

    flex-shrink: 0;

    border-radius: 50%;

    background: var(--gas);
  }

  /* RESPONSIVE */

  @media (max-width: 900px) {
    .gas-stats {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 650px) {
    .gas-header {
      align-items: flex-start;
    }

    .gas-header-icon {
      width: 46px;
      height: 46px;

      border-radius: 13px;
    }

    .gas-station {
      align-items: flex-start;
    }

    .gas-station-badge {
      margin-left: auto;
    }

    .gas-controls {
      align-items: stretch;
    }

    .gas-date {
      width: 100%;
    }

    .gas-view-tabs {
      width: 100%;
      margin-left: 0;
    }

    .gas-tab {
      flex: 1;
    }

    .gas-chart {
      padding: 17px;
    }
  }

  @media (max-width: 480px) {
    .gas-stats {
      grid-template-columns: 1fr 1fr;
      gap: 9px;
    }

    .gas-stat {
      padding: 14px;
    }

    .gas-stat-description {
      font-size: 10px;
    }

    .gas-station {
      padding: 15px;
      flex-wrap: wrap;
    }

    .gas-station-info {
      min-width: calc(100% - 70px);
    }

    .gas-station-badge {
      width: 100%;
      margin-left: 0;

      justify-content: center;
    }

    .gas-chart-header {
      align-items: flex-start;
    }

    .gas-chart-badge {
      display: none;
    }
  }
`

const MESES = {
  '01': 'Enero',
  '02': 'Febrero',
  '03': 'Marzo',
  '04': 'Abril',
  '05': 'Mayo',
  '06': 'Junio',
  '07': 'Julio',
  '08': 'Agosto',
  '09': 'Septiembre',
  '10': 'Octubre',
  '11': 'Noviembre',
  '12': 'Diciembre',
}

const nivelConsumo = (m3) => {
  if (m3 <= 10) return 'opt'
  if (m3 <= 20) return 'nor'
  return 'alt'
}

const nivelLabel = (m3) => {
  if (m3 <= 10) return 'Óptimo'
  if (m3 <= 20) return 'Normal'
  return 'Alto'
}

const datosDemo = [
  {
    id: 1,
    fecha: '2026-01',
    consumo: 14.8,
    valor_lectura: 1245.8,
  },
  {
    id: 2,
    fecha: '2026-02',
    consumo: 16.2,
    valor_lectura: 1262.0,
  },
  {
    id: 3,
    fecha: '2026-03',
    consumo: 15.4,
    valor_lectura: 1277.4,
  },
  {
    id: 4,
    fecha: '2026-04',
    consumo: 18.7,
    valor_lectura: 1296.1,
  },
  {
    id: 5,
    fecha: '2026-05',
    consumo: 17.3,
    valor_lectura: 1313.4,
  },
  {
    id: 6,
    fecha: '2026-06',
    consumo: 20.5,
    valor_lectura: 1333.9,
  },
  {
    id: 7,
    fecha: '2026-07',
    consumo: 19.1,
    valor_lectura: 1353.0,
  },
  {
    id: 8,
    fecha: '2026-08',
    consumo: 21.4,
    valor_lectura: 1374.4,
  },
]

export default function HistorialGas() {
  const [lecturas, setLecturas] = useState(datosDemo)
  const [filtro, setFiltro] = useState('')
  const [vista, setVista] = useState('area')

  /*
   * IMPORTANTE:
   * Esta versión es solamente visual.
   *
   * No consulta Supabase.
   * No modifica el backend.
   * No toca geolocalización.
   *
   * Los datos demo permiten que la pantalla
   * se muestre inmediatamente sin depender
   * de servicios externos.
   */

  useEffect(() => {
    setLecturas(datosDemo)
  }, [])

  const filtrados = filtro
    ? lecturas.filter((item) =>
        item.fecha.includes(filtro)
      )
    : lecturas

  const promedio = filtrados.length
    ? (
        filtrados.reduce(
          (total, item) => total + item.consumo,
          0
        ) / filtrados.length
      ).toFixed(2)
    : '0.00'

  const maximo = filtrados.length
    ? Math.max(
        ...filtrados.map((item) => item.consumo)
      ).toFixed(2)
    : '0.00'

  const minimo = filtrados.length
    ? Math.min(
        ...filtrados.map((item) => item.consumo)
      ).toFixed(2)
    : '0.00'

  const totalAcum = filtrados
    .reduce(
      (total, item) =>
        total + item.consumo * 2.15,
      0
    )
    .toFixed(2)

  const maxConsumo = filtrados.length
    ? Math.max(
        ...filtrados.map((item) => item.consumo)
      )
    : 1

  const tendencia = (() => {
    if (filtrados.length < 2) return null

    const ultimo =
      filtrados[filtrados.length - 1].consumo

    const anterior =
      filtrados[filtrados.length - 2].consumo

    const diferencia = ultimo - anterior

    return {
      diferencia,
      porcentaje: (
        (diferencia / (anterior || 1)) *
        100
      ).toFixed(1),
      sube: diferencia > 0,
    }
  })()

  const generarPDF = (dato) => {
    /*
     * Visualmente simulamos la acción.
     * No se realiza ninguna llamada al backend.
     */

    const mensaje = `
Factura de Estación de Servicio

Estación: Estación de Servicio Cochabamba
Período: ${dato.fecha}
Consumo: ${dato.consumo.toFixed(2)} m³
Lectura actual: ${dato.valor_lectura}
Total: Bs ${(dato.consumo * 2.15).toFixed(2)}
`

    const blob = new Blob([mensaje], {
      type: 'text/plain;charset=utf-8',
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.href = url

    link.download =
      `Factura_Estacion_${dato.fecha}.txt`

    link.click()

    URL.revokeObjectURL(url)
  }

  const chartData = filtrados.map((item) => {
    const partes = item.fecha.split('-')

    return {
      ...item,
      label: `${MESES[partes[1]]?.slice(0, 3)} ${partes[0]}`,
    }
  })

  const renderChart = () => {
    if (!chartData.length) {
      return (
        <div className="gas-empty">
          <div className="gas-empty-icon">
            <FaGasPump />
          </div>

          <div className="gas-empty-title">
            Sin registros
          </div>

          <div className="gas-empty-text">
            No hay lecturas para el período seleccionado.
          </div>
        </div>
      )
    }

    const width = 100
    const height = 100

    const max =
      Math.max(
        ...chartData.map((item) => item.consumo)
      ) || 1

    const min =
      Math.min(
        ...chartData.map((item) => item.consumo)
      ) || 0

    const range = max - min || 1

    const points = chartData
      .map((item, index) => {
        const x =
          chartData.length === 1
            ? 50
            : (index /
                (chartData.length - 1)) *
              92 +
              4

        const y =
          88 -
          ((item.consumo - min) / range) *
            65

        return {
          x,
          y,
          item,
        }
      })

    const linePoints = points
      .map((point) => `${point.x},${point.y}`)
      .join(' ')

    const areaPoints = [
      `4,88`,
      ...points.map(
        (point) => `${point.x},${point.y}`
      ),
      `${points[points.length - 1].x},88`,
    ].join(' ')

    if (vista === 'barras') {
      return (
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '12px',
            padding:
              '20px 10px 28px 10px',
          }}
        >
          {chartData.map((item, index) => {
            const porcentaje =
              (item.consumo / max) * 100

            return (
              <div
                key={item.id}
                style={{
                  flex: 1,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '70%',
                    maxWidth: 55,
                    minWidth: 12,
                    height: `${porcentaje}%`,
                    minHeight: 10,
                    background:
                      'linear-gradient(180deg, #00a67e, #007a5e)',
                    borderRadius:
                      '7px 7px 3px 3px',
                    transition:
                      'height .5s ease',
                  }}
                  title={`${item.consumo} m³`}
                />

                <span
                  style={{
                    position: 'absolute',
                    bottom: -22,
                    fontSize: 9,
                    color: '#727773',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        {/* Líneas de referencia */}

        {[20, 43, 66, 88].map((y) => (
          <line
            key={y}
            x1="4"
            y1={y}
            x2="96"
            y2={y}
            stroke="#e6e8e6"
            strokeWidth=".35"
            strokeDasharray="2 2"
          />
        ))}

        {/* Área */}

        {vista === 'area' && (
          <polygon
            points={areaPoints}
            fill="#00a67e"
            opacity=".10"
          />
        )}

        {/* Línea */}

        <polyline
          points={linePoints}
          fill="none"
          stroke="#00a67e"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Puntos */}

        {points.map((point) => (
          <g key={point.item.id}>
            <circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill="#ffffff"
              stroke="#00a67e"
              strokeWidth="1.5"
            />

            <title>
              {point.item.label}:{' '}
              {point.item.consumo} m³
            </title>
          </g>
        ))}

        {/* Etiquetas */}

        {points.map((point) => (
          <text
            key={`label-${point.item.id}`}
            x={point.x}
            y="98"
            textAnchor="middle"
            fontSize="3"
            fill="#727773"
          >
            {point.item.label}
          </text>
        ))}
      </svg>
    )
  }

  return (
    <div className="gas-root">
      <style>{css}</style>

      <div className="gas-container">

        {/* HEADER */}

        <motion.div
          className="gas-header"
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <div className="gas-header-icon">
            <FaGasPump size={22} />
          </div>

          <div>
            <div className="gas-title">
              Historial de consumo
            </div>

            <div className="gas-subtitle">
              Seguimiento mensual del consumo y
              facturación de la estación de servicio
            </div>
          </div>
        </motion.div>

        {/* ESTACIÓN */}

        <motion.div
          className="gas-station"
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: .05,
          }}
        >
          <div className="gas-station-avatar">
            <FaGasPump />
          </div>

          <div className="gas-station-info">
            <div className="gas-station-name">
              Estación de Servicio Cochabamba
            </div>

            <div className="gas-station-meta">
              Cód. EST-000001 · Av. Petrolera · Cochabamba, Bolivia
            </div>
          </div>

          <div className="gas-station-badge">
            <FaCheckCircle />
            Estación activa
          </div>
        </motion.div>

        {/* ESTADÍSTICAS */}

        <div className="gas-stats">

          <motion.div
            className="gas-stat"
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <div className="gas-stat-icon gas-icon">
              <FaFire />
            </div>

            <div className="gas-stat-label">
              Promedio mensual
            </div>

            <div className="gas-stat-value">
              {promedio} m³
            </div>

            <div className="gas-stat-description">
              Consumo promedio de la estación
            </div>
          </motion.div>

          <motion.div
            className="gas-stat"
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: .05,
            }}
          >
            <div className="gas-stat-icon gas-icon-red">
              <FaArrowUp />
            </div>

            <div className="gas-stat-label">
              Consumo máximo
            </div>

            <div className="gas-stat-value">
              {maximo} m³
            </div>

            <div className="gas-stat-description">
              Mayor consumo registrado
            </div>
          </motion.div>

          <motion.div
            className="gas-stat"
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: .10,
            }}
          >
            <div className="gas-stat-icon gas-icon-green">
              <FaArrowDown />
            </div>

            <div className="gas-stat-label">
              Consumo mínimo
            </div>

            <div className="gas-stat-value">
              {minimo} m³
            </div>

            <div className="gas-stat-description">
              Período de menor consumo
            </div>
          </motion.div>

          <motion.div
            className="gas-stat"
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: .15,
            }}
          >
            <div className="gas-stat-icon gas-icon-amber">
              <FaDollarSign />
            </div>

            <div className="gas-stat-label">
              Facturación acumulada
            </div>

            <div className="gas-stat-value">
              Bs {totalAcum}
            </div>

            <div className="gas-stat-description">
              Total estimado del período
            </div>
          </motion.div>

        </div>

        {/* TENDENCIA */}

        {tendencia && (
          <motion.div
            className={`gas-trend ${
              tendencia.sube
                ? 'up'
                : 'down'
            }`}
            initial={{
              opacity: 0,
              scale: .98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
          >
            <div className="gas-trend-icon">
              {tendencia.sube ? (
                <FaArrowUp />
              ) : (
                <FaArrowDown />
              )}
            </div>

            <div>
              <div className="gas-trend-title">
                {tendencia.sube
                  ? 'Aumento'
                  : 'Reducción'}{' '}
                del{' '}
                {Math.abs(
                  tendencia.porcentaje
                )}
                % respecto al período anterior
              </div>

              <div className="gas-trend-body">
                El consumo de la estación{' '}
                {tendencia.sube
                  ? 'aumentó'
                  : 'disminuyó'}{' '}
                <strong>
                  {Math.abs(
                    tendencia.diferencia
                  ).toFixed(2)}{' '}
                  m³
                </strong>{' '}
                respecto al registro anterior.
              </div>

              <div className="gas-trend-tip">
                {tendencia.sube
                  ? 'Revisá el funcionamiento de los equipos y el comportamiento del consumo.'
                  : 'El consumo presenta una tendencia favorable. Mantené las buenas prácticas operativas.'}
              </div>
            </div>
          </motion.div>
        )}

        {/* CONTROLES */}

        <div className="gas-controls">

          <div className="gas-date">
            <FaCalendarAlt />

            <input
              type="month"
              value={filtro}
              onChange={(e) =>
                setFiltro(e.target.value)
              }
            />
          </div>

          {filtro && (
            <button
              className="gas-tab"
              onClick={() =>
                setFiltro('')
              }
            >
              Limpiar filtro ×
            </button>
          )}

          <div className="gas-view-tabs">

            {[
              ['area', 'Área'],
              ['linea', 'Línea'],
              ['barras', 'Barras'],
            ].map(
              ([id, label]) => (
                <button
                  key={id}
                  className={`gas-tab ${
                    vista === id
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setVista(id)
                  }
                >
                  {label}
                </button>
              )
            )}

          </div>
        </div>

        {/* GRÁFICO */}

        <motion.div
          className="gas-chart"
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <div className="gas-chart-header">

            <div>
              <div className="gas-section-title">
                <FaChartLine className="gas-section-title-icon" />

                Consumo mensual
              </div>

              <div className="gas-section-subtitle">
                {filtrados.length}{' '}
                {filtrados.length === 1
                  ? 'período registrado'
                  : 'períodos registrados'}
              </div>
            </div>

            <div className="gas-chart-badge">
              m³
            </div>

          </div>

          <div
            style={{
              height:
                'clamp(220px, 40vw, 280px)',
            }}
          >
            {renderChart()}
          </div>
        </motion.div>

        {/* TABLA */}

        <motion.div
          className="gas-table-card"
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <div className="gas-table-header">

            <div>
              <div className="gas-table-title">
                <FaFileInvoiceDollar />

                Registro de consumo
              </div>

              <div className="gas-table-count">
                {filtrados.length}{' '}
                {filtrados.length === 1
                  ? 'registro'
                  : 'registros'}{' '}
                de la estación
              </div>
            </div>

            <FaIndustry
              style={{
                opacity: .35,
                fontSize: 22,
              }}
            />

          </div>

          {filtrados.length === 0 ? (
            <div className="gas-empty">

              <div className="gas-empty-icon">
                <FaGasPump />
              </div>

              <div className="gas-empty-title">
                Sin registros
              </div>

              <div className="gas-empty-text">
                No hay consumos para el período seleccionado.
              </div>

            </div>
          ) : (
            <div className="gas-table-scroll">

              <table className="gas-table">

                <thead>
                  <tr>
                    <th>Período</th>
                    <th>Consumo</th>
                    <th>Lectura</th>
                    <th>Nivel</th>
                    <th>Total</th>
                    <th>Comprobante</th>
                  </tr>
                </thead>

                <tbody>

                  {filtrados.map(
                    (dato, index) => {

                      const [
                        year,
                        month,
                      ] =
                        dato.fecha.split(
                          '-'
                        )

                      const total =
                        dato.consumo *
                        2.15

                      const porcentaje =
                        Math.min(
                          (dato.consumo /
                            maxConsumo) *
                            100,
                          100
                        )

                      const lecturaAnterior =
                        dato.valor_lectura -
                        dato.consumo

                      return (
                        <motion.tr
                          key={dato.id}
                          initial={{
                            opacity: 0,
                            y: 8,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay:
                              index *
                              .035,
                          }}
                        >

                          {/* PERÍODO */}

                          <td>
                            <div className="gas-period">

                              <div className="gas-period-dot" />

                              <div>
                                <div className="gas-period-month">
                                  {
                                    MESES[
                                      month
                                    ]
                                  }
                                </div>

                                <div className="gas-period-year">
                                  {year}
                                </div>
                              </div>

                            </div>
                          </td>

                          {/* CONSUMO */}

                          <td>

                            <div className="gas-consumption">
                              {dato.consumo.toFixed(
                                2
                              )}{' '}
                              m³
                            </div>

                            <div className="gas-bar">

                              <div
                                className="gas-bar-fill"
                                style={{
                                  width: `${porcentaje}%`,
                                }}
                              />

                            </div>

                          </td>

                          {/* LECTURA */}

                          <td>

                            <div className="gas-reading">
                              Actual:{' '}
                              <strong>
                                {dato.valor_lectura.toFixed(
                                  2
                                )}
                              </strong>
                            </div>

                            <div className="gas-reading-sub">
                              Anterior:{' '}
                              {lecturaAnterior.toFixed(
                                2
                              )}
                            </div>

                          </td>

                          {/* NIVEL */}

                          <td>

                            <span
                              className={`gas-level ${nivelConsumo(
                                dato.consumo
                              )}`}
                            >
                              {nivelLabel(
                                dato.consumo
                              )}
                            </span>

                          </td>

                          {/* TOTAL */}

                          <td>

                            <div className="gas-total">
                              Bs{' '}
                              {total.toFixed(
                                2
                              )}
                            </div>

                            <div className="gas-total-sub">
                              Estimado
                            </div>

                          </td>

                          {/* PDF */}

                          <td>

                            <button
                              className="gas-pdf"
                              onClick={() =>
                                generarPDF(
                                  dato
                                )
                              }
                            >
                              <FaFilePdf />

                              PDF
                            </button>

                          </td>

                        </motion.tr>
                      )
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

        </motion.div>

        {/* INFORMACIÓN DE LA ESTACIÓN */}

        <motion.div
          className="gas-tips"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
        >

          <div className="gas-tips-title">
            <FaInfoCircle />

            Información operativa
          </div>

          {[
            'Realizá controles periódicos de los medidores y equipos de la estación para detectar variaciones anormales de consumo.',
            'Verificá regularmente las conexiones, válvulas y sistemas de distribución para mantener una operación segura.',
            'Un incremento repentino del consumo puede indicar cambios en la demanda o la necesidad de revisar los equipos.',
            'Mantené los registros de lectura actualizados para facilitar el seguimiento mensual y la facturación.',
          ].map(
            (tip, index) => (
              <div
                key={index}
                className="gas-tip"
              >
                <div className="gas-tip-dot" />

                <span>
                  {tip}
                </span>
              </div>
            )
          )}

        </motion.div>

      </div>
    </div>
  )
}