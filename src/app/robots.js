export default function robots() {
  const baseUrl = 'https://licitai.com.br';

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/login', '/api/', '/_next/', '/static/'] },
      { userAgent: 'Bingbot', allow: '/', disallow: ['/login', '/api/', '/_next/', '/static/'] },
      { userAgent: 'DuckDuckBot', allow: '/', disallow: ['/login', '/api/', '/_next/', '/static/'] },
      { userAgent: 'BraveBot', allow: '/', disallow: ['/login', '/api/', '/_next/', '/static/'] },
      { userAgent: 'YandexBot', allow: '/', disallow: ['/login', '/api/', '/_next/', '/static/'] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}