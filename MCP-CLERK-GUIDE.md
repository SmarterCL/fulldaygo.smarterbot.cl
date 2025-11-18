# Configuración de Clerk usando MCP (Model Context Protocol)

## ¿Qué es el MCP de Clerk?

El MCP (Model Context Protocol) es un endpoint de API que permite configurar y validar las credenciales de Clerk de forma programática. Este sistema facilita la integración del login corporativo sin necesidad de configuración manual.

## Endpoints MCP Disponibles

### 1. `/api/mcp/clerk-config` - Configuración y Diagnóstico

Este endpoint permite verificar el estado de la configuración de Clerk.

#### GET - Verificar Configuración

```bash
curl https://fulldaygo.smarterbot.cl/api/mcp/clerk-config
```

Respuesta:
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
  "timestamp": "2025-11-18T12:00:00.000Z"
}
```

#### POST - Validar Llaves

```bash
curl -X POST https://fulldaygo.smarterbot.cl/api/mcp/clerk-config \
  -H "Content-Type: application/json" \
  -d '{
    "action": "validate",
    "publishableKey": "pk_test_xxxxx",
    "secretKey": "sk_test_xxxxx"
  }'
```

Respuesta:
```json
{
  "status": "ok",
  "validations": {
    "publishableKeyFormat": true,
    "secretKeyFormat": true,
    "keysMatch": true
  },
  "valid": true,
  "timestamp": "2025-11-18T12:00:00.000Z"
}
```

### 2. `/api/mcp/sync-user` - Sincronización de Usuarios

Este endpoint permite sincronizar usuarios de Clerk con tu base de datos (Supabase).

```bash
curl -X POST https://fulldaygo.smarterbot.cl/api/mcp/sync-user \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_xxxxx",
    "email": "usuario@empresa.cl"
  }'
```

## Pasos para Configurar Clerk

### 1. Obtener Llaves desde Clerk Dashboard

1. Ir a https://dashboard.clerk.com/
2. Crear o seleccionar tu aplicación
3. Ir a "API Keys" en el sidebar
4. Copiar las llaves:
   - `Publishable key` (empieza con `pk_test_` o `pk_live_`)
   - `Secret key` (empieza con `sk_test_` o `sk_live_`)

### 2. Configurar Variables de Entorno

#### Desarrollo Local

Crear archivo `.env.local` basado en `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Editar `.env.local` y reemplazar los placeholders:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_tu_llave_aqui
CLERK_SECRET_KEY=sk_test_tu_llave_aqui
```

#### Producción (Vercel)

##### Opción A: Via Dashboard

1. Ir a https://vercel.com/smarterbotcl/[tu-proyecto]/settings/environment-variables
2. Agregar las variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` → `pk_live_xxxxx`
   - `CLERK_SECRET_KEY` → `sk_live_xxxxx`
3. Aplicar a: Production, Preview, Development

##### Opción B: Via CLI

```bash
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
# Pegar: pk_live_xxxxx

vercel env add CLERK_SECRET_KEY production
# Pegar: sk_live_xxxxx
```

### 3. Configurar OAuth Providers en Clerk

1. En Clerk Dashboard, ir a **User & Authentication** → **Social Connections**
2. Activar **Google**:
   - Scopes recomendados: `openid`, `profile`, `email`
3. (Opcional) Activar otros providers: Microsoft, GitHub, etc.

### 4. Configurar URLs en Clerk Dashboard

En **Paths**:

```
Sign-in URL: /sign-in
Sign-up URL: /sign-up
After sign-in URL: /
After sign-up URL: /
```

### 5. Verificar Configuración

#### Verificar localmente:

```bash
npm run dev
# Abrir http://localhost:3000/api/mcp/clerk-config
```

#### Verificar en producción:

```bash
curl https://fulldaygo.smarterbot.cl/api/mcp/clerk-config
```

El endpoint debe retornar `"clerkConfigured": true` y `"connectionValid": true`.

## Uso del Sistema de Autenticación

### Páginas de Login

- **Sign In**: `/sign-in`
- **Sign Up**: `/sign-up`

### Middleware de Autenticación

El archivo `middleware.ts` protege automáticamente todas las rutas excepto:
- `/sign-in/*`
- `/sign-up/*`
- `/api/mcp/*` (endpoints de diagnóstico)

### Rutas Protegidas

Todas las demás rutas requieren autenticación. Si un usuario no está autenticado, será redirigido automáticamente a `/sign-in`.

## Integración con SmarterOS

Para integrar con el dashboard principal de SmarterOS:

```env
NEXT_PUBLIC_SMARTERBOT_DASHBOARD_URL=https://app.smarterbot.cl/dashboard
NEXT_PUBLIC_SMARTERBOT_GOOGLE_REDIRECT=https://app.smarterbot.cl/sso-callback
NEXT_PUBLIC_SMARTERBOT_TENANT=smarterbot
```

## Webhook de Clerk (Opcional)

Para recibir eventos de Clerk (usuario creado, sesión iniciada, etc.):

1. En Clerk Dashboard, ir a **Webhooks**
2. Crear nuevo webhook:
   - URL: `https://fulldaygo.smarterbot.cl/api/webhooks/clerk`
   - Eventos: `user.created`, `session.created`, etc.
3. Copiar el `Signing Secret`
4. Agregar a variables de entorno:
   ```
   CLERK_WEBHOOK_SECRET=whsec_xxxxx
   ```

## Troubleshooting

### Error: "Clerk publishable key is missing"

1. Verificar que `.env.local` existe
2. Verificar que la variable `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` está configurada
3. Reiniciar el servidor de desarrollo

### Error: "Invalid publishable key"

1. Usar el endpoint de validación:
   ```bash
   curl -X POST http://localhost:3000/api/mcp/clerk-config \
     -H "Content-Type: application/json" \
     -d '{"action": "validate", "publishableKey": "tu_llave"}'
   ```
2. Verificar que la llave empieza con `pk_test_` o `pk_live_`
3. Copiar la llave completa desde Clerk Dashboard

### Error: "Connection failed"

1. Verificar que `CLERK_SECRET_KEY` está configurada
2. Verificar que las llaves coinciden (ambas `test` o ambas `live`)
3. Verificar conectividad con Clerk: `curl https://api.clerk.com/v1/health`

## Recursos

- **Clerk Dashboard**: https://dashboard.clerk.com/
- **Clerk Docs**: https://clerk.com/docs
- **Next.js + Clerk**: https://clerk.com/docs/quickstarts/nextjs
- **Support**: https://clerk.com/support

## Próximos Pasos

Una vez configurado Clerk:

1. ✅ Configurar variables de entorno
2. ✅ Crear páginas de sign-in y sign-up
3. ✅ Implementar middleware de autenticación
4. ✅ Configurar MCP endpoints
5. [ ] Implementar sincronización con Supabase
6. [ ] Configurar webhooks de Clerk
7. [ ] Implementar gate de Shopify (si aplica)
8. [ ] Deploy a producción

## Actualizaciones de Seguridad

### Client Trust Credential Stuffing Protection (Habilitado: 2025-11-18)

Clerk ha habilitado protección contra ataques de credential stuffing. Cuando los usuarios inician sesión desde un nuevo dispositivo, se les solicitará un segundo factor de autenticación:

- **Si tienen 2FA configurado**: Se usa su método 2FA
- **Si NO tienen 2FA**: Se envía automáticamente un código por email/SMS o magic link

**Compatibilidad**: ✅ Esta aplicación usa componentes Clerk predeterminados (`<SignIn>` y `<SignUp>`) que manejan automáticamente estos flujos.

**Documentación completa**: Ver `CLERK-SECURITY-UPDATE.md`
