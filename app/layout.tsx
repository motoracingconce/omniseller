import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OmniSeller — Inteligencia de mercado para vendedores LATAM',
  description: 'Descubre qué se vende, a qué precio y quién domina cada categoría en los marketplaces de Chile, México y Brasil. Datos reales, actualizados diariamente.',
  keywords: ['marketplace', 'inteligencia de mercado', 'precios', 'tendencias', 'vendedores', 'chile', 'brasil', 'mexico', 'latam', 'tiktok', 'ecommerce'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  )
}
