'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function LandingPage() {
  const router = useRouter()
  const [carouselIdx, setCarouselIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIdx(i => (i + 1) % 3)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;900&family=Playfair+Display:ital,wght@0,700;1,400;1,700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --acc: #1a56db;
      --acc-lt: #eff4ff;
      --agua: #0ea5e9;
      --luz: #f59e0b;
      --gas: #f97316;
      --ink: #111111;
      --muted: #888;
      --border: #e8e8e4;
      --cream: #f8f8f6;
      --white: #ffffff;
    }

    html, body { font-family: 'Outfit', system-ui, sans-serif; background: #f8f8f6; }

    /* ═══ NAV ═══ */
    .lp-nav {
      background: #fff;
      border-bottom: 1px solid var(--border);
      padding: 0 44px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-logo { display: flex; align-items: center; gap: 10px; }
    .nav-icon {
      width: 34px; height: 34px;
      background: var(--ink);
      border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
    }
    .nav-name { font-weight: 800; font-size: 16px; color: var(--ink); }
    .nav-name span { color: var(--acc); }
    .nav-pill {
      display: flex; align-items: center; gap: 7px;
      background: #eff6ff; border: 1px solid #bfdbfe;
      border-radius: 99px; padding: 5px 14px;
      font-size: 11px; font-weight: 700; color: #1d4ed8;
    }
    .nav-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--acc);
      animation: blink 1.5s infinite;
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
    .nav-btn {
      background: var(--ink); color: #fff; border: none;
      padding: 9px 22px; border-radius: 99px;
      font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 13px;
      cursor: pointer; transition: .2s;
    }
    .nav-btn:hover { background: #2a2a2a; }

    /* ═══ HERO ═══ */
    .lp-hero { display: grid; grid-template-columns: 1fr 1fr; height: 86vh; min-height: 500px; }
    .hero-left {
      background: var(--white); padding: 44px 48px;
      display: flex; flex-direction: column; justify-content: center;
    }
    .hero-tag {
      font-size: 10px; font-weight: 700; letter-spacing: .2em;
      text-transform: uppercase; color: var(--acc);
      margin-bottom: 18px; display: flex; align-items: center; gap: 8px;
    }
    .hero-tag::before { content: '✦'; font-size: 8px; }
    .hero-h {
      font-family: 'Playfair Display', serif; font-weight: 700;
      font-size: clamp(38px, 5vw, 62px); line-height: .9;
      letter-spacing: -.02em; color: var(--ink); margin-bottom: 18px;
    }
    .hero-h em { font-style: italic; font-weight: 400; color: var(--acc); }
    .hero-p {
      font-size: 14px; color: var(--muted); line-height: 1.7;
      max-width: 360px; margin-bottom: 28px; font-weight: 300;
    }
    .hero-ctas { display: flex; gap: 12px; margin-bottom: 28px; }
    .btn-dk {
      background: var(--ink); color: #fff; border: none;
      padding: 13px 30px; border-radius: 99px;
      font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 13px;
      cursor: pointer; transition: .2s;
    }
    .btn-dk:hover { background: #2a2a2a; transform: translateY(-2px); }
    .btn-ol {
      background: transparent; color: var(--ink); border: 1.5px solid #ccc;
      padding: 13px 24px; border-radius: 99px;
      font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 13px;
      cursor: pointer; transition: .2s;
    }
    .btn-ol:hover { border-color: var(--ink); }
    .hero-badges { display: flex; gap: 8px; flex-wrap: wrap; }
    .hb {
      display: flex; align-items: center; gap: 7px;
      background: #fff; border: 1px solid var(--border);
      border-radius: 99px; padding: 7px 14px;
      font-size: 12px; font-weight: 600; color: #444;
      box-shadow: 0 1px 4px rgba(0,0,0,.04);
    }
    .hb-agua { border-color: #bae6fd; color: var(--agua); }
    .hb-luz  { border-color: #fde68a; color: #b45309; }
    .hb-gas  { border-color: #fed7aa; color: var(--gas); }
    .hero-stats { margin-top: 26px; padding-top: 22px; border-top: 1px solid var(--border); display: flex; gap: 28px; }
    .hstat-v { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: var(--ink); line-height: 1; }
    .hstat-l { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #bbb; margin-top: 2px; }

    /* ═══ HERO VIDEO ═══ */
    .hero-right { position: relative; overflow: hidden; background: #0a0f1e; }
    .hv-scene { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative; }
    .hv-grad { position: absolute; inset: 0; background: radial-gradient(ellipse 70% 60% at 60% 50%, rgba(26,86,219,.18) 0%, transparent 70%); }
    .hv-grid {
      position: absolute; inset: 0; opacity: .04;
      background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px);
      background-size: 40px 40px;
    }
    .hv-center { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 10px; }
    .hv-play {
      width: 62px; height: 62px; border-radius: 50%;
      background: var(--acc); border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: .2s; box-shadow: 0 0 0 14px rgba(26,86,219,.1);
    }
    .hv-play:hover { transform: scale(1.08); box-shadow: 0 0 0 18px rgba(26,86,219,.08); }
    .hv-lbl { font-size: 11px; font-weight: 600; color: rgba(255,255,255,.35); letter-spacing: .1em; text-transform: uppercase; }
    .hv-badge {
      position: absolute; bottom: 22px; left: 20px; right: 20px;
      background: rgba(255,255,255,.07); backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,.12); border-radius: 14px;
      padding: 14px 16px; display: flex; align-items: center; gap: 12px; z-index: 2;
    }
    .hv-badge-icon { font-size: 24px; }
    .hv-badge-title { font-size: 13px; font-weight: 700; color: #fff; line-height: 1; }
    .hv-badge-sub { font-size: 11px; color: rgba(255,255,255,.38); margin-top: 3px; }
    .hv-badge-tag {
      margin-left: auto; background: rgba(26,86,219,.3);
      border: 1px solid rgba(26,86,219,.4); border-radius: 99px;
      padding: 4px 10px; font-size: 10px; font-weight: 700; color: #93c5fd;
    }

    /* ═══ TICKER ═══ */
    .lp-ticker { background: var(--ink); overflow: hidden; padding: 13px 0; }
    .ticker-inner { display: inline-flex; animation: ticker 22s linear infinite; }
    @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .ti { display: inline-flex; align-items: center; gap: 10px; padding: 0 20px; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.25); }
    .ti-agua { color: rgba(14,165,233,.6); }
    .ti-luz  { color: rgba(245,158,11,.6); }
    .ti-gas  { color: rgba(249,115,22,.6); }
    .ti-sep  { color: rgba(255,255,255,.15); font-size: 7px; }

    /* ═══ SPLIT ═══ */
    .lp-split { display: grid; grid-template-columns: 1fr 1fr; min-height: 340px; }
    .split-img { position: relative; overflow: hidden; min-height: 320px; display: flex; align-items: center; justify-content: center; }
    .split-img-agua { background: linear-gradient(150deg, #082f49, #0c4a6e); }
    .split-img-luz  { background: linear-gradient(150deg, #1c1000, #3d2200); }
    .split-img-gas  { background: linear-gradient(150deg, #1c0800, #431407); }
    .split-big-icon { font-size: 100px; opacity: .15; position: absolute; }
    .split-overlay  { position: absolute; inset: 0; }
    .split-img-agua .split-overlay { background: linear-gradient(135deg, rgba(14,165,233,.1), transparent); }
    .split-img-luz  .split-overlay { background: linear-gradient(135deg, rgba(245,158,11,.1), transparent); }
    .split-img-gas  .split-overlay { background: linear-gradient(135deg, rgba(249,115,22,.1), transparent); }
    .split-vbadge {
      position: absolute; bottom: 18px; left: 18px;
      background: rgba(0,0,0,.4); backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,.1); border-radius: 12px;
      padding: 9px 13px; display: flex; align-items: center; gap: 9px;
      cursor: pointer; z-index: 2;
    }
    .svp {
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .svp-agua { background: var(--agua); }
    .svp-luz  { background: var(--luz); }
    .svp-gas  { background: var(--gas); }
    .svp-title { font-size: 11px; font-weight: 600; color: rgba(255,255,255,.7); line-height: 1; }
    .svp-sub   { font-size: 9px; color: rgba(255,255,255,.3); margin-top: 1px; }
    .split-info { padding: 44px 48px; display: flex; flex-direction: column; justify-content: center; background: var(--white); }
    .split-info-cream { background: var(--cream); }
    .split-tag { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 14px; }
    .split-tag-agua { color: var(--agua); }
    .split-tag-luz  { color: #b45309; }
    .split-tag-gas  { color: var(--gas); }
    .split-h {
      font-family: 'Playfair Display', serif; font-weight: 700;
      font-size: clamp(26px, 2.8vw, 38px); line-height: .95;
      color: var(--ink); margin-bottom: 12px;
    }
    .split-h em { font-style: italic; font-weight: 400; }
    .split-p { font-size: 13px; color: #999; line-height: 1.7; margin-bottom: 22px; max-width: 320px; }
    .split-btn {
      display: inline-flex; align-items: center; gap: 7px; border: none;
      padding: 11px 24px; border-radius: 99px;
      font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 13px;
      cursor: pointer; transition: .2s;
    }
    .split-btn:hover { transform: translateY(-2px); }
    .split-btn-agua { background: var(--agua); color: #fff; }
    .split-btn-luz  { background: var(--luz);  color: #fff; }
    .split-btn-gas  { background: var(--gas);  color: #fff; }
    .split-divider { width: 32px; height: 2px; background: var(--border); margin-top: 22px; }

    /* ═══ VIDEO REAL (reemplaza el fondo oscuro) ═══ */
    .split-img video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }

    /* ═══ ROLES ═══ */
    .lp-roles { background: var(--white); padding: 48px 44px; border-top: 1px solid var(--border); }
    .roles-eye { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: var(--acc); margin-bottom: 10px; }
    .roles-h { font-family: 'Playfair Display', serif; font-weight: 700; font-size: clamp(24px, 2.8vw, 34px); color: var(--ink); margin-bottom: 6px; }
    .roles-h em { font-style: italic; color: var(--acc); font-weight: 400; }
    .roles-sub { font-size: 13px; color: #aaa; margin-bottom: 28px; max-width: 360px; line-height: 1.6; }
    .roles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .rc {
      background: var(--cream); border: 1px solid var(--border);
      border-radius: 18px; padding: 24px; cursor: pointer; transition: .25s;
      position: relative; overflow: hidden;
    }
    .rc::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
    .rc-u::before { background: var(--agua); }
    .rc-a::before { background: var(--acc); }
    .rc-t::before { background: var(--luz); }
    .rc:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(0,0,0,.08); border-color: #d4d0c8; }
    .rc-icon { font-size: 28px; margin-bottom: 14px; }
    .rc h3 { font-weight: 800; font-size: 17px; color: var(--ink); margin-bottom: 3px; }
    .rc-sub { font-size: 10px; font-weight: 700; letter-spacing: .07em; margin-bottom: 10px; }
    .rc-u .rc-sub { color: var(--agua); }
    .rc-a .rc-sub { color: var(--acc); }
    .rc-t .rc-sub { color: #b45309; }
    .rc p { font-size: 12px; color: #aaa; line-height: 1.6; margin-bottom: 16px; }
    .rc-btn { width: 100%; padding: 10px; border-radius: 9px; border: none; font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; transition: .18s; }
    .rc-u .rc-btn { background: #e0f2fe; color: #0369a1; }
    .rc-u:hover .rc-btn { background: var(--agua); color: #fff; }
    .rc-a .rc-btn { background: var(--acc-lt); color: var(--acc); }
    .rc-a:hover .rc-btn { background: var(--acc); color: #fff; }
    .rc-t .rc-btn { background: #fef3c7; color: #92400e; }
    .rc-t:hover .rc-btn { background: var(--luz); color: #fff; }

    /* ═══ CARRUSEL ═══ */
    .lp-carousel { background: var(--cream); padding: 48px 44px 52px; border-top: 1px solid var(--border); }
    .caro-eye { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: var(--acc); margin-bottom: 10px; }
    .caro-h { font-family: 'Playfair Display', serif; font-weight: 700; font-size: clamp(24px, 2.8vw, 34px); color: var(--ink); margin-bottom: 6px; }
    .caro-h em { font-style: italic; color: var(--acc); font-weight: 400; }
    .caro-sub { font-size: 13px; color: #aaa; margin-bottom: 24px; }
    .caro-wrap { border-radius: 20px; overflow: hidden; border: 1px solid var(--border); box-shadow: 0 4px 24px rgba(0,0,0,.06); }
    .caro-track { display: flex; transition: transform .5s cubic-bezier(.22,.68,0,1.2); }
    .caro-slide { min-width: 100%; display: grid; grid-template-columns: 1fr 1fr; min-height: 320px; }
    .caro-info { padding: 36px; display: flex; flex-direction: column; justify-content: center; background: #fff; }
    .caro-tag { font-size: 10px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; margin-bottom: 10px; }
    .caro-slide-0 .caro-tag { color: var(--agua); }
    .caro-slide-1 .caro-tag { color: #b45309; }
    .caro-slide-2 .caro-tag { color: var(--gas); }
    .caro-slide h4 { font-family: 'Playfair Display', serif; font-weight: 700; font-size: clamp(20px, 2.2vw, 28px); color: var(--ink); line-height: .95; margin-bottom: 8px; }
    .caro-slide h4 em { font-style: italic; font-weight: 400; }
    .caro-slide p { font-size: 12px; color: #aaa; line-height: 1.65; max-width: 260px; margin-bottom: 16px; }
    .caro-cta { display: inline-flex; align-items: center; gap: 6px; border: none; padding: 9px 18px; border-radius: 99px; font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 12px; cursor: pointer; }
    .caro-slide-0 .caro-cta { background: #e0f2fe; color: #0369a1; }
    .caro-slide-1 .caro-cta { background: #fef3c7; color: #92400e; }
    .caro-slide-2 .caro-cta { background: #ffedd5; color: #c2410c; }
    .caro-vis { display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; min-height: 260px; padding: 18px; }
    .caro-slide-0 .caro-vis { background: linear-gradient(150deg, #082f49, #0c4a6e); }
    .caro-slide-1 .caro-vis { background: linear-gradient(150deg, #1c1000, #3d2200); }
    .caro-slide-2 .caro-vis { background: linear-gradient(150deg, #1c0800, #431407); }
    .caro-vis-icon { font-size: 80px; opacity: .18; position: absolute; }
    .caro-vis video { width: 85%; height: 190px; object-fit: cover; border-radius: 18px; border: 1px solid rgba(255,255,255,.15); box-shadow: 0 10px 30px rgba(0,0,0,.25); z-index: 2; }
    .caro-vis-play { width: 44px; height: 44px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative; z-index: 2; transition: .2s; }
    .caro-slide-0 .caro-vis-play { background: var(--agua); }
    .caro-slide-1 .caro-vis-play { background: var(--luz); }
    .caro-slide-2 .caro-vis-play { background: var(--gas); }
    .caro-vis-play:hover { transform: scale(1.1); }
    .caro-nav { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 14px; background: #fff; border-top: 1px solid var(--border); }
    .caro-nav-btn { width: 32px; height: 32px; border-radius: 50%; background: var(--cream); border: 1px solid var(--border); color: #888; cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center; transition: .15s; }
    .caro-nav-btn:hover { background: var(--ink); color: #fff; border-color: var(--ink); }
    .caro-dots { display: flex; gap: 6px; }
    .caro-dot { width: 6px; height: 6px; border-radius: 99px; background: #ddd; cursor: pointer; transition: .3s; }
    .caro-dot.active { width: 20px; background: var(--acc); }

    /* ═══ FOOTER ═══ */
    .lp-footer { background: var(--ink); text-align: center; padding: 20px; font-size: 11px; color: rgba(255,255,255,.2); font-family: 'Outfit', sans-serif; }

    /* ═══ RESPONSIVE ═══ */
    @media (max-width: 768px) {
      .lp-nav { padding: 0 20px; }
      .lp-hero { grid-template-columns: 1fr; height: auto; }
      .hero-left { padding: 40px 24px; }
      .hero-right { height: 300px; }
      .lp-split { grid-template-columns: 1fr; }
      .split-img { min-height: 240px; }
      .split-info, .split-info-cream { padding: 32px 24px; }
      .roles-grid { grid-template-columns: 1fr; }
      .lp-roles { padding: 36px 24px; }
      .lp-carousel { padding: 36px 24px 40px; }
      .caro-slide { grid-template-columns: 1fr; }
      .caro-vis { min-height: 140px; }
    }
  `

  const slides = [
    {
      cls: 'caro-slide-0',
      tag: '01 · Agua Potable',
      title: <>Lecturas que<br/><em>no mienten.</em></>,
      desc: 'IA extrae el valor del medidor al instante. Sin errores, sin visitas innecesarias.',
      cta: 'Ver Agua →',
      icon: '💧',
    },
    {
      cls: 'caro-slide-1',
      tag: '02 · Electricidad',
      title: <>El consumo que<br/><em>te define.</em></>,
      desc: 'kWh por tramo, costo estimado y alertas de picos en tiempo real por unidad.',
      cta: 'Ver Electricidad →',
      icon: '⚡',
    },
    {
      cls: 'caro-slide-2',
      tag: '03 · Gas Domiciliario',
      title: <>Seguridad que<br/><em>no descansa.</em></>,
      desc: 'Vigilancia 24/7 con alertas inmediatas ante variaciones peligrosas de consumo.',
      cta: 'Ver Gas →',
      icon: '🔥',
    },
  ]

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#f8f8f6', color: '#111' }}>
      <style>{css}</style>

      {/* NAV */}
      <nav className="lp-nav">
        <div className="nav-logo">
          <div className="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
              <circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <span className="nav-name">Servicios<span>Básicos</span></span>
        </div>
        <div className="nav-pill">
          <span className="nav-dot" />
          SISTEMA ACTIVO
        </div>
        <button className="nav-btn" onClick={() => router.push('/login')}>
          Ingresar →
        </button>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="hero-left">
          <div className="hero-tag">Digitalización · Bolivia</div>
          <h1 className="hero-h">
            Gestiona tus<br/>servicios,<br/><em>desde un<br/>solo lugar.</em>
          </h1>
          <p className="hero-p">
            Plataforma inteligente de lectura automatizada para agua, luz y gas en
            edificios y zonas residenciales de Bolivia.
          </p>
          <div className="hero-ctas">
            <button className="btn-dk" onClick={() => router.push('/login')}>Ver el sistema →</button>
            <button className="btn-ol">Cómo funciona</button>
          </div>
          <div className="hero-badges">
            <div className="hb hb-agua">💧 Agua</div>
            <div className="hb hb-luz">⚡ Luz</div>
            <div className="hb hb-gas">🔥 Gas</div>
          </div>
          <div className="hero-stats">
            <div><div className="hstat-v">500+</div><div className="hstat-l">Edificios activos</div></div>
            <div><div className="hstat-v">24/7</div><div className="hstat-l">Monitoreo IA</div></div>
            <div><div className="hstat-v">18%</div><div className="hstat-l">Ahorro promedio</div></div>
          </div>
        </div>

        {/* VIDEO — reemplaza el div oscuro con tu <video> tag */}
        <div className="hero-right">
          <div className="hv-scene">
            <video
  autoPlay
  muted
  loop
  playsInline
  style={{
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0
  }}
>
  <source src="/videos/demoinicio.mp4" type="video/mp4" />
</video>
            <div className="hv-grad" />
            <div className="hv-grid" />
            {/*
              REEMPLAZA ESTO CON TU VIDEO:
              <video autoPlay muted loop playsInline style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0}}>
                <source src="/videos/hero.mp4" type="video/mp4" />
              </video>
            */}
            <svg style={{position:'absolute',opacity:.1}} width="190" height="260" viewBox="0 0 190 260" fill="none">
              <rect x="15" y="35" width="160" height="225" rx="3" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
              <rect x="30" y="52" width="26" height="32" rx="2" fill="rgba(14,165,233,0.3)"/>
              <rect x="68" y="52" width="26" height="32" rx="2" fill="rgba(255,255,255,0.05)"/>
              <rect x="106" y="52" width="26" height="32" rx="2" fill="rgba(255,255,255,0.05)"/>
              <rect x="30" y="98" width="26" height="32" rx="2" fill="rgba(255,255,255,0.05)"/>
              <rect x="68" y="98" width="26" height="32" rx="2" fill="rgba(245,158,11,0.25)"/>
              <rect x="106" y="98" width="26" height="32" rx="2" fill="rgba(255,255,255,0.05)"/>
              <rect x="30" y="144" width="26" height="32" rx="2" fill="rgba(255,255,255,0.05)"/>
              <rect x="68" y="144" width="26" height="32" rx="2" fill="rgba(255,255,255,0.05)"/>
              <rect x="106" y="144" width="26" height="32" rx="2" fill="rgba(249,115,22,0.3)"/>
              <rect x="68" y="190" width="54" height="70" rx="2" fill="rgba(255,255,255,0.03)"/>
              <rect x="10" y="24" width="170" height="13" rx="2" fill="rgba(255,255,255,0.07)"/>
            </svg>
            <div className="hv-badge">
              <div className="hv-badge-icon">🏢</div>
              <div>
                <div className="hv-badge-title">Edificios & Zonas</div>
                <div className="hv-badge-sub">Cobertura total Bolivia</div>
              </div>
              <div className="hv-badge-tag">EN VIVO</div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="lp-ticker">
        <div className="ticker-inner">
          {[...Array(2)].map((_, rep) => (
            <span key={rep} style={{display:'inline-flex'}}>
              <span className="ti ti-agua">💧 Agua Potable <span className="ti-sep">·</span></span>
              <span className="ti ti-luz">⚡ Electricidad <span className="ti-sep">·</span></span>
              <span className="ti ti-gas">🔥 Gas Domiciliario <span className="ti-sep">·</span></span>
              <span className="ti">Lectura con IA <span className="ti-sep">·</span></span>
              <span className="ti">Geolocalización GPS <span className="ti-sep">·</span></span>
              <span className="ti">Anti-fraude ML <span className="ti-sep">·</span></span>
              <span className="ti">Bolivia <span className="ti-sep">·</span></span>
              <span className="ti">Edificios & Zonas <span className="ti-sep">·</span></span>
            </span>
          ))}
        </div>
      </div>

      {/* AGUA */}
      <section className="lp-split">
        <div className="split-img split-img-agua">
          <video autoPlay muted loop playsInline>
  <source src="/videos/aguainicio.mp4" type="video/mp4" />
</video>
          {/*
            REEMPLAZA CON TU VIDEO:
            <video autoPlay muted loop playsInline>
              <source src="/videos/agua.mp4" type="video/mp4" />
            </video>
          */}
          <div className="split-big-icon">💧</div>
          <div className="split-overlay" />
          <div className="split-vbadge">
            <div className="svp svp-agua">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg>
            </div>
            <div><div className="svp-title">Video · Agua Potable</div><div className="svp-sub">Lectura automática IA</div></div>
          </div>
        </div>
        <div className="split-info split-info-cream">
          <div className="split-tag split-tag-agua">Servicio 01 · Agua Potable</div>
          <h2 className="split-h">Lecturas que<br/><em>no mienten.</em></h2>
          <p className="split-p">Fotografía el medidor y nuestra IA extrae el valor al instante. Reportes automáticos para cada unidad del edificio o zona, sin errores humanos.</p>
          <button className="split-btn split-btn-agua" onClick={() => router.push('/dashboards/usuario/usuario-agua')}>Ver Agua →</button>
          <div className="split-divider" />
        </div>
      </section>

      {/* LUZ */}
      <section className="lp-split">
        <div className="split-info" style={{order:1}}>
          <div className="split-tag split-tag-luz">Servicio 02 · Electricidad</div>
          <h2 className="split-h">El consumo que<br/><em>te define.</em></h2>
          <p className="split-p">Monitoreo de kWh por tramo y unidad. Costo estimado de factura, alertas de picos y comparativo mensual para administradores.</p>
          <button className="split-btn split-btn-luz" onClick={() => router.push('/dashboards/usuario/usuario-luz')}>Ver Electricidad →</button>
          <div className="split-divider" />
        </div>
        <div className="split-img split-img-luz" style={{order:2}}>

  <video autoPlay muted loop playsInline>
    <source src="/videos/luzinicio.mp4" type="video/mp4" />
  </video>
          <div className="split-overlay" />
          <div className="split-vbadge">
            <div className="svp svp-luz">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg>
            </div>
            <div><div className="svp-title">Video · Electricidad</div><div className="svp-sub">Monitoreo en tiempo real</div></div>
          </div>
        </div>
      </section>

      {/* GAS */}
      <section className="lp-split">
        <div className="split-img split-img-gas">

  <video autoPlay muted loop playsInline>
    <source src="/videos/gasinicio.mp4" type="video/mp4" />
  </video>
          <div className="split-overlay" />
          <div className="split-vbadge">
            <div className="svp svp-gas">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg>
            </div>
            <div><div className="svp-title">Video · Gas Domiciliario</div><div className="svp-sub">Seguridad 24/7</div></div>
          </div>
        </div>
        <div className="split-info split-info-cream">
          <div className="split-tag split-tag-gas">Servicio 03 · Gas Domiciliario</div>
          <h2 className="split-h">Seguridad que<br/><em>no descansa.</em></h2>
          <p className="split-p">Vigilancia continua por departamento. Detección de variaciones peligrosas y notificaciones inmediatas a administradores y residentes.</p>
          <button className="split-btn split-btn-gas" onClick={() => router.push('/dashboards/usuario/usuario-gas')}>Ver Gas →</button>
          <div className="split-divider" />
        </div>
      </section>

      {/* ROLES */}
      <section className="lp-roles">
        <div className="roles-eye">Acceso por rol</div>
        <h2 className="roles-h">¿Cómo <em>ingresas?</em></h2>
        <p className="roles-sub">Tres perfiles para gestionar el sistema según tu rol en el edificio o zona.</p>
        <div className="roles-grid">
          {[
            { cls:'rc-u', icon:'💧', title:'Soy Usuario',    sub:'RESIDENTE · PROPIETARIO', desc:'Consulta consumo, fotografía tu medidor y gestiona pagos desde cualquier dispositivo.', path:'/login' },
            { cls:'rc-a', icon:'🛡️', title:'Soy Admin',      sub:'EDIFICIO · ZONA',         desc:'Dashboard completo, reportes IA, anti-fraude ML y control total del edificio o zona.',  path:'/login' },
            { cls:'rc-t', icon:'📍', title:'Soy Técnico',   sub:'INSPECTOR DE CAMPO',       desc:'Validación de lecturas con geolocalización GPS y detección de irregularidades.',        path:'/login' },
          ].map(r => (
            <div key={r.cls} className={`rc ${r.cls}`} onClick={() => router.push(r.path)}>
              <div className="rc-icon">{r.icon}</div>
              <h3>{r.title}</h3>
              <div className="rc-sub">{r.sub}</div>
              <p>{r.desc}</p>
              <button className="rc-btn">Ingresar →</button>
            </div>
          ))}
        </div>
      </section>

      {/* CARRUSEL */}
      <section className="lp-carousel">
        <div className="caro-eye">Explora el sistema</div>
        <h2 className="caro-h">Todo en <em>un solo lugar.</em></h2>
        <p className="caro-sub">Desliza para conocer cada servicio integrado.</p>
        <div className="caro-wrap">
          <div className="caro-track" style={{ transform: `translateX(-${carouselIdx * 100}%)` }}>
            {slides.map((s, i) => (
              <div key={i} className={`caro-slide ${s.cls}`}>
                <div className="caro-info">
                  <div className="caro-tag">{s.tag}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                  <button className="caro-cta">{s.cta}</button>
                </div>
                <div className="caro-vis">
  {i === 0 && (
    <video autoPlay muted loop playsInline>
      <source src="/videos/dashboard.mp4" type="video/mp4" />
    </video>
  )}

  {i === 1 && (
    <video autoPlay muted loop playsInline>
      <source src="/videos/tecnico.mp4" type="video/mp4" />
    </video>
  )}

  {i === 2 && (
    <video autoPlay muted loop playsInline>
      <source src="/videos/celular.mp4" type="video/mp4" />
    </video>
  )}
</div>
              </div>
            ))}
          </div>
          <div className="caro-nav">
            <button className="caro-nav-btn" onClick={() => setCarouselIdx(i => (i - 1 + 3) % 3)}>‹</button>
            <div className="caro-dots">
              {[0,1,2].map(i => (
                <div key={i} className={`caro-dot${carouselIdx === i ? ' active' : ''}`} onClick={() => setCarouselIdx(i)} />
              ))}
            </div>
            <button className="caro-nav-btn" onClick={() => setCarouselIdx(i => (i + 1) % 3)}>›</button>
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        Desarrollado por Estefani Torrico · Sistema de Digitalización de Servicios Básicos · Bolivia
      </footer>
    </div>
  )
}