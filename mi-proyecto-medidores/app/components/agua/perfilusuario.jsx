'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Phone, MapPin, ShieldCheck,
  Camera, Save, X, Edit2, LogOut, Lock,
  CheckCircle2, AlertTriangle, Loader2, Key
} from 'lucide-react'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  .pf-root {
    --white:      #ffffff;
    --off:        #f9f9f8;
    --border:     #ebebea;
    --border-md:  #d4d4d0;
    --ink:        #111110;
    --ink-2:      #3a3a38;
    --ink-3:      #737370;
    --ink-4:      #b0b0ac;
    --teal:       #0ea5b8;
    --teal-dk:    #0b7a8a;
    --teal-bg:    #e3f6fb;
    --teal-bd:    #a8e0ea;
    --indigo:     #2563eb;
    --indigo-bg:  #eff6ff;
    --indigo-bd:  #bfdbfe;
    --indigo-dk:  #1d4ed8;
    --red:        #dc2626;
    --red-bg:     #fef2f2;
    --red-bd:     #fecaca;
    --green:      #16a34a;
    --green-bg:   #f0fdf4;
    --green-bd:   #bbf7d0;
    --amber:      #d97706;
    --amber-bg:   #fffbeb;
    --amber-bd:   #fde68a;
    font-family: 'Inter', system-ui, sans-serif;
    color: var(--ink);
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* ── HEADER ── */
  .pf-header {
    display: flex; align-items: center; gap: 16px;
    padding-bottom: 24px; border-bottom: 1.5px solid var(--border);
  }
  .pf-header-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--ink); display: flex; align-items: center;
    justify-content: center; color: var(--teal); flex-shrink: 0;
  }
  .pf-title {
    font-family: 'Inter', sans-serif; font-weight: 800; font-size: 28px;
    color: var(--ink); letter-spacing: -.02em; line-height: 1.1;
  }
  .pf-subtitle { font-size: 13px; color: var(--ink-3); margin-top: 4px; }

  /* ── GRID ── */
  .pf-grid { display: grid; grid-template-columns: 260px 1fr; gap: 20px; align-items: start; }

  /* ── AVATAR CARD ── */
  .pf-avatar-card {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 20px; overflow: hidden;
  }
  .pf-avatar-banner {
    height: 80px; background: var(--ink); position: relative;
  }
  .pf-avatar-banner-accent {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(14,165,184,.3) 0%, transparent 60%);
  }
  .pf-avatar-body { padding: 0 20px 24px; }
  .pf-avatar-wrap {
    position: relative; display: inline-block;
    margin-top: -40px; margin-bottom: 14px;
  }
  .pf-avatar {
    width: 80px; height: 80px; border-radius: 20px;
    border: 3px solid var(--white); object-fit: cover;
    background: var(--teal); display: flex; align-items: center;
    justify-content: center; font-family: 'Inter', sans-serif;
    font-weight: 800; font-size: 28px; color: #fff;
    box-shadow: 0 4px 16px rgba(0,0,0,.12);
  }
  .pf-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 17px; }
  .pf-avatar-cam {
    position: absolute; bottom: -4px; right: -4px;
    width: 28px; height: 28px; border-radius: 8px;
    background: var(--teal); border: 2px solid var(--white);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #fff; transition: background .15s;
  }
  .pf-avatar-cam:hover { background: var(--teal-dk); }

  .pf-name {
    font-family: 'Inter', sans-serif; font-weight: 800; font-size: 18px;
    color: var(--ink); letter-spacing: -.01em; line-height: 1.2;
  }
  .pf-type {
    display: inline-flex; align-items: center; margin-top: 6px;
    padding: 4px 12px; border-radius: 99px;
    background: var(--teal-bg); border: 1px solid var(--teal-bd);
    font-size: 11.5px; font-weight: 600; color: var(--teal-dk);
    text-transform: capitalize;
  }
  .pf-divider { height: 1px; background: var(--border); margin: 16px 0; }

  .pf-meta-row {
    display: flex; align-items: center; gap: 10px;
    font-size: 12.5px; color: var(--ink-3); padding: 5px 0;
  }
  .pf-meta-row svg { color: var(--ink-4); flex-shrink: 0; }

  /* ── MAIN CARD ── */
  .pf-main-card {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 20px; padding: 28px;
    display: flex; flex-direction: column; gap: 24px;
  }
  .pf-section-title {
    font-family: 'Inter', sans-serif; font-weight: 700; font-size: 13px;
    color: var(--ink); display: flex; align-items: center; gap: 8px;
    margin-bottom: 12px;
  }
  .pf-section-icon {
    width: 26px; height: 26px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
  }
  .pf-section-icon.teal   { background: var(--teal-bg);   color: var(--teal); }
  .pf-section-icon.indigo { background: var(--indigo-bg); color: var(--indigo); }
  .pf-section-icon.red    { background: var(--red-bg);    color: var(--red); }

  /* ── FIELD ── */
  .pf-field { display: flex; flex-direction: column; gap: 6px; }
  .pf-label { font-size: 11.5px; font-weight: 600; color: var(--ink-3); letter-spacing: .04em; text-transform: uppercase; }
  .pf-value {
    font-size: 14px; font-weight: 500; color: var(--ink);
    padding: 11px 14px; background: var(--off); border-radius: 10px;
    border: 1.5px solid var(--border);
  }
  .pf-value.disabled { color: var(--ink-4); }
  .pf-input {
    font-size: 14px; font-weight: 500; color: var(--ink);
    padding: 11px 14px; background: var(--white); border-radius: 10px;
    border: 1.5px solid var(--teal-bd); outline: none;
    font-family: 'Inter', sans-serif; transition: border-color .15s;
    width: 100%;
  }
  .pf-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(14,165,184,.1); }
  .pf-input-note { font-size: 11px; color: var(--ink-4); margin-top: 2px; }

  .pf-fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  /* ── BADGES INFO ── */
  .pf-badges { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .pf-badge {
    padding: 14px 16px; border-radius: 14px; border: 1.5px solid;
    display: flex; align-items: flex-start; gap: 10px;
  }
  .pf-badge.green  { background: var(--green-bg);  border-color: var(--green-bd); }
  .pf-badge.indigo { background: var(--indigo-bg); border-color: var(--indigo-bd); }
  .pf-badge-icon { flex-shrink: 0; margin-top: 1px; }
  .pf-badge.green  .pf-badge-icon { color: var(--green); }
  .pf-badge.indigo .pf-badge-icon { color: var(--indigo); }
  .pf-badge-t { font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 2px; font-family: 'Inter', sans-serif; }
  .pf-badge-s { font-size: 11px; color: var(--ink-3); line-height: 1.4; }

  /* ── ACCIONES ── */
  .pf-actions { display: flex; flex-direction: column; gap: 10px; }
  .pf-btn {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 9px;
    padding: 13px; border-radius: 12px; border: none;
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all .15s; letter-spacing: -.01em;
  }
  .pf-btn-primary { background: var(--teal); color: #fff; }
  .pf-btn-primary:hover:not(:disabled) { background: var(--teal-dk); }
  .pf-btn-primary:disabled { opacity: .45; cursor: not-allowed; }
  .pf-btn-ghost {
    background: var(--white); color: var(--ink-2);
    border: 1.5px solid var(--border) !important;
    border: none;
  }
  .pf-btn-ghost:hover { background: var(--off); color: var(--ink); }
  .pf-btn-danger { background: var(--red-bg); color: var(--red); border: 1.5px solid var(--red-bd) !important; border: none; }
  .pf-btn-danger:hover { background: #fecaca; }

  /* ── TOAST ── */
  .pf-toast {
    position: fixed; top: 24px; right: 24px; z-index: 100;
    border-radius: 14px; padding: 14px 20px; font-size: 13px; font-weight: 600;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,.15);
  }
  .pf-toast.ok    { background: var(--green-bg); border: 1.5px solid var(--green-bd); color: var(--green); }
  .pf-toast.error { background: var(--red-bg);   border: 1.5px solid var(--red-bd);   color: var(--red); }

  .pf-spin { animation: pf-spin .7s linear infinite; }
  @keyframes pf-spin { to { transform: rotate(360deg); } }

  @media (max-width: 820px) {
    .pf-grid { grid-template-columns: 1fr; }
    .pf-fields-grid { grid-template-columns: 1fr; }
    .pf-badges { grid-template-columns: 1fr; }
    .pf-title { font-size: 22px; }
  }
`

export default function PerfilUsuario() {
  const [usuario,    setUsuario]    = useState(null)
  const [editando,   setEditando]   = useState(false)
  const [formData,   setFormData]   = useState({})
  const [guardando,  setGuardando]  = useState(false)
  const [subiendo,   setSubiendo]   = useState(false)
  const [toast,      setToast]      = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return
      const { data, error } = await supabase
        .from('usuarios').select('*').eq('correo', session.user.email).single()
      if (error) { showToast('error', 'Error al cargar los datos'); return }
      setUsuario(data)
      setFormData({ nombre: data.nombre || '', telefono: data.telefono || '' })
    }
    fetchUser()
  }, [])

  const showToast = (type, msg) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const guardarCambios = async () => {
    setGuardando(true)
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ nombre: formData.nombre, telefono: formData.telefono })
        .eq('id', usuario.id)
      if (error) throw error
      setUsuario(prev => ({ ...prev, ...formData }))
      setEditando(false)
      showToast('ok', 'Perfil actualizado correctamente')
    } catch {
      showToast('error', 'Error al guardar los cambios')
    }
    setGuardando(false)
  }

  const cancelarEdicion = () => {
    setFormData({ nombre: usuario.nombre || '', telefono: usuario.telefono || '' })
    setEditando(false)
  }

  const handleFotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('error', 'Solo imágenes JPG, PNG o WEBP'); return
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Máximo 5 MB'); return
    }
    setSubiendo(true)
    try {
      const ext      = file.name.split('.').pop()
      const fileName = `usuario_${usuario.id}_${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('avatars-public1').upload(fileName, file)
      if (upErr) throw upErr
      const { data } = supabase.storage.from('avatars-public1').getPublicUrl(fileName)
      const { error: updErr } = await supabase
        .from('usuarios').update({ foto: data.publicUrl }).eq('id', usuario.id)
      if (updErr) throw updErr
      setUsuario(prev => ({ ...prev, foto: data.publicUrl }))
      showToast('ok', 'Foto actualizada')
    } catch {
      showToast('error', 'Error al subir la foto')
    }
    setSubiendo(false)
    e.target.value = ''
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (!usuario) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12, color: '#737370', fontSize: 13 }}>
      <Loader2 size={20} style={{ animation: 'pf-spin .7s linear infinite' }} />
      Cargando perfil…
      <style>{`@keyframes pf-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const inicial = usuario.nombre?.charAt(0)?.toUpperCase() || '?'

  return (
    <div className="pf-root">
      <style>{css}</style>

      {/* HEADER */}
      <div className="pf-header">
        <div className="pf-header-icon"><User size={22} /></div>
        <div>
          <div className="pf-title">Mi Perfil</div>
          <div className="pf-subtitle">Gestión de datos personales y preferencias de cuenta</div>
        </div>
      </div>

      <div className="pf-grid">

        {/* ── AVATAR CARD ── */}
        <div className="pf-avatar-card">
          <div className="pf-avatar-banner">
            <div className="pf-avatar-banner-accent" />
          </div>
          <div className="pf-avatar-body">
            <div className="pf-avatar-wrap">
              <div className="pf-avatar">
                {usuario.foto
                  ? <img src={usuario.foto} alt="avatar" />
                  : inicial}
              </div>
              <div
                className="pf-avatar-cam"
                onClick={() => fileInputRef.current?.click()}
                title="Cambiar foto"
              >
                {subiendo
                  ? <Loader2 size={12} className="pf-spin" />
                  : <Camera size={12} />}
              </div>
              <input
                type="file" accept="image/*" ref={fileInputRef}
                style={{ display: 'none' }} onChange={handleFotoChange}
              />
            </div>

            <div className="pf-name">{usuario.nombre}</div>
            <div className="pf-type">{usuario.tipo_usuario || 'doméstico'}</div>

            <div className="pf-divider" />

            <div className="pf-meta-row">
              <Mail size={13} />
              <span style={{ fontSize: 12, wordBreak: 'break-all' }}>{usuario.correo}</span>
            </div>
            {usuario.telefono && (
              <div className="pf-meta-row">
                <Phone size={13} />
                <span>{usuario.telefono}</span>
              </div>
            )}
            {usuario.direccion && (
              <div className="pf-meta-row">
                <MapPin size={13} />
                <span style={{ fontSize: 12 }}>{usuario.direccion}</span>
              </div>
            )}

            <div className="pf-divider" />

            {/* ACCIONES */}
            <div className="pf-actions">
              {!editando ? (
                <button className="pf-btn pf-btn-primary" onClick={() => setEditando(true)}>
                  <Edit2 size={15} /> Editar perfil
                </button>
              ) : (
                <>
                  <button
                    className="pf-btn pf-btn-primary"
                    onClick={guardarCambios}
                    disabled={guardando}
                  >
                    {guardando
                      ? <><Loader2 size={15} className="pf-spin" /> Guardando…</>
                      : <><Save size={15} /> Guardar cambios</>}
                  </button>
                  <button className="pf-btn pf-btn-ghost" onClick={cancelarEdicion}>
                    <X size={15} /> Cancelar
                  </button>
                </>
              )}
              <button className="pf-btn pf-btn-ghost" onClick={() => showToast('ok', 'Revisá tu correo para cambiar la contraseña')}>
                <Key size={15} /> Cambiar contraseña
              </button>
              <button className="pf-btn pf-btn-danger" onClick={handleLogout}>
                <LogOut size={15} /> Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN CARD ── */}
        <div className="pf-main-card">

          {/* DATOS PERSONALES */}
          <div>
            <div className="pf-section-title">
              <div className="pf-section-icon teal"><User size={13} /></div>
              Datos personales
            </div>
            <div className="pf-fields-grid">
              <div className="pf-field">
                <div className="pf-label">Nombre completo</div>
                {editando
                  ? <input
                      className="pf-input" name="nombre"
                      value={formData.nombre} onChange={handleChange}
                    />
                  : <div className="pf-value">{usuario.nombre || '—'}</div>}
              </div>

              <div className="pf-field">
                <div className="pf-label">Teléfono</div>
                {editando
                  ? <>
                      <input
                        className="pf-input" name="telefono"
                        value={formData.telefono} onChange={handleChange}
                        placeholder="Ej: 70012345"
                      />
                      <div className="pf-input-note">Opcional · usado para notificaciones</div>
                    </>
                  : <div className="pf-value">{usuario.telefono || 'No registrado'}</div>}
              </div>

              <div className="pf-field">
                <div className="pf-label">Correo electrónico</div>
                <div className="pf-value disabled" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Lock size={12} style={{ color: 'var(--ink-4)' }} />
                  {usuario.correo}
                </div>
                <div className="pf-input-note">El correo no se puede modificar por seguridad</div>
              </div>

              <div className="pf-field">
                <div className="pf-label">Tipo de cuenta</div>
                <div className="pf-value" style={{ textTransform: 'capitalize' }}>
                  {usuario.tipo_usuario || 'Doméstico'}
                </div>
              </div>

              {usuario.direccion && (
                <div className="pf-field" style={{ gridColumn: '1 / -1' }}>
                  <div className="pf-label">Dirección registrada</div>
                  <div className="pf-value">{usuario.direccion}</div>
                </div>
              )}
            </div>
          </div>

          {/* CUENTA */}
          <div>
            <div className="pf-section-title">
              <div className="pf-section-icon indigo"><ShieldCheck size={13} /></div>
              Estado de la cuenta
            </div>
            <div className="pf-badges">
              <div className="pf-badge green">
                <CheckCircle2 size={16} className="pf-badge-icon" />
                <div>
                  <div className="pf-badge-t">Cuenta activa</div>
                  <div className="pf-badge-s">Acceso completo al sistema habilitado</div>
                </div>
              </div>
              <div className="pf-badge indigo">
                <ShieldCheck size={16} className="pf-badge-icon" />
                <div>
                  <div className="pf-badge-t">Antifraude activo</div>
                  <div className="pf-badge-s">Validación de proximidad habilitada</div>
                </div>
              </div>
              {usuario.descuento > 0 && (
                <div className="pf-badge green" style={{ gridColumn: '1 / -1' }}>
                  <CheckCircle2 size={16} className="pf-badge-icon" />
                  <div>
                    <div className="pf-badge-t">{usuario.descuento}% de descuento aplicado</div>
                    <div className="pf-badge-s">Descuento activo en tu tarifa mensual</div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`pf-toast ${toast.type}`}
            initial={{ opacity: 0, y: -20, scale: .9 }}
            animate={{ opacity: 1, y: 0,   scale: 1  }}
            exit={{   opacity: 0, y: -20, scale: .9 }}
          >
            {toast.type === 'ok'
              ? <CheckCircle2 size={16} />
              : <AlertTriangle size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
