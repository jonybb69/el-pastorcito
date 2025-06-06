// lib/estados/pedido.ts

import {
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle
} from 'react-icons/fi'

export type EstadoPedido = 'pendiente' | 'en_proceso' | 'entregado' | 'cancelado'

interface EstadoConfig {
  label: string
  color: 'blue' | 'green' | 'red' | 'purple'
  icon: React.ElementType
}

export const estadosPedido: { value: EstadoPedido, label: string, color: EstadoConfig['color'], icon: EstadoConfig['icon'] }[] = [
  {
    value: 'pendiente',
    label: 'Pendiente',
    color: 'blue',
    icon: FiClock
  },
  {
    value: 'en_proceso',
    label: 'En Proceso',
    color: 'purple',
    icon: FiTruck
  },
  {
    value: 'entregado',
    label: 'Entregado',
    color: 'green',
    icon: FiCheckCircle
  },
  {
    value: 'cancelado',
    label: 'Cancelado',
    color: 'red',
    icon: FiXCircle
  }
]

export function getEstadoConfig(estado: EstadoPedido): EstadoConfig {
  const estadoEncontrado = estadosPedido.find(e => e.value === estado)
  if (!estadoEncontrado) {
    return {
      label: 'Desconocido',
      color: 'red',
      icon: FiXCircle
    }
  }
  return {
    label: estadoEncontrado.label,
    color: estadoEncontrado.color,
    icon: estadoEncontrado.icon
  }
}
