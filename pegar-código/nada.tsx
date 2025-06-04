'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useConfirmDialog } from '@/components/useConfirmDialog'
import { 
  FiUsers, FiUser, FiPhone, FiChevronLeft, 
  FiChevronsRight,
  FiClock, FiStar, FiTrendingUp, FiEdit, FiEye, FiPlus, FiTrash2} from 'react-icons/fi'

type ClienteType = {
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
  const [clientes, setClientes] = useState<ClienteType[] | undefined>(undefined);
  useEffect (()=>{
    async function fetchClientes() {
    const res = await fetch('/api/clientes');
    const data = await res.json();
    setClientes(data);
  }
  fetchClientes();
  }, []);
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

  const togglePanel = () => setPanelAbierto(!panelAbierto)

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
      setClientes(prev => (prev ?? []).filter(c => c.id !== id))
      
      if (clienteExpandido === id) setClienteExpandido(null)
    } catch {
      toast.error('No se pudo eliminar el cliente')
    }
  }

  const toggleExpandirCliente = (id: number) => {
    setClienteExpandido(clienteExpandido === id ? null : id)
  }



  const getTipoConfig = (tipo: string) => {
    return tiposCliente.find(t => t.value === tipo) || 
      { value: tipo, label: tipo, icon: FiUser, color: 'gray', description: tipo }
  }

  // Filtrar clientes según el tipo seleccionado
  const clientesFiltrados = filtroTipo === 'todos'
    ? clientes ?? []
    : (clientes ?? []).filter(c => c.tipo === filtroTipo)

  return (
    <div className="relative min-h-screen bg-gray-800">
      {/* Componente de diálogo para confirmar */}
      <Dialog />

      {/* Botón flotante para móviles */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={togglePanel}
        className={`fixed z-30 top-20 left-6 p-3 rounded-full shadow-lg ${
          panelAbierto ? ' bg-white text-gray-800' : 'bg-amber-600 text-white'
        } transition-colors duration-200`}
        aria-label="Toggle panel filtro clientes"
      >
        {panelAbierto ? <FiChevronLeft size={20} /> : <FiChevronsRight size={20} />}
      </motion.button>

      {/* Panel lateral */}
      <motion.aside
        initial={{ x: panelAbierto ? 0 : -320 }}
        animate={{ x: panelAbierto ? 0 : -320 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className={`fixed z-50 rounded-lg left-5 top-5 h-[90vh] w-72 bg-cyan-500/60 shadow-lg border border-white/50 flex flex-col
          ${panelAbierto ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:h-auto md:w-64`}
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
              aria-label="Cerrar panel filtro"
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
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3
                ${filtroTipo === 'todos' 
                  ? 'bg-white/10 text-amber-500 border border-white/30 hover:shadow-xl' 
                  : 'bg-white/30 hover:bg-black/20 text-gray-700 border border-gray-100'
                }`}
            >
              <div className={`w-3 h-3 rounded-full ${filtroTipo === 'todos' ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
              <span className="font-medium">Todos los clientes</span>
              <span className="ml-auto px-2 py-1 rounded-lg bg-gray-100 text-black text-xs font-medium">
                {(clientes?.length ?? 0)}
              </span>
            </motion.button>
            
            {/* Filtros por tipo */}
            {tiposCliente.map((tipo) => {
              const count = clientes?.filter(c => c.tipo === tipo.value).length
              const Icon = tipo.icon
              
              // Asignar clases fijas para cada color para evitar problemas con Tailwind

              // Como Tailwind no procesa clases con variables, usamos clases condicionales simples:
              const buttonClass = filtroTipo === tipo.value 
                ? `w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 bg-${tipo.color}-200 text-${tipo.color}-800 border border-${tipo.color}-300 hover:shadow-xl`
                : 'w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 bg-white/30 text-gray-700 border border-gray-100 hover:bg-black/20'

              return (
                <motion.button
                  key={tipo.value}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFiltroTipo(tipo.value)}
                  className={buttonClass}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    filtroTipo === tipo.value ? `bg-${tipo.color}-500` : 'bg-gray-300'
                  }`}></div>
                  <Icon className={`${filtroTipo === tipo.value ? `text-${tipo.color}-500` : 'text-gray-400'}`} size={18} />
                  <span className="font-medium">{tipo.label}</span>
                  <span className="ml-auto px-2 py-1 rounded-lg bg-gray-100 text-black text-xs font-medium">
                    {count}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </motion.aside>

      {/* Contenido principal - Lista de clientes */}
      <main className="pt-24 px-6 md:pl-[18rem] md:pt-12 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-wide text-amber-600">
            Lista de Clientes
          </h1>
          <button
            onClick={() => toast('Funcionalidad crear cliente pendiente')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg transition-colors"
            aria-label="Agregar nuevo cliente"
          >
            <FiPlus size={20} /> Nuevo Cliente
          </button>
        </div>

        {cargando ? (
          <p className="text-center text-gray-400">Cargando clientes...</p>
        ) : clientesFiltrados.length === 0 ? (
          <p className="text-center text-gray-400">No hay clientes para mostrar.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clientesFiltrados.map(cliente => {
              const tipoConf = getTipoConfig(cliente.tipo)
              const IconoTipo = tipoConf.icon
              const colorTextTipoMap = {
                premium: 'text-amber-600',
                regular: 'text-blue-600',
                nuevo: 'text-green-600',
                potencial: 'text-purple-600'
              }
              const colorTextTipo = colorTextTipoMap[cliente.tipo as keyof typeof colorTextTipoMap] || 'text-gray-600'

              return (
                <motion.li 
                  key={cliente.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleExpandirCliente(cliente.id)}>
                    <h2 className="text-xl font-semibold text-gray-900">{cliente.nombre}</h2>
                    <button
                      className={`text-2xl ${colorTextTipo}`}
                      aria-label={`Tipo de cliente: ${tipoConf.label}`}
                      title={tipoConf.description ?? tipoConf.label}
                    >
                      <IconoTipo />
                    </button>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{ height: clienteExpandido === cliente.id ? 'auto' : 0, opacity: clienteExpandido === cliente.id ? 1 : 0 }}
                    className="overflow-hidden transition-all duration-300"
                  >
                    {clienteExpandido === cliente.id && (
                      <div className="mt-4 space-y-2 text-gray-700">
                        <p><FiPhone className="inline mr-2" /> Teléfono: {cliente.telefono}</p>
                        <p><FiUsers className="inline mr-2" /> Email: {cliente.email}</p>
                        <p>Dirección: {cliente.direccion}</p>
                        <p>Estado: {cliente.estado}</p>
                        <p>Pedidos realizados: {cliente.pedidosRealizados}</p>
                        <p>Total gastado: ${cliente.totalGastado.toLocaleString()}</p>
                        <p>Registrado desde: {cliente.fechaRegistro}</p>

                        <div className="flex gap-3 mt-4">
                          <button
                            className="flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                            onClick={() => toast('Funcionalidad editar pendiente')}
                          >
                            <FiEdit /> Editar
                          </button>

                          <button
                            className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                            onClick={() => eliminarCliente(cliente.id)}
                          >
                            <FiTrash2 /> Eliminar
                          </button>

                          <button
                            className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition"
                            onClick={() => toast('Funcionalidad ver detalles pendiente')}
                          >
                            <FiEye /> Ver Detalles
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.li>
              )
            })}
          </ul>
        )}
      </main>
    </div>
  )
}
