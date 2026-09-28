'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap
} from 'react-leaflet'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { motion, AnimatePresence } from 'framer-motion'

import {
  RefreshCw,
  Save,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Ruler,
  Fuel,
  Lock,
  Unlock,
  Crosshair,
  Radio
} from 'lucide-react'


/* =========================================================
   LEAFLET
========================================================= */

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',

  iconUrl:
    'https://unpkg.com/leaflet/dist/images/marker-icon.png',

  shadowUrl:
    'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
})


/* =========================================================
   ICONO USUARIO
========================================================= */

const iconUsuario = new L.DivIcon({
  html: `
    <div style="
      width:36px;
      height:36px;
      border-radius:50%;
      background:#ff7a1a;
      border:3px solid #ffffff;
      box-shadow:0 3px 14px rgba(255,122,26,.42);
      display:flex;
      align-items:center;
      justify-content:center;
    ">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  `,

  className: '',

  iconSize: [36, 36],

  iconAnchor: [18, 18],
})


/* =========================================================
   ICONO ESTACIÓN
========================================================= */

const iconGasolinera = new L.DivIcon({
  html: `
    <div style="
      width:38px;
      height:38px;
      border-radius:11px;
      background:#151515;
      border:3px solid #ff7a1a;
      box-shadow:0 3px 14px rgba(0,0,0,.28);
      display:flex;
      align-items:center;
      justify-content:center;
    ">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ff7a1a"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M3 22V6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16"/>
        <path d="M3 10h13"/>
        <path d="M7 7h5"/>
        <path d="M16 8l3 2v8a2 2 0 0 0 4 0v-7l-2-2"/>
        <path d="M7 22v-5h5v5"/>
      </svg>
    </div>
  `,

  className: '',

  iconSize: [38, 38],

  iconAnchor: [19, 19],
})


/* =========================================================
   RECENTER MAP
========================================================= */

function RecenterMap({ center }) {

  const map = useMap()

  useEffect(() => {

    if (center) {

      map.setView(
        center,
        map.getZoom()
      )

    }

  }, [center, map])

  return null
}


/* =========================================================
   CSS
========================================================= */

const css = `

  @import url(
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
  );

  .station-root {

    --white: #ffffff;
    --off: #fafaf9;

    --border: #e9e9e7;
    --border-md: #d5d5d1;

    --ink: #161616;
    --ink-2: #3b3b39;
    --ink-3: #777773;
    --ink-4: #aeaea9;

    --orange: #ff7a1a;
    --orange-dark: #e85d04;
    --orange-light: #fff1e8;
    --orange-border: #ffd2b3;

    --red: #dc2626;
    --red-bg: #fef2f2;
    --red-border: #fecaca;

    --amber: #d97706;
    --amber-bg: #fffbeb;
    --amber-border: #fde68a;

    --green: #16a34a;
    --green-bg: #f0fdf4;
    --green-border: #bbf7d0;

    --blue: #4f46e5;
    --blue-bg: #eef0fd;
    --blue-border: #c7c3f7;

    width: 100%;
    max-width: 1400px;

    margin: 0 auto;

    font-family:
      'Inter',
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      sans-serif;

    color: var(--ink);

    display: flex;

    flex-direction: column;

    gap: 20px;

    box-sizing: border-box;
  }


  .station-root *,
  .station-root *::before,
  .station-root *::after {

    box-sizing: border-box;
  }


  /* =====================================================
     HEADER
  ===================================================== */

  .station-header {

    display: flex;

    align-items: center;

    gap: 15px;

    padding-bottom: 22px;

    border-bottom: 1.5px solid var(--border);
  }


  .station-header-icon {

    width: 52px;
    height: 52px;

    border-radius: 14px;

    background: var(--ink);

    display: flex;

    align-items: center;
    justify-content: center;

    color: var(--orange);

    flex-shrink: 0;
  }


  .station-title {

    font-size: 25px;

    font-weight: 800;

    letter-spacing: -.035em;

    line-height: 1.15;

    color: var(--ink);
  }


  .station-subtitle {

    margin-top: 5px;

    font-size: 13px;

    line-height: 1.45;

    color: var(--ink-3);
  }


  /* =====================================================
     SESSION
  ===================================================== */

  .station-session {

    width: 100%;

    border-radius: 16px;

    padding: 17px 20px;

    border: 2px solid;

    display: flex;

    align-items: center;

    gap: 15px;

    transition: all .25s ease;
  }


  .station-session.valid {

    background: var(--orange-light);

    border-color: var(--orange-border);
  }


  .station-session.invalid {

    background: var(--red-bg);

    border-color: var(--red-border);
  }


  .station-session.warning {

    background: var(--amber-bg);

    border-color: var(--amber-border);
  }


  .station-session.loading {

    background: var(--blue-bg);

    border-color: var(--blue-border);
  }


  .station-session-icon {

    width: 46px;
    height: 46px;

    border-radius: 12px;

    display: flex;

    align-items: center;
    justify-content: center;

    flex-shrink: 0;
  }


  .valid .station-session-icon {

    background: var(--orange);

    color: white;
  }


  .invalid .station-session-icon {

    background: var(--red);

    color: white;
  }


  .warning .station-session-icon {

    background: var(--amber);

    color: white;
  }


  .loading .station-session-icon {

    background: var(--blue);

    color: white;
  }


  .station-session-content {

    min-width: 0;

    flex: 1;
  }


  .station-session-title {

    font-size: 14px;

    font-weight: 700;

    line-height: 1.3;
  }


  .valid .station-session-title {

    color: var(--orange-dark);
  }


  .invalid .station-session-title {

    color: var(--red);
  }


  .warning .station-session-title {

    color: var(--amber);
  }


  .loading .station-session-title {

    color: var(--blue);
  }


  .station-session-sub {

    margin-top: 3px;

    font-size: 12px;

    line-height: 1.4;

    color: var(--ink-3);
  }


  .station-session-badge {

    margin-left: auto;

    padding: 6px 13px;

    border-radius: 999px;

    font-size: 11px;

    font-weight: 800;

    letter-spacing: .03em;

    white-space: nowrap;
  }


  .valid .station-session-badge {

    background: var(--orange);

    color: white;
  }


  .invalid .station-session-badge {

    background: var(--red);

    color: white;
  }


  .warning .station-session-badge {

    background: var(--amber);

    color: white;
  }


  .loading .station-session-badge {

    background: var(--blue);

    color: white;
  }


  /* =====================================================
     GRID
  ===================================================== */

  .station-grid {

    display: grid;

    grid-template-columns:
      minmax(0, 1fr)
      310px;

    gap: 18px;

    min-width: 0;
  }


  /* =====================================================
     MAP
  ===================================================== */

  .station-map-wrap {

    min-width: 0;

    background: var(--white);

    border: 1.5px solid var(--border);

    border-radius: 18px;

    overflow: hidden;
  }


  .station-map-topbar {

    min-height: 58px;

    padding: 13px 17px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 12px;

    border-bottom: 1px solid var(--border);

    background: var(--white);
  }


  .station-map-label {

    display: flex;

    align-items: center;

    gap: 8px;

    font-size: 13px;

    font-weight: 700;

    min-width: 0;
  }


  .station-map-label-dot {

    width: 8px;
    height: 8px;

    flex-shrink: 0;

    border-radius: 50%;

    background: var(--orange);

    animation: stationPulse 2s infinite;
  }


  @keyframes stationPulse {

    0%, 100% {

      box-shadow:
        0 0 0 0
        rgba(255,122,26,.35);
    }

    50% {

      box-shadow:
        0 0 0 6px
        rgba(255,122,26,0);
    }
  }


  .station-map-inner {

    height: 380px;

    position: relative;
  }


  .station-map-overlay {

    position: absolute;

    inset: 0;

    z-index: 999;

    background:
      rgba(250,250,249,.92);

    backdrop-filter: blur(4px);

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    gap: 14px;
  }


  .station-scan-ring {

    width: 70px;
    height: 70px;

    border-radius: 50%;

    border: 3px solid var(--border);

    border-top-color: var(--orange);

    animation:
      stationSpin
      .8s
      linear
      infinite;
  }


  @keyframes stationSpin {

    to {

      transform:
        rotate(360deg);
    }
  }


  .station-map-overlay-txt {

    font-size: 13px;

    font-weight: 600;

    color: var(--ink-3);
  }


  .station-btn-refresh {

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 6px;

    padding: 8px 12px;

    border-radius: 9px;

    border:
      1.5px solid
      var(--border);

    background: white;

    color: var(--ink-2);

    font-family: inherit;

    font-size: 11px;

    font-weight: 600;

    cursor: pointer;

    transition: all .15s ease;

    white-space: nowrap;
  }


  .station-btn-refresh:hover {

    background: var(--off);

    border-color: var(--border-md);
  }


  .station-btn-refresh:disabled {

    opacity: .45;

    cursor: not-allowed;
  }


  .station-spin {

    animation:
      stationSpin
      .7s
      linear
      infinite;
  }


  /* =====================================================
     LEGEND
  ===================================================== */

  .station-map-legend {

    display: flex;

    flex-wrap: wrap;

    gap: 12px 18px;

    padding: 11px 17px;

    border-top:
      1px solid
      var(--border);

    background: var(--off);
  }


  .station-legend-item {

    display: flex;

    align-items: center;

    gap: 6px;

    font-size: 10.5px;

    color: var(--ink-3);
  }


  .station-legend-dot {

    width: 9px;
    height: 9px;

    flex-shrink: 0;

    border-radius: 3px;
  }


  /* =====================================================
     SIDEBAR
  ===================================================== */

  .station-sidebar {

    min-width: 0;

    display: flex;

    flex-direction: column;

    gap: 13px;
  }


  /* =====================================================
     DISTANCE
  ===================================================== */

  .station-distance-card {

    background: var(--ink);

    border-radius: 16px;

    padding: 20px;
  }


  .station-distance-label {

    display: flex;

    align-items: center;

    gap: 6px;

    margin-bottom: 12px;

    font-size: 10px;

    font-weight: 700;

    letter-spacing: .08em;

    text-transform: uppercase;

    color:
      rgba(255,255,255,.38);
  }


  .station-distance-row {

    display: flex;

    align-items: baseline;

    gap: 6px;

    margin-bottom: 5px;
  }


  .station-distance-number {

    font-size: 40px;

    font-weight: 800;

    letter-spacing: -.05em;

    line-height: 1;

    color: white;
  }


  .station-distance-unit {

    font-size: 17px;

    font-weight: 700;

    color: var(--orange);
  }


  .station-distance-max {

    margin-bottom: 14px;

    font-size: 11px;

    color:
      rgba(255,255,255,.32);
  }


  .station-distance-track {

    height: 5px;

    background:
      rgba(255,255,255,.1);

    border-radius: 999px;

    overflow: hidden;
  }


  .station-distance-fill {

    height: 100%;

    border-radius: 999px;
  }


  /* =====================================================
     CARDS
  ===================================================== */

  .station-card {

    background: white;

    border:
      1.5px solid
      var(--border);

    border-radius: 14px;

    padding: 15px;

    display: flex;

    flex-direction: column;

    gap: 9px;
  }


  .station-card-title {

    display: flex;

    align-items: center;

    gap: 7px;

    font-size: 12px;

    font-weight: 700;
  }


  .station-card-icon {

    width: 25px;
    height: 25px;

    border-radius: 7px;

    display: flex;

    align-items: center;
    justify-content: center;
  }


  .station-card-icon.orange {

    background: var(--orange-light);

    color: var(--orange);
  }


  .station-info-row {

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 10px;

    padding: 8px 10px;

    background: var(--off);

    border-radius: 8px;

    font-size: 11.5px;
  }


  .station-info-key {

    color: var(--ink-3);

    flex-shrink: 0;
  }


  .station-info-value {

    max-width: 65%;

    text-align: right;

    font-size: 11.5px;

    font-weight: 600;

    color: var(--ink);

    overflow-wrap: anywhere;
  }


  .station-info-value.mono {

    font-family: monospace;

    font-size: 10px;

    font-weight: 400;

    color: var(--ink-2);
  }


  .station-info-value.green {

    color: var(--green);
  }


  .station-info-value.red {

    color: var(--red);
  }


  .station-info-value.amber {

    color: var(--amber);
  }


  /* =====================================================
     SHIELD
  ===================================================== */

  .station-shield {

    display: flex;

    align-items: center;

    gap: 9px;

    padding: 11px 14px;

    border-radius: 11px;

    font-size: 11.5px;

    font-weight: 600;

    line-height: 1.35;
  }


  .station-shield.on {

    background: var(--green-bg);

    border:
      1.5px solid
      var(--green-border);

    color: var(--green);
  }


  .station-shield.off {

    background: var(--red-bg);

    border:
      1.5px solid
      var(--red-border);

    color: var(--red);
  }


  .station-shield.mid {

    background: var(--amber-bg);

    border:
      1.5px solid
      var(--amber-border);

    color: var(--amber);
  }


  /* =====================================================
     UNLOCK
  ===================================================== */

  .station-unlock {

    display: flex;

    align-items: center;

    gap: 13px;

    padding: 15px 18px;

    border-radius: 14px;

    background:
      linear-gradient(
        135deg,
        #e85d04 0%,
        #ff7a1a 100%
      );

    color: white;

    box-shadow:
      0 8px 24px
      rgba(255,122,26,.14);
  }


  .station-unlock-icon {

    width: 43px;
    height: 43px;

    flex-shrink: 0;

    border-radius: 11px;

    background:
      rgba(255,255,255,.16);

    display: flex;

    align-items: center;

    justify-content: center;
  }


  .station-unlock-title {

    font-size: 14px;

    font-weight: 800;
  }


  .station-unlock-sub {

    margin-top: 3px;

    font-size: 11px;

    line-height: 1.45;

    opacity: .82;
  }


  /* =====================================================
     ACTIONS
  ===================================================== */

  .station-actions {

    display: flex;

    flex-direction: column;

    gap: 9px;
  }


  .station-primary-btn {

    width: 100%;

    min-height: 48px;

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 8px;

    padding: 13px 15px;

    border: none;

    border-radius: 12px;

    font-family: inherit;

    font-size: 13px;

    font-weight: 700;

    cursor: pointer;

    transition:
      transform .15s ease,
      background .15s ease,
      opacity .15s ease;
  }


  .station-primary-btn.orange {

    background: var(--orange);

    color: white;
  }


  .station-primary-btn.orange:hover:not(:disabled) {

    background: var(--orange-dark);

    transform: translateY(-1px);
  }


  .station-primary-btn.dark {

    background: var(--ink);

    color: white;
  }


  .station-primary-btn.dark:hover:not(:disabled) {

    opacity: .86;

    transform: translateY(-1px);
  }


  .station-primary-btn:disabled {

    opacity: .45;

    cursor: not-allowed;
  }


  /* =====================================================
     ALERTS
  ===================================================== */

  .station-alert {

    display: flex;

    align-items: flex-start;

    gap: 11px;

    padding: 13px 16px;

    border-radius: 13px;

    font-size: 12px;

    line-height: 1.55;

    border: 1.5px solid;
  }


  .station-alert.red {

    background: var(--red-bg);

    border-color: var(--red-border);

    color: var(--red);
  }


  .station-alert.amber {

    background: var(--amber-bg);

    border-color: var(--amber-border);

    color: var(--amber);
  }


  .station-alert.orange {

    background: var(--orange-light);

    border-color: var(--orange-border);

    color: var(--orange-dark);
  }


  /* =====================================================
     TOAST
  ===================================================== */

  .station-toast {

    position: fixed;

    right: 22px;

    bottom: 22px;

    z-index: 9999;

    max-width:
      calc(100vw - 44px);

    display: flex;

    align-items: center;

    gap: 9px;

    padding: 12px 17px;

    border-radius: 12px;

    background: var(--ink);

    color: white;

    font-size: 12px;

    font-weight: 700;

    box-shadow:
      0 8px 30px
      rgba(0,0,0,.2);

    border-left:
      3px solid
      var(--orange);
  }


  /* =====================================================
     TABLET
  ===================================================== */

  @media (max-width: 1000px) {

    .station-grid {

      grid-template-columns: 1fr;
    }


    .station-sidebar {

      display: grid;

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

      align-items: stretch;
    }


    .station-distance-card {

      grid-column: span 2;
    }


    .station-shield {

      min-height: 48px;
    }

  }


  /* =====================================================
     MOBILE
  ===================================================== */

  @media (max-width: 640px) {

    .station-root {

      gap: 14px;
    }


    .station-header {

      padding-bottom: 16px;

      gap: 11px;
    }


    .station-header-icon {

      width: 44px;

      height: 44px;

      border-radius: 12px;
    }


    .station-header-icon svg {

      width: 20px;

      height: 20px;
    }


    .station-title {

      font-size: 20px;
    }


    .station-subtitle {

      font-size: 11px;
    }


    .station-session {

      padding: 13px;

      gap: 11px;

      align-items: flex-start;
    }


    .station-session-icon {

      width: 40px;

      height: 40px;
    }


    .station-session-title {

      font-size: 12.5px;
    }


    .station-session-sub {

      font-size: 10.5px;
    }


    .station-session-badge {

      padding: 5px 8px;

      font-size: 9px;
    }


    .station-map-topbar {

      padding: 11px 12px;

      min-height: 54px;
    }


    .station-map-label {

      font-size: 11.5px;
    }


    .station-btn-refresh {

      padding: 7px 8px;

      font-size: 10px;
    }


    .station-btn-refresh span {

      display: none;
    }


    .station-map-inner {

      height: 300px;
    }


    .station-map-inner .leaflet-container {

      height: 300px !important;
    }


    .station-map-legend {

      gap: 9px 13px;

      padding: 9px 12px;
    }


    .station-legend-item {

      font-size: 9.5px;
    }


    .station-sidebar {

      grid-template-columns: 1fr;

      gap: 10px;
    }


    .station-distance-card {

      grid-column: auto;

      padding: 17px;
    }


    .station-distance-number {

      font-size: 36px;
    }


    .station-card {

      padding: 13px;
    }


    .station-unlock {

      padding: 13px 14px;
    }


    .station-unlock-icon {

      width: 38px;

      height: 38px;
    }


    .station-unlock-title {

      font-size: 12.5px;
    }


    .station-unlock-sub {

      font-size: 10px;
    }


    .station-primary-btn {

      min-height: 46px;

      font-size: 12px;
    }


    .station-alert {

      padding: 12px 13px;

      font-size: 11px;
    }


    .station-toast {

      left: 15px;

      right: 15px;

      bottom: 15px;

      max-width: none;
    }

  }


  /* =====================================================
     MOBILE PEQUEÑO
  ===================================================== */

  @media (max-width: 380px) {

    .station-session-badge {

      display: none;
    }


    .station-title {

      font-size: 18px;
    }


    .station-map-inner {

      height: 270px;
    }


    .station-map-inner .leaflet-container {

      height: 270px !important;
    }


    .station-map-legend {

      display: grid;

      grid-template-columns: 1fr 1fr;
    }

  }

`


/* =========================================================
   COMPONENTE
========================================================= */

export default function GasolineraGeolocalizacion({
  usuario
}) {

  const [ubicacion, setUbicacion] =
    useState(null)

  const [estacion, setEstacion] =
    useState(null)

  const [distancia, setDistancia] =
    useState(null)

  const [estado, setEstado] =
    useState('loading')

  const [mensaje, setMensaje] =
    useState('Obteniendo ubicación…')

  const [cargando, setCargando] =
    useState(false)

  const [guardando, setGuardando] =
    useState(false)

  const [toast, setToast] =
    useState(null)


  /* =======================================================
     CARGAR ESTACIÓN
  ======================================================= */

  useEffect(() => {

    if (usuario) {

      obtenerEstacion()

      obtenerUbicacion()
    }

  }, [usuario])


  /* =======================================================
     REEVALUAR DISTANCIA
  ======================================================= */

  useEffect(() => {

    if (
      ubicacion &&
      estacion?.latitud
    ) {

      evaluar(
        ubicacion,
        estacion
      )

    }

  }, [estacion])


  /* =======================================================
     OBTENER ESTACIÓN
  ======================================================= */

  const obtenerEstacion =
    async () => {

      const { data, error } =
        await supabase

          .from('medidores')

          .select('*')

          .eq(
            'id_usuario',
            usuario.id
          )

          .single()


      if (error) {

        console.error(
          'Error obteniendo estación:',
          error
        )

        setEstacion(null)

        return
      }


      setEstacion(data)
    }


  /* =======================================================
     CALCULAR DISTANCIA
  ======================================================= */

  const calcularDistancia = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {

    const R = 6371

    const dLat =
      (lat2 - lat1) *
      Math.PI /
      180

    const dLon =
      (lon2 - lon1) *
      Math.PI /
      180


    const a =

      Math.sin(
        dLat / 2
      ) ** 2 +

      Math.cos(
        lat1 *
        Math.PI /
        180
      ) *

      Math.cos(
        lat2 *
        Math.PI /
        180
      ) *

      Math.sin(
        dLon / 2
      ) ** 2


    return (

      R *

      2 *

      Math.atan2(

        Math.sqrt(a),

        Math.sqrt(
          1 - a
        )

      )

    )
  }


  /* =======================================================
     EVALUAR UBICACIÓN
  ======================================================= */

  const evaluar = (
    userLoc,
    station
  ) => {

    if (
      !station?.latitud ||
      !station?.longitud
    ) {

      setEstado('warning')

      setMensaje(
        'La estación no tiene ubicación registrada'
      )

      return
    }


    const dist =
      calcularDistancia(

        userLoc.lat,

        userLoc.lng,

        station.latitud,

        station.longitud

      )


    setDistancia(dist)


    const metros =
      dist * 1000


    if (metros <= 100) {

      setEstado('valid')

      setMensaje(
        `Validado · ${metros.toFixed(0)} m de la estación`
      )

    } else {

      setEstado('invalid')

      setMensaje(
        `Fuera de rango · ${metros.toFixed(0)} m de la estación`
      )
    }

  }


  /* =======================================================
     OBTENER UBICACIÓN
  ======================================================= */

  const obtenerUbicacion =
    useCallback(() => {

      setCargando(true)

      setEstado('loading')

      setMensaje(
        'Verificando tu ubicación…'
      )

      setDistancia(null)


      if (!navigator.geolocation) {

        setEstado('invalid')

        setMensaje(
          'La geolocalización no está disponible en este navegador'
        )

        setCargando(false)

        return
      }


      navigator.geolocation.getCurrentPosition(

        (pos) => {

          const loc = {

            lat:
              pos.coords.latitude,

            lng:
              pos.coords.longitude

          }


          setUbicacion(loc)

          setCargando(false)


          if (estacion) {

            evaluar(
              loc,
              estacion
            )

          } else {

            setEstado('warning')

            setMensaje(
              'Estación sin ubicación registrada'
            )

          }

        },


        (error) => {

          console.error(
            'Error de ubicación:',
            error
          )

          setEstado('invalid')

          setMensaje(
            'Permiso de ubicación denegado'
          )

          setCargando(false)

        },


        {

          enableHighAccuracy: true,

          timeout: 10000,

          maximumAge: 0

        }

      )

    }, [estacion])


  /* =======================================================
     GUARDAR UBICACIÓN
  ======================================================= */

  const guardarUbicacion =
    async () => {

      if (
        !ubicacion ||
        !estacion
      ) {

        return
      }


      setGuardando(true)


      const { error } =
        await supabase

          .from('medidores')

          .update({

            latitud:
              ubicacion.lat,

            longitud:
              ubicacion.lng

          })

          .eq(
            'id',
            estacion.id
          )


      setGuardando(false)


      if (!error) {

        mostrarToast(
          '✓ Ubicación de la estación guardada'
        )

        obtenerEstacion()

      } else {

        mostrarToast(
          'No se pudo guardar la ubicación'
        )

      }

    }


  /* =======================================================
     TOAST
  ======================================================= */

  const mostrarToast =
    (msg) => {

      setToast(msg)

      setTimeout(
        () => setToast(null),
        3000
      )

    }


  /* =======================================================
     VARIABLES VISUALES
  ======================================================= */

  const distMetros =
    distancia
      ? distancia * 1000
      : 0


  const pct =
    distancia
      ? Math.min(
          (distMetros / 100) * 100,
          100
        )
      : 0


  const colorBarra =
    estado === 'valid'
      ? 'var(--orange)'
      : estado === 'invalid'
        ? 'var(--red)'
        : 'var(--amber)'


  const sinUbicacionEstacion =
    !estacion?.latitud ||
    !estacion?.longitud


  /* =======================================================
     ESTADOS
  ======================================================= */

  const sessionConfig = {

    valid: {

      icon:
        <Unlock size={19} />,

      title:
        'Acceso a la estación habilitado',

      badge:
        'ACTIVO'
    },


    invalid: {

      icon:
        <Lock size={19} />,

      title:
        'Fuera del rango permitido',

      badge:
        'BLOQUEADO'
    },


    warning: {

      icon:
        <ShieldAlert size={19} />,

      title:
        'Estación sin geolocalización',

      badge:
        'PENDIENTE'
    },


    loading: {

      icon:
        <Loader2
          size={19}
          className="station-spin"
        />,

      title:
        'Verificando ubicación…',

      badge:
        '…'
    }

  }


  const sc =
    sessionConfig[estado] ||
    sessionConfig.loading


  /* =======================================================
     RETURN
  ======================================================= */

  return (

    <div className="station-root">

      <style>
        {css}
      </style>


      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="station-header">

        <div className="station-header-icon">

          <Fuel size={22} />

        </div>


        <div>

          <div className="station-title">

            Verificación de estación

          </div>


          <div className="station-subtitle">

            Sistema de validación ·
            Comprueba tu proximidad a la estación de servicio

          </div>

        </div>

      </div>


      {/* ===================================================
          SESSION
      =================================================== */}

      <motion.div

        className={
          `station-session ${estado}`
        }

        key={estado}

        initial={{
          opacity: 0,
          y: -6
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        transition={{
          duration: .3
        }}

      >

        <div className="station-session-icon">

          {sc.icon}

        </div>


        <div className="station-session-content">

          <div className="station-session-title">

            {sc.title}

          </div>


          <div className="station-session-sub">

            {mensaje}

          </div>

        </div>


        <span className="station-session-badge">

          {sc.badge}

        </span>

      </motion.div>


      {/* ===================================================
          GRID
      =================================================== */}

      <div className="station-grid">


        {/* =================================================
            MAPA
        ================================================= */}

        <div className="station-map-wrap">


          <div className="station-map-topbar">

            <div className="station-map-label">

              <div className="station-map-label-dot" />

              Mapa en tiempo real

            </div>


            <button

              className="station-btn-refresh"

              onClick={
                obtenerUbicacion
              }

              disabled={
                cargando
              }

            >

              <RefreshCw

                size={12}

                className={
                  cargando
                    ? 'station-spin'
                    : ''
                }

              />


              <span>

                Actualizar posición

              </span>

            </button>

          </div>


          <div className="station-map-inner">


            {cargando && (

              <div className="station-map-overlay">

                <div className="station-scan-ring" />

                <div className="station-map-overlay-txt">

                  Verificando GPS…

                </div>

              </div>

            )}


            {ubicacion ? (

              <MapContainer

                center={[
                  ubicacion.lat,
                  ubicacion.lng
                ]}

                zoom={16}

                style={{
                  height: '380px',
                  width: '100%'
                }}

                zoomControl={true}

              >

                <TileLayer

                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                  attribution="&copy; OpenStreetMap contributors"

                />


                <RecenterMap

                  center={[
                    ubicacion.lat,
                    ubicacion.lng
                  ]}

                />


                {/* USUARIO */}

                <Marker

                  position={[
                    ubicacion.lat,
                    ubicacion.lng
                  ]}

                  icon={
                    iconUsuario
                  }

                >

                  <Popup>

                    <strong>

                      📍 Tu ubicación

                    </strong>

                    <br />

                    {ubicacion.lat.toFixed(6)}

                    {', '}

                    {ubicacion.lng.toFixed(6)}

                  </Popup>

                </Marker>


                {/* ESTACIÓN */}

                {estacion?.latitud &&
                  estacion?.longitud && (

                  <>

                    <Marker

                      position={[
                        estacion.latitud,
                        estacion.longitud
                      ]}

                      icon={
                        iconGasolinera
                      }

                    >

                      <Popup>

                        <strong>

                          ⛽ Estación de servicio

                        </strong>

                        <br />

                        {estacion.numero_medidor ||
                          estacion.nombre ||
                          'Estación registrada'}

                        <br />

                        {estacion.direccion ||
                          'Sin dirección'}

                      </Popup>

                    </Marker>


                    {/* RADIO */}

                    <Circle

                      center={[
                        estacion.latitud,
                        estacion.longitud
                      ]}

                      radius={100}

                      pathOptions={{

                        color:
                          estado === 'valid'
                            ? '#ff7a1a'
                            : '#dc2626',

                        fillColor:
                          estado === 'valid'
                            ? '#ff7a1a'
                            : '#dc2626',

                        fillOpacity: .07,

                        weight: 2,

                        dashArray:
                          estado === 'valid'
                            ? undefined
                            : '8 4'

                      }}

                    />


                    {/* LÍNEA */}

                    <Polyline

                      positions={[

                        [
                          ubicacion.lat,
                          ubicacion.lng
                        ],

                        [
                          estacion.latitud,
                          estacion.longitud
                        ]

                      ]}

                      pathOptions={{

                        color:
                          estado === 'valid'
                            ? '#ff7a1a'
                            : '#4f46e5',

                        weight: 2,

                        dashArray:
                          '6 4',

                        opacity: .7

                      }}

                    />

                  </>

                )}

              </MapContainer>

            ) : (

              <div

                style={{

                  height: '100%',

                  display: 'flex',

                  flexDirection: 'column',

                  alignItems: 'center',

                  justifyContent: 'center',

                  gap: 12,

                  background:
                    'var(--off)',

                  color:
                    'var(--ink-4)'

                }}

              >

                <Crosshair

                  size={36}

                  strokeWidth={1}

                />


                <span

                  style={{
                    fontSize: 12
                  }}

                >

                  Esperando permiso
                  de ubicación

                </span>

              </div>

            )}

          </div>


          {/* =================================================
              LEYENDA
          ================================================= */}

          <div className="station-map-legend">


            <div className="station-legend-item">

              <div

                className="station-legend-dot"

                style={{

                  background:
                    '#ff7a1a',

                  borderRadius:
                    '50%'

                }}

              />

              Tu posición

            </div>


            <div className="station-legend-item">

              <div

                className="station-legend-dot"

                style={{

                  background:
                    '#151515',

                  borderRadius:
                    3

                }}

              />

              Estación

            </div>


            <div className="station-legend-item">

              <div

                className="station-legend-dot"

                style={{

                  background:
                    'rgba(255,122,26,.3)',

                  border:
                    '1px solid #ff7a1a',

                  borderRadius:
                    3

                }}

              />

              Zona válida

            </div>


            <div className="station-legend-item">

              <div

                style={{

                  width: 18,

                  height: 2,

                  background:
                    '#4f46e5',

                  borderTop:
                    '2px dashed #4f46e5'

                }}

              />

              Distancia

            </div>

          </div>

        </div>


        {/* =================================================
            SIDEBAR
        ================================================= */}

        <div className="station-sidebar">


          {/* DISTANCIA */}

          <div className="station-distance-card">

            <div className="station-distance-label">

              <Ruler size={11} />

              Distancia a la estación

            </div>


            <div className="station-distance-row">

              <span className="station-distance-number">

                {distancia
                  ? distMetros.toFixed(0)
                  : '—'}

              </span>


              {distancia && (

                <span className="station-distance-unit">

                  m

                </span>

              )}

            </div>


            <div className="station-distance-max">

              Máximo permitido: 100 m

            </div>


            <div className="station-distance-track">

              <motion.div

                className="station-distance-fill"

                animate={{

                  width:
                    `${pct}%`,

                  background:
                    colorBarra

                }}

                transition={{

                  duration: 1,

                  ease:
                    [.22,.68,0,1.2]

                }}

              />

            </div>

          </div>


          {/* POSICIÓN */}

          <div className="station-card">

            <div className="station-card-title">

              <div className="station-card-icon orange">

                <Navigation size={12} />

              </div>

              Tu posición

            </div>


            <div className="station-info-row">

              <span className="station-info-key">

                Latitud

              </span>


              <span className="station-info-value mono">

                {ubicacion

                  ? ubicacion.lat.toFixed(6)

                  : '—'}

              </span>

            </div>


            <div className="station-info-row">

              <span className="station-info-key">

                Longitud

              </span>


              <span className="station-info-value mono">

                {ubicacion

                  ? ubicacion.lng.toFixed(6)

                  : '—'}

              </span>

            </div>

          </div>


          {/* ESTACIÓN */}

          <div className="station-card">

            <div className="station-card-title">

              <div className="station-card-icon orange">

                <Fuel size={12} />

              </div>

              Estación registrada

            </div>


            <div className="station-info-row">

              <span className="station-info-key">

                Identificador

              </span>


              <span className="station-info-value mono">

                {estacion?.numero_medidor ||
                  estacion?.id ||
                  '—'}

              </span>

            </div>


            <div className="station-info-row">

              <span className="station-info-key">

                Dirección

              </span>


              <span className="station-info-value">

                {estacion?.direccion ||
                  'No registrada'}

              </span>

            </div>


            <div className="station-info-row">

              <span className="station-info-key">

                Estado

              </span>


              <span

                className={`station-info-value ${
                  estado === 'valid'
                    ? 'green'
                    : estado === 'invalid'
                      ? 'red'
                      : 'amber'
                }`}

              >

                {estado === 'valid'

                  ? '✓ En rango'

                  : estado === 'invalid'

                    ? '✗ Fuera de rango'

                    : '— Sin datos'}

              </span>

            </div>

          </div>


          {/* SEGURIDAD */}

          <div

            className={`station-shield ${
              estado === 'valid'
                ? 'on'
                : estado === 'invalid'
                  ? 'off'
                  : 'mid'
            }`}

          >

            {estado === 'valid'

              ? (

                <>

                  <ShieldCheck size={15} />

                  Ubicación validada

                </>

              )

              : estado === 'invalid'

                ? (

                  <>

                    <ShieldOff size={15} />

                    Acceso restringido ·
                    Fuera de zona

                  </>

                )

                : (

                  <>

                    <ShieldAlert size={15} />

                    Verificación pendiente

                  </>

                )}

          </div>

        </div>

      </div>


      {/* ===================================================
          ACCESO HABILITADO
      =================================================== */}

      <AnimatePresence>

        {estado === 'valid' && (

          <motion.div

            className="station-unlock"

            initial={{

              opacity: 0,

              scale: .97

            }}

            animate={{

              opacity: 1,

              scale: 1

            }}

            exit={{

              opacity: 0,

              scale: .97

            }}

          >

            <div className="station-unlock-icon">

              <Unlock size={19} />

            </div>


            <div>

              <div className="station-unlock-title">

                Acceso habilitado

              </div>


              <div className="station-unlock-sub">

                Estás dentro del área permitida
                de la estación de servicio.

              </div>

            </div>

          </motion.div>

        )}

      </AnimatePresence>


      {/* ===================================================
          BOTONES
      =================================================== */}

      <div className="station-actions">

        <button

          className="station-primary-btn orange"

          onClick={
            obtenerUbicacion
          }

          disabled={
            cargando
          }

        >

          {cargando

            ? (

              <>

                <Loader2

                  size={15}

                  className="station-spin"

                />

                Verificando ubicación…

              </>

            )

            : (

              <>

                <Radio size={15} />

                Verificar mi ubicación

              </>

            )}

        </button>


        {/* GUARDAR ESTACIÓN */}

        {sinUbicacionEstacion &&
          ubicacion && (

          <motion.button

            className="station-primary-btn dark"

            onClick={
              guardarUbicacion
            }

            disabled={
              guardando
            }

            initial={{

              opacity: 0,

              y: 8

            }}

            animate={{

              opacity: 1,

              y: 0

            }}

          >

            {guardando

              ? (

                <>

                  <Loader2

                    size={15}

                    className="station-spin"

                  />

                  Guardando…

                </>

              )

              : (

                <>

                  <Save size={15} />

                  Registrar ubicación

                </>

              )}

          </motion.button>

        )}

      </div>


      {/* ===================================================
          ALERTAS
      =================================================== */}

      <AnimatePresence>


        {estado === 'invalid' &&
          distancia && (

          <motion.div

            className="station-alert red"

            initial={{
              opacity: 0
            }}

            animate={{
              opacity: 1
            }}

            exit={{
              opacity: 0
            }}

          >

            <AlertTriangle

              size={16}

              style={{

                flexShrink: 0,

                marginTop: 2

              }}

            />


            <span>

              Estás a{' '}

              <strong>

                {distMetros.toFixed(0)} m

              </strong>{' '}

              de la estación.

              Debés estar dentro de los{' '}

              <strong>

                100 metros

              </strong>{' '}

              para acceder a las funciones
              disponibles de la estación.

            </span>

          </motion.div>

        )}


        {estado === 'warning' && (

          <motion.div

            className="station-alert amber"

            initial={{
              opacity: 0
            }}

            animate={{
              opacity: 1
            }}

            exit={{
              opacity: 0
            }}

          >

            <AlertTriangle

              size={16}

              style={{

                flexShrink: 0,

                marginTop: 2

              }}

            />


            <span>

              La estación no tiene coordenadas
              registradas.

              Presioná{' '}

              <strong>

                "Registrar ubicación"

              </strong>{' '}

              para establecer la ubicación
              oficial de la estación.

            </span>

          </motion.div>

        )}


        {estado === 'valid' && (

          <motion.div

            className="station-alert orange"

            initial={{
              opacity: 0
            }}

            animate={{
              opacity: 1
            }}

            exit={{
              opacity: 0
            }}

          >

            <CheckCircle2

              size={16}

              style={{

                flexShrink: 0,

                marginTop: 2

              }}

            />


            <span>

              Ubicación verificada correctamente.
              Estás a{' '}

              <strong>

                {distMetros.toFixed(0)} m

              </strong>{' '}

              de la estación de servicio.

            </span>

          </motion.div>

        )}

      </AnimatePresence>


      {/* ===================================================
          TOAST
      =================================================== */}

      <AnimatePresence>

        {toast && (

          <motion.div

            className="station-toast"

            initial={{

              opacity: 0,

              y: 40

            }}

            animate={{

              opacity: 1,

              y: 0

            }}

            exit={{

              opacity: 0,

              y: 40

            }}

          >

            <CheckCircle2

              size={15}

              color="var(--orange)"

            />

            {toast}

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  )
}