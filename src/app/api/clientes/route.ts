import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Obtener todos los clientes
export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { nombre: 'asc' },
    });
    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return NextResponse.json({ error: 'Error al obtener clientes' }, { status: 500 });
  }
}

// Crear un nuevo cliente
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, telefono, direccion } = body;

    const nuevoCliente = await prisma.cliente.create({
      data: { nombre, telefono, direccion },
    });

    return NextResponse.json(nuevoCliente);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    return NextResponse.json({ error: 'Error al crear cliente' }, { status: 500 });
  }
}
