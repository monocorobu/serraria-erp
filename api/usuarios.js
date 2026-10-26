// api/usuarios.js
// Vercel Serverless Function: /api/usuarios
// Sincronização centralizada de contas de acesso (usuários, gerentes, funcionários) via Neon PostgreSQL

import { getPgPool, initTables } from './db.js';

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
  if (pool) {
    await initTables(pool);
  }

  // GET: Lista todos os usuários cadastrados
  if (req.method === 'GET') {
    if (pool) {
      try {
        const result = await pool.query('SELECT dados FROM usuarios ORDER BY updated_at ASC');
        if (result.rows.length > 0) {
          const usuarios = result.rows.map(r => r.dados);
          return res.status(200).json(usuarios);
        }
      } catch (err) {
        console.error('[API/usuarios] Database error:', err.message);
      }
    }

    if (!inMemoryUsuarios) inMemoryUsuarios = [];
    return res.status(200).json(inMemoryUsuarios);
  }

  // POST: Cria ou atualiza usuário (suporta individual ou lote)
  if (req.method === 'POST') {
    const body = req.body;
    const isBatch = Array.isArray(body);
    const items = isBatch ? body : [body];

    if (!items.length || !items[0] || !items[0].id || !items[0].username) {
      return res.status(400).json({ error: 'Dados do usuário inválidos (necessário id e username)' });
    }

    if (pool) {
      try {
        for (const usuario of items) {
          if (!usuario || !usuario.id || !usuario.username) continue;
          const cleanUsername = String(usuario.username).toLowerCase().trim();
          await pool.query(`
            INSERT INTO usuarios (id, username, dados, updated_at)
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT (id) DO UPDATE
            SET username = $2, dados = $3, updated_at = NOW()
          `, [usuario.id, cleanUsername, JSON.stringify(usuario)]);
        }

        return res.status(200).json({ success: true, count: items.length });
      } catch (err) {
        console.error('[API/usuarios] Database save error:', err.message);
      }
    }

    if (!inMemoryUsuarios) inMemoryUsuarios = [];
    for (const usuario of items) {
      if (!usuario || !usuario.id) continue;
      const idx = inMemoryUsuarios.findIndex(u => u.id === usuario.id);
      if (idx >= 0) {
        inMemoryUsuarios[idx] = usuario;
      } else {
        inMemoryUsuarios.push(usuario);
      }
    }

    return res.status(200).json({ success: true, count: items.length });
  }

  // DELETE: Remove usuário (com proteção da conta master DEV)
  if (req.method === 'DELETE') {
    const { id } = req.query || {};
    if (!id) {
      return res.status(400).json({ error: 'ID do usuário obrigatório' });
    }

    if (pool) {
      try {
        await pool.query(`
          DELETE FROM usuarios 
          WHERE id = $1 
            AND username != 'thales' 
            AND (dados->>'perfil' != 'DEV' OR dados->>'perfil' IS NULL)
        `, [id]);
        return res.status(200).json({ success: true });
      } catch (err) {
        console.error('[API/usuarios] Database delete error:', err.message);
      }
    }

    if (!inMemoryUsuarios) inMemoryUsuarios = [];
    inMemoryUsuarios = inMemoryUsuarios.filter(u => u.id !== id || u.username === 'thales');
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
