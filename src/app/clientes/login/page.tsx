'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useClientStore } from '@/store/useClientStore';

export default function LoginClientePage() {
  const [telefono, setTelefono] = useState('');
  const router = useRouter();
  const login = useClientStore((state) => state.setCliente);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/clientes/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telefono }),
    });

    const data = await res.json();

    if (res.ok) {
      login(data.cliente);
      toast.success('Inicio de sesión exitoso');
      router.push('/menu'); // o la ruta que uses para el menú
    } else {
      toast.error(data.error || 'Error al iniciar sesión');
    }
  };

  return (
    <section className="max-w-md mx-auto mt-16 px-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400 text-center">Inicio de Sesión</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="tel"
          placeholder="Número de teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="p-3 rounded-md bg-white/10 border border-white/20 text-white"
        />
        <button
          type="submit"
          className="bg-yellow-500 text-black py-2 rounded-md hover:bg-yellow-400 transition"
        >
          Iniciar sesión
        </button>
      </form>
    </section>
  );
}
