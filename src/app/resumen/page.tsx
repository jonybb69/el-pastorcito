'use client'

import { usePedidoStore } from '@/store/usePedidoStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function ResumenPage() {
  const {
    cliente,
    productos,
    metodoPago,
    getTotal,
  } = usePedidoStore()

  const router = useRouter()
  const total = getTotal()

  useEffect(() => {
    if (!cliente || productos.length === 0 || !metodoPago) {
      toast.warning("No hay información de pedido")
      router.push("/menu") // Redirige si no hay datos
    }
  }, [cliente, productos, metodoPago, router])

  return (
    <section className="max-w-3xl mx-auto py-12 px-6 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">Resumen del Pedido</h2>

      <div className="space-y-4">
        <p><strong>Cliente:</strong> {cliente?.nombre}</p>
        <p><strong>Método de pago:</strong> {metodoPago}</p>

        <h3 className="text-xl font-semibold mt-6">Productos:</h3>
        <ul className="list-disc ml-6">
          {productos.map((item, i) => (
            <li key={i}>
              {item.cantidad}x {item.nombre} - ${item.producto.precio * item.cantidad}
              {item.salsas.length > 0 && (
                <span className="ml-2 text-sm text-white/70">
                  [Salsas: {item.salsas.join(', ')}]
                </span>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-lg font-bold">Total: ${total}</p>
      </div>
    </section>
  )
}
