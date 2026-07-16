'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-slate-100 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
            <span className="text-brand-600">Omni</span><span className="text-slate-800">Seller</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="#plataformas" className="text-slate-600 hover:text-brand-600 text-sm font-medium transition-colors">
              Plataformas
            </Link>
            <Link href="#features" className="text-slate-600 hover:text-brand-600 text-sm font-medium transition-colors">
              Qué incluye
            </Link>
            <Link href="#pricing" className="text-slate-600 hover:text-brand-600 text-sm font-medium transition-colors">
              Precios
            </Link>
            <Link href="/auth/login" className="text-slate-600 hover:text-brand-600 text-sm font-medium transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/dashboard" className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors">
              Probar gratis
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-slate-100 flex flex-col gap-4">
            <Link href="#plataformas" className="text-slate-600 text-sm" onClick={() => setOpen(false)}>Plataformas</Link>
            <Link href="#features" className="text-slate-600 text-sm" onClick={() => setOpen(false)}>Qué incluye</Link>
            <Link href="#pricing" className="text-slate-600 text-sm" onClick={() => setOpen(false)}>Precios</Link>
            <Link href="/auth/login" className="text-slate-600 text-sm" onClick={() => setOpen(false)}>Iniciar sesión</Link>
            <Link href="/dashboard" className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center" onClick={() => setOpen(false)}>
              Probar gratis
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
