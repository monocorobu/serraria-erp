// api/db.js
// Conexão unificada e resiliente com o banco Neon PostgreSQL (Serverless)

let cachedPool = null;
let tablesInitialized = false;

export function getConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.NEON_DATABASE_URL ||
    null
  );
}

export async function getPgPool() {
  const connectionString = getConnectionString();
  if (!connectionString) return null;

  if (cachedPool) return cachedPool;

  try {
    // 1. Tenta o driver nativo otimizado do Neon Serverless
    const neonModule = await import('@neondatabase/serverless');
    if (neonModule && neonModule.Pool) {
      cachedPool = new neonModule.Pool({
        connectionString
      });
      return cachedPool;
    }
  } catch (err) {
    console.warn('[db] Falha ao carregar @neondatabase/serverless, tentando pg padrão:', err.message);
  }

  try {
    // 2. Fallback para driver pg padrão
    const pgModule = await import('pg');
    const Pool = pgModule.Pool || pgModule.default?.Pool;
    if (Pool) {
      cachedPool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
      });
      return cachedPool;
    }
  } catch (err) {
    console.error('[db] Falha ao carregar driver pg:', err.message);
  }

  return null;
}

export async function initTables(pool) {
  if (tablesInitialized || !pool) return;

  try {
    // Criação idempotente e segura das tabelas do ERP
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(100) UNIQUE,
        dados JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pedidos (
        id VARCHAR(50) PRIMARY KEY,
        numero INT,
        dados JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS clientes (
        id VARCHAR(50) PRIMARY KEY,
        nome VARCHAR(255),
        documento VARCHAR(50),
        telefone VARCHAR(50),
        dados JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS produtos (
        id VARCHAR(50) PRIMARY KEY,
        codigo VARCHAR(50),
        nome VARCHAR(255),
        dados JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sistema_config (
        chave VARCHAR(50) PRIMARY KEY,
        dados JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS funcionarios (
        id VARCHAR(50) PRIMARY KEY,
        nome VARCHAR(255),
        dados JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    tablesInitialized = true;
  } catch (err) {
    console.error('[db] Erro ao inicializar tabelas:', err.message);
  }
}
