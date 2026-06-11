'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, RefreshCw, Save, ShieldCheck, ShieldAlert, ShieldOff,
  Navigation, CheckCircle2, AlertTriangle, Loader2, Ruler,
  Home, Lock, Unlock, Crosshair, Radio
} from 'lucide-react'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
})

// Iconos personalizados
const iconUsuario = new L.DivIcon({
  html: `<div style="
    width:36px;height:36px;border-radius:50%;
    background:#00a67e;border:3px solid #fff;
    box-shadow:0 2px 12px rgba(0,166,126,.5);
    display:flex;align-items:center;justify-content:center;
  "><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>`,
  className: '', iconSize: [36, 36], iconAnchor: [18, 18],
})

const iconMedidor = new L.DivIcon({
  html: `<div style="
    width:36px;height:36px;border-radius:10px;
    background:#111110;border:3px solid #00a67e;
    box-shadow:0 2px 12px rgba(0,0,0,.3);
    display:flex;align-items:center;justify-content:center;
  "><svg width="16" height="16" viewBox="0 0 24 24" fill="#00a67e"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg></div>`,
  className: '', iconSize: [36, 36], iconAnchor: [18, 18],
})

// Componente para centrar mapa
function RecenterMap({ center }) {
  const map = useMap()
  useEffect(() => { if (center) map.setView(center, map.getZoom()) }, [center])
  return null
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  .geo-root {
    --white:      #ffffff;
    --off:        #f9f9f8;
    --border:     #ebebea;
    --border-md:  #d4d4d0;
    --ink:        #111110;
    --ink-2:      #3a3a38;
    --ink-3:      #737370;
    --ink-4:      #b0b0ac;
    --teal:       #00a67e;
    --teal-dk:    #007a5e;
    --teal-bg:    #e6f7f2;
    --teal-bd:    #b3e8d8;
    --red:        #dc2626;
    --red-bg:     #fef2f2;
    --red-bd:     #fecaca;
    --amber:      #d97706;
    --amber-bg:   #fffbeb;
    --amber-bd:   #fde68a;
    --green:      #16a34a;
    --green-bg:   #f0fdf4;
    --green-bd:   #bbf7d0;
    --indigo:     #4f46e5;
    --indigo-bg:  #eef0fd;
    --indigo-bd:  #c7c3f7;
    font-family: 'Inter', system-ui, sans-serif;
    color: var(--ink);
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ── HEADER ── */
  .geo-header {
    display: flex; align-items: center; gap: 16px;
    padding-bottom: 22px; border-bottom: 1.5px solid var(--border);
  }
  .geo-header-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--ink); display: flex; align-items: center;
    justify-content: center; color: var(--teal); flex-shrink: 0;
  }
  .geo-title {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 26px;
    color: var(--ink); letter-spacing: -.02em; line-height: 1.1;
  }
  .geo-subtitle { font-size: 13px; color: var(--ink-3); margin-top: 3px; }

  /* ── SESIÓN CARD ── */
  .geo-session {
    border-radius: 16px; padding: 18px 22px;
    border: 2px solid; display: flex; align-items: center; gap: 16px;
    transition: all .3s;
  }
  .geo-session.valid   { background: var(--teal-bg);  border-color: var(--teal-bd); }
  .geo-session.invalid { background: var(--red-bg);   border-color: var(--red-bd);  }
  .geo-session.warning { background: var(--amber-bg); border-color: var(--amber-bd);}
  .geo-session.loading { background: var(--indigo-bg);border-color: var(--indigo-bd);}

  .geo-session-icon {
    width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .valid   .geo-session-icon { background: var(--teal);  color: #fff; }
  .invalid .geo-session-icon { background: var(--red);   color: #fff; }
  .warning .geo-session-icon { background: var(--amber); color: #fff; }
  .loading .geo-session-icon { background: var(--indigo);color: #fff; }

  .geo-session-title {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px;
  }
  .valid   .geo-session-title { color: var(--teal-dk); }
  .invalid .geo-session-title { color: var(--red); }
  .warning .geo-session-title { color: var(--amber); }
  .loading .geo-session-title { color: var(--indigo); }
  .geo-session-sub { font-size: 12.5px; color: var(--ink-3); margin-top: 2px; }
  .geo-session-badge {
    margin-left: auto; padding: 6px 14px; border-radius: 99px;
    font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
    white-space: nowrap;
  }
  .valid   .geo-session-badge { background: var(--teal);  color: #fff; }
  .invalid .geo-session-badge { background: var(--red);   color: #fff; }
  .warning .geo-session-badge { background: var(--amber); color: #fff; }
  .loading .geo-session-badge { background: var(--indigo);color: #fff; }

  /* ── GRID ── */
  .geo-grid { display: grid; grid-template-columns: 1fr 300px; gap: 18px; }
  @media (max-width: 860px) { .geo-grid { grid-template-columns: 1fr; } }

  /* ── MAPA WRAP ── */
  .geo-map-wrap {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 18px; overflow: hidden;
  }
  .geo-map-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; border-bottom: 1px solid var(--border);
    background: var(--white);
  }
  .geo-map-label {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px;
    color: var(--ink); display: flex; align-items: center; gap: 8px;
  }
  .geo-map-label-dot {
    width: 8px; height: 8px; border-radius: 50%; background: var(--teal);
    animation: gpulse 2s infinite;
  }
  @keyframes gpulse {
    0%,100%{box-shadow:0 0 0 0 rgba(0,166,126,.4)}
    50%{box-shadow:0 0 0 6px rgba(0,166,126,0)}
  }
  .geo-map-inner { height: 360px; position: relative; }
  .geo-map-overlay {
    position: absolute; inset: 0; z-index: 999;
    background: rgba(249,249,248,.92); backdrop-filter: blur(4px);
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 14px;
  }
  .geo-scan-ring {
    width: 72px; height: 72px; border-radius: 50%;
    border: 3px solid var(--border); border-top-color: var(--teal);
    animation: gspin .8s linear infinite;
  }
  @keyframes gspin { to { transform: rotate(360deg); } }
  .geo-map-overlay-txt { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: var(--ink-3); }

  /* ── BTN REFRESH ── */
  .geo-btn-refresh {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 9px; border: 1.5px solid var(--border);
    background: var(--white); font-family: 'Inter', sans-serif;
    font-size: 12px; font-weight: 600; color: var(--ink-2);
    cursor: pointer; transition: all .15s;
  }
  .geo-btn-refresh:hover { background: var(--off); border-color: var(--border-md); }
  .geo-btn-refresh:disabled { opacity: .4; cursor: not-allowed; }
  .geo-spin { animation: gspin .7s linear infinite; }

  /* ── LEYENDA MAPA ── */
  .geo-map-legend {
    display: flex; gap: 18px; padding: 10px 18px;
    border-top: 1px solid var(--border); background: var(--off);
  }
  .geo-legend-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; color: var(--ink-3);
  }
  .geo-legend-dot { width: 10px; height: 10px; border-radius: 3px; }

  /* ── SIDEBAR ── */
  .geo-sidebar { display: flex; flex-direction: column; gap: 14px; }

  /* ── DISTANCIA CARD ── */
  .geo-dist-card {
    background: var(--ink); border-radius: 16px; padding: 20px;
  }
  .geo-dist-lbl {
    font-size: 10px; font-weight: 600; letter-spacing: .09em;
    text-transform: uppercase; color: rgba(255,255,255,.3);
    display: flex; align-items: center; gap: 6px; margin-bottom: 12px;
  }
  .geo-dist-row { display: flex; align-items: baseline; gap: 6px; margin-bottom: 4px; }
  .geo-dist-num {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 42px;
    color: #fff; letter-spacing: -.04em; line-height: 1;
  }
  .geo-dist-unit { font-size: 18px; color: var(--teal); font-weight: 700; }
  .geo-dist-max { font-size: 11px; color: rgba(255,255,255,.25); margin-bottom: 14px; }
  .geo-dist-track {
    height: 5px; background: rgba(255,255,255,.1);
    border-radius: 99px; overflow: hidden;
  }
  .geo-dist-fill {
    height: 100%; border-radius: 99px;
    transition: width 1s cubic-bezier(.22,.68,0,1.2), background .4s;
  }

  /* ── INFO ROWS ── */
  .geo-card {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 10px;
  }
  .geo-card-title {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 12.5px;
    color: var(--ink); display: flex; align-items: center; gap: 7px;
  }
  .geo-card-ico {
    width: 24px; height: 24px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
  }
  .geo-card-ico.teal   { background: var(--teal-bg);   color: var(--teal);   }
  .geo-card-ico.indigo { background: var(--indigo-bg); color: var(--indigo); }
  .geo-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 10px; background: var(--off); border-radius: 8px;
    font-size: 12px;
  }
  .geo-row-k { color: var(--ink-3); }
  .geo-row-v {
    font-weight: 600; color: var(--ink);
    font-family: 'Syne', sans-serif; font-size: 12.5px;
  }
  .geo-row-v.mono { font-family: monospace; font-size: 10.5px; font-weight: 400; color: var(--ink-2); }
  .geo-row-v.green { color: var(--green); }
  .geo-row-v.red   { color: var(--red);   }
  .geo-row-v.amber { color: var(--amber); }

  /* ── ACCIONES ── */
  .geo-actions { display: flex; flex-direction: column; gap: 10px; }
  .geo-btn-primary {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px; border-radius: 12px; border: none; cursor: pointer;
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
    transition: all .15s; letter-spacing: -.01em;
  }
  .geo-btn-primary.teal { background: var(--teal); color: #fff; }
  .geo-btn-primary.teal:hover:not(:disabled) { background: var(--teal-dk); }
  .geo-btn-primary.ink { background: var(--ink); color: #fff; }
  .geo-btn-primary.ink:hover:not(:disabled) { opacity: .85; }
  .geo-btn-primary:disabled { opacity: .4; cursor: not-allowed; }

  /* ── SHIELD ── */
  .geo-shield {
    display: flex; align-items: center; gap: 10px; padding: 12px 16px;
    border-radius: 12px; font-size: 12.5px; font-weight: 600;
  }
  .geo-shield.on  { background: var(--green-bg);  border: 1.5px solid var(--green-bd);  color: var(--green); }
  .geo-shield.off { background: var(--red-bg);    border: 1.5px solid var(--red-bd);    color: var(--red);   }
  .geo-shield.mid { background: var(--amber-bg);  border: 1.5px solid var(--amber-bd);  color: var(--amber); }

  /* ── ALERTA ── */
  .geo-alert {
    display: flex; gap: 12px; padding: 14px 18px; border-radius: 14px;
    font-size: 13px; line-height: 1.6; border: 1.5px solid;
  }
  .geo-alert.amber { background: var(--amber-bg); border-color: var(--amber-bd); color: var(--amber); }
  .geo-alert.red   { background: var(--red-bg);   border-color: var(--red-bd);   color: var(--red);   }
  .geo-alert.teal  { background: var(--teal-bg);  border-color: var(--teal-bd);  color: var(--teal-dk); }

  /* ── TOAST ── */
  .geo-toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: var(--ink); color: #fff; padding: 12px 20px; border-radius: 12px;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,.2);
    border-left: 3px solid var(--teal);
  }

  /* ── UNLOCK BADGE ── */
  .geo-unlock {
    display: flex; align-items: center; gap: 14px;
    padding: 16px 20px; border-radius: 14px;
    background: linear-gradient(135deg, #007a5e 0%, #00a67e 100%);
    color: #fff;
  }
  .geo-unlock-icon {
    width: 44px; height: 44px; border-radius: 11px;
    background: rgba(255,255,255,.15);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .geo-unlock-title {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 15px;
  }
  .geo-unlock-sub { font-size: 12px; opacity: .75; margin-top: 2px; }
`

export default function Geolocalizacion({ usuario }) {
  const [ubicacion,  setUbicacion]  = useState(null)
  const [medidor,    setMedidor]    = useState(null)
  const [distancia,  setDistancia]  = useState(null)
  const [estado,     setEstado]     = useState('loading') // loading | valid | invalid | warning
  const [mensaje,    setMensaje]    = useState('Obteniendo ubicación…')
  const [cargando,   setCargando]   = useState(false)
  const [guardando,  setGuardando]  = useState(false)
  const [toast,      setToast]      = useState(null)

  useEffect(() => {
    if (usuario) { obtenerMedidor(); obtenerUbicacion() }
  }, [usuario])

  // Re-evaluar distancia cuando llega el medidor
  useEffect(() => {
    if (ubicacion && medidor?.latitud) evaluar(ubicacion, medidor)
  }, [medidor])

  const obtenerMedidor = async () => {
    const { data } = await supabase
      .from('medidores').select('*').eq('id_usuario', usuario.id).single()
    setMedidor(data)
  }

  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2)**2 +
      Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const evaluar = (userLoc, med) => {
    if (!med?.latitud || !med?.longitud) {
      setEstado('warning')
      setMensaje('Tu medidor no tiene ubicación registrada')
      return
    }
    const dist = calcularDistancia(userLoc.lat, userLoc.lng, med.latitud, med.longitud)
    setDistancia(dist)
    const metros = dist * 1000
    if (metros <= 100) {
      setEstado('valid')
      setMensaje(`Validado · ${metros.toFixed(0)} m del medidor`)
    } else {
      setEstado('invalid')
      setMensaje(`Fuera de rango · ${metros.toFixed(0)} m del medidor`)
    }
  }

  const obtenerUbicacion = useCallback(() => {
    setCargando(true)
    setEstado('loading')
    setMensaje('Escaneando ubicación…')
    setDistancia(null)

    if (!navigator.geolocation) {
      setEstado('invalid')
      setMensaje('Geolocalización no disponible en este navegador')
      setCargando(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUbicacion(loc)
        setCargando(false)
        if (medidor) evaluar(loc, medidor)
        else { setEstado('warning'); setMensaje('Medidor sin ubicación registrada') }
      },
      () => {
        setEstado('invalid')
        setMensaje('Permiso de ubicación denegado')
        setCargando(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [medidor])

  const guardarUbicacion = async () => {
    if (!ubicacion || !medidor) return
    setGuardando(true)
    const { error } = await supabase.from('medidores')
      .update({ latitud: ubicacion.lat, longitud: ubicacion.lng })
      .eq('id', medidor.id)
    setGuardando(false)
    if (!error) {
      mostrarToast('✓ Ubicación del medidor guardada')
      obtenerMedidor()
    }
  }

  const mostrarToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const distMetros  = distancia ? distancia * 1000 : 0
  const pct         = distancia ? Math.min((distMetros / 100) * 100, 100) : 0
  const colorBarra  = estado === 'valid' ? 'var(--teal)' : estado === 'invalid' ? 'var(--red)' : 'var(--amber)'
  const sinUbicMedidor = !medidor?.latitud

  const sessionConfig = {
    valid:   { icon: <Unlock size={20} />,   title: 'Sesión de lectura habilitada', badge: 'ACTIVO' },
    invalid: { icon: <Lock size={20} />,     title: 'Fuera del rango permitido',    badge: 'BLOQUEADO' },
    warning: { icon: <ShieldAlert size={20}/>, title: 'Medidor sin geolocalización', badge: 'PENDIENTE' },
    loading: { icon: <Loader2 size={20} className="geo-spin" />, title: 'Verificando ubicación…', badge: '…' },
  }
  const sc = sessionConfig[estado] || sessionConfig.loading

  return (
    <div className="geo-root">
      <style>{css}</style>

      {/* HEADER */}
      <div className="geo-header">
        <div className="geo-header-icon"><MapPin size={22} /></div>
        <div>
          <div className="geo-title">Verificación de ubicación</div>
          <div className="geo-subtitle">Sistema antifraude · Validación de proximidad al medidor</div>
        </div>
      </div>

      {/* SESIÓN CARD */}
      <motion.div
        className={`geo-session ${estado}`}
        key={estado}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .3 }}
      >
        <div className="geo-session-icon">{sc.icon}</div>
        <div>
          <div className="geo-session-title">{sc.title}</div>
          <div className="geo-session-sub">{mensaje}</div>
        </div>
        <span className="geo-session-badge">{sc.badge}</span>
      </motion.div>

      {/* GRID */}
      <div className="geo-grid">

        {/* MAPA */}
        <div className="geo-map-wrap">
          <div className="geo-map-topbar">
            <div className="geo-map-label">
              <div className="geo-map-label-dot" />
              Mapa en tiempo real
            </div>
            <button className="geo-btn-refresh" onClick={obtenerUbicacion} disabled={cargando}>
              <RefreshCw size={12} className={cargando ? 'geo-spin' : ''} />
              Actualizar posición
            </button>
          </div>

          <div className="geo-map-inner">
            {cargando && (
              <div className="geo-map-overlay">
                <div className="geo-scan-ring" />
                <div className="geo-map-overlay-txt">Escaneando GPS…</div>
              </div>
            )}

            {ubicacion ? (
              <MapContainer
                center={[ubicacion.lat, ubicacion.lng]}
                zoom={17}
                style={{ height: '360px', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <RecenterMap center={[ubicacion.lat, ubicacion.lng]} />

                {/* Usuario */}
                <Marker position={[ubicacion.lat, ubicacion.lng]} icon={iconUsuario}>
                  <Popup>
                    <strong>📍 Tu ubicación</strong><br />
                    {ubicacion.lat.toFixed(6)}, {ubicacion.lng.toFixed(6)}
                  </Popup>
                </Marker>

                {medidor?.latitud && (
                  <>
                    {/* Medidor */}
                    <Marker position={[medidor.latitud, medidor.longitud]} icon={iconMedidor}>
                      <Popup>
                        <strong>🏠 Medidor {medidor.numero_medidor}</strong><br />
                        {medidor.direccion || 'Sin dirección'}
                      </Popup>
                    </Marker>

                    {/* Zona permitida */}
                    <Circle
                      center={[medidor.latitud, medidor.longitud]}
                      radius={100}
                      pathOptions={{
                        color: estado === 'valid' ? '#00a67e' : '#dc2626',
                        fillColor: estado === 'valid' ? '#00a67e' : '#dc2626',
                        fillOpacity: 0.07,
                        weight: 2,
                        dashArray: estado === 'valid' ? undefined : '8 4',
                      }}
                    />

                    {/* Línea de distancia */}
                    <Polyline
                      positions={[[ubicacion.lat, ubicacion.lng], [medidor.latitud, medidor.longitud]]}
                      pathOptions={{
                        color: estado === 'valid' ? '#00a67e' : '#4f46e5',
                        weight: 2,
                        dashArray: '6 4',
                        opacity: .7,
                      }}
                    />
                  </>
                )}
              </MapContainer>
            ) : (
              <div style={{ height: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: 'var(--off)', color: 'var(--ink-4)' }}>
                <Crosshair size={36} strokeWidth={1} />
                <span style={{ fontSize: 13 }}>Esperando permiso de ubicación</span>
              </div>
            )}
          </div>

          {/* Leyenda */}
          <div className="geo-map-legend">
            <div className="geo-legend-item">
              <div className="geo-legend-dot" style={{ background: '#00a67e', borderRadius: '50%' }} />
              Tu posición
            </div>
            <div className="geo-legend-item">
              <div className="geo-legend-dot" style={{ background: '#111110', borderRadius: 3 }} />
              Medidor
            </div>
            <div className="geo-legend-item">
              <div className="geo-legend-dot" style={{ background: 'rgba(0,166,126,.3)', border: '1px solid #00a67e', borderRadius: 3 }} />
              Zona válida (100 m)
            </div>
            <div className="geo-legend-item">
              <div style={{ width: 18, height: 2, background: '#4f46e5', borderTop: '2px dashed #4f46e5' }} />
              Distancia
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="geo-sidebar">

          {/* Distancia */}
          <div className="geo-dist-card">
            <div className="geo-dist-lbl"><Ruler size={11} /> Distancia al medidor</div>
            <div className="geo-dist-row">
              <span className="geo-dist-num">
                {distancia ? distMetros.toFixed(0) : '—'}
              </span>
              {distancia && <span className="geo-dist-unit">m</span>}
            </div>
            <div className="geo-dist-max">Máximo permitido: 100 m</div>
            <div className="geo-dist-track">
              <motion.div
                className="geo-dist-fill"
                animate={{ width: `${pct}%`, background: colorBarra }}
                transition={{ duration: 1, ease: [.22,.68,0,1.2] }}
              />
            </div>
          </div>

          {/* Tu posición */}
          <div className="geo-card">
            <div className="geo-card-title">
              <div className="geo-card-ico teal"><Navigation size={12} /></div>
              Tu posición
            </div>
            <div className="geo-row">
              <span className="geo-row-k">Latitud</span>
              <span className="geo-row-v mono">{ubicacion ? ubicacion.lat.toFixed(6) : '—'}</span>
            </div>
            <div className="geo-row">
              <span className="geo-row-k">Longitud</span>
              <span className="geo-row-v mono">{ubicacion ? ubicacion.lng.toFixed(6) : '—'}</span>
            </div>
          </div>

          {/* Medidor */}
          <div className="geo-card">
            <div className="geo-card-title">
              <div className="geo-card-ico indigo"><Home size={12} /></div>
              Medidor registrado
            </div>
            <div className="geo-row">
              <span className="geo-row-k">Número</span>
              <span className="geo-row-v mono">{medidor?.numero_medidor || '—'}</span>
            </div>
            <div className="geo-row">
              <span className="geo-row-k">Dirección</span>
              <span className="geo-row-v" style={{ fontSize: 11, maxWidth: 140, textAlign: 'right' }}>
                {medidor?.direccion || 'No registrada'}
              </span>
            </div>
            <div className="geo-row">
              <span className="geo-row-k">Estado</span>
              <span className={`geo-row-v ${estado === 'valid' ? 'green' : estado === 'invalid' ? 'red' : 'amber'}`}>
                {estado === 'valid' ? '✓ En rango' : estado === 'invalid' ? '✗ Fuera de rango' : '— Sin datos'}
              </span>
            </div>
          </div>

          {/* Shield */}
          <div className={`geo-shield ${estado === 'valid' ? 'on' : estado === 'invalid' ? 'off' : 'mid'}`}>
            {estado === 'valid'
              ? <><ShieldCheck size={15} /> Sistema antifraude · Validado</>
              : estado === 'invalid'
              ? <><ShieldOff size={15} /> Acceso restringido · Fuera de zona</>
              : <><ShieldAlert size={15} /> Sistema antifraude · Pendiente</>
            }
          </div>

        </div>
      </div>

      {/* UNLOCK cuando está validado */}
      <AnimatePresence>
        {estado === 'valid' && (
          <motion.div
            className="geo-unlock"
            initial={{ opacity: 0, scale: .97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: .97 }}
          >
            <div className="geo-unlock-icon"><Unlock size={20} /></div>
            <div>
              <div className="geo-unlock-title">Lectura habilitada</div>
              <div className="geo-unlock-sub">
                Podés registrar lecturas y acciones · Sesión válida por esta ubicación
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACCIONES */}
      <div className="geo-actions">
        <button
          className="geo-btn-primary teal"
          onClick={obtenerUbicacion}
          disabled={cargando}
        >
          {cargando
            ? <><Loader2 size={15} className="geo-spin" /> Escaneando…</>
            : <><Radio size={15} /> Escanear mi ubicación</>
          }
        </button>

        {/* Guardar solo si el medidor no tiene coordenadas */}
        {sinUbicMedidor && ubicacion && (
          <motion.button
            className="geo-btn-primary ink"
            onClick={guardarUbicacion}
            disabled={guardando}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {guardando
              ? <><Loader2 size={15} className="geo-spin" /> Guardando…</>
              : <><Save size={15} /> Registrar ubicación del medidor</>
            }
          </motion.button>
        )}
      </div>

      {/* ALERTAS */}
      <AnimatePresence>
        {estado === 'invalid' && distancia && (
          <motion.div className="geo-alert red" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              Estás a <strong>{distMetros.toFixed(0)} m</strong> del medidor.
              Debés estar dentro de los <strong>100 metros</strong> para registrar lecturas y validar acciones en el sistema.
            </span>
          </motion.div>
        )}
        {estado === 'warning' && (
          <motion.div className="geo-alert amber" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              Tu medidor no tiene coordenadas registradas. Presioná <strong>"Registrar ubicación"</strong> para establecer tu posición actual como la ubicación oficial del medidor.
            </span>
          </motion.div>
        )}
        {estado === 'valid' && (
          <motion.div className="geo-alert teal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              Ubicación verificada correctamente. El sistema ha registrado tu acceso a <strong>{distMetros.toFixed(0)} m</strong> del medidor.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="geo-toast"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
          >
            <CheckCircle2 size={15} color="var(--teal)" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}