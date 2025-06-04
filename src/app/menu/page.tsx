'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { toast } from 'sonner';
import { usePedidoStore } from '@/store/usePedidoStore';
import { FiMenu, FiX, FiMapPin, FiInfo, FiMail, FiShoppingCart, FiChevronDown, FiChevronUp, FiCheck, FiUser } from 'react-icons/fi';
import { useClientStore } from '@/store/useClientStore';
import ClientInfoCard from '@/components/ClientInfoCard';

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: 'platillos' | 'bebidas';
  descripcion?: string;
  tiempoPreparacion?: string;
  destacado?: boolean;
};

type Salsa = {
  id: number;
  nombre: string;
  picor: 'suave' | 'medio' | 'fuerte';
};

export default function MenuPage() {
  const cliente = useClientStore();
  const {
    productos: productosSeleccionados,
    addProducto,
    removeProducto,
  } = usePedidoStore();

  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [salsasDisponibles, setSalsasDisponibles] = useState<Salsa[]>([]);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState<'platillos' | 'bebidas'>('platillos');
  const [productoExpandido, setProductoExpandido] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cliente) {
      router.push('/clientes/login')
    }
  }, [cliente, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productosRes, salsasRes] = await Promise.all([
          fetch('/api/productos'),
          fetch('/api/salsas')
        ]);

        if (!productosRes.ok || !salsasRes.ok) throw new Error('Error al cargar datos');

        const productosData = await productosRes.json();
        const salsasData = await salsasRes.json();

        setProductos(productosData);
        setSalsasDisponibles(salsasData);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al cargar el menú');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!cliente) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando...</p>
      </div>
    )
  }

  function toggleProducto(producto: Producto) {
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
  }

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
    <div className="relative min-h-screen">
      {/* Fondo texturizado */}
      <div className="absolute inset-0 bg-[url('/textura-mexicana.png')] opacity-5 mix-blend-overlay z-0"></div>
      
 {/* Overlay para móviles */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuAbierto(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

  {/* Botón de menú móvil */}
         <button
            onClick={() => setMenuAbierto(true)}
            className="fixed top-21 left-5 z-50 bg-black/80 hover:bg-teal-700 text-white p-3 rounded-full shadow-lg hover:shadow-black transition-all"
          >
           {menuAbierto ? <FiX size={20} /> : <FiMenu size={20} />}
         </button>

      {/* Panel lateral - modificado para asegurar visibilidad */}
      <motion.div 
        initial={ false }
        animate={{ x: menuAbierto ? 0 : -300 ,
        boxShadow: menuAbierto ? '10px 0 30px rgba(234, 179, 8, 0.3)' : 'none'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-3 left-3 h-29/30 w-72 rounded-xl bg-cyan-900/30 backdrop-blur-lg z-50 border-r border-white/40 shadow-xl"
      >
        
        <div className="p-6 h-full flex flex-col">
          <button 
            onClick={() => setMenuAbierto(false)}
            className="self-end text-white hover:text-black transition mb-8"
          >
            <FiX size={20} />
          </button>
          
          <nav className="flex-1 space-y-2">
            <div className="mb-4">
              <h3 className="text-xs uppercase tracking-wider text-gray-800 mb-6 px-4">Menú</h3>
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setCategoriaActiva('platillos');
                  setMenuAbierto(false);
                }}
                className={`flex items-center justify-between w-full text-left mb-3 px-4 py-3 rounded-lg transition ${categoriaActiva === 'platillos' ? 'bg-teal-600/70 shadow-lg hover:shadow-black text-black font-medium' : 'hover:bg-cyan-700/70 text-gray-300'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌮</span>
                  <span>Platillos</span>
                </div>
                {categoriaActiva === 'platillos' && <span className="text-xs bg-black/20 px-2 py-1 rounded-full">{productos.filter(p => p.categoria === 'platillos').length}</span>}
              </motion.button>
              
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setCategoriaActiva('bebidas');
                  setMenuAbierto(false);
                }}
                className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-lg transition ${categoriaActiva === 'bebidas' ? 'bg-teal-700 text-black font-medium' : 'hover:bg-cyan-700 text-gray-300'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🍹</span>
                  <span>Bebidas</span>
                </div>
                {categoriaActiva === 'bebidas' && <span className="text-xs bg-black/20 px-2 py-1 rounded-full">{productos.filter(p => p.categoria === 'bebidas').length}</span>}
              </motion.button>
            </div>

            <div className="border-t-2 border-teal-700 my-2"></div>
            
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider text-gray-800 mb-3 px-4">Información</h3>
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/acerca-de')}
                className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 transition"
              >
                <FiInfo className="text-amber-400" size={18} />
                <span>Acerca de</span>
              </motion.button>
              
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/contacto')}
                className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 transition"
              >
                <FiMail className="text-amber-400" size={18} />
                <span>Contáctenos</span>
              </motion.button>
              
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={abrirGoogleMaps}
                className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 transition"
              >
                <FiMapPin className="text-amber-400" size={18} />
                <span>Ubicación</span>
              </motion.button>
            </div>
          </nav>
          
          <div className="mt-auto pt-6 border-t border-gray-800">
            <p className="text-amber-400 text-sm font-medium">El Pastorcito</p>
            <p className="text-gray-500 text-xs">Sucursal Ejido, Acapulco</p>
          </div>
        </div>
      </motion.div>

      {/* Contenido principal */}
      <div className={`relative z-10 min-h-full transition-all duration-300 ${
        menuAbierto ? 'ml-0 md:ml-72' : 'ml-0'
      }`}>

        <ClientInfoCard cliente={cliente} router={router} />
        {/* Icono y Etiqueta */}
        <div className='flex items text-transparent'>
          <FiUser className="" size={0} />
        {cliente.cliente?.nombre || 'No registrado'}
        {cliente.cliente?.telefono || 'No registrado'}
        {cliente.cliente?.direccion || 'No registrado'}
        </div>
      </div>

        {/* Botón de categorías para móvil */}
        <div className="fixed top-4 right-4 z-40 md:hidden">
          <select
            value={categoriaActiva}
            onChange={(e) => setCategoriaActiva(e.target.value as 'platillos' | 'bebidas')}
            className="bg-gray-800 text-black border border-gray-700 rounded-lg px-3 py-2 text-sm shadow"
          >
            <option value="platillos">Platillos</option>
            <option value="bebidas">Bebidas</option>
          </select>
        </div>

        <section className="max-w-7xl mx-auto px-4 pt-24 pb-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 px-4"
          >
            <h2 className="text-bordered text-4xl md:text-5xl text-shadow-md font-extrabold text-cyan-800 mb-3">
              {categoriaActiva === 'platillos' ? 'Nuestros Platillos' : 'Bebidas Refrescantes'}
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {categoriaActiva === 'platillos' 
                ? 'Deléitate con nuestros auténticos sabores mexicanos' 
                : 'Acompaña tu comida con nuestras bebidas tradicionales'}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
              {productosFiltrados.map((producto) => {
                const seleccionado = productosSeleccionados.find((p) => p.id === String(producto.id));
                const esBebida = producto.categoria === 'bebidas';

                return (
                  <motion.div
                    key={producto.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <div
                      className={`rounded-lg overflow-hidden shadow-sm cursor-pointer group transition-all duration-300 h-full flex flex-col border border-black/10 bg-black/30
                        ${seleccionado ? 'ring-2 ring-black' : 'hover:ring-1 hover:ring-black/50'}
                      `}
                    >
                      <div className="relative overflow-hidden h-40">
                        <Image
                          src={`/productos/${producto.imagen}`}
                          alt={producto.nombre}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                          <p className="text-white text-xs line-clamp-2">{producto.descripcion || 'Delicioso platillo tradicional'}</p>
                        </div>
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleProducto(producto);
                            }}
                            className={`p-1.5 rounded-full backdrop-blur-sm transition-all shadow
                              ${seleccionado 
                                ? 'bg-amber-500 text-black' 
                                : 'bg-black/40 text-white hover:bg-black/70 hover:text-white'}
                            `}
                          >
                            {seleccionado ? <FiCheck size={16} /> : '+'}
                          </button>
                        </div>
                      </div>
                      

                      <div className="p-3 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-sm font-semibold text-white/80 line-clamp-1">{producto.nombre}</h3>
                          <p className="text-black hover:text-cyan-800 font-bold text-sm">${producto.precio}</p>
                        </div>

                        {producto.tiempoPreparacion && (
                          <p className="text-xs text-gray-500 mb-2">⏱️ {producto.tiempoPreparacion}</p>
                        )}

                        <AnimatePresence>
                          {seleccionado && productoExpandido === producto.id && !esBebida && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-2"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-medium text-rose-600">Salsas:</p>
                                <button 
                                  onClick={() => setProductoExpandido(null)}
                                  className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                  <FiChevronUp size={14} />
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {salsasDisponibles.map((salsa) => (
                                  <motion.button
                                    key={salsa.id}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSalsa(producto.id, salsa.nombre);
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-2 py-0.5 shadow-xl hover:shadow-black rounded-full text-[10px] transition-all
                                      ${seleccionado.salsas.includes(salsa.nombre)
                                        ? `bg-cyan-700 text-white shadow-sm`
                                        : `bg-gray-100 text-black hover:bg-gray-200`}
                                      ${salsa.picor === 'fuerte' ? 'border-l border-red-500' : 
                                        salsa.picor === 'medio' ? 'border-l border-orange-400' : 
                                        'border-l-2 border-cyan-900'}
                                    `}
                                  >
                                    {salsa.nombre}
                                  </motion.button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {seleccionado && productoExpandido !== producto.id && (
                          <button 
                            onClick={() => setProductoExpandido(producto.id)}
                            className="mt-1 text-xs text-amber-600 hover:text-amber-700 flex items-center justify-end gap-0.5"
                          >
                            {!esBebida && 'Personalizar'} <FiChevronDown size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Botón flotante del carrito */}
        {productosSeleccionados.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="fixed bottom-6 right-6 z-30"
          >
            <Button
              onClick={() => router.push('/ticket')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:shadow-amber-500/30 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <div className="relative">
                <FiShoppingCart size={18} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {productosSeleccionados.length}
                </span>
              </div>
              <span>Ver Pedido</span>
            </Button>
          </motion.div>
        )}
      </div>
  );
}