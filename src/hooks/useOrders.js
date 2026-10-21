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
    const updated = list.map(p => {
      if (p.id === pedidoId) {
        return { ...p, status: 'CANCELADO' };
      }
      return p;
    });
    DB.set(DB.STORAGE_KEYS?.PEDIDOS || 'serraria_pedidos_v1', updated);
    setOrders(updated);
    if (showToast) showToast('Pedido cancelado com sucesso.', 'info');
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
        0
      );
      if (novo.resumo_financeiro) {
        novo.resumo_financeiro.subtotal_itens_puros = t.subtotal_itens_puros;
        novo.resumo_financeiro.taxa_aparelhamento = t.taxa_aparelhamento;
        novo.resumo_financeiro.subtotal_com_plaina = t.subtotal_com_plaina;
        novo.resumo_financeiro.valor_total = t.valor_total;
        novo.resumo_financeiro.percentual_bruto = t.percentual_bruto;
        novo.resumo_financeiro.valor_total_bruto = t.valor_total_bruto;
        novo.resumo_financeiro.saldo_a_receber = t.valor_total;
        novo.resumo_financeiro.valor_sinal = 0;
      }
    }

    saveOrder(novo);
    if (showToast) showToast(`Orçamento duplicado com sucesso (#${novo.numero})!`, 'success');
    return novo;
  }, [saveOrder, showToast]);

  // Gerador de mensagem formatada para WhatsApp com Duplo Preço
  const generateWhatsAppText = useCallback((p, percentualBruto = 20) => {
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

    let texto = `*SERRARIA BOM JESUS — Proposta Comercial #${num}*\n`;
    texto += `Olá, *${nome}*! Segue a cotação do seu madeiramento:\n\n`;

    if (p.itens && p.itens.length > 0) {
      p.itens.forEach((it, idx) => {
        const plainaTag = it.aparelhado ? ' (Aparelhado)' : '';
        texto += `${idx + 1}. ${it.quantidade}x ${it.descricao}${plainaTag} — ${CalcEngine.formatBRL(it.subtotal)}\n`;
      });
    }

    const frete = (p.resumo_financeiro?.valor_frete || 0) > 0 
      ? CalcEngine.formatBRL(p.resumo_financeiro.valor_frete) 
      : 'A combinar / Retirada no Pátio';
    texto += `\n*Frete (${p.resumo_financeiro?.bairro_frete || 'Entrega'}):* ${frete}\n`;

    texto += `\n*VALORES DA PROPOSTA:*`;
    texto += `\n• *À VISTA (Pix / Dinheiro):* ${total}`;
    texto += `\n• *PREÇO BRUTO (A Prazo / Cartão em até 12x):* ${totalBruto}`;
    texto += `\n\n_Proposta válida por 7 dias. Madeiras selecionadas com garantia de bitola e qualidade!_\n`;
    texto += `Serraria Bom Jesus • Caçapava - SP • Contato: (12) 3653-2000`;

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
