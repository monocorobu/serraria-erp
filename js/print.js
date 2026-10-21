/**
 * SERRARIA & MADEIREIRA ERP - MÓDULO DE IMPRESSÃO
 * Renderiza os 2 layouts em folha A5 Deitada (Landscape 210mm x 148mm):
 * - Modo 1: Via do Cliente (Com Preços, Termos, Assinaturas e Fechamento Financeiro)
 * - Modo 2: Via do Pátio (Romaneio de Corte, Plaina e Carregamento - SEM PREÇOS)
 * Regra: O conteúdo SEMPRE cabe em uma única folha A5 deitada, com ajuste dinâmico de densidade.
 */

const PrintModule = {
  currentPedido: null,
  currentMode: 'CLIENTE', // 'CLIENTE' ou 'PATIO'

  init() {
    this.setupEventListeners();
  },

  setupEventListeners() {
    const btnPrintAction = document.getElementById('btn-executar-impressao');
    if (btnPrintAction) {
      btnPrintAction.addEventListener('click', () => {
        this.executarImpressao();
      });
    }

    const btnToggleModo = document.getElementById('btn-toggle-modo-impressao');
    if (btnToggleModo) {
      btnToggleModo.addEventListener('click', () => {
        this.currentMode = this.currentMode === 'CLIENTE' ? 'PATIO' : 'CLIENTE';
        this.renderFolhaImpressao();
      });
    }
  },

  /**
   * Dispara a impressão limpa e direta da folha A5 Deitada usando iframe isolado.
   * Aplica auto-ajuste de escala inteligente para garantir que NUNCA transborde para a página 2.
   */
  executarImpressao() {
    const container = document.getElementById('print-sheet-content');
    if (!container || !container.innerHTML.trim()) {
      if (this.currentPedido) {
        this.renderFolhaImpressao();
      } else if (window.BalcaoModule && BalcaoModule.currentOrder && BalcaoModule.currentOrder.itens?.length) {
        BalcaoModule.imprimirComprovanteBalcao(this.currentMode || 'CLIENTE');
        return;
      } else {
        App.showToast('Nenhuma comanda carregada para impressão.', 'warning');
        return;
      }
    }

    // Garante que o pedido esteja devidamente salvo no banco e registrado no histórico
    if (this.currentPedido) {
      const pedidos = DB.getPedidos();
      const jaSalvo = pedidos.some(p => 
        (this.currentPedido.id && p.id === this.currentPedido.id) || 
        (this.currentPedido.numero && p.numero === this.currentPedido.numero)
      );
      if (!jaSalvo) {
        DB.salvarPedido(this.currentPedido);
        if (window.HistoricoModule) HistoricoModule.renderTabelaPedidos();
        if (window.BalcaoModule) BalcaoModule.atualizarBadgeOrcamento('SALVO');
      }
    }

    const htmlContent = document.getElementById('print-sheet-content')?.innerHTML;
    if (!htmlContent) return;

    const docTitle = `${this.currentMode === 'PATIO' ? 'Romaneio_Patio' : 'Comanda_Orcamento'}_${this.currentPedido?.numero || 'Serraria'}_A5`;

    // Cria/Reutiliza iframe invisível para impressão direta e isolada da folha A5
    let printIframe = document.getElementById('comanda-print-iframe');
    if (!printIframe) {
      printIframe = document.createElement('iframe');
      printIframe.id = 'comanda-print-iframe';
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.border = '0';
      printIframe.style.visibility = 'hidden';
      document.body.appendChild(printIframe);
    }

    const frameDoc = printIframe.contentWindow.document;
    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>${docTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="css/print.css">
        <style>
          @page {
            size: A5 landscape;
            margin: 4mm 6mm;
          }
          * {
            box-sizing: border-box;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #FFFFFF !important;
            color: #0F172A !important;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            width: 210mm !important;
            height: 148mm !important;
            max-height: 148mm !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-sheet {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: 100% !important;
            max-height: 140mm !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `);
    frameDoc.close();

    // Auto-ajuste de escala inteligente para garantir que NUNCA transborde da folha A5 deitada
    setTimeout(() => {
      try {
        const sheet = frameDoc.querySelector('.print-sheet');
        if (sheet) {
          // Altura disponível em A5 Paisagem: ~138mm útil * 3.78px/mm ~ 521px
          const maxAllowedPx = 520;
          const currentH = sheet.scrollHeight;
          if (currentH > maxAllowedPx) {
            const scale = Math.max(0.65, (maxAllowedPx / currentH) * 0.98);
            sheet.style.transform = `scale(${scale.toFixed(3)})`;
            sheet.style.transformOrigin = 'top left';
            sheet.style.width = `${(100 / scale).toFixed(1)}%`;
          }
        }
      } catch (err) {
        console.warn('Auto-fit A5 notice:', err);
      }

      try {
        printIframe.contentWindow.focus();
        printIframe.contentWindow.print();
      } catch (err) {
        console.warn('Fallback para window.print padrão:', err);
        window.print();
      }
    }, 250);
  },

  abrirModalImpressaoById(pedidoId, modo = 'CLIENTE') {
    const pedidos = DB.getPedidos();
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) {
      App.showToast('Pedido não encontrado.', 'error');
      return;
    }
    this.abrirModalImpressao(pedido, modo);
  },

  abrirModalImpressao(pedido, modo = 'CLIENTE') {
    this.currentPedido = pedido;
    this.currentMode = modo;

    const modal = document.getElementById('modal-impressao-a4');
    if (!modal) return;

    this.renderFolhaImpressao();
    modal.classList.add('active');
  },

  fecharModalImpressao() {
    const modal = document.getElementById('modal-impressao-a4');
    if (modal) modal.classList.remove('active');
  },

  renderFolhaImpressao() {
    const container = document.getElementById('print-sheet-content');
    const btnToggle = document.getElementById('btn-toggle-modo-impressao');
    if (!container || !this.currentPedido) return;

    if (btnToggle) {
      btnToggle.textContent = this.currentMode === 'CLIENTE' 
        ? 'Alternar para Via do Pátio (Sem Preços)' 
        : 'Alternar para Via do Cliente (Com Preços)';
    }

    if (this.currentMode === 'CLIENTE') {
      container.innerHTML = this.gerarHtmlViaCliente(this.currentPedido);
    } else {
      container.innerHTML = this.gerarHtmlViaPatio(this.currentPedido);
    }
  },

  /**
   * MODO 1: VIA DO CLIENTE (A5 DEITADA)
   * Sem resumo de logística/transporte.
   * Fechamento financeiro, termos e assinaturas integrados lado a lado no rodapé.
   */
  gerarHtmlViaCliente(p) {
    const dataCriacao = new Date(p.data_criacao).toLocaleDateString('pt-BR');
    const validadeAte = new Date(new Date(p.data_criacao).getTime() + (p.validade_dias || 7) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');
    const saldoReceber = p.resumo_financeiro?.saldo_a_receber || 0;

    const config = (typeof DB !== 'undefined' && DB.getConfig) ? DB.getConfig() : {};
    const nomeEmpresa = config.nome_madeireira || 'Serraria e Madeireira Bom Jesus';
    const cnpjEmpresa = config.cnpj_madeireira || '16.482.988/0001-02';
    const endEmpresa = config.endereco_madeireira || 'Av. Adhemar Pinto de Siqueira, 1000 - Vila Galvão, Caçapava - SP';
    const telEmpresa = config.telefone_madeireira || '(12) 99603-3793';

    // Percentual e cálculo de Preço Bruto (A Prazo / Cartão)
    const pctBruto = (p.resumo_financeiro?.percentual_bruto !== undefined && p.resumo_financeiro?.percentual_bruto !== null)
      ? parseFloat(p.resumo_financeiro.percentual_bruto)
      : ((typeof CalcEngine !== 'undefined' && CalcEngine.getPercentualPrecoBruto) ? CalcEngine.getPercentualPrecoBruto() : (config.percentual_preco_bruto || 20.0));
    const totalAVista = p.resumo_financeiro?.valor_total || 0;
    const totalBruto = p.resumo_financeiro?.valor_total_bruto 
      ? p.resumo_financeiro.valor_total_bruto 
      : ((typeof CalcEngine !== 'undefined' && CalcEngine.calcularPrecoBruto) ? CalcEngine.calcularPrecoBruto(totalAVista, pctBruto) : parseFloat((totalAVista * (1 + pctBruto / 100)).toFixed(2)));

    // Determina densidade dinâmica para caber 100% em folha A5 Deitada
    const itemCount = p.itens ? p.itens.length : 0;
    const densityClass = itemCount <= 4 ? 'density-normal' : (itemCount <= 8 ? 'density-compact' : 'density-dense');

    return `
      <div class="print-sheet ${densityClass}">
        <!-- CABEÇALHO DA MADEIREIRA -->
        <div class="print-sheet-header">
          <div>
            <div class="print-company-name">${nomeEmpresa}</div>
            <div class="print-company-meta">
              CNPJ: ${cnpjEmpresa} | Telefone/WhatsApp: ${telEmpresa}<br>
              ${endEmpresa}
            </div>
          </div>
          <div class="print-doc-meta">
            <div class="print-doc-title">${(p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') ? 'CUPOM DE VENDA DE BALCÃO' : (p.status === 'ENTREGUE' ? 'COMPROVANTE DE ENTREGA E QUITAÇÃO' : 'VIA DO CLIENTE')}</div>
            <div class="print-doc-number">${(p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') ? 'VENDA Nº #' + p.numero : (p.status === 'ORCAMENTO' ? 'ORÇAMENTO Nº #' + p.numero : 'PEDIDO Nº #' + p.numero)}</div>
            <div class="print-doc-date">Emissão: <strong>${dataCriacao}</strong> | Status: <strong>${(p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') ? '100% PAGO & RETIRADO' : (p.status === 'ENTREGUE' ? 'QUITADO' : 'Válido até ' + validadeAte)}</strong></div>
          </div>
        </div>

        <!-- QUADRO DE DADOS DO CLIENTE E ENTREGA (HORIZONTAL 3 COLUNAS) -->
        <div class="print-client-box">
          <div>
            <div class="print-client-row"><strong>Cliente:</strong> ${p.cliente?.nome || 'Cliente Balcão'}</div>
            <div class="print-client-row"><strong>CPF/CNPJ:</strong> ${p.cliente?.documento || 'Não informado'}</div>
            <div class="print-client-row"><strong>Telefone:</strong> ${p.cliente?.telefone || 'Não informado'}</div>
          </div>
          <div>
            <div class="print-client-row"><strong>Local:</strong> ${(p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') ? 'Retirada no Balcão' : (p.cliente?.endereco_obra || 'Retirada no Pátio')}</div>
            <div class="print-client-row"><strong>Bairro:</strong> ${p.cliente?.bairro || p.resumo_financeiro?.bairro_frete || '-'}</div>
            <div class="print-client-row"><strong>Cidade:</strong> ${p.cliente?.cidade || 'Caçapava'}</div>
          </div>
          <div>
            <div class="print-client-row"><strong>Vendedor:</strong> ${p.vendedor?.nome || 'Balcão'}</div>
            <div class="print-client-row"><strong>Indicação:</strong> ${p.carpinteiro_nome || 'Direta'}</div>
            <div class="print-client-row"><strong>Pagamento:</strong> ${p.resumo_financeiro?.forma_pagamento || 'Pix'}</div>
          </div>
        </div>

        <!-- TABELA DE ITENS COM PREÇOS (SEQUÊNCIA: QTD, LARGURA, COMPRIMENTO) -->
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 25px;" class="align-center">#</th>
              <th style="width: 65px;">Cód.</th>
              <th>Descrição do Produto e Bitola</th>
              <th style="width: 45px;" class="align-center">Qtd</th>
              <th style="width: 70px;" class="align-center">Largura</th>
              <th style="width: 55px;" class="align-center">Compr.</th>
              <th style="width: 75px;" class="align-right">Metragem</th>
              <th style="width: 75px;" class="align-right">Preço Unit.</th>
              <th style="width: 85px;" class="align-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${p.itens.map((it, idx) => {
              const subtotalItem = it.subtotal || 0;
              const subtotalItemBruto = (typeof CalcEngine !== 'undefined' && CalcEngine.calcularPrecoBruto)
                ? CalcEngine.calcularPrecoBruto(subtotalItem, pctBruto)
                : parseFloat((subtotalItem * (1 + pctBruto / 100)).toFixed(2));
              return `
                <tr>
                  <td class="align-center font-mono" style="font-size: 9.5px;">${idx + 1}</td>
                  <td class="font-mono">${it.codigo}</td>
                  <td><strong>${it.descricao}</strong></td>
                  <td class="align-center font-mono">${it.quantidade}</td>
                  <td class="align-center font-mono">${it.largura_cm ? it.largura_cm + ' cm' : '-'}</td>
                  <td class="align-center font-mono">${it.comprimento_m > 0 ? it.comprimento_m + 'm' : '-'}</td>
                  <td class="align-right font-mono">${CalcEngine.formatNumero(it.metragem_total, it.tipo_calculo === 'ML' ? 1 : 0)} ${it.tipo_calculo === 'ML' ? 'ML' : it.tipo_calculo === 'M2' ? 'm²' : 'un'}</td>
                  <td class="align-right font-mono">${CalcEngine.formatBRL(it.valor_unitario)}</td>
                  <td class="align-right font-mono" style="font-weight: 700;">
                    ${CalcEngine.formatBRL(subtotalItem)}
                    <div style="font-size: 8px; color: #475569; font-weight: 500;" title="Preço Bruto do item a prazo">Bruto: ${CalcEngine.formatBRL(subtotalItemBruto)}</div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <!-- RODAPÉ COMPACTO A5: ASSINATURAS/TERMOS À ESQUERDA E FECHAMENTO FINANCEIRO À DIREITA -->
        <div class="print-footer-container">
          <div class="print-footer-left">
            <div class="print-payment-badge">
              <strong>Forma de Pagamento:</strong> ${p.resumo_financeiro?.forma_pagamento || 'Pix'}
            </div>

            <div class="print-terms">
              * Madeira serrada é produto natural sujeito a variações. Confira quantidades e medidas no ato da descarga. Reclamações após descarga não serão aceitas.
            </div>

            <div class="print-signatures-grid">
              <div class="signature-line">
                ${p.vendedor?.nome || 'Vendedor'}<br>
                <span>Atendimento de Balcão</span>
              </div>
              <div class="signature-line">
                ${p.cliente?.nome || 'Cliente'}<br>
                <span>Assinatura do Recebedor</span>
              </div>
            </div>
          </div>

          <div class="print-footer-right">
            <div class="print-financial-lines">
              <div class="print-financial-line"><span>Subtotal dos Produtos:</span> <span class="font-mono">${CalcEngine.formatBRL(p.resumo_financeiro?.subtotal_itens_puros || 0)}</span></div>
              ${(p.resumo_financeiro?.taxa_aparelhamento > 0) ? `
                <div class="print-financial-line"><span>Taxa Beneficiamento (Plaina):</span> <span class="font-mono">${CalcEngine.formatBRL(p.resumo_financeiro?.taxa_aparelhamento || 0)}</span></div>
              ` : ''}
              ${(p.resumo_financeiro?.valor_frete > 0) ? `
                <div class="print-financial-line"><span>Frete (${p.resumo_financeiro?.bairro_frete || 'Entrega'}):</span> <span class="font-mono">${CalcEngine.formatBRL(p.resumo_financeiro?.valor_frete || 0)}</span></div>
              ` : ''}
              ${(p.resumo_financeiro?.desconto_valor > 0) ? `
                <div class="print-financial-line" style="color: #047857;">
                  <span>(-) Desconto Comercial (${p.resumo_financeiro.desconto_percentual.toFixed(1)}%):</span> 
                  <span class="font-mono">-${CalcEngine.formatBRL(p.resumo_financeiro.desconto_valor)}</span>
                </div>
              ` : ''}
              <div class="print-financial-line print-total-highlight">
                <span>TOTAL À VISTA (PIX / DINH.):</span>
                <span class="font-mono">${CalcEngine.formatBRL(totalAVista)}</span>
              </div>
              <div class="print-financial-line print-bruto-highlight">
                <span>PREÇO BRUTO (A PRAZO +${pctBruto}%):</span>
                <span class="font-mono">${CalcEngine.formatBRL(totalBruto)}</span>
              </div>
              
              ${(p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') ? `
                <div class="print-status-tag paid">
                  ✓ 100% PAGO NO BALCÃO — MERCADORIA ENTREGUE
                </div>
              ` : saldoReceber > 0 ? `
                <div class="print-balance-due-box">
                  <span>SALDO À VISTA A RECEBER:</span>
                  <span class="font-mono" style="font-size: 11.5px;">${CalcEngine.formatBRL(saldoReceber)}</span>
                </div>
              ` : `
                <div class="print-status-tag paid">
                  ✓ PEDIDO TOTALMENTE PAGO
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * MODO 2: VIA DO PÁTIO E SERRA (ROMANEIO DE SEPARAÇÃO - SEM PREÇOS, A5 DEITADA)
   * Sem resumo de logística/pesos no cabeçalho.
   */
  gerarHtmlViaPatio(p) {
    const dataCriacao = new Date(p.data_criacao).toLocaleDateString('pt-BR');
    const saldoCobrar = p.resumo_financeiro?.saldo_a_receber || 0;
    const temSaldoCobrar = saldoCobrar > 0;

    const config = (typeof DB !== 'undefined' && DB.getConfig) ? DB.getConfig() : {};
    const nomeEmpresa = (config.nome_madeireira || 'Serraria e Madeireira Bom Jesus').toUpperCase();

    // Separa os itens em 2 blocos:
    // Bloco A: APARELHADA (Passar na Plaina)
    // Bloco B: BRUTA e Demais Materiais
    const itensPlaina = p.itens.filter(i => i.aparelhar);
    const itensBruta = p.itens.filter(i => !i.aparelhar);

    const totalItens = itensPlaina.length + itensBruta.length;
    const densityClass = totalItens <= 5 ? 'density-normal' : (totalItens <= 9 ? 'density-compact' : 'density-dense');

    return `
      <div class="print-sheet patio-sheet ${densityClass}">
        <!-- CABEÇALHO INDUSTRIAL DO PÁTIO -->
        <div class="print-sheet-header" style="border-bottom: 2px solid #000000;">
          <div>
            <div style="font-size: 14px; font-weight: 900; letter-spacing: 0.4px; text-transform: uppercase;">
              ROMANEIO DE CORTE, PLAINA E CARREGAMENTO
            </div>
            <div style="font-size: 10px; font-weight: 700; color: #334155;">
              SERRARIA & PÁTIO DE EXPEDIÇÃO - ${nomeEmpresa} (CAÇAPAVA - SP)
            </div>
          </div>
          <div class="print-doc-meta">
            <div style="font-size: 15px; font-weight: 900; font-family: var(--font-mono); color: #14532D;">
              PEDIDO #${p.numero}
            </div>
            <div style="font-size: 9.5px;">Data: <strong>${dataCriacao}</strong></div>
          </div>
        </div>

        <!-- ALERTA DE COBRANÇA NA ENTREGA (SE HOUVER) -->
        ${temSaldoCobrar ? `
          <div class="patio-alert-cobrar">
            ATENÇÃO MOTORISTA: COBRAR O VALOR DE ${CalcEngine.formatBRL(saldoCobrar)} NO ATO DO DESCARREGAMENTO (PIX OU DINHEIRO)
          </div>
        ` : `
          <div style="background-color: #DCFCE7; border: 1.5px solid #15803D; color: #15803D; font-size: 10.5px; font-weight: 800; padding: 3px 6px; text-align: center; margin-bottom: 6px; text-transform: uppercase;">
            PEDIDO QUITADO - NÃO COBRAR NADA DO CLIENTE NA DESCARGA
          </div>
        `}

        <!-- BANNER DE DESTINO E CONTATO -->
        <div class="patio-info-banner">
          <div>
            <div><strong>CLIENTE:</strong> ${p.cliente?.nome || 'Cliente'}</div>
            <div><strong>LOCAL DA OBRA:</strong> ${p.cliente?.endereco_obra || 'Retirada no Pátio'}</div>
            <div><strong>CONTATO:</strong> ${p.cliente?.telefone || 'N/A'} | <strong>VENDEDOR:</strong> ${p.vendedor?.nome || 'Balcão'}</div>
          </div>
          <div>
            <div><strong>DESTINO / BAIRRO:</strong></div>
            <div style="font-size: 13px; font-weight: 900; color: #14532D;">
              ${p.cliente?.bairro || p.resumo_financeiro?.bairro_frete || 'RETIRADA NO PÁTIO'}
            </div>
            <div style="font-size: 9.5px; color: #475569; margin-top: 1px;">
              ${(p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') ? 'Retirada Imediata no Balcão' : 'Carregamento / Entrega'}
            </div>
          </div>
        </div>

        <!-- BLOCO A: PASSAR NA PLAINA / BENEFICIAR (APARELHADA) -->
        ${itensPlaina.length > 0 ? `
          <div class="patio-section-title plaina">
            <span>BLOCO A - PASSAR NA PLAINA / BENEFICIAR (APARELHAR)</span>
            <span style="font-size: 9px;">MANDAR P/ MAQUINÁRIO ANTES DE CARREGAR</span>
          </div>
          <table class="patio-table">
            <thead>
              <tr>
                <th style="width: 120px; text-align: center;">Conferência</th>
                <th style="width: 65px;">Cód.</th>
                <th>Descrição e Bitola</th>
                <th style="width: 50px; text-align: center;">Qtd</th>
                <th style="width: 65px; text-align: center;">Largura</th>
                <th style="width: 60px; text-align: center;">Compr.</th>
                <th style="width: 85px; text-align: right;">Total Metros</th>
              </tr>
            </thead>
            <tbody>
              ${itensPlaina.map(it => `
                <tr>
                  <td style="text-align: center; white-space: nowrap;">
                    <span class="patio-check-box"></span> Plaina
                    <span class="patio-check-box" style="margin-left: 6px;"></span> Caminhão
                  </td>
                  <td class="font-mono">${it.codigo}</td>
                  <td>
                    <strong>${it.descricao}</strong>
                    <span style="font-size: 9.5px; color: #15803D; font-weight: 700; margin-left: 4px;">[APARELHAR]</span>
                  </td>
                  <td class="align-center font-mono" style="font-weight: 900;">${it.quantidade}</td>
                  <td class="align-center font-mono">${it.largura_cm ? it.largura_cm + ' cm' : '-'}</td>
                  <td class="align-center font-mono">${it.comprimento_m > 0 ? it.comprimento_m + 'm' : '-'}</td>
                  <td class="align-right font-mono" style="font-weight: 800;">${CalcEngine.formatNumero(it.metragem_total, 1)} ML</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}

        <!-- BLOCO B: MADEIRA BRUTA, CAIXARIA E DEMAIS MATERIAIS -->
        <div class="patio-section-title">
          <span>BLOCO B - MADEIRAMENTO BRUTO, CAIXARIA E DEMAIS MATERIAIS</span>
          <span style="font-size: 9px;">SEPARAR NAS PILHAS DO PÁTIO</span>
        </div>
        <table class="patio-table">
          <thead>
            <tr>
              <th style="width: 120px; text-align: center;">Conferência</th>
              <th style="width: 65px;">Cód.</th>
              <th>Descrição e Medida</th>
              <th style="width: 50px; text-align: center;">Qtd</th>
              <th style="width: 65px; text-align: center;">Largura</th>
              <th style="width: 60px; text-align: center;">Compr.</th>
              <th style="width: 85px; text-align: right;">Total Metros/Un</th>
            </tr>
          </thead>
          <tbody>
            ${itensBruta.map(it => `
              <tr>
                <td style="text-align: center; white-space: nowrap;">
                  <span class="patio-check-box"></span> Separado
                  <span class="patio-check-box" style="margin-left: 6px;"></span> Caminhão
                </td>
                <td class="font-mono">${it.codigo}</td>
                <td><strong>${it.descricao}</strong></td>
                <td class="align-center font-mono" style="font-weight: 900;">${it.quantidade}</td>
                <td class="align-center font-mono">${it.largura_cm ? it.largura_cm + ' cm' : '-'}</td>
                <td class="align-center font-mono">${it.comprimento_m > 0 ? it.comprimento_m + 'm' : '-'}</td>
                <td class="align-right font-mono" style="font-weight: 800;">
                  ${CalcEngine.formatNumero(it.metragem_total, it.tipo_calculo === 'ML' ? 1 : 0)} ${it.tipo_calculo === 'ML' ? 'ML' : it.tipo_calculo === 'M2' ? 'm²' : 'un'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- ASSINATURAS DO OPERACIONAL -->
        <div class="print-signatures-grid" style="margin-top: 10px;">
          <div class="signature-line">
            Conferente do Pátio / Operador de Serra<br>
            <span>(Assinatura após conferir e amarrar a carga)</span>
          </div>
          <div class="signature-line">
            Motorista Responsável pelo Carregamento<br>
            <span>(Confirmo recebimento das peças sem avarias)</span>
          </div>
        </div>
      </div>
    `;
  }
};

window.PrintModule = PrintModule;
