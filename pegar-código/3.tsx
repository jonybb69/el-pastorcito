'use client'
import { useEffect, useState, useRef } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { 
  FiEdit, FiTrash2, FiUserPlus, FiSave, FiX, 
  FiPhone, FiMapPin, FiChevronDown, FiChevronUp, 
  FiSearch, FiStar, FiAward, FiFilter, FiCalendar,
  FiMenu, FiUsers, 
  FiShoppingBag, FiPackage, FiDollarSign, FiCreditCard
} from 'react-icons/fi'
import { FaUser, FaRegStar, FaStar, FaCrown } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { format, parseISO } from 'date-fns'
import es from 'date-fns/locale/es'

interface Cliente {
  id: string
  nombre: string
  telefono: string
  direccion: string
  email?: string
  destacado?: boolean
  fechaRegistro?: string
  categoria?: 'regular' | 'premium' | 'vip'
  pedidos?: Pedido[]
}

interface Pedido {
  id: string
  fecha: string
  total: number
  estado: 'pendiente' | 'completado' | 'cancelado'
  productos: Producto[]
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia'
}

interface Producto {
  id: string
  nombre: string
  precio: number
  cantidad: number
}

type SortField = 'nombre' | 'fechaRegistro' | 'destacado' | 'categoria'
type SortDirection = 'asc' | 'desc'

export default function GestionClientesPremium() {
  // Estados principales
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [editando, setEditando] = useState<Cliente | null>(null)
  const [nuevoCliente, setNuevoCliente] = useState<Omit<Cliente, 'id'> & { id?: string }>({ 
    nombre: '', 
    telefono: '', 
    direccion: '',
    email: '',
    categoria: 'regular'
  })
  
  // Estados UI
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [mostrarClientes, setMostrarClientes] = useState(true)
  const [soloDestacados, setSoloDestacados] = useState(false)
  const [sortField, setSortField] = useState<SortField>('fechaRegistro')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [telefonoError, setTelefonoError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [sidebarAbierto, setSidebarAbierto] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [expandedPedidos, setExpandedPedidos] = useState<string | null>(null)
  const pedidosRef = useRef<HTMLDivElement>(null)
  
  // Referencias y scroll
  const mainRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const [scrollPosition, setScrollPosition] = useState(0)

  // Configuración de animaciones
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    },
    exit: { opacity: 0, scale: 0.95 }
  }

  const sidebarVariants = {
    open: { 
      x: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: { 
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.1
      }
    }
  }

  const pedidosVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
  }

  // Efecto para cerrar sidebar y pedidos al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarAbierto(false)
      }
      
      if (pedidosRef.current && !pedidosRef.current.contains(event.target as Node)) {
        setExpandedPedidos(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Track scroll position
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrollPosition(latest)
  })

  // Obtener clientes desde la API
  const fetchClientes = async () => {
    setCargando(true)
    try {
      const res = await fetch('/api/clientes')
      if (!res.ok) throw new Error('Error al cargar clientes')
      
      const data = await res.json()
      setClientes(data.map((c: Cliente) => ({
        ...c,
        fechaRegistro: c.fechaRegistro || new Date().toISOString().split('T')[0],
        categoria: c.categoria || 'regular',
        pedidos: c.pedidos || []
      })))
    } catch (error) {
      toast.error('Error al cargar clientes')
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    fetchClientes()
  }, [])

  // Validaciones
  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9\s+-]{7,15}$/
    if (!phoneRegex.test(phone)) {
      setTelefonoError('Formato de teléfono inválido')
      return false
    }
    setTelefonoError(null)
    return true
  }

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError(null)
      return true
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Email inválido')
      return false
    }
    setEmailError(null)
    return true
  }

  // Funciones CRUD
  const handleCrearCliente = async () => {
    if (!nuevoCliente.nombre || !nuevoCliente.telefono) {
      toast.error('Nombre y teléfono son requeridos')
      return
    }

    if (!validatePhone(nuevoCliente.telefono)) return
    if (!validateEmail(nuevoCliente.email || '')) return

    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...nuevoCliente,
          destacado: false,
          fechaRegistro: new Date().toISOString().split('T')[0],
          pedidos: []
        }),
      })

      if (!res.ok) throw new Error('Error en la respuesta')

      const data = await res.json()
      toast.success('Cliente creado exitosamente')
      
      setClientes([...clientes, data])
      setNuevoCliente({ nombre: '', telefono: '', direccion: '', email: '', categoria: 'regular' })
      setMostrarFormulario(false)
      
    } catch (error) {
      toast.error('Error al crear el cliente')
      console.error('Error:', error)
    }
  }

  const handleGuardar = async (clienteEditado: Cliente) => {
    if (!validatePhone(clienteEditado.telefono)) return
    if (!validateEmail(clienteEditado.email || '')) return

    try {
      const res = await fetch(`/api/clientes/${clienteEditado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteEditado),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar el cliente')
      }

      toast.success('Cliente actualizado exitosamente')
      setClientes(clientes.map(c => c.id === clienteEditado.id ? data : c))
      setEditando(null)
    } catch (error) {
      console.error('Error al guardar:', error)
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el cliente')
    }
  }

  const toggleDestacado = async (id: string) => {
    try {
      const response = await fetch(`/api/clientes/${id}/destacado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error en la respuesta')
      }

      const updated = await response.json()
      
      setClientes(clientes.map(c => 
        c.id === id ? { ...c, destacado: updated.destacado } : c
      ))
      
      toast.success(updated.destacado ? '★ Cliente destacado' : 'Cliente normal')
      
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Error desconocido')
    }
  }

  const handleEliminar = async (id: string) => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      backdrop: `rgba(0,0,0,0.7)`,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })

    if (!confirmacion.isConfirmed) return

    try {
      const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' })

      if (!res.ok) throw new Error('Error en la respuesta')

      toast.success('Cliente eliminado exitosamente')
      setClientes(clientes.filter(c => c.id !== id))

    } catch (error) {
      toast.error('Error al eliminar el cliente')
      console.error('Error:', error)
    }
  }

  // Toggle pedidos
  const togglePedidos = (clienteId: string) => {
    setExpandedPedidos(expandedPedidos === clienteId ? null : clienteId)
  }

  // Filtrado y ordenación
  const clientesFiltrados = clientes.filter(cliente => {
    const matchesSearch = 
      cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.telefono.includes(busqueda) ||
      cliente.direccion.toLowerCase().includes(busqueda.toLowerCase()) ||
      (cliente.email && cliente.email.toLowerCase().includes(busqueda.toLowerCase()))
    
    const matchesFilter = soloDestacados ? cliente.destacado : true
    
    return matchesSearch && matchesFilter
  }).sort((a, b) => {
    let comparison = 0
    
    if (sortField === 'nombre') {
      comparison = a.nombre.localeCompare(b.nombre)
    } else if (sortField === 'fechaRegistro') {
      comparison = new Date(a.fechaRegistro || 0).getTime() - new Date(b.fechaRegistro || 0).getTime()
    } else if (sortField === 'destacado') {
      comparison = (a.destacado === b.destacado) ? 0 : a.destacado ? -1 : 1
    } else if (sortField === 'categoria') {
      const categoryOrder = { 'vip': 3, 'premium': 2, 'regular': 1 }
      comparison = categoryOrder[a.categoria || 'regular'] - categoryOrder[b.categoria || 'regular']
    }
    
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPP', { locale: es })
    } catch {
      return dateString
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vip': return 'bg-purple-100 text-purple-800'
      case 'premium': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completado': return 'bg-green-100 text-green-800'
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'cancelado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'tarjeta': return <FiCreditCard className="text-blue-500" />
      case 'transferencia': return <FiDollarSign className="text-green-500" />
      default: return <FiDollarSign className="text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen rounded-xl bg-gradient-to-br from-lime-900/40 to-black/50 py-8 px-4 sm:px-6 relative">
      {/* Backdrop para sidebar */}
      <AnimatePresence>
        {sidebarAbierto && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 backdrop-blur-sm"
            onClick={() => setSidebarAbierto(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar desplegable */}
      <motion.div
        ref={sidebarRef}
        initial="closed"
        animate={sidebarAbierto ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-40 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FiUsers className="text-teal-600" />
              Lista de Clientes
            </h2>
            <button 
              onClick={() => setSidebarAbierto(false)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {clientesFiltrados.map(cliente => (
              <motion.div
                key={cliente.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg border ${selectedClientId === cliente.id ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'} hover:bg-gray-50 cursor-pointer transition-colors`}
                onClick={() => {
                  setSelectedClientId(cliente.id)
                  setSidebarAbierto(false)
                  setTimeout(() => {
                    document.getElementById(`cliente-${cliente.id}`)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center'
                    })
                  }, 300)
                }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">{cliente.nombre}</h3>
                  {cliente.destacado && (
                    <FiStar className="text-yellow-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{cliente.telefono}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(cliente.categoria || 'regular')}`}>
                    {cliente.categoria?.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(cliente.fechaRegistro || '')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Botón flotante para sidebar */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          y: scrollPosition > 100 ? 20 : 50
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={() => setSidebarAbierto(true)}
        className="fixed right-4 z-20 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
        style={{ top: '50%' }}
      >
        <FiMenu size={20} />
      </motion.button>

      {/* Botón flotante para agregar cliente */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          y: scrollPosition > 100 ? 100 : 130
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
        onClick={() => setMostrarFormulario(true)}
        className="fixed right-4 z-20 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
        style={{ top: '50%' }}
      >
        <FiUserPlus size={20} />
      </motion.button>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto" ref={mainRef}>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-teal-800 to-fuchsia-800/60 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FaCrown className="text-yellow-400 text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                    Gestión de Clientes Premium
                  </h1>
                  <p className="text-indigo-900 mt-1">
                    Administra tu lista de clientes VIP y destacados
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMostrarClientes(!mostrarClientes)}
                  className="flex items-center gap-2 bg-indigo-700/30 hover:bg-white/30 text-white/90 px-4 py-2 rounded-lg backdrop-blur-sm transition-all border border-white/10"
                >
                  {mostrarClientes ? <FiChevronUp /> : <FiChevronDown />}
                  {mostrarClientes ? 'Ocultar' : 'Mostrar'} Clientes
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMostrarFormulario(!mostrarFormulario)}
                  className="flex items-center gap-2 bg-white/30 text-indigo-700 hover:bg-white/90 px-4 py-2 rounded-lg transition-all shadow-md font-medium"
                >
                  <FiUserPlus />
                  {mostrarFormulario ? 'Cancelar' : 'Nuevo Cliente'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Barra de búsqueda y filtros */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 bg-white/30 rounded-xl shadow-sm p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <input
                type="text"
                placeholder="Buscar clientes por nombre, teléfono, email o dirección..."
                className="w-full pl-12 pr-4 py-3 text-gray-700 font-medium border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:border-transparent shadow-sm transition-all"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <FiSearch className="absolute left-4 top-3.5 text-gray-600" size={20} />
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSoloDestacados(!soloDestacados)}
                className={`flex items-center gap-2 px-4 py-3 shadow-lg hover:shadow-black rounded-xl transition-all ${soloDestacados ? 'bg-yellow-100 text-yellow-800' : 'bg-teal-700/80 text-gray-800'}`}
              >
                <FiStar className={soloDestacados ? 'fill-yellow-500 text-yellow-500' : ''} />
                {soloDestacados ? 'Destacados' : 'Todos'}
              </motion.button>
              
              <div className="relative">
                <select
                  className="appearance-none shadow-xl hover:shadow-black bg-cyan-700/80 text-gray-800 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-800 cursor-pointer"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as SortField)}
                >
                  <option value="nombre">Nombre</option>
                  <option value="fechaRegistro">Fecha</option>
                  <option value="destacado">Destacados</option>
                  <option value="categoria">Categoría</option>
                </select>
                <FiChevronDown className="absolute right-3 top-3.5 text-gray-900 pointer-events-none" />
              </div>
              
              <button
                onClick={() => toggleSort(sortField)}
                className="p-3 bg-red-800/80 hover:bg-rose-700/80 shadow-lg hover:shadow-black rounded-xl transition-colors"
                aria-label="Toggle sort direction"
              >
                {sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Estadísticas rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white/40 p-4 rounded-xl shadow-sm border border-gray-100/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Clientes totales</p>
                <p className="text-2xl font-bold text-gray-800">{clientes.length}</p>
              </div>
              <div className="p-3 bg-indigo-100 text-indigo-700 rounded-lg">
                <FiUsers size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white/30 p-4 rounded-xl shadow-sm border border-gray-100/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Destacados</p>
                <p className="text-2xl font-bold text-gray-800">{clientes.filter(c => c.destacado).length}</p>
              </div>
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                <FaStar size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white/30 p-4 rounded-xl shadow-sm border border-gray-100/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">VIP</p>
                <p className="text-2xl font-bold text-gray-800">{clientes.filter(c => c.categoria === 'vip').length}</p>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <FaCrown size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white/30 p-4 rounded-xl shadow-sm border border-gray-100/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Mostrando</p>
                <p className="text-2xl font-bold text-gray-800">{clientesFiltrados.length}</p>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <FiFilter size={20} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Formulario nuevo cliente */}
        <AnimatePresence>
          {mostrarFormulario && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">
                      <FiUserPlus />
                    </span>
                    Agregar Nuevo Cliente
                  </h2>
                  <button
                    onClick={() => setMostrarFormulario(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Nombre Completo*</label>
                    <input
                      className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      value={nuevoCliente.nombre}
                      onChange={e => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Teléfono*</label>
                    <input
                      className={`w-full p-3 text-gray-800 border ${telefonoError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                      value={nuevoCliente.telefono}
                      onChange={e => {
                        setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })
                        validatePhone(e.target.value)
                      }}
                      placeholder="Ej: 555-1234567"
                    />
                    {telefonoError && (
                      <p className="text-red-500 text-xs mt-1">{telefonoError}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      className={`w-full p-3 text-gray-800 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                      value={nuevoCliente.email}
                      onChange={e => {
                        setNuevoCliente({ ...nuevoCliente, email: e.target.value })
                        validateEmail(e.target.value)
                      }}
                      placeholder="Ej: cliente@ejemplo.com"
                      type="email"
                    />
                    {emailError && (
                      <p className="text-red-500 text-xs mt-1">{emailError}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                    <input
                      className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      value={nuevoCliente.direccion}
                      onChange={e => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
                      placeholder="Ej: Calle 123, Ciudad"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Categoría</label>
                    <select
                      className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      value={nuevoCliente.categoria}
                      onChange={e => setNuevoCliente({ 
                        ...nuevoCliente, 
                        categoria: e.target.value as 'regular' | 'premium' | 'vip' 
                      })}
                    >
                      <option value="regular">Regular</option>
                      <option value="premium">Premium</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCrearCliente}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-md"
                    >
                      <FiSave className="inline mr-2" />
                      Guardar Cliente
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de clientes */}
        <AnimatePresence>
          {mostrarClientes && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {cargando ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : clientesFiltrados.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-8 rounded-xl shadow-sm text-center"
                >
                  <FiUsers className="mx-auto text-gray-400 text-4xl mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No se encontraron clientes</h3>
                  <p className="text-gray-500 mb-4">Prueba ajustando tus filtros de búsqueda</p>
                  <button
                    onClick={() => {
                      setBusqueda('')
                      setSoloDestacados(false)
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Limpiar filtros
                  </button>
                </motion.div>
              ) : (
                clientesFiltrados.map(cliente => (
                  <motion.div
                    key={cliente.id}
                    id={`cliente-${cliente.id}`}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover="hover"
                    className={`bg-black/40 rounded-xl shadow-lg hover:shadow-white/40 ${selectedClientId === cliente.id ? 'border-black ring-2 ring-pink-700' : 'border-white/40'}`}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${getCategoryColor(cliente.categoria || 'regular')}`}>
                            {cliente.categoria === 'vip' ? (
                              <FaCrown className="text-xl" />
                            ) : cliente.categoria === 'premium' ? (
                              <FiAward className="text-xl" />
                            ) : (
                              <FaUser className="text-xl" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-gray-800">{cliente.nombre}</h3>
                              {cliente.destacado && (
                                <FiStar className="text-yellow-500 fill-yellow-500" />
                              )}
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                              <div className="flex items-center text-sm text-gray-500">
                                <FiPhone className="mr-2 text-indigo-600" />
                                {cliente.telefono}
                              </div>
                              {cliente.email && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <FiMapPin className="mr-2 text-indigo-600" />
                                  {cliente.email}
                                </div>
                              )}
                              <div className="flex items-center text-sm text-gray-500">
                                <FiCalendar className="mr-2 text-indigo-600" />
                                {formatDate(cliente.fechaRegistro || '')}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleDestacado(cliente.id)}
                            className={`p-2 rounded-full ${cliente.destacado ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'} hover:bg-opacity-80 transition-colors`}
                            aria-label={cliente.destacado ? 'Quitar destacado' : 'Destacar cliente'}
                          >
                            {cliente.destacado ? <FaStar /> : <FaRegStar />}
                          </button>
                          
                          <button
                            onClick={() => setEditando(cliente)}
                            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                            aria-label="Editar cliente"
                          >
                            <FiEdit />
                          </button>
                          
                          <button
                            onClick={() => handleEliminar(cliente.id)}
                            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                            aria-label="Eliminar cliente"
                          >
                            <FiTrash2 />
                          </button>
                          
                          {cliente.pedidos && cliente.pedidos.length > 0 && (
                            <button
                              onClick={() => togglePedidos(cliente.id)}
                              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                              aria-label="Ver pedidos"
                            >
                              <FiShoppingBag />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Sección de pedidos */}
                    <AnimatePresence>
                      {expandedPedidos === cliente.id && (
                        <motion.div
                          ref={pedidosRef}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          variants={pedidosVariants}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-gray-200 px-5 py-4 bg-gray-50">
                            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                              <FiPackage className="text-indigo-500" />
                              Historial de Pedidos ({cliente.pedidos?.length || 0})
                            </h4>
                            
                            <div className="space-y-3">
                              {cliente.pedidos?.map(pedido => (
                                <div key={pedido.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                  <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(pedido.estado)}`}>
                                        {pedido.estado.toUpperCase()}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {formatDate(pedido.fecha)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-gray-800">
                                        {formatCurrency(pedido.total)}
                                      </span>
                                      {getPaymentIcon(pedido.metodoPago)}
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2">
                                    {pedido.productos.map(producto => (
                                      <div key={producto.id} className="flex justify-between py-1 border-b border-gray-100 last:border-0">
                                        <span className="text-sm text-gray-700">
                                          {producto.nombre} x {producto.cantidad}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                          {formatCurrency(producto.precio * producto.cantidad)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Formulario de edición */}
                    {editando?.id === cliente.id && (
                      <div className="border-t border-gray-200 px-5 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded-lg"
                              value={editando.nombre}
                              onChange={e => setEditando({ ...editando, nombre: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input
                              type="text"
                              className={`w-full p-2 border ${telefonoError ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                              value={editando.telefono}
                              onChange={e => {
                                setEditando({ ...editando, telefono: e.target.value })
                                validatePhone(e.target.value)
                              }}
                            />
                            {telefonoError && (
                              <p className="text-red-500 text-xs mt-1">{telefonoError}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                              type="email"
                              className={`w-full p-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                              value={editando.email || ''}
                              onChange={e => {
                                setEditando({ ...editando, email: e.target.value })
                                validateEmail(e.target.value)
                              }}
                            />
                            {emailError && (
                              <p className="text-red-500 text-xs mt-1">{emailError}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded-lg"
                              value={editando.direccion}
                              onChange={e => setEditando({ ...editando, direccion: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                            <select
                              className="w-full p-2 border border-gray-300 rounded-lg"
                              value={editando.categoria}
                              onChange={e => setEditando({ 
                                ...editando, 
                                categoria: e.target.value as 'regular' | 'premium' | 'vip' 
                              })}
                            >
                              <option value="regular">Regular</option>
                              <option value="premium">Premium</option>
                              <option value="vip">VIP</option>
                            </select>
                          </div>
                          <div className="flex items-end gap-2">
                            <button
                              onClick={() => handleGuardar(editando)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                            >
                              <FiSave className="inline mr-2" />
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditando(null)}
                              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                            >
                              <FiX className="inline mr-2" />
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}