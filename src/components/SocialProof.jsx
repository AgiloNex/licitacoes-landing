'use client'

export default function SocialProof() {
  const testimonials = [
    {
      quote: 'Reduzimos o tempo de preparação de proposta de 3 dias para 40 minutos. No primeiro mês ganhamos 2 pregões que teríamos perdido por falta de tempo.',
      author: 'Roberto Silva',
      role: 'Diretor Comercial - Construtora Vale Sul',
      avatar: 'RS',
    },
    {
      quote: 'O radar de concorrentes mudou o jogo. Sabemos exatamente quanto cada concorrente costuma dar de desconto e ajustamos nossa estratégia. Margem subiu 18%.',
      author: 'Mariana Costa',
      role: 'Gestora de Licitações - MedTech Brasil',
      avatar: 'MC',
    },
    {
      quote: 'Antes perdíamos editais por não saber que existiam. Hoje o alerta no WhatsApp chega no mesmo dia da publicação. Nunca mais perdemos prazo de impugnação.',
      author: 'Carlos Eduardo',
      role: 'Sócio - Escritório Jurídico Almeida & Partners',
      avatar: 'CE',
    },
  ]

  const logos = [
    'Construtora Alpha',
    'MedTech Brasil',
    'Logística Express',
    'TI Solutions',
    'Engenharia Clínica',
    'Alimentos Natural',
  ]

  return (
    <section className="py-20 lg:py-28 bg-white" aria-labelledby="social-proof-title">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 id="social-proof-title" className="section-title">
            Empresas que já vendem mais para o governo
          </h2>
          <p className="section-subtitle">
            Resultados reais de quem usa o LicitAI no dia a dia.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <article
              key={index}
              className="p-6 bg-slate-50 rounded-2xl border border-slate-100"
            >
              <div className="flex gap-1 mb-4" aria-label="Avaliação 5 estrelas">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.author}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-12">
          <p className="text-center text-slate-500 text-sm mb-8">Confiam no LicitAI</p>
          <div className="flex flex-wrap items-center justify-center gap-12 text-slate-300 font-medium text-sm">
            {logos.map((logo, index) => (
              <span key={index} className="opacity-60 hover:opacity-100 transition-opacity">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}