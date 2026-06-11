'use client'

import { motion } from 'framer-motion'
import {
  BarChart3, Users, Wrench, Gauge, Eye, FileText, CreditCard,
  MapPin, AlertCircle, Settings, LogOut, Home, Clock
} from 'lucide-react'

export default function AdminSidebar({ activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: Home, color: 'text-indigo-500' },
    { id: 'usuarios', label: 'Gestión de Usuarios', icon: Users, color: 'text-blue-500' },
    { id: 'tecnicos', label: 'Gestión de Técnicos', icon: Wrench, color: 'text-orange-500' },
    { id: 'medidores', label: 'Gestión de Medidores', icon: Gauge, color: 'text-cyan-500' },
    { id: 'lecturas', label: 'Control de Lecturas', icon: Eye, color: 'text-green-500' },
    { id: 'reportes', label: 'Gestión de Reportes', icon: FileText, color: 'text-purple-500' },
    { id: 'facturacion', label: 'Facturación', icon: CreditCard, color: 'text-emerald-500' },
    { id: 'zonas', label: 'Zonas y Sectores', icon: MapPin, color: 'text-pink-500' },
    { id: 'alertas', label: 'Alertas y Anomalías', icon: AlertCircle, color: 'text-red-500' },
    { id: 'auditoria', label: 'Auditoría', icon: Clock, color: 'text-slate-500' },
    { id: 'tarifas', label: 'Configuración Tarifaria', icon: Settings, color: 'text-yellow-500' }
  ]

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 shadow-2xl border-r border-gray-700 h-screen overflow-y-auto sticky top-0">
      {/* LOGO Y BRANDING */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Consumo Net</h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* MENÚ PRINCIPAL */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'text-white' : item.color} />
            <span className="text-sm font-medium">{item.label}</span>
            {activeTab === item.id && (
              <div className="ml-auto w-1.5 h-6 bg-white rounded-full"></div>
            )}
          </motion.button>
        ))}
      </nav>

      {/* FOOTER CON LOGOUT */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900">
        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-200 border border-red-500/30"
        >
          <LogOut size={18} />
          <span className="font-semibold">Cerrar Sesión</span>
        </motion.button>
      </div>
    </aside>
  )
}
