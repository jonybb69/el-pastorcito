import { create } from 'zustand'

interface Producto {
  id: string
  nombre: string
  precio: number
}

interface PedidoState {
  productos: Producto[]
  agregarProducto: (producto: Producto) => void
  quitarProducto: (id: string) => void
  limpiarPedido: () => void
}

export const usePedidoStore = create<PedidoState>((set) => ({
  productos: [],
  agregarProducto: (producto) =>
    set((state) => ({
      productos: [...state.productos, producto]
    })),
  quitarProducto: (id) =>
    set((state) => ({
      productos: state.productos.filter((p) => p.id !== id)
    })),
  limpiarPedido: () => set({ productos: [] }),
}))
