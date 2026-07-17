import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
}

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Política de Privacidad</h1>
        <p className="text-slate-400 text-sm mb-10">Última actualización: julio 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">1. Quiénes somos</h2>
            <p>OmniSeller es una plataforma de inteligencia de mercado para vendedores de LATAM. Operamos en Chile y recopilamos datos únicamente para prestar el servicio descrito en nuestros <Link href="/terminos" className="text-brand-600 underline">Términos de Servicio</Link>.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">2. Datos que recopilamos</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Cuenta:</strong> correo electrónico al registrarte.</li>
              <li><strong>Uso:</strong> búsquedas realizadas, plataformas consultadas, fecha y hora de acceso.</li>
              <li><strong>Pago (futuro):</strong> procesado por terceros (WebPay / Stripe). No almacenamos datos de tarjetas.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">3. Cómo usamos tus datos</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Prestarte el servicio y gestionar tu cuenta.</li>
              <li>Enviarte correos transaccionales (confirmación de cuenta, recibos de pago).</li>
              <li>Mejorar la plataforma con análisis agregados y anónimos.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">4. Compartir datos con terceros</h2>
            <p>No vendemos ni compartimos tus datos personales. Usamos proveedores de infraestructura (Supabase, Vercel, Apify) sujetos a sus propias políticas de privacidad.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">5. Tus derechos</h2>
            <p>Puedes solicitar acceso, corrección o eliminación de tus datos escribiendo a <strong>contacto@omniseller.cl</strong>. Respondemos en un plazo máximo de 15 días hábiles.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">6. Cookies</h2>
            <p>Usamos cookies técnicas necesarias para el funcionamiento del servicio (sesión de usuario). No usamos cookies de publicidad ni de seguimiento.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">7. Cambios a esta política</h2>
            <p>Te notificaremos por correo ante cambios sustanciales. El uso continuado de la plataforma implica aceptación.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
