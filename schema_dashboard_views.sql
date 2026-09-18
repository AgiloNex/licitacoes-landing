-- ============================================================
-- Views para Dashboard/Observabilidade — Compliance CNPJ
-- Compatível com: Metabase, Grafana (PostgreSQL), Supabase Dashboard
-- ============================================================

-- 1. Resumo Geral (KPIs principais)
create or replace view public.v_dashboard_resumo as
select
  (select count(*) from public.compliance_clientes where ativo) as clientes_ativos,
  (select count(*) from public.compliance_clientes where not ativo) as clientes_pausados,
  (select count(*) from public.compliance_clientes) as total_clientes,
  (select count(*) from public.compliance_checks_log where data_checagem >= now() - interval '24 hours') as checagens_24h,
  (select count(*) from public.compliance_checks_log where data_checagem >= now() - interval '24 hours' and mudou) as mudancas_24h,
  (select count(*) from public.compliance_checks_log where data_checagem >= now() - interval '24 hours' and alerta_enviado) as alertas_enviados_24h,
  (select count(*) from public.compliance_checks_log where data_checagem >= now() - interval '24 hours' and not ultima_checagem_ok) as erros_brasilapi_24h,
  (select round(avg(EXTRACT(EPOCH FROM (data_checagem - lag(data_checagem) over (partition by cliente_id order by data_checagem))))::numeric, 2)
   from public.compliance_checks_log
   where data_checagem >= now() - interval '24 hours') as intervalo_medio_checagens_seg;

comment on view public.v_dashboard_resumo is 'KPIs gerais para dashboard principal';

-- 2. Status por Cliente (últimas 24h)
create or replace view public.v_dashboard_clientes_status as
select
  c.id,
  c.nome,
  c.cnpj,
  c.telegram_chat_id,
  c.status_atual,
  c.ativo,
  c.ultima_checagem,
  c.ultima_checagem_ok,
  l.data_checagem as ultima_log_data,
  l.status_novo as ultimo_status_log,
  l.mudou as ultima_mudanca,
  l.alerta_enviado as ultimo_alerta,
  l.raw_response ->> 'descricao_situacao_cadastral' as brasilapi_status_raw,
  case
    when c.ultima_checagem is null then 'NUNCA_CHECADO'
    when c.ultima_checagem < now() - interval '25 hours' then 'ATRASADO'
    when not c.ultima_checagem_ok then 'ERRO_API'
    when l.mudou and l.alerta_enviado then 'ALERTADO'
    when l.mudou and not l.alerta_enviado then 'PENDENTE_ALERTA'
    else 'OK'
  end as health_status
from public.compliance_clientes c
left join lateral (
  select * from public.compliance_checks_log
  where cliente_id = c.id
  order by data_checagem desc
  limit 1
) l on true
where c.ativo
order by
  case
    when c.ultima_checagem is null then 0
    when c.ultima_checagem < now() - interval '25 hours' then 1
    when not c.ultima_checagem_ok then 2
    when l.mudou and not l.alerta_enviado then 3
    else 4
  end,
  c.nome;

comment on view public.v_dashboard_clientes_status is 'Status detalhado por cliente para tabela de monitoramento';

-- 3. Timeline de Mudanças (últimas 50)
create or replace view public.v_dashboard_mudancas_recentes as
select
  l.id,
  l.cliente_id,
  c.nome as cliente_nome,
  c.cnpj,
  c.telegram_chat_id,
  l.status_anterior,
  l.status_novo,
  l.mudou,
  l.alerta_enviado,
  l.data_checagem,
  l.raw_response
from public.compliance_checks_log l
join public.compliance_clientes c on c.id = l.cliente_id
where l.mudou = true
order by l.data_checagem desc
limit 50;

comment on view public.v_dashboard_mudancas_recentes is 'Histórico de mudanças de status com alerta';

-- 4. Erros da BrasilAPI (últimas 24h)
create or replace view public.v_dashboard_erros_brasilapi as
select
  l.id,
  l.cliente_id,
  c.nome as cliente_nome,
  c.cnpj,
  l.status_anterior,
  l.status_novo,
  l.raw_response,
  l.data_checagem,
  (l.raw_response ->> 'message') as erro_msg,
  (l.raw_response ->> 'statusCode') as status_code
from public.compliance_checks_log l
join public.compliance_clientes c on c.id = l.cliente_id
where l.data_checagem >= now() - interval '24 hours'
  and (not (l.raw_response ->> 'descricao_situacao_cadastral') is not null
       or (l.raw_response ->> 'statusCode')::int >= 400)
order by l.data_checagem desc;

comment on view public.v_dashboard_erros_brasilapi is 'Erros e 404 da BrasilAPI para investigação';

-- 5. Performance da BrasilAPI (latência por hora)
create or replace view public.v_dashboard_brasilapi_performance as
select
  date_trunc('hour', l.data_checagem) as hora,
  count(*) as total_checagens,
  count(*) filter (where (l.raw_response ->> 'descricao_situacao_cadastral') is not null) as sucessos,
  count(*) filter (where (l.raw_response ->> 'descricao_situacao_cadastral') is null) as falhas,
  round(avg((l.raw_response ->> 'latency_ms')::numeric)::numeric, 2) as latencia_media_ms,
  round(percentile_cont(0.95) within group (order by (l.raw_response ->> 'latency_ms')::numeric)::numeric, 2) as p95_latencia_ms,
  max((l.raw_response ->> 'latency_ms')::numeric) as max_latencia_ms
from public.compliance_checks_log l
where l.data_checagem >= now() - interval '7 days'
  and l.raw_response ? 'latency_ms'
group by 1
order by 1 desc;

comment on view public.v_dashboard_brasilapi_performance is 'Latência e taxa de sucesso da BrasilAPI por hora';

-- 6. Alertas Enviados vs Falhas de Envio
create or replace view public.v_dashboard_alertas as
select
  date_trunc('day', l.data_checagem) as dia,
  count(*) filter (where l.mudou) as total_mudancas,
  count(*) filter (where l.mudou and l.alerta_enviado) as alertas_enviados,
  count(*) filter (where l.mudou and not l.alerta_enviado) as alertas_falhados,
  round(
    100.0 * count(*) filter (where l.mudou and l.alerta_enviado) /
    nullif(count(*) filter (where l.mudou), 0),
    2
  ) as taxa_sucesso_alerta_pct
from public.compliance_checks_log l
where l.data_checagem >= now() - interval '30 days'
group by 1
order by 1 desc;

comment on view public.v_dashboard_alertas is 'Taxa de sucesso de envio de alertas Telegram por dia';

-- 7. Clientes por Chat ID (para multi-tenant futuro)
create or replace view public.v_dashboard_por_chat as
select
  telegram_chat_id,
  count(*) as total_clientes,
  count(*) filter (where ativo) as ativos,
  count(*) filter (where not ativo) as pausados,
  max(ultima_checagem) as ultima_checagem_geral,
  min(ultima_checagem) as primeira_checagem_geral
from public.compliance_clientes
group by telegram_chat_id
order by total_clientes desc;

comment on view public.v_dashboard_por_chat is 'Agrupamento por chat_id (futuro multi-tenant)';

-- 8. SLA: Checagens no Prazo (última execução vs agendamento)
create or replace view public.v_dashboard_sla_checagens as
select
  c.id,
  c.nome,
  c.cnpj,
  c.ultima_checagem,
  case
    when c.ultima_checagem is null then 'NUNCA'
    when c.ultima_checagem >= (now() - interval '25 hours') then 'NO_PRAZO'
    when c.ultima_checagem >= (now() - interval '49 hours') then 'ATRASO_1_DIA'
    else 'ATRASO_CRITICO'
  end as sla_status,
  extract(epoch from (now() - c.ultima_checagem))/3600 as horas_desde_ultima_checagem
from public.compliance_clientes c
where c.ativo
order by sla_status, horas_desde_ultima_checagem desc;

comment on view public.v_dashboard_sla_checagens is 'SLA de execução: verifica se workflow rodou nas últimas 25h';