'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import {
  Droplets, Zap, Flame,
  Mail, Lock, Eye, EyeOff,
  ArrowRight, AlertCircle, CheckCircle2,
  Gauge
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════
   DESIGN TOKENS — coherente con el dashboard pero más
   abierto, luminoso y espacioso. Paleta blanca premium.
═══════════════════════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --white:     #ffffff;
    --off:       #f7f7f5;
    --canvas:    #f2f1ee;
    --border:    #e8e8e5;
    --border-md: #d0cfca;
    --ink:       #0f0f0e;
    --ink-2:     #2e2e2c;
    --ink-3:     #6b6b68;
    --ink-4:     #aeaea9;
    --teal:      #00a67e;
    --teal-dk:   #007a5e;
    --teal-bg:   #e4f5ef;
    --teal-bd:   #a8e0cc;
    --teal-mid:  #00c494;
    --red:       #d93025;
    --red-bg:    #fdf1f0;
    --red-bd:    #f5c0bb;
    --green:     #1a7f4b;
    --green-bg:  #edf7f2;
    --green-bd:  #a0dcc0;
  }

  .lg-root {
    font-family: 'DM Sans', system-ui, sans-serif;
    background: var(--canvas);
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
  }

  /* ── DECORATIVE SHAPES ── */
  .lg-root::before {
    content: '';
    position: fixed;
    width: 600px; height: 600px;
    border-radius: 50%;
    border: 1px solid var(--border);
    top: -200px; right: 30%;
    pointer-events: none;
    z-index: 0;
  }
  .lg-root::after {
    content: '';
    position: fixed;
    width: 400px; height: 400px;
    border-radius: 50%;
    border: 1px solid var(--border);
    bottom: -100px; left: 25%;
    pointer-events: none;
    z-index: 0;
  }

  /* ══════════════════════════════
     PANEL IZQUIERDO — Ilustrativo
  ══════════════════════════════ */
  .lg-left {
    position: relative; z-index: 1;
    display: flex; flex-direction: column;
    justify-content: center;
    padding: 64px 72px;
    background: var(--canvas);
  }

  .lg-logo {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 80px;
  }
  .lg-logo-mark {
    width: 36px; height: 36px;
    background: var(--ink);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: var(--teal);
  }
  .lg-logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 17px;
    color: var(--ink); letter-spacing: -.02em;
  }
  .lg-logo-text span { color: var(--teal); }

  .lg-hero-eyebrow {
    font-size: 11px; font-weight: 600;
    letter-spacing: .14em; text-transform: uppercase;
    color: var(--teal); margin-bottom: 18px;
  }
  .lg-hero-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 48px;
    line-height: 1.06; letter-spacing: -.04em;
    color: var(--ink); margin-bottom: 20px;
  }
  .lg-hero-title .nl { display: block; }
  .lg-hero-title .acc {
    color: var(--teal);
    position: relative; display: inline-block;
  }
  .lg-hero-desc {
    font-size: 15px; color: var(--ink-3);
    line-height: 1.75; max-width: 340px;
    margin-bottom: 56px;
  }

  /* Servicio pills */
  .lg-pills { display: flex; flex-direction: column; gap: 10px; }
  .lg-pill {
    display: flex; align-items: center; gap: 14px;
    padding: 16px 20px; border-radius: 16px;
    background: var(--white); border: 1.5px solid var(--border);
    transition: all .3s ease;
  }
  .lg-pill.active {
    border-color: var(--teal-bd);
    background: var(--teal-bg);
    transform: translateX(6px);
  }
  .lg-pill-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all .3s;
  }
  .lg-pill.water  .lg-pill-icon { background: rgba(0,166,126,.12); color: var(--teal); }
  .lg-pill.energy .lg-pill-icon { background: rgba(245,171,0,.12);  color: #d4920a; }
  .lg-pill.gas    .lg-pill-icon { background: rgba(220,100,50,.12);  color: #c15828; }
  .lg-pill-name {
    font-family: 'Syne', sans-serif;
    font-size: 14px; font-weight: 700; color: var(--ink-2);
  }
  .lg-pill.active .lg-pill-name { color: var(--teal-dk); }
  .lg-pill-desc {
    font-size: 12px; color: var(--ink-4); margin-top: 2px;
    transition: color .3s;
  }
  .lg-pill.active .lg-pill-desc { color: var(--teal-dk); opacity: .7; }
  .lg-pill-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--teal-bd); margin-left: auto;
    transition: all .3s; opacity: 0;
    flex-shrink: 0;
  }
  .lg-pill.active .lg-pill-dot { opacity: 1; background: var(--teal); }

  .lg-left-footer {
    margin-top: 64px; font-size: 12px; color: var(--ink-4);
    font-style: italic;
  }

  /* ══════════════════════════════
     PANEL DERECHO — Formulario
  ══════════════════════════════ */
  .lg-right {
    position: relative; z-index: 1;
    background: var(--white);
    display: flex; align-items: center; justify-content: center;
    padding: 64px 80px;
    border-left: 1px solid var(--border);
    min-height: 100vh;
  }

  .lg-form-wrap {
    width: 100%; max-width: 380px;
  }

  /* Badge de estado */
  .lg-status-badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 6px 14px; border-radius: 99px;
    background: var(--teal-bg); border: 1px solid var(--teal-bd);
    font-size: 11.5px; font-weight: 600; color: var(--teal-dk);
    letter-spacing: .04em; text-transform: uppercase;
    margin-bottom: 28px;
  }
  .badge-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--teal);
    animation: pulse-dot 2s infinite;
  }
  @keyframes pulse-dot {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: .4; transform: scale(.8); }
  }

  .lg-form-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 32px;
    color: var(--ink); letter-spacing: -.03em;
    line-height: 1.1; margin-bottom: 8px;
  }
  .lg-form-sub {
    font-size: 14.5px; color: var(--ink-3);
    line-height: 1.65; margin-bottom: 40px;
  }

  /* FIELDS */
  .lg-fields { display: flex; flex-direction: column; gap: 20px; margin-bottom: 10px; }

  .lg-field { display: flex; flex-direction: column; gap: 7px; }
  .lg-field-label {
    font-size: 12px; font-weight: 600;
    color: var(--ink-2); letter-spacing: .05em; text-transform: uppercase;
  }
  .lg-field-inner { position: relative; }
  .lg-field-icon {
    position: absolute; left: 16px; top: 50%;
    transform: translateY(-50%);
    color: var(--ink-4); pointer-events: none;
    display: flex; align-items: center;
    transition: color .2s;
  }
  .lg-field-inner:focus-within .lg-field-icon { color: var(--teal); }

  .lg-input {
    width: 100%;
    padding: 14px 16px 14px 46px;
    background: var(--off);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px; color: var(--ink);
    outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
    -webkit-appearance: none;
  }
  .lg-input::placeholder { color: var(--ink-4); }
  .lg-input:focus {
    background: var(--white);
    border-color: var(--teal);
    box-shadow: 0 0 0 4px rgba(0,166,126,.1);
  }
  .lg-input:hover:not(:focus) { border-color: var(--border-md); }

  .lg-eye-btn {
    position: absolute; right: 15px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--ink-4); display: flex; align-items: center;
    padding: 2px; border-radius: 6px; transition: color .15s;
  }
  .lg-eye-btn:hover { color: var(--ink-2); }

  /* FORGOT */
  .lg-forgot {
    display: flex; justify-content: flex-end;
    margin-top: -12px; margin-bottom: 8px;
  }
  .lg-forgot-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--teal-dk); font-weight: 500;
    padding: 4px 0; transition: color .15s;
  }
  .lg-forgot-btn:hover { color: var(--teal); }

  /* ALERT */
  .lg-alert {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 14px 16px; border-radius: 12px;
    font-size: 13.5px; line-height: 1.5;
    margin-bottom: 4px;
  }
  .lg-alert.err {
    background: var(--red-bg); border: 1px solid var(--red-bd);
    color: var(--red);
  }
  .lg-alert.ok {
    background: var(--green-bg); border: 1px solid var(--green-bd);
    color: var(--green);
  }
  .lg-alert svg { flex-shrink: 0; margin-top: 1px; }

  /* MAIN BUTTON */
  .lg-btn-primary {
    width: 100%; margin-top: 8px;
    padding: 16px 24px;
    background: var(--ink); color: var(--white);
    border: 2px solid var(--ink);
    border-radius: 14px; cursor: pointer;
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 15px; letter-spacing: -.01em;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: all .22s;
    position: relative; overflow: hidden;
  }
  .lg-btn-primary::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--teal);
    transform: translateX(-101%);
    transition: transform .3s cubic-bezier(.22,.68,0,1.2);
    z-index: 0;
  }
  .lg-btn-primary:hover:not(:disabled)::before { transform: translateX(0); }
  .lg-btn-primary:hover:not(:disabled) { border-color: var(--teal); }
  .lg-btn-primary > * { position: relative; z-index: 1; }
  .lg-btn-primary:disabled { opacity: .45; cursor: not-allowed; }
  .lg-btn-arrow { transition: transform .2s; }
  .lg-btn-primary:hover:not(:disabled) .lg-btn-arrow { transform: translateX(4px); }

  .lg-spin {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff; border-radius: 50%;
    animation: spin .65s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* DIVIDER + REGISTER */
  .lg-or {
    display: flex; align-items: center; gap: 14px;
    margin: 22px 0; font-size: 12px; color: var(--ink-4);
  }
  .lg-or::before, .lg-or::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }

  .lg-register-row {
    display: flex; align-items: center; justify-content: space-between;
  }
  .lg-register-hint { font-size: 13.5px; color: var(--ink-3); }
  .lg-register-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'Syne', sans-serif;
    font-size: 13.5px; font-weight: 700; color: var(--ink);
    padding: 8px 16px; border-radius: 10px;
    border: 1.5px solid var(--border);
    transition: all .18s;
  }
  .lg-register-btn:hover {
    border-color: var(--ink); background: var(--off);
  }

  .lg-back-row { margin-top: 40px; }
  .lg-back-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px; color: var(--ink-4);
    display: flex; align-items: center; gap: 6px;
    padding: 0; transition: color .15s;
  }
  .lg-back-btn:hover { color: var(--ink-3); }

  /* FOOTER */
  .lg-form-footer {
    margin-top: 52px; padding-top: 24px;
    border-top: 1px solid var(--border);
    font-size: 11px; color: var(--ink-4); line-height: 1.6;
  }
  .lg-form-footer strong { color: var(--ink-3); font-weight: 600; }

  /* RESPONSIVE */
  @media (max-width: 860px) {
    .lg-root { grid-template-columns: 1fr; }
    .lg-left  { display: none; }
    .lg-right { border-left: none; padding: 48px 28px; }
    .lg-form-wrap { max-width: 100%; }
  }
`

const SERVICES = [
  { key: 'water',  icon: Droplets, name: 'Agua',    desc: 'Lectura inteligente con IA' },
  { key: 'energy', icon: Zap,      name: 'Energía', desc: 'Control de consumo eléctrico' },
  { key: 'gas',    icon: Flame,    name: 'Gas',      desc: 'Monitoreo en tiempo real' },
]

export default function Login() {
  const router = useRouter()
  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [mensaje,     setMensaje]     = useState('')
  const [loading,     setLoading]     = useState(false)
  const [showPass,    setShowPass]    = useState(false)
  const [activeIdx,   setActiveIdx]   = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setActiveIdx(p => (p + 1) % 3), 3200)
    return () => clearInterval(iv)
  }, [])

  const handleLogin = async () => {
    if (!email || !password) { setMensaje('Por favor completa todos los campos.'); return }
    setLoading(true); setMensaje('')
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      if (!user)  throw new Error('No se pudo iniciar sesión')

      const { data: userData, error: fe } = await supabase
        .from('usuarios').select('*').eq('correo', email).maybeSingle()
      if (fe)        throw fe
      if (!userData) throw new Error('Usuario no encontrado en la base de datos')

      setMensaje('success')
      setTimeout(() => {
        router.push(
          userData.rol === 'tecnico' ? '/dashboards/tecnico' :
          userData.rol === 'admin'   ? '/dashboards/admi'    :
          '/dashboards/usuario'
        )
      }, 900)
    } catch (err) {
      setMensaje(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) { setMensaje('Ingresa tu correo primero para continuar.'); return }
    setLoading(true); setMensaje('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setMensaje('reset-sent')
    } catch (err) {
      setMensaje(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isOk     = mensaje === 'success' || mensaje === 'reset-sent'
  const alertMsg = mensaje === 'success'
    ? '¡Inicio de sesión exitoso! Redirigiendo…'
    : mensaje === 'reset-sent'
    ? 'Revisa tu bandeja de entrada para restablecer la contraseña.'
    : mensaje

  return (
    <div className="lg-root">
      <style>{css}</style>

      {/* ── PANEL IZQUIERDO ── */}
      <section className="lg-left">
        <div className="lg-logo">
          <div className="lg-logo-mark">
            <Gauge size={18} />
          </div>
          <span className="lg-logo-text">Servicios<span>Básicos</span></span>
        </div>

        <p className="lg-hero-eyebrow">Digitalización · Bolivia</p>
        <h1 className="lg-hero-title">
          <span className="nl">Controla tus</span>
          <span className="nl">servicios desde</span>
          <span className="acc nl">un solo lugar</span>
        </h1>
        <p className="lg-hero-desc">
          Plataforma inteligente para el monitoreo, lectura automatizada
          y gestión de pagos de servicios básicos.
        </p>

        <div className="lg-pills">
          {SERVICES.map(({ key, icon: Icon, name, desc }, i) => (
            <div key={key} className={`lg-pill ${key}${activeIdx === i ? ' active' : ''}`}>
              <div className="lg-pill-icon"><Icon size={17} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="lg-pill-name">{name}</div>
                <div className="lg-pill-desc">{desc}</div>
              </div>
              <div className="lg-pill-dot" />
            </div>
          ))}
        </div>

        <p className="lg-left-footer">
          Proyecto de grado · Estefani Torrico
        </p>
      </section>

      {/* ── PANEL DERECHO ── */}
      <section className="lg-right">
        <div className="lg-form-wrap">

          <div className="lg-status-badge">
            <span className="badge-dot" />
            Sistema activo
          </div>

          <h2 className="lg-form-title">Bienvenido de vuelta</h2>
          <p className="lg-form-sub">
            Ingresa tus credenciales para acceder<br />a tu panel de control.
          </p>

          <div className="lg-fields">
            {/* EMAIL */}
            <div className="lg-field">
              <label className="lg-field-label">Correo electrónico</label>
              <div className="lg-field-inner">
                <span className="lg-field-icon"><Mail size={16} /></span>
                <input
                  className="lg-input"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* CONTRASEÑA */}
            <div className="lg-field">
              <label className="lg-field-label">Contraseña</label>
              <div className="lg-field-inner">
                <span className="lg-field-icon"><Lock size={16} /></span>
                <input
                  className="lg-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  autoComplete="current-password"
                  style={{ paddingRight: 46 }}
                />
                <button className="lg-eye-btn" onClick={() => setShowPass(!showPass)} type="button">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          {/* FORGOT */}
          <div className="lg-forgot">
            <button className="lg-forgot-btn" onClick={handleForgotPassword}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* ALERT */}
          {mensaje && (
            <div className={`lg-alert ${isOk ? 'ok' : 'err'}`} style={{ marginBottom: 14 }}>
              {isOk
                ? <CheckCircle2 size={16} />
                : <AlertCircle  size={16} />}
              <span>{alertMsg}</span>
            </div>
          )}

          {/* BOTÓN PRINCIPAL */}
          <button className="lg-btn-primary" onClick={handleLogin} disabled={loading}>
            {loading
              ? <span className="lg-spin" />
              : <>
                  <span>Iniciar sesión</span>
                  <ArrowRight size={17} className="lg-btn-arrow" />
                </>}
          </button>

          <div className="lg-or">o</div>

          <div className="lg-register-row">
            <span className="lg-register-hint">¿Eres nuevo aquí?</span>
            <button className="lg-register-btn" onClick={() => router.push('/register')}>
              Crear cuenta →
            </button>
          </div>

          <div className="lg-back-row">
            <button className="lg-back-btn" onClick={() => router.push('/')}>
              ← Volver al inicio
            </button>
          </div>

          <div className="lg-form-footer">
            <strong>Sistema de Digitalización de Servicios Básicos</strong><br />
          · 2025–2026
          </div>

        </div>
      </section>
    </div>
  )
}