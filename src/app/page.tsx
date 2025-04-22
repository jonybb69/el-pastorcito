'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[70vh] gap-6">
       {/* ✅ Logo como marca de agua centrada */}
       <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none"
      >
        <img
          src="/logo-4.png"
          alt="Marca de agua El Pastorcito"
          className="w-[60%] max-w-6xl object-contain blur-[3px]"
        />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.5 }}
        className="text-4xl sm:text-5xl font-bold text-white drop-shadow"
      >
        ¡Bienvenido a El Pastorcito! 🌮
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="text-white/80 max-w-xl drop-shadow"
      >
        Disfruta de los mejores tacos y antojitos desde la comodidad de tu hogar.  
        Haz tu pedido fácil, rápido y con el sabor que tanto te gusta.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 2 }}
        animate={{ opacity: 0.9, scale: 1.2 }}
        transition={{ duration: 1.5, delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-6"
      >
        <Link href="/nuevo-cliente">
          <Button className="bg-red-600 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition">
            Soy nuevo 🍽️
          </Button>
        </Link>

        <Link href="/cliente-registrado">
          <Button className="bg-yellow-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition">
            Ya tengo número 📱
          </Button>
        </Link>
      </motion.div>
    </section>
  )
}

