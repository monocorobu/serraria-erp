// Vercel Serverless Function: /api/clientes
// CRM de clientes e parceiros carpinteiros com persistência PostgreSQL (Supabase/Neon) e fallback em memória

import { getPgPool, safeQuery } from './db.js';

let inMemoryClientes = null;

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
    if (pool) {
      try {
        const result = await safeQuery(pool, 'SELECT dados FROM clientes ORDER BY id ASC');
        if (result.rows.length > 0) {
          const clientes = result.rows.map(r => r.dados);
          return res.status(200).json(clientes);
        }
      } catch (err) {
        console.error('[API/clientes] Database error:', err.message);
      }
    }

    if (!inMemoryClientes) inMemoryClientes = [];
    return res.status(200).json(inMemoryClientes);
  }

  if (req.method === 'POST') {
    const body = req.body;
    const isBatch = Array.isArray(body);
    const items = isBatch ? body : [body];

    if (!items.length || !items[0] || !items[0].id) {
      return res.status(400).json({ error: 'Dados do cliente inválidos (necessário id)' });
    }

    if (pool) {
      try {
        for (const cliente of items) {
          if (!cliente || !cliente.id) continue;
          await safeQuery(pool, `
            INSERT INTO clientes (id, nome, documento, telefone, dados, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            ON CONFLICT (id) DO UPDATE
            SET nome = $2, documento = $3, telefone = $4, dados = $5, updated_at = NOW()
          `, [cliente.id, cliente.nome || '', cliente.documento || '', cliente.telefone || '', JSON.stringify(cliente)]);
        }

        return res.status(200).json({ success: true, count: items.length });
      } catch (err) {
        console.error('[API/clientes] Database save error:', err.message);
      }
    }

    if (!inMemoryClientes) inMemoryClientes = [];
    for (const cliente of items) {
      if (!cliente || !cliente.id) continue;
      const idx = inMemoryClientes.findIndex(c => c.id === cliente.id);
      if (idx >= 0) {
        inMemoryClientes[idx] = cliente;
      } else {
        inMemoryClientes.push(cliente);
      }
    }

    return res.status(200).json({ success: true, count: items.length });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
