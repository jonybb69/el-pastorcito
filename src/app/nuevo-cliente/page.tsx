'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { usePedidoStore } from '@/store/usePedidoStore'
import { useClientStore } from '@/store/useClientStore'
import type { Cliente } from '@/store/usePedidoStore'

import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiPhone, FiMapPin, FiArrowRight, FiLoader, FiCheck, FiX } from 'react-icons/fi'

export default function NuevoClientePage() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: ''
  })
  const [sugerencias, setSugerencias] = useState<Cliente[]>([])
  const [cargando, setCargando] = useState(false)
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)

  const nombreRef = useRef<HTMLInputElement>(null)
  const telefonoRef = useRef<HTMLInputElement>(null)
  const direccionRef = useRef<HTMLTextAreaElement>(null)

  const router = useRouter()
  const setCliente = usePedidoStore((state) => state.setCliente)
  const setMetodoPago = usePedidoStore((state) => state.setMetodoPago)
  const setClientStore = useClientStore((state) => state.setCliente)
  // Buscar clientes existentes
  useEffect(() => {
    const buscarClientes = async () => {
      if (formData.telefono.length >= 4) {
        try {
          const res = await fetch(`/api/clientes?telefono=${formData.telefono}`)
          const { clientes } = await res.json()
          setSugerencias(clientes || [])
          setMostrarSugerencias(!!clientes?.length)
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
  }, [formData.telefono])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleKeyDown = (e: React.KeyboardEvent, nextField?: 'telefono' | 'direccion' | 'submit') => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (nextField === 'telefono') telefonoRef.current?.focus()
      if (nextField === 'direccion') direccionRef.current?.focus()
      if (nextField === 'submit') manejarRegistro(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const seleccionarCliente = (cliente: Cliente) => {
    setFormData({
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      direccion: cliente.direccion
    })
    
    const clienteData = { ...cliente, id: cliente.id }
    setCliente(clienteData)
    setMetodoPago('')
    setMostrarSugerencias(false)
    
    toast.success('Cliente encontrado, redirigiendo...', {
      icon: <FiCheck className="text-green-400" />,
      position: 'top-center'
    })
    
    setTimeout(() => router.push('/menu'), 800)
  }

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nombre || !formData.telefono || !formData.direccion) {
      toast.warning('Todos los campos son obligatorios', {
        icon: <FiX className="text-yellow-400" />,
        position: 'top-center'
      })
      return
    }

    setCargando(true)

    try {
      const respuesta = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!respuesta.ok) throw new Error('No se pudo registrar el cliente')

      const cliente = await respuesta.json()
      const clienteData = { ...cliente, id: cliente.id }
      
      setCliente(clienteData)
      setClientStore(clienteData)
      setMetodoPago('')
      
      toast.success('¡Cliente registrado con éxito!', {
        icon: <FiCheck className="text-green-400" />,
        position: 'top-center'
      })

      setTimeout(() => router.push('/menu'), 800)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al registrar el cliente', {
        icon: <FiX className="text-red-400" />,
        position: 'top-center'
      })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-amber-900 flex items-center justify-center p-4">
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
                  ref={nombreRef}
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyDown(e, 'telefono')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Ej: Juan Pérez"
                  autoComplete="name"
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
                  ref={telefonoRef}
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyDown(e, 'direccion')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Ej: 5512345678"
                  pattern="[0-9]{10}"
                  title="Ingresa un número de 10 dígitos"
                  autoComplete="tel"
                />
              </div>

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
                  ref={direccionRef}
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyDown(e, 'submit')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400 min-h-[100px]"
                  placeholder="Ej: Calle Principal #123, Colonia Centro"
                  autoComplete="street-address"
                />
              </div>
            </motion.div>

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