/**
 * SERRARIA & MADEIREIRA ERP - CONTROLADOR GERAL DO APLICATIVO
 * Gerenciamento de abas, atalhos de teclado de balcão (F2, F4, F9, F10) e notificações Toast.
 */

const App = {
  currentTab: 'balcao',

  init() {
    this.setupNavigation();
    this.setupGlobalKeyboardShortcuts();
    
    // Inicializa Módulo de Autenticação e Segurança RBAC
    try { if (typeof AuthModule !== 'undefined') AuthModule.init(); } catch (e) { console.error('AuthModule.init erro:', e); }

    // Inicializa todos os submódulos com isolamento contra erros
    try { if (typeof BalcaoModule !== 'undefined') BalcaoModule.init(); } catch (e) { console.error('BalcaoModule.init erro:', e); }
    try { if (typeof HistoricoModule !== 'undefined') HistoricoModule.init(); } catch (e) { console.error('HistoricoModule.init erro:', e); }
    try { if (typeof PatioModule !== 'undefined') PatioModule.init(); } catch (e) { console.error('PatioModule.init erro:', e); }
    try { if (typeof PrecosModule !== 'undefined') PrecosModule.init(); } catch (e) { console.error('PrecosModule.init erro:', e); }
    try { if (typeof EstoqueModule !== 'undefined') EstoqueModule.init(); } catch (e) { console.error('EstoqueModule.init erro:', e); }
    try { if (typeof ClientesModule !== 'undefined') ClientesModule.init(); } catch (e) { console.error('ClientesModule.init erro:', e); }
    try { if (typeof PainelModule !== 'undefined') PainelModule.init(); } catch (e) { console.error('PainelModule.init erro:', e); }
    try { if (typeof GerenteModule !== 'undefined') GerenteModule.init(); } catch (e) { console.error('GerenteModule.init erro:', e); }
    try { if (typeof TutorialModule !== 'undefined') TutorialModule.init(); } catch (e) { console.error('TutorialModule.init erro:', e); }
    try { if (typeof PrintModule !== 'undefined') PrintModule.init(); } catch (e) { console.error('PrintModule.init erro:', e); }
    try { this.setupDocMascaras(); } catch (e) { console.error('setupDocMascaras erro:', e); }

    this.showToast('Sistema Madeireira & Serraria ERP pronto para operação.');
  },

  setupDocMascaras() {
    if (!window.DocMascara) return;
    DocMascara.aplicar(
      document.getElementById('balcao-cliente-documento'),
      document.getElementById('balcao-doc-tipo-badge')
    );
    DocMascara.aplicarTelefone(document.getElementById('balcao-cliente-telefone'));

    DocMascara.aplicar(
      document.getElementById('modal-cli-documento'),
      document.getElementById('modal-doc-tipo-badge')
    );
    DocMascara.aplicarTelefone(document.getElementById('modal-cli-telefone'));

    DocMascara.aplicar(
      document.getElementById('cfg-cnpj-madeireira'),
      document.getElementById('cfg-cnpj-badge')
    );
    DocMascara.aplicarTelefone(document.getElementById('cfg-tel-madeireira'));
  },

  setupNavigation() {
    document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.dataset.tab;
        this.switchTab(tab);
      });
    });
  },

  switchTab(tabId) {
    // Verificação de Segurança e Permissões (RBAC)
    if (window.AuthModule && !AuthModule.podeAcessar(tabId)) {
      this.showToast('Acesso Restrito: Esta área requer nível de Administrador.', 'error');
      return;
    }

    this.currentTab = tabId;

    // Atualiza classes ativas na navegação
    document.querySelectorAll('.nav-item[data-tab]').forEach(nav => {
      if (nav.dataset.tab === tabId) {
        nav.classList.add('active');
      } else {
        nav.classList.remove('active');
      }
    });

    // Atualiza visibilidade dos painéis de conteúdo
    document.querySelectorAll('.tab-content').forEach(content => {
      if (content.id === `tab-${tabId}`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });

    // Atualiza título da barra superior
    const titleEl = document.getElementById('header-active-title');
    const subtitleEl = document.getElementById('header-active-subtitle');

    const tabTitles = {
      'balcao': { title: 'Balcão de Vendas / Novo Orçamento', sub: 'Digitação rápida, cálculo instantâneo e fechamento' },
      'historico': { title: 'Histórico de Orçamentos e Vendas', sub: 'Follow-up comercial, comparação de madeiras e emissões' },
      'patio': { title: 'Pátio, Serra e Quadro de Entregas', sub: 'Fila de plaina, conferência de romaneio e status de entrega' },
      'precos': { title: 'Tabela de Preços e Reajuste em Massa', sub: 'Catálogo geral de 991 itens e atualização percentual (%)' },
      'estoque': { title: 'Controle de Estoque & Inventário', sub: 'Gestão quantitativa de produtos, alertas de ruptura e conferência física' },
      'clientes': { title: 'Clientes, Conta Corrente e Carpinteiros', sub: 'Controle de pendura e comissões de parceiros indicadores' },
      'gerente': { title: 'Central do Gerente & Equipe', sub: 'Gestão de funcionários, comissões, regras de preços e auditoria' },
      'painel': { title: 'Painel do Dono & Caixa de Balcão', sub: 'Taxa de conversão, conciliação de entradas e ranking' },
      'tutorial': { title: 'Tutorial do Sistema & Guia Prático', sub: 'Treinamento rápido, fórmulas e teste guiado' }
    };

    if (tabTitles[tabId]) {
      if (titleEl) titleEl.textContent = tabTitles[tabId].title;
      if (subtitleEl) subtitleEl.textContent = tabTitles[tabId].sub;
    }

    // Ações de refresh específicas ao abrir certas abas
    if (tabId === 'historico' && typeof HistoricoModule !== 'undefined') HistoricoModule.renderTabelaPedidos();
    if (tabId === 'patio' && typeof PatioModule !== 'undefined') PatioModule.renderKanban();
    if (tabId === 'precos' && typeof PrecosModule !== 'undefined') PrecosModule.renderTabelaPrecos();
    if (tabId === 'estoque' && typeof EstoqueModule !== 'undefined') EstoqueModule.render();
    if (tabId === 'clientes' && typeof ClientesModule !== 'undefined') {
      ClientesModule.renderListaClientes();
      ClientesModule.renderListaCarpinteiros();
    }
    if (tabId === 'gerente' && typeof GerenteModule !== 'undefined') GerenteModule.render();
    if (tabId === 'painel' && typeof PainelModule !== 'undefined') PainelModule.atualizarIndicadores();
  },

  setupGlobalKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Atalho de Impressão Direta da Comanda (Ctrl+P / Cmd+P)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        const modalImpressao = document.getElementById('modal-impressao-a4');
        if (modalImpressao && modalImpressao.classList.contains('active')) {
          PrintModule.executarImpressao();
        } else if (BalcaoModule.currentOrder && BalcaoModule.currentOrder.itens?.length) {
          PrintModule.abrirModalImpressao(BalcaoModule.currentOrder, 'CLIENTE');
          setTimeout(() => PrintModule.executarImpressao(), 300);
        } else {
          this.showToast('Abra ou selecione um orçamento com itens para imprimir a comanda.', 'warning');
        }
        return;
      }

      // Ignora atalhos de função se estiver dentro de um modal especial ou se prevenir
      if (e.key === 'F2') {
        e.preventDefault();
        this.switchTab('balcao');
        BalcaoModule.iniciarNovoOrcamento();
        this.showToast('Novo orçamento iniciado [F2]', 'info');
      } else if (e.key === 'F4') {
        e.preventDefault();
        this.switchTab('balcao');
        BalcaoModule.abrirModalCalculadoraTelhado();
      } else if (e.key === 'F8') {
        e.preventDefault();
        this.switchTab('balcao');
        if (typeof BalcaoModule !== 'undefined' && BalcaoModule.finalizarVendaBalcaoImediata) {
          BalcaoModule.finalizarVendaBalcaoImediata();
        }
      } else if (e.key === 'F9') {
        e.preventDefault();
        if (BalcaoModule.currentOrder && BalcaoModule.currentOrder.itens.length) {
          PrintModule.abrirModalImpressao(BalcaoModule.currentOrder, 'CLIENTE');
        } else {
          this.showToast('Abra ou adicione itens a um orçamento para imprimir.', 'warning');
        }
      } else if (e.key === 'F10') {
        e.preventDefault();
        if (BalcaoModule.currentOrder && BalcaoModule.currentOrder.itens.length) {
          PrintModule.abrirModalImpressao(BalcaoModule.currentOrder, 'PATIO');
        } else {
          this.showToast('Abra ou adicione itens a um orçamento para imprimir o romaneio.', 'warning');
        }
      } else if (e.key === 'Escape') {
        // Fecha qualquer modal ativo
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
          modal.classList.remove('active');
        });
      }
    });
  },

  showToast(mensagem, tipo = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    
    let iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    if (tipo === 'success') {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (tipo === 'warning') {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="#FBBF24" stroke-width="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    } else if (tipo === 'error') {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="#F87171" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    }

    toast.innerHTML = `<span style="display: flex; align-items: center;">${iconSvg}</span> <span>${mensagem}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    }, 3500);
  }
};

window.App = App;

// Dispara inicialização quando o DOM estiver pronto ou imediatamente se já carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
} else {
  App.init();
}

