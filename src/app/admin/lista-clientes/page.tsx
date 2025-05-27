'use client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiEdit, 
  FiTrash2, 
  FiUserPlus, 
  FiSave, 
  FiX, 
  FiPhone, 
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiStar,
  FiAward
} from 'react-icons/fi'
import { FaUser, FaRegStar, FaStar } from 'react-icons/fa'
import Swal from 'sweetalert2'

interface Cliente {
  id: string
  nombre: string
  telefono: string
  direccion: string
  destacado?: boolean
  fechaRegistro?: string
}

export default function GestionClientesPremium() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [editando, setEditando] = useState<Cliente | null>(null)
  const [nuevoCliente, setNuevoCliente] = useState<Omit<Cliente, 'id'> & { id?: string }>({ 
    nombre: '', 
    telefono: '', 
    direccion: '' 
  })
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [mostrarClientes, setMostrarClientes] = useState(true)

  // Animaciones
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
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
    }
  }

  const fetchClientes = async () => {
    setCargando(true)
    try {
      // Simular carga con skeleton
      await new Promise(resolve => setTimeout(resolve, 800))
      const res = await fetch('/api/clientes')
      const data = await res.json()
      setClientes(data.map((c: Cliente) => ({
        ...c,
        fechaRegistro: c.fechaRegistro || new Date().toISOString().split('T')[0]
      })))
    } catch {
      toast.error('Error al cargar clientes')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    fetchClientes()
  }, [])

  // Funciones CRUD (mantenidas igual que en tu código original)
  // ... [toggleDestacado, handleEliminar, handleGuardar, handleCrearCliente]

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.telefono.includes(busqueda) ||
    cliente.direccion.toLowerCase().includes(busqueda.toLowerCase())
  )

 // Reemplaza las funciones placeholder con estas implementaciones:

const handleCrearCliente = async () => {
  if (!nuevoCliente.nombre || !nuevoCliente.telefono) {
    toast.error('Nombre y teléfono son requeridos')
    return
  }

  try {
    const res = await fetch('/api/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...nuevoCliente,
        destacado: false,
        fechaRegistro: new Date().toISOString().split('T')[0]
      }),
    })

    if (!res.ok) throw new Error('Error en la respuesta')

    const data = await res.json()
    toast.success('Cliente creado exitosamente')
    
    // Actualizar el estado y resetear el formulario
    setClientes([...clientes, data])
    setNuevoCliente({ nombre: '', telefono: '', direccion: '' })
    setMostrarFormulario(false)
    
  } catch (error) {
    toast.error('Error al crear el cliente')
    console.error('Error:', error)
  }
}

const handleGuardar = async (clienteEditado: Cliente) => {
  try {
    const res = await fetch(`/api/clientes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clienteEditado),
    });

    const data = await res.json();

    if (!res.ok) {
      // Si hay un mensaje de error en la respuesta, usarlo
      throw new Error(data.error || 'Error al actualizar el cliente');
    }

    toast.success('Cliente actualizado exitosamente');
    // Actualizar el estado o recargar los datos
    setClientes(clientes.map(c => c.id === clienteEditado.id ? data : c));
    setEditando(null); // Cerrar el formulario de edición
  } catch (error) {
    console.error('Error al guardar:', error);
    toast.error(error instanceof Error ? error.message : 'Error al actualizar el cliente');
  }
};

const toggleDestacado = async (id: string) => {
  try {
    const response = await fetch(`/api/clientes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
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

  async function handleEliminar(id: string) {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (!confirmacion.isConfirmed) return

    try {
      const res = await fetch(`/api/clientes/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Error en la respuesta')

      toast.success('Cliente eliminado exitosamente')

      // Actualizar el estado
      setClientes(clientes.filter(c => c.id !== id))

    } catch (error) {
      toast.error('Error al eliminar el cliente')
      console.error('Error:', error)
    }
  }

  return (
    <div className="">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-indigo-800 to-cyan-700 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  <FiAward className="text-black" />
                  Gestión de Clientes Premium
                </h1>
                <p className="text-blue-100 mt-1">
                  Administra tu lista de clientes destacados
                </p>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMostrarClientes(!mostrarClientes)}
                  className="flex items-center gap-2 bg-white/40 hover:bg-white/60 text-black px-4 py-2 rounded-lg backdrop-blur-sm transition-all"
                >
                  {mostrarClientes ? <FiChevronUp /> : <FiChevronDown />}
                  {mostrarClientes ? 'Ocultar' : 'Mostrar'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMostrarFormulario(!mostrarFormulario)}
                  className="flex items-center gap-2 bg-black text-cyan-600 hover:bg-black/60 px-4 py-2 rounded-lg transition-all shadow-md"
                >
                  <FiUserPlus />
                  {mostrarFormulario ? 'Cancelar' : 'Nuevo'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Barra de búsqueda */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar clientes por nombre, teléfono o dirección..."
              className="w-full pl-12 pr-4 py-3 text-gray-700 font-medium border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/80 focus:border-transparent shadow-lg transition-all"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <FiSearch className="absolute left-4 top-3.5 text-gray-700" size={20} />
          </div>
        </motion.div>

        {/* Formulario nuevo cliente */}
        <AnimatePresence>
          {mostrarFormulario && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white/70 p-6 rounded-2xl shadow-md border border-gray-100">
                <h2 className="text-xl font-mono mb-4 text-gray-800 flex items-center gap-2">
                  <span className="bg-white/30 text-cyan-600 p-2 rounded-full">
                    <FiUserPlus />
                  </span>
                  Agregar Nuevo Cliente
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Nombre Completo</label>
                    <input
                      className="w-full p-3 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600/80 focus:border-transparent shadow-sm transition-all"
                      value={nuevoCliente.nombre}
                      onChange={e => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Teléfono</label>
                    <input
                      className="w-full p-3 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600/80 focus:border-transparent shadow-sm transition-all"
                      value={nuevoCliente.telefono}
                      onChange={e => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                      placeholder="Ej: 555-1234567"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Dirección</label>
                    <textarea
                      className="w-full p-3 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600/80 focus:border-transparent shadow-sm transition-all"
                      value={nuevoCliente.direccion}
                      onChange={e => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
                      placeholder="Dirección completa con referencia"
                      rows={2}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end pt-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setMostrarFormulario(false)}
                    className="flex items-center gap-2 bg-white hover:bg-gray-300 text-cyan-800 px-5 py-2.5 rounded-lg transition-all"
                  >
                    <FiX size={18} /> Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCrearCliente}
                    className="flex items-center gap-2 bg-cyan-700 hover:bg-cyan-800 text-white px-5 py-2.5 rounded-lg shadow-md transition-all"
                    disabled={!nuevoCliente.nombre || !nuevoCliente.telefono}
                  >
                    <FiSave size={18} /> Guardar Cliente
                  </motion.button>
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
            >
              {cargando ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-black rounded-xl shadow-sm p-6 h-48 animate-pulse"></div>
                  ))}
                </div>
              ) : clientesFiltrados.length === 0 ? (
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="text-center py-12 bg-white/50 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="text-gray-600 mb-4">
                    <FaUser size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    {busqueda ? 'No se encontraron resultados' : 'No hay clientes registrados'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {busqueda ? 'Intenta con otro término de búsqueda' : 'Comienza agregando tu primer cliente'}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => busqueda ? setBusqueda('') : setMostrarFormulario(true)}
                    className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all"
                  >
                    {busqueda ? <FiSearch size={16} /> : <FiUserPlus size={16} />}
                    {busqueda ? 'Limpiar búsqueda' : 'Agregar cliente'}
                  </motion.button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clientesFiltrados.map((cliente, index) => (
                    <motion.div
                      key={cliente.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      transition={{ delay: index * 0.05 }}
                      className={`bg-white/40 rounded-xl shadow-sm overflow-hidden border border-gray-100/30 ${cliente.destacado ? 'ring-2 ring-yellow-400' : ''}`}
                    >
                      {editando?.id === cliente.id ? (
                        <div className="p-6 space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <span className="bg-white/60 text-cyan-700 p-2 rounded-full">
                              <FiEdit />
                            </span>
                            Editando Cliente
                          </h3>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                              <input
                                className="w-full p-3 text-black border border-cyan-600/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent shadow-sm"
                                value={editando.nombre}
                                onChange={e => setEditando({ ...editando, nombre: e.target.value })}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                              <input
                                className="w-full p-3 text-black border border-cyan-600/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent shadow-sm"
                                value={editando.telefono}
                                onChange={e => setEditando({ ...editando, telefono: e.target.value })}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                              <textarea
                                className="w-full p-3 text-black border border-cyan-600/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent shadow-sm"
                                value={editando.direccion}
                                onChange={e => setEditando({ ...editando, direccion: e.target.value })}
                                rows={3}
                              />
                            </div>
                          </div>
                          
                          <div className="flex gap-3 justify-end pt-2">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setEditando(null)}
                              className="flex items-center gap-2 bg-white hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-all"
                            >
                              <FiX size={16} /> Cancelar
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => editando && handleGuardar(editando)}
                              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
                            >
                              <FiSave size={16} /> Guardar
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <button 
                                  onClick={() => toggleDestacado(cliente.id)}
                                  className={`${cliente.destacado ? 'text-yellow-500' : 'text-cyan-700 '} hover:text-yellow-500 transition-colors`}
                                >
                                  {cliente.destacado ? <FaStar size={20} /> : <FaRegStar size={20} />}
                                </button>
                                <span className="text-xs text-gray-600">
                                  {cliente.fechaRegistro}
                                </span>
                              </div>
                              <h3 className="text-xl font-bold text-gray-800">
                                {cliente.nombre}
                              </h3>
                            </div>
                            
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setEditando(cliente)}
                                className="text-teal-600 hover:text-teal-800 transition-colors"
                              >
                                <FiEdit size={18} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEliminar(cliente.id)}
                                className="text-rose-600 hover:text-rose-800 transition-colors"
                              >
                                <FiTrash2 size={18} />
                              </motion.button>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="bg-white p-2 rounded-full text-blue-600">
                                <FiPhone size={16} />
                              </div>
                              <span>{cliente.telefono}</span>
                            </div>
                            
                            <div className="flex items-start gap-3 text-gray-600">
                              <div className="bg-white p-2 rounded-full text-green-600 mt-1">
                                <FiMapPin size={16} />
                              </div>
                              <span>{cliente.direccion}</span>
                            </div>
                          </div>
                          
                          {cliente.destacado && (
                            <div className="mt-4 flex items-center gap-2 text-black bg-yellow-600 px-3 py-1.5 rounded-full w-max">
                              <FiStar size={14} />
                              <span className="text-sm font-medium">Cliente Destacado</span>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}