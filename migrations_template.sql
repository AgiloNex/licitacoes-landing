-- ============================================================
-- Scripts de Migração — Compliance CNPJ
-- Versioneados para controle de schema (aplicar em ordem)
-- ============================================================

-- ============================================================
-- MIGRATION 001: Adicionar colunas de auditoria estendida
-- ============================================================
-- Aplicar quando precisar rastrear mais detalhes da BrasilAPI
-- Versão alvo: v1.1.0

-- alter table public.compliance_clientes
-- add column if not exists ultima_resposta_brasilapi jsonb,
-- add column if not exists total_checagens integer default 0,
-- add column if not exists total_mudancas integer default 0,
-- add column if not exists total_alertas_enviados integer default 0;

-- create index if not exists idx_compliance_clientes_total_checagens
-- on public.compliance_clientes(total_checagens);

-- ============================================================
-- MIGRATION 002: Multi-tenant / Organizações
-- ============================================================
-- Aplicar quando precisar separar clientes por organização/equipe
-- Versão alvo: v2.0.0

-- create table if not exists public.organizacoes (
--   id uuid primary key default gen_random_uuid(),
--   nome text not null,
--   slug text not null unique,
--   plano text default 'free', -- free, pro, enterprise
--   limite_cnpjs integer default 50,
--   criado_em timestamptz default now()
-- );

-- alter table public.compliance_clientes
-- add column if not exists organizacao_id uuid references public.organizacoes(id) on delete set null;

-- create index if not exists idx_compliance_clientes_organizacao
-- on public.compliance_clientes(organizacao_id);

-- -- RLS para organizações
-- alter table public.organizacoes enable row level security;
-- create policy "Org members access" on public.organizacoes
--   for all using (id in (select organizacao_id from public.compliance_clientes where telegram_chat_id = (auth.jwt() ->> 'telegram_chat_id')));

-- ============================================================
-- MIGRATION 003: Webhooks de Saída (Callbacks)
-- ============================================================
-- Aplicar quando clientes quiserem receber webhook em seus sistemas
-- Versão alvo: v1.2.0

-- create table if not exists public.webhook_endpoints (
--   id uuid primary key default gen_random_uuid(),
--   cliente_id uuid not null references public.compliance_clientes(id) on delete cascade,
--   url text not null,
--   secret text not null, -- para assinatura HMAC
--   eventos text[] not null default '{status_mudou,erro_brasilapi,checagem_ok}',
--   ativo boolean default true,
--   tentativas_max integer default 3,
--   criado_em timestamptz default now()
-- );

-- create index if not exists idx_webhook_endpoints_cliente
-- on public.webhook_endpoints(cliente_id);

-- create table if not exists public.webhook_deliveries (
--   id uuid primary key default gen_random_uuid(),
--   endpoint_id uuid not null references public.webhook_endpoints(id) on delete cascade,
--   evento text not null,
--   payload jsonb not null,
--   resposta_status integer,
--   resposta_body text,
--   tentativas integer default 0,
--   sucesso boolean default false,
--   criado_em timestamptz default now(),
--   processado_em timestamptz
-- );

-- create index if not exists idx_webhook_deliveries_endpoint
-- on public.webhook_deliveries(endpoint_id);
-- create index if not exists idx_webhook_deliveries_pendentes
-- on public.webhook_deliveries(sucesso, tentativas) where not sucesso and tentativas < 3;

-- ============================================================
-- MIGRATION 004: Regras de Alerta Personalizadas
-- ============================================================
-- Aplicar quando quiser alertar só para certos status (ex: só SUSPENSA/BAIXADA)
-- Versão alvo: v1.3.0

-- create table if not exists public.alert_rules (
--   id uuid primary key default gen_random_uuid(),
--   cliente_id uuid not null references public.compliance_clientes(id) on delete cascade,
--   nome text not null,
--   status_gatilho text[] not null, -- ex: ['SUSPENSA', 'BAIXADA', 'INAPTA']
--   canais text[] not null default '{telegram}', -- futuro: email, webhook, whatsapp
--   horario_inicio time, -- ex: '08:00'
--   horario_fim time, -- ex: '20:00'
--   dias_semana integer[] default '{1,2,3,4,5}', -- 1=seg ... 7=dom
--   ativo boolean default true,
--   criado_em timestamptz default now()
-- );

-- create index if not exists idx_alert_rules_cliente
-- on public.alert_rules(cliente_id);

-- ============================================================
-- MIGRATION 005: Integração com Outras APIs (ReceitaWS, Sintegra, etc)
-- ============================================================
-- Aplicar quando quiser consultar múltiplas fontes
-- Versão alvo: v2.1.0

-- create table if not exists public.api_providers (
--   id uuid primary key default gen_random_uuid(),
--   nome text not null unique, -- 'brasilapi', 'receitaws', 'sintegra', 'cnpjws'
--   base_url text not null,
--   path_template text not null, -- '/api/cnpj/v1/{cnpj}'
--   headers jsonb default '{}',
--   rate_limit_rpm integer default 60,
--   ativo boolean default true,
--   prioridade integer default 1 -- 1 = primária, 2 = fallback
-- );

-- insert into public.api_providers (nome, base_url, path_template, rate_limit_rpm, prioridade)
-- values
--   ('brasilapi', 'https://brasilapi.com.br', '/api/cnpj/v1/{cnpj}', 60, 1),
--   ('receitaws', 'https://receitaws.com.br', '/v1/cnpj/{cnpj}', 30, 2)
-- on conflict (nome) do nothing;

-- alter table public.compliance_checks_log
-- add column if not exists api_provider text default 'brasilapi';

-- create index if not exists idx_compliance_log_provider
-- on public.compliance_checks_log(api_provider);

-- ============================================================
-- MIGRATION 006: Métricas Agregadas (Materialized Views para Dashboard Rápido)
-- ============================================================
-- Aplicar quando volume > 10k checagens/dia e queries lentas
-- Versão alvo: v1.5.0

-- create materialized view if not exists public.mv_dashboard_diario as
-- select
--   date_trunc('day', data_checagem) as dia,
--   count(*) as total_checagens,
--   count(distinct cliente_id) as clientes_verificados,
--   count(*) filter (where mudou) as mudancas,
--   count(*) filter (where alerta_enviado) as alertas_enviados,
--   count(*) filter (where not (raw_response ->> 'descricao_situacao_cadastral') is not null) as erros_api,
--   round(avg((raw_response ->> 'latency_ms')::numeric)::numeric, 2) as latencia_media_ms
-- from public.compliance_checks_log
-- group by 1
-- with no data;

-- create unique index if not exists idx_mv_dashboard_diario_dia
-- on public.mv_dashboard_diario(dia);

-- -- Refresh job (pg_cron ou cron externo)
-- -- select cron.schedule('refresh-mv-dashboard', '5 * * * *', 'refresh materialized view public.mv_dashboard_diario;');

-- ============================================================
-- MIGRATION 007: Soft Delete + Auditoria Completa
-- ============================================================
-- Aplicar para compliance LGPD/GDPR
-- Versão alvo: v2.0.0

-- alter table public.compliance_clientes
-- add column if not exists deletado_em timestamptz,
-- add column if not exists deletado_por text;

-- create table if not exists public.audit_log (
--   id uuid primary key default gen_random_uuid(),
--   tabela text not null,
--   registro_id uuid not null,
--   acao text not null, -- INSERT, UPDATE, DELETE
--   dados_anteriores jsonb,
--   dados_novos jsonb,
--   usuario text, -- service_role, telegram_bot, n8n, etc
--   ip inet,
--   criado_em timestamptz default now()
-- );

-- create index if not exists idx_audit_log_registro
-- on public.audit_log(tabela, registro_id);
-- create index if not exists idx_audit_log_criado
-- on public.audit_log(criado_em desc);

-- ============================================================
-- Como Aplicar Migrações
-- ============================================================
-- 1. No Supabase Dashboard → SQL Editor
-- 2. Cole o bloco da migração desejada (descomente)
-- 3. Execute
-- 4. Verifique: \d+ public.compliance_clientes
--
-- Para versionamento automático no futuro:
-- supabase migration new <nome>
-- supabase db push