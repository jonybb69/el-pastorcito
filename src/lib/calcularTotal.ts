// lib/calcularTotal.ts

import { Producto, Salsa } from '@/types/pedido'

export function calcularTotal(
  productosSeleccionados: { producto: Producto; cantidad: number }[],
  salsasSeleccionadas: Salsa[]
): number {
  const totalProductos = productosSeleccionados.reduce((total, item) => {
    const subtotal = item.producto.precio * item.cantidad
    return total + subtotal
  }, 0)

  const totalSalsas = salsasSeleccionadas.reduce((total, salsa) => {
    return total + (salsa.precio || 0)
  }, 0)

  return totalProductos + totalSalsas
}
