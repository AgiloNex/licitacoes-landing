# Deploy Checklist — Monitor de Compliance CNPJ (Supabase + n8n + Telegram)

## ✅ Pré-requisitos
- [ ] Conta Supabase com project criado
- [ ] n8n rodando no PandaStack (acesso à UI)
- [ ] Bot Telegram criado via @BotFather (tenha o `BOT_TOKEN`)
- [ ] Chat ID do Telegram obtido via @userinfobot
- [ ] Domínio/subdomínio no Cloudflare (opcional, para n8n UI)

---

## 1️⃣ Supabase — Database Schema

### 1.1 Aplicar Schema
```bash
# Opção A: Via Supabase Dashboard (recomendado para primeira vez)
# 1. Acesse: https://supabase.com/dashboard/project/<SEU_PROJECT_REF>/sql
# 2. Cole o conteúdo de `schema_final.sql`
# 3. Clique em "Run"

# Opção B: Via CLI (se já tiver linkado)
supabase db push --project-ref <SEU_PROJECT_REF>
```

### 1.2 Verificar Tabelas
```sql
-- No SQL Editor, execute:
select * from public.compliance_clientes;
select * from public.compliance_checks_log;
select * from public.v_compliance_ultima_checagem;
```

### 1.3 Obter Credenciais (Settings → API)
| Variável | Onde usar |
|----------|-----------|
| `SUPABASE_URL` | `https://<ref>.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJ...` (público) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (SECRETO — n8n + Edge Functions) |

---

## 2️⃣ Supabase — Edge Functions

### 2.1 Instalar CLI
```bash
# macOS
brew install supabase/tap/supabase

# Linux/Windows (npm)
npm i -g supabase

# Verificar
supabase --version
```

### 2.2 Login & Link Project
```bash
supabase login
# Abre browser → authorize

supabase link --project-ref <SEU_PROJECT_REF>
# Encontre o ref em: Settings → General → Reference ID
```

### 2.3 Deploy Function: telegram_webhook
```bash
# Na pasta do projeto (onde está supabase/functions/)
supabase functions deploy telegram_webhook
```

### 2.4 Configurar Secrets
```bash
supabase secrets set TELEGRAM_BOT_TOKEN=<SEU_BOT_TOKEN>
# Exemplo: supabase secrets set TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11

# Verificar secrets
supabase secrets list
```

### 2.5 Testar Function Localmente (opcional)
```bash
supabase functions serve telegram_webhook --env-file .env.local
# .env.local deve conter:
# SUPABASE_URL=...
# SUPABASE_SERVICE_ROLE_KEY=...
# TELEGRAM_BOT_TOKEN=...
```

---

## 3️⃣ Telegram — Registrar Webhook

### 3.1 URL da Function
```
https://<SEU_PROJECT_REF>.supabase.co/functions/v1/telegram_webhook
```
*Encontre o ref em Settings → General → Reference ID*

### 3.2 Registrar Webhook
```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://<SEU_PROJECT_REF>.supabase.co/functions/v1/telegram_webhook",
    "allowed_updates": ["message"],
    "drop_pending_updates": true
  }'
```

### 3.3 Verificar Webhook
```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
# Resposta esperada:
# {"ok":true,"result":{"url":"https://...","has_custom_certificate":false,"pending_update_count":0,...}}
```

### 3.4 Testar Bot
No Telegram, envie para seu bot:
```
/start
/cadastrar 47960950000121 Magazine Luiza
/listar
/status 47960950000121
```

---

## 4️⃣ Seed de Dados de Teste

### 4.1 Editar seed_test.sql
Substitua `YOUR_TELEGRAM_CHAT_ID` pelo seu chat_id real (obtido no @userinfobot).

### 4.2 Executar
```bash
# Via Dashboard (SQL Editor) — cole e rode
# Ou via CLI:
supabase db reset --project-ref <SEU_PROJECT_REF>  # CUIDADO: apaga tudo e recria
# Melhor: apenas execute o INSERT manual no SQL Editor
```

---

## 5️⃣ n8n — Configuração

### 5.1 Credenciais (n8n UI → Credentials)

**Supabase API** (Header Auth):
- Name: `supabaseApi`
- Headers:
  - `apikey` = `SUPABASE_SERVICE_ROLE_KEY`
  - `Authorization` = `Bearer SUPABASE_SERVICE_ROLE_KEY`
- Base URL: `https://<ref>.supabase.co/rest/v1`

**Telegram API** (Header Auth ou Query Auth):
- Name: `telegramApi`
- Header: `Authorization` = `Bearer <BOT_TOKEN>`
- Ou passe direto no URL: `https://api.telegram.org/bot<BOT_TOKEN>/sendMessage`

### 5.2 Importar Workflow v2
1. n8n UI → Workflows → Import
2. Selecione `n8n_workflow_compliance_cnpj_v2.json`
3. Abra o workflow
4. Verifique cada node:
   - `Buscar clientes ativos` → Credential: `supabaseApi`, Table: `compliance_clientes`
   - `Enviar Alerta Telegram` → Credential: `telegramApi`
   - `Atualizar cliente` → Credential: `supabaseApi`
   - `Registrar log` → Credential: `supabaseApi`
   - `Error Trigger` → Adicione se não existir

### 5.3 Testar Execução Manual
1. Clique em "Execute Workflow" (botão play)
2. Verifique logs de cada node
3. Confirme no Supabase:
   ```sql
   select * from public.compliance_checks_log order by data_checagem desc limit 5;
   ```
4. Se status mudou → verifique se recebeu mensagem no Telegram

### 5.4 Ativar Workflow
- Toggle "Active" ON (canto superior direito)
- Próxima execução automática: 8h (conforme Schedule Trigger)

---

## 6️⃣ Cloudflare (Opcional — para n8n UI em domínio próprio)

### 6.1 Cloudflare Tunnel
```bash
# No servidor PandaStack (SSH)
docker run -d --name cloudflared \
  --restart unless-stopped \
  cloudflare/cloudflared:latest tunnel run \
  --token <SEU_TUNNEL_TOKEN>
```
- Token obtido em: Cloudflare Dashboard → Zero Trust → Networks → Tunnels

### 6.2 Public Hostname
- Tunnel → Configure → Public Hostname
- Subdomain: `n8n` (ou `cnpj-alerts`)
- Domain: `seudominio.com`
- Type: HTTP
- URL: `http://localhost:5678` (ou IP interno do container n8n)

---

## 7️⃣ Validação End-to-End

| Teste | Como Validar | ✅ Passou? |
|-------|--------------|------------|
| Schema aplicado | Tabelas existem no Supabase | [ ] |
| Edge Function deploy | `supabase functions list` mostra `telegram_webhook` | [ ] |
| Webhook registrado | `getWebhookInfo` retorna URL correta | [ ] |
| Bot responde /start | Mensagem de boas-vindas recebida | [ ] |
| Bot cadastra CNPJ | `/cadastrar` cria registro no Supabase | [ ] |
| Bot lista CNPJs | `/listar` mostra CNPJs cadastrados | [ ] |
| Workflow roda manual | Execução n8n completa sem erros | [ ] |
| Log gravado | Registros em `compliance_checks_log` | [ ] |
| Alerta Telegram | Muda status no Supabase → roda workflow → recebe alerta | [ ] |
| Idempotência | Roda 2x sem mudança → não alerta duplicado | [ ] |
| Error Trigger | Quebra credencial Supabase → recebe alerta de erro | [ ] |

---

## 8️⃣ Observabilidade & Produção

### 8.1 Uptime Monitor (UptimeRobot)
- URL: `https://n8n.seudominio.com/healthz` (ou IP:5678/healthz)
- Intervalo: 5 min
- Alertas: Telegram/Email

### 8.2 Logs Importantes
```bash
# n8n Executions UI: ver todas as runs
# Supabase Dashboard → Edge Functions → Logs (telegram_webhook)
# Supabase Dashboard → Database → Logs (queries lentas, erros)
```

### 8.3 Métricas Chave para Acompanhar
- Taxa de sucesso BrasilAPI (200 vs 404 vs 5xx)
- Latência média BrasilAPI
- Alertas enviados por dia
- Workflow execution time

---

## 🔧 Troubleshooting Comum

| Problema | Causa Provável | Solução |
|----------|----------------|---------|
| Webhook não recebe updates | URL errada / certificado | `getWebhookInfo` → `deleteWebhook` → `setWebhook` novamente |
| n8n "ECONNREFUSED" Supabase | IP bloqueado / credencial errada | Verifique `SUPABASE_SERVICE_ROLE_KEY` no n8n |
| Telegram "400 Bad Request" | chat_id inválido / bot token errado | Teste `curl https://api.telegram.org/bot<TOKEN>/getMe` |
| BrasilAPI 429 | Rate limit | Aumente delay no code node / diminua batchSize |
| Edge Function timeout | BrasilAPI lenta | Aumente timeout no fetch (máx 60s) |

---

## 📞 Suporte & Próximos Passos

Após validação completa:
1. **Monitorar** primeira semana de execuções automáticas (8h)
2. **Ajustar** horário se BrasilAPI instável de madrugada
3. **Escalar** batchSize quando >50 CNPJs
4. **Adicionar** dashboard (Grafana/Metabase no Supabase) se needed

---

**Arquivos deste deploy:**
- `schema_final.sql` — Database schema completo
- `supabase/functions/telegram_webhook/index.ts` — Edge Function
- `seed_test.sql` — Dados de teste (edite chat_id)
- `n8n_workflow_compliance_cnpj_v2.json` — Workflow n8n (próximo chat)
- `deploy_checklist.md` — Este arquivo