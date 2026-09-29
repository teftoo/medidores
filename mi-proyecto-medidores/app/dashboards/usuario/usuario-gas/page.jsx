'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { calcularTarifaGasCompleta } from '@/lib/tariffGasUtils'
import CamaraGas from '@/app/components/gas/camaragas'
const Geolocalizacion = dynamic(
  () => import('@/app/components/gas/geolocalizacion'),
  { ssr: false }
)
import HistorialGas from '@/app/components/gas/historialgas'
import MedidorManualGas from '@/app/components/gas/medidormanualgas'
import PagosGas from '@/app/components/gas/pagosgas'
import PerfilUsuario from '@/app/components/gas/perfilusuario'
import ReportesGas from '@/app/components/gas/reportesgas'
import SidebarGas from '@/app/components/gas/sidebarGas'


import {
  Flame, Home, History, FileText, CreditCard, Camera,
  MapPin, PenLine, User, LogOut, ChevronRight, TrendingDown,
  CheckCircle2, Zap, ArrowLeft, Gauge, AlertTriangle
} from 'lucide-react'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cn-root {
    --white:      #ffffff;
    --off:        #f9f9f8;
    --border:     #ebebea;
    --border-md:  #d4d4d0;
    --ink:        #111110;
    --ink-2:      #3a3a38;
    --ink-3:      #737370;
    --ink-4:      #b0b0ac;
    --gas:        #f97316;
    --gas-dk:     #c2410c;
    --gas-bg:     #fff7ed;
    --gas-bd:     #fed7aa;
    --indigo:     #4f46e5;
    --indigo-bg:  #eef0fd;
    --indigo-bd:  #c7c3f7;
    --indigo-dk:  #3730a3;
    --amber:      #d97706;
    --amber-bg:   #fffbeb;
    --amber-bd:   #fde68a;
    --red:        #dc2626;
    --red-bg:     #fef2f2;
    --red-bd:     #fecaca;
    --green:      #16a34a;
    --green-bg:   #f0fdf4;
    --green-bd:   #bbf7d0;
    font-family: 'Inter', system-ui, sans-serif;
    background: var(--white);
    color: var(--ink);
    min-height: 100vh;
    display: flex;
  }

  .cn-sidebar {
    width: 232px; min-height: 100vh;
    background: var(--ink);
    display: flex; flex-direction: column;
    flex-shrink: 0; position: relative; z-index: 20;
    transition: width .22s ease;
  }
  .cn-sidebar.slim { width: 64px; }
  .sb-brand {
    padding: 26px 20px 22px;
    display: flex; align-items: center; gap: 11px;
    border-bottom: 1px solid rgba(255,255,255,.07);
  }
  .sb-brand-icon {
    width: 34px; height: 34px;
    background: var(--gas); border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; color: #fff;
  }
  .sb-brand-name {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 17px;
    color: #fff; letter-spacing: -.01em; white-space: nowrap;
  }
  .sb-brand-dot { color: var(--gas); }
  .sb-section-label {
    padding: 18px 18px 6px; font-size: 10px; font-weight: 600;
    letter-spacing: .1em; text-transform: uppercase;
    color: rgba(255,255,255,.25); white-space: nowrap; overflow: hidden;
  }
  .sb-nav {
    flex: 1; padding: 8px 10px;
    display: flex; flex-direction: column; gap: 1px; overflow-y: auto;
  }
  .sb-item {
    width: 100%; display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 9px; border: none; background: none;
    cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13.5px;
    font-weight: 400; color: rgba(255,255,255,.45); text-align: left;
    transition: all .15s; white-space: nowrap; overflow: hidden;
  }
  .sb-item:hover { background: rgba(255,255,255,.06); color: rgba(255,255,255,.8); }
  .sb-item.on { background: rgba(249,115,22,.15); color: #fff; font-weight: 500; }
  .sb-item.on svg { color: var(--gas); }
  .sb-icon { width: 15px; height: 15px; flex-shrink: 0; }
  .sb-pip { width: 5px; height: 5px; background: var(--gas); border-radius: 50%; margin-left: auto; flex-shrink: 0; }
  .sb-user { padding: 12px 10px 16px; border-top: 1px solid rgba(255,255,255,.07); }
  .sb-user-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 9px; margin-bottom: 6px; }
  .sb-avatar {
    width: 30px; height: 30px; border-radius: 8px; background: var(--gas);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 12px; color: #fff; flex-shrink: 0; overflow: hidden;
  }
  .sb-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .sb-uname { font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sb-utype { font-size: 11px; color: rgba(255,255,255,.3); text-transform: capitalize; }
  .sb-logout {
    width: 100%; display: flex; align-items: center; gap: 8px;
    padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,.08);
    background: none; cursor: pointer; font-size: 12.5px; color: rgba(255,255,255,.35);
    font-family: 'Inter', sans-serif; transition: all .15s;
  }
  .sb-logout:hover { color: #ff7070; border-color: rgba(255,100,100,.2); background: rgba(255,80,80,.05); }
  .sb-toggle {
    position: absolute; right: -13px; top: 72px;
    width: 26px; height: 26px;
    background: var(--white); border: 1px solid var(--border-md); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--ink-3); transition: all .15s; z-index: 30;
  }
  .sb-toggle:hover { color: var(--ink); }

  .cn-main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
  .cn-topbar {
    position: sticky; top: 0; z-index: 10;
    background: rgba(255,255,255,.92); backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border); padding: 0 36px; height: 58px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
  }
  .tb-left { display: flex; align-items: center; gap: 14px; }
  .tb-back {
    display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink-3);
    background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif;
    padding: 5px 10px; border-radius: 7px; transition: all .15s;
  }
  .tb-back:hover { color: var(--ink); background: var(--off); }
  .tb-divider { width: 1px; height: 18px; background: var(--border-md); }
  .tb-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: var(--ink); }
  .tb-sub { font-size: 11.5px; color: var(--ink-4); margin-top: 1px; }
  .tb-status {
    display: flex; align-items: center; gap: 6px; padding: 5px 13px;
    background: var(--gas-bg); border: 1px solid var(--gas-bd);
    border-radius: 99px; font-size: 12px; color: var(--gas-dk); font-weight: 500;
  }
  .tb-dot { width: 6px; height: 6px; background: var(--gas); border-radius: 50%; animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

  .cn-page { padding: 40px 44px; max-width: 960px; display: flex; flex-direction: column; gap: 32px; }
  .greet-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
  .greet-h {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 44px;
    line-height: 1.05; color: var(--ink); letter-spacing: -.03em;
  }
  .greet-h .acc { color: var(--gas); }
  .greet-sub { font-size: 14px; color: var(--ink-3); margin-top: 8px; }
  .month-chip {
    background: var(--off); border: 1.5px solid var(--border);
    padding: 10px 18px; border-radius: 13px; text-align: right; flex-shrink: 0;
  }
  .month-chip .ml { font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-4); font-weight: 600; }
  .month-chip .mv { font-size: 14px; font-weight: 700; color: var(--ink-2); margin-top: 3px; font-family: 'Syne', sans-serif; }

  .stat-strip { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; }
  .stat-card {
    background: var(--white); border: 1.5px solid var(--border); border-radius: 20px;
    padding: 26px 28px; position: relative; overflow: hidden; transition: border-color .2s, transform .15s;
  }
  .stat-card:hover { border-color: var(--border-md); transform: translateY(-1px); }
  .stat-card.hero { background: var(--ink); border-color: var(--ink); }
  .stat-card.hero:hover { transform: none; }
  .stat-card.pay-card { background: var(--gas); border-color: var(--gas); }
  .stat-card.pay-card:hover { transform: none; }
  .sc-label { font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 12px; }
  .hero .sc-label { color: rgba(255,255,255,.4); }
  .pay-card .sc-label { color: rgba(255,255,255,.6); }
  .sc-value { display: flex; align-items: baseline; gap: 7px; }
  .sc-num {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 54px;
    line-height: 1; letter-spacing: -.04em; color: var(--ink);
  }
  .hero .sc-num { color: #fff; }
  .pay-card .sc-num { color: #fff; }
  .sc-unit { font-size: 18px; font-weight: 700; color: var(--gas); }
  .hero .sc-unit { color: var(--gas); }
  .pay-card .sc-unit { color: rgba(255,255,255,.65); font-size: 15px; }
  .level-tag { position: absolute; top: 22px; right: 22px; padding: 5px 13px; border-radius: 99px; font-size: 11.5px; font-weight: 600; border: 1px solid; }
  .lt-opt { background: var(--gas-bg); color: var(--gas-dk); border-color: var(--gas-bd); }
  .lt-nor { background: var(--amber-bg); color: var(--amber); border-color: var(--amber-bd); }
  .lt-alt { background: var(--red-bg); color: var(--red); border-color: var(--red-bd); }
  .prog-wrap { margin-top: 22px; }
  .prog-meta { display: flex; justify-content: space-between; font-size: 11.5px; margin-bottom: 8px; }
  .prog-meta span { color: rgba(255,255,255,.3); }
  .prog-meta .pm-pct { color: var(--gas); font-weight: 700; }
  .prog-track { height: 5px; background: rgba(255,255,255,.1); border-radius: 99px; overflow: hidden; }
  .prog-fill { height: 100%; background: var(--gas); border-radius: 99px; transition: width 1.1s cubic-bezier(.22,.68,0,1.2); }
  .prog-hint { font-size: 11.5px; color: rgba(255,255,255,.28); margin-top: 10px; }
  .mini-sc-icon { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
  .mini-sc-icon.gas  { background: var(--gas-bg); color: var(--gas); }
  .mini-sc-icon.indigo { background: var(--indigo-bg); color: var(--indigo); }
  .mini-sc-num { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 28px; color: var(--ink); letter-spacing: -.02em; line-height: 1; }
  .mini-sc-lbl { font-size: 12px; color: var(--ink-3); margin-top: 5px; }
  .pay-bs { font-size: 16px; color: rgba(255,255,255,.45); font-weight: 500; align-self: flex-end; margin-bottom: 6px; }
  .pay-disc { display: flex; align-items: center; gap: 5px; margin-top: 8px; font-size: 12px; color: rgba(255,255,255,.6); }
  .pay-btn {
    width: 100%; margin-top: 22px; padding: 13px;
    background: var(--white); color: var(--gas-dk); border: none; border-radius: 11px;
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; letter-spacing: -.01em; transition: all .15s;
  }
  .pay-btn:hover { background: var(--gas-bg); }

  .fact-wrap {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 20px; overflow: hidden; transition: border-color .2s;
  }
  .fact-wrap:hover { border-color: var(--border-md); }
  .fact-toggle {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    padding: 20px 26px; background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; transition: background .15s;
  }
  .fact-toggle:hover { background: var(--off); }
  .ft-left { display: flex; align-items: center; gap: 16px; }
  .ft-icon {
    width: 38px; height: 38px; background: var(--gas-bg);
    border: 1px solid var(--gas-bd); border-radius: 10px;
    display: flex; align-items: center; justify-content: center; color: var(--gas);
  }
  .ft-title { font-size: 14.5px; font-weight: 700; color: var(--ink); text-align: left; font-family: 'Syne', sans-serif; }
  .ft-sub { font-size: 12px; color: var(--ink-3); margin-top: 2px; text-align: left; }
  .ft-chevron { color: var(--ink-3); transition: transform .2s; }
  .ft-chevron.open { transform: rotate(90deg); }
  .fact-body { border-top: 1px solid var(--border); padding: 22px 26px; display: flex; flex-direction: column; gap: 8px; }
  .fact-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 16px; background: var(--off); border-radius: 10px; font-size: 13.5px; }
  .fact-row .fr-l { color: var(--ink-3); }
  .fact-row .fr-v { font-weight: 600; color: var(--ink); }
  .fact-row .fr-v.gas { color: var(--gas-dk); }
  .fact-row .fr-v.green { color: var(--green); }
  .fact-total {
    display: flex; justify-content: space-between; align-items: center;
    padding: 15px 18px; background: var(--ink); border-radius: 12px; margin-top: 4px;
  }
  .fact-total .ftl { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: rgba(255,255,255,.5); }
  .fact-total .ftv { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 24px; color: #fff; letter-spacing: -.02em; }
  .tarifa-note { padding: 13px 16px; background: var(--gas-bg); border: 1px solid var(--gas-bd); border-radius: 10px; font-size: 12px; color: var(--gas-dk); line-height: 1.6; }

  .tips-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .tip-card {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 18px; padding: 20px 22px; display: flex; align-items: flex-start; gap: 15px;
    transition: border-color .2s, transform .15s;
  }
  .tip-card:hover { border-color: var(--border-md); transform: translateY(-1px); }
  .tip-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .tip-icon.gas    { background: var(--gas-bg);    color: var(--gas); }
  .tip-icon.indigo { background: var(--indigo-bg); color: var(--indigo); }
  .tip-t { font-family: 'Syne', sans-serif; font-size: 13.5px; font-weight: 700; color: var(--ink); margin-bottom: 5px; }
  .tip-b { font-size: 12.5px; color: var(--ink-3); line-height: 1.55; }

  .safety-banner {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 16px 20px; background: #fef9ec; border: 1.5px solid #fde68a;
    border-radius: 16px;
  }
  .safety-icon { width: 36px; height: 36px; background: #fef3c7; border-radius: 9px; display: flex; align-items: center; justify-content: center; color: #d97706; flex-shrink: 0; margin-top: 1px; }
  .safety-title { font-family: 'Syne', sans-serif; font-size: 13.5px; font-weight: 700; color: #92400e; margin-bottom: 4px; }
  .safety-body { font-size: 12.5px; color: #b45309; line-height: 1.55; }

  .empty-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 40px; gap: 12px; text-align: center; }
  .empty-icon { width: 52px; height: 52px; background: var(--gas-bg); border: 1.5px solid var(--gas-bd); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: var(--gas); margin-bottom: 6px; }
  .empty-t { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: var(--ink); }
  .empty-s { font-size: 13.5px; color: var(--ink-3); }

  .cn-loader { min-height: 100vh; flex: 1; display: flex; align-items: center; justify-content: center; background: var(--white); }
  .loader-box { display: flex; flex-direction: column; align-items: center; gap: 18px; }
  .loader-ring { width: 42px; height: 42px; border: 2px solid var(--border); border-top-color: var(--gas); border-radius: 50%; animation: spin .65s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loader-lbl { font-size: 12px; color: var(--ink-4); letter-spacing: .1em; text-transform: uppercase; }

  .cn-footer { font-size: 11.5px; color: var(--ink-4); text-align: center; padding-bottom: 44px; }

  @media (max-width: 820px) {
    .stat-strip { grid-template-columns: 1fr; }
    .tips-grid { grid-template-columns: 1fr; }
    .cn-page { padding: 24px 20px; }
    .cn-topbar { padding: 0 20px; }
    .greet-h { font-size: 30px; }
  }
`

export default function UsuarioGas() {
  const router = useRouter()
  const [usuario, setUsuario] = useState(null)
  const [consumo, setConsumo] = useState(0)
  const [tarifaDetalles, setTarifaDetalles] = useState({ subtotal: 0, totalConFactorTipo: 0, totalFinal: 0 })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('inicio')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) { router.push('/login'); return }

        const { data: userData } = await supabase
          .from('usuarios').select('*').eq('correo', session.user.email).single()

        const { data: lectura } = await supabase
          .from('lecturas_gas').select('valor_lectura')
          .eq('id_usuario', userData?.id)
          .order('fecha_lectura', { ascending: false })
          .limit(1).single()

        const valorLectura = lectura?.valor_lectura || 18
        const tipoU = userData?.tipo_usuario || 'domestico'
        const descuentoU = userData?.descuento || 0
        const tarifas = calcularTarifaGasCompleta(valorLectura, tipoU, descuentoU)

        setUsuario({
          id: userData?.id,
          nombre: userData?.nombre || session.user.email,
          correo: userData?.correo || session.user.email,
          direccion: userData?.direccion || 'No registrada',
          foto: userData?.foto || null,
          tipo_usuario: tipoU,
          descuento: descuentoU,
        })
        setConsumo(valorLectura)
        setTarifaDetalles(tarifas)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { id: 'inicio',    icon: Home,       label: 'Inicio' },
    { id: 'historial', icon: History,    label: 'Historial' },
    { id: 'reportes',  icon: FileText,   label: 'Reportes' },
    { id: 'pagos',     icon: CreditCard, label: 'Pagos' },
    { id: 'camara',    icon: Camera,     label: 'Cámara IA' },
    { id: 'ubicacion', icon: MapPin,     label: 'Mi Ubicación' },
    { id: 'medidor',   icon: PenLine,    label: 'Medidor Manual' },
    { id: 'perfil',    icon: User,       label: 'Mi Perfil' },
  ]

  if (loading) return (
    <div className="cn-root">
      <style>{css}</style>
      <div className="cn-loader">
        <div className="loader-box">
          <div className="loader-ring" />
          <p className="loader-lbl">Cargando datos</p>
        </div>
      </div>
    </div>
  )

  const limiteRecomendado = 30
  const porcentajeConsumo = Math.min((consumo / limiteRecomendado) * 100, 100)
  const nivelConsumo = consumo <= 15 ? 'Óptimo' : consumo <= 30 ? 'Normal' : 'Alto'

  return (
    <div className="cn-root">
      <style>{css}</style>

      <aside className={`cn-sidebar${sidebarOpen ? '' : ' slim'}`}>
        <div className="sb-brand">
          <div className="sb-brand-icon"><Flame size={17} /></div>
          {sidebarOpen && (
            <span className="sb-brand-name">Gas<span className="sb-brand-dot">Net</span></span>
          )}
        </div>
        {sidebarOpen && <div className="sb-section-label">Navegación</div>}
        <nav className="sb-nav">
          {navItems.map(({ id, icon: Icon, label }) => {
            const on = activeTab === id
            return (
              <button key={id} onClick={() => setActiveTab(id)} className={`sb-item${on ? ' on' : ''}`}>
                <Icon className="sb-icon" />
                {sidebarOpen && <span>{label}</span>}
                {on && sidebarOpen && <span className="sb-pip" />}
              </button>
            )
          })}
        </nav>
        {sidebarOpen && usuario && (
          <div className="sb-user">
            <div className="sb-user-row">
              <div className="sb-avatar">
                {usuario.foto ? <img src={usuario.foto} alt="perfil" /> : usuario.nombre?.charAt(0)?.toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="sb-uname">{usuario.nombre}</div>
                <div className="sb-utype">{usuario.tipo_usuario}</div>
              </div>
            </div>
            <button className="sb-logout" onClick={handleLogout}>
              <LogOut size={13} /> Cerrar sesión
            </button>
          </div>
        )}
        <button className="sb-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <ChevronRight size={11} style={{ transform: sidebarOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
        </button>
      </aside>

      <main className="cn-main">
        <header className="cn-topbar">
          <div className="tb-left">
            <button className="tb-back" onClick={() => router.push('/dashboards/usuario')}>
              <ArrowLeft size={13} /> Volver
            </button>
            <div className="tb-divider" />
            <div>
              <div className="tb-title">GasNet</div>
              <div className="tb-sub">{usuario?.direccion}</div>
            </div>
          </div>
          <div className="tb-status">
            <span className="tb-dot" />
            Suministro activo
          </div>
        </header>

        <div className="cn-page">
          {activeTab === 'inicio' ? (
            <InicioGas
              usuario={usuario}
              consumo={consumo}
              tarifaDetalles={tarifaDetalles}
              porcentajeConsumo={porcentajeConsumo}
              nivelConsumo={nivelConsumo}
              limiteRecomendado={limiteRecomendado}
            />
          ) : activeTab === 'camara' ? (
            <CamaraGas />
          ) : activeTab === 'historial' ? (
            <HistorialGas usuario={usuario} />
          ) : activeTab === 'reportes' ? (
            <ReportesGas usuario={usuario} />
          ) : activeTab === 'pagos' ? (
            <PagosGas usuario={usuario} />
          ) : activeTab === 'ubicacion' ? (
            <Geolocalizacion usuario={usuario} />
          ) : activeTab === 'medidor' ? (
            <MedidorManualGas usuario={usuario} />
          ) : activeTab === 'perfil' ? (
            <PerfilUsuario usuario={usuario} />
          ) : (
            <div className="empty-wrap">
              <div className="empty-icon"><Flame size={24} /></div>
              <div className="empty-t">Módulo en construcción</div>
              <div className="empty-s">Este módulo estará disponible pronto</div>
            </div>
          )}
          <p className="cn-footer">
            Desarrollado por Estefani Torrico · Sistema de Digitalización de Servicios Básicos
          </p>
        </div>
      </main>
    </div>
  )
}

function InicioGas({ usuario, consumo, tarifaDetalles, porcentajeConsumo, nivelConsumo, limiteRecomendado }) {
  const [showDetalle, setShowDetalle] = useState(false)
  const levelClass = nivelConsumo === 'Óptimo' ? 'lt-opt' : nivelConsumo === 'Normal' ? 'lt-nor' : 'lt-alt'

  return (
    <>
      <div className="greet-row">
        <div>
          <h2 className="greet-h">
            Hola, <span className="acc">{usuario?.nombre?.split(' ')[0]}</span>
          </h2>
          <p className="greet-sub">Resumen de consumo de gas · mes en curso</p>
        </div>
        <div className="month-chip">
          <div className="ml">Período</div>
          <div className="mv">{new Date().toLocaleString('es-BO', { month: 'long', year: 'numeric' })}</div>
        </div>
      </div>

      <div className="safety-banner">
        <div className="safety-icon"><AlertTriangle size={18} /></div>
        <div>
          <div className="safety-title">Seguridad en el hogar</div>
          <div className="safety-body">
            Si detecta olor a gas, ventile el ambiente, no encienda llamas ni interruptores.
          </div>
        </div>
      </div>

      <div className="stat-strip">
        <div className="stat-card hero">
          <p className="sc-label">Consumo registrado</p>
          <div className="sc-value">
            <span className="sc-num">{consumo.toFixed(2)}</span>
            <span className="sc-unit">m³</span>
          </div>
          <div className={`level-tag ${levelClass}`}>{nivelConsumo}</div>
          <div className="prog-wrap">
            <div className="prog-meta">
              <span>0 m³</span>
              <span className="pm-pct">{porcentajeConsumo.toFixed(0)}%</span>
              <span>{limiteRecomendado} m³</span>
            </div>
            <div className="prog-track">
              <div className="prog-fill" style={{ width: `${porcentajeConsumo}%` }} />
            </div>
            <p className="prog-hint">Límite recomendado {limiteRecomendado} m³ / mes doméstico</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="mini-sc-icon gas"><Gauge size={18} /></div>
          <p className="sc-label">Nivel</p>
          <div className="mini-sc-num">{nivelConsumo}</div>
          <p className="mini-sc-lbl">Estado de consumo</p>
        </div>
        <div className="stat-card">
          <div className="mini-sc-icon indigo"><User size={18} /></div>
          <p className="sc-label">Tipo</p>
          <div className="mini-sc-num" style={{ textTransform: 'capitalize', fontSize: 22 }}>{usuario?.tipo_usuario}</div>
          <p className="mini-sc-lbl">Categoría de cuenta</p>
        </div>
      </div>

      <div className="stat-card pay-card">
        <p className="sc-label">Total a pagar este mes</p>
        <div className="sc-value">
          <span className="pay-bs">Bs</span>
          <span className="sc-num" style={{ fontSize: 48 }}>{tarifaDetalles?.totalFinal?.toFixed(2)}</span>
        </div>
        {usuario?.descuento > 0 && (
          <div className="pay-disc">
            <TrendingDown size={13} />
            {usuario.descuento}% de descuento aplicado
          </div>
        )}
        <button className="pay-btn">Pagar ahora →</button>
      </div>

      <div className="fact-wrap">
        <button className="fact-toggle" onClick={() => setShowDetalle(!showDetalle)}>
          <div className="ft-left">
            <div className="ft-icon"><FileText size={16} /></div>
            <div>
              <div className="ft-title">Detalle de facturación</div>
              <div className="ft-sub">Tarifas progresivas · GasNet Cochabamba</div>
            </div>
          </div>
          <ChevronRight size={16} className={`ft-chevron${showDetalle ? ' open' : ''}`} />
        </button>
        {showDetalle && (
          <div className="fact-body">
            {[
              { l: 'Consumo total',                         v: `${consumo.toFixed(2)} m³`,                                                                      cls: '' },
              { l: 'Subtotal (tarifa base)',                 v: `Bs ${tarifaDetalles?.subtotal?.toFixed(2)}`,                                                    cls: '' },
              { l: `Factor tipo (${usuario?.tipo_usuario})`,v: `Bs ${tarifaDetalles?.totalConFactorTipo?.toFixed(2)}`,                                           cls: 'gas' },
              ...(usuario?.descuento > 0
                ? [{ l: `Descuento (${usuario.descuento}%)`, v: `−Bs ${(tarifaDetalles?.totalConFactorTipo - tarifaDetalles?.totalFinal)?.toFixed(2)}`, cls: 'green' }]
                : [])
            ].map((item, i) => (
              <div key={i} className="fact-row">
                <span className="fr-l">{item.l}</span>
                <span className={`fr-v ${item.cls}`}>{item.v}</span>
              </div>
            ))}
            <div className="fact-total">
              <span className="ftl">Total final</span>
              <span className="ftv">Bs {tarifaDetalles?.totalFinal?.toFixed(2)}</span>
            </div>
            <div className="tarifa-note">
              <strong>Tarifas progresivas gas:</strong> 0–10 m³ = Bs 0.80/m³ · 11–20 m³ = Bs 1.20/m³ · 21–30 m³ = Bs 1.80/m³ · +30 m³ = Bs 2.80/m³
            </div>
          </div>
        )}
      </div>

      <div className="tips-grid">
        <div className="tip-card">
          <div className="tip-icon gas"><CheckCircle2 size={18} /></div>
          <div>
            <div className="tip-t">Consumo dentro del rango</div>
            <div className="tip-b">Tu consumo está en el límite recomendado. Así mantienes la tarifa mínima y reduces riesgo.</div>
          </div>
        </div>
        <div className="tip-card">
          <div className="tip-icon indigo"><Zap size={18} /></div>
          <div>
            <div className="tip-t">Lectura con Cámara IA</div>
            <div className="tip-b">Fotografía tu medidor de gas y el sistema registra la lectura automáticamente sin errores.</div>
          </div>
        </div>
      </div>
    </>
  )
}


