'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import {
  Gauge, Plus, Search, X, RefreshCw, MapPin,
  Pencil, Trash2, CalendarDays, User, Hash
} from 'lucide-react'

const css = `
  .med-wrap { font-family: 'Inter', sans-serif; }
  .med-toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .med-search { display: flex; align-items: center; gap: 8px; border: 1.5px solid var(--border); background: var(--white); border-radius: 10px; padding: 0 12px; height: 38px; flex: 1; max-width: 320px; transition: border-color .15s; }
  .med-search:focus-within { border-color: var(--teal); }
  .med-search input { border: none; outline: none; background: none; font-size: 13px; color: var(--ink); flex: 1; font-family: 'Inter', sans-serif; }
  .med-search input::placeholder { color: var(--ink-4); }
  .med-filter-btn { display: flex; align-items: center; gap: 6px; padding: 0 14px; height: 38px; border: 1.5px solid var(--border); background: var(--white); border-radius: 10px; cursor: pointer; font-size: 13px; font-family: 'Inter', sans-serif; color: var(--ink-2); transition: all .12s; }
  .med-filter-btn:hover { background: var(--off); }
  .med-filter-btn.active { border-color: var(--teal); color: var(--teal); background: var(--teal-bg); }
  .med-table-wrap { background: var(--white); border: 1.5px solid var(--border); border-radius: 16px; overflow: hidden; }
  .med-table { width: 100%; border-collapse: collapse; }
  .med-th { padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: var(--ink-4); text-transform: uppercase; letter-spacing: .04em; background: var(--off); white-space: nowrap; }
  .med-tr { border-top: 1px solid var(--border); cursor: pointer; transition: background .1s; }
  .med-tr:hover { background: var(--off); }
  .med-td { padding: 12px 16px; font-size: 13px; color: var(--ink-2); }
  .med-code { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px; color: var(--ink); background: var(--off); border: 1.5px solid var(--border); border-radius: 6px; padding: 3px 8px; display: inline-block; }
  .med-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 99px; font-size: 10px; font-weight: 700; border: 1px solid; }
  .med-icon-btn { width: 30px; height: 30px; border-radius: 7px; border: 1.5px solid var(--border); background: var(--off); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .12s; }
  .med-icon-btn:hover { background: var(--white); border-color: var(--border-md); }
  .med-icon-btn.danger:hover { border-color: var(--red-bd); background: var(--red-bg); }
  .med-skeleton-row { height: 52px; background: linear-gradient(90deg, var(--off) 25%, var(--border) 50%, var(--off) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .adm-btn { display: flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 9px; border: none; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; }
  .adm-btn-ghost { background: var(--white); color: var(--ink-2); border: 1.5px solid var(--border) !important; }
  .adm-btn-ghost:hover { background: var(--off); }
  .adm-btn-primary { background: var(--ink); color: #fff; }
  .adm-btn-primary:hover { background: var(--ink-2); }
  .adm-btn:disabled { opacity:.5; cursor:not-allowed; }
  .med-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .med-modal { background: var(--white); border-radius: 18px; width: 100%; max-width: 460px; overflow: hidden; }
  .med-modal-head { padding: 20px 24px; border-bottom: 1.5px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .med-modal-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 16px; color: var(--ink); }
  .med-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
  .med-field label { display: block; font-size: 11px; font-weight: 700; color: var(--ink-3); text-transform: uppercase; letter-spacing: .04em; margin-bottom: 6px; }
  .med-field input, .med-field select { width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 9px; font-family: 'Inter', sans-serif; font-size: 13px; color: var(--ink); background: var(--off); outline: none; transition: border-color .15s; }
  .med-field input:focus, .med-field select:focus { border-color: var(--teal); background: var(--white); }
  .med-row-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .med-modal-foot { padding: 16px 24px; border-top: 1.5px solid var(--border); display: flex; gap: 8px; justify-content: flex-end; }
`

const ESTADO_STYLE = {
  activo:    { bg: 'var(--green-bg)', color: 'var(--green)', border: 'var(--green-bd)', dot: '#16a34a', label: 'Activo' },
  inactivo:  { bg: 'var(--red-bg)',   color: 'var(--red)',   border: 'var(--red-bd)',   dot: '#dc2626', label: 'Inactivo' },
  mantenimiento: { bg: 'var(--amber-bg)', color: 'var(--amber)', border: 'var(--amber-bd)', dot: '#d97706', label: 'Mantenimiento' },
}

const EMPTY_FORM = { codigo: '', usuario_id: '', zona: '', estado: 'activo', fecha_instalacion: '' }

export default function MedidoresComponent() {
  const [medidores, setMedidores] = useState([])
  const [usuarios, setUsuarios] = useState([])
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
    const [{ data: m }, { data: u }] = await Promise.all([
      supabase.from('medidores').select('*, usuarios(nombre, apellido)').order('id', { ascending: false }),
      supabase.from('usuarios').select('id, nombre, apellido').order('nombre')
    ])
    setMedidores(m || [])
    setUsuarios(u || [])
    setLoading(false)
  }

  function openNew() { setEditItem(null); setForm(EMPTY_FORM); setModal(true) }
  function openEdit(m) { setEditItem(m); setForm({ codigo: m.codigo, usuario_id: m.usuario_id || '', zona: m.zona || '', estado: m.estado || 'activo', fecha_instalacion: m.fecha_instalacion?.split('T')[0] || '' }); setModal(true) }

  async function handleSave() {
    setSaving(true)
    const payload = { ...form, usuario_id: form.usuario_id || null }
    if (editItem) { await supabase.from('medidores').update(payload).eq('id', editItem.id) }
    else { await supabase.from('medidores').insert(payload) }
    setSaving(false); setModal(false); fetchAll()
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este medidor?')) return
    await supabase.from('medidores').delete().eq('id', id)
    fetchAll()
  }

  const filtered = medidores.filter(m => {
    const q = search.toLowerCase()
    const matchQ = !q || `${m.codigo} ${m.zona || ''} ${m.usuarios?.nombre || ''} ${m.usuarios?.apellido || ''}`.toLowerCase().includes(q)
    const matchF = filtro === 'todos' || m.estado === filtro
    return matchQ && matchF
  })

  return (
    <div className="med-wrap">
      <style>{css}</style>

      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: 'var(--ink)', letterSpacing: '-.04em' }}>Medidores</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 5 }}>{medidores.length} medidores instalados</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="adm-btn adm-btn-ghost" onClick={fetchAll}><RefreshCw size={13} /> Actualizar</button>
          <button className="adm-btn adm-btn-primary" onClick={openNew}><Plus size={14} /> Nuevo medidor</button>
        </div>
      </div>

      <div className="med-toolbar">
        <div className="med-search">
          <Search size={14} color="var(--ink-4)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar código, usuario, zona..." />
          {search && <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', display: 'flex' }} onClick={() => setSearch('')}><X size={13} /></button>}
        </div>
        {['todos', 'activo', 'inactivo', 'mantenimiento'].map(e => (
          <button key={e} className={`med-filter-btn ${filtro === e ? 'active' : ''}`} onClick={() => setFiltro(e)}>
            {e === 'todos' ? 'Todos' : ESTADO_STYLE[e]?.label}
          </button>
        ))}
        <span style={{ fontSize: 13, color: 'var(--ink-3)', marginLeft: 'auto' }}>{filtered.length} resultados</span>
      </div>

      <div className="med-table-wrap">
        <table className="med-table">
          <thead>
            <tr>{['Código', 'Usuario', 'Zona', 'Estado', 'Instalación', 'Acciones'].map(h => <th key={h} className="med-th">{h}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? Array(6).fill(0).map((_, i) => (
              <tr key={i}><td colSpan={6}><div className="med-skeleton-row" /></td></tr>
            )) : filtered.map((m, i) => {
              const st = ESTADO_STYLE[m.estado] || ESTADO_STYLE.activo
              const nombreUsuario = m.usuarios ? `${m.usuarios.nombre} ${m.usuarios.apellido}` : '—'
              return (
                <motion.tr key={m.id} className="med-tr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td className="med-td"><span className="med-code">{m.codigo}</span></td>
                  <td className="med-td" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><User size={13} color="var(--ink-4)" /> {nombreUsuario}</td>
                  <td className="med-td"><div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={12} color="var(--ink-4)" /> {m.zona || '—'}</div></td>
                  <td className="med-td">
                    <span className="med-badge" style={{ background: st.bg, color: st.color, borderColor: st.border }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot }} />
                      {st.label}
                    </span>
                  </td>
                  <td className="med-td" style={{ color: 'var(--ink-4)', fontSize: 12 }}>
                    {m.fecha_instalacion ? new Date(m.fecha_instalacion).toLocaleDateString('es-BO') : '—'}
                  </td>
                  <td className="med-td">
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="med-icon-btn" onClick={() => openEdit(m)} title="Editar"><Pencil size={13} color="var(--ink-3)" /></button>
                      <button className="med-icon-btn danger" onClick={() => handleDelete(m.id)} title="Eliminar"><Trash2 size={13} color="var(--red)" /></button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
            No se encontraron medidores.
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div className="med-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setModal(false)}>
            <motion.div className="med-modal" initial={{ scale: .95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .95, y: 16 }}>
              <div className="med-modal-head">
                <span className="med-modal-title">{editItem ? 'Editar medidor' : 'Nuevo medidor'}</span>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', display: 'flex' }} onClick={() => setModal(false)}><X size={18} /></button>
              </div>
              <div className="med-modal-body">
                <div className="med-field"><label>Código</label><input value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))} placeholder="M-0001" /></div>
                <div className="med-field">
                  <label>Usuario asignado</label>
                  <select value={form.usuario_id} onChange={e => setForm(f => ({ ...f, usuario_id: e.target.value }))}>
                    <option value="">Sin asignar</option>
                    {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre} {u.apellido}</option>)}
                  </select>
                </div>
                <div className="med-row-fields">
                  <div className="med-field"><label>Zona</label><input value={form.zona} onChange={e => setForm(f => ({ ...f, zona: e.target.value }))} placeholder="Norte" /></div>
                  <div className="med-field"><label>Estado</label>
                    <select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="mantenimiento">Mantenimiento</option>
                    </select>
                  </div>
                </div>
                <div className="med-field"><label>Fecha de instalación</label><input type="date" value={form.fecha_instalacion} onChange={e => setForm(f => ({ ...f, fecha_instalacion: e.target.value }))} /></div>
              </div>
              <div className="med-modal-foot">
                <button className="adm-btn adm-btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
                <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving || !form.codigo}>
                  {saving ? 'Guardando...' : editItem ? 'Guardar cambios' : 'Crear medidor'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}