import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CalcEngine } from '../../services/calc.js';

// Folha de estilos completa e autocontida para a comanda A5 Paisagem
const COMANDA_PRINT_CSS = `
  @page {
    size: A5 landscape;
    margin: 0;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #FFFFFF !important;
    color: #0F172A !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 10px;
    line-height: 1.3;
    width: 210mm !important;
    height: 148mm !important;
    max-height: 148mm !important;
    overflow: hidden !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .print-sheet {
    background-color: #FFFFFF !important;
    color: #0F172A !important;
    padding: 5mm 8mm !important;
    border: none !important;
    box-shadow: none !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 10px;
    line-height: 1.3;
    width: 210mm !important;
    max-width: 210mm !important;
    height: 148mm !important;
    max-height: 148mm !important;
    margin: 0 !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
  }
  .print-sheet.density-normal { font-size: 10.5px; }
  .print-sheet.density-normal .print-table th, .print-sheet.density-normal .print-table td { padding: 3.5px 5px; }
  .print-sheet.density-compact { font-size: 9.5px; }
  .print-sheet.density-compact .print-table th, .print-sheet.density-compact .print-table td { padding: 2px 4px; }
  .print-sheet.density-compact .print-sheet-header { margin-bottom: 6px; padding-bottom: 5px; }
  .print-sheet.density-compact .print-client-box { margin-bottom: 6px; padding: 4px 6px; }
  .print-sheet.density-compact .print-footer-container { margin-top: 6px; padding: 4px 8px; }
  .print-sheet.density-dense { font-size: 8.5px; }
  .print-sheet.density-dense .print-table th, .print-sheet.density-dense .print-table td { padding: 1.5px 3px; font-size: 8.5px; }
  .print-sheet.density-dense .print-sheet-header { margin-bottom: 4px; padding-bottom: 4px; }
  .print-sheet.density-dense .print-company-name { font-size: 13px; }
  .print-sheet.density-dense .print-client-box { margin-bottom: 4px; padding: 3px 6px; }
  .print-sheet.density-dense .print-footer-container { margin-top: 4px; padding: 3px 6px; }
  .print-sheet.density-dense .print-signatures-grid { margin-top: 6px; }

  .print-sheet-header {
    border-bottom: 2px solid #0F172A;
    padding-bottom: 6px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .print-company-name {
    font-size: 15px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #14532D;
    line-height: 1.15;
  }
  .print-company-meta {
    font-size: 9.5px;
    color: #475569;
    line-height: 1.25;
    margin-top: 2px;
  }
  .print-doc-meta { text-align: right; }
  .print-doc-title {
    font-size: 13px;
    font-weight: 800;
    color: #0F172A;
    text-transform: uppercase;
  }
  .print-doc-number {
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 13.5px;
    font-weight: 800;
    color: #14532D;
  }
  .print-doc-date {
    font-size: 9.5px;
    color: #475569;
  }

  .print-client-box {
    border: 1px solid #94A3B8;
    padding: 5px 8px;
    margin-bottom: 8px;
    background-color: #F8FAFC !important;
    display: grid;
    grid-template-columns: 1.3fr 1.3fr 1fr;
    gap: 8px;
    font-size: 9.5px;
    line-height: 1.3;
  }
  .print-client-row {
    margin-bottom: 1.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .print-client-row strong { color: #0F172A; }

  .print-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 6px;
    font-size: 10px;
  }
  .print-table th {
    background-color: #F1F5F9 !important;
    border-top: 1px solid #0F172A;
    border-bottom: 1.5px solid #0F172A;
    border-right: 1px solid #CBD5E1;
    padding: 3px 5px;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 9px;
    text-align: left;
  }
  .print-table th:last-child { border-right: none; }
  .print-table td {
    border-bottom: 1px solid #E2E8F0;
    border-right: 1px solid #F1F5F9;
    padding: 3px 5px;
  }
  .print-table td:last-child { border-right: none; }
  .print-table td.align-right, .print-table th.align-right { text-align: right; }
  .print-table td.align-center, .print-table th.align-center { text-align: center; }
  .print-table td.font-mono {
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-variant-numeric: tabular-nums;
  }

  .print-footer-container {
    display: grid;
    grid-template-columns: 1.25fr 1fr;
    gap: 12px;
    border: 1px solid #94A3B8;
    padding: 6px 10px;
    background-color: #F8FAFC !important;
    margin-top: auto;
  }
  .print-footer-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .print-payment-badge {
    font-size: 10px;
    color: #0F172A;
    background-color: #E2E8F0 !important;
    padding: 2px 6px;
    border-radius: 3px;
    display: inline-block;
    margin-bottom: 3px;
  }
  .print-terms {
    font-size: 8px;
    color: #475569;
    line-height: 1.25;
    margin-bottom: 5px;
  }
  .print-signatures-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 6px;
  }
  .signature-line {
    border-top: 1px solid #0F172A;
    text-align: center;
    font-size: 8.5px;
    padding-top: 2px;
    color: #334155;
    line-height: 1.2;
  }
  .signature-line span {
    font-size: 7.5px;
    color: #64748B;
  }

  .print-footer-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-left: 1px solid #CBD5E1;
    padding-left: 10px;
  }
  .print-financial-lines {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 9.5px;
  }
  .print-financial-line {
    display: flex;
    justify-content: space-between;
  }
  .print-total-highlight {
    font-size: 12px;
    font-weight: 800;
    color: #14532D;
    border-top: 1.5px solid #0F172A;
    padding-top: 3px;
    margin-top: 3px;
  }
  .print-bruto-highlight {
    font-size: 11px;
    font-weight: 800;
    color: #1E40AF;
    background-color: #EFF6FF !important;
    border: 1px solid #93C5FD;
    border-radius: 3px;
    padding: 2.5px 5px;
    margin-top: 3px;
  }
  .print-status-tag {
    margin-top: 3px;
    padding: 2.5px 6px;
    border-radius: 3px;
    font-weight: 700;
    font-size: 9px;
    text-align: center;
  }
  .print-status-tag.paid {
    background: #ECFDF5 !important;
    border: 1px solid #10B981;
    color: #047857;
  }
  .print-balance-due-box {
    background-color: #FEF3C7 !important;
    border: 1px solid #B45309;
    padding: 3px 6px;
    color: #B45309;
    font-weight: 700;
    font-size: 10.5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 3px;
  }

  /* Pátio */
  .patio-sheet { font-size: 10.5px; line-height: 1.3; }
  .patio-alert-cobrar {
    background-color: #FEE2E2 !important;
    border: 1.5px solid #B91C1C;
    color: #B91C1C;
    font-size: 11px;
    font-weight: 800;
    padding: 3px 8px;
    margin-bottom: 6px;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 0.4px;
  }
  .patio-info-banner {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 10px;
    background-color: #F1F5F9 !important;
    border: 1px solid #94A3B8;
    padding: 5px 8px;
    margin-bottom: 6px;
    font-size: 10px;
  }
  .patio-section-title {
    background-color: #0F172A !important;
    color: #FFFFFF !important;
    padding: 3px 8px;
    font-size: 9.5px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    margin-top: 6px;
    margin-bottom: 3px;
    display: flex;
    justify-content: space-between;
  }
  .patio-section-title.plaina { background-color: #14532D !important; }
  .patio-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10px;
    margin-bottom: 6px;
  }
  .patio-table th {
    background-color: #E2E8F0 !important;
    border-top: 1px solid #0F172A;
    border-bottom: 1.5px solid #0F172A;
    border-right: 1px solid #CBD5E1;
    padding: 3px 5px;
    font-weight: 800;
    font-size: 9px;
    text-transform: uppercase;
  }
  .patio-table td {
    border-bottom: 1px solid #94A3B8;
    border-right: 1px solid #E2E8F0;
    padding: 3px 5px;
    font-weight: 600;
  }
  .patio-check-box {
    width: 14px;
    height: 14px;
    border: 1.5px solid #0F172A;
    display: inline-block;
    margin-right: 4px;
    vertical-align: middle;
  }
  .font-mono {
    font-family: 'JetBrains Mono', Consolas, monospace !important;
  }
`;

export const PrintModal = () => {
  const { printModal, closePrintModal, togglePrintMode, config } = useApp();
  const printSheetRef = useRef(null);

  const executarImpressao = () => {
    try {
      const container = printSheetRef.current;
      if (!container) return;

      const p = printModal.order;
      const isCliente = printModal.mode === 'CLIENTE';

      let printIframe = document.getElementById('comanda-print-iframe-react');
      if (!printIframe) {
        printIframe = document.createElement('iframe');
        printIframe.id = 'comanda-print-iframe-react';
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
          <title>${isCliente ? 'Comanda_Orcamento' : 'Romaneio_Patio'}_${p?.numero || ''}_A5</title>
          <style>
            ${COMANDA_PRINT_CSS}
          </style>
        </head>
        <body>
          ${container.innerHTML}
        </body>
        </html>
      `);
      frameDoc.close();

      setTimeout(() => {
        try {
          printIframe.contentWindow.focus();
          printIframe.contentWindow.print();
        } catch (err) {
          console.warn('Falha no print do iframe:', err);
        }
      }, 250);
    } catch (e) {
      console.error('Erro ao executar impressão:', e);
    }
  };

  // Atalho de teclado Ctrl+P (Hook SEMPRE executado na mesma ordem)
  useEffect(() => {
    if (!printModal.isOpen || !printModal.order) return;
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        executarImpressao();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [printModal.isOpen, printModal.order, printModal.mode]);

  if (!printModal.isOpen || !printModal.order) return null;

  const p = printModal.order;
  const isCliente = printModal.mode === 'CLIENTE';

  const dataCriacao = new Date(p.data_criacao || Date.now()).toLocaleDateString('pt-BR');
  const validadeAte = new Date(new Date(p.data_criacao || Date.now()).getTime() + (p.validade_dias || 7) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');
  const saldoReceber = p.resumo_financeiro?.saldo_a_receber || 0;
  const temSaldoCobrar = saldoReceber > 0;

  const nomeEmpresa = config.nome_madeireira || 'Serraria e Madeireira Bom Jesus';
  const cnpjEmpresa = config.cnpj_madeireira || '16.482.988/0001-02';
  const endEmpresa = config.endereco_madeireira || 'Av. Adhemar Pinto de Siqueira, 1000 - Vila Galvão, Caçapava - SP';
  const telEmpresa = config.telefone_madeireira || '(12) 99603-3793';

  // Preço Bruto
  const pctBruto = (p.resumo_financeiro?.percentual_bruto !== undefined && p.resumo_financeiro?.percentual_bruto !== null)
    ? parseFloat(p.resumo_financeiro.percentual_bruto)
    : CalcEngine.getPercentualPrecoBruto();
  const totalAVista = p.resumo_financeiro?.valor_total || 0;
  const totalBruto = p.resumo_financeiro?.valor_total_bruto || CalcEngine.calcularPrecoBruto(totalAVista, pctBruto);

  // Itens & densidade
  const itens = p.itens || [];
  const itemCount = itens.length;
  const densityClass = itemCount <= 4 ? 'density-normal' : (itemCount <= 8 ? 'density-compact' : 'density-dense');

  // Pátio
  const itensPlaina = itens.filter(i => i.aparelhar);
  const itensBruta = itens.filter(i => !i.aparelhar);

  return (
    <div className="modal-overlay active" style={{ display: 'flex' }}>
      <div className="modal-container modal-xl" style={{ maxWidth: '920px' }}>
        <div className="modal-header no-print">
          <span className="modal-title">
            Prévia de Impressão A5 Deitada • {isCliente ? 'Via do Cliente (Com Preços)' : 'Via do Pátio (Sem Preços)'}
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="btn btn-sm btn-secondary" onClick={togglePrintMode}>
              {isCliente ? 'Alternar para Via do Pátio (Sem Preços)' : 'Alternar para Via do Cliente (Com Preços)'}
            </button>
            <button className="btn btn-sm btn-primary" onClick={executarImpressao}>
              Imprimir A5 Deitada (Ctrl+P)
            </button>
            <button className="modal-close" onClick={closePrintModal}>&times;</button>
          </div>
        </div>

        <div className="modal-body" style={{ backgroundColor: '#E2E8F0', padding: '20px', overflowX: 'auto' }}>
          <div ref={printSheetRef}>
            {isCliente ? (
              /* VIA DO CLIENTE COM PREÇO À VISTA E PREÇO BRUTO */
              <div className={`print-sheet ${densityClass}`}>
                <div className="print-sheet-header">
                  <div>
                    <div className="print-company-name">{nomeEmpresa}</div>
                    <div className="print-company-meta">
                      CNPJ: {cnpjEmpresa} | Telefone/WhatsApp: {telEmpresa}<br />
                      {endEmpresa}
                    </div>
                  </div>
                  <div className="print-doc-meta">
                    <div className="print-doc-title">
                      {(p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') ? 'CUPOM DE VENDA DE BALCÃO' : (p.status === 'ENTREGUE' ? 'COMPROVANTE DE ENTREGA E QUITAÇÃO' : 'VIA DO CLIENTE')}
                    </div>
                    <div className="print-doc-number">
                      {(p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') ? `VENDA Nº #${p.numero}` : (p.status === 'ORCAMENTO' ? `ORÇAMENTO Nº #${p.numero}` : `PEDIDO Nº #${p.numero}`)}
                    </div>
                    <div className="print-doc-date">
                      Emissão: <strong>{dataCriacao}</strong> | Status: <strong>{(p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') ? '100% PAGO & RETIRADO' : (p.status === 'ENTREGUE' ? 'QUITADO' : `Válido até ${validadeAte}`)}</strong>
                    </div>
                  </div>
                </div>

                <div className="print-client-box">
                  <div>
                    <div className="print-client-row"><strong>Cliente:</strong> {p.cliente?.nome || 'Cliente Balcão'}</div>
                    <div className="print-client-row"><strong>CPF/CNPJ:</strong> {p.cliente?.documento || 'Não informado'}</div>
                    <div className="print-client-row"><strong>Telefone:</strong> {p.cliente?.telefone || 'Não informado'}</div>
                  </div>
                  <div>
                    <div className="print-client-row"><strong>Local:</strong> {(p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') ? 'Retirada no Balcão' : (p.cliente?.endereco_obra || 'Retirada no Pátio')}</div>
                    <div className="print-client-row"><strong>Bairro:</strong> {p.cliente?.bairro || p.resumo_financeiro?.bairro_frete || '-'}</div>
                    <div className="print-client-row"><strong>Cidade:</strong> {p.cliente?.cidade || 'Caçapava'}</div>
                  </div>
                  <div>
                    <div className="print-client-row"><strong>Vendedor:</strong> {p.vendedor?.nome || 'Balcão'}</div>
                    <div className="print-client-row"><strong>Indicação:</strong> {p.carpinteiro_nome || 'Direta'}</div>
                    <div className="print-client-row"><strong>Pagamento:</strong> {p.resumo_financeiro?.forma_pagamento || 'Pix'}</div>
                  </div>
                </div>

                <table className="print-table">
                  <thead>
                    <tr>
                      <th style={{ width: '25px' }} className="align-center">#</th>
                      <th style={{ width: '65px' }}>Cód.</th>
                      <th>Descrição do Produto e Bitola</th>
                      <th style={{ width: '45px' }} className="align-center">Qtd</th>
                      <th style={{ width: '70px' }} className="align-center">Largura</th>
                      <th style={{ width: '55px' }} className="align-center">Compr.</th>
                      <th style={{ width: '75px' }} className="align-right">Metragem</th>
                      <th style={{ width: '75px' }} className="align-right">Preço Unit.</th>
                      <th style={{ width: '85px' }} className="align-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.map((it, idx) => {
                      const itemSub = it.subtotal || 0;
                      const itemBruto = CalcEngine.calcularPrecoBruto(itemSub, pctBruto);
                      return (
                        <tr key={idx}>
                          <td className="align-center font-mono" style={{ fontSize: '9.5px' }}>{idx + 1}</td>
                          <td className="font-mono">{it.codigo}</td>
                          <td><strong>{it.descricao}</strong></td>
                          <td className="align-center font-mono">{it.quantidade}</td>
                          <td className="align-center font-mono">{it.largura_cm ? `${it.largura_cm} cm` : '-'}</td>
                          <td className="align-center font-mono">{it.comprimento_m > 0 ? `${it.comprimento_m}m` : '-'}</td>
                          <td className="align-right font-mono">
                            {CalcEngine.formatNumero(it.metragem_total, it.tipo_calculo === 'ML' ? 1 : 0)} {it.tipo_calculo === 'ML' ? 'ML' : it.tipo_calculo === 'M2' ? 'm²' : 'un'}
                          </td>
                          <td className="align-right font-mono">{CalcEngine.formatBRL(it.valor_unitario)}</td>
                          <td className="align-right font-mono" style={{ fontWeight: 700 }}>
                            {CalcEngine.formatBRL(itemSub)}
                            <div style={{ fontSize: '8px', color: '#475569', fontWeight: 500 }}>
                              Bruto: {CalcEngine.formatBRL(itemBruto)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="print-footer-container">
                  <div className="print-footer-left">
                    <div className="print-payment-badge">
                      <strong>Forma de Pagamento:</strong> {p.resumo_financeiro?.forma_pagamento || 'Pix'}
                    </div>

                    <div className="print-terms">
                      * Madeira serrada é produto natural sujeito a variações. Confira quantidades e medidas no ato da descarga. Reclamações após descarga não serão aceitas.
                    </div>

                    <div className="print-signatures-grid">
                      <div className="signature-line">
                        {p.vendedor?.nome || 'Vendedor'}<br />
                        <span>Atendimento de Balcão</span>
                      </div>
                      <div className="signature-line">
                        {p.cliente?.nome || 'Cliente'}<br />
                        <span>Assinatura do Recebedor</span>
                      </div>
                    </div>
                  </div>

                  <div className="print-footer-right">
                    <div className="print-financial-lines">
                      <div className="print-financial-line">
                        <span>Subtotal dos Produtos:</span>
                        <span className="font-mono">{CalcEngine.formatBRL(p.resumo_financeiro?.subtotal_itens_puros || 0)}</span>
                      </div>
                      {(p.resumo_financeiro?.taxa_aparelhamento > 0) && (
                        <div className="print-financial-line">
                          <span>Taxa Beneficiamento (Plaina):</span>
                          <span className="font-mono">{CalcEngine.formatBRL(p.resumo_financeiro.taxa_aparelhamento)}</span>
                        </div>
                      )}
                      {(p.resumo_financeiro?.valor_frete > 0) && (
                        <div className="print-financial-line">
                          <span>Frete ({p.resumo_financeiro?.bairro_frete || 'Entrega'}):</span>
                          <span className="font-mono">{CalcEngine.formatBRL(p.resumo_financeiro.valor_frete)}</span>
                        </div>
                      )}
                      {(p.resumo_financeiro?.desconto_valor > 0) && (
                        <div className="print-financial-line" style={{ color: '#047857' }}>
                          <span>(-) Desconto Comercial ({p.resumo_financeiro.desconto_percentual?.toFixed(1)}%):</span>
                          <span className="font-mono">-{CalcEngine.formatBRL(p.resumo_financeiro.desconto_valor)}</span>
                        </div>
                      )}

                      {/* DUAL PRICING NO RODAPÉ DA FOLHA */}
                      <div className="print-financial-line print-total-highlight">
                        <span>TOTAL À VISTA (PIX / DINH.):</span>
                        <span className="font-mono">{CalcEngine.formatBRL(totalAVista)}</span>
                      </div>
                      <div className="print-financial-line print-bruto-highlight">
                        <span>PREÇO BRUTO (A PRAZO +{pctBruto}%):</span>
                        <span className="font-mono">{CalcEngine.formatBRL(totalBruto)}</span>
                      </div>

                      {(p.finalizado_balcao || p.tipo_entrega === 'BALCAO_IMEDIATO') ? (
                        <div className="print-status-tag paid">
                          100% PAGO NO BALCÃO — MERCADORIA ENTREGUE
                        </div>
                      ) : saldoReceber > 0 ? (
                        <div className="print-balance-due-box">
                          <span>SALDO À VISTA A RECEBER:</span>
                          <span className="font-mono" style={{ fontSize: '11.5px' }}>{CalcEngine.formatBRL(saldoReceber)}</span>
                        </div>
                      ) : (
                        <div className="print-status-tag paid">
                          PEDIDO TOTALMENTE PAGO
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* VIA DO PÁTIO E SERRA (SEM PREÇOS) */
              <div className={`print-sheet patio-sheet ${densityClass}`}>
                <div className="print-sheet-header" style={{ borderBottom: '2px solid #000000' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                      ROMANEIO DE CORTE, PLAINA E CARREGAMENTO
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#334155' }}>
                      SERRARIA & PÁTIO DE EXPEDIÇÃO - {nomeEmpresa.toUpperCase()} (CAÇAPAVA - SP)
                    </div>
                  </div>
                  <div className="print-doc-meta">
                    <div style={{ fontSize: '15px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#14532D' }}>
                      PEDIDO #{p.numero}
                    </div>
                    <div style={{ fontSize: '9.5px' }}>Data: <strong>{dataCriacao}</strong></div>
                  </div>
                </div>

                {temSaldoCobrar ? (
                  <div className="patio-alert-cobrar">
                    ATENÇÃO MOTORISTA: COBRAR O VALOR DE {CalcEngine.formatBRL(saldoReceber)} NO ATO DO DESCARREGAMENTO (PIX OU DINHEIRO)
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#DCFCE7', border: '1.5px solid #15803D', color: '#15803D', fontSize: '10.5px', fontWeight: 800, padding: '3px 6px', textAlign: 'center', marginBottom: '6px', textTransform: 'uppercase' }}>
                    PEDIDO QUITADO - NÃO COBRAR NADA DO CLIENTE NA DESCARGA
                  </div>
                )}

                <div className="patio-info-banner">
                  <div>
                    <div><strong>CLIENTE:</strong> {p.cliente?.nome || 'Cliente'}</div>
                    <div><strong>LOCAL DA OBRA:</strong> {p.cliente?.endereco_obra || 'Retirada no Pátio'}</div>
                    <div><strong>CONTATO:</strong> {p.cliente?.telefone || 'N/A'} | <strong>VENDEDOR:</strong> {p.vendedor?.nome || 'Balcão'}</div>
                  </div>
                  <div>
                    <div><strong>DESTINO / BAIRRO:</strong></div>
                    <div style={{ fontSize: '13px', fontWeight: 900, color: '#14532D' }}>
                      {p.cliente?.bairro || p.resumo_financeiro?.bairro_frete || 'RETIRADA NO PÁTIO'}
                    </div>
                  </div>
                </div>

                {itensPlaina.length > 0 && (
                  <>
                    <div className="patio-section-title plaina">
                      <span>BLOCO A - PASSAR NA PLAINA / BENEFICIAR (APARELHAR)</span>
                      <span style={{ fontSize: '9px' }}>MANDAR P/ MAQUINÁRIO ANTES DE CARREGAR</span>
                    </div>
                    <table className="patio-table">
                      <thead>
                        <tr>
                          <th style={{ width: '120px', textAlign: 'center' }}>Conferência</th>
                          <th style={{ width: '65px' }}>Cód.</th>
                          <th>Descrição e Bitola</th>
                          <th style={{ width: '50px', textAlign: 'center' }}>Qtd</th>
                          <th style={{ width: '65px', textAlign: 'center' }}>Largura</th>
                          <th style={{ width: '60px', textAlign: 'center' }}>Compr.</th>
                          <th style={{ width: '80px', textAlign: 'right' }}>Total (ML/M²)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itensPlaina.map((it, idx) => (
                          <tr key={idx}>
                            <td style={{ textAlign: 'center' }}><span className="check-box"></span> OK</td>
                            <td className="font-mono">{it.codigo}</td>
                            <td><strong>{it.descricao}</strong></td>
                            <td style={{ textAlign: 'center', fontWeight: 800 }}>{it.quantidade}</td>
                            <td style={{ textAlign: 'center' }}>{it.largura_cm ? `${it.largura_cm}cm` : '-'}</td>
                            <td style={{ textAlign: 'center' }}>{it.comprimento_m > 0 ? `${it.comprimento_m}m` : '-'}</td>
                            <td style={{ textAlign: 'right' }}>{it.metragem_total} {it.tipo_calculo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                {itensBruta.length > 0 && (
                  <>
                    <div className="patio-section-title">
                      <span>BLOCO B - MADEIRA BRUTA E DEMAIS MATERIAIS</span>
                      <span style={{ fontSize: '9px' }}>SEPARAÇÃO DIRETA NO PÁTIO</span>
                    </div>
                    <table className="patio-table">
                      <thead>
                        <tr>
                          <th style={{ width: '120px', textAlign: 'center' }}>Conferência</th>
                          <th style={{ width: '65px' }}>Cód.</th>
                          <th>Descrição e Bitola</th>
                          <th style={{ width: '50px', textAlign: 'center' }}>Qtd</th>
                          <th style={{ width: '65px', textAlign: 'center' }}>Largura</th>
                          <th style={{ width: '60px', textAlign: 'center' }}>Compr.</th>
                          <th style={{ width: '80px', textAlign: 'right' }}>Total (ML/M²)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itensBruta.map((it, idx) => (
                          <tr key={idx}>
                            <td style={{ textAlign: 'center' }}><span className="check-box"></span> OK</td>
                            <td className="font-mono">{it.codigo}</td>
                            <td><strong>{it.descricao}</strong></td>
                            <td style={{ textAlign: 'center', fontWeight: 800 }}>{it.quantidade}</td>
                            <td style={{ textAlign: 'center' }}>{it.largura_cm ? `${it.largura_cm}cm` : '-'}</td>
                            <td style={{ textAlign: 'center' }}>{it.comprimento_m > 0 ? `${it.comprimento_m}m` : '-'}</td>
                            <td style={{ textAlign: 'right' }}>{it.metragem_total} {it.tipo_calculo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer no-print">
          <button className="btn btn-secondary" onClick={closePrintModal}>Fechar Prévia</button>
          <button className="btn btn-primary" onClick={executarImpressao}>Imprimir A5 Deitada (Ctrl+P)</button>
        </div>
      </div>
    </div>
  );
};
