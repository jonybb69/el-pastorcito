'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { usePedidoStore } from '@/lib/store'

export default function ResumenPage() {
  const router = useRouter()
  const { pedido, limpiarPedido } = usePedidoStore()

  const confirmar = async () => {
    try {
      await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
      })

      limpiarPedido()
      router.push('/gracias')
    } catch (err) {
      alert('Hubo un error al confirmar el pedido')
    }
  }

  return (
    <section className="max-w-2xl mx-auto mt-10 p-6 bg-white/5 rounded-xl shadow-md text-white">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold text-yellow-400 mb-6 text-center"
      >
        Resumen de tu pedido
      </motion.h2>

      {pedido.length === 0 ? (
        <p className="text-center text-white/60">No hay productos en tu pedido.</p>
      ) : (
        <div className="space-y-4">
          {pedido.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="p-4 border border-white/10 rounded-lg bg-black/20"
            >
              <p className="text-lg font-semibold">{item.nombre}</p>
              <p className="text-sm text-white/70">
                Salsas: {item.salsas.length > 0 ? item.salsas.join(', ') : 'Ninguna'}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Button onClick={confirmar}>Confirmar pedido</Button>
      </div>
    </section>
  )
}
