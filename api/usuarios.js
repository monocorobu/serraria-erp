// api/usuarios.js
// Vercel Serverless Function: /api/usuarios
// Sincronização centralizada de contas de acesso via PostgreSQL (Supabase/Neon)

import { getPgPool, safeQuery } from './db.js';

let inMemoryUsuarios = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pool = await getPgPool();

  // GET: Lista todos os usuários cadastrados (com sanitização estrita)
  if (req.method === 'GET') {
    if (pool) {
      try {
        const result = await safeQuery(pool, 'SELECT dados FROM usuarios ORDER BY updated_at ASC');
        if (result.rows.length > 0) {
          const usuarios = result.rows.map(r => {
            const u = { ...r.dados };
            delete u.senha; // Garante que senhas em texto puro NUNCA sejam transmitidas
            return u;
          });
          return res.status(200).json(usuarios);
        }
      } catch (err) {
        console.error('[API/usuarios] Database error:', err.message);
        return res.status(500).json({ error: 'Erro ao consultar usuários.' });
      }
    }

    if (!inMemoryUsuarios) inMemoryUsuarios = [];
    return res.status(200).json(inMemoryUsuarios.map(u => {
      const safe = { ...u };
      delete safe.senha;
      return safe;
    }));
  }

  // POST: Cria ou atualiza usuário (suporta individual ou lote)
  if (req.method === 'POST') {
    const body = req.body;
    const isBatch = Array.isArray(body);
    const items = isBatch ? body : [body];

    if (!items.length || !items[0] || !items[0].id || !items[0].username) {
      return res.status(400).json({ error: 'Dados do usuário inválidos (necessário id e username)' });
    }

    if (items.length > 50) {
      return res.status(400).json({ error: 'Limite de registros por lote excedido (máximo 50)' });
    }

    if (pool) {
      try {
        for (const usuario of items) {
          if (!usuario || !usuario.id || !usuario.username) continue;
          
          // Sanitização rigorosa: nunca persistir senha em texto plano
          const cleanUser = { ...usuario };
          delete cleanUser.senha;

          const cleanId = String(cleanUser.id).trim().slice(0, 60);
          const cleanUsername = String(cleanUser.username).toLowerCase().trim().replace(/[^a-z0-9._-]/g, '').slice(0, 80);
          if (!cleanUsername) continue;

          cleanUser.id = cleanId;
          cleanUser.username = cleanUsername;

          await safeQuery(pool, `
            INSERT INTO usuarios (id, username, dados, updated_at)
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT (id) DO UPDATE
            SET username = $2, dados = $3, updated_at = NOW()
          `, [cleanId, cleanUsername, JSON.stringify(cleanUser)]);
        }

        return res.status(200).json({ success: true, count: items.length });
      } catch (err) {
        console.error('[API/usuarios] Database save error:', err.message);
        return res.status(500).json({ error: 'Erro interno ao salvar usuário.' });
      }
    }

    if (!inMemoryUsuarios) inMemoryUsuarios = [];
    for (const usuario of items) {
      if (!usuario || !usuario.id) continue;
      const cleanUser = { ...usuario };
      delete cleanUser.senha;
      const idx = inMemoryUsuarios.findIndex(u => u.id === cleanUser.id);
      if (idx >= 0) {
        inMemoryUsuarios[idx] = cleanUser;
      } else {
        inMemoryUsuarios.push(cleanUser);
      }
    }

    return res.status(200).json({ success: true, count: items.length });
  }

  // DELETE: Remove usuário (com proteção da conta master DEV)
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
      return res.status(400).json({ error: 'ID do usuário obrigatório' });
    }

    const cleanId = String(id).trim().slice(0, 60);

    if (pool) {
      try {
        await safeQuery(pool, `
          DELETE FROM usuarios 
          WHERE (id = $1 OR username = $1)
            AND username != 'thales' 
            AND (dados->>'perfil' != 'DEV' OR dados->>'perfil' IS NULL)
        `, [cleanId]);
        return res.status(200).json({ success: true, id: cleanId });
      } catch (err) {
        console.error('[API/usuarios] Database delete error:', err.message);
        return res.status(500).json({ error: 'Erro ao processar exclusão de usuário.' });
      }
    }

    if (!inMemoryUsuarios) inMemoryUsuarios = [];
    inMemoryUsuarios = inMemoryUsuarios.filter(u => 
      u && u.id !== cleanId && u.username !== cleanId || u.username === 'thales'
    );
    return res.status(200).json({ success: true, id: cleanId });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
