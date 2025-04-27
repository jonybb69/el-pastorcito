import { create } from 'zustand'

interface Producto {
  nombre: string
  salsas: string[]
}

interface PedidoStore {
  pedido: Producto[]
  agregarPedido: (productos: Producto[]) => void
  limpiarPedido: () => void
}

export const usePedidoStore = create<PedidoStore>((set) => ({
  pedido: [],
  agregarPedido: (productos) => set({ pedido: productos }),
  limpiarPedido: () => set({ pedido: [] }),
}))
