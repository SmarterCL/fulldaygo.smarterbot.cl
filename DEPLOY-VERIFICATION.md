# ✅ Checklist de Verificación del Deploy

## 📋 Pasos para Verificar el Deploy en Vercel

### 1. Verificar Variables de Entorno en Vercel Dashboard

✅ Ir a: https://vercel.com/smarterbotcl/fulldaygo/settings/environment-variables

Verificar que existan:
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_test_c2V0dGxpbmctaG9nLTk3LmNsZXJrLmFjY291bnRzLmRldiQ`
- [ ] `CLERK_SECRET_KEY` = `sk_test_74O53iKBUH9ZZLkbZQuCAba3XJIxxBvwxTNY0lifPz`
- [ ] Ambas aplicadas a: Production ✓, Preview ✓, Development ✓

### 2. Verificar Último Deploy

✅ Ir a: https://vercel.com/smarterbotcl/fulldaygo/deployments

Verificar:
- [ ] El último deployment está en estado "Ready" (no "Error")
- [ ] El deployment fue después de configurar las variables
- [ ] Si fue antes, hacer un redeploy (ver paso 5)

### 3. Probar el Sitio Principal

✅ Abrir: https://fulldaygo.smarterbot.cl/

Verificar:
- [ ] El sitio carga sin error 500
- [ ] No aparece "MIDDLEWARE_INVOCATION_FAILED"
- [ ] La página se muestra correctamente

### 4. Probar el Endpoint MCP

✅ Abrir: https://fulldaygo.smarterbot.cl/api/mcp/clerk-config

**Respuesta esperada:**
```json
{
  "status": "ok",
  "config": {
    "clerkConfigured": true,
    "hasPublishableKey": true,
    "hasSecretKey": true,
    "publishableKeyPrefix": "pk_test_...",
    "environment": "test",
    "connectionValid": true
  },
  "timestamp": "2025-11-18T..."
}
```

**Si ves esto, ¡está funcionando! ✅**

Si ves `"clerkConfigured": false` o `"connectionValid": false`:
- [ ] Verificar que las variables estén en Vercel (paso 1)
- [ ] Hacer un redeploy (paso 5)

### 5. Hacer Redeploy (si es necesario)

Si el deployment fue ANTES de configurar las variables de entorno:

**Opción A: Via Dashboard**
1. Ir a: https://vercel.com/smarterbotcl/fulldaygo/deployments
2. Click en el último deployment
3. Click en "..." (menú)
4. Click en "Redeploy"
5. ✅ **Importante**: Desmarcar "Use existing Build Cache"
6. Click en "Redeploy"

**Opción B: Via GitHub**
```bash
git commit --allow-empty -m "chore: trigger redeploy with Clerk env vars"
git push origin main
```

### 6. Probar Login

Una vez verificado que Clerk está configurado:

✅ Ir a: https://fulldaygo.smarterbot.cl/sign-in

Verificar:
- [ ] Aparece el formulario de Clerk (no mensaje de error)
- [ ] Se puede intentar login con Google
- [ ] El botón de Google OAuth funciona

### 7. Verificar Logs (si hay problemas)

✅ Ir a: https://vercel.com/smarterbotcl/fulldaygo/deployments
1. Click en el deployment actual
2. Click en "View Function Logs" o "Runtime Logs"
3. Buscar errores relacionados con Clerk

## 🔍 Problemas Comunes y Soluciones

### ❌ "MIDDLEWARE_INVOCATION_FAILED"
**Causa**: Middleware de Clerk falla porque las variables no están disponibles
**Solución**: 
1. Verificar paso 1 (variables en Vercel)
2. Hacer redeploy (paso 5)

### ❌ "clerkConfigured": false
**Causa**: Las variables no llegaron al runtime
**Solución**:
1. Verificar que las variables estén en los 3 ambientes (Production, Preview, Development)
2. Hacer redeploy sin cache (paso 5)

### ❌ "connectionValid": false
**Causa**: Las credenciales de Clerk son inválidas o hay problema de red
**Solución**:
1. Verificar que las keys copiadas sean exactamente:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c2V0dGxpbmctaG9nLTk3LmNsZXJrLmFjY291bnRzLmRldiQ`
   - `CLERK_SECRET_KEY=sk_test_74O53iKBUH9ZZLkbZQuCAba3XJIxxBvwxTNY0lifPz`
2. Verificar en Clerk Dashboard que la app esté activa

### ✅ Todo funciona pero no puedo hacer login
**Verificar**:
1. Que Google OAuth esté habilitado en Clerk Dashboard
2. Las URLs estén configuradas en Clerk:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/`
   - After sign-up URL: `/`

## 📊 Resumen del Estado

Después de verificar, completa esto:

- [ ] Variables configuradas en Vercel ✓
- [ ] Deploy exitoso (Ready) ✓
- [ ] Sitio principal carga sin errores ✓
- [ ] Endpoint MCP muestra `clerkConfigured: true` ✓
- [ ] Endpoint MCP muestra `connectionValid: true` ✓
- [ ] Página de sign-in funciona ✓

Si todos están ✓, **el deploy está funcionando correctamente** 🎉

## 🐛 ¿Aún hay problemas?

Si después de verificar todo sigue sin funcionar, comparte:
1. Screenshot del endpoint MCP: https://fulldaygo.smarterbot.cl/api/mcp/clerk-config
2. Screenshot de las variables en Vercel Dashboard
3. El mensaje de error específico que aparece
4. Los logs del deployment en Vercel
