import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DB, STORAGE_KEYS } from '../services/data.js';
import { CalcEngine } from '../services/calc.js';
import { ApiClient } from '../services/api.js';
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
  const [cloudSyncStatus, setCloudSyncStatus] = useState({ isConnected: false, lastSync: null });

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

  const [categorias, setCategorias] = useState(() => DB.getCategorias());

  const salvarCategoria = useCallback((nome) => {
    const updated = DB.salvarCategoria(nome);
    setCategorias([...updated]);
    showToast(`Categoria "${nome.trim()}" salva com sucesso!`, 'success');
    return updated;
  }, [showToast]);

  const excluirCategoria = useCallback((nome) => {
    const updated = DB.excluirCategoria(nome);
    setCategorias([...updated]);
    estoqueHook.setProducts(DB.getProdutos());
    showToast(`Categoria "${nome}" removida.`, 'info');
    return updated;
  }, [estoqueHook, showToast]);

  const renomearCategoria = useCallback((antigo, novo) => {
    const updated = DB.renomearCategoria(antigo, novo);
    setCategorias([...updated]);
    estoqueHook.setProducts(DB.getProdutos());
    showToast(`Categoria renomeada para "${novo}".`, 'success');
    return updated;
  }, [estoqueHook, showToast]);

  const aplicarReajustePrecos = useCallback(({ tipo, percentual, alvo }) => {
    const res = DB.aplicarReajustePrecos({ tipo, percentual, alvo });
    if (res.success) {
      estoqueHook.setProducts([...res.updated]);
      const sinal = res.tipo === 'ACRESCIMO' ? '+' : '-';
      showToast(`Reajuste de ${sinal}${res.percentual}% aplicado a ${res.count} produtos!`, 'success');
      return res;
    } else {
      showToast(res.message || 'Erro ao aplicar reajuste.', 'warning');
      return res;
    }
  }, [estoqueHook, showToast]);

  // Restaurar dados originais de demonstração
  const resetDemo = useCallback(() => {
    DB.resetDemo();
    ordersHook.setOrders(DB.getPedidos());
    estoqueHook.setProducts(DB.getProdutos());
    clientesHook.setClients(DB.getClientes());
    clientesHook.setCarpenters(DB.getCarpinteiros());
    setBairros(DB.getBairros());
    setEmployees(DB.getFuncionarios());
    setCategorias(DB.getCategorias());
    precoBrutoHook.setConfig(DB.getConfig());
    setUsers(DB.getUsuarios());
    showToast('Dados restaurados com sucesso!', 'success');
  }, [ordersHook, estoqueHook, clientesHook, precoBrutoHook, showToast]);

  // Zerar pedidos e clientes para testes reais mantendo produtos
  const zerarSistema = useCallback(() => {
    DB.zerarParaProducao();
    ordersHook.setOrders(DB.getPedidos());
    clientesHook.setClients(DB.getClientes());
    clientesHook.setCarpenters(DB.getCarpinteiros());
    setEmployees(DB.getFuncionarios());
    showToast('Sistema zerado para testes reais! Clientes e pedidos estão 0.', 'success');
  }, [ordersHook, clientesHook, showToast]);

  // Gestão de Funcionários / Equipe
  const [users, setUsers] = useState(() => DB.getUsuarios());

  const saveEmployee = useCallback((emp) => {
    const saved = DB.salvarFuncionario(emp);
    setEmployees(DB.getFuncionarios());
    showToast(`Funcionário "${saved.nome}" salvo com sucesso!`, 'success');
    return saved;
  }, [showToast]);

  const deleteEmployee = useCallback((id) => {
    DB.excluirFuncionario(id);
    setEmployees(DB.getFuncionarios());
    showToast('Funcionário removido da equipe.', 'info');
  }, [showToast]);

  // Gestão de Contas de Acesso (Usuários do Sistema)
  const saveUser = useCallback((usr) => {
    const saved = DB.salvarUsuario(usr);
    setUsers(DB.getUsuarios());
    ApiClient.saveUsuario(saved).catch(() => {});
    showToast(`Conta de acesso "${saved.username}" salva com sucesso!`, 'success');
    return saved;
  }, [showToast]);

  const deleteUser = useCallback((id) => {
    DB.excluirUsuario(id);
    setUsers(DB.getUsuarios());
    ApiClient.deleteUsuario(id).catch(() => {});
    showToast('Conta de acesso removida.', 'info');
  }, [showToast]);

  // Sincronização centralizada com o Neon PostgreSQL
  const syncWithCloud = useCallback(async (silent = false) => {
    try {
      // 1. Sincroniza Usuários / Contas
      const remoteUsers = await ApiClient.getUsuarios();
      if (Array.isArray(remoteUsers)) {
        if (remoteUsers.length > 0) {
          const merged = DB.mergeUsuarios(remoteUsers);
          setUsers([...merged]);
        } else {
          // Se o banco remoto estiver zerado, faz seed com as contas locais
          const localUsers = DB.getUsuarios();
          for (const u of localUsers) {
            await ApiClient.saveUsuario(u).catch(() => {});
          }
        }
      }

      // 2. Sincroniza Pedidos
      const remotePedidos = await ApiClient.getPedidos();
      if (Array.isArray(remotePedidos)) {
        if (remotePedidos.length > 0) {
          const merged = DB.mergePedidos(remotePedidos);
          ordersHook.setOrders([...merged]);
        } else {
          const localPedidos = DB.getPedidos();
          for (const p of localPedidos) {
            await ApiClient.savePedido(p).catch(() => {});
          }
        }
      }

      // 3. Sincroniza Clientes
      const remoteClientes = await ApiClient.getClientes();
      if (Array.isArray(remoteClientes)) {
        if (remoteClientes.length > 0) {
          const merged = DB.mergeClientes(remoteClientes);
          clientesHook.setClients([...merged]);
        } else {
          const localClientes = DB.getClientes();
          for (const c of localClientes) {
            await ApiClient.saveCliente(c).catch(() => {});
          }
        }
      }

      // 4. Sincroniza Produtos / Estoque
      const remoteProdutos = await ApiClient.getProdutos();
      if (Array.isArray(remoteProdutos)) {
        if (remoteProdutos.length > 0) {
          const merged = DB.mergeProdutos(remoteProdutos);
          estoqueHook.setProducts([...merged]);
        } else {
          const localProdutos = DB.getProdutos();
          for (const pr of localProdutos) {
            await ApiClient.saveProduto(pr).catch(() => {});
          }
        }
      }

      // 5. Diagnóstico de conectividade
      const syncCheck = await ApiClient.checkSync();
      if (syncCheck && syncCheck.connected) {
        setCloudSyncStatus({ isConnected: true, lastSync: new Date().toLocaleTimeString('pt-BR') });
        if (!silent) showToast('Sincronização com o Neon concluída!', 'success');
      } else {
        setCloudSyncStatus({ isConnected: false, lastSync: null });
      }
    } catch (err) {
      console.warn('[Sync] Falha na sincronização:', err);
      setCloudSyncStatus({ isConnected: false, lastSync: null });
    }
  }, [ordersHook, clientesHook, estoqueHook, showToast]);

  // Executa a sincronização inicial ao abrir o sistema
  useEffect(() => {
    syncWithCloud(true);
  }, [syncWithCloud]);

  const refreshAll = useCallback(() => {
    setEmployees(DB.getFuncionarios());
    clientesHook.setCarpenters(DB.getCarpinteiros());
    clientesHook.refreshClients();
    ordersHook.setOrders(DB.getPedidos());
    estoqueHook.setProducts(DB.getProdutos());
    setUsers(DB.getUsuarios());
  }, [clientesHook, ordersHook, estoqueHook]);

  // Sincronizar funcionários e carpinteiros (comissões) após salvar/cancelar pedidos
  const handleSaveOrderWrapper = useCallback((pedido) => {
    const saved = ordersHook.saveOrder(pedido);
    setEmployees(DB.getFuncionarios());
    clientesHook.setCarpenters(DB.getCarpinteiros());
    return saved;
  }, [ordersHook, clientesHook]);

  const handleCancelOrderWrapper = useCallback((pedidoId) => {
    ordersHook.cancelOrder(pedidoId);
    setEmployees(DB.getFuncionarios());
    clientesHook.setCarpenters(DB.getCarpinteiros());
  }, [ordersHook, clientesHook]);

  const value = {
    // Navegação
    activeTab,
    setActiveTab,

    // Pedidos (useOrders)
    orders: ordersHook.orders,
    setOrders: ordersHook.setOrders,
    saveOrder: handleSaveOrderWrapper,
    cancelOrder: handleCancelOrderWrapper,
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
    updateConfig: precoBrutoHook.updateConfig,
    percentualPrecoBruto: precoBrutoHook.percentual,
    updatePercentualPrecoBruto: precoBrutoHook.updateConfig,
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
    logout: authHook.logout,
    isDev: authHook.isDev,
    isAdmin: authHook.isAdmin,
    hasPermission: authHook.hasPermission,

    // Equipe & Contas de Acesso (Conta DEV oculta em modo invisível / easter egg)
    employees,
    setEmployees,
    saveEmployee,
    deleteEmployee,
    users: authHook.isDev ? users : users.filter(u => u.perfil !== 'DEV'),
    setUsers,
    saveUser,
    deleteUser,

    // Auxiliares
    bairros,
    categorias,
    setCategorias,
    salvarCategoria,
    excluirCategoria,
    renomearCategoria,
    aplicarReajustePrecos,
    toasts,
    showToast,
    printModal,
    openPrintModal,
    closePrintModal,
    togglePrintMode,
    refreshAll,
    resetDemo,
    zerarSistema,

    // Sincronização em Nuvem (Neon PostgreSQL)
    cloudSyncStatus,
    syncWithCloud
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
