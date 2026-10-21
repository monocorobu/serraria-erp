/**
 * SERRARIA & MADEIREIRA ERP - API CLIENT
 * Comunicação assíncrona com rotas serverless /api conectadas ao PostgreSQL
 */

export const ApiClient = {
  async getPedidos() {
    try {
      const res = await fetch('/api/pedidos');
      if (res.ok) return await res.json();
    } catch (e) {
      // Falha de rede silenciosa para fallback offline
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
  }
};
