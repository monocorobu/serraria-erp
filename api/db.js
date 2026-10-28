// api/db.js
// Conexão unificada e resiliente com PostgreSQL (Supabase / Neon / Vercel Postgres)

let cachedPool = null;
let tablesInitialized = false;

export function getConnectionString() {
  return (
    process.env.SUPABASE_DATABASE_URL ||
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

  const isNeon = connectionString.includes('neon.tech');

  // Se for Neon, tenta o driver serverless específico
  if (isNeon) {
    try {
      const neonModule = await import('@neondatabase/serverless');
      if (neonModule && neonModule.Pool) {
        cachedPool = new neonModule.Pool({ connectionString });
        return cachedPool;
      }
    } catch (err) {
      console.warn('[db] Falha no @neondatabase/serverless, tentando pg padrão:', err.message);
    }
  }

  // Supabase ou PostgreSQL padrão (driver oficial pg com pooling serverless otimizado)
  try {
    const pgModule = await import('pg');
    const Pool = pgModule.Pool || pgModule.default?.Pool;
    if (Pool) {
      cachedPool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        max: 3, // Limite conservador para serverless não esgotar conexões
        idleTimeoutMillis: 15000,
        connectionTimeoutMillis: 5000
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

// Execução segura com inicialização preguiçosa (lazy) de tabelas sob demanda
// Elimina 95% do overhead de rede ao NÃO executar CREATE TABLE em cada requisição
export async function safeQuery(pool, text, params = []) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    // Código 42P01: tabela não existe no PostgreSQL
    if (err && err.code === '42P01') {
      console.log('[db] Tabela não encontrada (42P01). Inicializando schema...');
      await initTables(pool);
      return await pool.query(text, params);
    }
    throw err;
  }
}
