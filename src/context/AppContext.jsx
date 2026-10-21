import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DB, STORAGE_KEYS } from '../services/data.js';
import { CalcEngine } from '../services/calc.js';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('balcao');
  const [config, setConfig] = useState(() => DB.getConfig());
  const [products, setProducts] = useState(() => DB.getProdutos());
  const [orders, setOrders] = useState(() => DB.getPedidos());
  const [clients, setClients] = useState(() => DB.getClientes());
  const [carpenters, setCarpenters] = useState(() => DB.getCarpinteiros());
  const [employees, setEmployees] = useState(() => DB.getFuncionarios());
  const [bairros, setBairros] = useState(() => DB.getBairros());
  const [editingOrderId, setEditingOrderId] = useState(null);

  // Autenticação & Usuário Ativo
  const [currentUser, setCurrentUser] = useState(() => {
    const list = DB.getUsuarios();
    return list[0] || { id: 'u_1', nome: 'Carlos Eduardo', perfil: 'ADMIN', cargo: 'Gerente Geral' };
  });

  // Notificações Toast
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // Modal de Impressão Global (A5 Deitada)
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

  // Atualizações reativas de Estado & Banco de Dados
  const refreshAll = useCallback(() => {
    setConfig(DB.getConfig());
    setProducts(DB.getProdutos());
    setOrders(DB.getPedidos());
    setClients(DB.getClientes());
    setCarpenters(DB.getCarpinteiros());
    setEmployees(DB.getFuncionarios());
    setBairros(DB.getBairrosFrete());
  }, []);

  const saveOrder = useCallback((order) => {
    const saved = DB.salvarPedido(order);
    setOrders(DB.getPedidos());
    return saved;
  }, []);

  const updateConfig = useCallback((newConfig) => {
    DB.salvarConfig(newConfig);
    setConfig(DB.getConfig());
    showToast('Configurações atualizadas com sucesso!', 'success');
  }, [showToast]);

  const updateProduct = useCallback((product) => {
    const list = DB.getProdutos();
    const idx = list.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      list[idx] = product;
    } else {
      list.push(product);
    }
    DB.set(STORAGE_KEYS.PRODUTOS, list);
    setProducts([...list]);
    showToast(`Produto "${product.nome}" salvo!`, 'success');
  }, [showToast]);

  const adjustStock = useCallback((productId, novaQtd, motivo = 'Ajuste manual') => {
    const list = DB.getProdutos();
    const p = list.find(item => item.id === productId);
    if (p) {
      p.estoque_atual = Math.max(0, parseFloat(novaQtd) || 0);
      DB.set(STORAGE_KEYS.PRODUTOS, list);
      setProducts([...list]);
      showToast(`Estoque de "${p.nome}" atualizado para ${p.estoque_atual} un.`, 'info');
    }
  }, [showToast]);

  // Teclas de atalho globais (F2 = Balcão, etc.)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setActiveTab('balcao');
        showToast('Navegando para o Balcão [F2]', 'info');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showToast]);

  const value = {
    activeTab,
    setActiveTab,
    config,
    updateConfig,
    products,
    setProducts,
    updateProduct,
    adjustStock,
    orders,
    saveOrder,
    refreshAll,
    clients,
    carpenters,
    employees,
    bairros,
    currentUser,
    setCurrentUser,
    toasts,
    showToast,
    printModal,
    openPrintModal,
    closePrintModal,
    togglePrintMode,
    editingOrderId,
    setEditingOrderId
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
