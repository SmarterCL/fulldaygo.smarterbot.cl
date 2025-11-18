# Fix para https://fulldaygo.smarterbot.cl/

## Problema
El sitio está mostrando error 500: `MIDDLEWARE_INVOCATION_FAILED` porque Clerk no está configurado en Vercel.

## Solución: Configurar Clerk en Vercel

### Paso 1: Obtener Keys de Clerk

1. Ir a https://dashboard.clerk.com/
2. Crear o seleccionar la aplicación "fulldaygo"
3. Ir a: **API Keys**
4. Copiar:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (empieza con `pk_live_` o `pk_test_`)
   - `CLERK_SECRET_KEY` (empieza con `sk_live_` o `sk_test_`)

### Paso 2: Agregar Variables en Vercel

1. Ir a: https://vercel.com/smarterbotcl/fulldaygo/settings/environment-variables
2. Agregar estas variables para **Production**, **Preview**, y **Development**:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_xxxxxxxxxxxx
CLERK_SECRET_KEY = sk_live_xxxxxxxxxxxx
```

### Paso 3: Redeploy

Una vez agregadas las variables:
1. Ir a: https://vercel.com/smarterbotcl/fulldaygo/deployments
2. Encontrar el último deployment
3. Click en "..." → "Redeploy"
4. Seleccionar "Use existing Build Cache" = **NO** (forzar rebuild)

---

## Alternativa: Deshabilitar Clerk Temporalmente

Si no puedes configurar Clerk ahora, puedes deshabilitar temporalmente la autenticación:

```bash
# En el servidor
cd /root/fulldaygo

# Backup del middleware actual
cp middleware.ts middleware.ts.clerk-backup

# Crear middleware simple sin Clerk
cat > middleware.ts << 'EOF'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
EOF

# Commit y push
git add middleware.ts
git commit -m "temp: Disable Clerk authentication"
GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no" git push origin main
```

Esto permitirá que el sitio funcione sin autenticación mientras configuras Clerk.

---

## Verificación

Después de cualquiera de las soluciones, verifica:

```bash
curl -I https://fulldaygo.smarterbot.cl/
```

Debe retornar `HTTP/2 200` en lugar de `HTTP/2 500`.
