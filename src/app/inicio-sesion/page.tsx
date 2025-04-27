'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'

export default function InicioSesionCliente() {
  const [telefono, setTelefono] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!telefono.trim()) {
      setError('Por favor ingresa tu número de celular.')
      return
    }

    try {
      // Aquí puedes validar con tu backend si el número existe
      const res = await fetch('/api/clientes/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefono }),
      })

      if (!res.ok) {
        throw new Error('Número no registrado.')
      }

      // Redirección al menú
      router.push('/menu')
    } catch (err) {
      setError('Número no registrado o error en la conexión.')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center"
      >
        Inicia sesión con tu celular 📱
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}
        className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-md space-y-5"
      >
        <Input
          type="tel"
          placeholder="Tu número de celular"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="bg-white text-black font-semibold placeholder-gray-500"
        />

        {error && (
          <p className="text-red-500 text-sm font-semibold">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-red-700 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition duration-300"
        >
          Entrar al menú 🍴
        </Button>
      </motion.form>
    </div>
  )
}
