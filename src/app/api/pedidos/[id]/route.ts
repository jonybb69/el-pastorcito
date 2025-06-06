import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const { estado } = await request.json();

    if (!estado) {
      return NextResponse.json({ error: "Estado requerido" }, { status: 400 });
    }

    const pedidoActualizado = await prisma.pedido.update({
      where: { id },
      data: { estado },
    });

    return NextResponse.json(pedidoActualizado, { status: 200 });
  } catch (error) {
    console.error("Error actualizando el pedido:", error);
    return NextResponse.json({ error: "Error actualizando el pedido" }, { status: 500 });
  }
}



export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    // Eliminar relaciones con salsas primero
    await prisma.pedidoSalsa.deleteMany({
      where: {
        productoPedido: {
          pedidoId: id
        }
      }
    });

    // Eliminar relaciones pedido-producto
    await prisma.pedidoProducto.deleteMany({
      where: { pedidoId: id }
    });

    // Eliminar el pedido
    await prisma.pedido.delete({
      where: { id }
    });

    return NextResponse.json({ mensaje: "Pedido eliminado correctamente" }, { status: 200 });

  } catch (error) {
    console.error("Error al eliminar el pedido:", error);
    return NextResponse.json({ error: "Error al eliminar el pedido" }, { status: 500 });
  }
}
