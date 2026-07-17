import Link from 'next/link'
import { Check, Zap, BarChart3, Download, Globe, Shield } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planes y Precios — OmniSeller',
  description: 'Elige el plan que se adapta a tu negocio. Desde vendedores que parten hasta equipos que escalan.',
}

const PLANS = [
  {
    id: 'trial',
    name: 'Trial',
    badge: null,
    price: 'Gratis',
    period: '7 días',
    description: 'Para conocer la plataforma sin compromisos.',
    cta: 'Empezar gratis',
    href: '/auth/register',
    highlight: false,
    features: [
      '3 búsquedas incluidas',
      'MercadoLibre Chile',
      'TikTok Intelligence',
      'Vista previa de resultados',
    ],
    missing: [
      'Exportar CSV',
      'Búsquedas ilimitadas',
      'Todos los países LATAM',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    badge: 'Más popular',
    price: '$9.990',
    period: 'mes',
    description: 'Para emprendedores que venden en serio y necesitan datos reales.',
    cta: 'Contratar Starter',
    href: '/auth/register?plan=starter',
    highlight: true,
    features: [
      '50 búsquedas al mes',
      'MercadoLibre + TikTok',
      'Todos los países LATAM',
      'Exportar CSV',
      'Historial de búsquedas',
      'Soporte por WhatsApp',
    ],
    missing: [],
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: null,
    price: '$24.990',
    period: 'mes',
    description: 'Para equipos de ventas y negocios que escalan rápido.',
    cta: 'Contratar Pro',
    href: '/auth/register?plan=pro',
    highlight: false,
    features: [
      'Búsquedas ilimitadas',
      'MercadoLibre + TikTok + más',
      'Todos los países LATAM',
      'Exportar CSV y Excel',
      'Historial completo',
      'Alertas de precio por email',
      'Soporte prioritario',
      'Hasta 3 usuarios',
    ],
    missing: [],
  },
]

const FAQS = [
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí, puedes cancelar en cualquier momento desde tu cuenta. No hay contratos ni permanencias.',
  },
  {
    q: '¿Qué pasa cuando se me acaban las búsquedas del Trial?',
    a: 'Puedes ver los resultados anteriores pero no hacer nuevas búsquedas hasta que actualices tu plan.',
  },
  {
    q: '¿Los datos de MercadoLibre son en tiempo real?',
    a: 'Los resultados son actuales: cada búsqueda lanza un scraper en vivo. Las repeticiones de la misma búsqueda en el mismo día usan caché para ahorrarte búsquedas.',
  },
  {
    q: '¿Cuáles países de LATAM están disponibles?',
    a: 'Chile, Argentina, México, Brasil, Colombia, Perú, Uruguay y Venezuela en MercadoLibre. TikTok es global.',
  },
  {
    q: '¿Cómo pago?',
    a: 'Aceptamos tarjeta de débito y crédito (Visa, Mastercard) y WebPay. Todos los precios son en CLP.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg">
            <span className="text-brand-600">Omni</span><span className="text-slate-800">Seller</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/auth/login" className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5">
              Iniciar sesión
            </Link>
            <Link href="/auth/register" className="bg-brand-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-brand-700">
              Empezar gratis
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Planes para cada etapa<br />de tu negocio
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Empieza gratis y escala cuando necesites más. Sin sorpresas, sin letras chicas.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.highlight
                  ? 'bg-brand-600 border-brand-600 text-white shadow-xl shadow-brand-200'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <p className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-brand-200' : 'text-slate-400'}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  {plan.period && (
                    <span className={`text-sm mb-1 ${plan.highlight ? 'text-brand-200' : 'text-slate-400'}`}>
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${plan.highlight ? 'text-brand-100' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-brand-200' : 'text-brand-600'}`} />
                    <span>{f}</span>
                  </li>
                ))}
                {plan.missing.map(f => (
                  <li key={f} className={`flex items-start gap-2.5 text-sm opacity-40`}>
                    <span className="w-4 h-4 mt-0.5 flex-shrink-0 text-center leading-none">—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`text-center py-3 rounded-xl font-bold text-sm transition-all ${
                  plan.highlight
                    ? 'bg-white text-brand-600 hover:bg-brand-50'
                    : 'bg-brand-600 text-white hover:bg-brand-700'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Feature comparison callouts */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {[
            { icon: <Globe className="w-5 h-5 text-brand-600" />, title: 'Datos reales de LATAM', desc: '8 países en MercadoLibre, TikTok global. Sin estimaciones, solo scraping en vivo.' },
            { icon: <Download className="w-5 h-5 text-brand-600" />, title: 'Exporta lo que encuentres', desc: 'Descarga tus resultados en CSV para analizarlos en Excel o Google Sheets.' },
            { icon: <Shield className="w-5 h-5 text-brand-600" />, title: 'Sin contratos', desc: 'Paga mes a mes. Cancela cuando quieras desde tu cuenta, sin llamadas.' },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-3">
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-800 mb-1 text-sm">{f.title}</h3>
              <p className="text-slate-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-8">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {FAQS.map(faq => (
              <div key={faq.q} className="bg-white rounded-2xl border border-slate-200 p-5">
                <p className="font-semibold text-slate-800 mb-1.5 text-sm">{faq.q}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-16 text-center bg-brand-600 rounded-3xl p-10">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">¿Listo para vender más inteligente?</h2>
          <p className="text-brand-100 mb-6">Empieza gratis hoy. No necesitas tarjeta de crédito para el Trial.</p>
          <Link href="/auth/register"
            className="inline-block bg-white text-brand-600 font-bold px-8 py-3 rounded-xl hover:bg-brand-50 transition-colors">
            Crear cuenta gratis →
          </Link>
        </div>
      </main>
    </div>
  )
}
