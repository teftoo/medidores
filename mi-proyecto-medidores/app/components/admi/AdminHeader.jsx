'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Settings, LogOut, ChevronDown, Zap, User, Shield, Moon, Sun } from 'lucide-react'

const mockNotifications = [
  { id: 1, type: 'alert', msg: 'Consumo anómalo en Zona Norte', time: '2 min', unread: true },
  { id: 2, type: 'user',  msg: 'Nuevo usuario registrado: J. Mamani', time: '15 min', unread: true },
  { id: 3, type: 'bill',  msg: 'Factura #0482 generada exitosamente', time: '1h', unread: true },
  { id: 4, type: 'system',msg: 'Backup automático completado', time: '3h', unread: false },
]

const typeColor = {
  alert:  { bg: '#FEF2F2', dot: '#EF4444', label: 'Alerta' },
  user:   { bg: '#F0FDF4', dot: '#22C55E', label: 'Usuario' },
  bill:   { bg: '#F0F9FF', dot: '#0EA5E9', label: 'Factura' },
  system: { bg: '#F9FAFB', dot: '#9CA3AF', label: 'Sistema' },
}

export default function AdminHeader({
  userName = 'Administrador',
  onLogout,
  onSettingsClick,
}) {
  const [notifOpen, setNotifOpen]   = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [darkMode, setDarkMode]     = useState(false)
  const [time, setTime]             = useState(new Date())

  const unreadCount = mockNotifications.filter(n => n.unread).length

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])

  const closeAll = () => { setNotifOpen(false); setProfileOpen(false) }

  const formattedTime = time.toLocaleTimeString('es-BO', {
    hour: '2-digit', minute: '2-digit',
  })
  const formattedDate = time.toLocaleDateString('es-BO', {
    weekday: 'short', day: 'numeric', month: 'short',
  })

  return (
    <>
      {/* Overlay to close dropdowns */}
      {(notifOpen || profileOpen) && (
        <div className="fixed inset-0 z-40" onClick={closeAll} />
      )}

      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #E5E7EB',
          fontFamily: '"Inter", "Helvetica Neue", sans-serif',
        }}
      >
        <div style={{
          maxWidth: '100%',
          padding: '0 2rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>

          {/* ── LEFT: Brand + Status ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Logo mark */}
            <div style={{
              width: '36px', height: '36px',
              backgroundColor: '#111827',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Zap size={18} color="#10B981" strokeWidth={2.5} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827', letterSpacing: '-0.3px' }}>
                  Servicios
                </span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#10B981', letterSpacing: '-0.3px' }}>
                  Básicos
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0, lineHeight: 1 }}>
                Panel de Administración
              </p>
            </div>

            {/* System status pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '999px',
              padding: '4px 10px',
            }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 0 2px #D1FAE5',
                display: 'inline-block',
                animation: 'pulse-green 2s infinite',
              }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Sistema activo
              </span>
            </div>
          </div>

          {/* ── CENTER: Clock ── */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#111827', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              {formattedTime}
            </span>
            <span style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'capitalize' }}>
              {formattedDate}
            </span>
          </div>

          {/* ── RIGHT: Actions ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

            {/* Settings button */}
            <IconBtn onClick={onSettingsClick} label="Configuración">
              <Settings size={18} color="#6B7280" />
            </IconBtn>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <IconBtn
                onClick={() => { setNotifOpen(v => !v); setProfileOpen(false) }}
                label="Notificaciones"
                active={notifOpen}
              >
                <Bell size={18} color="#6B7280" />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '6px', right: '6px',
                    width: '16px', height: '16px', borderRadius: '50%',
                    backgroundColor: '#EF4444',
                    border: '2px solid #fff',
                    fontSize: '9px', fontWeight: 700, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    lineHeight: 1,
                  }}>
                    {unreadCount}
                  </span>
                )}
              </IconBtn>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                      width: '320px',
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                      overflow: 'hidden',
                      zIndex: 100,
                    }}
                  >
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>Notificaciones</span>
                      <button style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                        Marcar todo leído
                      </button>
                    </div>
                    {mockNotifications.map(n => {
                      const c = typeColor[n.type]
                      return (
                        <div key={n.id} style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #F9FAFB',
                          display: 'flex', gap: '10px', alignItems: 'flex-start',
                          backgroundColor: n.unread ? '#FAFAFA' : '#fff',
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                        }}>
                          <span style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            backgroundColor: c.dot, flexShrink: 0, marginTop: '5px',
                          }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#374151', lineHeight: 1.4 }}>{n.msg}</p>
                            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{n.time} atrás</span>
                          </div>
                          {n.unread && (
                            <span style={{
                              width: '6px', height: '6px', borderRadius: '50%',
                              backgroundColor: '#10B981', flexShrink: 0, marginTop: '6px',
                            }} />
                          )}
                        </div>
                      )
                    })}
                    <div style={{ padding: '10px 16px', textAlign: 'center' }}>
                      <button style={{ fontSize: '12px', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer' }}>
                        Ver todas las notificaciones →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '28px', backgroundColor: '#E5E7EB', margin: '0 4px' }} />

            {/* Profile dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setProfileOpen(v => !v); setNotifOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '6px 10px 6px 6px',
                  borderRadius: '10px',
                  border: profileOpen ? '1px solid #E5E7EB' : '1px solid transparent',
                  backgroundColor: profileOpen ? '#F9FAFB' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  backgroundColor: '#111827',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#10B981' }}>
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>
                    {userName}
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#10B981', lineHeight: 1.2 }}>
                    Administrador
                  </p>
                </div>
                <ChevronDown
                  size={14} color="#9CA3AF"
                  style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                      width: '220px',
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                      overflow: 'hidden',
                      zIndex: 100,
                    }}
                  >
                    {/* User info header */}
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6' }}>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#111827' }}>{userName}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#9CA3AF' }}>admin@serviciosbasicos.bo</p>
                    </div>

                    {/* Menu items */}
                    {[
                      { icon: User,    label: 'Mi perfil',       action: null },
                      { icon: Shield,  label: 'Seguridad',       action: null },
                      { icon: Settings,label: 'Configuración',   action: onSettingsClick },
                    ].map(({ icon: Icon, label, action }) => (
                      <button
                        key={label}
                        onClick={() => { closeAll(); action?.() }}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 16px', background: 'none', border: 'none',
                          cursor: 'pointer', fontSize: '13px', color: '#374151',
                          transition: 'background 0.15s', textAlign: 'left',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Icon size={15} color="#6B7280" />
                        {label}
                      </button>
                    ))}

                    <div style={{ height: '1px', backgroundColor: '#F3F4F6', margin: '4px 0' }} />

                    <button
                      onClick={() => { closeAll(); onLogout?.() }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 16px', background: 'none', border: 'none',
                        cursor: 'pointer', fontSize: '13px', color: '#EF4444',
                        transition: 'background 0.15s', textAlign: 'left',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={15} color="#EF4444" />
                      Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes pulse-green {
            0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
            50%       { box-shadow: 0 0 0 4px rgba(16,185,129,0); }
          }
        `}</style>
      </header>
    </>
  )
}

/* ── Reusable icon button ── */
function IconBtn({ children, onClick, label, active = false }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{
        position: 'relative',
        width: '36px', height: '36px',
        borderRadius: '8px',
        border: active ? '1px solid #E5E7EB' : '1px solid transparent',
        backgroundColor: active ? '#F9FAFB' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = '#F9FAFB' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
    >
      {children}
    </button>
  )
}