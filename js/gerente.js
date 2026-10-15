/**
 * SERRARIA & MADEIREIRA ERP - MÓDULO DA GERÊNCIA & ADMINISTRAÇÃO
 * Central do Gerente: Gestão de Funcionários, Comissões, Parâmetros de Preços, Senha e Auditoria.
 */

const GerenteModule = {
  activeSubTab: 'equipe',

  init() {
    this.setupEventListeners();
  },

  setupEventListeners() {
    // Alternância de sub-abas da gerência
    document.querySelectorAll('.gerente-subtab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const subtab = btn.dataset.subtab;
        this.switchSubTab(subtab);
      });
    });

    // Salvar funcionário no modal
    const btnSalvarFunc = document.getElementById('btn-salvar-funcionario');
    if (btnSalvarFunc) {
      btnSalvarFunc.addEventListener('click', () => this.salvarFuncionario());
    }

    // Confirmar pagamento de comissão no modal
    const btnConfirmarPag = document.getElementById('btn-confirmar-pag-comissao');
    if (btnConfirmarPag) {
      btnConfirmarPag.addEventListener('click', () => this.confirmarPagamentoComissao());
    }

    // Salvar configurações e parâmetros gerais
    const btnSalvarCfg = document.getElementById('btn-salvar-config-gerente');
    if (btnSalvarCfg) {
      btnSalvarCfg.addEventListener('click', () => this.salvarConfiguracoes());
    }

    // Salvar nova conta de usuário / acesso
    const btnSalvarConta = document.getElementById('btn-salvar-conta-usuario');
    if (btnSalvarConta) {
      btnSalvarConta.addEventListener('click', () => this.salvarContaUsuario());
    }

    // Máscara inteligente para CNPJ e Telefone nas configurações
    const inputCnpjCfg = document.getElementById('cfg-cnpj-madeireira');
    const badgeCnpjCfg = document.getElementById('cfg-cnpj-badge');
    if (inputCnpjCfg && window.DocMascara) {
      DocMascara.aplicar(inputCnpjCfg, badgeCnpjCfg);
    }
    const inputTelCfg = document.getElementById('cfg-tel-madeireira');
    if (inputTelCfg && window.DocMascara) {
      DocMascara.aplicarTelefone(inputTelCfg);
    }
  },

  render() {
    this.renderCardsResumo();
    this.renderSubTabContent(this.activeSubTab);
  },

  switchSubTab(subtab) {
    this.activeSubTab = subtab;
    document.querySelectorAll('.gerente-subtab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.subtab === subtab);
    });
    document.querySelectorAll('.gerente-subtab-content').forEach(pane => {
      pane.style.display = pane.id === `gerente-subtab-${subtab}` ? 'block' : 'none';
    });
    this.renderSubTabContent(subtab);
  },

  renderSubTabContent(subtab) {
    if (subtab === 'equipe') {
      this.renderTabelaFuncionarios();
    } else if (subtab === 'comissoes') {
      this.renderComissoes();
    } else if (subtab === 'parametros') {
      this.renderParametros();
    } else if (subtab === 'auditoria') {
      this.renderAuditoriaERanking();
    } else if (subtab === 'contas') {
      this.renderTabelaContas();
    }
  },

  renderCardsResumo() {
    const funcionarios = DB.getFuncionarios();
    const config = DB.getConfig();
    const pedidos = DB.getPedidos();
    const carpinteiros = DB.getCarpinteiros();

    const ativosQtd = funcionarios.filter(f => f.ativo).length;

    // Vendas e faturamento acumulado no mês
    const vendasMesTotal = pedidos
      .filter(p => p.status === 'APROVADO' || p.status === 'ENTREGUE')
      .reduce((acc, p) => acc + (p.resumo_financeiro?.valor_total || 0), 0);

    // Saldo pendente de comissão (vendedores + carpinteiros)
    const saldoComissaoVend = funcionarios.reduce((acc, f) => acc + (parseFloat(f.saldo_comissao) || 0), 0);
    const saldoComissaoCarp = carpinteiros.reduce((acc, c) => acc + (parseFloat(c.saldo_a_pagar) || 0), 0);
    const totalComissoesPendentes = saldoComissaoVend + saldoComissaoCarp;

    // Meta percentual
    const metaFaturamento = parseFloat(config.meta_faturamento_mensal) || 150000;
    const atingidoPct = metaFaturamento > 0 ? (vendasMesTotal / metaFaturamento) * 100 : 0;

    const elTotalFunc = document.getElementById('gerente-kpi-equipe');
    if (elTotalFunc) elTotalFunc.textContent = `${ativosQtd} ativos`;

    const elFaturamento = document.getElementById('gerente-kpi-faturamento');
    if (elFaturamento) elFaturamento.textContent = CalcEngine.formatBRL(vendasMesTotal);

    const elMeta = document.getElementById('gerente-kpi-meta');
    if (elMeta) elMeta.textContent = `${atingidoPct.toFixed(1)}% da meta (${CalcEngine.formatBRL(metaFaturamento)})`;

    const elComissoes = document.getElementById('gerente-kpi-comissoes');
    if (elComissoes) elComissoes.textContent = CalcEngine.formatBRL(totalComissoesPendentes);
  },

  // =========================================================================
  // ABA 1: FUNCIONÁRIOS & EQUIPE
  // =========================================================================
  renderTabelaFuncionarios() {
    const tbody = document.getElementById('tabela-funcionarios-corpo');
    if (!tbody) return;

    const funcionarios = DB.getFuncionarios();

    if (!funcionarios.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding: 24px; color: var(--text-muted);">
            Nenhum funcionário cadastrado no sistema.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = funcionarios.map(f => {
      const iniciais = f.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      const temComissao = parseFloat(f.comissao_pct) > 0;
      const saldoComissao = parseFloat(f.saldo_comissao) || 0;

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="user-avatar-circle">${iniciais}</div>
              <div>
                <strong style="color: var(--text-primary); font-size: 13px;">${f.nome}</strong>
                <div style="font-size: 11px; color: var(--text-muted);">${f.email || 'Sem email'}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="badge-tag" style="background-color: var(--bg-hover); color: var(--text-primary); font-weight: 600;">
              ${f.cargo}
            </span>
          </td>
          <td class="font-mono">
            ${f.telefone ? `
              <a href="https://wa.me/55${f.telefone.replace(/\D/g, '')}" target="_blank" style="color: var(--color-success); font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                <svg viewBox="0 0 24 24" style="width:13px;height:13px;stroke:currentColor;stroke-width:2;fill:none;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                ${f.telefone}
              </a>
            ` : '-'}
          </td>
          <td class="align-center font-mono">
            ${temComissao ? `<strong>${f.comissao_pct}%</strong>` : '<span style="color: var(--text-muted); font-size: 11px;">Salário Fixo</span>'}
          </td>
          <td class="align-right font-mono">
            ${temComissao ? CalcEngine.formatBRL(f.vendas_mes || 0) : '-'}
          </td>
          <td class="align-right font-mono">
            ${temComissao ? `
              <span style="${saldoComissao > 0 ? 'color: var(--color-danger); font-weight: 700;' : 'color: var(--color-success); font-weight: 600;'}">
                ${CalcEngine.formatBRL(saldoComissao)}
              </span>
            ` : '-'}
          </td>
          <td class="align-center">
            ${f.ativo 
              ? '<span class="status-badge status-aprovado">Ativo</span>' 
              : '<span class="status-badge status-cancelado">Inativo</span>'}
          </td>
          <td class="align-center">
            <div style="display: flex; gap: 5px; justify-content: center;">
              <button class="btn btn-sm btn-secondary" title="Editar Funcionário" onclick="GerenteModule.abrirModalFuncionario('${f.id}')">
                Editar
              </button>
              ${temComissao && saldoComissao > 0 ? `
                <button class="btn btn-sm btn-success" title="Pagar Comissão" onclick="GerenteModule.abrirModalPagarComissao('VENDEDOR', '${f.id}', '${f.nome}', ${saldoComissao}, '${f.pix || ''}')">
                  Pagar
                </button>
              ` : ''}
              <button class="btn btn-sm btn-secondary" title="${f.ativo ? 'Desativar' : 'Ativar'}" onclick="GerenteModule.alternarStatusFuncionario('${f.id}')">
                ${f.ativo ? 'Desativar' : 'Ativar'}
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  abrirModalFuncionario(funcId = null) {
    const modal = document.getElementById('modal-funcionario');
    if (!modal) return;

    const tituloModal = document.getElementById('modal-funcionario-titulo');
    const inputId = document.getElementById('func-id');
    const inputNome = document.getElementById('func-nome');
    const selectCargo = document.getElementById('func-cargo');
    const inputTel = document.getElementById('func-telefone');
    const inputEmail = document.getElementById('func-email');
    const inputComissao = document.getElementById('func-comissao');
    const inputSalario = document.getElementById('func-salario');
    const inputPix = document.getElementById('func-pix');
    const selectAtivo = document.getElementById('func-ativo');

    if (funcId) {
      const f = DB.getFuncionarios().find(item => item.id === funcId);
      if (!f) return;
      tituloModal.textContent = `Editar Funcionário: ${f.nome}`;
      inputId.value = f.id;
      inputNome.value = f.nome;
      selectCargo.value = f.cargo;
      inputTel.value = f.telefone || '';
      inputEmail.value = f.email || '';
      inputComissao.value = f.comissao_pct !== undefined ? f.comissao_pct : 0;
      inputSalario.value = f.salario_base || 0;
      inputPix.value = f.pix || '';
      selectAtivo.value = f.ativo ? 'true' : 'false';
    } else {
      tituloModal.textContent = 'Novo Funcionário / Membro da Equipe';
      inputId.value = '';
      inputNome.value = '';
      selectCargo.value = 'Vendedor de Balcão';
      inputTel.value = '';
      inputEmail.value = '';
      inputComissao.value = '2.0';
      inputSalario.value = '2200.00';
      inputPix.value = '';
      selectAtivo.value = 'true';
    }

    modal.classList.add('active');
    inputNome.focus();
  },

  fecharModalFuncionario() {
    const modal = document.getElementById('modal-funcionario');
    if (modal) modal.classList.remove('active');
  },

  salvarFuncionario() {
    const id = document.getElementById('func-id').value;
    const nome = document.getElementById('func-nome').value.trim();
    const cargo = document.getElementById('func-cargo').value;
    const telefone = document.getElementById('func-telefone').value.trim();
    const email = document.getElementById('func-email').value.trim();
    const comissao_pct = parseFloat(document.getElementById('func-comissao').value) || 0;
    const salario_base = parseFloat(document.getElementById('func-salario').value) || 0;
    const pix = document.getElementById('func-pix').value.trim();
    const ativo = document.getElementById('func-ativo').value === 'true';

    if (!nome) {
      App.showToast('Por favor, informe o nome do funcionário.', 'error');
      return;
    }

    const funcionarioData = {
      id: id || ('func_' + Date.now()),
      nome,
      cargo,
      telefone,
      email,
      comissao_pct,
      salario_base,
      pix,
      ativo
    };

    if (id) {
      const original = DB.getFuncionarios().find(f => f.id === id);
      if (original) {
        funcionarioData.vendas_mes = original.vendas_mes || 0;
        funcionarioData.comissao_acumulada = original.comissao_acumulada || 0;
        funcionarioData.comissao_paga = original.comissao_paga || 0;
        funcionarioData.saldo_comissao = original.saldo_comissao || 0;
      }
    } else {
      funcionarioData.vendas_mes = 0;
      funcionarioData.comissao_acumulada = 0;
      funcionarioData.comissao_paga = 0;
      funcionarioData.saldo_comissao = 0;
    }

    DB.salvarFuncionario(funcionarioData);
    this.fecharModalFuncionario();
    this.render();
    if (window.BalcaoModule && BalcaoModule.renderVendedoresSelect) {
      BalcaoModule.renderVendedoresSelect();
    }
    App.showToast(`Funcionário "${nome}" salvo com sucesso!`, 'success');
  },

  alternarStatusFuncionario(funcId) {
    const funcionarios = DB.getFuncionarios();
    const f = funcionarios.find(item => item.id === funcId);
    if (!f) return;

    f.ativo = !f.ativo;
    DB.salvarFuncionario(f);
    this.render();
    if (window.BalcaoModule && BalcaoModule.renderVendedoresSelect) {
      BalcaoModule.renderVendedoresSelect();
    }
    App.showToast(`Funcionário ${f.nome} ${f.ativo ? 'ativado' : 'desativado'}!`, 'info');
  },

  // =========================================================================
  // ABA 2: GESTÃO DE COMISSÕES (VENDEDORES + CARPINTEIROS)
  // =========================================================================
  renderComissoes() {
    const containerVendedores = document.getElementById('comissoes-vendedores-container');
    const containerCarpinteiros = document.getElementById('comissoes-carpinteiros-container');
    const tbodyHistorico = document.getElementById('tabela-historico-pagamentos-corpo');

    const funcionarios = DB.getFuncionarios().filter(f => parseFloat(f.comissao_pct) > 0);
    const carpinteiros = DB.getCarpinteiros();
    const pagamentos = DB.getPagamentosComissao();

    // Vendedores Internos
    if (containerVendedores) {
      containerVendedores.innerHTML = funcionarios.map(f => {
        const saldo = parseFloat(f.saldo_comissao) || 0;
        return `
          <div class="commission-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <div>
                <strong style="font-size: 13.5px; color: var(--text-primary);">${f.nome}</strong>
                <div style="font-size: 11px; color: var(--text-muted);">${f.cargo} • ${f.comissao_pct}% comissão</div>
              </div>
              <span class="badge-tag" style="background-color: var(--brand-primary-light); color: var(--brand-primary-text); font-weight: 700;">
                Equipe Interna
              </span>
            </div>
            
            <div class="commission-stats-grid">
              <div>
                <span class="commission-label">Vendas no Mês</span>
                <span class="commission-val font-mono">${CalcEngine.formatBRL(f.vendas_mes || 0)}</span>
              </div>
              <div>
                <span class="commission-label">Comissão Gerada</span>
                <span class="commission-val font-mono">${CalcEngine.formatBRL(f.comissao_acumulada || 0)}</span>
              </div>
              <div>
                <span class="commission-label">Já Pago</span>
                <span class="commission-val font-mono" style="color: var(--color-success);">${CalcEngine.formatBRL(f.comissao_paga || 0)}</span>
              </div>
              <div>
                <span class="commission-label">Saldo a Pagar</span>
                <span class="commission-val font-mono" style="${saldo > 0 ? 'color: var(--color-danger); font-weight: 800;' : 'color: var(--text-muted);'}">
                  ${CalcEngine.formatBRL(saldo)}
                </span>
              </div>
            </div>

            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 11px; color: var(--text-secondary); font-family: var(--font-mono);">
                Chave Pix: <strong>${f.pix || 'Não cadastrada'}</strong>
              </span>
              <button class="btn btn-sm btn-success" ${saldo <= 0 ? 'disabled' : ''} onclick="GerenteModule.abrirModalPagarComissao('VENDEDOR', '${f.id}', '${f.nome}', ${saldo}, '${f.pix || ''}')">
                Pagar Comissão
              </button>
            </div>
          </div>
        `;
      }).join('') || '<div style="padding: 15px; color: var(--text-muted); font-size: 12px;">Nenhum vendedor com comissão configurada.</div>';
    }

    // Carpinteiros Indicadores
    if (containerCarpinteiros) {
      containerCarpinteiros.innerHTML = carpinteiros.map(c => {
        const saldo = parseFloat(c.saldo_a_pagar) || 0;
        return `
          <div class="commission-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <div>
                <strong style="font-size: 13.5px; color: var(--text-primary);">${c.nome}</strong>
                <div style="font-size: 11px; color: var(--text-muted);">${c.especialidade || 'Carpinteiro Parceiro'} • ${c.comissao_padrao_pct}% comissão</div>
              </div>
              <span class="badge-tag" style="background-color: #FEF3C7; color: #92400E; font-weight: 700;">
                Parceiro Externo
              </span>
            </div>

            <div class="commission-stats-grid">
              <div>
                <span class="commission-label">Indicações (Mês)</span>
                <span class="commission-val font-mono">${CalcEngine.formatBRL(c.total_indicado_mes || 0)}</span>
              </div>
              <div>
                <span class="commission-label">Comissão Total</span>
                <span class="commission-val font-mono">${CalcEngine.formatBRL(c.comissao_acumulada || 0)}</span>
              </div>
              <div>
                <span class="commission-label">Já Pago</span>
                <span class="commission-val font-mono" style="color: var(--color-success);">${CalcEngine.formatBRL(c.comissao_paga || 0)}</span>
              </div>
              <div>
                <span class="commission-label">Saldo Pendente</span>
                <span class="commission-val font-mono" style="${saldo > 0 ? 'color: var(--color-danger); font-weight: 800;' : 'color: var(--text-muted);'}">
                  ${CalcEngine.formatBRL(saldo)}
                </span>
              </div>
            </div>

            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 11px; color: var(--text-secondary); font-family: var(--font-mono);">
                Telefone: <strong>${c.telefone || '-'}</strong>
              </span>
              <button class="btn btn-sm btn-success" ${saldo <= 0 ? 'disabled' : ''} onclick="GerenteModule.abrirModalPagarComissao('CARPINTEIRO', '${c.id}', '${c.nome}', ${saldo}, '${c.telefone || ''}')">
                Pagar Comissão
              </button>
            </div>
          </div>
        `;
      }).join('') || '<div style="padding: 15px; color: var(--text-muted); font-size: 12px;">Nenhum carpinteiro parceiro cadastrado.</div>';
    }

    // Histórico de Baixas Realizadas
    if (tbodyHistorico) {
      if (!pagamentos.length) {
        tbodyHistorico.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 20px; color: var(--text-muted);">
              Nenhum pagamento de comissão registrado ainda.
            </td>
          </tr>
        `;
      } else {
        tbodyHistorico.innerHTML = pagamentos.map(p => `
          <tr>
            <td class="font-mono">${new Date(p.data).toLocaleDateString('pt-BR')} ${new Date(p.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
            <td>
              <strong>${p.beneficiario_nome}</strong>
              <div style="font-size: 11px; color: var(--text-muted);">${p.beneficiario_tipo === 'VENDEDOR' ? 'Vendedor Interno' : 'Carpinteiro Parceiro'}</div>
            </td>
            <td class="align-right font-mono" style="color: var(--color-success); font-weight: 700;">
              ${CalcEngine.formatBRL(p.valor)}
            </td>
            <td>
              <span class="badge-tag" style="background-color: var(--bg-hover); color: var(--text-primary);">
                ${p.forma_pagamento || 'Pix'}
              </span>
            </td>
            <td style="font-size: 12px; color: var(--text-secondary);">
              ${p.comprovante_obs || '-'}
            </td>
            <td class="align-center">
              <span style="color: var(--color-success); font-weight: 600; display: inline-flex; align-items: center; gap: 4px; font-size: 11.5px;">
                <svg viewBox="0 0 24 24" style="width:12px;height:12px;stroke:currentColor;stroke-width:3;fill:none;"><polyline points="20 6 9 17 4 12"/></svg>
                Quitado
              </span>
            </td>
          </tr>
        `).join('');
      }
    }
  },

  abrirModalPagarComissao(tipo, id, nome, saldo, pix) {
    const modal = document.getElementById('modal-pagar-comissao');
    if (!modal) return;

    document.getElementById('pag-com-id').value = id;
    document.getElementById('pag-com-tipo').value = tipo;
    document.getElementById('pag-com-nome-display').textContent = nome;
    document.getElementById('pag-com-tipo-display').textContent = tipo === 'VENDEDOR' ? 'Vendedor Interno' : 'Carpinteiro Indicador';
    document.getElementById('pag-com-saldo-display').textContent = CalcEngine.formatBRL(saldo);
    document.getElementById('pag-com-pix-display').textContent = pix || 'Chave não cadastrada';
    document.getElementById('pag-com-valor').value = parseFloat(saldo).toFixed(2);
    document.getElementById('pag-com-obs').value = `Pagamento de comissões acumuladas - ${new Date().toLocaleDateString('pt-BR')}`;

    modal.classList.add('active');
  },

  fecharModalPagarComissao() {
    const modal = document.getElementById('modal-pagar-comissao');
    if (modal) modal.classList.remove('active');
  },

  confirmarPagamentoComissao() {
    const id = document.getElementById('pag-com-id').value;
    const tipo = document.getElementById('pag-com-tipo').value;
    const nome = document.getElementById('pag-com-nome-display').textContent;
    const valor = parseFloat(document.getElementById('pag-com-valor').value) || 0;
    const forma = document.getElementById('pag-com-forma').value;
    const obs = document.getElementById('pag-com-obs').value.trim();

    if (valor <= 0) {
      App.showToast('Informe um valor de pagamento válido.', 'error');
      return;
    }

    DB.registrarPagamentoComissao({
      beneficiario_tipo: tipo,
      beneficiario_id: id,
      beneficiario_nome: nome,
      valor,
      forma_pagamento: forma,
      comprovante_obs: obs
    });

    this.fecharModalPagarComissao();
    this.render();
    if (window.ClientesModule) ClientesModule.renderListaCarpinteiros();
    App.showToast(`Pagamento de comissão de ${CalcEngine.formatBRL(valor)} registrado com sucesso!`, 'success');
  },

  // =========================================================================
  // ABA 3: PARÂMETROS, PREÇOS E SEGURANÇA
  // =========================================================================
  renderParametros() {
    const config = DB.getConfig();

    const inputSenha = document.getElementById('cfg-senha-gerente');
    const inputTeto = document.getElementById('cfg-teto-desconto');
    const inputPlainaMl = document.getElementById('cfg-taxa-plaina-ml');
    const inputPlainaM2 = document.getElementById('cfg-taxa-plaina-m2');
    const inputMeta = document.getElementById('cfg-meta-mensal');
    const inputNome = document.getElementById('cfg-nome-madeireira');
    const inputCnpj = document.getElementById('cfg-cnpj-madeireira');
    const inputTel = document.getElementById('cfg-tel-madeireira');
    const inputEnd = document.getElementById('cfg-end-madeireira');

    if (inputSenha) inputSenha.value = config.senha_gerente || '1234';
    if (inputTeto) inputTeto.value = config.desconto_maximo_livre !== undefined ? config.desconto_maximo_livre : 5.0;
    if (inputPlainaMl) inputPlainaMl.value = config.taxa_plaina_padrao_ml || 3.50;
    if (inputPlainaM2) inputPlainaM2.value = config.taxa_plaina_padrao_m2 || 8.00;
    if (inputMeta) inputMeta.value = config.meta_faturamento_mensal || 150000;
    if (inputNome) inputNome.value = config.nome_madeireira || 'Serraria e Madeireira Bom Jesus';
    if (inputCnpj) {
      inputCnpj.value = config.cnpj_madeireira || '16.482.988/0001-02';
      inputCnpj.dispatchEvent(new Event('input'));
    }
    if (inputTel) {
      inputTel.value = config.telefone_madeireira || '(12) 99603-3793';
      inputTel.dispatchEvent(new Event('input'));
    }
    if (inputEnd) inputEnd.value = config.endereco_madeireira || 'Av. Adhemar Pinto de Siqueira, 1000 - Vila Galvão, Caçapava - SP, 12286-325';
  },

  salvarConfiguracoes() {
    const senha = document.getElementById('cfg-senha-gerente').value.trim();
    const teto = parseFloat(document.getElementById('cfg-teto-desconto').value) || 5.0;
    const plainaMl = parseFloat(document.getElementById('cfg-taxa-plaina-ml').value) || 3.50;
    const plainaM2 = parseFloat(document.getElementById('cfg-taxa-plaina-m2').value) || 8.00;
    const meta = parseFloat(document.getElementById('cfg-meta-mensal').value) || 150000;
    const nome = document.getElementById('cfg-nome-madeireira').value.trim();
    const cnpj = document.getElementById('cfg-cnpj-madeireira').value.trim();
    const tel = document.getElementById('cfg-tel-madeireira').value.trim();
    const end = document.getElementById('cfg-end-madeireira') ? document.getElementById('cfg-end-madeireira').value.trim() : 'Av. Adhemar Pinto de Siqueira, 1000 - Vila Galvão, Caçapava - SP, 12286-325';

    if (!senha) {
      App.showToast('A senha do gerente não pode ser vazia.', 'error');
      return;
    }

    const configData = {
      senha_gerente: senha,
      desconto_maximo_livre: teto,
      taxa_plaina_padrao_ml: plainaMl,
      taxa_plaina_padrao_m2: plainaM2,
      meta_faturamento_mensal: meta,
      nome_madeireira: nome,
      cnpj_madeireira: cnpj,
      telefone_madeireira: tel,
      endereco_madeireira: end
    };

    DB.salvarConfig(configData);
    CalcEngine.DEFAULT_TAXA_PLAINA_ML = plainaMl;
    CalcEngine.DEFAULT_TAXA_PLAINA_M2 = plainaM2;

    this.renderCardsResumo();
    App.showToast('Configurações e parâmetros gerenciais salvos com sucesso!', 'success');
  },

  // =========================================================================
  // ABA 4: AUDITORIA DE DESCONTOS & RANKING DE VENDAS
  // =========================================================================
  renderAuditoriaERanking() {
    const containerRanking = document.getElementById('ranking-vendedores-container');
    const tbodyAuditoria = document.getElementById('tabela-auditoria-descontos-corpo');

    const funcionarios = DB.getFuncionarios().filter(f => f.ativo && (parseFloat(f.comissao_pct) > 0 || f.vendas_mes > 0));
    const config = DB.getConfig();
    const auditorias = DB.getAuditoriaDescontos();

    // Ordena do maior para o menor vendedor
    funcionarios.sort((a, b) => (b.vendas_mes || 0) - (a.vendas_mes || 0));

    const maiorVenda = Math.max(...funcionarios.map(f => f.vendas_mes || 0), 1000);

    if (containerRanking) {
      containerRanking.innerHTML = funcionarios.map((f, idx) => {
        const vendas = f.vendas_mes || 0;
        const pct = Math.min(100, (vendas / maiorVenda) * 100);

        return `
          <div style="margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
              <span style="font-weight: 600; font-size: 13px;">
                #${idx + 1} ${f.nome} <span style="font-size: 11px; color: var(--text-muted);">(${f.cargo})</span>
              </span>
              <span class="font-mono" style="font-weight: 700; color: var(--brand-primary); font-size: 13px;">
                ${CalcEngine.formatBRL(vendas)}
              </span>
            </div>
            <div style="height: 8px; background-color: var(--bg-hover); border-radius: 4px; overflow: hidden;">
              <div style="height: 100%; width: ${pct}%; background-color: ${idx === 0 ? 'var(--brand-primary)' : '#2563EB'}; border-radius: 4px;"></div>
            </div>
          </div>
        `;
      }).join('') || '<div style="color: var(--text-muted); font-size: 12px;">Sem dados de vendas da equipe.</div>';
    }

    if (tbodyAuditoria) {
      if (!auditorias.length) {
        tbodyAuditoria.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 20px; color: var(--text-muted);">
              Nenhuma liberação de desconto registrada ainda.
            </td>
          </tr>
        `;
      } else {
        tbodyAuditoria.innerHTML = auditorias.map(a => `
          <tr>
            <td class="font-mono">${new Date(a.data).toLocaleDateString('pt-BR')} ${new Date(a.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
            <td class="font-mono" style="font-weight: 700; color: var(--brand-primary);">#${a.pedido_numero}</td>
            <td>${a.cliente_nome || '-'}</td>
            <td><strong>${a.vendedor_nome || 'Balcão'}</strong></td>
            <td class="align-right font-mono" style="color: var(--color-danger); font-weight: 700;">
              ${a.desconto_pct.toFixed(1)}% (-${CalcEngine.formatBRL(a.desconto_valor)})
            </td>
            <td style="font-size: 11.5px; color: var(--text-secondary);">
              ${a.motivo || 'Autorizado com senha do gerente'}
            </td>
          </tr>
        `).join('');
      }
    }
  },

  // =========================================================================
  // ABA 5: CONTAS DE USUÁRIO & ACESSOS (RBAC)
  // =========================================================================
  renderTabelaContas() {
    const tbody = document.getElementById('tabela-contas-corpo');
    if (!tbody) return;

    const usuarios = DB.getUsuarios();
    const usuarioLogado = AuthModule.getUsuarioAtual();

    tbody.innerHTML = usuarios.map(u => {
      const isAdmin = u.perfil === 'ADMIN';
      const ehVoce = usuarioLogado && usuarioLogado.id === u.id;

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="font-mono" style="font-weight: 700; color: var(--brand-primary); font-size: 13px;">@${u.username}</span>
              ${ehVoce ? '<span class="badge-tag" style="background-color: var(--brand-primary-light); color: var(--brand-primary-text); font-weight: 700;">Você</span>' : ''}
            </div>
          </td>
          <td>
            <strong>${u.nome}</strong>
            <div style="font-size: 11px; color: var(--text-muted);">${u.email || 'Sem email'}</div>
          </td>
          <td>
            <span class="badge-tag" style="background-color: var(--bg-hover); color: var(--text-primary); font-weight: 600;">
              ${u.cargo || 'Operador'}
            </span>
          </td>
          <td class="align-center">
            ${isAdmin 
              ? '<span class="badge-role-tag badge-role-admin">Administrador (Total)</span>' 
              : '<span class="badge-role-tag badge-role-func">Funcionário (Operacional)</span>'}
          </td>
          <td class="align-center">
            <span class="badge-tag ${u.ativo ? 'badge-aprovado' : 'badge-cancelado'}">
              ${u.ativo ? '● Ativo' : '● Bloqueado'}
            </span>
          </td>
          <td class="align-center" style="white-space: nowrap;">
            <div style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: nowrap; white-space: nowrap;">
              <button class="btn btn-sm btn-secondary" style="display: inline-flex; align-items: center; gap: 4px; padding: 0 8px; font-weight: 600;" title="Alterar Senha de Acesso" onclick="GerenteModule.abrirModalAlterarSenha('${u.id}')">
                <svg viewBox="0 0 24 24" style="width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>Senha</span>
              </button>
              ${!ehVoce ? `
                <button class="btn btn-sm btn-secondary" style="display: inline-flex; align-items: center; gap: 4px; padding: 0 8px;" title="${isAdmin ? 'Rebaixar para perfil Funcionário' : 'Promover para perfil Administrador'}" onclick="GerenteModule.alternarPerfilUsuario('${u.id}')">
                  <svg viewBox="0 0 24 24" style="width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2;"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
                  <span>${isAdmin ? 'Rebaixar' : 'Promover'}</span>
                </button>
                <button class="btn btn-sm ${u.ativo ? 'btn-secondary' : 'btn-success'}" style="display: inline-flex; align-items: center; gap: 4px; padding: 0 8px;" title="${u.ativo ? 'Bloquear acesso do usuário' : 'Desbloquear acesso do usuário'}" onclick="GerenteModule.alternarStatusUsuario('${u.id}')">
                  ${u.ativo ? `
                    <svg viewBox="0 0 24 24" style="width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2;"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                    <span>Bloquear</span>
                  ` : `
                    <svg viewBox="0 0 24 24" style="width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2;"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Ativar</span>
                  `}
                </button>
                <button class="btn btn-sm btn-danger" style="display: inline-flex; align-items: center; gap: 4px; padding: 0 8px;" title="Excluir permanentemente esta conta" onclick="GerenteModule.excluirContaUsuario('${u.id}')">
                  <svg viewBox="0 0 24 24" style="width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  <span>Apagar</span>
                </button>
              ` : `
                <span class="badge-tag" style="background-color: var(--bg-surface-subtle); color: var(--text-muted); font-size: 11px; padding: 3px 8px; border: 1px dashed var(--border-medium);">
                  Sua sessão ativa
                </span>
              `}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  abrirModalConta() {
    const modal = document.getElementById('modal-usuario-conta');
    if (!modal) return;

    const selectFunc = document.getElementById('conta-funcionario-select');
    if (selectFunc) {
      const funcs = DB.getFuncionarios().filter(f => f.ativo);
      selectFunc.innerHTML = `
        <option value="">Selecione o Colaborador ou crie um novo...</option>
        <option value="__novo__">+ Criar Conta para Novo Colaborador...</option>
        ${funcs.map(f => `<option value="${f.id}">${f.nome} (${f.cargo})</option>`).join('')}
      `;
    }

    const blocoNovo = document.getElementById('conta-novo-colab-bloco');
    if (blocoNovo) blocoNovo.style.display = 'none';

    const inputNomeCustom = document.getElementById('conta-nome-custom');
    if (inputNomeCustom) inputNomeCustom.value = '';
    const inputCargoCustom = document.getElementById('conta-cargo-custom');
    if (inputCargoCustom) inputCargoCustom.value = '';

    document.getElementById('conta-username').value = '';
    document.getElementById('conta-senha').value = '';
    document.getElementById('conta-perfil').value = 'FUNCIONARIO';

    modal.classList.add('active');
  },

  fecharModalConta() {
    const modal = document.getElementById('modal-usuario-conta');
    if (modal) modal.classList.remove('active');
  },

  aoSelecionarFuncionarioConta(valor) {
    const blocoNovo = document.getElementById('conta-novo-colab-bloco');
    if (!blocoNovo) return;
    if (valor === '__novo__') {
      blocoNovo.style.display = 'block';
      const inputNome = document.getElementById('conta-nome-custom');
      if (inputNome) inputNome.focus();
    } else {
      blocoNovo.style.display = 'none';
      if (valor) {
        const func = DB.getFuncionarios().find(f => f.id === valor);
        if (func) {
          const inputUser = document.getElementById('conta-username');
          if (inputUser && !inputUser.value) {
            inputUser.value = func.nome.split(' ')[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          }
        }
      }
    }
  },

  salvarContaUsuario() {
    const selectFunc = document.getElementById('conta-funcionario-select');
    const funcId = selectFunc.value;
    const username = document.getElementById('conta-username').value.trim().toLowerCase();
    const senha = document.getElementById('conta-senha').value.trim();
    const perfil = document.getElementById('conta-perfil').value;

    if (!funcId) {
      App.showToast('Selecione um colaborador ou escolha cadastrar um novo.', 'error');
      return;
    }
    if (!username || username.length < 3) {
      App.showToast('O nome de usuário deve ter pelo menos 3 caracteres.', 'error');
      return;
    }
    if (!senha || senha.length < 3) {
      App.showToast('A senha deve ter pelo menos 3 caracteres.', 'error');
      return;
    }

    // Verifica se username já existe
    const existente = DB.getUsuarios().find(u => u.username.toLowerCase() === username);
    if (existente) {
      App.showToast(`O nome de usuário "@${username}" já está em uso. Escolha outro.`, 'error');
      return;
    }

    let nome = '';
    let cargo = '';
    let email = '';
    let fId = funcId;

    if (funcId === '__novo__') {
      nome = (document.getElementById('conta-nome-custom')?.value || '').trim();
      cargo = (document.getElementById('conta-cargo-custom')?.value || '').trim() || (perfil === 'ADMIN' ? 'Gerente' : 'Vendedor');
      if (!nome) {
        App.showToast('Informe o nome completo do novo colaborador.', 'error');
        return;
      }
      fId = 'func_' + Date.now();
      const novoFuncionario = {
        id: fId,
        nome: nome,
        cargo: cargo,
        telefone: '',
        email: '',
        pix: '',
        comissao_pct: perfil === 'ADMIN' ? 0.0 : 2.0,
        ativo: true
      };
      DB.salvarFuncionario(novoFuncionario);
    } else {
      const func = DB.getFuncionarios().find(f => f.id === funcId);
      if (!func) {
        App.showToast('Funcionário selecionado não foi encontrado.', 'error');
        return;
      }
      nome = func.nome;
      cargo = func.cargo;
      email = func.email || '';
    }

    const novoUsuario = {
      id: 'usr_' + Date.now(),
      username,
      nome,
      email,
      senha,
      perfil,
      cargo,
      funcionario_id: fId,
      ativo: true,
      data_criacao: new Date().toISOString()
    };

    DB.salvarUsuario(novoUsuario);
    this.fecharModalConta();
    this.renderTabelaContas();
    if (this.renderTabelaFuncionarios) this.renderTabelaFuncionarios();
    App.showToast(`Conta de usuário @${username} (${perfil === 'ADMIN' ? 'Administrador' : 'Funcionário'}) criada com sucesso!`, 'success');
  },

  abrirModalAlterarSenha(usrId) {
    const u = DB.getUsuarios().find(item => item.id === usrId);
    if (!u) {
      App.showToast('Usuário não encontrado.', 'error');
      return;
    }

    const modal = document.getElementById('modal-alterar-senha-usuario');
    if (!modal) return;

    document.getElementById('alterar-senha-user-id').value = u.id;
    const displayEl = document.getElementById('alterar-senha-user-display');
    if (displayEl) {
      displayEl.textContent = `@${u.username} (${u.nome} - ${u.cargo || u.perfil})`;
    }

    const inputNova = document.getElementById('alterar-senha-nova');
    const inputConf = document.getElementById('alterar-senha-confirmacao');
    const erroEl = document.getElementById('alterar-senha-erro');

    if (inputNova) inputNova.value = '';
    if (inputConf) inputConf.value = '';
    if (erroEl) erroEl.style.display = 'none';

    modal.classList.add('active');
    setTimeout(() => { if (inputNova) inputNova.focus(); }, 50);
  },

  fecharModalAlterarSenha() {
    const modal = document.getElementById('modal-alterar-senha-usuario');
    if (modal) modal.classList.remove('active');
  },

  salvarNovaSenhaUsuario() {
    const usrId = document.getElementById('alterar-senha-user-id').value;
    const u = DB.getUsuarios().find(item => item.id === usrId);
    if (!u) {
      App.showToast('Usuário não encontrado.', 'error');
      return;
    }

    const inputNova = document.getElementById('alterar-senha-nova');
    const inputConf = document.getElementById('alterar-senha-confirmacao');
    const erroEl = document.getElementById('alterar-senha-erro');

    const nova = (inputNova?.value || '').trim();
    const conf = (inputConf?.value || '').trim();

    if (!nova || nova.length < 3) {
      if (erroEl) {
        erroEl.textContent = 'A nova senha deve ter no mínimo 3 caracteres.';
        erroEl.style.display = 'block';
      }
      return;
    }

    if (nova !== conf) {
      if (erroEl) {
        erroEl.textContent = 'As senhas digitadas não coincidem.';
        erroEl.style.display = 'block';
      }
      return;
    }

    u.senha = nova;
    DB.salvarUsuario(u);

    // Se o usuário alterou a própria senha, atualiza a sessão local
    const logado = AuthModule.getUsuarioAtual();
    if (logado && logado.id === u.id) {
      logado.senha = nova;
      localStorage.setItem(AuthModule.SESSION_KEY, JSON.stringify(logado));
    }

    this.fecharModalAlterarSenha();
    this.renderTabelaContas();
    App.showToast(`Senha da conta @${u.username} (${u.nome}) alterada com sucesso!`, 'success');
  },

  redefinirSenhaUsuario(usrId) {
    this.abrirModalAlterarSenha(usrId);
  },

  excluirContaUsuario(usrId) {
    const u = DB.getUsuarios().find(item => item.id === usrId);
    if (!u) {
      App.showToast('Conta de usuário não encontrada.', 'error');
      return;
    }

    const usuarioLogado = AuthModule.getUsuarioAtual();
    if (usuarioLogado && usuarioLogado.id === u.id) {
      App.showToast('Você não pode excluir sua própria conta enquanto estiver conectado.', 'error');
      return;
    }

    const admins = DB.getUsuarios().filter(item => item.perfil === 'ADMIN');
    if (u.perfil === 'ADMIN' && admins.length <= 1) {
      App.showToast('Operação negada: Não é permitido excluir o único administrador do sistema.', 'error');
      return;
    }

    DB.excluirUsuario(usrId);
    this.renderTabelaContas();
    App.showToast(`Conta de usuário @${u.username} apagada com sucesso!`, 'success');
  },

  alternarPerfilUsuario(usrId) {
    const u = DB.getUsuarios().find(item => item.id === usrId);
    if (!u) return;

    const novoPerfil = u.perfil === 'ADMIN' ? 'FUNCIONARIO' : 'ADMIN';
    u.perfil = novoPerfil;
    DB.salvarUsuario(u);
    this.renderTabelaContas();
    AuthModule.aplicarPermissoesUI();
    App.showToast(`Perfil de @${u.username} alterado para ${novoPerfil === 'ADMIN' ? 'Administrador' : 'Funcionário'}.`, 'success');
  },

  alternarStatusUsuario(usrId) {
    const u = DB.getUsuarios().find(item => item.id === usrId);
    if (!u) return;

    u.ativo = !u.ativo;
    DB.salvarUsuario(u);
    this.renderTabelaContas();
    AuthModule.aplicarPermissoesUI();
    App.showToast(`Conta de @${u.username} ${u.ativo ? 'desbloqueada' : 'bloqueada'}.`, 'info');
  }
};

window.GerenteModule = GerenteModule;

