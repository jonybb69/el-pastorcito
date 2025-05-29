'use client'

import { useState, useEffect } from 'react'
import { FiPackage, FiCheck, FiX, FiMapPin, FiPhone, FiClock, FiUser, FiNavigation } from 'react-icons/fi'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

type PedidoReparto = {
  id: number
  numeroPedido: string
  estado: 'preparando' | 'listo' | 'en camino' | 'entregado' | 'cancelado'
  horaPedido: string
  cliente: {
    nombre: string
    telefono: string
    direccion: string
    coordenadas: [number, number] // [lat, lng]
    instrucciones: string
  }
  productos: {
    id: number
    nombre: string
    cantidad: number
  }[]
  total: number
  metodoPago: 'efectivo' | 'tarjeta'
}

export default function RepartoPage() {
  const [pedidos, setPedidos] = useState<PedidoReparto[]>([])
  const [loading, setLoading] = useState(true)
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoReparto | null>(null)
  const [filtroEstado, setFiltroEstado] = useState<'pendientes' | 'en camino' | 'todos'>('pendientes')
  const [tiempoEstimado, setTiempoEstimado] = useState<number | null>(null)
  const [ubicacionActual, setUbicacionActual] = useState<[number, number] | null>(null)

  // Simular carga de pedidos
  useEffect(() => {
    setLoading(true)
    // Obtener ubicación actual del repartidor
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUbicacionActual([position.coords.latitude, position.coords.longitude])
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error)
      }
    )

    // Simular carga de datos
    setTimeout(() => {
      const datosEjemplo: PedidoReparto[] = [
        {
          id: 1,
          numeroPedido: "#ORD-001",
          estado: "listo",
          horaPedido: "2023-11-15T18:30:00",
          cliente: {
            nombre: "Juan Pérez",
            telefono: "5551234567",
            direccion: "Calle Principal 123, Colonia Centro",
            coordenadas: [19.4326, -99.1332],
            instrucciones: "Tocar timbre 3 veces"
          },
          productos: [
            { id: 1, nombre: "Tacos al Pastor", cantidad: 3 },
            { id: 2, nombre: "Refresco", cantidad: 2 }
          ],
          total: 156.50,
          metodoPago: "efectivo"
        },
        {
          id: 2,
          numeroPedido: "#ORD-002",
          estado: "preparando",
          horaPedido: "2023-11-15T18:45:00",
          cliente: {
            nombre: "María García",
            telefono: "5557654321",
            direccion: "Avenida Revolución 456, Colonia Moderna",
            coordenadas: [19.4285, -99.1276],
            instrucciones: "Dejar con el portero"
          },
          productos: [
            { id: 3, nombre: "Quesadillas", cantidad: 2 },
            { id: 4, nombre: "Agua Fresca", cantidad: 1 }
          ],
          total: 98.75,
          metodoPago: "tarjeta"
        },
        {
          id: 3,
          numeroPedido: "#ORD-003",
          estado: "en camino",
          horaPedido: "2023-11-15T19:00:00",
          cliente: {
            nombre: "Carlos López",
            telefono: "5559876543",
            direccion: "Calle Secundaria 789, Colonia Norte",
            coordenadas: [19.4362, -99.1391],
            instrucciones: "Llamar al llegar"
          },
          productos: [
            { id: 1, nombre: "Tacos al Pastor", cantidad: 5 },
            { id: 5, nombre: "Orden de Queso", cantidad: 1 }
          ],
          total: 210.00,
          metodoPago: "efectivo"
        }
      ]
      setPedidos(datosEjemplo)
      setLoading(false)
    }, 1000)
  }, [])

  // Calcular tiempo estimado de entrega
  useEffect(() => {
    if (pedidoSeleccionado && ubicacionActual) {
      // Simular cálculo de tiempo estimado basado en distancia
      const tiempo = Math.floor(Math.random() * 20) + 10 // Entre 10 y 30 minutos
      setTiempoEstimado(tiempo)
    } else {
      setTiempoEstimado(null)
    }
  }, [pedidoSeleccionado, ubicacionActual])

  const cambiarEstadoPedido = (id: number, nuevoEstado: PedidoReparto['estado']) => {
    setPedidos(pedidos.map(pedido => 
      pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido
    ))
    
    if (nuevoEstado === 'en camino') {
      toast.success(`Pedido ${pedidos.find(p => p.id === id)?.numeroPedido} marcado como en camino`)
    } else if (nuevoEstado === 'entregado') {
      toast.success(`Pedido ${pedidos.find(p => p.id === id)?.numeroPedido} marcado como entregado`)
    }
  }

  const pedidosFiltrados = pedidos.filter(pedido => {
    if (filtroEstado === 'pendientes') {
      return pedido.estado === 'listo' || pedido.estado === 'preparando'
    } else if (filtroEstado === 'en camino') {
      return pedido.estado === 'en camino'
    }
    return true
  })

  const abrirMapa = (coordenadas: [number, number]) => {
    const [lat, lng] = coordenadas
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(url, '_blank')
  }

  const llamarCliente = (telefono: string) => {
    window.open(`tel:${telefono}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FiPackage className="text-amber-500" />
              <span>Panel de Reparto</span>
            </h1>
            <p className="text-gray-600">
              Gestiona los pedidos para entrega a domicilio
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFiltroEstado('pendientes')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filtroEstado === 'pendientes'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFiltroEstado('en camino')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filtroEstado === 'en camino'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              En Camino
            </button>
            <button
              onClick={() => setFiltroEstado('todos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filtroEstado === 'todos'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Todos
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de pedidos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-gray-800">
                  {filtroEstado === 'pendientes' ? 'Pedidos Pendientes' : 
                   filtroEstado === 'en camino' ? 'Pedidos en Camino' : 'Todos los Pedidos'}
                </h2>
              </div>

              {loading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
                </div>
              ) : pedidosFiltrados.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No hay pedidos {filtroEstado === 'pendientes' ? 'pendientes' : 'en camino'}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {pedidosFiltrados.map(pedido => (
                    <motion.div
                      key={pedido.id}
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 cursor-pointer ${
                        pedidoSeleccionado?.id === pedido.id ? 'bg-amber-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setPedidoSeleccionado(pedido)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{pedido.numeroPedido}</h3>
                          <p className="text-sm text-gray-600">{pedido.cliente.nombre}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pedido.estado === 'preparando' ? 'bg-blue-100 text-blue-800' :
                          pedido.estado === 'listo' ? 'bg-yellow-100 text-yellow-800' :
                          pedido.estado === 'en camino' ? 'bg-purple-100 text-purple-800' :
                          pedido.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {pedido.estado === 'preparando' ? 'Preparando' :
                           pedido.estado === 'listo' ? 'Listo' :
                           pedido.estado === 'en camino' ? 'En Camino' :
                           pedido.estado === 'entregado' ? 'Entregado' : 'Cancelado'}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <FiClock size={14} />
                          <span>{new Date(pedido.horaPedido).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="text-sm font-medium">
                          ${pedido.total.toFixed(2)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Detalles del pedido seleccionado */}
          <div className="lg:col-span-2">
            {pedidoSeleccionado ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header del pedido */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800">
                      Detalles del Pedido {pedidoSeleccionado.numeroPedido}
                    </h2>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pedidoSeleccionado.estado === 'preparando' ? 'bg-blue-100 text-blue-800' :
                      pedidoSeleccionado.estado === 'listo' ? 'bg-yellow-100 text-yellow-800' :
                      pedidoSeleccionado.estado === 'en camino' ? 'bg-purple-100 text-purple-800' :
                      pedidoSeleccionado.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {pedidoSeleccionado.estado === 'preparando' ? 'Preparando' :
                       pedidoSeleccionado.estado === 'listo' ? 'Listo' :
                       pedidoSeleccionado.estado === 'en camino' ? 'En Camino' :
                       pedidoSeleccionado.estado === 'entregado' ? 'Entregado' : 'Cancelado'}
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4 md:p-6">
                  {/* Información del cliente */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <FiUser className="text-amber-500" />
                      <span>Información del Cliente</span>
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium">{pedidoSeleccionado.cliente.nombre}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <FiPhone className="text-gray-500" size={16} />
                            <span className="text-gray-700">{pedidoSeleccionado.cliente.telefono}</span>
                            <button 
                              onClick={() => llamarCliente(pedidoSeleccionado.cliente.telefono)}
                              className="text-amber-500 hover:text-amber-600 ml-2"
                            >
                              Llamar
                            </button>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-start gap-2">
                            <FiMapPin className="text-gray-500 mt-0.5" size={16} />
                            <div>
                              <p className="text-gray-700">{pedidoSeleccionado.cliente.direccion}</p>
                              {pedidoSeleccionado.cliente.instrucciones && (
                                <p className="text-sm text-gray-500 mt-1">
                                  <span className="font-medium">Instrucciones:</span> {pedidoSeleccionado.cliente.instrucciones}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => abrirMapa(pedidoSeleccionado.cliente.coordenadas)}
                            className="mt-2 flex items-center gap-1 text-sm text-amber-500 hover:text-amber-600"
                          >
                            <FiNavigation size={14} />
                            <span>Abrir en Maps</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Productos */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <FiPackage className="text-amber-500" />
                      <span>Productos ({pedidoSeleccionado.productos.length})</span>
                    </h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {pedidoSeleccionado.productos.map((producto, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{producto.nombre}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{producto.cantidad}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Método de pago y total */}
                  <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Método de Pago</h4>
                        <p className="font-medium">
                          {pedidoSeleccionado.metodoPago === 'efectivo' ? 'Efectivo' : 'Tarjeta'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Total</h4>
                        <p className="text-xl font-bold text-amber-500">
                          ${pedidoSeleccionado.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tiempo estimado y acciones */}
                  <div className="border-t border-gray-200 pt-4">
                    {tiempoEstimado && (
                      <div className="mb-4 flex items-center gap-2 text-gray-700">
                        <FiClock className="text-amber-500" />
                        <span>Tiempo estimado de entrega: <strong>{tiempoEstimado} minutos</strong></span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {pedidoSeleccionado.estado === 'listo' && (
                        <button
                          onClick={() => cambiarEstadoPedido(pedidoSeleccionado.id, 'en camino')}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
                        >
                          <FiNavigation />
                          <span>Iniciar Reparto</span>
                        </button>
                      )}

                      {pedidoSeleccionado.estado === 'en camino' && (
                        <button
                          onClick={() => cambiarEstadoPedido(pedidoSeleccionado.id, 'entregado')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                        >
                          <FiCheck />
                          <span>Marcar como Entregado</span>
                        </button>
                      )}

                      {(pedidoSeleccionado.estado === 'listo' || pedidoSeleccionado.estado === 'en camino') && (
                        <button
                          onClick={() => cambiarEstadoPedido(pedidoSeleccionado.id, 'cancelado')}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                        >
                          <FiX />
                          <span>Cancelar Pedido</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <FiPackage className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Selecciona un pedido</h3>
                <p className="text-gray-500">
                  Haz clic en un pedido de la lista para ver los detalles y gestionar el reparto
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}