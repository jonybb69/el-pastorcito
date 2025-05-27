'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiRefreshCw, FiFilter } from 'react-icons/fi';
import { toast } from 'sonner';

type Producto = {
  id: string;
  nombre: string;
  categoria: string;
  stock: number;
  stockMinimo: number;
  unidad: string;
  proveedor: string;
  costo: number;
  precio: number;
  estado: 'disponible' | 'agotado' | 'bajo';
  ultimaActualizacion: string;
};

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<string>('todos');
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    setCargando(true);
    try {
      // Simulación de datos mientras se implementa la API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const datosSimulados: Producto[] = [
        {
          id: '1',
          nombre: 'Tortillas de Maíz',
          categoria: 'Ingredientes',
          stock: 120,
          stockMinimo: 50,
          unidad: 'paquete',
          proveedor: 'Tortillería La Michoacana',
          costo: 12.50,
          precio: 0,
          estado: 'disponible',
          ultimaActualizacion: '2023-05-15'
        },
        {
          id: '2',
          nombre: 'Carne Al Pastor',
          categoria: 'Carnes',
          stock: 8,
          stockMinimo: 15,
          unidad: 'kg',
          proveedor: 'Carnicería Don José',
          costo: 125,
          precio: 0,
          estado: 'bajo',
          ultimaActualizacion: '2023-05-16'
        },
        {
          id: '3',
          nombre: 'Piña',
          categoria: 'Frutas',
          stock: 5,
          stockMinimo: 3,
          unidad: 'unidad',
          proveedor: 'Frutas y Verduras Frescas',
          costo: 35,
          precio: 0,
          estado: 'disponible',
          ultimaActualizacion: '2023-05-14'
        },
        {
          id: '4',
          nombre: 'Cerveza Modelo',
          categoria: 'Bebidas',
          stock: 0,
          stockMinimo: 24,
          unidad: 'botella',
          proveedor: 'Distribuidora Cervecera',
          costo: 18,
          precio: 35,
          estado: 'agotado',
          ultimaActualizacion: '2023-05-10'
        },
        {
          id: '5',
          nombre: 'Salsa Roja',
          categoria: 'Salsas',
          stock: 25,
          stockMinimo: 10,
          unidad: 'litro',
          proveedor: 'Elaboración Propia',
          costo: 45,
          precio: 0,
          estado: 'disponible',
          ultimaActualizacion: '2023-05-16'
        }
      ];

      setProductos(datosSimulados);
    } catch (error) {
      toast.error('Error al cargar el inventario');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const productosFiltrados = productos.filter(producto => {
    // Filtro por búsqueda
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                           producto.categoria.toLowerCase().includes(busqueda.toLowerCase());
    
    // Filtro por estado
    const coincideFiltro = filtro === 'todos' || producto.estado === filtro;
    
    return coincideBusqueda && coincideFiltro;
  });

  const handleEliminar = (id: string) => {
    toast.success('Producto eliminado (simulación)');
    setProductos(productos.filter(p => p.id !== id));
  };

  const handleGuardar = () => {
    if (productoEditando) {
      toast.success('Producto actualizado (simulación)');
    } else {
      toast.success('Producto agregado (simulación)');
    }
    setMostrarFormulario(false);
    setProductoEditando(null);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'bajo': return 'bg-yellow-100 text-yellow-800';
      case 'agotado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen rounded-lg bg-gray-300 p-10">
      <div className="max-w-7xl text-gray-800 mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
            <p className="text-gray-600">Control de existencias y suministros</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                setProductoEditando(null);
                setMostrarFormulario(true);
              }}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-800 px-4 py-2 rounded-lg shadow-md transition-colors"
            >
              <FiPlus /> Nuevo Producto
            </button>
            
            <button
              onClick={cargarInventario}
              className="flex items-center gap-2 bg-white border border-green-600 hover:bg-teal-800/60 text-indigo-800 px-4 py-2 rounded-lg shadow-sm transition-colors"
            >
              <FiRefreshCw /> Actualizar
            </button>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar productos..."
                className="pl-10 pr-4 py-2 w-full border border-gray-400 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-amber-500"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-500" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="disponible">Disponible</option>
                <option value="bajo">Stock Bajo</option>
                <option value="agotado">Agotado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de inventario */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {cargando ? (
            <div className="p-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proveedor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Actualización
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-black">
                  {productosFiltrados.map((producto) => (
                    <tr key={producto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{producto.nombre}</div>
                        <div className="text-sm text-gray-500">{producto.unidad}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {producto.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {producto.stock} / {producto.stockMinimo}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              producto.stock === 0 ? 'bg-red-500' :
                              producto.stock < producto.stockMinimo ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{
                              width: `${Math.min(100, (producto.stock / (producto.stockMinimo * 1.5)) * 100)}%`
                            }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {producto.proveedor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(producto.estado)}`}>
                          {producto.estado === 'disponible' ? 'Disponible' : 
                           producto.estado === 'bajo' ? 'Stock Bajo' : 'Agotado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {producto.ultimaActualizacion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setProductoEditando(producto);
                              setMostrarFormulario(true);
                            }}
                            className="text-amber-600 hover:text-amber-900"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => handleEliminar(producto.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Resumen */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
            <h3 className="font-medium text-gray-500">Disponibles</h3>
            <p className="text-2xl font-bold text-gray-900">
              {productos.filter(p => p.estado === 'disponible').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
            <h3 className="font-medium text-gray-500">Stock Bajo</h3>
            <p className="text-2xl font-bold text-gray-900">
              {productos.filter(p => p.estado === 'bajo').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
            <h3 className="font-medium text-gray-500">Agotados</h3>
            <p className="text-2xl font-bold text-gray-900">
              {productos.filter(p => p.estado === 'agotado').length}
            </p>
          </div>
        </div>
      </div>

      {/* Modal de formulario */}
      <AnimatePresence>
        {mostrarFormulario && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-black mb-4">
                  {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                
                <div className="text-gray-800 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      defaultValue={productoEditando?.nombre || ''}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                        <option>Ingredientes</option>
                        <option>Carnes</option>
                        <option>Bebidas</option>
                        <option>Salsas</option>
                        <option>Frutas</option>
                        <option>Otros</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        defaultValue={productoEditando?.unidad || ''}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Actual</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        defaultValue={productoEditando?.stock || 0}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        defaultValue={productoEditando?.stockMinimo || 0}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      defaultValue={productoEditando?.proveedor || ''}
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setMostrarFormulario(false);
                      setProductoEditando(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGuardar}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}