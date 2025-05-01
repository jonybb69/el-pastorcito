'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function ConfirmacionFinal() {
  const router = useRouter();

  const handleNuevoPedido = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-400 via-pink-500 to-red-500 text-white px-6 py-12">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.h1
          className="text-4xl font-bold text-pink-600 mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          ¡Pedido Confirmado! 🎉
        </motion.h1>

        <motion.p
          className="text-gray-700 mb-8 text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          ¡Gracias por tu compra! Muy pronto recibirás tu pedido.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-4"
        >
          <Button
            onClick={handleNuevoPedido}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300"
          >
            Hacer otro pedido
          </Button>

          <Button
            variant="outline"
            onClick={handleNuevoPedido}
            className="border-pink-500 text-pink-500 hover:bg-pink-50 font-semibold py-2 px-6 rounded-full transition-all duration-300"
          >
            Volver al inicio
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
