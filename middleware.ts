import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Rutas públicas que no requieren autenticación
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/mcp(.*)', // MCP endpoints públicos para diagnóstico
])

// Verificar si Clerk está configurado
const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) && 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_placeholder' &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_Y2xlcmsuc21hcnRlcmJvdC5jbCQ'

export default clerkMiddleware(async (auth, request) => {
  // Si Clerk no está configurado, permitir acceso público
  if (!clerkEnabled) {
    return NextResponse.next()
  }
  
  // Solo proteger rutas si Clerk está configurado
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
