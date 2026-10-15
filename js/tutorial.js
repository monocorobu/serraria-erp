/**
 * SERRARIA & MADEIREIRA ERP - MÓDULO 7: TUTORIAL DO SISTEMA
 * Guia didático para treinamento de novos funcionários, tabela de atalhos e restaurador de dados demo.
 */

const TutorialModule = {
  init() {
    this.setupEventListeners();
  },

  setupEventListeners() {
    const btnRestaurarDemo = document.getElementById('btn-restaurar-dados-demo');
    if (btnRestaurarDemo) {
      btnRestaurarDemo.addEventListener('click', () => this.restaurarDadosDemo());
    }

    const btnCarregarExemplo = document.getElementById('btn-carregar-exemplo-guiado');
    if (btnCarregarExemplo) {
      btnCarregarExemplo.addEventListener('click', () => this.carregarExemploGuiado());
    }
  },

  restaurarDadosDemo() {
    if (confirm('Atenção: Isso irá restaurar o banco de dados original da madeireira com todos os 18 produtos, clientes e pedidos de teste. Deseja continuar?')) {
      DB.resetDemo();
      BalcaoModule.iniciarNovoOrcamento();
      BalcaoModule.renderBairrosSelect();
      BalcaoModule.renderCarpinteirosSelect();
      BalcaoModule.renderVendedoresSelect();
      BalcaoModule.renderProdutosSelect();
      HistoricoModule.renderTabelaPedidos();
      PatioModule.renderKanban();
      PrecosModule.renderTabelaPrecos();
      ClientesModule.renderListaClientes();
      ClientesModule.renderListaCarpinteiros();
      if (window.GerenteModule) GerenteModule.render();
      if (window.AuthModule) AuthModule.carregarSessao();
      PainelModule.atualizarIndicadores();

      App.showToast('Dados de demonstração restaurados com sucesso!', 'success');
      App.switchTab('balcao');
    }
  },

  carregarExemploGuiado() {
    // Carrega o orçamento #1022 (com vigas aparelhadas e deck) no Balcão para o usuário testar e aprender
    BalcaoModule.carregarPedidoParaEdicao('PED-1022');
    App.showToast('Exemplo guiado carregado no balcão! Observe as linhas de madeira e o botão de Plaina.', 'info');
  }
};

window.TutorialModule = TutorialModule;

