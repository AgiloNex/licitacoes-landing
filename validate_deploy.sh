#!/usr/bin/env bash
# ============================================================
# Validation Script — Pós-deploy
# Verifica se todos os componentes estão funcionando
# ============================================================

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[OK]${NC} $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
err() { echo -e "${RED}[FAIL]${NC} $*"; }

# Config - PREENCHA ANTES DE RODAR
SUPABASE_URL="${SUPABASE_URL:-https://<SEU_REF>.supabase.co}"
SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-}"
BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
CHAT_ID="${TELEGRAM_CHAT_ID:-}"
N8N_URL="${N8N_WEBHOOK_URL:-}"

check_supabase() {
    echo "=== Supabase ==="
    # Health
    if curl -sf -H "apikey: $SERVICE_KEY" "$SUPABASE_URL/rest/v1/" >/dev/null; then
        log "REST API acessível"
    else
        err "REST API inacessível"
        return 1
    fi

    # Tabelas
    for table in compliance_clientes compliance_checks_log; do
        count=$(curl -sf -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" \
            "$SUPABASE_URL/rest/v1/$table?select=count" | jq -r '.[0].count // 0')
        log "Tabela $table: $count registros"
    done

    # Views
    for view in v_dashboard_resumo v_dashboard_clientes_status; do
        if curl -sf -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" \
            "$SUPABASE_URL/rest/v1/$view?limit=1" >/dev/null; then
            log "View $view acessível"
        else
            warn "View $view não encontrada (aplique schema_dashboard_views.sql)"
        fi
    done
}

check_edge_function() {
    echo
    echo "=== Edge Function ==="
    local fn_url="$SUPABASE_URL/functions/v1/telegram_webhook"
    resp=$(curl -sf -X POST "$fn_url" \
        -H "Content-Type: application/json" \
        -d '{"update_id":999,"message":{"message_id":1,"from":{"id":123},"chat":{"id":123,"type":"private"},"text":"/start","date":0}}' || echo "ERROR")
    
    if echo "$resp" | jq -e '.ok == true' >/dev/null 2>&1; then
        log "Function responde OK (/start)"
    else
        err "Function falhou: $resp"
        return 1
    fi
}

check_telegram_webhook() {
    echo
    echo "=== Telegram Webhook ==="
    if [[ -z "$BOT_TOKEN" ]]; then
        warn "BOT_TOKEN não definido, pulando"
        return 0
    fi
    info=$(curl -sf "https://api.telegram.org/bot$BOT_TOKEN/getWebhookInfo" | jq '.result')
    url=$(echo "$info" | jq -r '.url')
    pending=$(echo "$info" | jq -r '.pending_update_count')
    
    if [[ "$url" == *"telegram_webhook"* ]]; then
        log "Webhook registrado: $url (pendentes: $pending)"
    else
        err "Webhook NÃO registrado ou URL incorreta: $url"
        return 1
    fi
}

check_n8n() {
    echo
    echo "=== n8n ==="
    if [[ -z "$N8N_URL" ]]; then
        warn "N8N_WEBHOOK_URL não definido, pulando"
        return 0
    fi
    
    # Health
    if curl -sf "${N8N_URL%/webhook*}/healthz" >/dev/null; then
        log "n8n healthz OK"
    else
        warn "n8n healthz inacessível"
    fi
    
    # Test webhook
    if [[ -n "$CHAT_ID" && -n "$SERVICE_KEY" ]]; then
        resp=$(curl -sf -X POST "$N8N_URL" \
            -H "Content-Type: application/json" \
            -d "{\"cnpj\":\"47960950000121\",\"cliente_id\":\"test-validate\",\"cliente_nome\":\"Teste Validação\",\"telegram_chat_id\":\"$CHAT_ID\",\"status_anterior\":\"ATIVA\",\"force_check\":true}" || echo "ERROR")
        
        if echo "$resp" | jq -e '.executionId' >/dev/null 2>&1; then
            log "Workflow webhook aceito (executionId: $(echo "$resp" | jq -r '.executionId'))"
        else
            warn "Workflow webhook resposta inesperada: $resp"
        fi
    fi
}

check_bot_commands() {
    echo
    echo "=== Bot Telegram (manual) ==="
    warn "Teste manualmente no Telegram:"
    echo "  /start        → deve responder boas-vindas"
    echo "  /listar       → deve listar CNPJs do seed"
    echo "  /status 47960950000121 → deve consultar BrasilAPI"
}

main() {
    echo "=========================================="
    echo "  Validação Pós-Deploy"
    echo "=========================================="
    echo
    
    if [[ -z "$SERVICE_KEY" ]]; then
        err "Defina SUPABASE_SERVICE_ROLE_KEY como variável de ambiente"
        exit 1
    fi

    local failed=0
    check_supabase || failed=1
    check_edge_function || failed=1
    check_telegram_webhook || failed=1
    check_n8n || failed=1
    check_bot_commands

    echo
    echo "=========================================="
    if [[ $failed -eq 0 ]]; then
        log "Todas as validações automáticas passaram! ✅"
    else
        err "Algumas validações falharam. Revise os erros acima."
        exit 1
    fi
}

main "$@"