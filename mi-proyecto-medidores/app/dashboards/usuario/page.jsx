'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Droplets, Zap, Flame, LogOut, ChevronRight, ChevronLeft, Gauge } from 'lucide-react'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --agua:    #22d3a5;
    --agua-dk: #0f7a5e;
    --luz:     #fbbf24;
    --luz-dk:  #92400e;
    --gas:     #fb7c3c;
    --gas-dk:  #7c2d12;
    --white:   #ffffff;
    --ink:     #0d0d0c;
  }

  html, body { font-family: 'Outfit', system-ui, sans-serif; }

  /* ═══ VIDEO FONDO ═══ */
  .vbg {
    position: fixed; inset: 0; z-index: 0;
  }
  .vbg video {
    width: 100%; height: 100%; object-fit: cover;
  }
  .vbg::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(
      160deg,
      rgba(5,5,8,.55) 0%,
      rgba(5,5,8,.38) 45%,
      rgba(5,5,8,.62) 100%
    );
  }

  /* ═══ ROOT ═══ */
  .ud-root {
    position: relative; z-index: 1;
    min-height: 100vh;
    display: flex; flex-direction: column;
  }

  /* ═══ NAVBAR ═══ */
  .ud-nav {
    position: sticky; top: 0; z-index: 50;
    background: rgba(0,0,0,.30);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,.10);
    padding: 0 52px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-brand { display: flex; align-items: center; gap: 11px; }
  .nav-icon {
    width: 38px; height: 38px; border-radius: 11px;
    background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18);
    display: flex; align-items: center; justify-content: center;
    color: var(--luz);
  }
  .nav-name {
    font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 19px;
    color: #fff; letter-spacing: -.02em;
  }
  .nav-name span { color: var(--agua); }

  .nav-right { display: flex; align-items: center; gap: 16px; }
  .nav-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: rgba(255,255,255,.15);
    border: 2px solid rgba(255,255,255,.25);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 15px; color: #fff;
    overflow: hidden; flex-shrink: 0;
  }
  .nav-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .nav-info { line-height: 1.25; }
  .nav-info-name { font-size: 14px; font-weight: 600; color: #fff; }
  .nav-info-type { font-size: 11.5px; color: rgba(255,255,255,.45); text-transform: capitalize; }
  .nav-logout {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,.18);
    background: rgba(255,255,255,.08);
    font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 500;
    color: rgba(255,255,255,.7); cursor: pointer; transition: all .15s;
  }
  .nav-logout:hover { background: rgba(255,80,80,.15); border-color: rgba(255,80,80,.3); color: #ff8080; }

  /* ═══ HERO ═══ */
  .ud-hero {
    padding: 80px 52px 52px;
    max-width: 1080px; margin: 0 auto; width: 100%;
  }
  .hero-greeting {
    font-size: 13px; font-weight: 500; color: rgba(255,255,255,.50);
    letter-spacing: .08em; text-transform: uppercase; margin-bottom: 12px;
  }
  .hero-h {
    font-family: 'Outfit', sans-serif; font-weight: 900;
    font-size: clamp(52px, 7.5vw, 84px);
    color: #fff; line-height: .92; letter-spacing: -.05em;
    margin-bottom: 22px;
  }
  .hero-h .acc { color: var(--agua); }
  .hero-sub {
    font-size: 17px; font-weight: 400;
    color: rgba(255,255,255,.60);
    max-width: 400px; line-height: 1.65;
    margin-bottom: 48px;
  }

  .hero-stats {
    display: flex; gap: 0;
    background: rgba(255,255,255,.07);
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 18px; overflow: hidden;
    backdrop-filter: blur(12px);
    width: fit-content;
  }
  .hstat { padding: 18px 40px; position: relative; }
  .hstat + .hstat { border-left: 1px solid rgba(255,255,255,.10); }
  .hstat-v {
    font-family: 'Outfit', sans-serif; font-weight: 900;
    font-size: 30px; color: #fff; letter-spacing: -.04em;
  }
  .hstat-l { font-size: 12px; color: rgba(255,255,255,.40); margin-top: 3px; font-weight: 400; }

  /* ═══ SECCIÓN ═══ */
  .ud-section {
    max-width: 1080px; margin: 0 auto; width: 100%;
    padding: 0 52px 80px;
  }
  .section-eyebrow {
    font-size: 11px; font-weight: 700; letter-spacing: .15em;
    text-transform: uppercase; color: rgba(255,255,255,.30);
    margin-bottom: 24px;
    display: flex; align-items: center; gap: 14px;
  }
  .section-eyebrow::after {
    content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.08);
  }

  /* ═══ GRID ═══ */
  .cards-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }

  /* ═══ CARD ═══ */
  .svc-card {
    border-radius: 26px; overflow: hidden; cursor: pointer;
    border: 1px solid rgba(255,255,255,.12);
    background: rgba(8,8,10,.60);
    backdrop-filter: blur(24px);
    transition: transform .25s cubic-bezier(.22,.68,0,1.2), box-shadow .25s, border-color .2s;
    position: relative;
  }
  .svc-card:hover { transform: translateY(-8px) scale(1.015); }
  .svc-card.selected { transform: scale(.96); opacity: .5; pointer-events: none; }

  .card-top-bar { height: 4px; width: 100%; }

  .card-head {
    padding: 26px 26px 14px;
    display: flex; align-items: flex-start; justify-content: space-between;
  }
  .card-icon {
    width: 56px; height: 56px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    transition: transform .22s;
  }
  .svc-card:hover .card-icon { transform: rotate(-10deg) scale(1.1); }

  .card-status {
    font-size: 11.5px; font-weight: 600; padding: 5px 12px;
    border-radius: 99px; border: 1px solid;
    display: flex; align-items: center; gap: 5px;
  }
  .status-dot { width: 5px; height: 5px; border-radius: 50%; animation: pulse-dot 2s infinite; }
  @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.3} }

  .card-body { padding: 0 26px 26px; }

  /* Nombre — blanco, enorme, legible */
  .card-name {
    font-family: 'Outfit', sans-serif; font-weight: 900;
    font-size: 44px; color: #fff; letter-spacing: -.04em; line-height: .9;
    margin-bottom: 6px;
  }
  /* Tagline — en color del servicio, explica qué es */
  .card-tagline {
    font-size: 14px; font-weight: 600; margin-bottom: 16px;
    letter-spacing: -.01em;
  }
  /* Descripción — blanca semitransparente, cuerpo de texto */
  .card-desc {
    font-size: 14px; color: rgba(255,255,255,.52);
    line-height: 1.65; margin-bottom: 26px; font-weight: 400;
  }

  .card-cta {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    padding: 15px 20px; border-radius: 14px; border: none;
    font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: all .18s; letter-spacing: -.01em;
  }

  /* ── Agua ── */
  .card-agua .card-top-bar { background: var(--agua); }
  .card-agua .card-icon { background: rgba(34,211,165,.14); color: var(--agua); }
  .card-agua .card-status { color: var(--agua); border-color: rgba(34,211,165,.28); background: rgba(34,211,165,.08); }
  .card-agua .status-dot { background: var(--agua); }
  .card-agua .card-tagline { color: var(--agua); }
  .card-agua .card-cta { background: var(--agua); color: #060f0d; }
  .card-agua .card-cta:hover { background: #1dc997; }
  .card-agua:hover { box-shadow: 0 24px 64px rgba(34,211,165,.22); border-color: rgba(34,211,165,.28); }

  /* ── Luz ── */
  .card-luz .card-top-bar { background: var(--luz); }
  .card-luz .card-icon { background: rgba(251,191,36,.14); color: var(--luz); }
  .card-luz .card-status { color: var(--luz); border-color: rgba(251,191,36,.28); background: rgba(251,191,36,.08); }
  .card-luz .status-dot { background: var(--luz); }
  .card-luz .card-tagline { color: var(--luz); }
  .card-luz .card-cta { background: var(--luz); color: #0f0900; }
  .card-luz .card-cta:hover { background: #f0b218; }
  .card-luz:hover { box-shadow: 0 24px 64px rgba(251,191,36,.20); border-color: rgba(251,191,36,.28); }

  /* ── Gas ── */
  .card-gas .card-top-bar { background: var(--gas); }
  .card-gas .card-icon { background: rgba(251,124,60,.14); color: var(--gas); }
  .card-gas .card-status { color: var(--gas); border-color: rgba(251,124,60,.28); background: rgba(251,124,60,.08); }
  .card-gas .status-dot { background: var(--gas); }
  .card-gas .card-tagline { color: var(--gas); }
  .card-gas .card-cta { background: var(--gas); color: #fff; }
  .card-gas .card-cta:hover { background: #f06820; }
  .card-gas:hover { box-shadow: 0 24px 64px rgba(251,124,60,.22); border-color: rgba(251,124,60,.28); }

  /* ═══ CARRUSEL MOBILE ═══ */
  .cards-carousel { display: none; }
  .carousel-viewport { overflow: hidden; }
  .carousel-track {
    display: flex; gap: 16px;
    transition: transform .38s cubic-bezier(.22,.68,0,1.2);
    will-change: transform;
  }
  .carousel-track .svc-card { min-width: 88vw; flex-shrink: 0; }
  .carousel-nav {
    display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 22px;
  }
  .cnav-btn {
    width: 40px; height: 40px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.08);
    backdrop-filter: blur(10px);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: rgba(255,255,255,.6); transition: all .15s;
  }
  .cnav-btn:hover { background: rgba(255,255,255,.18); color: #fff; }
  .cdots { display: flex; gap: 7px; }
  .cdot { height: 6px; border-radius: 99px; background: rgba(255,255,255,.22); transition: all .25s; cursor: pointer; width: 6px; }
  .cdot.on { width: 22px; background: #fff; }

  /* ═══ TIP ═══ */
  .ud-tip { max-width: 1080px; margin: 0 auto; padding: 0 52px 56px; text-align: center; }
  .tip-pill {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
    backdrop-filter: blur(12px); border-radius: 14px;
    padding: 14px 24px; font-size: 13.5px; color: rgba(255,255,255,.55); font-weight: 400;
  }
  .tip-pill strong { color: #fff; font-weight: 600; }

  .ud-footer { font-size: 12px; color: rgba(255,255,255,.18); text-align: center; padding-bottom: 52px; }

  /* ═══ LOADER ═══ */
  .ud-loader { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #060608; }
  .loader-ring {
    width: 46px; height: 46px; border-radius: 50%;
    border: 2.5px solid rgba(255,255,255,.1); border-top-color: var(--agua);
    animation: spin .65s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ═══ RESPONSIVE ═══ */
  @media (max-width: 860px) {
    .ud-nav { padding: 0 20px; }
    .nav-info { display: none; }
    .ud-hero { padding: 48px 20px 32px; }
    .hero-stats { flex-direction: column; width: 100%; }
    .hstat + .hstat { border-left: none; border-top: 1px solid rgba(255,255,255,.10); }
    .hstat { padding: 14px 24px; }
    .ud-section { padding: 0 0 60px; }
    .cards-grid { display: none; }
    .cards-carousel { display: block; padding: 0 20px; }
    .ud-tip { padding: 0 20px 44px; }
  }
`

export default function UsuarioDashboard() {
  const router = useRouter()
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState(null)
  const [carouselIdx, setCarouselIdx] = useState(0)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) { router.push('/login'); return }
        const { data: userData } = await supabase
          .from('usuarios').select('*').eq('correo', session.user.email).maybeSingle()
        setUsuario({
          nombre: userData?.nombre || session.user.email,
          correo: userData?.correo || session.user.email,
          foto: userData?.foto || null,
          tipo_usuario: userData?.tipo_usuario || 'domestico',
        })
      } catch (err) {
        console.error(err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleSelect = (path) => {
    setSelectedService(path)
    setTimeout(() => router.push(path), 500)
  }

  const services = [
    {
      id: 'agua', icon: Droplets, cls: 'card-agua',
      label: 'Agua',
      tagline: 'Consumo de agua potable',
      description: 'Registra tu medidor, revisa tu historial mensual y consulta el monto de tu factura en segundos.',
      path: '/dashboards/usuario/usuario-agua',
    },
    {
      id: 'luz', icon: Zap, cls: 'card-luz',
      label: 'Luz',
      tagline: 'Consumo de electricidad',
      description: 'Controla cuántos kWh usas, revisa el costo por tramo y mantén tu factura eléctrica bajo control.',
      path: '/dashboards/usuario/usuario-luz',
    },
    {
      id: 'gas', icon: Flame, cls: 'card-gas',
      label: 'Gas',
      tagline: 'Consumo de gas domiciliario',
      description: 'Monitorea tu consumo de gas, detecta variaciones inusuales y mantén tu hogar seguro.',
      path: '/dashboards/usuario/usuario-gas',
    },
  ]

  if (loading) return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      <style>{css}</style>
      <div className="ud-loader"><div className="loader-ring" /></div>
    </div>
  )

  const ServiceCard = ({ svc }) => {
    const Icon = svc.icon
    const isSelected = selectedService === svc.path
    return (
      <div
        className={`svc-card ${svc.cls} ${isSelected ? 'selected' : ''}`}
        onClick={() => handleSelect(svc.path)}
      >
        <div className="card-top-bar" />
        <div className="card-head">
          <div className="card-icon">
            <Icon size={26} strokeWidth={1.7} />
          </div>
          <div className="card-status">
            <span className="status-dot" />
            Activo
          </div>
        </div>
        <div className="card-body">
          <div className="card-name">{svc.label}</div>
          <div className="card-tagline">{svc.tagline}</div>
          <p className="card-desc">{svc.description}</p>
          <button className="card-cta">
            <span>{isSelected ? 'Abriendo…' : `Ir a ${svc.label}`}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      <style>{css}</style>

      {/* VIDEO */}
      <div className="vbg">
        <video autoPlay muted loop playsInline>
          <source src="/videos/fondo.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="ud-root">

        {/* NAV */}
        <nav className="ud-nav">
          <div className="nav-brand">
            <div className="nav-icon"><Gauge size={18} /></div>
            <span className="nav-name">Servicios<span>.</span></span>
          </div>
          <div className="nav-right">
            <div className="nav-avatar">
              {usuario?.foto
                ? <img src={usuario.foto} alt="perfil" />
                : usuario?.nombre?.charAt(0)?.toUpperCase()}
            </div>
            <div className="nav-info">
              <div className="nav-info-name">{usuario?.nombre}</div>
              <div className="nav-info-type">{usuario?.tipo_usuario}</div>
            </div>
            <button className="nav-logout" onClick={handleLogout}>
              <LogOut size={14} /> Salir
            </button>
          </div>
        </nav>

        {/* HERO */}
        <div className="ud-hero">
          <p className="hero-greeting">
            Panel personal · {new Date().toLocaleString('es-BO', { month: 'long', year: 'numeric' })}
          </p>
          <h1 className="hero-h">
            Hola,<br />
            <span className="acc">{usuario?.nombre?.split(' ')[0]}</span>
          </h1>
          <p className="hero-sub">
            Selecciona un servicio para ver tu consumo, pagar tu factura o registrar tu medidor.
          </p>
          <div className="hero-stats">
            {[
              { v: '3',    l: 'Servicios activos' },
              { v: '24/7', l: 'Lecturas con IA' },
              { v: '18%',  l: 'Ahorro promedio' },
            ].map((s, i) => (
              <div key={i} className="hstat">
                <div className="hstat-v">{s.v}</div>
                <div className="hstat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CARDS DESKTOP */}
        <div className="ud-section">
          <div className="section-eyebrow">Elige un servicio</div>
          <div className="cards-grid">
            {services.map(svc => <ServiceCard key={svc.id} svc={svc} />)}
          </div>
        </div>

        {/* CARRUSEL MOBILE */}
        <div className="cards-carousel">
          <div className="section-eyebrow" style={{ padding: '0 0 20px' }}>
            Elige un servicio
          </div>
          <div className="carousel-viewport">
            <div
              className="carousel-track"
              style={{ transform: `translateX(calc(-${carouselIdx * 88}vw - ${carouselIdx * 16}px))` }}
            >
              {services.map(svc => <ServiceCard key={svc.id} svc={svc} />)}
            </div>
          </div>
          <div className="carousel-nav">
            <button className="cnav-btn" onClick={() => setCarouselIdx(i => Math.max(0, i - 1))}>
              <ChevronLeft size={16} />
            </button>
            <div className="cdots">
              {services.map((_, i) => (
                <div key={i} className={`cdot${carouselIdx === i ? ' on' : ''}`} onClick={() => setCarouselIdx(i)} />
              ))}
            </div>
            <button className="cnav-btn" onClick={() => setCarouselIdx(i => Math.min(services.length - 1, i + 1))}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* TIP */}
        <div className="ud-tip">
          <div className="tip-pill">
            💡 <strong>Tip:</strong> Registra tu lectura cada mes para mantener tu factura al día y evitar cargos inesperados.
          </div>
        </div>

        <p className="ud-footer">
          Desarrollado por Estefani Torrico · Sistema de Digitalización de Servicios Básicos
        </p>

      </div>
    </div>
  )
}