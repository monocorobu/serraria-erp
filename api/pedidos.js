// Vercel Serverless Function: /api/pedidos
// Suporta persistência em PostgreSQL (Supabase/Neon) e fallback em memória

import { getPgPool, safeQuery } from './db.js';

let inMemoryPedidos = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pool = await getPgPool();

  if (req.method === 'GET') {
    const { id } = req.query || {};

    if (pool) {
      try {
        if (id) {
          const result = await safeQuery(pool, 'SELECT dados FROM pedidos WHERE id = $1', [id]);
          if (result.rows.length === 0) return res.status(404).json({ error: 'Pedido não encontrado' });
          return res.status(200).json(result.rows[0].dados);
        }

        const result = await safeQuery(pool, 'SELECT dados FROM pedidos ORDER BY created_at DESC');
        const pedidos = result.rows.map(r => r.dados);
        return res.status(200).json(pedidos);
      } catch (err) {
        console.error('[API/pedidos] Database error:', err.message);
      }
    }

    // In-memory fallback
    if (!inMemoryPedidos) {
      inMemoryPedidos = [];
    }

    if (id) {
      const pedido = inMemoryPedidos.find(p => p.id === id);
      if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });
      return res.status(200).json(pedido);
    }

    return res.status(200).json(inMemoryPedidos);
  }

  if (req.method === 'POST') {
    const body = req.body;
    const isBatch = Array.isArray(body);
    const items = isBatch ? body : [body];

    if (!items.length || !items[0] || !items[0].id) {
      return res.status(400).json({ error: 'Dados do pedido inválidos (necessário id)' });
    }

    if (pool) {
      try {
        for (const pedido of items) {
          if (!pedido || !pedido.id) continue;
          await safeQuery(pool, `
            INSERT INTO pedidos (id, numero, dados, updated_at)
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT (id) DO UPDATE
            SET dados = $3, updated_at = NOW()
          `, [pedido.id, pedido.numero || 0, JSON.stringify(pedido)]);
        }

        return res.status(200).json({ success: true, count: items.length });
      } catch (err) {
        console.error('[API/pedidos] Database save error:', err.message);
      }
    }

    if (!inMemoryPedidos) inMemoryPedidos = [];
    for (const pedido of items) {
      if (!pedido || !pedido.id) continue;
      const idx = inMemoryPedidos.findIndex(p => p.id === pedido.id);
      if (idx >= 0) {
        inMemoryPedidos[idx] = pedido;
      } else {
        inMemoryPedidos.unshift(pedido);
      }
    }

    return res.status(200).json({ success: true, count: items.length });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
