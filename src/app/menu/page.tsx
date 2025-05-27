'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { toast } from 'sonner';
import { usePedidoStore } from '@/store/usePedidoStore';
import { FiMenu, FiX, FiMapPin, FiInfo, FiMail, FiShoppingCart } from 'react-icons/fi';

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: 'platillos' | 'bebidas';
  descripcion?: string;
};

type Salsa = {
  id: number;
  nombre: string;
};

export default function MenuPage() {
  const {
    productos: productosSeleccionados,
    addProducto,
    removeProducto,
  } = usePedidoStore();

  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [salsasDisponibles, setSalsasDisponibles] = useState<string[]>([]);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState<'platillos' | 'bebidas'>('platillos');
  const [productoExpandido, setProductoExpandido] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosRes, salsasRes] = await Promise.all([
          fetch('/api/productos'),
          fetch('/api/salsas')
        ]);

        if (!productosRes.ok || !salsasRes.ok) throw new Error('Error al cargar datos');

        const productosData = await productosRes.json();
        const salsasData = await salsasRes.json();

        setProductos(productosData);
        setSalsasDisponibles(salsasData.map((salsa: Salsa) => salsa.nombre));
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al cargar el menú');
      }
    };

    fetchData();
  }, []);

  const toggleProducto = (producto: Producto) => {
    const existe = productosSeleccionados.find((item) => item.id === String(producto.id));
    if (existe) {
      const index = productosSeleccionados.findIndex((item) => item.id === String(producto.id));
      removeProducto(index);
      if (productoExpandido === producto.id) setProductoExpandido(null);
    } else {
      const nuevoProducto = {
        destacado: false,
        id: String(producto.id),
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
      setProductoExpandido(producto.id);
    }
  };

  const toggleSalsa = (productoId: number, salsa: string) => {
    const index = productosSeleccionados.findIndex((item) => item.id === String(productoId));
    if (index !== -1) {
      const producto = productosSeleccionados[index];
      const nuevasSalsas = producto.salsas.includes(salsa)
        ? producto.salsas.filter((s) => s !== salsa)
        : [...producto.salsas, salsa];

      removeProducto(index);
      addProducto({ ...producto, salsas: nuevasSalsas });
    }
  };

  const productosFiltrados = productos.filter(p => p.categoria === categoriaActiva);

  const abrirGoogleMaps = () => {
    window.open('https://www.google.com/maps?q=El+Pastorcito+Calle+Nueve+Ejido+Acapulco', '_blank');
  };

  return (
    <div >
      <div className="absolute inset-0 bg-[url('/textura-mexicana.png')] opacity-10 mix-blend-overlay"></div>
      
      {/* Botón de menú móvil */}
      <button
        onClick={() => setMenuAbierto(true)}
        className="fixed top-4 left-4 z-50 bg-amber-500 hover:bg-amber-600 text-black p-3 rounded-full shadow-lg transition-all"
      >
        <FiMenu size={20} />
      </button>

      {/* Panel lateral */}
      <motion.div 
        initial={false}
        animate={{ 
          x: menuAbierto ? 0 : -300,
          boxShadow: menuAbierto ? '10px 0 30px rgba(234, 179, 8, 0.3)' : 'none'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-72 bg-gray-800/95 backdrop-blur-lg z-50 border-r border-yellow-500/30"
      >
        <div className="p-6 h-full flex flex-col">
          <button 
            onClick={() => setMenuAbierto(false)}
            className="self-end text-yellow-400 hover:text-yellow-300 transition mb-8"
          >
            <FiX size={20} />
          </button>
          
          <nav className="flex-1 space-y-6">
            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCategoriaActiva('platillos');
                setMenuAbierto(false);
              }}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition ${categoriaActiva === 'platillos' ? 'bg-yellow-500/20 text-yellow-400 border-l-4 border-yellow-500' : 'hover:bg-gray-700/50'}`}
            >
              <span className="text-xl">🌮</span>
              <span className="font-medium">Platillos</span>
            </motion.button>
            
            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCategoriaActiva('bebidas');
                setMenuAbierto(false);
              }}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition ${categoriaActiva === 'bebidas' ? 'bg-amber-500 text-black' : 'hover:bg-gray-800'}`}
            >
              <span className="text-xl">🍹</span>
              <span className="font-medium">Bebidas</span>
            </motion.button>
            
            <div className="border-t border-gray-800 my-4"></div>
            
            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/acerca-de')}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              <FiInfo className="text-amber-500" size={20} />
              <span className="font-medium">Acerca de</span>
            </motion.button>
            
            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/contacto')}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              <FiMail className="text-amber-500" size={20} />
              <span className="font-medium">Contáctenos</span>
            </motion.button>
            
            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={abrirGoogleMaps}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              <FiMapPin className="text-amber-500" size={20} />
              <span className="font-medium">Encuéntranos</span>
            </motion.button>
          </nav>
          
          <div className="mt-auto pt-6 border-t border-gray-800">
            <p className="text-amber-500 text-sm font-medium">El Pastorcito</p>
            <p className="text-gray-400 text-xs">Sucursal Ejido, Acapulco</p>
          </div>
        </div>
      </motion.div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen">
        {/* Botón de menú móvil */}
        <button
          onClick={() => setMenuAbierto(true)}
          className="fixed top-4 left-4 z-40 bg-yellow-500/80 hover:bg-yellow-500 text-black p-3 rounded-full shadow-lg backdrop-blur-sm transition-all"
        >
          <FiMenu size={24} />
        </button>

        <section className="max-w-6xl mx-auto px-6 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-amber-500 mb-2 drop-shadow-lg">
              {categoriaActiva === 'platillos' ? 'Nuestros Platillos' : 'Bebidas Refrescantes'}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Selecciona tus favoritos y personalízalos con nuestras salsas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productosFiltrados.map((producto) => {
              const seleccionado = productosSeleccionados.find((p) => p.id === String(producto.id));

              return (
                <motion.div
                  key={producto.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  <div
                    className={`rounded-xl overflow-hidden shadow-lg cursor-pointer group transition-all duration-300 h-full flex flex-col border border-gray-800
                      ${seleccionado ? 'ring-2 ring-amber-500' : 'hover:ring-1 hover:ring-amber-400'}
                    `}
                  >
                    <div className="relative overflow-hidden h-48">
                      <Image
                        src={`/productos/${producto.imagen}`}
                        alt={producto.nombre}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <p className="text-white text-sm">{producto.descripcion || 'Delicioso platillo tradicional'}</p>
                      </div>
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleProducto(producto);
                          }}
                          className={`p-2 rounded-full backdrop-blur-sm transition-all shadow-lg
                            ${seleccionado ? 'bg-amber-500 text-black' : 'bg-black/70 text-white hover:bg-amber-500 hover:text-black'}
                          `}
                        >
                          {seleccionado ? '✓' : '+'}
                        </button>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col bg-gray-900/50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold">{producto.nombre}</h3>
                        <p className="text-amber-500 font-bold">${producto.precio}</p>
                      </div>

                      <AnimatePresence>
                        {seleccionado && productoExpandido === producto.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-5"
                          >
                            <p className="text-xs text-gray-400 mb-2">Salsas disponibles:</p>
                            <div className="flex flex-wrap gap-2">
                              {salsasDisponibles.map((salsa) => (
                                <motion.button
                                  key={salsa}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSalsa(producto.id, salsa);
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`px-3 py-1 rounded-full text-xs transition-all
                                    ${seleccionado.salsas.includes(salsa)
                                      ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/30'
                                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}
                                  `}
                                >
                                  {salsa}
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {productosSeleccionados.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="fixed bottom-6 left-0 right-0 flex justify-center z-30"
            >
              <Button
                onClick={() => router.push('/ticket')}
                className="bg-gradient-to-r from-orange-500 to-fuchsia-500 hover:from-teal-600 hover:to-green-700 text-black px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:shadow-amber-500/40 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <FiShoppingCart size={20} />
                Ver Pedido ({productosSeleccionados.length})
              </Button>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}