'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Loader2, BarChart3, TrendingUp, Star, ChevronRight, LogOut, Crown } from 'lucide-react'
import { COUNTRIES } from '@/lib/countries'
import type { MLProduct } from '@/lib/apify'
import type { TikTokVideo } from '@/lib/tiktok'
import ResultsTable from '@/components/ResultsTable'
import TikTokResults from '@/components/TikTokResults'
import { supabase } from '@/lib/supabase'

type Platform = 'mercadolibre' | 'tiktok'

const GUEST_KEY = 'os_guest_searches'
const GUEST_LIMIT = 1

const QUICK_SEARCHES: { label: string; emoji: string; country: string; platform: Platform }[] = [
  { label: 'Envases desechables', emoji: '📦', country: 'CL', platform: 'mercadolibre' },
  { label: 'Cajas repostería', emoji: '🎂', country: 'CL', platform: 'mercadolibre' },
  { label: 'Vasos de papel', emoji: '☕', country: 'CL', platform: 'mercadolibre' },
  { label: 'Bolsas kraft', emoji: '🛍️', country: 'CL', platform: 'mercadolibre' },
  { label: 'Packaging viral', emoji: '🔥', country: 'CL', platform: 'tiktok' },
  { label: 'Repostería tendencia', emoji: '🧁', country: 'CL', platform: 'tiktok' },
  { label: 'Envases aesthetic', emoji: '✨', country: 'CL', platform: 'tiktok' },
  { label: 'Ideas delivery', emoji: '🚀', country: 'CL', platform: 'tiktok' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [platform, setPlatform] = useState<Platform>('mercadolibre')
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('CL')
  const [maxItems, setMaxItems] = useState(50)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mlResults, setMlResults] = useState<MLProduct[] | null>(null)
  const [ttResults, setTtResults] = useState<TikTokVideo[] | null>(null)
  const [lastQuery, setLastQuery] = useState('')
  const [lastCountry, setLastCountry] = useState('CL')
  const [fromCache, setFromCache] = useState(false)
  const [searchesUsed, setSearchesUsed] = useState(0)
  const [searchesLimit, setSearchesLimit] = useState(3)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(7)
  const [guestSearches, setGuestSearches] = useState(0)

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(GUEST_KEY) ?? '0', 10)
    setGuestSearches(stored)

    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null)
      setAccessToken(data.session?.access_token ?? null)
      if (data.session?.user?.created_at) {
        const trialEnd = new Date(data.session.user.created_at)
        trialEnd.setDate(trialEnd.getDate() + 7)
        const days = Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / 86400000))
        setTrialDaysLeft(days)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserEmail(session?.user?.email ?? null)
      setAccessToken(session?.access_token ?? null)
      if (session?.user?.created_at) {
        const trialEnd = new Date(session.user.created_at)
        trialEnd.setDate(trialEnd.getDate() + 7)
        const days = Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / 86400000))
        setTrialDaysLeft(days)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  async function handleSearch(e: React.FormEvent | null, overrideQuery?: string, overridePlatform?: Platform, overrideCountry?: string) {
    if (e) e.preventDefault()
    const q = overrideQuery ?? query
    const p = overridePlatform ?? platform
    const c = overrideCountry ?? country
    if (!q.trim()) return

    setError('')
    setLoading(true)
    setLastQuery(q.trim())
    setLastCountry(c)

    // Límite para invitados sin cuenta
    if (!accessToken) {
      const guestCount = parseInt(localStorage.getItem(GUEST_KEY) ?? '0', 10)
      if (guestCount >= GUEST_LIMIT) {
        setError('__limite__')
        setSearchesUsed(guestCount)
        setSearchesLimit(GUEST_LIMIT)
        setLoading(false)
        return
      }
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`

    try {
      if (p === 'mercadolibre') {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers,
          body: JSON.stringify({ query: q.trim(), country: c, maxItems }),
        })
        const data = await res.json()
        if (res.status === 403 && data.error === 'límite_alcanzado') {
          setSearchesUsed(data.searches_used)
          setSearchesLimit(data.searches_limit)
          throw new Error('__limite__')
        }
        if (!res.ok) throw new Error(data.error || 'Error al buscar')
        setMlResults(data.items)
        setTtResults(null)
        setFromCache(data.fromCache ?? false)
        if (data.searches_used !== undefined) {
          setSearchesUsed(data.searches_used)
          setSearchesLimit(data.searches_limit)
        } else if (!accessToken) {
          const next = parseInt(localStorage.getItem(GUEST_KEY) ?? '0', 10) + 1
          localStorage.setItem(GUEST_KEY, String(next))
          setGuestSearches(next)
          setSearchesUsed(next)
          setSearchesLimit(GUEST_LIMIT)
        }
      } else {
        const res = await fetch('/api/search/tiktok', {
          method: 'POST',
          headers,
          body: JSON.stringify({ query: q.trim(), maxItems: 30 }),
        })
        const data = await res.json()
        if (res.status === 403 && data.error === 'límite_alcanzado') {
          setSearchesUsed(data.searches_used)
          setSearchesLimit(data.searches_limit)
          throw new Error('__limite__')
        }
        if (!res.ok) throw new Error(data.error || 'Error al buscar en TikTok')
        setTtResults(data.items)
        setMlResults(null)
        setFromCache(data.fromCache ?? false)
        if (data.searches_used !== undefined) {
          setSearchesUsed(data.searches_used)
          setSearchesLimit(data.searches_limit)
        } else if (!accessToken) {
          const next = parseInt(localStorage.getItem(GUEST_KEY) ?? '0', 10) + 1
          localStorage.setItem(GUEST_KEY, String(next))
          setGuestSearches(next)
          setSearchesUsed(next)
          setSearchesLimit(GUEST_LIMIT)
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al buscar'
      if (msg === '__limite__') {
        setError('__limite__')
        setLoading(false)
        return
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const hasResults = mlResults !== null || ttResults !== null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg">
            <span className="text-brand-600">Omni</span><span className="text-slate-800">Seller</span>
          </Link>
          <div className="flex items-center gap-3">
            {userEmail ? (
              <>
                <span className="hidden sm:inline-block text-xs text-slate-400 truncate max-w-[160px]">{userEmail}</span>
                <button onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                  <LogOut className="w-3.5 h-3.5" /> Salir
                </button>
              </>
            ) : (
              <>
                <Link href="/pricing" className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 transition-colors">
                  <Crown className="w-3.5 h-3.5" />
                  Ver planes
                </Link>
                <Link href="/auth/register" className="bg-brand-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-brand-700">
                  Registrarse gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Buscador de mercado</h1>
          <p className="text-slate-500 text-sm">Busca cualquier producto y ve precios, competidores y tendencias reales.</p>
        </div>

        {/* Search card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
          {/* Platform toggle */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setPlatform('mercadolibre')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                platform === 'mercadolibre'
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-brand-300'
              }`}
            >
              🛒 MercadoLibre
            </button>
            <button
              onClick={() => setPlatform('tiktok')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                platform === 'tiktok'
                  ? 'bg-pink-500 text-white border-pink-500 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-pink-300'
              }`}
            >
              🎵 TikTok
            </button>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearch} className="w-full">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={platform === 'mercadolibre'
                    ? 'Ej: envases desechables, cajas repostería...'
                    : 'Ej: packaging aesthetic, repostería viral...'}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    platform === 'tiktok'
                      ? 'border-slate-200 focus:ring-pink-400'
                      : 'border-slate-200 focus:ring-brand-400'
                  }`}
                  disabled={loading}
                />
              </div>

              {platform === 'mercadolibre' && (
                <>
                  <select value={country} onChange={e => setCountry(e.target.value)}
                    className="px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                    disabled={loading}>
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                  <select value={maxItems} onChange={e => setMaxItems(Number(e.target.value))}
                    className="px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                    disabled={loading}>
                    <option value={20}>20 resultados</option>
                    <option value={50}>50 resultados</option>
                    <option value={100}>100 resultados</option>
                  </select>
                </>
              )}

              <button type="submit" disabled={loading || !query.trim()}
                className={`flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] ${
                  platform === 'tiktok' ? 'bg-pink-500 hover:bg-pink-600' : 'bg-brand-600 hover:bg-brand-700'
                }`}>
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Buscando...</>
                ) : (
                  <><Search className="w-4 h-4" /> Buscar</>
                )}
              </button>
            </div>

            {platform === 'tiktok' && (
              <p className="text-xs text-slate-400 mt-2">
                🎵 TikTok busca videos virales globales. Puede tardar ~1-2 minutos la primera vez.
              </p>
            )}

            {error && error !== '__limite__' && (
              <div className="mt-3 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            {error === '__limite__' && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800">Alcanzaste el límite de tu plan gratuito</p>
                  <p className="text-xs text-amber-600 mt-0.5">Usaste {searchesUsed} de {searchesLimit} búsquedas. Mejora tu plan para buscar sin límites.</p>
                </div>
                <Link href="/pricing" className="text-sm font-bold bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors whitespace-nowrap">
                  Ver planes →
                </Link>
              </div>
            )}
          </form>
        </div>

        {/* Results */}
        {hasResults && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
            {fromCache && (
              <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 mb-4 w-fit">
                ⚡ Resultado desde caché — sin costo Apify
              </div>
            )}
            {mlResults && <ResultsTable items={mlResults} query={lastQuery} country={lastCountry} />}
            {ttResults && <TikTokResults items={ttResults} query={lastQuery} />}
          </div>
        )}

        {/* Quick searches */}
        {!hasResults && (
          <>
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Búsquedas rápidas</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {QUICK_SEARCHES.map(q => (
                  <button key={q.label + q.platform}
                    onClick={() => {
                      setQuery(q.label)
                      setCountry(q.country)
                      setPlatform(q.platform)
                      handleSearch(null, q.label, q.platform, q.country)
                    }}
                    className={`flex items-center gap-2 bg-white border rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-all text-left group ${
                      q.platform === 'tiktok'
                        ? 'border-slate-200 hover:border-pink-300 hover:text-pink-600'
                        : 'border-slate-200 hover:border-brand-300 hover:text-brand-700'
                    }`}>
                    <span className="text-lg">{q.emoji}</span>
                    <span className="flex-1 text-xs">{q.label}</span>
                    <span className="text-xs text-slate-300">{q.platform === 'tiktok' ? '🎵' : '🛒'}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
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
                <p className="text-3xl font-extrabold text-slate-900">{searchesUsed} / {searchesLimit}</p>
                <p className="text-slate-400 text-xs mt-1">{userEmail ? 'en tu plan actual' : 'en tu periodo de prueba'}</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-semibold text-slate-700 text-sm">Plataformas activas</span>
                </div>
                <p className="text-3xl font-extrabold text-slate-900">🛒 + 🎵</p>
                <p className="text-slate-400 text-xs mt-1">MercadoLibre y TikTok</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="font-semibold text-slate-700 text-sm">
                    {userEmail ? 'Días de trial' : 'Tu plan'}
                  </span>
                </div>
                {userEmail ? (
                  <>
                    <p className="text-3xl font-extrabold text-slate-900">{trialDaysLeft} días</p>
                    <p className="text-slate-400 text-xs mt-1">
                      {trialDaysLeft > 0 ? 'Prueba gratuita activa' : 'Trial vencido — mejora tu plan'}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-extrabold text-slate-900">Gratis</p>
                    <p className="text-slate-400 text-xs mt-1">
                      <Link href="/auth/register" className="text-brand-600 font-semibold hover:underline">Regístrate</Link> para 7 días + 3 búsquedas
                    </p>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
