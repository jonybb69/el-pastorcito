'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

export default function GraciasPage() {
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[70vh] gap-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl font-bold text-yellow-400 drop-shadow"
      >
        ¡Gracias por tu pedido! 🌮
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-white/80 max-w-xl"
      >
        Tu orden ha sido enviada al equipo de cocina. En breve recibirás tu deliciosa comida.
      </motion.p>

      <Link href="/">
        <Button className="bg-red-600 hover:bg-yellow-500 text-white font-semibold text-lg px-6 py-3 rounded-2xl shadow-md transition-all duration-300">
          Volver al inicio
        </Button>
      </Link>
    </section>
  )
}
