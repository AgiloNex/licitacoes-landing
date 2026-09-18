import Header from '../components/Header'
import Hero from '../components/Hero'
import Problem from '../components/Problem'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import Pricing from '../components/Pricing'
import SocialProof from '../components/SocialProof'
import FAQ from '../components/FAQ'
import FinalCTA from '../components/FinalCTA'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'LicitAI',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Cloud',
            url: 'https://licitai.com.br',
            offers: {
              '@type': 'Offer',
              name: 'Plano Starter',
              price: '149',
              priceCurrency: 'BRL',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: '149',
                priceCurrency: 'BRL',
                billingDuration: 'P1M',
              },
              availability: 'https://schema.org/InStock',
            },
            description: 'Plataforma completa para empresas que querem vencer licitações públicas. Encontre editais, prepare propostas competitivas e aumente sua receita com o governo.',
            featureList: [
              'Busca inteligente de editais',
              'Análise de concorrência',
              'Gerador de propostas',
              'Gestão de documentos',
              'Alertas personalizados',
              'Relatórios de performance',
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              reviewCount: '127',
            },
          }),
        }}
      />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Hero />
          <Problem />
          <HowItWorks />
          <Features />
          <Pricing />
          <SocialProof />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </>
  )
}