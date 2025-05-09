'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { toast } from 'sonner';
import { usePedidoStore } from '@/store/usePedidoStore';

// Tipo para productos que vienen de la API
type Producto = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
};

type Salsa = {
  id: number;
  nombre: string;
};

export default function MenuPage() {
  const {
    cliente,
    productos: productosSeleccionados,
    addProducto,
    removeProducto,
    setMetodoPago,
    metodoPago,
  } = usePedidoStore();

  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [salsasDisponibles, setSalsasDisponibles] = useState<string[]>([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch('/api/productos');
        if (!res.ok) throw new Error('Error al obtener productos');
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        toast.error('Error al cargar productos');
      }
    };

    const fetchSalsas = async () => {
      try {
        const res = await fetch('/api/salsas');
        if (!res.ok) throw new Error('Error al obtener salsas');
        const data = await res.json();
        setSalsasDisponibles(data.map((salsa: Salsa) => salsa.nombre));
      } catch (error) {
        console.error('Error al cargar salsas:', error);
        toast.error('Error al cargar salsas');
      }
    };

    fetchProductos();
    fetchSalsas();
  }, []);

  const toggleProducto = (producto: Producto) => {
    const existe = productosSeleccionados.find((item) => item.id === producto.id);
    if (existe) {
      const index = productosSeleccionados.findIndex((item) => item.id === producto.id);
      removeProducto(index);
    } else {
      const nuevoProducto = {
        id: producto.id,
        nombre: producto.nombre,
        producto: {
          id: String(producto.id),
          nombre: producto.nombre,
          precio: producto.precio,
        },
        cantidad: 1,
        salsas: [],
      };
      addProducto(nuevoProducto);
    }
  };

  const toggleSalsa = (productoId: number, salsa: string) => {
    const index = productosSeleccionados.findIndex((item) => item.id === productoId);
    if (index !== -1) {
      const producto = productosSeleccionados[index];
      const nuevasSalsas = producto.salsas.includes(salsa)
        ? producto.salsas.filter((s) => s !== salsa)
        : [...producto.salsas, salsa];

      removeProducto(index);
      addProducto({ ...producto, salsas: nuevasSalsas });
    }
  };

  const enviarPedido = async () => {
    if (!cliente || !cliente.id) {
      toast.error('Debes registrarte antes de pedir');
      return;
    }

    if (productosSeleccionados.length === 0) {
      toast.error('Selecciona al menos un producto');
      return;
    }

    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: cliente.id,
          productos: productosSeleccionados.map((item) => ({
            productoId: item.producto.id,
            cantidad: item.cantidad,
            salsas: item.salsas,
            precio: item.producto.precio,
          })),
          metodoPago: metodoPago || 'efectivo',
        }),
      });

      if (!res.ok) throw new Error('Error al enviar el pedido');

      toast.success('¡Pedido enviado con éxito!');
      router.push('/ticket');
    } catch (error) {
      console.error('Error al enviar pedido:', error);
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
        Elige tus Platillos 🌮
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {productos.map((producto) => {
          const seleccionado = productosSeleccionados.find((p) => p.id === producto.id);

          return (
            <motion.div
              key={producto.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={`rounded-2xl overflow-hidden shadow-xl border-2 cursor-pointer backdrop-blur-md group transition-all
                ${seleccionado ? 'border-yellow-400 bg-yellow-500/10' : 'border-white/10 bg-white/5 hover:border-yellow-400 hover:shadow-yellow-400/30'}
              `}
            >
              <label className="block">
                <Image
                  src={`/productos/${producto.imagen}`}
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
                          ${seleccionado.salsas.includes(salsa)
                            ? 'bg-yellow-500 text-black border-yellow-400'
                            : 'bg-black/30 text-white/70 border-white/10 hover:border-white/20'}
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
