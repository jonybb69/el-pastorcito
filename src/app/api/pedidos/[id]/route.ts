import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const id = Number(context.params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    // Verificar si el pedido existe antes de intentar eliminarlo
    const pedido = await prisma.pedido.findUnique({
      where: { id },
    });

    if (!pedido) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    // Elimina el pedido (con efecto cascada sobre productos y salsas)
    await prisma.pedido.delete({
      where: { id },
    });

    return NextResponse.json({ mensaje: "Pedido eliminado con éxito" });
  } catch (error: any) {
    console.error("Error al eliminar pedido:", error);
    return NextResponse.json({ error: "No se pudo eliminar el pedido" }, { status: 500 });
  }
}


// Actualizar pedido: método de pago, productos y salsas
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const pedidoId = Number(params.id);

  if (isNaN(pedidoId)) {
    return NextResponse.json({ error: "ID de pedido inválido" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { metodoPago, productos } = body;

    if (!metodoPago || !Array.isArray(productos) || productos.length === 0) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const productosExistentes = await prisma.pedidoProducto.findMany({
      where: { pedidoId },
      select: { id: true },
    });

    const productoPedidoIds = productosExistentes.map((p) => p.id);

    await prisma.pedidoSalsa.deleteMany({
      where: {
        productoPedidoId: { in: productoPedidoIds },
      },
    });

    await prisma.pedidoProducto.deleteMany({
      where: { pedidoId },
    });

    await prisma.pedido.update({
      where: { id: pedidoId },
      data: { metodoPago },
    });

    for (const item of productos) {
      const nuevoProducto = await prisma.pedidoProducto.create({
        data: {
          pedidoId,
          productoId: Number(item.productoId),
          cantidad: Number(item.cantidad),
          precio: Number(item.precio),
        },
      });

      if (item.salsas && Array.isArray(item.salsas)) {
        for (const salsaId of item.salsas) {
          await prisma.pedidoSalsa.create({
            data: {
              productoPedidoId: nuevoProducto.id,
              salsaId: Number(salsaId),
            },
          });
        }
      }
    }

    return NextResponse.json({ mensaje: "Pedido actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el pedido:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

// Cambiar el estado del pedido (tomar pedido o finalizar)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID de pedido inválido" }, { status: 400 });
  }

  try {
    const { estado } = await req.json();

    const estadosValidos = ["en preparación", "finalizado"];
    if (!estadosValidos.includes(estado)) {
      return NextResponse.json({ error: "Estado no válido" }, { status: 400 });
    }

    await prisma.pedido.update({
      where: { id },
      data: { estado },
    });

    return NextResponse.json({ mensaje: `Estado actualizado a "${estado}"` });
  } catch (error) {
    console.error("Error al cambiar el estado del pedido:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
