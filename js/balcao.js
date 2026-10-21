/**
 * SERRARIA & MADEIREIRA ERP - MÓDULO 1: BALCÃO / NOVO ORÇAMENTO
 * Alta velocidade estilo planilha, ergonomia de teclado, cálculo em tempo real.
 */

const BalcaoModule = {
  currentOrder: null,
  activeClientId: null,
  activeCarpenterId: null,

  // Estado reativo do combobox inteligente de produtos
  comboboxProdutos: {
    cached: [],
    filtrados: [],
    activeIndex: -1,
    isOpen: false,
    selectedId: null,
    ultimoTermo: '',
    eventsInitialized: false
  },

  // Controle de verificação e liberação de estoque físico no balcão
  _origemAcaoEstoque: null,
  _liberacaoEstoqueAutorizada: false,

  init() {
    this.iniciarNovoOrcamento();
    this.renderBairrosSelect();
    this.renderCarpinteirosSelect();
    this.renderVendedoresSelect();
    this.renderProdutosSelect();
    this.setupEventListeners();
  },

  iniciarNovoOrcamento() {
    this.currentOrder = {
      id: 'PED-' + DB.getNextNumeroPedido(),
      numero: DB.getNextNumeroPedido(),
      data_criacao: new Date().toISOString(),
      validade_dias: 7,
      status: 'ORCAMENTO',
      etapa_patio: 'NAO_ENVIADO',
      cliente: {
        id: '',
        nome: '',
        documento: '',
        telefone: '',
        email: '',
        endereco_obra: '',
        bairro: '',
        cidade: 'Caçapava',
        observacoes: ''
      },
      carpinteiro_id: '',
      carpinteiro_nome: '',
      itens: [],
      resumo_fisico: {
        total_pecas: 0,
        volume_total_m3: 0,
        peso_total_kg: 0,
        veiculo_sugerido: 'Picape Leve / Utilitário (Strada / Fiorino / S10)'
      },
      resumo_financeiro: {
        subtotal_itens_puros: 0,
        taxa_aparelhamento: 0,
        valor_frete: 0,
        bairro_frete: '',
        desconto_tipo: 'VALOR',
        desconto_valor: 0,
        desconto_percentual: 0,
        desconto_autorizado: false,
        valor_total: 0,
        percentual_bruto: 20.0,
        valor_total_bruto: 0,
        forma_pagamento: 'Pix',
        valor_sinal: 0,
        saldo_a_receber: 0
      },
      checklist_patio: [],
      observacoes_venda: ''
    };

    this.activeClientId = null;
    this.limparSelecaoProdutoRapido(false);
    this.renderFormularioCliente();
    this.ocultarAlertaCliente();
    this.renderTabelaItens();

    const inputSinal = document.getElementById('balcao-sinal-valor');
    if (inputSinal) inputSinal.value = '0.00';

    const inputFrete = document.getElementById('balcao-frete-valor');
    if (inputFrete) {
      inputFrete.value = '0.00';
      inputFrete.disabled = false;
    }

    const inputDesc = document.getElementById('balcao-desconto-valor');
    if (inputDesc) inputDesc.value = '0.00';

    const chkRetirada = document.getElementById('balcao-retirada-imediata');
    if (chkRetirada) chkRetirada.checked = false;

    const selectBairro = document.getElementById('balcao-bairro-frete');
    if (selectBairro) selectBairro.value = '';

    const obsVenda = document.getElementById('balcao-observacoes');
    if (obsVenda) obsVenda.value = '';

    this._origemAcaoEstoque = null;
    this._liberacaoEstoqueAutorizada = false;

    this.atualizarTotais();
    this.atualizarBadgeOrcamento('NOVO');
    
    // Foca na busca de cliente
    const inputBusca = document.getElementById('balcao-busca-cliente');
    if (inputBusca) inputBusca.focus();
  },

  carregarPedidoParaEdicao(pedidoId) {
    const pedidos = DB.getPedidos();
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) {
      App.showToast('Pedido não encontrado.', 'error');
      return;
    }

    // Clona o pedido para não mutar diretamente sem salvar
    this.currentOrder = JSON.parse(JSON.stringify(pedido));
    this.activeClientId = (pedido.cliente && pedido.cliente.id) || null;
    this.renderFormularioCliente();
    
    if (this.activeClientId) {
      this.verificarAlertaCliente(this.activeClientId);
    } else {
      this.ocultarAlertaCliente();
    }

    // Atualiza selects
    const selectVend = document.getElementById('balcao-vendedor-select');
    if (selectVend && pedido.vendedor) selectVend.value = pedido.vendedor.id || '';

    const selectCarp = document.getElementById('balcao-carpinteiro-select');
    if (selectCarp && pedido.carpinteiro_id) selectCarp.value = pedido.carpinteiro_id;

    const selectBairro = document.getElementById('balcao-bairro-frete');
    if (selectBairro && pedido.resumo_financeiro.bairro_frete) {
      selectBairro.value = pedido.resumo_financeiro.bairro_frete;
    }

    const selectFormaPgto = document.getElementById('balcao-forma-pagamento');
    if (selectFormaPgto && pedido.resumo_financeiro.forma_pagamento) {
      selectFormaPgto.value = pedido.resumo_financeiro.forma_pagamento;
    }

    const isRetiradaImediata = Boolean(pedido.finalizado_balcao || pedido.tipo_entrega === 'BALCAO_IMEDIATO');
    const chkRetirada = document.getElementById('balcao-retirada-imediata');
    if (chkRetirada) chkRetirada.checked = isRetiradaImediata;

    const inputFrete = document.getElementById('balcao-frete-valor');
    if (inputFrete) {
      inputFrete.value = pedido.resumo_financeiro.valor_frete || 0;
      inputFrete.disabled = isRetiradaImediata;
    }

    const inputDesconto = document.getElementById('balcao-desconto-valor');
    if (inputDesconto) inputDesconto.value = pedido.resumo_financeiro.desconto_valor || 0;

    const inputSinal = document.getElementById('balcao-sinal-valor');
    if (inputSinal) inputSinal.value = pedido.resumo_financeiro.valor_sinal || 0;

    const inputObs = document.getElementById('balcao-observacoes');
    if (inputObs) inputObs.value = pedido.observacoes_venda || '';

    this.renderTabelaItens();
    this.atualizarTotais();
    this.atualizarBadgeOrcamento('EDITANDO');
    App.switchTab('balcao');
    App.showToast(`Orçamento #${pedido.numero} carregado para edição no balcão.`, 'info');
  },

  setupEventListeners() {
    // Busca inteligente com autocomplete
    const buscaCliente = document.getElementById('balcao-busca-cliente');
    const dropdownCliente = document.getElementById('balcao-autocomplete-cliente');

    if (buscaCliente && dropdownCliente) {
      buscaCliente.addEventListener('input', (e) => {
        const termo = e.target.value.trim().toLowerCase();
        if (termo.length < 2) {
          dropdownCliente.innerHTML = '';
          dropdownCliente.style.display = 'none';
          return;
        }

        const clientes = DB.getClientes();
        const filtrados = clientes.filter(c => 
          c.nome.toLowerCase().includes(termo) ||
          (c.telefone && c.telefone.includes(termo)) ||
          (c.documento && c.documento.includes(termo)) ||
          (c.bairro && c.bairro.toLowerCase().includes(termo))
        );

        if (filtrados.length === 0) {
          dropdownCliente.innerHTML = `
            <div class="autocomplete-item" style="color: var(--text-muted); cursor: default;">
              <span>Nenhum cliente cadastrado. Pode preencher os dados abaixo para auto-cadastro ao salvar!</span>
            </div>
          `;
          dropdownCliente.style.display = 'block';
          return;
        }

        dropdownCliente.innerHTML = filtrados.map(c => `
          <div class="autocomplete-item" data-id="${c.id}">
            <div>
              <div class="autocomplete-item-name">${c.nome}</div>
              <div class="autocomplete-item-sub">${c.telefone || 'Sem fone'} | ${c.bairro || 'Sem bairro'} | Doc: ${c.documento || 'N/A'}</div>
            </div>
            ${c.saldo_devedor > 0 ? `<span class="badge-tag badge-cancelado">Deve R$ ${c.saldo_devedor.toFixed(2)}</span>` : ''}
          </div>
        `).join('');
        dropdownCliente.style.display = 'block';
      });

      dropdownCliente.addEventListener('click', (e) => {
        const item = e.target.closest('.autocomplete-item');
        if (item && item.dataset.id) {
          const clienteId = item.dataset.id;
          const cliente = DB.getClientes().find(c => c.id === clienteId);
          if (cliente) {
            this.selecionarCliente(cliente);
          }
          dropdownCliente.style.display = 'none';
        }
      });

      document.addEventListener('click', (e) => {
        if (!buscaCliente.contains(e.target) && !dropdownCliente.contains(e.target)) {
          dropdownCliente.style.display = 'none';
        }
      });
    }

    // Máscara inteligente para CPF/CNPJ e Telefone no Balcão
    const inputDocBalcao = document.getElementById('balcao-cliente-documento');
    const badgeDocBalcao = document.getElementById('balcao-doc-tipo-badge');
    if (inputDocBalcao && window.DocMascara) {
      DocMascara.aplicar(inputDocBalcao, badgeDocBalcao);
    }
    const inputTelBalcao = document.getElementById('balcao-cliente-telefone');
    if (inputTelBalcao && window.DocMascara) {
      DocMascara.aplicarTelefone(inputTelBalcao);
    }

    // Inicializa listeners do Combobox Inteligente de Produtos
    this.setupProdutoComboboxEvents();

    // Mudança de Produto na Barra Rápida
    const selectProd = document.getElementById('fast-produto-select');
    if (selectProd) {
      selectProd.addEventListener('change', () => {
        this.atualizarCamposProdutoRapido();
      });
    }

    // Mudança de Qtd / Largura / Comprimento / Preço na Barra Rápida
    ['fast-qtd-input', 'fast-largura-input', 'fast-comprimento-input', 'fast-preco-input'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          this.calcularSubtotalRapido();
          const selectProd = document.getElementById('fast-produto-select');
          if (selectProd && selectProd.value) {
            const qtdVal = parseFloat(document.getElementById('fast-qtd-input')?.value) || 1;
            this.atualizarIndicadorEstoqueRapido(selectProd.value, qtdVal);
          }
        });
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.adicionarItemRapido();
          }
        });
      }
    });

    // Botão Adicionar Item
    const btnAddItem = document.getElementById('fast-add-btn');
    if (btnAddItem) {
      btnAddItem.addEventListener('click', () => this.adicionarItemRapido());
    }

    // Botões de Kits Rápidos
    const btnKitCaixaria = document.getElementById('btn-kit-caixaria');
    if (btnKitCaixaria) {
      btnKitCaixaria.addEventListener('click', () => this.inserirKitCaixaria());
    }

    const btnKitTelhado = document.getElementById('btn-kit-telhado');
    if (btnKitTelhado) {
      btnKitTelhado.addEventListener('click', () => this.inserirKitTelhado());
    }

    const btnCalcTelhado = document.getElementById('btn-calc-telhado-modal');
    if (btnCalcTelhado) {
      btnCalcTelhado.addEventListener('click', () => this.abrirModalCalculadoraTelhado());
    }

    // Mudança de Bairro de Frete
    const selectBairro = document.getElementById('balcao-bairro-frete');
    if (selectBairro) {
      selectBairro.addEventListener('change', (e) => {
        const bairroNome = e.target.value;
        const bairros = DB.getBairros();
        const bairroObj = bairros.find(b => b.nome === bairroNome);
        const inputFrete = document.getElementById('balcao-frete-valor');
        if (bairroObj && inputFrete) {
          inputFrete.value = bairroObj.valor_frete.toFixed(2);
        }
        this.atualizarTotais();
      });
    }

    // Alteração de Frete, Desconto e Sinal
    ['balcao-frete-valor', 'balcao-desconto-valor', 'balcao-sinal-valor'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.atualizarTotais());
      }
    });

    // Tipo de Desconto (% ou R$)
    const selectTipoDesconto = document.getElementById('balcao-desconto-tipo');
    if (selectTipoDesconto) {
      selectTipoDesconto.addEventListener('change', () => this.atualizarTotais());
    }

    // Vendedor Select
    const selectVend = document.getElementById('balcao-vendedor-select');
    if (selectVend) {
      selectVend.addEventListener('change', (e) => {
        const funcId = e.target.value;
        const func = DB.getFuncionarios().find(f => f.id === funcId);
        this.currentOrder.vendedor = func ? {
          id: func.id,
          nome: func.nome,
          comissao_pct: func.comissao_pct || 0
        } : null;
      });
    }

    // Carpinteiro Select
    const selectCarp = document.getElementById('balcao-carpinteiro-select');
    if (selectCarp) {
      selectCarp.addEventListener('change', (e) => {
        this.currentOrder.carpinteiro_id = e.target.value;
        const carp = DB.getCarpinteiros().find(c => c.id === e.target.value);
        this.currentOrder.carpinteiro_nome = carp ? carp.nome : '';
      });
    }

    // Botões de Ação Final
    const btnSalvarOrcamento = document.getElementById('btn-salvar-orcamento');
    if (btnSalvarOrcamento) {
      btnSalvarOrcamento.addEventListener('click', () => this.salvarPedidoCompleto('ORCAMENTO'));
    }

    const btnAprovarVenda = document.getElementById('btn-aprovar-venda');
    if (btnAprovarVenda) {
      btnAprovarVenda.addEventListener('click', () => this.salvarPedidoCompleto('APROVADO'));
    }

    const btnFinalizarBalcao = document.getElementById('btn-finalizar-balcao');
    if (btnFinalizarBalcao) {
      btnFinalizarBalcao.addEventListener('click', () => this.finalizarVendaBalcaoImediata());
    }

    const btnImprimirCliente = document.getElementById('btn-imprimir-cliente-balcao');
    if (btnImprimirCliente) {
      btnImprimirCliente.addEventListener('click', () => {
        this.imprimirComprovanteBalcao('CLIENTE');
      });
    }

    const btnImprimirPatio = document.getElementById('btn-imprimir-patio-balcao');
    if (btnImprimirPatio) {
      btnImprimirPatio.addEventListener('click', () => {
        this.imprimirComprovanteBalcao('PATIO');
      });
    }

    const btnImprimirBalcao = document.getElementById('btn-imprimir-balcao');
    if (btnImprimirBalcao) {
      btnImprimirBalcao.addEventListener('click', () => {
        this.imprimirComprovanteBalcao('CLIENTE');
      });
    }

    const btnWhatsapp = document.getElementById('btn-whatsapp-balcao');
    if (btnWhatsapp) {
      btnWhatsapp.addEventListener('click', () => this.enviarResumoWhatsapp());
    }

    const btnNovoOrcamento = document.getElementById('btn-novo-orcamento');
    if (btnNovoOrcamento) {
      btnNovoOrcamento.addEventListener('click', () => {
        this.iniciarNovoOrcamento();
        App.showToast('Novo orçamento iniciado.', 'info');
      });
    }
  },

  // Atalhos Rápidos de Pagamento no Balcão
  definirPagamentoTotal() {
    this.atualizarTotais();
    const total = this.currentOrder.resumo_financeiro?.valor_total || 0;
    const inputSinal = document.getElementById('balcao-sinal-valor');
    if (inputSinal) {
      inputSinal.value = total.toFixed(2);
    }
    this.atualizarTotais();
    App.showToast(`Pagamento 100% integral selecionado (${CalcEngine.formatBRL(total)} - Quitado no balcão).`, 'success');
  },

  definirPagamentoMetade() {
    this.atualizarTotais();
    const total = this.currentOrder.resumo_financeiro?.valor_total || 0;
    const metade = Math.round((total / 2) * 100) / 100;
    const inputSinal = document.getElementById('balcao-sinal-valor');
    if (inputSinal) {
      inputSinal.value = metade.toFixed(2);
    }
    this.atualizarTotais();
    App.showToast(`Sinal de 50% (${CalcEngine.formatBRL(metade)}) definido.`, 'info');
  },

  zerarPagamentoSinal() {
    const inputSinal = document.getElementById('balcao-sinal-valor');
    if (inputSinal) {
      inputSinal.value = '0.00';
    }
    this.atualizarTotais();
    App.showToast('Valor de entrada / sinal zerado.', 'info');
  },

  aoAlternarRetiradaImediata(isRetirada) {
    const inputFrete = document.getElementById('balcao-frete-valor');
    const selectBairro = document.getElementById('balcao-bairro-frete');

    if (isRetirada) {
      if (inputFrete) {
        inputFrete.value = '0.00';
        inputFrete.disabled = true;
      }
      if (selectBairro) {
        selectBairro.value = '';
      }
      this.currentOrder.tipo_entrega = 'BALCAO_IMEDIATO';
      this.currentOrder.finalizado_balcao = true;
      App.showToast('Retirada Imediata no Balcão ativada (Sem frete e sem fila de corte do pátio).', 'info');
    } else {
      if (inputFrete) {
        inputFrete.disabled = false;
      }
      this.currentOrder.tipo_entrega = 'ENTREGA_PADRAO';
      this.currentOrder.finalizado_balcao = false;
      App.showToast('Modo de entrega padrão no endereço/obra reativado.', 'info');
    }

    this.atualizarTotais();
  },

  finalizarVendaBalcaoImediata() {
    if (!this.currentOrder || !this.currentOrder.itens || !this.currentOrder.itens.length) {
      App.showToast('Adicione pelo menos 1 item ao carrinho para finalizar a venda no balcão.', 'warning');
      return;
    }

    // Trava de segurança de desconto > 5% antes de prosseguir
    const tetoLivre = CalcEngine.getDescontoMaximoLivre();
    if (this.currentOrder.resumo_financeiro.desconto_percentual > tetoLivre && !this.currentOrder.resumo_financeiro.desconto_autorizado) {
      App.showToast(`Desconto acima de ${tetoLivre}% requer autorização do gerente!`, 'error');
      document.getElementById('balcao-senha-gerente')?.focus();
      return;
    }

    // Verificação de divergência ou falta de estoque físico no sistema
    const pendenciasEstoque = this.verificarEstoqueItens();
    if (pendenciasEstoque.length > 0 && !this._liberacaoEstoqueAutorizada) {
      this.abrirModalAlertaEstoque('FINALIZAR_BALCAO');
      return;
    }
    this._liberacaoEstoqueAutorizada = false;

    // Ativa checkbox de retirada imediata e zera o frete
    const chkRetirada = document.getElementById('balcao-retirada-imediata');
    if (chkRetirada) chkRetirada.checked = true;

    const inputFrete = document.getElementById('balcao-frete-valor');
    if (inputFrete) {
      inputFrete.value = '0.00';
      inputFrete.disabled = true;
    }

    const selectBairro = document.getElementById('balcao-bairro-frete');
    if (selectBairro) selectBairro.value = '';

    // Recalcula totais sem frete
    this.atualizarTotais();
    const total = this.currentOrder.resumo_financeiro?.valor_total || 0;

    // Seta 100% no campo de sinal / valor pago
    const inputSinal = document.getElementById('balcao-sinal-valor');
    if (inputSinal) {
      inputSinal.value = total.toFixed(2);
    }
    this.atualizarTotais();

    this.currentOrder.tipo_entrega = 'BALCAO_IMEDIATO';
    this.currentOrder.finalizado_balcao = true;

    // Salva com status 'ENTREGUE' (com trava estrita de estoque)
    const pedidoSalvo = this.salvarPedidoCompleto('ENTREGUE');

    if (pedidoSalvo) {
      // Abre comprovante / recibo para impressão imediata
      if (window.PrintModule) {
        PrintModule.abrirModalImpressao(pedidoSalvo, 'CLIENTE');
      }

      // Prepara tela do balcão para o próximo atendimento
      this.iniciarNovoOrcamento();
      App.showToast(`⚡ Venda #${pedidoSalvo.numero} finalizada e quitada no balcão!`, 'success');
    }
  },

  // =========================================================================
  // SISTEMA DE VERIFICAÇÃO E CONFERÊNCIA INTELIGENTE DE ESTOQUE
  // =========================================================================
  atualizarIndicadorEstoqueRapido(produtoId, qtd = 1) {
    const badge = document.getElementById('fast-produto-estoque-badge');
    if (!badge) return;

    if (!produtoId) {
      badge.innerHTML = '';
      badge.style.display = 'none';
      return;
    }

    const produto = DB.getProdutos().find(p => p.id === produtoId);
    if (!produto) {
      badge.innerHTML = '';
      badge.style.display = 'none';
      return;
    }

    const estoque = parseFloat(produto.estoque_atual) || 0;
    const unid = produto.unidade_medida || produto.tipo_calculo || 'un';
    const qtdNum = parseFloat(qtd) || 0;

    badge.style.display = 'block';

    if (estoque <= 0) {
      badge.innerHTML = `
        <span class="badge-tag" style="background: #FEF2F2; color: #DC2626; border: 1px solid #FCA5A5; padding: 2px 8px; border-radius: 4px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
          <span>⚠️</span> <span>ESTOQUE DIGITAL ZERADO (0 ${unid})</span> — <em>Conferir fisicamente no balcão</em>
        </span>
      `;
    } else if (qtdNum > estoque) {
      badge.innerHTML = `
        <span class="badge-tag" style="background: #FFFBEB; color: #D97706; border: 1px solid #FCD34D; padding: 2px 8px; border-radius: 4px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
          <span>⚠️</span> <span>Estoque insuficiente no sistema:</span> Disponível <strong>${estoque} ${unid}</strong> (pedido: ${qtdNum})
        </span>
      `;
    } else {
      badge.innerHTML = `
        <span class="badge-tag" style="background: #ECFDF5; color: #047857; border: 1px solid #10B981; padding: 2px 8px; border-radius: 4px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
          <span>✓</span> <span>Estoque disponível no sistema:</span> <strong>${estoque} ${unid}</strong>
        </span>
      `;
    }
  },

  verificarEstoqueItens() {
    const produtos = DB.getProdutos();
    const pendencias = [];

    for (const item of (this.currentOrder.itens || [])) {
      const qtdPedida = parseFloat(item.quantidade) || 0;

      // Busca produto com múltiplas estratégias seguras
      const prod = produtos.find(p => 
        (item.produto_id && (p.id === item.produto_id || String(p.id) === String(item.produto_id))) ||
        (item.codigo && p.codigo && p.codigo.trim().toUpperCase() === item.codigo.trim().toUpperCase()) ||
        (item.descricao && p.nome && (p.nome.trim().toLowerCase() === item.descricao.trim().toLowerCase() || item.descricao.toLowerCase().includes(p.nome.toLowerCase())))
      );

      if (!prod) {
        // Se o produto não consta cadastrado ou não foi localizado no catálogo
        pendencias.push({
          item,
          produto: {
            id: item.produto_id || ('prod_temp_' + (item.codigo || Math.random().toString(36).substr(2, 5))),
            codigo: item.codigo || 'SEM-COD',
            nome: item.descricao || 'Item sem cadastro',
            unidade_medida: item.tipo_calculo || 'un',
            estoque_atual: 0
          },
          tipo: 'ZERADO',
          estoque: 0,
          qtdPedida,
          unidade: item.tipo_calculo || 'un',
          motivo: 'Estoque ZERADO no sistema (0 un)'
        });
        continue;
      }

      const estoque = parseFloat(prod.estoque_atual) || 0;
      const unidade = prod.unidade_medida || prod.tipo_calculo || 'un';

      if (estoque <= 0) {
        pendencias.push({
          item,
          produto: prod,
          tipo: 'ZERADO',
          estoque,
          qtdPedida,
          unidade,
          motivo: 'Estoque ZERADO no sistema (0 un)'
        });
      } else if (qtdPedida > estoque) {
        pendencias.push({
          item,
          produto: prod,
          tipo: 'INSUFICIENTE',
          estoque,
          qtdPedida,
          unidade,
          motivo: `Quantidade pedida (${qtdPedida}) é maior que estoque (${estoque})`
        });
      }
    }

    return pendencias;
  },

  abrirModalAlertaEstoque(origemAcao = 'FINALIZAR_BALCAO') {
    this._origemAcaoEstoque = origemAcao;
    const modal = document.getElementById('modal-alerta-estoque-balcao');
    const tbody = document.getElementById('lista-alertas-estoque-tbody');
    if (!modal || !tbody) return;

    const pendencias = this.verificarEstoqueItens();
    if (!pendencias.length) {
      App.showToast('Todos os itens possuem estoque suficiente.', 'success');
      return;
    }

    tbody.innerHTML = pendencias.map(p => {
      const isZerado = p.tipo === 'ZERADO';
      return `
        <tr id="linha-alerta-est-${p.produto.id}">
          <td>
            <div class="font-mono" style="font-weight: 700; color: var(--primary-green); font-size: 11px;">${p.produto.codigo}</div>
            <strong style="font-size: 12.5px;">${p.produto.nome}</strong>
          </td>
          <td class="align-center font-mono" style="font-weight: 700; font-size: 13px;">
            ${p.qtdPedida} <span style="font-size: 11px; font-weight: normal; color: var(--text-muted);">${p.unidade}</span>
          </td>
          <td class="align-center font-mono" style="font-weight: 700; font-size: 13px; color: ${isZerado ? '#DC2626' : '#D97706'};">
            ${p.estoque} <span style="font-size: 11px; font-weight: normal; color: var(--text-muted);">${p.unidade}</span>
          </td>
          <td class="align-center">
            ${isZerado 
              ? '<span class="badge-tag" style="background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; font-size: 10.5px; font-weight: 700;">● ZERADO NO SISTEMA</span>' 
              : '<span class="badge-tag" style="background: #FEF3C7; color: #D97706; border: 1px solid #FCD34D; font-size: 10.5px; font-weight: 700;">● SALDO INSUFICIENTE</span>'}
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 6px;">
              <input type="number" min="0" step="1" id="input-ajuste-est-${p.produto.id}" class="form-input font-mono" style="width: 85px; height: 28px; padding: 2px 6px; font-size: 12px;" placeholder="${Math.max(p.qtdPedida, p.estoque + 10)}" title="Digite a quantidade real que você encontrou na prateleira">
              <button type="button" class="btn btn-sm btn-primary" onclick="BalcaoModule.salvarEstoqueRapidoPeloModal('${p.produto.id}')" style="padding: 2px 10px; font-size: 11px; white-space: nowrap; height: 28px;">
                ✓ Salvar Estoque
              </button>
            </div>
            <div id="msg-ajuste-est-${p.produto.id}" style="font-size: 10px; margin-top: 2px; display: none;"></div>
          </td>
        </tr>
      `;
    }).join('');

    modal.classList.add('active');
  },

  fecharModalAlertaEstoque() {
    const modal = document.getElementById('modal-alerta-estoque-balcao');
    if (modal) modal.classList.remove('active');
    this._origemAcaoEstoque = null;
  },

  salvarEstoqueRapidoPeloModal(prodId) {
    const input = document.getElementById(`input-ajuste-est-${prodId}`);
    const msg = document.getElementById(`msg-ajuste-est-${prodId}`);
    if (!input) return;

    const novoValor = parseFloat(input.value);
    if (isNaN(novoValor) || novoValor < 0) {
      App.showToast('Informe uma quantidade válida para o estoque.', 'warning');
      input.focus();
      return;
    }

    const prod = DB.ajustarEstoque(prodId, novoValor, true);
    if (!prod) return;

    // Atualiza todos os módulos para sincronização total
    if (window.EstoqueModule) {
      EstoqueModule.renderCardsKPI();
      EstoqueModule.renderTabelaEstoque();
    }
    if (window.PrecosModule) PrecosModule.renderTabelaPrecos();
    this.renderProdutosSelect();
    this.renderTabelaItens();

    App.showToast(`Estoque de "${prod.nome}" atualizado para ${prod.estoque_atual} ${prod.unidade_medida || 'un'} com sucesso!`, 'success');

    if (msg) {
      msg.textContent = `✓ Estoque atualizado para ${prod.estoque_atual} ${prod.unidade_medida || 'un'}`;
      msg.style.color = '#059669';
      msg.style.display = 'block';
    }

    // Revalida as pendências restantes
    const restantes = this.verificarEstoqueItens();
    if (restantes.length === 0) {
      setTimeout(() => {
        this.fecharModalAlertaEstoque();
        App.showToast('Todos os itens foram regularizados no estoque! Prosseguindo...', 'info');
        if (this._origemAcaoEstoque === 'FINALIZAR_BALCAO') {
          this.finalizarVendaBalcaoImediata();
        } else if (this._origemAcaoEstoque === 'APROVAR_VENDA') {
          this.salvarPedidoCompleto('APROVADO');
        }
      }, 500);
    } else {
      // Re-renderiza o modal com os que ainda faltam
      this.abrirModalAlertaEstoque(this._origemAcaoEstoque);
    }
  },

  confirmarVendaComDivergenciaEstoque() {
    this._liberacaoEstoqueAutorizada = true;
    const origem = this._origemAcaoEstoque;
    this.fecharModalAlertaEstoque();

    App.showToast('Venda liberada após conferência física de mercadoria no balcão.', 'info');

    if (origem === 'FINALIZAR_BALCAO') {
      this.finalizarVendaBalcaoImediata();
    } else if (origem === 'APROVAR_VENDA') {
      this.salvarPedidoCompleto('APROVADO');
    }
  },

  renderBairrosSelect() {
    const selectBairro = document.getElementById('balcao-bairro-frete');
    if (!selectBairro) return;

    const bairros = DB.getBairros();
    selectBairro.innerHTML = `
      <option value="">Selecione o Bairro / Destino</option>
      ${bairros.map(b => `<option value="${b.nome}">${b.nome} (+ R$ ${b.valor_frete.toFixed(2)})</option>`).join('')}
      <option value="OUTRO">Outro Bairro / Frete Manual</option>
    `;
  },

  renderCarpinteirosSelect() {
    const selectCarp = document.getElementById('balcao-carpinteiro-select');
    if (!selectCarp) return;

    const carpinteiros = DB.getCarpinteiros();
    selectCarp.innerHTML = `
      <option value="">Nenhum (Venda Direta de Balcão)</option>
      ${carpinteiros.map(c => `<option value="${c.id}">${c.nome} (${c.comissao_padrao_pct}% comissão)</option>`).join('')}
    `;
  },

  renderVendedoresSelect() {
    const selectVend = document.getElementById('balcao-vendedor-select');
    if (!selectVend) return;

    const funcionarios = DB.getFuncionarios().filter(f => f.ativo);
    selectVend.innerHTML = `
      <option value="">Selecione o Vendedor / Atendente...</option>
      ${funcionarios.map(f => `<option value="${f.id}">${f.nome} (${f.cargo})</option>`).join('')}
    `;

    // Se estiver logado como funcionário, trava no vendedor correspondente
    if (window.AuthModule && !AuthModule.isAdmin()) {
      const usuario = AuthModule.getUsuarioAtual();
      if (usuario && usuario.funcionario_id) {
        selectVend.value = usuario.funcionario_id;
        selectVend.disabled = true;
        const func = funcionarios.find(f => f.id === usuario.funcionario_id);
        if (func) {
          this.currentOrder.vendedor = {
            id: func.id,
            nome: func.nome,
            comissao_pct: func.comissao_pct || 0
          };
        }
        return;
      }
    } else {
      selectVend.disabled = false;
    }

    // Seleciona o primeiro vendedor por padrão se houver
    if (funcionarios.length > 0 && !selectVend.value) {
      selectVend.value = funcionarios[0].id;
      this.currentOrder.vendedor = {
        id: funcionarios[0].id,
        nome: funcionarios[0].nome,
        comissao_pct: funcionarios[0].comissao_pct || 0
      };
    }
  },

  // Helper para normalização de texto sem acentos e minúsculo
  normalizarTexto(str) {
    return (str || '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  },

  // Helper para escapar HTML com segurança
  escaparHtml(str) {
    return (str || '')
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Destaca as palavras da busca com marcação visual de alta legibilidade
  destacarCorrespondencia(texto, tokens) {
    if (!texto) return '';
    if (!tokens || !tokens.length) return this.escaparHtml(texto);

    const mapAcentos = {
      'a': '[aáàãâä]',
      'e': '[eéèêë]',
      'i': '[iíìîï]',
      'o': '[oóòõôö]',
      'u': '[uúùûü]',
      'c': '[cç]'
    };

    const padroes = tokens.map(token => {
      const esc = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      let pat = '';
      for (const ch of esc.toLowerCase()) {
        pat += mapAcentos[ch] || ch;
      }
      return pat;
    }).filter(Boolean);

    if (!padroes.length) return this.escaparHtml(texto);

    try {
      const regex = new RegExp('(' + padroes.join('|') + ')', 'gi');
      const seguro = this.escaparHtml(texto);
      return seguro.replace(regex, '<mark class="combobox-highlight">$1</mark>');
    } catch (e) {
      return this.escaparHtml(texto);
    }
  },

  renderProdutosSelect() {
    const selectProd = document.getElementById('fast-produto-select');
    const inputSearch = document.getElementById('fast-produto-search');
    const statusCount = document.getElementById('fast-produto-status-count');

    const produtos = DB.getProdutos().filter(p => p.ativo);
    
    // Atualiza o cache indexado inteligente do combobox
    this.comboboxProdutos.cached = produtos.map(p => {
      const codeNorm = this.normalizarTexto(p.codigo);
      const nameNorm = this.normalizarTexto(p.nome);
      const catNorm = this.normalizarTexto(p.categoria || '');
      const espNorm = this.normalizarTexto(p.especie || '');
      const dimNorm = (p.espessura_cm && p.largura_cm) ? `${p.espessura_cm}x${p.largura_cm} ${p.espessura_cm} x ${p.largura_cm}` : '';
      
      return {
        ...p,
        _codeNorm: codeNorm,
        _nameNorm: nameNorm,
        _catNorm: catNorm,
        _espNorm: espNorm,
        _searchCombined: `${codeNorm} ${nameNorm} ${catNorm} ${espNorm} ${dimNorm} ${p.tipo_calculo || ''} ${p.unidade_medida || ''}`.replace(/,/g, '.')
      };
    });

    const totalItens = this.comboboxProdutos.cached.length;

    if (inputSearch && !this.comboboxProdutos.selectedId) {
      inputSearch.placeholder = `Selecione ou digite para filtrar (${totalItens} itens disponíveis)...`;
    }

    if (statusCount) {
      statusCount.textContent = `${totalItens} produtos disponíveis`;
    }

    // Mantém o select original populado para compatibilidade total
    if (selectProd) {
      const categorias = {};
      produtos.forEach(p => {
        const cat = p.categoria || 'Geral';
        if (!categorias[cat]) categorias[cat] = [];
        categorias[cat].push(p);
      });

      let html = `<option value="">Selecione o Produto ou Digite o Código (${totalItens} itens disponíveis)...</option>`;
      for (const [cat, prods] of Object.entries(categorias)) {
        html += `<optgroup label="[${cat.toUpperCase()}] (${prods.length} itens)">`;
        prods.forEach(p => {
          html += `
            <option value="${p.id}" data-tipo="${p.tipo_calculo}" data-preco="${p.preco_unitario}">
              [${p.codigo}] ${p.nome} - R$ ${p.preco_unitario.toFixed(2)}/${p.unidade_medida || p.tipo_calculo}
            </option>
          `;
        });
        html += '</optgroup>';
      }
      selectProd.innerHTML = html;
    }
  },

  filtrarProdutos(termo) {
    const cached = this.comboboxProdutos.cached || [];
    const raw = (termo || '').trim();
    if (!raw) {
      return {
        itens: cached.slice(0, 40),
        total: cached.length,
        tokens: [],
        isBusca: false
      };
    }

    const normTermo = this.normalizarTexto(raw).replace(/,/g, '.');
    const tokens = normTermo.split(/\s+/).filter(Boolean);

    const pontuados = [];

    for (const p of cached) {
      let matchAll = true;
      for (const token of tokens) {
        if (!p._searchCombined.includes(token)) {
          matchAll = false;
          break;
        }
      }
      if (!matchAll) continue;

      let score = 0;

      // Prioridade máxima para código exato ou prefixo
      if (p._codeNorm === normTermo) score += 10000;
      else if (p._codeNorm.startsWith(normTermo)) score += 5000;
      else if (p._codeNorm.includes(normTermo)) score += 3000;

      // Nome do produto
      if (p._nameNorm.startsWith(normTermo)) score += 2000;
      else if (p._nameNorm.includes(normTermo)) score += 1200;
      else {
        for (const token of tokens) {
          if (p._nameNorm.includes(token)) score += 250;
        }
      }

      // Categoria ou Espécie
      if (p._catNorm.includes(normTermo)) score += 300;
      if (p._espNorm.includes(normTermo)) score += 300;

      // Itens em estoque têm preferência
      if (p.estoque_atual > 0) score += 50;

      pontuados.push({ produto: p, score });
    }

    pontuados.sort((a, b) => b.score - a.score);

    return {
      itens: pontuados.slice(0, 50).map(x => x.produto),
      total: pontuados.length,
      tokens: tokens,
      isBusca: true
    };
  },

  renderDropdownProdutos(termo) {
    const resultsContainer = document.getElementById('fast-produto-results');
    const statusCount = document.getElementById('fast-produto-status-count');
    const footerInfo = document.getElementById('fast-produto-footer');
    if (!resultsContainer) return;

    const { itens, total, tokens, isBusca } = this.filtrarProdutos(termo);
    this.comboboxProdutos.filtrados = itens;
    this.comboboxProdutos.ultimoTermo = termo;

    if (this.comboboxProdutos.activeIndex >= itens.length) {
      this.comboboxProdutos.activeIndex = itens.length ? 0 : -1;
    }

    if (statusCount) {
      if (!isBusca) {
        statusCount.textContent = `${total} itens disponíveis (digite para filtrar)`;
      } else if (total === 0) {
        statusCount.textContent = `Nenhum resultado para "${termo}"`;
      } else if (total === 1) {
        statusCount.textContent = `1 produto correspondente`;
      } else {
        statusCount.textContent = `${total} produtos encontrados`;
      }
    }

    if (footerInfo) {
      if (total > itens.length) {
        footerInfo.style.display = 'block';
        footerInfo.textContent = `Mostrando os primeiros ${itens.length} de ${total} resultados. Digite mais detalhes para refinar.`;
      } else {
        footerInfo.style.display = 'none';
      }
    }

    if (itens.length === 0) {
      resultsContainer.innerHTML = `
        <div class="combobox-empty-state">
          <svg class="combobox-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <div class="combobox-empty-title">Nenhum produto encontrado para "${this.escaparHtml(termo)}"</div>
          <div class="combobox-empty-hint">Tente buscar por código (ex: 1-001, MAD-010), categoria (Madeiras, Ferragens), espécie (Peroba, Pinus) ou dimensões (ex: 6x12).</div>
        </div>
      `;
      return;
    }

    let html = '';
    let lastCat = null;

    itens.forEach((p, index) => {
      const isActive = index === this.comboboxProdutos.activeIndex;
      const isSelected = p.id === this.comboboxProdutos.selectedId;

      if (!isBusca && p.categoria && p.categoria !== lastCat) {
        lastCat = p.categoria;
        html += `<div class="combobox-category-header">${this.escaparHtml(p.categoria)}</div>`;
      }

      const highlightedName = this.destacarCorrespondencia(p.nome, tokens);
      const highlightedCode = this.destacarCorrespondencia(p.codigo, tokens);
      const dimStr = (p.espessura_cm && p.largura_cm) ? `${p.espessura_cm}x${p.largura_cm} cm` : '';

      let stockBadge = '';
      if (p.estoque_atual > 10) {
        stockBadge = `<span class="combobox-tag-stock in-stock" title="Estoque disponível">● ${p.estoque_atual} ${p.unidade_medida || 'UN'}</span>`;
      } else if (p.estoque_atual > 0) {
        stockBadge = `<span class="combobox-tag-stock low-stock" title="Estoque baixo">● ${p.estoque_atual} ${p.unidade_medida || 'UN'}</span>`;
      } else {
        stockBadge = `<span class="combobox-tag-stock out-of-stock" title="Sem estoque físico">○ Sem estoque</span>`;
      }

      html += `
        <div class="combobox-item ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}" 
             data-index="${index}" 
             data-id="${p.id}">
          <div class="combobox-item-top">
            <div class="combobox-item-main">
              <span class="combobox-item-code">${highlightedCode}</span>
              <span class="combobox-item-name">${highlightedName}</span>
            </div>
            <div class="combobox-item-price">R$ ${p.preco_unitario.toFixed(2)}/${p.unidade_medida || p.tipo_calculo}</div>
          </div>
          <div class="combobox-item-bottom">
            <span class="combobox-tag-cat">${this.escaparHtml(p.categoria || 'Geral')}</span>
            ${p.especie ? `<span class="combobox-tag-dim">${this.escaparHtml(p.especie)}</span>` : ''}
            ${dimStr ? `<span class="combobox-tag-dim">${dimStr}</span>` : ''}
            ${stockBadge}
          </div>
        </div>
      `;
    });

    resultsContainer.innerHTML = html;
    this.garantirItemVisivel();
  },

  atualizarItemAtivoVisual() {
    const resultsContainer = document.getElementById('fast-produto-results');
    if (!resultsContainer) return;

    resultsContainer.querySelectorAll('.combobox-item').forEach(el => {
      const idx = parseInt(el.dataset.index, 10);
      if (idx === this.comboboxProdutos.activeIndex) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    this.garantirItemVisivel();
  },

  garantirItemVisivel() {
    const resultsContainer = document.getElementById('fast-produto-results');
    if (!resultsContainer) return;

    const activeEl = resultsContainer.querySelector('.combobox-item.active');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  },

  abrirComboboxProdutos() {
    const dropdown = document.getElementById('fast-produto-dropdown');
    const toggleBtn = document.getElementById('fast-produto-toggle');
    const searchInput = document.getElementById('fast-produto-search');
    if (!dropdown) return;

    this.comboboxProdutos.isOpen = true;
    dropdown.style.display = 'flex';
    if (toggleBtn) toggleBtn.classList.add('open');

    let buscaTermo = '';
    if (this.comboboxProdutos.selectedId) {
      if (searchInput) searchInput.select();
      buscaTermo = '';
    } else if (searchInput) {
      buscaTermo = searchInput.value.trim();
    }
    
    this.renderDropdownProdutos(buscaTermo);
  },

  fecharComboboxProdutos() {
    const dropdown = document.getElementById('fast-produto-dropdown');
    const toggleBtn = document.getElementById('fast-produto-toggle');
    if (!dropdown) return;

    this.comboboxProdutos.isOpen = false;
    dropdown.style.display = 'none';
    if (toggleBtn) toggleBtn.classList.remove('open');
    this.comboboxProdutos.activeIndex = -1;

    const searchInput = document.getElementById('fast-produto-search');
    if (searchInput) {
      if (this.comboboxProdutos.selectedId) {
        const p = (this.comboboxProdutos.cached || []).find(item => item.id === this.comboboxProdutos.selectedId);
        if (p) {
          searchInput.value = `[${p.codigo}] ${p.nome}`;
        }
      }
    }
  },

  selecionarProdutoRapido(produtoId) {
    const produto = (this.comboboxProdutos.cached || []).find(p => p.id === produtoId) || DB.getProdutos().find(p => p.id === produtoId);
    if (!produto) return;

    this.comboboxProdutos.selectedId = produto.id;

    const searchInput = document.getElementById('fast-produto-search');
    const selectProd = document.getElementById('fast-produto-select');
    const clearBtn = document.getElementById('fast-produto-clear');

    if (searchInput) {
      searchInput.value = `[${produto.codigo}] ${produto.nome}`;
      searchInput.classList.add('has-value');
    }

    if (clearBtn) {
      clearBtn.style.display = 'flex';
    }

    if (selectProd) {
      selectProd.value = produto.id;
      this.atualizarCamposProdutoRapido();
    }

    this.fecharComboboxProdutos();

    // Foca inteligentemente no próximo campo para linha de montagem de alta velocidade
    setTimeout(() => {
      if (produto.tipo_calculo === 'ML') {
        const compInput = document.getElementById('fast-comprimento-input');
        if (compInput) {
          compInput.focus();
          compInput.select();
        }
      } else {
        const qtdInput = document.getElementById('fast-qtd-input');
        if (qtdInput) {
          qtdInput.focus();
          qtdInput.select();
        }
      }
    }, 40);
  },

  limparSelecaoProdutoRapido(manterFoco = false) {
    this.comboboxProdutos.selectedId = null;
    this.comboboxProdutos.activeIndex = -1;

    const searchInput = document.getElementById('fast-produto-search');
    const selectProd = document.getElementById('fast-produto-select');
    const clearBtn = document.getElementById('fast-produto-clear');
    const inputPreco = document.getElementById('fast-preco-input');
    const subtotalEl = document.getElementById('fast-subtotal-preview');

    if (searchInput) {
      searchInput.value = '';
      searchInput.classList.remove('has-value');
      if (manterFoco) searchInput.focus();
    }

    if (clearBtn) {
      clearBtn.style.display = 'none';
    }

    if (selectProd) {
      selectProd.value = '';
    }

    if (inputPreco) inputPreco.value = '0.00';
    if (subtotalEl) subtotalEl.textContent = 'R$ 0,00';

    const inputLargura = document.getElementById('fast-largura-input');
    if (inputLargura) inputLargura.value = '';

    const estBadge = document.getElementById('fast-produto-estoque-badge');
    if (estBadge) {
      estBadge.innerHTML = '';
      estBadge.style.display = 'none';
    }
  },

  setupProdutoComboboxEvents() {
    if (this.comboboxProdutos.eventsInitialized) return;
    this.comboboxProdutos.eventsInitialized = true;

    const searchInput = document.getElementById('fast-produto-search');
    const clearBtn = document.getElementById('fast-produto-clear');
    const toggleBtn = document.getElementById('fast-produto-toggle');
    const resultsContainer = document.getElementById('fast-produto-results');
    const selectProd = document.getElementById('fast-produto-select');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const termo = e.target.value.trim();
      if (clearBtn) {
        clearBtn.style.display = termo ? 'flex' : 'none';
      }
      if (!this.comboboxProdutos.isOpen) {
        this.abrirComboboxProdutos();
      }
      if (this.comboboxProdutos.selectedId) {
        this.comboboxProdutos.selectedId = null;
        if (selectProd) selectProd.value = '';
      }
      this.comboboxProdutos.activeIndex = 0;
      this.renderDropdownProdutos(termo);
    });

    searchInput.addEventListener('focus', () => {
      this.abrirComboboxProdutos();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (!this.comboboxProdutos.isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        this.abrirComboboxProdutos();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const len = this.comboboxProdutos.filtrados.length;
        if (len > 0) {
          this.comboboxProdutos.activeIndex = (this.comboboxProdutos.activeIndex + 1) % len;
          this.atualizarItemAtivoVisual();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const len = this.comboboxProdutos.filtrados.length;
        if (len > 0) {
          this.comboboxProdutos.activeIndex = (this.comboboxProdutos.activeIndex - 1 + len) % len;
          this.atualizarItemAtivoVisual();
        }
      } else if (e.key === 'Enter') {
        if (this.comboboxProdutos.isOpen) {
          e.preventDefault();
          const idx = this.comboboxProdutos.activeIndex >= 0 ? this.comboboxProdutos.activeIndex : 0;
          const item = this.comboboxProdutos.filtrados[idx];
          if (item) {
            this.selecionarProdutoRapido(item.id);
          }
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.fecharComboboxProdutos();
      } else if (e.key === 'Tab') {
        if (this.comboboxProdutos.isOpen && this.comboboxProdutos.activeIndex >= 0) {
          const item = this.comboboxProdutos.filtrados[this.comboboxProdutos.activeIndex];
          if (item) {
            this.selecionarProdutoRapido(item.id);
          }
        }
        this.fecharComboboxProdutos();
      }
    });

    if (resultsContainer) {
      resultsContainer.addEventListener('mousedown', (e) => {
        const item = e.target.closest('.combobox-item');
        if (item && item.dataset.id) {
          e.preventDefault();
          this.selecionarProdutoRapido(item.dataset.id);
        }
      });

      resultsContainer.addEventListener('mouseover', (e) => {
        const item = e.target.closest('.combobox-item');
        if (item && item.dataset.index !== undefined) {
          const idx = parseInt(item.dataset.index, 10);
          if (this.comboboxProdutos.activeIndex !== idx) {
            this.comboboxProdutos.activeIndex = idx;
            this.atualizarItemAtivoVisual();
          }
        }
      });
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.comboboxProdutos.isOpen) {
          this.fecharComboboxProdutos();
        } else {
          searchInput.focus();
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.limparSelecaoProdutoRapido(true);
        this.abrirComboboxProdutos();
      });
    }

    document.addEventListener('mousedown', (e) => {
      const container = document.getElementById('fast-product-combobox-container');
      if (container && !container.contains(e.target)) {
        this.fecharComboboxProdutos();
      }
    });
  },

  atualizarCamposProdutoRapido() {
    const selectProd = document.getElementById('fast-produto-select');
    const prodId = selectProd.value;
    if (!prodId) return;

    const produto = DB.getProdutos().find(p => p.id === prodId);
    if (!produto) return;

    const inputPreco = document.getElementById('fast-preco-input');
    const inputLargura = document.getElementById('fast-largura-input');
    const inputComp = document.getElementById('fast-comprimento-input');
    const inputQtd = document.getElementById('fast-qtd-input');
    const labelQtd = document.getElementById('fast-qtd-label');
    const labelComp = document.getElementById('fast-comp-label');

    if (inputPreco) inputPreco.value = produto.preco_unitario.toFixed(2);
    if (inputQtd && !inputQtd.value) inputQtd.value = '1';

    // Extrai dimensões sugeridas da descrição ou do cadastro da madeira
    const dimensoes = this.extrairDimensoesProduto(produto.nome);

    // Ajusta campos de acordo com tipo_calculo
    if (produto.tipo_calculo === 'ML') {
      if (inputLargura) {
        inputLargura.disabled = false;
        const largSugerida = produto.largura_cm || dimensoes.largura || 15;
        inputLargura.value = largSugerida;
      }
      if (inputComp) {
        inputComp.disabled = false;
        const compSugerido = dimensoes.comprimento || (produto.comprimentos_comuns ? produto.comprimentos_comuns[1] || '3.0' : '3.0');
        inputComp.value = compSugerido;
      }
      if (labelQtd) labelQtd.textContent = 'Qtd Peças:';
      if (labelComp) labelComp.textContent = 'Compr. (m):';
    } else if (produto.tipo_calculo === 'M2') {
      if (inputLargura) {
        inputLargura.disabled = false;
        inputLargura.value = produto.largura_cm || dimensoes.largura || '';
      }
      if (inputComp) {
        inputComp.disabled = true;
        inputComp.value = '1.0';
      }
      if (labelQtd) labelQtd.textContent = 'Área (M²):';
      if (labelComp) labelComp.textContent = 'Fator (m):';
    } else {
      if (inputLargura) {
        const isMadeira = produto.categoria?.includes('Madeiras') || /TABUA|VIGA|CAIBRO|RIPA|SARRAFO/i.test(produto.nome);
        inputLargura.disabled = !isMadeira;
        inputLargura.value = isMadeira ? (produto.largura_cm || dimensoes.largura || '') : '';
      }
      if (inputComp) {
        inputComp.disabled = true;
        inputComp.value = produto.comprimento_padrao_m || dimensoes.comprimento || '0';
      }
      if (labelQtd) labelQtd.textContent = 'Qtd (UN/KG):';
      if (labelComp) labelComp.textContent = 'Compr. (m):';
    }

    this.atualizarPrecoRapido();
    this.atualizarIndicadorEstoqueRapido(prodId, parseFloat(inputQtd?.value) || 1);
  },

  extrairDimensoesProduto(nome = '') {
    let espessura = 0;
    let largura = 0;
    let comprimento = 0;

    if (!nome) return { espessura, largura, comprimento };

    // Padrão "5X20", "5 X 15", "1.5X5", "6X12"
    const matchX = nome.match(/(?:^|\s)(\d+(?:[.,]\d+)?)\s*[xX]\s*(\d+(?:[.,]\d+)?)(?:\s*(?:cm|CM|mm|MM))?/);
    if (matchX) {
      espessura = parseFloat(matchX[1].replace(',', '.')) || 0;
      largura = parseFloat(matchX[2].replace(',', '.')) || 0;
      if (/mm/i.test(matchX[0])) {
        espessura = espessura / 10;
        largura = largura / 10;
      }
    } else {
      // Padrão "15 CM", "20CM", "30 CM"
      const matchCm = nome.match(/(?:^|\s)(\d+(?:[.,]\d+)?)\s*(?:cm|CM)\b/);
      if (matchCm) {
        largura = parseFloat(matchCm[1].replace(',', '.')) || 0;
      }
    }

    // Padrão comprimento "3MTS", "3.0M", "3 MT", "X 3,50"
    const matchM = nome.match(/(?:^|\s|X\s*)(\d+(?:[.,]\d+)?)\s*(?:m|mts|mt|metros)\b/i);
    if (matchM) {
      comprimento = parseFloat(matchM[1].replace(',', '.')) || 0;
    }

    return { espessura, largura, comprimento };
  },

  atualizarPrecoRapido() {
    const selectProd = document.getElementById('fast-produto-select');
    const prodId = selectProd.value;
    if (!prodId) return;

    const produto = DB.getProdutos().find(p => p.id === prodId);
    if (!produto) return;

    const inputPreco = document.getElementById('fast-preco-input');
    const preco = produto.preco_unitario;

    const isAdmin = window.AuthModule ? AuthModule.isAdmin() : true;
    if (inputPreco) {
      inputPreco.value = preco.toFixed(2);
      inputPreco.readOnly = !isAdmin;
      inputPreco.style.backgroundColor = isAdmin ? '' : 'var(--bg-surface-subtle)';
      inputPreco.style.cursor = isAdmin ? '' : 'not-allowed';
      inputPreco.title = isAdmin ? '' : 'Preço fixado pela tabela oficial (somente gerentes podem alterar)';
    }
    this.calcularSubtotalRapido();
  },

  calcularSubtotalRapido() {
    const selectProd = document.getElementById('fast-produto-select');
    const prodId = selectProd.value;
    const produto = DB.getProdutos().find(p => p.id === prodId);

    const qtd = parseFloat(document.getElementById('fast-qtd-input')?.value) || 0;
    const comp = parseFloat(document.getElementById('fast-comprimento-input')?.value) || 0;
    const preco = parseFloat(document.getElementById('fast-preco-input')?.value) || 0;
    const subtotalEl = document.getElementById('fast-subtotal-preview');

    let total = 0;
    const tipo = produto ? produto.tipo_calculo : 'ML';

    if (tipo === 'ML') {
      total = qtd * comp * preco;
    } else {
      total = qtd * preco;
    }

    if (subtotalEl) {
      subtotalEl.textContent = CalcEngine.formatBRL(total);
    }
  },

  adicionarItemRapido() {
    const selectProd = document.getElementById('fast-produto-select');
    const prodId = selectProd.value;
    if (!prodId) {
      App.showToast('Selecione um produto para adicionar.', 'warning');
      const searchInput = document.getElementById('fast-produto-search');
      if (searchInput) searchInput.focus();
      else selectProd.focus();
      return;
    }

    const produto = DB.getProdutos().find(p => p.id === prodId);
    if (!produto) return;

    const inputLargura = document.getElementById('fast-largura-input');
    const largura = inputLargura ? (parseFloat(inputLargura.value) || 0) : 0;
    const qtd = parseFloat(document.getElementById('fast-qtd-input')?.value) || 0;
    const comp = parseFloat(document.getElementById('fast-comprimento-input')?.value) || 0;
    const isAdmin = window.AuthModule ? AuthModule.isAdmin() : true;
    let precoUnitBase = produto.preco_unitario;
    if (isAdmin) {
      const inputPreco = document.getElementById('fast-preco-input');
      const valPreco = inputPreco ? parseFloat(inputPreco.value) : NaN;
      if (!isNaN(valPreco) && valPreco >= 0) {
        precoUnitBase = valPreco;
      }
    }

    if (qtd <= 0) {
      App.showToast('Informe uma quantidade válida de peças.', 'warning');
      document.getElementById('fast-qtd-input')?.focus();
      return;
    }

    if (produto.tipo_calculo === 'ML') {
      if (largura <= 0) {
        App.showToast('Informe a largura da madeira (em cm).', 'warning');
        if (inputLargura) inputLargura.focus();
        return;
      }
      if (comp <= 0) {
        App.showToast('Informe o comprimento da madeira (em metros).', 'warning');
        document.getElementById('fast-comprimento-input')?.focus();
        return;
      }
    }

    // Alerta preventivo se o item estiver zerado ou com saldo baixo no estoque
    const estoqueAtual = parseFloat(produto.estoque_atual) || 0;
    if (estoqueAtual <= 0) {
      App.showToast(`⚠️ Atenção: "${produto.nome}" está zerado no estoque digital do sistema. Verifique a prateleira.`, 'warning');
    } else if (qtd > estoqueAtual) {
      App.showToast(`⚠️ Atenção: Quantidade solicitada (${qtd}) é maior que o saldo em estoque (${estoqueAtual} ${produto.unidade_medida || 'un'}).`, 'warning');
    }

    const itemObj = {
      id: 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      produto_id: produto.id,
      codigo: produto.codigo,
      descricao: produto.nome,
      largura_cm: largura > 0 ? largura : (produto.largura_cm || 0),
      acabamento: 'BRUTA',
      aparelhar: false,
      tipo_calculo: produto.tipo_calculo,
      quantidade: qtd,
      comprimento_m: produto.tipo_calculo === 'ML' ? comp : (produto.comprimento_padrao_m || 0),
      valor_unitario: precoUnitBase
    };

    // Calcula propriedades físicas e matemáticas
    const calc = CalcEngine.calcularItem(itemObj, produto);
    Object.assign(itemObj, calc);

    this.currentOrder.itens.push(itemObj);
    this.renderTabelaItens();
    this.atualizarTotais();

    // Limpa barra para o próximo item e mantém foco no campo de busca para agilidade máxima
    this.limparSelecaoProdutoRapido(true);
    const qtdEl = document.getElementById('fast-qtd-input');
    if (qtdEl) qtdEl.value = '1';
    const subtotalEl = document.getElementById('fast-subtotal-preview');
    if (subtotalEl) subtotalEl.textContent = 'R$ 0,00';
    App.showToast(`+ ${itemObj.descricao} adicionado ao orçamento.`);
  },

  renderTabelaItens() {
    const tbody = document.getElementById('balcao-itens-tbody');
    const emptyState = document.getElementById('balcao-tabela-empty');
    if (!tbody) return;

    if (!this.currentOrder.itens.length) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    const isAdmin = window.AuthModule ? AuthModule.isAdmin() : true;

    tbody.innerHTML = this.currentOrder.itens.map((item, index) => {
      const isAparelhada = item.aparelhar;
      const produto = DB.getProdutos().find(p => p.id === item.produto_id);
      const estoqueAtual = produto ? (parseFloat(produto.estoque_atual) || 0) : null;
      let estoqueTag = '';
      if (estoqueAtual !== null) {
        if (estoqueAtual <= 0) {
          estoqueTag = `<div style="margin-top: 3px;"><span class="badge-tag" style="background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; font-size: 10px; font-weight: 700;">⚠️ Estoque Zerado (0 un) — Conferir balcão</span></div>`;
        } else if (item.quantidade > estoqueAtual) {
          estoqueTag = `<div style="margin-top: 3px;"><span class="badge-tag" style="background: #FEF3C7; color: #D97706; border: 1px solid #FCD34D; font-size: 10px; font-weight: 700;">⚠️ Qtd (${item.quantidade}) > Estoque (${estoqueAtual} un)</span></div>`;
        } else {
          estoqueTag = `<div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">Estoque no sistema: ${estoqueAtual} ${produto.unidade_medida || 'un'}</div>`;
        }
      }

      return `
        <tr data-item-id="${item.id}">
          <td class="align-center font-mono" style="color: var(--text-muted); font-size: 11px;">${index + 1}</td>
          <td class="font-mono" style="font-weight: 600; color: var(--primary-green);">${item.codigo}</td>
          <td>
            <strong>${item.descricao}</strong>
            ${estoqueTag}
          </td>
          <td class="align-center font-mono">${item.tipo_calculo}</td>
          <td style="width: 80px;">
            <input type="number" step="1" min="1" class="table-input" value="${item.quantidade}" onchange="BalcaoModule.atualizarItemInline('${item.id}', 'quantidade', this.value)">
          </td>
          <td class="align-center" style="width: 90px;">
            ${item.tipo_calculo === 'ML' || item.largura_cm ? `
              <input type="number" step="0.5" min="0.5" class="table-input" value="${item.largura_cm || ''}" placeholder="cm" onchange="BalcaoModule.atualizarItemInline('${item.id}', 'largura_cm', this.value)" style="text-align: center; font-weight: 600;">
            ` : `<span class="font-mono" style="color: var(--text-muted); display: block; text-align: center;">-</span>`}
          </td>
          <td style="width: 80px;">
            ${item.tipo_calculo === 'ML' ? `
              <input type="number" step="0.5" min="0.5" class="table-input" value="${item.comprimento_m}" onchange="BalcaoModule.atualizarItemInline('${item.id}', 'comprimento_m', this.value)">
            ` : `<span class="font-mono" style="color: var(--text-muted); display: block; text-align: right;">-</span>`}
          </td>
          <td class="align-right font-mono" style="font-weight: 600;">
            ${CalcEngine.formatNumero(item.metragem_total, item.tipo_calculo === 'ML' ? 1 : 0)} ${item.tipo_calculo === 'ML' ? 'ML' : item.tipo_calculo === 'M2' ? 'm²' : 'un'}
          </td>
          ${isAdmin ? `
            <td class="align-right font-mono" style="width: 95px;">
              <input type="number" step="0.50" min="0" class="table-input" value="${item.valor_unitario.toFixed(2)}" onchange="BalcaoModule.atualizarItemInline('${item.id}', 'valor_unitario', this.value)" title="Editar valor unitário">
            </td>
          ` : `
            <td class="align-right font-mono" style="font-weight: 600; color: var(--text-primary); font-size: 12.5px;" title="Preço unitário fixo de tabela">
              ${CalcEngine.formatBRL(item.valor_unitario)}
            </td>
          `}
          <td class="align-right font-mono" style="font-weight: 700; color: var(--primary-green);">
            ${CalcEngine.formatBRL(item.subtotal)}
          </td>
          <td class="align-center" style="width: 40px;">
            <button class="btn btn-sm btn-danger" style="padding: 0 4px;" title="Remover item" onclick="BalcaoModule.removerItem('${item.id}')">
              &times;
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  removerItem(itemId) {
    this.currentOrder.itens = this.currentOrder.itens.filter(i => i.id !== itemId);
    this.renderTabelaItens();
    this.atualizarTotais();
    App.showToast('Item removido do orçamento.');
  },

  togglePlainaItem(itemId, isPlaina) {
    const item = this.currentOrder.itens.find(i => i.id === itemId);
    if (!item) return;

    item.aparelhar = isPlaina;
    item.acabamento = isPlaina ? 'APARELHADA' : 'BRUTA';

    const produto = DB.getProdutos().find(p => p.id === item.produto_id);
    const calc = CalcEngine.calcularItem(item, produto);
    Object.assign(item, calc);

    this.renderTabelaItens();
    this.atualizarTotais();
  },

  atualizarItemInline(itemId, campo, valor) {
    if (campo === 'valor_unitario' && window.AuthModule && !AuthModule.isAdmin()) {
      App.showToast('Funcionários não têm permissão para alterar o valor unitário dos itens.', 'error');
      this.renderTabelaItens();
      return;
    }

    const item = this.currentOrder.itens.find(i => i.id === itemId);
    if (!item) return;

    item[campo] = parseFloat(valor) || 0;
    const produto = DB.getProdutos().find(p => p.id === item.produto_id);
    const calc = CalcEngine.calcularItem(item, produto);
    Object.assign(item, calc);

    this.renderTabelaItens();
    this.atualizarTotais();
  },

  atualizarTotais() {
    const inputFrete = document.getElementById('balcao-frete-valor');
    const frete = inputFrete ? parseFloat(inputFrete.value) || 0 : 0;

    const selectTipoDesc = document.getElementById('balcao-desconto-tipo');
    const tipoDesc = selectTipoDesc ? selectTipoDesc.value : 'VALOR';

    const inputDesc = document.getElementById('balcao-desconto-valor');
    const desc = inputDesc ? parseFloat(inputDesc.value) || 0 : 0;

    const inputSinal = document.getElementById('balcao-sinal-valor');
    const sinal = inputSinal ? parseFloat(inputSinal.value) || 0 : 0;

    const selectBairro = document.getElementById('balcao-bairro-frete');
    const bairroFrete = selectBairro ? selectBairro.value : '';

    const totais = CalcEngine.calcularTotaisOrcamento(
      this.currentOrder.itens,
      frete,
      desc,
      tipoDesc,
      sinal
    );

    // Salva nos objetos do pedido
    this.currentOrder.resumo_fisico = {
      total_pecas: totais.total_pecas,
      volume_total_m3: totais.volume_total_m3,
      peso_total_kg: totais.peso_total_kg,
      veiculo_sugerido: totais.veiculo_sugerido
    };

    this.currentOrder.resumo_financeiro = {
      subtotal_itens_puros: totais.subtotal_itens_puros,
      taxa_aparelhamento: totais.taxa_aparelhamento,
      subtotal_com_plaina: totais.subtotal_com_plaina,
      valor_frete: totais.valor_frete,
      bairro_frete: bairroFrete,
      desconto_tipo: tipoDesc,
      desconto_valor: totais.desconto_valor,
      desconto_percentual: totais.desconto_percentual,
      desconto_autorizado: this.currentOrder.resumo_financeiro.desconto_autorizado || !totais.requer_autorizacao,
      valor_total: totais.valor_total,
      percentual_bruto: totais.percentual_bruto,
      valor_total_bruto: totais.valor_total_bruto,
      forma_pagamento: document.getElementById('balcao-forma-pagamento')?.value || 'Pix',
      valor_sinal: totais.valor_sinal,
      saldo_a_receber: totais.saldo_a_receber
    };

    // Renderiza nos elementos de tela
    const elSubtotalPuro = document.getElementById('balcao-subtotal-itens');
    if (elSubtotalPuro) elSubtotalPuro.textContent = CalcEngine.formatBRL(totais.subtotal_itens_puros);

    const elPlaina = document.getElementById('balcao-taxa-plaina-total');
    if (elPlaina) elPlaina.textContent = CalcEngine.formatBRL(totais.taxa_aparelhamento);

    // Valor Total À Vista
    const elTotal = document.getElementById('balcao-total-geral') || document.getElementById('balcao-valor-total');
    if (elTotal) elTotal.textContent = CalcEngine.formatBRL(totais.valor_total);

    // Preço Bruto (A Prazo / Cartão)
    const elBruto = document.getElementById('balcao-total-bruto');
    if (elBruto) elBruto.textContent = CalcEngine.formatBRL(totais.valor_total_bruto);

    const elBadgePctBruto = document.getElementById('balcao-badge-pct-bruto');
    if (elBadgePctBruto) elBadgePctBruto.textContent = `A PRAZO (+${totais.percentual_bruto}%)`;

    const elSaldo = document.getElementById('balcao-saldo-receber');
    if (elSaldo) {
      if (totais.valor_total > 0 && totais.saldo_a_receber <= 0) {
        elSaldo.innerHTML = '<span style="color: #059669; font-weight: 800;">R$ 0,00 (100% QUITADO)</span>';
      } else {
        elSaldo.textContent = CalcEngine.formatBRL(totais.saldo_a_receber);
      }
    }

    // Atualiza badge de status de pagamento do balcão
    const badgePgto = document.getElementById('balcao-status-pagamento-badge');
    if (badgePgto) {
      if (totais.valor_total > 0 && totais.saldo_a_receber <= 0) {
        badgePgto.textContent = '● Quitado (100%)';
        badgePgto.className = 'badge-tag badge-entregue';
        badgePgto.style.cssText = 'font-size: 10.5px; padding: 2px 7px; background: #ECFDF5; color: #047857; border: 1px solid #10B981; font-weight: 700;';
      } else if (totais.valor_sinal > 0) {
        const pct = Math.round((totais.valor_sinal / (totais.valor_total || 1)) * 100);
        badgePgto.textContent = `● Sinal (${pct}%)`;
        badgePgto.className = 'badge-tag badge-aprovado';
        badgePgto.style.cssText = 'font-size: 10.5px; padding: 2px 7px; background: #EFF6FF; color: #1D4ED8; border: 1px solid #93C5FD; font-weight: 600;';
      } else {
        badgePgto.textContent = 'Pendente';
        badgePgto.className = 'badge-tag badge-orcamento';
        badgePgto.style.cssText = 'font-size: 10.5px; padding: 2px 7px;';
      }
    }

    const elPecas = document.getElementById('balcao-total-pecas');
    if (elPecas) elPecas.textContent = totais.total_pecas;

    const elVolume = document.getElementById('balcao-total-volume');
    if (elVolume) elVolume.textContent = CalcEngine.formatM3(totais.volume_total_m3);

    const elPeso = document.getElementById('balcao-total-peso');
    if (elPeso) elPeso.textContent = CalcEngine.formatKg(totais.peso_total_kg);

    const elVeiculo = document.getElementById('balcao-veiculo-sugerido');
    if (elVeiculo) {
      elVeiculo.textContent = totais.veiculo_sugerido;
      elVeiculo.className = 'font-mono ' + totais.veiculo_classe;
    }

    // Trava de segurança de desconto > 5%
    const travaBox = document.getElementById('balcao-trava-desconto-box');
    if (travaBox) {
      if (totais.requer_autorizacao && !this.currentOrder.resumo_financeiro.desconto_autorizado) {
        travaBox.style.display = 'block';
      } else {
        travaBox.style.display = 'none';
      }
    }
  },

  autorizarDescontoGerente() {
    const inputSenha = document.getElementById('balcao-senha-gerente');
    if (!inputSenha) return;

    const senhaCorreta = CalcEngine.getSenhaGerente();
    if (inputSenha.value === senhaCorreta) {
      this.currentOrder.resumo_financeiro.desconto_autorizado = true;
      document.getElementById('balcao-trava-desconto-box').style.display = 'none';

      // Registra no log de auditoria da gerência
      DB.registrarAuditoriaDesconto({
        pedido_numero: this.currentOrder.numero,
        cliente_nome: this.currentOrder.cliente?.nome || 'Cliente Balcão',
        vendedor_nome: this.currentOrder.vendedor?.nome || 'Balcão',
        valor_pedido: this.currentOrder.resumo_financeiro?.valor_total || 0,
        desconto_pct: this.currentOrder.resumo_financeiro?.desconto_percentual || 0,
        desconto_valor: this.currentOrder.resumo_financeiro?.desconto_valor || 0,
        motivo: 'Autorizado via senha do gerente no balcão'
      });

      App.showToast('Desconto autorizado pelo gerente com sucesso!', 'success');
      this.atualizarTotais();
    } else {
      App.showToast('Senha de gerente incorreta!', 'error');
      inputSenha.focus();
    }
  },

  selecionarCliente(cliente) {
    this.activeClientId = cliente.id;
    this.currentOrder.cliente = {
      id: cliente.id,
      nome: cliente.nome,
      documento: cliente.documento || '',
      telefone: cliente.telefone || '',
      email: cliente.email || '',
      endereco_obra: cliente.endereco_obra || '',
      bairro: cliente.bairro || '',
      cidade: cliente.cidade || 'Caçapava',
      observacoes: cliente.observacoes || ''
    };

    this.renderFormularioCliente();
    this.verificarAlertaCliente(cliente.id);

    // Se o cliente já tem bairro cadastrado, pré-seleciona no frete
    if (cliente.bairro) {
      const selectBairro = document.getElementById('balcao-bairro-frete');
      if (selectBairro) {
        selectBairro.value = cliente.bairro;
        const bairros = DB.getBairros();
        const b = bairros.find(x => x.nome === cliente.bairro);
        if (b) {
          document.getElementById('balcao-frete-valor').value = b.valor_frete.toFixed(2);
          this.atualizarTotais();
        }
      }
    }

    App.showToast(`Cliente selecionado: ${cliente.nome}`);
  },

  renderFormularioCliente() {
    const cli = this.currentOrder.cliente;
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };

    setVal('balcao-busca-cliente', cli.nome);
    setVal('balcao-cliente-nome', cli.nome);
    setVal('balcao-cliente-telefone', cli.telefone);
    setVal('balcao-cliente-documento', cli.documento);
    setVal('balcao-cliente-endereco', cli.endereco_obra);
    setVal('balcao-cliente-bairro', cli.bairro);
    setVal('balcao-cliente-cidade', cli.cidade || 'Caçapava');

    const inputDoc = document.getElementById('balcao-cliente-documento');
    if (inputDoc) inputDoc.dispatchEvent(new Event('input'));
    const inputTel = document.getElementById('balcao-cliente-telefone');
    if (inputTel) inputTel.dispatchEvent(new Event('input'));
  },

  verificarAlertaCliente(clienteId) {
    const cliente = DB.getClientes().find(c => c.id === clienteId);
    const alertBanner = document.getElementById('balcao-alerta-cliente');
    const alertMsg = document.getElementById('balcao-alerta-cliente-msg');

    if (!cliente || !alertBanner || !alertMsg) return;

    if (cliente.saldo_devedor > 0) {
      alertMsg.innerHTML = `<strong>Atenção:</strong> Cliente possui saldo devedor em aberto de <strong>R$ ${cliente.saldo_devedor.toFixed(2)}</strong> ${cliente.pedido_pendente_ref ? `(ref. Pedido ${cliente.pedido_pendente_ref})` : ''}.`;
      alertBanner.style.display = 'flex';
      alertBanner.className = 'client-alert-banner alert-warning';
    } else if (cliente.saldo_devedor < 0) {
      alertMsg.innerHTML = `<strong>Crédito em haver:</strong> Cliente possui crédito a favor de <strong>R$ ${Math.abs(cliente.saldo_devedor).toFixed(2)}</strong> na madeireira.`;
      alertBanner.style.display = 'flex';
      alertBanner.className = 'client-alert-banner alert-info';
    } else {
      this.ocultarAlertaCliente();
    }
  },

  ocultarAlertaCliente() {
    const alertBanner = document.getElementById('balcao-alerta-cliente');
    if (alertBanner) alertBanner.style.display = 'none';
  },

  // Kits Rápidos
  inserirKitCaixaria() {
    const produtos = DB.getProdutos();
    const pTabua20 = produtos.find(p => p.codigo === 'MAD-010');
    const pTabua30 = produtos.find(p => p.codigo === 'MAD-011');
    const pSarrafo = produtos.find(p => p.codigo === 'MAD-008');
    const pPrego = produtos.find(p => p.codigo === 'FER-001');

    const kitItens = [
      { prod: pTabua20, qtd: 20, comp: 3.0 },
      { prod: pTabua30, qtd: 15, comp: 3.0 },
      { prod: pSarrafo, qtd: 25, comp: 3.0 },
      { prod: pPrego, qtd: 5, comp: 0 }
    ];

    kitItens.forEach(k => {
      if (k.prod) {
        const dim = this.extrairDimensoesProduto(k.prod.nome);
        const itemObj = {
          id: 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          produto_id: k.prod.id,
          codigo: k.prod.codigo,
          descricao: k.prod.nome,
          largura_cm: k.prod.largura_cm || dim.largura || 0,
          acabamento: 'BRUTA',
          aparelhar: false,
          tipo_calculo: k.prod.tipo_calculo,
          quantidade: k.qtd,
          comprimento_m: k.comp,
          valor_unitario: k.prod.preco_unitario
        };
        const calc = CalcEngine.calcularItem(itemObj, k.prod);
        Object.assign(itemObj, calc);
        this.currentOrder.itens.push(itemObj);
      }
    });

    this.renderTabelaItens();
    this.atualizarTotais();
    App.showToast('Kit Caixaria de Obra inserido com sucesso!');
  },

  inserirKitTelhado() {
    const produtos = DB.getProdutos();
    const pViga = produtos.find(p => p.codigo === 'MAD-001');
    const pCaibro = produtos.find(p => p.codigo === 'MAD-005');
    const pRipa = produtos.find(p => p.codigo === 'MAD-007');
    const pPrego = produtos.find(p => p.codigo === 'FER-002');
    const pTelha = produtos.find(p => p.codigo === 'TEL-001');

    const kitItens = [
      { prod: pViga, qtd: 8, comp: 4.5 },
      { prod: pCaibro, qtd: 24, comp: 4.0 },
      { prod: pRipa, qtd: 45, comp: 3.0 },
      { prod: pTelha, qtd: 850, comp: 0 },
      { prod: pPrego, qtd: 6, comp: 0 }
    ];

    kitItens.forEach(k => {
      if (k.prod) {
        const dim = this.extrairDimensoesProduto(k.prod.nome);
        const itemObj = {
          id: 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          produto_id: k.prod.id,
          codigo: k.prod.codigo,
          descricao: k.prod.nome,
          largura_cm: k.prod.largura_cm || dim.largura || 0,
          acabamento: 'BRUTA',
          aparelhar: false,
          tipo_calculo: k.prod.tipo_calculo,
          quantidade: k.qtd,
          comprimento_m: k.comp,
          valor_unitario: k.prod.preco_unitario
        };
        const calc = CalcEngine.calcularItem(itemObj, k.prod);
        Object.assign(itemObj, calc);
        this.currentOrder.itens.push(itemObj);
      }
    });

    this.renderTabelaItens();
    this.atualizarTotais();
    App.showToast('Kit Madeiramento de Telhado inserido!');
  },

  abrirModalCalculadoraTelhado() {
    const modal = document.getElementById('modal-calculadora-telhado');
    if (modal) {
      modal.classList.add('active');
      this.recalcularModalTelhado();
    }
  },

  fecharModalCalculadoraTelhado() {
    const modal = document.getElementById('modal-calculadora-telhado');
    if (modal) modal.classList.remove('active');
  },

  recalcularModalTelhado() {
    const area = parseFloat(document.getElementById('calc-area-input')?.value) || 80;
    const especie = document.getElementById('calc-especie-select')?.value || 'Garapeira';
    const resultado = CalcEngine.calcularKitTelhado(area, especie);

    const container = document.getElementById('calc-itens-resultado');
    if (!container) return;

    container.innerHTML = `
      <div style="margin-bottom: 8px; font-size: 11.5px; color: var(--text-secondary);">
        Estimativa calculada para <strong>${area} m²</strong> de telhado colonial em <strong>${especie}</strong>:
      </div>
      <table class="dense-table">
        <thead>
          <tr>
            <th>Item Sugerido</th>
            <th class="align-center">Qtd</th>
            <th class="align-center">Compr. (m)</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          ${resultado.itens_sugeridos.map(i => `
            <tr>
              <td><strong>${i.nome}</strong></td>
              <td class="align-center font-mono">${i.quantidade}</td>
              <td class="align-center font-mono">${i.comprimento_m || '-'}</td>
              <td class="font-mono">${i.tipo_calculo}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  },

  aplicarCalculoTelhadoNoBalcao() {
    const area = parseFloat(document.getElementById('calc-area-input')?.value) || 80;
    const especie = document.getElementById('calc-especie-select')?.value || 'Garapeira';
    const resultado = CalcEngine.calcularKitTelhado(area, especie);
    const produtos = DB.getProdutos();

    resultado.itens_sugeridos.forEach(sug => {
      const prod = produtos.find(p => p.codigo === sug.codigo);
      if (prod) {
        const dim = this.extrairDimensoesProduto(prod.nome);
        const itemObj = {
          id: 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          produto_id: prod.id,
          codigo: prod.codigo,
          descricao: prod.nome,
          largura_cm: prod.largura_cm || dim.largura || 0,
          acabamento: 'BRUTA',
          aparelhar: false,
          tipo_calculo: prod.tipo_calculo,
          quantidade: sug.quantidade,
          comprimento_m: sug.comprimento_m,
          valor_unitario: prod.preco_unitario
        };
        const calc = CalcEngine.calcularItem(itemObj, prod);
        Object.assign(itemObj, calc);
        this.currentOrder.itens.push(itemObj);
      }
    });

    this.fecharModalCalculadoraTelhado();
    this.renderTabelaItens();
    this.atualizarTotais();
    App.showToast(`Itens da Calculadora (${area} m²) adicionados ao orçamento!`);
  },

  atualizarBadgeOrcamento(estado = 'NOVO') {
    const badge = document.getElementById('balcao-pedido-status-badge');
    if (!badge || !this.currentOrder) return;

    const num = this.currentOrder.numero || '';
    if (estado === 'EDITANDO') {
      badge.textContent = `EDITANDO ORÇAMENTO #${num}`;
      badge.className = 'badge-tag font-mono';
      badge.style.background = '#EFF6FF';
      badge.style.color = '#1D4ED8';
      badge.style.border = '1px solid #93C5FD';
    } else if (estado === 'SALVO') {
      badge.textContent = `ORÇAMENTO #${num} (SALVO NO HISTÓRICO)`;
      badge.className = 'badge-tag font-mono';
      badge.style.background = '#ECFDF5';
      badge.style.color = '#047857';
      badge.style.border = '1px solid #6EE7B7';
    } else {
      badge.textContent = `ORÇAMENTO #${num} (NOVO)`;
      badge.className = 'badge-tag badge-bruta font-mono';
      badge.style.background = '';
      badge.style.color = '';
      badge.style.border = '';
    }
  },

  imprimirComprovanteBalcao(modo = 'CLIENTE', direto = false) {
    if (!this.currentOrder || !this.currentOrder.itens || !this.currentOrder.itens.length) {
      App.showToast('Adicione pelo menos 1 item ao orçamento antes de imprimir.', 'warning');
      return;
    }

    // Auto-salva ou atualiza automaticamente o orçamento no banco e histórico antes de imprimir
    const statusFinal = this.currentOrder.status || 'ORCAMENTO';
    const pedidoSalvo = this.salvarPedidoCompleto(statusFinal);
    if (!pedidoSalvo) return;

    if (window.PrintModule) {
      PrintModule.abrirModalImpressao(pedidoSalvo, modo);
      if (direto) {
        setTimeout(() => PrintModule.executarImpressao(), 300);
      }
    }
  },

  salvarPedidoCompleto(statusFinal = 'ORCAMENTO') {
    if (!this.currentOrder || !this.currentOrder.itens || !this.currentOrder.itens.length) {
      App.showToast('Adicione pelo menos 1 item para salvar o orçamento.', 'warning');
      return null;
    }

    // Garante que cálculos, descontos, frete e forma de pagamento estejam 100% atualizados
    this.atualizarTotais();

    // Pega dados do cliente digitados no cabeçalho
    const getVal = id => document.getElementById(id)?.value?.trim() || '';
    const nomeCliente = getVal('balcao-cliente-nome') || getVal('balcao-busca-cliente') || 'Cliente Balcão';

    const clienteData = {
      id: this.activeClientId || '',
      nome: nomeCliente,
      telefone: getVal('balcao-cliente-telefone'),
      documento: getVal('balcao-cliente-documento'),
      endereco_obra: getVal('balcao-cliente-endereco'),
      bairro: getVal('balcao-cliente-bairro'),
      cidade: getVal('balcao-cliente-cidade') || 'Caçapava'
    };

    // Auto-cadastro invisível
    const clienteGarantido = DB.garantirCliente(clienteData);
    this.currentOrder.cliente = clienteGarantido;

    // Se estiver aprovando venda para envio ao pátio OU finalizando no balcão, verifica estoque
    if (statusFinal === 'APROVADO' || statusFinal === 'ENTREGUE') {
      const pendenciasEstoque = this.verificarEstoqueItens();
      if (pendenciasEstoque.length > 0 && !this._liberacaoEstoqueAutorizada) {
        this.abrirModalAlertaEstoque(statusFinal === 'ENTREGUE' ? 'FINALIZAR_BALCAO' : 'APROVAR_VENDA');
        return null;
      }
      this._liberacaoEstoqueAutorizada = false;
    }

    // Atualiza status e etapa do pátio
    this.currentOrder.status = statusFinal;
    if (statusFinal === 'APROVADO') {
      const temPlaina = this.currentOrder.itens.some(i => i.aparelhar);
      this.currentOrder.etapa_patio = temPlaina ? 'CORTE_PLAINA' : 'SEPARACAO';
      
      // Gera checklist do pátio
      this.currentOrder.checklist_patio = this.currentOrder.itens.map(item => {
        const dimStr = item.largura_cm ? `${item.largura_cm}cm x ${item.comprimento_m || 0}m` : (item.comprimento_m ? `${item.comprimento_m}m` : '');
        return {
          item_id: item.id,
          descricao: `${item.descricao} (${item.quantidade} pcs ${dimStr ? 'x ' + dimStr : ''}) ${item.aparelhar ? '- APARELHAR' : ''}`.trim(),
          cortado: false,
          carregado: false,
          requer_plaina: item.aparelhar
        };
      });
    } else if (statusFinal === 'ENTREGUE') {
      this.currentOrder.etapa_patio = 'ENTREGUE';
      this.currentOrder.finalizado_balcao = true;
      this.currentOrder.tipo_entrega = 'BALCAO_IMEDIATO';
      this.currentOrder.data_entrega = new Date().toISOString();
      this.currentOrder.resumo_financeiro.valor_sinal = this.currentOrder.resumo_financeiro.valor_total;
      this.currentOrder.resumo_financeiro.saldo_a_receber = 0;

      // Gera checklist como já concluído
      this.currentOrder.checklist_patio = this.currentOrder.itens.map(item => {
        const dimStr = item.largura_cm ? `${item.largura_cm}cm x ${item.comprimento_m || 0}m` : (item.comprimento_m ? `${item.comprimento_m}m` : '');
        return {
          item_id: item.id,
          descricao: `${item.descricao} (${item.quantidade} pcs ${dimStr ? 'x ' + dimStr : ''}) - RETIRADO NO BALCÃO`.trim(),
          cortado: true,
          carregado: true,
          requer_plaina: false
        };
      });

      // BAIXA IMEDIATA NO ESTOQUE FÍSICO
      this.currentOrder.itens.forEach(item => {
        if (item.produto_id) {
          DB.ajustarEstoque(item.produto_id, -item.quantidade, false);
        }
      });
      if (window.EstoqueModule) {
        EstoqueModule.renderCardsKPI();
        EstoqueModule.renderTabelaEstoque();
      }
      if (window.PrecosModule) PrecosModule.renderTabelaPrecos();
      this.renderProdutosSelect();
    }

    this.currentOrder.observacoes_venda = getVal('balcao-observacoes');

    // Validação de trava de desconto (teto configurado pelo gerente)
    const tetoLivre = CalcEngine.getDescontoMaximoLivre();
    if (this.currentOrder.resumo_financeiro.desconto_percentual > tetoLivre && !this.currentOrder.resumo_financeiro.desconto_autorizado) {
      App.showToast(`Desconto acima de ${tetoLivre}% requer autorização do gerente!`, 'error');
      document.getElementById('balcao-senha-gerente')?.focus();
      return;
    }

    // Se aprovou venda ou finalizou no balcão, credita para o vendedor da equipe
    if ((statusFinal === 'APROVADO' || statusFinal === 'ENTREGUE') && this.currentOrder.vendedor?.id) {
      const funcs = DB.getFuncionarios();
      const func = funcs.find(f => f.id === this.currentOrder.vendedor.id);
      if (func) {
        const valTotal = this.currentOrder.resumo_financeiro.valor_total || 0;
        func.vendas_mes = (parseFloat(func.vendas_mes) || 0) + valTotal;
        const comPct = parseFloat(func.comissao_pct) || 0;
        if (comPct > 0) {
          const comGerada = valTotal * (comPct / 100);
          func.comissao_acumulada = (parseFloat(func.comissao_acumulada) || 0) + comGerada;
          func.saldo_comissao = Math.max(0, func.comissao_acumulada - (parseFloat(func.comissao_paga) || 0));
        }
        DB.set(STORAGE_KEYS.FUNCIONARIOS, funcs);
      }
    }

    // Verifica se já existia no banco de dados para feedback preciso (edição vs novo)
    const pedidos = DB.getPedidos();
    const jaExistia = pedidos.some(p => 
      (this.currentOrder.id && p.id === this.currentOrder.id) || 
      (this.currentOrder.numero && p.numero === this.currentOrder.numero)
    );

    // Salva no banco de dados local (se já existia, atualiza em cima sem duplicar)
    DB.salvarPedido(this.currentOrder);

    // Atualiza badge visual para salvo no histórico
    this.atualizarBadgeOrcamento('SALVO');

    // Guarda cópia do pedido salvo para retornar
    const pedidoRetorno = JSON.parse(JSON.stringify(this.currentOrder));

    // Feedback visual
    if (statusFinal === 'ENTREGUE') {
      App.showToast(`⚡ Venda #${this.currentOrder.numero} finalizada e quitada no balcão! Estoque baixado e caixa atualizado.`, 'success');
    } else if (statusFinal === 'APROVADO' && this.currentOrder.resumo_financeiro.saldo_a_receber > 0) {
      App.showToast(`Venda #${this.currentOrder.numero} aprovada! Enviada para o pátio (${this.currentOrder.etapa_patio}). Saldo a receber: ${CalcEngine.formatBRL(this.currentOrder.resumo_financeiro.saldo_a_receber)}`, 'success');
    } else {
      if (jaExistia) {
        App.showToast(`Orçamento #${this.currentOrder.numero} atualizado com sucesso no histórico!`, 'success');
      } else {
        App.showToast(`Orçamento #${this.currentOrder.numero} salvo com sucesso no histórico!`, 'success');
      }
    }

    // Atualiza listas e kanban
    HistoricoModule.renderTabelaPedidos();
    PatioModule.renderKanban();
    PainelModule.atualizarIndicadores();
    if (window.GerenteModule) GerenteModule.render();

    return pedidoRetorno;
  },

  enviarResumoWhatsapp() {
    if (!this.currentOrder.itens.length) {
      App.showToast('Não há itens no orçamento para enviar.', 'warning');
      return;
    }

    // Pega o telefone tanto do formulário na tela quanto do cadastro do cliente
    const telInput = document.getElementById('balcao-cliente-telefone')?.value || '';
    const telCliente = this.currentOrder.cliente?.telefone || '';
    let rawTel = (telInput || telCliente).replace(/\D/g, '');

    // Formata o número com o DDI do Brasil (55) se tiver 10 ou 11 dígitos
    let phoneParam = '';
    if (rawTel.length >= 10) {
      if (rawTel.startsWith('55') && rawTel.length >= 12) {
        phoneParam = rawTel;
      } else {
        phoneParam = '55' + rawTel;
      }
    }

    const nomeInput = document.getElementById('balcao-cliente-nome')?.value || document.getElementById('balcao-busca-cliente')?.value || '';
    const nome = (nomeInput || this.currentOrder.cliente?.nome || 'Cliente').trim();
    const num = this.currentOrder.numero;
    const total = CalcEngine.formatBRL(this.currentOrder.resumo_financeiro.valor_total);
    const sinal = CalcEngine.formatBRL(this.currentOrder.resumo_financeiro.valor_sinal);
    const saldo = CalcEngine.formatBRL(this.currentOrder.resumo_financeiro.saldo_a_receber);
    const frete = CalcEngine.formatBRL(this.currentOrder.resumo_financeiro.valor_frete);

    const config = (typeof DB !== 'undefined' && DB.getConfig) ? DB.getConfig() : {};
    const nomeEmpresa = (config.nome_madeireira || 'Serraria e Madeireira Bom Jesus').toUpperCase();
    const endEmpresa = config.endereco_madeireira || 'Av. Adhemar Pinto de Siqueira, 1000 - Vila Galvão, Caçapava - SP';
    const telEmpresa = config.telefone_madeireira || '(12) 99603-3793';
    const cnpjEmpresa = config.cnpj_madeireira || '16.482.988/0001-02';

    let texto = `*${nomeEmpresa}*\n`;
    texto += `📍 ${endEmpresa}\n`;
    texto += `📞 WhatsApp: ${telEmpresa} | CNPJ: ${cnpjEmpresa}\n`;
    texto += `*Orçamento Nº #${num}*\n`;
    texto += `Olá ${nome}, segue o detalhamento do seu orçamento:\n\n`;
    texto += `*ITENS:*\n`;

    this.currentOrder.itens.forEach((it, idx) => {
      const dimStr = it.largura_cm ? ` (${it.largura_cm}cm x ${it.comprimento_m || 0}m)` : (it.comprimento_m ? ` (${it.comprimento_m}m)` : '');
      texto += `${idx + 1}. ${it.quantidade}x ${it.descricao}${dimStr} = ${CalcEngine.formatBRL(it.subtotal)}\n`;
    });

    texto += `\n*RESUMO:*`;
    texto += `\nFrete (${this.currentOrder.resumo_financeiro.bairro_frete || 'Entrega'}): ${frete}`;
    texto += `\n*VALOR TOTAL:* ${total}`;
    if (this.currentOrder.resumo_financeiro.valor_sinal > 0) {
      texto += `\nSinal / Entrada: ${sinal}`;
      texto += `\n*Saldo a pagar na entrega:* ${saldo}`;
    }
    texto += `\n\nPeso estimado: ${CalcEngine.formatKg(this.currentOrder.resumo_fisico.peso_total_kg)}`;
    texto += `\nProposta válida por 7 dias corridos.`;
    texto += `\nQualquer dúvida estamos à disposição!`;

    if (phoneParam) {
      App.showToast(`Abrindo conversa direta no WhatsApp com ${nome} (${rawTel})...`, 'info');
    } else {
      App.showToast('Abrindo WhatsApp com orçamento pronto... Preencha o telefone no cabeçalho para abrir direto no contato!', 'info');
    }

    const url = `https://api.whatsapp.com/send?phone=${phoneParam}&text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  }
};

window.BalcaoModule = BalcaoModule;

