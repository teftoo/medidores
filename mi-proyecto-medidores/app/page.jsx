'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Droplets, Zap, Flame, Gauge, MapPin, Shield, CreditCard, Brain, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(null);

  const userTypes = [
    {
      id: 'usuario',
      title: 'Soy Usuario',
      subtitle: 'Gestiona tus consumos',
      icon: Gauge,
      gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
      description: 'Fotografía tu medidor, consulta historial y realiza pagos',
      features: ['Lectura con IA', 'Geolocalización', 'Reportes inteligentes']
    },
    {
      id: 'tecnico',
      title: 'Soy Técnico',
      subtitle: 'Inspección en campo',
      icon: MapPin,
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      description: 'Validación de lecturas, geolocalización y detección de anomalías',
      features: ['Geolocalización', 'IA & ML', 'Reportes técnicos']
    },
    {
      id: 'admin',
      title: 'Soy Administrador',
      subtitle: 'Control total',
      icon: Shield,
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      description: 'Dashboard completo, gestión de usuarios y análisis de datos',
      features: ['Machine Learning', 'Reportes IA', 'Anti-fraude']
    }
  ];

  const features = [
    { icon: Brain, title: 'IA Avanzada', desc: 'Lectura automática con visión artificial' },
    { icon: MapPin, title: 'Geolocalización', desc: 'Ubicación precisa para todos los usuarios' },
    { icon: Shield, title: 'Anti-fraude', desc: 'Detección de anomalías con Machine Learning' },
    { icon: CreditCard, title: 'Reportes IA', desc: 'Análisis predictivo y reportes inteligentes' },
  ];

  const services = [
    { icon: Droplets, name: 'Agua', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { icon: Zap, name: 'Luz', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { icon: Flame, name: 'Gas', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Gauge className="w-10 h-10 text-cyan-400" />
                <Sparkles className="w-5 h-5 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Digitalización de Servicios Básicos
                </h1>
                <p className="text-xs text-slate-400">Tecnología Inteligente</p>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16 text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full border border-cyan-500/20">
            <span className="text-sm text-cyan-300">🚀 Sistema de Nueva Generación</span>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Digitaliza tus
            </span>
            <br />
            <span className="text-white">Medidores</span>
          </h2>
          
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Sistema inteligente de lectura automática para agua, luz y gas. 
            Tecnología IA, geolocalización y seguridad avanzada.
          </p>

          {/* Services Badges */}
          <div className="flex justify-center gap-4 mb-16">
            {services.map((service) => (
              <div key={service.name} className={`flex items-center gap-2 px-6 py-3 ${service.bg} rounded-full border border-white/10`}>
                <service.icon className={`w-5 h-5 ${service.color}`} />
                <span className="font-medium">{service.name}</span>
              </div>
            ))}
          </div>

          {/* User Type Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {userTypes.map((type) => (
              <div
                key={type.id}
                onMouseEnter={() => setHoveredCard(type.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 rounded-3xl`}></div>
                
                <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-slate-600 transition-all duration-500 hover:transform hover:scale-105 cursor-pointer">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${type.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <type.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{type.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{type.subtitle}</p>
                  <p className="text-slate-300 mb-6">{type.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${type.gradient}`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => router.push('/login')}
                    className={`w-full py-3 rounded-xl bg-gradient-to-r ${type.gradient} font-semibold flex items-center justify-center gap-2 group-hover:shadow-2xl transition-all duration-300`}
                  >
                    Ingresar
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4">Tecnología de Vanguardia</h3>
            <p className="text-slate-400">Funcionalidades que transforman la gestión de servicios</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-cyan-400" />
                </div>
                <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-slate-800">
          <div className="text-center text-slate-400 text-sm">
            <p>© 2024 Digitalización de Servicios Básicos. Sistema inteligente de medidores.</p>
            <p className="mt-2">Agua • Luz • Gas</p>
            <p className="mt-4 text-slate-500">Desarrollado por Estefani Torrico</p>
          </div>
        </footer>
      </div>
    </div>
  );
}