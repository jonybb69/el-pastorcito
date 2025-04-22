'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"

export default function NuevoClientePage() {
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const router = useRouter()

  const enviar = async () => {
    if (!nombre || !telefono) return alert("Completa todos los campos")

    // Enviar al backend (puedes agregar lógica real luego)
    await fetch('/api/clientes', {
      method: 'POST',
      body: JSON.stringify({ nombre, telefono }),
      headers: { 'Content-Type': 'application/json' },
    })

    router.push('/pedido')
  }

  return (
    <section className="max-w-md mx-auto mt-10 p-6 bg-white/5 rounded-xl shadow-md text-white">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Nuevo Cliente</h2>
      <input
        type="text"
        placeholder="Nombre completo"
        className="w-full p-3 rounded-md bg-black/40 border border-white/10 mb-4 text-white placeholder-white/40"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Teléfono"
        className="w-full p-3 rounded-md bg-black/40 border border-white/10 mb-6 text-white placeholder-white/40"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
      <Button onClick={enviar}>Continuar</Button>
    </section>
  )
}
