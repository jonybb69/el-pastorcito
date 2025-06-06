'use client';

import React from 'react';

type Pedido = {
  id: number;
  cliente: string;
  total: number;
  estado: string;
};

interface Props {
  pedidos: Pedido[];
}

const OrderList: React.FC<Props> = ({ pedidos }) => {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Lista de Pedidos</h2>
      <ul className="space-y-2">
        {pedidos.map((pedido) => (
          <li
            key={pedido.id}
            className="p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <p><strong>Cliente:</strong> {pedido.cliente}</p>
            <p><strong>Total:</strong> ${pedido.total}</p>
            <p><strong>Estado:</strong> {pedido.estado}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
