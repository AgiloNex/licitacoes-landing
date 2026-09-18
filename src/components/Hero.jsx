'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden" aria-labelledby="hero-title">
      <div className="section-container">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
            </span>
            Novo: Integração com PNCP e Comprasnet
          </div>

          <h1
            id="hero-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight text-balance"
          >
            Pare de perder editais para a concorrência
            <span className="text-primary-600"> e venda mais para o governo</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto text-balance">
            A plataforma que encontra os editais certos, analisa a concorrência e gera propostas competitivas em minutos — não em dias.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#pricing"
              className="btn-primary text-lg px-8 py-4 w-full sm:w-auto"
            >
              Testar grátis por 14 dias
            </Link>
            <Link
              href="#features"
              className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto"
            >
              Ver como funciona
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Sem cartão de crédito • Cancelamento a qualquer momento • Setup em 5 minutos
          </p>
        </div>

        <div className="mt-16 relative">
          <div className="relative mx-auto max-w-5xl">
            <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-200">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="text-center p-8">
                  <svg
                    className="mx-auto h-16 w-16 text-slate-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="text-slate-300 text-lg">Dashboard LicitAI — Demo interativo em breve</p>
                  <p className="text-slate-500 text-sm mt-2">Busca de editais • Análise de concorrência • Gerador de propostas</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 flex gap-1.5 p-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-slate-400 text-sm">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            2.300+ empresas ativas
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            R$ 840Mi+ em contratos ganhos
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            94% taxa de recomendação
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none lg:h-48" aria-hidden="true" />
    </section>
  )
}