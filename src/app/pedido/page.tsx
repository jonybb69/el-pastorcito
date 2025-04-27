'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { usePedidoStore } from '@/lib/store'

const productos = [
  { id: 1, nombre: 'Tacos al pastor', precio: 15 },
  { id: 2, nombre: 'Quesadilla de bistec', precio: 25 },
  { id: 3, nombre: 'Gringa', precio: 35 },
]

const salsasDisponibles = ['Verde', 'Roja', 'Mango habanero', 'Ninguna']

export default function PedidoPage() {
  const [pedido, setPedido] = useState<
    { id: number; nombre: string; salsas: string[] }[]
  >([])

  const router = useRouter()

  const toggleProducto = (producto: { id: number; nombre: string }) => {
    const existe = pedido.find((item) => item.id === producto.id)
    if (existe) {
      setPedido(pedido.filter((item) => item.id !== producto.id))
    } else {
      setPedido([...pedido, { ...producto, salsas: [] }])
    }
  }

  const toggleSalsa = (productoId: number, salsa: string) => {
    setPedido((prev) =>
      prev.map((item) =>
        item.id === productoId
          ? {
              ...item,
              salsas: item.salsas.includes(salsa)
                ? item.salsas.filter((s) => s !== salsa)
                : [...item.salsas, salsa],
            }
          : item
      )
    )
  }

  const enviarPedido = async () => {
    if (pedido.length === 0) return alert('Selecciona al menos un producto')

    // Aquí enviarías a tu API con fetch o algo real
    console.log('Pedido enviado:', pedido)
    sessionStorage.setItem('pedido', JSON.stringify(pedido))
    usePedidoStore.getState().agregarPedido(pedido)
    router.push('/resumen') // Muestra la siguiente pantalla
  }

  return (
    <section className="max-w-2xl mx-auto mt-10 p-6 bg-white/5 rounded-xl shadow-md text-white">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold text-yellow-400 mb-6 text-center"
      >
        Elige tus antojitos
      </motion.h2>

      <div className="space-y-6">
        {productos.map((producto) => {
          const seleccionado = pedido.find((p) => p.id === producto.id)

          return (
            <motion.div
              key={producto.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`p-4 border rounded-xl ${
                seleccionado
                  ? 'border-yellow-400 bg-yellow-500/10'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-lg font-semibold">{producto.nombre}</span>
                <input
                  type="checkbox"
                  checked={!!seleccionado}
                  onChange={() => toggleProducto(producto)}
                  className="h-5 w-5 accent-yellow-500"
                />
              </label>

              {seleccionado && (
                <div className="mt-3">
                  <p className="text-sm text-white/70 mb-1">Selecciona tus salsas:</p>
                  <div className="flex flex-wrap gap-2">
                    {salsasDisponibles.map((salsa) => (
                      <button
                        key={salsa}
                        type="button"
                        onClick={() => toggleSalsa(producto.id, salsa)}
                        className={`px-3 py-1 rounded-full border text-sm transition-all
                          ${
                            seleccionado.salsas.includes(salsa)
                              ? 'bg-yellow-500 text-black border-yellow-400'
                              : 'bg-black/30 text-white/70 border-white/10 hover:border-white/20'
                          }`}
                      >
                        {salsa}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      <div className="mt-8 text-center">
        <Button onClick={enviarPedido}>Enviar pedido</Button>
      </div>
    </section>
  )
}
