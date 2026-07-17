import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { PLANS } from '@/lib/plans'
import {
  BarChart3,
  TrendingUp,
  Globe,
  Download,
  Bell,
  Zap,
  CheckCircle,
  Star,
  ArrowRight,
  Clock,
} from 'lucide-react'

const FEATURES = [
  { icon: BarChart3, title: 'Precios en tiempo real', desc: 'Ve cuánto cobran tus competidores, el precio mínimo, máximo y promedio por categoría.' },
  { icon: TrendingUp, title: 'Productos más vendidos', desc: 'Detecta qué productos tienen más reviews y por tanto más ventas, por marketplace y país.' },
  { icon: Globe, title: '18 países LATAM', desc: 'Busca en Chile, México, Brasil, Argentina, Colombia, Perú y más desde un solo lugar.' },
  { icon: Download, title: 'Exporta tus datos', desc: 'Descarga los resultados en CSV para analizar en Excel o conectar a tus reportes.' },
  { icon: Bell, title: 'Alertas de oportunidades', desc: 'Detecta nichos con alta demanda y pocos vendedores locales. Entra antes que la competencia.' },
  { icon: Zap, title: 'Datos actualizados diariamente', desc: 'Nuestro sistema scrapea los marketplaces 1-2 veces al día para que siempre tengas datos frescos.' },
]

const TESTIMONIALS = [
  { name: 'Andrea M.', role: 'Emprendedora, Santiago', rating: 5, text: 'Empecé a vender sin saber qué precio poner. Con OmniSeller vi que mi competencia cobraba $12.000 y yo estaba en $9.000. Subí el precio y vendí igual.' },
  { name: 'Roberto C.', role: 'Vendedor, CDMX', rating: 5, text: 'En 20 minutos encontré un nicho en México con poca competencia. Importé el producto y ahora es mi bestseller.' },
  { name: 'Claudia F.', role: 'Dropshipping, São Paulo', rating: 5, text: 'Lo uso todas las semanas para validar productos antes de comprar stock. Me ahorra semanas de investigación manual.' },
]

const MARKETS = [
  { flag: '🇨🇱', country: 'Chile', desc: 'Mercado creciente, vendedores locales competitivos', tag: 'Principal' },
  { flag: '🇧🇷', country: 'Brasil', desc: 'El marketplace más grande de LATAM', tag: 'Top Ventas' },
  { flag: '🇲🇽', country: 'México', desc: 'Boom del e-commerce post-2020', tag: 'Alto potencial' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-full px-4 py-1.5 text-brand-700 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Datos de mercado actualizados diariamente
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Sabe exactamente qué vender<br />
            <span className="gradient-text">antes que tu competencia</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            OmniSeller analiza miles de productos en los marketplaces de Chile, México y Brasil.
            Encuentra oportunidades reales, valida precios y vende con datos, no con suposiciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200">
              Probar gratis 7 días
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#pricing" className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition-colors">
              Ver planes
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">Sin tarjeta de crédito · Cancela cuando quieras</p>
        </div>
      </section>

      {/* Demo mockup */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="flex-1 mx-4 bg-slate-700 rounded h-6" />
            </div>
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <p className="text-slate-400 text-xs mb-1">Precio promedio</p>
                  <p className="text-white font-bold text-xl">$8.450</p>
                  <p className="text-green-400 text-xs mt-1">↑ 12% vs hace 30 días</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <p className="text-slate-400 text-xs mb-1">Productos encontrados</p>
                  <p className="text-white font-bold text-xl">247</p>
                  <p className="text-brand-400 text-xs mt-1">en 3 países</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <p className="text-slate-400 text-xs mb-1">Con envío gratis</p>
                  <p className="text-white font-bold text-xl">68%</p>
                  <p className="text-yellow-400 text-xs mt-1">mayor que mercado</p>
                </div>
              </div>
              <div className="bg-slate-700 rounded-lg overflow-hidden">
                <div className="grid grid-cols-5 text-slate-400 text-xs font-medium px-4 py-2 border-b border-slate-600">
                  <span>#</span><span className="col-span-2">Producto</span><span>Precio</span><span>Reviews</span>
                </div>
                {[
                  { pos: 1, name: 'Caja de cartón 30x20x15 pack 10', price: '$5.990', reviews: '1.243' },
                  { pos: 2, name: 'Envase con tapa hermética 500ml', price: '$3.200', reviews: '987' },
                  { pos: 3, name: 'Bolsa kraft biodegradable x50', price: '$4.850', reviews: '756' },
                ].map(item => (
                  <div key={item.pos} className="grid grid-cols-5 text-white text-sm px-4 py-2 border-b border-slate-600/50">
                    <span className="text-slate-400">{item.pos}</span>
                    <span className="col-span-2 text-slate-200">{item.name}</span>
                    <span className="font-medium text-green-400">{item.price}</span>
                    <span className="text-slate-300">{item.reviews}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mercados foco */}
      <section id="plataformas" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
              Enfocados en los mercados que importan
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Chile, México y Brasil concentran el 75% del comercio electrónico de LATAM.
              Cubrimos todos los demás países también, pero estos son donde está la plata.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {MARKETS.map(m => (
              <div key={m.country} className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-6xl mb-4">{m.flag}</div>
                <div className="inline-block bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1 rounded-full mb-3">{m.tag}</div>
                <h3 className="font-extrabold text-slate-900 text-xl mb-2">{m.country}</h3>
                <p className="text-slate-500 text-sm">{m.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-slate-500 text-sm">
              + Argentina 🇦🇷 · Colombia 🇨🇴 · Perú 🇵🇪 · Venezuela 🇻🇪 · Ecuador 🇪🇨 · Bolivia 🇧🇴 · Paraguay 🇵🇾 · Uruguay 🇺🇾 y más →{' '}
              <span className="font-semibold text-brand-600">18 países en total</span>
            </p>
          </div>
        </div>
      </section>

      {/* TikTok - LIVE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#010101] via-[#1a1a2e] to-[#16213e]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 bg-[#69C9D0]/20 border border-[#69C9D0]/40 rounded-full px-4 py-1.5 text-[#69C9D0] text-sm font-medium mb-5">
                <Zap className="w-4 h-4" />
                Nuevo — Ya disponible en OmniSeller
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 leading-tight">
                TikTok Intelligence
                <span className="block text-[#69C9D0]">videos virales de tu nicho</span>
              </h2>
              <p className="text-slate-300 text-lg mb-6">
                Busca cualquier producto o categoría y ve qué videos están explotando en TikTok.
                Descubre qué creadores dominan tu nicho, cuántas vistas tienen y qué hashtags usan.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Videos más virales por búsqueda en tiempo real',
                  'Métricas: vistas, likes, comentarios, shares',
                  'Perfil de cada creador y sus seguidores',
                  'Exporta a CSV para tu análisis de contenido',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-200">
                    <CheckCircle className="w-5 h-5 text-[#69C9D0] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="inline-flex items-center gap-2 bg-[#69C9D0] text-[#010101] px-6 py-3 rounded-xl font-bold hover:bg-[#5ab8bf] transition-colors">
                Probar TikTok Intelligence gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#69C9D0]/20 to-[#EE1D52]/20 flex items-center justify-center">
                  <div className="text-9xl">🎵</div>
                </div>
                <div className="absolute -top-4 -right-4 bg-[#69C9D0] text-[#010101] text-xs font-bold px-3 py-1.5 rounded-full">
                  ✓ Live ahora
                </div>
                <div className="absolute -bottom-2 -left-2 bg-white/10 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full border border-white/20">
                  Videos · Creadores · Hashtags
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Todo lo que necesitas para vender con datos</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Sin importar si ya vendes o recién estás empezando, OmniSeller te da la información que la competencia no tiene.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map(f => (
              <div key={f.title} className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-brand-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Precios transparentes, sin sorpresas</h2>
            <p className="text-slate-600">Empieza gratis y escala cuando lo necesites. Cancela en cualquier momento.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map(plan => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  plan.highlight
                    ? 'bg-brand-600 text-white shadow-xl shadow-brand-200 scale-105'
                    : 'bg-white border border-slate-200'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    ⭐ Más popular
                  </div>
                )}
                <div className="mb-4">
                  <h3 className={`font-extrabold text-xl mb-1 ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <div className={`text-3xl font-extrabold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </div>
                  <p className={`text-sm ${plan.highlight ? 'text-brand-100' : 'text-slate-500'}`}>
                    {plan.desc}
                  </p>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${plan.highlight ? 'text-brand-50' : 'text-slate-600'}`}>
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-brand-200' : 'text-brand-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.id === 'agency' ? 'mailto:hola@omniseller.io' : '/auth/register'}
                  className={`block text-center py-3 px-4 rounded-xl font-bold text-sm transition-colors ${
                    plan.highlight
                      ? 'bg-white text-brand-600 hover:bg-brand-50'
                      : plan.id === 'free'
                      ? 'bg-brand-600 text-white hover:bg-brand-700'
                      : 'bg-slate-900 text-white hover:bg-slate-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 text-sm mt-8">
            Pagos seguros · Precios en USD · Equivalencia CLP aproximada según tipo de cambio del día
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-14">Lo que dicen nuestros usuarios</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-slate-50 rounded-2xl p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Empieza a vender con datos hoy
          </h2>
          <p className="text-brand-100 text-lg mb-8">
            7 días gratis, sin tarjeta de crédito. Cancela cuando quieras.
          </p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white text-brand-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-50 transition-colors">
            Probar OmniSeller gratis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="font-extrabold text-white text-lg">
                <span className="text-brand-400">Omni</span>Seller
              </p>
              <p className="text-sm mt-1">Inteligencia de mercado para vendedores LATAM</p>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Precios</Link>
              <Link href="/auth/login" className="hover:text-white transition-colors">Iniciar sesión</Link>
              <Link href="/auth/register" className="hover:text-white transition-colors">Registro</Link>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
            <p>© 2026 OmniSeller. Todos los derechos reservados. 🇨🇱 🇧🇷 🇲🇽</p>
            <div className="flex gap-4">
              <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
              <Link href="/terminos" className="hover:text-white transition-colors">Términos</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
