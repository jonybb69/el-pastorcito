// store/usePedidoStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipo de producto seleccionado
type ProductoSeleccionado = {
  destacado: boolean;
  id: string;
  nombre: string;
  producto: { id: string; nombre: string; precio: number };
  cantidad: number;
  salsas: string[];
};

// Tipo de cliente
type Cliente = {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
};

// Estado de la tienda
type PedidoStore = {
  productos: ProductoSeleccionado[];
  cliente: Cliente | null;
  metodoPago: string;
  toggleDestacado: (productoId: string) => void;
  
  setMetodoPago: (metodo: string) => void;
  setCliente: (cliente: Cliente) => void;
  addProducto: (producto: ProductoSeleccionado) => void;
  removeProducto: (index: number) => void;
  limpiarPedido: () => void;
  getTotal: () => number;
};

export const usePedidoStore = create<PedidoStore>()(
  persist(
    (set, get) => ({
      productos: [],
      cliente: null,
      metodoPago: 'efectivo',

      // Establecer método de pago
      setMetodoPago: (metodo) => set({ metodoPago: metodo }),

      // Establecer cliente
      setCliente: (cliente) => set({ cliente }),

      // Agregar producto
      addProducto: (producto) =>
        set((state) => ({ productos: [...state.productos, producto] })),

      // Alternar estado destacado de un producto
      toggleDestacado: (productoId: string): void =>
        set((state) => {
          const nuevosProductos: ProductoSeleccionado[] = state.productos.map((item: ProductoSeleccionado) => {
        if (item.producto.id === String(productoId)) {
          return {
            ...item,
            destacado: !item.destacado,
          };
        }
        return item;
          });
          return { productos: nuevosProductos };
        }),

      // Eliminar producto por índice
      removeProducto: (index) =>
        set((state) => {
          const nuevos = [...state.productos];
          nuevos.splice(index, 1);
          return { productos: nuevos };
        }),

      // Limpiar pedido completo
      limpiarPedido: () =>
        set({
          productos: [],
          cliente: null,
          metodoPago: 'efectivo',
        }),

      // Calcular total del pedido
      getTotal: () => {
        const { productos } = get();
        return productos.reduce(
          (total, item) => total + item.cantidad * item.producto.precio,
          0
        );
      },
    }),
    {
      name: 'pedido-storage', // Nombre para almacenamiento persistente en localStorage
    }
  )
);
