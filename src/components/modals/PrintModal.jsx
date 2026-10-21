import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CalcEngine } from '../../services/calc.js';

export const PrintModal = () => {
  const { printModal, closePrintModal, togglePrintMode, config } = useApp();
  const printSheetRef = useRef(null);

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

  const executarImpressao = () => {
    const container = printSheetRef.current;
    if (!container) return;

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
        <title>${isCliente ? 'Comanda_Orcamento' : 'Romaneio_Patio'}_${p.numero}_A5</title>
        <link rel="stylesheet" href="/css/print.css">
        <style>
          @page { size: A5 landscape; margin: 4mm 6mm; }
          * { box-sizing: border-box; }
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
            height: 100% !important;
            max-height: 140mm !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
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
        console.warn('Fallback print:', err);
        window.print();
      }
    }, 250);
  };

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
