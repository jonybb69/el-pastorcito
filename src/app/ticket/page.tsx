'use client';

import { usePedidoStore } from '@/store/usePedidoStore';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPrinter, FiDownload, FiSun, FiMoon, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function TicketPage() {
  const { productos, cliente, metodoPago, setMetodoPago, getTotal, limpiarPedido } = usePedidoStore();
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [modoOscuro, setModoOscuro] = useState(false);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const ahora = new Date();
    setFecha(ahora.toLocaleDateString('es-MX'));
    setHora(ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const total = getTotal();

  const enviarWhatsApp = () => {
    const mensaje = encodeURIComponent(
      `*Pedido de ${cliente?.nombre}*\n\n` +
      `📅 *Fecha:* ${fecha}\n` +
      `⏰ *Hora:* ${hora}\n\n` +
      `🍽️ *Pedido:*\n` +
      productos.map(item => 
        `- ${item.producto.nombre} x${item.cantidad}` +
        (item.salsas.length > 0 ? ` (${item.salsas.join(', ')})` : '') +
        ` - $${item.producto.precio * item.cantidad}`
      ).join('\n') +
      `\n\n💳 *Método de pago:* ${metodoPago || 'No seleccionado'}\n` +
      `💰 *Total:* $${total}\n\n` +
      `📍 *Dirección:* ${cliente?.direccion || 'No proporcionada'}`
    );
    window.open(`https://wa.me/5217441234567?text=${mensaje}`, '_blank');
  };

  const imprimir = () => window.print();

  const descargarPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('El Pastorcito', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Ticket de Pedido', 105, 30, { align: 'center' });
    
    // Agregar más contenido al PDF...
    
    doc.save('ticket-pastorcito.pdf');
  };

  const confirmarPedido = async () => {
    if (!metodoPago) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: cliente?.id || null,
          productos: productos.map((item) => ({
            productoId: item.producto.id,
            cantidad: item.cantidad,
            salsas: item.salsas,
            precio: item.producto.precio,
          })),
          metodoPago: metodoPago,
          total: total
        }),
      });

      if (!res.ok) throw new Error('Error al enviar el pedido');

      setPedidoEnviado(true);
      setTimeout(() => {
        limpiarPedido();
        router.push('/confirmacion-final');
      }, 3000);
    } catch (error) {
      console.error('Error al enviar pedido:', error);
      alert('Error al enviar el pedido');
    }
  };

  return (
    <div className={`min-h-screen p-4 ${modoOscuro ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Botones de acción */}
      <div className="flex flex-wrap justify-center gap-3 mb-6 print:hidden">
        <button 
          onClick={enviarWhatsApp}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <FaWhatsapp size={18} /> WhatsApp
        </button>
        <button 
          onClick={imprimir}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <FiPrinter size={18} /> Imprimir
        </button>
        <button 
          onClick={descargarPDF}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <FiDownload size={18} /> PDF
        </button>
        <button 
          onClick={() => setModoOscuro(!modoOscuro)}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md"
        >
          {modoOscuro ? <FiSun size={18} /> : <FiMoon size={18} />} 
          {modoOscuro ? 'Claro' : 'Oscuro'}
        </button>
        <button 
          onClick={() => router.push('/menu')}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg shadow-md"
        >
          <FiArrowLeft size={18} /> Menú
        </button>
      </div>

      {/* Ticket */}
      <div className={`max-w-md mx-auto rounded-xl shadow-2xl overflow-hidden ${modoOscuro ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        {/* Encabezado del ticket */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-center">
          <div className="flex justify-center mb-4">
            <Image 
              src="/logo.png" 
              alt="El Pastorcito" 
              width={80} 
              height={80} 
              className="rounded-full border-2 border-white"
            />
          </div>
          <h1 className="text-2xl font-bold">El Pastorcito</h1>
          <p className="text-sm italic">Do You Taco?</p>
          <p className="text-xs mt-2">Sucursal Ejido, Acapulco</p>
        </div>

        {/* Información del pedido */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="font-semibold">Fecha:</p>
              <p>{fecha}</p>
            </div>
            <div>
              <p className="font-semibold">Hora:</p>
              <p>{hora}</p>
            </div>
            <div>
              <p className="font-semibold">Cliente:</p>
              <p>{cliente?.nombre || 'No registrado'}</p>
            </div>
            <div>
              <p className="font-semibold">Teléfono:</p>
              <p>{cliente?.telefono || 'No proporcionado'}</p>
            </div>
          </div>

          {/* Productos */}
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3">Detalle del Pedido</h2>
            <div className="space-y-3">
              {productos.map((item, index) => (
                <div key={index} className="flex justify-between border-b border-gray-200 pb-2">
                  <div>
                    <p className="font-medium">
                      {item.producto.nombre} × {item.cantidad}
                    </p>
                    {item.salsas.length > 0 && (
                      <p className="text-xs text-amber-600">Salsas: {item.salsas.join(', ')}</p>
                    )}
                  </div>
                  <p className="font-medium">${item.producto.precio * item.cantidad}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-3 mb-6">
            <p>Total:</p>
            <p>${total}</p>
          </div>

          {/* Método de pago */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3">Método de Pago</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMetodoPago('efectivo')}
                className={`py-2 px-4 rounded-lg border transition-colors ${metodoPago === 'efectivo' ? 'bg-green-100 border-green-500 text-green-800' : 'border-gray-300 hover:bg-gray-100'}`}
              >
                Efectivo
              </button>
              <button
                onClick={() => setMetodoPago('tarjeta')}
                className={`py-2 px-4 rounded-lg border transition-colors ${metodoPago === 'tarjeta' ? 'bg-blue-100 border-blue-500 text-blue-800' : 'border-gray-300 hover:bg-gray-100'}`}
              >
                Tarjeta
              </button>
              <button
                onClick={() => setMetodoPago('transferencia')}
                className={`py-2 px-4 rounded-lg border transition-colors ${metodoPago === 'transferencia' ? 'bg-purple-100 border-purple-500 text-purple-800' : 'border-gray-300 hover:bg-gray-100'}`}
              >
                Transferencia
              </button>
            </div>
          </div>

          {/* Confirmación */}
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
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold py-3 px-4 rounded-lg shadow-md transition-all"
              >
                Confirmar y Enviar Pedido
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Pie del ticket */}
        <div className={`p-4 text-center text-xs ${modoOscuro ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
          <p>¡Gracias por tu preferencia!</p>
          <p>Vuelve pronto</p>
        </div>
      </div>
    </div>
  );
}