import './globals.css'

export const metadata = {
  metadataBase: new URL('https://licitai.com.br'),
  title: 'LicitAI - Venda mais para o governo com inteligência de dados',
  description: 'Plataforma completa para empresas que querem vencer licitações públicas. Encontre editais, prepare propostas competitivas e aumente sua receita com o governo.',
  keywords: ['licitações', 'compras governamentais', 'editais', 'propostas', 'vendas para governo', 'B2G', 'licitacao', 'pregão'],
  authors: [{ name: 'LicitAI' }],
  creator: 'LicitAI',
  publisher: 'LicitAI',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://licitai.com.br',
    title: 'LicitAI - Venda mais para o governo com inteligência de dados',
    description: 'Plataforma completa para empresas que querem vencer licitações públicas. Encontre editais, prepare propostas competitivas e aumente sua receita com o governo.',
    siteName: 'LicitAI',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'LicitAI - Dashboard de licitações inteligentes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LicitAI - Venda mais para o governo',
    description: 'Plataforma completa para empresas que querem vencer licitações públicas.',
    images: ['/og-image.svg'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
  alternates: {
    canonical: 'https://licitai.com.br',
  },
}

export const viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LicitAI',
  url: 'https://licitai.com.br',
  logo: 'https://licitai.com.br/logo.png',
  sameAs: [
    'https://linkedin.com/company/licitai',
    'https://youtube.com/@licitai',
    'https://instagram.com/licitai',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+55-11-99999-9999',
    contactType: 'customer service',
    availableLanguage: 'Portuguese',
    areaServed: 'BR',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Início',
      item: 'https://licitai.com.br',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Funcionalidades',
      item: 'https://licitai.com.br#features',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Como funciona',
      item: 'https://licitai.com.br#how-it-works',
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Planos',
      item: 'https://licitai.com.br#pricing',
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: 'Dúvidas',
      item: 'https://licitai.com.br#faq',
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'O LicitAI funciona para qualquer tipo de licitação?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. Cobrimos pregão eletrônico, concorrência, tomada de preços, convite, concurso, leilão e dispensas/inexigibilidades. A busca abrange União, Estados, DF e Municípios que publicam no PNCP ou portais próprios.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como funciona o teste grátis de 14 dias?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Você cria a conta, configura seu perfil em 5 minutos e tem acesso completo ao plano Professional por 14 dias. Não pedimos cartão de crédito no cadastro. Ao final, você escolhe se assina ou cancela — sem cobrança automática.',
      },
    },
    {
      '@type': 'Question',
      name: 'Preciso de conhecimento técnico para usar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Não. A interface foi feita para quem vende, não para desenvolvedor. Busca, alertas, gerador de propostas e relatórios funcionam com cliques. Se tiver dúvida, nosso suporte resolve por WhatsApp em minutos.',
      },
    },
    {
      '@type': 'Question',
      name: 'Os dados dos editais são atualizados em tempo real?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nossa coleta roda a cada 30 minutos nos portais oficiais (PNCP, Comprasnet, portais estaduais/municipais). Editais novos aparecem no dashboard e disparam alertas assim que indexados.',
      },
    },
    {
      '@type': 'Question',
      name: 'Posso cancelar a qualquer momento?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. Cancelamento em 2 cliques na área do cliente. O acesso permanece até o fim do período pago. Sem multa, sem fidelidade, sem burocracia. Se quiser voltar, seus dados ficam salvos por 12 meses.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como funciona a integração com WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Você conecta seu número via QR code (WhatsApp Business API oficial). Alertas de novos editais, vencimentos de certidões e lembretes de pregão chegam como mensagem normal. Pode configurar horários de silêncio.',
      },
    },
  ],
}

const softwareSchema = {
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
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      </head>
      <body className="font-[Inter] antialiased">{children}</body>
    </html>
  )
}