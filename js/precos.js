/**
 * SERRARIA & MADEIREIRA ERP - MÓDULO 4: TABELA DE PREÇOS E REAJUSTE EM MASSA (%)
 * Gestão de catálogo de madeiras, edição inline de preços e ferramenta de reajuste percentual com prévia.
 */

const PrecosModule = {
  currentCategoria: 'TODAS',
  searchTerm: '',

  init() {
    this.renderCategoriasPills();
    this.renderTabelaPrecos();
    this.setupEventListeners();
  },

  renderCategoriasPills() {
    const container = document.querySelector('#tab-precos .filter-pills-group');
    if (!container) return;

    const produtos = DB.getProdutos();
    const categorias = [...new Set(produtos.map(p => p.categoria).filter(Boolean))].sort();

    let html = `
      <span class="filter-pill ${this.currentCategoria === 'TODAS' ? 'active' : ''}" data-cat="TODAS">
        Todos (${produtos.length})
      </span>
    `;

    categorias.forEach(cat => {
      const count = produtos.filter(p => p.categoria === cat).length;
      html += `
        <span class="filter-pill ${this.currentCategoria === cat ? 'active' : ''}" data-cat="${cat}">
          ${cat} (${count})
        </span>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.filter-pill[data-cat]').forEach(pill => {
      pill.addEventListener('click', () => {
        container.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentCategoria = pill.dataset.cat;
        this.renderTabelaPrecos();
      });
    });
  },

  setupEventListeners() {
    // Busca de produto
    const inputBusca = document.getElementById('precos-busca-input');
    if (inputBusca) {
      inputBusca.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.trim().toLowerCase();
        this.renderTabelaPrecos();
      });
    }

    // Modal de Reajuste em Massa
    const btnAbrirReajuste = document.getElementById('btn-abrir-reajuste-massa');
    if (btnAbrirReajuste) {
      btnAbrirReajuste.addEventListener('click', () => this.abrirModalReajuste());
    }

    const inputPctReajuste = document.getElementById('reajuste-percentual-input');
    const selectFamiliaReajuste = document.getElementById('reajuste-familia-select');
    if (inputPctReajuste && selectFamiliaReajuste) {
      inputPctReajuste.addEventListener('input', () => this.calcularPreviaReajuste());
      selectFamiliaReajuste.addEventListener('change', () => this.calcularPreviaReajuste());
    }

    const btnAplicarReajuste = document.getElementById('btn-aplicar-reajuste-confirmado');
    if (btnAplicarReajuste) {
      btnAplicarReajuste.addEventListener('click', () => this.aplicarReajusteEmMassa());
    }

    // Modal Novo Produto
    const btnNovoProd = document.getElementById('btn-novo-produto-modal');
    if (btnNovoProd) {
      btnNovoProd.addEventListener('click', () => this.abrirModalNovoProduto());
    }

    const btnSalvarNovoProd = document.getElementById('btn-salvar-novo-produto');
    if (btnSalvarNovoProd) {
      btnSalvarNovoProd.addEventListener('click', () => this.salvarNovoProduto());
    }
  },

  renderTabelaPrecos() {
    const tbody = document.getElementById('precos-tabela-tbody');
    if (!tbody) return;

    let produtos = DB.getProdutos();

    if (this.currentCategoria !== 'TODAS') {
      produtos = produtos.filter(p => p.categoria === this.currentCategoria);
    }

    if (this.searchTerm) {
      produtos = produtos.filter(p =>
        p.nome.toLowerCase().includes(this.searchTerm) ||
        p.codigo.toLowerCase().includes(this.searchTerm) ||
        (p.especie && p.especie.toLowerCase().includes(this.searchTerm))
      );
    }

    const contadorEl = document.getElementById('precos-total-contador');
    if (contadorEl) {
      contadorEl.textContent = `${produtos.length} ${produtos.length === 1 ? 'item' : 'itens'}`;
    }

    const isAdmin = window.AuthModule ? AuthModule.isAdmin() : true;

    tbody.innerHTML = produtos.map(p => {
      const estoque = parseFloat(p.estoque_atual !== undefined ? p.estoque_atual : 0);
      const minimo = parseFloat(p.estoque_minimo || 10);
      let estoqueBadge = '';
      if (estoque <= 0) {
        estoqueBadge = '<span class="badge-tag badge-cancelado" style="font-weight: 700;">0 Zerado</span>';
      } else if (estoque <= minimo) {
        estoqueBadge = `<span class="badge-tag badge-alerta" style="font-weight: 700;">${estoque} Baixo</span>`;
      } else {
        estoqueBadge = `<span class="badge-tag badge-aprovado">${estoque} ${p.unidade_medida || p.tipo_calculo}</span>`;
      }

      return `
        <tr data-prod-id="${p.id}">
          <td class="font-mono" style="font-weight: 700; color: var(--brand-primary);">${p.codigo}</td>
          <td>
            <strong>${p.nome}</strong>
            <div style="font-size: 10px; color: var(--text-muted);">${p.categoria} | Espécie: ${p.especie || 'N/A'}</div>
          </td>
          <td class="align-center font-mono">
            <span class="badge-tag ${p.tipo_calculo === 'ML' ? 'badge-bruta' : p.tipo_calculo === 'M2' ? 'badge-aprovado' : 'badge-orcamento'}">
              ${p.unidade_medida || p.tipo_calculo}
            </span>
          </td>
          <td class="align-center font-mono" style="font-size: 11px;">
            ${p.espessura_cm ? `${p.espessura_cm}x${p.largura_cm || p.espessura_cm} cm` : '-'}
          </td>
          <td class="align-center font-mono" style="font-size: 11px;">
            ${p.densidade_kg_m3 ? `${p.densidade_kg_m3} kg/m³` : (p.peso_unitario_kg ? `${p.peso_unitario_kg} kg/un` : '-')}
          </td>
          <td class="align-right font-mono" style="font-size: 11px;">
            ${p.taxa_plaina_padrao ? CalcEngine.formatBRL(p.taxa_plaina_padrao) : '-'}
          </td>
          <td class="align-center font-mono">
            ${estoqueBadge}
          </td>
          ${isAdmin ? `
            <td class="align-right font-mono" style="width: 120px;">
              <input type="number" step="0.50" min="0" class="table-input" value="${Number(p.preco_unitario || 0).toFixed(2)}" onchange="PrecosModule.salvarPrecoInline('${p.id}', this.value)" title="Editar preço de venda">
            </td>
          ` : `
            <td class="align-right font-mono" style="font-weight: 700; color: var(--text-primary); font-size: 13px;" title="Preço de tabela fixo (somente gerente pode editar)">
              ${CalcEngine.formatBRL(p.preco_unitario)}
            </td>
          `}
          <td class="align-center">
            <button class="btn btn-sm btn-secondary" title="Editar produto e estoque" onclick="PrecosModule.editarProdutoModal('${p.id}')">
              Editar
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  salvarPrecoInline(prodId, novoPreco) {
    if (window.AuthModule && !AuthModule.isAdmin()) {
      App.showToast('Apenas administradores e gerentes podem alterar preços de produtos.', 'error');
      this.renderTabelaPrecos();
      return;
    }

    const produtos = DB.getProdutos();
    const prod = produtos.find(p => p.id === prodId);
    if (!prod) return;

    prod.preco_unitario = parseFloat(novoPreco) || 0;
    DB.set(STORAGE_KEYS.PRODUTOS, produtos);
    this.renderTabelaPrecos();
    if (window.EstoqueModule) EstoqueModule.render();
    if (window.BalcaoModule) BalcaoModule.renderProdutosSelect();
    App.showToast(`Preço de "${prod.nome}" atualizado para ${CalcEngine.formatBRL(prod.preco_unitario)}.`);
  },

  abrirModalReajuste() {
    if (window.AuthModule && !AuthModule.isAdmin()) {
      App.showToast('Apenas administradores e gerentes podem aplicar reajuste de preços.', 'error');
      return;
    }

    const modal = document.getElementById('modal-reajuste-massa');
    if (!modal) return;

    const selectFam = document.getElementById('reajuste-familia-select');
    if (selectFam) {
      const categorias = [...new Set(DB.getProdutos().map(p => p.categoria).filter(Boolean))].sort();
      selectFam.innerHTML = `
        <option value="TODAS">Toda a Tabela de Preços (Geral - Todos os Produtos)</option>
        ${categorias.map(c => `<option value="${c}">Linha: ${c}</option>`).join('')}
      `;
    }

    const inputPct = document.getElementById('reajuste-percentual-input');
    if (inputPct) inputPct.value = '8.0';

    modal.classList.add('active');
    this.calcularPreviaReajuste();
  },

  fecharModalReajuste() {
    const modal = document.getElementById('modal-reajuste-massa');
    if (modal) modal.classList.remove('active');
  },

  calcularPreviaReajuste() {
    const inputPct = document.getElementById('reajuste-percentual-input');
    const selectFam = document.getElementById('reajuste-familia-select');
    const tbodyPrevia = document.getElementById('reajuste-previa-tbody');

    if (!inputPct || !selectFam || !tbodyPrevia) return;

    const pct = parseFloat(inputPct.value) || 0;
    const familia = selectFam.value;

    let produtos = DB.getProdutos();

    if (familia !== 'TODAS') {
      produtos = produtos.filter(p => p.especie === familia || p.categoria === familia);
    }

    tbodyPrevia.innerHTML = produtos.map(p => {
      const precoAtual = p.preco_unitario;
      const novoPreco = precoAtual * (1 + pct / 100);
      const dif = novoPreco - precoAtual;

      return `
        <tr>
          <td class="font-mono">${p.codigo}</td>
          <td><strong>${p.nome}</strong></td>
          <td class="align-right font-mono">${CalcEngine.formatBRL(precoAtual)}</td>
          <td class="align-right font-mono" style="font-weight: 700; color: ${dif >= 0 ? 'var(--action-green)' : 'var(--red-text)'};">
            ${CalcEngine.formatBRL(novoPreco)}
          </td>
          <td class="align-right font-mono" style="font-size: 11px;">
            ${dif >= 0 ? '+' : ''}${CalcEngine.formatBRL(dif)}
          </td>
        </tr>
      `;
    }).join('');
  },

  aplicarReajusteEmMassa() {
    if (window.AuthModule && !AuthModule.isAdmin()) {
      App.showToast('Apenas administradores e gerentes podem aplicar reajuste de preços.', 'error');
      return;
    }

    const inputPct = document.getElementById('reajuste-percentual-input');
    const selectFam = document.getElementById('reajuste-familia-select');
    if (!inputPct || !selectFam) return;

    const pct = parseFloat(inputPct.value) || 0;
    const familia = selectFam.value;

    if (pct === 0) {
      App.showToast('Informe um percentual diferente de 0%.', 'warning');
      return;
    }

    const produtos = DB.getProdutos();
    let cont = 0;

    produtos.forEach(p => {
      if (familia === 'TODAS' || p.especie === familia || p.categoria === familia) {
        p.preco_unitario = parseFloat((p.preco_unitario * (1 + pct / 100)).toFixed(2));
        cont++;
      }
    });

    DB.set(STORAGE_KEYS.PRODUTOS, produtos);
    this.fecharModalReajuste();
    this.renderTabelaPrecos();
    if (window.EstoqueModule) EstoqueModule.render();
    if (window.BalcaoModule) BalcaoModule.renderProdutosSelect();

    App.showToast(`Reajuste de ${pct > 0 ? '+' : ''}${pct}% aplicado com sucesso a ${cont} produtos!`, 'success');
  },

  abrirModalNovoProduto() {
    if (window.EstoqueModule && EstoqueModule.abrirModalNovoProduto) {
      EstoqueModule.abrirModalNovoProduto();
    }
  },

  editarProdutoModal(prodId) {
    if (window.EstoqueModule && EstoqueModule.abrirModalEditarProduto) {
      EstoqueModule.abrirModalEditarProduto(prodId);
    }
  }
};

window.PrecosModule = PrecosModule;

