'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { FiUser, FiPhone, FiArrowRight, FiLoader } from 'react-icons/fi'
import { useClientStore } from '@/store/useClientStore'

export default function ClienteRegistradoPage() {
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setCliente } = useClientStore()

  const buscarCliente = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!telefono || telefono.length !== 10) {
      toast.error('Por favor ingresa un número de teléfono válido (10 dígitos)')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/clientes/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telefono }),
      })

      const data = await response.json()

      if (response.ok) {
        // Asegúrate que 'direccion' venga en el objeto cliente
        const cliente = {
          id: data.cliente.id,
          nombre: data.cliente.nombre,
          telefono: data.cliente.telefono,
          direccion: data.cliente.direccion, // ✅ incluye dirección
        }

        // Guardar en Zustand y localStorage
        setCliente(cliente)
        localStorage.setItem('clienteSession', JSON.stringify(cliente))

        toast.success(`¡Bienvenido de vuelta, ${cliente.nombre}!`)
        router.push('/menu')
      } else {
        toast.error(data.message || 'Cliente no encontrado')
        router.push(`/nuevo-cliente?telefono=${telefono}`)
      }
    } catch (error) {
      toast.error('Error de conexión con el servidor')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-amber-900 flex items-center justify-center p-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-black/70 backdrop-blur-md rounded-xl border border-amber-500/30 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-center">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white flex items-center justify-center gap-2"
            >
              <FiUser className="inline-block" />
              <span>Bienvenido</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-amber-100 mt-2"
            >
              Ingresa tu número para continuar
            </motion.p>
          </div>

          {/* Formulario */}
          <form onSubmit={buscarCliente} className="p-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-400">
                <FiPhone size={20} />
              </div>
              <input
                type="tel"
                placeholder="Número de teléfono (10 dígitos)"
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
                value={telefono}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                  setTelefono(value)
                }}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-bold transition-all ${
                  loading
                    ? 'bg-amber-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black'
                }`}
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <span>Continuar</span>
                    <FiArrowRight />
                  </>
                )}
              </button>
            </motion.div>
          </form>

          {/* Footer */}
          <div className="px-6 pb-6 text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-gray-400 text-sm"
            >
              ¿No tienes cuenta?{' '}
              <a
                href="/nuevo-cliente"
                className="text-amber-400 hover:text-amber-300 underline transition-colors"
              >
                Regístrate aquí
              </a>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
