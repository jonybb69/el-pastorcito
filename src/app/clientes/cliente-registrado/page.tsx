'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useClientStore } from '@/store/useClientStore'

export default function ClienteRegistradoPage() {
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { setCliente } = useClientStore()

  const buscarCliente = async () => {
    if (!telefono) {
      setError('Ingresa tu número')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/clientes/${telefono}`)

      if (!res.ok) {
        throw new Error('Cliente no encontrado')
      }

      const cliente = await res.json()
        setCliente(cliente)
      // Puedes guardar el cliente en Zustand o contexto aquí si lo necesitas
      router.push('/menu')
    } catch (err) {
      setError('No encontramos tu número. ¿Es correcto?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-10 p-6 bg-white/5 rounded-xl shadow-xl text-white backdrop-blur-md"
    >
      <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">¡Bienvenido de vuelta!</h2>

      <input
        type="tel"
        placeholder="Tu número de teléfono"
        className="w-full p-3 rounded-md bg-black/40 border border-white/10 mb-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <Button onClick={buscarCliente} disabled={loading}>
        {loading ? 'Buscando...' : 'Continuar'}
      </Button>
    </motion.section>
  )
}
