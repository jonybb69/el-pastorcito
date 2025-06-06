import prisma from '@/lib/prisma';
import { NextResponse } from "next/server";

type ProductoInput = {
  productoId: number;
  cantidad: number;
  precio: number;
  salsas?: number[];
};

// POST: Crear pedido
export async function POST(request: Request) {
  try {
    const { clienteId, productos, metodoPago = 'efectivo' } = await request.json();

    if (!clienteId || !productos || !Array.isArray(productos)) {
      return NextResponse.json({ error: 'Datos de pedido incompletos o inválidos' }, { status: 400 });
    }

    const cliente = await prisma.cliente.findUnique({ where: { id: Number(clienteId) } });
    if (!cliente) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });

    const productosIds = productos.map((p: ProductoInput) => Number(p.productoId));
    const productosExistentes = await prisma.producto.count({ where: { id: { in: productosIds } } });
    if (productosExistentes !== productos.length) {
      return NextResponse.json({ error: 'Algunos productos no existen' }, { status: 400 });
    }

    const pedido = await prisma.pedido.create({
      data: {
        clienteId: Number(clienteId),
        estado: 'pendiente',
        creadoEn: new Date(),
        metodoPago: metodoPago,
      }
    });

    const pedidoProductos = await Promise.all(productos.map(async (item) => {
      return prisma.pedidoProducto.create({
        data: {
          pedidoId: pedido.id,
          productoId: Number(item.productoId),
          cantidad: Number(item.cantidad),
          precio: Number(item.precio),
        }
      });
    }));

    for (let i = 0; i < productos.length; i++) {
      const salsas = productos[i].salsas || [];
      if (salsas.length > 0) {
        await prisma.pedidoSalsa.createMany({
          data: salsas.map((salsaId: unknown) => ({
            pedidoProductoId: pedidoProductos[i].id,
            salsaId: Number(salsaId)
          }))
        });
      }
    }

    return NextResponse.json({
      id: pedido.id,
      pedidoId: pedido.id,
      numeroPedido: `#${pedido.id.toString().padStart(4, '0')}`,
      fecha: pedido.creadoEn.toISOString(),
      estado: pedido.estado,
      cliente: {
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        direccion: cliente.direccion
      },
      productos: [] // para el GET
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear pedido:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido al crear pedido' },
      { status: 500 }
    );
  }
}

// GET: Obtener todos los pedidos
export async function GET() {
  try {
    const pedidos = await prisma.pedido.findMany({
      orderBy: { creadoEn: 'desc' },
      include: {
        cliente: {
          select: { nombre: true, telefono: true, direccion: true },
        },
        productos: {
          include: {
            producto: { select: { nombre: true } },
            salsas: {
              include: { salsa: { select: { nombre: true } } }
            }
          }
        }
      }
    });

    const pedidosFormateados = pedidos.map(pedido => ({
      id: pedido.id,
      pedidoId: pedido.id,
      numeroPedido: `#${pedido.id.toString().padStart(4, '0')}`,
      fecha: pedido.creadoEn.toISOString(),
      estado: pedido.estado,
      cliente: {
        nombre: pedido.cliente.nombre,
        telefono: pedido.cliente.telefono,
        direccion: pedido.cliente.direccion
      },
      productos: pedido.productos.map(pp => ({
        id: pp.productoId,
        nombre: pp.producto.nombre,
        salsas: pp.salsas.map(s => s.salsa.nombre),
        cantidad: pp.cantidad,
        precio: pp.precio
      })),
      total: pedido.productos.reduce((sum, pp) => sum + (pp.cantidad * pp.precio), 0)
    }));

    return NextResponse.json({ pedidos: pedidosFormateados });

  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    return NextResponse.json({ error: 'Error al obtener los pedidos' }, { status: 500 });
  }
}
