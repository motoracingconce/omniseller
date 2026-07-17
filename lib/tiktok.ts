const APIFY_TOKEN = process.env.APIFY_API_TOKEN!
const TIKTOK_ACTOR_ID = 'clockworks~tiktok-scraper'
const BASE_URL = 'https://api.apify.com/v2'

export interface TikTokSearchParams {
  query: string
  maxItems?: number
}

export interface TikTokVideo {
  id: string
  text: string
  authorUsername: string
  authorName: string
  authorFollowers: number
  likes: number
  comments: number
  shares: number
  views: number
  url: string
  coverUrl?: string
  musicName?: string
  hashtags: string[]
  createdAt: string
  position?: number
}

export interface TikTokSearchResult {
  runId: string
  status: 'RUNNING' | 'SUCCEEDED' | 'FAILED'
  items: TikTokVideo[]
}

export async function startTikTokSearch(params: TikTokSearchParams): Promise<string> {
  const body = {
    searchQueries: [params.query],
    maxPostsPerPage: params.maxItems ?? 30,
    shouldDownloadVideos: false,
    shouldDownloadCovers: false,
    shouldDownloadSubtitles: false,
    shouldDownloadSlideshowImages: false,
  }

  const res = await fetch(`${BASE_URL}/acts/${TIKTOK_ACTOR_ID}/runs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${APIFY_TOKEN}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`TikTok Apify run failed: ${err}`)
  }

  const data = await res.json()
  return data.data.id as string
}

export async function getTikTokRunStatus(runId: string): Promise<'RUNNING' | 'SUCCEEDED' | 'FAILED'> {
  const res = await fetch(`${BASE_URL}/actor-runs/${runId}`, {
    headers: { Authorization: `Bearer ${APIFY_TOKEN}` },
  })
  const data = await res.json()
  return data.data.status
}

export async function getTikTokResults(runId: string): Promise<TikTokVideo[]> {
  const res = await fetch(`${BASE_URL}/actor-runs/${runId}/dataset/items?format=json`, {
    headers: { Authorization: `Bearer ${APIFY_TOKEN}` },
  })

  if (!res.ok) return []

  const raw: Record<string, unknown>[] = await res.json()

  return raw.map((item, idx) => {
    const author = (item.authorMeta as Record<string, unknown>) ?? {}
    const music = (item.musicMeta as Record<string, unknown>) ?? {}
    const hashtags = Array.isArray(item.hashtags)
      ? (item.hashtags as Record<string, unknown>[]).map(h => String(h.name ?? h))
      : []

    return {
      id: String(item.id ?? `tt-${idx}`),
      text: String(item.text ?? item.description ?? ''),
      authorUsername: String(author.name ?? item.authorUsername ?? ''),
      authorName: String(author.nickName ?? author.name ?? ''),
      authorFollowers: Number(author.fans ?? 0),
      likes: Number(item.diggCount ?? item.likes ?? 0),
      comments: Number(item.commentCount ?? item.comments ?? 0),
      shares: Number(item.shareCount ?? item.shares ?? 0),
      views: Number(item.playCount ?? item.views ?? 0),
      url: String(item.webVideoUrl ?? item.url ?? ''),
      coverUrl: item.covers
        ? String((item.covers as Record<string, unknown>).default ?? '')
        : undefined,
      musicName: String(music.musicName ?? ''),
      hashtags,
      createdAt: item.createTimeISO
        ? String(item.createTimeISO)
        : new Date(Number(item.createTime ?? 0) * 1000).toISOString(),
      position: idx + 1,
    }
  })
}

export async function runTikTokSearchAndWait(
  params: TikTokSearchParams,
  timeoutMs = 180_000
): Promise<TikTokVideo[]> {
  const runId = await startTikTokSearch(params)
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    await new Promise(r => setTimeout(r, 4000))
    const status = await getTikTokRunStatus(runId)
    if (status === 'SUCCEEDED') return getTikTokResults(runId)
    if (status === 'FAILED') throw new Error('El scraper de TikTok falló')
  }

  throw new Error('Timeout esperando resultados de TikTok')
}
