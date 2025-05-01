import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'elPastorcitoSuperSecreto'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value

  const protectedPaths = ['/admin/dashboard', '/admin/productos']

  const isProtected = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    try {
      verify(token, JWT_SECRET)
      // Token válido: continua normalmente
      return NextResponse.next()
    } catch (error) {
      console.error('Token inválido o expirado:', error)
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return NextResponse.next()
}

// Aplicar el middleware solo a rutas específicas:
export const config = {
  matcher: ['/admin/:path*'],
}
