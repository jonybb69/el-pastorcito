import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import bcrypt from 'bcryptjs'

// Configuración mejorada
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH
const JWT_SECRET = process.env.JWT_SECRET
const NODE_ENV = process.env.NODE_ENV

// Validación de variables de entorno
if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
  throw new Error('Missing required environment variables for authentication')
}

export async function POST(req: Request) {
  console.log("[DEBUG] Correo admin configurado:", process.env.ADMIN_EMAIL);
  try {
    const { email, password } = await req.json()

    // Validación básica del input
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { message: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Comparación segura con bcrypt
    const isEmailValid = email === ADMIN_EMAIL
    const isPasswordValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH!)
    console.log("¿La contraseña es válida?", isPasswordValid); // ← Debe imprimir "true"

    if (isEmailValid && isPasswordValid) {
      // Token JWT más seguro
      const token = jwt.sign(
        { 
          email,
          role: 'admin',
        }, 
        process.env.JWT_SECRET as string, 
        { 
          expiresIn: '4h', // Tiempo de vida más corto
          algorithm: 'HS256' // Algoritmo explícito
        }
      )

      // Configuración mejorada de cookies
      const cookie = serialize('auth-token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 4, // 4 horas
        sameSite: 'strict', // Más restrictivo
        secure: NODE_ENV === 'production',
        domain: process.env.COOKIE_DOMAIN || undefined,
        // Flags adicionales de seguridad
        priority: 'high',
        // partition: NODE_ENV === 'production' ? 'none' : undefined // Para Chrome
      })

      const response = NextResponse.json(
        { 
          user: { 
            email,
            role: 'admin'
          } 
        }, 
        { status: 200 }
      )
      
      response.headers.set('Set-Cookie', cookie)
      return response
    }

    // Respuesta genérica para evitar enumeración de usuarios
    return NextResponse.json(
      { message: 'Credenciales inválidas' },
      { status: 401 }
    )

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}