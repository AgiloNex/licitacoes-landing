#!/usr/bin/env bash
# ============================================================
# Deploy Helper — Monitor de Compliance CNPJ
# Facilita deploy no Supabase (requer: supabase CLI logado e linkado)
# ============================================================

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
err() { echo -e "${RED}[ERRO]${NC} $*"; }

check_cli() {
    if ! command -v supabase &> /dev/null; then
        err "supabase CLI não encontrado. Instale: npm i -g supabase"
        exit 1
    fi
    log "supabase CLI: $(supabase --version)"
}

check_linked() {
    if ! supabase projects list 2>/dev/null | grep -q "Linked"; then
        warn "Projeto não linkado. Execute: supabase link --project-ref <SEU_REF>"
        return 1
    fi
    log "Projeto linkado OK"
}

deploy_schema() {
    log "Aplicando schema_final.sql..."
    if supabase db push --include-all 2>&1 | grep -q "error"; then
        err "Falha ao aplicar schema. Verifique no Supabase Dashboard → SQL Editor"
        return 1
    fi
    log "Schema aplicado"

    log "Aplicando schema_dashboard_views.sql..."
    # Views precisam ser aplicadas via SQL Editor ou psql
    warn "Views: aplique manualmente schema_dashboard_views.sql no SQL Editor do Supabase"
}

deploy_function() {
    log "Deployando Edge Function: telegram_webhook..."
    supabase functions deploy telegram_webhook
    log "Function deployada"
}

set_secrets() {
    if [[ -z "${TELEGRAM_BOT_TOKEN:-}" ]]; then
        warn "TELEGRAM_BOT_TOKEN não definido como env var"
        read -rp "Digite seu BOT_TOKEN: " TELEGRAM_BOT_TOKEN
    fi
    log "Configurando secret TELEGRAM_BOT_TOKEN..."
    supabase secrets set TELEGRAM_BOT_TOKEN="$TELEGRAM_BOT_TOKEN"
    log "Secret configurado"
}

register_webhook() {
    local ref=$(supabase projects list 2>/dev/null | grep "Linked" | awk '{print $2}')
    if [[ -z "$ref" ]]; then
        err "Não consegui detectar project ref"
        return 1
    fi
    local fn_url="https://${ref}.supabase.co/functions/v1/telegram_webhook"
    log "Registrando webhook no Telegram: $fn_url"
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
        -H "Content-Type: application/json" \
        -d "{\"url\":\"${fn_url}\",\"allowed_updates\":[\"message\"],\"drop_pending_updates\":true}" | jq .
}

test_bot() {
    log "Teste o bot no Telegram:"
    echo "  /start"
    echo "  /cadastrar 47960950000121 Magazine Luiza"
    echo "  /listar"
    echo "  /status 47960950000121"
}

main() {
    echo "=========================================="
    echo "  Deploy Helper - Compliance CNPJ"
    echo "=========================================="
    echo

    check_cli
    check_linked || exit 1

    echo
    log "Passo 1/5: Schema"
    deploy_schema

    echo
    log "Passo 2/5: Edge Function"
    deploy_function

    echo
    log "Passo 3/5: Secrets"
    set_secrets

    echo
    log "Passo 4/5: Webhook Telegram"
    register_webhook

    echo
    log "Passo 5/5: Seed + n8n (manual)"
    warn "Execute seed_test.sql no SQL Editor (substitua SEU_CHAT_ID_AQUI)"
    warn "Importe n8n_workflow_compliance_cnpj_v2.json no n8n"
    warn "Configure credenciais supabaseApi + telegramApi"
    warn "Substitua SEU_CHAT_ID_AQUI no node 'Alertar Erro no Workflow'"
    warn "Execute manual → Ative workflow"

    echo
    test_bot

    echo
    log "Deploy helper finalizado! ✅"
}

main "$@"