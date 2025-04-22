'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

export default function AdminDashboardPage() {
  const { token, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      // Evita el acceso directo sin token en el cliente
      router.push('/admin')
    }
  }, [token, router])

  const handleLogout = () => {
    logout()
    document.cookie = 'auth-token=; Max-Age=0; path=/'
    router.push('/admin')
  }

  return (
    <section className="max-w-4xl mx-auto mt-16 text-white text-center px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-yellow-400 drop-shadow mb-4"
      >
        Panel de Administración 🌮
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-white/80 mb-6"
      >
        Aquí puedes gestionar pedidos, productos y más.
      </motion.p>

      <Button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-yellow-500 text-white font-semibold px-5 py-3 rounded-xl transition-all duration-300"
      >
        Cerrar sesión
      </Button>
    </section>
  )
}
