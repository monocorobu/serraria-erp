/**
 * SERRARIA & MADEIREIRA ERP - MÓDULO 2: HISTÓRICO DE ORÇAMENTOS E VENDAS
 * Follow-up comercial, duplicador de orçamentos (comparativo de madeiras) e ações de 1 clique.
 */

const HistoricoModule = {
  currentFilter: 'TODOS',
  searchTerm: '',

  init() {
    this.renderTabelaPedidos();
    this.setupEventListeners();
  },

  setupEventListeners() {
    // Busca rápida
    const inputBusca = document.getElementById('hist-busca-input');
    if (inputBusca) {
      inputBusca.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.trim().toLowerCase();
        this.renderTabelaPedidos();
      });
    }

    // Filtros por pílula
    document.querySelectorAll('.filter-pill[data-filter]').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill[data-filter]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentFilter = pill.dataset.filter;
        this.renderTabelaPedidos();
      });
    });
  },

  renderTabelaPedidos() {
    const tbody = document.getElementById('hist-pedidos-tbody');
    const emptyState = document.getElementById('hist-pedidos-empty');
    if (!tbody) return;

    let pedidos = DB.getPedidos();

    // Filtra por status
    if (this.currentFilter === 'ORCAMENTO') {
      pedidos = pedidos.filter(p => p.status === 'ORCAMENTO');
    } else if (this.currentFilter === 'APROVADO') {
      pedidos = pedidos.filter(p => p.status === 'APROVADO');
    } else if (this.currentFilter === 'SALDO_ENTREGA') {
      pedidos = pedidos.filter(p => p.resumo_financeiro && p.resumo_financeiro.saldo_a_receber > 0 && p.status !== 'CANCELADO');
    } else if (this.currentFilter === 'ENTREGUE') {
      pedidos = pedidos.filter(p => p.status === 'ENTREGUE');
    }

    // Filtra por termo de busca
    if (this.searchTerm) {
      pedidos = pedidos.filter(p => 
        (p.numero && p.numero.toString().includes(this.searchTerm)) ||
        (p.cliente && p.cliente.nome && p.cliente.nome.toLowerCase().includes(this.searchTerm)) ||
        (p.cliente && p.cliente.bairro && p.cliente.bairro.toLowerCase().includes(this.searchTerm)) ||
        (p.cliente && p.cliente.telefone && p.cliente.telefone.includes(this.searchTerm)) ||
        (p.carpinteiro_nome && p.carpinteiro_nome.toLowerCase().includes(this.searchTerm))
      );
    }

    if (!pedidos.length) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = pedidos.map(p => {
      const dataFormatada = new Date(p.data_criacao).toLocaleDateString('pt-BR');
      const saldoReceber = p.resumo_financeiro?.saldo_a_receber || 0;
      const temSaldoPendente = saldoReceber > 0;

      let statusBadge = '';
      if (p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') {
        statusBadge = '<span class="badge-tag" style="background: #ECFDF5; color: #047857; border: 1px solid #10B981; font-weight: 700;">⚡ Balcão Quitado</span>';
      } else if (p.status === 'ORCAMENTO') {
        statusBadge = '<span class="badge-tag badge-orcamento">Orçamento</span>';
      } else if (p.status === 'APROVADO') {
        statusBadge = '<span class="badge-tag badge-aprovado">Venda Aprovada</span>';
      } else if (p.status === 'ENTREGUE') {
        statusBadge = '<span class="badge-tag badge-entregue">Entregue & Quitado</span>';
      } else {
        statusBadge = '<span class="badge-tag badge-cancelado">Cancelado</span>';
      }

      let etapaPatioBadge = '';
      if (p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') {
        etapaPatioBadge = '<span class="badge-tag" style="background: #F8FAFC; color: #475569; border: 1px solid #CBD5E1; font-weight: 600;">Retirada Balcão</span>';
      } else if (p.etapa_patio === 'CORTE_PLAINA') {
        etapaPatioBadge = '<span class="badge-tag badge-amber">Na Plaina / Serra</span>';
      } else if (p.etapa_patio === 'SEPARACAO') {
        etapaPatioBadge = '<span class="badge-tag badge-bruta">Em Separação</span>';
      } else if (p.etapa_patio === 'PRONTO_CARREGAR') {
        etapaPatioBadge = '<span class="badge-tag badge-aprovado">Pronto p/ Carregar</span>';
      } else if (p.etapa_patio === 'ENTREGUE') {
        etapaPatioBadge = '<span class="badge-tag badge-entregue">Descarregado</span>';
      } else {
        etapaPatioBadge = '<span style="color: var(--text-muted); font-size: 11px;">-</span>';
      }

      return `
        <tr>
          <td class="font-mono" style="font-weight: 700; color: var(--primary-green);">#${p.numero}</td>
          <td class="font-mono" style="font-size: 11px;">${dataFormatada}</td>
          <td>
            <strong>${p.cliente?.nome || 'Cliente Balcão'}</strong>
            <div style="font-size: 10.5px; color: var(--text-secondary);">
              ${p.cliente?.bairro ? `${p.cliente.bairro}` : ''} 
              ${p.carpinteiro_nome ? `| Ind: <em>${p.carpinteiro_nome}</em>` : ''}
            </div>
          </td>
          <td class="align-center">${statusBadge}</td>
          <td class="align-center">${etapaPatioBadge}</td>
          <td class="align-center font-mono" style="font-size: 11.5px;">
            ${p.resumo_fisico?.total_pecas || p.itens.length} pçs | ${CalcEngine.formatKg(p.resumo_fisico?.peso_total_kg || 0)}
          </td>
          <td class="align-right font-mono" style="font-weight: 700;">
            ${CalcEngine.formatBRL(p.resumo_financeiro?.valor_total || 0)}
          </td>
          <td class="align-right font-mono" style="font-weight: 700;">
            ${temSaldoPendente ? `
              <span style="color: var(--red-text); background-color: var(--red-bg); padding: 1px 4px; border-radius: 2px;">
                ${CalcEngine.formatBRL(saldoReceber)}
              </span>
            ` : '<span style="color: var(--action-green);">Quitado</span>'}
          </td>
          <td class="align-center" style="white-space: nowrap;">
            <button class="btn btn-sm btn-secondary" title="Reabrir no Balcão" onclick="BalcaoModule.carregarPedidoParaEdicao('${p.id}')">
              Balcão
            </button>
            <button class="btn btn-sm btn-secondary" title="Duplicar Orçamento (Comparativo de Madeira)" onclick="HistoricoModule.abrirModalDuplicar('${p.id}')">
              Duplicar
            </button>
            <button class="btn btn-sm btn-secondary" title="Cobrar Retorno no WhatsApp" onclick="HistoricoModule.cobrarRetornoWhatsapp('${p.id}')">
              WhatsApp
            </button>
            <button class="btn btn-sm btn-secondary" title="Imprimir Via Cliente" onclick="PrintModule.abrirModalImpressaoById('${p.id}', 'CLIENTE')">
              Via Cliente
            </button>
            <button class="btn btn-sm btn-secondary" title="Imprimir Via Pátio" onclick="PrintModule.abrirModalImpressaoById('${p.id}', 'PATIO')">
              Via Pátio
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  abrirModalDuplicar(pedidoId) {
    const pedidos = DB.getPedidos();
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;

    const modal = document.getElementById('modal-duplicar-pedido');
    if (!modal) return;

    modal.dataset.pedidoId = pedidoId;
    document.getElementById('duplicar-info-origem').textContent = `Pedido #${pedido.numero} - ${pedido.cliente?.nome || 'Cliente'} (${CalcEngine.formatBRL(pedido.resumo_financeiro?.valor_total || 0)})`;

    modal.classList.add('active');
  },

  fecharModalDuplicar() {
    const modal = document.getElementById('modal-duplicar-pedido');
    if (modal) modal.classList.remove('active');
  },

  confirmarDuplicacao() {
    const modal = document.getElementById('modal-duplicar-pedido');
    const pedidoId = modal.dataset.pedidoId;
    const pedidoOriginal = DB.getPedidos().find(p => p.id === pedidoId);
    if (!pedidoOriginal) return;

    const especieSubstituir = document.getElementById('duplicar-trocar-especie-select').value;
    const novoProdutoClonado = JSON.parse(JSON.stringify(pedidoOriginal));

    novoProdutoClonado.id = 'PED-' + DB.getNextNumeroPedido();
    novoProdutoClonado.numero = DB.getNextNumeroPedido();
    novoProdutoClonado.data_criacao = new Date().toISOString();
    novoProdutoClonado.status = 'ORCAMENTO';
    novoProdutoClonado.etapa_patio = 'NAO_ENVIADO';

    // Se o usuário selecionou trocar de madeira para comparar preço (ex: Garapeira vs Peroba Rosa vs Cupiúba)
    if (especieSubstituir !== 'MANTER') {
      const produtos = DB.getProdutos();
      novoProdutoClonado.itens.forEach(item => {
        // Encontra produto similar na nova espécie
        if (item.tipo_calculo === 'ML') {
          const match = produtos.find(p => p.especie === especieSubstituir && p.tipo_calculo === 'ML');
          if (match) {
            item.produto_id = match.id;
            item.codigo = match.codigo;
            item.descricao = match.nome;
            item.valor_unitario = match.preco_unitario;
            const calc = CalcEngine.calcularItem(item, match);
            Object.assign(item, calc);
          }
        }
      });

      // Recalcula totais
      const totais = CalcEngine.calcularTotaisOrcamento(
        novoProdutoClonado.itens,
        novoProdutoClonado.resumo_financeiro.valor_frete,
        novoProdutoClonado.resumo_financeiro.desconto_valor,
        novoProdutoClonado.resumo_financeiro.desconto_tipo,
        0
      );

      novoProdutoClonado.resumo_financeiro.subtotal_itens_puros = totais.subtotal_itens_puros;
      novoProdutoClonado.resumo_financeiro.taxa_aparelhamento = totais.taxa_aparelhamento;
      novoProdutoClonado.resumo_financeiro.subtotal_com_plaina = totais.subtotal_com_plaina;
      novoProdutoClonado.resumo_financeiro.valor_total = totais.valor_total;
      novoProdutoClonado.resumo_financeiro.valor_sinal = 0;
      novoProdutoClonado.resumo_financeiro.saldo_a_receber = totais.valor_total;
      novoProdutoClonado.resumo_fisico = {
        total_pecas: totais.total_pecas,
        volume_total_m3: totais.volume_total_m3,
        peso_total_kg: totais.peso_total_kg,
        veiculo_sugerido: totais.veiculo_sugerido
      };
    }

    DB.salvarPedido(novoProdutoClonado);
    this.fecharModalDuplicar();
    this.renderTabelaPedidos();
    
    // Carrega diretamente no balcão para o vendedor já visualizar e comparar!
    BalcaoModule.carregarPedidoParaEdicao(novoProdutoClonado.id);
    App.showToast(`Orçamento duplicado com sucesso (#${novoProdutoClonado.numero})!`, 'success');
  },

  cobrarRetornoWhatsapp(pedidoId) {
    const pedido = DB.getPedidos().find(p => p.id === pedidoId);
    if (!pedido) return;

    const tel = pedido.cliente?.telefone ? pedido.cliente.telefone.replace(/\D/g, '') : '';
    const nome = pedido.cliente?.nome || 'Cliente';
    const num = pedido.numero;
    const total = CalcEngine.formatBRL(pedido.resumo_financeiro?.valor_total || 0);

    const config = (typeof DB !== 'undefined' && DB.getConfig) ? DB.getConfig() : {};
    const nomeEmpresa = config.nome_madeireira || 'Serraria e Madeireira Bom Jesus';

    let texto = `Olá *${nome}*, tudo bem?\n`;
    texto += `Aqui é da *${nomeEmpresa}* (Caçapava - SP).\n\n`;
    texto += `Gostaria de saber se você conseguiu analisar a nossa proposta do *Orçamento #${num}* no valor de *${total}*.\n\n`;
    texto += `Temos os lotes de madeira selecionados prontos no nosso pátio para corte e entrega. Consegue nos dar um retorno para programarmos o carregamento para esta semana? Obrigado!`;

    const url = `https://api.whatsapp.com/send?phone=${tel.length >= 10 ? '55' + tel : ''}&text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  }
};

window.HistoricoModule = HistoricoModule;

