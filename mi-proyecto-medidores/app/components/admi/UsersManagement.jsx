'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Search, X, Plus, ChevronDown, MoreHorizontal,
  User, Mail, Phone, MapPin, Gauge, Calendar, Tag,
  CheckCircle2, AlertTriangle, Edit2, Trash2, Eye,
  Filter, Download, RefreshCw, ArrowUpRight, Shield,
  Percent, Home, Building2, Briefcase, XCircle,
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// ─── CONSTANTS ────────────────────────────────────────────────
const TIPO_META = {
  domestico:   { label: 'Doméstico',   icon: Home,      bg: 'var(--teal-bg)',   color: 'var(--teal)',   border: 'var(--teal-bd)' },
  comercial:   { label: 'Comercial',   icon: Building2, bg: 'var(--indigo-bg)', color: 'var(--indigo)', border: 'var(--indigo-bd)' },
  industrial:  { label: 'Industrial',  icon: Briefcase, bg: 'var(--amber-bg)',  color: 'var(--amber)',  border: 'var(--amber-bd)' },
}

const ROL_META = {
  admin:   { label: 'Admin',   bg: 'var(--red-bg)',   color: 'var(--red)',    border: 'var(--red-bd)' },
  tecnico: { label: 'Técnico', bg: 'var(--amber-bg)', color: 'var(--amber)',  border: 'var(--amber-bd)' },
  usuario: { label: 'Usuario', bg: 'var(--green-bg)', color: 'var(--green)',  border: 'var(--green-bd)' },
}

const TIPO_OPTIONS  = ['todos', 'domestico', 'comercial', 'industrial']
const ROL_OPTIONS   = ['todos', 'admin', 'tecnico', 'usuario']
const PAGE_SIZE     = 10

// ─── CSS ──────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .u-wrap {
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
    color: var(--ink);
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* ── PAGE HEADER ── */
  .u-page-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: 16px; margin-bottom: 24px; flex-wrap: wrap;
  }
  .u-page-title {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 26px;
    color: var(--ink); letter-spacing: -.04em; line-height: 1.1;
  }
  .u-page-sub { font-size: 13px; color: var(--ink-3); margin-top: 5px; }
  .u-page-actions { display: flex; gap: 8px; flex-wrap: wrap; }

  /* ── BUTTONS ── */
  .u-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 16px; border-radius: 9px; border: none;
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all .15s; letter-spacing: -.01em; white-space: nowrap;
  }
  .u-btn-ghost {
    background: var(--white); color: var(--ink-2); border: 1.5px solid var(--border) !important;
  }
  .u-btn-ghost:hover { background: var(--off); }
  .u-btn-primary { background: var(--ink); color: #fff; }
  .u-btn-primary:hover { background: var(--ink-2); }
  .u-btn-danger { background: var(--red-bg); color: var(--red); border: 1.5px solid var(--red-bd) !important; }
  .u-btn-danger:hover { background: #fee2e2; }

  /* ── SUMMARY CARDS ── */
  .u-summary { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 18px; }
  .u-sum-card {
    background: var(--white); border: 1.5px solid var(--border); border-radius: 14px;
    padding: 16px 18px; display: flex; align-items: center; gap: 12px;
  }
  .u-sum-icon {
    width: 36px; height: 36px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .u-sum-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; color: var(--ink); letter-spacing: -.03em; }
  .u-sum-lbl { font-size: 11px; color: var(--ink-4); margin-top: 1px; }

  /* ── TOOLBAR ── */
  .u-toolbar {
    display: flex; gap: 10px; align-items: center; margin-bottom: 14px; flex-wrap: wrap;
  }
  .u-search {
    display: flex; align-items: center; gap: 8px;
    padding: 0 12px; border-radius: 10px;
    border: 1.5px solid var(--border); background: var(--white);
    flex: 1; min-width: 200px; height: 38px;
    transition: border-color .15s;
  }
  .u-search:focus-within { border-color: var(--teal); }
  .u-search input {
    background: none; border: none; outline: none;
    font-family: 'Inter', sans-serif; font-size: 13px; color: var(--ink);
    flex: 1; width: 100%;
  }
  .u-search input::placeholder { color: var(--ink-4); }

  .u-select {
    height: 38px; padding: 0 10px; border-radius: 9px;
    border: 1.5px solid var(--border); background: var(--white);
    font-family: 'Inter', sans-serif; font-size: 13px; color: var(--ink-2);
    cursor: pointer; outline: none; appearance: none;
    padding-right: 28px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23b0b0ac' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 8px center;
  }
  .u-select:focus { border-color: var(--teal); }

  /* ── TABLE ── */
  .u-card {
    background: var(--white); border: 1.5px solid var(--border); border-radius: 16px;
    overflow: hidden; flex: 1;
  }
  .u-table-wrap { overflow-x: auto; }
  .u-table { width: 100%; border-collapse: collapse; min-width: 900px; }
  .u-th {
    padding: 10px 16px; text-align: left;
    font-size: 11px; font-weight: 700; color: var(--ink-4);
    text-transform: uppercase; letter-spacing: .04em;
    background: var(--off); border-bottom: 1.5px solid var(--border);
    white-space: nowrap;
  }
  .u-tr { border-bottom: 1px solid var(--border); transition: background .1s; }
  .u-tr:hover { background: #fafaf9; }
  .u-tr:last-child { border-bottom: none; }
  .u-td { padding: 13px 16px; font-size: 13px; color: var(--ink-2); vertical-align: middle; }

  .u-avatar {
    width: 34px; height: 34px; border-radius: 9px;
    background: var(--ink); color: var(--teal);
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; overflow: hidden;
  }
  .u-avatar img { width: 100%; height: 100%; object-fit: cover; }

  .u-user-name { font-weight: 600; color: var(--ink); font-size: 13px; line-height: 1.2; }
  .u-user-email { font-size: 11px; color: var(--ink-4); margin-top: 1px; }

  .u-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 9px; border-radius: 99px;
    font-size: 11px; font-weight: 700; border: 1px solid; white-space: nowrap;
  }
  .u-badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

  .u-meter-chip {
    display: inline-flex; align-items: center; gap: 4px;
    background: var(--off); border: 1px solid var(--border);
    border-radius: 6px; padding: 2px 8px;
    font-size: 11px; font-weight: 600; color: var(--ink-3); font-family: 'Syne', sans-serif;
  }

  /* ── ACTIONS MENU ── */
  .u-actions-wrap { position: relative; display: inline-block; }
  .u-actions-btn {
    width: 30px; height: 30px; border-radius: 7px;
    border: 1.5px solid var(--border); background: var(--white);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .12s;
  }
  .u-actions-btn:hover { background: var(--off); border-color: var(--border-md); }
  .u-actions-menu {
    position: absolute; right: 0; top: calc(100% + 6px); z-index: 50;
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 12px; overflow: hidden; min-width: 160px;
    box-shadow: 0 8px 24px rgba(0,0,0,.10);
  }
  .u-action-item {
    width: 100%; display: flex; align-items: center; gap: 9px;
    padding: 9px 14px; background: none; border: none;
    font-family: 'Inter', sans-serif; font-size: 13px; color: var(--ink-2);
    cursor: pointer; transition: background .1s; text-align: left;
  }
  .u-action-item:hover { background: var(--off); }
  .u-action-item.danger { color: var(--red); }
  .u-action-item.danger:hover { background: var(--red-bg); }
  .u-divider { height: 1px; background: var(--border); }

  /* ── PAGINATION ── */
  .u-pagination {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px; border-top: 1px solid var(--border);
    flex-wrap: wrap; gap: 10px;
  }
  .u-pag-info { font-size: 12px; color: var(--ink-4); }
  .u-pag-btns { display: flex; gap: 4px; }
  .u-pag-btn {
    min-width: 32px; height: 32px; border-radius: 7px;
    border: 1.5px solid var(--border); background: var(--white);
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 12px;
    color: var(--ink-2); cursor: pointer; transition: all .12s;
    display: flex; align-items: center; justify-content: center; padding: 0 6px;
  }
  .u-pag-btn:hover:not(:disabled) { background: var(--off); border-color: var(--border-md); }
  .u-pag-btn.active { background: var(--ink); color: #fff; border-color: var(--ink); }
  .u-pag-btn:disabled { opacity: .35; cursor: not-allowed; }

  /* ── EMPTY / LOADING ── */
  .u-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 60px 20px; gap: 12px; text-align: center;
  }
  .u-state-icon {
    width: 52px; height: 52px; border-radius: 13px;
    background: var(--off); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
  }
  .u-state-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 16px; color: var(--ink); }
  .u-state-sub   { font-size: 13px; color: var(--ink-3); }

  .u-skeleton {
    background: linear-gradient(90deg, var(--off) 25%, var(--border) 50%, var(--off) 75%);
    background-size: 200% 100%;
    animation: u-shimmer 1.4s infinite;
    border-radius: 6px;
  }
  @keyframes u-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  /* ── MODAL ── */
  .u-backdrop {
    position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 60;
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .u-modal {
    background: var(--white); border-radius: 20px; width: 100%; max-width: 540px;
    max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 64px rgba(0,0,0,.18);
  }
  .u-modal-head {
    padding: 20px 24px 16px; border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
    position: sticky; top: 0; background: var(--white); z-index: 1;
  }
  .u-modal-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; color: var(--ink); letter-spacing: -.03em; }
  .u-modal-sub   { font-size: 12px; color: var(--ink-4); margin-top: 3px; }
  .u-modal-close {
    width: 30px; height: 30px; border-radius: 7px; flex-shrink: 0;
    border: 1.5px solid var(--border); background: var(--off);
    display: flex; align-items: center; justify-content: center; cursor: pointer;
  }
  .u-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
  .u-modal-footer {
    padding: 16px 24px; border-top: 1px solid var(--border);
    display: flex; justify-content: flex-end; gap: 10px;
    position: sticky; bottom: 0; background: var(--white);
  }

  /* ── FORM ── */
  .u-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .u-form-group { display: flex; flex-direction: column; gap: 5px; }
  .u-form-group.full { grid-column: 1 / -1; }
  .u-label { font-size: 11px; font-weight: 700; color: var(--ink-3); text-transform: uppercase; letter-spacing: .04em; }
  .u-input {
    height: 38px; padding: 0 12px; border-radius: 9px;
    border: 1.5px solid var(--border); background: var(--off);
    font-family: 'Inter', sans-serif; font-size: 13px; color: var(--ink);
    outline: none; transition: border-color .15s; width: 100%;
  }
  .u-input:focus { border-color: var(--teal); background: var(--white); }
  .u-input::placeholder { color: var(--ink-4); }
  .u-select-full {
    height: 38px; padding: 0 32px 0 12px; border-radius: 9px;
    border: 1.5px solid var(--border); background: var(--off);
    font-family: 'Inter', sans-serif; font-size: 13px; color: var(--ink);
    outline: none; appearance: none; width: 100%; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23b0b0ac' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 10px center;
    transition: border-color .15s;
  }
  .u-select-full:focus { border-color: var(--teal); background: var(--white); }

  /* ── DETAIL VIEW ── */
  .u-detail-header {
    display: flex; align-items: center; gap: 16px;
    padding: 20px 24px; border-bottom: 1px solid var(--border);
  }
  .u-detail-avatar {
    width: 56px; height: 56px; border-radius: 14px;
    background: var(--ink); color: var(--teal);
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;
  }
  .u-detail-name { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; color: var(--ink); letter-spacing: -.03em; }
  .u-detail-meta { font-size: 12px; color: var(--ink-4); margin-top: 3px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

  .u-detail-section { padding: 20px 24px; border-bottom: 1px solid var(--border); }
  .u-detail-section-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 12px; color: var(--ink-4); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 14px; }
  .u-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .u-detail-field { display: flex; flex-direction: column; gap: 3px; }
  .u-detail-field-label { font-size: 10px; font-weight: 700; color: var(--ink-4); text-transform: uppercase; letter-spacing: .05em; }
  .u-detail-field-value { font-size: 13px; color: var(--ink-2); font-weight: 500; }

  .u-meter-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; border-radius: 10px; background: var(--off); border: 1.5px solid var(--border);
    margin-bottom: 8px;
  }
  .u-meter-num { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; color: var(--ink); }
  .u-meter-dir { font-size: 11px; color: var(--ink-4); margin-top: 2px; }

  @media (max-width: 768px) {
    .u-summary { grid-template-columns: repeat(2,1fr); }
    .u-form-grid { grid-template-columns: 1fr; }
    .u-detail-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 480px) {
    .u-summary { grid-template-columns: 1fr 1fr; }
  }
`

// ─── HELPERS ─────────────────────────────────────────────────
function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'
}
function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })
}
function fmtTipo(t) { return TIPO_META[t] || TIPO_META.domestico }
function fmtRol(r)  { return ROL_META[r]  || ROL_META.usuario }

// ─── COMPONENT ───────────────────────────────────────────────
export default function Usuarios() {
  const [usuarios,    setUsuarios]   = useState([])
  const [total,       setTotal]      = useState(0)
  const [loading,     setLoading]    = useState(true)
  const [error,       setError]      = useState(null)
  const [search,      setSearch]     = useState('')
  const [filterTipo,  setFilterTipo] = useState('todos')
  const [filterRol,   setFilterRol]  = useState('todos')
  const [page,        setPage]       = useState(1)
  const [openMenu,    setOpenMenu]   = useState(null)
  const [modal,       setModal]      = useState(null)   // null | 'create' | 'edit' | 'detail' | 'delete'
  const [selected,    setSelected]   = useState(null)
  const [saving,      setSaving]     = useState(false)
  const [summary,     setSummary]    = useState({ total: 0, domestico: 0, comercial: 0, industrial: 0 })

  const [form, setForm] = useState({
    nombre: '', correo: '', telefono: '', direccion: '',
    rol: 'usuario', tipo_usuario: 'domestico', descuento: 0,
  })

  // ── FETCH ──
  const fetchUsuarios = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      let q = supabase
        .from('usuarios')
        .select(`
          id, nombre, correo, telefono, direccion, rol,
          tipo_usuario, descuento, fecha_registro, foto,
          medidores(id, numero_medidor, direccion, estado, id_servicio,
            servicios(nombre_servicio))
        `, { count: 'exact' })
        .order('fecha_registro', { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

      if (search)      q = q.or(`nombre.ilike.%${search}%,correo.ilike.%${search}%,telefono.ilike.%${search}%`)
      if (filterTipo !== 'todos') q = q.eq('tipo_usuario', filterTipo)
      if (filterRol  !== 'todos') q = q.eq('rol', filterRol)

      const { data, count, error: err } = await q
      if (err) throw err
      setUsuarios(data || [])
      setTotal(count || 0)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [search, filterTipo, filterRol, page])

  const fetchSummary = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('usuarios')
        .select('tipo_usuario')
      if (!data) return
      const s = { total: data.length, domestico: 0, comercial: 0, industrial: 0 }
      data.forEach(u => { if (s[u.tipo_usuario] !== undefined) s[u.tipo_usuario]++ })
      setSummary(s)
    } catch {}
  }, [])

  useEffect(() => { fetchSummary() }, [fetchSummary])
  useEffect(() => { setPage(1) }, [search, filterTipo, filterRol])
  useEffect(() => { fetchUsuarios() }, [fetchUsuarios])

  // close menu on outside click
  useEffect(() => {
    const close = () => setOpenMenu(null)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  // ── FORM ──
  const openCreate = () => {
    setForm({ nombre: '', correo: '', telefono: '', direccion: '', rol: 'usuario', tipo_usuario: 'domestico', descuento: 0 })
    setModal('create')
  }
  const openEdit = (u) => {
    setSelected(u)
    setForm({ nombre: u.nombre, correo: u.correo, telefono: u.telefono || '', direccion: u.direccion || '', rol: u.rol, tipo_usuario: u.tipo_usuario, descuento: u.descuento || 0 })
    setModal('edit')
  }
  const openDetail = (u) => { setSelected(u); setModal('detail') }
  const openDelete = (u) => { setSelected(u); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null) }

  const handleSave = async () => {
    if (!form.nombre || !form.correo) return
    setSaving(true)
    try {
      if (modal === 'create') {
        const { error: err } = await supabase.from('usuarios').insert({
          nombre: form.nombre, correo: form.correo, telefono: form.telefono,
          direccion: form.direccion, rol: form.rol, tipo_usuario: form.tipo_usuario,
          descuento: Number(form.descuento),
        })
        if (err) throw err
      } else {
        const { error: err } = await supabase.from('usuarios').update({
          nombre: form.nombre, correo: form.correo, telefono: form.telefono,
          direccion: form.direccion, rol: form.rol, tipo_usuario: form.tipo_usuario,
          descuento: Number(form.descuento),
        }).eq('id', selected.id)
        if (err) throw err
      }
      closeModal(); fetchUsuarios(); fetchSummary()
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      const { error: err } = await supabase.from('usuarios').delete().eq('id', selected.id)
      if (err) throw err
      closeModal(); fetchUsuarios(); fetchSummary()
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  // ── RENDER ──
  return (
    <div className="u-wrap">
      <style>{css}</style>

      {/* Page header */}
      <div className="u-page-header">
        <div>
          <h1 className="u-page-title">Usuarios</h1>
          <p className="u-page-sub">{total} registros · gestión de clientes del servicio</p>
        </div>
        <div className="u-page-actions">
          <button className="u-btn u-btn-ghost" onClick={fetchUsuarios}>
            <RefreshCw size={13} /> Actualizar
          </button>
          <button className="u-btn u-btn-ghost">
            <Download size={13} /> Exportar
          </button>
          <button className="u-btn u-btn-primary" onClick={openCreate}>
            <Plus size={14} /> Nuevo usuario
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="u-summary">
        {[
          { label: 'Total usuarios', val: summary.total,      bg: 'var(--off)',        color: 'var(--ink-3)',  icon: Users },
          { label: 'Domésticos',     val: summary.domestico,  bg: 'var(--teal-bg)',    color: 'var(--teal)',   icon: Home },
          { label: 'Comerciales',    val: summary.comercial,  bg: 'var(--indigo-bg)',  color: 'var(--indigo)', icon: Building2 },
          { label: 'Industriales',   val: summary.industrial, bg: 'var(--amber-bg)',   color: 'var(--amber)',  icon: Briefcase },
        ].map(({ label, val, bg, color, icon: Icon }) => (
          <div key={label} className="u-sum-card">
            <div className="u-sum-icon" style={{ background: bg }}>
              <Icon size={16} color={color} />
            </div>
            <div>
              <div className="u-sum-val">{val}</div>
              <div className="u-sum-lbl">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="u-toolbar">
        <div className="u-search">
          <Search size={14} color="var(--ink-4)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo o teléfono..."
          />
          {search && (
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--ink-4)' }}
              onClick={() => setSearch('')}>
              <X size={13} />
            </button>
          )}
        </div>
        <select className="u-select" value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
          {TIPO_OPTIONS.map(t => <option key={t} value={t}>{t === 'todos' ? 'Todos los tipos' : TIPO_META[t]?.label}</option>)}
        </select>
        <select className="u-select" value={filterRol} onChange={e => setFilterRol(e.target.value)}>
          {ROL_OPTIONS.map(r => <option key={r} value={r}>{r === 'todos' ? 'Todos los roles' : ROL_META[r]?.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="u-card">
        <div className="u-table-wrap">
          <table className="u-table">
            <thead>
              <tr>
                {['Usuario','Contacto','Tipo','Rol','Medidores','Descuento','Registro',''].map(h =>
                  <th key={h} className="u-th">{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="u-tr">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="u-td">
                        <div className="u-skeleton" style={{ height: 14, width: j === 0 ? 160 : j === 7 ? 30 : 80 }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr><td colSpan={8}>
                  <div className="u-state">
                    <div className="u-state-icon"><AlertTriangle size={22} color="var(--red)" /></div>
                    <div className="u-state-title">Error al cargar</div>
                    <div className="u-state-sub">{error}</div>
                    <button className="u-btn u-btn-ghost" style={{ marginTop: 8 }} onClick={fetchUsuarios}>Reintentar</button>
                  </div>
                </td></tr>
              ) : usuarios.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="u-state">
                    <div className="u-state-icon"><Users size={22} color="var(--ink-4)" /></div>
                    <div className="u-state-title">Sin resultados</div>
                    <div className="u-state-sub">No se encontraron usuarios con los filtros actuales.</div>
                  </div>
                </td></tr>
              ) : (
                usuarios.map((u, idx) => {
                  const tipo = fmtTipo(u.tipo_usuario)
                  const rol  = fmtRol(u.rol)
                  const TipoIcon = tipo.icon
                  return (
                    <motion.tr key={u.id} className="u-tr"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}>

                      {/* Usuario */}
                      <td className="u-td">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="u-avatar">
                            {u.foto
                              ? <img src={u.foto} alt={u.nombre} />
                              : initials(u.nombre)}
                          </div>
                          <div>
                            <div className="u-user-name">{u.nombre}</div>
                            <div className="u-user-email">{u.correo}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contacto */}
                      <td className="u-td">
                        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                          {u.telefono || <span style={{ color: 'var(--ink-4)' }}>—</span>}
                        </div>
                        {u.direccion && (
                          <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {u.direccion}
                          </div>
                        )}
                      </td>

                      {/* Tipo */}
                      <td className="u-td">
                        <span className="u-badge" style={{ background: tipo.bg, color: tipo.color, borderColor: tipo.border }}>
                          <TipoIcon size={10} />
                          {tipo.label}
                        </span>
                      </td>

                      {/* Rol */}
                      <td className="u-td">
                        <span className="u-badge" style={{ background: rol.bg, color: rol.color, borderColor: rol.border }}>
                          {rol.label}
                        </span>
                      </td>

                      {/* Medidores */}
                      <td className="u-td">
                        {u.medidores?.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {u.medidores.slice(0, 2).map(m => (
                              <span key={m.id} className="u-meter-chip">
                                <Gauge size={9} /> {m.numero_medidor}
                              </span>
                            ))}
                            {u.medidores.length > 2 && (
                              <span className="u-meter-chip">+{u.medidores.length - 2}</span>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>Sin medidor</span>
                        )}
                      </td>

                      {/* Descuento */}
                      <td className="u-td">
                        {Number(u.descuento) > 0 ? (
                          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--green)' }}>
                            {u.descuento}%
                          </span>
                        ) : (
                          <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>—</span>
                        )}
                      </td>

                      {/* Fecha */}
                      <td className="u-td">
                        <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>{fmtDate(u.fecha_registro)}</span>
                      </td>

                      {/* Acciones */}
                      <td className="u-td">
                        <div className="u-actions-wrap" onClick={e => e.stopPropagation()}>
                          <button className="u-actions-btn" onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}>
                            <MoreHorizontal size={14} color="var(--ink-4)" />
                          </button>
                          <AnimatePresence>
                            {openMenu === u.id && (
                              <motion.div className="u-actions-menu"
                                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                animate={{ opacity: 1, scale: 1,    y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                transition={{ duration: 0.12 }}>
                                <button className="u-action-item" onClick={() => { openDetail(u); setOpenMenu(null) }}>
                                  <Eye size={13} color="var(--ink-4)" /> Ver detalle
                                </button>
                                <button className="u-action-item" onClick={() => { openEdit(u); setOpenMenu(null) }}>
                                  <Edit2 size={13} color="var(--ink-4)" /> Editar
                                </button>
                                <div className="u-divider" />
                                <button className="u-action-item danger" onClick={() => { openDelete(u); setOpenMenu(null) }}>
                                  <Trash2 size={13} /> Eliminar
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && !error && total > PAGE_SIZE && (
          <div className="u-pagination">
            <span className="u-pag-info">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} de {total} usuarios
            </span>
            <div className="u-pag-btns">
              <button className="u-pag-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let p
                if (totalPages <= 7) p = i + 1
                else if (page <= 4) p = i + 1
                else if (page >= totalPages - 3) p = totalPages - 6 + i
                else p = page - 3 + i
                return (
                  <button key={p} className={`u-pag-btn ${p === page ? 'active' : ''}`}
                    onClick={() => setPage(p)}>{p}</button>
                )
              })}
              <button className="u-pag-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          </div>
        )}
      </div>

      {/* ══ MODALS ══ */}
      <AnimatePresence>
        {/* CREATE / EDIT */}
        {(modal === 'create' || modal === 'edit') && (
          <motion.div className="u-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
            <motion.div className="u-modal" initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }} transition={{ duration: 0.2 }}>
              <div className="u-modal-head">
                <div>
                  <div className="u-modal-title">{modal === 'create' ? 'Nuevo usuario' : 'Editar usuario'}</div>
                  <div className="u-modal-sub">{modal === 'create' ? 'Completa los datos para registrar un nuevo usuario' : `Editando: ${selected?.nombre}`}</div>
                </div>
                <button className="u-modal-close" onClick={closeModal}><X size={14} /></button>
              </div>
              <div className="u-modal-body">
                <div className="u-form-grid">
                  <div className="u-form-group full">
                    <label className="u-label">Nombre completo *</label>
                    <input className="u-input" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Ej: Carlos Mamani" />
                  </div>
                  <div className="u-form-group">
                    <label className="u-label">Correo electrónico *</label>
                    <input className="u-input" type="email" value={form.correo} onChange={e => setForm(f => ({ ...f, correo: e.target.value }))} placeholder="correo@ejemplo.com" />
                  </div>
                  <div className="u-form-group">
                    <label className="u-label">Teléfono</label>
                    <input className="u-input" value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} placeholder="Ej: 70012345" />
                  </div>
                  <div className="u-form-group full">
                    <label className="u-label">Dirección</label>
                    <input className="u-input" value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} placeholder="Calle, número, zona..." />
                  </div>
                  <div className="u-form-group">
                    <label className="u-label">Tipo de usuario</label>
                    <select className="u-select-full" value={form.tipo_usuario} onChange={e => setForm(f => ({ ...f, tipo_usuario: e.target.value }))}>
                      <option value="domestico">Doméstico</option>
                      <option value="comercial">Comercial</option>
                      <option value="industrial">Industrial</option>
                    </select>
                  </div>
                  <div className="u-form-group">
                    <label className="u-label">Rol</label>
                    <select className="u-select-full" value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}>
                      <option value="usuario">Usuario</option>
                      <option value="tecnico">Técnico</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  <div className="u-form-group">
                    <label className="u-label">Descuento (%)</label>
                    <input className="u-input" type="number" min="0" max="100" value={form.descuento} onChange={e => setForm(f => ({ ...f, descuento: e.target.value }))} placeholder="0" />
                  </div>
                </div>
              </div>
              <div className="u-modal-footer">
                <button className="u-btn u-btn-ghost" onClick={closeModal}>Cancelar</button>
                <button className="u-btn u-btn-primary" onClick={handleSave} disabled={saving || !form.nombre || !form.correo}>
                  {saving ? 'Guardando...' : modal === 'create' ? 'Crear usuario' : 'Guardar cambios'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* DETAIL */}
        {modal === 'detail' && selected && (
          <motion.div className="u-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
            <motion.div className="u-modal" style={{ maxWidth: 560 }} initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }} transition={{ duration: 0.2 }}>
              {/* Header */}
              <div className="u-detail-header">
                <div className="u-detail-avatar">
                  {selected.foto ? <img src={selected.foto} alt={selected.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials(selected.nombre)}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="u-detail-name">{selected.nombre}</div>
                  <div className="u-detail-meta">
                    <span className="u-badge" style={{ background: fmtRol(selected.rol).bg, color: fmtRol(selected.rol).color, borderColor: fmtRol(selected.rol).border }}>
                      {fmtRol(selected.rol).label}
                    </span>
                    <span className="u-badge" style={{ background: fmtTipo(selected.tipo_usuario).bg, color: fmtTipo(selected.tipo_usuario).color, borderColor: fmtTipo(selected.tipo_usuario).border }}>
                      {fmtTipo(selected.tipo_usuario).label}
                    </span>
                  </div>
                </div>
                <button className="u-modal-close" onClick={closeModal}><X size={14} /></button>
              </div>

              {/* Info */}
              <div className="u-detail-section">
                <div className="u-detail-section-title">Información personal</div>
                <div className="u-detail-grid">
                  <div className="u-detail-field">
                    <span className="u-detail-field-label">Correo</span>
                    <span className="u-detail-field-value">{selected.correo}</span>
                  </div>
                  <div className="u-detail-field">
                    <span className="u-detail-field-label">Teléfono</span>
                    <span className="u-detail-field-value">{selected.telefono || '—'}</span>
                  </div>
                  <div className="u-detail-field" style={{ gridColumn: '1 / -1' }}>
                    <span className="u-detail-field-label">Dirección</span>
                    <span className="u-detail-field-value">{selected.direccion || '—'}</span>
                  </div>
                  <div className="u-detail-field">
                    <span className="u-detail-field-label">Descuento</span>
                    <span className="u-detail-field-value">{selected.descuento > 0 ? `${selected.descuento}%` : '—'}</span>
                  </div>
                  <div className="u-detail-field">
                    <span className="u-detail-field-label">Fecha de registro</span>
                    <span className="u-detail-field-value">{fmtDate(selected.fecha_registro)}</span>
                  </div>
                </div>
              </div>

              {/* Medidores */}
              <div className="u-detail-section" style={{ borderBottom: 'none' }}>
                <div className="u-detail-section-title">Medidores asignados ({selected.medidores?.length || 0})</div>
                {selected.medidores?.length > 0 ? (
                  selected.medidores.map(m => {
                    const estadoBg = m.estado === 'activo' ? 'var(--green-bg)' : 'var(--red-bg)'
                    const estadoColor = m.estado === 'activo' ? 'var(--green)' : 'var(--red)'
                    const estadoBd = m.estado === 'activo' ? 'var(--green-bd)' : 'var(--red-bd)'
                    return (
                      <div key={m.id} className="u-meter-row">
                        <div>
                          <div className="u-meter-num"><Gauge size={11} style={{ marginRight: 5, verticalAlign: 'middle' }} />{m.numero_medidor}</div>
                          <div className="u-meter-dir">{m.direccion} {m.servicios?.nombre_servicio ? `· ${m.servicios.nombre_servicio}` : ''}</div>
                        </div>
                        <span className="u-badge" style={{ background: estadoBg, color: estadoColor, borderColor: estadoBd }}>
                          {m.estado}
                        </span>
                      </div>
                    )
                  })
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--ink-4)', textAlign: 'center', padding: '16px 0' }}>
                    Sin medidores asignados
                  </div>
                )}
              </div>

              <div className="u-modal-footer">
                <button className="u-btn u-btn-ghost" onClick={closeModal}>Cerrar</button>
                <button className="u-btn u-btn-primary" onClick={() => { closeModal(); setTimeout(() => openEdit(selected), 50) }}>
                  <Edit2 size={13} /> Editar usuario
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* DELETE */}
        {modal === 'delete' && selected && (
          <motion.div className="u-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
            <motion.div className="u-modal" style={{ maxWidth: 420 }} initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }} transition={{ duration: 0.18 }}>
              <div className="u-modal-head">
                <div>
                  <div className="u-modal-title" style={{ color: 'var(--red)' }}>Eliminar usuario</div>
                  <div className="u-modal-sub">Esta acción no se puede deshacer</div>
                </div>
                <button className="u-modal-close" onClick={closeModal}><X size={14} /></button>
              </div>
              <div className="u-modal-body">
                <div style={{ background: 'var(--red-bg)', border: '1.5px solid var(--red-bd)', borderRadius: 12, padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <AlertTriangle size={18} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--red)' }}>¿Eliminar a {selected.nombre}?</div>
                    <div style={{ fontSize: 12, color: '#991b1b', marginTop: 4, lineHeight: 1.5 }}>
                      Se eliminará permanentemente el usuario y todos sus datos asociados.
                      {selected.medidores?.length > 0 && ` Este usuario tiene ${selected.medidores.length} medidor(es) asignado(s).`}
                    </div>
                  </div>
                </div>
              </div>
              <div className="u-modal-footer">
                <button className="u-btn u-btn-ghost" onClick={closeModal}>Cancelar</button>
                <button className="u-btn u-btn-danger" onClick={handleDelete} disabled={saving}>
                  {saving ? 'Eliminando...' : <><Trash2 size={13} /> Eliminar</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}