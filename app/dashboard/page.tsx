import Link from 'next/link'
import SearchForm from '@/components/SearchForm'
import { BarChart3, TrendingUp, Star, ChevronRight } from 'lucide-react'

const QUICK_SEARCHES = [
  { label: 'Envases desechables', emoji: '📦', country: 'CL' },
  { label: 'Cajas de cartón repostería', emoji: '🎂', country: 'CL' },
  { label: 'Vasos de papel', emoji: '☕', country: 'CL' },
  { label: 'Bolsas kraft', emoji: '🛍️', country: 'CL' },
  { label: 'Potes con tapa', emoji: '🫙', country: 'CL' },
  { label: 'Productos virales', emoji: '🔥', country: 'MX' },
  { label: 'Importados tendencia', emoji: '📈', country: 'BR' },
  { label: 'Accesorios cocina', emoji: '🍳', country: 'MX' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg">
            <span className="text-brand-600">Omni</span><span className="text-slate-800">Seller</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-sm text-slate-500">
              Plan: <span className="font-semibold text-brand-600">Explorador (7 días gratis)</span>
            </span>
            <Link href="/auth/register" className="bg-brand-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-brand-700">
              Mejorar plan
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Buscador de mercado</h1>
          <p className="text-slate-500 text-sm">Busca cualquier producto y ve precios, competidores y tendencias reales.</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
          <SearchForm />
        </div>

        {/* Quick searches */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Búsquedas rápidas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_SEARCHES.map(q => (
              <button
                key={q.label}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:border-brand-300 hover:text-brand-700 transition-all text-left group"
              >
                <span className="text-lg">{q.emoji}</span>
                <span className="flex-1">{q.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-400 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-brand-600" />
              </div>
              <span className="font-semibold text-slate-700 text-sm">Búsquedas realizadas</span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">0 / 3</p>
            <p className="text-slate-400 text-xs mt-1">en tu periodo de prueba</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-semibold text-slate-700 text-sm">País activo</span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">🇨🇱 Chile</p>
            <p className="text-slate-400 text-xs mt-1">Mejora a Starter para +3 países</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <span className="font-semibold text-slate-700 text-sm">Días restantes</span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">7 días</p>
            <p className="text-slate-400 text-xs mt-1">Prueba gratuita activa</p>
          </div>
        </div>
      </main>
    </div>
  )
}
