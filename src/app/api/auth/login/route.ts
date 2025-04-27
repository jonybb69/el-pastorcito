// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'


const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@pastorcito.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'taquitos123'
const JWT_SECRET = process.env.JWT_SECRET || 'elPastorcitoSuperSecreto'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '8h' })

    return NextResponse.json(
      {
        user: { email },
        token,
      },
      { status: 200 }
    )
  }

  return NextResponse.json(
    { message: 'Correo o contraseña incorrectos' },
    { status: 401 }
  )
}
