# Actualización de Seguridad Clerk - Client Trust Credential Stuffing Protection

## Fecha de Actualización
**2025-11-18**

## ¿Qué es esta actualización?

Clerk ha habilitado automáticamente la protección **Client Trust Credential Stuffing Protection** para proteger la aplicación y los usuarios contra ataques de relleno de credenciales (credential stuffing).

## Funcionalidad

Cuando un usuario inicia sesión con contraseña desde un nuevo cliente (por ejemplo, un nuevo dispositivo o navegador), siempre se le solicitará un segundo factor de autenticación:

- Si el usuario ha configurado 2FA (autenticación de dos factores), se utilizará ese factor
- Si NO ha configurado 2FA, se enviará automáticamente uno de los siguientes según la configuración de la aplicación:
  - **Código de un solo uso por email** (`email_code`)
  - **Código de un solo uso por SMS** (`phone_code`)
  - **Magic link por email** (`email_link`)

## Compatibilidad con nuestra aplicación

✅ **La aplicación está completamente compatible con esta actualización**

### ¿Por qué?

Esta aplicación utiliza los componentes predeterminados de Clerk para autenticación:

```typescript
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return <SignIn />
}
```

```typescript
// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return <SignUp />
}
```

Los componentes `<SignIn>` y `<SignUp>` de Clerk **manejan automáticamente** todos los flujos de autenticación, incluyendo:
- `email_code` - Código de verificación por email
- `phone_code` - Código de verificación por SMS
- `email_link` - Link mágico por email
- Cualquier otro método de 2FA configurado

### ¿Requiere cambios en el código?

❌ **NO** - No se requieren cambios en el código porque no estamos usando flujos personalizados de autenticación.

## Flujos personalizados (No aplica a esta app)

Si en el futuro se implementan flujos de autenticación personalizados usando la API de Clerk directamente, deberás asegurarte de que el código soporte estos factores de autenticación:

- `email_code`
- `phone_code`
- `email_link`

Documentación: https://clerk.com/docs/custom-flows/overview

## Experiencia del usuario

### Primer inicio de sesión en un dispositivo nuevo:

1. Usuario ingresa email y contraseña
2. Clerk detecta que es un nuevo dispositivo/cliente
3. Clerk envía automáticamente un código/link de verificación:
   - Por email (código de 6 dígitos o magic link)
   - Por SMS si el usuario tiene teléfono configurado
4. Usuario ingresa el código o hace clic en el link
5. Sesión iniciada correctamente

### Inicios de sesión subsecuentes en el mismo dispositivo:

- No se requerirá el segundo factor
- El dispositivo es "confiable" (trusted)

## Reversión

Si no estás satisfecho con esta actualización, puedes revertirla por las próximas 24 horas desde el Clerk Dashboard:

1. Ir a: https://dashboard.clerk.com/
2. Navegar a **Security** o **Settings**
3. Buscar "Client Trust" o "Credential Stuffing Protection"
4. Desactivar la función

**Nota:** No se recomienda desactivar esta función de seguridad a menos que existan problemas críticos de compatibilidad.

## Recursos

- **Clerk Dashboard**: https://dashboard.clerk.com/
- **Documentación de Client Trust**: https://clerk.com/docs/security/client-trust
- **Soporte de Clerk**: https://clerk.com/support

## Estado actual

✅ **Actualización habilitada**
✅ **Aplicación compatible**
✅ **Sin cambios de código requeridos**

---

**Última actualización**: 2025-11-18
