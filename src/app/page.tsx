'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import Image from 'next/image'


export default function HomePage() {
  return (
    <div className="">
      {/* Fondo con gradiente animado */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-1/20 h-190 inset-0 z-0 bg-gradient-to-br from-amber-900 via-red-900 to-gray-900"
      >
        {/* Efecto de textura sutil */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
      </motion.div>

      
       {/* ✅ Logo como marca de agua centrada */}
       <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3.5, delay:0.5 }}
        className="absolute inset-0 z-0 flex items-center justify-self min-h-[95vh]  gap-8"
      >
        <Image
          src="/logo-4.png"
          alt="Marca de agua El Pastorcito"
          width={800}
          height={800}
          className="w-[36%] flex max-w-2xl blur-[0px] gap-8"
        />
      </motion.div>

      {/* Contenido principal */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-4 gap-8 sm:gap-8">
        {/* Título principal con animación mejorada */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "backOut" }}
          className="space-y-4"
        >
          <h1 className="text-4xl sm:text-6xl font-bold text-white drop-shadow-xl">
            ¡Bienvenido a <span className="text-amber-400">El Pastorcito</span>! 🌮
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl sm:text-2xl font-medium text-amber-100 max-w-2xl mx-auto drop-shadow"
          >
            Auténticos sabores mexicanos directamente a tu mesa
          </motion.p>
        </motion.div>

        {/* Descripción con animación escalonada */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2, delayChildren: 0.8 }}
          className="max-w-xl space-y-6"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg sm:text-xl text-white/90 font-light leading-relaxed drop-shadow"
          >
            Disfruta de los mejores tacos y antojitos con el auténtico sabor tradicional, 
            preparados al momento y entregados en tu domicilio.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg sm:text-xl text-white/90 font-light leading-relaxed drop-shadow"
          >
            Haz tu pedido de manera fácil, rápida y con la calidad que nos caracteriza.
          </motion.p>
        </motion.div>

        {/* Botones con animación mejorada */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-9 sm:gap-9 w-full max-w-md"
        >
          <Link href="/nuevo-cliente" className="w-full">
            <Button 
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white rounded-xl shadow-lg hover:shadow-red-500/30 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Registrarme Para Pedir 🍽️
              <FiArrowRight className="ml-2" />
            </Button>
          </Link>
          
          <Link href="/clientes/login" className="w-full">
            <Button 
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Ingresar Con Mi Celular 📱
              <FiArrowRight className="ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Efecto decorativo adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="absolute bottom-10 top-180 left-1/2 transform -translate-x-1/2  text-white text-xs"
        >
          🌶️ Auténtico sabor mexicano desde 1995 🌶️
        </motion.div>
      </section>
    </div>
  )
}