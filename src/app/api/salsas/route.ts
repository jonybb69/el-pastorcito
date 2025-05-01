import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Obtener todas las salsas
export async function GET() {
  try {
    const salsas = await prisma.salsa.findMany({
      select: {
        id: true,
        nombre: true,
      },
    })
    return NextResponse.json(salsas)
  } catch (error) {
    console.error('Error al obtener salsas:', error)
    return NextResponse.json(
      { message: 'Error al obtener salsas' },
      { status: 500 }
    )
  }
}

// Crear una nueva salsa
export async function POST(req: Request) {
  try {
    const data = await req.json()

    if (!data.nombre || data.nombre.trim() === '') {
      return NextResponse.json(
        { message: 'El nombre de la salsa es requerido' },
        { status: 400 }
      )
    }

    const salsa = await prisma.salsa.create({ data })
    return NextResponse.json(salsa, { status: 201 })
  } catch (error) {
    console.error('Error al crear salsa:', error)
    return NextResponse.json(
      { message: 'Error al crear salsa' },
      { status: 500 }
    )
  }
}

// Actualizar salsa
export async function PUT(req: Request) {
  try {
    const data = await req.json()

    if (!data.id) {
      return NextResponse.json(
        { message: 'ID es requerido para actualizar' },
        { status: 400 }
      )
    }

    const salsa = await prisma.salsa.update({
      where: { id: data.id },
      data,
    })
    return NextResponse.json(salsa)
  } catch (error) {
    console.error('Error al actualizar salsa:', error)
    return NextResponse.json(
      { message: 'Error al actualizar salsa' },
      { status: 500 }
    )
  }
}

// Eliminar salsa
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { message: 'ID es requerido para eliminar' },
        { status: 400 }
      )
    }

    await prisma.salsa.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar salsa:', error)
    return NextResponse.json(
      { message: 'Error al eliminar salsa' },
      { status: 500 }
    )
  }
}
