import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'OmniSeller — Inteligencia de mercado para vendedores LATAM'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <div
            style={{
              background: '#6366f1',
              borderRadius: '16px',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              fontSize: '32px',
            }}
          >
            📊
          </div>
          <div style={{ display: 'flex' }}>
            <span style={{ fontSize: '42px', fontWeight: 800, color: '#818cf8' }}>Omni</span>
            <span style={{ fontSize: '42px', fontWeight: 800, color: '#f1f5f9' }}>Seller</span>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '62px',
            fontWeight: 900,
            color: '#f1f5f9',
            lineHeight: 1.1,
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          Inteligencia de mercado para vendedores LATAM
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: '#94a3b8',
            marginBottom: '48px',
            maxWidth: '800px',
          }}
        >
          MercadoLibre + TikTok · Datos reales · Chile, México, Argentina y más
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {['🛒 MercadoLibre', '🎵 TikTok Intelligence', '📦 8 países LATAM'].map((label) => (
            <div
              key={label}
              style={{
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.4)',
                borderRadius: '100px',
                padding: '10px 20px',
                color: '#a5b4fc',
                fontSize: '22px',
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
