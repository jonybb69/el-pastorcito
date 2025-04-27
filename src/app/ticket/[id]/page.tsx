'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function TicketPage() {
  const { id } = useParams()
  const [pedido, setPedido] = useState<any>(null)

  useEffect(() => {
    const fetchPedido = async () => {
      const res = await fetch(`/api/pedidos/${id}`)
      const data = await res.json()
      setPedido(data)
    }

    fetchPedido()
  }, [id])

  const imprimirTicket = () => {
    window.print()
  }

  if (!pedido) return <p className="text-center mt-20">Cargando ticket...</p>

  return (
    <section className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Ticket #{pedido.id}</h1>
      <p className="mb-2">Cliente: {pedido.cliente.nombre}</p>
      <p className="mb-2">Teléfono: {pedido.cliente.telefono}</p>
      <p className="mb-2">Dirección: {pedido.cliente.direccion}</p>
      <p className="mb-4">Método de pago: {pedido.metodoPago}</p>

      <ul className="border-t border-b py-4 my-4">
        {pedido.productos.map((prod: any, idx: number) => (
          <li key={idx} className="flex justify-between py-1">
            <span>{prod.producto.nombre}</span>
            <span>{prod.cantidad} x ${prod.producto.precio}</span>
          </li>
        ))}
      </ul>

      <p className="text-right font-bold">
        Total: $
        {pedido.productos.reduce(
          (acc: number, p: any) => acc + p.cantidad * p.producto.precio,
          0
        )}
      </p>

      <button
        onClick={imprimirTicket}
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl"
      >
        Imprimir Ticket
      </button>
    </section>
  )
}
