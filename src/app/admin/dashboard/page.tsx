'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState, memo } from 'react';
import { toast } from 'sonner'; 
import classNames from 'classnames';
import {
  FiSettings,
  FiUsers,
  FiLogOut,
  FiShoppingBag,
  FiCoffee
} from 'react-icons/fi';
import { FaPepperHot } from 'react-icons/fa';
import React from 'react';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const iconSize = 'w-8 h-8';

type DashboardCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
};

const DashboardCard = memo(function DashboardCard({
  icon,
  title,
  description,
  color,
  onClick
}: DashboardCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -10, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={classNames(
        'bg-gradient-to-br rounded-2xl overflow-hidden shadow-xl transition-all duration-300 cursor-pointer',
        color,
        `hover:shadow-${color.split('to-')[1]}/30`
      )}
      onClick={onClick}
      role="button"
      aria-label={`Ir a ${title}`}
    >
      <div className="p-6 flex flex-col items-center text-center h-full">
        <div className="mb-6 p-4 bg-white/10 rounded-full backdrop-blur-sm">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/80">{description}</p>
      </div>
    </motion.div>
  );
});

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const logout = () => {
    useAuthStore.getState().logout();
    toast.success('Sesión cerrada correctamente');
    router.push('/');
  };

  const cards = [
    {
      title: 'Pedidos',
      description: 'Gestiona pedidos entrantes',
      icon: <FiShoppingBag className={iconSize} />,
      path: '/admin/pedidos',
      color: 'from-black to-indigo-600'
    },
    {
      title: 'Productos',
      description: 'Administra el menú',
      icon: <FiCoffee className={iconSize} />,
      path: '/admin/productos',
      color: 'from-black to-orange-600'
    },
    {
      title: 'Salsas',
      description: 'Configura las salsas',
      icon: <FaPepperHot className={iconSize} />,
      path: '/admin/salsas',
      color: 'from-black to-pink-600'
    },
    {
      title: 'Clientes',
      description: 'Administra usuarios',
      icon: <FiUsers className={iconSize} />,
      path: '/admin/lista-clientes',
      color: 'from-black to-cyan-600'
    },
    {
      title: 'Inventario',
      description: 'Control de existencias',
      icon: <FiShoppingBag className={iconSize} />,
      path: 'inventario',
      color: 'from-black to-teal-600'
    },

    {
      title: 'Configuración',
      description: 'Ajustes del sistema',
      icon: <FiSettings className={iconSize} />,
      path: '/admin/admin-config',
      color: 'from-black to-gray-700'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen rounded-lg bg-gradient-to-br from-gray-900/10 to-gray-800/10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-t-transparent border-purple-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-lg bg-teal-900/20 text-white p-6 relative">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-black/70">
          Panel de Administración
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto mt-2">
          Gestión completa de tu restaurante en un solo lugar
        </p>
      </motion.header>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {cards.map((card, index) => (
          <DashboardCard
            key={index}
            {...card}
            onClick={() => router.push(card.path)}
          />
        ))}

        {/* Logout */}
        <DashboardCard
          icon={<FiLogOut className={iconSize} />}
          title="Cerrar Sesión"
          description="Salir del sistema"
          color="from-black to-fuchsia-600"
          onClick={() => setShowConfirmation(true)}
        />
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Confirmar Cierre de Sesión
              </h3>
              <p className="text-gray-300 mb-6">
                ¿Estás seguro que deseas salir del panel de administración?
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 focus:ring-2 focus:ring-white/30"
                >
                  Cancelar
                </button>
                <button
                  onClick={logout}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:ring-2 focus:ring-red-300"
                >
                  Cerrar Sesión
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 text-center text-gray-500 text-sm"
      >
        <p>El Pastorcito Admin Panel v2.0</p>
        <p className="mt-1">© {new Date().getFullYear()} Todos los derechos reservados</p>
      </motion.footer>
    </div>
  );
}
