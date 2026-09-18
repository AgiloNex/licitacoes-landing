'use client'

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Configure seu perfil',
      description: 'Defina suas palavras-chave, categorias (CNAE), região de atuação, faixa de valores e tipo de licitação (pregão, concorrência, dispensa). Leva 5 minutos.',
    },
    {
      number: '02',
      title: 'Receba editais filtrados',
      description: 'Nossa IA varre PNCP, Comprasnet, portais estaduais e municipais. Você recebe só o que importa — no WhatsApp, e-mail ou no dashboard — com score de aderência.',
    },
    {
      number: '03',
      title: 'Analise a concorrência',
      description: 'Veja quem costuma participar, preços médios praticados, taxa de desconto histórica e documentos que costumam apresentar. Entre no pregão sabendo o jogo.',
    },
    {
      number: '04',
      title: 'Gere e envie a proposta',
      description: 'O gerador preenche modelos com seus dados, calcula preço sugerido com margem segura, checa documentos obrigatórios e exporta no formato exigido pelo portal.',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50" aria-labelledby="how-title">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 id="how-title" className="section-title">
            De edital publicado a proposta enviada em 4 passos
          </h2>
          <p className="section-subtitle">
            Sem planilhas, sem retrabalho, sem surpresas na hora da abertura dos envelopes.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:absolute left-1/2 top-10 bottom-10 w-0.5 bg-primary-200 -translate-x-1/2" aria-hidden="true" />

          <div className="space-y-12 lg:space-y-16">
            {steps.map((step, index) => (
              <article
                key={index}
                className={`relative flex flex-col lg:flex-row gap-8 items-start ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="relative z-10 flex-shrink-0 w-full lg:w-1/2">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-primary-200 lg:text-4xl">{step.number}</span>
                    <div className="hidden lg:block w-12 h-0.5 bg-primary-200" aria-hidden="true" />
                    <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                  </div>
                  <p className="mt-4 text-slate-600 text-lg leading-relaxed">{step.description}</p>
                </div>

                <div className="relative z-10 flex-shrink-0 w-full lg:w-1/2">
                  <div className="aspect-video bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center">
                    <div className="text-center p-8 text-slate-400">
                      <svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-sm">Tela do passo {step.number}</p>
                    </div>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-white z-20" aria-hidden="true" />
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}