import React from 'react'
import { useCarritoStore } from '@/store/useCarritoStore'

const MenuProductCard = ({ producto }: { producto: any }) => {
  const agregarProducto = useCarritoStore((state) => state.agregarProducto)

  const handleAddToCart = () => {
    agregarProducto(producto)
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
      <img src={producto.imagen} alt={producto.nombre} className="w-full h-48 object-cover rounded-lg" />
      <h3 className="mt-2 text-lg font-semibold">{producto.nombre}</h3>
      <p className="text-gray-500">{producto.descripcion}</p>
      <p className="mt-2 text-xl font-bold">${producto.precio}</p>
      <button
        onClick={handleAddToCart}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Agregar al carrito
      </button>
    </div>
  )
}

export default MenuProductCard
