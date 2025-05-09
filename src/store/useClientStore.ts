import { create } from 'zustand'

export interface Cliente {
  id: string
  nombre: string
  telefono: string
  direccion: string
}

interface ClienteState {
  clientes: Cliente[]
  cliente: Cliente | null
  metodoPago: string;
  agregarCliente: (nuevoCliente: Cliente) => void
  setCliente: (cliente: Cliente) => void
  resetCliente: () => void
  setMetodoPago: (metodo: string) => void;
}

export const useClientStore = create<ClienteState>((set) => ({
  clientes: [],
  cliente: null,
  agregarCliente: (nuevoCliente) =>
    set((state) => ({
      clientes: [...state.clientes, nuevoCliente],
    })),
  setCliente: (cliente) => set({ cliente }),
  resetCliente: () => set({ cliente: null }),
  metodoPago: '',
  setMetodoPago: (metodo) => set({ metodoPago: metodo }),
}))
