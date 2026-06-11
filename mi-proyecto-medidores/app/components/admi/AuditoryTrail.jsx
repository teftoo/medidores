'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { History, Search, Filter, Calendar, User, Database } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function AuditoryTrail() {
  const [auditLogs, setAuditLogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTable, setFilterTable] = useState('all')
  const [filterAction, setFilterAction] = useState('all')
  const [loading, setLoading] = useState(true)
  const [tables, setTables] = useState([])
  const [actions, setActions] = useState([])

  useEffect(() => {
    fetchAuditLogs()
  }, [])

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('historial_cambios')
        .select('*')
        .order('fecha', { ascending: false })
        .limit(500)

      if (error) throw error
      setAuditLogs(data || [])

      // Extract unique tables and actions
      const uniqueTables = [...new Set(data?.map(log => log.tabla_afectada) || [])]
      const uniqueActions = [...new Set(data?.map(log => log.accion) || [])]
      
      setTables(uniqueTables)
      setActions(uniqueActions)
    } catch (err) {
      console.error('Error fetching audit logs:', err)
    } finally {
      setLoading(false)
    }
  }

  const getActionColor = (action) => {
    switch(action?.toLowerCase()) {
      case 'crear':
      case 'insert': return 'bg-green-100 text-green-800'
      case 'editar':
      case 'update': return 'bg-blue-100 text-blue-800'
      case 'eliminar':
      case 'delete': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionIcon = (action) => {
    switch(action?.toLowerCase()) {
      case 'crear':
      case 'insert': return '➕'
      case 'editar':
      case 'update': return '✏️'
      case 'eliminar':
      case 'delete': return '🗑️'
      default: return '📝'
    }
  }

  const filtered = auditLogs.filter(log => {
    const matchSearch = log.usuario_responsable?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       log.tabla_afectada?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       log.id_registro?.toString().includes(searchTerm)
    const matchTable = filterTable === 'all' || log.tabla_afectada === filterTable
    const matchAction = filterAction === 'all' || log.accion?.toLowerCase() === filterAction.toLowerCase()
    return matchSearch && matchTable && matchAction
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">📜 Auditoría - Historial de Cambios</h3>
          <p className="text-sm text-gray-600">Registro completo de modificaciones en el sistema</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-700">{filtered.length} registros</p>
          <p className="text-xs text-gray-500">últimos cambios</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por usuario, tabla o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterTable}
          onChange={(e) => setFilterTable(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">Todas las tablas</option>
          {tables.map((table, idx) => (
            <option key={idx} value={table}>{table}</option>
          ))}
        </select>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">Todas las acciones</option>
          {actions.map((action, idx) => (
            <option key={idx} value={action}>{action}</option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando historial...</div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((log, idx) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Action Icon */}
                  <div className={`px-3 py-2 rounded-lg ${getActionColor(log.accion)}`}>
                    <span className="text-lg">{getActionIcon(log.accion)}</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getActionColor(log.accion)}`}>
                        {log.accion}
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        Tabla: <span className="text-indigo-600 font-mono">{log.tabla_afectada}</span>
                      </span>
                      <span className="text-sm text-gray-600">
                        ID: <span className="font-mono">{log.id_registro}</span>
                      </span>
                    </div>

                    <div className="flex gap-4 text-xs text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        {log.usuario_responsable || 'Sistema'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {log.fecha ? new Date(log.fecha).toLocaleString() : '-'}
                      </div>
                    </div>

                    {log.detalles && (
                      <div className="p-2 bg-gray-50 rounded text-xs text-gray-700">
                        <p className="font-mono line-clamp-2">{log.detalles}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No se encontraron registros de auditoría
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-700 mb-1">Creaciones</p>
          <p className="text-xl font-bold text-green-800">
            {filtered.filter(l => l.accion?.toLowerCase().includes('crear') || l.accion?.toLowerCase().includes('insert')).length}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700 mb-1">Actualizaciones</p>
          <p className="text-xl font-bold text-blue-800">
            {filtered.filter(l => l.accion?.toLowerCase().includes('editar') || l.accion?.toLowerCase().includes('update')).length}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs text-red-700 mb-1">Eliminaciones</p>
          <p className="text-xl font-bold text-red-800">
            {filtered.filter(l => l.accion?.toLowerCase().includes('eliminar') || l.accion?.toLowerCase().includes('delete')).length}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-xs text-purple-700 mb-1">Total</p>
          <p className="text-xl font-bold text-purple-800">{filtered.length}</p>
        </div>
      </div>
    </div>
  )
}
