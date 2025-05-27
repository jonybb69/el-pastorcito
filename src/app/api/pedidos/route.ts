import prisma from '@//lib/prisma';
import { NextResponse } from "next/server";

// api/pedidos/route.ts
export async function POST(req: Request) {
  try {
    const { clienteId, productos } = await req.json();

    // 1. Verificar que el cliente existe
    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(clienteId) }
    });
    if (!cliente) throw new Error('Cliente no existe');

    // 2. Verificar productos
    const productosIds = productos.map((p: { productoId: any; }) => Number(p.productoId));
    const productosExistentes = await prisma.producto.count({
      where: { id: { in: productosIds } }
    });
    if (productosExistentes !== productos.length) {
      throw new Error('Algunos productos no existen');
    }

    // 3. Crear pedido
    const pedido = await prisma.pedido.create({
      data: {
        clienteId: Number(clienteId),
        estado: 'pendiente',
        creadoEn: new Date(),
        metodoPago: 'efectivo', // Ajusta el valor según tu lógica de negocio
      }
    });

    // 4. Crear relaciones
    await prisma.pedidoProducto.createMany({
      data: productos.map((item: { productoId: any; cantidad: any; precio: any; }) => ({
        pedidoId: pedido.id,
        productoId: Number(item.productoId),
        cantidad: Number(item.cantidad),
        precio: Number(item.precio),
      }))
    });

    return NextResponse.json(pedido);
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error al crear pedido';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

  

// Obtener todos los pedidos
export async function GET() {
  try {
    const pedidos = await prisma.pedido.findMany({
      orderBy: { creadoEn: 'desc' },
      include: {
        cliente: {
          select: {
            nombre: true,
            telefono: true,
            direccion: true,
          },
        },
        productos: {
          include: {
            producto: { select: { nombre: true } },
            salsas: {
              include: { salsa: { select: { nombre: true } } },
            },
          },
        },
      },
    });

    const pedidosFormateados = pedidos.map((pedido: any) => ({
      id: pedido.id,
      numeroPedido: `#${pedido.id}`,
      fecha: pedido.creadoEn,
      estado: pedido.estado,
      cliente: pedido.cliente,
      productos: pedido.productos.map((pp: any) => ({
        id: pp.productoId,
        nombre: pp.producto.nombre,
        cantidad: pp.cantidad,
        precio: pp.precio,
        salsas: pp.salsas.map((s: any) => s.salsa.nombre),
      })),
    }));

    return NextResponse.json({ pedidos: pedidosFormateados });
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    return new NextResponse("Error al obtener los pedidos", { status: 500 });
  }
}
