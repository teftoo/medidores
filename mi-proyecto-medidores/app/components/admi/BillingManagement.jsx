'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Receipt, Download, Plus, Search, Filter, DollarSign, Calendar, User } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { calcularTarifaCompleta } from '@/lib/tariffUtils'
import jsPDF from 'jspdf'

export default function BillingManagement() {
  const [billings, setBillings] = useState([])
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7))
  const [showModal, setShowModal] = useState(false)
  const [selectedBilling, setSelectedBilling] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBillings()
    fetchUsers()
  }, [filterMonth])

  const fetchBillings = async () => {
    try {
      const { data, error } = await supabase
        .from('historial')
        .select('*')
        .ilike('fecha_lectura', `${filterMonth}%`)
        .order('fecha_lectura', { ascending: false })

      if (error) throw error
      setBillings(data || [])
    } catch (err) {
      console.error('Error fetching billings:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data } = await supabase
        .from('usuarios')
        .select('id, nombre, correo, tipo_usuario')
        .eq('rol', 'usuario')
        .order('nombre')
      setUsers(data || [])
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  const generateReceipt = (billing) => {
    const doc = new jsPDF()
    const user = users.find(u => u.id === billing.id_usuario)
    
    if (!user) return

    const tarifa = calcularTarifaCompleta(
      billing.valor_lectura || 0,
      user.tipo_usuario || 'domestico',
      user.descuento || 0
    )

    // Cabecera
    doc.setFillColor(20, 45, 110)
    doc.rect(0, 0, 210, 40, 'F')
    
    doc.setFontSize(24)
    doc.setTextColor(255, 255, 255)
    doc.text('CONSUMO NET', 105, 18, { align: 'center' })
    
    doc.setFontSize(10)
    doc.text('Sistema de Administración de Consumo por Sector', 105, 28, { align: 'center' })

    // Información de cliente
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(11)
    doc.text('DATOS DEL CLIENTE', 20, 55)
    
    doc.setFontSize(10)
    doc.text(`Nombre: ${user.nombre}`, 20, 62)
    doc.text(`Correo: ${user.correo}`, 20, 69)
    doc.text(`ID Usuario: ${user.id}`, 20, 76)

    // Detalle de consumo
    doc.setFontSize(11)
    doc.text('DETALLE DE CONSUMO', 20, 90)

    doc.setFontSize(9)
    doc.text(`Lectura Actual: ${billing.valor_lectura} m³`, 20, 97)
    doc.text(`Tipo Usuario: ${user.tipo_usuario}`, 20, 104)
    doc.text(`Fecha: ${new Date(billing.fecha_lectura).toLocaleDateString()}`, 20, 111)

    // Detalle de cobro
    doc.setFontSize(11)
    doc.text('DETALLE DE COBRO', 20, 125)

    doc.setFontSize(9)
    doc.text(`Subtotal: ${tarifa.subtotal.toFixed(2)} Bs`, 20, 132)
    doc.text(`Cargo Fijo: ${tarifa.cargoFijo.toFixed(2)} Bs`, 20, 139)
    
    if (tarifa.totalConFactorTipo !== tarifa.subtotal) {
      doc.text(`Total con Factor (${user.tipo_usuario}): ${tarifa.totalConFactorTipo.toFixed(2)} Bs`, 20, 146)
      doc.setDrawColor(200, 200, 200)
      doc.line(20, 148, 150, 148)
      doc.text(`TOTAL ANTES DE DESCUENTO: ${tarifa.totalSinDescuento.toFixed(2)} Bs`, 20, 155)
    }

    if (tarifa.descuentoUsuario > 0) {
      doc.setTextColor(0, 128, 0)
      doc.text(`Descuento: -${tarifa.descuentoUsuario.toFixed(2)} Bs`, 20, 162)
      doc.setTextColor(0, 0, 0)
    }

    // Total destacado
    doc.setFontSize(12)
    doc.setFillColor(0, 128, 0)
    doc.rect(20, 170, 130, 15, 'F')
    doc.setTextColor(255, 255, 255)
    doc.text(`TOTAL A PAGAR: ${tarifa.totalFinal.toFixed(2)} Bs`, 85, 180.5, { align: 'center' })

    // Pie
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.text('Gracias por ser cliente de Consumo Net', 105, 270, { align: 'center' })

    doc.save(`Consumo_Net_Factura_${user.id}.pdf`)
  }

  const getUserInfo = (userId) => {
    const user = users.find(u => u.id === userId)
    return user ? `${user.nombre} (${user.tipo_usuario})` : 'Usuario no encontrado'
  }

  const filtered = billings.filter(billing => {
    const userInfo = getUserInfo(billing.id_usuario).toLowerCase()
    return userInfo.includes(searchTerm.toLowerCase())
  })

  const totalAmount = filtered.reduce((sum, billing) => {
    const user = users.find(u => u.id === billing.id_usuario)
    if (!user) return sum
    const tarifa = calcularTarifaCompleta(billing.valor_lectura || 0, user.tipo_usuario || 'domestico', 0)
    return sum + tarifa.totalFinal
  }, 0)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">💳 Gestión de Facturación</h3>
          <p className="text-sm text-gray-600">Historial de recibos y estadísticas de cobro</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 mb-1">Total Facturado</p>
          <p className="text-2xl font-bold text-green-800">{totalAmount.toFixed(2)} Bs</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 mb-1">Registros</p>
          <p className="text-2xl font-bold text-blue-800">{filtered.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-700 mb-1">Promedio</p>
          <p className="text-2xl font-bold text-purple-800">
            {filtered.length > 0 ? (totalAmount / filtered.length).toFixed(2) : 0} Bs
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Billings Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando facturas...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Usuario</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Consumo</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Tipo</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Monto</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Fecha</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((billing) => {
                    const user = users.find(u => u.id === billing.id_usuario)
                    const tarifa = user ? calcularTarifaCompleta(billing.valor_lectura || 0, user.tipo_usuario || 'domestico', 0) : null
                    
                    return (
                      <motion.tr
                        key={billing.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-3 font-medium text-gray-900">{user?.nombre || 'Desconocido'}</td>
                        <td className="px-6 py-3 text-gray-600">{billing.valor_lectura} m³</td>
                        <td className="px-6 py-3">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                            {user?.tipo_usuario}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-bold text-green-600">
                          {tarifa ? `${tarifa.totalFinal.toFixed(2)} Bs` : '-'}
                        </td>
                        <td className="px-6 py-3 text-gray-600 text-xs">
                          {new Date(billing.fecha_lectura).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => generateReceipt(billing)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Descargar PDF"
                          >
                            <Download size={16} />
                          </motion.button>
                        </td>
                      </motion.tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No se encontraron facturas para este período
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
