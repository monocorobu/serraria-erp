// Vercel Serverless Function: /api/produtos
// Gerenciamento de estoque e catálogo com persistência Neon PostgreSQL e fallback em memória

import { getPgPool, initTables } from './db.js';

let inMemoryProdutos = null;

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
    if (pool) {
      try {
        const result = await pool.query('SELECT dados FROM produtos ORDER BY id ASC');
        if (result.rows.length > 0) {
          const produtos = result.rows.map(r => r.dados);
          return res.status(200).json(produtos);
        }
      } catch (err) {
        console.error('[API/produtos] Database error:', err.message);
      }
    }

    if (!inMemoryProdutos) inMemoryProdutos = [];
    return res.status(200).json(inMemoryProdutos);
  }

  if (req.method === 'POST') {
    const body = req.body;
    const isBatch = Array.isArray(body);
    const items = isBatch ? body : [body];

    if (!items.length || !items[0] || !items[0].id) {
      return res.status(400).json({ error: 'Dados do produto inválidos (necessário id)' });
    }

    if (pool) {
      try {
        for (const produto of items) {
          if (!produto || !produto.id) continue;
          await pool.query(`
            INSERT INTO produtos (id, codigo, nome, dados, updated_at)
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT (id) DO UPDATE
            SET dados = $4, updated_at = NOW()
          `, [produto.id, produto.codigo || '', produto.nome || '', JSON.stringify(produto)]);
        }

        return res.status(200).json({ success: true, count: items.length });
      } catch (err) {
        console.error('[API/produtos] Database save error:', err.message);
      }
    }

    if (!inMemoryProdutos) inMemoryProdutos = [];
    for (const produto of items) {
      if (!produto || !produto.id) continue;
      const idx = inMemoryProdutos.findIndex(p => p.id === produto.id);
      if (idx >= 0) {
        inMemoryProdutos[idx] = produto;
      } else {
        inMemoryProdutos.push(produto);
      }
    }

    return res.status(200).json({ success: true, count: items.length });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
