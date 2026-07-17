import { NextRequest, NextResponse } from 'next/server'
import { runTikTokSearchAndWait, type TikTokVideo } from '@/lib/tiktok'
import { supabase } from '@/lib/supabase'

const CACHE_TTL_HOURS = 12
const supabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

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
  }, {
    onConflict: 'query,country,platform',
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, maxItems = 30 } = body

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json({ error: 'Debes ingresar una búsqueda válida' }, { status: 400 })
    }

    const q = query.trim()

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
          })
        }
      } catch { /* fallthrough */ }
    }

    const items = await runTikTokSearchAndWait({ query: q, maxItems })

    if (supabaseConfigured && items.length > 0) {
      setCachedTikTok(q, items).catch(() => {})
    }

    return NextResponse.json({
      items,
      total: items.length,
      query: q,
      platform: 'tiktok',
      fromCache: false,
    })
  } catch (err) {
    console.error('TikTok search error:', err)
    return NextResponse.json(
      { error: 'Error al buscar en TikTok. Intenta de nuevo en unos segundos.' },
      { status: 500 }
    )
  }
}
