// api/sync.js
// Vercel Serverless Function: /api/sync
// Diagnóstico de conectividade e contadores de sincronização do banco Neon

import { getPgPool, initTables, getConnectionString } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const conn = getConnectionString();
  if (!conn) {
    return res.status(200).json({
      connected: false,
      configured: false,
      message: 'DATABASE_URL não configurada no ambiente.'
    });
  }

  const provider = conn.includes('supabase') ? 'Supabase' : conn.includes('neon') ? 'Neon' : 'PostgreSQL';

  const pool = await getPgPool();
  if (!pool) {
    return res.status(200).json({
      connected: false,
      configured: true,
      provider,
      message: 'Driver do banco não pôde ser iniciado.'
    });
  }

  try {
    await initTables(pool);

    const [usrRes, pedRes, prodRes, cliRes] = await Promise.all([
      pool.query('SELECT COUNT(*)::int as total FROM usuarios'),
      pool.query('SELECT COUNT(*)::int as total FROM pedidos'),
      pool.query('SELECT COUNT(*)::int as total FROM produtos'),
      pool.query('SELECT COUNT(*)::int as total FROM clientes')
    ]);

    return res.status(200).json({
      connected: true,
      configured: true,
      provider,
      counts: {
        usuarios: usrRes.rows[0]?.total || 0,
        pedidos: pedRes.rows[0]?.total || 0,
        produtos: prodRes.rows[0]?.total || 0,
        clientes: cliRes.rows[0]?.total || 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(200).json({
      connected: false,
      configured: true,
      provider,
      error: err.message
    });
  }
}
