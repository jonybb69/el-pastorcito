'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useConfirmDialog } from '@/components/useConfirmDialog'
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiX, FiUser, FiPhone, FiMapPin, FiDollarSign, FiMenu, FiChevronLeft, FiChevronUp, FiChevronDown } from 'react-icons/fi'

type Pedido = {
  id: number
  pedidoId: number
  numeroPedido: string
  fecha: string
  estado: string
  cliente: {
    nombre: string
    telefono: string
    direccion: string
  }
  productos: Array<{
    id: number
    nombre: string
    salsas: string[]
    cantidad: number
    precio: number
  }>
}

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cargando, setCargando] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [pedidoExpandido, setPedidoExpandido] = useState<number | null>(null)
  const [panelAbierto, setPanelAbierto] = useState(() => {
    // Recuperar estado del localStorage o usar true por defecto
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('panelEstado')
      return saved ? JSON.parse(saved) : true
    }
    return true
  })
  const { confirm, Dialog } = useConfirmDialog()

  // Guardar estado del panel en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('panelEstado', JSON.stringify(panelAbierto))
  }, [panelAbierto])

  const fetchPedidos = async () => {
    try {
      const res = await fetch('/api/pedidos')
      if (!res.ok) throw new Error('Error al cargar pedidos')
      const data = await res.json()
      setPedidos(data.pedidos)
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar los pedidos')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    fetchPedidos()
  }, [])

  const togglePanel = () => {
    setPanelAbierto(!panelAbierto)
  }

  const eliminarPedido = async (id?: number) => {
    if (!id) {
      toast.error('ID de pedido no válido')
      return
    }

    const confirmado = await confirm({
      message: '¿Estás seguro de que deseas eliminar este pedido?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
    })

    if (!confirmado) return

    try {
      const res = await fetch(`/api/pedidos/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Pedido eliminado')

      setPedidos((prev) => prev.filter((p) => p.id !== id))
    } catch {
      toast.error('No se pudo eliminar el pedido')
    }
  }

  const actualizarEstado = async (id: number, nuevoEstado: string) => {
    if (!id) {
      toast.error('ID de pedido no válido')
      return
    }

    const confirmado = await confirm({
      message: `¿Seguro que deseas marcar este pedido como "${nuevoEstado}"?`,
      confirmText: 'Actualizar',
      cancelText: 'Cancelar',
      type: 'info',
    })

    if (!confirmado) return

    try {
      const res = await fetch(`/api/pedidos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      })

      if (!res.ok) throw new Error()

      toast.success(`Estado actualizado a "${nuevoEstado}"`)
      setPedidos((prev) =>
        prev.map((pedido) =>
          pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido
        )
      )
    } catch {
      toast.error('Error al actualizar el estado')
    }
  }

  const toggleExpandirPedido = (id: number) => {
    setPedidoExpandido(pedidoExpandido === id ? null : id)
  }

  const pedidosFiltrados = pedidos.filter(pedido => 
    filtroEstado === 'todos' || pedido.estado === filtroEstado
  )

  const calcularTotal = (productos: { precio: number; cantidad: number }[]) => {
    return productos.reduce(
      (total: number, producto) => total + producto.precio * producto.cantidad,
      0
    ).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      {/* Botón para toggle del panel */}
      <button
        onClick={togglePanel}
        className={`fixed z-20 top-4 left-4 md:left-6 p-2 rounded-full bg-gray-800 border border-gray-700 shadow-lg text-white hover:bg-gray-700 transition-all ${
          panelAbierto ? 'md:left-64' : 'md:left-6'
        }`}
      >
        {panelAbierto ? <FiChevronLeft size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Panel lateral */}
      <motion.div
        initial={{ x: panelAbierto ? 0 : -300 }}
        animate={{ x: panelAbierto ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed z-10 left-0 top-0 h-full w-72 bg-gray-800/90 backdrop-blur-md border-r border-gray-700 p-6 shadow-xl ${
          panelAbierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <h3 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-2">
          <FiPackage />
          <span>Filtros</span>
        </h3>
        
        <div className="space-y-4">
          <button
            onClick={() => setFiltroEstado('todos')}
            className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
              filtroEstado === 'todos' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-gray-700/50 hover:bg-gray-700'
            }`}
          >
            Todos los pedidos
          </button>
          
          <button
            onClick={() => setFiltroEstado('pendiente')}
            className={`w-full text-left px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              filtroEstado === 'pendiente' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-gray-700/50 hover:bg-gray-700'
            }`}
          >
            <FiClock />
            <span>Pendientes</span>
          </button>
          
          <button
            onClick={() => setFiltroEstado('en preparación')}
            className={`w-full text-left px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              filtroEstado === 'en preparación' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-gray-700/50 hover:bg-gray-700'
            }`}
          >
            <FiPackage />
            <span>En preparación</span>
          </button>
          
          <button
            onClick={() => setFiltroEstado('finalizado')}
            className={`w-full text-left px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              filtroEstado === 'finalizado' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-700/50 hover:bg-gray-700'
            }`}
          >
            <FiCheckCircle />
            <span>Finalizados</span>
          </button>
          
          <button
            onClick={() => setFiltroEstado('en camino')}
            className={`w-full text-left px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              filtroEstado === 'en camino' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-gray-700/50 hover:bg-gray-700'
            }`}
          >
            <FiTruck />
            <span>En camino</span>
          </button>
        </div>

        {/* Estadísticas */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h4 className="text-lg font-semibold text-gray-300 mb-4">Estadísticas</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total pedidos:</span>
              <span className="font-medium">{pedidos.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Pendientes:</span>
              <span className="text-red-400">{pedidos.filter(p => p.estado === 'pendiente').length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">En preparación:</span>
              <span className="text-blue-400">{pedidos.filter(p => p.estado === 'en preparación').length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Finalizados:</span>
              <span className="text-green-400">{pedidos.filter(p => p.estado === 'finalizado').length}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contenido principal */}
      <div className={`transition-all duration-300 ${
        panelAbierto ? 'ml-0 md:ml-72' : 'ml-0'
      }`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <FiPackage className="text-amber-400" />
                <span>Pedidos Entrantes</span>
              </h1>
              <p className="text-gray-400 mt-1">
                Administra y actualiza el estado de los pedidos
              </p>
            </div>

            {/* Filtros para móvil */}
            <div className="md:hidden w-full">
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
              >
                <option value="todos">Todos los pedidos</option>
                <option value="pendiente">Pendientes</option>
                <option value="en preparación">En preparación</option>
                <option value="finalizado">Finalizados</option>
                <option value="en camino">En camino</option>
              </select>
            </div>

            <button
              onClick={fetchPedidos}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg transition-colors"
            >
              <FiCheckCircle />
              <span>Actualizar</span>
            </button>
          </div>
        </motion.div>

        {cargando ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center h-64"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </motion.div>
        ) : pedidosFiltrados.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700"
          >
            <FiPackage className="mx-auto text-4xl text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-300">
              No hay pedidos {filtroEstado !== 'todos' ? `en estado "${filtroEstado}"` : ''}
            </h3>
            <p className="text-gray-500 mt-2">
              {filtroEstado === 'todos' ? 'Cuando lleguen nuevos pedidos aparecerán aquí.' : 'Prueba con otro filtro.'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pedidosFiltrados.filter(p => p.id).map((pedido) => (
              <motion.div
                key={pedido.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className={`bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-xl border shadow-xl overflow-hidden transition-all ${
                  pedido.estado === 'pendiente' ? 'border-red-500/30 hover:border-red-500/50' :
                  pedido.estado === 'en preparación' ? 'border-blue-500/30 hover:border-blue-500/50' :
                  pedido.estado === 'finalizado' ? 'border-green-500/30 hover:border-green-500/50' :
                  'border-gray-700 hover:border-amber-500/30'
                }`}
              >
                {/* Header de la tarjeta */}
                <div 
                  className="p-5 cursor-pointer"
                  onClick={() => toggleExpandirPedido(pedido.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-white">
                          Pedido {pedido.numeroPedido}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          pedido.estado === 'pendiente' ? 'bg-red-500/20 text-red-400' :
                          pedido.estado === 'en preparación' ? 'bg-blue-500/20 text-blue-400' :
                          pedido.estado === 'finalizado' ? 'bg-green-500/20 text-green-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {pedido.estado}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(pedido.fecha).toLocaleString()}
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                      {pedidoExpandido === pedido.id ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="bg-amber-500/10 p-2 rounded-lg text-amber-400">
                      <FiUser size={18} />
                    </div>
                    <div>
                      <p className="font-medium">{pedido.cliente.nombre}</p>
                      <p className="text-sm text-gray-400">{pedido.cliente.telefono}</p>
                    </div>
                  </div>
                </div>

                {/* Contenido expandible */}
                <AnimatePresence>
                  {pedidoExpandido === pedido.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4">
                        {/* Información del cliente */}
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-300 mb-3 flex items-center gap-2">
                            <FiUser className="text-amber-400" />
                            <span>Información del cliente</span>
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-3">
                              <FiPhone className="text-gray-500" />
                              <span>{pedido.cliente.telefono}</span>
                            </div>
                            <div className="flex items-start gap-3">
                              <FiMapPin className="text-gray-500 mt-0.5" />
                              <span>{pedido.cliente.direccion}</span>
                            </div>
                          </div>
                        </div>

                        {/* Productos */}
                        <div>
                          <h4 className="font-medium text-gray-300 mb-3 flex items-center gap-2">
                            <FiPackage className="text-amber-400" />
                            <span>Productos ({pedido.productos.length})</span>
                          </h4>
                          <div className="space-y-3">
                            {pedido.productos.map((prod, index) => (
                              <motion.div
                                key={`${prod.id}-${index}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-3 rounded-lg bg-gray-800/30 border border-gray-700"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{prod.nombre}</p>
                                    {prod.salsas.length > 0 && (
                                      <p className="text-xs text-gray-400 mt-1">
                                        Salsas: {prod.salsas.join(', ')}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">${prod.precio.toFixed(2)}</p>
                                    <p className="text-xs text-gray-400">x{prod.cantidad}</p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Total y acciones */}
                        <div className="flex flex-col md:flex-row justify-between gap-4 pt-2">
                          <div className="bg-gray-800/50 p-3 rounded-lg flex items-center gap-2">
                            <FiDollarSign className="text-green-400" />
                            <span className="font-bold">Total:</span>
                            <span className="text-lg font-bold text-green-400">
                              ${calcularTotal(pedido.productos)}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {pedido.estado !== 'en preparación' && (
                              <button
                                onClick={() => actualizarEstado(pedido.id, 'en preparación')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                              >
                                <FiPackage size={16} />
                                <span>En preparación</span>
                              </button>
                            )}

                            {pedido.estado !== 'finalizado' && (
                              <button
                                onClick={() => actualizarEstado(pedido.id, 'finalizado')}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
                              >
                                <FiCheckCircle size={16} />
                                <span>Finalizar</span>
                              </button>
                            )}

                            {pedido.estado !== 'en camino' && (
                              <button
                                onClick={() => actualizarEstado(pedido.id, 'en camino')}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
                              >
                                <FiTruck size={16} />
                                <span>Enviar</span>
                              </button>
                            )}

                            <button
                              onClick={() => eliminarPedido(pedido.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm"
                            >
                              <FiX size={16} />
                              <span>Eliminar</span>
                            </button>
                          </div>
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

      <Dialog />
    </div>
  )
}