/**
 * SERRARIA & MADEIREIRA ERP - MÓDULO DE IMPRESSÃO
 * Renderiza os 2 layouts A4 (Via Cliente com Preços e Via Pátio SEM PREÇOS).
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
   * Dispara a impressão limpa e direta da comanda usando um iframe isolado
   * Isso garante que apenas a folha da comanda vá para a impressora,
   * sem bordas do sistema, headers da página ou prints acidentais da tela.
   */
  executarImpressao() {
    const container = document.getElementById('print-sheet-content');
    if (!container || !container.innerHTML.trim()) {
      if (this.currentPedido) {
        this.renderFolhaImpressao();
      } else if (window.BalcaoModule && BalcaoModule.currentOrder && BalcaoModule.currentOrder.itens?.length) {
        this.abrirModalImpressao(BalcaoModule.currentOrder, this.currentMode || 'CLIENTE');
      } else {
        App.showToast('Nenhuma comanda carregada para impressão.', 'warning');
        return;
      }
    }

    const htmlContent = document.getElementById('print-sheet-content')?.innerHTML;
    if (!htmlContent) return;

    const docTitle = `${this.currentMode === 'PATIO' ? 'Romaneio_Patio' : 'Comanda_Orcamento'}_${this.currentPedido?.numero || 'Serraria'}`;

    // Cria/Reutiliza iframe invisível para impressão direta e isolada da comanda
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
            size: A4 portrait;
            margin: 8mm 10mm 8mm 10mm;
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
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `);
    frameDoc.close();

    // Dispara a impressão com foco garantido após renderização do documento
    setTimeout(() => {
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

  gerarHtmlViaCliente(p) {
    const dataCriacao = new Date(p.data_criacao).toLocaleDateString('pt-BR');
    const validadeAte = new Date(new Date(p.data_criacao).getTime() + (p.validade_dias || 7) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');
    const saldoReceber = p.resumo_financeiro?.saldo_a_receber || 0;

    const config = (typeof DB !== 'undefined' && DB.getConfig) ? DB.getConfig() : {};
    const nomeEmpresa = config.nome_madeireira || 'Serraria e Madeireira Bom Jesus';
    const cnpjEmpresa = config.cnpj_madeireira || '16.482.988/0001-02';
    const endEmpresa = config.endereco_madeireira || 'Av. Adhemar Pinto de Siqueira, 1000 - Vila Galvão, Caçapava - SP, 12286-325';
    const telEmpresa = config.telefone_madeireira || '(12) 99603-3793';

    return `
      <div class="print-sheet">
        <!-- CABEÇALHO DA MADEIREIRA -->
        <div class="print-sheet-header">
          <div>
            <div class="print-company-name">${nomeEmpresa}</div>
            <div class="print-company-meta">
              CNPJ: ${cnpjEmpresa}<br>
              ${endEmpresa}<br>
              Telefone / WhatsApp: ${telEmpresa}
            </div>
          </div>
          <div class="print-doc-meta">
            <div class="print-doc-title">${(p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') ? 'CUPOM DE VENDA DE BALCÃO / RECIBO' : (p.status === 'ENTREGUE' ? 'COMPROVANTE DE ENTREGA E QUITAÇÃO' : 'VIA DO CLIENTE')}</div>
            <div class="print-doc-number">${(p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') ? 'VENDA Nº #' + p.numero : (p.status === 'ORCAMENTO' ? 'ORÇAMENTO Nº #' + p.numero : 'PEDIDO Nº #' + p.numero)}</div>
            <div class="print-doc-date">Emissão: <strong>${dataCriacao}</strong> | Status: <strong>${(p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') ? '100% PAGO & RETIRADO NO BALCÃO' : (p.status === 'ENTREGUE' ? 'QUITADO' : 'Válido até ' + validadeAte)}</strong></div>
          </div>
        </div>

        <!-- QUADRO DE DADOS DO CLIENTE E ENTREGA -->
        <div class="print-client-box">
          <div>
            <div class="print-client-row"><strong>Cliente:</strong> ${p.cliente?.nome || 'Cliente Balcão'}</div>
            <div class="print-client-row"><strong>CPF/CNPJ:</strong> ${p.cliente?.documento || 'Não informado'} | <strong>Telefone:</strong> ${p.cliente?.telefone || 'Não informado'}</div>
            <div class="print-client-row"><strong>Local de Entrega:</strong> ${(p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') ? 'Retirada Imediata no Balcão da Madeireira' : (p.cliente?.endereco_obra || 'Retirada no Pátio')}</div>
          </div>
          <div>
            <div class="print-client-row"><strong>Bairro:</strong> ${p.cliente?.bairro || p.resumo_financeiro?.bairro_frete || '-'}</div>
            <div class="print-client-row"><strong>Cidade:</strong> ${p.cliente?.cidade || 'Caçapava'}</div>
            <div class="print-client-row"><strong>Vendedor:</strong> ${p.vendedor?.nome || 'Balcão'} | <strong>Indicação:</strong> ${p.carpinteiro_nome || 'Direta'}</div>
          </div>
        </div>

        <!-- TABELA DE ITENS COM PREÇOS -->
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 25px;" class="align-center">#</th>
              <th style="width: 70px;">Cód.</th>
              <th>Descrição do Produto e Bitola</th>
              <th style="width: 85px;" class="align-center">Acabamento</th>
              <th style="width: 45px;" class="align-center">Qtd</th>
              <th style="width: 55px;" class="align-center">Compr.</th>
              <th style="width: 75px;" class="align-right">Metragem</th>
              <th style="width: 75px;" class="align-right">Preço Unit.</th>
              <th style="width: 85px;" class="align-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${p.itens.map((it, idx) => `
              <tr>
                <td class="align-center font-mono" style="font-size: 10px;">${idx + 1}</td>
                <td class="font-mono">${it.codigo}</td>
                <td><strong>${it.descricao}</strong></td>
                <td class="align-center font-mono" style="font-size: 10px;">${it.acabamento}</td>
                <td class="align-center font-mono">${it.quantidade}</td>
                <td class="align-center font-mono">${it.comprimento_m > 0 ? it.comprimento_m + 'm' : '-'}</td>
                <td class="align-right font-mono">${CalcEngine.formatNumero(it.metragem_total, it.tipo_calculo === 'ML' ? 1 : 0)} ${it.tipo_calculo === 'ML' ? 'ML' : it.tipo_calculo === 'M2' ? 'm²' : 'un'}</td>
                <td class="align-right font-mono">${CalcEngine.formatBRL(it.valor_unitario)}</td>
                <td class="align-right font-mono" style="font-weight: 700;">${CalcEngine.formatBRL(it.subtotal)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- QUADRO FINANCEIRO E DE CARGA -->
        <div class="print-financial-box">
          <div>
            <div style="font-size: 10.5px; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; color: var(--text-secondary);">
              Resumo da Carga & Transporte
            </div>
            <div class="print-financial-line"><span>Total de Peças:</span> <strong class="font-mono">${p.resumo_fisico?.total_pecas || p.itens.length}</strong></div>
            <div class="print-financial-line"><span>Volume Estimado:</span> <strong class="font-mono">${CalcEngine.formatM3(p.resumo_fisico?.volume_total_m3 || 0)}</strong></div>
            <div class="print-financial-line"><span>Peso Total Estimado:</span> <strong class="font-mono">${CalcEngine.formatKg(p.resumo_fisico?.peso_total_kg || 0)}</strong></div>
            <div class="print-financial-line"><span>Veículo Recomendado:</span> <span style="font-size: 10.5px;">${p.resumo_fisico?.veiculo_sugerido || 'Utilitário'}</span></div>
            <div class="print-financial-line" style="margin-top: 4px;"><span>Forma de Pagamento:</span> <strong>${p.resumo_financeiro?.forma_pagamento || 'Pix'}</strong></div>
          </div>
          <div class="print-financial-lines">
            <div class="print-financial-line"><span>Subtotal dos Produtos:</span> <span class="font-mono">${CalcEngine.formatBRL(p.resumo_financeiro?.subtotal_itens_puros || 0)}</span></div>
            <div class="print-financial-line"><span>Taxa de Beneficiamento (Plaina):</span> <span class="font-mono">${CalcEngine.formatBRL(p.resumo_financeiro?.taxa_aparelhamento || 0)}</span></div>
            <div class="print-financial-line"><span>Frete (${p.resumo_financeiro?.bairro_frete || 'Entrega'}):</span> <span class="font-mono">${CalcEngine.formatBRL(p.resumo_financeiro?.valor_frete || 0)}</span></div>
            ${p.resumo_financeiro?.desconto_valor > 0 ? `
              <div class="print-financial-line" style="color: var(--action-green);">
                <span>(-) Desconto Comercial (${p.resumo_financeiro.desconto_percentual.toFixed(1)}%):</span> 
                <span class="font-mono">-${CalcEngine.formatBRL(p.resumo_financeiro.desconto_valor)}</span>
              </div>
            ` : ''}
            <div class="print-financial-line print-total-highlight">
              <span>VALOR TOTAL DO PEDIDO:</span>
              <span class="font-mono">${CalcEngine.formatBRL(p.resumo_financeiro?.valor_total || 0)}</span>
            </div>
            
            ${(p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') ? `
              <div style="margin-top: 6px; padding: 6px 8px; background: #ECFDF5; border: 1px solid #10B981; border-radius: 4px; font-weight: 700; color: #047857; font-size: 11px; text-align: center;">
                ✓ 100% PAGO NO BALCÃO — MERCADORIA ENTREGUE NA HORA
              </div>
            ` : saldoReceber > 0 ? `
              <div class="print-balance-due-box" style="margin-top: 6px;">
                <span>SALDO A PAGAR NA ENTREGA:</span>
                <span class="font-mono" style="font-size: 13px;">${CalcEngine.formatBRL(saldoReceber)}</span>
              </div>
            ` : `
              <div style="margin-top: 4px; font-weight: 700; color: var(--action-green); text-align: right;">
                ✓ PEDIDO TOTALMENTE PAGO
              </div>
            `}
          </div>
        </div>

        <!-- TERMOS LEGAIS E ASSINATURA -->
        <div class="print-terms">
          * Madeira serrada é um produto natural sujeito a variações de umidade, tonalidade e veios. Confira as quantidades e medidas no ato do descarregamento. Reclamações posteriores à descarga não serão aceitas. Pagamentos combinados na entrega devem ser quitados antes da descarga do caminhão.
        </div>

        <div class="print-signatures-grid">
          <div class="signature-line">
            ${p.vendedor?.nome || 'Vendedor Responsável'}<br>
            Atendimento de Balcão
          </div>
          <div class="signature-line">
            ${p.cliente?.nome || 'Cliente'}<br>
            Assinatura do Comprador / Recebedor
          </div>
        </div>
      </div>
    `;
  },

  gerarHtmlViaPatio(p) {
    const dataCriacao = new Date(p.data_criacao).toLocaleDateString('pt-BR');
    const saldoCobrar = p.resumo_financeiro?.saldo_a_receber || 0;
    const temSaldoCobrar = saldoCobrar > 0;

    const config = (typeof DB !== 'undefined' && DB.getConfig) ? DB.getConfig() : {};
    const nomeEmpresa = (config.nome_madeireira || 'Serraria e Madeireira Bom Jesus').toUpperCase();

    // Separa os itens em 2 blocos:
    // Bloco A: APARELHADA (Passar na Plaina)
    // Bloco B: BRUTA e Demais Acessórios
    const itensPlaina = p.itens.filter(i => i.aparelhar);
    const itensBruta = p.itens.filter(i => !i.aparelhar);

    return `
      <div class="print-sheet patio-sheet">
        <!-- CABEÇALHO INDUSTRIAL DO PÁTIO -->
        <div class="print-sheet-header" style="border-bottom: 3px solid #000000;">
          <div>
            <div style="font-size: 18px; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase;">
              ROMANEIO DE CORTE, PLAINA E CARREGAMENTO
            </div>
            <div style="font-size: 12px; font-weight: 700; color: #334155;">
              SERRARIA & PÁTIO DE EXPEDIÇÃO - ${nomeEmpresa} (CAÇAPAVA - SP)
            </div>
          </div>
          <div class="print-doc-meta">
            <div style="font-size: 18px; font-weight: 900; font-family: var(--font-mono); color: #14532D;">
              PEDIDO #${p.numero}
            </div>
            <div style="font-size: 11px;">Data: <strong>${dataCriacao}</strong></div>
          </div>
        </div>

        <!-- ALERTA GIGANTE DE COBRANÇA NA ENTREGA (SE HOUVER) -->
        ${temSaldoCobrar ? `
          <div class="patio-alert-cobrar">
            ATENÇÃO MOTORISTA: COBRAR O VALOR DE ${CalcEngine.formatBRL(saldoCobrar)} NO ATO DO DESCARREGAMENTO (PIX OU DINHEIRO)
          </div>
        ` : `
          <div style="background-color: #DCFCE7; border: 2px solid #15803D; color: #15803D; font-size: 14px; font-weight: 800; padding: 6px; text-align: center; margin-bottom: 12px; text-transform: uppercase;">
            PEDIDO QUITADO - NÃO COBRAR NADA DO CLIENTE NA DESCARGA
          </div>
        `}

        <!-- BANNER DE DESTINO E DADOS DO TRANSPORTE -->
        <div class="patio-info-banner">
          <div>
            <div><strong>CLIENTE:</strong> ${p.cliente?.nome || 'Cliente'}</div>
            <div><strong>LOCAL DA OBRA:</strong> ${p.cliente?.endereco_obra || 'Retirada no Pátio'}</div>
            <div><strong>TELEFONE/WHATS:</strong> ${p.cliente?.telefone || 'N/A'}</div>
            <div><strong>VENDEDOR:</strong> ${p.vendedor?.nome || 'Balcão'}</div>
          </div>
          <div>
            <div><strong>BAIRRO DE ENTREGA:</strong></div>
            <div style="font-size: 16px; font-weight: 900; color: #14532D;">
              ${p.cliente?.bairro || p.resumo_financeiro?.bairro_frete || 'PÁTIO'}
            </div>
          </div>
          <div>
            <div><strong>PESO TOTAL:</strong> <span class="font-mono" style="font-size: 15px; font-weight: 900;">${CalcEngine.formatKg(p.resumo_fisico?.peso_total_kg || 0)}</span></div>
            <div><strong>TOTAL PEÇAS:</strong> <span class="font-mono" style="font-weight: 800;">${p.resumo_fisico?.total_pecas || p.itens.length}</span></div>
            <div><strong>VEÍCULO:</strong> ${p.resumo_fisico?.veiculo_sugerido?.split('(')[0] || 'Caminhão'}</div>
          </div>
        </div>

        <!-- BLOCO A: PASSAR NA PLAINA / BENEFICIAR (APARELHADA) -->
        ${itensPlaina.length > 0 ? `
          <div class="patio-section-title plaina">
            <span>BLOCO A - PASSAR NA PLAINA / BENEFICIAR (APARELHAR)</span>
            <span style="font-size: 11px;">MANDAR P/ MAQUINÁRIO ANTES DE CARREGAR</span>
          </div>
          <table class="patio-table">
            <thead>
              <tr>
                <th style="width: 140px; text-align: center;">Conferência</th>
                <th style="width: 80px;">Cód.</th>
                <th>Descrição e Bitola</th>
                <th style="width: 70px; text-align: center;">Qtd</th>
                <th style="width: 85px; text-align: center;">Compr.</th>
                <th style="width: 95px; text-align: right;">Total Metros</th>
              </tr>
            </thead>
            <tbody>
              ${itensPlaina.map(it => `
                <tr>
                  <td style="text-align: center; white-space: nowrap;">
                    <span class="patio-check-box"></span> Plaina
                    <span class="patio-check-box" style="margin-left: 8px;"></span> Caminhão
                  </td>
                  <td class="font-mono">${it.codigo}</td>
                  <td>
                    <strong style="font-size: 14px;">${it.descricao}</strong>
                    <span style="font-size: 11px; color: #15803D; font-weight: 700; display: block;">[APARELHAR 4 FACES]</span>
                  </td>
                  <td class="align-center font-mono" style="font-size: 15px; font-weight: 900;">${it.quantidade}</td>
                  <td class="align-center font-mono" style="font-size: 14px; font-weight: 700;">${it.comprimento_m > 0 ? it.comprimento_m + ' m' : '-'}</td>
                  <td class="align-right font-mono" style="font-size: 14px; font-weight: 800;">${CalcEngine.formatNumero(it.metragem_total, 1)} ML</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}

        <!-- BLOCO B: MADEIRA BRUTA, CAIXARIA E ACESSÓRIOS -->
        <div class="patio-section-title">
          <span>BLOCO B - MADEIRAMENTO BRUTO, CAIXARIA E DEMAIS MATERIAIS</span>
          <span style="font-size: 11px;">SEPARAR DIRETAMENTE NAS PILHAS DO PÁTIO</span>
        </div>
        <table class="patio-table">
          <thead>
            <tr>
              <th style="width: 140px; text-align: center;">Conferência</th>
              <th style="width: 80px;">Cód.</th>
              <th>Descrição e Medida</th>
              <th style="width: 70px; text-align: center;">Qtd</th>
              <th style="width: 85px; text-align: center;">Compr.</th>
              <th style="width: 95px; text-align: right;">Total Metros/Un</th>
            </tr>
          </thead>
          <tbody>
            ${itensBruta.map(it => `
              <tr>
                <td style="text-align: center; white-space: nowrap;">
                  <span class="patio-check-box"></span> Separado
                  <span class="patio-check-box" style="margin-left: 8px;"></span> Caminhão
                </td>
                <td class="font-mono">${it.codigo}</td>
                <td><strong style="font-size: 14px;">${it.descricao}</strong></td>
                <td class="align-center font-mono" style="font-size: 15px; font-weight: 900;">${it.quantidade}</td>
                <td class="align-center font-mono" style="font-size: 14px; font-weight: 700;">${it.comprimento_m > 0 ? it.comprimento_m + ' m' : '-'}</td>
                <td class="align-right font-mono" style="font-size: 14px; font-weight: 800;">
                  ${CalcEngine.formatNumero(it.metragem_total, it.tipo_calculo === 'ML' ? 1 : 0)} ${it.tipo_calculo === 'ML' ? 'ML' : it.tipo_calculo === 'M2' ? 'm²' : 'un'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- ASSINATURA DO OPERACIONAL -->
        <div class="print-signatures-grid" style="margin-top: 30px;">
          <div class="signature-line" style="font-size: 11px;">
            Conferente do Pátio / Operador de Serra<br>
            (Assinatura após empilhar e amarrar a carga)
          </div>
          <div class="signature-line" style="font-size: 11px;">
            Motorista Responsável pelo Carregamento<br>
            (Confirmo recebimento das peças sem avarias)
          </div>
        </div>
      </div>
    `;
  }
};

window.PrintModule = PrintModule;

