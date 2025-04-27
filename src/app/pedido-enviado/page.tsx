'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function PedidoEnviadoPage() {
  return (
    <section className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-2xl text-center">
      <CheckCircle className="text-green-500 mx-auto" size={64} aria-hidden="true" />
      
      <h1 className="text-3xl font-extrabold mt-4 text-green-700">
        ¡Pedido enviado con éxito!
      </h1>
      
      <p className="text-gray-600 mt-3 text-base leading-relaxed">
        Gracias por ordenar con <strong>El Pastorcito</strong>. Estamos preparando tu pedido con mucho sabor 🌮
      </p>

      <div className="flex justify-center mt-6">
        <Image
          src="/taco-feliz.png"
          alt="Taco feliz"
          width={140}
          height={140}
          className="rounded-full shadow-md"
        />
      </div>

      <Link
        href="/gracias"
        className="inline-block mt-8 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-xl text-lg transition-all"
      >
        Volver al inicio
      </Link>
    </section>
  )
}
