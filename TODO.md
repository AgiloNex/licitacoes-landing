# TODO / Pendências — Monitor de Compliance CNPJ

> **Legenda**: ✅ Feito | 🔄 Em andamento | ⏳ Pendente (priorizado) | 💡 Ideia futura

---

## ✅ CONCLUÍDO (Fase 1 - Core)

### Database & Schema
- [x] Schema final `schema_final.sql` com:
  - `compliance_clientes` (com `telegram_chat_id`, RLS, triggers)
  - `compliance_checks_log` (auditoria completa)
  - Índices otimizados
  - View `v_compliance_ultima_checagem`
  - RLS policies (service_role + preparação multi-tenant)

### Edge Functions (Supabase)
- [x] `telegram_webhook` — Deno/TypeScript:
  - `/start` — Boas-vindas + help
  - `/cadastrar <CNPJ> <NOME>` — Validação 14 dígitos + upsert
  - `/listar` — Lista CNPJs do chat com status
  - `/remover <CNPJ>` — Remove só do próprio chat
  - `/status <CNPJ>` — Consulta direta BrasilAPI
  - Tratamento de erros + CORS

### n8n Workflow v2
- [x] `n8n_workflow_compliance_cnpj_v2.json`:
  - Schedule 8h diário
  - Busca clientes ativos (Supabase)
  - Loop 1-por-1 (batchSize=1)
  - Consulta BrasilAPI (neverError + timeout 10s)
  - Code node: validação CNPJ + comparação + latência
  - IF: Pular inválido → IF: Não encontrado (404) → IF: Status mudou
  - **Alerta Telegram** (HTML formatado)
  - Atualiza cliente (com/sem mudança)
  - Log completo em `compliance_checks_log`
  - Error Trigger → Alerta Telegram para admin
  - WhatsApp node **desabilitado** (não interfere)

### Deploy & Config
- [x] `deploy_checklist.md` — Passo a passo completo
- [x] `seed_test.sql` — 3 CNPJs reais para teste

---

## 🔄 EM ANDAMENTO / PRÓXIMOS PASSOS IMEDIATOS

### Validação End-to-End (Você executa)
- [ ] Aplicar `schema_final.sql` no Supabase
- [ ] Deploy `telegram_webhook` + secret `TELEGRAM_BOT_TOKEN`
- [ ] Registrar webhook no Telegram
- [ ] Testar bot: `/start` → `/cadastrar` → `/listar` → `/status`
- [ ] Executar `seed_test.sql` (substituir chat_id)
- [ ] Importar workflow v2 no n8n
- [ ] Configurar credenciais n8n (`supabaseApi`, `telegramApi`)
- [ ] **Substituir `SEU_CHAT_ID_AQUI` no node Error Trigger**
- [ ] Executar workflow manual → validar logs + alerta
- [ ] Ativar workflow (toggle Active)

---

## ⏳ PENDENTE - PRIORIDADE ALTA (Fase 2 - Observabilidade)

### Dashboard Views
- [x] `schema_dashboard_views.sql` criado (8 views):
  - `v_dashboard_resumo` — KPIs gerais
  - `v_dashboard_clientes_status` — Tabela monitoramento
  - `v_dashboard_mudancas_recentes` — Timeline mudanças
  - `v_dashboard_erros_brasilapi` — Investigação erros
  - `v_dashboard_brasilapi_performance` — Latência/hora
  - `v_dashboard_alertas` — Taxa sucesso alertas
  - `v_dashboard_por_chat` — Multi-tenant prep
  - `v_dashboard_sla_checagens` — SLA execução
- [ ] **Aplicar views no Supabase** (SQL Editor)
- [ ] Testar views no Supabase Dashboard / Postman

### Testes Automatizados
- [x] `k6_load_test.js` — Load test BrasilAPI + n8n + Telegram
- [x] `postman_collection.json` — Collection completa
- [ ] **Rodar k6 smoke test**: `k6 run k6_load_test.js -e N8N_WEBHOOK_URL=... -e TELEGRAM_WEBHOOK_URL=... -e TEST_CHAT_ID=...`
- [ ] **Importar Postman collection** + configurar variáveis
- [ ] Executar collection completa (Health → BrasilAPI → Supabase → Telegram → n8n → Dashboard)

---

## ⏳ PENDENTE - PRIORIDADE MÉDIA (Otimização & Escala)

### Volume Optimization
- [x] `volume_optimization_config.json` — Configs progressivos (low/medium/high/enterprise)
- [ ] **Implementar Rate Limiter** no n8n (Function node com Redis) quando >50 CNPJs
- [ ] **Implementar Retry com Backoff** no Code node quando >50 CNPJs
- [ ] **Migrar para Queue Mode** (Redis) quando >200 CNPJs
- [ ] Separar workflow em Scheduler + Processor + Callback (high volume)

### Migrações Futuras
- [x] `migrations_template.sql` — 7 migrações versionadas:
  - 001: Auditoria estendida
  - 002: Multi-tenant/Organizações
  - 003: Webhooks de saída (callbacks)
  - 004: Regras de alerta personalizadas
  - 005: Múltiplos providers API
  - 006: Materialized Views (performance)
  - 007: Soft Delete + Auditoria LGPD
- [ ] Aplicar migrações conforme necessidade

---

## 💡 IDEIAS FUTURAS (Backlog - Não Priorizado)

### Features de Negócio
- [ ] **API de Cadastro** — REST endpoint próprio (Supabase Edge Function) para CRUD clientes
- [ ] **Dashboard Web** — React/Vue + Supabase Realtime (substituir Metabase/Grafana)
- [ ] **Múltiplos Canais** — Email, WhatsApp (Evolution), Slack, Discord, Webhook
- [ ] **Regras de Alerta** — Só alertar para status críticos (SUSPENSA, BAIXADA, INAPTA)
- [ ] **Horário Comercial** — Não alertar fora de horário (configurável por cliente)
- [ ] **Re-check Manual** — Botão "Checar agora" no bot/ dashboard
- [ ] **Histórico Completo** — UI para ver todas checagens de um CNPJ
- [ ] **Exportação** — CSV/PDF de relatórios de compliance

### Integrações
- [ ] **ReceitaWS** — Fallback/validação cruzada
- [ ] **Sintegra** — Consulta estadual
- [ ] **CNPJ.ws** — Outra fonte gratuita
- [ ] **Webhooks de Saída** — Cliente recebe POST em seu sistema
- [ ] **Zapier/Make** — Templates prontos

### Plataforma
- [ ] **Multi-tenant Real** — Organizações, convites, roles (admin/member/viewer)
- [ ] **Planos/Billing** — Stripe integration (Free/Pro/Enterprise)
- [ ] **API Keys** — Para clientes integrarem seus sistemas
- [ ] **Audit Log Completo** — LGPD/GDPR compliance
- [ ] **White-label** — Domínio customizado, branding

### Infraestrutura
- [ ] **n8n Queue Mode** — Redis + Workers auto-scale
- [ ] **Circuit Breaker** — Para BrasilAPI (evita cascade failure)
- [ ] **Cache CNPJs** — Redis TTL 1h (evita consultas duplicadas)
- [ ] **Prioridade** — Clientes VIP checados primeiro
- [ ] **Métricas Prometheus** — Exportador customizado
- [ ] **Alertas Avançados** — PagerDuty, Opsgenie, Slack

---

## 📋 CHECKLIST DE ENTREGA (Definition of Done)

### Para considerar "Produção Ready"
- [ ] Schema aplicado + views criadas
- [ ] Edge Function deployada + webhook registrado
- [ ] Bot Telegram respondendo todos comandos
- [ ] Workflow n8n importado + credenciais + ativo
- [ ] Seed executado + 3 CNPJs monitorados
- [ ] Execução manual OK (logs + alerta se mudou)
- [ ] Execução automática 8h OK (monitorar 1 semana)
- [ ] k6 smoke test passing
- [ ] Postman collection passing
- [ ] UptimeRobot configurado (n8n healthz)
- [ ] Documentação de runbook (como troubleshooting)

---

## 🎯 PRÓXIMAS AÇÕES SUGERIDAS

| Ordem | Ação | Responsável | Estimativa |
|-------|------|-------------|------------|
| 1 | Aplicar schema + views no Supabase | Você | 10 min |
| 2 | Deploy Edge Function + secrets | Você | 5 min |
| 3 | Registrar webhook Telegram | Você | 2 min |
| 4 | Testar bot completo | Você | 10 min |
| 5 | Seed + n8n import + credenciais | Você | 15 min |
| 6 | Substituir chat_id no Error Trigger | Você | 1 min |
| 7 | Execução manual + validação | Você | 10 min |
| 8 | Ativar workflow | Você | 1 min |
| 9 | Rodar k6 + Postman | Você | 15 min |
| 10 | Configurar UptimeRobot | Você | 5 min |
| **Total** | **~1h15min** | | |

---

## 📝 NOTAS TÉCNICAS IMPORTANTES

### Segredos NÃO commitar
- `SUPABASE_SERVICE_ROLE_KEY` — Só no n8n + Edge Functions secrets
- `TELEGRAM_BOT_TOKEN` — Só no Edge Functions secrets + n8n credentials
- `supabase_url` — Público (anon key ok no frontend)

### Rate Limits Conhecidos
- **BrasilAPI**: ~30-60 req/min/IP (não oficial) — batchSize=1 seguro
- **Telegram**: 30 msg/s por bot — workflow sequencial OK
- **Supabase**: 500MB DB, 2GB bandwidth, 50K MAU free — folga

### Monitorar na Primeira Semana
1. Taxa de erro BrasilAPI (target < 5%)
2. Latência P95 BrasilAPI (target < 3s)
3. Alertas duplicados (deve ser 0)
4. Workflow duration (target < 10 min para 50 CNPJs)
5. Edge Function invocations (target < 500K/mês free)

---

**Última atualização**: 2026-09-16
**Versão**: 2.0 (Consolidado Supabase)
**Próxima revisão**: Após 1 semana em produção