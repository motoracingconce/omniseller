'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart3, Crown, LogOut, Star, Zap, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type UserPlan = 'trial' | 'starter' | 'pro'

const PLAN_LABELS: Record<UserPlan, { label: string; color: string; icon: React.ReactNode }> = {
  trial: { label: 'Trial gratuito', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: <Star className="w-4 h-4" /> },
  starter: { label: 'Starter', color: 'text-brand-600 bg-brand-50 border-brand-200', icon: <Zap className="w-4 h-4" /> },
  pro: { label: 'Pro', color: 'text-purple-600 bg-purple-50 border-purple-200', icon: <Crown className="w-4 h-4" /> },
}

export default function AccountPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [plan] = useState<UserPlan>('trial')
  const [trialDaysLeft, setTrialDaysLeft] = useState(7)
  const [searchesUsed, setSearchesUsed] = useState(0)
  const [searchesLimit, setSearchesLimit] = useState(3)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push('/auth/login'); return }
      const user = data.session.user
      setEmail(user.email ?? null)

      if (user.created_at) {
        const trialEnd = new Date(user.created_at)
        trialEnd.setDate(trialEnd.getDate() + 7)
        setTrialDaysLeft(Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / 86400000)))
      }

      // Fetch searches from users table
      const { data: userData } = await supabase
        .from('users')
        .select('searches_used, searches_limit, plan')
        .eq('id', user.id)
        .single()

      if (userData) {
        setSearchesUsed(userData.searches_used ?? 0)
        setSearchesLimit(userData.searches_limit ?? 3)
      }
      setLoading(false)
    })
  }, [router])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const planInfo = PLAN_LABELS[plan]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg">
            <span className="text-brand-600">Omni</span><span className="text-slate-800">Seller</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-700">
            ← Volver al dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-8">Mi cuenta</h1>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-slate-200 rounded-2xl" />
            <div className="h-32 bg-slate-200 rounded-2xl" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Plan card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Plan actual</p>
                  <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full border ${planInfo.color}`}>
                    {planInfo.icon}
                    {planInfo.label}
                  </span>
                </div>
                <Link href="/pricing"
                  className="flex items-center gap-1.5 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-700 transition-colors">
                  <Crown className="w-3.5 h-3.5" />
                  Mejorar plan
                </Link>
              </div>

              {plan === 'trial' && (
                <div className={`rounded-xl px-4 py-3 text-sm ${trialDaysLeft > 2 ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-amber-50 border border-amber-100 text-amber-700'}`}>
                  {trialDaysLeft > 0
                    ? `⏱ Tu trial vence en ${trialDaysLeft} día${trialDaysLeft !== 1 ? 's' : ''}. Mejora ahora para no perder acceso.`
                    : '⚠️ Tu trial ha vencido. Mejora tu plan para seguir buscando.'}
                </div>
              )}
            </div>

            {/* Búsquedas card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Uso este período</p>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-4xl font-extrabold text-slate-900">{searchesUsed}</span>
                <span className="text-slate-400 mb-1">/ {searchesLimit} búsquedas</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${searchesUsed >= searchesLimit ? 'bg-red-500' : searchesUsed / searchesLimit > 0.7 ? 'bg-amber-500' : 'bg-brand-600'}`}
                  style={{ width: `${Math.min(100, (searchesUsed / searchesLimit) * 100)}%` }}
                />
              </div>
              {searchesUsed >= searchesLimit && (
                <p className="text-xs text-red-600 mt-2 font-medium">
                  Límite alcanzado — <Link href="/pricing" className="underline">mejora tu plan</Link> para buscar más.
                </p>
              )}
            </div>

            {/* Cuenta card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Cuenta</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{email}</p>
                  <p className="text-xs text-slate-400">Correo verificado</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors border border-slate-200 hover:border-red-200 px-4 py-2 rounded-lg">
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>

            {/* Stats card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Plataformas disponibles</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                  <BarChart3 className="w-5 h-5 text-brand-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">MercadoLibre</p>
                    <p className="text-xs text-slate-400">8 países LATAM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                  <span className="text-xl">🎵</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">TikTok</p>
                    <p className="text-xs text-slate-400">Videos virales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
