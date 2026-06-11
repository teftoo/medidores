'use client'

import { motion } from "framer-motion"
import { Droplets, Sun, Flame, Users, FileSpreadsheet, Settings, CheckCircle, AlertCircle, MapPin } from "lucide-react"

export default function TechDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">

      {/* BARRA SUPERIOR */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto mb-10 flex items-center justify-between"
      >
        <h1 className="text-4xl font-extrabold text-gray-800">
          Digitalización de Servicios Básicos - Técnico
        </h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition-all">
            Perfil
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-xl shadow hover:bg-red-700 transition-all">
            Cerrar Sesión
          </button>
        </div>
      </motion.div>

      {/* GRID DE OPCIONES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {/* VALIDAR LECTURAS */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-blue-200 hover:shadow-xl cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="text-blue-500" size={32} />
            <h2 className="text-xl font-bold text-gray-800">Validar Lecturas</h2>
          </div>
          <p className="text-gray-600 mt-2">
            Revisa y confirma las lecturas enviadas por los usuarios.
          </p>

          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="mt-4 w-full h-2 rounded-full bg-blue-200"
          >
            <div className="h-2 bg-blue-500 w-1/3 rounded-full"></div>
          </motion.div>
        </motion.div>

        {/* USUARIOS */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-purple-200 hover:shadow-xl cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Users className="text-purple-500" size={32} />
            <h2 className="text-xl font-bold text-gray-800">Usuarios</h2>
          </div>
          <p className="text-gray-600 mt-2">
            Consulta información de usuarios, medidores y roles.
          </p>
        </motion.div>

        {/* REPORTES */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="text-green-500" size={32} />
            <h2 className="text-xl font-bold text-gray-800">Reportes</h2>
          </div>
          <p className="text-gray-600 mt-2">
            Genera reportes de lecturas, incidencias y consumos.
          </p>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mt-4 w-12 h-12 bg-green-300 rounded-full mx-auto shadow-inner"
          ></motion.div>
        </motion.div>

        {/* INCIDENCIAS */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-red-200 hover:shadow-xl cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-500" size={32} />
            <h2 className="text-xl font-bold text-gray-800">Incidencias</h2>
          </div>
          <p className="text-gray-600 mt-2">
            Visualiza y gestiona problemas reportados por usuarios o medidores.
          </p>

          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mt-4 w-12 h-12 bg-red-400 rounded-full mx-auto"
          ></motion.div>
        </motion.div>

        {/* RUTAS */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-yellow-200 hover:shadow-xl cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <MapPin className="text-yellow-500" size={32} />
            <h2 className="text-xl font-bold text-gray-800">Rutas</h2>
          </div>
          <p className="text-gray-600 mt-2">
            Visualiza las rutas de verificación de medidores asignadas.
          </p>

          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-4 w-full h-2 rounded-full bg-yellow-200"
          >
            <div className="h-2 bg-yellow-500 w-1/3 rounded-full"></div>
          </motion.div>
        </motion.div>

        {/* CONFIGURACIONES */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-300 hover:shadow-xl cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Settings className="text-gray-600" size={32} />
            <h2 className="text-xl font-bold text-gray-800">Configuraciones</h2>
          </div>
          <p className="text-gray-600 mt-2">
            Ajustes específicos para técnicos dentro del sistema.
          </p>
        </motion.div>

      </div>
    </div>
  )
}
