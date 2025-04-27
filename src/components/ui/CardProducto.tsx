'use client'

import { motion } from "framer-motion"
import { useState } from "react"

interface Props {
  nombre: string
  descripcion: string
  precio: number
  onSeleccionar: (seleccionado: boolean) => void
}

export default function CardProducto({ nombre, descripcion, precio, onSeleccionar }: Props) {
  const [seleccionado, setSeleccionado] = useState(false)

  const toggle = () => {
    const nuevoEstado = !seleccionado
    setSeleccionado(nuevoEstado)
    onSeleccionar(nuevoEstado)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative rounded-xl border p-4 cursor-pointer shadow-lg transition-all duration-300 ${
        seleccionado ? 'border-yellow-500 bg-white/10' : 'border-white/10 bg-white/5'
      }`}
      onClick={toggle}
    >
      <div className="absolute top-3 right-3">
        <div className={`w-5 h-5 rounded-full border-2 ${seleccionado ? 'bg-yellow-400 border-yellow-400' : 'border-white'}`} />
      </div>
      <h3 className="text-xl font-semibold text-yellow-400">{nombre}</h3>
      <p className="text-white/80 text-sm">{descripcion}</p>
      <p className="text-white mt-2 font-bold">${precio.toFixed(2)}</p>
    </motion.div>
  )
}
