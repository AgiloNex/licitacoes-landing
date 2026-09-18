'use client'

import Link from 'next/link'

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 149,
      period: 'mês',
      description: 'Para empresas começando em licitações',
      features: [
        'Até 50 editais/mês monitorados',
        'Busca no PNCP + Comprasnet',
        'Score de aderência básico',
        'Alertas por e-mail',
        'Gerador de propostas (5/mês)',
        'Gestão de 50 documentos',
        'Suporte por chat (horário comercial)',
      ],
      cta: 'Começar grátis 14 dias',
      popular: false,
    },
    {
      name: 'Professional',
      price: 399,
      period: 'mês',
      description: 'Para quem já vende e quer escalar',
      features: [
        'Editais ilimitados monitorados',
        'Todos os portais (estaduais/municipais)',
        'Score de aderência avançado (IA)',
        'Radar de concorrentes completo',
        'Alertas WhatsApp + Slack + e-mail',
        'Gerador de propostas ilimitado',
        'Calculadora de preço máxima',
        'Gestão de documentos ilimitada',
        'Relatórios de performance',
        'Suporte prioritário + WhatsApp',
      ],
      cta: 'Assinar Professional',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 899,
      period: 'mês',
      description: 'Para equipes e alto volume',
      features: [
        'Tudo do Professional',
        'Até 10 usuários inclusos',
        'API para integração com ERP',
        'Onboarding dedicado',
        'Treinamento da equipe (2h)',
        'SLA 99,9% + suporte 24/7',
        'Relatórios personalizados',
        'Gestão de múltiplas empresas/CNPJs',
        'Auditoria de conformidade LGPD',
      ],
      cta: 'Falar com vendas',
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-slate-50" aria-labelledby="pricing-title">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 id="pricing-title" className="section-title">
            Planos simples, sem surpresas
          </h2>
          <p className="section-subtitle">
            Todos os planos incluem teste grátis de 14 dias. Cancele quando quiser. Pagamento via Stripe (cartão/Pix).
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <article
              key={index}
              className={`relative p-8 bg-white rounded-2xl border ${
                plan.popular
                  ? 'border-primary-500 shadow-lg ring-2 ring-primary-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              itemScope
              itemType="https://schema.org/Offer"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                  Mais popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900" itemProp="name">{plan.name}</h3>
                <p className="mt-1 text-slate-600 text-sm">{plan.description}</p>
              </div>

              <div className="text-center mb-6" itemProp="priceSpecification" itemScope itemType="https://schema.org/UnitPriceSpecification">
                <span className="text-4xl font-bold text-slate-900">
                  R$ <span itemProp="price" content={plan.price.toString()}>{plan.price}</span>
                </span>
                <span className="text-slate-500 text-sm">/<span itemProp="billingDuration" content="P1M">{plan.period}</span></span>
                <meta itemProp="priceCurrency" content="BRL" />
              </div>

              <Link
                href="#pricing"
                className={`block w-full text-center ${plan.popular ? 'btn-primary' : 'btn-secondary'} mb-8`}
                itemProp="url"
              >
                {plan.cta}
              </Link>

              <ul className="space-y-4" role="list">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3" itemProp="featureList">
                    <svg
                      className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600">
            Precisa de algo personalizado?{' '}
            <Link href="mailto:contato@licitai.com.br" className="text-primary-600 hover:underline font-medium">
              Fale com a gente
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}