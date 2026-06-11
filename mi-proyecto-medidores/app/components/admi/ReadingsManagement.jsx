'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import {
  BookOpen, Plus, Search, X, RefreshCw,
  Gauge, User, Wrench, CalendarDays, Pencil, Trash2, Camera
} from 'lucide-react'

const css = `
  .lec-wrap { font-family: 'Inter', sans-serif; }
  .lec-toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .lec-search { display: flex; align-items: center; gap: 8px; border: 1.5px solid var(--border); background: var(--white); border-radius: 10px; padding: 0 12px; height: 38px; flex: 1; max-width: 320px; transition: border-color .15s; }
  .lec-search:focus-within { border-color: var(--teal); }
  .lec-search input { border: none; outline: none; background: none; font-size: 13px; color: var(--ink); flex: 1; font-family: 'Inter', sans-serif; }
  .lec-search input::placeholder { color: var(--ink-4); }
  .lec-filter-btn { display: flex; align-items: center; gap: 6px; padding: 0 14px; height: 38px; border: 1.5px solid var(--border); background: var(--white); border-radius: 10px; cursor: pointer; font-size: 13px; font-family: 'Inter', sans-serif; color: var(--ink-2); transition: all .12s; }
  .lec-filter-btn:hover { background: var(--off); }
  .lec-filter-btn.active { border-color: var(--teal); color: var(--teal); background: var(--teal-bg); }
  .lec-table-wrap { background: var(--white); border: 1.5px solid var(--border); border-radius: 16px; overflow: hidden; }
  .lec-table { width: 100%; border-collapse: collapse; }
  .lec-th { padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: var(--ink-4); text-transform: uppercase; letter-spacing: .04em; background: var(--off); white-space: nowrap; }
  .lec-tr { border-top: 1px solid var(--border); transition: background .1s; }
  .lec-tr:hover { background: var(--off); }
  .lec-td { padding: 12px 16px; font-size: 13px; color: var(--ink-2); }
  .lec-valor { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px; color: var(--ink); }
  .lec-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 99px; font-size: 10px; font-weight: 700; border: 1px solid; }
  .lec-icon-btn { width: 30px; height: 30px; border-radius: 7px; border: 1.5px solid var(--border); background: var(--off); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .12s; }
  .lec-icon-btn:hover { background: var(--white); border-color: var(--border-md); }
  .lec-icon-btn.danger:hover { border-color: var(--red-bd); background: var(--red-bg); }
  .lec-skeleton-row { height: 52px; background: linear-gradient(90deg, var(--off) 25%, var(--border) 50%, var(--off) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .adm-btn { display: flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 9px; border: none; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; }
  .adm-btn-ghost { background: var(--white); color: var(--ink-2); border: 1.5px solid var(--border) !important; }
  .adm-btn-ghost:hover { background: var(--off); }
  .adm-btn-primary { background: var(--teal); color: #fff; }
  .adm-btn-primary:hover { background: var(--teal-dk); }
  .adm-btn:disabled { opacity:.5; cursor:not-allowed; }
  .lec-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .lec-modal { background: var(--white); border-radius: 18px; width: 100%; max-width: 480px; overflow: hidden; }
  .lec-modal-head { padding: 20px 24px; border-bottom: 1.5px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .lec-modal-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 16px; color: var(--ink); }
  .lec-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
  .lec-field label { display: block; font-size: 11px; font-weight: 700; color: var(--ink-3); text-transform: uppercase; letter-spacing: .04em; margin-bottom: 6px; }
  .lec-field input, .lec-field select { width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 9px; font-family: 'Inter', sans-serif; font-size: 13px; color: var(--ink); background: var(--off); outline: none; transition: border-color .15s; }
  .lec-field input:focus, .lec-field select:focus { border-color: var(--teal); background: var(--white); }
  .lec-row-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .lec-modal-foot { padding: 16px 24px; border-top: 1.5px solid var(--border); display: flex; gap: 8px; justify-content: flex-end; }
  .lec-valor-big { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 28px; color: var(--teal); letter-spacing: -.04em; margin-top: 4px; }
  .lec-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
  .lec-sum-card { background: var(--white); border: 1.5px solid var(--border); border-radius: 12px; padding: 14px 16px; }
  .lec-sum-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; color: var(--ink); letter-spacing: -.03em; }
  .lec-sum-lbl { font-size: 11px; color: var(--ink-4); margin-top: 3px; }
`

const ESTADO_STYLE = {
  normal:  { bg: 'var(--green-bg)', color: 'var(--green)', border: 'var(--green-bd)', dot: '#16a34a', label: 'Normal' },
  alerta:  { bg: 'var(--red-bg)',   color: 'var(--red)',   border: 'var(--red-bd)',   dot: '#dc2626', label: 'Alerta' },
  alto:    { bg: 'var(--amber-bg)', color: 'var(--amber)', border: 'var(--amber-bd)', dot: '#d97706', label: 'Alto' },
  pendiente: { bg: 'var(--indigo-bg)', color: 'var(--indigo)', border: 'var(--indigo-bd)', dot: '#4f46e5', label: 'Pendiente' },
}

const EMPTY_FORM = { medidor_id: '', valor: '', fecha: new Date().toISOString().split('T')[0], tecnico_id: '', estado: 'normal', observaciones: '' }

export default function LecturasComponent() {
  const [lecturas, setLecturas] = useState([])
  const [medidores, setMedidores] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [{ data: l }, { data: m }, { data: t }] = await Promise.all([
      supabase.from('lecturas').select('*, medidores(codigo, zona, usuarios(nombre, apellido)), tecnicos(nombre, apellido)').order('fecha', { ascending: false }),
      supabase.from('medidores').select('id, codigo, zona').order('codigo'),
      supabase.from('tecnicos').select('id, nombre, apellido').order('nombre'),
    ])
    setLecturas(l || [])
    setMedidores(m || [])
    setTecnicos(t || [])
    setLoading(false)
  }

  function openNew() { setEditItem(null); setForm(EMPTY_FORM); setModal(true) }
  function openEdit(l) {
    setEditItem(l)
    setForm({ medidor_id: l.medidor_id || '', valor: l.valor || '', fecha: l.fecha?.split('T')[0] || '', tecnico_id: l.tecnico_id || '', estado: l.estado || 'normal', observaciones: l.observaciones || '' })
    setModal(true)
  }

  async function handleSave() {
    setSaving(true)
    const payload = { ...form, medidor_id: form.medidor_id || null, tecnico_id: form.tecnico_id || null, valor: parseFloat(form.valor) }
    if (editItem) { await supabase.from('lecturas').update(payload).eq('id', editItem.id) }
    else { await supabase.from('lecturas').insert(payload) }
    setSaving(false); setModal(false); fetchAll()
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar esta lectura?')) return
    await supabase.from('lecturas').delete().eq('id', id)
    fetchAll()
  }

  const filtered = lecturas.filter(l => {
    const q = search.toLowerCase()
    const code = l.medidores?.codigo || ''
    const uname = `${l.medidores?.usuarios?.nombre || ''} ${l.medidores?.usuarios?.apellido || ''}`
    const matchQ = !q || `${code} ${uname}`.toLowerCase().includes(q)
    const matchF = filtro === 'todos' || l.estado === filtro
    return matchQ && matchF
  })

  const totalConsumo = lecturas.reduce((a, l) => a + (parseFloat(l.valor) || 0), 0).toFixed(0)
  const alertas = lecturas.filter(l => l.estado === 'alerta' || l.estado === 'alto').length

  return (
    <div className="lec-wrap">
      <style>{css}</style>

      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: 'var(--ink)', letterSpacing: '-.04em' }}>Lecturas</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 5 }}>Registro de consumo por medidor</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="adm-btn adm-btn-ghost" onClick={fetchAll}><RefreshCw size={13} /> Actualizar</button>
          <button className="adm-btn adm-btn-primary" onClick={openNew}><Plus size={14} /> Nueva lectura</button>
        </div>
      </div>

      <div className="lec-summary">
        {[{ val: lecturas.length, lbl: 'Lecturas totales' }, { val: `${Number(totalConsumo).toLocaleString()} m³`, lbl: 'Consumo registrado' }, { val: alertas, lbl: 'Alertas activas' }].map(s => (
          <div key={s.lbl} className="lec-sum-card">
            <div className="lec-sum-val">{s.val}</div>
            <div className="lec-sum-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="lec-toolbar">
        <div className="lec-search">
          <Search size={14} color="var(--ink-4)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por código, usuario..." />
          {search && <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', display: 'flex' }} onClick={() => setSearch('')}><X size={13} /></button>}
        </div>
        {['todos', 'normal', 'alerta', 'alto', 'pendiente'].map(e => (
          <button key={e} className={`lec-filter-btn ${filtro === e ? 'active' : ''}`} onClick={() => setFiltro(e)}>
            {e === 'todos' ? 'Todos' : ESTADO_STYLE[e]?.label}
          </button>
        ))}
        <span style={{ fontSize: 13, color: 'var(--ink-3)', marginLeft: 'auto' }}>{filtered.length} registros</span>
      </div>

      <div className="lec-table-wrap">
        <table className="lec-table">
          <thead>
            <tr>{['Medidor', 'Usuario', 'Zona', 'Lectura (m³)', 'Estado', 'Técnico', 'Fecha', 'Acciones'].map(h =>
              <th key={h} className="lec-th">{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {loading ? Array(6).fill(0).map((_, i) => (
              <tr key={i}><td colSpan={8}><div className="lec-skeleton-row" /></td></tr>
            )) : filtered.map((l, i) => {
              const st = ESTADO_STYLE[l.estado] || ESTADO_STYLE.normal
              return (
                <motion.tr key={l.id} className="lec-tr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                  <td className="lec-td"><span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 12 }}>{l.medidores?.codigo || '—'}</span></td>
                  <td className="lec-td">{l.medidores?.usuarios ? `${l.medidores.usuarios.nombre} ${l.medidores.usuarios.apellido}` : '—'}</td>
                  <td className="lec-td" style={{ color: 'var(--ink-4)' }}>{l.medidores?.zona || '—'}</td>
                  <td className="lec-td"><span className="lec-valor">{Number(l.valor).toLocaleString()}</span></td>
                  <td className="lec-td">
                    <span className="lec-badge" style={{ background: st.bg, color: st.color, borderColor: st.border }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot }} />{st.label}
                    </span>
                  </td>
                  <td className="lec-td">{l.tecnicos ? `${l.tecnicos.nombre} ${l.tecnicos.apellido}` : '—'}</td>
                  <td className="lec-td" style={{ color: 'var(--ink-4)', fontSize: 12 }}>{l.fecha ? new Date(l.fecha).toLocaleDateString('es-BO') : '—'}</td>
                  <td className="lec-td">
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="lec-icon-btn" onClick={() => openEdit(l)}><Pencil size={13} color="var(--ink-3)" /></button>
                      <button className="lec-icon-btn danger" onClick={() => handleDelete(l.id)}><Trash2 size={13} color="var(--red)" /></button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>No se encontraron lecturas.</div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div className="lec-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setModal(false)}>
            <motion.div className="lec-modal" initial={{ scale: .95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .95, y: 16 }}>
              <div className="lec-modal-head">
                <span className="lec-modal-title">{editItem ? 'Editar lectura' : 'Nueva lectura'}</span>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', display: 'flex' }} onClick={() => setModal(false)}><X size={18} /></button>
              </div>
              <div className="lec-modal-body">
                <div className="lec-row-fields">
                  <div className="lec-field">
                    <label>Medidor</label>
                    <select value={form.medidor_id} onChange={e => setForm(f => ({ ...f, medidor_id: e.target.value }))}>
                      <option value="">Seleccionar...</option>
                      {medidores.map(m => <option key={m.id} value={m.id}>{m.codigo} — {m.zona}</option>)}
                    </select>
                  </div>
                  <div className="lec-field">
                    <label>Técnico</label>
                    <select value={form.tecnico_id} onChange={e => setForm(f => ({ ...f, tecnico_id: e.target.value }))}>
                      <option value="">Sin asignar</option>
                      {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre} {t.apellido}</option>)}
                    </select>
                  </div>
                </div>
                <div className="lec-row-fields">
                  <div className="lec-field"><label>Valor (m³)</label><input type="number" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} placeholder="1284" /></div>
                  <div className="lec-field"><label>Fecha</label><input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} /></div>
                </div>
                <div className="lec-field">
                  <label>Estado</label>
                  <select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
                    <option value="normal">Normal</option>
                    <option value="alerta">Alerta</option>
                    <option value="alto">Alto</option>
                    <option value="pendiente">Pendiente</option>
                  </select>
                </div>
                <div className="lec-field"><label>Observaciones</label><input value={form.observaciones} onChange={e => setForm(f => ({ ...f, observaciones: e.target.value }))} placeholder="Notas adicionales..." /></div>
              </div>
              <div className="lec-modal-foot">
                <button className="adm-btn adm-btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
                <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving || !form.medidor_id || !form.valor}>
                  {saving ? 'Guardando...' : editItem ? 'Guardar cambios' : 'Registrar lectura'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}