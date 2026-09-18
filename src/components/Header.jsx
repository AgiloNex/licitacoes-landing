'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-100' : 'bg-transparent'
      }`}
    >
      <nav className="section-container" aria-label="Navegação principal">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2" aria-label="LicitAI - Página inicial">
            <svg
              className="w-8 h-8 text-primary-600"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-xl font-bold text-slate-900">LicitAI</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Funcionalidades
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Como funciona
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Planos
            </Link>
            <Link href="#faq" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Dúvidas
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden lg:inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="#pricing"
              className="btn-primary text-sm whitespace-nowrap"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}