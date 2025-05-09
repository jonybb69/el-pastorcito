'use client';

import { useCarritoStore } from '@/store/useCarritoStore';
import { useClientStore } from '@/store/useClientStore';
import { Pedido } from '@prisma/client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';


export default function TicketPage() {
  const { carrito } = useCarritoStore();
  const { cliente, metodoPago } = useClientStore();
  const [modoOscuro, setModoOscuro] = useState(true);
  const [fecha, setFecha] = useState('');
  const ticketRef = useRef(null);

  

  const toggleModo = () => setModoOscuro(!modoOscuro);

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [cargando, setCargando] = useState(true);
  
    useEffect(() => {
      // Importar dinámicamente solo en cliente
      import('html2pdf.js').then((html2pdf) => {
        if (ticketRef.current) {
          html2pdf.default().from(ticketRef.current).save();
        }
      });
    }, []);
    useEffect(() => {
      const hoy = new Date().toLocaleDateString();
      setFecha(hoy);
    }, []);

  const enviarWhatsApp = () => {
    const mensaje = encodeURIComponent(
      `Hola, soy ${cliente?.nombre}. Aquí está mi pedido:\n\n` +
        carrito
          .map(
            (item) =>
              `- ${item.nombre} x${item.cantidad} (${item.salsas.join(', ')}) - $${item.precio * item.cantidad}`
          )
          .join('\n') +
        `\n\nMétodo de pago: ${metodoPago}\nTotal: $${total}`
    );
    window.open(`https://wa.me/5217441234567?text=${mensaje}`, '_blank');
  };

  const imprimir = () => window.print();

  const descargarPDF = () => {
    const element = document.getElementById('ticket');
    if (element) {
      import('html2pdf.js').then((html2pdf) => {
        html2pdf.default().from(element).save('ticket.pdf');
      });
    }
  };

  return (
    <div className={`min-h-screen p-4 ${modoOscuro ? 'bg-gray-900 text-black' : 'bg-white text-black'}`}>
      {/* Botones */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 print:hidden">
        <button onClick={enviarWhatsApp} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Enviar por WhatsApp
        </button>
        <button onClick={imprimir} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Imprimir
        </button>
        <button onClick={descargarPDF} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          Descargar PDF
        </button>
        <button onClick={toggleModo} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
          {modoOscuro ? 'Modo Claro' : 'Modo Oscuro'}
        </button>
      </div>

      {/* Ticket */}
      <div
        id="ticket"
        className="max-w-md mx-auto border rounded-lg shadow-lg p-4 bg-opacity-90 bg-white text-black"
      >
        {/* Encabezado */}
        <div className="flex flex-col items-center mb-4">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
          <h1 className="text-2xl font-bold mt-2">El Pastorcito</h1>
          <h2 className="text-lg italic">Do You Taco?</h2>
        </div>

        {/* Info del Cliente */}
        <div className="mb-4 text-sm">
          <p><strong>Nombre:</strong> {cliente?.nombre}</p>
          <p><strong>Teléfono:</strong> {cliente?.telefono}</p>
          <p><strong>Dirección:</strong> {cliente?.direccion}</p>
          <p suppressHydrationWarning><strong>Fecha:</strong> {fecha}</p>
          <p><strong>Método de Pago:</strong> {metodoPago}</p>
        </div>

        {/* Productos */}
        <table className="w-full text-sm mb-4">
          <thead>
            <tr>
              <th className="text-left">Producto</th>
              <th className="text-right">Cant</th>
              <th className="text-right">Precio</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item, index) => (
              <tr key={index}>
                <td>
                  {item.nombre}
                  {item.salsas.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Salsas: {item.salsas.join(', ')}
                    </div>
                  )}
                </td>
                <td className="text-right">{item.cantidad}</td>
                <td className="text-right">${item.precio * item.cantidad}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="text-right font-bold">
                Total:
              </td>
              <td className="text-right font-bold">${total}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
