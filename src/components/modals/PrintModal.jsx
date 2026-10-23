import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CalcEngine } from '../../services/calc.js';

// Função para gerar o CSS de impressão dependendo do formato selecionado
// Padrão: OFUKU_HAGAKI (200x148 mm) - Perfeito para papel A5 na impressora HP Deskjet 2540
const getPrintCSS = (formato) => {
  const isA4_2Vias = formato === 'A4_2VIAS';
  const isA4_Topo = formato === 'A4_TOPO';
  const isOfuku = formato === 'OFUKU_HAGAKI';

  let pageSize = '200mm 148mm';
  if (isA4_2Vias || isA4_Topo) {
    pageSize = 'A4 portrait';
  }

  const pageWidth = (isA4_2Vias || isA4_Topo) ? '210mm' : '200mm';
  const pageHeight = (isA4_2Vias || isA4_Topo) ? 'min-height: 297mm;' : 'height: 148mm !important; max-height: 148mm !important; overflow: hidden !important;';

  return `
  @page {
    size: ${pageSize};
    margin: 0;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #FFFFFF !important;
    color: #0F172A !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 9.5px;
    line-height: 1.25;
    width: ${pageWidth} !important;
    ${pageHeight}
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .print-page-wrapper {
    width: ${pageWidth} !important;
    box-sizing: border-box !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .print-sheet {
    background-color: #FFFFFF !important;
    color: #0F172A !important;
    padding: ${isA4_2Vias ? '4mm 7mm 3mm 7mm' : '3mm 6mm 4mm 6mm'} !important;
    border: none !important;
    box-shadow: none !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: ${isA4_2Vias ? '8.5px' : '9.5px'};
    line-height: 1.25;
    width: ${pageWidth} !important;
    max-width: ${pageWidth} !important;
    ${isOfuku ? 'max-height: 126mm !important; overflow: hidden !important;' : ''}
    margin: 0 !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
  .print-cut-divider {
    width: ${pageWidth} !important;
    box-sizing: border-box !important;
    padding: 3mm 7mm !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    position: relative !important;
  }
  .print-cut-divider .cut-line {
    flex: 1;
    border-bottom: 1.5px dashed #64748B !important;
  }
  .print-cut-divider .cut-badge {
    padding: 0 8px;
    font-size: 7.5px;
    font-weight: 700;
    color: #64748B !important;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .print-sheet.density-normal { font-size: ${isA4_2Vias ? '8.5px' : '9.5px'}; }
  .print-sheet.density-normal .print-table th, .print-sheet.density-normal .print-table td { padding: ${isA4_2Vias ? '2px 4px' : '2.5px 4px'}; }
  .print-sheet.density-compact { font-size: ${isA4_2Vias ? '8px' : '8.5px'}; }
  .print-sheet.density-compact .print-table th, .print-sheet.density-compact .print-table td { padding: 1.5px 3.5px; }
  .print-sheet.density-compact .print-sheet-header { margin-bottom: 3px; padding-bottom: 3px; }
  .print-sheet.density-compact .print-client-box { margin-bottom: 3px; padding: 2.5px 5px; }
  .print-sheet.density-compact .print-footer-container { margin-top: 3.5px; padding: 3px 5px; }
  .print-sheet.density-dense { font-size: 8px; }
  .print-sheet.density-dense .print-table th, .print-sheet.density-dense .print-table td { padding: 1px 3px; font-size: 8px; }
  .print-sheet.density-dense .print-sheet-header { margin-bottom: 2.5px; padding-bottom: 2.5px; }
  .print-sheet.density-dense .print-company-name { font-size: 11.5px; }
  .print-sheet.density-dense .print-client-box { margin-bottom: 2.5px; padding: 2px 5px; }
  .print-sheet.density-dense .print-footer-container { margin-top: 2.5px; padding: 2px 5px; }
  .print-sheet.density-dense .print-signatures-grid { margin-top: 3px; }

  .print-sheet-header {
    border-bottom: 2px solid #0F172A;
    padding-bottom: 3.5px;
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .print-company-name {
    font-size: 13.5px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: #14532D;
    line-height: 1.15;
  }
  .print-company-meta {
    font-size: 8.5px;
    color: #475569;
    line-height: 1.2;
    margin-top: 1.5px;
  }
  .print-doc-meta { text-align: right; }
  .print-doc-title {
    font-size: 11.5px;
    font-weight: 800;
    color: #0F172A;
    text-transform: uppercase;
  }
  .print-doc-number {
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 12.5px;
    font-weight: 800;
    color: #14532D;
  }
  .print-doc-date {
    font-size: 8.5px;
    color: #475569;
  }

  .print-client-box {
    border: 1px solid #94A3B8;
    padding: 3px 6px;
    margin-bottom: 4px;
    background-color: #F8FAFC !important;
    display: grid;
    grid-template-columns: 1.3fr 1.3fr 1fr;
    gap: 6px;
    font-size: 8.5px;
    line-height: 1.25;
  }
  .print-client-row {
    margin-bottom: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .print-client-row strong { color: #0F172A; }

  .print-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 4px;
    font-size: 9px;
  }
  .print-table th {
    background-color: #F1F5F9 !important;
    border-top: 1px solid #0F172A;
    border-bottom: 1.5px solid #0F172A;
    border-right: 1px solid #CBD5E1;
    padding: 2.5px 4px;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 8px;
    text-align: left;
  }
  .print-table th:last-child { border-right: none; }
  .print-table td {
    border-bottom: 1px solid #E2E8F0;
    border-right: 1px solid #F1F5F9;
    padding: 2px 4px;
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
    grid-template-columns: 1.2fr 1fr;
    gap: 8px;
    border: 1px solid #94A3B8;
    padding: 4px 6px;
    background-color: #F8FAFC !important;
    margin-top: 4px;
  }
  .print-footer-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .print-payment-badge {
    font-size: 8.5px;
    color: #0F172A;
    background-color: #E2E8F0 !important;
    padding: 1.5px 5px;
    border-radius: 3px;
    display: inline-block;
    margin-bottom: 2px;
  }
  .print-terms {
    font-size: 7px;
    color: #475569;
    line-height: 1.15;
    margin-bottom: 3px;
  }
  .print-signatures-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 3px;
  }
  .signature-line {
    border-top: 1px solid #0F172A;
    text-align: center;
    font-size: 7.5px;
    padding-top: 2px;
    color: #334155;
    line-height: 1.15;
  }
  .signature-line span {
    font-size: 6.5px;
    color: #64748B;
  }

  .print-footer-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-left: 1px solid #CBD5E1;
    padding-left: 8px;
  }
  .print-financial-lines {
    display: flex;
    flex-direction: column;
    gap: 1.5px;
    font-size: 8.5px;
  }
  .print-financial-line {
    display: flex;
    justify-content: space-between;
  }
  .print-total-highlight {
    font-size: 11px;
    font-weight: 800;
    color: #14532D;
    border-top: 1.5px solid #0F172A;
    padding-top: 2px;
    margin-top: 2px;
  }
  .print-debito-highlight {
    font-size: 9.5px;
    font-weight: 800;
    color: #92400E;
    background-color: #FEF3C7 !important;
    border: 1px solid #FCD34D;
    border-radius: 3px;
    padding: 2px 4px;
    margin-top: 2px;
  }
  .print-bruto-highlight {
    font-size: 10px;
    font-weight: 800;
    color: #1E40AF;
    background-color: #EFF6FF !important;
    border: 1px solid #93C5FD;
    border-radius: 3px;
    padding: 2px 4px;
    margin-top: 2px;
  }
  .print-status-tag {
    margin-top: 2px;
    padding: 2px 5px;
    border-radius: 3px;
    font-weight: 700;
    font-size: 7.5px;
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
    padding: 2.5px 5px;
    color: #B45309;
    font-weight: 700;
    font-size: 9px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2px;
  }

  /* Pátio */
  .patio-sheet { font-size: 9px; line-height: 1.25; }
  .patio-alert-cobrar {
    background-color: #FEE2E2 !important;
    border: 1.5px solid #B91C1C;
    color: #B91C1C;
    font-size: 9.5px;
    font-weight: 800;
    padding: 2px 5px;
    margin-bottom: 3px;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 0.4px;
  }
  .patio-info-banner {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 6px;
    background-color: #F1F5F9 !important;
    border: 1px solid #94A3B8;
    padding: 3px 6px;
    margin-bottom: 3.5px;
    font-size: 8.5px;
  }
  .patio-section-title {
    background-color: #0F172A !important;
    color: #FFFFFF !important;
    padding: 2.5px 6px;
    font-size: 8px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    margin-top: 3.5px;
    margin-bottom: 2px;
    display: flex;
    justify-content: space-between;
  }
  .patio-section-title.plaina { background-color: #14532D !important; }
  .patio-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.5px;
    margin-bottom: 3.5px;
  }
  .patio-table th {
    background-color: #E2E8F0 !important;
    border-top: 1px solid #0F172A;
    border-bottom: 1.5px solid #0F172A;
    border-right: 1px solid #CBD5E1;
    padding: 2px 4px;
    font-weight: 800;
    font-size: 7.5px;
    text-transform: uppercase;
  }
  .patio-table td {
    border-bottom: 1px solid #94A3B8;
    border-right: 1px solid #E2E8F0;
    padding: 2px 4px;
    font-weight: 600;
  }
  .patio-check-box {
    width: 11px;
    height: 11px;
    border: 1.5px solid #0F172A;
    display: inline-block;
    margin-right: 3px;
    vertical-align: middle;
  }
  .font-mono {
    font-family: 'JetBrains Mono', Consolas, monospace !important;
  }
`;
};

export const PrintModal = () => {
  const { printModal, closePrintModal, togglePrintMode, config } = useApp();
  const printSheetRef = useRef(null);

  // Formato do papel:
  // 'OFUKU_HAGAKI' = 200x148 mm (Padrão para A5 na HP Deskjet 2540 - Sem cortes de rodapé)
  // 'A4_2VIAS' = 2 Vias na Folha A4 com linha de corte
  // 'A4_TOPO' = 1 Via no Topo da Folha A4
  const [formatoPapel, setFormatoPapel] = useState('OFUKU_HAGAKI');

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
          <title>${formatoPapel === 'A4_2VIAS' ? 'Comanda_2Vias' : (isCliente ? 'Comanda_Cliente' : 'Romaneio_Patio')}_${p?.numero || ''}_${formatoPapel}</title>
          <style>
            ${getPrintCSS(formatoPapel)}
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
  }, [printModal.isOpen, printModal.order, printModal.mode, formatoPapel]);

  if (!printModal.isOpen || !printModal.order) return null;

  const p = printModal.order;
  const isCliente = printModal.mode === 'CLIENTE';
  const isOrcamento = p.status === 'ORCAMENTO';

  const dataCriacao = new Date(p.data_criacao || Date.now()).toLocaleDateString('pt-BR');
  const validadeAte = new Date(new Date(p.data_criacao || Date.now()).getTime() + (p.validade_dias || 7) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');

  const nomeEmpresa = config.nome_madeireira || 'Serraria e Madeireira Bom Jesus';
  const cnpjEmpresa = config.cnpj_madeireira || '16.482.988/0001-02';
  const endEmpresa = config.endereco_madeireira || 'Av. Adhemar Pinto de Siqueira, 1000 - Vila Galvão, Caçapava - SP';
  const telEmpresa = config.telefone_madeireira || '(12) 99603-3793';

  // Preço Bruto & Preço Débito
  const pctBruto = (p.resumo_financeiro?.percentual_bruto !== undefined && p.resumo_financeiro?.percentual_bruto !== null)
    ? parseFloat(p.resumo_financeiro.percentual_bruto)
    : CalcEngine.getPercentualPrecoBruto();
  const totalAVista = p.resumo_financeiro?.valor_total || 0;
  const totalBruto = p.resumo_financeiro?.valor_total_bruto || CalcEngine.calcularPrecoBruto(totalAVista, pctBruto);

  const pctDebito = (p.resumo_financeiro?.percentual_debito !== undefined && p.resumo_financeiro?.percentual_debito !== null)
    ? parseFloat(p.resumo_financeiro.percentual_debito)
    : CalcEngine.getPercentualTaxaDebito();
  const totalDebito = p.resumo_financeiro?.valor_total_debito || CalcEngine.calcularPrecoDebito(totalAVista, pctDebito);

  // Itens & densidade
  const itens = p.itens || [];
  const itemCount = itens.length;
  const densityClass = itemCount <= 4 ? 'density-normal' : (itemCount <= 8 ? 'density-compact' : 'density-dense');

  // Pátio
  const itensPlaina = itens.filter(i => i.aparelhar);
  const itensBruta = itens.filter(i => !i.aparelhar);

  // Renderizador da Via do Cliente
  const renderViaCliente = (isCompact = false, customTitle = null) => (
    <div className={`print-sheet ${densityClass}`} style={isCompact ? { padding: '4mm 7mm 3mm 7mm' } : {}}>
      <div className="print-sheet-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: isCompact ? '6px' : '8px' }}>
          <img 
            src="/logo.png" 
            alt="Logo Serraria Bom Jesus" 
            style={{ width: isCompact ? '32px' : '38px', height: isCompact ? '32px' : '38px', objectFit: 'contain', flexShrink: 0 }} 
          />
          <div>
            <div className="print-company-name">{nomeEmpresa}</div>
            <div className="print-company-meta">
              CNPJ: {cnpjEmpresa} | Telefone/WhatsApp: {telEmpresa}<br />
              {endEmpresa}
            </div>
          </div>
        </div>
        <div className="print-doc-meta">
          <div className="print-doc-title">
            {customTitle ? customTitle : (isOrcamento ? 'ORÇAMENTO' : (p.status === 'ENTREGUE' ? 'COMPROVANTE DE ENTREGA E QUITAÇÃO' : 'COMPROVANTE DE VENDA'))}
          </div>
          <div className="print-doc-number">
            {isOrcamento ? `ORÇAMENTO Nº #${p.numero}` : `PEDIDO Nº #${p.numero}`}
          </div>
          <div className="print-doc-date">
            Emissão: <strong>{dataCriacao}</strong> | Status: <strong>{isOrcamento ? `Válido até ${validadeAte}` : (p.status === 'ENTREGUE' ? 'ENTREGUE & QUITADO' : '100% PAGO')}</strong>
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
          <div className="print-client-row"><strong>Local:</strong> {p.cliente?.endereco_obra || 'Retirada no Pátio'}</div>
          <div className="print-client-row"><strong>Bairro:</strong> {p.cliente?.bairro || p.resumo_financeiro?.bairro_frete || '-'}</div>
          <div className="print-client-row"><strong>Cidade:</strong> {p.cliente?.cidade || 'Caçapava'}</div>
        </div>
        <div>
          <div className="print-client-row"><strong>Vendedor:</strong> {p.vendedor_nome || p.vendedor?.nome || 'Balcão'}</div>
          <div className="print-client-row"><strong>Indicação:</strong> {p.carpinteiro_nome || 'Direta'}</div>
          <div className="print-client-row"><strong>Pagamento:</strong> {p.resumo_financeiro?.forma_pagamento || p.forma_pagamento || 'Pix'}</div>
        </div>
      </div>

      <table className="print-table">
        <thead>
          <tr>
            <th style={{ width: '22px' }} className="align-center">#</th>
            <th style={{ width: '60px' }}>Cód.</th>
            <th>Descrição do Produto e Bitola</th>
            <th style={{ width: '40px' }} className="align-center">Qtd</th>
            <th style={{ width: '65px' }} className="align-center">Largura</th>
            <th style={{ width: '50px' }} className="align-center">Compr.</th>
            <th style={{ width: '70px' }} className="align-right">Metragem</th>
            <th style={{ width: '70px' }} className="align-right">Preço Unit.</th>
            <th style={{ width: '80px' }} className="align-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((it, idx) => {
            const itemSub = it.subtotal || 0;
            const itemBruto = CalcEngine.calcularPrecoBruto(itemSub, pctBruto);
            return (
              <tr key={idx}>
                <td className="align-center font-mono" style={{ fontSize: '8.5px' }}>{idx + 1}</td>
                <td className="font-mono">{it.codigo}</td>
                <td><strong>{it.descricao}</strong></td>
                <td className="align-center font-mono">{it.quantidade}</td>
                <td className="align-center font-mono">{(it.tipo_calculo === 'ML' && parseFloat(it.largura_cm) > 0) ? `${it.largura_cm} cm` : '-'}</td>
                <td className="align-center font-mono">{(it.tipo_calculo === 'ML' && parseFloat(it.comprimento_m) > 0) ? `${it.comprimento_m}m` : '-'}</td>
                <td className="align-right font-mono">
                  {CalcEngine.formatNumero(it.metragem_total, it.tipo_calculo === 'ML' ? 1 : 0)} {it.tipo_calculo === 'ML' ? 'ML' : it.tipo_calculo === 'M2' ? 'm²' : 'un'}
                </td>
                <td className="align-right font-mono">{CalcEngine.formatBRL(it.valor_unitario)}</td>
                <td className="align-right font-mono" style={{ fontWeight: 700 }}>
                  {CalcEngine.formatBRL(itemSub)}
                  <div style={{ fontSize: '7.5px', color: '#475569', fontWeight: 500 }}>
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
            {p.resumo_financeiro?.pagamentos_detalhe && p.resumo_financeiro.pagamentos_detalhe.length > 1 && (
              <div style={{ marginTop: '2px', fontSize: '8px', fontWeight: 600 }}>
                {p.resumo_financeiro.pagamentos_detalhe.map((pg, idx) => (
                  <span key={idx} style={{ display: 'inline-block', marginRight: '6px' }}>
                    • {pg.tipo}{pg.tipo === 'Cartão de Crédito' && pg.parcelas > 1 ? ` (${pg.parcelas}x)` : ''}: {CalcEngine.formatBRL(pg.valor)}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="print-terms">
            * Madeira serrada é produto natural sujeito a variações. Confira quantidades e medidas no ato da descarga. Reclamações após descarga não serão aceitas.
          </div>

          <div className="print-signatures-grid">
            <div className="signature-line">
              {p.vendedor_nome || p.vendedor?.nome || 'Vendedor de Balcão'}<br />
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
                <span>Acréscimo Plaina{p.resumo_financeiro?.plaina_pct ? ` (${p.resumo_financeiro.plaina_pct}%)` : ''}:</span>
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

            {/* PREÇOS (À VISTA, DÉBITO E BRUTO) */}
            <div className="print-financial-line print-total-highlight">
              <span>TOTAL À VISTA (PIX / DINH.):</span>
              <span className="font-mono">{CalcEngine.formatBRL(totalAVista)}</span>
            </div>
            <div className="print-financial-line print-debito-highlight">
              <span>NO DÉBITO / CARTÃO:</span>
              <span className="font-mono">{CalcEngine.formatBRL(totalDebito)}</span>
            </div>
            <div className="print-financial-line print-bruto-highlight">
              <span>PREÇO BRUTO (A PRAZO):</span>
              <span className="font-mono">{CalcEngine.formatBRL(totalBruto)}</span>
            </div>

            {isOrcamento ? (
              <div className="print-status-tag" style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#475569' }}>
                PROPOSTA COMERCIAL — VÁLIDA POR {p.validade_dias || 7} DIAS
              </div>
            ) : (
              <div className="print-status-tag paid">
                100% PAGO — VENDA QUITADA
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizador da Via do Pátio
  const renderViaPatio = (isCompact = false) => (
    <div className={`print-sheet patio-sheet ${densityClass}`} style={isCompact ? { padding: '4mm 7mm 3mm 7mm' } : {}}>
      <div className="print-sheet-header" style={{ borderBottom: '2px solid #000000' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isCompact ? '6px' : '8px' }}>
          <img 
            src="/logo.png" 
            alt="Logo Serraria Bom Jesus" 
            style={{ width: isCompact ? '30px' : '36px', height: isCompact ? '30px' : '36px', objectFit: 'contain', flexShrink: 0 }} 
          />
          <div>
            <div style={{ fontSize: isCompact ? '12px' : '13.5px', fontWeight: 900, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
              ROMANEIO DE CORTE, PLAINA E CARREGAMENTO
            </div>
            <div style={{ fontSize: isCompact ? '8.5px' : '9.5px', fontWeight: 700, color: '#334155' }}>
              SERRARIA & PÁTIO DE EXPEDIÇÃO - {nomeEmpresa.toUpperCase()} (CAÇAPAVA - SP)
            </div>
          </div>
        </div>
        <div className="print-doc-meta">
          <div style={{ fontSize: isCompact ? '12px' : '14px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#14532D' }}>
            {isOrcamento ? `ORÇAMENTO #${p.numero}` : `PEDIDO #${p.numero}`}
          </div>
          <div style={{ fontSize: isCompact ? '8px' : '9px' }}>Data: <strong>{dataCriacao}</strong></div>
        </div>
      </div>

      <div style={{ backgroundColor: '#DCFCE7', border: '1.5px solid #15803D', color: '#15803D', fontSize: isCompact ? '9px' : '10px', fontWeight: 800, padding: isCompact ? '2px 4px' : '3px 6px', textAlign: 'center', marginBottom: isCompact ? '3px' : '4px', textTransform: 'uppercase' }}>
        {isOrcamento ? 'ORÇAMENTO PRELIMINAR — CONFERÊNCIA DE MEDIDAS E QUANTIDADES' : 'PEDIDO 100% PAGO — CARGA LIBERADA PARA CORTE E ENTREGA'}
      </div>

      <div className="patio-info-banner">
        <div>
          <div><strong>CLIENTE:</strong> {p.cliente?.nome || 'Cliente'}</div>
          <div><strong>LOCAL DA OBRA:</strong> {p.cliente?.endereco_obra || 'Retirada no Pátio'}</div>
          <div><strong>CONTATO:</strong> {p.cliente?.telefone || 'N/A'} | <strong>VENDEDOR:</strong> {p.vendedor_nome || p.vendedor?.nome || 'Balcão'}</div>
        </div>
        <div>
          <div><strong>DESTINO / BAIRRO:</strong></div>
          <div style={{ fontSize: isCompact ? '11px' : '12.5px', fontWeight: 900, color: '#14532D' }}>
            {p.cliente?.bairro || p.resumo_financeiro?.bairro_frete || 'RETIRADA NO PÁTIO'}
          </div>
        </div>
      </div>

      {itensPlaina.length > 0 && (
        <>
          <div className="patio-section-title plaina">
            <span>BLOCO A - PASSAR NA PLAINA / BENEFICIAR (APARELHAR)</span>
            <span style={{ fontSize: '8px' }}>MANDAR P/ MAQUINÁRIO ANTES DE CARREGAR</span>
          </div>
          <table className="patio-table">
            <thead>
              <tr>
                <th style={{ width: '85px', textAlign: 'center' }}>Conferência</th>
                <th style={{ width: '60px' }}>Cód.</th>
                <th>Descrição e Bitola</th>
                <th style={{ width: '40px', textAlign: 'center' }}>Qtd</th>
                <th style={{ width: '60px', textAlign: 'center' }}>Largura</th>
                <th style={{ width: '55px', textAlign: 'center' }}>Compr.</th>
                <th style={{ width: '70px', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {itensPlaina.map((it, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'center' }}><span className="patio-check-box"></span> OK</td>
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
            <span style={{ fontSize: '8px' }}>SEPARAÇÃO DIRETA NO PÁTIO</span>
          </div>
          <table className="patio-table">
            <thead>
              <tr>
                <th style={{ width: '85px', textAlign: 'center' }}>Conferência</th>
                <th style={{ width: '60px' }}>Cód.</th>
                <th>Descrição e Bitola</th>
                <th style={{ width: '40px', textAlign: 'center' }}>Qtd</th>
                <th style={{ width: '60px', textAlign: 'center' }}>Largura</th>
                <th style={{ width: '55px', textAlign: 'center' }}>Compr.</th>
                <th style={{ width: '70px', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {itensBruta.map((it, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'center' }}><span className="patio-check-box"></span> OK</td>
                  <td className="font-mono">{it.codigo}</td>
                  <td><strong>{it.descricao}</strong></td>
                  <td style={{ textAlign: 'center', fontWeight: 800 }}>{it.quantidade}</td>
                  <td style={{ textAlign: 'center' }}>{(it.tipo_calculo === 'ML' && parseFloat(it.largura_cm) > 0) ? `${it.largura_cm}cm` : '-'}</td>
                  <td style={{ textAlign: 'center' }}>{(it.tipo_calculo === 'ML' && parseFloat(it.comprimento_m) > 0) ? `${it.comprimento_m}m` : '-'}</td>
                  <td style={{ textAlign: 'right' }}>{it.metragem_total} {it.tipo_calculo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );

  return (
    <div className="modal-overlay active" style={{ display: 'flex' }}>
      <div className="modal-container modal-xl" style={{ maxWidth: '960px' }}>
        <div className="modal-header no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span className="modal-title" style={{ fontSize: '15px' }}>
              Prévia de Impressão • {formatoPapel === 'A4_2VIAS' ? '2 Vias na Folha A4' : (isCliente ? 'Via do Cliente (Com Preços)' : 'Via do Pátio (Sem Preços)')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Seletor de Formato de Papel */}
            <div style={{ display: 'inline-flex', backgroundColor: '#E2E8F0', padding: '2px', borderRadius: '6px' }}>
              <button 
                type="button" 
                className={`btn btn-sm ${formatoPapel === 'OFUKU_HAGAKI' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ height: '30px', fontSize: '11px', padding: '0 10px', fontWeight: formatoPapel === 'OFUKU_HAGAKI' ? 700 : 500 }}
                onClick={() => setFormatoPapel('OFUKU_HAGAKI')}
                title="Padrão Ofuku hagaki (200x148 mm): Cabe tanto no papel A5 quanto no Ofuku hagaki da HP Deskjet"
              >
                📄 A5 / Hagaki (200x148mm)
              </button>
              <button 
                type="button" 
                className={`btn btn-sm ${formatoPapel === 'A4_2VIAS' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ height: '30px', fontSize: '11px', padding: '0 10px' }}
                onClick={() => setFormatoPapel('A4_2VIAS')}
                title="Imprime 2 vias na mesma folha A4 com linha de corte no meio"
              >
                📑 2 Vias no A4
              </button>
              <button 
                type="button" 
                className={`btn btn-sm ${formatoPapel === 'A4_TOPO' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ height: '30px', fontSize: '11px', padding: '0 10px' }}
                onClick={() => setFormatoPapel('A4_TOPO')}
                title="Imprime 1 via no topo de uma folha A4 comum"
              >
                📄 1 Via no A4
              </button>
            </div>

            {formatoPapel !== 'A4_2VIAS' && (
              <button className="btn btn-sm btn-secondary" onClick={togglePrintMode} style={{ height: '30px', fontSize: '11px' }}>
                {isCliente ? 'Alternar: Via do Pátio' : 'Alternar: Via do Cliente'}
              </button>
            )}

            <button className="btn btn-sm btn-primary" onClick={executarImpressao} style={{ height: '30px', fontSize: '11px', fontWeight: 700 }}>
              Imprimir (Ctrl+P)
            </button>
            <button className="modal-close" onClick={closePrintModal}>&times;</button>
          </div>
        </div>

        {/* Dica para Impressoras Deskjet e A5/Ofuku Hagaki */}
        <div className="no-print" style={{
          backgroundColor: '#F0FDF4',
          borderBottom: '1px solid #BBF7D0',
          padding: '8px 16px',
          fontSize: '11.5px',
          color: '#166534',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>🖨️</span>
          <div>
            <strong>Formato Ofuku Hagaki (200x148 mm) Ativado:</strong> Já configurado na medida exata para encaixar perfeitamente no <strong>papel A5</strong> e no <strong>Ofuku hagaki</strong> da impressora HP Deskjet 2540, com altura segura de 125 mm para nunca cortar a assinatura. Lembre-se de manter marcada a opção <strong>"Gráficos de segundo plano"</strong> no navegador!
          </div>
        </div>

        <div className="modal-body" style={{ backgroundColor: '#CBD5E1', padding: '16px', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
          <div ref={printSheetRef} style={{ width: '100%', maxWidth: formatoPapel === 'OFUKU_HAGAKI' ? '780px' : '860px', background: '#FFFFFF', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', borderRadius: '4px' }}>
            {formatoPapel === 'A4_2VIAS' ? (
              <div>
                {renderViaCliente(true)}
                <div className="print-cut-divider" style={{
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#F8FAFC'
                }}>
                  <div className="cut-line" style={{ flex: 1, borderBottom: '1.5px dashed #94A3B8' }}></div>
                  <span className="cut-badge" style={{ padding: '0 10px', fontSize: '9px', fontWeight: 700, color: '#64748B' }}>
                    ✂ DESTAQUE / CORTE AQUI ({isOrcamento ? 'VIA DO CLIENTE ACIMA • VIA DA LOJA ABAIXO' : 'VIA DO CLIENTE ACIMA • VIA DO PÁTIO ABAIXO'}) ✂
                  </span>
                  <div className="cut-line" style={{ flex: 1, borderBottom: '1.5px dashed #94A3B8' }}></div>
                </div>
                {isOrcamento 
                  ? renderViaCliente(true, 'ORÇAMENTO (VIA DA LOJA / ARQUIVO)')
                  : renderViaPatio(true)
                }
              </div>
            ) : (
              isCliente ? renderViaCliente(false) : renderViaPatio(false)
            )}
          </div>
        </div>

        <div className="modal-footer no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            {formatoPapel === 'OFUKU_HAGAKI' && 'Formato selecionado: Ofuku hagaki (200x148 mm) • Compatível 100% com papel A5 na HP Deskjet.'}
            {formatoPapel === 'A4_2VIAS' && 'Formato selecionado: 2 Vias na Folha A4 • Economia máxima de papel.'}
            {formatoPapel === 'A4_TOPO' && 'Formato selecionado: 1 Via no topo da Folha A4 comum.'}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={closePrintModal}>Fechar Prévia</button>
            <button className="btn btn-primary" onClick={executarImpressao}>Imprimir (Ctrl+P)</button>
          </div>
        </div>
      </div>
    </div>
  );
};
