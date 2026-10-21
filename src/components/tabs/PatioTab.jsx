import React, { useMemo } from 'react';
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

  // Filtra pedidos relevantes para o pátio
  const patioOrders = useMemo(() => {
    return orders.filter(o => o.status === 'APROVADO' || o.etapa_patio === 'ENTREGUE');
  }, [orders]);

  const handleMoverEtapa = (pedidoId, proximaEtapa) => {
    const p = orders.find(item => item.id === pedidoId);
    if (!p) return;
    const atualizado = { ...p, etapa_patio: proximaEtapa };
    if (proximaEtapa === 'ENTREGUE') {
      atualizado.status = 'ENTREGUE';
      atualizado.data_entrega = new Date().toISOString();
      showToast(`Pedido #${p.numero} marcado como entregue!`, 'success');
    } else {
      showToast(`Pedido #${p.numero} movido para ${proximaEtapa}`, 'info');
    }
    saveOrder(atualizado);
  };

  const handleToggleChecklist = (pedidoId, itemId, field) => {
    const p = orders.find(item => item.id === pedidoId);
    if (!p) return;
    const checklist = (p.checklist_patio || []).map(chk => {
      if (chk.item_id === itemId) {
        return { ...chk, [field]: !chk[field] };
      }
      return chk;
    });
    saveOrder({ ...p, checklist_patio: checklist });
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

                        <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)', marginBottom: '3px' }}>
                          {p.cliente?.nome || 'Cliente Balcão'}
                        </div>

                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          📍 {p.cliente?.bairro || p.resumo_financeiro?.bairro_frete || 'Retirada no Pátio'}
                        </div>

                        {/* AVISOS DE COBRANÇA OU PLAINA */}
                        {temSaldo ? (
                          <div style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '11px', fontWeight: 700, padding: '3px 6px', borderRadius: '3px', marginBottom: '6px' }}>
                            ⚠️ Cobrar na entrega: {CalcEngine.formatBRL(saldo)}
                          </div>
                        ) : (
                          <div style={{ backgroundColor: '#ECFDF5', color: '#047857', fontSize: '10.5px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px', marginBottom: '6px' }}>
                            ✓ 100% Quitado
                          </div>
                        )}

                        {temPlaina && (
                          <div style={{ backgroundColor: '#EFF6FF', color: '#1E40AF', fontSize: '11px', fontWeight: 700, padding: '3px 6px', borderRadius: '3px', marginBottom: '8px' }}>
                            🪵 Requer Plaina / Beneficiamento
                          </div>
                        )}

                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', borderTop: '1px solid #F1F5F9', paddingTop: '6px', marginBottom: '8px' }}>
                          <strong>Carga:</strong> {p.resumo_fisico?.total_pecas || p.itens?.length || 0} pçs | {CalcEngine.formatKg(p.resumo_fisico?.peso_total_kg || 0)}
                          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            🚚 {p.resumo_fisico?.veiculo_sugerido?.split('-')[0] || 'Utilitário'}
                          </div>
                        </div>

                        {/* LISTA RÁPIDA DE CONFERÊNCIA */}
                        {p.checklist_patio && p.checklist_patio.length > 0 && (
                          <div style={{ fontSize: '11px', backgroundColor: 'var(--bg-hover)', padding: '6px 8px', borderRadius: '4px', marginBottom: '10px' }}>
                            <div style={{ fontWeight: 700, marginBottom: '4px', fontSize: '10.5px' }}>Conferência de Madeira:</div>
                            {p.checklist_patio.slice(0, 3).map((chk, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                <input 
                                  type="checkbox" 
                                  checked={Boolean(chk.cortado)} 
                                  onChange={() => handleToggleChecklist(p.id, chk.item_id, 'cortado')} 
                                />
                                <span style={{ textDecoration: chk.cortado ? 'line-through' : 'none', color: chk.cortado ? 'var(--text-muted)' : 'inherit', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {chk.descricao}
                                </span>
                              </div>
                            ))}
                            {p.checklist_patio.length > 3 && (
                              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                + {p.checklist_patio.length - 3} itens no romaneio completo
                              </div>
                            )}
                          </div>
                        )}

                        {/* AÇÕES DE TRANSIÇÃO DO KANBAN */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', paddingTop: '6px', borderTop: '1px solid var(--border-light)' }}>
                          <button 
                            type="button" 
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '10.5px', padding: '3px 6px' }}
                            onClick={() => openPrintModal(p, 'PATIO')}
                            title="Imprimir Romaneio de Pátio (Sem Preços)"
                          >
                            📋 Romaneio
                          </button>

                          <div style={{ display: 'flex', gap: '4px' }}>
                            {col.id === 'SEPARACAO' && (
                              <button 
                                type="button" 
                                className="btn btn-sm btn-primary" 
                                style={{ fontSize: '10.5px', padding: '3px 8px' }}
                                onClick={() => handleMoverEtapa(p.id, temPlaina ? 'CORTE_PLAINA' : 'CARREGAMENTO')}
                              >
                                {temPlaina ? 'Para Plaina ➔' : 'Para Carga ➔'}
                              </button>
                            )}
                            {col.id === 'CORTE_PLAINA' && (
                              <button 
                                type="button" 
                                className="btn btn-sm btn-primary" 
                                style={{ fontSize: '10.5px', padding: '3px 8px' }}
                                onClick={() => handleMoverEtapa(p.id, 'CARREGAMENTO')}
                              >
                                Pronto Carga ➔
                              </button>
                            )}
                            {col.id === 'CARREGAMENTO' && (
                              <button 
                                type="button" 
                                className="btn btn-sm" 
                                style={{ fontSize: '10.5px', padding: '3px 8px', backgroundColor: '#059669', color: '#FFFFFF', fontWeight: 700 }}
                                onClick={() => handleMoverEtapa(p.id, 'ENTREGUE')}
                              >
                                ✓ Entregar
                              </button>
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
    </div>
  );
};
