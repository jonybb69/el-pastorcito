'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePedidoStore } from '@/store/usePedidoStore'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiPhone, FiMapPin, FiArrowRight, FiLoader, FiCheck, FiX } from 'react-icons/fi'

interface Cliente {
  id: string
  nombre: string
  telefono: string
  direccion: string
}

export default function NuevoClientePage() {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [sugerencias, setSugerencias] = useState<Cliente[]>([])
  const [cargando, setCargando] = useState(false)
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)

  const router = useRouter()
  const setCliente = usePedidoStore(state => state.setCliente)
  const setMetodoPago = usePedidoStore(state => state.setMetodoPago)

  useEffect(() => {
    const buscarClientes = async () => {
      if (telefono.length >= 4) {
        try {
          const res = await fetch(`/api/clientes?telefono=${telefono}`)
          const { clientes } = await res.json()
          if (clientes && clientes.length > 0) {
            setSugerencias(clientes)
            setMostrarSugerencias(true)
          } else {
            setSugerencias([])
            setMostrarSugerencias(false)
          }
        } catch (error) {
          console.error('Error buscando clientes:', error)
          setSugerencias([])
          setMostrarSugerencias(false)
        }
      } else {
        setSugerencias([])
        setMostrarSugerencias(false)
      }
    }

    const delayDebounce = setTimeout(buscarClientes, 400)
    return () => clearTimeout(delayDebounce)
  }, [telefono])

  const seleccionarCliente = (cliente: Cliente) => {
    setNombre(cliente.nombre)
    setTelefono(cliente.telefono)
    setDireccion(cliente.direccion)
    setCliente({ ...cliente, id: Number(cliente.id) })
    setMetodoPago('')
    setMostrarSugerencias(false)
    
    toast.success(
      <div className="flex items-center gap-2">
        <FiCheck className="text-green-400" />
        <span>Cliente encontrado, redirigiendo...</span>
      </div>
    )
    
    setTimeout(() => router.push('/menu'), 1000)
  }

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nombre || !telefono || !direccion) {
      toast.warning(
        <div className="flex items-center gap-2">
          <FiX className="text-yellow-400" />
          <span>Todos los campos son obligatorios</span>
        </div>
      )
      return
    }

    setCargando(true)

    try {
      const respuesta = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, direccion }),
      })

      if (!respuesta.ok) {
        const errorData = await respuesta.json()
        throw new Error(errorData.message || 'No se pudo registrar el cliente')
      }

      const cliente = await respuesta.json()
      setCliente(cliente)
      setMetodoPago('')
      
      toast.success(
        <div className="flex items-center gap-2">
          <FiCheck className="text-green-400" />
          <span>¡Cliente registrado con éxito!</span>
        </div>
      )

      setTimeout(() => router.push('/menu'), 1000)
    } catch (error: unknown) {
      let errorMessage = 'Error al registrar el cliente'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      toast.error(
        <div className="flex items-center gap-2">
          <FiX className="text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-amber-900 flex items-center justify-center p-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
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
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white flex items-center justify-center gap-2"
            >
              <FiUser className="inline-block" />
              <span>Registro de Cliente</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-amber-100 mt-2"
            >
              Completa tus datos para continuar
            </motion.p>
          </div>

          {/* Formulario */}
          <form onSubmit={manejarRegistro} className="p-6 space-y-6">
            {/* Campo Nombre */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <label className="block text-sm font-medium text-gray-300 mb-1">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-400">
                  <FiUser size={18} />
                </div>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
            </motion.div>

            {/* Campo Teléfono */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="relative"
            >
              <label className="block text-sm font-medium text-gray-300 mb-1">Teléfono</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-400">
                  <FiPhone size={18} />
                </div>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => {
                    setTelefono(e.target.value)
                    if (e.target.value.length >= 4) {
                      setMostrarSugerencias(true)
                    } else {
                      setMostrarSugerencias(false)
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Ej: 5512345678"
                  pattern="[0-9]{10}"
                  title="Ingresa un número de 10 dígitos"
                />
              </div>

              {/* Sugerencias de clientes existentes */}
              <AnimatePresence>
                {mostrarSugerencias && sugerencias.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
                  >
                    {sugerencias.map((cli) => (
                      <motion.li
                        key={cli.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        onClick={() => seleccionarCliente(cli)}
                        className="p-3 hover:bg-gray-700/50 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0"
                      >
                        <div className="font-medium text-white">{cli.nombre}</div>
                        <div className="text-sm text-gray-400">{cli.telefono}</div>
                        <div className="text-xs text-gray-500 truncate">{cli.direccion}</div>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Campo Dirección */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="relative"
            >
              <label className="block text-sm font-medium text-gray-300 mb-1">Dirección</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none text-amber-400">
                  <FiMapPin size={18} />
                </div>
                <textarea
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400 min-h-[100px]"
                  placeholder="Ej: Calle Principal #123, Colonia Centro"
                />
              </div>
            </motion.div>

            {/* Botón de Registro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <button
                type="submit"
                disabled={cargando}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-bold transition-all ${
                  cargando
                    ? 'bg-amber-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black'
                }`}
              >
                {cargando ? (
                  <>
                    <FiLoader className="animate-spin" />
                    <span>Registrando...</span>
                  </>
                ) : (
                  <>
                    <span>Registrarse y Ver Menú</span>
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
              ¿Ya tienes cuenta?{' '}
              <a
                href="/clientes/login"
                className="text-amber-400 hover:text-amber-300 underline transition-colors"
              >
                Inicia sesión aquí
              </a>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}