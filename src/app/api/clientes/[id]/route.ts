import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Obtener un cliente por ID
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const id = Number(context.params.id);

  try {
    const cliente = await prisma.cliente.findUnique({ where: { id } });

    if (!cliente) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    return NextResponse.json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    return NextResponse.json({ error: 'Error al obtener cliente' }, { status: 500 });
  }
}

// Actualizar un cliente por ID
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  const id = Number(context.params.id);

  try {
    const body = await req.json();
    const { nombre, telefono, direccion } = body;

    const clienteActualizado = await prisma.cliente.update({
      where: { id },
      data: { nombre, telefono, direccion },
    });

    return NextResponse.json(clienteActualizado);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    return NextResponse.json({ error: 'Error al actualizar cliente' }, { status: 500 });
  }
}

// Eliminar un cliente por ID
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const id = Number(context.params.id);

  try {
    await prisma.cliente.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    return NextResponse.json({ error: 'Error al eliminar cliente' }, { status: 500 });
  }
}
