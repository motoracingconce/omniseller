import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos de Servicio',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg">
            <span className="text-brand-600">Omni</span><span className="text-slate-800">Seller</span>
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Términos de Servicio</h1>
        <p className="text-slate-400 text-sm mb-10">Última actualización: julio 2026</p>

        <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">1. Aceptación de los términos</h2>
            <p>Al crear una cuenta en OmniSeller aceptas estos Términos de Servicio y nuestra <Link href="/privacidad" className="text-brand-600 underline">Política de Privacidad</Link>. Si no estás de acuerdo, no uses la plataforma.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">2. El servicio</h2>
            <p>OmniSeller es una herramienta de inteligencia de mercado que consulta datos públicos de MercadoLibre y TikTok. Los datos se obtienen en tiempo real mediante scraping de información pública y no constituyen asesoramiento financiero ni comercial.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">3. Planes y pagos</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Trial gratuito:</strong> 7 días con 3 búsquedas incluidas. No requiere tarjeta de crédito.</li>
              <li><strong>Planes pagados:</strong> facturación mensual. Puedes cancelar en cualquier momento desde tu cuenta.</li>
              <li>No realizamos reembolsos por períodos parciales, salvo obligación legal.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">4. Uso aceptable</h2>
            <p>Está prohibido: revender el acceso a la plataforma, hacer scraping automatizado de nuestra interfaz, usar el servicio para actividades ilegales, o intentar sobrepasar los límites técnicos del plan.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">5. Disponibilidad</h2>
            <p>Nos esforzamos por mantener el servicio disponible 24/7, pero no garantizamos disponibilidad ininterrumpida. Los datos de terceros (MercadoLibre, TikTok) dependen de APIs y servicios externos fuera de nuestro control.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">6. Limitación de responsabilidad</h2>
            <p>OmniSeller no se responsabiliza por decisiones comerciales tomadas en base a los datos obtenidos. Los datos son referenciales y pueden no reflejar la totalidad del mercado.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">7. Ley aplicable</h2>
            <p>Estos términos se rigen por las leyes de la República de Chile. Cualquier disputa será resuelta en los tribunales competentes de Concepción, Chile.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">8. Contacto</h2>
            <p>Para consultas: <strong>contacto@omniseller.cl</strong></p>
          </section>
        </div>
      </main>
    </div>
  )
}
