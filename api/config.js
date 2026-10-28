// Vercel Serverless Function: /api/config
// Parâmetros operacionais e comerciais (ex: percentual de Preço Bruto, taxa de plaina) via Neon PostgreSQL

import { getPgPool, initTables } from './db.js';

let inMemoryConfig = {
  senha_gerente: '1234',
  desconto_maximo_livre: 5.0,
  taxa_plaina_padrao_ml: 3.50,
  taxa_plaina_padrao_m2: 8.00,
  meta_faturamento_mensal: 150000.00,
  percentual_preco_bruto: 20.0,
  percentual_taxa_debito: 2.5,
  nome_madeireira: 'Serraria e Madeireira Bom Jesus',
  cnpj_madeireira: '16.482.988/0001-02',
  telefone_madeireira: '(12) 99603-3793',
  endereco_madeireira: 'Av. Adhemar Pinto de Siqueira, 1000 - Vila Galvão, Caçapava - SP, 12286-325',
  logradouro: 'Avenida Adhemar Pinto de Siqueira, 1000',
  bairro: 'Vila Galvão',
  cep: '12286-325',
  municipio: 'Caçapava',
  cidade: 'Caçapava',
  estado: 'São Paulo',
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
    if (!novosParametros || typeof novosParametros !== 'object' || Array.isArray(novosParametros)) {
      return res.status(400).json({ error: 'Configuração inválida' });
    }

    // Whitelist completa e estrita de parâmetros operacionais permitidos
    const numericKeys = [
      'percentual_preco_bruto',
      'desconto_maximo_livre',
      'taxa_plaina_padrao_ml',
      'taxa_plaina_padrao_m2',
      'meta_faturamento_mensal',
      'percentual_taxa_debito',
      'taxa_plaina_metro_linear',
      'taxa_entrega_padrao',
      'desconto_maximo_vendedor_pct',
      'desconto_maximo_gerente_pct'
    ];

    const stringKeys = [
      'senha_gerente',
      'nome_madeireira',
      'cnpj_madeireira',
      'telefone_madeireira',
      'endereco_madeireira',
      'logradouro',
      'bairro',
      'cep',
      'municipio',
      'cidade',
      'estado',
      'mensagem_whatsapp_rodape'
    ];

    const booleanKeys = [
      'permitir_venda_estoque_zerado'
    ];

    const safeUpdate = {};
    for (const key of numericKeys) {
      if (key in novosParametros) {
        const num = Number(novosParametros[key]);
        if (!isNaN(num) && num >= 0 && num <= 10000000) {
          safeUpdate[key] = num;
        }
      }
    }

    for (const key of stringKeys) {
      if (key in novosParametros && typeof novosParametros[key] === 'string') {
        safeUpdate[key] = novosParametros[key].trim().slice(0, 255);
      }
    }

    for (const key of booleanKeys) {
      if (key in novosParametros) {
        safeUpdate[key] = Boolean(novosParametros[key]);
      }
    }

    inMemoryConfig = { ...inMemoryConfig, ...safeUpdate };

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
        return res.status(500).json({ error: 'Erro interno ao salvar configurações.' });
      }
    }

    return res.status(200).json({ success: true, config: inMemoryConfig });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
