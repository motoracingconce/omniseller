import type { Metadata } from 'next'
import './globals.css'

const BASE_URL = 'https://omniseller.cl'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'OmniSeller — Inteligencia de mercado para vendedores LATAM',
    template: '%s | OmniSeller',
  },
  description: 'Descubre qué se vende, a qué precio y quién domina cada categoría en MercadoLibre y TikTok. Datos reales de Chile, México, Argentina y toda LATAM.',
  keywords: ['marketplace', 'inteligencia de mercado', 'precios', 'tendencias', 'vendedores', 'chile', 'brasil', 'mexico', 'latam', 'tiktok', 'mercadolibre', 'ecommerce'],
  authors: [{ name: 'OmniSeller' }],
  creator: 'OmniSeller',
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: BASE_URL,
    siteName: 'OmniSeller',
    title: 'OmniSeller — Inteligencia de mercado para vendedores LATAM',
    description: 'Descubre qué se vende, a qué precio y quién domina cada categoría en MercadoLibre y TikTok. Datos reales de LATAM.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OmniSeller — Inteligencia de mercado',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OmniSeller — Inteligencia de mercado para vendedores LATAM',
    description: 'Descubre qué se vende, a qué precio y quién domina cada categoría en MercadoLibre y TikTok.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  )
}
