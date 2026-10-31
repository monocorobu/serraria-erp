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

    const [usrRes, pedRes, prodRes, cliRes, funcRes, cfgRes] = await Promise.all([
      pool.query("SELECT COUNT(*)::int as total, COALESCE(MAX(updated_at), '1970-01-01'::timestamp)::text as last_mod FROM usuarios"),
      pool.query("SELECT COUNT(*)::int as total, COALESCE(MAX(updated_at), '1970-01-01'::timestamp)::text as last_mod FROM pedidos"),
      pool.query("SELECT COUNT(*)::int as total, COALESCE(MAX(updated_at), '1970-01-01'::timestamp)::text as last_mod FROM produtos"),
      pool.query("SELECT COUNT(*)::int as total, COALESCE(MAX(updated_at), '1970-01-01'::timestamp)::text as last_mod FROM clientes"),
      pool.query("SELECT COUNT(*)::int as total, COALESCE(MAX(updated_at), '1970-01-01'::timestamp)::text as last_mod FROM funcionarios"),
      pool.query("SELECT COALESCE(MAX(updated_at), '1970-01-01'::timestamp)::text as last_mod FROM sistema_config")
    ]);

    return res.status(200).json({
      connected: true,
      configured: true,
      provider,
      counts: {
        usuarios: usrRes.rows[0]?.total || 0,
        pedidos: pedRes.rows[0]?.total || 0,
        produtos: prodRes.rows[0]?.total || 0,
        clientes: cliRes.rows[0]?.total || 0,
        funcionarios: funcRes.rows[0]?.total || 0
      },
      versions: {
        usuarios: `${usrRes.rows[0]?.total || 0}_${usrRes.rows[0]?.last_mod || ''}`,
        pedidos: `${pedRes.rows[0]?.total || 0}_${pedRes.rows[0]?.last_mod || ''}`,
        produtos: `${prodRes.rows[0]?.total || 0}_${prodRes.rows[0]?.last_mod || ''}`,
        clientes: `${cliRes.rows[0]?.total || 0}_${cliRes.rows[0]?.last_mod || ''}`,
        funcionarios: `${funcRes.rows[0]?.total || 0}_${funcRes.rows[0]?.last_mod || ''}`,
        config: cfgRes.rows[0]?.last_mod || ''
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[API/sync] Connection check error:', err.message);
    return res.status(200).json({
      connected: false,
      configured: true,
      provider,
      error: 'Falha na comunicação com o banco de dados.'
    });
  }
}
