'use client'
import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { COUNTRIES } from '@/lib/countries'
import type { MLProduct } from '@/lib/apify'

interface Props {
  onResults: (items: MLProduct[], query: string, country: string) => void
  onLoading: (v: boolean) => void
  loading: boolean
}

export default function SearchForm({ onResults, onLoading, loading }: Props) {
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('CL')
  const [maxItems, setMaxItems] = useState(50)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setError('')
    onLoading(true)

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), country, maxItems }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al buscar')
      onResults(data.items, query, country)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar')
    } finally {
      onLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ej: envases desechables, cajas repostería..."
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <select
          value={country}
          onChange={e => setCountry(e.target.value)}
          className="px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
          disabled={loading}
        >
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
          ))}
        </select>

        <select
          value={maxItems}
          onChange={e => setMaxItems(Number(e.target.value))}
          className="px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
          disabled={loading}
        >
          <option value={20}>20 resultados</option>
          <option value={50}>50 resultados</option>
          <option value={100}>100 resultados</option>
        </select>

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Buscando...</>
          ) : (
            <><Search className="w-4 h-4" /> Buscar</>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
          {error}
        </div>
      )}
    </form>
  )
}
