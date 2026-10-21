import { useMemo, useCallback } from 'react';
import { DB } from '../services/data.js';

/**
 * Custom Hook: usePatio
 * Operação visual de pátio, maquinário de corte, esteira de plaina e romaneio de carga
 */
export function usePatio(orders, saveOrder, showToast) {
  // Pedidos ativos no pátio (aprovados ou prontos)
  const patioOrders = useMemo(() => {
    return orders.filter(o => o.status === 'APROVADO' || o.etapa_patio === 'ENTREGUE');
  }, [orders]);

  // Avançar ou mover etapa do Kanban
  const moveEtapa = useCallback((orderId, novaEtapa) => {
    const pedido = orders.find(o => o.id === orderId);
    if (!pedido) return;

    const updated = JSON.parse(JSON.stringify(pedido));
    updated.etapa_patio = novaEtapa;
    if (novaEtapa === 'ENTREGUE') {
      updated.status = 'ENTREGUE';
      if (updated.resumo_financeiro) {
        updated.resumo_financeiro.saldo_a_receber = 0;
      }
    }

    saveOrder(updated);
    if (showToast) showToast(`Carga #${updated.numero} movida para ${novaEtapa.replace('_', ' ')}!`, 'info');
  }, [orders, saveOrder, showToast]);

  // Atualizar checklist de conferência do carregamento
  const toggleChecklist = useCallback((orderId, itemId, field) => {
    const pedido = orders.find(o => o.id === orderId);
    if (!pedido || !pedido.checklist_patio) return;

    const updated = JSON.parse(JSON.stringify(pedido));
    const item = updated.checklist_patio.find(it => it.item_id === itemId);
    if (item) {
      item[field] = !item[field];
      saveOrder(updated);
    }
  }, [orders, saveOrder]);

  return {
    patioOrders,
    moveEtapa,
    toggleChecklist
  };
}
