// Vercel Serverless Function: /api/config
// Parâmetros operacionais e comerciais (ex: percentual de Preço Bruto, taxa de plaina) via Neon PostgreSQL

import { getPgPool, initTables } from './db.js';

let inMemoryConfig = {
  percentual_preco_bruto: 20,
  taxa_plaina_metro_linear: 2.50,
  taxa_entrega_padrao: 80.00,
  desconto_maximo_vendedor_pct: 5,
  desconto_maximo_gerente_pct: 15,
  permitir_venda_estoque_zerado: true
};

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
        const result = await pool.query("SELECT dados FROM sistema_config WHERE chave = 'geral'");
        if (result.rows.length > 0) {
          return res.status(200).json(result.rows[0].dados);
        }
      } catch (err) {
        console.error('[API/config] Database error:', err.message);
      }
    }

    return res.status(200).json(inMemoryConfig);
  }

  if (req.method === 'POST') {
    const novosParametros = req.body;
    if (!novosParametros || typeof novosParametros !== 'object') {
      return res.status(400).json({ error: 'Configuração inválida' });
    }

    inMemoryConfig = { ...inMemoryConfig, ...novosParametros };

    if (pool) {
      try {
        await pool.query(`
          INSERT INTO sistema_config (chave, dados, updated_at)
          VALUES ('geral', $1, NOW())
          ON CONFLICT (chave) DO UPDATE
          SET dados = $1, updated_at = NOW()
        `, [JSON.stringify(inMemoryConfig)]);
      } catch (err) {
        console.error('[API/config] Database save error:', err.message);
      }
    }

    return res.status(200).json({ success: true, config: inMemoryConfig });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
