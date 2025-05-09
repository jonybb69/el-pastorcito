import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const cliente = await prisma.cliente.findUnique({ where: { id } });

    if (!cliente) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    await prisma.cliente.delete({ where: { id } });

    return NextResponse.json({ mensaje: "Cliente eliminado con éxito" });
  } catch (error: any) {
    console.error("Error al eliminar cliente:", error);

    if (error.code === "P2003") {
      return NextResponse.json({
        error: "No se puede eliminar el cliente porque tiene pedidos asociados.",
      }, { status: 400 });
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
