// store/usePedidoStore.ts
import { create } from 'zustand';

interface Cliente {
  id: any;
  nombre: string;
  telefono: string;
  direccion: string;
}

interface ProductoPedido {
  id: number;
  nombre: string;
  cantidad: number;
  salsas: string[];
  producto: {
    id: string;
    nombre: string;
    precio: number;
  };
}

interface PedidoState {
  cliente: Cliente | null;
  productos: ProductoPedido[];
  metodoPago: string;
  setCliente: (cliente: Cliente) => void;
  addProducto: (producto: ProductoPedido) => void;
  removeProducto: (index: number) => void;
  clearPedido: () => void;
  setMetodoPago: (metodo: string) => void;
  setPedidoEnviado: (estado: boolean) => void;
  pedidoEnviado: boolean;
  getTotal: () => number; // Add this line
}

export const usePedidoStore = create<PedidoState>((set, get) => ({
  cliente: null,
  productos: [],
  metodoPago: '',
  pedidoEnviado: false,
  setCliente: (cliente) => set({ cliente }),
  addProducto: (producto) =>
    set((state) => ({ productos: [...state.productos, producto] })),
  removeProducto: (index) =>
    set((state) => {
      const nuevos = [...state.productos];
      nuevos.splice(index, 1);
      return { productos: nuevos };
    }),
  clearPedido: () =>
    set({ cliente: null, productos: [], metodoPago: '', pedidoEnviado: false }),
  setMetodoPago: (metodo) => set({ metodoPago: metodo }),
  setPedidoEnviado: (estado) => set({ pedidoEnviado: estado }),
  getTotal: () => {
    const { productos } = get();
    return productos.reduce((total, item) => total + item.cantidad * item.producto.precio, 0);
  }, // Implement getTotal
}));
export const usePedidoStorePersisted = () => {
  const { setCliente, setMetodoPago, setPedidoEnviado, clearPedido } =
    usePedidoStore();

  return {
    setCliente,
    setMetodoPago,
    setPedidoEnviado,
    clearPedido,
  };
};