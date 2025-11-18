// Force dynamic rendering to avoid build-time Clerk validation errors
export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">404 - Página no encontrada</h2>
        <p className="text-gray-300 mb-6">La página que buscas no existe.</p>
        <a href="/" className="text-blue-400 hover:text-blue-300 underline">
          Volver al inicio
        </a>
      </div>
    </div>
  )
}
