// Vercel Serverless Function: /api/produtos
// Gerenciamento de estoque e catálogo com persistência PostgreSQL e fallback em memória

let inMemoryProdutos = null;

async function getPgClient() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) return null;

  try {
    const { Pool } = await import('pg');
    const pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    return pool;
  } catch (err) {
    console.warn('[API/produtos] pg client unavailable, using fallback store:', err.message);
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pool = await getPgClient();

  if (req.method === 'GET') {
    if (pool) {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS produtos (
            id VARCHAR(50) PRIMARY KEY,
            codigo VARCHAR(50),
            nome VARCHAR(255),
            dados JSONB,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        const result = await pool.query('SELECT dados FROM produtos ORDER BY id ASC');
        if (result.rows.length > 0) {
          const produtos = result.rows.map(r => r.dados);
          return res.status(200).json(produtos);
        }
      } catch (err) {
        console.error('[API/produtos] Database error:', err);
      }
    }

    if (!inMemoryProdutos) {
      inMemoryProdutos = [];
    }

    return res.status(200).json(inMemoryProdutos);
  }

  if (req.method === 'POST') {
    const produto = req.body;
    if (!produto || !produto.id) {
      return res.status(400).json({ error: 'Dados do produto inválidos (necessário id)' });
    }

    if (pool) {
      try {
        await pool.query(`
          INSERT INTO produtos (id, codigo, nome, dados, updated_at)
          VALUES ($1, $2, $3, $4, NOW())
          ON CONFLICT (id) DO UPDATE
          SET dados = $4, updated_at = NOW()
        `, [produto.id, produto.codigo || '', produto.nome || '', JSON.stringify(produto)]);

        return res.status(200).json({ success: true, produto });
      } catch (err) {
        console.error('[API/produtos] Database save error:', err);
      }
    }

    if (!inMemoryProdutos) inMemoryProdutos = [];
    const idx = inMemoryProdutos.findIndex(p => p.id === produto.id);
    if (idx >= 0) {
      inMemoryProdutos[idx] = produto;
    } else {
      inMemoryProdutos.push(produto);
    }

    return res.status(200).json({ success: true, produto });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
