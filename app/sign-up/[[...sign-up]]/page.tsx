import { SignUp } from '@clerk/nextjs'
import { clerkEnabled } from '@/lib/clerk-config'

export default function SignUpPage() {
  if (!clerkEnabled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Clerk no configurado</h1>
          <p className="mb-4">
            Las credenciales de Clerk no están configuradas. Por favor, configura las siguientes variables de entorno:
          </p>
          <ul className="list-disc list-inside mb-4 text-sm font-mono bg-gray-100 p-4 rounded">
            <li>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</li>
            <li>CLERK_SECRET_KEY</li>
          </ul>
          <p className="text-sm text-gray-600">
            Consulta <code className="bg-gray-100 px-2 py-1 rounded">MCP-CLERK-GUIDE.md</code> para más información.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg"
          }
        }}
      />
    </div>
  )
}
