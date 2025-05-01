import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@pastorcito.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'taquitos123'
const JWT_SECRET = process.env.JWT_SECRET || 'elPastorcitoSuperSecreto'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '8h' })

    const cookie = serialize('auth-token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 8, // 8 horas
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    const response = NextResponse.json({ user: { email } }, { status: 200 })
    response.headers.set('Set-Cookie', cookie)

    return response
  }

  return NextResponse.json(
    { message: 'Correo o contraseña incorrectos' },
    { status: 401 }
  )
}
