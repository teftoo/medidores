'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, TrendingDown, Clock, Zap, AlertCircle, Check } from 'lucide-react'

export default function AlertsPanel({ alerts = [] }) {
  const defaultAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Consumo inusualmente alto',
      description: 'Usuario #45 registró consumo 3x superior a su promedio',
      severity: 'high',
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    {
      id: 2,
      type: 'error',
      title: 'Lectura menor a la anterior',
      description: 'Medidor #1203 registra valor menor. Posible error o manipulación',
      severity: 'critical',
      icon: TrendingDown,
      color: 'text-red-600'
    },
    {
      id: 3,
      type: 'info',
      title: 'Falta de lectura del mes',
      description: '12 usuarios sin lectura registrada en los últimos 10 días',
      severity: 'medium',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Medidor inactivo',
      description: '5 medidores detectados sin lecturas hace +60 días',
      severity: 'medium',
      icon: Zap,
      color: 'text-yellow-600'
    }
  ]

  const severityColors = {
    critical: 'bg-red-50 border-red-200 hover:bg-red-100',
    high: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    medium: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    low: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
  }

  const severityBadge = {
    critical: 'bg-red-200 text-red-800',
    high: 'bg-orange-200 text-orange-800',
    medium: 'bg-yellow-200 text-yellow-800',
    low: 'bg-blue-200 text-blue-800'
  }

  const itemsToShow = alerts.length > 0 ? alerts : defaultAlerts

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">🚨 Alertas y Anomalías</h3>
        <span className="text-sm font-semibold px-3 py-1 bg-red-100 text-red-700 rounded-full">
          {itemsToShow.length} activas
        </span>
      </div>

      <div className="space-y-3">
        {itemsToShow.map((alert, idx) => {
          const Icon = alert.icon || AlertCircle
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-lg border-l-4 transition-all cursor-pointer ${severityColors[alert.severity]} ${
                alert.severity === 'critical' ? 'border-l-red-500' :
                alert.severity === 'high' ? 'border-l-orange-500' :
                alert.severity === 'medium' ? 'border-l-yellow-500' :
                'border-l-blue-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${alert.color} bg-white`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-800">{alert.title}</h4>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${severityBadge[alert.severity]}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{alert.description}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <Check size={16} />
                </motion.button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {itemsToShow.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="mx-auto mb-2 text-green-500" size={32} />
          <p className="font-medium">Todo está en orden</p>
        </div>
      )}
    </div>
  )
}
