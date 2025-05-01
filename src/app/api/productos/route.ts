import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todos los productos
export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      select: {
        id: true,
        nombre: true,
        precio: true,
        imagen: true,
      },
    });
    return NextResponse.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json({ message: 'Error al obtener productos' }, { status: 500 });
  }
}

// POST - Crear un nuevo producto
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.nombre || !data.precio) {
      return NextResponse.json({ message: 'Nombre y precio son requeridos' }, { status: 400 });
    }

    const producto = await prisma.producto.create({ data });
    return NextResponse.json(producto, { status: 201 });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json({ message: 'Error al crear producto' }, { status: 500 });
  }
}

// PUT - Actualizar un producto existente
export async function PUT(req: Request) {
  try {
    const data = await req.json();

    if (!data.id) {
      return NextResponse.json({ message: 'ID es requerido para actualizar' }, { status: 400 });
    }

    const producto = await prisma.producto.update({
      where: { id: data.id },
      data,
    });
    return NextResponse.json(producto);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return NextResponse.json({ message: 'Error al actualizar producto' }, { status: 500 });
  }
}

// DELETE - Eliminar un producto
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'ID es requerido para eliminar' }, { status: 400 });
    }

    await prisma.producto.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json({ message: 'Error al eliminar producto' }, { status: 500 });
  }
}
