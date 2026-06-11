'use client'

import { motion } from 'framer-motion'

export default function StatsCard({ title, value, icon: Icon, color, trend, description }) {
  const colors = {
    indigo: 'from-indigo-500 to-indigo-700',
    blue: 'from-blue-500 to-cyan-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-pink-600',
    orange: 'from-orange-500 to-red-600',
    teal: 'from-teal-500 to-cyan-600',
  }

  const bgColor = colors[color] || colors.indigo

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-br ${bgColor} rounded-2xl p-6 text-white shadow-lg border border-white/10 overflow-hidden relative`}
    >
      {/* Background Decorative Circle */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>

      <div className="relative z-10">
        {/* Icon */}
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
          <Icon size={24} className="text-white" />
        </div>

        {/* Value and Title */}
        <p className="text-3xl font-bold mb-1">{value}</p>
        <p className="text-sm text-white/80 font-medium mb-3">{title}</p>

        {/* Description and Trend */}
        <div className="flex items-center justify-between">
          {description && (
            <p className="text-xs text-white/70">{description}</p>
          )}
          {trend && (
            <div className={`text-sm font-semibold ${trend.isPositive ? 'text-green-200' : 'text-red-200'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
