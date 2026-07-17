'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Loader2, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (authError) {
      setError('No se pudo enviar el correo. Intenta de nuevo.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-xl mb-6">
            <span className="text-brand-600">Omni</span><span className="text-slate-800">Seller</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Recuperar contraseña</h1>
          <p className="text-slate-400 mt-2">Te enviamos un enlace para restablecer tu contraseña</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          {sent ? (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <h2 className="text-lg font-semibold text-slate-800">Revisa tu correo</h2>
              <p className="text-sm text-slate-500">
                Si el email <strong>{email}</strong> está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
              </p>
              <p className="text-xs text-slate-400">Revisa también tu carpeta de spam.</p>
              <Link
                href="/auth/login"
                className="inline-block mt-4 text-sm text-brand-600 font-medium hover:underline"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : 'Enviar enlace'}
              </button>

              <p className="text-center text-sm text-slate-400 mt-2">
                <Link href="/auth/login" className="text-brand-600 font-medium hover:underline">
                  Volver al inicio de sesión
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
