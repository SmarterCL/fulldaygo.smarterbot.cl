# Configuración de Clerk - Variables de Entorno Configuradas

## ✅ Estado Actual

Las credenciales de Clerk han sido configuradas para desarrollo local:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: ✅ Configurada
- `CLERK_SECRET_KEY`: ✅ Configurada

## 📁 Archivos Creados

### 1. `.env.local`
Contiene las variables de entorno para desarrollo local. Este archivo está en `.gitignore` y no se sube al repositorio por seguridad.

### 2. `configure-vercel-env.sh`
Script automatizado para configurar las mismas variables en Vercel. 

## 🚀 Para Deployment en Vercel

### Opción A: Usar el Script Automatizado (Recomendado)

```bash
# Asegúrate de tener Vercel CLI instalado
npm install -g vercel

# Ejecutar el script
./configure-vercel-env.sh
```

El script:
1. Verifica que Vercel CLI esté instalado
2. Linkea el proyecto si es necesario
3. Configura ambas variables en Production, Preview y Development
4. Te da instrucciones para el redeploy

### Opción B: Configuración Manual via CLI

```bash
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
echo "pk_test_c2V0dGxpbmctaG9nLTk3LmNsZXJrLmFjY291bnRzLmRldiQ" | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
echo "pk_test_c2V0dGxpbmctaG9nLTk3LmNsZXJrLmFjY291bnRzLmRldiQ" | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview
echo "pk_test_c2V0dGxpbmctaG9nLTk3LmNsZXJrLmFjY291bnRzLmRldiQ" | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development

# CLERK_SECRET_KEY
echo "sk_test_74O53iKBUH9ZZLkbZQuCAba3XJIxxBvwxTNY0lifPz" | vercel env add CLERK_SECRET_KEY production
echo "sk_test_74O53iKBUH9ZZLkbZQuCAba3XJIxxBvwxTNY0lifPz" | vercel env add CLERK_SECRET_KEY preview
echo "sk_test_74O53iKBUH9ZZLkbZQuCAba3XJIxxBvwxTNY0lifPz" | vercel env add CLERK_SECRET_KEY development
```

### Opción C: Configuración via Dashboard de Vercel

1. Ir a: https://vercel.com/smarterbotcl/fulldaygo/settings/environment-variables
2. Agregar las siguientes variables para **Production**, **Preview** y **Development**:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c2V0dGxpbmctaG9nLTk3LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_74O53iKBUH9ZZLkbZQuCAba3XJIxxBvwxTNY0lifPz
```

## 🔄 Después de Configurar en Vercel

### Redeploy el proyecto:

```bash
# Opción 1: Via CLI
vercel --prod

# Opción 2: Via GitHub (trigger automático)
git commit --allow-empty -m "chore: trigger redeploy with Clerk env vars"
git push origin main
```

## ✅ Verificación

### Local:
```bash
npm run dev
# Abrir http://localhost:3000/api/mcp/clerk-config
# Debe mostrar "clerkConfigured": true
```

### Producción (después del redeploy):
```bash
curl https://fulldaygo.smarterbot.cl/api/mcp/clerk-config
```

Respuesta esperada:
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
  }
}
```

## 🔒 Seguridad

- ✅ `.env.local` está en `.gitignore` y no se sube al repositorio
- ✅ Las credenciales son de test (`pk_test_` y `sk_test_`)
- ⚠️ Para producción, considera usar credenciales live (`pk_live_` y `sk_live_`)

## 📚 Recursos

- **Clerk Dashboard**: https://dashboard.clerk.com/
- **Documentación Completa**: Ver `MCP-CLERK-GUIDE.md`
- **Actualización de Seguridad**: Ver `CLERK-SECURITY-UPDATE.md`

## 🎯 Próximos Pasos

1. ✅ Configurar variables de entorno locales
2. ✅ Crear script de configuración para Vercel
3. [ ] Ejecutar script o configurar manualmente en Vercel
4. [ ] Hacer redeploy en Vercel
5. [ ] Verificar que el sitio funcione correctamente
6. [ ] Probar login con Google OAuth
