import prisma from '@//lib/prisma';
import { NextResponse } from "next/server";

// api/pedidos/route.ts
export async function POST(req: Request) {
  try {
    const { clienteId, productos } = await req.json();

    type ProductoInput = { productoId: number; cantidad: number; precio: number };

    // 1. Verificar que el cliente existe
    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(clienteId) }
    });
    if (!cliente) throw new Error('Cliente no existe');

    // 2. Verificar productos
    const productosIds = (productos as ProductoInput[]).map((p) => Number(p.productoId));
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
        metodoPago: '', // Ajusta el valor según tu lógica de negocio
      }
    });

    // 4. Crear relaciones
    await prisma.pedidoProducto.createMany({
      data: (productos as ProductoInput[]).map((item: ProductoInput) => ({
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

    interface PedidoProducto {
      productoId: number;
      cantidad: number;
      precio: number;
      producto: { nombre: string };
      salsas: { salsa: { nombre: string } }[];
    }

    interface Pedido {
      id: number;
      creadoEn: Date;
      estado: string;
      cliente: {
        nombre: string;
        telefono: string;
        direccion: string;
      };
      productos: PedidoProducto[];
    }

    const pedidosFormateados = pedidos.map((pedido: Pedido) => ({
      id: pedido.id,
      numeroPedido: `#${pedido.id}`,
      fecha: pedido.creadoEn,
      estado: pedido.estado,
      cliente: pedido.cliente,
      productos: pedido.productos.map((pp: PedidoProducto) => ({
        id: pp.productoId,
        nombre: pp.producto.nombre,
        cantidad: pp.cantidad,
        precio: pp.precio,
        salsas: pp.salsas.map((s) => s.salsa.nombre),
      })),
    }));

    return NextResponse.json({ pedidos: pedidosFormateados });
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    return new NextResponse("Error al obtener los pedidos", { status: 500 });
  }
}
