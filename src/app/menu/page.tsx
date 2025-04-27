'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { usePedidoStore } from '@/store/usePedidoStore';
import { useClientStore } from '@/store/useClientStore';
import Image from 'next/image';
import { toast } from 'sonner';

// Define tipo ProductoSeleccionado
type ProductoSeleccionado = {
  id: number;
  nombre: string;
  salsas: string[];
  cantidad: number;
  precio: number;
};

const productos = [
  {
    id: 1,
    nombre: 'Tacos al Pastor',
    precio: 18,
    imagen: '/productos/tacos-al-pastor.jpg',
  },
  {
    id: 2,
    nombre: 'Gringa de Bistec',
    precio: 30,
    imagen: '/productos/gringa-bistec.jpg',
  },
  {
    id: 3,
    nombre: 'Arrachera',
    precio: 40,
    imagen: '/productos/arrachera.jpg',
  },
  {
    id: 4,
    nombre: 'Torta de Pastor',
    precio: 35,
    imagen: '/productos/torta-pastor.jpg',
  },
  {
    id: 5,
    nombre: 'Quesadilla de Bistec',
    precio: 28,
    imagen: '/productos/quesadilla-bistec.jpg',
  },
  {
    id: 6,
    nombre: 'Costra de Pastor',
    precio: 32,
    imagen: '/productos/costra-pastor.jpg',
  },
];

const salsasDisponibles = ['Verde', 'Roja', 'Mango Habanero', 'Ninguna'];

export default function MenuPage() {
  const [pedido, setPedido] = useState<ProductoSeleccionado[]>([]);
  const router = useRouter();
  const { cliente } = useClientStore();

  const toggleProducto = (producto: { id: number; nombre: string; precio: number }) => {
    const existe = pedido.find((item) => item.id === producto.id);
    if (existe) {
      setPedido(pedido.filter((item) => item.id !== producto.id));
    } else {
      setPedido([
        ...pedido,
        { id: producto.id, nombre: producto.nombre, salsas: [], cantidad: 1, precio: producto.precio },
      ]);
    }
  };

  const toggleSalsa = (productoId: number, salsa: string) => {
    setPedido((prev) =>
      prev.map((item) =>
        item.id === productoId
          ? {
              ...item,
              salsas: item.salsas.includes(salsa)
                ? item.salsas.filter((s) => s !== salsa)
                : [...item.salsas, salsa],
            }
          : item
      )
    );
  };

  const enviarPedido = async () => {
    if (!cliente || !cliente.id) {
      toast.error('Debes registrarte antes de pedir');
      return;
    }

    if (pedido.length === 0) {
      toast.error('Selecciona al menos un producto');
      return;
    }

    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: cliente.id,
          productos: pedido.map((item) => ({
            productoId: item.id,
            cantidad: item.cantidad,
            salsas: item.salsas,
          })),
          metodoPago: 'efectivo',
        }),
      });

      if (!res.ok) throw new Error('Error al enviar el pedido');

      toast.success('¡Pedido enviado con éxito!');
      router.push('/pedido-enviado');
    } catch (error) {
      console.error(error);
      toast.error('Error al enviar el pedido');
    }
  };

  return (
    <section className="max-w-6xl mx-auto p-6 pt-12 text-white">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-yellow-400 text-center mb-12 drop-shadow-lg"
      >
        Elige tus Antojitos 🌮
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {productos.map((producto) => {
          const seleccionado = pedido.find((p) => p.id === producto.id);

          return (
            <motion.div
              key={producto.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={`rounded-2xl overflow-hidden shadow-xl border-2 cursor-pointer backdrop-blur-md group transition-all
                ${
                  seleccionado
                    ? 'border-yellow-400 bg-yellow-500/10'
                    : 'border-white/10 bg-white/5 hover:border-yellow-400 hover:shadow-yellow-400/30'
                }
              `}
            >
              <label className="block">
                <Image
                  src={producto.imagen}
                  alt={producto.nombre}
                  width={600}
                  height={400}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{producto.nombre}</h3>
                    <input
                      type="checkbox"
                      checked={!!seleccionado}
                      onChange={() => toggleProducto(producto)}
                      className="h-5 w-5 accent-yellow-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-white/60 text-sm">Precio: ${producto.precio}</p>
                </div>
              </label>

              {seleccionado && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="px-5 pb-5"
                >
                  <p className="text-sm text-white/70 mb-2">Elige tus salsas:</p>
                  <div className="flex flex-wrap gap-2">
                    {salsasDisponibles.map((salsa) => (
                      <button
                        key={salsa}
                        type="button"
                        onClick={() => toggleSalsa(producto.id, salsa)}
                        className={`px-3 py-1 rounded-full border text-xs transition-all
                          ${
                            seleccionado.salsas.includes(salsa)
                              ? 'bg-yellow-500 text-black border-yellow-400'
                              : 'bg-black/30 text-white/70 border-white/10 hover:border-white/20'
                          }
                        `}
                      >
                        {salsa}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-14 flex justify-center">
        <Button
          onClick={enviarPedido}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-yellow-400/40 transition-all"
        >
          Confirmar Pedido
        </Button>
      </div>
    </section>
  );
}
