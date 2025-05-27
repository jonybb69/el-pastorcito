import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProductoEnCarrito {
  producto: any;
  id: number;
  nombre: string;
  precio: number;
  salsas: string[];
  cantidad: number;
}

interface CarritoState {
  carrito: ProductoEnCarrito[];
  agregarProducto: (producto: ProductoEnCarrito) => void;
  eliminarProducto: (productoId: number) => void;
  vaciarCarrito: () => void;
  setCarrito: (productos: ProductoEnCarrito[]) => void;
  productos: ProductoEnCarrito[];
  total: number;
  limpiarCarrito: () => void;
}

export const useCarritoStore = create<CarritoState>()(
  persist(
    (set) => ({
      productos: [],
  total: 0,
  limpiarCarrito: () => set({ productos: [], total: 0 }),
      carrito: [],
      agregarProducto: (producto) =>
        set((state) => ({
          carrito: [...state.carrito, producto],
        })),
      eliminarProducto: (productoId) =>
        set((state) => ({
          carrito: state.carrito.filter((producto) => producto.id !== productoId),
        })),
      vaciarCarrito: () => set({ carrito: [] }),
      setCarrito: (productos) => set({ carrito: productos }),
    }),
    {
      name: 'carrito-storage',
    }
  )
);
