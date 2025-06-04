'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import Image from 'next/image'
import { 
  FiPrinter, FiDownload, FiSun, FiMoon, 
  FiArrowLeft, FiCheckCircle, FiClock, 
  FiMapPin, FiUser, FiPhone 
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { usePedidoStore } from '@/store/usePedidoStore'
import { useClientStore } from '@/store/useClientStore'

export default function TicketPage() {
  const router = useRouter()
  const { productos, metodoPago, setMetodoPago, getTotal, limpiarPedido } = usePedidoStore()
  const { cliente } = useClientStore()
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [modoOscuro, setModoOscuro] = useState(false)
  const [pedidoEnviado, setPedidoEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  // Formatear fecha y hora
  useEffect(() => {
    const ahora = new Date()
    setFecha(ahora.toLocaleDateString('es-MX', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }))
    setHora(ahora.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }))
  }, [])

  // Verificar datos del cliente
  useEffect(() => {
    if (!cliente) {
      toast.warning('Redirigiendo... Completa tus datos')
      setTimeout(() => router.push('/clientes/login'), 1500)
    }
  }, [cliente, router])

  const total = getTotal()

  const enviarWhatsApp = () => {
    const mensaje = `*Pedido de ${cliente?.nombre}*\n\n` +
      `📅 *Fecha:* ${fecha}\n` +
      `⏰ *Hora:* ${hora}\n\n` +
      `🍽️ *Pedido:*\n${productos.map(item => 
        `- ${item.producto.nombre} x${item.cantidad}` +
        (item.salsas.length > 0 ? ` (${item.salsas.join(', ')})` : '') +
        ` - $${item.producto.precio * item.cantidad}`
      ).join('\n')}\n\n` +
      `💳 *Método de pago:* ${metodoPago || 'No seleccionado'}\n` +
      `💰 *Total:* $${total}\n\n` +
      `📍 *Dirección:* ${cliente?.direccion || 'No proporcionada'}`

    window.open(
      `https://wa.me/5217441234567?text=${encodeURIComponent(mensaje)}`, 
      '_blank'
    )
  }

  const imprimirTicket = () => {
    const originalMode = modoOscuro
    setModoOscuro(false)
    setTimeout(() => {
      window.print()
      setModoOscuro(originalMode)
    }, 100)
  }

  const descargarPDF = async () => {
    setLoading(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      
      // Encabezado
      doc.setFontSize(18)
      doc.setTextColor(234, 179, 8)
      doc.text('El Pastorcito', 105, 20, { align: 'center' })
      
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text('Ticket de Pedido', 105, 30, { align: 'center' })
      
      // Información del cliente
      doc.setFontSize(10)
      doc.text(`Fecha: ${fecha}`, 15, 45)
      doc.text(`Hora: ${hora}`, 15, 55)
      doc.text(`Cliente: ${cliente?.nombre || 'No registrado'}`, 15, 65)
      doc.text(`Teléfono: ${cliente?.telefono || 'No proporcionado'}`, 15, 75)
      doc.text(`Dirección: ${cliente?.direccion || 'No proporcionada'}`, 15, 85)
      
      // Productos
      doc.setFontSize(12)
      doc.text('Detalle del Pedido:', 15, 100)
      
      let yPosition = 110
      productos.forEach(item => {
        doc.text(
          `${item.producto.nombre} x${item.cantidad} - $${item.producto.precio * item.cantidad}`,
          20,
          yPosition
        )
        if (item.salsas.length > 0) {
          doc.text(`Salsas: ${item.salsas.join(', ')}`, 25, yPosition + 7)
          yPosition += 14
        } else {
          yPosition += 7
        }
      })
      
      // Total y método de pago
      doc.setFontSize(14)
      doc.text(`Total: $${total.toFixed(2)}`, 15, yPosition + 15)
      doc.text(`Método de pago: ${metodoPago || 'No seleccionado'}`, 15, yPosition + 25)
      
      // Pie de página
      doc.setFontSize(10)
      doc.text('¡Gracias por tu preferencia!', 105, yPosition + 40, { align: 'center' })
      doc.text('El Pastorcito - Sucursal Ejido, Acapulco', 105, yPosition + 45, { align: 'center' })
      
      doc.save(`ticket-${new Date().getTime()}.pdf`)
    } catch {
      toast.error('Error al generar PDF')
    } finally {
      setLoading(false)
    }
  }

  const limpiarTodo = () => {
    limpiarPedido()
    useClientStore.getState().resetCliente()
    setPedidoEnviado(false)
    setMetodoPago('')
  }

  const confirmarPedido = async () => {
    if (!metodoPago) {
      toast.error('Selecciona un método de pago')
      return
    }

    if (!cliente) {
      toast.error('Información del cliente incompleta')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: cliente.id,
          productos: productos.map(item => ({
            productoId: item.producto.id,
            cantidad: item.cantidad,
            salsas: item.salsas,
            precio: item.producto.precio,
          })),
          metodoPago,
          total
        }),
      })

      if (!res.ok) throw new Error()

      setPedidoEnviado(true)
      toast.success('Pedido confirmado!')
      setTimeout(() => {
        limpiarTodo()
        router.push('/confirmacion-final')
      }, 2000)
    } catch (error) {
      toast.error('Error al enviar pedido')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Estilos de impresión
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .ticket-print, .ticket-print * {
          visibility: visible;
        }
        .ticket-print {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          margin: 0;
          padding: 0;
          box-shadow: none;
          border: none;
        }
        .no-print {
          display: none !important;
        }
      }
    `
    document.head.appendChild(style)
    return () => 
      {
        document.head.removeChild(style)
      }
      
  }, [])

  if (!cliente) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg">Cargando información del cliente...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-4 ${modoOscuro ? 'bg-gray-900' : ''}`}>
      {/* Botones de acción */}
      <div className="flex flex-wrap justify-center gap-3 mb-6 no-print">
        <button 
          onClick={enviarWhatsApp}
          className="btn-action bg-green-500 hover:bg-green-600"
          disabled={loading}
        >
          <FaWhatsapp size={18} /> WhatsApp
        </button>
        <button 
          onClick={imprimirTicket}
          className="btn-action bg-blue-500 hover:bg-blue-600"
          disabled={loading}
        >
          <FiPrinter size={18} /> Imprimir
        </button>
        <button 
          onClick={descargarPDF}
          className="btn-action bg-red-500 hover:bg-red-600"
          disabled={loading}
        >
          <FiDownload size={18} /> PDF
        </button>
        <button 
          onClick={() => setModoOscuro(!modoOscuro)}
          className="btn-action bg-gray-500 hover:bg-gray-600"
          disabled={loading}
        >
          {modoOscuro ? <FiSun size={18} /> : <FiMoon size={18} />} 
          {modoOscuro ? 'Claro' : 'Oscuro'}
        </button>
        <button 
          onClick={() => router.push('/menu')}
          className="btn-action bg-amber-500 hover:bg-amber-600 text-black"
          disabled={loading}
        >
          <FiArrowLeft size={18} /> Menú
        </button>
      </div>

      {/* Contenido del ticket */}
      <div className={`ticket-print max-w-md mx-auto rounded-xl shadow-2xl overflow-hidden ${
        modoOscuro ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}>
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-center print:bg-amber-500">
          <div className="flex justify-center mb-4">
            <Image 
              src="/logo.png" 
              alt="El Pastorcito" 
              width={80} 
              height={80} 
              className="rounded-full border-2 border-white print:border-amber-500"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold print:text-black">El Pastorcito</h1>
          <p className="text-sm italic print:text-gray-800">Do You Taco?</p>
          <p className="text-xs mt-2 print:text-gray-700">Sucursal Ejido, Acapulco</p>
        </div>

        {/* Información del pedido */}
        <div className="p-6 print:p-4">
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="flex items-start gap-2">
              <FiClock className="mt-1 text-amber-500 print:text-amber-700" />
              <div>
                <p className="font-semibold">Fecha y Hora</p>
                <p>{fecha} - {hora}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FiUser className="mt-1 text-amber-500 print:text-amber-700" />
              <div>
                <p className="font-semibold">Cliente</p>
                <p>{cliente.nombre}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FiPhone className="mt-1 text-amber-500 print:text-amber-700" />
              <div>
                <p className="font-semibold">Teléfono</p>
                <p>{cliente.telefono}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FiMapPin className="mt-1 text-amber-500 print:text-amber-700" />
              <div>
                <p className="font-semibold">Dirección</p>
                <p className="break-words">{cliente.direccion}</p>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b pb-2 mb-3 print:border-gray-400">
              Detalle del Pedido
            </h2>
            <div className="space-y-3">
              {productos.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between border-b pb-2 print:border-gray-300"
                >
                  <div>
                    <p className="font-medium">
                      {item.producto.nombre} × {item.cantidad}
                    </p>
                    {item.salsas.length > 0 && (
                      <p className="text-xs text-amber-600 print:text-amber-700">
                        Salsas: {item.salsas.join(', ')}
                      </p>
                    )}
                  </div>
                  <p className="font-medium">${(item.producto.precio * item.cantidad).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between text-lg font-bold border-t pt-3 mb-6 print:border-gray-400">
            <p>Total:</p>
            <p>${total.toFixed(2)}</p>
          </div>

          {/* Método de pago */}
          <div className="mb-8 no-print">
            <h2 className="text-lg font-bold mb-3">Método de Pago</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMetodoPago('efectivo')}
                className={`py-2 px-4 rounded-lg border transition-colors ${
                  metodoPago === 'efectivo' 
                    ? 'bg-green-100 border-green-500 text-green-800' 
                    : modoOscuro 
                      ? 'border-gray-600 hover:bg-gray-700' 
                      : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                Efectivo
              </button>
              <button
                onClick={() => setMetodoPago('tarjeta')}
                className={`py-2 px-4 rounded-lg border transition-colors ${
                  metodoPago === 'tarjeta' 
                    ? 'bg-blue-100 border-blue-500 text-blue-800' 
                    : modoOscuro 
                      ? 'border-gray-600 hover:bg-gray-700' 
                      : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                Tarjeta
              </button>
              <button
                onClick={() => setMetodoPago('transferencia')}
                className={`py-2 px-4 rounded-lg border transition-colors ${
                  metodoPago === 'transferencia' 
                    ? 'bg-purple-100 border-purple-500 text-purple-800' 
                    : modoOscuro 
                      ? 'border-gray-600 hover:bg-gray-700' 
                      : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                Transferencia
              </button>
            </div>
          </div>

          {/* Confirmación (no se imprime) */}
          <div className="no-print">
            <AnimatePresence>
              {pedidoEnviado ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2"
                >
                  <FiCheckCircle size={20} />
                  <p>Pedido enviado con éxito! Redirigiendo...</p>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmarPedido}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold py-3 px-4 rounded-lg shadow-md transition-all disabled:opacity-70"
                >
                  {loading ? 'Enviando...' : 'Confirmar Pedido'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Pie del ticket */}
        <div className={`p-4 text-center text-xs ${
          modoOscuro ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'
        } print:bg-gray-100 print:text-gray-600`}>
          <p>¡Gracias por tu preferencia!</p>
          <p>Vuelve pronto</p>
        </div>
      </div>

      {/* Estilos CSS */}
      <style jsx>{`
        .btn-action {
          flex: 1 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          color: white;
          font-weight: 500;
          transition: all 0.2s;
          min-width: 120px;
        }
        .btn-action:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}