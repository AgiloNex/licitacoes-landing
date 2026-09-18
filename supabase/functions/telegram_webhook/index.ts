import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: { id: number; username?: string; first_name?: string };
    chat: { id: number; type: string; title?: string };
    text: string;
    date: number;
  };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN")!;

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  let update: TelegramUpdate;
  try {
    update = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const message = update.message;
  if (!message?.text) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const chatId = message.chat.id.toString();
  const text = message.text.trim();
  const userName = message.from?.username || message.from?.first_name || "Usuário";

  async function sendTelegram(chatId: string, text: string) {
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      });
    } catch (err) {
      console.error("Failed to send Telegram message:", err);
    }
  }

  function formatCNPJ(cnpj: string): string {
    const clean = cnpj.replace(/\D/g, "");
    if (clean.length !== 14) return cnpj;
    return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}/${clean.slice(8, 12)}-${clean.slice(12)}`;
  }

  // /start - Boas-vindas
  if (text === "/start") {
    await sendTelegram(
      chatId,
      `🤖 <b>Bot Compliance CNPJ — AgiloNex</b>\n\n` +
        `Olá, ${userName}! Eu monitoro a situação cadastral de CNPJs via BrasilAPI e te aviso se houver mudança.\n\n` +
        `<b>Comandos disponíveis:</b>\n` +
        `• <code>/cadastrar <CNPJ> <NOME></code> — Adiciona CNPJ ao monitoramento\n` +
        `  Ex: <code>/cadastrar 47960950000121 Magazine Luiza</code>\n` +
        `• <code>/listar</code> — Lista seus CNPJs monitorados\n` +
        `• <code>/remover <CNPJ></code> — Remove CNPJ do monitoramento\n` +
        `• <code>/status <CNPJ></code> — Consulta status atual na BrasilAPI\n\n` +
        `⚙️ O monitoramento roda automaticamente todo dia às 8h.\n` +
        `🔔 Você recebe alerta apenas quando o status <b>mudar</b>.`
    );
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // /cadastrar <CNPJ> <NOME>
  if (text.startsWith("/cadastrar ")) {
    const parts = text.split(" ");
    if (parts.length < 3) {
      await sendTelegram(
        chatId,
        `❌ Formato inválido. Use:\n<code>/cadastrar 47960950000121 Magazine Luiza</code>`
      );
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cnpj = parts[1].replace(/\D/g, "");
    const nome = parts.slice(2).join(" ");

    if (!/^\d{14}$/.test(cnpj)) {
      await sendTelegram(chatId, `❌ CNPJ deve ter 14 dígitos (somente números).`);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabase
      .from("compliance_clientes")
      .upsert(
        {
          cnpj,
          nome,
          telegram_chat_id: chatId,
          ativo: true,
        },
        { onConflict: "cnpj" }
      )
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        await sendTelegram(
          chatId,
          `⚠️ CNPJ <code>${formatCNPJ(cnpj)}</code> já está cadastrado.`
        );
      } else {
        await sendTelegram(chatId, `❌ Erro ao cadastrar: ${error.message}`);
      }
    } else {
      await sendTelegram(
        chatId,
        `✅ <b>Cadastrado com sucesso!</b>\n` +
          `📛 <b>${data.nome}</b>\n` +
          `🔢 CNPJ: <code>${formatCNPJ(data.cnpj)}</code>\n` +
          `🆔 Chat ID: <code>${chatId}</code>\n\n` +
          `O monitoramento inicia na próxima execução automática (todo dia às 8h).`
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // /listar
  if (text === "/listar") {
    const { data, error } = await supabase
      .from("compliance_clientes")
      .select("nome, cnpj, status_atual, ativo, ultima_checagem, ultima_checagem_ok")
      .eq("telegram_chat_id", chatId)
      .order("criado_em", { ascending: true });

    if (error) {
      await sendTelegram(chatId, `❌ Erro ao buscar: ${error.message}`);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!data || data.length === 0) {
      await sendTelegram(
        chatId,
        `📭 Nenhum CNPJ cadastrado ainda.\nUse <code>/cadastrar <CNPJ> <NOME></code> para começar.`
      );
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const list = data
      .map((c) => {
        const statusIcon = c.ultima_checagem_ok ? "✅" : "⚠️";
        const ativoIcon = c.ativo ? "🟢" : "🔴";
        const lastCheck = c.ultima_checagem
          ? new Date(c.ultima_checagem).toLocaleString("pt-BR")
          : "nunca";
        return (
          `${ativoIcon} <b>${c.nome}</b>\n` +
          `   CNPJ: <code>${formatCNPJ(c.cnpj)}</code>\n` +
          `   Status: ${c.status_atual || "—"} ${statusIcon}\n` +
          `   Última checagem: ${lastCheck}`
        );
      })
      .join("\n\n");

    await sendTelegram(chatId, `📋 <b>Seus CNPJs monitorados:</b>\n\n${list}`);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // /remover <CNPJ>
  if (text.startsWith("/remover ")) {
    const cnpj = text.split(" ")[1]?.replace(/\D/g, "");

    if (!/^\d{14}$/.test(cnpj)) {
      await sendTelegram(chatId, `❌ CNPJ inválido. Use: <code>/remover 47960950000121</code>`);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error } = await supabase
      .from("compliance_clientes")
      .delete()
      .eq("cnpj", cnpj)
      .eq("telegram_chat_id", chatId);

    if (error) {
      await sendTelegram(chatId, `❌ Erro ao remover: ${error.message}`);
    } else {
      await sendTelegram(chatId, `🗑️ CNPJ <code>${formatCNPJ(cnpj)}</code> removido do monitoramento.`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // /status <CNPJ> - Consulta direta na BrasilAPI
  if (text.startsWith("/status ")) {
    const cnpj = text.split(" ")[1]?.replace(/\D/g, "");

    if (!/^\d{14}$/.test(cnpj)) {
      await sendTelegram(chatId, `❌ CNPJ inválido. Use: <code>/status 47960950000121</code>`);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await sendTelegram(chatId, `🔍 Consultando BrasilAPI para <code>${formatCNPJ(cnpj)}</code>...`);

    try {
      const resp = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10000),
      });

      if (!resp.ok) {
        if (resp.status === 404) {
          await sendTelegram(
            chatId,
            `❌ CNPJ <code>${formatCNPJ(cnpj)}</code> não encontrado na BrasilAPI (404).`
          );
        } else {
          await sendTelegram(
            chatId,
            `⚠️ Erro na BrasilAPI: HTTP ${resp.status}. Tente novamente mais tarde.`
          );
        }
        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await resp.json();
      const situacao = data.descricao_situacao_cadastral || "DESCONHECIDA";
      const dataSituacao = data.data_situacao_cadastral || "—";

      await sendTelegram(
        chatId,
        `📊 <b>Status Atual (BrasilAPI)</b>\n` +
          `🏢 <b>${data.razao_social || data.nome_fantasia || "—"}</b>\n` +
          `🔢 CNPJ: <code>${formatCNPJ(cnpj)}</code>\n` +
          `📍 Situação: <b>${situacao}</b>\n` +
          `📅 Data da situação: ${dataSituacao}\n` +
          `🏷️ Natureza: ${data.natureza_juridica || "—"}\n` +
          `📍 Endereço: ${data.logradouro || "—"}, ${data.numero || "—"} - ${data.bairro || "—"}\n` +
          `🌆 ${data.municipio || "—"}/${data.uf || "—"} - ${data.cep || "—"}`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await sendTelegram(chatId, `❌ Erro ao consultar: ${msg}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Comando não reconhecido
  await sendTelegram(
    chatId,
    `❓ Comando não reconhecido: <code>${text}</code>\n\n` +
      `Comandos: /start | /cadastrar <CNPJ> <NOME> | /listar | /remover <CNPJ> | /status <CNPJ>`
  );

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});