import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DB, STORAGE_KEYS } from '../services/data.js';
import { CalcEngine } from '../services/calc.js';
import { useOrders } from '../hooks/useOrders.js';
import { useEstoque } from '../hooks/useEstoque.js';
import { usePrecoBruto } from '../hooks/usePrecoBruto.js';
import { useClientes } from '../hooks/useClientes.js';
import { useAuth } from '../hooks/useAuth.js';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('balcao');
  const [bairros, setBairros] = useState(() => DB.getBairros());
  const [employees, setEmployees] = useState(() => DB.getFuncionarios());

  // Notificações Toast do Sistema
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // Custom Hooks React Especializados
  const clientesHook = useClientes(showToast);
  const ordersHook = useOrders(showToast, clientesHook.refreshClients);
  const estoqueHook = useEstoque(showToast);
  const precoBrutoHook = usePrecoBruto(showToast);
  const authHook = useAuth(showToast);

  // Modal de Impressão Global A5 Deitada com Duplo Preço
  const [printModal, setPrintModal] = useState({
    isOpen: false,
    order: null,
    mode: 'CLIENTE' // 'CLIENTE' ou 'PATIO'
  });

  const openPrintModal = useCallback((order, mode = 'CLIENTE') => {
    setPrintModal({
      isOpen: true,
      order: order,
      mode: mode
    });
  }, []);

  const closePrintModal = useCallback(() => {
    setPrintModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const togglePrintMode = useCallback(() => {
    setPrintModal(prev => ({
      ...prev,
      mode: prev.mode === 'CLIENTE' ? 'PATIO' : 'CLIENTE'
    }));
  }, []);

  // Restaurar dados originais de demonstração
  const resetDemo = useCallback(() => {
    DB.resetDemo();
    ordersHook.setOrders(DB.getPedidos());
    estoqueHook.setProducts(DB.getProdutos());
    clientesHook.setClients(DB.getClientes());
    clientesHook.setCarpenters(DB.getCarpinteiros());
    setBairros(DB.getBairros());
    setEmployees(DB.getFuncionarios());
    precoBrutoHook.setConfig(DB.getConfig());
    showToast('Dados restaurados com sucesso!', 'success');
  }, [ordersHook, estoqueHook, clientesHook, precoBrutoHook, showToast]);

  const value = {
    // Navegação
    activeTab,
    setActiveTab,

    // Pedidos (useOrders)
    orders: ordersHook.orders,
    setOrders: ordersHook.setOrders,
    saveOrder: ordersHook.saveOrder,
    cancelOrder: ordersHook.cancelOrder,
    duplicateOrder: ordersHook.duplicateOrder,
    editingOrderId: ordersHook.editingOrderId,
    setEditingOrderId: ordersHook.setEditingOrderId,
    generateWhatsAppText: ordersHook.generateWhatsAppText,

    // Catálogo & Estoque (useEstoque)
    products: estoqueHook.products,
    setProducts: estoqueHook.setProducts,
    saveProduct: estoqueHook.saveProduct,
    updateProduct: estoqueHook.saveProduct,
    deleteProduct: estoqueHook.deleteProduct,
    adjustStock: estoqueHook.adjustStock,
    checkStockAvailability: estoqueHook.checkStockAvailability,
    stockMetrics: estoqueHook.metrics,

    // Preço Bruto & Parâmetros (usePrecoBruto)
    config: precoBrutoHook.config,
    updateConfig: precoBrutoHook.updatePercentual,
    percentualPrecoBruto: precoBrutoHook.percentual,
    updatePercentualPrecoBruto: precoBrutoHook.updatePercentual,
    calcularPrecoBruto: precoBrutoHook.calcularBruto,
    simularParcelamento: precoBrutoHook.simularParcelamento,

    // Clientes & Parceiros (useClientes)
    clients: clientesHook.clients,
    setClients: clientesHook.setClients,
    refreshClients: clientesHook.refreshClients,
    carpenters: clientesHook.carpenters,
    setCarpenters: clientesHook.setCarpenters,
    saveClient: clientesHook.saveClient,
    saveCarpenter: clientesHook.saveCarpenter,
    payCommission: clientesHook.payCommission,

    // Usuário & Sessão RBAC (useAuth)
    currentUser: authHook.currentUser,
    setCurrentUser: authHook.setCurrentUser,
    switchUser: authHook.switchUser,
    login: authHook.login,
    isAdmin: authHook.isAdmin,

    // Auxiliares
    bairros,
    employees,
    toasts,
    showToast,
    printModal,
    openPrintModal,
    closePrintModal,
    togglePrintMode,
    resetDemo
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
