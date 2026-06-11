'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Save, Edit, RotateCcw, Zap, DollarSign, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function TariffConfiguration() {
  const [tariffConfig, setTariffConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editData, setEditData] = useState({
    cargo_fijo: 10,
    bloque_1_max: 10,
    bloque_1_tarifa: 1.50,
    bloque_2_max: 20,
    bloque_2_tarifa: 2.00,
    bloque_3_max: 30,
    bloque_3_tarifa: 3.00,
    bloque_4_tarifa: 5.00,
    factor_social: 0.80,
    factor_comercial: 1.15,
    factor_industrial: 1.30,
    factor_domestico: 1.00
  })

  const defaultConfig = {
    cargo_fijo: 10,
    bloque_1_max: 10,
    bloque_1_tarifa: 1.50,
    bloque_2_max: 20,
    bloque_2_tarifa: 2.00,
    bloque_3_max: 30,
    bloque_3_tarifa: 3.00,
    bloque_4_tarifa: 5.00,
    factor_social: 0.80,
    factor_comercial: 1.15,
    factor_industrial: 1.30,
    factor_domestico: 1.00
  }

  useEffect(() => {
    fetchTariffConfig()
  }, [])

  const fetchTariffConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracion_tarifaria')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      
      if (data) {
        setTariffConfig(data)
        setEditData(data)
      } else {
        setTariffConfig(defaultConfig)
        setEditData(defaultConfig)
      }
    } catch (err) {
      console.error('Error fetching tariff config:', err)
      setTariffConfig(defaultConfig)
      setEditData(defaultConfig)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (tariffConfig?.id) {
        // Update existing
        const { error } = await supabase
          .from('configuracion_tarifaria')
          .update(editData)
          .eq('id', tariffConfig.id)
        if (error) throw error
      } else {
        // Insert new
        const { error } = await supabase
          .from('configuracion_tarifaria')
          .insert([editData])
        if (error) throw error
      }

      setTariffConfig(editData)
      setIsEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Error saving tariff config:', err)
      alert('Error al guardar la configuración')
    }
  }

  const handleReset = () => {
    setEditData(defaultConfig)
  }

  const handleCancel = () => {
    setEditData(tariffConfig || defaultConfig)
    setIsEditing(false)
  }

  if (loading) return <div className="text-center py-8 text-gray-500">Cargando configuración...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">⚙️ Configuración de Tarifas</h3>
          <p className="text-sm text-gray-600">Administra bloques tarifarios, cargo fijo y factores</p>
        </div>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-shadow"
          >
            <Edit size={18} /> Editar Configuración
          </motion.button>
        )}
      </div>

      {/* Save Message */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-100 border border-green-300 rounded-lg text-green-800 font-medium"
          >
            ✓ Configuración guardada exitosamente
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cargo Fijo Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-200 rounded-lg">
            <DollarSign className="text-indigo-700" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Cargo Fijo Mensual</h4>
            <p className="text-sm text-gray-600">Tarifa base aplicada a todos los usuarios</p>
          </div>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.01"
              value={editData.cargo_fijo}
              onChange={(e) => setEditData({ ...editData, cargo_fijo: parseFloat(e.target.value) })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <span className="font-bold text-gray-700">Bs</span>
          </div>
        ) : (
          <p className="text-3xl font-bold text-indigo-700">{editData.cargo_fijo.toFixed(2)} Bs</p>
        )}
      </div>

      {/* Bloques Tarifarios */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="text-green-700" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Bloques Tarifarios Progresivos</h4>
            <p className="text-sm text-gray-600">Tarifas por tramo de consumo en m³</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bloque 1 */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-semibold text-gray-800 mb-3">📊 Bloque 1 (0-10 m³)</h5>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Máximo m³</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editData.bloque_1_max}
                    onChange={(e) => setEditData({ ...editData, bloque_1_max: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                ) : (
                  <span className="text-lg font-bold text-gray-800">{editData.bloque_1_max} m³</span>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Tarifa por m³</label>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editData.bloque_1_tarifa}
                      onChange={(e) => setEditData({ ...editData, bloque_1_tarifa: parseFloat(e.target.value) })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-lg font-bold text-green-600">{editData.bloque_1_tarifa.toFixed(2)}</span>
                  )}
                  <span className="text-gray-600">Bs/m³</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque 2 */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-semibold text-gray-800 mb-3">📊 Bloque 2 (11-20 m³)</h5>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Máximo m³</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editData.bloque_2_max}
                    onChange={(e) => setEditData({ ...editData, bloque_2_max: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                ) : (
                  <span className="text-lg font-bold text-gray-800">{editData.bloque_2_max} m³</span>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Tarifa por m³</label>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editData.bloque_2_tarifa}
                      onChange={(e) => setEditData({ ...editData, bloque_2_tarifa: parseFloat(e.target.value) })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-lg font-bold text-orange-600">{editData.bloque_2_tarifa.toFixed(2)}</span>
                  )}
                  <span className="text-gray-600">Bs/m³</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque 3 */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-semibold text-gray-800 mb-3">📊 Bloque 3 (21-30 m³)</h5>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Máximo m³</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editData.bloque_3_max}
                    onChange={(e) => setEditData({ ...editData, bloque_3_max: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                ) : (
                  <span className="text-lg font-bold text-gray-800">{editData.bloque_3_max} m³</span>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Tarifa por m³</label>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editData.bloque_3_tarifa}
                      onChange={(e) => setEditData({ ...editData, bloque_3_tarifa: parseFloat(e.target.value) })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-lg font-bold text-red-600">{editData.bloque_3_tarifa.toFixed(2)}</span>
                  )}
                  <span className="text-gray-600">Bs/m³</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque 4 */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-semibold text-gray-800 mb-3">📊 Bloque 4 (Mayor a 30 m³)</h5>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Tarifa por m³</label>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editData.bloque_4_tarifa}
                      onChange={(e) => setEditData({ ...editData, bloque_4_tarifa: parseFloat(e.target.value) })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-lg font-bold text-purple-600">{editData.bloque_4_tarifa.toFixed(2)}</span>
                  )}
                  <span className="text-gray-600">Bs/m³</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Factores por Tipo Usuario */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Zap className="text-purple-700" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Factores por Tipo de Usuario</h4>
            <p className="text-sm text-gray-600">Multiplicadores aplicados al subtotal según categoría</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Social', key: 'factor_social', color: 'text-green-600' },
            { label: 'Comercial', key: 'factor_comercial', color: 'text-blue-600' },
            { label: 'Industrial', key: 'factor_industrial', color: 'text-red-600' },
            { label: 'Doméstico', key: 'factor_domestico', color: 'text-yellow-600' }
          ].map(factor => (
            <div key={factor.key} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
              <span className="font-semibold text-gray-800">{factor.label}</span>
              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  value={editData[factor.key]}
                  onChange={(e) => setEditData({ ...editData, [factor.key]: parseFloat(e.target.value) })}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              ) : (
                <span className={`text-lg font-bold ${factor.color}`}>{editData[factor.key].toFixed(2)}x</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
          >
            <Save size={18} /> Guardar Cambios
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="px-4 py-3 bg-yellow-500 text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-shadow"
          >
            <RotateCcw size={18} /> Restaurar Defaults
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCancel}
            className="px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </motion.button>
        </div>
      )}
    </div>
  )
}
