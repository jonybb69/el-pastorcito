'use client';

import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ConfirmacionFinal() {
  const router = useRouter();
  const [counter, setCounter] = useState(10); // segundos para redireccionar automáticamente

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    if (counter === 0) {
      router.push('/'); // Redirigir automáticamente al inicio
    }

    return () => clearInterval(interval);
  }, [counter, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center min-h-screen gap-8 p-8 bg-gradient-to-br from-green-50 to-white"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4"
      >
        <div className="rounded-full bg-green-100 p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-center text-green-600">¡Pedido confirmado!</h1>
        <p className="text-lg text-center text-gray-700">¿Qué deseas hacer ahora?</p>
        <p className="text-sm text-center text-gray-500">Serás redirigido automáticamente en {counter} segundos.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl text-lg py-6 transition"
          onClick={() => router.push('/cliente')}
        >
          Hacer otro pedido
        </Button>

        <Button
          variant="outline"
          className="w-full rounded-xl text-lg py-6 hover:bg-gray-100 transition"
          onClick={() => router.push('/')}
        >
          Ir al inicio
        </Button>
      </motion.div>
    </motion.div>
  );
}
