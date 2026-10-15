/**
 * SERRARIA & MADEIREIRA ERP - MÓDULO 6: PAINEL DO DONO & CAIXA DO DIA
 * Indicadores industriais, conversão de vendas, ranking de madeiras mais vendidas e conciliação do caixa.
 */

const PainelModule = {
  currentPeriod: 'TODOS', // 'HOJE', 'SEMANA', 'MES', 'TODOS'

  init() {
    this.atualizarIndicadores();
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.querySelectorAll('.filter-pill[data-painel-periodo]').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill[data-painel-periodo]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentPeriod = pill.dataset.painelPeriodo;
        this.atualizarIndicadores();
      });
    });
  },

  atualizarIndicadores() {
    const pedidos = DB.getPedidos();

    // 1. Cálculos dos 4 KPIs
    let totalOrcado = 0;
    let countOrcamentos = 0;
    let totalVendido = 0;
    let countVendas = 0;
    let totalSaldoEntregas = 0;

    pedidos.forEach(p => {
      const val = p.resumo_financeiro?.valor_total || 0;
      const saldo = p.resumo_financeiro?.saldo_a_receber || 0;

      if (p.status === 'ORCAMENTO') {
        totalOrcado += val;
        countOrcamentos++;
      } else if (p.status === 'APROVADO' || p.status === 'ENTREGUE') {
        totalVendido += val;
        countVendas++;
        if (saldo > 0 && p.status !== 'CANCELADO') {
          totalSaldoEntregas += saldo;
        }
      }
    });

    const totalGeralPedidos = countOrcamentos + countVendas;
    const taxaConversao = totalGeralPedidos > 0 ? (countVendas / totalGeralPedidos) * 100 : 0;

    // Atualiza cards no topo
    this.setText('kpi-total-orcado', CalcEngine.formatBRL(totalOrcado));
    this.setText('kpi-count-orcado', `${countOrcamentos} orçamentos emitidos`);

    this.setText('kpi-total-vendido', CalcEngine.formatBRL(totalVendido));
    this.setText('kpi-count-vendido', `${countVendas} vendas fechadas`);

    this.setText('kpi-taxa-conversao', taxaConversao.toFixed(1) + '%');
    this.setText('kpi-desc-conversao', `${countVendas} de ${totalGeralPedidos} pedidos convertidos`);

    this.setText('kpi-total-a-receber', CalcEngine.formatBRL(totalSaldoEntregas));
    this.setText('kpi-desc-a-receber', 'A cobrar na entrega / descarga');

    // 2. Ranking de Madeiras Mais Vendidas
    this.renderRankingMadeiras(pedidos);

    // 3. Relatório de Caixa do Dia (Entradas)
    this.renderCaixaEntradas(pedidos);
  },

  setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  },

  renderRankingMadeiras(pedidos) {
    const tbody = document.getElementById('painel-ranking-tbody');
    if (!tbody) return;

    // Agrupa itens de pedidos aprovados e entregues
    const statsMap = {};

    pedidos.filter(p => p.status === 'APROVADO' || p.status === 'ENTREGUE').forEach(p => {
      p.itens.forEach(item => {
        const key = item.descricao;
        if (!statsMap[key]) {
          statsMap[key] = {
            descricao: item.descricao,
            tipo_calculo: item.tipo_calculo,
            volume_m3: 0,
            metragem_ml: 0,
            faturamento: 0,
            pecas: 0
          };
        }
        statsMap[key].volume_m3 += (item.volume_m3 || 0);
        if (item.tipo_calculo === 'ML') {
          statsMap[key].metragem_ml += (item.metragem_total || 0);
        }
        statsMap[key].faturamento += (item.subtotal || 0);
        statsMap[key].pecas += (item.quantidade || 0);
      });
    });

    const ranking = Object.values(statsMap).sort((a, b) => b.faturamento - a.faturamento);

    tbody.innerHTML = ranking.map((r, idx) => `
      <tr>
        <td class="align-center font-mono" style="font-weight: 700; color: var(--primary-green);">${idx + 1}º</td>
        <td><strong>${r.descricao}</strong></td>
        <td class="align-center font-mono">${r.pecas}</td>
        <td class="align-right font-mono">${r.metragem_ml > 0 ? CalcEngine.formatNumero(r.metragem_ml, 1) + ' ML' : '-'}</td>
        <td class="align-right font-mono">${CalcEngine.formatM3(r.volume_m3)}</td>
        <td class="align-right font-mono" style="font-weight: 700; color: var(--primary-green);">${CalcEngine.formatBRL(r.faturamento)}</td>
      </tr>
    `).join('') || '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhuma venda registrada ainda.</td></tr>';
  },

  renderCaixaEntradas(pedidos) {
    const tbody = document.getElementById('painel-caixa-tbody');
    const totalCaixaEl = document.getElementById('painel-caixa-total-dia');
    if (!tbody) return;

    // Métodos de pagamento suportados
    const formas = {
      'Pix': { total: 0, count: 0, sinais: 0, quitacoes: 0 },
      'Dinheiro': { total: 0, count: 0, sinais: 0, quitacoes: 0 },
      'Cartão de Débito': { total: 0, count: 0, sinais: 0, quitacoes: 0 },
      'Cartão de Crédito': { total: 0, count: 0, sinais: 0, quitacoes: 0 },
      'Boleto Bancário': { total: 0, count: 0, sinais: 0, quitacoes: 0 }
    };

    let totalEntradasGerais = 0;

    pedidos.filter(p => p.status === 'APROVADO' || p.status === 'ENTREGUE').forEach(p => {
      const forma = p.resumo_financeiro?.forma_pagamento || 'Pix';
      const sinal = p.resumo_financeiro?.valor_sinal || 0;
      const total = p.resumo_financeiro?.valor_total || 0;

      if (!formas[forma]) {
        formas[forma] = { total: 0, count: 0, sinais: 0, quitacoes: 0 };
      }

      // Se entregue, considera valor total pago. Se em aprovação, considera sinal pago.
      const valorEfetivamentePago = p.status === 'ENTREGUE' ? total : sinal;

      if (valorEfetivamentePago > 0) {
        formas[forma].total += valorEfetivamentePago;
        formas[forma].count++;
        if (p.status === 'ENTREGUE') {
          formas[forma].quitacoes += (total - sinal);
          formas[forma].sinais += sinal;
        } else {
          formas[forma].sinais += sinal;
        }
        totalEntradasGerais += valorEfetivamentePago;
      }
    });

    tbody.innerHTML = Object.entries(formas).map(([nome, dados]) => `
      <tr>
        <td><strong>${nome}</strong></td>
        <td class="align-center font-mono">${dados.count}</td>
        <td class="align-right font-mono">${CalcEngine.formatBRL(dados.sinais)}</td>
        <td class="align-right font-mono">${CalcEngine.formatBRL(dados.quitacoes)}</td>
        <td class="align-right font-mono" style="font-weight: 700; color: var(--action-green);">${CalcEngine.formatBRL(dados.total)}</td>
      </tr>
    `).join('');

    if (totalCaixaEl) {
      totalCaixaEl.textContent = CalcEngine.formatBRL(totalEntradasGerais);
    }
  }
};

window.PainelModule = PainelModule;

