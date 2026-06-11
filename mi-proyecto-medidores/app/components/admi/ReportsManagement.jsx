// ════════════════════════════════════════
// reportes.jsx
// ════════════════════════════════════════
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { FileText, Download, RefreshCw, TrendingUp, TrendingDown, Droplets, CreditCard, Users, BookOpen } from 'lucide-react'

const css = `
  .rep-wrap { font-family: 'Inter', sans-serif; }
  .rep-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 20px; }
  .rep-card { background: var(--white); border: 1.5px solid var(--border); border-radius: 16px; padding: 22px; }
  .rep-card-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px; color: var(--ink); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .rep-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--off); font-size: 13px; color: var(--ink-2); }
  .rep-row:last-child { border-bottom: none; }
  .rep-row-val { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; color: var(--ink); }
  .rep-btn-dl { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 9px; border: 1.5px solid var(--teal-bd); background: var(--teal-bg); color: var(--teal-dk); font-family: 'Syne', sans-serif; font-weight: 700; font-size: 12px; cursor: pointer; transition: all .12s; }
  .rep-btn-dl:hover { background: var(--teal); color: #fff; border-color: var(--teal); }
  .adm-btn { display: flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 9px; border: none; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; }
  .adm-btn-ghost { background: var(--white); color: var(--ink-2); border: 1.5px solid var(--border) !important; }
  .adm-btn-ghost:hover { background: var(--off); }
  .rep-big-num { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 32px; color: var(--teal); letter-spacing: -.05em; margin: 8px 0 4px; }
  .rep-sub { font-size: 12px; color: var(--ink-4); }
  .rep-skeleton { height: 180px; background: linear-gradient(90deg, var(--off) 25%, var(--border) 50%, var(--off) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 16px; }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
`

export function ReportesComponent() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  async function fetchStats() {
    setLoading(true)
    const [{ count: users }, { count: lecturas }, { data: facturas }, { data: consumo }] = await Promise.all([
      supabase.from('usuarios').select('*', { count: 'exact', head: true }),
      supabase.from('lecturas').select('*', { count: 'exact', head: true }),
      supabase.from('facturas').select('monto, estado'),
      supabase.from('lecturas').select('valor'),
    ])
    const totalFacturado = facturas?.filter(f => f.estado === 'pagada').reduce((a, f) => a + (parseFloat(f.monto) || 0), 0) || 0
    const totalConsumo = consumo?.reduce((a, l) => a + (parseFloat(l.valor) || 0), 0) || 0
    setStats({ users, lecturas, totalFacturado, totalConsumo, facturas: facturas?.length || 0 })
    setLoading(false)
  }

  return (
    <div className="rep-wrap">
      <style>{css}</style>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: 'var(--ink)', letterSpacing: '-.04em' }}>Reportes</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 5 }}>Resumen estadístico del sistema</p>
        </div>
        <button className="adm-btn adm-btn-ghost" onClick={fetchStats}><RefreshCw size={13} /> Actualizar</button>
      </div>

      <div className="rep-grid">
        {loading ? Array(4).fill(0).map((_, i) => <div key={i} className="rep-skeleton" />) : <>
          <motion.div className="rep-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rep-card-title"><Users size={15} color="var(--teal)" /> Usuarios</div>
            <div className="rep-big-num">{stats.users}</div>
            <div className="rep-sub">Usuarios registrados en total</div>
          </motion.div>
          <motion.div className="rep-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
            <div className="rep-card-title"><BookOpen size={15} color="var(--teal)" /> Lecturas</div>
            <div className="rep-big-num">{stats.lecturas}</div>
            <div className="rep-sub">Lecturas registradas</div>
          </motion.div>
          <motion.div className="rep-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <div className="rep-card-title"><Droplets size={15} color="var(--teal)" /> Consumo</div>
            <div className="rep-big-num">{Number(stats.totalConsumo).toLocaleString()} m³</div>
            <div className="rep-sub">Consumo total acumulado</div>
          </motion.div>
          <motion.div className="rep-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <div className="rep-card-title"><CreditCard size={15} color="var(--teal)" /> Ingresos</div>
            <div className="rep-big-num">Bs {stats.totalFacturado.toLocaleString('es-BO', { minimumFractionDigits: 0 })}</div>
            <div className="rep-sub">De {stats.facturas} facturas emitidas</div>
          </motion.div>
        </>}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        {['Reporte mensual de consumo', 'Reporte de facturación', 'Reporte de usuarios'].map(r => (
          <button key={r} className="rep-btn-dl"><Download size={13} /> {r}</button>
        ))}
      </div>
    </div>
  )
}


// ════════════════════════════════════════
// zonas.jsx
// ════════════════════════════════════════
import { MapPin, Plus, Pencil, Trash2, Search, X } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'

const cssZonas = `
  .zon-wrap { font-family: 'Inter', sans-serif; }
  .zon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
  .zon-card { background: var(--white); border: 1.5px solid var(--border); border-radius: 14px; padding: 20px; transition: all .2s; }
  .zon-card:hover { border-color: var(--teal-bd); box-shadow: 0 4px 16px rgba(0,166,126,.07); }
  .zon-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--teal-bg); border: 1.5px solid var(--teal-bd); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
  .zon-name { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 15px; color: var(--ink); }
  .zon-sector { font-size: 12px; color: var(--ink-4); margin-top: 2px; }
  .zon-desc { font-size: 12px; color: var(--ink-3); margin-top: 8px; line-height: 1.4; }
  .zon-stat { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .zon-stat-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; color: var(--teal); }
  .zon-stat-lbl { font-size: 11px; color: var(--ink-4); }
  .zon-actions { display: flex; gap: 6px; margin-top: 12px; }
  .zon-act-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px; padding: 7px; border-radius: 8px; border: 1.5px solid var(--border); background: var(--off); cursor: pointer; font-size: 12px; font-family: 'Syne', sans-serif; font-weight: 700; color: var(--ink-3); transition: all .12s; }
  .zon-act-btn:hover { background: var(--white); border-color: var(--border-md); color: var(--ink); }
  .zon-act-btn.danger:hover { border-color: var(--red-bd); color: var(--red); background: var(--red-bg); }
  .zon-skeleton { height: 180px; background: linear-gradient(90deg, var(--off) 25%, var(--border) 50%, var(--off) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 14px; }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .adm-btn { display: flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 9px; border: none; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; }
  .adm-btn-ghost { background: var(--white); color: var(--ink-2); border: 1.5px solid var(--border) !important; }
  .adm-btn-ghost:hover { background: var(--off); }
  .adm-btn-primary { background: var(--ink); color: #fff; }
  .adm-btn-primary:hover { background: var(--ink-2); }
  .adm-btn:disabled { opacity:.5; cursor:not-allowed; }
  .zon-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .zon-modal { background: var(--white); border-radius: 18px; width: 100%; max-width: 440px; overflow: hidden; }
  .zon-modal-head { padding: 20px 24px; border-bottom: 1.5px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .zon-modal-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 16px; color: var(--ink); }
  .zon-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
  .zon-field label { display: block; font-size: 11px; font-weight: 700; color: var(--ink-3); text-transform: uppercase; letter-spacing: .04em; margin-bottom: 6px; }
  .zon-field input, .zon-field textarea { width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 9px; font-family: 'Inter', sans-serif; font-size: 13px; color: var(--ink); background: var(--off); outline: none; transition: border-color .15s; resize: vertical; }
  .zon-field input:focus, .zon-field textarea:focus { border-color: var(--teal); background: var(--white); }
  .zon-row-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .zon-modal-foot { padding: 16px 24px; border-top: 1.5px solid var(--border); display: flex; gap: 8px; justify-content: flex-end; }
`

const EMPTY_ZONA = { nombre: '', sector: '', descripcion: '', total_medidores: 0 }

export function ZonasComponent() {
  const [zonas, setZonas] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(EMPTY_ZONA)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchZonas() }, [])

  async function fetchZonas() {
    setLoading(true)
    const { data } = await supabase.from('zonas').select('*').order('nombre')
    setZonas(data || [])
    setLoading(false)
  }

  function openNew() { setEditItem(null); setForm(EMPTY_ZONA); setModal(true) }
  function openEdit(z) { setEditItem(z); setForm({ nombre: z.nombre, sector: z.sector || '', descripcion: z.descripcion || '', total_medidores: z.total_medidores || 0 }); setModal(true) }

  async function handleSave() {
    setSaving(true)
    if (editItem) { await supabase.from('zonas').update(form).eq('id', editItem.id) }
    else { await supabase.from('zonas').insert(form) }
    setSaving(false); setModal(false); fetchZonas()
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar esta zona?')) return
    await supabase.from('zonas').delete().eq('id', id)
    fetchZonas()
  }

  return (
    <div className="zon-wrap">
      <style>{cssZonas}</style>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: 'var(--ink)', letterSpacing: '-.04em' }}>Zonas / Sectores</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 5 }}>{zonas.length} zonas registradas</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="adm-btn adm-btn-ghost" onClick={fetchZonas}><RefreshCw size={13} /> Actualizar</button>
          <button className="adm-btn adm-btn-primary" onClick={openNew}><Plus size={14} /> Nueva zona</button>
        </div>
      </div>

      <div className="zon-grid">
        {loading ? Array(4).fill(0).map((_, i) => <div key={i} className="zon-skeleton" />) :
          zonas.map((z, i) => (
            <motion.div key={z.id} className="zon-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="zon-icon"><MapPin size={18} color="var(--teal)" /></div>
              <div className="zon-name">{z.nombre}</div>
              <div className="zon-sector">{z.sector || 'Sin sector'}</div>
              {z.descripcion && <div className="zon-desc">{z.descripcion}</div>}
              <div className="zon-stat">
                <div><div className="zon-stat-val">{z.total_medidores ?? 0}</div><div className="zon-stat-lbl">Medidores</div></div>
              </div>
              <div className="zon-actions">
                <button className="zon-act-btn" onClick={() => openEdit(z)}><Pencil size={12} /> Editar</button>
                <button className="zon-act-btn danger" onClick={() => handleDelete(z.id)}><Trash2 size={12} /> Eliminar</button>
              </div>
            </motion.div>
          ))}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div className="zon-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setModal(false)}>
            <motion.div className="zon-modal" initial={{ scale: .95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .95, y: 16 }}>
              <div className="zon-modal-head">
                <span className="zon-modal-title">{editItem ? 'Editar zona' : 'Nueva zona'}</span>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', display: 'flex' }} onClick={() => setModal(false)}><X size={18} /></button>
              </div>
              <div className="zon-modal-body">
                <div className="zon-row-fields">
                  <div className="zon-field"><label>Nombre</label><input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Zona Norte" /></div>
                  <div className="zon-field"><label>Sector</label><input value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))} placeholder="Sector 4" /></div>
                </div>
                <div className="zon-field"><label>Descripción</label><textarea rows={3} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} placeholder="Descripción de la zona..." /></div>
                <div className="zon-field"><label>Total medidores</label><input type="number" value={form.total_medidores} onChange={e => setForm(f => ({ ...f, total_medidores: parseInt(e.target.value) || 0 }))} /></div>
              </div>
              <div className="zon-modal-foot">
                <button className="adm-btn adm-btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
                <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving || !form.nombre}>
                  {saving ? 'Guardando...' : editItem ? 'Guardar cambios' : 'Crear zona'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


// ════════════════════════════════════════
// alertas.jsx
// ════════════════════════════════════════
import { Bell, CheckCircle2, AlertTriangle, Clock, Activity, Trash2 as Trash2Alt, Filter } from 'lucide-react'

const cssAlertas = `
  .alt-wrap { font-family: 'Inter', sans-serif; }
  .alt-list { background: var(--white); border: 1.5px solid var(--border); border-radius: 16px; overflow: hidden; }
  .alt-item { display: flex; align-items: flex-start; gap: 14px; padding: 16px 20px; border-bottom: 1px solid var(--off); cursor: pointer; transition: background .1s; }
  .alt-item:hover { background: var(--off); }
  .alt-item:last-child { border-bottom: none; }
  .alt-item.leida { opacity: .55; }
  .alt-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid; }
  .alt-msg { font-size: 13px; color: var(--ink-2); line-height: 1.4; }
  .alt-meta { font-size: 11px; color: var(--ink-4); margin-top: 3px; display: flex; align-items: center; gap: 8px; }
  .alt-badge { display: inline-flex; align-items: center; gap: 3px; padding: 2px 7px; border-radius: 99px; font-size: 10px; font-weight: 700; border: 1px solid; }
  .alt-actions { margin-left: auto; display: flex; gap: 6px; align-items: flex-start; flex-shrink: 0; }
  .alt-act-btn { width: 28px; height: 28px; border-radius: 7px; border: 1.5px solid var(--border); background: var(--off); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .12s; }
  .alt-act-btn:hover { background: var(--white); border-color: var(--border-md); }
  .alt-act-btn.ok:hover { background: var(--green-bg); border-color: var(--green-bd); }
  .alt-act-btn.del:hover { background: var(--red-bg); border-color: var(--red-bd); }
  .alt-skeleton { height: 76px; background: linear-gradient(90deg, var(--off) 25%, var(--border) 50%, var(--off) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .adm-btn { display: flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 9px; border: none; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; }
  .adm-btn-ghost { background: var(--white); color: var(--ink-2); border: 1.5px solid var(--border) !important; }
  .adm-btn-ghost:hover { background: var(--off); }
  .adm-btn-teal { background: var(--teal); color: #fff; }
  .adm-btn-teal:hover { background: var(--teal-dk); }
`

const TIPO_STYLE = {
  error:   { bg: 'var(--red-bg)',   color: 'var(--red)',    border: 'var(--red-bd)',   icon: AlertTriangle, label: 'Error' },
  warn:    { bg: 'var(--amber-bg)', color: 'var(--amber)',  border: 'var(--amber-bd)', icon: Clock,         label: 'Aviso' },
  success: { bg: 'var(--green-bg)', color: 'var(--green)',  border: 'var(--green-bd)', icon: CheckCircle2,  label: 'OK' },
  info:    { bg: 'var(--teal-bg)',  color: 'var(--teal)',   border: 'var(--teal-bd)',  icon: Activity,      label: 'Info' },
}

export function AlertasComponent() {
  const [alertas, setAlertas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')

  useEffect(() => { fetchAlertas() }, [])

  async function fetchAlertas() {
    setLoading(true)
    const { data } = await supabase.from('alertas').select('*').order('created_at', { ascending: false })
    setAlertas(data || [])
    setLoading(false)
  }

  async function marcarLeida(id) {
    await supabase.from('alertas').update({ estado: 'leida' }).eq('id', id)
    fetchAlertas()
  }

  async function eliminar(id) {
    await supabase.from('alertas').delete().eq('id', id)
    fetchAlertas()
  }

  async function marcarTodasLeidas() {
    await supabase.from('alertas').update({ estado: 'leida' }).eq('estado', 'activa')
    fetchAlertas()
  }

  const filtered = filtro === 'todos' ? alertas : alertas.filter(a => a.tipo === filtro || a.estado === filtro)
  const noLeidas = alertas.filter(a => a.estado !== 'leida').length

  return (
    <div className="alt-wrap">
      <style>{cssAlertas}</style>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: 'var(--ink)', letterSpacing: '-.04em' }}>Alertas</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 5 }}>{noLeidas} alertas sin leer</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="adm-btn adm-btn-ghost" onClick={fetchAlertas}><RefreshCw size={13} /> Actualizar</button>
          {noLeidas > 0 && <button className="adm-btn adm-btn-teal" onClick={marcarTodasLeidas}><CheckCircle2 size={14} /> Marcar todas leídas</button>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['todos', 'error', 'warn', 'success', 'info'].map(t => (
          <button key={t} onClick={() => setFiltro(t)}
            style={{ padding: '6px 14px', borderRadius: 8, border: `1.5px solid ${filtro === t ? 'var(--teal)' : 'var(--border)'}`, background: filtro === t ? 'var(--teal-bg)' : 'var(--white)', color: filtro === t ? 'var(--teal)' : 'var(--ink-2)', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
            {t === 'todos' ? 'Todas' : TIPO_STYLE[t]?.label}
          </button>
        ))}
      </div>

      <div className="alt-list">
        {loading ? Array(5).fill(0).map((_, i) => <div key={i} className="alt-skeleton" />) :
          filtered.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>No hay alertas.</div>
          ) : filtered.map((a, i) => {
            const S = TIPO_STYLE[a.tipo] || TIPO_STYLE.info
            const Icon = S.icon
            return (
              <motion.div key={a.id} className={`alt-item ${a.estado === 'leida' ? 'leida' : ''}`}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: a.estado === 'leida' ? 0.55 : 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                <div className="alt-icon" style={{ background: S.bg, borderColor: S.border, color: S.color }}>
                  <Icon size={15} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="alt-msg">{a.mensaje}</div>
                  <div className="alt-meta">
                    <span className="alt-badge" style={{ background: S.bg, color: S.color, borderColor: S.border }}>{S.label}</span>
                    {a.created_at && new Date(a.created_at).toLocaleString('es-BO')}
                    {a.medidor_id && <span>Medidor #{a.medidor_id}</span>}
                  </div>
                </div>
                <div className="alt-actions">
                  {a.estado !== 'leida' && (
                    <button className="alt-act-btn ok" onClick={() => marcarLeida(a.id)} title="Marcar como leída"><CheckCircle2 size={14} color="var(--green)" /></button>
                  )}
                  <button className="alt-act-btn del" onClick={() => eliminar(a.id)} title="Eliminar"><Trash2Alt size={14} color="var(--red)" /></button>
                </div>
              </motion.div>
            )
          })}
      </div>
    </div>
  )
}


// ════════════════════════════════════════
// auditoria.jsx
// ════════════════════════════════════════
import { Shield, Eye } from 'lucide-react'

const cssAuditoria = `
  .aud-wrap { font-family: 'Inter', sans-serif; }
  .aud-table-wrap { background: var(--white); border: 1.5px solid var(--border); border-radius: 16px; overflow: hidden; }
  .aud-table { width: 100%; border-collapse: collapse; }
  .aud-th { padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: var(--ink-4); text-transform: uppercase; letter-spacing: .04em; background: var(--off); white-space: nowrap; }
  .aud-tr { border-top: 1px solid var(--border); transition: background .1s; }
  .aud-tr:hover { background: var(--off); }
  .aud-td { padding: 12px 16px; font-size: 12.5px; color: var(--ink-2); }
  .aud-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 99px; font-size: 10px; font-weight: 700; border: 1px solid; }
  .aud-accion { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 12px; background: var(--off); border: 1.5px solid var(--border); border-radius: 6px; padding: 2px 8px; color: var(--ink); }
  .aud-skeleton-row { height: 52px; background: linear-gradient(90deg, var(--off) 25%, var(--border) 50%, var(--off) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
  .aud-search { display: flex; align-items: center; gap: 8px; border: 1.5px solid var(--border); background: var(--white); border-radius: 10px; padding: 0 12px; height: 38px; width: 300px; transition: border-color .15s; margin-bottom: 16px; }
  .aud-search:focus-within { border-color: var(--teal); }
  .aud-search input { border: none; outline: none; background: none; font-size: 13px; color: var(--ink); flex: 1; font-family: 'Inter', sans-serif; }
  .aud-search input::placeholder { color: var(--ink-4); }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .adm-btn { display: flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 9px; border: none; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; }
  .adm-btn-ghost { background: var(--white); color: var(--ink-2); border: 1.5px solid var(--border) !important; }
  .adm-btn-ghost:hover { background: var(--off); }
`

const MODULO_COLORS = {
  usuarios:    { bg: 'var(--indigo-bg)',  color: 'var(--indigo)',  border: 'var(--indigo-bd)' },
  lecturas:    { bg: 'var(--teal-bg)',    color: 'var(--teal)',    border: 'var(--teal-bd)' },
  facturacion: { bg: 'var(--green-bg)',   color: 'var(--green)',   border: 'var(--green-bd)' },
  medidores:   { bg: 'var(--amber-bg)',   color: 'var(--amber)',   border: 'var(--amber-bd)' },
  sistema:     { bg: 'var(--off)',        color: 'var(--ink-3)',   border: 'var(--border)' },
}

export function AuditoriaComponent() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchLogs() }, [])

  async function fetchLogs() {
    setLoading(true)
    const { data } = await supabase.from('auditoria').select('*, usuarios(nombre, apellido)').order('created_at', { ascending: false }).limit(200)
    setLogs(data || [])
    setLoading(false)
  }

  const filtered = logs.filter(l => {
    const q = search.toLowerCase()
    return !q || `${l.accion} ${l.modulo} ${l.usuarios?.nombre || ''} ${l.detalle || ''}`.toLowerCase().includes(q)
  })

  return (
    <div className="aud-wrap">
      <style>{cssAuditoria}</style>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: 'var(--ink)', letterSpacing: '-.04em' }}>Auditoría</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 5 }}>Historial de acciones del sistema</p>
        </div>
        <button className="adm-btn adm-btn-ghost" onClick={fetchLogs}><RefreshCw size={13} /> Actualizar</button>
      </div>

      <div className="aud-search">
        <Search size={14} color="var(--ink-4)" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por acción, módulo, usuario..." />
        {search && <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', display: 'flex' }} onClick={() => setSearch('')}><X size={13} /></button>}
      </div>

      <div className="aud-table-wrap">
        <table className="aud-table">
          <thead>
            <tr>{['Usuario', 'Acción', 'Módulo', 'Detalle', 'Fecha'].map(h => <th key={h} className="aud-th">{h}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? Array(8).fill(0).map((_, i) => (
              <tr key={i}><td colSpan={5}><div className="aud-skeleton-row" /></td></tr>
            )) : filtered.map((l, i) => {
              const mc = MODULO_COLORS[l.modulo] || MODULO_COLORS.sistema
              return (
                <motion.tr key={l.id} className="aud-tr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }}>
                  <td className="aud-td">{l.usuarios ? `${l.usuarios.nombre} ${l.usuarios.apellido}` : 'Sistema'}</td>
                  <td className="aud-td"><span className="aud-accion">{l.accion}</span></td>
                  <td className="aud-td">
                    <span className="aud-badge" style={{ background: mc.bg, color: mc.color, borderColor: mc.border }}>{l.modulo || '—'}</span>
                  </td>
                  <td className="aud-td" style={{ color: 'var(--ink-4)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.detalle || '—'}</td>
                  <td className="aud-td" style={{ color: 'var(--ink-4)', fontSize: 12, whiteSpace: 'nowrap' }}>{l.created_at ? new Date(l.created_at).toLocaleString('es-BO') : '—'}</td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>No se encontraron registros.</div>
        )}
      </div>
    </div>
  )
}


// ════════════════════════════════════════
// tarifas.jsx
// ════════════════════════════════════════
import { Sliders } from 'lucide-react'

const cssTarifas = `
  .tar-wrap { font-family: 'Inter', sans-serif; }
  .tar-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
  .tar-card { background: var(--white); border: 1.5px solid var(--border); border-radius: 14px; padding: 20px; transition: all .2s; }
  .tar-card:hover { border-color: var(--teal-bd); box-shadow: 0 4px 16px rgba(0,166,126,.07); }
  .tar-card.vigente { border-color: var(--teal); background: var(--teal-bg); }
  .tar-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 99px; font-size: 10px; font-weight: 700; border: 1px solid; margin-bottom: 12px; }
  .tar-nombre { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 16px; color: var(--ink); margin-bottom: 4px; }
  .tar-precio { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 28px; color: var(--teal); letter-spacing: -.04em; }
  .tar-rango { font-size: 12px; color: var(--ink-3); margin-top: 6px; }
  .tar-actions { display: flex; gap: 6px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
  .tar-act-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px; padding: 7px; border-radius: 8px; border: 1.5px solid var(--border); background: var(--off); cursor: pointer; font-size: 12px; font-family: 'Syne', sans-serif; font-weight: 700; color: var(--ink-3); transition: all .12s; }
  .tar-act-btn:hover { background: var(--white); border-color: var(--border-md); color: var(--ink); }
  .tar-act-btn.danger:hover { border-color: var(--red-bd); color: var(--red); background: var(--red-bg); }
  .tar-skeleton { height: 180px; background: linear-gradient(90deg, var(--off) 25%, var(--border) 50%, var(--off) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 14px; }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .adm-btn { display: flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 9px; border: none; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; }
  .adm-btn-ghost { background: var(--white); color: var(--ink-2); border: 1.5px solid var(--border) !important; }
  .adm-btn-ghost:hover { background: var(--off); }
  .adm-btn-primary { background: var(--ink); color: #fff; }
  .adm-btn-primary:hover { background: var(--ink-2); }
  .adm-btn:disabled { opacity:.5; cursor:not-allowed; }
  .tar-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .tar-modal { background: var(--white); border-radius: 18px; width: 100%; max-width: 440px; overflow: hidden; }
  .tar-modal-head { padding: 20px 24px; border-bottom: 1.5px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .tar-modal-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 16px; color: var(--ink); }
  .tar-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
  .tar-field label { display: block; font-size: 11px; font-weight: 700; color: var(--ink-3); text-transform: uppercase; letter-spacing: .04em; margin-bottom: 6px; }
  .tar-field input, .tar-field select { width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 9px; font-family: 'Inter', sans-serif; font-size: 13px; color: var(--ink); background: var(--off); outline: none; transition: border-color .15s; }
  .tar-field input:focus, .tar-field select:focus { border-color: var(--teal); background: var(--white); }
  .tar-row-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .tar-modal-foot { padding: 16px 24px; border-top: 1.5px solid var(--border); display: flex; gap: 8px; justify-content: flex-end; }
  .tar-toggle { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--ink-2); cursor: pointer; }
  .tar-toggle input[type=checkbox] { width: 16px; height: 16px; accent-color: var(--teal); cursor: pointer; }
`

const EMPTY_TARIFA = { nombre: '', precio_m3: '', rango_min: '', rango_max: '', vigente: true }

export function TarifasComponent() {
  const [tarifas, setTarifas] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(EMPTY_TARIFA)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchTarifas() }, [])

  async function fetchTarifas() {
    setLoading(true)
    const { data } = await supabase.from('tarifas').select('*').order('rango_min')
    setTarifas(data || [])
    setLoading(false)
  }

  function openNew() { setEditItem(null); setForm(EMPTY_TARIFA); setModal(true) }
  function openEdit(t) {
    setEditItem(t)
    setForm({ nombre: t.nombre, precio_m3: t.precio_m3 || '', rango_min: t.rango_min ?? '', rango_max: t.rango_max ?? '', vigente: t.vigente ?? true })
    setModal(true)
  }

  async function handleSave() {
    setSaving(true)
    const payload = { ...form, precio_m3: parseFloat(form.precio_m3), rango_min: parseFloat(form.rango_min), rango_max: parseFloat(form.rango_max) }
    if (editItem) { await supabase.from('tarifas').update(payload).eq('id', editItem.id) }
    else { await supabase.from('tarifas').insert(payload) }
    setSaving(false); setModal(false); fetchTarifas()
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar esta tarifa?')) return
    await supabase.from('tarifas').delete().eq('id', id)
    fetchTarifas()
  }

  return (
    <div className="tar-wrap">
      <style>{cssTarifas}</style>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: 'var(--ink)', letterSpacing: '-.04em' }}>Tarifas</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 5 }}>Estructura de precios por consumo</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="adm-btn adm-btn-ghost" onClick={fetchTarifas}><RefreshCw size={13} /> Actualizar</button>
          <button className="adm-btn adm-btn-primary" onClick={openNew}><Plus size={14} /> Nueva tarifa</button>
        </div>
      </div>

      <div className="tar-grid">
        {loading ? Array(4).fill(0).map((_, i) => <div key={i} className="tar-skeleton" />) :
          tarifas.map((t, i) => (
            <motion.div key={t.id} className={`tar-card ${t.vigente ? 'vigente' : ''}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <span className="tar-badge" style={t.vigente ? { background: 'var(--teal)', color: '#fff', borderColor: 'var(--teal)' } : { background: 'var(--off)', color: 'var(--ink-4)', borderColor: 'var(--border)' }}>
                {t.vigente ? '✓ Vigente' : 'Inactiva'}
              </span>
              <div className="tar-nombre">{t.nombre}</div>
              <div className="tar-precio">Bs {Number(t.precio_m3).toFixed(2)}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--ink-3)' }}>/m³</span></div>
              <div className="tar-rango">Rango: {t.rango_min ?? 0} – {t.rango_max ?? '∞'} m³</div>
              <div className="tar-actions">
                <button className="tar-act-btn" onClick={() => openEdit(t)}><Pencil size={12} /> Editar</button>
                <button className="tar-act-btn danger" onClick={() => handleDelete(t.id)}><Trash2 size={12} /> Eliminar</button>
              </div>
            </motion.div>
          ))}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div className="tar-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setModal(false)}>
            <motion.div className="tar-modal" initial={{ scale: .95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .95, y: 16 }}>
              <div className="tar-modal-head">
                <span className="tar-modal-title">{editItem ? 'Editar tarifa' : 'Nueva tarifa'}</span>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', display: 'flex' }} onClick={() => setModal(false)}><X size={18} /></button>
              </div>
              <div className="tar-modal-body">
                <div className="tar-field"><label>Nombre</label><input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Tarifa residencial básica" /></div>
                <div className="tar-field"><label>Precio por m³ (Bs)</label><input type="number" step="0.01" value={form.precio_m3} onChange={e => setForm(f => ({ ...f, precio_m3: e.target.value }))} placeholder="3.50" /></div>
                <div className="tar-row-fields">
                  <div className="tar-field"><label>Rango mín (m³)</label><input type="number" value={form.rango_min} onChange={e => setForm(f => ({ ...f, rango_min: e.target.value }))} placeholder="0" /></div>
                  <div className="tar-field"><label>Rango máx (m³)</label><input type="number" value={form.rango_max} onChange={e => setForm(f => ({ ...f, rango_max: e.target.value }))} placeholder="50" /></div>
                </div>
                <label className="tar-toggle">
                  <input type="checkbox" checked={form.vigente} onChange={e => setForm(f => ({ ...f, vigente: e.target.checked }))} />
                  Tarifa vigente
                </label>
              </div>
              <div className="tar-modal-foot">
                <button className="adm-btn adm-btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
                <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving || !form.nombre || !form.precio_m3}>
                  {saving ? 'Guardando...' : editItem ? 'Guardar cambios' : 'Crear tarifa'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}