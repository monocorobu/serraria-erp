import { useState, useCallback } from 'react';
import { DB } from '../services/data.js';
import { ApiClient } from '../services/api.js';

/**
 * Custom Hook: useClientes
 * Gerenciamento de CRM de clientes, carpinteiros parceiros, contas correntes e comissões
 */
export function useClientes(showToast) {
  const [clients, setClients] = useState(() => DB.getClientes());
  const [carpenters, setCarpenters] = useState(() => DB.getCarpinteiros());

  // Atualizar lista reativa de clientes diretamente do banco local
  const refreshClients = useCallback(() => {
    setClients(DB.getClientes());
  }, []);

  // Salvar ou auto-cadastrar cliente com persistência local e nuvem
  const saveClient = useCallback((clienteData) => {
    const saved = DB.salvarCliente(clienteData);
    setClients(DB.getClientes());
    if (saved && saved.id) {
      ApiClient.saveCliente(saved).catch(() => {});
    }
    return saved;
  }, []);

  // Salvar carpinteiro parceiro
  const saveCarpenter = useCallback((carpinteiroData) => {
    const list = DB.getCarpinteiros();
    const idx = list.findIndex(c => c.id === carpinteiroData.id);
    let saved;
    if (idx >= 0) {
      list[idx] = carpinteiroData;
      saved = carpinteiroData;
    } else {
      saved = {
        id: 'carp_' + Date.now(),
        ...carpinteiroData,
        comissao_acumulada: 0,
        comissao_paga: 0,
        saldo_a_pagar: 0,
        pedidos_vinculados: 0
      };
      list.push(saved);
    }
    DB.set(DB.STORAGE_KEYS?.CARPINTEIROS || 'serraria_carpinteiros_v1', list);
    setCarpenters(list);
    if (showToast) showToast('Carpinteiro parceiro salvo com sucesso!', 'success');
    return saved;
  }, [showToast]);

  // Pagamento de comissão (vendedor ou carpinteiro)
  const payCommission = useCallback((beneficiarioTipo, beneficiarioId, valor, formaPagamento = 'Pix', obs = '') => {
    const pag = DB.registrarPagamentoComissao({
      beneficiario_tipo: beneficiarioTipo,
      beneficiario_id: beneficiarioId,
      valor: parseFloat(valor) || 0,
      forma_pagamento: formaPagamento,
      observacoes: obs
    });

    setCarpenters(DB.getCarpinteiros());
    if (showToast) showToast(`Pagamento de ${pag.valor ? 'R$ ' + pag.valor.toFixed(2) : ''} registrado!`, 'success');
    return pag;
  }, [showToast]);

  return {
    clients,
    setClients,
    refreshClients,
    carpenters,
    setCarpenters,
    saveClient,
    saveCarpenter,
    payCommission
  };
}
