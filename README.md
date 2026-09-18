# LicitAI — Landing Page Pública

Landing page estática (SSG) para captação de leads do SaaS **LicitAI** — plataforma de inteligência de dados para empresas que vendem para o governo.

**Stack:** Next.js 14 (App Router) + React 18 + Tailwind CSS + JavaScript (sem TypeScript)
**Output:** Export estático (`output: 'export'`) → pasta `out/` pronta para Cloudflare Pages, Nginx, Vercel, Netlify ou qualquer CDN estático.

---

## Estrutura do Projeto

```
licitacoes/
├── public/                          # Assets servidos diretamente
│   ├── 880071a12b914116d33f108114587758.txt   # IndexNow key (obrigatório na raiz)
│   ├── og-image.svg                 # Open Graph / Twitter card (1200x630)
│   ├── logo.svg                     # Logo para schema.org Organization
│   └── favicon.ico                  # (adicione se quiser)
│
├── src/
│   ├── app/
│   │   ├── globals.css              # Tailwind + componentes customizados (.btn-primary, .section-container, etc)
│   │   ├── layout.jsx               # Root layout + metadata SEO + 4x JSON-LD schemas
│   │   ├── page.jsx                 # Home page (composta por components/)
│   │   ├── robots.js                # robots.txt dinâmico (Bingbot, DuckDuckBot, BraveBot, YandexBot)
│   │   ├── sitemap.js               # sitemap.xml dinâmico
│   │   └── api/indexnow/route.js    # API route POST para submeter URLs ao IndexNow
│   │
│   └── components/                  # Seções da landing (todas client-side 'use client')
│       ├── Header.jsx               # Nav + botão "Entrar" → /login
│       ├── Hero.jsx                 # Headline, CTA, mockup placeholder, stats
│       ├── Problem.jsx              # 3 dores reais do público
│       ├── HowItWorks.jsx           # 4 passos do fluxo
│       ├── Features.jsx             # 8 funcionalidades principais
│       ├── Pricing.jsx              # 3 planos (Starter/Professional/Enterprise) + schema.org Offer
│       ├── SocialProof.jsx          # 3 depoimentos + logos
│       ├── FAQ.jsx                  # 6 perguntas com accordion
│       ├── FinalCTA.jsx             # CTA final
│       └── Footer.jsx               # Links, legal, social
│
├── scripts/
│   └── submit-indexnow.js           # Script CLI para submeter URLs ao IndexNow (roda no postbuild)
│
├── next.config.js                   # Config Next.js (output: export, headers, security)
├── package.json                     # Scripts: dev, build, postbuild, start, indexnow
├── .gitignore                       # Ignora node_modules, .next, out, .env, .vercel
├── .npmrc                           # Config npm (prefer-offline, no-audit)
└── README.md                        # Este arquivo
```

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento (porta 3000/3001) |
| `npm run build` | Build de produção → gera pasta `out/` |
| `npm run postbuild` | Roda automaticamente após `build` → submete URLs ao IndexNow |
| `npm run indexnow` | Submete URLs ao IndexNow manualmente |
| `npm run start` | Serve build de produção (requer `output: 'standalone'` ou servidor estático) |
| `npm run lint` | ESLint |

---

## SEO Implementado

### On-Page (todas as páginas)
- ✅ Title tag único, ≤ 60 chars, keyword principal
- ✅ Meta description persuasiva, ≤ 155 chars
- ✅ H1 único alinhado com title
- ✅ Hierarquia H2/H3 sem pular níveis
- ✅ URL limpa, semântica (`#features`, `#pricing`, `#faq`)
- ✅ Alt text em imagens significativas
- ✅ Links internos conectando seções relacionadas
- ✅ Canonical tag em `layout.jsx` (`alternates.canonical`)
- ✅ Open Graph + Twitter Cards com imagem (`og-image.svg`)
- ✅ Viewport + theme-color (`#16a34a`)

### Technical SEO
- ✅ HTTPS ready (Cloudflare proxy / VPS + Let's Encrypt)
- ✅ Mobile-first, responsivo (Tailwind)
- ✅ Core Web Vials otimizados (Next.js SSG, fonts preload, DNS prefetch)
- ✅ `sitemap.xml` gerado em build (`src/app/sitemap.js`)
- ✅ `robots.txt` com regras explícitas para crawlers principais
- ✅ Security headers (CSP-ready, X-Frame, X-Content-Type, HSTS-ready)
- ✅ Sem cadeias de redirect, sem links quebrados

### Schema.org (JSON-LD) — 4 tipos no `layout.jsx`
| Schema | Finalidade |
|--------|------------|
| `Organization` | Marca, logo, redes sociais, contato |
| `BreadcrumbList` | Navegação estruturada (Home → Features → HowItWorks → Pricing → FAQ) |
| `FAQPage` | 6 perguntas/respostas para rich results |
| `SoftwareApplication` + `Offer` | Produto + planos com preço, moeda, disponibilidade |

### E-E-A-T Signals
- Depoimentos com nome, cargo, empresa (3 cards)
- Números específicos: "2.300+ empresas", "R$ 840Mi+ em contratos", "94% taxa de recomendação"
- Funcionalidades descritas com benefício prático, não jargão
- FAQ responde dúvidas reais de objection handling

---

## Indexação Multi-Motor (IndexNow + Webmaster Tools)

### 1. IndexNow (automático no deploy)

**Protocolo aberto** (Bing, Yandex, Naver, Seznam) — notifica motores em minutos, não dias.

- **Key:** `880071a12b914116d33f108114587758`
- **Key location:** `https://licitai.com.br/880071a12b914116d33f108114587758.txt` (presente em `public/` e copiado para `out/`)
- **Endpoint:** `https://api.indexnow.org/indexnow`
- **URLs submetidas:** `https://licitai.com.br` + `https://licitai.com.br/login`

**Como funciona:**
1. `npm run build` → gera `out/`
2. `postbuild` script → `node scripts/submit-indexnow.js` → POST para IndexNow
3. IndexNow distribui para Bing, Yandex, Naver, Seznam
4. Bing "empurra" para Yahoo, Ecosia, DuckDuckGo, ChatGPT Search

**Teste manual:**
```bash
npm run indexnow
# ou
node scripts/submit-indexnow.js
```

**Saída esperada:**
```
Submitting to IndexNow: [ 'https://licitai.com.br', 'https://licitai.com.br/login' ]
IndexNow submission successful: Submitted 2 URLs
```

### 2. Bing Webmaster Tools (configuração manual única)

1. Acesse `https://bing.com/webmasters`
2. Login com conta Microsoft/Google/GitHub
3. "Add site" → importe do **Google Search Console** (se já tiver) ou adicione manualmente
4. Verifique propriedade (meta tag, arquivo XML, ou CNAME DNS)
5. Envie `https://licitai.com.br/sitemap.xml`
6. Ative **IndexNow** no painel (já configurado via API)
7. Monitore: "Site Scan", "AI Performance" (beta), "URL Submission"

### 3. Brave Search (índice 100% próprio)

1. Acesse `https://search.brave.com/submit-url`
2. Envie `https://licitai.com.br`
3. Confirme que `robots.txt` permite `BraveBot` (já configurado)
4. Mantenha sitemap válido

### 4. Google Search Console (opcional, mas recomendado)

1. `https://search.google.com/search-console`
2. Adicione propriedade de domínio (`licitai.com.br`) via DNS TXT
3. Envie sitemap: `https://licitai.com.br/sitemap.xml`
3. Monitore: Indexação, Core Web Vitals, Cobertura, Rich Results

### 5. Yandex Webmaster (apenas se mirar Rússia/CEI)

- `https://webmaster.yandex.com` → interface em inglês disponível
- 60–74% do mercado russo

---

## Deploy

### Opção A: Cloudflare Pages (recomendado atual)

**Pré-requisitos:** Repo no GitHub (`AgiloNex/licitacoes-landing`)

1. **Cloudflare Dashboard** → Workers & Pages → Create application → Pages → Connect to Git
2. Selecione repo `AgiloNex/licitacoes-landing`
3. Configuração de build:
   ```
   Build command: npm run build
   Build output directory: out
   Root directory: (deixe vazio)
   ```
4. **Environment variables** (Settings → Environment variables):
   ```
   INDEXNOW_CRON_SECRET = <string_aleatoria_32_chars>
   ```
5. **Custom domain**: `licitai.com.br` → DNS na Cloudflare (proxy laranja ativo)
6. **Deploy** → Cloudflare roda `npm run build` → `postbuild` roda IndexNow automaticamente

**Vantagens:** CDN global grátis, SSL automático, headers via `_headers` file se precisar, Functions para API routes futuras.

---

### Opção B: VPS + Nginx (estático — recomendado para landing)

**Build local / CI:**
```bash
npm run build
# gera pasta out/
```

**Upload para VPS:**
```bash
rsync -avz out/ user@seu-vps:/var/www/licitai/
# ou scp -r out/* user@seu-vps:/var/www/licitai/
```

**Nginx config (`/etc/nginx/sites-available/licitai`):**
```nginx
server {
    listen 80;
    server_name licitai.com.br www.licitai.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name licitai.com.br www.licitai.com.br;

    root /var/www/licitai;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/licitai.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/licitai.com.br/privkey.pem;

    # Security headers
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy origin-when-cross-origin;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    # Cache assets imutáveis
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /880071a12b914116d33f108114587758.txt {
        add_header Content-Type "text/plain; charset=utf-8";
    }

    # SPA fallback (anchors #features, #pricing, etc)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 404 customizada
    error_page 404 /404.html;
}
```

**Ativar site + SSL:**
```bash
ln -s /etc/nginx/sites-available/licitai /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d licitai.com.br -d www.licitai.com.br
```

**IndexNow no VPS (cron):**
```bash
# Edita crontab
crontab -e

# Adiciona (roda a cada hora)
0 * * * * cd /var/www/licitai && node scripts/submit-indexnow.js >> /var/log/indexnow.log 2>&1
```

---

### Opção C: VPS + Next.js Standalone (se precisar de API routes dinâmicas)

**Mude `next.config.js`:**
```js
// Remova ou comente:
// output: 'export',
// trailingSlash: true,
```

**Build:**
```bash
npm run build
# Gera .next/standalone + .next/static + public
```

**Deploy:**
```bash
mkdir -p /var/www/licitai
cp -r .next/standalone/* /var/www/licitai/
cp -r .next/static /var/www/licitai/_next/
cp -r public/* /var/www/licitai/
cp -r out/* /var/www/licitai/ 2>/dev/null || true
```

**PM2:**
```bash
cd /var/www/licitai
pm2 start server.js --name licitai
pm2 save && pm2 startup
```

**Nginx proxy:**
```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## Variáveis de Ambiente

| Variável | Obrigatória | Onde | Descrição |
|----------|-------------|------|-----------|
| `INDEXNOW_CRON_SECRET` | Sim (produção) | Cloudflare Pages / VPS `.env` | Token para proteger `POST /api/indexnow` |
| `NODE_ENV` | Auto | Build | `production` |

**Gerar secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Checklist Pré-Deploy

- [ ] `npm run build` roda sem erros
- [ ] Pasta `out/` gerada com: `index.html`, `robots.txt`, `sitemap.xml`, `880071a12b914116d33f108114587758.txt`, `og-image.svg`, `logo.svg`
- [ ] `robots.txt` permite Bingbot, DuckDuckBot, BraveBot, YandexBot
- [ ] `sitemap.xml` lista URLs corretas com `lastmod`, `changefreq`, `priority`
- [ ] `og-image.svg` acessível em `https://licitai.com.br/og-image.svg`
- [ ] Schema.org válido (teste em `https://validator.schema.org/`)
- [ ] Core Web Vitals no verde (PageSpeed Insights)
- [ ] Bing Webmaster Tools configurado + sitemap enviado
- [ ] Brave Search URL submetida
- [ ] Google Search Console configurado (opcional)
- [ ] Domínio `licitai.com.br` apontando para Cloudflare/VPS
- [ ] SSL ativo (Cloudflare proxy ou Let's Encrypt)
- [ ] `INDEXNOW_CRON_SECRET` definido no ambiente de produção
- [ ] `npm run indexnow` funciona manualmente após deploy

---

## Personalização Rápida

### Planos/Preços (`src/components/Pricing.jsx`)
```js
const plans = [
  { name: 'Starter', price: 149, period: 'mês', features: [...], popular: false },
  { name: 'Professional', price: 399, period: 'mês', features: [...], popular: true },
  { name: 'Enterprise', price: 899, period: 'mês', features: [...], popular: false },
];
```

### Features (`src/components/Features.jsx`)
```js
const features = [
  { icon: <SVG />, title: 'Busca inteligente multiportal', description: '...' },
  // ...
];
```

### FAQ (`src/components/FAQ.jsx` + `src/app/layout.jsx` FAQ schema)
```js
const faqs = [
  { question: '...', answer: '...' },
  // ...
];
```

### Depoimentos (`src/components/SocialProof.jsx`)
```js
const testimonials = [
  { quote: '...', author: 'Nome', role: 'Cargo - Empresa', avatar: 'IN' },
  // ...
];
```

### Cores (Tailwind — `tailwind.config.js`)
```js
colors: {
  primary: { 500: '#22c55e', 600: '#16a34a', ... }, // Verde "governo/dinheiro"
  gov: { 500: '#3b82f6', 600: '#2563eb', ... },     // Azul "confiança/tech"
}
```

---

## Arquivos de Configuração Importantes

### `next.config.js`
```js
output: 'export',           // Gera pasta out/ estática
trailingSlash: true,        // URLs com / final (compatível Cloudflare/Nginx)
images: { unoptimized: true }, // Necessário para export estático
async headers() { ... }     // Security headers (não aplicam em export, use Nginx/Cloudflare _headers)
```

### `.gitignore`
```
node_modules/
.next/
out/
.env*
.vercel
*.log
.DS_Store
```

---

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Build falha com `EPERM` symlink | Filesystem `/media/...` não suporta symlinks. Use `node node_modules/next/dist/bin/next build` direto. |
| `headers()` não funciona no export | Normal. Use Nginx `add_header` ou Cloudflare Pages `_headers` file. |
| `metadataBase` warning | Adicione `metadataBase: new URL('https://licitai.com.br')` no `metadata` export do `layout.jsx`. |
| IndexNow retorna 401 | Verifique `INDEXNOW_CRON_SECRET` no ambiente e header `Authorization: Bearer <secret>`. |
| Sitemap não aparece | Confira `out/sitemap.xml` existe. No Cloudflare Pages, `build output directory: out`. |
| Fonts não carregam | `preconnect` + `preload` no `layout.jsx` já configurado. Verifique CSP se bloquear `fonts.gstatic.com`. |

---

## Roadmap / Melhorias Futuras

- [ ] Página `/blog` com artigos SEO (long-tail: "como ganhar licitação pregão eletrônico", "documentos para habilitação PNCP")
- [ ] Landing pages por persona (`/construtoras`, `/tecnologia`, `/saude`)
- [ ] Integração Stripe Checkout real nos CTAs
- [ ] Web Vitals monitoring (Vercel Analytics ou `web-vitals` lib + endpoint próprio)
- [ ] A/B testing nos headlines Hero
- [ ] Internacionalização (EN/ES) se expandir para compras governamentais latam

---

## Licença

Proprietário — AgiloNex. Uso interno e comercial autorizado.