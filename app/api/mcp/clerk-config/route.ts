import { NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"

/**
 * MCP Endpoint para configuración de Clerk
 * 
 * Este endpoint permite:
 * - Verificar la configuración actual de Clerk
 * - Validar las llaves de API
 * - Obtener información sobre el estado del login corporativo
 */

export async function GET() {
  try {
    // Verificar que las variables de entorno estén configuradas
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    const secretKey = process.env.CLERK_SECRET_KEY
    
    const config = {
      clerkConfigured: Boolean(publishableKey && secretKey),
      hasPublishableKey: Boolean(publishableKey),
      hasSecretKey: Boolean(secretKey),
      publishableKeyPrefix: publishableKey?.substring(0, 10) + "..." || "not_set",
      environment: publishableKey?.startsWith("pk_live_") ? "production" : "test",
      signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in",
      signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up",
      afterSignInUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "/",
      afterSignUpUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/",
    }

    // Si Clerk está configurado, intentar validar la conexión
    if (config.clerkConfigured) {
      try {
        const client = await clerkClient()
        // Intentar una operación simple para validar la conexión
        await client.users.getCount()
        config.connectionValid = true
      } catch (error) {
        config.connectionValid = false
        config.connectionError = error instanceof Error ? error.message : "Unknown error"
      }
    }

    return NextResponse.json({
      status: "ok",
      config,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

/**
 * POST endpoint para validar nuevas llaves de Clerk
 * Útil para testing de configuración sin necesidad de redeploy
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, publishableKey, secretKey } = body

    if (action === "validate") {
      // Validar formato de las llaves
      const validations = {
        publishableKeyFormat: publishableKey?.match(/^pk_(test|live)_[a-zA-Z0-9]+$/) !== null,
        secretKeyFormat: secretKey?.match(/^sk_(test|live)_[a-zA-Z0-9]+$/) !== null,
        keysMatch: publishableKey && secretKey && 
          publishableKey.includes("test") === secretKey.includes("test"),
      }

      return NextResponse.json({
        status: "ok",
        validations,
        valid: Object.values(validations).every(v => v === true),
        timestamp: new Date().toISOString(),
      })
    }

    if (action === "test-connection") {
      // Para testing, las llaves deben venir en el body
      // En producción, esto debería estar más protegido
      return NextResponse.json({
        status: "ok",
        message: "Connection test not implemented in this version",
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json(
      {
        status: "error",
        error: "Invalid action. Supported actions: validate, test-connection",
      },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
