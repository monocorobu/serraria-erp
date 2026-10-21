import { useState, useMemo } from 'react';

/**
 * Custom Hook: useCaixa
 * Métricas em tempo real do Painel do Dono, fluxo de caixa e rankings comerciais
 */
export function useCaixa(orders) {
  const [periodo, setPeriodo] = useState('TODOS'); // 'HOJE', '7DIAS', 'MES', 'TODOS'

  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter(p => {
      if (p.status !== 'APROVADO' && p.status !== 'ENTREGUE') return false;
      if (periodo === 'TODOS') return true;

      const d = new Date(p.data_criacao || 0);
      if (periodo === 'HOJE') {
        return d.toDateString() === now.toDateString();
      }
      if (periodo === '7DIAS') {
        const diffDays = (now - d) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      }
      if (periodo === 'MES') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [orders, periodo]);

  // Indicadores Principais
  const kpis = useMemo(() => {
    let faturamento = 0;
    let totalSinais = 0;
    let volumeM3 = 0;
    let pesoTotalKg = 0;

    const caixaPorForma = {
      Pix: 0,
      Dinheiro: 0,
      'Cartão Débito': 0,
      'Cartão Crédito': 0,
      Boleto: 0,
      'A Prazo (Faturado)': 0
    };

    const produtosVendidosMap = {};
    const clientesCompradoresMap = {};

    filteredOrders.forEach(p => {
      const valor = p.resumo_financeiro?.valor_total || 0;
      const sinal = p.resumo_financeiro?.valor_sinal || 0;
      faturamento += valor;
      totalSinais += sinal;
      volumeM3 += (p.resumo_fisico?.volume_total_m3 || 0);
      pesoTotalKg += (p.resumo_fisico?.peso_total_kg || 0);

      // Caixa por forma de pagamento
      const forma = p.forma_pagamento || p.resumo_financeiro?.forma_pagamento || 'Pix';
      if (caixaPorForma[forma] !== undefined) {
        caixaPorForma[forma] += valor;
      } else {
        caixaPorForma[forma] = valor;
      }

      // Ranking de produtos
      if (p.itens) {
        p.itens.forEach(it => {
          const nome = it.descricao || 'Produto';
          if (!produtosVendidosMap[nome]) {
            produtosVendidosMap[nome] = { nome, qtd: 0, total: 0 };
          }
          produtosVendidosMap[nome].qtd += (parseFloat(it.quantidade) || 0);
          produtosVendidosMap[nome].total += (parseFloat(it.subtotal) || 0);
        });
      }

      // Ranking de clientes
      const cliNome = p.cliente?.nome || 'Consumidor Balcão';
      if (!clientesCompradoresMap[cliNome]) {
        clientesCompradoresMap[cliNome] = { nome: cliNome, pedidos: 0, total: 0 };
      }
      clientesCompradoresMap[cliNome].pedidos += 1;
      clientesCompradoresMap[cliNome].total += valor;
    });

    const ticketMedio = filteredOrders.length > 0 ? (faturamento / filteredOrders.length) : 0;
    const rankingProdutos = Object.values(produtosVendidosMap).sort((a, b) => b.total - a.total).slice(0, 5);
    const rankingClientes = Object.values(clientesCompradoresMap).sort((a, b) => b.total - a.total).slice(0, 5);

    return {
      faturamento,
      totalSinais,
      ticketMedio,
      volumeM3,
      pesoTotalKg,
      totalPedidos: filteredOrders.length,
      caixaPorForma,
      rankingProdutos,
      rankingClientes
    };
  }, [filteredOrders]);

  return {
    periodo,
    setPeriodo,
    kpis,
    filteredOrders
  };
}
