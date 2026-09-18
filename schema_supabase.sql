-- ============================================================
-- Monitor de Compliance CNPJ — Schema Supabase
-- AgiloNex — add-on de alerta via WhatsApp
-- ============================================================

-- Tabela principal: clientes monitorados
create table if not exists compliance_clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cnpj text not null unique,               -- somente dígitos, 14 caracteres
  whatsapp_number text not null,            -- formato E.164, ex: 5531999999999
  status_atual text,                        -- último valor de descricao_situacao_cadastral conhecido
  ativo boolean default true,               -- permite pausar monitoramento sem deletar
  ultima_checagem timestamptz,
  ultima_checagem_ok boolean default true,  -- false se a última consulta deu erro/404
  criado_em timestamptz default now()
);

-- Índice pra busca rápida por CNPJ no loop do workflow
create index if not exists idx_compliance_clientes_cnpj on compliance_clientes(cnpj);
create index if not exists idx_compliance_clientes_ativo on compliance_clientes(ativo);

-- Log histórico de cada checagem (auditoria + evita re-alertar a mesma mudança)
create table if not exists compliance_checks_log (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references compliance_clientes(id) on delete cascade,
  status_anterior text,
  status_novo text,
  mudou boolean not null,
  alerta_enviado boolean default false,
  raw_response jsonb,                       -- guarda a resposta bruta da BrasilAPI (auditoria/debug)
  data_checagem timestamptz default now()
);

create index if not exists idx_compliance_log_cliente on compliance_checks_log(cliente_id);
create index if not exists idx_compliance_log_data on compliance_checks_log(data_checagem);

-- Comentários pra lembrar as regras do workflow
comment on column compliance_clientes.status_atual is
  'Valor de descricao_situacao_cadastral retornado pela BrasilAPI (ex: ATIVA, SUSPENSA, INAPTA, BAIXADA)';
comment on column compliance_clientes.ultima_checagem_ok is
  'false quando a BrasilAPI retornou 404/erro na última tentativa — não indica necessariamente irregularidade, pode ser instabilidade da fonte. Checar manualmente antes de alertar o cliente.';
