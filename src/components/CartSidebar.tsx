import React from 'react'
import { useCarritoStore } from '../store/useCarritoStore'

const CartSidebar = () => {
  const productos = useCarritoStore((state) => state.productos)
  const total = useCarritoStore((state) => state.total)
  const limpiarCarrito = useCarritoStore((state) => state.limpiarCarrito)

  return (
    <div className="fixed top-0 right-0 bg-white w-80 p-4 shadow-xl z-50">
      <h2 className="text-xl font-semibold">Carrito</h2>
      {productos.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <div>
          <ul>
            {productos.map((producto) => (
              <li key={producto.id} className="flex justify-between items-center mt-2">
                <span>{producto.nombre}</span>
                <span>${producto.precio}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-lg font-bold">Total: ${total}</p>
          <button
            onClick={limpiarCarrito}
            className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Limpiar carrito
          </button>
        </div>
      )}
    </div>
  )
}

export default CartSidebar
