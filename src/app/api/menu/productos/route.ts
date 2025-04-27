import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const productos = await prisma.producto.findMany({
    include: {
      salsas: true,
    },
  })

  return NextResponse.json(productos)
}


export async function POST(req: Request) {
  const data = await req.json()
  const producto = await prisma.producto.create({ data })
  return NextResponse.json(producto)
}

export async function PUT(req: Request) {
  const data = await req.json()
  const producto = await prisma.producto.update({
    where: { id: data.id },
    data,
  })
  return NextResponse.json(producto)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  await prisma.producto.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
