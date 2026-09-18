import './globals.css'

export const metadata = {
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LicitAI - Venda mais para o governo',
    description: 'Plataforma completa para empresas que querem vencer licitações públicas.',
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'LicitAI',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Cloud',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'BRL',
                availability: 'https://schema.org/InStock',
              },
              description: 'Plataforma completa para empresas que querem vencer licitações públicas. Encontre editais, prepare propostas competitivas e aumente sua receita com o governo.',
            }),
          }}
        />
      </head>
      <body className="font-[Inter] antialiased">{children}</body>
    </html>
  )
}