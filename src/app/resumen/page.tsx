'use client'

import { usePedidoStore } from '@/store/usePedidoStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function ResumenPage() {
  const {
    cliente,
    productos,
    metodoPago,
    clearPedido,
    setMetodoPago,
    getTotal,
  } = usePedidoStore()

  const router = useRouter()
  const [enviando, setEnviando] = useState(false)
  const total = getTotal()

  const enviarPedido = async () => {
    if (!cliente) {
      toast.warning('Falta información del cliente')
      return
    }

    if (productos.length === 0) {
      toast.warning('No hay productos en el pedido')
      return
    }

    if (!metodoPago) {
      toast.warning('Selecciona un método de pago')
      return
    }

    setEnviando(true)

    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: cliente.id,
          metodoPago,
          productos: productos.map((item) => ({
            productoId: item.producto.id,
            cantidad: item.cantidad,
            precio: item.producto.precio,
            salsas: item.salsas,
          })),
        }),
      })
      const data = await res.json();
      console.log('Respuesta del servidor:', data); // 👈🏼 Esto mostrará el mensaje real del error


      if (!res.ok) throw new Error(data.error || 'Error al enviar pedido');

      clearPedido()
      toast.success('Pedido enviado correctamente')

      setTimeout(() => {
        router.push('/confirmacion-final')
      }, 1000)
    } catch (error) {
      console.error(error)
      toast.error('No se pudo enviar el pedido')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="max-w-2xl mx-auto mt-10 p-6 bg-gray-600 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Resumen del Pedido</h1>

      {/* CLIENTE */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Cliente:</h2>
        {cliente ? (
          <ul className="pl-4 mt-2 text-gray-700 space-y-1">
            <li><strong>Nombre:</strong> {cliente.nombre}</li>
            <li><strong>Teléfono:</strong> {cliente.telefono}</li>
            <li><strong>Dirección:</strong> {cliente.direccion}</li>
          </ul>
        ) : (
          <p className="text-red-500">Sin datos del cliente</p>
        )}
      </div>

      {/* PRODUCTOS */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Productos seleccionados:</h2>
        {productos.length > 0 ? (
          <ul className="space-y-4 mt-2">
            {productos.map((item, index) => (
              <li key={index} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                <p><strong>{item.producto.nombre}</strong> x {item.cantidad}</p>
                <p className="text-sm text-gray-600">Salsas: {item.salsas.length > 0 ? item.salsas.join(', ') : 'Ninguna'}</p>
                <p className="text-sm text-gray-700 font-medium">
                  Total: ${(item.producto.precio * item.cantidad).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-red-500 mt-2">No hay productos en el pedido</p>
        )}
      </div>

      {/* MÉTODO DE PAGO */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Método de pago:</h2>
        <select
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          className="w-full p-2 border rounded-lg text-gray-800"
        >
          <option value="">-- Selecciona una opción --</option>
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
        </select>
      </div>

      {/* TOTAL Y BOTÓN */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-xl font-bold text-gray-900">Total: ${total.toFixed(2)}</p>
        <button
          onClick={enviarPedido}
          disabled={enviando}
          className={`px-5 py-2 rounded-xl font-semibold text-white transition-all ${
            enviando
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {enviando ? 'Enviando...' : 'Enviar Pedido'}
        </button>
      </div>
    </section>
  )
}
