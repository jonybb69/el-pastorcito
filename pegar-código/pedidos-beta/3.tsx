'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useConfirmDialog } from '@/components/useConfirmDialog'
import { 
  FiPackage, FiClock, FiCheckCircle, FiTruck, 
  FiUser, FiPhone, FiChevronLeft, FiChevronUp, 
  FiChevronDown, FiRefreshCw, FiChevronsRight, 
  FiCalendar, FiPlus, FiDownload, FiTrash2, 
  FiMapPin, FiInfo, FiAlertTriangle
} from 'react-icons/fi'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { count } from 'console'

type Producto = {
  id: number
  nombre: string
  salsas: string[]
  cantidad: number
  precio: number
  notas?: string
}

type Cliente = {
  nombre: string
  telefono: string
  direccion: string
  notas?: string
}

type Pedido = {
  id: number
  pedidoId: number
  numeroPedido: string
  fecha: string
  estado: string
  cliente: Cliente
  productos: Producto[]
  prioridad?: 'normal' | 'alta' | 'urgente'
}

// Lista de estados posibles para un pedido con sus propiedades visuales y descripciones
const estadosPedido = [
  { 
    value: 'pendiente', 
    label: 'Pendiente', 
    icon: FiClock, 
    color: 'red',
    description: 'Pedidos recibidos pero no procesados',
    bgColor: 'from-red-100 to-pink-200 hover:from-red-200 hover:to-pink-300',
    iconBg: 'from-red-500 to-pink-500'
  },
  { 
    value: 'en preparación', 
    label: 'En preparación', 
    icon: FiPackage, 
    color: 'blue',
    description: 'Pedidos siendo preparados en cocina',
    bgColor: 'from-blue-100 to-cyan-200 hover:from-blue-200 hover:to-cyan-300',
    iconBg: 'from-blue-500 to-cyan-500'
  },
  { 
    value: 'en camino', 
    label: 'En camino', 
    icon: FiTruck, 
    color: 'purple',
    description: 'Pedidos en ruta de entrega',
    bgColor: 'from-purple-100 to-pink-200 hover:from-purple-200 hover:to-pink-300',
    iconBg: 'from-purple-500 to-pink-500'
  },
  { 
    value: 'finalizado', 
    label: 'Finalizado', 
    icon: FiCheckCircle, 
    color: 'green',
    description: 'Pedidos completados satisfactoriamente',
    bgColor: 'from-green-100 to-emerald-200 hover:from-green-200 hover:to-emerald-300',
    iconBg: 'from-green-500 to-emerald-500'
  }
] as const

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cargando, setCargando] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [pedidoExpandido, setPedidoExpandido] = useState<number | null>(null)
  const [mostrarContenido, setMostrarContenido] = useState(false)
  
  // Recupera el estado del panel (abierto/cerrado) desde localStorage al cargar la página
  const [panelAbierto, setPanelAbierto] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('panelPedidosEstado')
      return saved ? JSON.parse(saved) : true
    }
    return true
  })

  // Hook personalizado para mostrar cuadros de diálogo de confirmación
  const { confirm, Dialog } = useConfirmDialog()

  // Guarda el estado del panel en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem('panelPedidosEstado', JSON.stringify(panelAbierto))
  }, [panelAbierto])

  // Función para cargar los pedidos desde la API
  const fetchPedidos = useCallback(async () => {
    try {
      setCargando(true)


      // Intenta obtener los pedidos desde la API
      const response = await fetch("/api/pedidos")
      const data = await response.json()

      // Datos de demostración que se usan si no hay datos en la API (modo desarrollo)
      const demoData: Pedido[] = [
        {
          id: 1,
          pedidoId: 1,
          numeroPedido: '0001',
          fecha: new Date().toISOString(),
          estado: 'pendiente',
          prioridad: 'alta',
          cliente: {
            nombre: 'Juan Pérez',
            telefono: '555-1234',
            direccion: 'Calle Falsa 123',
            notas: 'Entregar en puerta trasera'
          },
          productos: [
            { 
              id: 1, 
              nombre: 'Pizza Margarita', 
              salsas: ['Tomate', 'Picante'], 
              cantidad: 2, 
              precio: 30,
              notas: 'Sin cebolla'
            },
            { 
              id: 2, 
              nombre: 'Empanada de Carne', 
              salsas: [], 
              cantidad: 3, 
              precio: 10 
            }
          ]
        },
        {
          id: 2,
          pedidoId: 2,
          numeroPedido: '0002',
          fecha: new Date(Date.now() - 3600000).toISOString(),
          estado: 'en preparación',
          cliente: {
            nombre: 'María García',
            telefono: '555-5678',
            direccion: 'Avenida Siempreviva 742'
          },
          productos: [
            { 
              id: 3, 
              nombre: 'Ensalada César', 
              salsas: ['César'], 
              cantidad: 1, 
              precio: 15 
            }
          ]
        }
      ]

      // Si la API devuelve pedidos, usarlos; si no, usar los de demostración
      setPedidos(data.length > 0 ? data : demoData)
      setMostrarContenido(true)

    
    } catch (error) {
      console.log( error, 'error al cargar los pedidos') 
      // En caso de error al cargar los datos, mostrar notificación de error
      toast.error('Error al cargar los pedidos', {
        description: 'Se mostrarán datos de demostración',
        icon: <FiAlertTriangle className="text-yellow-500" />
      })

      // Usar datos de demostración si la API falla
      fetchDemoData()
    } finally {
      setCargando(false)
    }
  }, [])

  // Función auxiliar para cargar los datos de demostración directamente
 
  // Aquí irían más funciones como renderización y lógica de interacción



  const fetchDemoData = () => {
    // Datos de demostración
    const demoData: Pedido[] = [
      {
        id: 1,
        pedidoId: 1,
        numeroPedido: '0001',
        fecha: new Date().toISOString(),
        estado: 'pendiente',
        prioridad: 'alta',
        cliente: {
          nombre: 'Juan Pérez',
          telefono: '555-1234',
          direccion: 'Calle Falsa 123',
          notas: 'Entregar en puerta trasera'
        },
        productos: [
          { 
            id: 1, 
            nombre: 'Pizza Margarita', 
            salsas: ['Tomate', 'Picante'], 
            cantidad: 2, 
            precio: 30,
            notas: 'Sin cebolla'
          }
        ]
      }
    ]
    setPedidos(demoData)
    setMostrarContenido(true)
  }

  useEffect(() => {
    fetchPedidos()
  }, [fetchPedidos])

  const togglePanel = useCallback(() => {
    setPanelAbierto((prev: unknown) => !prev)
  }, [])

  const eliminarPedido = async (id?: number) => {
    if (!id) {
      toast.error('ID de pedido no válido')
      return
    }

    const confirmado = await confirm({
      message: '¿Estás seguro de eliminar este pedido? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
    })

    if (!confirmado) return

    try {
      // Llamada a la API para eliminar
      await fetch(`/api/pedidos/${id}`, { method: 'DELETE' })
      
      toast.success('Pedido eliminado correctamente', {
        action: {
          label: 'Deshacer',
          onClick: () => {
            // Aquí iría la lógica para recuperar el pedido eliminado
            toast.message('La funcionalidad de deshacer no está implementada')
          }
        }
      })
      
      setPedidos(prev => prev.filter(p => p.id !== id))
      
      if (pedidoExpandido === id) {
        setPedidoExpandido(null)
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('No se pudo eliminar el pedido', {
        description: 'Inténtalo de nuevo más tarde'
      })
    }
  }

  const actualizarEstado = async (id: number, nuevoEstado: string) => {
    try { 
      await fetch(`/api/pedidos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      })
      
      toast.success(`Estado actualizado a "${nuevoEstado}"`, {
        position: 'top-center'
      })
      
      setPedidos(prev =>
        prev.map(pedido =>
          pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido
        )
      )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Error al actualizar el estado', {
        description: 'No se pudo cambiar el estado del pedido'
      })
    }
  }

  const toggleExpandirPedido = (id: number) => {
    setPedidoExpandido(prev => prev === id ? null : id)
  }

  const pedidosFiltrados = pedidos.filter(pedido => 
    filtroEstado === 'todos' || pedido.estado === filtroEstado
  )

  const calcularTotal = (productos: Producto[]) => {
    return productos.reduce(
      (total, producto) => total + producto.precio * producto.cantidad,
      0
    ).toFixed(2)
  }

  const getEstadoConfig = (estado: string) => {
    return estadosPedido.find(e => e.value === estado) || 
      { 
        value: estado, 
        label: estado, 
        icon: FiPackage, 
        color: 'gray', 
        description: '',
        bgColor: 'from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300',
        iconBg: 'from-gray-500 to-gray-600'
      }
  }

  const getPrioridadColor = (prioridad?: string) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-amber-500 text-white'
      case 'urgente':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-200 text-gray-800'
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Botón flotante para móviles */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={togglePanel}
        className={`fixed z-50 top-20 left-6 p-3 rounded-full shadow-lg ${
          panelAbierto ? 'bg-white text-gray-800' : 'bg-amber-500 text-white'
        } transition-colors duration-200 md:hidden`}
      >
        {panelAbierto ? <FiChevronLeft size={20} /> : <FiChevronsRight size={20} />}
      </motion.button>

      {/* Panel lateral */}
      <motion.div
        initial={{ x: panelAbierto ? 0 : -320 }}
        animate={{ x: panelAbierto ? 0 : -320 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className={`fixed z-40 left-4 top-4 h-[calc(100vh-2rem)] w-80 bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl border border-gray-200/50 flex flex-col ${
          panelAbierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header del panel */}
        <div className="p-6 bg-gradient-to-r from-amber-600 to-cyan-600 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FiPackage className="text-yellow-300" size={24} />
              <span>Filtrar Pedidos</span>
            </h3>
            <button 
              onClick={togglePanel}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <FiChevronLeft size={18} />
            </button>
          </div>
          <p className="text-amber-100 text-sm mt-2">
            Selecciona el estado de los pedidos a mostrar
          </p>
        </div>

        {/* Contenido del panel */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Botón para todos los pedidos */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFiltroEstado('todos')}
              disabled={cargando}
              className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-3 shadow-md hover:shadow-lg disabled:opacity-50 ${
                filtroEstado === 'todos' ? 'ring-2 ring-amber-500' : ''
              } bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center">
                <FiUser className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-gray-800 block">Todos los Pedidos</span>
                <span className="text-sm text-gray-600">Ver todos los pedidos registrados</span>
              </div>
              <div className="text-right">
                <div className="px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded-full">
                  {pedidos.length}
                </div>
              </div>
            </motion.button>
            
            {/* Botones por estado de pedido */}
            {estadosPedido.map((estado) => {
              const count = pedidos.filter(p => p.estado === estado.value).length
              const Icon = estado.icon
              
              return (
                <motion.button
                  key={estado.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFiltroEstado(estado.value)}
                  disabled={cargando || count === 0}
                  className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-3 shadow-md hover:shadow-lg disabled:opacity-50 ${
                    filtroEstado === estado.value ? 'ring-2 ring-amber-500' : ''
                  } ${estado.bgColor}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${estado.iconBg}`}>
                    <Icon className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800 block">{estado.label}</span>
                    <span className="text-sm text-gray-600">{estado.description}</span>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 text-white text-xs font-medium rounded-full ${
                      estado.color === 'red' ? 'bg-red-500' :
                      estado.color === 'blue' ? 'bg-blue-500' :
                      estado.color === 'purple' ? 'bg-purple-500' :
                      'bg-green-500'
                    }`}>
                      {count}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Footer del panel */}
        <div className="p-6 bg-gray-50 rounded-b-2xl mt-auto">
          <button
            onClick={fetchPedidos}
            disabled={cargando}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-600 hover:to-cyan-600 text-white rounded-xl transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cargando ? (
              <FiRefreshCw className="animate-spin" size={16} />
            ) : (
              <FiRefreshCw size={16} />
            )}
            <span>Actualizar Lista</span>
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
            className="fixed inset-0 z-30 bg-black/20 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Área de contenido principal */}
      <div className={`transition-all duration-300 ${panelAbierto ? 'md:ml-96' : 'md:ml-20'} p-6`}>
        {/* Header principal */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {filtroEstado === 'todos' ? 'Todos los Pedidos' : getEstadoConfig(filtroEstado).label}
              </h1>
              <p className="text-gray-600 mt-1">
                {filtroEstado === 'todos' ? 
                  `Mostrando ${pedidos.length} pedidos en total` : 
                  `Mostrando ${pedidosFiltrados.length} pedidos ${getEstadoConfig(filtroEstado).label.toLowerCase()}`
                }
              </p>
            </div>
            
            {/* Botones de acción */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <FiPlus size={16} />
                <span className="hidden sm:inline">Nuevo Pedido</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
              >
                <FiDownload size={16} />
                <span className="hidden sm:inline">Exportar</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Estado de carga */}
        {cargando && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <div className="flex items-center gap-3 text-gray-600">
              <FiRefreshCw className="animate-spin" size={24} />
              <span className="text-lg">Cargando pedidos...</span>
            </div>
          </motion.div>
        )}

        {/* Lista de pedidos */}
        {!cargando && mostrarContenido && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-6"
          >
            {pedidosFiltrados.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pedidosFiltrados.map((pedido, index) => {
                  const estadoInfo = getEstadoConfig(pedido.estado)
                  const EstadoIcon = estadoInfo.icon
                  const total = calcularTotal(pedido.productos)
                  
                  return (
                    <motion.div
                      key={pedido.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 ${
                        pedido.prioridad === 'urgente' ? 'border-l-4 border-l-red-500' :
                        pedido.prioridad === 'alta' ? 'border-l-4 border-l-amber-500' : ''
                      }`}
                    >
                      <div 
                        className="cursor-pointer"
                        onClick={() => toggleExpandirPedido(pedido.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              estadoInfo.color === 'red' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                              estadoInfo.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                              estadoInfo.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                              'bg-gradient-to-r from-green-500 to-emerald-500'
                            }`}>
                              <EstadoIcon className="text-white" size={20} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{pedido.cliente.nombre}</h3>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-600">#{pedido.numeroPedido}</p>
                                {pedido.prioridad && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${getPrioridadColor(pedido.prioridad)}`}>
                                    {pedido.prioridad.toUpperCase()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            estadoInfo.color === 'red' ? 'bg-red-100 text-red-800' :
                            estadoInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                            estadoInfo.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {estadoInfo.label}
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiPhone size={14} />
                            <span>{pedido.cliente.telefono}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiMapPin size={14} />
                            <span className="truncate max-w-[180px]">{pedido.cliente.direccion}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiCalendar size={14} />
                            <span>{new Date(pedido.fecha).toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="text-sm text-gray-600">
                            Total: <span className="font-semibold text-gray-900">${total}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {pedido.productos.reduce((sum, p) => sum + p.cantidad, 0)} items
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              {pedidoExpandido === pedido.id ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Contenido expandido */}
                      <AnimatePresence>
                        {pedidoExpandido === pedido.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 space-y-4">
                              {/* Notas del cliente */}
                              {pedido.cliente.notas && (
                                <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r">
                                  <div className="flex items-start gap-2">
                                    <FiInfo className="text-amber-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-amber-800">{pedido.cliente.notas}</p>
                                  </div>
                                </div>
                              )}

                              {/* Productos */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Productos ({pedido.productos.length})</h4>
                                <div className="space-y-3">
                                  {pedido.productos.map((producto, idx) => (
                                    <div key={idx} className="flex justify-between items-start">
                                      <div>
                                        <p className="font-medium text-gray-800">
                                          {producto.nombre} × {producto.cantidad}
                                        </p>
                                        {producto.salsas.length > 0 && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            Salsas: {producto.salsas.join(', ')}
                                          </p>
                                        )}
                                        {producto.notas && (
                                          <p className="text-xs text-gray-500 mt-1 italic">
                                            Notas: {producto.notas}
                                          </p>
                                        )}
                                      </div>
                                      <p className="font-medium text-gray-900">
                                        ${(producto.precio * producto.cantidad).toFixed(2)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Resumen total */}
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">Subtotal:</span>
                                  <span className="text-gray-900">${total}</span>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-sm font-medium text-gray-700">Envío:</span>
                                  <span className="text-gray-900">$0.00</span>
                                </div>
                                <div className="border-t border-gray-200 my-2"></div>
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-gray-900">Total:</span>
                                  <span className="font-bold text-gray-900">${total}</span>
                                </div>
                              </div>

                              {/* Acciones */}
                              <div className="pt-4 border-t border-gray-100">
                                <div className="flex flex-wrap gap-2">
                                  {estadosPedido
                                    .filter(e => e.value !== pedido.estado)
                                    .map((estado) => {
                                      const Icon = estado.icon
                                      return (
                                        <motion.button
                                          key={estado.value}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => actualizarEstado(pedido.id, estado.value)}
                                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                            estado.color === 'red' ? 'bg-red-50 text-red-700 hover:bg-red-100' :
                                            estado.color === 'blue' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' :
                                            estado.color === 'purple' ? 'bg-purple-50 text-purple-700 hover:bg-purple-100' :
                                            'bg-green-50 text-green-700 hover:bg-green-100'
                                          }`}
                                        >
                                          <Icon size={14} />
                                          <span>Marcar como {estado.label}</span>
                                        </motion.button>
                                      )
                                  })}

                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => eliminarPedido(pedido.id)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100"
                                  >
                                    <FiTrash2 size={14} />
                                    <span>Eliminar Pedido</span>
                                  </motion.button>
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
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <FiPackage className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay pedidos disponibles
                </h3>
                <p className="text-gray-600 mb-6">
                  {filtroEstado === 'todos' ? 
                    'No hay pedidos registrados en el sistema.' :
                    `No se encontraron pedidos en estado "${getEstadoConfig(filtroEstado).label}".`
                  }
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-600 hover:to-cyan-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <FiPlus size={16} />
                  <span>Registrar Primer Pedido</span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Estado inicial */}
        {!mostrarContenido && !cargando && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-cyan-100 rounded-full flex items-center justify-center">
              <FiPackage className="text-amber-500" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Bienvenido a la Gestión de Pedidos
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mb-8">
              Selecciona un estado de pedidos desde el panel lateral para comenzar a visualizar 
              y gestionar los pedidos de tu restaurante de manera eficiente.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setFiltroEstado('todos')
                fetchPedidos()
              }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-600 hover:to-cyan-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all text-lg"
            >
              <FiPackage size={20} />
              <span>Ver Todos los Pedidos</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      <Dialog />
    </div>
  )
}