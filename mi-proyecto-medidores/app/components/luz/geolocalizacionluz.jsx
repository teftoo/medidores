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
  Home, Lock, Unlock, Crosshair, Radio, Zap
} from 'lucide-react'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
})

const iconUsuario = new L.DivIcon({
  html: `<div style="
    width:36px;height:36px;border-radius:50%;
    background:#eab308;border:3px solid #fff;
    box-shadow:0 2px 12px rgba(234,179,8,.5);
    display:flex;align-items:center;justify-content:center;
  "><svg width="16" height="16" viewBox="0 0 24 24" fill="#111110"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>`,
  className: '', iconSize: [36, 36], iconAnchor: [18, 18],
})

const iconMedidor = new L.DivIcon({
  html: `<div style="
    width:36px;height:36px;border-radius:10px;
    background:#111110;border:3px solid #eab308;
    box-shadow:0 2px 12px rgba(0,0,0,.3);
    display:flex;align-items:center;justify-content:center;
  "><svg width="16" height="16" viewBox="0 0 24 24" fill="#eab308"><path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.81 6-4.72 7.72L13 18v5h5l-1.22-1.22C19.91 19.07 22 15.76 22 12c0-5.18-3.95-9.45-9-9.95M11 2.05C5.95 2.55 2 6.82 2 12c0 3.76 2.09 7.07 5.22 8.78L6 22h5V2.05M11 13H9l3-7v5h2l-3 7v-5z"/></svg></div>`,
  className: '', iconSize: [36, 36], iconAnchor: [18, 18],
})

function RecenterMap({ center }) {
  const map = useMap()
  useEffect(() => { if (center) map.setView(center, map.getZoom()) }, [center])
  return null
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  .geoluz-root {
    --white:      #ffffff;
    --off:        #f9f9f8;
    --border:     #ebebea;
    --border-md:  #d4d4d0;
    --ink:        #111110;
    --ink-2:      #3a3a38;
    --ink-3:      #737370;
    --ink-4:      #b0b0ac;
    --elec:       #eab308;
    --elec-dk:    #a16207;
    --elec-bg:    #fefce8;
    --elec-bd:    #fef08a;
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

  .geoluz-header {
    display: flex; align-items: center; gap: 16px;
    padding-bottom: 22px; border-bottom: 1.5px solid var(--border);
  }
  .geoluz-header-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--ink); display: flex; align-items: center;
    justify-content: center; color: var(--elec); flex-shrink: 0;
  }
  .geoluz-title {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 26px;
    color: var(--ink); letter-spacing: -.02em; line-height: 1.1;
  }
  .geoluz-subtitle { font-size: 13px; color: var(--ink-3); margin-top: 3px; }

  .geoluz-session {
    border-radius: 16px; padding: 18px 22px;
    border: 2px solid; display: flex; align-items: center; gap: 16px;
    transition: all .3s;
  }
  .geoluz-session.valid   { background: var(--elec-bg);   border-color: var(--elec-bd); }
  .geoluz-session.invalid { background: var(--red-bg);    border-color: var(--red-bd);  }
  .geoluz-session.warning { background: var(--amber-bg);  border-color: var(--amber-bd);}
  .geoluz-session.loading { background: var(--indigo-bg); border-color: var(--indigo-bd);}

  .geoluz-session-icon {
    width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .valid   .geoluz-session-icon { background: var(--elec);   color: var(--ink); }
  .invalid .geoluz-session-icon { background: var(--red);    color: #fff; }
  .warning .geoluz-session-icon { background: var(--amber);  color: #fff; }
  .loading .geoluz-session-icon { background: var(--indigo); color: #fff; }

  .geoluz-session-title {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px;
  }
  .valid   .geoluz-session-title { color: var(--elec-dk); }
  .invalid .geoluz-session-title { color: var(--red); }
  .warning .geoluz-session-title { color: var(--amber); }
  .loading .geoluz-session-title { color: var(--indigo); }
  .geoluz-session-sub { font-size: 12.5px; color: var(--ink-3); margin-top: 2px; }
  .geoluz-session-badge {
    margin-left: auto; padding: 6px 14px; border-radius: 99px;
    font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
    white-space: nowrap;
  }
  .valid   .geoluz-session-badge { background: var(--elec);   color: var(--ink); }
  .invalid .geoluz-session-badge { background: var(--red);    color: #fff; }
  .warning .geoluz-session-badge { background: var(--amber);  color: #fff; }
  .loading .geoluz-session-badge { background: var(--indigo); color: #fff; }

  .geoluz-grid { display: grid; grid-template-columns: 1fr 300px; gap: 18px; }
  @media (max-width: 860px) { .geoluz-grid { grid-template-columns: 1fr; } }

  .geoluz-map-wrap {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 18px; overflow: hidden;
  }
  .geoluz-map-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; border-bottom: 1px solid var(--border);
    background: var(--white);
  }
  .geoluz-map-label {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px;
    color: var(--ink); display: flex; align-items: center; gap: 8px;
  }
  .geoluz-map-label-dot {
    width: 8px; height: 8px; border-radius: 50%; background: var(--elec);
    animation: gpulse 2s infinite;
  }
  @keyframes gpulse {
    0%,100%{box-shadow:0 0 0 0 rgba(234,179,8,.4)}
    50%{box-shadow:0 0 0 6px rgba(234,179,8,0)}
  }
  .geoluz-map-inner { height: 360px; position: relative; }
  .geoluz-map-overlay {
    position: absolute; inset: 0; z-index: 999;
    background: rgba(249,249,248,.92); backdrop-filter: blur(4px);
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 14px;
  }
  .geoluz-scan-ring {
    width: 72px; height: 72px; border-radius: 50%;
    border: 3px solid var(--border); border-top-color: var(--elec);
    animation: gspin .8s linear infinite;
  }
  @keyframes gspin { to { transform: rotate(360deg); } }
  .geoluz-map-overlay-txt { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: var(--ink-3); }

  .geoluz-btn-refresh {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 9px; border: 1.5px solid var(--border);
    background: var(--white); font-family: 'Inter', sans-serif;
    font-size: 12px; font-weight: 600; color: var(--ink-2);
    cursor: pointer; transition: all .15s;
  }
  .geoluz-btn-refresh:hover { background: var(--off); border-color: var(--border-md); }
  .geoluz-btn-refresh:disabled { opacity: .4; cursor: not-allowed; }
  .geoluz-spin { animation: gspin .7s linear infinite; }

  .geoluz-map-legend {
    display: flex; gap: 18px; padding: 10px 18px;
    border-top: 1px solid var(--border); background: var(--off);
  }
  .geoluz-legend-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; color: var(--ink-3);
  }
  .geoluz-legend-dot { width: 10px; height: 10px; border-radius: 3px; }

  .geoluz-sidebar { display: flex; flex-direction: column; gap: 14px; }

  .geoluz-dist-card { background: var(--ink); border-radius: 16px; padding: 20px; }
  .geoluz-dist-lbl {
    font-size: 10px; font-weight: 600; letter-spacing: .09em;
    text-transform: uppercase; color: rgba(255,255,255,.3);
    display: flex; align-items: center; gap: 6px; margin-bottom: 12px;
  }
  .geoluz-dist-row { display: flex; align-items: baseline; gap: 6px; margin-bottom: 4px; }
  .geoluz-dist-num {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 42px;
    color: #fff; letter-spacing: -.04em; line-height: 1;
  }
  .geoluz-dist-unit { font-size: 18px; color: var(--elec); font-weight: 700; }
  .geoluz-dist-max { font-size: 11px; color: rgba(255,255,255,.25); margin-bottom: 14px; }
  .geoluz-dist-track { height: 5px; background: rgba(255,255,255,.1); border-radius: 99px; overflow: hidden; }
  .geoluz-dist-fill { height: 100%; border-radius: 99px; transition: width 1s cubic-bezier(.22,.68,0,1.2), background .4s; }

  .geoluz-card {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 10px;
  }
  .geoluz-card-title {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 12.5px;
    color: var(--ink); display: flex; align-items: center; gap: 7px;
  }
  .geoluz-card-ico {
    width: 24px; height: 24px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
  }
  .geoluz-card-ico.elec   { background: var(--elec-bg);   color: var(--elec-dk); }
  .geoluz-card-ico.indigo { background: var(--indigo-bg); color: var(--indigo);  }
  .geoluz-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 10px; background: var(--off); border-radius: 8px; font-size: 12px;
  }
  .geoluz-row-k { color: var(--ink-3); }
  .geoluz-row-v { font-weight: 600; color: var(--ink); font-family: 'Syne', sans-serif; font-size: 12.5px; }
  .geoluz-row-v.mono  { font-family: monospace; font-size: 10.5px; font-weight: 400; color: var(--ink-2); }
  .geoluz-row-v.green { color: var(--green); }
  .geoluz-row-v.red   { color: var(--red);   }
  .geoluz-row-v.amber { color: var(--amber); }

  .geoluz-actions { display: flex; flex-direction: column; gap: 10px; }
  .geoluz-btn-primary {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px; border-radius: 12px; border: none; cursor: pointer;
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
    transition: all .15s; letter-spacing: -.01em;
  }
  .geoluz-btn-primary.elec { background: var(--elec); color: var(--ink); }
  .geoluz-btn-primary.elec:hover:not(:disabled) { background: var(--elec-dk); color: #fff; }
  .geoluz-btn-primary.ink  { background: var(--ink);  color: #fff; }
  .geoluz-btn-primary.ink:hover:not(:disabled)  { opacity: .85; }
  .geoluz-btn-primary:disabled { opacity: .4; cursor: not-allowed; }

  .geoluz-shield {
    display: flex; align-items: center; gap: 10px; padding: 12px 16px;
    border-radius: 12px; font-size: 12.5px; font-weight: 600;
  }
  .geoluz-shield.on  { background: var(--green-bg);  border: 1.5px solid var(--green-bd);  color: var(--green); }
  .geoluz-shield.off { background: var(--red-bg);    border: 1.5px solid var(--red-bd);    color: var(--red);   }
  .geoluz-shield.mid { background: var(--amber-bg);  border: 1.5px solid var(--amber-bd);  color: var(--amber); }

  .geoluz-alert {
    display: flex; gap: 12px; padding: 14px 18px; border-radius: 14px;
    font-size: 13px; line-height: 1.6; border: 1.5px solid;
  }
  .geoluz-alert.amber { background: var(--amber-bg); border-color: var(--amber-bd); color: var(--amber); }
  .geoluz-alert.red   { background: var(--red-bg);   border-color: var(--red-bd);   color: var(--red);   }
  .geoluz-alert.elec  { background: var(--elec-bg);  border-color: var(--elec-bd);  color: var(--elec-dk); }

  .geoluz-toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: var(--ink); color: #fff; padding: 12px 20px; border-radius: 12px;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,.2);
    border-left: 3px solid var(--elec);
  }

  .geoluz-unlock {
    display: flex; align-items: center; gap: 14px;
    padding: 16px 20px; border-radius: 14px;
    background: linear-gradient(135deg, #a16207 0%, #eab308 100%);
    color: var(--ink);
  }
  .geoluz-unlock-icon {
    width: 44px; height: 44px; border-radius: 11px;
    background: rgba(0,0,0,.15);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .geoluz-unlock-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 15px; }
  .geoluz-unlock-sub   { font-size: 12px; opacity: .7; margin-top: 2px; }
`

export default function GeolocalizacionLuz({ usuario }) {
  const [ubicacion,  setUbicacion]  = useState(null)
  const [medidor,    setMedidor]    = useState(null)
  const [distancia,  setDistancia]  = useState(null)
  const [estado,     setEstado]     = useState('loading')
  const [mensaje,    setMensaje]    = useState('Obteniendo ubicación…')
  const [cargando,   setCargando]   = useState(false)
  const [guardando,  setGuardando]  = useState(false)
  const [toast,      setToast]      = useState(null)

  useEffect(() => {
    if (usuario) { obtenerMedidor(); obtenerUbicacion() }
  }, [usuario])

  useEffect(() => {
    if (ubicacion && medidor?.latitud) evaluar(ubicacion, medidor)
  }, [medidor])

  const obtenerMedidor = async () => {
    const { data } = await supabase
      .from('medidores_luz')           // ← tabla de luz
      .select('*')
      .eq('id_usuario', usuario.id)
      .single()
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
    const dist   = calcularDistancia(userLoc.lat, userLoc.lng, med.latitud, med.longitud)
    const metros = dist * 1000
    setDistancia(dist)
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
    const { error } = await supabase
      .from('medidores_luz')           // ← tabla de luz
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

  const distMetros = distancia ? distancia * 1000 : 0
  const pct        = distancia ? Math.min((distMetros / 100) * 100, 100) : 0
  const colorBarra = estado === 'valid' ? 'var(--elec)' : estado === 'invalid' ? 'var(--red)' : 'var(--amber)'
  const sinUbicMedidor = !medidor?.latitud

  const sessionConfig = {
    valid:   { icon: <Unlock size={20} />,    title: 'Sesión de lectura habilitada',   badge: 'ACTIVO'    },
    invalid: { icon: <Lock size={20} />,      title: 'Fuera del rango permitido',      badge: 'BLOQUEADO' },
    warning: { icon: <ShieldAlert size={20}/>, title: 'Medidor sin geolocalización',   badge: 'PENDIENTE' },
    loading: { icon: <Loader2 size={20} className="geoluz-spin" />, title: 'Verificando ubicación…', badge: '…' },
  }
  const sc = sessionConfig[estado] || sessionConfig.loading

  return (
    <div className="geoluz-root">
      <style>{css}</style>

      {/* HEADER */}
      <div className="geoluz-header">
        <div className="geoluz-header-icon"><MapPin size={22} /></div>
        <div>
          <div className="geoluz-title">Verificación de ubicación</div>
          <div className="geoluz-subtitle">Sistema antifraude · Validación de proximidad al medidor eléctrico</div>
        </div>
      </div>

      {/* SESIÓN CARD */}
      <motion.div
        className={`geoluz-session ${estado}`}
        key={estado}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .3 }}
      >
        <div className="geoluz-session-icon">{sc.icon}</div>
        <div>
          <div className="geoluz-session-title">{sc.title}</div>
          <div className="geoluz-session-sub">{mensaje}</div>
        </div>
        <span className="geoluz-session-badge">{sc.badge}</span>
      </motion.div>

      {/* GRID */}
      <div className="geoluz-grid">

        {/* MAPA */}
        <div className="geoluz-map-wrap">
          <div className="geoluz-map-topbar">
            <div className="geoluz-map-label">
              <div className="geoluz-map-label-dot" />
              Mapa en tiempo real
            </div>
            <button className="geoluz-btn-refresh" onClick={obtenerUbicacion} disabled={cargando}>
              <RefreshCw size={12} className={cargando ? 'geoluz-spin' : ''} />
              Actualizar posición
            </button>
          </div>

          <div className="geoluz-map-inner">
            {cargando && (
              <div className="geoluz-map-overlay">
                <div className="geoluz-scan-ring" />
                <div className="geoluz-map-overlay-txt">Escaneando GPS…</div>
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

                <Marker position={[ubicacion.lat, ubicacion.lng]} icon={iconUsuario}>
                  <Popup>
                    <strong>⚡ Tu ubicación</strong><br />
                    {ubicacion.lat.toFixed(6)}, {ubicacion.lng.toFixed(6)}
                  </Popup>
                </Marker>

                {medidor?.latitud && (
                  <>
                    <Marker position={[medidor.latitud, medidor.longitud]} icon={iconMedidor}>
                      <Popup>
                        <strong>🔌 Medidor {medidor.numero_medidor}</strong><br />
                        {medidor.direccion || 'Sin dirección'}
                      </Popup>
                    </Marker>

                    <Circle
                      center={[medidor.latitud, medidor.longitud]}
                      radius={100}
                      pathOptions={{
                        color: estado === 'valid' ? '#eab308' : '#dc2626',
                        fillColor: estado === 'valid' ? '#eab308' : '#dc2626',
                        fillOpacity: 0.07,
                        weight: 2,
                        dashArray: estado === 'valid' ? undefined : '8 4',
                      }}
                    />

                    <Polyline
                      positions={[[ubicacion.lat, ubicacion.lng], [medidor.latitud, medidor.longitud]]}
                      pathOptions={{
                        color: estado === 'valid' ? '#eab308' : '#4f46e5',
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

          <div className="geoluz-map-legend">
            <div className="geoluz-legend-item">
              <div className="geoluz-legend-dot" style={{ background: '#eab308', borderRadius: '50%' }} />
              Tu posición
            </div>
            <div className="geoluz-legend-item">
              <div className="geoluz-legend-dot" style={{ background: '#111110', borderRadius: 3 }} />
              Medidor
            </div>
            <div className="geoluz-legend-item">
              <div className="geoluz-legend-dot" style={{ background: 'rgba(234,179,8,.3)', border: '1px solid #eab308', borderRadius: 3 }} />
              Zona válida (100 m)
            </div>
            <div className="geoluz-legend-item">
              <div style={{ width: 18, height: 2, borderTop: '2px dashed #4f46e5' }} />
              Distancia
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="geoluz-sidebar">

          <div className="geoluz-dist-card">
            <div className="geoluz-dist-lbl"><Ruler size={11} /> Distancia al medidor</div>
            <div className="geoluz-dist-row">
              <span className="geoluz-dist-num">{distancia ? distMetros.toFixed(0) : '—'}</span>
              {distancia && <span className="geoluz-dist-unit">m</span>}
            </div>
            <div className="geoluz-dist-max">Máximo permitido: 100 m</div>
            <div className="geoluz-dist-track">
              <motion.div
                className="geoluz-dist-fill"
                animate={{ width: `${pct}%`, background: colorBarra }}
                transition={{ duration: 1, ease: [.22,.68,0,1.2] }}
              />
            </div>
          </div>

          <div className="geoluz-card">
            <div className="geoluz-card-title">
              <div className="geoluz-card-ico elec"><Navigation size={12} /></div>
              Tu posición
            </div>
            <div className="geoluz-row">
              <span className="geoluz-row-k">Latitud</span>
              <span className="geoluz-row-v mono">{ubicacion ? ubicacion.lat.toFixed(6) : '—'}</span>
            </div>
            <div className="geoluz-row">
              <span className="geoluz-row-k">Longitud</span>
              <span className="geoluz-row-v mono">{ubicacion ? ubicacion.lng.toFixed(6) : '—'}</span>
            </div>
          </div>

          <div className="geoluz-card">
            <div className="geoluz-card-title">
              <div className="geoluz-card-ico indigo"><Home size={12} /></div>
              Medidor registrado
            </div>
            <div className="geoluz-row">
              <span className="geoluz-row-k">Número</span>
              <span className="geoluz-row-v mono">{medidor?.numero_medidor || '—'}</span>
            </div>
            <div className="geoluz-row">
              <span className="geoluz-row-k">Dirección</span>
              <span className="geoluz-row-v" style={{ fontSize: 11, maxWidth: 140, textAlign: 'right' }}>
                {medidor?.direccion || 'No registrada'}
              </span>
            </div>
            <div className="geoluz-row">
              <span className="geoluz-row-k">Estado</span>
              <span className={`geoluz-row-v ${estado === 'valid' ? 'green' : estado === 'invalid' ? 'red' : 'amber'}`}>
                {estado === 'valid' ? '✓ En rango' : estado === 'invalid' ? '✗ Fuera de rango' : '— Sin datos'}
              </span>
            </div>
          </div>

          <div className={`geoluz-shield ${estado === 'valid' ? 'on' : estado === 'invalid' ? 'off' : 'mid'}`}>
            {estado === 'valid'
              ? <><ShieldCheck size={15} /> Sistema antifraude · Validado</>
              : estado === 'invalid'
              ? <><ShieldOff size={15} /> Acceso restringido · Fuera de zona</>
              : <><ShieldAlert size={15} /> Sistema antifraude · Pendiente</>
            }
          </div>
        </div>
      </div>

      {/* UNLOCK */}
      <AnimatePresence>
        {estado === 'valid' && (
          <motion.div
            className="geoluz-unlock"
            initial={{ opacity: 0, scale: .97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: .97 }}
          >
            <div className="geoluz-unlock-icon"><Zap size={20} /></div>
            <div>
              <div className="geoluz-unlock-title">Lectura eléctrica habilitada</div>
              <div className="geoluz-unlock-sub">
                Podés registrar lecturas y acciones · Sesión válida por esta ubicación
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACCIONES */}
      <div className="geoluz-actions">
        <button
          className="geoluz-btn-primary elec"
          onClick={obtenerUbicacion}
          disabled={cargando}
        >
          {cargando
            ? <><Loader2 size={15} className="geoluz-spin" /> Escaneando…</>
            : <><Radio size={15} /> Escanear mi ubicación</>
          }
        </button>

        {sinUbicMedidor && ubicacion && (
          <motion.button
            className="geoluz-btn-primary ink"
            onClick={guardarUbicacion}
            disabled={guardando}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {guardando
              ? <><Loader2 size={15} className="geoluz-spin" /> Guardando…</>
              : <><Save size={15} /> Registrar ubicación del medidor</>
            }
          </motion.button>
        )}
      </div>

      {/* ALERTAS */}
      <AnimatePresence>
        {estado === 'invalid' && distancia && (
          <motion.div className="geoluz-alert red" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              Estás a <strong>{distMetros.toFixed(0)} m</strong> del medidor.
              Debés estar dentro de los <strong>100 metros</strong> para registrar lecturas.
            </span>
          </motion.div>
        )}
        {estado === 'warning' && (
          <motion.div className="geoluz-alert amber" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              Tu medidor no tiene coordenadas registradas. Presioná <strong>"Registrar ubicación"</strong> para establecerla.
            </span>
          </motion.div>
        )}
        {estado === 'valid' && (
          <motion.div className="geoluz-alert elec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              Ubicación verificada. El sistema registró tu acceso a <strong>{distMetros.toFixed(0)} m</strong> del medidor eléctrico.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="geoluz-toast"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
          >
            <CheckCircle2 size={15} color="var(--elec)" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}