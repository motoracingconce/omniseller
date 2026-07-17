'use client'
import { useState, useMemo } from 'react'
import { ExternalLink, Heart, MessageCircle, Share2, Eye, Users, Music, Download, ArrowUpDown } from 'lucide-react'
import type { TikTokVideo } from '@/lib/tiktok'

interface Props {
  items: TikTokVideo[]
  query: string
}

type SortKey = 'position' | 'views' | 'likes' | 'shares' | 'comments' | 'authorFollowers'

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

function TikTokStats({ items }: { items: TikTokVideo[] }) {
  const totalViews = items.reduce((a, b) => a + b.views, 0)
  const avgLikes = Math.round(items.reduce((a, b) => a + b.likes, 0) / items.length)
  const avgEngagement = items.length
    ? Math.round(items.reduce((i, v) => i + (v.likes + v.comments + v.shares), 0) / items.length)
    : 0
  const topVideo = items.reduce((a, b) => (b.views > a.views ? b : a), items[0])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {[
        { label: 'Views totales', value: fmt(totalViews), color: 'text-pink-500', icon: '👁️' },
        { label: 'Likes promedio', value: fmt(avgLikes), color: 'text-red-500', icon: '❤️' },
        { label: 'Engagement prom.', value: fmt(avgEngagement), color: 'text-purple-600', icon: '🔥' },
        { label: 'Video más viral', value: fmt(topVideo?.views ?? 0), color: 'text-brand-600', icon: '🚀' },
      ].map(s => (
        <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-100">
          <div className={`text-xl font-bold ${s.color}`}>{s.icon} {s.value}</div>
          <div className="text-xs text-slate-400 mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

export default function TikTokResults({ items, query }: Props) {
  const [sort, setSort] = useState<SortKey>('views')
  const [asc, setAsc] = useState(false)
  const [view, setView] = useState<'cards' | 'table'>('cards')

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      const va = a[sort] ?? 0
      const vb = b[sort] ?? 0
      return asc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
    })
  }, [items, sort, asc])

  function toggleSort(key: SortKey) {
    if (sort === key) setAsc(!asc)
    else { setSort(key); setAsc(false) }
  }

  function exportCSV() {
    const headers = ['#', 'Texto', 'Autor', 'Seguidores', 'Views', 'Likes', 'Comentarios', 'Shares', 'Música', 'Hashtags', 'URL']
    const rows = sorted.map((v, i) => [
      i + 1, v.text, v.authorUsername, v.authorFollowers,
      v.views, v.likes, v.comments, v.shares,
      v.musicName ?? '', v.hashtags.join(' '), v.url,
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tiktok-${query}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const SortBtn = ({ col, label }: { col: SortKey; label: string }) => (
    <button onClick={() => toggleSort(col)}
      className={`flex items-center gap-1 transition-colors hover:text-pink-500 ${sort === col ? 'text-pink-500 font-semibold' : ''}`}>
      {label}<ArrowUpDown className="w-3 h-3 opacity-50" />
    </button>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-slate-500">
          <span className="font-semibold text-slate-800">{items.length} videos</span> para{' '}
          <span className="font-semibold text-pink-500">"{query}"</span> en TikTok
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
            {(['cards', 'table'] as const).map(v => (
              <button key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 capitalize transition-colors ${view === v ? 'bg-pink-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                {v === 'cards' ? '⊞ Cards' : '≡ Tabla'}
              </button>
            ))}
          </div>
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 text-sm text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-pink-300 hover:text-pink-500 transition-colors">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>
      </div>

      <TikTokStats items={items} />

      {view === 'cards' ? (
        /* Card grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((video, idx) => (
            <div key={video.id} className="bg-white rounded-2xl border border-slate-100 p-4 hover:border-pink-200 hover:shadow-sm transition-all">
              {/* Rank + author */}
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-mono text-slate-300">#{idx + 1}</span>
                <a href={`https://www.tiktok.com/@${video.authorUsername}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 group">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {video.authorUsername?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-700 group-hover:text-pink-500 transition-colors">
                      @{video.authorUsername}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-0.5">
                      <Users className="w-2.5 h-2.5" /> {fmt(video.authorFollowers)}
                    </div>
                  </div>
                </a>
              </div>

              {/* Text */}
              <p className="text-sm text-slate-600 line-clamp-3 mb-3 leading-relaxed">{video.text}</p>

              {/* Hashtags */}
              {video.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {video.hashtags.slice(0, 4).map(h => (
                    <span key={h} className="text-xs bg-pink-50 text-pink-500 px-1.5 py-0.5 rounded-full">#{h}</span>
                  ))}
                  {video.hashtags.length > 4 && (
                    <span className="text-xs text-slate-300">+{video.hashtags.length - 4}</span>
                  )}
                </div>
              )}

              {/* Music */}
              {video.musicName && (
                <div className="flex items-center gap-1 text-xs text-slate-400 mb-3 truncate">
                  <Music className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{video.musicName}</span>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-4 gap-1 pt-3 border-t border-slate-50">
                {[
                  { icon: <Eye className="w-3 h-3" />, value: fmt(video.views), color: 'text-brand-500' },
                  { icon: <Heart className="w-3 h-3" />, value: fmt(video.likes), color: 'text-red-400' },
                  { icon: <MessageCircle className="w-3 h-3" />, value: fmt(video.comments), color: 'text-blue-400' },
                  { icon: <Share2 className="w-3 h-3" />, value: fmt(video.shares), color: 'text-green-400' },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className={`flex justify-center mb-0.5 ${s.color}`}>{s.icon}</div>
                    <div className="text-xs font-semibold text-slate-600">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Link */}
              {video.url && (
                <a href={video.url} target="_blank" rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-1 text-xs text-pink-400 hover:text-pink-600 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Ver en TikTok
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Table view */
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left w-10"><SortBtn col="position" label="#" /></th>
                  <th className="px-4 py-3 text-left">Video / Autor</th>
                  <th className="px-4 py-3 text-right"><SortBtn col="views" label="Views" /></th>
                  <th className="px-4 py-3 text-right"><SortBtn col="likes" label="❤️" /></th>
                  <th className="px-4 py-3 text-right"><SortBtn col="comments" label="💬" /></th>
                  <th className="px-4 py-3 text-right"><SortBtn col="shares" label="🔁" /></th>
                  <th className="px-4 py-3 text-right"><SortBtn col="authorFollowers" label="Seguidores" /></th>
                  <th className="px-4 py-3 text-center">Link</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((v, idx) => (
                  <tr key={v.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{idx + 1}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-medium text-slate-700 line-clamp-2 text-xs leading-snug">{v.text}</div>
                      <div className="text-xs text-pink-400 mt-0.5">@{v.authorUsername}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-brand-600">{fmt(v.views)}</td>
                    <td className="px-4 py-3 text-right text-red-400">{fmt(v.likes)}</td>
                    <td className="px-4 py-3 text-right text-blue-400">{fmt(v.comments)}</td>
                    <td className="px-4 py-3 text-right text-green-400">{fmt(v.shares)}</td>
                    <td className="px-4 py-3 text-right text-slate-500">{fmt(v.authorFollowers)}</td>
                    <td className="px-4 py-3 text-center">
                      <a href={v.url} target="_blank" rel="noopener noreferrer"
                        className="text-pink-400 hover:text-pink-600 transition-colors">
                        <ExternalLink className="w-4 h-4 mx-auto" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
