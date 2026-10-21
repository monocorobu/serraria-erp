import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CalcEngine } from '../../services/calc.js';

const COLUNAS = [
  { id: 'SEPARACAO', title: '1. Separação no Pátio', badgeClass: 'badge-orcamento' },
  { id: 'CORTE_PLAINA', title: '2. Serra & Plaina', badgeClass: 'badge-aprovado' },
  { id: 'CARREGAMENTO', title: '3. Pronto / Carregando', badgeClass: 'badge-bruta' },
  { id: 'ENTREGUE', title: '4. Concluído & Entregue', badgeClass: 'badge-entregue' }
];

export const PatioTab = () => {
  const { orders, saveOrder, openPrintModal, showToast } = useApp();
  const [selectedRomaneioOrder, setSelectedRomaneioOrder] = useState(null);

  // Filtra pedidos relevantes para o pátio
  const patioOrders = useMemo(() => {
    return orders.filter(o => o.status === 'APROVADO' || o.etapa_patio === 'ENTREGUE');
  }, [orders]);

  const getEtapaNome = (etapa) => {
    switch (etapa) {
      case 'SEPARACAO': return 'Separação';
      case 'CORTE_PLAINA': return 'Serra & Plaina';
      case 'CARREGAMENTO': return 'Pronto / Carregamento';
      case 'ENTREGUE': return 'Concluído & Entregue';
      default: return etapa || 'Pátio';
    }
  };

  const getEtapaAnterior = (p) => {
    const etapa = p.etapa_patio || 'SEPARACAO';
    const temPlaina = p.itens?.some(i => i.aparelhar);
    switch (etapa) {
      case 'ENTREGUE':
        return 'CARREGAMENTO';
      case 'CARREGAMENTO':
        return temPlaina ? 'CORTE_PLAINA' : 'SEPARACAO';
      case 'CORTE_PLAINA':
        return 'SEPARACAO';
      default:
        return null;
    }
  };

  const getProximaEtapa = (p) => {
    const etapa = p.etapa_patio || 'SEPARACAO';
    const temPlaina = p.itens?.some(i => i.aparelhar);
    switch (etapa) {
      case 'SEPARACAO':
        return temPlaina ? 'CORTE_PLAINA' : 'CARREGAMENTO';
      case 'CORTE_PLAINA':
        return 'CARREGAMENTO';
      case 'CARREGAMENTO':
        return 'ENTREGUE';
      default:
        return null;
    }
  };

  const handleMoverEtapa = (pedidoId, novaEtapa) => {
    const p = orders.find(item => item.id === pedidoId);
    if (!p) return;
    const atualizado = JSON.parse(JSON.stringify(p));
    atualizado.etapa_patio = novaEtapa;

    if (novaEtapa === 'ENTREGUE') {
      atualizado.status = 'ENTREGUE';
      atualizado.data_entrega = new Date().toISOString();
      showToast(`Pedido #${p.numero} marcado como entregue!`, 'success');
    } else {
      // Se estava ENTREGUE e voltou para CARREGAMENTO ou etapa anterior, reabre como APROVADO
      if (p.status === 'ENTREGUE' || p.etapa_patio === 'ENTREGUE') {
        atualizado.status = 'APROVADO';
        delete atualizado.data_entrega;
      }
      showToast(`Pedido #${p.numero} movido para ${getEtapaNome(novaEtapa)}`, 'info');
    }
    saveOrder(atualizado);

    if (selectedRomaneioOrder && selectedRomaneioOrder.id === pedidoId) {
      setSelectedRomaneioOrder(atualizado);
    }
  };

  const handleAbrirRomaneio = (p) => {
    const orderWithChecklist = JSON.parse(JSON.stringify(p));
    if (!orderWithChecklist.checklist_patio || !orderWithChecklist.checklist_patio.length) {
      orderWithChecklist.checklist_patio = (orderWithChecklist.itens || []).map(item => {
        const dimStr = item.largura_cm ? `${item.largura_cm}cm x ${item.comprimento_m || 0}m` : (item.comprimento_m ? `${item.comprimento_m}m` : '');
        return {
          item_id: item.id,
          descricao: `${item.quantidade}x ${item.descricao} ${dimStr ? '(' + dimStr + ')' : ''}`.trim(),
          cortado: false,
          carregado: false,
          requer_plaina: Boolean(item.aparelhar)
        };
      });
      saveOrder(orderWithChecklist);
    }
    setSelectedRomaneioOrder(orderWithChecklist);
  };

  const handleToggleChecklist = (pedidoId, itemId, field) => {
    const p = orders.find(item => item.id === pedidoId);
    if (!p) return;
    const atualizado = JSON.parse(JSON.stringify(p));
    const checklist = (atualizado.checklist_patio || []).map(chk => {
      if (chk.item_id === itemId) {
        return { ...chk, [field]: !chk[field] };
      }
      return chk;
    });
    atualizado.checklist_patio = checklist;
    saveOrder(atualizado);

    if (selectedRomaneioOrder && selectedRomaneioOrder.id === pedidoId) {
      setSelectedRomaneioOrder(atualizado);
    }
  };

  return (
    <div className="patio-layout">
      {/* KANBAN OPERACIONAL DO PÁTIO */}
      <div className="kanban-board" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', alignItems: 'start' }}>
        {COLUNAS.map(col => {
          const pedidosNaColuna = patioOrders.filter(p => (p.etapa_patio || 'SEPARACAO') === col.id);

          return (
            <div key={col.id} className="kanban-column" style={{ backgroundColor: 'var(--bg-secondary)', border: '1.5px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {col.title}
                </span>
                <span className="badge-tag font-mono" style={{ fontSize: '11px', fontWeight: 700 }}>
                  {pedidosNaColuna.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pedidosNaColuna.length === 0 ? (
                  <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
                    Nenhum pedido nesta etapa
                  </div>
                ) : (
                  pedidosNaColuna.map(p => {
                    const dataFmt = new Date(p.data_criacao || Date.now()).toLocaleDateString('pt-BR');
                    const saldo = p.resumo_financeiro?.saldo_a_receber || 0;
                    const temSaldo = saldo > 0;
                    const temPlaina = p.itens?.some(i => i.aparelhar);
                    const etapaAnterior = getEtapaAnterior(p);
                    const proximaEtapa = getProximaEtapa(p);

                    return (
                      <div 
                        key={p.id} 
                        className="kanban-card" 
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1.5px solid var(--border-medium)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '12px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span className="font-mono" style={{ fontWeight: 800, color: 'var(--primary-green)', fontSize: '13px' }}>
                            #{p.numero}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{dataFmt}</span>
                        </div>

                        <div 
                          style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)', marginBottom: '3px', cursor: 'pointer' }}
                          onClick={() => handleAbrirRomaneio(p)}
                          title="Clique para abrir conferência de romaneio completa"
                        >
                          {p.cliente?.nome || 'Cliente Balcão'}
                        </div>

                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" fill="none" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          <span>{p.cliente?.bairro || p.resumo_financeiro?.bairro_frete || 'Retirada no Pátio'}</span>
                        </div>

                        {/* AVISOS DE COBRANÇA OU PLAINA */}
                        {temSaldo ? (
                          <div style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '11px', fontWeight: 700, padding: '3px 6px', borderRadius: '3px', marginBottom: '6px' }}>
                            Cobrar na entrega: {CalcEngine.formatBRL(saldo)}
                          </div>
                        ) : (
                          <div style={{ backgroundColor: '#ECFDF5', color: '#047857', fontSize: '10.5px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px', marginBottom: '6px' }}>
                            100% Quitado
                          </div>
                        )}

                        {temPlaina && (
                          <div style={{ backgroundColor: '#EFF6FF', color: '#1E40AF', fontSize: '11px', fontWeight: 700, padding: '3px 6px', borderRadius: '3px', marginBottom: '8px' }}>
                            Requer Plaina / Beneficiamento
                          </div>
                        )}

                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', borderTop: '1px solid #F1F5F9', paddingTop: '6px', marginBottom: '8px' }}>
                          <strong>Carga:</strong> {p.resumo_fisico?.total_pecas || p.itens?.length || 0} pçs | {CalcEngine.formatKg(p.resumo_fisico?.peso_total_kg || 0)}
                          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" fill="none" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                            <span>{p.resumo_fisico?.veiculo_sugerido?.split('-')[0] || 'Utilitário'}</span>
                          </div>
                        </div>

                        {/* LISTA RÁPIDA DE CONFERÊNCIA */}
                        {p.checklist_patio && p.checklist_patio.length > 0 && (
                          <div style={{ fontSize: '11px', backgroundColor: 'var(--bg-hover)', padding: '6px 8px', borderRadius: '4px', marginBottom: '10px' }}>
                            <div style={{ fontWeight: 700, marginBottom: '4px', fontSize: '10.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>Conferência de Madeira:</span>
                              <span 
                                style={{ color: 'var(--brand-primary)', cursor: 'pointer', fontSize: '10px' }}
                                onClick={() => handleAbrirRomaneio(p)}
                              >
                                Ver todos
                              </span>
                            </div>
                            {p.checklist_patio.slice(0, 3).map((chk, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                <input 
                                  type="checkbox" 
                                  checked={Boolean(chk.cortado || chk.carregado)} 
                                  onChange={() => handleToggleChecklist(p.id, chk.item_id, 'cortado')} 
                                />
                                <span style={{ textDecoration: (chk.cortado || chk.carregado) ? 'line-through' : 'none', color: (chk.cortado || chk.carregado) ? 'var(--text-muted)' : 'inherit', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {chk.descricao}
                                </span>
                              </div>
                            ))}
                            {p.checklist_patio.length > 3 && (
                              <div 
                                style={{ fontSize: '10.5px', color: 'var(--brand-primary)', marginTop: '4px', cursor: 'pointer', fontWeight: 600 }}
                                onClick={() => handleAbrirRomaneio(p)}
                              >
                                + {p.checklist_patio.length - 3} itens no romaneio completo
                              </div>
                            )}
                          </div>
                        )}

                        {/* AÇÕES DE TRANSIÇÃO DO KANBAN */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', paddingTop: '8px', borderTop: '1px solid var(--border-light)' }}>
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            {/* BOTÃO VOLTAR UMA ETAPA NO CARD */}
                            {etapaAnterior && (
                              <button 
                                type="button" 
                                className="btn btn-sm btn-secondary" 
                                style={{ fontSize: '10.5px', padding: '3px 7px', color: 'var(--text-secondary)' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoverEtapa(p.id, etapaAnterior);
                                }}
                                title={`Voltar para etapa: ${getEtapaNome(etapaAnterior)}`}
                              >
                                ← Voltar
                              </button>
                            )}

                            <button 
                              type="button" 
                              className="btn btn-sm btn-secondary" 
                              style={{ fontSize: '10.5px', padding: '3px 7px' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAbrirRomaneio(p);
                              }}
                              title="Conferir romaneio e checklist detalhado"
                            >
                              Romaneio
                            </button>
                          </div>

                          <div style={{ display: 'flex', gap: '4px' }}>
                            {proximaEtapa === 'ENTREGUE' ? (
                              <button 
                                type="button" 
                                className="btn btn-sm" 
                                style={{ fontSize: '10.5px', padding: '3px 8px', backgroundColor: '#059669', color: '#FFFFFF', fontWeight: 700 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoverEtapa(p.id, 'ENTREGUE');
                                }}
                              >
                                Concluir Entrega
                              </button>
                            ) : proximaEtapa ? (
                              <button 
                                type="button" 
                                className="btn btn-sm btn-primary" 
                                style={{ fontSize: '10.5px', padding: '3px 8px' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoverEtapa(p.id, proximaEtapa);
                                }}
                              >
                                {proximaEtapa === 'CORTE_PLAINA' ? 'Para Plaina →' : 'Pronto Carga →'}
                              </button>
                            ) : (
                              <span className="badge-tag badge-entregue font-mono" style={{ fontSize: '10px', padding: '2px 6px' }}>
                                Entregue ✓
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DETALHADO: ROMANEIO & CHECKLIST DE PÁTIO */}
      {selectedRomaneioOrder && (
        <div className="modal-overlay active" style={{ display: 'flex', zIndex: 1100 }}>
          <div className="modal-container modal-lg" style={{ maxWidth: '780px', width: '92%' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  Romaneio & Checklist de Carga #{selectedRomaneioOrder.numero}
                </span>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Cliente: <strong>{selectedRomaneioOrder.cliente?.nome || 'Cliente Balcão'}</strong> • Etapa atual: <span className="badge-tag font-mono" style={{ fontSize: '10.5px' }}>{getEtapaNome(selectedRomaneioOrder.etapa_patio || 'SEPARACAO')}</span>
                </div>
              </div>
              <button 
                type="button" 
                className="modal-close" 
                onClick={() => setSelectedRomaneioOrder(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto', padding: '16px' }}>
              {/* Alerta de cobrança na entrega */}
              {((selectedRomaneioOrder.resumo_financeiro?.saldo_a_receber || 0) > 0) ? (
                <div style={{ backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '14px', fontSize: '12.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>Atenção Motorista: Cobrar {CalcEngine.formatBRL(selectedRomaneioOrder.resumo_financeiro.saldo_a_receber)} no ato do descarregamento!</span>
                </div>
              ) : (
                <div style={{ backgroundColor: '#ECFDF5', color: '#047857', border: '1px solid #6EE7B7', padding: '8px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '14px', fontSize: '12px', fontWeight: 600 }}>
                  Pedido 100% quitado e liberado para entrega.
                </div>
              )}

              {/* Dados da Carga e Destino */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', backgroundColor: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '14px', fontSize: '11.5px' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Destino / Bairro:</div>
                  <div style={{ fontWeight: 700 }}>{selectedRomaneioOrder.cliente?.bairro || selectedRomaneioOrder.resumo_financeiro?.bairro_frete || 'Retirada no Pátio'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Endereço:</div>
                  <div style={{ fontWeight: 700 }}>{selectedRomaneioOrder.cliente?.endereco_obra || 'Balcão da Madeireira'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Carga Física:</div>
                  <div style={{ fontWeight: 700 }} className="font-mono">
                    {selectedRomaneioOrder.resumo_fisico?.total_pecas || selectedRomaneioOrder.itens?.length || 0} pçs | {CalcEngine.formatKg(selectedRomaneioOrder.resumo_fisico?.peso_total_kg || 0)}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Veículo Sugerido:</div>
                  <div style={{ fontWeight: 700 }}>{selectedRomaneioOrder.resumo_fisico?.veiculo_sugerido?.split('-')[0] || 'Utilitário'}</div>
                </div>
              </div>

              {/* Tabela / Checklist de Madeiras */}
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Itens do Romaneio para Separação e Carregamento:
              </div>

              <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                {(selectedRomaneioOrder.checklist_patio || []).map((chk, idx) => (
                  <div 
                    key={chk.item_id || idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      backgroundColor: chk.carregado ? '#F0FDF4' : (idx % 2 === 0 ? '#FFFFFF' : 'var(--bg-secondary)'),
                      borderBottom: idx < (selectedRomaneioOrder.checklist_patio.length - 1) ? '1px solid var(--border-light)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input 
                        type="checkbox"
                        checked={Boolean(chk.carregado || chk.cortado)}
                        onChange={() => handleToggleChecklist(selectedRomaneioOrder.id, chk.item_id, 'carregado')}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ 
                          fontSize: '12.5px', 
                          fontWeight: 600, 
                          color: (chk.carregado || chk.cortado) ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: (chk.carregado || chk.cortado) ? 'line-through' : 'none'
                        }}>
                          {chk.descricao}
                        </div>
                        {chk.requer_plaina && (
                          <span className="badge-tag badge-aparelhada" style={{ fontSize: '10px', marginTop: '2px', display: 'inline-block' }}>
                            Passar na Plaina / Aparelhar
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ fontSize: '11px', textAlign: 'right' }}>
                      {(chk.carregado || chk.cortado) ? (
                        <span style={{ color: '#047857', fontWeight: 700 }}>Conferido e Embarcado ✓</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Pendente</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', padding: '12px 16px', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {/* BOTÃO VOLTAR UMA ETAPA DENTRO DO MODAL DE ROMANEIO */}
                {getEtapaAnterior(selectedRomaneioOrder) && (
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      const ant = getEtapaAnterior(selectedRomaneioOrder);
                      handleMoverEtapa(selectedRomaneioOrder.id, ant);
                    }}
                    title={`Voltar pedido para ${getEtapaNome(getEtapaAnterior(selectedRomaneioOrder))}`}
                  >
                    ← Voltar para {getEtapaNome(getEtapaAnterior(selectedRomaneioOrder))}
                  </button>
                )}

                {/* BOTÃO AVANÇAR ETAPA DENTRO DO MODAL DE ROMANEIO */}
                {getProximaEtapa(selectedRomaneioOrder) && (
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    style={getProximaEtapa(selectedRomaneioOrder) === 'ENTREGUE' ? { backgroundColor: '#059669', borderColor: '#059669' } : {}}
                    onClick={() => {
                      const prox = getProximaEtapa(selectedRomaneioOrder);
                      handleMoverEtapa(selectedRomaneioOrder.id, prox);
                    }}
                  >
                    {getProximaEtapa(selectedRomaneioOrder) === 'ENTREGUE' 
                      ? 'Concluir Entrega ✓' 
                      : `Avançar para ${getEtapaNome(getProximaEtapa(selectedRomaneioOrder))} →`}
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => openPrintModal(selectedRomaneioOrder, 'PATIO')}
                  title="Imprimir Romaneio de Pátio Formato A5"
                >
                  Imprimir Romaneio A5
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setSelectedRomaneioOrder(null)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
