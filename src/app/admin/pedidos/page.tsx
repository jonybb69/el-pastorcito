'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

type Pedido = {
  pedidoId: number;
  numeroPedido: string;
  fecha: string;
  estado: string;
  cliente: {
    nombre: string;
    telefono: string;
    direccion: string;
  };
  productos: Array<{
    id: number;
    nombre: string;
    salsas: string[];
    cantidad: number;
    precio: number;
  }>;
};

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);

  const fetchPedidos = async () => {
    try {
      const res = await fetch('/api/pedidos');
      if (!res.ok) throw new Error('Error al cargar pedidos');
      const data = await res.json();
      setPedidos(data.pedidos);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar los pedidos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const eliminarPedido = async (id: number) => {
    try {
      const res = await fetch(`/api/pedidos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Pedido eliminado');
      fetchPedidos();
    } catch {
      toast.error('No se pudo eliminar el pedido');
    }
  };

  const actualizarEstado = async (id: number, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/pedidos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Estado actualizado a "${nuevoEstado}"`);
      fetchPedidos();
    } catch {
      
      toast.error('Error al actualizar el estado');
    }
  };

  return (
    <section className="max-w-6xl mx-auto mt-10 p-6 text-white">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-extrabold text-purple-500 mb-12 text-center"
      >
        Pedidos Entrantes
      </motion.h2>

      {cargando ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white/70">
          Cargando pedidos...
        </motion.div>
      ) : pedidos.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white/70">
          No hay pedidos entrantes por el momento.
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {pedidos.map((pedido) => (
            <motion.div
              key={pedido.pedidoId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="border border-white/10 backdrop-blur-md bg-white/5 rounded-2xl shadow-xl p-6 transition-all hover:border-yellow-500 hover:shadow-yellow-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-semibold text-black">{pedido.numeroPedido}</h3>
                  <p className="text-xs text-white/60">Fecha: {new Date(pedido.fecha).toLocaleString()}</p>
                </div>
                <span className="bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full text-xs">
                  {pedido.cliente.nombre}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-white/80 mb-1">
                  <span className="font-semibold text-white">Teléfono:</span> {pedido.cliente.telefono}
                </p>
                <p className="text-sm text-white/80 mb-2">
                  <span className="font-semibold text-white">Dirección:</span> {pedido.cliente.direccion}
                </p>
                <p className="text-sm text-white">
                  Estado: <span className="capitalize">{pedido.estado}</span>
                </p>
              </div>

              <div className="mt-4 space-y-3 mb-6">
                {pedido.productos.map((producto, index) => (
                  <div
                    key={`${producto.id}-${index}`}
                    className="p-3 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-yellow-400/10 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{producto.nombre}</span>
                      <span className="text-sm">{producto.cantidad} x ${producto.precio}</span>
                    </div>
                    {producto.salsas.length > 0 && (
                      <p className="text-xs text-white/60 mt-1">Salsas: {producto.salsas.join(', ')}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {pedido.estado === 'pendiente' && (
                  <button
                    onClick={() => actualizarEstado(pedido.pedidoId, 'en preparación')}
                    className="px-4 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl font-semibold transition-all"
                  >
                    Tomar pedido
                  </button>
                )}
                
                {pedido.estado === 'en preparación' && (
                  <button
                    onClick={() => actualizarEstado(pedido.pedidoId, 'finalizado')}
                    className="px-4 py-1 text-sm bg-green-500 hover:bg-green-600 text-black rounded-xl font-semibold transition-all"
                  >
                    Pedido finalizado
                  </button>
                )}
                <button
                  onClick={() => eliminarPedido(pedido.pedidoId)}
                  className="px-4 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
