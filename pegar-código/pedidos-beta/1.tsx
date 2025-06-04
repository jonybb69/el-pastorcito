'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useConfirmDialog } from '@/components/useConfirmDialog'
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiX, FiUser, FiPhone, FiMenu, FiChevronLeft, FiChevronUp, FiChevronDown, FiRefreshCw, FiChevronsRight, } from 'react-icons/fi'

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

const estadosPedido = [
  { value: 'pendiente', label: 'Pendiente', icon: FiClock, color: 'red' },
  { value: 'en preparación', label: 'En preparación', icon: FiPackage, color: 'blue' },
  { value: 'en camino', label: 'En camino', icon: FiTruck, color: 'purple' },
  { value: 'finalizado', label: 'Finalizado', icon: FiCheckCircle, color: 'green' }
]

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cargando, setCargando] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [pedidoExpandido, setPedidoExpandido] = useState<number | null>(null)
  const [panelAbierto, setPanelAbierto] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('panelEstado')
      return saved ? JSON.parse(saved) : true
    }
    return true
  })
  const { confirm, Dialog } = useConfirmDialog()

  useEffect(() => {
    localStorage.setItem('panelEstado', JSON.stringify(panelAbierto))
  }, [panelAbierto])

  const fetchPedidos = async () => {
    try {
      setCargando(true)
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
      message: '¿Estás seguro de eliminar este pedido? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    })

    if (!confirmado) return

    try {
      const res = await fetch(`/api/pedidos/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      
      toast.success('Pedido eliminado correctamente')
      setPedidos(prev => prev.filter(p => p.id !== id))
      
      // Si el pedido eliminado estaba expandido, cerramos el panel
      if (pedidoExpandido === id) {
        setPedidoExpandido(null)
      }
    } catch {
      toast.error('No se pudo eliminar el pedido')
    }
  }

  const actualizarEstado = async (id: number, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/pedidos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      })

      if (!res.ok) throw new Error()

      toast.success(`Pedido marcado como ${nuevoEstado}`)
      setPedidos(prev =>
        prev.map(pedido =>
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
      (total, producto) => total + producto.precio * producto.cantidad,
      0
    ).toFixed(2)
  }

  const getEstadoConfig = (estado: string) => {
    return estadosPedido.find(e => e.value === estado) || 
      { value: estado, label: estado, icon: FiPackage, color: 'gray' }
  }

  return (
    <div className="relative">
  {/* Botón flotante para móviles */}
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={togglePanel}
    className={`md:hidden fixed z-30 top-4 left-4 p-3 rounded-full shadow-lg ${
      panelAbierto ? 'bg-white text-gray-800' : 'bg-amber-500 text-white'
    } transition-colors duration-200`}
  >
    {panelAbierto ? <FiChevronLeft size={20} /> :  <FiChevronsRight size={20} />}
  </motion.button>

  {/* Panel lateral */}
  <motion.div
    initial={{ x: panelAbierto ? 0 : -320 }}
    animate={{ x: panelAbierto ? 0 : -320 }}
    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    className={`fixed z-50 rounded-lg left-5 top-5 h-11/12 w-72 bg-cyan-500/60 shadow-lg border border-white/50 flex flex-col ${
      panelAbierto ? 'translate-x-0' : '-translate-x-full'
    }`}
  >
    {/* Header del panel */}
    <div className="p-5 border rounded-lg border-black/60 bg-gradient-to-r from-cyan-800/90 to-amber-600/90">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-black flex items-center gap-2">
          <FiPackage className="text-amber-600" size={22} />
          <span>Filtrar Pedidos</span>
        </h3>
        <button 
          onClick={togglePanel}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-teal-800 border border-gray-800 text-black hover:text-black hover:bg-teal-700 transition-colors"
        >
          <FiChevronLeft size={18} />
        </button>
      </div>
      <p className="text-sm text-teal-500 mt-1">
        {pedidos.length} pedidos en total
      </p>
    </div>

    {/* Contenido del panel */}
    <div className="flex-1 overflow-y-auto p-5">
      <div className="space-y-6">
        {/* Filtro Todos */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setFiltroEstado('todos')}
          className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
            filtroEstado === 'todos' 
              ? 'bg-white/10 text-amber-500 border-1 border-white/30 hover: shadow-xl' 
              : 'bg-white/30 hover:bg-black/20 text-gray-700 border border-gray-100'
          }`}
        >
          <div className={`w-3 h-3 rounded-full ${
            filtroEstado === 'todos' ? 'bg-amber-500' : 'bg-gray-300'
          }`}></div>
          <span className="font-medium">Todos los pedidos</span>
          <span className="ml-auto px-2 py-1 text-hover- rounded-lg bg-gray-100 text-black text-xs font-medium">
            {pedidos.length}
          </span>
        </motion.button>
        
        {/* Filtros por estado */}
        {estadosPedido.map((estado) => {
          const count = pedidos.filter(p => p.estado === estado.value).length
          return (
            <motion.button
              key={estado.value}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFiltroEstado(estado.value)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                filtroEstado === estado.value 
                  ? `bg-${estado.color}-50 text-${estado.color}-800 border-2 border-${estado.color}-100 shadow-sm` 
                  : 'bg-white/40 hover:bg-gray-500 text-gray-700 border border-gray-100'
              }`}
            >
              <estado.icon 
                className={`text-${estado.color}-500`} 
                size={18} 
              />
              <span className="font-medium">{estado.label}</span>
              {count > 0 ? (
                <span className={`ml-auto px-2 py-1 rounded-lg ${
                  filtroEstado === estado.value 
                    ? `bg-${estado.color}-100 text-${estado.color}-800` 
                    : 'bg-gray-100 text-gray-700'
                } text-xs font-medium`}>
                  {count}
                </span>
              ) : (
                <span className="ml-auto text-xs text-gray-400">-</span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>

    {/* Footer del panel */}
    <div className="p-4 rounded-lg  border-black/70  bg-gradient-to-r from-amber-500/70 to-rose-500/70 mt-auto">
      <button
        onClick={fetchPedidos}
        disabled={cargando}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/40 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium"
      >
        {cargando ? (
          <FiRefreshCw className="animate-spin" size={16} />
        ) : (
          <FiRefreshCw size={16} />
        )}
        <span>Actualizar lista</span>
      </button>
    </div>
  </motion.div>

  {/* Overlay para móviles */}
  <AnimatePresence>
    {panelAbierto && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={togglePanel}
        className="fixed inset-0 z-10 bg-black/30 md:hidden"
      />
    )}
  </AnimatePresence>


      {/* Contenido principal */}
      <div className={`transition-all duration-300 ${
        panelAbierto ? 'ml-0 md:ml-64' : 'ml-0'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-700 to-emerald-700 rounded-xl shadow-lg p-6 mb-6 border border-gray-900/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <FiPackage className="text-amber-500" />
                <span>Administración de Pedidos</span>
              </h1>
              <p className="text-white mt-1">
                Gestiona y actualiza el estado de los pedidos
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Filtro móvil */}
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="md:hidden bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="todos">Todos los pedidos</option>
                {estadosPedido.map(estado => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>

              <button
                onClick={togglePanel}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg shadow-lg hover:shadow-black bg-white/90 hover:bg-white text-gray-900"
              >
                {panelAbierto ? <FiChevronLeft /> : <FiMenu />}
              </button>

              <button
                onClick={fetchPedidos}
                disabled={cargando}
                className="flex items-center gap-2 bg-amber-500/90 hover:bg-amber-500 shadow-lg hover:shadow-black text-black px-4 py-2 rounded-lg transition-colors text-sm"
              >
                {cargando ? (
                  <FiRefreshCw className="animate-spin" />
                ) : (
                  <FiRefreshCw />
                )}
                <span>Actualizar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenido */}
        {cargando ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <FiPackage className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700">
              No hay pedidos {filtroEstado !== 'todos' ? `en estado "${getEstadoConfig(filtroEstado).label}"` : ''}
            </h3>
            <p className="text-gray-500 mt-2">
              {filtroEstado === 'todos' ? 'Cuando lleguen nuevos pedidos aparecerán aquí.' : 'Prueba con otro filtro.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {pedidosFiltrados.map((pedido) => {
              const estadoConfig = getEstadoConfig(pedido.estado)
              const EstadoIcon = estadoConfig.icon
              
              return (
                <motion.div
                  key={pedido.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/40  rounded-xl shadow-xl hover:shadow-black/70 border border-gray-200/70 overflow-hidden"
                >
                  {/* Header del pedido */}
                  <div 
                    className={`p-5 cursor-pointer border-b ${
                      pedidoExpandido === pedido.id ? 'border-gray-200' : 'border-transparent'
                    }`}
                    onClick={() => toggleExpandirPedido(pedido.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${estadoConfig.color}-100 text-${estadoConfig.color}-800`}>
                            <EstadoIcon className="mr-1" size={12} />
                            {estadoConfig.label}
                          </span>
                          <span className="text-lg font-bold text-gray-700">
                            {pedido.numeroPedido}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {pedido.cliente.nombre}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(pedido.fecha).toLocaleString()}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-900">
                        {pedidoExpandido === pedido.id ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FiPhone className="text-teal-400" size={14} />
                        <span className="text-sm text-gray-600">{pedido.cliente.telefono}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${calcularTotal(pedido.productos)}
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
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 space-y-7">
                          {/* Detalles del cliente */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-cyan-600 flex items-center gap-2">
                              <FiUser className="text-amber-500" />
                              Información del cliente
                            </h4>
                            <div className="pl-6 space-y-1 text-sm">
                              <p className="text-gray-600">{pedido.cliente.nombre}</p>
                              <p className="text-gray-600">{pedido.cliente.telefono}</p>
                              <p className="text-gray-600">{pedido.cliente.direccion}</p>
                            </div>
                          </div>

                          {/* Productos */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-cyan-600 flex items-center gap-2">
                              <FiPackage className="text-amber-500" />
                              Productos ({pedido.productos.length})
                            </h4>
                            <div className="space-y-2">
                              {pedido.productos.map((producto, index) => (
                                <div key={index} className="flex justify-between items-start pl-6">
                                  <div>
                                    <p className="text-sm font-medium text-white">
                                      {producto.nombre} × {producto.cantidad}
                                    </p>
                                    {producto.salsas.length > 0 && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        Salsas: {producto.salsas.join(', ')}
                                      </p>
                                    )}
                                  </div>
                                  <p className="text-sm font-medium text-black">
                                    ${(producto.precio * producto.cantidad).toFixed(2)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="pt-">
                            <div className="flex flex-wrap gap-2">
                              {estadosPedido
                                .filter(e => e.value !== pedido.estado)
                                .map((estado) => {
                                  const Icon = estado.icon
                                  return (
                                    <button
                                      key={estado.value}
                                      onClick={() => actualizarEstado(pedido.id, estado.value)}
                                      className={`flex items-center shadow-lg hover:shadow-black/70 gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                        estado.color === 'rose' ? 'bg-white/80 text-rose-500 hover:bg-white' :
                                        estado.color === 'cyan' ? 'bg-white/80 text-cyan-600 hover:bg-white' :
                                        estado.color === 'purple' ? 'bg-white/80 text-purple-700 hover:bg-white' :
                                        'bg-white/80 text-teal-700 hover:bg-white'
                                      }`}
                                    >
                                      <Icon size={14} />
                                      <span>{estado.label}</span>
                                    </button>
                                  )
                                })}

                              <button
                                onClick={() => eliminarPedido(pedido.id)}
                                className="flex items-center gap-2 px-3 py-1.5 shadow-lg hover:shadow-black/70 rounded-lg text-xs font-medium bg-white/80 text-rose-500 hover:bg-white"
                              >
                                <FiX size={14} />
                                <span>Eliminar</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <Dialog />
    </div>
  )
}