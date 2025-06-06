'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClientStore } from '@/store/useClientStore'
import { toast } from 'sonner'
import { FiSave, FiArrowLeft, FiUser, FiPhone, FiMapPin } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function UserClientesPage() {
  const router = useRouter()
  const { cliente, setCliente } = useClientStore()
  const [form, setForm] = useState({ nombre: '', telefono: '', direccion: '' })
  const [loading, setLoading] = useState(false)
  const [isDirty] = useState(false)

  useEffect(() => {
    if (!cliente?.id) {
      toast.warning('Redirigiendo... Completa tus datos primero')
      router.push('/menu')
    } else {
      setForm({
        nombre: cliente.nombre || '',
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || '',
      })
    }
  }, [cliente, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación básica
    if (!form.nombre.trim() || !form.telefono.trim() || !form.direccion.trim()) {
      toast.error('Todos los campos son obligatorios')
      return
    }

    setLoading(true)
    try {
      if (!cliente?.id) {
        throw new Error('ID de cliente no disponible')
      }

      const res = await fetch(`/api/clientes/`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json' 
          },
        body: JSON.stringify({
          id: cliente.id,
          ...form
        }),
      })

     // Mejor manejo de errores del servidor
      if (!res.ok) {
        let errorMessage = `Error ${res.status}: ${res.statusText}`

        try {
        const errorData = await res.json() 
        errorMessage = errorData.message || errorMessage
         } catch  {
          console.log('No se pudo parsear el error como JSON')
        }
        
        throw new Error(errorMessage)
      }
      const updated = await res.json()
      setCliente(updated)
      
      toast.success('Perfil actualizado correctamente!' )
      setTimeout(() => router.push('/menu'), 1500)
       } catch (error) {
      console.error('Error en handleSubmit:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Error al actualizar perfil. Intente nuevamente.'
      )
      
      // Redirigir a login si el error es de autenticación
      if (error instanceof Error && error.message.includes('401')) {
        router.push('/clientes/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  return (
    <div className="min-h-screen rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-900 p-4 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full shadow-2xl rounded-2xl p-8 bg-white/40 backdrop-blur-sm relative overflow-hidden border border-white/20"
      >
        {/* Efectos de fondo */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-600 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-600 rounded-full opacity-30 animate-pulse"></div>
        
        <motion.form
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl font-bold text-violet-900 mb-2">Editar Perfil</h2>
            <p className="text-rose-700 font-medium">Actualiza tu información personal</p>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <label className="font-medium text-amber-600 mb-2 flex items-center">
              <FiUser className="mr-2 text-indigo-700" /> Nombre
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full p-3 text-gray-800 font-semibold rounded-lg border-2 border-teal-700/50 focus:border-indigo-800 focus:ring-2 focus:ring-teal-700/30 transition duration-200 bg-white/80"
              placeholder="Tu nombre completo"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <label className="font-medium text-amber-600 mb-2 flex items-center">
              <FiPhone className="mr-2 text-indigo-700" /> Teléfono
            </label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full p-3 text-gray-800 font-semibold rounded-lg border-2 border-teal-700/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-700/30 transition duration-200 bg-white/80"
              placeholder="Número de contacto"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <label className="font-medium text-amber-600 mb-2 flex items-center">
              <FiMapPin className="mr-2 text-indigo-700" /> Dirección
            </label>
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              className="w-full p-3 text-gray-800 font-semibold rounded-lg border-2 border-teal-700/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-700/30 transition duration-200 bg-white/80"
              placeholder="Tu dirección completa"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-between gap-4">
            <button
              type="button"
              onClick={() => router.push('/menu')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-sky-700 hover:from-cyan-800 hover:to-green-700 text-white rounded-lg shadow-lg hover:shadow-black/30 transition duration-200 flex-1 justify-center"
            >
              <FiArrowLeft /> Volver
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-3 text-white rounded-lg shadow-lg hover:shadow-black/30 transition duration-200 flex-1 justify-center ${
                loading 
                  ? 'bg-indigo-900 cursor-not-allowed opacity-90' 
                  : 'bg-gradient-to-r from-indigo-700 to-violet-600 hover:from-indigo-600 hover:to-violet-800'
              }`}
            >
              {loading ? (
                <>
                
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                
                  <FiSave /> {isDirty ? 'Guardar Cambios' : 'Continuar'}
                  
                </>
              )}
            </button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  )
}