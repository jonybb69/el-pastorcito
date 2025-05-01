'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <section className="max-w-5xl mx-auto mt-12 px-6 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold text-yellow-400 text-center mb-12"
      >
        Panel de Administración
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {/* Pedidos */}
        <Link href="/admin/pedidos">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-xl backdrop-blur-md transition-all hover:border-yellow-400 hover:shadow-yellow-500/20 cursor-pointer"
          >
            <h3 className="text-2xl font-bold text-yellow-300 mb-2">Ver Pedidos</h3>
            <p className="text-white/70 text-sm">Revisa y gestiona pedidos entrantes</p>
          </motion.div>
        </Link>

        {/* Productos */}
        <Link href="/admin/productos">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-xl backdrop-blur-md transition-all hover:border-yellow-400 hover:shadow-yellow-500/20 cursor-pointer"
          >
            <h3 className="text-2xl font-bold text-yellow-300 mb-2">Productos</h3>
            <p className="text-white/70 text-sm">Gestiona el menú de productos</p>
          </motion.div>
        </Link>

        {/* Salsas */}
        <Link href="/admin/salsas">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-xl backdrop-blur-md transition-all hover:border-yellow-400 hover:shadow-yellow-500/20 cursor-pointer"
          >
            <h3 className="text-2xl font-bold text-yellow-300 mb-2">Salsas</h3>
            <p className="text-white/70 text-sm">Agrega o edita las salsas disponibles</p>
          </motion.div>
        </Link>

        {/* Configuración */}
        <Link href="/admin/configuracion">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-xl backdrop-blur-md transition-all hover:border-yellow-400 hover:shadow-yellow-500/20 cursor-pointer"
          >
            <h3 className="text-2xl font-bold text-yellow-300 mb-2">Configuración</h3>
            <p className="text-white/70 text-sm">Opciones del sistema</p>
          </motion.div>
        </Link>

        {/* Clientes */}
        <Link href="/inicio-sesion">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-xl backdrop-blur-md transition-all hover:border-yellow-400 hover:shadow-yellow-500/20 cursor-pointer"
          >
            <h3 className="text-2xl font-bold text-yellow-400 mb-2">Clientes</h3>
            <p className="text-white/70 text-sm">Gestiona clientes registrados</p>
          </motion.div>
        </Link>

        {/* Cerrar sesión */}
        <button
          onClick={() => {
            useAuthStore.getState().logout();
            router.push('/');
          }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-xl backdrop-blur-md transition-all hover:border-red-400 hover:shadow-red-500/20 cursor-pointer"
        >
          <h3 className="text-2xl font-bold text-red-300 mb-2">Cerrar Sesión</h3>
          <p className="text-white/70 text-sm">Salir del panel de administración</p>
        </button>
      </motion.div>
    </section>
  );
}
