'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

export default function ClienteRegistradoPage() {
  const [telefono, setTelefono] = useState('')
  const router = useRouter()

  const buscarCliente = async () => {
    if (!telefono) return alert('Ingresa tu número')

    // Aquí puedes agregar validación real desde la BD
    router.push('/menu')
  }

  return (
    <section className="max-w-md mx-auto mt-10 p-6 bg-white/5 rounded-xl shadow-md text-white text-center">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold text-yellow-500 mb-4"
      >
        ¡Bienvenido de vuelta!
      </motion.h2>

      <input
        type="tel"
        placeholder="Tu número de teléfono"
        className="w-full p-3 rounded-md bg-black/40 border border-white/10 mb-6 text-white placeholder-white/40"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
      <Button onClick={buscarCliente}>Continuar</Button>
    </section>
  )
}
