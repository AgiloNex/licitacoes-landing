export default function sitemap() {
  const baseUrl = 'https://licitai.com.br';
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/login`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
  ];
}