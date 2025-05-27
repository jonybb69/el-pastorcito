'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { FiEdit2, FiTrash2, FiX, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi'

type Salsa = {
  id: string
  nombre: string
  nivelPicor: string
  imagen: string
}

export default function AdminSalsasPage() {
  const [salsas, setSalsas] = useState<Salsa[]>([])
  const [nombre, setNombre] = useState('')
  const [nivelPicor, setNivelPicor] = useState('suave')
  const [imagen, setImagen] = useState('')
  const [cargando, setCargando] = useState(false)
  const [salsasExpandidas, setSalsasExpandidas] = useState<Record<string, boolean>>({})
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const [editando, setEditando] = useState<Salsa | null>(null)
  const [mostrarEliminar, setMostrarEliminar] = useState<Salsa | null>(null)

  const obtenerSalsas = async () => {
    try {
      const res = await fetch('/api/salsas')
      const data = await res.json()
      setSalsas(data)
    } catch {
      toast.error('Error al obtener salsas')
    }
  }

  useEffect(() => {
    obtenerSalsas()
  }, [])

  const toggleExpandirSalsa = (id: string) => {
    setSalsasExpandidas(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    try {
      const method = editando ? 'PUT' : 'POST'
      const body = {
        id: editando?.id,
        nombre,
        nivelPicor,
        imagen
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
    } catch {
      toast.error('Error al conectar con el servidor')
    } finally {
      setMostrarEliminar(null)
    }
  }

  const resetForm = () => {
    setNombre('')
    setNivelPicor('suave')
    setImagen('')
    setEditando(null)
    setMostrarFormulario(false)
  }

  const cargarSalsaEnFormulario = (salsa: Salsa) => {
    setEditando(salsa)
    setNombre(salsa.nombre)
    setNivelPicor(salsa.nivelPicor)
    setImagen(salsa.imagen)
    setMostrarFormulario(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-orange-400">
            Administración de Salsas
          </h1>
          <button
            onClick={() => {
              resetForm()
              setMostrarFormulario(true)
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-semibold px-4 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            <FiPlus size={18} />
            <span>Nueva Salsa</span>
          </button>
        </motion.div>

        {/* Formulario */}
        <AnimatePresence>
          {mostrarFormulario && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-gray-900 border border-gray-700 text-white rounded-xl w-full max-w-md mx-4 shadow-2xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-amber-400">
                      {editando ? 'Editar Salsa' : 'Nueva Salsa'}
                    </h2>
                    <button
                      onClick={() => setMostrarFormulario(false)}
                      className="text-gray-400 hover:text-white p-1 rounded-full"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                      <input
                        type="text"
                        placeholder="Ej: Salsa Habanero"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Nivel de Picor</label>
                      <select
                        value={nivelPicor}
                        onChange={(e) => setNivelPicor(e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="suave">Suave</option>
                        <option value="medio">Medio</option>
                        <option value="picante">Picante</option>
                        <option value="muy picante">Muy Picante</option>
                        <option value="extremadamente picante">Extremadamente Picante</option>
                      </select>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={cargando}
                        className={`flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-black font-semibold py-3 rounded-lg transition-opacity ${
                          cargando ? 'opacity-70 cursor-not-allowed' : ''
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
                      <button
                        type="button"
                        onClick={() => setMostrarFormulario(false)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de Salsas */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-amber-300 border-b border-gray-700 pb-2">
            Lista de Salsas
          </h2>
          
          {salsas.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-4">No hay salsas registradas aún</p>
              <button
                onClick={() => {
                  resetForm()
                  setMostrarFormulario(true)
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <FiPlus size={16} />
                <span>Crear primera salsa</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {salsas.map((salsa) => (
                <motion.div
                  key={salsa.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div 
                    className="p-5 cursor-pointer"
                    onClick={() => toggleExpandirSalsa(salsa.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-amber-300">{salsa.nombre}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-block w-3 h-3 rounded-full ${
                            salsa.nivelPicor === 'suave' ? 'bg-green-500' :
                            salsa.nivelPicor === 'medio' ? 'bg-yellow-500' :
                            salsa.nivelPicor === 'picante' ? 'bg-orange-500' :
                            salsa.nivelPicor === 'muy picante' ? 'bg-red-500' :
                            'bg-red-700'
                          }`}></span>
                          <span className="text-sm capitalize">{salsa.nivelPicor}</span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-white">
                        {salsasExpandidas[salsa.id] ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {salsasExpandidas[salsa.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5">
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-400 mb-1">Imagen:</h4>
                            <p className="text-sm text-gray-300 break-all">{salsa.imagen || 'No especificada'}</p>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                cargarSalsaEnFormulario(salsa)
                              }}
                              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg transition-colors"
                            >
                              <FiEdit2 size={16} />
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setMostrarEliminar(salsa)
                              }}
                              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition-colors"
                            >
                              <FiTrash2 size={16} />
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal eliminar */}
      <AnimatePresence>
        {mostrarEliminar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-900 border border-red-700 p-6 rounded-xl text-white max-w-sm w-full mx-4"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-red-400">Confirmar eliminación</h3>
                <button
                  onClick={() => setMostrarEliminar(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <p className="mb-6">¿Estás seguro de eliminar <span className="font-semibold text-amber-300">{mostrarEliminar.nombre}</span>? Esta acción no se puede deshacer.</p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setMostrarEliminar(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:opacity-90 rounded-lg transition-opacity"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}