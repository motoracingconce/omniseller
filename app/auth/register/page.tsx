'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Mail } from 'lucide-react'
import { PLANS } from '@/lib/plans'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const [selectedPlan, setSelectedPlan] = useState('free')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })
    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }
    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="font-extrabold text-lg">
            <span className="text-brand-600">Omni</span><span className="text-slate-800">Seller</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <h1 className="text-2xl font-extrabold text-slate-900 text-center mb-2">Elige tu plan</h1>
        <p className="text-slate-500 text-center text-sm mb-8">Empieza gratis o elige el plan que más te acomoda</p>

        {/* Plan selector */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {PLANS.map(plan => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative text-left rounded-2xl border-2 p-4 transition-all ${
                selectedPlan === plan.id
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-slate-200 bg-white hover:border-brand-200'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-2.5 left-4 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Popular
                </div>
              )}
              <p className="font-extrabold text-slate-900 text-sm mb-0.5">{plan.name}</p>
              <p className="text-brand-600 font-bold text-lg leading-none">{plan.price}</p>
              <p className="text-slate-400 text-xs mt-0.5">{plan.desc}</p>
              <ul className="mt-3 space-y-1">
                {plan.features.slice(0, 3).map(f => (
                  <li key={f} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <CheckCircle className="w-3 h-3 text-brand-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {selectedPlan === plan.id && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Register form */}
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-6 text-center">
            Crear cuenta — Plan <span className="text-brand-600">{PLANS.find(p => p.id === selectedPlan)?.name}</span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            {success ? (
              <div className="text-center py-4">
                <Mail className="w-10 h-10 text-brand-500 mx-auto mb-3" />
                <p className="font-semibold text-slate-800 text-sm">¡Revisa tu email!</p>
                <p className="text-slate-400 text-xs mt-1">Te enviamos un link de confirmación a <strong>{email}</strong></p>
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-700 disabled:opacity-60 transition-colors"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
              </button>
            )}
          </form>
          <p className="text-center text-sm text-slate-500 mt-4">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-brand-600 font-semibold hover:underline">
              Iniciar sesión
            </Link>
          </p>
          <p className="text-center text-xs text-slate-400 mt-4">
            Sin tarjeta de crédito · Cancela cuando quieras
          </p>
        </div>
      </main>
    </div>
  )
}
