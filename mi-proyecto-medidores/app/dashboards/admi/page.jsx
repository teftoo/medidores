'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Wrench, Gauge, BookOpen,
  FileText, CreditCard, MapPin, Bell, Shield, Sliders,
  LogOut, Settings, User, ChevronDown, Search, X,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Clock, Activity, Zap, RefreshCw, ArrowUpRight,
  Droplets, Menu, Lock, Key, ShieldCheck,
} from 'lucide-react'
import Usuarios from '@/components/admi/UsersManagement'

// ─── MOCK DATA ────────────────────────────────────────────────
const STATS = [
  { label: 'Usuarios Activos',      value: '156',        delta: '+12',    up: true,  icon: Users,    sub: 'vs mes anterior' },
  { label: 'Lecturas Registradas',  value: '1,248',      delta: '+8.4%',  up: true,  icon: BookOpen, sub: 'este mes' },
  { label: 'Consumo Total',         value: '8,920 m³',   delta: '-2.1%',  up: false, icon: Droplets, sub: 'este mes' },
  { label: 'Ingresos',              value: 'Bs 45,230',  delta: '+18.3%', up: true,  icon: CreditCard,sub: 'facturado' },
]

const RECENT_READINGS = [
  { id: 'M-0041', user: 'Carlos Mamani', zona: 'Norte',  lectura: '1,284 m³', estado: 'Normal', fecha: 'Hoy 09:14' },
  { id: 'M-0092', user: 'Luisa Quispe',  zona: 'Sur',    lectura: '892 m³',   estado: 'Alerta', fecha: 'Hoy 08:50' },
  { id: 'M-0017', user: 'Pedro Flores',  zona: 'Centro', lectura: '2,103 m³', estado: 'Alto',   fecha: 'Hoy 08:22' },
  { id: 'M-0055', user: 'Ana Condori',   zona: 'Este',   lectura: '445 m³',   estado: 'Normal', fecha: 'Ayer 17:40' },
  { id: 'M-0033', user: 'Roberto Vargas',zona: 'Oeste',  lectura: '1,670 m³', estado: 'Normal', fecha: 'Ayer 16:55' },
]

const ALERTS = [
  { msg: 'Consumo anómalo en Zona Norte — medidor M-0092', time: '2 min',  type: 'error' },
  { msg: 'Técnico J. Lima completó lectura en Sector 4',   time: '18 min', type: 'success' },
  { msg: 'Factura #0482 vencida — usuario P. Flores',      time: '1h',     type: 'warn' },
  { msg: 'Backup del sistema completado exitosamente',     time: '3h',     type: 'info' },
]

const SYSTEM = [
  { label: 'Base de datos',     ok: true },
  { label: 'API de lecturas',   ok: true },
  { label: 'Servidor SMTP',     ok: true },
  { label: 'Backup automático', ok: false },
]

const QUICK_ACTIONS = [
  { label: 'Nueva lectura',   icon: BookOpen,  tab: 'lecturas' },
  { label: 'Crear usuario',   icon: Users,     tab: 'usuarios' },
  { label: 'Generar factura', icon: CreditCard,tab: 'facturacion' },
  { label: 'Ver alertas',     icon: Bell,      tab: 'alertas' },
  { label: 'Agregar técnico', icon: Wrench,    tab: 'tecnicos' },
  { label: 'Nueva zona',      icon: MapPin,    tab: 'zonas' },
]

const NAV = [
  { label: 'Panel Principal', icon: LayoutDashboard, id: 'dashboard' },
  { label: 'Usuarios',        icon: Users,           id: 'usuarios' },
  { label: 'Técnicos',        icon: Wrench,          id: 'tecnicos' },
  { label: 'Medidores',       icon: Gauge,           id: 'medidores' },
  { label: 'Lecturas',        icon: BookOpen,        id: 'lecturas' },
  { label: 'Reportes',        icon: FileText,        id: 'reportes' },
  { label: 'Facturación',     icon: CreditCard,      id: 'facturacion' },
  { label: 'Zonas/Sectores',  icon: MapPin,          id: 'zonas' },
  { label: 'Alertas',         icon: Bell,            id: 'alertas', badge: 3 },
  { label: 'Auditoría',       icon: Shield,          id: 'auditoria' },
  { label: 'Tarifas',         icon: Sliders,         id: 'tarifas' },
]

const ESTADO_STYLE = {
  Normal: { bg: 'var(--green-bg)', color: 'var(--green)',   border: 'var(--green-bd)',  dot: '#16a34a' },
  Alerta: { bg: 'var(--red-bg)',   color: 'var(--red)',     border: 'var(--red-bd)',    dot: '#dc2626' },
  Alto:   { bg: 'var(--amber-bg)', color: 'var(--amber)',   border: 'var(--amber-bd)',  dot: '#d97706' },
}

const ALERT_STYLE = {
  error:   { bg: 'var(--red-bg)',   color: 'var(--red)',    border: 'var(--red-bd)',   icon: AlertTriangle },
  success: { bg: 'var(--green-bg)', color: 'var(--green)',  border: 'var(--green-bd)', icon: CheckCircle2 },
  warn:    { bg: 'var(--amber-bg)', color: 'var(--amber)',  border: 'var(--amber-bd)', icon: Clock },
  info:    { bg: 'var(--teal-bg)',  color: 'var(--teal)',   border: 'var(--teal-bd)',  icon: Activity },
}

// ─── CSS ──────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .adm-root {
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
    --green:      #16a34a;
    --green-bg:   #f0fdf4;
    --green-bd:   #bbf7d0;
    --amber:      #d97706;
    --amber-bg:   #fffbeb;
    --amber-bd:   #fde68a;
    --indigo:     #4f46e5;
    --indigo-bg:  #eef0fd;
    --indigo-bd:  #c7c3f7;
    font-family: 'Inter', system-ui, sans-serif;
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: var(--off);
    color: var(--ink);
  }

  /* ── SIDEBAR ── */
  .adm-sidebar {
    height: 100vh; flex-shrink: 0;
    background: var(--ink);
    display: flex; flex-direction: column;
    overflow: hidden; position: relative; z-index: 30;
    transition: width .25s cubic-bezier(.4,0,.2,1);
  }
  .adm-sidebar-top {
    padding: 20px 14px 16px;
    border-bottom: 1px solid rgba(255,255,255,.08);
    display: flex; align-items: center; gap: 10px;
  }
  .adm-logo-mark {
    width: 34px; height: 34px; border-radius: 9px;
    background: var(--teal); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .adm-logo-text {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px;
    color: #fff; letter-spacing: -.02em; white-space: nowrap; overflow: hidden;
  }
  .adm-logo-text span { color: var(--teal); }
  .adm-logo-sub { font-size: 10px; color: rgba(255,255,255,.3); margin-top: 1px; }
  .adm-collapse-btn {
    margin-left: auto; background: none; border: none;
    color: rgba(255,255,255,.3); cursor: pointer; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    padding: 4px; border-radius: 6px; transition: color .15s;
  }
  .adm-collapse-btn:hover { color: rgba(255,255,255,.7); }

  .adm-nav { flex: 1; overflow-y: auto; padding: 10px 10px; scrollbar-width: none; }
  .adm-nav::-webkit-scrollbar { display: none; }

  .adm-nav-btn {
    width: 100%; display: flex; align-items: center; gap: 10px;
    padding: 9px 10px; border-radius: 9px; border: none;
    background: transparent; cursor: pointer; margin-bottom: 2px;
    transition: background .12s; position: relative; overflow: hidden;
  }
  .adm-nav-btn:hover  { background: rgba(255,255,255,.06); }
  .adm-nav-btn.active { background: var(--teal); }
  .adm-nav-label {
    font-size: 13px; font-weight: 500; color: rgba(255,255,255,.5);
    white-space: nowrap; overflow: hidden; transition: color .12s;
  }
  .adm-nav-btn.active .adm-nav-label { color: #fff; font-weight: 600; }
  .adm-nav-btn:hover:not(.active) .adm-nav-label { color: rgba(255,255,255,.8); }
  .adm-nav-badge {
    margin-left: auto; min-width: 18px; height: 18px; border-radius: 9px;
    background: var(--red); color: #fff;
    font-size: 10px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; padding: 0 4px;
    flex-shrink: 0;
  }
  .adm-nav-badge-dot {
    position: absolute; top: 5px; right: 5px;
    width: 7px; height: 7px; border-radius: 50%; background: var(--red);
  }

  .adm-sidebar-user {
    padding: 12px 10px;
    border-top: 1px solid rgba(255,255,255,.08);
  }
  .adm-user-row {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px; border-radius: 9px; cursor: pointer;
    transition: background .12s;
  }
  .adm-user-row:hover { background: rgba(255,255,255,.06); }
  .adm-user-avatar {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    background: #1f2937; border: 1.5px solid var(--teal);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px; color: var(--teal);
  }
  .adm-user-name { font-size: 12px; font-weight: 600; color: #fff; white-space: nowrap; }
  .adm-user-role { font-size: 10px; color: var(--teal); white-space: nowrap; }

  /* ── MAIN ── */
  .adm-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  /* ── HEADER ── */
  .adm-header {
    height: 60px; flex-shrink: 0;
    background: var(--white); border-bottom: 1.5px solid var(--border);
    display: flex; align-items: center; padding: 0 24px; gap: 14px;
    position: relative; z-index: 20;
  }
  .adm-search {
    display: flex; align-items: center; gap: 8px;
    padding: 0 12px; border-radius: 10px;
    border: 1.5px solid var(--border); background: var(--off);
    flex: 1; max-width: 340px; height: 36px; cursor: pointer;
    transition: border-color .15s;
  }
  .adm-search:hover { border-color: var(--teal-bd); }
  .adm-search-active { border-color: var(--teal) !important; background: var(--white); cursor: text; }
  .adm-search input {
    background: none; border: none; outline: none;
    font-family: 'Inter', sans-serif; font-size: 13px; color: var(--ink);
    flex: 1; width: 100%;
  }
  .adm-search input::placeholder { color: var(--ink-4); }
  .adm-search-hint {
    font-size: 11px; color: var(--ink-4);
    border: 1px solid var(--border); border-radius: 4px; padding: 1px 5px;
  }

  .adm-status-pill {
    display: flex; align-items: center; gap: 6px;
    background: var(--teal-bg); border: 1.5px solid var(--teal-bd);
    border-radius: 99px; padding: 5px 12px; flex-shrink: 0;
  }
  .adm-status-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--teal);
  }
  .adm-status-label {
    font-size: 11px; font-weight: 700; color: var(--teal-dk);
    text-transform: uppercase; letter-spacing: .04em; white-space: nowrap;
  }

  .adm-icon-btn {
    width: 36px; height: 36px; border-radius: 9px;
    border: 1.5px solid var(--border); background: var(--white);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; position: relative; transition: all .12s; flex-shrink: 0;
  }
  .adm-icon-btn:hover { background: var(--off); border-color: var(--border-md); }
  .adm-icon-btn.active { background: var(--off); border-color: var(--border-md); }
  .adm-notif-badge {
    position: absolute; top: 5px; right: 5px;
    width: 15px; height: 15px; border-radius: 50%;
    background: var(--red); border: 2px solid var(--white);
    font-size: 8px; font-weight: 700; color: #fff;
    display: flex; align-items: center; justify-content: center;
  }

  .adm-profile-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 5px 10px 5px 5px; border-radius: 10px;
    border: 1.5px solid var(--border); background: var(--white);
    cursor: pointer; transition: all .12s; flex-shrink: 0;
  }
  .adm-profile-btn:hover { background: var(--off); }
  .adm-profile-avatar {
    width: 30px; height: 30px; border-radius: 7px;
    background: var(--ink); display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 12px; color: var(--teal);
  }
  .adm-profile-name { font-size: 12px; font-weight: 600; color: var(--ink); }
  .adm-profile-role { font-size: 10px; color: var(--teal); }

  /* ── DROPDOWN ── */
  .adm-dropdown {
    position: absolute; top: calc(100% + 8px);
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 14px; overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,.10); z-index: 50;
  }
  .adm-dropdown-head {
    padding: 12px 16px; border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
  }
  .adm-dropdown-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; color: var(--ink); }
  .adm-dropdown-action { font-size: 11px; color: var(--teal); font-weight: 600; cursor: pointer; border: none; background: none; }
  .adm-dropdown-item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 11px 16px; border-bottom: 1px solid var(--off);
    cursor: pointer; transition: background .1s;
  }
  .adm-dropdown-item:hover { background: var(--off); }
  .adm-dropdown-item:last-child { border-bottom: none; }
  .adm-dropdown-footer {
    padding: 10px 16px; text-align: center;
    border-top: 1px solid var(--border);
  }
  .adm-dropdown-footer button { font-size: 12px; color: var(--ink-3); background: none; border: none; cursor: pointer; }

  .adm-menu-item {
    width: 100%; display: flex; align-items: center; gap: 10px;
    padding: 9px 16px; background: none; border: none;
    cursor: pointer; font-size: 13px; font-family: 'Inter', sans-serif;
    color: var(--ink-2); transition: background .1s; text-align: left;
  }
  .adm-menu-item:hover { background: var(--off); }
  .adm-menu-item.danger { color: var(--red); }
  .adm-menu-item.danger:hover { background: var(--red-bg); }
  .adm-divider { height: 1px; background: var(--border); margin: 4px 0; }

  /* ── CONTENT ── */
  .adm-content {
    flex: 1; overflow-y: auto; padding: 28px;
    scrollbar-width: thin; scrollbar-color: var(--border) transparent;
  }

  /* ── PAGE HEADER ── */
  .adm-page-header { margin-bottom: 24px; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
  .adm-page-title {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 26px;
    color: var(--ink); letter-spacing: -.04em; line-height: 1.1;
  }
  .adm-page-sub { font-size: 13px; color: var(--ink-3); margin-top: 5px; }
  .adm-page-actions { display: flex; gap: 8px; flex-shrink: 0; }

  /* ── BUTTONS ── */
  .adm-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 16px; border-radius: 9px; border: none;
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all .15s; letter-spacing: -.01em; white-space: nowrap;
  }
  .adm-btn-ghost {
    background: var(--white); color: var(--ink-2); border: 1.5px solid var(--border) !important;
  }
  .adm-btn-ghost:hover { background: var(--off); }
  .adm-btn-primary { background: var(--ink); color: #fff; }
  .adm-btn-primary:hover { background: var(--ink-2); }

  /* ── STAT CARDS ── */
  .adm-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 20px; }
  .adm-stat-card {
    background: var(--white); border: 1.5px solid var(--border); border-radius: 16px;
    padding: 20px; cursor: pointer; transition: all .2s;
  }
  .adm-stat-card:hover { border-color: var(--border-md); box-shadow: 0 6px 20px rgba(0,0,0,.06); }
  .adm-stat-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
  .adm-stat-icon {
    width: 36px; height: 36px; border-radius: 9px;
    background: var(--off); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
  }
  .adm-stat-delta {
    display: flex; align-items: center; gap: 3px;
    font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 99px;
  }
  .adm-stat-delta.up   { background: var(--green-bg); color: var(--green); }
  .adm-stat-delta.down { background: var(--red-bg);   color: var(--red); }
  .adm-stat-value {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 24px;
    color: var(--ink); letter-spacing: -.04em; line-height: 1;
  }
  .adm-stat-label { font-size: 12px; color: var(--ink-3); margin-top: 5px; }
  .adm-stat-sub   { font-size: 11px; color: var(--ink-4); margin-top: 2px; }

  /* ── MID ROW ── */
  .adm-mid { display: grid; grid-template-columns: 1fr 320px; gap: 14px; margin-bottom: 14px; }

  /* ── CARD ── */
  .adm-card { background: var(--white); border: 1.5px solid var(--border); border-radius: 16px; overflow: hidden; }
  .adm-card-head {
    padding: 16px 20px; border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
  }
  .adm-card-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: var(--ink); }
  .adm-card-sub   { font-size: 11px; color: var(--ink-4); margin-top: 3px; }
  .adm-card-link  { font-size: 12px; color: var(--teal); font-weight: 600; background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; }

  /* ── TABLE ── */
  .adm-table { width: 100%; border-collapse: collapse; }
  .adm-th { padding: 9px 16px; text-align: left; font-size: 11px; font-weight: 700; color: var(--ink-4); text-transform: uppercase; letter-spacing: .04em; background: var(--off); }
  .adm-tr { border-top: 1px solid var(--border); cursor: pointer; transition: background .1s; }
  .adm-tr:hover { background: var(--off); }
  .adm-td { padding: 11px 16px; font-size: 12.5px; color: var(--ink-2); }
  .adm-td-id { font-family: 'Syne', sans-serif; font-weight: 700; color: var(--ink); font-size: 12px; }
  .adm-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 9px; border-radius: 99px;
    font-size: 11px; font-weight: 700; border: 1px solid;
  }
  .adm-badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

  /* ── ALERTS LIST ── */
  .adm-alert-item {
    padding: 12px 20px; border-bottom: 1px solid var(--off);
    display: flex; gap: 10px; align-items: flex-start;
    cursor: pointer; transition: background .1s;
  }
  .adm-alert-item:hover { background: var(--off); }
  .adm-alert-item:last-child { border-bottom: none; }
  .adm-alert-icon {
    width: 28px; height: 28px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    border: 1px solid;
  }
  .adm-alert-msg  { font-size: 12px; color: var(--ink-2); line-height: 1.4; }
  .adm-alert-time { font-size: 11px; color: var(--ink-4); margin-top: 2px; }

  /* ── BOTTOM ROW ── */
  .adm-bottom { display: grid; grid-template-columns: 1fr 320px; gap: 14px; }

  /* ── QUICK ACTIONS ── */
  .adm-qa-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; padding: 20px; }
  .adm-qa-btn {
    padding: 16px 14px; border-radius: 12px;
    border: 1.5px solid var(--border); background: var(--off);
    cursor: pointer; display: flex; flex-direction: column; align-items: flex-start; gap: 10px;
    transition: all .15s; font-family: 'Syne', sans-serif;
  }
  .adm-qa-btn:hover { background: var(--white); border-color: var(--teal-bd); }
  .adm-qa-icon { width: 30px; height: 30px; border-radius: 8px; background: var(--teal-bg); display: flex; align-items: center; justify-content: center; }
  .adm-qa-label { font-size: 12px; font-weight: 700; color: var(--ink-2); line-height: 1.2; text-align: left; }

  /* ── SYSTEM STATUS ── */
  .adm-sys-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 8px; }
  .adm-sys-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; border-radius: 10px; border: 1.5px solid;
  }
  .adm-sys-item.ok  { background: var(--green-bg); border-color: var(--green-bd); }
  .adm-sys-item.err { background: var(--red-bg);   border-color: var(--red-bd); }
  .adm-sys-label { font-size: 12px; font-weight: 500; display: flex; align-items: center; gap: 8px; }
  .adm-sys-label.ok  { color: #166534; }
  .adm-sys-label.err { color: #991b1b; }
  .adm-sys-dot { width: 7px; height: 7px; border-radius: 50%; }
  .adm-sys-dot.ok  { background: var(--green); }
  .adm-sys-dot.err { background: var(--red); }
  .adm-sys-status { font-size: 11px; font-weight: 700; }
  .adm-sys-status.ok  { color: var(--green); }
  .adm-sys-status.err { color: var(--red); }

  .adm-mini-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 0 20px 20px; }
  .adm-mini-card { background: var(--off); border: 1.5px solid var(--border); border-radius: 10px; padding: 12px 14px; }
  .adm-mini-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 17px; color: var(--ink); letter-spacing: -.03em; }
  .adm-mini-lbl { font-size: 10px; color: var(--ink-4); margin-top: 2px; }

  /* ── EMPTY STATE ── */
  .adm-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    height: 60vh; gap: 16px; text-align: center;
  }
  .adm-empty-icon {
    width: 64px; height: 64px; border-radius: 16px;
    background: var(--off); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
  }
  .adm-empty-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; color: var(--ink); letter-spacing: -.02em; }
  .adm-empty-sub { font-size: 13px; color: var(--ink-3); line-height: 1.5; }
  .adm-empty-sub code { background: var(--off); border: 1px solid var(--border); border-radius: 4px; padding: 1px 5px; font-size: 12px; }

  @media (max-width: 1100px) {
    .adm-stats { grid-template-columns: repeat(2,1fr); }
    .adm-mid   { grid-template-columns: 1fr; }
    .adm-bottom{ grid-template-columns: 1fr; }
  }
`

// ─── MAIN ────────────────────────────────────────────────────
export default function AdminDashboard({ userName = 'Administrador' }) {
  const [tab,       setTab]       = useState('dashboard')
  const [sidebar,   setSidebar]   = useState(true)
  const [search,    setSearch]    = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [notif,     setNotif]     = useState(false)
  const [profile,   setProfile]   = useState(false)
  const [time,      setTime]      = useState(null) // ← FIX: null para evitar hydration mismatch

  useEffect(() => {
    setTime(new Date()) // ← FIX: solo en cliente
    const t = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const unread = ALERTS.filter(a => a.type === 'error' || a.type === 'warn').length
  const closeAll = () => { setNotif(false); setProfile(false) }

  // ← FIX: guards para cuando time es null
  const hh = time ? time.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }) : '--:--'
  const dd = time ? time.toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long' }) : ''

  return (
    <div className="adm-root">
      <style>{css}</style>

      {/* ══ SIDEBAR ══ */}
      <aside className="adm-sidebar" style={{ width: sidebar ? 240 : 64 }}>
        {/* Top */}
        <div className="adm-sidebar-top">
          <div className="adm-logo-mark">
            <Zap size={16} color="#fff" strokeWidth={2.5} />
          </div>
          {sidebar && (
            <div style={{ overflow: 'hidden' }}>
              <div className="adm-logo-text">Servicios<span>Básicos</span></div>
              <div className="adm-logo-sub">Admin Panel</div>
            </div>
          )}
          <button className="adm-collapse-btn" onClick={() => setSidebar(v => !v)}>
            <Menu size={17} />
          </button>
        </div>

        {/* Nav */}
        <nav className="adm-nav">
          {NAV.map(item => {
            const Icon = item.icon
            const active = tab === item.id
            return (
              <button
                key={item.id}
                className={`adm-nav-btn ${active ? 'active' : ''}`}
                onClick={() => setTab(item.id)}
                title={!sidebar ? item.label : undefined}
                style={{ justifyContent: sidebar ? 'flex-start' : 'center' }}
              >
                <Icon size={17} color={active ? '#fff' : 'rgba(255,255,255,.4)'} strokeWidth={active ? 2.5 : 2} style={{ flexShrink: 0 }} />
                {sidebar && <span className="adm-nav-label">{item.label}</span>}
                {sidebar && item.badge && <span className="adm-nav-badge">{item.badge}</span>}
                {!sidebar && item.badge && <span className="adm-nav-badge-dot" />}
              </button>
            )
          })}
        </nav>

        {/* User */}
        <div className="adm-sidebar-user">
          <div className="adm-user-row" style={{ justifyContent: sidebar ? 'flex-start' : 'center' }}>
            <div className="adm-user-avatar">A</div>
            {sidebar && (
              <div>
                <div className="adm-user-name">{userName}</div>
                <div className="adm-user-role">Administrador</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <div className="adm-main">

        {/* HEADER */}
        <header className="adm-header">
          {/* Search */}
          <div
            className={`adm-search ${search ? 'adm-search-active' : ''}`}
            onClick={() => setSearch(true)}
          >
            <Search size={14} color="var(--ink-4)" />
            {search ? (
              <>
                <input
                  autoFocus
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Buscar usuario, medidor, zona..."
                  onBlur={() => { if (!searchVal) setSearch(false) }}
                />
                {searchVal && (
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', display: 'flex' }}
                    onClick={e => { e.stopPropagation(); setSearchVal(''); setSearch(false) }}>
                    <X size={14} />
                  </button>
                )}
              </>
            ) : (
              <>
                <span style={{ fontSize: 13, color: 'var(--ink-4)', flex: 1 }}>Buscar...</span>
                <span className="adm-search-hint">⌘K</span>
              </>
            )}
          </div>

          {/* Clock */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: 'var(--ink)', letterSpacing: '-.03em' }}>{hh}</div>
            <div style={{ fontSize: 10, color: 'var(--ink-4)', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{dd}</div>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Status */}
            <div className="adm-status-pill">
              <span className="adm-status-dot" />
              <span className="adm-status-label">Sistema activo</span>
            </div>

            {/* Notif */}
            <div style={{ position: 'relative' }}>
              <button className={`adm-icon-btn ${notif ? 'active' : ''}`} onClick={() => { setNotif(v => !v); setProfile(false) }}>
                <Bell size={16} color="var(--ink-3)" />
                {unread > 0 && <span className="adm-notif-badge">{unread}</span>}
              </button>
              <AnimatePresence>
                {notif && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={closeAll} />
                    <motion.div className="adm-dropdown" style={{ right: 0, width: 300 }}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}>
                      <div className="adm-dropdown-head">
                        <span className="adm-dropdown-title">Notificaciones</span>
                        <button className="adm-dropdown-action">Marcar leídas</button>
                      </div>
                      {ALERTS.map((a, i) => {
                        const S = ALERT_STYLE[a.type]; const Icon = S.icon
                        return (
                          <div key={i} className="adm-dropdown-item">
                            <div className="adm-alert-icon" style={{ background: S.bg, borderColor: S.border, color: S.color }}>
                              <Icon size={13} />
                            </div>
                            <div>
                              <div className="adm-alert-msg">{a.msg}</div>
                              <div className="adm-alert-time">{a.time} atrás</div>
                            </div>
                          </div>
                        )
                      })}
                      <div className="adm-dropdown-footer">
                        <button onClick={() => { setTab('alertas'); closeAll() }}>Ver todas las alertas →</button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div style={{ position: 'relative' }}>
              <button className="adm-profile-btn" onClick={() => { setProfile(v => !v); setNotif(false) }}>
                <div className="adm-profile-avatar">A</div>
                <div>
                  <div className="adm-profile-name">{userName}</div>
                  <div className="adm-profile-role">Admin</div>
                </div>
                <ChevronDown size={13} color="var(--ink-4)" style={{ transform: profile ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
              </button>
              <AnimatePresence>
                {profile && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={closeAll} />
                    <motion.div className="adm-dropdown" style={{ right: 0, width: 210 }}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}>
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>{userName}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>admin@sbnet.bo</div>
                      </div>
                      {[{ icon: User, label: 'Mi perfil' }, { icon: Settings, label: 'Configuración' }, { icon: ShieldCheck, label: 'Seguridad' }].map(({ icon: Icon, label }) => (
                        <button key={label} className="adm-menu-item" onClick={closeAll}>
                          <Icon size={14} color="var(--ink-4)" /> {label}
                        </button>
                      ))}
                      <div className="adm-divider" />
                      <button className="adm-menu-item danger">
                        <LogOut size={14} /> Cerrar sesión
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="adm-content">
          <AnimatePresence mode="wait">
            {tab === 'dashboard' ? (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

                {/* Page header */}
                <div className="adm-page-header">
                  <div>
                    <h1 className="adm-page-title">Panel de Administración</h1>
                    <p className="adm-page-sub">Gestión centralizada · Consumo Net · Cochabamba, Bolivia</p>
                  </div>
                  <div className="adm-page-actions">
                    <button className="adm-btn adm-btn-ghost"><RefreshCw size={13} /> Actualizar</button>
                    <button className="adm-btn adm-btn-primary" onClick={() => setTab('lecturas')}>+ Nueva lectura</button>
                  </div>
                </div>

                {/* Stats */}
                <div className="adm-stats">
                  {STATS.map((s, i) => {
                    const Icon = s.icon
                    return (
                      <motion.div key={s.label} className="adm-stat-card"
                        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}>
                        <div className="adm-stat-top">
                          <div className="adm-stat-icon"><Icon size={16} color="var(--ink-3)" /></div>
                          <div className={`adm-stat-delta ${s.up ? 'up' : 'down'}`}>
                            {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {s.delta}
                          </div>
                        </div>
                        <div className="adm-stat-value">{s.value}</div>
                        <div className="adm-stat-label">{s.label}</div>
                        <div className="adm-stat-sub">{s.sub}</div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Mid row */}
                <div className="adm-mid">
                  {/* Table */}
                  <div className="adm-card">
                    <div className="adm-card-head">
                      <div>
                        <div className="adm-card-title">Lecturas recientes</div>
                        <div className="adm-card-sub">Últimas 5 lecturas registradas</div>
                      </div>
                      <button className="adm-card-link" onClick={() => setTab('lecturas')}>
                        Ver todas <ArrowUpRight size={13} />
                      </button>
                    </div>
                    <table className="adm-table">
                      <thead>
                        <tr>{['Medidor','Usuario','Zona','Lectura','Estado','Fecha'].map(h =>
                          <th key={h} className="adm-th">{h}</th>
                        )}</tr>
                      </thead>
                      <tbody>
                        {RECENT_READINGS.map(r => {
                          const st = ESTADO_STYLE[r.estado]
                          return (
                            <tr key={r.id} className="adm-tr">
                              <td className="adm-td adm-td-id">{r.id}</td>
                              <td className="adm-td">{r.user}</td>
                              <td className="adm-td" style={{ color: 'var(--ink-4)' }}>{r.zona}</td>
                              <td className="adm-td" style={{ fontWeight: 600, color: 'var(--ink)' }}>{r.lectura}</td>
                              <td className="adm-td">
                                <span className="adm-badge" style={{ background: st.bg, color: st.color, borderColor: st.border }}>
                                  <span className="adm-badge-dot" style={{ background: st.dot }} />
                                  {r.estado}
                                </span>
                              </td>
                              <td className="adm-td" style={{ color: 'var(--ink-4)', fontSize: 11 }}>{r.fecha}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Alerts */}
                  <div className="adm-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="adm-card-head">
                      <div className="adm-card-title">Alertas</div>
                      <span className="adm-badge" style={{ background: 'var(--red-bg)', color: 'var(--red)', borderColor: 'var(--red-bd)' }}>
                        {unread} activas
                      </span>
                    </div>
                    {ALERTS.map((a, i) => {
                      const S = ALERT_STYLE[a.type]; const Icon = S.icon
                      return (
                        <div key={i} className="adm-alert-item">
                          <div className="adm-alert-icon" style={{ background: S.bg, borderColor: S.border, color: S.color }}>
                            <Icon size={13} />
                          </div>
                          <div>
                            <div className="adm-alert-msg">{a.msg}</div>
                            <div className="adm-alert-time">{a.time} atrás</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Bottom row */}
                <div className="adm-bottom">
                  {/* Quick actions */}
                  <div className="adm-card">
                    <div className="adm-card-head">
                      <div className="adm-card-title">Acciones rápidas</div>
                    </div>
                    <div className="adm-qa-grid">
                      {QUICK_ACTIONS.map(qa => {
                        const Icon = qa.icon
                        return (
                          <button key={qa.label} className="adm-qa-btn" onClick={() => setTab(qa.tab)}>
                            <div className="adm-qa-icon"><Icon size={15} color="var(--teal)" /></div>
                            <span className="adm-qa-label">{qa.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* System */}
                  <div className="adm-card">
                    <div className="adm-card-head">
                      <div className="adm-card-title">Estado del sistema</div>
                    </div>
                    <div className="adm-sys-list">
                      {SYSTEM.map(s => (
                        <div key={s.label} className={`adm-sys-item ${s.ok ? 'ok' : 'err'}`}>
                          <span className={`adm-sys-label ${s.ok ? 'ok' : 'err'}`}>
                            <span className={`adm-sys-dot ${s.ok ? 'ok' : 'err'}`} />
                            {s.label}
                          </span>
                          <span className={`adm-sys-status ${s.ok ? 'ok' : 'err'}`}>{s.ok ? 'Conectado' : 'Error'}</span>
                        </div>
                      ))}
                    </div>
                    <div className="adm-mini-grid">
                      {[{ label: 'Uptime', val: '99.8%' }, { label: 'Latencia', val: '12ms' }, { label: 'Peticiones/h', val: '3,241' }, { label: 'Errores', val: '0.02%' }].map(m => (
                        <div key={m.label} className="adm-mini-card">
                          <div className="adm-mini-val">{m.val}</div>
                          <div className="adm-mini-lbl">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </motion.div>

            ) : tab === 'usuarios' ? (
              // ← USUARIOS conectado
              <motion.div key="usuarios" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <Usuarios />
              </motion.div>

            ) : (
              // ── EMPTY STATE para tabs sin componente aún ──
              <motion.div key={tab} className="adm-empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {(() => {
                  const item = NAV.find(n => n.id === tab)
                  const Icon = item?.icon ?? LayoutDashboard
                  return (
                    <>
                      <div className="adm-empty-icon"><Icon size={28} color="var(--ink-4)" /></div>
                      <div>
                        <div className="adm-empty-title">{item?.label}</div>
                        <div className="adm-empty-sub" style={{ marginTop: 6 }}>
                          Conecta tu componente existente aquí.<br />
                          Importa <code>{item?.id}.jsx</code> y renderízalo.
                        </div>
                      </div>
                      <button className="adm-btn adm-btn-ghost" onClick={() => setTab('dashboard')}>← Volver al panel</button>
                    </>
                  )
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}