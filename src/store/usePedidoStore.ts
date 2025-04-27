import { create } from 'zustand'

interface Cliente {
  id: string
  nombre: string
  telefono: string
  direccion: string
}

export interface ProductoSeleccionado {
  nombre: string
  id: number
  producto: {
    id: string
    nombre: string
    precio: number
  }
  cantidad: number
  salsas: string[]
}

interface PedidoState {
  cliente: Cliente | null
  productos: ProductoSeleccionado[]
  metodoPago: string

  setCliente: (cliente: Cliente) => void
  addProducto: (producto: ProductoSeleccionado) => void
  removeProducto: (index: number) => void
  clearPedido: () => void
  setMetodoPago: (metodo: string) => void
}

export const usePedidoStore = create<PedidoState>((set) => ({
  cliente: null,
  productos: [],
  metodoPago: '',

  setCliente: (cliente) => set({ cliente }),
  addProducto: (producto) =>
    set((state) => ({ productos: [...state.productos, producto] })),
  removeProducto: (index) =>
    set((state) => {
      const nuevos = [...state.productos]
      nuevos.splice(index, 1)
      return { productos: nuevos }
    }),
  clearPedido: () => set({ cliente: null, productos: [], metodoPago: '' }),
  setMetodoPago: (metodo) => set({ metodoPago: metodo }),
}))
