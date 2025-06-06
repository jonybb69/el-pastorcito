// types/pedido.ts

export type Producto = {
  id: string
  nombre: string
  descripcion?: string
  precio: number
  disponible: boolean
}

export type Salsa = {
  id: string
  nombre: string
  picante: boolean
  precio?: number // opcional, algunas salsas pueden ser gratis
}

export type Cliente = {
  id?: string
  nombre: string
  telefono: string
  direccion?: string
}

export type MetodoPago = 'Efectivo' | 'Tarjeta' | 'Transferencia'

export type Pedido = {
  id?: string
  cliente: Cliente
  productos: {
    producto: Producto
    cantidad: number
  }[]
  salsas: Salsa[]
  metodoPago: MetodoPago
  total: number
  estado: EstadoPedido
  creadoEn?: Date
}

export type EstadoPedido = 'pendiente' | 'en preparación' | 'en camino' | 'entregado'
