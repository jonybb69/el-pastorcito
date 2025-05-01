import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validación general
    if (!body || !body.clienteId || !body.metodoPago || !Array.isArray(body.productos)) {
      return new NextResponse("Datos incompletos para crear el pedido", { status: 400 });
    }

    const clienteId = Number(body.clienteId);
    const metodoPago = body.metodoPago;
    const productos = body.productos;

    if (isNaN(clienteId)) {
      return new NextResponse("clienteId inválido", { status: 400 });
    }

    if (!productos.length) {
      return new NextResponse("No hay productos en el pedido", { status: 400 });
    }

    for (const item of productos) {
      if (
        !item.productoId || isNaN(Number(item.productoId)) ||
        !item.cantidad || isNaN(Number(item.cantidad)) ||
        !item.precio || isNaN(Number(item.precio))
      ) {
        return new NextResponse("Producto inválido en la lista", { status: 400 });
      }
    }

    // Crear el pedido
    const pedido = await prisma.pedido.create({
      data: {
        clienteId: clienteId,
        metodoPago: metodoPago,
        creadoEn: new Date(),
      },
    });

    // Crear los registros en pedidoProducto
    for (const item of productos) {
      await prisma.pedidoProducto.create({
        data: {
          pedidoId: pedido.id,
          productoId: Number(item.productoId),
          cantidad: Number(item.cantidad),
          precio: Number(item.precio),
        },
      });
    }

    return NextResponse.json({ mensaje: "Pedido creado con éxito", pedido });
  } catch (error) {
    console.error("Error al crear el pedido:", error);
    return new NextResponse("Error al crear el pedido", { status: 500 });
  }
}
