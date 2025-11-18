# MCP Clerk - Sistema de Configuración Completo

## Resumen Ejecutivo

Este sistema implementa un protocolo MCP (Model Context Protocol) para configurar Clerk de forma programática, facilitando el login corporativo sin configuración manual compleja.

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    Aplicación Next.js                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌─────────────────┐          │
│  │   Middleware     │────────▶│  ClerkProvider  │          │
│  │  (Protección)    │         │   (Layout)      │          │
│  └──────────────────┘         └─────────────────┘          │
│           │                             │                    │
│           ▼                             ▼                    │
│  ┌──────────────────┐         ┌─────────────────┐          │
│  │  /sign-in        │         │   /sign-up      │          │
│  │  (con fallback)  │         │  (con fallback) │          │
│  └──────────────────┘         └─────────────────┘          │
│                                                               │
│  ┌────────────────────────────────────────────┐             │
│  │     MCP API: /api/mcp/clerk-config         │             │
│  │                                             │             │
│  │  GET  → Estado de configuración            │             │
│  │  POST → Validación de llaves               │             │
│  └────────────────────────────────────────────┘             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │  Clerk Services │
                   │  (OAuth, Auth)  │
                   └─────────────────┘
```

## Componentes del Sistema

### 1. MCP API Endpoint (`/api/mcp/clerk-config`)

#### GET - Verificación de Estado
```bash
curl http://localhost:3000/api/mcp/clerk-config
```

**Respuesta cuando NO está configurado:**
```json
{
  "status": "ok",
  "config": {
    "clerkConfigured": false,
    "hasPublishableKey": false,
    "hasSecretKey": false,
    "publishableKeyPrefix": "undefined...",
    "environment": "test",
    "signInUrl": "/sign-in",
    "signUpUrl": "/sign-up",
    "afterSignInUrl": "/",
    "afterSignUpUrl": "/"
  },
  "timestamp": "2025-11-18T13:00:00.000Z"
}
```

**Respuesta cuando SÍ está configurado:**
```json
{
  "status": "ok",
  "config": {
    "clerkConfigured": true,
    "hasPublishableKey": true,
    "hasSecretKey": true,
    "publishableKeyPrefix": "pk_live_...",
    "environment": "production",
    "signInUrl": "/sign-in",
    "signUpUrl": "/sign-up",
    "afterSignInUrl": "/",
    "afterSignUpUrl": "/",
    "connectionValid": true
  },
  "timestamp": "2025-11-18T13:00:00.000Z"
}
```

#### POST - Validación de Llaves
```bash
curl -X POST http://localhost:3000/api/mcp/clerk-config \
  -H "Content-Type: application/json" \
  -d '{
    "action": "validate",
    "publishableKey": "pk_test_xxxxx",
    "secretKey": "sk_test_xxxxx"
  }'
```

**Respuesta con llaves válidas:**
```json
{
  "status": "ok",
  "validations": {
    "publishableKeyFormat": true,
    "secretKeyFormat": true,
    "keysMatch": true
  },
  "valid": true,
  "timestamp": "2025-11-18T13:00:00.000Z"
}
```

### 2. Middleware de Autenticación

**Archivo:** `middleware.ts`

**Funcionalidad:**
- Protege todas las rutas automáticamente cuando Clerk está habilitado
- Permite acceso público a: `/sign-in`, `/sign-up`, `/api/mcp/*`
- Se deshabilita automáticamente si Clerk no está configurado

**Flujo de Decisión:**
```
Usuario accede a una ruta
    │
    ├──▶ ¿Es ruta pública? ──▶ SÍ ──▶ Permitir acceso
    │
    └──▶ NO
         │
         ├──▶ ¿Clerk configurado? ──▶ NO ──▶ Permitir acceso
         │
         └──▶ SÍ
              │
              ├──▶ ¿Usuario autenticado? ──▶ SÍ ──▶ Permitir acceso
              │
              └──▶ NO ──▶ Redirigir a /sign-in
```

### 3. Páginas de Autenticación

#### Sign-in (`/sign-in`)
- **Con Clerk configurado:** Muestra componente `<SignIn />` de Clerk
- **Sin Clerk configurado:** Muestra mensaje de ayuda con instrucciones

#### Sign-up (`/sign-up`)
- **Con Clerk configurado:** Muestra componente `<SignUp />` de Clerk
- **Sin Clerk configurado:** Muestra mensaje de ayuda con instrucciones

### 4. Sistema de Test Automatizado

**Archivo:** `test-mcp-clerk.sh`

**Tests incluidos:**
1. ✅ Verificar configuración de Clerk (GET)
2. ✅ Validar llaves con formato correcto (POST)
3. ✅ Validar llaves con formato inválido (POST)
4. ✅ Validar llaves desajustadas test/live (POST)
5. ✅ Verificar acceso a páginas de autenticación

**Uso:**
```bash
./test-mcp-clerk.sh
```

## Flujo de Configuración

### Para Desarrollo Local

```bash
# 1. Copiar template
cp .env.local.example .env.local

# 2. Editar .env.local con tus llaves de Clerk
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
# CLERK_SECRET_KEY=sk_test_xxxxx

# 3. Iniciar servidor
npm run dev

# 4. Verificar configuración
curl http://localhost:3000/api/mcp/clerk-config

# 5. Ejecutar tests
./test-mcp-clerk.sh

# 6. Acceder a la app
open http://localhost:3000/sign-in
```

### Para Producción (Vercel)

```bash
# Opción 1: Via Dashboard
# Ir a: https://vercel.com/[tu-proyecto]/settings/environment-variables
# Agregar:
#   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_xxxxx
#   CLERK_SECRET_KEY = sk_live_xxxxx

# Opción 2: Via CLI
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
vercel env add CLERK_SECRET_KEY production

# Redeploy
vercel --prod
```

## Variables de Entorno Requeridas

### Mínimas (Obligatorias)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx  # o pk_live_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx                    # o sk_live_xxxxx
```

### Opcionales (URLs)
```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### Integración SmarterOS (Opcional)
```env
NEXT_PUBLIC_SMARTERBOT_DASHBOARD_URL=https://app.smarterbot.cl/dashboard
NEXT_PUBLIC_SMARTERBOT_GOOGLE_REDIRECT=https://app.smarterbot.cl/sso-callback
NEXT_PUBLIC_SMARTERBOT_TENANT=smarterbot
```

## Configuración de OAuth Providers

### Google OAuth (Recomendado)
1. Ir a Clerk Dashboard → **User & Authentication** → **Social Connections**
2. Activar: **Google**
3. Configurar Scopes: `openid`, `profile`, `email`

### Otros Providers
- Microsoft Azure AD
- GitHub
- Facebook
- LinkedIn
- Apple
- (Ver documentación de Clerk para más)

## Solución de Problemas

### Problema: "Clerk no configurado"
**Causa:** Variables de entorno no configuradas  
**Solución:**
```bash
# Verificar que .env.local existe
ls -la .env.local

# Verificar contenido
cat .env.local

# Reiniciar servidor
npm run dev
```

### Problema: "Invalid publishable key"
**Causa:** Formato de llave incorrecto  
**Solución:**
```bash
# Usar endpoint de validación
curl -X POST http://localhost:3000/api/mcp/clerk-config \
  -H "Content-Type: application/json" \
  -d '{"action": "validate", "publishableKey": "tu_llave"}'

# Verificar que la llave empieza con pk_test_ o pk_live_
```

### Problema: "Connection failed"
**Causa:** Llaves incorrectas o desajustadas  
**Solución:**
```bash
# Verificar que ambas llaves son del mismo ambiente
# ✅ Correcto: pk_test_ + sk_test_
# ✅ Correcto: pk_live_ + sk_live_
# ❌ Incorrecto: pk_test_ + sk_live_

# Verificar endpoint MCP
curl http://localhost:3000/api/mcp/clerk-config
```

## Seguridad

### Buenas Prácticas Implementadas
- ✅ Variables de entorno no expuestas en cliente
- ✅ Secret key solo en server-side
- ✅ Validación de formato de llaves
- ✅ Separación test/production
- ✅ MCP endpoints seguros (solo lectura de estado)
- ✅ .env.local en .gitignore

### Recomendaciones
- 🔒 Usar llaves `pk_live_` y `sk_live_` en producción
- 🔒 Usar llaves `pk_test_` y `sk_test_` en desarrollo
- 🔒 Nunca commitear llaves reales al repositorio
- 🔒 Rotar llaves periódicamente
- 🔒 Configurar webhooks de Clerk con secret

## Métricas y Monitoreo

### Endpoints para Monitoreo
```bash
# Estado general
GET /api/mcp/clerk-config

# Respuesta indica:
# - clerkConfigured: true/false
# - connectionValid: true/false (si está configurado)
# - environment: "test" o "production"
```

### Logs a Observar
- Middleware: Protección de rutas
- Sign-in/Sign-up: Accesos y errores
- MCP API: Consultas de estado

## Referencias

- **Documentación Clerk:** https://clerk.com/docs
- **Next.js + Clerk:** https://clerk.com/docs/quickstarts/nextjs
- **Clerk Dashboard:** https://dashboard.clerk.com/
- **Soporte Clerk:** https://clerk.com/support

## Changelog

### v1.0.0 (2025-11-18)
- ✅ Implementación completa del sistema MCP
- ✅ Endpoint GET para verificación de estado
- ✅ Endpoint POST para validación de llaves
- ✅ Middleware de protección de rutas
- ✅ Páginas sign-in/sign-up con fallback
- ✅ Script de tests automatizados
- ✅ Documentación completa
- ✅ Localización en español (es-CL)

---

**Autor:** Sistema MCP Clerk Configuration  
**Versión:** 1.0.0  
**Última actualización:** 2025-11-18
