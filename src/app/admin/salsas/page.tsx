'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

type Salsa = {
  id: string
  nombre: string
  nivelPicor: string
  imagen: string
}

export default function AdminSalsasPage() {
  const router = useRouter()
  const [salsas, setSalsas] = useState<Salsa[]>([])
  const [nombre, setNombre] = useState('')
  const [imagen, setImagen] = useState('')
  const [cargando, setCargando] = useState(false)

  const [editando, setEditando] = useState<Salsa | null>(null)
  const [mostrarEliminar, setMostrarEliminar] = useState<Salsa | null>(null)

  const obtenerSalsas = async () => {
    try {
      const res = await fetch('/api/salsas')
      const data = await res.json()
      setSalsas(data)
    } catch (error) {
      toast.error('Error al obtener salsas')
    }
  }

  useEffect(() => {
    obtenerSalsas()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    try {
      const method = editando ? 'PUT' : 'POST'
      const body = {
        id: editando?.id,
        nombre,
      }

      const res = await fetch('/api/salsas', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(editando ? 'Salsa actualizada' : 'Salsa creada')
        resetForm()
        obtenerSalsas()
      } else {
        toast.error(data.message || 'Error al guardar salsa')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error de conexión')
    } finally {
      setCargando(false)
    }
  }

  const handleDelete = async () => {
    if (!mostrarEliminar) return
    try {
      const res = await fetch('/api/salsas', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: mostrarEliminar.id }),
      })

      if (res.ok) {
        toast.success('Salsa eliminada')
        obtenerSalsas()
      } else {
        toast.error('Error al eliminar salsa')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    } finally {
      setMostrarEliminar(null)
    }
  }

  const resetForm = () => {
    setNombre('')
   
    setImagen('')
    setEditando(null)
  }

  const cargarSalsaEnFormulario = (salsa: Salsa) => {
    setEditando(salsa)
    setNombre(salsa.nombre)
    
    setImagen(salsa.imagen)
  }

  return (
    <section className="max-w-4xl mx-auto mt-10 p-6 bg-red-950/80 rounded-2xl shadow-2xl text-white backdrop-blur-md border border-yellow-500">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-yellow-400 text-center mb-8"
      >
        {editando ? 'Editar Salsa 🌶️' : 'Crear Nueva Salsa 🫕'}
      </motion.h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mb-10">
        <input
          type="text"
          placeholder="Nombre de la salsa"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="p-3 rounded-md bg-black/40 border border-yellow-500 placeholder-white/50"
        />
        
        
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={cargando}
            className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-300 ${
              cargando
                ? 'bg-red-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-yellow-500'
            }`}
          >
            {cargando
              ? editando
                ? 'Actualizando...'
                : 'Creando...'
              : editando
              ? 'Actualizar Salsa'
              : 'Crear Salsa'}
          </button>
          {editando && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full py-3 px-6 rounded-lg bg-gray-700 hover:bg-gray-500 transition-all duration-300"
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <hr className="border-yellow-400 mb-6" />

      <h2 className="text-2xl font-semibold mb-4">Lista de Salsas 🌶️</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {salsas.map((salsa) => (
          <motion.div
            whileHover={{ scale: 1.02 }}
            key={salsa.id}
            className="bg-black/40 p-4 rounded-lg border border-yellow-500 shadow-md relative"
          >
            <h3 className="text-xl font-bold text-yellow-300 mb-2">
              {salsa.nombre}
            </h3>
            <p className="text-sm text-white">🌡️ Picor: {salsa.nivelPicor}</p>
            <p className="text-sm text-white">🖼️ Imagen: {salsa.imagen}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => cargarSalsaEnFormulario(salsa)}
                className="px-4 py-2 rounded bg-yellow-500 text-black font-bold hover:bg-yellow-400"
              >
                Editar
              </button>
              <button
                onClick={() => setMostrarEliminar(salsa)}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 font-bold"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal eliminar */}
      {mostrarEliminar && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-red-800 p-6 rounded-lg text-white border border-yellow-500 max-w-md">
            <h3 className="text-xl font-bold mb-4">¿Eliminar salsa?</h3>
            <p className="mb-4">
              ¿Estás seguro de que quieres eliminar{' '}
              <span className="font-bold">{mostrarEliminar.nombre}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setMostrarEliminar(null)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-400 font-bold"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
