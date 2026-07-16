import { NextRequest, NextResponse } from 'next/server'
import { runSearchAndWait } from '@/lib/apify'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, country = 'CL', maxItems = 50 } = body

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json({ error: 'Debes ingresar una búsqueda válida' }, { status: 400 })
    }

    const items = await runSearchAndWait({ query: query.trim(), country, maxItems })

    return NextResponse.json({ items, total: items.length, query, country })
  } catch (err) {
    console.error('Search error:', err)
    return NextResponse.json(
      { error: 'Error al buscar. Intenta de nuevo en unos segundos.' },
      { status: 500 }
    )
  }
}
