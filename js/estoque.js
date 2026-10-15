/**
 * SERRARIA & MADEIREIRA ERP - MÓDULO DE CONTROLE DE ESTOQUE & INVENTÁRIO
 * Visualização e gestão completa de estoque, alertas de ruptura, edição total e exclusão.
 */

const EstoqueModule = {
  searchTerm: '',
  currentStatus: 'TODOS', // 'TODOS', 'NORMAL', 'BAIXO', 'ZERADO'
  currentCategoria: 'TODAS',

  eventsInitialized: false,

  init() {
    this.setupEventListeners();
    this.render();
  },

  setupEventListeners() {
    if (this.eventsInitialized) return;
    this.eventsInitialized = true;

    // Busca em tempo real no estoque
    const inputBusca = document.getElementById('estoque-busca-input');
    if (inputBusca) {
      inputBusca.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase().trim();
        this.renderTabelaEstoque();
      });
    }

    // Filtros de status de estoque
    document.querySelectorAll('.estoque-status-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.estoque-status-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentStatus = pill.dataset.status;
        this.renderTabelaEstoque();
      });
    });

    // Filtro por categoria
    const selectCat = document.getElementById('estoque-categoria-filter');
    if (selectCat) {
      selectCat.addEventListener('change', (e) => {
        this.currentCategoria = e.target.value;
        this.renderTabelaEstoque();
      });
    }
  },

  render() {
    this.renderCategoriasFilterSelect();
    this.renderCardsKPI();
    this.renderTabelaEstoque();
  },

  renderCategoriasFilterSelect() {
    const selectCat = document.getElementById('estoque-categoria-filter');
    if (!selectCat) return;

    const produtos = DB.getProdutos();
    const categorias = [...new Set(produtos.map(p => p.categoria).filter(Boolean))].sort();

    selectCat.innerHTML = `
      <option value="TODAS">Todas as Categorias (${produtos.length} itens)</option>
      ${categorias.map(c => {
        const count = produtos.filter(p => p.categoria === c).length;
        return `<option value="${c}">${c} (${count})</option>`;
      }).join('')}
    `;
    selectCat.value = this.currentCategoria;
  },

  renderCardsKPI() {
    const produtos = DB.getProdutos();
    const totalItens = produtos.length;

    let valorTotalEstoque = 0;
    let qtdBaixoEstoque = 0;
    let qtdZerados = 0;

    produtos.forEach(p => {
      const estoque = parseFloat(p.estoque_atual) || 0;
      const preco = parseFloat(p.preco_unitario) || 0;
      const minimo = parseFloat(p.estoque_minimo) || 10;

      valorTotalEstoque += (estoque * preco);

      if (estoque <= 0) {
        qtdZerados++;
      } else if (estoque <= minimo) {
        qtdBaixoEstoque++;
      }
    });

    const elTotalItens = document.getElementById('estoque-kpi-total-itens');
    const elValorTotal = document.getElementById('estoque-kpi-valor-total');
    const elBaixo = document.getElementById('estoque-kpi-baixo');
    const elZerados = document.getElementById('estoque-kpi-zerados');
    const badgeSidebar = document.getElementById('sidebar-badge-estoque');

    if (elTotalItens) elTotalItens.textContent = `${totalItens} produtos`;
    if (elValorTotal) elValorTotal.textContent = (typeof CalcEngine !== 'undefined' && CalcEngine.formatBRL) ? CalcEngine.formatBRL(valorTotalEstoque) : ('R$ ' + valorTotalEstoque.toFixed(2));
    if (elBaixo) elBaixo.textContent = `${qtdBaixoEstoque} itens em alerta`;
    if (elZerados) elZerados.textContent = `${qtdZerados} itens esgotados`;

    if (badgeSidebar) {
      const totalAlerta = qtdZerados + qtdBaixoEstoque;
      if (totalAlerta > 0) {
        badgeSidebar.textContent = `${totalAlerta} ${totalAlerta === 1 ? 'alerta' : 'alertas'}`;
        badgeSidebar.className = 'nav-badge badge-amber';
        badgeSidebar.title = `${totalAlerta} produtos com estoque zerado ou em alerta de reposição`;
      } else {
        badgeSidebar.textContent = `${totalItens}`;
        badgeSidebar.className = 'nav-badge';
        badgeSidebar.title = `${totalItens} produtos no catálogo`;
      }
    }
  },

  renderTabelaEstoque() {
    const tbody = document.getElementById('estoque-tabela-tbody');
    const contadorEl = document.getElementById('estoque-total-contador');
    if (!tbody) return;

    let produtos = DB.getProdutos();

    // Filtro por Categoria
    if (this.currentCategoria !== 'TODAS') {
      produtos = produtos.filter(p => p.categoria === this.currentCategoria);
    }

    // Filtro por Status
    if (this.currentStatus === 'ZERADO') {
      produtos = produtos.filter(p => (parseFloat(p.estoque_atual) || 0) <= 0);
    } else if (this.currentStatus === 'BAIXO') {
      produtos = produtos.filter(p => {
        const est = parseFloat(p.estoque_atual) || 0;
        const min = parseFloat(p.estoque_minimo) || 10;
        return est > 0 && est <= min;
      });
    } else if (this.currentStatus === 'NORMAL') {
      produtos = produtos.filter(p => {
        const est = parseFloat(p.estoque_atual) || 0;
        const min = parseFloat(p.estoque_minimo) || 10;
        return est > min;
      });
    }

    // Filtro por Busca Textual
    if (this.searchTerm) {
      produtos = produtos.filter(p =>
        (p.nome && p.nome.toLowerCase().includes(this.searchTerm)) ||
        (p.codigo && p.codigo.toLowerCase().includes(this.searchTerm)) ||
        (p.categoria && p.categoria.toLowerCase().includes(this.searchTerm)) ||
        (p.especie && p.especie.toLowerCase().includes(this.searchTerm))
      );
    }

    if (contadorEl) {
      contadorEl.textContent = `${produtos.length} ${produtos.length === 1 ? 'item' : 'itens'}`;
    }

    if (produtos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 28px; color: var(--text-muted);">
            Nenhum produto encontrado com os filtros selecionados.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = produtos.map(p => {
      const estoque = parseFloat(p.estoque_atual) || 0;
      const minimo = parseFloat(p.estoque_minimo) || 10;
      const preco = parseFloat(p.preco_unitario) || 0;
      const valorTotal = estoque * preco;

      let statusBadge = '<span class="badge-tag badge-aprovado">Normal</span>';
      let rowClass = '';

      if (estoque <= 0) {
        statusBadge = '<span class="badge-tag badge-cancelado" style="font-weight: 700;">Zerado</span>';
        rowClass = 'style="background-color: #FFF1F2;"';
      } else if (estoque <= minimo) {
        statusBadge = '<span class="badge-tag badge-alerta" style="font-weight: 700;">Estoque Baixo</span>';
        rowClass = 'style="background-color: #FFFBEB;"';
      }

      return `
        <tr data-prod-id="${p.id}" ${rowClass}>
          <td class="font-mono" style="font-weight: 700; color: var(--brand-primary);">${p.codigo}</td>
          <td>
            <strong>${p.nome}</strong>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 1px;">
              ${p.categoria} • ${p.especie || 'Material'}
            </div>
          </td>
          <td class="align-center font-mono">
            <span class="badge-tag ${p.tipo_calculo === 'ML' ? 'badge-bruta' : p.tipo_calculo === 'M2' ? 'badge-aprovado' : 'badge-orcamento'}">
              ${p.unidade_medida || p.tipo_calculo}
            </span>
          </td>
          ${(window.AuthModule && AuthModule.isAdmin()) ? `
            <td class="align-right font-mono" style="width: 115px;">
              <input type="number" step="0.50" min="0" class="table-input font-mono" style="width: 100px; text-align: right;" value="${preco.toFixed(2)}" onchange="EstoqueModule.salvarPrecoInline('${p.id}', this.value)" title="Editar preço unitário de venda">
            </td>
          ` : `
            <td class="align-right font-mono" style="font-weight: 700; color: var(--text-primary); font-size: 13px;" title="Preço de tabela fixo (somente gerente pode editar)">
              ${(typeof CalcEngine !== 'undefined' && CalcEngine.formatBRL) ? CalcEngine.formatBRL(preco) : ('R$ ' + preco.toFixed(2))}
            </td>
          `}
          <td class="align-center font-mono">
            <div class="estoque-stepper-control">
              <button type="button" class="btn-stepper" onclick="EstoqueModule.alterarEstoqueRapido('${p.id}', -1)" title="Diminuir 1">-</button>
              <input type="number" step="1" min="0" class="input-stepper font-mono" value="${estoque}" onchange="EstoqueModule.salvarEstoqueInline('${p.id}', this.value)">
              <button type="button" class="btn-stepper" onclick="EstoqueModule.alterarEstoqueRapido('${p.id}', 1)" title="Aumentar 1">+</button>
            </div>
          </td>
          <td class="align-center font-mono" style="font-size: 11.5px; color: var(--text-secondary);">
            ${minimo} ${p.unidade_medida || p.tipo_calculo}
          </td>
          <td class="align-center">
            ${statusBadge}
          </td>
          <td class="align-right font-mono" style="font-weight: 700; color: var(--text-primary);">
            ${(typeof CalcEngine !== 'undefined' && CalcEngine.formatBRL) ? CalcEngine.formatBRL(valorTotal) : ('R$ ' + valorTotal.toFixed(2))}
          </td>
          <td class="align-center">
            <button class="btn btn-sm btn-secondary" onclick="EstoqueModule.abrirModalEditarProduto('${p.id}')" title="Editar todas as informações e excluir">
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
      this.render();
      return;
    }

    const produtos = DB.getProdutos();
    const prod = produtos.find(p => p.id === prodId);
    if (!prod) return;

    prod.preco_unitario = parseFloat(novoPreco) || 0;
    DB.set(STORAGE_KEYS.PRODUTOS, produtos);
    this.renderCardsKPI();
    this.renderTabelaEstoque();

    if (window.PrecosModule) PrecosModule.renderTabelaPrecos();
    if (window.BalcaoModule) BalcaoModule.renderProdutosSelect();
    App.showToast(`Preço de "${prod.nome}" atualizado para ${CalcEngine.formatBRL(prod.preco_unitario)}.`);
  },

  alterarEstoqueRapido(prodId, delta) {
    const prod = DB.ajustarEstoque(prodId, delta, false);
    if (!prod) return;

    this.renderCardsKPI();
    this.renderTabelaEstoque();

    if (window.PrecosModule) PrecosModule.renderTabelaPrecos();
    if (window.BalcaoModule) BalcaoModule.renderProdutosSelect();
  },

  salvarEstoqueInline(prodId, novoValor) {
    const val = parseFloat(novoValor);
    if (isNaN(val) || val < 0) {
      App.showToast('Informe uma quantidade válida para o estoque.', 'warning');
      this.renderTabelaEstoque();
      return;
    }

    const prod = DB.ajustarEstoque(prodId, val, true);
    if (!prod) return;

    this.renderCardsKPI();
    this.renderTabelaEstoque();
    if (window.PrecosModule) PrecosModule.renderTabelaPrecos();
    if (window.BalcaoModule) BalcaoModule.renderProdutosSelect();
    App.showToast(`Estoque de "${prod.nome}" atualizado para ${prod.estoque_atual} ${prod.unidade_medida || prod.tipo_calculo}.`, 'info');
  },

  popularCategoriasModal(selectedCat = null) {
    const select = document.getElementById('edit-prod-categoria');
    if (!select) return;

    const baseCats = [
      'Madeiras & Esquadrias',
      'Telhas & Coberturas',
      'Forros & Acabamentos',
      'Fixação & Pregos',
      'Ferragens & Cercas',
      'Hidráulica & Conexões',
      'Elétrica & Iluminação',
      'Tintas & Química',
      'Ferramentas & Acessórios',
      'Construção & Alvenaria',
      'EPIs, Cordas & Diversos',
      'Utilidades Gerais'
    ];

    const prods = DB.getProdutos();
    const existingCats = prods.map(p => p.categoria).filter(Boolean);
    const todasCats = [...new Set([...baseCats, ...existingCats])].sort();

    select.innerHTML = todasCats.map(c => `
      <option value="${c}">${c}</option>
    `).join('');

    if (selectedCat && todasCats.includes(selectedCat)) {
      select.value = selectedCat;
    }
  },

  abrirModalNovoProduto() {
    if (window.AuthModule && !AuthModule.isAdmin()) {
      App.showToast('Apenas administradores e gerentes podem cadastrar novos produtos.', 'error');
      return;
    }

    const modal = document.getElementById('modal-editar-produto');
    if (!modal) return;

    this.popularCategoriasModal('Madeiras & Esquadrias');

    // Reset campos
    document.getElementById('edit-prod-id').value = '';
    document.getElementById('edit-prod-codigo').value = DB.gerarProximoCodigo ? DB.gerarProximoCodigo() : ('MAT-' + Math.floor(1000 + Math.random() * 9000));
    document.getElementById('edit-prod-nome').value = '';
    document.getElementById('edit-prod-categoria').value = 'Madeiras & Esquadrias';
    document.getElementById('edit-prod-especie').value = '';
    
    const inputPreco = document.getElementById('edit-prod-preco');
    if (inputPreco) {
      inputPreco.value = '0.00';
      inputPreco.readOnly = false;
      inputPreco.style.backgroundColor = '';
      inputPreco.style.cursor = '';
    }
    const avisoPreco = document.getElementById('edit-prod-preco-aviso');
    if (avisoPreco) avisoPreco.style.display = 'none';

    document.getElementById('edit-prod-tipo').value = 'UN';
    document.getElementById('edit-prod-unidade').value = 'UN';
    document.getElementById('edit-prod-plaina').value = '0.00';
    document.getElementById('edit-prod-estoque-atual').value = '0';
    document.getElementById('edit-prod-estoque-minimo').value = '10';
    document.getElementById('edit-prod-espessura').value = '';
    document.getElementById('edit-prod-largura').value = '';
    document.getElementById('edit-prod-ativo').value = 'true';

    // Título e Textos do Modal
    const titleEl = document.getElementById('edit-prod-modal-title');
    if (titleEl) titleEl.textContent = 'Cadastrar Novo Produto (Sintonia Preço & Estoque)';

    const sub = document.getElementById('edit-prod-modal-subtitle');
    if (sub) sub.textContent = 'Cadastre o produto definindo o Preço de Venda e a Quantidade em Estoque (pode iniciar em 0)';

    const btnSalvar = document.getElementById('btn-salvar-produto-modal');
    if (btnSalvar) btnSalvar.textContent = 'Salvar e Sincronizar Catálogo';

    // Oculta botão de excluir para novo produto
    const btnExcluir = document.getElementById('btn-excluir-produto');
    if (btnExcluir) btnExcluir.style.display = 'none';

    modal.classList.add('active');
    setTimeout(() => {
      const inputNome = document.getElementById('edit-prod-nome');
      if (inputNome) inputNome.focus();
    }, 50);
  },

  abrirModalEditarProduto(prodId) {
    const prod = DB.getProdutos().find(p => p.id === prodId);
    if (!prod) {
      App.showToast('Produto não encontrado.', 'error');
      return;
    }

    const modal = document.getElementById('modal-editar-produto');
    if (!modal) return;

    this.popularCategoriasModal(prod.categoria);

    const isAdmin = window.AuthModule ? AuthModule.isAdmin() : true;

    // Popula campos
    document.getElementById('edit-prod-id').value = prod.id;
    document.getElementById('edit-prod-codigo').value = prod.codigo || '';
    document.getElementById('edit-prod-nome').value = prod.nome || '';
    document.getElementById('edit-prod-categoria').value = prod.categoria || 'Madeiras & Esquadrias';
    document.getElementById('edit-prod-especie').value = prod.especie || '';
    
    const inputPreco = document.getElementById('edit-prod-preco');
    if (inputPreco) {
      inputPreco.value = parseFloat(prod.preco_unitario !== undefined ? prod.preco_unitario : 0).toFixed(2);
      inputPreco.readOnly = !isAdmin;
      inputPreco.style.backgroundColor = isAdmin ? '' : 'var(--bg-surface-subtle)';
      inputPreco.style.cursor = isAdmin ? '' : 'not-allowed';
      inputPreco.title = isAdmin ? '' : 'Preço de tabela bloqueado (somente gerentes podem alterar)';
    }

    const avisoPreco = document.getElementById('edit-prod-preco-aviso');
    if (avisoPreco) {
      avisoPreco.style.display = isAdmin ? 'none' : 'block';
    }

    const inputPlaina = document.getElementById('edit-prod-plaina');
    if (inputPlaina) {
      inputPlaina.value = parseFloat(prod.taxa_plaina_padrao || 0).toFixed(2);
      inputPlaina.readOnly = !isAdmin;
      inputPlaina.style.backgroundColor = isAdmin ? '' : 'var(--bg-surface-subtle)';
      inputPlaina.style.cursor = isAdmin ? '' : 'not-allowed';
    }

    document.getElementById('edit-prod-tipo').value = prod.tipo_calculo || 'UN';
    document.getElementById('edit-prod-unidade').value = prod.unidade_medida || 'UN';
    document.getElementById('edit-prod-estoque-atual').value = parseFloat(prod.estoque_atual !== undefined ? prod.estoque_atual : 0);
    document.getElementById('edit-prod-estoque-minimo').value = parseFloat(prod.estoque_minimo !== undefined ? prod.estoque_minimo : 10);
    document.getElementById('edit-prod-espessura').value = prod.espessura_cm || '';
    document.getElementById('edit-prod-largura').value = prod.largura_cm || '';
    document.getElementById('edit-prod-ativo').value = prod.ativo !== false ? 'true' : 'false';

    // Título e Textos do Modal
    const titleEl = document.getElementById('edit-prod-modal-title');
    if (titleEl) titleEl.textContent = 'Editar Produto (Preço & Estoque)';

    const sub = document.getElementById('edit-prod-modal-subtitle');
    if (sub) sub.textContent = `[${prod.codigo}] ${prod.nome}`;

    const btnSalvar = document.getElementById('btn-salvar-produto-modal');
    if (btnSalvar) btnSalvar.textContent = 'Salvar Alterações';

    // Exibe botão de excluir apenas para administradores
    const btnExcluir = document.getElementById('btn-excluir-produto');
    if (btnExcluir) btnExcluir.style.display = isAdmin ? 'inline-flex' : 'none';

    modal.classList.add('active');
    document.getElementById('edit-prod-nome').focus();
  },

  fecharModalEditarProduto() {
    const modal = document.getElementById('modal-editar-produto');
    if (modal) modal.classList.remove('active');
  },

  salvarEdicaoProduto() {
    const prodId = document.getElementById('edit-prod-id').value.trim();
    const ehNovo = !prodId;
    const codigo = document.getElementById('edit-prod-codigo').value.trim();
    const nome = document.getElementById('edit-prod-nome').value.trim();
    const categoria = document.getElementById('edit-prod-categoria').value;
    const especie = document.getElementById('edit-prod-especie').value.trim();
    let preco = parseFloat(document.getElementById('edit-prod-preco').value);
    const tipo = document.getElementById('edit-prod-tipo').value;
    const unidade = document.getElementById('edit-prod-unidade').value.trim();
    let plaina = parseFloat(document.getElementById('edit-prod-plaina').value) || 0;
    const estoqueAtualRaw = document.getElementById('edit-prod-estoque-atual').value;
    const estoqueAtual = estoqueAtualRaw === '' ? 0 : parseFloat(estoqueAtualRaw);
    const estoqueMinimoRaw = document.getElementById('edit-prod-estoque-minimo').value;
    const estoqueMinimo = estoqueMinimoRaw === '' ? 10 : parseFloat(estoqueMinimoRaw);
    const espessura = parseFloat(document.getElementById('edit-prod-espessura').value) || null;
    const largura = parseFloat(document.getElementById('edit-prod-largura').value) || null;
    const ativo = document.getElementById('edit-prod-ativo').value === 'true';

    const isAdmin = window.AuthModule ? AuthModule.isAdmin() : true;

    // Se for funcionário editando produto existente, garante que o preço original não mude
    if (!isAdmin) {
      if (ehNovo) {
        App.showToast('Apenas administradores e gerentes podem cadastrar novos produtos.', 'error');
        return;
      }
      const prodOriginal = DB.getProdutos().find(p => p.id === prodId);
      if (prodOriginal) {
        preco = prodOriginal.preco_unitario;
        plaina = prodOriginal.taxa_plaina_padrao || 0;
      }
    }

    if (!nome) {
      App.showToast('O nome do produto não pode ficar em branco.', 'error');
      return;
    }
    if (isNaN(preco) || preco < 0) {
      App.showToast('Informe um preço unitário válido (pode ser 0.00 ou superior).', 'error');
      return;
    }
    if (isNaN(estoqueAtual) || estoqueAtual < 0) {
      App.showToast('Informe uma quantidade de estoque válida (pode ser 0).', 'error');
      return;
    }

    const prodAtualizado = {
      id: prodId || ('prod_' + Date.now()),
      codigo: codigo || (DB.gerarProximoCodigo ? DB.gerarProximoCodigo() : 'MAT-' + Date.now().toString().slice(-4)),
      nome: nome,
      categoria: categoria,
      especie: especie || 'Material',
      tipo_calculo: tipo,
      unidade_medida: unidade || tipo,
      preco_unitario: preco,
      taxa_plaina_padrao: plaina,
      estoque_atual: estoqueAtual,
      estoque_minimo: isNaN(estoqueMinimo) ? 10 : estoqueMinimo,
      espessura_cm: espessura,
      largura_cm: largura,
      ativo: ativo
    };

    if (tipo === 'ML') {
      prodAtualizado.comprimentos_comuns = [2.5, 3.0, 3.5, 4.0];
    }

    DB.salvarProduto(prodAtualizado);

    this.fecharModalEditarProduto();
    this.render();

    if (window.PrecosModule) {
      PrecosModule.renderCategoriasPills();
      PrecosModule.renderTabelaPrecos();
    }
    if (window.BalcaoModule) {
      BalcaoModule.renderProdutosSelect();
    }

    if (ehNovo) {
      App.showToast(`Produto "${prodAtualizado.nome}" cadastrado com sucesso! Preço: ${CalcEngine.formatBRL(prodAtualizado.preco_unitario)} | Estoque: ${prodAtualizado.estoque_atual} ${prodAtualizado.unidade_medida}`, 'success');
    } else {
      App.showToast(`Produto "${prodAtualizado.nome}" atualizado em sintonia na Tabela de Preços e no Estoque!`, 'success');
    }
  },

  confirmarExcluirProduto() {
    if (window.AuthModule && !AuthModule.isAdmin()) {
      App.showToast('Acesso Restrito: Apenas Administradores podem excluir produtos do catálogo.', 'error');
      return;
    }

    const prodId = document.getElementById('edit-prod-id').value;
    const prod = DB.getProdutos().find(p => p.id === prodId);
    if (!prod) return;

    const msg = `Tem certeza que deseja EXCLUIR permanentemente o produto:\n\n[${prod.codigo}] ${prod.nome}\n\nEsta operação removerá o item do catálogo e do inventário de estoque. Deseja prosseguir?`;

    if (confirm(msg)) {
      DB.excluirProduto(prodId);
      this.fecharModalEditarProduto();
      this.render();

      if (window.PrecosModule) {
        PrecosModule.renderCategoriasPills();
        PrecosModule.renderTabelaPrecos();
      }
      if (window.BalcaoModule) {
        BalcaoModule.renderProdutosSelect();
      }

      App.showToast(`Produto [${prod.codigo}] excluído do sistema com sucesso.`, 'info');
    }
  },

  restaurarEstoqueDemo() {
    if (confirm('Deseja recarregar o estoque padrão com as quantidades do catálogo de demonstração?\n\nIsso atualizará os saldos zerados caso seu navegador tenha mantido cache antigo.')) {
      DB.restaurarEstoquePadrao();
      this.render();
      if (window.PrecosModule) PrecosModule.renderTabelaPrecos();
      if (window.BalcaoModule) BalcaoModule.renderProdutosSelect();
      App.showToast('Estoque padrão restaurado com sucesso!', 'success');
    }
  }
};

window.EstoqueModule = EstoqueModule;

// Auto-inicializa para garantir que a tabela e os cards nunca fiquem vazios
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    try { EstoqueModule.init(); } catch (e) { console.error('EstoqueModule auto-init erro:', e); }
  });
} else {
  try { EstoqueModule.init(); } catch (e) { console.error('EstoqueModule auto-init erro:', e); }
}


