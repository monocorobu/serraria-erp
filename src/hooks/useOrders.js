import { useState, useCallback, useMemo } from 'react';
import { DB } from '../services/data.js';
import { CalcEngine } from '../services/calc.js';
import { ApiClient } from '../services/api.js';

/**
 * Custom Hook: useOrders
 * Gerenciamento reativo de pedidos, persistência no banco e operações comerciais
 */
export function useOrders(showToast, onOrderSaved) {
  const [orders, setOrders] = useState(() => DB.getPedidos());
  const [editingOrderId, setEditingOrderId] = useState(null);

  // Salvar pedido (criação ou atualização) com sincronização no banco
  const saveOrder = useCallback((pedido) => {
    // 1. Salva no armazenamento local instantaneamente
    const saved = DB.salvarPedido(pedido);
    setOrders(DB.getPedidos());

    // 2. Notifica callback (ex: refreshClients) e sincroniza cliente no banco
    if (saved.cliente && saved.cliente.nome) {
      if (onOrderSaved) onOrderSaved(saved);
      if (saved.cliente.id) {
        ApiClient.saveCliente(saved.cliente).catch(() => {});
      }
    }

    // 3. Sincroniza em segundo plano com o banco de dados via API serverless
    ApiClient.savePedido(saved).catch(() => {});

    return saved;
  }, [onOrderSaved]);

  // Excluir ou cancelar pedido
  const cancelOrder = useCallback((pedidoId) => {
    const list = DB.getPedidos();
    const found = list.find(p => p.id === pedidoId);
    if (found) {
      const cancelled = { ...found, status: 'CANCELADO' };
      DB.salvarPedido(cancelled);
      setOrders(DB.getPedidos());
      ApiClient.savePedido(cancelled).catch(() => {});
      if (showToast) showToast(`Pedido #${found.numero} cancelado com sucesso.`, 'info');
    }
  }, [showToast]);

  // Duplicar orçamento com opção de substituição de espécie de madeira
  const duplicateOrder = useCallback((origOrder, novaEspecie = 'MANTER') => {
    const nextNum = DB.getNextNumeroPedido();
    const novo = JSON.parse(JSON.stringify(origOrder));
    novo.id = 'PED-' + nextNum;
    novo.numero = nextNum;
    novo.data_criacao = new Date().toISOString();
    novo.status = 'ORCAMENTO';
    novo.etapa_patio = 'NAO_ENVIADO';

    if (novaEspecie !== 'MANTER' && novo.itens) {
      novo.itens.forEach(it => {
        if (it.tipo_calculo === 'ML' || it.tipo_calculo === 'M3') {
          it.especie = novaEspecie;
          it.descricao = it.descricao.replace(/(Garapeira|Peroba Rosa|Cupiúba|Cambará|Pinus Tratado|Eucalipto)/i, novaEspecie);
        }
      });

      const t = CalcEngine.calcularTotaisOrcamento(
        novo.itens,
        novo.resumo_financeiro?.valor_frete || 0,
        novo.resumo_financeiro?.desconto_valor || 0,
        novo.resumo_financeiro?.desconto_tipo || 'VALOR',
        0,
        novo.resumo_financeiro?.plaina_pct || 0,
        novo.resumo_financeiro?.plaina_base || 'ITENS_PLAINA'
      );
      if (novo.resumo_financeiro) {
        novo.resumo_financeiro.subtotal_itens_puros = t.subtotal_itens_puros;
        novo.resumo_financeiro.subtotal_itens_plaina = t.subtotal_itens_plaina;
        novo.resumo_financeiro.taxa_aparelhamento = t.taxa_aparelhamento;
        novo.resumo_financeiro.plaina_pct = t.plaina_percentual;
        novo.resumo_financeiro.subtotal_com_plaina = t.subtotal_com_plaina;
        novo.resumo_financeiro.valor_total = t.valor_total;
        novo.resumo_financeiro.percentual_bruto = t.percentual_bruto;
        novo.resumo_financeiro.valor_total_bruto = t.valor_total_bruto;
        novo.resumo_financeiro.percentual_debito = t.percentual_debito;
        novo.resumo_financeiro.valor_total_debito = t.valor_total_debito;
        novo.resumo_financeiro.saldo_a_receber = 0;
        novo.resumo_financeiro.valor_sinal = 0;
      }
    }

    saveOrder(novo);
    if (showToast) showToast(`Orçamento duplicado com sucesso (#${novo.numero})!`, 'success');
    return novo;
  }, [saveOrder, showToast]);

  // Gerador de mensagem formatada para WhatsApp com Preços À Vista, Débito e Bruto
  const generateWhatsAppText = useCallback((p, percentualBruto = 20, customConfig = null) => {
    const nome = p.cliente?.nome || 'Cliente';
    const num = p.numero;
    const total = CalcEngine.formatBRL(p.resumo_financeiro?.valor_total || 0);
    const pctBruto = p.resumo_financeiro?.percentual_bruto !== undefined 
      ? p.resumo_financeiro.percentual_bruto 
      : percentualBruto;
    const totalBruto = CalcEngine.formatBRL(
      p.resumo_financeiro?.valor_total_bruto || 
      CalcEngine.calcularPrecoBruto(p.resumo_financeiro?.valor_total || 0, pctBruto)
    );
    const pctDebito = p.resumo_financeiro?.percentual_debito !== undefined 
      ? p.resumo_financeiro.percentual_debito 
      : CalcEngine.getPercentualTaxaDebito();
    const totalDebito = CalcEngine.formatBRL(
      p.resumo_financeiro?.valor_total_debito || 
      CalcEngine.calcularPrecoDebito(p.resumo_financeiro?.valor_total || 0, pctDebito)
    );

    const cfg = customConfig || DB.getConfig();
    const nomeEmpresa = (cfg?.nome_madeireira || 'Serraria e Madeireira Bom Jesus').toUpperCase();
    const telEmpresa = cfg?.telefone_madeireira || '(12) 99603-3793';
    const cidadeEmpresa = cfg?.cidade || cfg?.municipio || 'Caçapava - SP';
    const rodapePersonalizado = cfg?.mensagem_whatsapp_rodape || 'Proposta válida por 7 dias. Madeiras selecionadas com garantia de bitola e qualidade!';

    let texto = `*${nomeEmpresa} — Proposta Comercial #${num}*\n`;
    texto += `Olá, *${nome}*! Segue a cotação do seu madeiramento:\n\n`;

    if (p.itens && p.itens.length > 0) {
      p.itens.forEach((it, idx) => {
        const plainaTag = it.aparelhar ? ' (Aparelhar)' : '';
        texto += `${idx + 1}. ${it.quantidade}x ${it.descricao}${plainaTag} — ${CalcEngine.formatBRL(it.subtotal)}\n`;
      });
    }

    if ((p.resumo_financeiro?.taxa_aparelhamento || 0) > 0) {
      const pctTexto = p.resumo_financeiro?.plaina_pct ? ` (${p.resumo_financeiro.plaina_pct}%)` : '';
      texto += `\n*Acréscimo Plaina${pctTexto}:* ${CalcEngine.formatBRL(p.resumo_financeiro.taxa_aparelhamento)}`;
    }

    const frete = (p.resumo_financeiro?.valor_frete || 0) > 0 
      ? CalcEngine.formatBRL(p.resumo_financeiro.valor_frete) 
      : 'A combinar / Retirada no Pátio';
    texto += `\n*Frete (${p.resumo_financeiro?.bairro_frete || 'Entrega'}):* ${frete}\n`;

    texto += `\n*VALORES DA PROPOSTA:*`;
    texto += `\n• *À VISTA (Pix / Dinheiro):* ${total}`;
    texto += `\n• *NO DÉBITO / CARTÃO:* ${totalDebito}`;
    texto += `\n• *PREÇO BRUTO (até 5x no cartão):* ${totalBruto}`;

    if (p.forma_pagamento || p.resumo_financeiro?.forma_pagamento) {
      texto += `\n• *Pagamento Escolhido:* ${p.forma_pagamento || p.resumo_financeiro?.forma_pagamento}`;
      if (p.resumo_financeiro?.valor_total_cobrado && p.resumo_financeiro.valor_total_cobrado !== (p.resumo_financeiro?.valor_total || 0)) {
        texto += `\n• *Total a Receber:* ${CalcEngine.formatBRL(p.resumo_financeiro.valor_total_cobrado)}`;
      }
    }
    texto += `\n\n_${rodapePersonalizado}_\n`;
    texto += `${cfg?.nome_madeireira || 'Serraria Bom Jesus'} • ${cidadeEmpresa} • Contato: ${telEmpresa}`;

    return texto;
  }, []);

  return {
    orders,
    setOrders,
    editingOrderId,
    setEditingOrderId,
    saveOrder,
    cancelOrder,
    duplicateOrder,
    generateWhatsAppText
  };
}
