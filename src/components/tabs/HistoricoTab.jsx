import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CalcEngine } from '../../services/calc.js';
import { DB } from '../../services/data.js';

export const HistoricoTab = () => {
  const { orders, setActiveTab, setEditingOrderId, openPrintModal, showToast, saveOrder, config, products } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Modal Duplicar Pedido
  const [duplicarState, setDuplicarState] = useState({
    isOpen: false,
    order: null,
    novaEspecie: 'MANTER'
  });

  const filteredOrders = useMemo(() => {
    return orders.filter(p => {
      if (statusFilter === 'ORCAMENTO' && p.status !== 'ORCAMENTO') return false;
      if (statusFilter === 'PAGO' && (p.status !== 'PAGO' && p.status !== 'APROVADO' && p.status !== 'ENTREGUE')) return false;
      if (statusFilter === 'ENTREGUE' && p.status !== 'ENTREGUE') return false;
      if (searchTerm.trim()) {
        const t = searchTerm.toLowerCase();
        const num = String(p.numero || '').toLowerCase();
        const cli = (p.cliente?.nome || '').toLowerCase();
        const tel = (p.cliente?.telefone || '').toLowerCase();
        const end = (p.cliente?.endereco_obra || '').toLowerCase();
        const vend = (p.vendedor_nome || p.vendedor?.nome || '').toLowerCase();
        if (!num.includes(t) && !cli.includes(t) && !tel.includes(t) && !end.includes(t) && !vend.includes(t)) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => new Date(b.data_criacao || 0) - new Date(a.data_criacao || 0));
  }, [orders, statusFilter, searchTerm]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const handleEditar = (pedidoId) => {
    setEditingOrderId(pedidoId);
    setActiveTab('balcao');
  };

  const handleWhatsApp = (p) => {
    let rawTel = p.cliente?.telefone ? p.cliente.telefone.replace(/\D/g, '') : '';
    let phoneParam = '';
    if (rawTel.length >= 10) {
      phoneParam = rawTel.startsWith('55') && rawTel.length >= 12 ? rawTel : '55' + rawTel;
    }

    const nome = p.cliente?.nome || 'Cliente';
    const num = p.numero;
    const total = CalcEngine.formatBRL(p.resumo_financeiro?.valor_total || 0);
    const pctBruto = p.resumo_financeiro?.percentual_bruto !== undefined ? p.resumo_financeiro.percentual_bruto : CalcEngine.getPercentualPrecoBruto();
    const totalBruto = CalcEngine.formatBRL(p.resumo_financeiro?.valor_total_bruto || CalcEngine.calcularPrecoBruto(p.resumo_financeiro?.valor_total || 0, pctBruto));
    const pctDebito = p.resumo_financeiro?.percentual_debito !== undefined ? p.resumo_financeiro.percentual_debito : CalcEngine.getPercentualTaxaDebito();
    const totalDebito = CalcEngine.formatBRL(p.resumo_financeiro?.valor_total_debito || CalcEngine.calcularPrecoDebito(p.resumo_financeiro?.valor_total || 0, pctDebito));

    const nomeEmpresa = config.nome_madeireira || 'Serraria e Madeireira Bom Jesus';

    let texto = `Olá *${nome}*, tudo bem?\n`;
    texto += `Aqui é da *${nomeEmpresa}* (Caçapava - SP).\n\n`;
    texto += `Gostaria de saber se você conseguiu analisar a nossa proposta do *Orçamento #${num}*:\n`;
    texto += `• *À Vista (Pix/Dinheiro):* ${total}\n`;
    texto += `• *No Débito / Cartão:* ${totalDebito}\n`;
    texto += `• *Preço Bruto (A Prazo / Parcelado):* ${totalBruto}\n\n`;
    texto += `Temos os lotes de madeira selecionados no pátio prontos para corte e carregamento. Consegue nos dar um retorno para programarmos esta semana? Obrigado!`;

    const url = `https://api.whatsapp.com/send?phone=${phoneParam}&text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
    showToast(`Abrindo WhatsApp para ${nome}...`, 'info');
  };

  const handleConfirmarDuplicar = () => {
    if (!duplicarState.order) return;
    const original = duplicarState.order;
    const novo = JSON.parse(JSON.stringify(original));

    novo.id = 'PED-' + DB.getNextNumeroPedido();
    novo.numero = DB.getNextNumeroPedido();
    novo.data_criacao = new Date().toISOString();
    novo.status = 'ORCAMENTO';
    novo.etapa_patio = 'NAO_ENVIADO';

    if (duplicarState.novaEspecie !== 'MANTER') {
      novo.itens.forEach(it => {
        if (it.tipo_calculo === 'ML') {
          const match = products.find(prod => prod.especie === duplicarState.novaEspecie && prod.tipo_calculo === 'ML');
          if (match) {
            it.produto_id = match.id;
            it.codigo = match.codigo;
            it.descricao = match.nome;
            it.valor_unitario = match.preco_unitario;
            const calc = CalcEngine.calcularItem(it, match);
            Object.assign(it, calc);
          }
        }
      });

      const t = CalcEngine.calcularTotaisOrcamento(
        novo.itens,
        novo.resumo_financeiro?.valor_frete || 0,
        novo.resumo_financeiro?.desconto_valor || 0,
        novo.resumo_financeiro?.desconto_tipo || 'VALOR',
        0,
        novo.resumo_financeiro?.plaina_pct || 0,
        novo.resumo_financeiro?.plaina_base || 'ITENS_PLAINA'
      );
      novo.resumo_financeiro.subtotal_itens_puros = t.subtotal_itens_puros;
      novo.resumo_financeiro.subtotal_itens_plaina = t.subtotal_itens_plaina;
      novo.resumo_financeiro.taxa_aparelhamento = t.taxa_aparelhamento;
      novo.resumo_financeiro.plaina_pct = t.plaina_percentual;
      novo.resumo_financeiro.subtotal_com_plaina = t.subtotal_com_plaina;
      novo.resumo_financeiro.valor_total = t.valor_total;
      novo.resumo_financeiro.percentual_bruto = t.percentual_bruto;
      novo.resumo_financeiro.valor_total_bruto = t.valor_total_bruto;
      novo.resumo_financeiro.percentual_debito = t.percentual_debito;
      novo.resumo_financeiro.valor_total_debito = t.valor_total_debito;
      novo.resumo_financeiro.saldo_a_receber = 0;
      novo.resumo_financeiro.valor_sinal = 0;
    }

    saveOrder(novo);
    setDuplicarState({ isOpen: false, order: null, novaEspecie: 'MANTER' });
    showToast(`Orçamento duplicado com sucesso (#${novo.numero})!`, 'success');
  };

  return (
    <div className="historico-layout">
      {/* BARRA DE FILTROS DO HISTÓRICO */}
      <div className="panel" style={{ marginBottom: '14px' }}>
        <div className="panel-body" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, minWidth: '260px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Buscar por Nº, Cliente, Vendedor, Endereço ou Telefone..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Status:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['TODOS', 'PAGO', 'ORCAMENTO', 'ENTREGUE'].map(st => (
                  <button
                    key={st}
                    type="button"
                    className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '11px', padding: '3px 8px' }}
                    onClick={() => {
                      setStatusFilter(st);
                      setCurrentPage(1);
                    }}
                  >
                    {st === 'TODOS' ? 'Todos' : st === 'PAGO' ? 'Vendas Pagas' : st === 'ORCAMENTO' ? 'Orçamentos' : 'Entregues'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABELA DE PEDIDOS */}
      <div className="panel">
        <div className="table-responsive">
          <table className="dense-table">
            <thead>
              <tr>
                <th style={{ width: '85px' }}># Pedido</th>
                <th style={{ width: '90px' }}>Data</th>
                <th>Cliente & Destino</th>
                <th style={{ width: '90px' }} className="align-center">Status</th>
                <th style={{ width: '100px' }} className="align-center">Pátio</th>
                <th style={{ width: '90px' }} className="align-center">Carga</th>
                <th style={{ width: '125px' }} className="align-right">Valor Total</th>
                <th style={{ width: '120px' }} className="align-center">Pagamento</th>
                <th style={{ width: '190px' }} className="align-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    Nenhum pedido ou orçamento encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map(p => {
                  const dataFmt = new Date(p.data_criacao || Date.now()).toLocaleDateString('pt-BR');
                  const total = p.resumo_financeiro?.valor_total || 0;
                  const pctBruto = p.resumo_financeiro?.percentual_bruto !== undefined ? p.resumo_financeiro.percentual_bruto : CalcEngine.getPercentualPrecoBruto();
                  const totalBruto = p.resumo_financeiro?.valor_total_bruto || CalcEngine.calcularPrecoBruto(total, pctBruto);
                  const pctDebito = p.resumo_financeiro?.percentual_debito !== undefined ? p.resumo_financeiro.percentual_debito : CalcEngine.getPercentualTaxaDebito();
                  const totalDebito = p.resumo_financeiro?.valor_total_debito || CalcEngine.calcularPrecoDebito(total, pctDebito);
                  const isOrcamento = p.status === 'ORCAMENTO';

                  return (
                    <tr key={p.id}>
                      <td className="font-mono" style={{ fontWeight: 700, color: 'var(--primary-green)' }}>
                        #{p.numero}
                      </td>
                      <td className="font-mono" style={{ fontSize: '11px' }}>{dataFmt}</td>
                      <td>
                        <strong>{p.cliente?.nome || 'Cliente Balcão'}</strong>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                          {p.cliente?.bairro ? `${p.cliente.bairro}` : ''}
                          <span style={{ color: '#047857', fontWeight: 600 }}> • Vend: {p.vendedor_nome || p.vendedor?.nome || 'Balcão'}</span>
                          {p.carpinteiro_nome ? ` • Ind: ${p.carpinteiro_nome}` : ''}
                        </div>
                      </td>
                      <td className="align-center">
                        <span className={`badge-tag ${p.status === 'ENTREGUE' ? 'badge-entregue' : (isOrcamento ? 'badge-orcamento' : 'badge-aprovado')}`}>
                          {isOrcamento ? 'ORÇAMENTO' : (p.status === 'ENTREGUE' ? 'ENTREGUE' : 'PAGO')}
                        </span>
                      </td>
                      <td className="align-center">
                        <span className="badge-tag" style={{ fontSize: '10px' }}>
                          {p.etapa_patio || 'NÃO ENVIADO'}
                        </span>
                      </td>
                      <td className="align-center font-mono" style={{ fontSize: '11px' }}>
                        {p.resumo_fisico?.total_pecas || p.itens?.length || 0} pçs
                      </td>
                      <td className="align-right font-mono" style={{ fontWeight: 700 }}>
                        <div>{CalcEngine.formatBRL(total)}</div>
                        <div style={{ fontSize: '10px', fontWeight: 'normal', color: '#B45309' }} title="No Débito / Cartão">
                          Déb: {CalcEngine.formatBRL(totalDebito)}
                        </div>
                        <div style={{ fontSize: '10px', fontWeight: 'normal', color: '#2563EB' }} title="Preço Bruto / A Prazo">
                          Bruto: {CalcEngine.formatBRL(totalBruto)}
                        </div>
                      </td>
                      <td className="align-center">
                        {isOrcamento ? (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Orçamento</span>
                        ) : (
                          <span style={{ color: '#047857', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 7px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            100% Pago ({p.forma_pagamento || p.resumo_financeiro?.forma_pagamento || 'Pix'})
                          </span>
                        )}
                      </td>
                      <td className="align-center" style={{ whiteSpace: 'nowrap' }}>
                        <button 
                          className="btn btn-sm btn-primary" 
                          style={{ padding: '2px 7px', fontSize: '11px', marginRight: '4px' }}
                          onClick={() => handleEditar(p.id)}
                          title="Abrir no Balcão para Edição"
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary" 
                          style={{ padding: '2px 7px', fontSize: '11px', marginRight: '4px' }}
                          onClick={() => openPrintModal(p, 'CLIENTE')}
                          title="Imprimir Via do Cliente ou Pátio"
                        >
                          Imprimir
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary" 
                          style={{ padding: '2px 7px', fontSize: '11px', marginRight: '4px' }}
                          onClick={() => handleWhatsApp(p)}
                          title="Enviar Proposta pelo WhatsApp"
                        >
                          WhatsApp
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary" 
                          style={{ padding: '2px 7px', fontSize: '11px' }}
                          onClick={() => setDuplicarState({ isOpen: true, order: p, novaEspecie: 'MANTER' })}
                          title="Duplicar Orçamento / Comparar Madeiras"
                        >
                          Duplicar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Mostrando página {currentPage} de {totalPages} ({filteredOrders.length} pedidos)
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                className="btn btn-sm btn-secondary" 
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                Anterior
              </button>
              <button 
                className="btn btn-sm btn-secondary" 
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DUPLICAR PEDIDO */}
      {duplicarState.isOpen && (
        <div className="modal-overlay active" style={{ display: 'flex' }}>
          <div className="modal-container" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <span className="modal-title">Duplicar Orçamento #{duplicarState.order?.numero}</span>
              <button className="modal-close" onClick={() => setDuplicarState({ isOpen: false, order: null, novaEspecie: 'MANTER' })}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                Você pode clonar este orçamento para o mesmo cliente ou alterar a espécie de madeira para comparar preços (ex: Garapeira vs Peroba Rosa vs Cupiúba).
              </p>
              <div className="form-group">
                <label className="form-label">Substituir Espécie de Madeira:</label>
                <select 
                  className="form-select"
                  value={duplicarState.novaEspecie}
                  onChange={e => setDuplicarState(prev => ({ ...prev, novaEspecie: e.target.value }))}
                >
                  <option value="MANTER">Manter as Mesmas Madeiras do Pedido Original</option>
                  <option value="Garapeira">Trocar todas as vigas por Garapeira</option>
                  <option value="Peroba Rosa">Trocar todas as vigas por Peroba Rosa</option>
                  <option value="Cupiúba">Trocar todas as vigas por Cupiúba</option>
                  <option value="Cambará">Trocar todas as vigas por Cambará</option>
                  <option value="Pinus Tratado">Trocar todas as vigas por Pinus Tratado</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDuplicarState({ isOpen: false, order: null, novaEspecie: 'MANTER' })}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleConfirmarDuplicar}>
                Confirmar e Duplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
