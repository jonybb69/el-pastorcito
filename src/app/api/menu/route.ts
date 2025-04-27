// app/api/menu/route.ts
import { NextResponse } from 'next/server'
import  { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: { creadoEn: 'asc' },
    })

    return NextResponse.json(productos)
  } catch (error) {
    console.error('Error al obtener los productos del menú:', error)
    return new NextResponse('Error interno del servidor', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, precio, imagen, categoria } = body

    if (!nombre || !precio || !imagen || !categoria) {
      return new NextResponse('Faltan campos requeridos', { status: 400 })
    }

    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre,
        precio,
        imagen,
        categoria,
      },
    })

    return NextResponse.json(nuevoProducto)
  } catch (error) {
    console.error('Error al crear producto:', error)
    return new NextResponse('Error interno al crear producto', { status: 500 })
  }
}
