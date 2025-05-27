import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
    const { nombre, telefono, direccion } = await req.json()

    const nuevoCliente = await prisma.cliente.create({
      data: { nombre, telefono, direccion },
    })

    return NextResponse.json(nuevoCliente)
  } catch (error) {
    console.error('Error al crear cliente:', error)
    return NextResponse.json(
      { error: 'Error al crear cliente' },
      { status: 500 }
    )
  }
}export async function PUT(req: Request) {
  try {
    const { id, nombre, telefono, direccion } = await req.json();

    // Validaciones básicas
    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el ID del cliente' },
        { status: 400 }
      );
    }

    if (!nombre) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      );
    }

    const clienteActualizado = await prisma.cliente.update({
      where: { id: Number(id) }, // Asegurar que id es número
      data: {
        nombre,
        telefono: telefono || null,
        direccion: direccion || null
      }
    });

    return NextResponse.json(clienteActualizado, { status: 200 });

  } catch (error: unknown) {
    console.error('Error actualizando cliente:', error);

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: (typeof error === 'object' && error !== null && 'message' in error) ? (error as { message?: string }).message || 'Error al actualizar cliente' : 'Error al actualizar cliente' },
      { status: 500 }
    );
  }
}
