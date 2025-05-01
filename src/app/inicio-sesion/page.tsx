'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Cliente {
  id: string
  nombre: string
  telefono: string
  direccion: string
}

export default function InicioSesionPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [editando, setEditando] = useState<Cliente | null>(null)
  const [cargando, setCargando] = useState(false)

  const fetchClientes = async () => {
    const res = await fetch('/api/clientes')
    const data = await res.json()
    setClientes(data)
  }

  useEffect(() => {
    fetchClientes()
  }, [])

  const handleEliminar = async (id: string) => {
    const confirm = window.confirm('¿Eliminar este cliente?')
    if (!confirm) return

    const res = await fetch(`/api/clientes/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      toast.success('Cliente eliminado')
      fetchClientes()
    } else {
      toast.error('Error al eliminar')
    }
  }

  const handleGuardar = async () => {
    if (!editando) return
    const res = await fetch(`/api/clientes/${editando.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editando),
    })

    if (res.ok) {
      toast.success('Cliente actualizado')
      setEditando(null)
      fetchClientes()
    } else {
      toast.error('Error al actualizar')
    }
  }

  return (
    <section className="max-w-3xl mx-auto mt-20 bg-white p-6 rounded-xl shadow-xl">
      <h1 className="text-2xl font-bold text-red-600 mb-6 text-center">Gestión de Clientes</h1>

      {clientes.length === 0 && <p className="text-center text-gray-500">No hay clientes aún.</p>}

      <ul className="space-y-4">
        {clientes.map(cliente => (
          <li key={cliente.id} className="bg-yellow-400 p-4 rounded-xl shadow">
            {editando?.id === cliente.id ? (
              <div className="space-y-2">
                <input
                  className="w-full p-2 border rounded"
                  value={editando.nombre}
                  onChange={e => setEditando({ ...editando, nombre: e.target.value })}
                />
                <input
                  className="w-full p-2 border rounded"
                  value={editando.telefono}
                  onChange={e => setEditando({ ...editando, telefono: e.target.value })}
                />
                <textarea
                  className="w-full p-2 border rounded"
                  value={editando.direccion}
                  onChange={e => setEditando({ ...editando, direccion: e.target.value })}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleGuardar}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditando(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{cliente.nombre}</p>
                  <p>{cliente.telefono}</p>
                  <p className="text-sm text-gray-700">{cliente.direccion}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditando(cliente)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(cliente.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
