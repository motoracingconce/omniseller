'use client'
import { useState, useMemo } from 'react'
import { ExternalLink, Star, TrendingDown, ArrowUpDown, Download } from 'lucide-react'
import type { MLProduct } from '@/lib/apify'

interface Props {
  items: MLProduct[]
  query: string
  country: string
}

type SortKey = 'position' | 'price' | 'rating' | 'reviewCount'

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: currency === 'CLP' ? 'CLP' : 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

function Stats({ items }: { items: MLProduct[] }) {
  const prices = items.map(i => i.price).filter(Boolean)
  const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0
  const min = prices.length ? Math.min(...prices) : 0
  const max = prices.length ? Math.max(...prices) : 0
  const freeShipping = items.filter(i => i.freeShipping).length
  const currency = items[0]?.currency ?? 'CLP'

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {[
        { label: 'Precio promedio', value: formatPrice(avg, currency), color: 'text-brand-600' },
        { label: 'Precio mínimo', value: formatPrice(min, currency), color: 'text-green-600' },
        { label: 'Precio máximo', value: formatPrice(max, currency), color: 'text-red-500' },
        { label: 'Con envío gratis', value: `${Math.round((freeShipping / items.length) * 100)}%`, color: 'text-emerald-600' },
      ].map(s => (
        <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-100">
          <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
          <div className="text-xs text-slate-400 mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

export default function ResultsTable({ items, query, country }: Props) {
  const [sort, setSort] = useState<SortKey>('position')
  const [asc, setAsc] = useState(true)

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      const va = a[sort] ?? 0
      const vb = b[sort] ?? 0
      return asc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
    })
  }, [items, sort, asc])

  function toggleSort(key: SortKey) {
    if (sort === key) setAsc(!asc)
    else { setSort(key); setAsc(true) }
  }

  function exportCSV() {
    const headers = ['#', 'Producto', 'Precio', 'Precio Original', 'Descuento %', 'Rating', 'Reviews', 'Vendedor', 'Envío Gratis', 'URL']
    const rows = sorted.map(i => [
      i.position, i.title, i.price, i.originalPrice ?? '', i.discountPercent ?? '',
      i.rating ?? '', i.reviewCount ?? '', i.seller ?? '', i.freeShipping ? 'Sí' : 'No', i.url
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `radar-mercado-${query}-${country}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const SortBtn = ({ col, label }: { col: SortKey; label: string }) => (
    <button
      onClick={() => toggleSort(col)}
      className="flex items-center gap-1 hover:text-brand-600 transition-colors"
    >
      {label}
      <ArrowUpDown className="w-3 h-3 opacity-50" />
    </button>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-slate-500">
          <span className="font-semibold text-slate-800">{items.length} resultados</span> para{' '}
          <span className="font-semibold text-brand-600">"{query}"</span> en{' '}
          <span className="font-semibold">{country}</span>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-brand-300 hover:text-brand-600 transition-colors"
        >
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
      </div>

      <Stats items={items} />

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 text-left w-10"><SortBtn col="position" label="#" /></th>
                <th className="px-4 py-3 text-left">Producto</th>
                <th className="px-4 py-3 text-right"><SortBtn col="price" label="Precio" /></th>
                <th className="px-4 py-3 text-right"><SortBtn col="rating" label="⭐" /></th>
                <th className="px-4 py-3 text-right"><SortBtn col="reviewCount" label="Reviews" /></th>
                <th className="px-4 py-3 text-left">Vendedor</th>
                <th className="px-4 py-3 text-center">Envío</th>
                <th className="px-4 py-3 text-center">Link</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item, idx) => (
                <tr key={idx} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{item.position}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="font-medium text-slate-700 line-clamp-2 leading-snug">{item.title}</div>
                    {item.discountPercent && item.discountPercent > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingDown className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">-{item.discountPercent}% dcto</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-brand-600">{formatPrice(item.price, item.currency)}</div>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="text-xs text-slate-400 line-through">{formatPrice(item.originalPrice, item.currency)}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.rating ? (
                      <div className="flex items-center justify-end gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-slate-600">{item.rating.toFixed(1)}</span>
                      </div>
                    ) : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">
                    {item.reviewCount ? item.reviewCount.toLocaleString('es') : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs max-w-[120px] truncate">{item.seller || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    {item.freeShipping ? (
                      <span className="bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full font-medium">Gratis</span>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      className="text-brand-400 hover:text-brand-600 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
