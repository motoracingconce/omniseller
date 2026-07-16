/**
 * Arquitectura de caché para OmniSeller
 *
 * En vez de llamar a Apify cada vez que un usuario busca,
 * corremos scrapers programados 1-2 veces al día y guardamos
 * los resultados en Supabase por {query + country + date}.
 *
 * Flujo:
 * 1. Usuario busca "envases desechables" en Chile
 * 2. Buscamos en caché (Supabase): ¿hay datos de hoy para esa query+país?
 *    - SÍ → devolvemos los datos cacheados (0 créditos Apify)
 *    - NO → llamamos Apify, guardamos en caché, devolvemos resultados
 *
 * Esto reduce el consumo de Apify en ~90% porque:
 * - Las búsquedas más populares ya estarán cacheadas
 * - Muchos usuarios buscan lo mismo (envases, cajas, etc.)
 * - El scraper programado corre 1-2x/día para las categorías top
 */

import { supabase } from './supabase'
import type { MLProduct } from './apify'

const CACHE_TTL_HOURS = 12 // datos frescos por 12 horas

export interface CachedSearch {
  id: string
  query: string
  country: string
  platform: 'mercadolibre' | 'tiktok'
  items: MLProduct[]
  result_count: number
  scraped_at: string
  expires_at: string
}

export async function getCachedSearch(
  query: string,
  country: string,
  platform: 'mercadolibre' | 'tiktok' = 'mercadolibre'
): Promise<MLProduct[] | null> {
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('search_cache')
    .select('items, scraped_at')
    .eq('query', query.toLowerCase().trim())
    .eq('country', country)
    .eq('platform', platform)
    .gt('expires_at', now)
    .order('scraped_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return null
  return data.items as MLProduct[]
}

export async function setCachedSearch(
  query: string,
  country: string,
  items: MLProduct[],
  platform: 'mercadolibre' | 'tiktok' = 'mercadolibre'
): Promise<void> {
  const now = new Date()
  const expires = new Date(now.getTime() + CACHE_TTL_HOURS * 60 * 60 * 1000)

  await supabase.from('search_cache').upsert({
    query: query.toLowerCase().trim(),
    country,
    platform,
    items,
    result_count: items.length,
    scraped_at: now.toISOString(),
    expires_at: expires.toISOString(),
  }, {
    onConflict: 'query,country,platform',
  })
}

// SQL para crear la tabla en Supabase:
// CREATE TABLE search_cache (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   query TEXT NOT NULL,
//   country TEXT NOT NULL,
//   platform TEXT NOT NULL DEFAULT 'mercadolibre',
//   items JSONB NOT NULL DEFAULT '[]',
//   result_count INT DEFAULT 0,
//   scraped_at TIMESTAMPTZ DEFAULT NOW(),
//   expires_at TIMESTAMPTZ NOT NULL,
//   UNIQUE(query, country, platform)
// );
// CREATE INDEX idx_cache_lookup ON search_cache(query, country, platform, expires_at);
