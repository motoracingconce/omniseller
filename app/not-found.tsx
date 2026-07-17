import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Página no encontrada',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <p className="text-brand-400 font-extrabold text-8xl">404</p>
        <h1 className="text-3xl font-extrabold text-white">Página no encontrada</h1>
        <p className="text-slate-400 max-w-sm mx-auto">
          La URL que buscas no existe o fue movida. Vuelve al inicio o prueba con el dashboard.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/"
            className="bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors"
          >
            Ir al inicio
          </Link>
          <Link
            href="/dashboard"
            className="bg-slate-800 text-slate-200 px-6 py-3 rounded-xl font-semibold hover:bg-slate-700 transition-colors border border-slate-700"
          >
            Ir al dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
