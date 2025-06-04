import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Eliminar cliente por ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const cliente = await prisma.cliente.delete({
      where: { id: numericId },
    });

    return NextResponse.json(cliente);
  } catch (error) {
    console.error('Error eliminando cliente:', error);
    return NextResponse.json(
      { error: 'Error al eliminar cliente' },
      { status: 500 }
    );
  }
}

// Actualizar cliente por ID (por ejemplo, cambiar estado 'destacado')
export async function PATCH(
  request: Request,
   { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID requerido' },
        { status: 400 }
      );
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(id) },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    const updated = await prisma.cliente.update({
      where: { id: Number(id) },
      data: { destacado: !cliente.destacado },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
