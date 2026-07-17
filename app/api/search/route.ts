import { NextRequest, NextResponse } from 'next/server'
import { runSearchAndWait } from '@/lib/apify'
import { getCachedSearch, setCachedSearch } from '@/lib/cache'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@supabase/supabase-js'

const supabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
const adminConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function getUserFromToken(token: string) {
  if (!adminConfigured) return null
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  const { data } = await client.auth.getUser(token)
  return data.user ?? null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, country = 'CL', maxItems = 50, platform = 'mercadolibre' } = body

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json({ error: 'Debes ingresar una búsqueda válida' }, { status: 400 })
    }

    const q = query.trim()

    // Verificar usuario y límite de búsquedas
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    let userId: string | null = null
    let searchesUsed = 0
    let searchesLimit = 3

    if (token && adminConfigured) {
      const user = await getUserFromToken(token)
      if (user) {
        userId = user.id
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('searches_used, searches_limit, plan')
          .eq('id', userId)
          .single()

        if (userData) {
          searchesUsed = userData.searches_used ?? 0
          searchesLimit = userData.searches_limit ?? 3
          if (searchesUsed >= searchesLimit) {
            return NextResponse.json({
              error: 'límite_alcanzado',
              searches_used: searchesUsed,
              searches_limit: searchesLimit,
            }, { status: 403 })
          }
        }
      }
    }

    // Cache
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
            searches_used: searchesUsed,
            searches_limit: searchesLimit,
          })
        }
      } catch { /* fallthrough */ }
    }

    const items = await runSearchAndWait({ query: q, country, maxItems })

    if (supabaseConfigured && items.length > 0) {
      setCachedSearch(q, country, items, platform).catch(() => {})
    }

    // Incrementar contador
    if (userId && adminConfigured) {
      void supabaseAdmin
        .from('users')
        .update({ searches_used: searchesUsed + 1 })
        .eq('id', userId)
        .then(() => {}, () => {})
    }

    return NextResponse.json({
      items,
      total: items.length,
      query: q,
      country,
      fromCache: false,
      searches_used: searchesUsed + 1,
      searches_limit: searchesLimit,
    })
  } catch (err) {
    console.error('Search error:', err)
    return NextResponse.json(
      { error: 'Error al buscar. Intenta de nuevo en unos segundos.' },
      { status: 500 }
    )
  }
}
