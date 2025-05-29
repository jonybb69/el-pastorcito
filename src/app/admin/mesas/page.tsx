'use client'

import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiCoffee, FiUser, FiDollarSign } from 'react-icons/fi'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

type Producto = {
  id: number
  nombre: string
  precio: number
  cantidad: number
  notas: string
}

type Mesa = {
  id: number
  numero: number
  capacidad: number
  estado: 'libre' | 'ocupada' | 'reservada'
  pedidos: Producto[]
  total: number
}

export default function AdminMesasPage() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [loading, setLoading] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [mesaEditando, setMesaEditando] = useState<Mesa | null>(null)
  const [nuevoNumeroMesa, setNuevoNumeroMesa] = useState('')
  const [nuevaCapacidad, setNuevaCapacidad] = useState(4)
  const [productosDisponibles] = useState([
    { id: 1, nombre: 'Tacos al Pastor', precio: 15 },
    { id: 2, nombre: 'Quesadilla', precio: 12 },
    { id: 3, nombre: 'Agua Fresca', precio: 10 },
    { id: 4, nombre: 'Refresco', precio: 8 }
  ])

  // Cargar mesas al iniciar
  useEffect(() => {
    cargarMesas()
  }, [])

  const cargarMesas = async () => {
    setLoading(true)
    try {
      // Simular carga de API
      setTimeout(() => {
        const mesasEjemplo: Mesa[] = [
          { id: 1, numero: 1, capacidad: 4, estado: 'libre', pedidos: [], total: 0 },
          { id: 2, numero: 2, capacidad: 6, estado: 'ocupada', pedidos: [
            { id: 1, nombre: 'Tacos al Pastor', precio: 15, cantidad: 3, notas: '' },
            { id: 4, nombre: 'Refresco', precio: 8, cantidad: 2, notas: 'Sin hielo' }
          ], total: 61 },
          { id: 3, numero: 3, capacidad: 2, estado: 'reservada', pedidos: [], total: 0 }
        ]
        setMesas(mesasEjemplo)
        setLoading(false)
      }, 800)
    } catch {
      toast.error('Error al cargar las mesas')
      setLoading(false)
    }
  }

  const calcularTotal = (pedidos: Producto[]) => {
    return pedidos.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0)
  }

  const abrirModalNuevaMesa = () => {
    setMesaEditando(null)
    setNuevoNumeroMesa('')
    setNuevaCapacidad(4)
    setModalAbierto(true)
  }

  const abrirModalEditarMesa = (mesa: Mesa) => {
    setMesaEditando(mesa)
    setNuevoNumeroMesa(mesa.numero.toString())
    setNuevaCapacidad(mesa.capacidad)
    setModalAbierto(true)
  }

  const guardarMesa = () => {
    if (!nuevoNumeroMesa || isNaN(parseInt(nuevoNumeroMesa))) {
      toast.error('Ingrese un número de mesa válido')
      return
    }

    const numero = parseInt(nuevoNumeroMesa)
    
    if (mesaEditando) {
      // Editar mesa existente
      setMesas(mesas.map(mesa => 
        mesa.id === mesaEditando.id 
          ? { ...mesa, numero, capacidad: nuevaCapacidad } 
          : mesa
      ))
      toast.success('Mesa actualizada correctamente')
    } else {
      // Crear nueva mesa
      const nuevaMesa: Mesa = {
        id: mesas.length + 1,
        numero,
        capacidad: nuevaCapacidad,
        estado: 'libre',
        pedidos: [],
        total: 0
      }
      setMesas([...mesas, nuevaMesa])
      toast.success('Mesa creada correctamente')
    }

    setModalAbierto(false)
  }

  const eliminarMesa = (id: number) => {
    setMesas(mesas.filter(mesa => mesa.id !== id))
    toast.success('Mesa eliminada correctamente')
  }

  const cambiarEstadoMesa = (id: number, nuevoEstado: 'libre' | 'ocupada' | 'reservada') => {
    setMesas(mesas.map(mesa => 
      mesa.id === id ? { ...mesa, estado: nuevoEstado } : mesa
    ))
  }

  const agregarProducto = (mesaId: number, productoId: number) => {
    const producto = productosDisponibles.find(p => p.id === productoId)
    if (!producto) return

    setMesas(mesas.map(mesa => {
      if (mesa.id !== mesaId) return mesa

      const productoExistente = mesa.pedidos.find(p => p.id === productoId)
      let nuevosPedidos: Producto[]

      if (productoExistente) {
        nuevosPedidos = mesa.pedidos.map(p => 
          p.id === productoId 
            ? { ...p, cantidad: p.cantidad + 1 } 
            : p
        )
      } else {
        nuevosPedidos = [...mesa.pedidos, { ...producto, cantidad: 1, notas: '' }]
      }

      return {
        ...mesa,
        pedidos: nuevosPedidos,
        total: calcularTotal(nuevosPedidos)
      }
    }))
  }

  const actualizarCantidad = (mesaId: number, productoId: number, cantidad: number) => {
    if (cantidad < 1) return

    setMesas(mesas.map(mesa => {
      if (mesa.id !== mesaId) return mesa

      const nuevosPedidos = mesa.pedidos.map(p => 
        p.id === productoId ? { ...p, cantidad } : p
      ).filter(p => p.cantidad > 0)

      return {
        ...mesa,
        pedidos: nuevosPedidos,
        total: calcularTotal(nuevosPedidos)
      }
    }))
  }

  const actualizarNotas = (mesaId: number, productoId: number, notas: string) => {
    setMesas(mesas.map(mesa => {
      if (mesa.id !== mesaId) return mesa

      const nuevosPedidos = mesa.pedidos.map(p => 
        p.id === productoId ? { ...p, notas } : p
      )

      return {
        ...mesa,
        pedidos: nuevosPedidos
      }
    }))
  }

  const cerrarMesa = (mesaId: number) => {
    setMesas(mesas.map(mesa => 
      mesa.id === mesaId 
        ? { ...mesa, estado: 'libre', pedidos: [], total: 0 } 
        : mesa
    ))
    toast.success(`Mesa #${mesas.find(m => m.id === mesaId)?.numero} cerrada`)
  }

  return (
    <div className="p-8 rounded-xl border-r-8 border-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Administración de Mesas</h1>
          <button
            onClick={abrirModalNuevaMesa}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiPlus /> Nueva Mesa
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        )}

        {/* Lista de mesas */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {mesas.map(mesa => (
              <motion.div
                key={mesa.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className={`rounded-xl shadow-md overflow-hidden border ${
                  mesa.estado === 'libre' ? 'border-green-200 bg-white' :
                  mesa.estado === 'ocupada' ? 'border-red-200 bg-red-50' :
                  'border-yellow-200 bg-yellow-50'
                }`}
              >
                {/* Header de la mesa */}
                <div className={`p-4 flex justify-between items-center ${
                  mesa.estado === 'libre' ? 'bg-green-100' :
                  mesa.estado === 'ocupada' ? 'bg-red-100' :
                  'bg-yellow-100'
                }`}>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Mesa #{mesa.numero}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FiUser size={14} /> {mesa.capacidad} personas
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => abrirModalEditarMesa(mesa)}
                      className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => eliminarMesa(mesa.id)}
                      className="p-2 rounded-full bg-white text-red-600 hover:bg-red-50"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Estado de la mesa */}
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      mesa.estado === 'libre' ? 'bg-green-200 text-green-800' :
                      mesa.estado === 'ocupada' ? 'bg-red-200 text-red-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {mesa.estado === 'libre' ? 'Libre' : 
                       mesa.estado === 'ocupada' ? 'Ocupada' : 'Reservada'}
                    </span>

                    {mesa.estado === 'ocupada' && (
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <FiDollarSign size={14} />
                        <span>${mesa.total.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4">
                  {mesa.estado === 'ocupada' ? (
                    <>
                      <h4 className="font-medium text-gray-700 mb-2">Pedido actual:</h4>
                      {mesa.pedidos.length === 0 ? (
                        <p className="text-sm text-gray-500">No hay productos agregados</p>
                      ) : (
                        <div className="space-y-3 mb-4">
                          {mesa.pedidos.map(producto => (
                            <div key={`${mesa.id}-${producto.id}`} className="bg-white p-3 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{producto.nombre}</p>
                                  <p className="text-sm text-gray-600">${producto.precio.toFixed(2)} c/u</p>
                                  {producto.notas && (
                                    <p className="text-xs text-gray-500 mt-1">Notas: {producto.notas}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => actualizarCantidad(mesa.id, producto.id, producto.cantidad - 1)}
                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  >
                                    -
                                  </button>
                                  <span className="text-sm font-medium">{producto.cantidad}</span>
                                  <button
                                    onClick={() => actualizarCantidad(mesa.id, producto.id, producto.cantidad + 1)}
                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <input
                                type="text"
                                value={producto.notas}
                                onChange={(e) => actualizarNotas(mesa.id, producto.id, e.target.value)}
                                placeholder="Notas adicionales..."
                                className="w-full mt-2 px-2 py-1 text-xs border border-gray-200 rounded"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-2">
                        <select
                          onChange={(e) => agregarProducto(mesa.id, parseInt(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                          defaultValue=""
                        >
                          <option value="" disabled>Agregar producto...</option>
                          {productosDisponibles.map(producto => (
                            <option key={producto.id} value={producto.id}>
                              {producto.nombre} (${producto.precio.toFixed(2)})
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => cerrarMesa(mesa.id)}
                          className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2"
                        >
                          <FiCheck /> Cerrar Mesa
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={() => cambiarEstadoMesa(mesa.id, 'ocupada')}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center justify-center gap-2"
                      >
                        <FiCoffee /> Abrir Mesa
                      </button>

                      <button
                        onClick={() => cambiarEstadoMesa(mesa.id, mesa.estado === 'reservada' ? 'libre' : 'reservada')}
                        className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 ${
                          mesa.estado === 'reservada' 
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                            : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
                        }`}
                      >
                        {mesa.estado === 'reservada' ? (
                          <>
                            <FiX /> Cancelar Reserva
                          </>
                        ) : (
                          <>
                            <FiCheck /> Reservar Mesa
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal para agregar/editar mesa */}
        <AnimatePresence>
          {modalAbierto && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">
                    {mesaEditando ? 'Editar Mesa' : 'Agregar Nueva Mesa'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Mesa
                      </label>
                      <input
                        type="number"
                        value={nuevoNumeroMesa}
                        onChange={(e) => setNuevoNumeroMesa(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Ej. 1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacidad
                      </label>
                      <select
                        value={nuevaCapacidad}
                        onChange={(e) => setNuevaCapacidad(parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        {[2, 4, 6, 8, 10].map(num => (
                          <option key={num} value={num}>
                            {num} personas
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setModalAbierto(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={guardarMesa}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
                    >
                      {mesaEditando ? 'Actualizar Mesa' : 'Agregar Mesa'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}