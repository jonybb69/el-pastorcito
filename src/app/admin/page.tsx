'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/useAuthStore'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const login = useAuthStore((state) => state.login)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        login(data.user, data.token)
        document.cookie = `auth-token=${data.token}; path=/`
        router.push('/admin/dashboard')
      } else {
        setError(data.message || 'Credenciales incorrectas.')
      }
    } catch {
      setError('Ocurrió un error inesperado.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="max-w-md mx-auto mt-20 p-6 bg-red-950/80 rounded-xl shadow-2xl text-white text-center backdrop-blur-sm border border-yellow-500">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-yellow-400 mb-6"
      >
        Acceso Administrador 🌮🔐
      </motion.h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Correo del administrador"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded-md bg-black/40 border border-yellow-500 text-white placeholder-white/50"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded-md bg-black/40 border border-yellow-500 text-white placeholder-white/50"
        />
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm"
          >
            {error}
          </motion.p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 ${
            isLoading
              ? 'bg-red-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-yellow-500'
          }`}
        >
          {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>
    </section>
  )
}
