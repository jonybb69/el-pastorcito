'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[60vh] gap-10">
       {/* ✅ Logo como marca de agua centrada */}
       <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3.5, delay:0.5 }}
        className="absolute inset-0 z-0 flex items-center justify-self min-h-[95vh]  gap-8"
      >
        <img
          src="/logo-4.png"
          alt="Marca de agua El Pastorcito"
          className="w-[36%] flex max-w-2xl blur-[0px] gap-8"
        />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.5 }}
        className="text-5xl sm:text-1.2xl font-bold text-white drop-shadow gao-8"
      >
        ¡Bienvenido a El Pastorcito! 🌮
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 2, y: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="font-semibold text-white sm:text-1.1xl  max-w-xl drop-shadow grap-8"
      >
        Disfruta de los mejores tacos y antojitos desde la comodidad de tu hogar.  
        Haz tu pedido fácil, rápido y con el sabor que tanto te gusta.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="font-bold flex flex-col sm:flex-2xl gap-6"
      >
        <Link href="/nuevo-cliente">
          <Button className="bg-red-700 hover:bg-orange-600 font-semibold text-white px-6 py-7 rounded-2xl drop-shadow transition-colors">
            Registrarme Para Pedir 🍽️
          </Button>
        </Link>

        <Link href="/clientes/login">
          <Button className="bg-orange-600 hover:bg-red-700 font-semibold text-white px-6 py-7 rounded-2xl drop-shadow transition-colors">
            Ingresar Con El Celular 📱
         </Button>
       </Link>

      </motion.div>
    </section>
  )
}
