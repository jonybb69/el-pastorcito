'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePedidoStore } from '@/store/usePedidoStore'
import { toast } from 'sonner'

interface Cliente {
  id: string
  nombre: string
  telefono: string
  direccion: string
}

export default function NuevoClientePage() {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [sugerencias, setSugerencias] = useState<Cliente[]>([])
  const [cargando, setCargando] = useState(false)

  const router = useRouter()
  const setCliente = usePedidoStore(state => state.setCliente)
  const setMetodoPago = usePedidoStore(state => state.setMetodoPago)

  useEffect(() => {
    const buscar = async () => {
      if (telefono.length >= 4) {
        const res = await fetch(`/api/clientes?telefono=${telefono}`)
        const { clientes } = await res.json()
        if (clientes) {
          setSugerencias([clientes])
        } else {
          setSugerencias([])
        }
      } else {
        setSugerencias([])
      }
    }

    const delayDebounce = setTimeout(buscar, 400)
    return () => clearTimeout(delayDebounce)
  }, [telefono])

  const seleccionarCliente = (cliente: Cliente) => {
    setNombre(cliente.nombre)
    setTelefono(cliente.telefono)
    setDireccion(cliente.direccion)
    setCliente(cliente)
    setMetodoPago('')
    toast.success('Cliente cargado, redirigiendo...')
    setTimeout(() => router.push('/menu'), 1000)
  }

  const manejarRegistro = async () => {
    if (!nombre || !telefono || !direccion) {
      toast.warning('Todos los campos son obligatorios.')
      return
    }

    setCargando(true)

    try {
      const respuesta = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, direccion }),
      })

      if (!respuesta.ok) throw new Error('No se pudo registrar.')

      const cliente = await respuesta.json()
      setCliente(cliente)
      setMetodoPago('')
      toast.success('¡Cliente registrado!')

      setTimeout(() => router.push('/menu'), 1000)
    } catch (error) {
      toast.error('Error al registrar.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="max-w-md mx-auto mt-20 bg-yellow-400 p-6 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-red-600 mb-6 text-center">Registro de Nuevo Cliente</h1>

      <form
        onSubmit={e => {
          e.preventDefault()
          manejarRegistro()
        }}
        className="space-y-4 relative"
      >
        <div>
          <label className="block text-sm font-medium">Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full p-2 text-black border rounded-lg"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium">Teléfono:</label>
          <input
            type="tel"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            className="w-full text-black p-2 border rounded-lg"
          />
          {sugerencias.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow">
              {sugerencias.map(cli => (
                <li
                  key={cli.id}
                  onClick={() => seleccionarCliente(cli)}
                  className="p-2 text-black hover:bg-gray-100 cursor-pointer"
                >
                  {cli.nombre} - {cli.telefono}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Dirección:</label>
          <textarea
            value={direccion}
            onChange={e => setDireccion(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl"
        >
          {cargando ? 'Registrando...' : 'Registrarse y Ver Menú'}
        </button>
      </form>
    </section>
  )
}
