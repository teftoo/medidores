'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import {
  Droplets, Zap, Flame, User, Mail, Lock, Hash, Tag,
  AlertCircle, CheckCircle2, Eye, EyeOff,
  ArrowRight, Gauge, Building2, Home, Factory, Users
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════
   TOKENS — tipografía y paleta alineadas a Geolocalizacion.jsx
═══════════════════════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --white:     #ffffff;
    --off:       #f9f9f8;
    --canvas:    #f2f1ee;
    --border:    #ebebea;
    --border-md: #d4d4d0;
    --ink:       #111110;
    --ink-2:     #3a3a38;
    --ink-3:     #737370;
    --ink-4:     #b0b0ac;
    --teal:      #159BB3;
    --teal-dk:   #0D7182;
    --teal-bg:   #E8F8FB;
    --teal-bd:   #B8E4EB;
    --red:       #dc2626;
    --red-bg:    #fef2f2;
    --red-bd:    #fecaca;
    --green:     #16a34a;
    --green-bg:  #f0fdf4;
    --green-bd:  #bbf7d0;
    --amber:     #d97706;
    --amber-bg:  #fffbeb;
    --amber-bd:  #fde68a;
  }

  html, body { height: 100%; }

  .rg-root {
    font-family: 'Inter', system-ui, sans-serif;
    background: var(--canvas);
    height: 100vh;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
  }

  /* círculos decorativos de fondo */
  .rg-root::before {
    content: ''; position: fixed;
    width: 520px; height: 520px; border-radius: 50%;
    border: 1px solid var(--border);
    top: -160px; right: 28%; pointer-events: none; z-index: 0;
  }
  .rg-root::after {
    content: ''; position: fixed;
    width: 360px; height: 360px; border-radius: 50%;
    border: 1px solid var(--border);
    bottom: -80px; left: 22%; pointer-events: none; z-index: 0;
  }

  /* ══════════════════════════════
     PANEL IZQUIERDO
  ══════════════════════════════ */
  .rg-left {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; justify-content: center;
    padding: 40px 48px;
    background: var(--canvas);
    overflow: hidden;
  }

  .rg-logo {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 36px;
  }
  .rg-logo-mark {
    width: 34px; height: 34px; background: var(--ink);
    border-radius: 10px; display: flex; align-items: center;
    justify-content: center; color: var(--teal);
  }
  .rg-logo-text {
    font-family: 'Inter', sans-serif; font-weight: 800;
    font-size: 16px; color: var(--ink); letter-spacing: -.02em;
  }
  .rg-logo-text span { color: var(--teal); }

  .rg-eyebrow {
    font-size: 11px; font-weight: 600; letter-spacing: .14em;
    text-transform: uppercase; color: var(--teal-dk); margin-bottom: 12px;
  }
  .rg-hero-title {
    font-family: 'Inter', sans-serif; font-weight: 800;
    font-size: 34px; line-height: 1.08; letter-spacing: -.03em;
    color: var(--ink); margin-bottom: 14px;
  }
  .rg-hero-title .acc { color: var(--teal); display: block; }
  .rg-hero-desc {
    font-size: 13.5px; color: var(--ink-3); line-height: 1.6;
    max-width: 320px; margin-bottom: 28px;
  }

  /* steps */
  .rg-steps { display: flex; flex-direction: column; gap: 0; }
  .rg-step {
    display: flex; gap: 16px; padding: 12px 0;
    border-bottom: 1px solid var(--border);
    transition: all .2s;
  }
  .rg-step:last-child { border-bottom: none; }
  .rg-step-num {
    width: 26px; height: 26px; border-radius: 8px;
    background: var(--white); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Inter', sans-serif; font-size: 11.5px; font-weight: 800;
    color: var(--ink-3); flex-shrink: 0; margin-top: 2px;
    transition: all .2s;
  }
  .rg-step.done .rg-step-num {
    background: var(--teal-bg); border-color: var(--teal-bd); color: var(--teal-dk);
  }
  .rg-step-title {
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700;
    color: var(--ink-2); margin-bottom: 2px;
  }
  .rg-step.done .rg-step-title { color: var(--teal-dk); }
  .rg-step-desc { font-size: 12px; color: var(--ink-4); line-height: 1.45; }

  .rg-left-footer {
    margin-top: 24px; font-size: 11.5px; color: var(--ink-4); font-style: italic;
  }

  /* ══════════════════════════════
     PANEL DERECHO — Formulario
  ══════════════════════════════ */
  .rg-right {
    position: relative; z-index: 1;
    background: var(--white);
    border-left: 1px solid var(--border);
    height: 100vh;
    display: flex; align-items: center; justify-content: center;
    padding: 24px 56px;
    overflow: hidden;
  }

  .rg-form-wrap { width: 100%; max-width: 400px; }

  .rg-status-badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 5px 13px; border-radius: 99px;
    background: var(--teal-bg); border: 1px solid var(--teal-bd);
    font-size: 11px; font-weight: 600; color: var(--teal-dk);
    letter-spacing: .04em; text-transform: uppercase; margin-bottom: 14px;
  }
  .badge-dot {
    width: 5px; height: 5px; border-radius: 50%; background: var(--teal);
    animation: pulse-dot 2s infinite;
  }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }

  .rg-form-title {
    font-family: 'Inter', sans-serif; font-weight: 800;
    font-size: 25px; color: var(--ink); letter-spacing: -.03em;
    line-height: 1.12; margin-bottom: 4px;
  }
  .rg-form-sub {
    font-size: 13px; color: var(--ink-3); line-height: 1.5; margin-bottom: 18px;
  }

  /* SECCIONES del form */
  .rg-section { margin-bottom: 16px; }
  .rg-section-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 10px; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; color: var(--ink-4);
    margin-bottom: 10px;
  }
  .rg-section-label::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }
  .rg-section-label svg { color: var(--teal); flex-shrink: 0; }

  /* GRID */
  .rg-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .rg-grid-1 { display: flex; flex-direction: column; gap: 10px; }

  /* FIELD */
  .rg-field { display: flex; flex-direction: column; gap: 5px; }
  .rg-label {
    font-size: 11px; font-weight: 600; color: var(--ink-2);
    letter-spacing: .04em; text-transform: uppercase;
  }
  .rg-input-wrap { position: relative; }
  .rg-input-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: var(--ink-4); pointer-events: none; display: flex; align-items: center;
    transition: color .2s;
  }
  .rg-input-wrap:focus-within .rg-input-icon { color: var(--teal); }

  .rg-input {
    width: 100%; padding: 10px 14px 10px 42px;
    background: var(--off); border: 1.5px solid var(--border);
    border-radius: 12px; font-family: 'Inter', sans-serif;
    font-size: 13.5px; color: var(--ink); outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
    -webkit-appearance: none;
  }
  .rg-input::placeholder { color: var(--ink-4); }
  .rg-input:focus {
    background: var(--white); border-color: var(--teal);
    box-shadow: 0 0 0 4px rgba(21,155,179,.1);
  }
  .rg-input:hover:not(:focus) { border-color: var(--border-md); }

  .rg-select {
    width: 100%; padding: 10px 14px;
    background: var(--off); border: 1.5px solid var(--border);
    border-radius: 12px; font-family: 'Inter', sans-serif;
    font-size: 13.5px; color: var(--ink); outline: none; cursor: pointer;
    transition: border-color .2s, background .2s, box-shadow .2s;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23b0b0ac' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
  }
  .rg-select:focus {
    background-color: var(--white); border-color: var(--teal);
    box-shadow: 0 0 0 4px rgba(21,155,179,.1);
  }

  /* TIPO USUARIO — botones visuales */
  .rg-tipo-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
  }
  .rg-tipo-btn {
    padding: 9px 8px; border-radius: 12px;
    border: 1.5px solid var(--border); background: var(--off);
    cursor: pointer; display: flex; flex-direction: column;
    align-items: center; gap: 5px;
    font-family: 'Inter', sans-serif; transition: all .18s;
  }
  .rg-tipo-btn:hover { border-color: var(--border-md); background: var(--white); }
  .rg-tipo-btn.selected {
    background: var(--teal-bg); border-color: var(--teal-bd);
  }
  .rg-tipo-icon {
    width: 28px; height: 28px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    background: var(--white); color: var(--ink-3);
    border: 1px solid var(--border); transition: all .18s;
  }
  .rg-tipo-btn.selected .rg-tipo-icon {
    background: var(--teal); color: #fff; border-color: var(--teal);
  }
  .rg-tipo-name {
    font-size: 11.5px; font-weight: 600; color: var(--ink-3); transition: color .18s;
  }
  .rg-tipo-btn.selected .rg-tipo-name { color: var(--teal-dk); }

  .rg-eye-btn {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--ink-4); display: flex; align-items: center;
    padding: 2px; border-radius: 6px; transition: color .15s;
  }
  .rg-eye-btn:hover { color: var(--ink-2); }

  /* DESCUENTO PANEL */
  .rg-discount-box {
    padding: 12px 14px; border-radius: 12px;
    background: var(--off); border: 1.5px solid var(--border);
  }
  .rg-discount-box.active {
    background: var(--amber-bg); border-color: var(--amber-bd);
  }
  .rg-discount-title {
    font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 700;
    color: var(--ink-2); margin-bottom: 9px;
    display: flex; align-items: center; gap: 7px;
  }
  .rg-discount-title svg { color: var(--amber); }
  .rg-discount-row { display: flex; flex-direction: column; gap: 8px; }

  .rg-checkbox-wrap {
    display: flex; align-items: center; gap: 10px; cursor: pointer;
    padding: 9px 13px; border-radius: 10px;
    background: var(--white); border: 1.5px solid var(--border);
    transition: border-color .18s;
  }
  .rg-checkbox-wrap:hover { border-color: var(--border-md); }
  .rg-checkbox-wrap.checked {
    border-color: var(--teal-bd); background: var(--teal-bg);
  }
  .rg-checkbox {
    width: 16px; height: 16px; border-radius: 5px;
    border: 1.5px solid var(--border-md); background: var(--white);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all .15s;
  }
  .rg-checkbox-wrap.checked .rg-checkbox {
    background: var(--teal); border-color: var(--teal);
  }
  .rg-checkbox-label {
    font-size: 12.5px; color: var(--ink-3); line-height: 1.35;
    transition: color .15s;
  }
  .rg-checkbox-wrap.checked .rg-checkbox-label { color: var(--teal-dk); }

  .rg-eligible-banner {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 13px; border-radius: 10px;
    background: var(--green-bg); border: 1px solid var(--green-bd);
    font-size: 12.5px; color: var(--green); font-weight: 500;
    margin-top: 2px;
  }
  .rg-eligible-banner svg { flex-shrink: 0; }

  /* ALERT */
  .rg-alert {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 11px 14px; border-radius: 12px;
    font-size: 13px; line-height: 1.45; margin-bottom: 12px;
  }
  .rg-alert.err { background: var(--red-bg); border: 1px solid var(--red-bd); color: var(--red); }
  .rg-alert.ok  { background: var(--green-bg); border: 1px solid var(--green-bd); color: var(--green); }
  .rg-alert svg { flex-shrink: 0; margin-top: 1px; }

  /* BOTÓN PRINCIPAL */
  .rg-btn-primary {
    width: 100%; padding: 13px 22px;
    background: var(--ink); color: var(--white);
    border: 2px solid var(--ink); border-radius: 13px;
    cursor: pointer; font-family: 'Inter', sans-serif;
    font-weight: 700; font-size: 14px; letter-spacing: -.01em;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: all .22s; position: relative; overflow: hidden;
  }
  .rg-btn-primary::before {
    content: ''; position: absolute; inset: 0;
    background: var(--teal); transform: translateX(-101%);
    transition: transform .3s cubic-bezier(.22,.68,0,1.2); z-index: 0;
  }
  .rg-btn-primary:hover:not(:disabled)::before { transform: translateX(0); }
  .rg-btn-primary:hover:not(:disabled) { border-color: var(--teal); }
  .rg-btn-primary > * { position: relative; z-index: 1; }
  .rg-btn-primary:disabled { opacity: .45; cursor: not-allowed; }
  .rg-btn-arrow { transition: transform .2s; }
  .rg-btn-primary:hover:not(:disabled) .rg-btn-arrow { transform: translateX(4px); }

  .rg-spin {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    border-radius: 50%; animation: spin .65s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* FOOTER LINKS */
  .rg-footer-links {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 16px;
  }
  .rg-link {
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 12.5px;
    color: var(--ink-3); transition: color .15s; padding: 0;
  }
  .rg-link:hover { color: var(--teal-dk); }
  .rg-link.accent { color: var(--teal-dk); font-weight: 500; }
  .rg-link.accent:hover { color: var(--teal); }

  .rg-form-footer {
    margin-top: 18px; padding-top: 14px;
    border-top: 1px solid var(--border);
    font-size: 10.5px; color: var(--ink-4); line-height: 1.5;
  }
  .rg-form-footer strong { color: var(--ink-3); font-weight: 600; }

  @media (max-width: 900px) {
    .rg-root { grid-template-columns: 1fr; height: auto; overflow: auto; }
    .rg-left  { display: none; }
    .rg-right { border-left: none; padding: 32px 24px; height: auto; overflow: visible; }
    .rg-form-wrap { max-width: 100%; }
    .rg-grid-2 { grid-template-columns: 1fr; }
  }

  @media (max-height: 780px) {
    .rg-hero-title { font-size: 28px; }
    .rg-steps { display: none; }
    .rg-section { margin-bottom: 12px; }
  }
`

const TIPOS = [
  { value: 'domestico',  label: 'Doméstico',  icon: Home      },
  { value: 'comercial',  label: 'Comercial',  icon: Building2 },
  { value: 'industrial', label: 'Industrial', icon: Factory   },
  { value: 'social',     label: 'Social',     icon: Users     },
]

const STEPS = [
  { n: '1', title: 'Datos personales',   desc: 'Nombre, correo y contraseña' },
  { n: '2', title: 'Tipo de cuenta',     desc: 'Rol y categoría de consumo' },
  { n: '3', title: 'Beneficios',         desc: 'Descuentos por edad o discapacidad' },
]

export default function RegisterPage() {
  const router = useRouter()

  const [nombre,       setNombre]       = useState('')
  const [apellido,     setApellido]     = useState('')
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPass,     setShowPass]     = useState(false)
  const [numero,       setNumero]       = useState('')
  const [tipoUsuario,  setTipoUsuario]  = useState('domestico')
  const [rol,          setRol]          = useState('usuario')
  const [edad,         setEdad]         = useState('')
  const [discapacidad, setDiscapacidad] = useState(false)
  const [descuento,    setDescuento]    = useState('')
  const [mensaje,      setMensaje]      = useState('')
  const [loading,      setLoading]      = useState(false)

  const elegible = edad && (parseInt(edad) >= 60 || discapacidad)

  /* Qué steps están "done" (usados solo para marcar visualmente) */
  const stepDone = [
    nombre && apellido && email && password,
    tipoUsuario && rol,
    true, /* beneficios siempre pasa */
  ]

  const handleRegister = async () => {
    if (!nombre || !apellido || !email || !password) {
      setMensaje('Completa todos los campos obligatorios.')
      return
    }
    setLoading(true); setMensaje('')
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
      if (authError) throw authError
      if (!authData?.user) throw new Error('No se pudo crear el usuario en autenticación')

      const { error: insertError } = await supabase.from('usuarios').insert([{
        id:          authData.user.id,
        nombre:      `${nombre} ${apellido}`.trim(),
        correo:      email,
        rol,
        direccion:   'No registrada',
        foto:        '/default-avatar.jpg',
        tipo_usuario: tipoUsuario,
        descuento:   elegible ? Number(descuento || 0) : 0,
        id_foto:     null,
      }])
      if (insertError) throw insertError

      setMensaje('success')
      setTimeout(() => router.push('/login'), 1500)
    } catch (err) {
      setMensaje(err.message || 'Ocurrió un error al registrar el usuario')
    } finally {
      setLoading(false)
    }
  }

  const isOk = mensaje === 'success'

  return (
    <div className="rg-root">
      <style>{css}</style>

      {/* ── PANEL IZQUIERDO ── */}
      <section className="rg-left">
        <div className="rg-logo">
          <div className="rg-logo-mark"><Gauge size={18} /></div>
          <span className="rg-logo-text">Servicios<span>Básicos</span></span>
        </div>

        <p className="rg-eyebrow">Nueva cuenta · Bolivia</p>
        <h1 className="rg-hero-title">
          Únete al<br />sistema de<br />
          <span className="acc">gestión digital</span>
        </h1>
        <p className="rg-hero-desc">
          Registra tu cuenta para acceder al monitoreo de consumo,
          lectura con IA y pago de servicios básicos.
        </p>

        <div className="rg-steps">
          {STEPS.map((s, i) => (
            <div key={i} className={`rg-step${stepDone[i] ? ' done' : ''}`}>
              <div className="rg-step-num">{s.n}</div>
              <div>
                <div className="rg-step-title">{s.title}</div>
                <div className="rg-step-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="rg-left-footer">Proyecto de grado · Estefani Torrico</p>
      </section>

      {/* ── PANEL DERECHO ── */}
      <section className="rg-right">
        <div className="rg-form-wrap">

          <div className="rg-status-badge">
            <span className="badge-dot" />
            Registro abierto
          </div>

          <h2 className="rg-form-title">Crear cuenta</h2>
          <p className="rg-form-sub">
            Completa el formulario para comenzar a gestionar tus servicios básicos.
          </p>

          {/* ── SECCIÓN 1: DATOS PERSONALES ── */}
          <div className="rg-section">
            <div className="rg-section-label">
              <User size={12} />
              Datos personales
            </div>

            <div className="rg-grid-2" style={{ marginBottom: 10 }}>
              <div className="rg-field">
                <label className="rg-label">Nombre</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon"><User size={15} /></span>
                  <input
                    className="rg-input" type="text" placeholder="Ej. Ana"
                    value={nombre} onChange={e => setNombre(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRegister()}
                    autoComplete="given-name"
                  />
                </div>
              </div>
              <div className="rg-field">
                <label className="rg-label">Apellido</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon"><User size={15} /></span>
                  <input
                    className="rg-input" type="text" placeholder="Ej. Torres"
                    value={apellido} onChange={e => setApellido(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRegister()}
                    autoComplete="family-name"
                  />
                </div>
              </div>
            </div>

            <div className="rg-grid-1">
              <div className="rg-field">
                <label className="rg-label">Correo electrónico</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon"><Mail size={15} /></span>
                  <input
                    className="rg-input" type="email" placeholder="tu@correo.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRegister()}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="rg-field">
                <label className="rg-label">Contraseña</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon"><Lock size={15} /></span>
                  <input
                    className="rg-input" type={showPass ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    value={password} onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRegister()}
                    autoComplete="new-password"
                    style={{ paddingRight: 44 }}
                  />
                  <button className="rg-eye-btn" type="button" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECCIÓN 2: TIPO DE CUENTA ── */}
          <div className="rg-section">
            <div className="rg-section-label">
              <Tag size={12} />
              Tipo de cuenta
            </div>

            <div className="rg-grid-2" style={{ marginBottom: 10 }}>
              <div className="rg-field">
                <label className="rg-label">Rol</label>
                <select
                  className="rg-select" value={rol}
                  onChange={e => setRol(e.target.value)}
                >
                  <option value="usuario">Usuario / Residente</option>
                  <option value="admin">Administrador</option>
                  <option value="tecnico">Técnico</option>
                </select>
              </div>

              {rol === 'usuario' && (
                <div className="rg-field">
                  <label className="rg-label">N° de medidor</label>
                  <div className="rg-input-wrap">
                    <span className="rg-input-icon"><Hash size={15} /></span>
                    <input
                      className="rg-input" type="text" placeholder="Ej. 00123456"
                      value={numero} onChange={e => setNumero(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="rg-field">
              <label className="rg-label" style={{ marginBottom: 8 }}>Categoría de consumo</label>
              <div className="rg-tipo-grid">
                {TIPOS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value} type="button"
                    className={`rg-tipo-btn${tipoUsuario === value ? ' selected' : ''}`}
                    onClick={() => setTipoUsuario(value)}
                  >
                    <div className="rg-tipo-icon"><Icon size={16} /></div>
                    <span className="rg-tipo-name">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── SECCIÓN 3: BENEFICIOS ── */}
          <div className="rg-section">
            <div className="rg-section-label">
              <Tag size={12} />
              Beneficios y descuentos
            </div>

            <div className="rg-discount-box" style={{ marginBottom: 0 }}>
              <div className="rg-discount-title">
                <Tag size={14} />
                ¿Calificas para descuento?
              </div>
              <div className="rg-discount-row">
                <div className="rg-field">
                  <label className="rg-label">Edad (opcional)</label>
                  <div className="rg-input-wrap">
                    <span className="rg-input-icon"><User size={15} /></span>
                    <input
                      className="rg-input" type="number"
                      placeholder="Ej. 65 — aplica para +60 años"
                      value={edad} onChange={e => setEdad(e.target.value)}
                    />
                  </div>
                </div>

                <div
                  className={`rg-checkbox-wrap${discapacidad ? ' checked' : ''}`}
                  onClick={() => setDiscapacidad(!discapacidad)}
                >
                  <div className="rg-checkbox">
                    {discapacidad && <CheckCircle2 size={11} color="#fff" strokeWidth={3} />}
                  </div>
                  <span className="rg-checkbox-label">Tengo certificado de discapacidad</span>
                </div>

                {elegible && (
                  <>
                    <div className="rg-eligible-banner">
                      <CheckCircle2 size={15} />
                      ¡Calificas para descuento! Ingresa el porcentaje.
                    </div>
                    <div className="rg-field">
                      <label className="rg-label">Porcentaje de descuento</label>
                      <div className="rg-input-wrap">
                        <span className="rg-input-icon"><Tag size={15} /></span>
                        <input
                          className="rg-input" type="number" min="0" max="100"
                          placeholder="Ej. 15"
                          value={descuento} onChange={e => setDescuento(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ALERT */}
          {mensaje && (
            <div className={`rg-alert ${isOk ? 'ok' : 'err'}`}>
              {isOk
                ? <CheckCircle2 size={16} />
                : <AlertCircle  size={16} />}
              <span>{isOk ? '¡Registro exitoso! Redirigiendo al inicio de sesión…' : mensaje}</span>
            </div>
          )}

          {/* BOTÓN */}
          <button className="rg-btn-primary" onClick={handleRegister} disabled={loading}>
            {loading
              ? <span className="rg-spin" />
              : <><span>Crear cuenta</span><ArrowRight size={17} className="rg-btn-arrow" /></>}
          </button>

          <div className="rg-footer-links">
            <button className="rg-link accent" onClick={() => router.push('/login')}>
              ¿Ya tienes cuenta? Iniciar sesión
            </button>
            <button className="rg-link" onClick={() => router.push('/')}>
              ← Inicio
            </button>
          </div>

          <div className="rg-form-footer">
            <strong>Sistema de Digitalización de Servicios Básicos</strong><br />
           2025–2026
          </div>

        </div>
      </section>
    </div>
  )
}