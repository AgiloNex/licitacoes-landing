'use client'

import { useState } from 'react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: 'O LicitAI funciona para qualquer tipo de licitação?',
      answer: 'Sim. Cobrimos pregão eletrônico, concorrência, tomada de preços, convite, concurso, leilão e dispensas/inexigibilidades. A busca abrange União, Estados, DF e Municípios que publicam no PNCP ou portais próprios.',
    },
    {
      question: 'Como funciona o teste grátis de 14 dias?',
      answer: 'Você cria a conta, configura seu perfil em 5 minutos e tem acesso completo ao plano Professional por 14 dias. Não pedimos cartão de crédito no cadastro. Ao final, você escolhe se assina ou cancela — sem cobrança automática.',
    },
    {
      question: 'Preciso de conhecimento técnico para usar?',
      answer: 'Não. A interface foi feita para quem vende, não para desenvolvedor. Busca, alertas, gerador de propostas e relatórios funcionam com cliques. Se tiver dúvida, nosso suporte resolve por WhatsApp em minutos.',
    },
    {
      question: 'Os dados dos editais são atualizados em tempo real?',
      answer: 'Nossa coleta roda a cada 30 minutos nos portais oficiais (PNCP, Comprasnet, portais estaduais/municipais). Editais novos aparecem no dashboard e disparam alertas assim que indexados.',
    },
    {
      question: 'Posso cancelar a qualquer momento?',
      answer: 'Sim. Cancelamento em 2 cliques na área do cliente. O acesso permanece até o fim do período pago. Sem multa, sem fidelidade, sem burocracia. Se quiser voltar, seus dados ficam salvos por 12 meses.',
    },
    {
      question: 'Como funciona a integração com WhatsApp?',
      answer: 'Você conecta seu número via QR code (WhatsApp Business API oficial). Alertas de novos editais, vencimentos de certidões e lembretes de pregão chegam como mensagem normal. Pode configurar horários de silêncio.',
    },
  ]

  return (
    <section id="faq" className="py-20 lg:py-28 bg-slate-50" aria-labelledby="faq-title">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 id="faq-title" className="section-title">
            Dúvidas frequentes
          </h2>
          <p className="section-subtitle">
            Respostas diretas para as perguntas que mais recebemos.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <dl className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                >
                  <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-4">Não encontrou sua dúvida?</p>
            <a
              href="mailto:contato@licitai.com.br"
              className="btn-secondary"
            >
              Fale com a gente
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}