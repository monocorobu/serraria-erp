/**
 * SERRARIA & MADEIREIRA ERP - API CLIENT
 * Comunicação assíncrona com rotas serverless /api conectadas ao Neon PostgreSQL
 * Arquitetura Offline-First: falhas de rede operam com fallback transparente no LocalStorage
 */

export const ApiClient = {
  // --- USUÁRIOS & CONTAS DE ACESSO ---
  async getUsuarios() {
    try {
      const res = await fetch('/api/usuarios');
      if (res.ok) return await res.json();
    } catch (e) {
      // Offline fallback
    }
    return null;
  },

  async saveUsuario(usuario) {
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Offline fallback
    }
    return null;
  },

  async deleteUsuario(id) {
    try {
      const res = await fetch(`/api/usuarios?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Offline fallback
    }
    return null;
  },

  // --- PEDIDOS ---
  async getPedidos() {
    try {
      const res = await fetch('/api/pedidos');
      if (res.ok) return await res.json();
    } catch (e) {
      // Offline fallback
    }
    return null;
  },

  async savePedido(pedido) {
    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Offline fallback
    }
    return null;
  },

  // --- PRODUTOS ---
  async getProdutos() {
    try {
      const res = await fetch('/api/produtos');
      if (res.ok) return await res.json();
    } catch (e) {
      // Offline fallback
    }
    return null;
  },

  async saveProduto(produto) {
    try {
      const res = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Offline fallback
    }
    return null;
  },

  // --- CONFIGURAÇÃO ---
  async getConfig() {
    try {
      const res = await fetch('/api/config');
      if (res.ok) return await res.json();
    } catch (e) {
      // Offline fallback
    }
    return null;
  },

  async saveConfig(config) {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Offline fallback
    }
    return null;
  },

  // --- CLIENTES ---
  async getClientes() {
    try {
      const res = await fetch('/api/clientes');
      if (res.ok) return await res.json();
    } catch (e) {
      // Offline fallback
    }
    return null;
  },

  async saveCliente(cliente) {
    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Offline fallback
    }
    return null;
  },

  // --- DIAGNÓSTICO / STATUS DO BANCO ---
  async checkSync() {
    try {
      const res = await fetch('/api/sync');
      if (res.ok) return await res.json();
    } catch (e) {
      // Offline fallback
    }
    return null;
  }
};
