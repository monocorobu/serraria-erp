// Vercel Serverless Function: /api/pedidos
// Suporta persistência em Neon PostgreSQL e fallback em memória

import { getPgPool, initTables } from './db.js';

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
  if (pool) {
    await initTables(pool);
  }

  if (req.method === 'GET') {
    const { id } = req.query || {};

    if (pool) {
      try {
        if (id) {
          const result = await pool.query('SELECT dados FROM pedidos WHERE id = $1', [id]);
          if (result.rows.length === 0) return res.status(404).json({ error: 'Pedido não encontrado' });
          return res.status(200).json(result.rows[0].dados);
        }

        const result = await pool.query('SELECT dados FROM pedidos ORDER BY created_at DESC');
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
    const pedido = req.body;
    if (!pedido || !pedido.id) {
      return res.status(400).json({ error: 'Dados do pedido inválidos (necessário id)' });
    }

    if (pool) {
      try {
        await pool.query(`
          INSERT INTO pedidos (id, numero, dados, updated_at)
          VALUES ($1, $2, $3, NOW())
          ON CONFLICT (id) DO UPDATE
          SET dados = $3, updated_at = NOW()
        `, [pedido.id, pedido.numero || 0, JSON.stringify(pedido)]);

        return res.status(200).json({ success: true, pedido });
      } catch (err) {
        console.error('[API/pedidos] Database save error:', err.message);
      }
    }

    if (!inMemoryPedidos) inMemoryPedidos = [];
    const idx = inMemoryPedidos.findIndex(p => p.id === pedido.id);
    if (idx >= 0) {
      inMemoryPedidos[idx] = pedido;
    } else {
      inMemoryPedidos.unshift(pedido);
    }

    return res.status(200).json({ success: true, pedido });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
