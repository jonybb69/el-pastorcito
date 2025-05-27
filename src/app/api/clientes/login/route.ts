// src/app/api/clientes/login/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json();
  const { telefono } = body;

  if (!telefono) {
    return NextResponse.json({ error: 'Número requerido' }, { status: 400 });
  }

  const cliente = await prisma.cliente.findUnique({
    where: { telefono },
  });

  if (!cliente) {
    return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
  }

  return NextResponse.json({ success: true, cliente });
}
