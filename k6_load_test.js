// ============================================================
// k6 Load Test — Compliance CNPJ Workflow
// Testa: BrasilAPI rate limit, n8n throughput, alertas Telegram
// ============================================================

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Métricas customizadas
const brasilApiErrors = new Rate('brasilapi_errors');
const brasilApiLatency = new Trend('brasilapi_latency');
const telegramAlertsSent = new Counter('telegram_alerts_sent');
const workflowRuns = new Counter('workflow_runs');

// Configuração do teste
export const options = {
  // Cenários progressivos
  scenarios: {
    // 1. Smoke test - validação básica
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      tags: { test_type: 'smoke' },
    },
    // 2. Carga média - simula 50 CNPJs sequenciais
    medium_load: {
      executor: 'per-vu-iterations',
      vus: 5,
      iterations: 10,
      startTime: '1m',
      tags: { test_type: 'medium' },
    },
    // 3. Pico - simula burst de 200 CNPJs
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 20 },
        { duration: '30s', target: 0 },
      ],
      startTime: '3m',
      tags: { test_type: 'spike' },
    },
    // 4. Soak - estabilidade por 10 min
    soak: {
      executor: 'constant-vus',
      vus: 3,
      duration: '10m',
      startTime: '5m',
      tags: { test_type: 'soak' },
    },
  },

  // Thresholds (critérios de passagem)
  thresholds: {
    http_req_duration: ['p(95)<5000', 'p(99)<10000'],
    http_req_failed: ['rate<0.05'],
    brasilapi_errors: ['rate<0.1'],
    brasilapi_latency: ['p(95)<3000'],
    checks: ['rate>0.95'],
  },

  // Configurações gerais
  noConnectionReuse: false,
  userAgent: 'k6-compliance-cnpj-load-test/1.0',
};

// Dados de teste - CNPJs reais para validar BrasilAPI
const TEST_CNPJS = [
  '47960950000121', // Magazine Luiza
  '33000167000101', // Petrobras
  '33592510000154', // Vale
  '60701190000104', // Itaú Unibanco
  '00000000000191', // Brasil Governo Federal
  '02916265000160', // Banco do Brasil
  '33657220000107', // Bradesco
  '60872504000123', // Santander
  '02332806000129', // Caixa
  '04252011000110', // BTG Pactual
];

// Configurações de ambiente (definir via -e ou .env)
const BASE_URL = __ENV.N8N_WEBHOOK_URL || 'https://n8n.seudominio.com/webhook/compliance-check';
const TELEGRAM_WEBHOOK = __ENV.TELEGRAM_WEBHOOK_URL || 'https://<ref>.supabase.co/functions/v1/telegram_webhook';
const BRASILAPI_BASE = 'https://brasilapi.com.br/api/cnpj/v1';

function getRandomCNPJ() {
  return TEST_CNPJS[Math.floor(Math.random() * TEST_CNPJS.length)];
}

function generateTestPayload(cnpj) {
  return {
    cnpj,
    cliente_id: `test-${cnpj}-${Date.now()}`,
    cliente_nome: `Empresa Teste ${cnpj.slice(0,4)}`,
    telegram_chat_id: __ENV.TEST_CHAT_ID || '123456789',
    status_anterior: 'ATIVA',
    force_check: true,
  };
}

export default function () {
  const cnpj = getRandomCNPJ();
  const payload = generateTestPayload(cnpj);

  // ============================================================
  // TESTE 1: Consulta Direta BrasilAPI (baseline)
  // ============================================================
  group('BrasilAPI - Consulta Direta', () => {
    const start = new Date();
    const resp = http.get(`${BRASILAPI_BASE}/${cnpj}`, {
      timeout: '10s',
      tags: { endpoint: 'brasilapi_direct' },
    });
    const latency = new Date() - start;

    brasilApiLatency.add(latency);

    const success = check(resp, {
      'status 200 ou 404': (r) => r.status === 200 || r.status === 404,
      'tem descricao_situacao ou 404': (r) => {
        if (r.status === 404) return true;
        try {
          const data = r.json();
          return data.descricao_situacao_cadastral !== undefined;
        } catch {
          return false;
        }
      },
      'latencia < 5s': () => latency < 5000,
    });

    if (!success) {
      brasilApiErrors.add(1);
    } else {
      brasilApiErrors.add(0);
    }

    // Pequeno delay para não estourar rate limit no teste
    sleep(Math.random() * 0.5 + 0.2);
  });

  // ============================================================
  // TESTE 2: Webhook n8n (simula execução do workflow)
  // ============================================================
  if (__ENV.N8N_WEBHOOK_URL) {
    group('n8n Webhook - Execução Workflow', () => {
      const resp = http.post(BASE_URL, JSON.stringify(payload), {
        headers: { 'Content-Type': 'application/json' },
        timeout: '30s',
        tags: { endpoint: 'n8n_webhook' },
      });

      check(resp, {
        'workflow aceito (200/202)': (r) => r.status === 200 || r.status === 202,
        'resposta tem executionId': (r) => {
          try {
            return r.json().executionId !== undefined;
          } catch {
            return false;
          }
        },
      });

      workflowRuns.add(1);
      sleep(1);
    });
  }

  // ============================================================
  // TESTE 3: Telegram Webhook (Edge Function)
  // ============================================================
  if (__ENV.TELEGRAM_WEBHOOK_URL) {
    group('Telegram Edge Function - Webhook', () => {
      const telegramPayload = {
        update_id: Date.now(),
        message: {
          message_id: Date.now(),
          from: { id: parseInt(__ENV.TEST_CHAT_ID || '123456789'), username: 'k6test' },
          chat: { id: parseInt(__ENV.TEST_CHAT_ID || '123456789'), type: 'private' },
          text: `/status ${cnpj}`,
          date: Math.floor(Date.now() / 1000),
        },
      };

      const resp = http.post(TELEGRAM_WEBHOOK, JSON.stringify(telegramPayload), {
        headers: { 'Content-Type': 'application/json' },
        timeout: '10s',
        tags: { endpoint: 'telegram_webhook' },
      });

      check(resp, {
        'webhook aceito (200)': (r) => r.status === 200,
        'resposta ok': (r) => {
          try {
            return r.json().ok === true;
          } catch {
            return false;
          }
        },
      });

      sleep(0.5);
    });
  }
}

// ============================================================
// Setup / Teardown
// ============================================================
export function setup() {
  console.log('🚀 Iniciando load test Compliance CNPJ');
  console.log(`📋 CNPJs de teste: ${TEST_CNPJS.length}`);
  console.log(`🎯 n8n Webhook: ${BASE_URL}`);
  console.log(`🤖 Telegram Webhook: ${TELEGRAM_WEBHOOK}`);
  console.log(`🌐 BrasilAPI: ${BRASILAPI_BASE}`);
  return { startTime: Date.now() };
}

export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log(`✅ Load test finalizado em ${duration.toFixed(1)}s`);
}