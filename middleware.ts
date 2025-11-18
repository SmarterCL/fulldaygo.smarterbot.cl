import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  '/sign-in',
  '/sign-up',
  '/api/mcp'
]

// Verificar si Clerk está configurado correctamente
const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) && 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_placeholder' &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_Y2xlcmsuc21hcnRlcmJvdC5jbCQ' &&
  Boolean(process.env.CLERK_SECRET_KEY) &&
  process.env.CLERK_SECRET_KEY !== 'sk_test_placeholder'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Permitir acceso a rutas públicas
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // Si Clerk no está configurado, permitir acceso a todas las rutas
  if (!clerkEnabled) {
    return NextResponse.next()
  }
  
  // Si Clerk está configurado, importar y usar el middleware de Clerk
  try {
    const { clerkMiddleware, createRouteMatcher } = await import('@clerk/nextjs/server')
    
    const isPublicRoute = createRouteMatcher([
      '/sign-in(.*)',
      '/sign-up(.*)',
      '/api/mcp(.*)',
    ])
    
    return clerkMiddleware(async (auth, req) => {
      if (!isPublicRoute(req)) {
        await auth.protect()
      }
    })(request, {} as any)
  } catch (error) {
    console.error('Clerk middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
