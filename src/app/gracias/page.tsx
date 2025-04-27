'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GraciasPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 6000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-100 to-green-300">
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md">
        <h1 className="text-4xl font-bold text-green-700 mb-4">¡Gracias por tu pedido! 🌮</h1>
        <p className="text-lg text-gray-700 mb-6">
          Lo estamos preparando con mucho cariño, ¡ya vamos en camino!
        </p>
        <div className="animate-bounce text-4xl">🚚💨</div>
        <p className="mt-6 text-sm text-gray-500">
          Serás redirigido automáticamente al inicio...
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          Volver al inicio
        </button>
      </div>
    </section>
  )
}
