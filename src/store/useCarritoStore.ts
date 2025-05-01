import { create } from 'zustand';

// Tipo para los productos en el carrito
interface ProductoEnCarrito {
  id: number;
  nombre: string;
  precio: number;
  salsas: string[];
  cantidad: number;
}

// Tipo para el estado del carrito
interface CarritoState {
  limpiarCarrito: any;
  total: any;
  productos: any;
  carrito: ProductoEnCarrito[];
  agregarProducto: (producto: ProductoEnCarrito) => void;
  eliminarProducto: (productoId: number) => void;
  vaciarCarrito: () => void;
}

export const useCarritoStore = create<CarritoState>((set) => ({
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

  limpiarCarrito: () => set({ carrito: [] }),

  total: () =>
    set((state) => ({
      total: state.carrito.reduce(
        (acc, producto) => acc + producto.precio * producto.cantidad,
        0
      ),
    })),

  productos: () =>
    set((state) => ({
      productos: state.carrito.map((producto) => producto.nombre),
    })),
}));
