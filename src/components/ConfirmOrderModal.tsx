import React from 'react'
import { useCarritoStore } from '../store/useCarritoStore'
import { useRouter } from 'next/router'

const ConfirmOrderModal = () => {
  const productos = useCarritoStore((state) => state.productos)
  const total = useCarritoStore((state) => state.total)
  const limpiarCarrito = useCarritoStore((state) => state.limpiarCarrito)
  const router = useRouter()

  const handleConfirm = async () => {
    // Crear el pedido en la base de datos
    const response = await fetch('/api/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productos, total }),
    })

    if (response.ok) {
      // Limpiar el carrito y redirigir
      limpiarCarrito()
      router.push('/pedido-confirmado')
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold">Confirmar Pedido</h2>
        <ul className="mt-4">
          {productos.map((producto: { id: React.Key | null | undefined; nombre: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; precio: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined }) => (
            <li key={producto.id} className="flex justify-between items-center mt-2">
              <span>{producto.nombre}</span>
              <span>${producto.precio}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-lg font-bold">Total: ${total}</p>
        <button
          onClick={handleConfirm}
          className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Confirmar Pedido
        </button>
      </div>
    </div>
  )
}

export default ConfirmOrderModal
