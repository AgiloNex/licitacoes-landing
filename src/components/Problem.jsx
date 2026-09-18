'use client'

export default function Problem() {
  const problems = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Perde editais por não saber que eles existem',
      description: 'O PNCP e Comprasnet publicam milhares de editais por dia. Sua equipe gasta horas em buscas manuais e mesmo assim deixa passar oportunidades perfeitas para seu negócio.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Propostas fracas que não passam na habilitação',
      description: 'Você monta a proposta às pressas, esquece documentos, erra preços ou não atende exigências do edital. Resultado: inabilitação e meses de trabalho jogados fora.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Não sabe quem é a concorrência nem como eles precificam',
      description: 'Entra no pregão no escuro. Não conhece o histórico dos concorrentes, não sabe o preço médio praticado e acaba ou perdendo por preço ou ganhando com margem zero.',
    },
  ]

  return (
    <section id="problem" className="py-20 lg:py-28 bg-white" aria-labelledby="problem-title">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 id="problem-title" className="section-title">
            Por que empresas travam ao vender para o governo
          </h2>
          <p className="section-subtitle">
            Não é falta de capacidade técnica. É falta de inteligência e automação no processo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <article
              key={index}
              className="group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                {problem.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{problem.title}</h3>
              <p className="text-slate-600 leading-relaxed">{problem.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}