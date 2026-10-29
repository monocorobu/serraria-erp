// api/funcionarios.js
// Vercel Serverless Function: /api/funcionarios
// Sincronização centralizada de equipe e vendedores via PostgreSQL (Supabase/Neon)

import { getPgPool, safeQuery } from './db.js';

let inMemoryFuncionarios = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pool = await getPgPool();

  // GET: Lista todos os funcionários/vendedores cadastrados
  if (req.method === 'GET') {
    if (pool) {
      try {
        const result = await safeQuery(pool, 'SELECT dados FROM funcionarios ORDER BY updated_at ASC');
        const list = result.rows.map(r => r.dados);
        return res.status(200).json(list);
      } catch (err) {
        console.error('[API/funcionarios] Database error:', err.message);
        return res.status(500).json({ error: 'Erro ao consultar funcionários.' });
      }
    }

    if (!inMemoryFuncionarios) inMemoryFuncionarios = [];
    return res.status(200).json(inMemoryFuncionarios);
  }

  // POST: Cria ou atualiza funcionário (individual ou lote)
  if (req.method === 'POST') {
    const body = req.body;
    const isBatch = Array.isArray(body);
    const items = isBatch ? body : [body];

    if (!items.length || !items[0] || !items[0].id || !items[0].nome) {
      return res.status(400).json({ error: 'Dados do funcionário inválidos (necessário id e nome)' });
    }

    if (items.length > 100) {
      return res.status(400).json({ error: 'Limite por lote excedido (máximo 100)' });
    }

    if (pool) {
      try {
        for (const func of items) {
          if (!func || !func.id || !func.nome) continue;
          const cleanId = String(func.id).trim().slice(0, 60);
          const cleanNome = String(func.nome).trim().slice(0, 255);

          await safeQuery(pool, `
            INSERT INTO funcionarios (id, nome, dados, updated_at)
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT (id) DO UPDATE
            SET nome = $2, dados = $3, updated_at = NOW()
          `, [cleanId, cleanNome, JSON.stringify(func)]);
        }

        return res.status(200).json({ success: true, count: items.length });
      } catch (err) {
        console.error('[API/funcionarios] Database save error:', err.message);
        return res.status(500).json({ error: 'Erro interno ao salvar funcionário.' });
      }
    }

    if (!inMemoryFuncionarios) inMemoryFuncionarios = [];
    for (const func of items) {
      if (!func || !func.id) continue;
      const idx = inMemoryFuncionarios.findIndex(f => f.id === func.id);
      if (idx >= 0) {
        inMemoryFuncionarios[idx] = func;
      } else {
        inMemoryFuncionarios.push(func);
      }
    }

    return res.status(200).json({ success: true, count: items.length });
  }

  // DELETE: Remove funcionário do banco
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
      return res.status(400).json({ error: 'ID do funcionário obrigatório' });
    }

    const cleanId = String(id).trim().slice(0, 60);

    if (pool) {
      try {
        await safeQuery(pool, 'DELETE FROM funcionarios WHERE id = $1', [cleanId]);
        return res.status(200).json({ success: true, id: cleanId });
      } catch (err) {
        console.error('[API/funcionarios] Database delete error:', err.message);
        return res.status(500).json({ error: 'Erro ao excluir funcionário do banco.' });
      }
    }

    if (!inMemoryFuncionarios) inMemoryFuncionarios = [];
    inMemoryFuncionarios = inMemoryFuncionarios.filter(f => f && f.id !== cleanId);
    return res.status(200).json({ success: true, id: cleanId });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
