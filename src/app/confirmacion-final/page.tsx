'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { usePedidoStore } from '@/store/usePedidoStore';

export default function ConfirmacionFinal() {
  const router = useRouter();
  const { limpiarPedido } = usePedidoStore();

  const handleNuevoPedido = () => {
    // Limpia solo los productos del pedido actual, manteniendo la sesión del cliente
    limpiarPedido();
    router.push('/menu');
  };

  const handleVolverInicio = () => {
    // No limpia la sesión, solo redirige al inicio
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
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-pink-500/30"
          >
            Hacer otro pedido
          </Button>

          <Button
            variant="outline"
            onClick={handleVolverInicio}
            className="border-pink-500 text-pink-500 hover:bg-pink-50 font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-pink-500/20"
          >
            Volver al inicio
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}