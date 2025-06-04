'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useConfirmDialog } from '@/components/useConfirmDialog'
import { 
  FiUsers, FiUser, FiPhone, FiChevronLeft, 
  FiRefreshCw, FiChevronsRight, FiMenu,
  FiClock, FiStar, FiTrendingUp, FiEdit, FiEye, FiPlus, FiTrash2,
  FiChevronUp, FiChevronDown
} from 'react-icons/fi'



type Cliente = {
  id: number
  nombre: string
  telefono: string
  email: string
  direccion: string
  tipo: string
  fechaRegistro: string
  pedidosRealizados: number
  totalGastado: number
  estado: string
}

const tiposCliente = [
  { 
    value: 'premium', 
    label: 'Premium', 
    icon: FiStar, 
    color: 'amber',
    description: 'Clientes VIP con beneficios especiales'
  },
  { 
    value: 'regular', 
    label: 'Regular', 
    icon: FiUser, 
    color: 'blue',
    description: 'Clientes habituales'
  },
  { 
    value: 'nuevo', 
    label: 'Nuevo', 
    icon: FiClock, 
    color: 'green',
    description: 'Clientes recién registrados'
  },
  { 
    value: 'potencial', 
    label: 'Potencial', 
    icon: FiTrendingUp, 
    color: 'purple',
    description: 'Clientes con alto potencial'
  }
]

export default function AdminClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [cargando, setCargando] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [clienteExpandido, setClienteExpandido] = useState<number | null>(null)
  const [panelAbierto, setPanelAbierto] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('panelClientesEstado')
      return saved ? JSON.parse(saved) : true
    }
    return true
  })
  const { confirm, Dialog } = useConfirmDialog()

  useEffect(() => {
    localStorage.setItem('panelClientesEstado', JSON.stringify(panelAbierto))
  }, [panelAbierto])

  const fetchClientes = async () => {
    try {
      setCargando(true)
      const res = await fetch('/api/clientes')
      if (!res.ok) throw new Error('Error al cargar clientes')
      const data = await res.json()
      setClientes(data.clientes)
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar los clientes')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    fetchClientes()
  }, [])

  const togglePanel = () => {
    setPanelAbierto(!panelAbierto)
  }

  const eliminarCliente = async (id?: number) => {
    if (!id) {
      toast.error('ID de cliente no válido')
      return
    }

    const confirmado = await confirm({
      message: '¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    })

    if (!confirmado) return

    try {
      const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      
      toast.success('Cliente eliminado correctamente')
      setClientes(prev => prev.filter(c => c.id !== id))
      
      if (clienteExpandido === id) {
        setClienteExpandido(null)
      }
    } catch {
      toast.error('No se pudo eliminar el cliente')
    }
  }

  const toggleExpandirCliente = (id: number) => {
    setClienteExpandido(clienteExpandido === id ? null : id)
  }

  const clientesFiltrados = clientes?.filter(cliente => 
    filtroTipo === 'todos' || cliente.tipo === filtroTipo
  )

  const getTipoConfig = (tipo: string) => {
    return tiposCliente.find(t => t.value === tipo) || 
      { value: tipo, label: tipo, icon: FiUser, color: 'gray' }
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
        {panelAbierto ? <FiChevronLeft size={20} /> : <FiChevronsRight size={20} />}
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
              <FiUsers className="text-amber-600" size={22} />
              <span>Filtrar Clientes</span>
            </h3>
            <button 
              onClick={togglePanel}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-teal-800 border border-gray-800 text-black hover:text-black hover:bg-teal-700 transition-colors"
            >
              <FiChevronLeft size={18} />
            </button>
          </div>
          <p className="text-sm text-teal-500 mt-1">
            {clientes?.length} clientes en total
          </p>
        </div>

        {/* Contenido del panel */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-6">
            {/* Filtro Todos */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFiltroTipo('todos')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                filtroTipo === 'todos' 
                  ? 'bg-white/10 text-amber-500 border-1 border-white/30 hover:shadow-xl' 
                  : 'bg-white/30 hover:bg-black/20 text-gray-700 border border-gray-100'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${
                filtroTipo === 'todos' ? 'bg-amber-500' : 'bg-gray-300'
              }`}></div>
              <span className="font-medium">Todos los clientes</span>
              <span className="ml-auto px-2 py-1 text-hover- rounded-lg bg-gray-100 text-black text-xs font-medium">
                {clientes?.length}
              </span>
            </motion.button>
            
            {/* Filtros por tipo */}
            {tiposCliente.map((tipo) => {
              const count = clientes?.filter(c => c.tipo === tipo.value).length
              const Icon = tipo.icon
              
              return (
                <motion.button
                  key={tipo.value}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFiltroTipo(tipo.value)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                    filtroTipo === tipo.value 
                      ? `bg-${tipo.color}-50 text-${tipo.color}-800 border-2 border-${tipo.color}-100 shadow-sm` 
                      : 'bg-white/40 hover:bg-gray-500 text-gray-700 border border-gray-100'
                  }`}
                >
                  <Icon 
                    className={`text-${tipo.color}-500`} 
                    size={18} 
                  />
                  <span className="font-medium">{tipo.label}</span>
                  {count > 0 ? (
                    <span className={`ml-auto px-2 py-1 rounded-lg ${
                      filtroTipo === tipo.value 
                        ? `bg-${tipo.color}-100 text-${tipo.color}-800` 
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
        <div className="p-4 rounded-lg border-black/70 bg-gradient-to-r from-amber-500/70 to-rose-500/70 mt-auto">
          <button
            onClick={fetchClientes}
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
                <FiUsers className="text-amber-500" />
                <span>Administración de Clientes</span>
              </h1>
              <p className="text-white mt-1">
                Gestiona y administra tu base de clientes
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Filtro móvil */}
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="md:hidden bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="todos">Todos los clientes</option>
                {tiposCliente.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>

              <button
                onClick={togglePanel}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg shadow-lg hover:shadow-black bg-white/90 hover:bg-white text-gray-900"
              >
                {panelAbierto ? <FiChevronLeft /> : <FiMenu />}
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-amber-500/90 hover:bg-amber-500 shadow-lg hover:shadow-black text-black px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <FiPlus size={16} />
                <span>Nuevo Cliente</span>
              </motion.button>

              <button
                onClick={fetchClientes}
                disabled={cargando}
                className="flex items-center gap-2 bg-white/90 hover:bg-white shadow-lg hover:shadow-black text-gray-900 px-4 py-2 rounded-lg transition-colors text-sm"
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
        ) : clientesFiltrados?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <FiUsers className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700">
              No hay clientes {filtroTipo !== 'todos' ? `del tipo "${getTipoConfig(filtroTipo).label}"` : ''}
            </h3>
            <p className="text-gray-500 mt-2">
              {filtroTipo === 'todos' ? 'Cuando se registren nuevos clientes aparecerán aquí.' : 'Prueba con otro filtro.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {clientesFiltrados?.map((cliente) => {
              const tipoConfig = getTipoConfig(cliente.tipo)
              const TipoIcon = tipoConfig.icon
              
              return (
                <motion.div
                  key={cliente.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/40 rounded-xl shadow-xl hover:shadow-black/70 border border-gray-200/70 overflow-hidden"
                >
                  {/* Header del cliente */}
                  <div 
                    className={`p-5 cursor-pointer border-b ${
                      clienteExpandido === cliente.id ? 'border-gray-200' : 'border-transparent'
                    }`}
                    onClick={() => toggleExpandirCliente(cliente.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${tipoConfig.color}-100 text-${tipoConfig.color}-800`}>
                            <TipoIcon className="mr-1" size={12} />
                            {tipoConfig.label}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {cliente.nombre}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Registrado el {new Date(cliente.fechaRegistro).toLocaleDateString()}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-900">
                        {clienteExpandido === cliente.id ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FiPhone className="text-teal-400" size={14} />
                        <span className="text-sm text-gray-600">{cliente.telefono}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {cliente.pedidosRealizados} pedidos
                      </div>
                    </div>
                  </div>

                  {/* Contenido expandible */}
                  <AnimatePresence>
                    {clienteExpandido === cliente.id && (
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
                              <p className="text-gray-600">{cliente.nombre}</p>
                              <p className="text-gray-600">{cliente.telefono}</p>
                              <p className="text-gray-600">{cliente.email}</p>
                              <p className="text-gray-600">{cliente.direccion}</p>
                            </div>
                          </div>

                          {/* Estadísticas */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-cyan-600 flex items-center gap-2">
                              <FiTrendingUp className="text-amber-500" />
                              Estadísticas
                            </h4>
                            <div className="pl-6 space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Pedidos realizados:</span>
                                <span className="text-sm font-medium text-gray-800">{cliente.pedidosRealizados}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Total gastado:</span>
                                <span className="text-sm font-medium text-gray-800">${cliente.totalGastado.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Fecha registro:</span>
                                <span className="text-sm font-medium text-gray-800">
                                  {new Date(cliente.fechaRegistro).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="pt-2">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => {/* Implementar edición */}}
                                className="flex items-center gap-2 px-3 py-1.5 shadow-lg hover:shadow-black/70 rounded-lg text-xs font-medium bg-white/80 text-blue-600 hover:bg-white"
                              >
                                <FiEdit size={14} />
                                <span>Editar</span>
                              </button>

                              <button
                                onClick={() => {/* Implementar ver detalles */}}
                                className="flex items-center gap-2 px-3 py-1.5 shadow-lg hover:shadow-black/70 rounded-lg text-xs font-medium bg-white/80 text-green-600 hover:bg-white"
                              >
                                <FiEye size={14} />
                                <span>Ver detalles</span>
                              </button>

                              <button
                                onClick={() => eliminarCliente(cliente.id)}
                                className="flex items-center gap-2 px-3 py-1.5 shadow-lg hover:shadow-black/70 rounded-lg text-xs font-medium bg-white/80 text-rose-500 hover:bg-white"
                              >
                                <FiTrash2 size={14} />
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