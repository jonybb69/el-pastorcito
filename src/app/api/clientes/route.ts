// src/app/api/clientes/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const data = await req.json()

  // Verifica si ya existe un cliente con ese teléfono
  const existente = await prisma.cliente.findUnique({
    where: {
      telefono: data.telefono,
    },
  })

  if (existente) {
    return NextResponse.json(
      { error: 'El número de teléfono ya está registrado' },
      { status: 409 }
    )
  }

  // Si no existe, lo crea
  const cliente = await prisma.cliente.create({
    data,
  })

  return NextResponse.json(cliente)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const telefono = searchParams.get('telefono')

  if (!telefono) {
    return NextResponse.json({ error: 'Teléfono requerido' }, { status: 400 })
  }

  const cliente = await prisma.cliente.findFirst({
    where: { telefono },
  })

  return NextResponse.json({ cliente })
}
