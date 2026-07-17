const APIFY_TOKEN = process.env.APIFY_API_TOKEN!
const ACTOR_ID = process.env.APIFY_ACTOR_ID || 'karamelo~mercadolibre-scraper-espanol-castellano'
const BASE_URL = 'https://api.apify.com/v2'

export interface SearchParams {
  query: string
  country: string
  maxItems?: number
}

export interface MLProduct {
  title: string
  price: number
  currency: string
  originalPrice?: number
  discountPercent?: number
  rating?: number
  reviewCount?: number
  seller?: string
  url: string
  imageUrl?: string
  freeShipping?: boolean
  installments?: string
  position?: number
}

export interface SearchResult {
  runId: string
  status: 'RUNNING' | 'SUCCEEDED' | 'FAILED'
  items: MLProduct[]
  totalItems: number
}

export async function startSearch(params: SearchParams): Promise<string> {
  const body = {
    searchQuery: params.query,
    countryCode: params.country,
    maxItems: params.maxItems ?? 50,
  }

  const res = await fetch(`${BASE_URL}/acts/${ACTOR_ID}/runs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${APIFY_TOKEN}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Apify run failed: ${err}`)
  }

  const data = await res.json()
  return data.data.id as string
}

export async function getRunStatus(runId: string): Promise<'RUNNING' | 'SUCCEEDED' | 'FAILED'> {
  const res = await fetch(`${BASE_URL}/actor-runs/${runId}`, {
    headers: { Authorization: `Bearer ${APIFY_TOKEN}` },
  })
  const data = await res.json()
  return data.data.status
}

export async function getRunResults(runId: string): Promise<MLProduct[]> {
  const res = await fetch(`${BASE_URL}/actor-runs/${runId}/dataset/items?format=json`, {
    headers: { Authorization: `Bearer ${APIFY_TOKEN}` },
  })

  if (!res.ok) return []

  const raw: Record<string, unknown>[] = await res.json()

  return raw.map((item, idx) => ({
    title: String(item.title ?? item.name ?? ''),
    price: Number(item.price ?? item.currentPrice ?? 0),
    currency: String(item.currency ?? 'CLP'),
    originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
    discountPercent: item.discount ? Number(item.discount) : undefined,
    rating: item.rating ? Number(item.rating) : undefined,
    reviewCount: item.reviewCount ? Number(item.reviewCount) : undefined,
    seller: String(item.seller ?? item.sellerName ?? ''),
    url: String(item.url ?? item.link ?? ''),
    imageUrl: String(item.thumbnail ?? item.imageUrl ?? item.image ?? ''),
    freeShipping: Boolean(item.freeShipping),
    installments: item.installments ? String(item.installments) : undefined,
    position: idx + 1,
  }))
}

export async function runSearchAndWait(params: SearchParams, timeoutMs = 120_000): Promise<MLProduct[]> {
  const runId = await startSearch(params)
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    await new Promise(r => setTimeout(r, 3000))
    const status = await getRunStatus(runId)
    if (status === 'SUCCEEDED') return getRunResults(runId)
    if (status === 'FAILED') throw new Error('El scraper de Apify falló')
  }

  throw new Error('Timeout esperando resultados de Apify')
}
