/**
 * SERRARIA & MADEIREIRA ERP - MÓDULO 6: PAINEL DO DONO & GESTÃO FINANCEIRA
 * Indicadores executivos, conversão, ticket médio, ranking dos mais vendidos e conciliação do caixa.
 */

const PainelModule = {
  currentPeriod: 'TODOS', // 'HOJE', 'SEMANA', 'MES', 'TODOS'
  ordenacaoRanking: 'FATURAMENTO', // 'FATURAMENTO', 'QUANTIDADE', 'VOLUME'
  filtroCategoriaRanking: 'TODOS', // 'TODOS', 'MADEIRAS', 'FERRAGENS'

  init() {
    this.setupEventListeners();
    this.atualizarIndicadores();
  },

  setupEventListeners() {
    // Filtros de período (Hoje, 7 dias, Mês, Todos)
    document.querySelectorAll('[data-painel-periodo]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('[data-painel-periodo]').forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentPeriod = e.currentTarget.dataset.painelPeriodo;
        this.atualizarIndicadores();
      });
    });
  },

  alterarOrdemRanking(novaOrdem) {
    this.ordenacaoRanking = novaOrdem;
    this.atualizarIndicadores();
  },

  alterarFiltroRanking(novoFiltro) {
    this.filtroCategoriaRanking = novoFiltro;
    this.atualizarIndicadores();
  },

  filtrarPorPeriodo(pedidos) {
    if (this.currentPeriod === 'TODOS') return pedidos;

    const agora = new Date();
    const hojeStr = agora.toDateString();

    return pedidos.filter(p => {
      const dataStr = p.data_criacao || p.data_entrega || p.data;
      if (!dataStr) return true;

      const dataPedido = new Date(dataStr);
      if (isNaN(dataPedido.getTime())) return true;

      if (this.currentPeriod === 'HOJE') {
        return dataPedido.toDateString() === hojeStr;
      }
      if (this.currentPeriod === 'SEMANA') {
        const diffDias = (agora.getTime() - dataPedido.getTime()) / (1000 * 60 * 60 * 24);
        return diffDias >= 0 && diffDias <= 7;
      }
      if (this.currentPeriod === 'MES') {
        return dataPedido.getMonth() === agora.getMonth() && dataPedido.getFullYear() === agora.getFullYear();
      }
      return true;
    });
  },

  atualizarIndicadores() {
    const todosPedidos = DB.getPedidos();
    const pedidosFiltrados = this.filtrarPorPeriodo(todosPedidos);

    // Atualiza o texto informativo do período selecionado
    const rotuloEl = document.getElementById('painel-periodo-rotulo');
    if (rotuloEl) {
      if (this.currentPeriod === 'HOJE') {
        rotuloEl.textContent = `Operações de Hoje (${new Date().toLocaleDateString('pt-BR')})`;
      } else if (this.currentPeriod === 'SEMANA') {
        rotuloEl.textContent = 'Operações dos últimos 7 dias corridos';
      } else if (this.currentPeriod === 'MES') {
        rotuloEl.textContent = `Mês Atual (${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })})`;
      } else {
        rotuloEl.textContent = `Todo o histórico (${todosPedidos.length} pedidos registrados)`;
      }
    }

    // 1. Cálculos dos 5 KPIs Executivos
    let totalOrcado = 0;
    let countOrcamentos = 0;
    let totalVendido = 0;
    let countVendas = 0;
    let totalSaldoEntregas = 0;
    let totalEntradasCaixa = 0;

    pedidosFiltrados.forEach(p => {
      const valTotal = parseFloat(p.resumo_financeiro?.valor_total) || 0;
      const sinal = parseFloat(p.resumo_financeiro?.valor_sinal) || 0;
      const saldo = parseFloat(p.resumo_financeiro?.saldo_a_receber) || 0;

      if (p.status === 'ORCAMENTO') {
        totalOrcado += valTotal;
        countOrcamentos++;
      } else if (p.status === 'APROVADO' || p.status === 'ENTREGUE') {
        totalVendido += valTotal;
        countVendas++;

        if (saldo > 0 && p.status !== 'CANCELADO') {
          totalSaldoEntregas += saldo;
        }

        // Valor efetivamente entrado no caixa:
        // Venda Balcão (ENTREGUE) = quitado 100%
        // Venda Pátio (APROVADO) = sinal / entrada recebida
        const pagoEfetivo = p.status === 'ENTREGUE' ? valTotal : sinal;
        totalEntradasCaixa += pagoEfetivo;
      }
    });

    const totalOportunidades = countOrcamentos + countVendas;
    const taxaConversao = totalOportunidades > 0 ? (countVendas / totalOportunidades) * 100 : 0;
    const ticketMedio = countVendas > 0 ? (totalVendido / countVendas) : 0;

    // Atualiza os Cards no topo do painel
    this.setText('kpi-total-vendido', CalcEngine.formatBRL(totalVendido));
    this.setText('kpi-count-vendido', `${countVendas} ${countVendas === 1 ? 'venda confirmada' : 'vendas confirmadas'}`);

    this.setText('kpi-caixa-entradas', CalcEngine.formatBRL(totalEntradasCaixa));
    this.setText('kpi-desc-entradas', 'Sinais pagos + Vendas de balcão');

    this.setText('kpi-total-a-receber', CalcEngine.formatBRL(totalSaldoEntregas));
    this.setText('kpi-desc-a-receber', 'Saldos para cobrar na descarga');

    this.setText('kpi-ticket-medio', CalcEngine.formatBRL(ticketMedio));
    this.setText('kpi-desc-ticket', `Média de R$ por pedido fechado`);

    this.setText('kpi-taxa-conversao', taxaConversao.toFixed(1) + '%');
    this.setText('kpi-desc-conversao', `${countVendas} de ${totalOportunidades} orçamentos fechados`);

    // 2. Renderiza o Ranking dos Produtos Mais Vendidos
    this.renderRankingProdutos(pedidosFiltrados, totalVendido);

    // 3. Renderiza o Relatório de Entradas do Caixa
    this.renderCaixaEntradas(pedidosFiltrados);

    // 4. Renderiza os Top Clientes do Período
    this.renderTopClientes(pedidosFiltrados);
  },

  setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  },

  renderRankingProdutos(pedidos, totalFaturamentoPeriodo) {
    const tbody = document.getElementById('painel-ranking-tbody');
    if (!tbody) return;

    const produtosCatalogo = (typeof DB !== 'undefined' && DB.getProdutos) ? DB.getProdutos() : [];
    const statsMap = {};

    // Considera apenas pedidos fechados (APROVADO ou ENTREGUE)
    pedidos.filter(p => p.status === 'APROVADO' || p.status === 'ENTREGUE').forEach(p => {
      (p.itens || []).forEach(item => {
        const key = item.produto_id || item.codigo || item.descricao;
        if (!key) return;

        if (!statsMap[key]) {
          const prodCat = produtosCatalogo.find(c => 
            (item.produto_id && (c.id === item.produto_id || String(c.id) === String(item.produto_id))) ||
            (item.codigo && c.codigo && c.codigo.trim().toUpperCase() === item.codigo.trim().toUpperCase()) ||
            (c.nome && c.nome.trim().toLowerCase() === item.descricao.trim().toLowerCase())
          );

          const categoria = prodCat?.categoria || (item.codigo?.startsWith('MAD') ? 'Madeiras' : 'Ferragens');
          const isMadeira = categoria.toLowerCase().includes('madeira') || 
                            item.codigo?.startsWith('MAD') || 
                            item.tipo_calculo === 'ML' || 
                            (item.volume_m3 && item.volume_m3 > 0);

          statsMap[key] = {
            id: key,
            codigo: item.codigo || prodCat?.codigo || 'S/COD',
            descricao: item.descricao,
            categoria: categoria,
            isMadeira: isMadeira,
            tipo_calculo: item.tipo_calculo || 'UN',
            unidade_medida: prodCat?.unidade_medida || item.tipo_calculo || 'un',
            volume_m3: 0,
            metragem_ml: 0,
            faturamento: 0,
            quantidade: 0,
            pedidos_count: 0
          };
        }

        const qtd = parseFloat(item.quantidade) || 0;
        const subtotal = parseFloat(item.subtotal) || 0;
        const vol = parseFloat(item.volume_m3) || 0;
        const metragem = parseFloat(item.metragem_total) || 0;

        statsMap[key].quantidade += qtd;
        statsMap[key].faturamento += subtotal;
        statsMap[key].volume_m3 += vol;
        if (item.tipo_calculo === 'ML') {
          statsMap[key].metragem_ml += metragem;
        }
        statsMap[key].pedidos_count++;
      });
    });

    let lista = Object.values(statsMap);

    // Filtro por Categoria do Ranking
    if (this.filtroCategoriaRanking === 'MADEIRAS') {
      lista = lista.filter(item => item.isMadeira);
    } else if (this.filtroCategoriaRanking === 'FERRAGENS') {
      lista = lista.filter(item => !item.isMadeira);
    }

    // Ordenação selecionada
    if (this.ordenacaoRanking === 'QUANTIDADE') {
      lista.sort((a, b) => b.quantidade - a.quantidade);
    } else if (this.ordenacaoRanking === 'VOLUME') {
      lista.sort((a, b) => b.volume_m3 - a.volume_m3);
    } else {
      // Default: FATURAMENTO
      lista.sort((a, b) => b.faturamento - a.faturamento);
    }

    if (!lista.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 28px; color: var(--text-muted); font-size: 13px;">
            Nenhuma venda registrada para os critérios selecionados neste período.
          </td>
        </tr>
      `;
      return;
    }

    const baseFaturamento = totalFaturamentoPeriodo > 0 ? totalFaturamentoPeriodo : lista.reduce((acc, i) => acc + i.faturamento, 0);

    tbody.innerHTML = lista.map((r, idx) => {
      const pos = idx + 1;
      let badgePos = `<span class="font-mono" style="font-weight: 700; color: var(--text-secondary); font-size: 11px;">#${pos}</span>`;
      if (pos === 1) {
        badgePos = `<span class="badge-tag" style="background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; font-weight: 800; font-size: 11px;">🥇 1º</span>`;
      } else if (pos === 2) {
        badgePos = `<span class="badge-tag" style="background: #F1F5F9; color: #334155; border: 1px solid #CBD5E1; font-weight: 800; font-size: 11px;">🥈 2º</span>`;
      } else if (pos === 3) {
        badgePos = `<span class="badge-tag" style="background: #FFF7ED; color: #9A3412; border: 1px solid #FFEDD5; font-weight: 800; font-size: 11px;">🥉 3º</span>`;
      }

      const pct = baseFaturamento > 0 ? Math.min(100, (r.faturamento / baseFaturamento) * 100) : 0;
      const pctFormatado = pct.toFixed(1) + '%';

      let volOuMetragem = '<span style="color: var(--text-muted);">-</span>';
      if (r.volume_m3 > 0) {
        volOuMetragem = `${CalcEngine.formatM3(r.volume_m3)}`;
      } else if (r.metragem_ml > 0) {
        volOuMetragem = `${CalcEngine.formatNumero(r.metragem_ml, 1)} ML`;
      }

      return `
        <tr>
          <td class="align-center">${badgePos}</td>
          <td>
            <div style="display: flex; align-items: baseline; gap: 6px;">
              <span class="font-mono" style="font-size: 10.5px; font-weight: 700; color: var(--brand-primary);">${r.codigo}</span>
              <strong style="font-size: 12.5px;">${r.descricao}</strong>
            </div>
            <div style="font-size: 10.5px; color: var(--text-secondary); margin-top: 1px;">
              ${r.categoria} • Presente em ${r.pedidos_count} ${r.pedidos_count === 1 ? 'pedido' : 'pedidos'}
            </div>
          </td>
          <td class="align-center font-mono">
            <span class="badge-tag badge-bruta" style="font-size: 11px; font-weight: 700;">
              ${r.quantidade} ${r.unidade_medida}
            </span>
          </td>
          <td class="align-right font-mono" style="font-size: 11.5px;">
            ${volOuMetragem}
          </td>
          <td class="align-right font-mono" style="font-weight: 700; color: #047857; font-size: 13px;">
            ${CalcEngine.formatBRL(r.faturamento)}
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="flex: 1; background: #E2E8F0; border-radius: 99px; height: 6px; overflow: hidden; min-width: 45px;">
                <div style="background: linear-gradient(90deg, #10B981, #059669); height: 100%; width: ${pct}%; border-radius: 99px;"></div>
              </div>
              <span class="font-mono" style="font-size: 10.5px; font-weight: 600; color: var(--text-secondary); width: 38px; text-align: right;">${pctFormatado}</span>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  renderCaixaEntradas(pedidos) {
    const tbody = document.getElementById('painel-caixa-tbody');
    const tfoot = document.getElementById('painel-caixa-tfoot');
    const totalCaixaEl = document.getElementById('painel-caixa-total-dia');
    if (!tbody) return;

    const formas = {
      'Pix': { total: 0, count: 0, sinais: 0, quitacoes: 0 },
      'Dinheiro': { total: 0, count: 0, sinais: 0, quitacoes: 0 },
      'Cartão de Débito': { total: 0, count: 0, sinais: 0, quitacoes: 0 },
      'Cartão de Crédito': { total: 0, count: 0, sinais: 0, quitacoes: 0 },
      'Boleto Bancário': { total: 0, count: 0, sinais: 0, quitacoes: 0 },
      'Conta Corrente / Pendura': { total: 0, count: 0, sinais: 0, quitacoes: 0 }
    };

    let totalEntradasGerais = 0;
    let totalSinais = 0;
    let totalQuitacoes = 0;
    let totalLancamentos = 0;

    pedidos.filter(p => p.status === 'APROVADO' || p.status === 'ENTREGUE').forEach(p => {
      const forma = p.resumo_financeiro?.forma_pagamento || 'Pix';
      const sinal = parseFloat(p.resumo_financeiro?.valor_sinal) || 0;
      const total = parseFloat(p.resumo_financeiro?.valor_total) || 0;

      if (!formas[forma]) {
        formas[forma] = { total: 0, count: 0, sinais: 0, quitacoes: 0 };
      }

      // Se entregue, considera que o total foi quitado. Se aprovado para entrega futura, considera o sinal.
      const valorEfetivamentePago = p.status === 'ENTREGUE' ? total : sinal;

      if (valorEfetivamentePago > 0) {
        formas[forma].total += valorEfetivamentePago;
        formas[forma].count++;
        totalLancamentos++;

        if (p.status === 'ENTREGUE') {
          const quitacao = Math.max(0, total - sinal);
          formas[forma].quitacoes += quitacao;
          formas[forma].sinais += sinal;
          totalQuitacoes += quitacao;
          totalSinais += sinal;
        } else {
          formas[forma].sinais += sinal;
          totalSinais += sinal;
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
        <td class="align-right font-mono" style="font-weight: 700; color: #047857;">${CalcEngine.formatBRL(dados.total)}</td>
      </tr>
    `).join('');

    if (tfoot) {
      tfoot.innerHTML = `
        <tr style="background: #F8FAFC; font-weight: 800; border-top: 2px solid var(--border-medium);">
          <td>TOTAL GERAL NO CAIXA</td>
          <td class="align-center font-mono">${totalLancamentos}</td>
          <td class="align-right font-mono">${CalcEngine.formatBRL(totalSinais)}</td>
          <td class="align-right font-mono">${CalcEngine.formatBRL(totalQuitacoes)}</td>
          <td class="align-right font-mono" style="color: #047857; font-size: 13.5px;">${CalcEngine.formatBRL(totalEntradasGerais)}</td>
        </tr>
      `;
    }

    if (totalCaixaEl) {
      totalCaixaEl.textContent = CalcEngine.formatBRL(totalEntradasGerais);
    }
  },

  renderTopClientes(pedidos) {
    const tbody = document.getElementById('painel-top-clientes-tbody');
    if (!tbody) return;

    const clientesMap = {};

    pedidos.filter(p => p.status === 'APROVADO' || p.status === 'ENTREGUE').forEach(p => {
      const cli = p.cliente || {};
      const key = cli.id || cli.documento || cli.nome || 'Cliente Balcão';

      if (!clientesMap[key]) {
        clientesMap[key] = {
          id: cli.id,
          nome: cli.nome || 'Cliente Balcão',
          telefone: cli.telefone || '',
          bairro: cli.bairro || '',
          cidade: cli.cidade || 'Caçapava',
          pedidos_count: 0,
          total_gasto: 0
        };
      }

      clientesMap[key].pedidos_count++;
      clientesMap[key].total_gasto += (parseFloat(p.resumo_financeiro?.valor_total) || 0);
    });

    const topClientes = Object.values(clientesMap)
      .sort((a, b) => b.total_gasto - a.total_gasto)
      .slice(0, 5);

    if (!topClientes.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 13px;">
            Nenhum cliente com pedidos fechados no período selecionado.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = topClientes.map((c, idx) => {
      const rawTel = (c.telefone || '').replace(/\D/g, '');
      const whatsUrl = rawTel.length >= 10 ? `https://api.whatsapp.com/send?phone=55${rawTel}` : '';

      return `
        <tr>
          <td class="align-center font-mono" style="font-weight: 700; color: var(--brand-primary);">${idx + 1}º</td>
          <td><strong>${c.nome}</strong></td>
          <td class="font-mono" style="font-size: 11.5px;">${c.telefone || '<span style="color: var(--text-muted);">-</span>'}</td>
          <td style="font-size: 11.5px;">${c.bairro ? `${c.bairro} (${c.cidade})` : c.cidade}</td>
          <td class="align-center font-mono" style="font-weight: 600;">${c.pedidos_count}</td>
          <td class="align-right font-mono" style="font-weight: 700; color: var(--brand-primary);">${CalcEngine.formatBRL(c.total_gasto)}</td>
          <td class="align-center">
            ${whatsUrl ? `
              <a href="${whatsUrl}" target="_blank" class="btn btn-sm btn-secondary" style="padding: 2px 8px; font-size: 11px; display: inline-flex; align-items: center; gap: 4px; text-decoration: none;">
                <span>WhatsApp</span>
              </a>
            ` : '<span style="color: var(--text-muted); font-size: 11px;">-</span>'}
          </td>
        </tr>
      `;
    }).join('');
  }
};

window.PainelModule = PainelModule;
