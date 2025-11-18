import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { clerkEnabled } from '@/lib/clerk-config'

// Rutas públicas que no requieren autenticación
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/mcp(.*)', // MCP endpoints públicos para diagnóstico
])

export default clerkMiddleware(async (auth, request) => {
  // Solo proteger rutas si Clerk está configurado
  if (clerkEnabled && !isPublicRoute(request)) {
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
