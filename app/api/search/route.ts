import { NextRequest, NextResponse } from 'next/server'
import { runSearchAndWait } from '@/lib/apify'
import { getCachedSearch, setCachedSearch } from '@/lib/cache'

const supabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, country = 'CL', maxItems = 50, platform = 'mercadolibre' } = body

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json({ error: 'Debes ingresar una búsqueda válida' }, { status: 400 })
    }

    const q = query.trim()

    // 1. Revisar caché primero (ahorra créditos Apify)
    if (supabaseConfigured) {
      try {
        const cached = await getCachedSearch(q, country, platform)
        if (cached) {
          return NextResponse.json({
            items: cached,
            total: cached.length,
            query: q,
            country,
            fromCache: true,
          })
        }
      } catch {
        // Si falla el caché, seguimos igual hacia Apify
      }
    }

    // 2. Cache miss → llamar a Apify
    const items = await runSearchAndWait({ query: q, country, maxItems })

    // 3. Guardar en caché (sin bloquear la respuesta)
    if (supabaseConfigured && items.length > 0) {
      setCachedSearch(q, country, items, platform).catch(() => {})
    }

    return NextResponse.json({
      items,
      total: items.length,
      query: q,
      country,
      fromCache: false,
    })
  } catch (err) {
    console.error('Search error:', err)
    return NextResponse.json(
      { error: 'Error al buscar. Intenta de nuevo en unos segundos.' },
      { status: 500 }
    )
  }
}
