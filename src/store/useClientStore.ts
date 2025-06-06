import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  direccion: string;
}

interface ClienteState {
  clientes: Cliente[];
  cliente: Cliente | null;
  metodoPago: string;
  actualizarCliente: () => void;
  agregarCliente: (nuevoCliente: Cliente) => void;
  setCliente: (cliente: Cliente) => void;
  resetCliente: () => void;
  setMetodoPago: (metodo: string) => void;
}

export const useClientStore = create<ClienteState>()(
  persist(
    (set) => ({
      clientes: [],
      cliente: null,
      actualizarCliente:() => set({ cliente: null }),
      metodoPago: '',
      agregarCliente: (nuevoCliente) =>
        set((state) => ({
          clientes: [...state.clientes, nuevoCliente],
        })),
      setCliente: (cliente) => set({ cliente }),
      resetCliente: () => set({ cliente: null }),
      setMetodoPago: (metodo) => set({ metodoPago: metodo }),
    }),
    {
      name: 'client-storage',
    }
  )
);
