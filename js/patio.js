/**
 * SERRARIA & MADEIREIRA ERP - MÓDULO 3: PÁTIO, SERRA E ENTREGAS
 * Kanban industrial, Checklist de Separação e controle de saldo a cobrar na entrega.
 */

const PatioModule = {
  activePedidoChecklist: null,

  init() {
    this.renderKanban();
    this.setupEventListeners();
  },

  setupEventListeners() {
    // Eventos de modais do pátio
    const btnSalvarChecklist = document.getElementById('btn-salvar-checklist-patio');
    if (btnSalvarChecklist) {
      btnSalvarChecklist.addEventListener('click', () => this.salvarChecklist());
    }
  },

  renderKanban() {
    const colPlaina = document.getElementById('kanban-col-plaina');
    const colSeparacao = document.getElementById('kanban-col-separacao');
    const colPronto = document.getElementById('kanban-col-pronto');
    const colEntregue = document.getElementById('kanban-col-entregue');

    if (!colPlaina || !colSeparacao || !colPronto || !colEntregue) return;

    const pedidos = DB.getPedidos().filter(p => p.status === 'APROVADO' || p.status === 'ENTREGUE');

    const listaPlaina = pedidos.filter(p => p.etapa_patio === 'CORTE_PLAINA');
    const listaSeparacao = pedidos.filter(p => p.etapa_patio === 'SEPARACAO');
    const listaPronto = pedidos.filter(p => p.etapa_patio === 'PRONTO_CARREGAR');
    const listaEntregue = pedidos.filter(p => p.etapa_patio === 'SAIU_ENTREGA' || p.etapa_patio === 'ENTREGUE');

    // Atualiza contadores dos headers
    this.updateColCount('count-plaina', listaPlaina.length);
    this.updateColCount('count-separacao', listaSeparacao.length);
    this.updateColCount('count-pronto', listaPronto.length);
    this.updateColCount('count-entregue', listaEntregue.length);

    colPlaina.innerHTML = listaPlaina.map(p => this.gerarCardKanban(p)).join('') || this.emptyCardHtml('Nenhum lote na plaina');
    colSeparacao.innerHTML = listaSeparacao.map(p => this.gerarCardKanban(p)).join('') || this.emptyCardHtml('Nenhum lote em separação');
    colPronto.innerHTML = listaPronto.map(p => this.gerarCardKanban(p)).join('') || this.emptyCardHtml('Nenhum lote pronto');
    colEntregue.innerHTML = listaEntregue.map(p => this.gerarCardKanban(p)).join('') || this.emptyCardHtml('Nenhuma entrega recente');
  },

  updateColCount(id, count) {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
  },

  emptyCardHtml(msg) {
    return `
      <div style="padding: 20px 10px; text-align: center; color: var(--text-muted); font-size: 11px; border: 1px dashed var(--border-color); border-radius: var(--radius-xs);">
        ${msg}
      </div>
    `;
  },

  getEtapaAnterior(etapaAtual) {
    switch (etapaAtual) {
      case 'ENTREGUE':
      case 'SAIU_ENTREGA':
        return 'PRONTO_CARREGAR';
      case 'PRONTO_CARREGAR':
        return 'SEPARACAO';
      case 'SEPARACAO':
        return 'CORTE_PLAINA';
      default:
        return null;
    }
  },

  getProximaEtapa(etapaAtual) {
    switch (etapaAtual) {
      case 'CORTE_PLAINA':
        return 'SEPARACAO';
      case 'SEPARACAO':
        return 'PRONTO_CARREGAR';
      case 'PRONTO_CARREGAR':
        return 'ENTREGUE';
      case 'SAIU_ENTREGA':
        return 'ENTREGUE';
      default:
        return null;
    }
  },

  getEtapaNome(etapa) {
    switch (etapa) {
      case 'CORTE_PLAINA': return 'Corte & Plaina';
      case 'SEPARACAO': return 'Separação';
      case 'PRONTO_CARREGAR': return 'Pronto p/ Carregar';
      case 'SAIU_ENTREGA': return 'Saiu p/ Entrega';
      case 'ENTREGUE': return 'Entregue';
      default: return etapa || 'Pátio';
    }
  },

  gerarCardKanban(p) {
    const temPlaina = p.itens && p.itens.some(i => i.aparelhar);
    const saldoReceber = p.resumo_financeiro?.saldo_a_receber || 0;
    const temSaldoCobrar = saldoReceber > 0;
    const isBalcao = Boolean(p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO');
    const bairro = isBalcao ? 'Retirado no Balcão (Pronta Entrega)' : (p.cliente?.bairro || p.resumo_financeiro?.bairro_frete || 'Balcão / Retirada');
    const peso = p.resumo_fisico?.peso_total_kg || 0;
    const totalPecas = p.resumo_fisico?.total_pecas || (p.itens ? p.itens.length : 0);
    const etapaAnterior = this.getEtapaAnterior(p.etapa_patio);
    const proximaEtapa = this.getProximaEtapa(p.etapa_patio);

    return `
      <div class="kanban-card" onclick="PatioModule.abrirChecklistSeparacao('${p.id}')">
        <div class="kanban-card-header">
          <span class="kanban-card-num">#${p.numero}</span>
          ${isBalcao ? '<span class="badge-tag" style="background: #ECFDF5; color: #047857; border: 1px solid #10B981; font-size: 10px; font-weight: 700;">⚡ Retirada Balcão</span>' : temPlaina ? '<span class="badge-tag badge-aparelhada">Requer Plaina</span>' : '<span class="badge-tag badge-bruta">Bruta</span>'}
        </div>
        <div class="kanban-card-client">${p.cliente?.nome || 'Cliente'}</div>
        <div class="kanban-card-meta">
          <div>Destino: <strong>${bairro}</strong></div>
          <div class="font-mono">${totalPecas} pçs | ${CalcEngine.formatKg(peso)}</div>
        </div>

        ${temSaldoCobrar ? `
          <div class="kanban-card-balance">
            Cobrar ${CalcEngine.formatBRL(saldoReceber)} na entrega
          </div>
        ` : `
          <div style="font-size: 11px; color: var(--color-success); font-weight: 600; margin-top: 5px; display: flex; align-items: center; gap: 4px;">
            <svg viewBox="0 0 24 24" style="width:12px;height:12px;stroke:currentColor;stroke-width:2.5;fill:none;"><polyline points="20 6 9 17 4 12"/></svg>
            Totalmente Pago / Quitado
          </div>
        `}

        <div class="kanban-card-footer">
          ${etapaAnterior ? `
            <button class="kanban-btn-nav" title="Voltar para ${this.getEtapaNome(etapaAnterior)}" onclick="event.stopPropagation(); PatioModule.moverEtapaPedido('${p.id}', '${etapaAnterior}')">
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
              <span>Voltar</span>
            </button>
          ` : `
            <button class="kanban-btn-nav" disabled title="Início do fluxo (primeira etapa)">
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
              <span>Início</span>
            </button>
          `}

          <button class="kanban-btn-nav" title="Imprimir Romaneio de Pátio" onclick="event.stopPropagation(); PrintModule.abrirModalImpressaoById('${p.id}', 'PATIO')">
            <svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            <span>Romaneio</span>
          </button>

          ${proximaEtapa ? `
            <button class="kanban-btn-nav ${proximaEtapa === 'ENTREGUE' ? 'btn-nav-success' : 'btn-nav-primary'}" title="Avançar para ${this.getEtapaNome(proximaEtapa)}" onclick="event.stopPropagation(); PatioModule.moverEtapaPedido('${p.id}', '${proximaEtapa}')">
              <span>${proximaEtapa === 'ENTREGUE' ? 'Concluir' : 'Avançar'}</span>
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          ` : `
            <button class="kanban-btn-nav btn-nav-success" disabled title="Entrega realizada">
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Entregue</span>
            </button>
          `}
        </div>
      </div>
    `;
  },

  abrirChecklistSeparacao(pedidoId) {
    const pedidos = DB.getPedidos();
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;

    this.activePedidoChecklist = JSON.parse(JSON.stringify(pedido));
    const modal = document.getElementById('modal-checklist-patio');
    if (!modal) return;

    document.getElementById('checklist-pedido-numero').textContent = `#${pedido.numero} - ${pedido.cliente?.nome || 'Cliente'}`;
    document.getElementById('checklist-pedido-destino').textContent = `${pedido.cliente?.bairro || 'Sem Bairro'} | Peso Total: ${CalcEngine.formatKg(pedido.resumo_fisico?.peso_total_kg || 0)}`;

    const alertCobrar = document.getElementById('checklist-alerta-cobrar');
    if (alertCobrar) {
      const saldo = pedido.resumo_financeiro?.saldo_a_receber || 0;
      if (saldo > 0) {
        alertCobrar.innerHTML = `<strong>Atenção Motorista:</strong> Cobrar <strong>${CalcEngine.formatBRL(saldo)}</strong> no ato do descarregamento!`;
        alertCobrar.style.display = 'block';
      } else {
        alertCobrar.style.display = 'none';
      }
    }

    // Se checklist estiver vazio, inicializa a partir dos itens
    if (!this.activePedidoChecklist.checklist_patio || !this.activePedidoChecklist.checklist_patio.length) {
      this.activePedidoChecklist.checklist_patio = (this.activePedidoChecklist.itens || []).map(item => ({
        item_id: item.id,
        descricao: `${item.quantidade}x ${item.descricao} ${item.comprimento_m ? '(' + item.comprimento_m + 'm)' : ''}`,
        cortado: false,
        carregado: false,
        requer_plaina: item.aparelhar
      }));
    }

    this.renderItensChecklistModal();
    this.renderBotoesAvancoEtapa(pedido.etapa_patio);

    modal.classList.add('active');
  },

  fecharChecklistSeparacao() {
    const modal = document.getElementById('modal-checklist-patio');
    if (modal) modal.classList.remove('active');
  },

  renderItensChecklistModal() {
    const container = document.getElementById('checklist-itens-container');
    if (!container) return;

    const checklist = this.activePedidoChecklist.checklist_patio;

    container.innerHTML = checklist.map((chk, idx) => `
      <div class="checklist-item ${chk.carregado ? 'checked' : ''}">
        <div style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" class="checkbox-custom" id="chk_${idx}" ${chk.carregado ? 'checked' : ''} onchange="PatioModule.toggleItemCarregado(${idx}, this.checked)">
          <label for="chk_${idx}" style="cursor: pointer; font-size: 12px; font-weight: 600;">
            ${chk.descricao}
            ${chk.requer_plaina ? '<span class="badge-tag badge-aparelhada" style="margin-left: 6px;">Passar na Plaina</span>' : ''}
          </label>
        </div>
        <div style="font-size: 11px;">
          ${chk.carregado 
            ? '<span style="color: var(--color-success); font-weight: 600; display: inline-flex; align-items: center; gap: 4px;"><svg viewBox="0 0 24 24" style="width:12px;height:12px;stroke:currentColor;stroke-width:2.5;fill:none;"><polyline points="20 6 9 17 4 12"/></svg> Conferido e Embarcado</span>' 
            : '<span style="color: var(--text-muted); font-weight: 500;">Pendente</span>'}
        </div>
      </div>
    `).join('');
  },

  toggleItemCarregado(idx, isChecked) {
    if (this.activePedidoChecklist.checklist_patio[idx]) {
      this.activePedidoChecklist.checklist_patio[idx].carregado = isChecked;
      this.activePedidoChecklist.checklist_patio[idx].cortado = isChecked;
      this.renderItensChecklistModal();
    }
  },

  renderBotoesAvancoEtapa(etapaAtual) {
    const actionsContainer = document.getElementById('checklist-actions-container');
    if (!actionsContainer) return;

    const etapaAnterior = this.getEtapaAnterior(etapaAtual);
    const proximaEtapa = this.getProximaEtapa(etapaAtual);

    let botoes = '';

    // Botão Voltar Etapa (se houver etapa anterior)
    if (etapaAnterior) {
      botoes += `
        <button class="btn btn-secondary" onclick="PatioModule.moverEtapa('${etapaAnterior}')" title="Voltar para ${this.getEtapaNome(etapaAnterior)}">
          <svg viewBox="0 0 24 24" style="width:13px;height:13px;stroke:currentColor;stroke-width:2.2;fill:none;vertical-align:middle;margin-right:4px;"><polyline points="15 18 9 12 15 6"/></svg>
          Voltar p/ ${this.getEtapaNome(etapaAnterior)}
        </button>
      `;
    }

    // Botão Avançar Etapa (se houver próxima etapa)
    if (proximaEtapa) {
      if (proximaEtapa === 'ENTREGUE') {
        botoes += `
          <button class="btn btn-success" onclick="PatioModule.moverEtapa('ENTREGUE')" title="Confirmar Entrega Realizada & Quitar Saldo">
            Confirmar Entrega Realizada
            <svg viewBox="0 0 24 24" style="width:13px;height:13px;stroke:currentColor;stroke-width:2.2;fill:none;vertical-align:middle;margin-left:4px;"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        `;
      } else {
        botoes += `
          <button class="btn btn-primary" onclick="PatioModule.moverEtapa('${proximaEtapa}')" title="Avançar para ${this.getEtapaNome(proximaEtapa)}">
            Avançar p/ ${this.getEtapaNome(proximaEtapa)}
            <svg viewBox="0 0 24 24" style="width:13px;height:13px;stroke:currentColor;stroke-width:2.2;fill:none;vertical-align:middle;margin-left:4px;"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        `;
      }
    } else {
      botoes += `
        <span style="font-size: 13px; color: var(--color-success); font-weight: 700; display: inline-flex; align-items: center; gap: 5px;">
          <svg viewBox="0 0 24 24" style="width:15px;height:15px;stroke:currentColor;stroke-width:2.5;fill:none;"><polyline points="20 6 9 17 4 12"/></svg>
          Pedido Finalizado e Entregue
        </span>
      `;
    }

    actionsContainer.innerHTML = botoes;
  },

  moverEtapa(novaEtapa) {
    if (!this.activePedidoChecklist) return;

    const etapaAnterior = this.activePedidoChecklist.etapa_patio;
    this.activePedidoChecklist.etapa_patio = novaEtapa;

    if (novaEtapa === 'ENTREGUE') {
      this.activePedidoChecklist.status = 'ENTREGUE';
      if (this.activePedidoChecklist.resumo_financeiro && this.activePedidoChecklist.resumo_financeiro.saldo_a_receber > 0) {
        this.activePedidoChecklist.resumo_financeiro._saldo_anterior_baixa = this.activePedidoChecklist.resumo_financeiro.saldo_a_receber;
        this.activePedidoChecklist.resumo_financeiro.valor_sinal = this.activePedidoChecklist.resumo_financeiro.valor_total;
        this.activePedidoChecklist.resumo_financeiro.saldo_a_receber = 0;
      }
    } else {
      // Revertendo de etapa
      if (this.activePedidoChecklist.status === 'ENTREGUE') {
        this.activePedidoChecklist.status = 'APROVADO';
        if (this.activePedidoChecklist.resumo_financeiro && this.activePedidoChecklist.resumo_financeiro._saldo_anterior_baixa) {
          this.activePedidoChecklist.resumo_financeiro.saldo_a_receber = this.activePedidoChecklist.resumo_financeiro._saldo_anterior_baixa;
          this.activePedidoChecklist.resumo_financeiro.valor_sinal = this.activePedidoChecklist.resumo_financeiro.valor_total - this.activePedidoChecklist.resumo_financeiro._saldo_anterior_baixa;
          delete this.activePedidoChecklist.resumo_financeiro._saldo_anterior_baixa;
        }
      }
    }

    DB.salvarPedido(this.activePedidoChecklist);
    this.fecharChecklistSeparacao();
    this.renderKanban();
    if (window.HistoricoModule) HistoricoModule.renderTabelaPedidos();
    if (window.PainelModule) PainelModule.atualizarIndicadores();
    App.showToast(`Pedido #${this.activePedidoChecklist.numero}: ${this.getEtapaNome(etapaAnterior)} → ${this.getEtapaNome(novaEtapa)}`, 'success');
  },

  moverEtapaPedido(pedidoId, novaEtapa) {
    const pedidos = DB.getPedidos();
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;

    const etapaAnterior = pedido.etapa_patio;
    pedido.etapa_patio = novaEtapa;

    if (novaEtapa === 'ENTREGUE') {
      pedido.status = 'ENTREGUE';
      if (pedido.resumo_financeiro && pedido.resumo_financeiro.saldo_a_receber > 0) {
        pedido.resumo_financeiro._saldo_anterior_baixa = pedido.resumo_financeiro.saldo_a_receber;
        pedido.resumo_financeiro.valor_sinal = pedido.resumo_financeiro.valor_total;
        pedido.resumo_financeiro.saldo_a_receber = 0;
      }
    } else {
      if (pedido.status === 'ENTREGUE') {
        pedido.status = 'APROVADO';
        if (pedido.resumo_financeiro && pedido.resumo_financeiro._saldo_anterior_baixa) {
          pedido.resumo_financeiro.saldo_a_receber = pedido.resumo_financeiro._saldo_anterior_baixa;
          pedido.resumo_financeiro.valor_sinal = pedido.resumo_financeiro.valor_total - pedido.resumo_financeiro._saldo_anterior_baixa;
          delete pedido.resumo_financeiro._saldo_anterior_baixa;
        }
      }
    }

    DB.salvarPedido(pedido);
    this.renderKanban();
    if (window.HistoricoModule) HistoricoModule.renderTabelaPedidos();
    if (window.PainelModule) PainelModule.atualizarIndicadores();
    App.showToast(`Pedido #${pedido.numero}: ${this.getEtapaNome(etapaAnterior)} → ${this.getEtapaNome(novaEtapa)}`, 'success');
  },

  salvarChecklist() {
    if (!this.activePedidoChecklist) return;
    DB.salvarPedido(this.activePedidoChecklist);
    this.fecharChecklistSeparacao();
    this.renderKanban();
    App.showToast('Checklist de separação salvo com sucesso!');
  }
};

window.PatioModule = PatioModule;

