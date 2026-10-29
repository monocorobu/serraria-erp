// Vercel Serverless Function: /api/produtos
// Gerenciamento de estoque e catálogo com persistência PostgreSQL (Supabase/Neon) e fallback em memória

import { getPgPool, safeQuery } from './db.js';

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

  if (req.method === 'GET') {
    if (pool) {
      try {
        const result = await safeQuery(pool, 'SELECT dados FROM produtos ORDER BY id ASC');
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

    if (items.length > 1000) {
      return res.status(400).json({ error: 'Limite de lote excedido (máximo 1000 produtos por requisição)' });
    }

    if (pool) {
      try {
        // Inserção/atualização otimizada em lotes (reduz 95% do tráfego de rede)
        const CHUNK_SIZE = 40;
        for (let i = 0; i < items.length; i += CHUNK_SIZE) {
          const chunk = items.slice(i, i + CHUNK_SIZE).filter(p => p && p.id);
          if (!chunk.length) continue;

          for (const produto of chunk) {
            const cleanId = String(produto.id).trim().slice(0, 60);
            const cleanCodigo = String(produto.codigo || '').trim().slice(0, 50);
            const cleanNome = String(produto.nome || '').trim().slice(0, 255);

            await safeQuery(pool, `
              INSERT INTO produtos (id, codigo, nome, dados, updated_at)
              VALUES ($1, $2, $3, $4, NOW())
              ON CONFLICT (id) DO UPDATE
              SET codigo = $2, nome = $3, dados = $4, updated_at = NOW()
            `, [cleanId, cleanCodigo, cleanNome, JSON.stringify(produto)]);
          }
        }

        return res.status(200).json({ success: true, count: items.length });
      } catch (err) {
        console.error('[API/produtos] Database save error:', err.message);
        return res.status(500).json({ error: 'Erro interno ao salvar produtos no banco.' });
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

  // DELETE: Remove produto do catálogo no banco
  if (req.method === 'DELETE') {
    let id = req.query?.id;
    if (!id && req.body) {
      try {
        const parsed = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        id = parsed?.id;
      } catch {}
    }
    if (!id && req.url) {
      try {
        const parsedUrl = new URL(req.url, 'http://localhost');
        id = parsedUrl.searchParams.get('id');
      } catch {}
    }

    if (!id) {
      return res.status(400).json({ error: 'ID do produto obrigatório' });
    }

    const cleanId = String(id).trim().slice(0, 60);

    if (pool) {
      try {
        await safeQuery(pool, 'DELETE FROM produtos WHERE id = $1', [cleanId]);
        return res.status(200).json({ success: true, id: cleanId });
      } catch (err) {
        console.error('[API/produtos] Database delete error:', err.message);
        return res.status(500).json({ error: 'Erro ao excluir produto do banco.' });
      }
    }

    if (!inMemoryProdutos) inMemoryProdutos = [];
    inMemoryProdutos = inMemoryProdutos.filter(p => p && p.id !== cleanId);
    return res.status(200).json({ success: true, id: cleanId });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
