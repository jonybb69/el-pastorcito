// src/app/api/pedidos/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      clienteId,
      productos, // [{ productoId, cantidad, salsas: [salsaId, salsaId] }]
      metodoPago,
    } = body;

    if (!clienteId || !productos || productos.length === 0) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const productosDB = await prisma.producto.findMany({
      where: { id: { in: productos.map((p: { productoId: any; }) => p.productoId) } },
    });
    const salsasDB = await prisma.salsa.findMany({
      where: { id: { in: productos.flatMap((p: { salsas: any; }) => p.salsas) } },
    });
    
    const productosInvalidos = productos.some((p: { productoId: any; }) => !productosDB.find((prod: { id: any; }) => prod.id === p.productoId));
    const salsasInvalidas = productos.some((p: { salsas: any[]; }) =>
      p.salsas.some(salsaId => !salsasDB.find((s: { id: any; }) => s.id === salsaId))
    );
    
    if (productosInvalidos || salsasInvalidas) {
      return NextResponse.json({ error: 'Productos o salsas inválidas' }, { status: 400 });
    }
    

    const pedido = await prisma.pedido.create({
      data: {
        clienteId,
        metodoPago,
        productos: {
          create: productos.map((prod: any) => ({
            productoId: prod.productoId,
            cantidad: prod.cantidad,
            salsas: {
              connect: prod.salsas.map((id: string) => ({ id })),
            },
          })),
        },
      },
      include: {
        productos: {
          include: {
            producto: true,
            salsas: true,
          },
        },
        cliente: true,
      },
    });

    return NextResponse.json(pedido, { status: 201 });
  } catch (error) {
  
    console.error(error);
    return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 });
  }

  
}
