-- ============================================================
-- Monitor de Compliance CNPJ — Schema Supabase (Final)
-- AgiloNex — add-on de alerta via Telegram
-- ============================================================

-- Extensões necessárias
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- Tabela principal: clientes monitorados
-- ============================================================
create table if not exists public.compliance_clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cnpj text not null unique,                    -- somente dígitos, 14 caracteres
  telegram_chat_id text not null,               -- chat_id do Telegram (string p/ suportar grupos negativos)
  whatsapp_number text,                         -- mantido p/ compatibilidade/futuro (formato E.164)
  status_atual text,                            -- último valor de descricao_situacao_cadastral conhecido
  ativo boolean default true,                   -- permite pausar monitoramento sem deletar
  ultima_checagem timestamptz,
  ultima_checagem_ok boolean default true,      -- false quando BrasilAPI retornou 404/erro
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

-- Índices para performance no loop do workflow
create index if not exists idx_compliance_clientes_cnpj on public.compliance_clientes(cnpj);
create index if not exists idx_compliance_clientes_ativo on public.compliance_clientes(ativo);
create index if not exists idx_compliance_clientes_telegram on public.compliance_clientes(telegram_chat_id);

-- Trigger para atualizar_atualizado_em
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end $$;

drop trigger if exists trigger_compliance_clientes_updated_at on public.compliance_clientes;
create trigger trigger_compliance_clientes_updated_at
before update on public.compliance_clientes
for each row execute function public.handle_updated_at();

-- Comentários para documentação
comment on table public.compliance_clientes is 'Clientes monitorados para compliance de CNPJ via BrasilAPI';
comment on column public.compliance_clientes.cnpj is 'CNPJ somente dígitos (14 chars). Único.';
comment on column public.compliance_clientes.telegram_chat_id is 'Chat ID do Telegram (pode ser negativo para grupos). Usado para alertas e comandos.';
comment on column public.compliance_clientes.status_atual is 'Valor de descricao_situacao_cadastral retornado pela BrasilAPI (ex: ATIVA, SUSPENSA, INAPTA, BAIXADA, NULA)';
comment on column public.compliance_clientes.ultima_checagem_ok is 'false quando a BrasilAPI retornou 404/erro na última tentativa — não indica necessariamente irregularidade, pode ser instabilidade da fonte. Checar manualmente antes de alertar o cliente.';

-- ============================================================
-- Log histórico de cada checagem (auditoria + evita re-alertar a mesma mudança)
-- ============================================================
create table if not exists public.compliance_checks_log (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.compliance_clientes(id) on delete cascade,
  status_anterior text,
  status_novo text,
  mudou boolean not null,
  alerta_enviado boolean default false,
  raw_response jsonb,                           -- guarda a resposta bruta da BrasilAPI (auditoria/debug)
  data_checagem timestamptz default now()
);

create index if not exists idx_compliance_log_cliente on public.compliance_checks_log(cliente_id);
create index if not exists idx_compliance_log_data on public.compliance_checks_log(data_checagem desc);
create index if not exists idx_compliance_log_mudou on public.compliance_checks_log(mudou) where mudou = true;

comment on table public.compliance_checks_log is 'Log de auditoria de cada checagem de CNPJ na BrasilAPI';
comment on column public.compliance_checks_log.mudou is 'True quando status_anterior != status_novo (e status_anterior não é nulo)';
comment on column public.compliance_checks_log.alerta_enviado is 'True quando alerta Telegram foi enviado com sucesso para esta mudança';

-- ============================================================
-- Row Level Security (RLS) — Preparado para multi-tenant futuro
-- ============================================================
alter table public.compliance_clientes enable row level security;
alter table public.compliance_checks_log enable row level security;

-- Policy: Service role tem acesso total (usado pelo n8n e Edge Functions)
create policy "Service role full access clientes" on public.compliance_clientes
  for all using (auth.role() = 'service_role');

create policy "Service role full access logs" on public.compliance_checks_log
  for all using (auth.role() = 'service_role');

-- Policy futura: usuário autenticado vê só seus clientes (via telegram_chat_id = auth.jwt() ->> 'telegram_chat_id')
-- create policy "User sees own clients" on public.compliance_clientes
--   for select using (telegram_chat_id = (auth.jwt() ->> 'telegram_chat_id'));

-- ============================================================
-- View para dashboard simples: última checagem por cliente
-- ============================================================
create or replace view public.v_compliance_ultima_checagem as
select
  c.id,
  c.nome,
  c.cnpj,
  c.telegram_chat_id,
  c.status_atual,
  c.ativo,
  c.ultima_checagem,
  c.ultima_checagem_ok,
  l.status_novo as ultimo_status_log,
  l.mudou as ultima_mudanca,
  l.alerta_enviado as ultimo_alerta,
  l.data_checagem as ultima_data_log
from public.compliance_clientes c
left join lateral (
  select * from public.compliance_checks_log
  where cliente_id = c.id
  order by data_checagem desc
  limit 1
) l on true;

comment on view public.v_compliance_ultima_checagem is 'View consolidada para dashboard: último status e log por cliente';