/**
 * SERRARIA & MADEIREIRA ERP - MÓDULO 5: CLIENTES, PENDURA E CARPINTEIROS
 * Conta corrente de clientes ("Pendura") e controle automático de comissões de carpinteiros/indicadores.
 */

const ClientesModule = {
  activeSubTab: 'clientes', // 'clientes' ou 'carpinteiros'
  activeClienteProfile: null,

  init() {
    this.renderSubTabs();
    this.renderListaClientes();
    this.renderListaCarpinteiros();
    this.setupEventListeners();
  },

  setupEventListeners() {
    // Alternador de sub-abas (Clientes vs Carpinteiros)
    const btnSubClientes = document.getElementById('subtab-btn-clientes');
    const btnSubCarpinteiros = document.getElementById('subtab-btn-carpinteiros');

    if (btnSubClientes && btnSubCarpinteiros) {
      btnSubClientes.addEventListener('click', () => {
        btnSubClientes.classList.add('active');
        btnSubCarpinteiros.classList.remove('active');
        document.getElementById('subtab-clientes-view').style.display = 'block';
        document.getElementById('subtab-carpinteiros-view').style.display = 'none';
        this.activeSubTab = 'clientes';
        this.renderListaClientes();
      });

      btnSubCarpinteiros.addEventListener('click', () => {
        btnSubCarpinteiros.classList.add('active');
        btnSubClientes.classList.remove('active');
        document.getElementById('subtab-clientes-view').style.display = 'none';
        document.getElementById('subtab-carpinteiros-view').style.display = 'block';
        this.activeSubTab = 'carpinteiros';
        this.renderListaCarpinteiros();
      });
    }

    // Busca de Clientes
    const inputBuscaCli = document.getElementById('clientes-busca-input');
    if (inputBuscaCli) {
      inputBuscaCli.addEventListener('input', () => this.renderListaClientes());
    }

    // Modal Novo Cliente
    const btnNovoCli = document.getElementById('btn-novo-cliente-modal');
    if (btnNovoCli) {
      btnNovoCli.addEventListener('click', () => this.abrirModalNovoCliente());
    }

    const btnSalvarCli = document.getElementById('btn-salvar-novo-cliente');
    if (btnSalvarCli) {
      btnSalvarCli.addEventListener('click', () => this.salvarNovoCliente());
    }

    // Máscara inteligente para documento e telefone no modal de cliente
    const inputDocModal = document.getElementById('modal-cli-documento');
    const badgeDocModal = document.getElementById('modal-doc-tipo-badge');
    if (inputDocModal && window.DocMascara) {
      DocMascara.aplicar(inputDocModal, badgeDocModal);
    }
    const inputTelModal = document.getElementById('modal-cli-telefone');
    if (inputTelModal && window.DocMascara) {
      DocMascara.aplicarTelefone(inputTelModal);
    }

    // Modal Novo Carpinteiro
    const btnNovoCarp = document.getElementById('btn-novo-carpinteiro-modal');
    if (btnNovoCarp) {
      btnNovoCarp.addEventListener('click', () => this.abrirModalNovoCarpinteiro());
    }

    const btnSalvarCarp = document.getElementById('btn-salvar-novo-carpinteiro');
    if (btnSalvarCarp) {
      btnSalvarCarp.addEventListener('click', () => this.salvarNovoCarpinteiro());
    }

    // Modal Lançamento na Conta Corrente
    const btnLancarConta = document.getElementById('btn-confirmar-lancamento-conta');
    if (btnLancarConta) {
      btnLancarConta.addEventListener('click', () => this.confirmarLancamentoConta());
    }
  },

  renderSubTabs() {
    // garante estado visual
  },

  renderListaClientes() {
    const tbody = document.getElementById('clientes-tabela-tbody');
    if (!tbody) return;

    const termo = document.getElementById('clientes-busca-input')?.value?.trim().toLowerCase() || '';
    let clientes = DB.getClientes();

    if (termo) {
      clientes = clientes.filter(c =>
        c.nome.toLowerCase().includes(termo) ||
        (c.documento && c.documento.includes(termo)) ||
        (c.telefone && c.telefone.includes(termo)) ||
        (c.bairro && c.bairro.toLowerCase().includes(termo))
      );
    }

    const pedidos = DB.getPedidos();

    tbody.innerHTML = clientes.map(c => {
      // Calcula total de compras
      const pedidosCli = pedidos.filter(p => p.cliente && (p.cliente.id === c.id || p.cliente.nome === c.nome));
      const totalGasto = pedidosCli.reduce((acc, p) => acc + (p.resumo_financeiro?.valor_total || 0), 0);
      const saldo = c.saldo_devedor || 0;

      let saldoBadge = '';
      if (saldo > 0) {
        saldoBadge = `<span class="badge-tag badge-cancelado" style="font-size: 11.5px;">Saldo Aberto: ${CalcEngine.formatBRL(saldo)}</span>`;
      } else if (saldo < 0) {
        saldoBadge = `<span class="badge-tag badge-aparelhada" style="font-size: 11.5px;">Crédito: ${CalcEngine.formatBRL(Math.abs(saldo))}</span>`;
      } else {
        saldoBadge = `<span style="color: var(--brand-primary); font-size: 11.5px; font-weight: 600;">Em dia</span>`;
      }

      return `
        <tr>
          <td>
            <strong>${c.nome}</strong>
            <div style="font-size: 11px; color: var(--text-muted);">${c.documento || 'Sem CPF/CNPJ'} | ${c.email || ''}</div>
          </td>
          <td class="font-mono">${c.telefone || '-'}</td>
          <td>
            <div>${c.endereco_obra || '-'}</div>
            <div style="font-size: 11px; color: var(--text-secondary);">${c.bairro || ''} - ${c.cidade || 'SP'}</div>
          </td>
          <td class="align-center font-mono">${pedidosCli.length}</td>
          <td class="align-right font-mono" style="font-weight: 600;">${CalcEngine.formatBRL(totalGasto)}</td>
          <td class="align-right font-mono">${saldoBadge}</td>
          <td class="align-center">
            <button class="btn btn-sm btn-primary" onclick="ClientesModule.abrirFichaCliente('${c.id}')">
              Ver Ficha
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  abrirFichaCliente(clienteId) {
    const clientes = DB.getClientes();
    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return;

    this.activeClienteProfile = cliente;
    const modal = document.getElementById('modal-ficha-cliente');
    if (!modal) return;

    document.getElementById('ficha-cli-nome').textContent = cliente.nome;
    document.getElementById('ficha-cli-doc').textContent = cliente.documento || 'Não informado';
    document.getElementById('ficha-cli-tel').textContent = cliente.telefone || 'Não informado';
    document.getElementById('ficha-cli-endereco').textContent = `${cliente.endereco_obra || 'Sem endereço'} - ${cliente.bairro || ''} (${cliente.cidade || 'SP'})`;
    
    const saldoEl = document.getElementById('ficha-cli-saldo');
    if (saldoEl) {
      if (cliente.saldo_devedor > 0) {
        saldoEl.innerHTML = `<span style="color: var(--red-text); font-weight: 800;">DEVEDOR: ${CalcEngine.formatBRL(cliente.saldo_devedor)}</span>`;
      } else if (cliente.saldo_devedor < 0) {
        saldoEl.innerHTML = `<span style="color: var(--action-green); font-weight: 800;">CRÉDITO: ${CalcEngine.formatBRL(Math.abs(cliente.saldo_devedor))}</span>`;
      } else {
        saldoEl.innerHTML = `<span style="color: var(--action-green); font-weight: 700;">CONTA EM DIA (R$ 0,00)</span>`;
      }
    }

    // Histórico de pedidos do cliente
    const pedidos = DB.getPedidos().filter(p => p.cliente && (p.cliente.id === cliente.id || p.cliente.nome === cliente.nome));
    const tbodyPedidos = document.getElementById('ficha-cli-pedidos-tbody');
    if (tbodyPedidos) {
      tbodyPedidos.innerHTML = pedidos.map(p => `
        <tr>
          <td class="font-mono">#${p.numero}</td>
          <td>${new Date(p.data_criacao).toLocaleDateString('pt-BR')}</td>
          <td><span class="badge-tag ${p.status === 'APROVADO' ? 'badge-aprovado' : p.status === 'ENTREGUE' ? 'badge-entregue' : 'badge-orcamento'}">${p.status}</span></td>
          <td class="align-right font-mono">${CalcEngine.formatBRL(p.resumo_financeiro?.valor_total || 0)}</td>
          <td class="align-right font-mono">${CalcEngine.formatBRL(p.resumo_financeiro?.saldo_a_receber || 0)}</td>
          <td class="align-center">
            <button class="btn btn-sm btn-secondary" onclick="BalcaoModule.carregarPedidoParaEdicao('${p.id}'); ClientesModule.fecharFichaCliente();">Abrir</button>
          </td>
        </tr>
      `).join('') || '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhum pedido registrado para este cliente.</td></tr>';
    }

    // Extrato da conta corrente
    const tbodyExtrato = document.getElementById('ficha-cli-extrato-tbody');
    if (tbodyExtrato) {
      const extrato = cliente.historico_financeiro || [];
      tbodyExtrato.innerHTML = extrato.map(ext => `
        <tr>
          <td>${ext.data}</td>
          <td><span class="badge-tag ${ext.tipo === 'QUITACAO' ? 'badge-entregue' : ext.tipo === 'CREDITO' ? 'badge-aparelhada' : 'badge-cancelado'}">${ext.tipo}</span></td>
          <td class="align-right font-mono">${CalcEngine.formatBRL(ext.valor)}</td>
          <td>${ext.obs || '-'}</td>
        </tr>
      `).join('') || '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Nenhum lançamento no extrato financeiro.</td></tr>';
    }

    modal.classList.add('active');
  },

  fecharFichaCliente() {
    const modal = document.getElementById('modal-ficha-cliente');
    if (modal) modal.classList.remove('active');
  },

  abrirModalLancamentoConta() {
    if (!this.activeClienteProfile) return;
    const modal = document.getElementById('modal-lancamento-conta');
    if (!modal) return;

    document.getElementById('lancamento-cli-nome').textContent = this.activeClienteProfile.nome;
    document.getElementById('lancamento-valor-input').value = '';
    document.getElementById('lancamento-obs-input').value = '';

    modal.classList.add('active');
  },

  fecharModalLancamentoConta() {
    const modal = document.getElementById('modal-lancamento-conta');
    if (modal) modal.classList.remove('active');
  },

  confirmarLancamentoConta() {
    if (!this.activeClienteProfile) return;

    const tipo = document.getElementById('lancamento-tipo-select').value;
    const valor = parseFloat(document.getElementById('lancamento-valor-input').value) || 0;
    const obs = document.getElementById('lancamento-obs-input').value.trim() || 'Lançamento manual no balcão';

    if (valor <= 0) {
      App.showToast('Informe um valor válido maior que zero.', 'warning');
      return;
    }

    const clientes = DB.getClientes();
    const cliente = clientes.find(c => c.id === this.activeClienteProfile.id);
    if (!cliente) return;

    if (!cliente.historico_financeiro) cliente.historico_financeiro = [];

    if (tipo === 'QUITACAO') {
      cliente.saldo_devedor = Math.max(0, (cliente.saldo_devedor || 0) - valor);
    } else if (tipo === 'CREDITO') {
      cliente.saldo_devedor = (cliente.saldo_devedor || 0) - valor;
    } else { // DEBITO / PENDURA
      cliente.saldo_devedor = (cliente.saldo_devedor || 0) + valor;
    }

    cliente.historico_financeiro.unshift({
      data: new Date().toISOString().split('T')[0],
      tipo: tipo,
      valor: valor,
      obs: obs
    });

    DB.set(STORAGE_KEYS.CLIENTES, clientes);
    this.activeClienteProfile = cliente;
    this.fecharModalLancamentoConta();
    this.abrirFichaCliente(cliente.id);
    this.renderListaClientes();

    App.showToast(`Lançamento de ${CalcEngine.formatBRL(valor)} registrado na conta corrente!`, 'success');
  },

  // CARPINTEIROS E INDICADORES
  renderListaCarpinteiros() {
    const tbody = document.getElementById('carpinteiros-tabela-tbody');
    if (!tbody) return;

    const carpinteiros = DB.getCarpinteiros();
    const pedidos = DB.getPedidos();

    tbody.innerHTML = carpinteiros.map(carp => {
      // Recalcula totais a partir dos pedidos reais
      const pedidosDoCarp = pedidos.filter(p => p.carpinteiro_id === carp.id && p.status !== 'CANCELADO');
      const totalVendido = pedidosDoCarp.reduce((acc, p) => acc + (p.resumo_financeiro?.valor_total || 0), 0);
      const comissaoEsperada = totalVendido * (carp.comissao_padrao_pct / 100);
      const saldoPendente = Math.max(0, comissaoEsperada - (carp.comissao_paga || 0));

      return `
        <tr>
          <td>
            <strong>${carp.nome}</strong>
            <div style="font-size: 10.5px; color: var(--text-secondary);">${carp.especialidade}</div>
          </td>
          <td class="font-mono">${carp.telefone || '-'}</td>
          <td class="align-center font-mono"><strong>${carp.comissao_padrao_pct}%</strong></td>
          <td class="align-center font-mono">${pedidosDoCarp.length}</td>
          <td class="align-right font-mono" style="font-weight: 700;">${CalcEngine.formatBRL(totalVendido)}</td>
          <td class="align-right font-mono" style="color: var(--primary-green); font-weight: 600;">${CalcEngine.formatBRL(comissaoEsperada)}</td>
          <td class="align-right font-mono">${CalcEngine.formatBRL(carp.comissao_paga || 0)}</td>
          <td class="align-right font-mono" style="font-weight: 800; color: ${saldoPendente > 0 ? 'var(--amber-text)' : 'var(--action-green)'};">
            ${saldoPendente > 0 ? CalcEngine.formatBRL(saldoPendente) : 'Quitada'}
          </td>
          <td class="align-center">
            <button class="btn btn-sm btn-secondary" onclick="ClientesModule.pagarComissaoModal('${carp.id}', ${saldoPendente})">
              Pagar Comissão
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  pagarComissaoModal(carpId, saldoPendente) {
    const carp = DB.getCarpinteiros().find(c => c.id === carpId);
    if (!carp) return;

    const valorStr = prompt(`Registrar pagamento de comissão para ${carp.nome}:\nSaldo pendente: ${CalcEngine.formatBRL(saldoPendente)}\n\nDigite o valor pago (R$):`, saldoPendente > 0 ? saldoPendente.toFixed(2) : '100.00');
    if (valorStr !== null) {
      const valor = parseFloat(valorStr) || 0;
      if (valor <= 0) return;

      const carpinteiros = DB.getCarpinteiros();
      const c = carpinteiros.find(x => x.id === carpId);
      if (c) {
        c.comissao_paga = (c.comissao_paga || 0) + valor;
        c.saldo_a_pagar = Math.max(0, (c.comissao_acumulada || 0) - c.comissao_paga);
        DB.set(STORAGE_KEYS.CARPINTEIROS, carpinteiros);
        this.renderListaCarpinteiros();
        App.showToast(`Pagamento de comissão de ${CalcEngine.formatBRL(valor)} registrado com sucesso!`, 'success');
      }
    }
  },

  abrirModalNovoCliente() {
    const modal = document.getElementById('modal-novo-cliente');
    if (modal) modal.classList.add('active');
    const inputDoc = document.getElementById('modal-cli-documento');
    if (inputDoc) inputDoc.dispatchEvent(new Event('input'));
    const inputTel = document.getElementById('modal-cli-telefone');
    if (inputTel) inputTel.dispatchEvent(new Event('input'));
  },

  fecharModalNovoCliente() {
    const modal = document.getElementById('modal-novo-cliente');
    if (modal) modal.classList.remove('active');
  },

  salvarNovoCliente() {
    const getVal = id => document.getElementById(id)?.value?.trim() || '';
    const nome = getVal('modal-cli-nome');

    if (!nome) {
      App.showToast('Informe o nome do cliente.', 'warning');
      return;
    }

    const clienteData = {
      id: 'cli_' + Date.now(),
      nome: nome,
      documento: getVal('modal-cli-documento'),
      telefone: getVal('modal-cli-telefone'),
      email: getVal('modal-cli-email'),
      endereco_obra: getVal('modal-cli-endereco'),
      bairro: getVal('modal-cli-bairro'),
      cidade: getVal('modal-cli-cidade') || 'Caçapava',
      saldo_devedor: 0.00,
      historico_financeiro: [],
      observacoes: getVal('modal-cli-obs') || ''
    };

    const clientes = DB.getClientes();
    clientes.push(clienteData);
    DB.set(STORAGE_KEYS.CLIENTES, clientes);

    this.fecharModalNovoCliente();
    this.renderListaClientes();
    App.showToast(`Cliente ${clienteData.nome} cadastrado!`, 'success');
  },

  abrirModalNovoCarpinteiro() {
    const modal = document.getElementById('modal-novo-carpinteiro');
    if (modal) modal.classList.add('active');
  },

  fecharModalNovoCarpinteiro() {
    const modal = document.getElementById('modal-novo-carpinteiro');
    if (modal) modal.classList.remove('active');
  },

  salvarNovoCarpinteiro() {
    const getVal = id => document.getElementById(id)?.value?.trim() || '';
    const nome = getVal('modal-carp-nome');

    if (!nome) {
      App.showToast('Informe o nome do parceiro/carpinteiro.', 'warning');
      return;
    }

    const novoCarp = {
      id: 'carp_' + Date.now(),
      nome: nome,
      telefone: getVal('modal-carp-telefone'),
      especialidade: getVal('modal-carp-especialidade') || 'Carpintaria e Coberturas',
      comissao_padrao_pct: parseFloat(getVal('modal-carp-comissao')) || 4.0,
      total_indicado_mes: 0,
      pedidos_indicados_qtd: 0,
      comissao_acumulada: 0,
      comissao_paga: 0,
      saldo_a_pagar: 0
    };

    const carpinteiros = DB.getCarpinteiros();
    carpinteiros.push(novoCarp);
    DB.set(STORAGE_KEYS.CARPINTEIROS, carpinteiros);

    this.fecharModalNovoCarpinteiro();
    this.renderListaCarpinteiros();
    BalcaoModule.renderCarpinteirosSelect();
    App.showToast(`Parceiro ${novoCarp.nome} cadastrado!`, 'success');
  }
};

window.ClientesModule = ClientesModule;

