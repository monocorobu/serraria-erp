// Vercel Serverless Function: /api/clientes
// CRM de clientes e parceiros carpinteiros com persistência PostgreSQL e fallback em memória

let inMemoryClientes = null;

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
    console.warn('[API/clientes] pg client unavailable, using fallback store:', err.message);
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
          CREATE TABLE IF NOT EXISTS clientes (
            id VARCHAR(50) PRIMARY KEY,
            nome VARCHAR(255),
            documento VARCHAR(50),
            telefone VARCHAR(50),
            dados JSONB,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        const result = await pool.query('SELECT dados FROM clientes ORDER BY id ASC');
        if (result.rows.length > 0) {
          const clientes = result.rows.map(r => r.dados);
          return res.status(200).json(clientes);
        }
      } catch (err) {
        console.error('[API/clientes] Database error:', err);
      }
    }

    if (!inMemoryClientes) inMemoryClientes = [];
    return res.status(200).json(inMemoryClientes);
  }

  if (req.method === 'POST') {
    const cliente = req.body;
    if (!cliente || !cliente.id) {
      return res.status(400).json({ error: 'Dados do cliente inválidos (necessário id)' });
    }

    if (pool) {
      try {
        await pool.query(`
          INSERT INTO clientes (id, nome, documento, telefone, dados, updated_at)
          VALUES ($1, $2, $3, $4, $5, NOW())
          ON CONFLICT (id) DO UPDATE
          SET dados = $5, updated_at = NOW()
        `, [cliente.id, cliente.nome || '', cliente.documento || '', cliente.telefone || '', JSON.stringify(cliente)]);

        return res.status(200).json({ success: true, cliente });
      } catch (err) {
        console.error('[API/clientes] Database save error:', err);
      }
    }

    if (!inMemoryClientes) inMemoryClientes = [];
    const idx = inMemoryClientes.findIndex(c => c.id === cliente.id);
    if (idx >= 0) {
      inMemoryClientes[idx] = cliente;
    } else {
      inMemoryClientes.push(cliente);
    }

    return res.status(200).json({ success: true, cliente });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
