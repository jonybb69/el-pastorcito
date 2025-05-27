'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'

type Producto = {
  id: string
  nombre: string
  descripcion: string
  precio: number
  imagen: string
  categoria?: string
}

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [mostrarCategoria, setMostrarCategoria] = useState<'platillos' | 'bebidas' | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [productosExpandidos, setProductosExpandidos] = useState<Record<string, boolean>>({})

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState<number>(0)
  const [imagen, setImagen] = useState('')
  const [categoria, setCategoria] = useState<'platillos' | 'bebidas'>('platillos')

  const [editando, setEditando] = useState<Producto | null>(null)
  const [mostrarEliminar, setMostrarEliminar] = useState<Producto | null>(null)

  const obtenerProductos = async () => {
    try {
      const res = await fetch('/api/productos')
      const data = await res.json()
      setProductos(data)
    } catch (error) {
      toast.error('Error al obtener productos')
    }
  }

  useEffect(() => {
    obtenerProductos()
  }, [])

  const toggleExpandirProducto = (id: string) => {
    setProductosExpandidos(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = editando ? 'PUT' : 'POST'

    try {
      const res = await fetch('/api/productos', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editando?.id,
          nombre,
          descripcion,
          precio,
          imagen,
          categoria,
        }),
      })

      if (res.ok) {
        toast.success(editando ? 'Producto actualizado' : 'Producto creado')
        resetForm()
        obtenerProductos()
      } else {
        toast.error('Error al guardar producto')
      }
    } catch {
      toast.error('Error de conexión')
    }
  }

  const resetForm = () => {
    setNombre('')
    setDescripcion('')
    setPrecio(0)
    setImagen('')
    setCategoria('platillos')
    setEditando(null)
    setMostrarFormulario(false)
  }

  const productosFiltrados = productos.filter((p) => p.categoria === mostrarCategoria)

  return (
    <section className="min-h-screen w-full flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
      </div>

      {/* Menú izquierdo */}
      <div className="w-64 p-6 border-r border-gray-700 bg-gray-900/80 backdrop-blur-sm flex flex-col gap-4 z-10">
        <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-gray-700 pb-4">Administración</h2>
        
        <button
          onClick={() => {
            setMostrarFormulario(false)
            setMostrarCategoria('platillos')
          }}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${mostrarCategoria === 'platillos' ? 'bg-red-600/90 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
        >
          <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">🍽️</span>
          <span>Platillos</span>
        </button>
        
        <button
          onClick={() => {
            setMostrarFormulario(false)
            setMostrarCategoria('bebidas')
          }}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${mostrarCategoria === 'bebidas' ? 'bg-blue-600/90 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
        >
          <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">🥤</span>
          <span>Bebidas</span>
        </button>
        
        <div className="mt-auto pt-4 border-t border-gray-700">
          <button
            onClick={() => {
              resetForm()
              setMostrarFormulario(true)
              setMostrarCategoria(null)
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-semibold px-4 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            <FiPlus size={18} />
            <span>Añadir Producto</span>
          </button>
        </div>
      </div>

      {/* Contenido central */}
      <div className="flex-1 p-8 z-10">
        <AnimatePresence>
          {mostrarCategoria && (
            <motion.div
              key={mostrarCategoria}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {productosFiltrados.map((producto) => (
                <motion.div
                  key={producto.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div 
                    className="p-5 cursor-pointer"
                    onClick={() => toggleExpandirProducto(producto.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-orange-300">{producto.nombre}</h3>
                        <p className="text-cyan-300 font-semibold mt-1">${producto.precio.toFixed(2)}</p>
                      </div>
                      <button className="text-gray-400 hover:text-white">
                        {productosExpandidos[producto.id] ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {productosExpandidos[producto.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5">
                          <p className="text-gray-300 mb-4">{producto.descripcion}</p>
                          <div className="flex gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditando(producto)
                                setNombre(producto.nombre)
                                setDescripcion(producto.descripcion)
                                setPrecio(producto.precio)
                                setImagen(producto.imagen)
                                setCategoria(producto.categoria as any)
                                setMostrarFormulario(true)
                                setMostrarCategoria(null)
                              }}
                              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg transition-colors"
                            >
                              <FiEdit2 size={16} />
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setMostrarEliminar(producto)
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
            </motion.div>
          )}
        </AnimatePresence>

        {mostrarCategoria && productosFiltrados.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="text-xl">No hay {mostrarCategoria === 'platillos' ? 'platillos' : 'bebidas'} registrados</p>
            <button
              onClick={() => {
                resetForm()
                setMostrarFormulario(true)
                setMostrarCategoria(null)
              }}
              className="mt-4 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <FiPlus size={16} />
              <span>Añadir {mostrarCategoria === 'platillos' ? 'platillo' : 'bebida'}</span>
            </button>
          </div>
        )}
      </div>

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
                  <h2 className="text-2xl font-bold text-cyan-400">
                    {editando ? 'Editar Producto' : 'Nuevo Producto'}
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
                      placeholder="Ej: Tacos al pastor"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
                    <textarea
                      placeholder="Descripción detallada del producto"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent min-h-[100px]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Precio ($)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={precio}
                      onChange={(e) => setPrecio(Number(e.target.value))}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Imagen (URL)</label>
                    <input
                      type="text"
                      placeholder="Ej: https://ejemplo.com/tacos.png"
                      value={imagen}
                      onChange={(e) => setImagen(e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Categoría</label>
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value as any)}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      <option value="platillos">Platillo</option>
                      <option value="bebidas">Bebida</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white font-semibold py-3 rounded-lg transition-opacity"
                    >
                      {editando ? 'Actualizar' : 'Crear'}
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
              
              <p className="mb-6">¿Estás seguro de eliminar <span className="font-semibold text-orange-300">{mostrarEliminar.nombre}</span>? Esta acción no se puede deshacer.</p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setMostrarEliminar(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    await fetch('/api/productos', {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: mostrarEliminar.id }),
                    })
                    toast.success('Producto eliminado')
                    obtenerProductos()
                    setMostrarEliminar(null)
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:opacity-90 rounded-lg transition-opacity"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}