import { NextRequest, NextResponse } from 'next/server'
import { runTikTokSearchAndWait, type TikTokVideo } from '@/lib/tiktok'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@supabase/supabase-js'

const CACHE_TTL_HOURS = 12
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

async function getCachedTikTok(query: string): Promise<TikTokVideo[] | null> {
  const { data, error } = await supabase
    .from('search_cache')
    .select('items, scraped_at')
    .eq('query', query.toLowerCase().trim())
    .eq('country', 'GLOBAL')
    .eq('platform', 'tiktok')
    .gt('expires_at', new Date().toISOString())
    .order('scraped_at', { ascending: false })
    .limit(1)
    .single()
  if (error || !data) return null
  return data.items as TikTokVideo[]
}

async function setCachedTikTok(query: string, items: TikTokVideo[]): Promise<void> {
  const now = new Date()
  const expires = new Date(now.getTime() + CACHE_TTL_HOURS * 60 * 60 * 1000)
  await supabase.from('search_cache').upsert({
    query: query.toLowerCase().trim(),
    country: 'GLOBAL',
    platform: 'tiktok',
    items,
    result_count: items.length,
    scraped_at: now.toISOString(),
    expires_at: expires.toISOString(),
  }, { onConflict: 'query,country,platform' })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, maxItems = 30 } = body

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json({ error: 'Debes ingresar una búsqueda válida' }, { status: 400 })
    }

    const q = query.trim()

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
          .select('searches_used, searches_limit')
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

    if (supabaseConfigured) {
      try {
        const cached = await getCachedTikTok(q)
        if (cached) {
          return NextResponse.json({
            items: cached,
            total: cached.length,
            query: q,
            platform: 'tiktok',
            fromCache: true,
            searches_used: searchesUsed,
            searches_limit: searchesLimit,
          })
        }
      } catch { /* fallthrough */ }
    }

    const items = await runTikTokSearchAndWait({ query: q, maxItems })

    if (supabaseConfigured && items.length > 0) {
      setCachedTikTok(q, items).catch(() => {})
    }

    if (userId && adminConfigured) {
      supabaseAdmin
        .from('users')
        .update({ searches_used: searchesUsed + 1 })
        .eq('id', userId)
        .then(() => {})
        .catch(() => {})
    }

    return NextResponse.json({
      items,
      total: items.length,
      query: q,
      platform: 'tiktok',
      fromCache: false,
      searches_used: searchesUsed + 1,
      searches_limit: searchesLimit,
    })
  } catch (err) {
    console.error('TikTok search error:', err)
    return NextResponse.json(
      { error: 'Error al buscar en TikTok. Intenta de nuevo en unos segundos.' },
      { status: 500 }
    )
  }
}
