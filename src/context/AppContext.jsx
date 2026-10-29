import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
      ApiClient.saveProduto(res.updated).catch(err => {
        console.warn('[aplicarReajustePrecos] Falha ao sincronizar reajuste no banco:', err);
      });
      const sinal = res.tipo === 'ACRESCIMO' ? '+' : '-';
      showToast(`Reajuste de ${sinal}${res.percentual}% aplicado e salvo no banco!`, 'success');
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
    ApiClient.saveFuncionario(saved).catch(err => {
      console.warn('[saveEmployee] Erro ao sincronizar funcionário no banco:', err);
    });
    showToast(`Funcionário "${saved.nome}" salvo com sucesso!`, 'success');
    return saved;
  }, [showToast]);

  const deleteEmployee = useCallback(async (id) => {
    DB.excluirFuncionario(id);
    setEmployees(DB.getFuncionarios());
    try {
      await ApiClient.deleteFuncionario(id);
    } catch (err) {
      console.warn('[deleteEmployee] Erro ao excluir funcionário no banco:', err);
    }
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

  const deleteUser = useCallback(async (id) => {
    DB.excluirUsuario(id);
    setUsers(DB.getUsuarios());
    try {
      await ApiClient.deleteUsuario(id);
    } catch (err) {
      console.warn('[deleteUser] Erro ao sincronizar exclusão com a nuvem:', err);
    }
  }, []);

  const { setOrders } = ordersHook;
  const { setClients } = clientesHook;
  const { setProducts } = estoqueHook;

  const lastSyncedVersionsRef = useRef({});

  // Sincronização centralizada inteligente e ultra-leve (Smart Differential Sync)
  // Faz 1 única chamada rápida de diagnóstico (/api/sync) e puxa apenas tabelas com versões alteradas
  // Consome menos de 5% da cota gratuita diária do Vercel e Supabase
  const syncWithCloud = useCallback(async (silent = false, forceFull = false) => {
    try {
      // 1. Diagnóstico e versões em UMA única chamada rápida
      const syncCheck = await ApiClient.checkSync();
      if (!syncCheck || !syncCheck.connected) {
        setCloudSyncStatus({ isConnected: false, provider: syncCheck?.provider || null, lastSync: null });
        return;
      }

      setCloudSyncStatus({ 
        isConnected: true, 
        provider: syncCheck.provider || 'PostgreSQL', 
        lastSync: new Date().toLocaleTimeString('pt-BR') 
      });

      const versions = syncCheck.versions || {};
      const last = lastSyncedVersionsRef.current;

      const needsUsers = forceFull || !last.usuarios || last.usuarios !== versions.usuarios;
      const needsFuncs = forceFull || !last.funcionarios || last.funcionarios !== versions.funcionarios;
      const needsConfig = forceFull || !last.config || last.config !== versions.config;
      const needsProds = forceFull || !last.produtos || last.produtos !== versions.produtos;
      const needsOrders = forceFull || !last.pedidos || last.pedidos !== versions.pedidos;
      const needsClients = forceFull || !last.clientes || last.clientes !== versions.clientes;

      // 2. Sincroniza Usuários / Contas apenas se houve alteração
      if (needsUsers) {
        const remoteUsers = await ApiClient.getUsuarios();
        if (Array.isArray(remoteUsers)) {
          const excluidos = DB.getUsuariosExcluidos();
          for (const delId of excluidos) {
            if (remoteUsers.some(r => r.id === delId || r.username === delId)) {
              await ApiClient.deleteUsuario(delId).catch(() => {});
            }
          }

          const merged = DB.mergeUsuarios(remoteUsers);
          setUsers([...merged]);

          if (remoteUsers.length === 0 && merged.length > 0) {
            const toUpload = merged.filter(l => l && l.username !== 'thales');
            if (toUpload.length > 0) {
              await ApiClient.saveUsuario(toUpload).catch(() => {});
            }
          }
          last.usuarios = versions.usuarios;
        }
      }

      // 3. Sincroniza Equipe / Vendedores apenas se houve alteração
      if (needsFuncs) {
        const remoteFuncionarios = await ApiClient.getFuncionarios();
        if (Array.isArray(remoteFuncionarios)) {
          if (remoteFuncionarios.length === 0) {
            const localFuncs = DB.getFuncionarios();
            if (localFuncs.length > 0) {
              await ApiClient.saveFuncionario(localFuncs).catch(() => {});
            }
          } else {
            const merged = DB.mergeFuncionarios(remoteFuncionarios);
            setEmployees([...merged]);
          }
          last.funcionarios = versions.funcionarios;
        }
      }

      // 4. Sincroniza Parâmetros Gerais e Porcentagens apenas se houve alteração
      if (needsConfig) {
        const remoteConfig = await ApiClient.getConfig();
        if (remoteConfig && typeof remoteConfig === 'object') {
          const currentLocal = DB.getConfig();
          const mergedCfg = { ...currentLocal, ...remoteConfig };
          DB.salvarConfig(mergedCfg);
          precoBrutoHook.setConfig(mergedCfg);
          last.config = versions.config;
        }
      }

      // 5. Sincroniza Produtos / Estoque / Tabela de Preços apenas se houve alteração
      if (needsProds) {
        const remoteProdutos = await ApiClient.getProdutos();
        if (Array.isArray(remoteProdutos)) {
          const merged = DB.mergeProdutos(remoteProdutos);
          setProducts([...merged]);

          if (remoteProdutos.length < 50 && merged.length > remoteProdutos.length) {
            const missingProdutos = merged.filter(lp => 
              lp && lp.id && !remoteProdutos.some(rp => rp.id === lp.id)
            );
            if (missingProdutos.length > 0) {
              await ApiClient.saveProduto(missingProdutos).catch(() => {});
            }
          }
          last.produtos = versions.produtos;
        }
      }

      // 6. Sincroniza Histórico de Pedidos e Vendas apenas se houve alteração
      if (needsOrders) {
        const remotePedidos = await ApiClient.getPedidos();
        if (Array.isArray(remotePedidos)) {
          const merged = DB.mergePedidos(remotePedidos);
          setOrders([...merged]);

          const missingPedidos = merged.filter(lp => 
            lp && lp.id && !remotePedidos.some(rp => rp.id === lp.id)
          );
          if (missingPedidos.length > 0) {
            await ApiClient.savePedido(missingPedidos).catch(() => {});
          }
          last.pedidos = versions.pedidos;
        }
      }

      // 7. Sincroniza Clientes apenas se houve alteração
      if (needsClients) {
        const remoteClientes = await ApiClient.getClientes();
        if (Array.isArray(remoteClientes)) {
          const merged = DB.mergeClientes(remoteClientes);
          setClients([...merged]);

          const missingClientes = merged.filter(lc => 
            lc && lc.id && !remoteClientes.some(rc => rc.id === lc.id)
          );
          if (missingClientes.length > 0) {
            await ApiClient.saveCliente(missingClientes).catch(() => {});
          }
          last.clientes = versions.clientes;
        }
      }

      if (!silent) {
        showToast(`Sincronização com ${syncCheck.provider || 'banco na nuvem'} concluída!`, 'success');
      }
    } catch (err) {
      console.warn('[Sync] Falha na sincronização:', err);
      setCloudSyncStatus({ isConnected: false, provider: null, lastSync: null });
    }
  }, [setOrders, setClients, setProducts, precoBrutoHook, showToast]);

  // Executa sincronização em segundo plano periódica e reativa ao foco da janela
  useEffect(() => {
    // Sincronização inicial completa
    syncWithCloud(true, true);

    // Auto-sync leve a cada 25 segundos (1 requisição ultrarrápida, dentro da cota grátis)
    const intervalId = setInterval(() => {
      syncWithCloud(true, false);
    }, 25000);

    // Auto-sync imediato quando o funcionário volta para a aba do navegador
    const handleFocus = () => {
      syncWithCloud(true, false);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
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
