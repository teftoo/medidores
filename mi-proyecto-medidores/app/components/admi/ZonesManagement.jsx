'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Edit, Trash2, Plus, Search, Building2, Users, Gauge } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function ZonesManagement() {
  const [zones, setZones] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedZone, setSelectedZone] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    codigo_zona: '',
    sector: ''
  })

  useEffect(() => {
    fetchZones()
  }, [])

  const fetchZones = async () => {
    try {
      const { data, error } = await supabase
        .from('zonas')
        .select('*')
        .order('nombre')

      if (error) throw error
      setZones(data || [])
      
      // Fetch statistics for each zone
      for (const zone of data || []) {
        await fetchZoneStats(zone.nombre)
      }
    } catch (err) {
      console.error('Error fetching zones:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchZoneStats = async (zoneName) => {
    try {
      const { data, error } = await supabase
        .from('medidores')
        .select('id')
        .eq('zona', zoneName)

      if (!error && data) {
        setStats(prev => ({
          ...prev,
          [zoneName]: data.length
        }))
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const handleCreateEdit = async () => {
    if (!formData.nombre || !formData.codigo_zona) {
      alert('Completa los campos requeridos')
      return
    }

    try {
      if (selectedZone) {
        const { error } = await supabase
          .from('zonas')
          .update(formData)
          .eq('id', selectedZone.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('zonas')
          .insert([formData])
        if (error) throw error
      }
      fetchZones()
      setShowModal(false)
      resetForm()
      setSelectedZone(null)
    } catch (err) {
      console.error('Error:', err)
      alert('Error al guardar la zona')
    }
  }

  const handleDelete = async (id, zoneName) => {
    if (!confirm('¿Eliminar esta zona? Se perderán todas las asociaciones.')) return
    try {
      const { error } = await supabase
        .from('zonas')
        .delete()
        .eq('id', id)
      if (error) throw error
      fetchZones()
    } catch (err) {
      console.error('Error deleting:', err)
    }
  }

  const handleEdit = (zone) => {
    setSelectedZone(zone)
    setFormData({
      nombre: zone.nombre,
      descripcion: zone.descripcion || '',
      codigo_zona: zone.codigo_zona || '',
      sector: zone.sector || ''
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      codigo_zona: '',
      sector: ''
    })
  }

  const openNewModal = () => {
    setSelectedZone(null)
    resetForm()
    setShowModal(true)
  }

  const filtered = zones.filter(zone => {
    return zone.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           zone.codigo_zona?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           zone.sector?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">🗺️ Gestión de Zonas/Sectores</h3>
          <p className="text-sm text-gray-600">Administra sectores, bloques, comunidades y condominio</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openNewModal}
          className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-shadow"
        >
          <Plus size={18} /> Nueva Zona
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Buscar por nombre, código o sector..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-500">Cargando zonas...</div>
        ) : filtered.length > 0 ? (
          filtered.map((zone) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <MapPin className="text-indigo-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{zone.nombre}</h4>
                    <p className="text-xs text-gray-600">{zone.codigo_zona}</p>
                  </div>
                </div>
              </div>

              {zone.descripcion && (
                <p className="text-sm text-gray-600 mb-2">{zone.descripcion}</p>
              )}

              {zone.sector && (
                <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                  <Building2 size={12} /> {zone.sector}
                </div>
              )}

              {/* Stats */}
              <div className="mb-3 p-2 bg-gray-50 rounded flex items-center gap-2">
                <Gauge size={14} className="text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">
                  {stats[zone.nombre] || 0} medidores
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(zone)}
                  className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors font-medium text-sm"
                >
                  <Edit size={14} className="inline mr-1" /> Editar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(zone.id, zone.nombre)}
                  className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors font-medium text-sm"
                >
                  <Trash2 size={14} className="inline mr-1" /> Eliminar
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No se encontraron zonas
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {selectedZone ? 'Editar Zona' : 'Nueva Zona'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="ej: Zona Norte"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                  <input
                    type="text"
                    value={formData.codigo_zona}
                    onChange={(e) => setFormData({ ...formData, codigo_zona: e.target.value })}
                    placeholder="ej: ZN-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sector/Bloque/Condominio</label>
                  <input
                    type="text"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    placeholder="ej: Bloque A, Comunidad Principal"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows="3"
                    placeholder="Descripción de la zona..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateEdit}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                  >
                    {selectedZone ? 'Actualizar' : 'Crear'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
