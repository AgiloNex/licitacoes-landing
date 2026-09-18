'use client'

import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="py-20 lg:py-28 bg-slate-900" aria-labelledby="final-cta-title">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 id="final-cta-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight text-balance">
            Pare de perder editais para a concorrência hoje
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto text-balance">
            Configure seu perfil em 5 minutos. Receba os primeiros editais filtrados hoje mesmo. Teste grátis por 14 dias — sem cartão de crédito.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#pricing"
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
            >
              Começar grátis agora
            </Link>
            <Link
              href="mailto:contato@licitai.com.br"
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-transparent border-2 border-slate-600 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
            >
              Falar com especialista
            </Link>
          </div>

          <p className="mt-8 text-sm text-slate-400">
            2.300+ empresas já usam o LicitAI para vender mais para o governo
          </p>
        </div>
      </div>
    </section>
  )
}