import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const id = parseInt(request.nextUrl.pathname.split("/").pop() || "");
    const body = await request.json();
    const { estado } = body;

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
export async function DELETE(request: NextRequest) {
  try {
    const id = parseInt(request.nextUrl.pathname.split("/").pop() || "");

    await prisma.pedido.delete({
      where: { id },
    });

    return NextResponse.json({ mensaje: "Pedido eliminado" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar el pedido:", error);
    return NextResponse.json({ error: "Error al eliminar el pedido" }, { status: 500 });
  }
}