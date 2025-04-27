// /app/api/salsas/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const salsas = await prisma.salsa.findMany()
  return NextResponse.json(salsas)
}

export async function POST(req: Request) {
  const data = await req.json()
  const salsa = await prisma.salsa.create({ data })
  return NextResponse.json(salsa)
}

export async function PUT(req: Request) {
  const data = await req.json()
  const salsa = await prisma.salsa.update({
    where: { id: data.id },
    data,
  })
  return NextResponse.json(salsa)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  await prisma.salsa.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
