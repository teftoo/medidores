'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import {
  Wrench, UserPlus, Search, X, RefreshCw,
  Mail, Phone, MapPin, Pencil, Trash2, Star, Activity
} from 'lucide-react'

const css = `
  .tec-wrap { font-family: 'Inter', sans-serif; }
  .tec-toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .tec-search { display: flex; align-items: center; gap: 8px; border: 1.5px solid var(--border); background: var(--white); border-radius: 10px; padding: 0 12px; height: 38px; flex: 1; max-width: 320px; transition: border-color .15s; }
  .tec-search:focus-within { border-color: var(--teal); }
  .tec-search input { border: none; outline: none; background: none; font-size: 13px; color: var(--ink); flex: 1; font-family: 'Inter', sans-serif; }
  .tec-search input::placeholder { color: var(--ink-4); }
  .tec-filter-btn { display: flex; align-items: center; gap: 6px; padding: 0 14px; height: 38px; border: 1.5px solid var(--border); background: var(--white); border-radius: 10px; cursor: pointer; font-size: 13px; font-family: 'Inter', sans-serif; color: var(--ink-2); transition: all .12s; }
  .tec-filter-btn:hover { background: var(--off); }
  .tec-filter-btn.active { border-color: var(--teal); color: var(--teal); background: var(--teal-bg); }
  .tec-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
  .tec-card { background: var(--white); border: 1.5px solid var(--border); border-radius: 14px; padding: 20px; cursor: pointer; transition: all .2s; }
  .tec-card:hover { border-color: var(--teal-bd); box-shadow: 0 4px 16px rgba(0,166,126,.08); }
  .tec-avatar { width: 48px; height: 48px; border-radius: 12px; background: var(--ink); border: 2px solid var(--teal); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 17px; color: var(--teal); }
  .tec-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: var(--ink); }
  .tec-id { font-size: 11px; color: var(--ink-4); margin-top: 2px; }
  .tec-info { font-size: 12px; color: var(--ink-3); display: flex; align-items: center; gap: 6px; margin-top: 6px; }
  .tec-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 99px; font-size: 10px; font-weight: 700; border: 1px solid; }
  .tec-stats-row { display: flex; gap: 8px; margin-top: 14px; }
  .tec-stat { flex: 1; background: var(--off); border: 1.5px solid var(--border); border-radius: 9px; padding: 8px 10px; }
  .tec-stat-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 15px; color: var(--ink); }
  .tec-stat-lbl { font-size: 10px; color: var(--ink-4); margin-top: 1px; }
  .tec-actions { display: flex; gap: 6px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
  .tec-act-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px; padding: 7px; border-radius: 8px; border: 1.5px solid var(--border); background: var(--off); cursor: pointer; font-size: 12px; font-family: 'Syne', sans-serif; font-weight: 700; color: var(--ink-3); transition: all .12s; }
  .tec-act-btn:hover { background: var(--white); border-color: var(--border-md); color: var(--ink); }
  .tec-act-btn.danger:hover { border-color: var(--red-bd); color: var(--red); background: var(--red-bg); }
  .tec-skeleton { height: 200px; background: linear-gradient(90deg, var(--off) 25%, var(--border) 50%, var(--off) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 14px; border: 1.5px solid var(--border); }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .adm-btn { display: flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 9px; border: none; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; }
  .adm-btn-ghost { background: var(--white); color: var(--ink-2); border: 1.5px solid var(--border) !important; }
  .adm-btn-ghost:hover { background: var(--off); }
  .adm-btn-primary { background: var(--ink); color: #fff; }
  .adm-btn-primary:hover { background: var(--ink-2); }
  .adm-btn:disabled { opacity:.5; cursor:not-allowed; }
  .tec-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .tec-modal { background: var(--white); border-radius: 18px; width: 100%; max-width: 480px; overflow: hidden; }
  .tec-modal-head { padding: 20px 24px; border-bottom: 1.5px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .tec-modal-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 16px; color: var(--ink); }
  .tec-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
  .tec-field label { display: block; font-size: 11px; font-weight: 700; color: var(--ink-3); text-transform: uppercase; letter-spacing: .04em; margin-bottom: 6px; }
  .tec-field input, .tec-field select { width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 9px; font-family: 'Inter', sans-serif; font-size: 13px; color: var(--ink); background: var(--off); outline: none; transition: border-color .15s; }
  .tec-field input:focus, .tec-field select:focus { border-color: var(--teal); background: var(--white); }
  .tec-row-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .tec-modal-foot { padding: 16px 24px; border-top: 1.5px solid var(--border); display: flex; gap: 8px; justify-content: flex-end; }
`

const ESTADO_STYLE = {
  activo:    { bg: 'var(--green-bg)', color: 'var(--green)', border: 'var(--green-bd)', dot: '#16a34a', label: 'Activo' },
  inactivo:  { bg: 'var(--red-bg)',   color: 'var(--red)',   border: 'var(--red-bd)',   dot: '#dc2626', label: 'Inactivo' },
  vacaciones:{ bg: 'var(--amber-bg)', color: 'var(--amber)', border: 'var(--amber-bd)', dot: '#d97706', label: 'Vacaciones' },
}

const EMPTY_FORM = { nombre: '', apellido: '', email: '', telefono: '', zona: '', estado: 'activo', especialidad: '' }

export default function TecnicosComponent() {
  const [tecnicos, setTecnicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchTecnicos() }, [])

  async function fetchTecnicos() {
    setLoading(true)
    const { data } = await supabase.from('tecnicos').select('*').order('created_at', { ascending: false })
    setTecnicos(data || [])
    setLoading(false)
  }

  function openNew() { setEditItem(null); setForm(EMPTY_FORM); setModal(true) }
  function openEdit(t) { setEditItem(t); setForm({ nombre: t.nombre, apellido: t.apellido, email: t.email || '', telefono: t.telefono || '', zona: t.zona || '', estado: t.estado || 'activo', especialidad: t.especialidad || '' }); setModal(true) }

  async function handleSave() {
    setSaving(true)
    if (editItem) { await supabase.from('tecnicos').update(form).eq('id', editItem.id) }
    else { await supabase.from('tecnicos').insert(form) }
    setSaving(false); setModal(false); fetchTecnicos()
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este técnico?')) return
    await supabase.from('tecnicos').delete().eq('id', id)
    fetchTecnicos()
  }

  const filtered = tecnicos.filter(t => {
    const q = search.toLowerCase()
    const matchQ = !q || `${t.nombre} ${t.apellido} ${t.email || ''}`.toLowerCase().includes(q)
    const matchF = filtro === 'todos' || t.estado === filtro
    return matchQ && matchF
  })

  const initials = t => `${t.nombre?.[0] || ''}${t.apellido?.[0] || ''}`.toUpperCase()

  return (
    <div className="tec-wrap">
      <style>{css}</style>

      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: 'var(--ink)', letterSpacing: '-.04em' }}>Técnicos</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 5 }}>{tecnicos.length} técnicos registrados</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="adm-btn adm-btn-ghost" onClick={fetchTecnicos}><RefreshCw size={13} /> Actualizar</button>
          <button className="adm-btn adm-btn-primary" onClick={openNew}><UserPlus size={14} /> Nuevo técnico</button>
        </div>
      </div>

      <div className="tec-toolbar">
        <div className="tec-search">
          <Search size={14} color="var(--ink-4)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar técnico..." />
          {search && <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', display: 'flex' }} onClick={() => setSearch('')}><X size={13} /></button>}
        </div>
        {['todos', 'activo', 'inactivo', 'vacaciones'].map(e => (
          <button key={e} className={`tec-filter-btn ${filtro === e ? 'active' : ''}`} onClick={() => setFiltro(e)}>
            {e === 'todos' ? 'Todos' : ESTADO_STYLE[e]?.label}
          </button>
        ))}
        <span style={{ fontSize: 13, color: 'var(--ink-3)', marginLeft: 'auto' }}>{filtered.length} resultados</span>
      </div>

      <div className="tec-grid">
        {loading ? Array(4).fill(0).map((_, i) => <div key={i} className="tec-skeleton" />) :
          filtered.map((t, i) => {
            const st = ESTADO_STYLE[t.estado] || ESTADO_STYLE.activo
            return (
              <motion.div key={t.id} className="tec-card"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div className="tec-avatar">{initials(t)}</div>
                    <div>
                      <div className="tec-name">{t.nombre} {t.apellido}</div>
                      <div className="tec-id">Técnico #{t.id}</div>
                    </div>
                  </div>
                  <span className="tec-badge" style={{ background: st.bg, color: st.color, borderColor: st.border }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot }} />
                    {st.label}
                  </span>
                </div>
                {t.email     && <div className="tec-info"><Mail size={12} color="var(--ink-4)" /> {t.email}</div>}
                {t.telefono  && <div className="tec-info"><Phone size={12} color="var(--ink-4)" /> {t.telefono}</div>}
                {t.zona      && <div className="tec-info"><MapPin size={12} color="var(--ink-4)" /> Zona {t.zona}</div>}
                {t.especialidad && <div className="tec-info"><Wrench size={12} color="var(--ink-4)" /> {t.especialidad}</div>}
                <div className="tec-stats-row">
                  <div className="tec-stat"><div className="tec-stat-val">{t.lecturas_count ?? '—'}</div><div className="tec-stat-lbl">Lecturas</div></div>
                  <div className="tec-stat"><div className="tec-stat-val">{t.calificacion ?? '—'}</div><div className="tec-stat-lbl">Calificación</div></div>
                </div>
                <div className="tec-actions">
                  <button className="tec-act-btn" onClick={() => openEdit(t)}><Pencil size={12} /> Editar</button>
                  <button className="tec-act-btn danger" onClick={() => handleDelete(t.id)}><Trash2 size={12} /> Eliminar</button>
                </div>
              </motion.div>
            )
          })}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div className="tec-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setModal(false)}>
            <motion.div className="tec-modal" initial={{ scale: .95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .95, y: 16 }}>
              <div className="tec-modal-head">
                <span className="tec-modal-title">{editItem ? 'Editar técnico' : 'Nuevo técnico'}</span>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', display: 'flex' }} onClick={() => setModal(false)}><X size={18} /></button>
              </div>
              <div className="tec-modal-body">
                <div className="tec-row-fields">
                  <div className="tec-field"><label>Nombre</label><input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Juan" /></div>
                  <div className="tec-field"><label>Apellido</label><input value={form.apellido} onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))} placeholder="Lima" /></div>
                </div>
                <div className="tec-field"><label>Email</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="juan@sbnet.bo" /></div>
                <div className="tec-row-fields">
                  <div className="tec-field"><label>Teléfono</label><input value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} placeholder="+591 7..." /></div>
                  <div className="tec-field"><label>Zona asignada</label><input value={form.zona} onChange={e => setForm(f => ({ ...f, zona: e.target.value }))} placeholder="Sur" /></div>
                </div>
                <div className="tec-row-fields">
                  <div className="tec-field"><label>Especialidad</label><input value={form.especialidad} onChange={e => setForm(f => ({ ...f, especialidad: e.target.value }))} placeholder="Medidores electrónicos" /></div>
                  <div className="tec-field"><label>Estado</label>
                    <select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="vacaciones">Vacaciones</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="tec-modal-foot">
                <button className="adm-btn adm-btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
                <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving || !form.nombre}>
                  {saving ? 'Guardando...' : editItem ? 'Guardar cambios' : 'Crear técnico'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}