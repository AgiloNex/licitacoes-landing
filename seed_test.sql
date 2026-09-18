-- ============================================================
-- Seed de Teste — Monitor de Compliance CNPJ
-- Execute APÓS aplicar schema_final.sql
-- SUBSTITUA 'SEU_CHAT_ID_AQUI' pelo seu chat_id real (obtido em @userinfobot)
-- ============================================================

-- CNPJs de exemplo (empresas conhecidas, status público)
-- Magazine Luiza: 47.960.950/0001-21
-- Petrobras:      33.000.167/0001-01
-- Vale:           33.592.510/0001-54

-- Inserir clientes de teste
-- ⚠️ SUBSTITUA 'SEU_CHAT_ID_AQUI' ANTES DE EXECUTAR
insert into public.compliance_clientes (nome, cnpj, telegram_chat_id, ativo)
values
  ('Magazine Luiza S.A.', '47960950000121', 'SEU_CHAT_ID_AQUI', true),
  ('Petróleo Brasileiro S.A. - Petrobras', '33000167000101', 'SEU_CHAT_ID_AQUI', true),
  ('Vale S.A.', '33592510000154', 'SEU_CHAT_ID_AQUI', true)
on conflict (cnpj) do update set
  nome = excluded.nome,
  telegram_chat_id = excluded.telegram_chat_id,
  ativo = excluded.ativo,
  atualizado_em = now();

-- Verificar inserção
select
  id,
  nome,
  cnpj,
  telegram_chat_id,
  ativo,
  status_atual,
  ultima_checagem,
  ultima_checagem_ok,
  criado_em
from public.compliance_clientes
where telegram_chat_id = 'SEU_CHAT_ID_AQUI'
order by criado_em;

-- ============================================================
-- Como executar:
-- 1. No Supabase Dashboard → SQL Editor
-- 2. Cole este conteúdo
-- 3. Substitua 'SEU_CHAT_ID_AQUI' pelo seu ID real (3 ocorrências)
-- 4. Clique em "Run"
-- ============================================================