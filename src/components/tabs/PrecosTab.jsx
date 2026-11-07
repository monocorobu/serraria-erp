import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { CalcEngine } from '../../services/calc.js';
import { DB, STORAGE_KEYS } from '../../services/data.js';
import { ApiClient } from '../../services/api.js';
import { GerenciadorCategoriasModal } from '../modals/GerenciadorCategoriasModal.jsx';
import Pagination from '../common/Pagination.jsx';

export const PrecosTab = () => {
  const { 
    products, 
    setProducts, 
    showToast, 
    config, 
    categorias, 
    aplicarReajustePrecos,
    isAdmin 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('TODAS');
  const [especieFilter, setEspecieFilter] = useState('TODAS');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Estado do Reajuste Coletivo
  const [tipoReajuste, setTipoReajuste] = useState('ACRESCIMO'); // 'ACRESCIMO' ou 'DESCONTO'
  const [reajustePct, setReajustePct] = useState(5.0);
  const [reajusteAlvo, setReajusteAlvo] = useState('TODOS');
  const [isGerenciadorOpen, setIsGerenciadorOpen] = useState(false);

  // Modal do Formador de Preço Individual (Custo Fornecedor + Margem %)
  const [modalFormador, setModalFormador] = useState({
    isOpen: false,
    product: null,
    preco_custo: '',
    margem_lucro_pct: 30,
    preco_unitario: 0
  });

  // Modal de Confirmação do Reajuste
  const [modalConfirmacao, setModalConfirmacao] = useState({
    isOpen: false,
    alvoLabel: '',
    tipo: 'ACRESCIMO',
    percentual: 5.0,
    produtosAfetados: [],
    fator: 1.05
  });

  const pctBruto = config.percentual_preco_bruto !== undefined ? config.percentual_preco_bruto : CalcEngine.getPercentualPrecoBruto();

  // Lista de espécies únicas
  const especies = useMemo(() => {
    const set = new Set();
    products.forEach(p => { if (p.especie) set.add(p.especie); });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [products]);

  // Contagem de produtos por categoria (considerando multi-categorias)
  const contagemPorCategoria = useMemo(() => {
    const mapa = {};
    categorias.forEach(cat => { mapa[cat] = 0; });
    products.forEach(p => {
      const cats = Array.isArray(p.categorias) ? p.categorias : (p.categoria ? [p.categoria] : []);
      cats.forEach(c => {
        if (c) mapa[c] = (mapa[c] || 0) + 1;
      });
    });
    return mapa;
  }, [categorias, products]);

  // Contagem de produtos por espécie
  const contagemPorEspecie = useMemo(() => {
    const mapa = {};
    especies.forEach(esp => { mapa[esp] = 0; });
    products.forEach(p => {
      if (p.especie) mapa[p.especie] = (mapa[p.especie] || 0) + 1;
    });
    return mapa;
  }, [especies, products]);

  // Produtos afetados pelo alvo do reajuste
  const produtosAlvo = useMemo(() => {
    return products.filter(p => {
      if (reajusteAlvo === 'TODOS') return true;
      if (reajusteAlvo.startsWith('CAT:')) {
        const catTarget = reajusteAlvo.slice(4);
        const pCats = Array.isArray(p.categorias) ? p.categorias : (p.categoria ? [p.categoria] : []);
        return pCats.includes(catTarget);
      }
      if (reajusteAlvo.startsWith('ESP:')) {
        const espTarget = reajusteAlvo.slice(4);
        return p.especie === espTarget;
      }
      return true;
    });
  }, [products, reajusteAlvo]);

  // Rótulo amigável do alvo selecionado
  const getAlvoLabel = (alvoKey) => {
    if (alvoKey === 'TODOS') return `Todos os Produtos (${products.length} itens)`;
    if (alvoKey.startsWith('CAT:')) {
      const cat = alvoKey.slice(4);
      return `Categoria: ${cat} (${contagemPorCategoria[cat] || 0} itens)`;
    }
    if (alvoKey.startsWith('ESP:')) {
      const esp = alvoKey.slice(4);
      return `Espécie: ${esp} (${contagemPorEspecie[esp] || 0} itens)`;
    }
    return alvoKey;
  };

  // Fator numérico atual
  const fatorAtual = useMemo(() => {
    const pct = Math.abs(parseFloat(reajustePct)) || 0;
    return tipoReajuste === 'ACRESCIMO' ? (1 + pct / 100) : Math.max(0, 1 - pct / 100);
  }, [tipoReajuste, reajustePct]);

  // Produtos filtrados na tabela de preços
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (especieFilter !== 'TODAS' && p.especie !== especieFilter) return false;
      if (categoriaFilter !== 'TODAS') {
        const pCats = Array.isArray(p.categorias) ? p.categorias : (p.categoria ? [p.categoria] : []);
        if (!pCats.includes(categoriaFilter)) return false;
      }
      if (searchTerm.trim()) {
        const t = searchTerm.toLowerCase();
        const nomeMatch = (p.nome || '').toLowerCase().includes(t);
        const codMatch = (p.codigo || '').toLowerCase().includes(t);
        const espMatch = (p.especie || '').toLowerCase().includes(t);
        return nomeMatch || codMatch || espMatch;
      }
      return true;
    });
  }, [products, especieFilter, categoriaFilter, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, safeCurrentPage, pageSize]);

  // Abrir modal de confirmação do reajuste
  const handleSolicitarReajuste = () => {
    const pct = Math.abs(parseFloat(reajustePct)) || 0;
    if (pct === 0) {
      showToast('Informe um percentual de reajuste maior que zero.', 'warning');
      return;
    }
    if (tipoReajuste === 'DESCONTO' && pct >= 100) {
      showToast('O percentual de desconto deve ser estritamente menor que 100%.', 'warning');
      return;
    }
    if (produtosAlvo.length === 0) {
      showToast('Nenhum produto foi encontrado no alvo selecionado.', 'warning');
      return;
    }

    setModalConfirmacao({
      isOpen: true,
      alvoLabel: getAlvoLabel(reajusteAlvo),
      tipo: tipoReajuste,
      percentual: pct,
      produtosAfetados: produtosAlvo,
      fator: fatorAtual
    });
  };

  // Confirmar e aplicar no AppContext/DB
  const handleConfirmarReajuste = () => {
    const pct = Math.abs(parseFloat(reajustePct)) || 0;
    aplicarReajustePrecos({
      tipo: tipoReajuste,
      percentual: pct,
      alvo: reajusteAlvo
    });
    setModalConfirmacao(prev => ({ ...prev, isOpen: false }));
  };

  // Handlers do Formador de Preço (Custo Fornecedor + Margem %)
  const handleAbrirFormador = (prod) => {
    const pUnit = prod.preco_unitario || 0;
    const pCusto = prod.preco_custo !== undefined ? prod.preco_custo : '';
    let pMargem = prod.margem_lucro_pct !== undefined ? prod.margem_lucro_pct : '';
    if (pMargem === '' && pCusto > 0 && pUnit > 0) {
      pMargem = parseFloat((((pUnit - pCusto) / pCusto) * 100).toFixed(2));
    }
    setModalFormador({
      isOpen: true,
      product: prod,
      preco_custo: pCusto,
      margem_lucro_pct: pMargem !== '' ? pMargem : 30,
      preco_unitario: pUnit
    });
  };

  const handleFormadorCustoChange = (novoCustoRaw) => {
    setModalFormador(prev => {
      const custo = novoCustoRaw === '' ? '' : Math.max(0, parseFloat(novoCustoRaw) || 0);
      let novoPreco = prev.preco_unitario;

      if (custo !== '' && prev.margem_lucro_pct !== '') {
        const margem = parseFloat(prev.margem_lucro_pct) || 0;
        novoPreco = parseFloat((custo * (1 + margem / 100)).toFixed(2));
      } else if (custo !== '' && (parseFloat(novoPreco) || 0) > 0) {
        const calcMargem = custo > 0 ? parseFloat((((novoPreco - custo) / custo) * 100).toFixed(2)) : 0;
        return { ...prev, preco_custo: novoCustoRaw, margem_lucro_pct: calcMargem };
      }

      return {
        ...prev,
        preco_custo: novoCustoRaw,
        preco_unitario: novoPreco
      };
    });
  };

  const handleFormadorMargemChange = (novaMargemRaw) => {
    setModalFormador(prev => {
      const margem = novaMargemRaw === '' ? '' : (parseFloat(novaMargemRaw) || 0);
      let novoPreco = prev.preco_unitario;

      if (prev.preco_custo !== '' && margem !== '') {
        const custo = parseFloat(prev.preco_custo) || 0;
        novoPreco = parseFloat((custo * (1 + margem / 100)).toFixed(2));
      }

      return {
        ...prev,
        margem_lucro_pct: novaMargemRaw,
        preco_unitario: novoPreco
      };
    });
  };

  const handleFormadorPrecoUnitarioChange = (novoPrecoRaw) => {
    setModalFormador(prev => {
      const preco = novoPrecoRaw === '' ? '' : Math.max(0, parseFloat(novoPrecoRaw) || 0);
      let novaMargem = prev.margem_lucro_pct;

      if (prev.preco_custo !== '' && parseFloat(prev.preco_custo) > 0 && preco !== '') {
        const custo = parseFloat(prev.preco_custo);
        novaMargem = parseFloat((((preco - custo) / custo) * 100).toFixed(2));
      }

      return {
        ...prev,
        preco_unitario: novoPrecoRaw,
        margem_lucro_pct: novaMargem
      };
    });
  };

  const handleSalvarFormadorPreco = () => {
    if (!modalFormador.product) return;
    const pId = modalFormador.product.id;
    const novoPreco = Math.max(0, parseFloat(modalFormador.preco_unitario) || 0);
    const novoCusto = modalFormador.preco_custo === '' ? 0 : Math.max(0, parseFloat(modalFormador.preco_custo) || 0);
    const novaMargem = modalFormador.margem_lucro_pct === '' ? 0 : (parseFloat(modalFormador.margem_lucro_pct) || 0);

    let targetProd = null;
    const updated = products.map(p => {
      if (p.id === pId) {
        targetProd = {
          ...p,
          preco_unitario: novoPreco,
          preco_custo: novoCusto,
          margem_lucro_pct: novaMargem
        };
        return targetProd;
      }
      return p;
    });

    DB.set(STORAGE_KEYS.PRODUTOS, updated);
    setProducts([...updated]);
    if (targetProd) {
      ApiClient.saveProduto(targetProd).catch(err => {
        console.warn('[PrecosTab] Erro ao sincronizar preço alterado:', err);
      });
    }

    showToast(`Preço de "${modalFormador.product.nome}" atualizado para ${CalcEngine.formatBRL(novoPreco)} com sucesso!`, 'success');
    setModalFormador({ isOpen: false, product: null, preco_custo: '', margem_lucro_pct: 30, preco_unitario: 0 });
  };

  // Edição direta de preço na linha da tabela
  const handleEditarPrecoDirect = (productId, novoPreco) => {
    const val = Math.max(0, parseFloat(novoPreco) || 0);
    let targetProd = null;
    const updated = products.map(p => {
      if (p.id === productId) {
        targetProd = { ...p, preco_unitario: val };
        return targetProd;
      }
      return p;
    });
    DB.set(STORAGE_KEYS.PRODUTOS, updated);
    setProducts([...updated]);
    if (targetProd) {
      ApiClient.saveProduto(targetProd).catch(err => {
        console.warn('[PrecosTab] Erro ao sincronizar preço alterado:', err);
      });
    }
  };

  return (
    <div className="precos-layout">
      {/* PAINEL DE REAJUSTE COLETIVO AVANÇADO (SOMENTE ADMIN) */}
      {isAdmin ? (
        <div className="panel" style={{ marginBottom: '16px', border: '1.5px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span className="panel-title" style={{ fontSize: '13.5px', fontWeight: 800 }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Reajuste Coletivo de Preços de Tabela
          </span>

          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => setIsGerenciadorOpen(true)}
            style={{ fontWeight: 700, gap: '6px' }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            Gerenciar Categorias ({categorias.length})
          </button>
        </div>

        <div className="panel-body" style={{ padding: '16px' }}>
          {/* SELEÇÃO DO TIPO: ACRÉSCIMO OU DESCONTO */}
          <div style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontWeight: 700, marginBottom: '6px', display: 'block' }}>
              Tipo de Operação:
            </label>
            <div style={{ display: 'flex', gap: '10px', maxWidth: '420px' }}>
              <button
                type="button"
                className={`reajuste-type-btn ${tipoReajuste === 'ACRESCIMO' ? 'active-acrescimo' : ''}`}
                onClick={() => setTipoReajuste('ACRESCIMO')}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="19" x2="12" y2="5"/>
                  <polyline points="5 12 12 5 19 12"/>
                </svg>
                Acréscimo (+) Aumento
              </button>

              <button
                type="button"
                className={`reajuste-type-btn ${tipoReajuste === 'DESCONTO' ? 'active-desconto' : ''}`}
                onClick={() => setTipoReajuste('DESCONTO')}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <polyline points="19 12 12 19 5 12"/>
                </svg>
                Desconto (-) Redução
              </button>
            </div>
          </div>

          {/* PARÂMETROS DO REAJUSTE */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {/* ALVO DO REAJUSTE */}
            <div style={{ flex: '1 1 280px', minWidth: '240px' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>Aplicar Em (Segmentação):</label>
              <select 
                className="form-select font-medium"
                value={reajusteAlvo}
                onChange={e => setReajusteAlvo(e.target.value)}
                style={{ height: '38px', fontSize: '13px' }}
              >
                <optgroup label="Escopo Geral">
                  <option value="TODOS">Todos os Produtos ({products.length} itens)</option>
                </optgroup>

                <optgroup label="Filtrar por Categoria (Multi-categoria)">
                  {categorias.map(cat => (
                    <option key={'CAT:' + cat} value={'CAT:' + cat}>
                      Categoria: {cat} ({contagemPorCategoria[cat] || 0} itens)
                    </option>
                  ))}
                </optgroup>

                <optgroup label="Filtrar por Espécie de Madeira">
                  {especies.map(esp => (
                    <option key={'ESP:' + esp} value={'ESP:' + esp}>
                      Espécie: {esp} ({contagemPorEspecie[esp] || 0} itens)
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* PERCENTUAL */}
            <div style={{ width: '180px' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>Percentual (%):</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input 
                  type="number" 
                  step="0.5" 
                  min="0.1"
                  max={tipoReajuste === 'DESCONTO' ? 99.9 : 1000}
                  className="form-input font-mono" 
                  value={reajustePct}
                  onChange={e => setReajustePct(parseFloat(e.target.value) || 0)}
                  style={{ height: '38px', fontSize: '15px', fontWeight: 800, textAlign: 'right' }}
                />
                <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-secondary)' }}>%</span>
              </div>
            </div>

            {/* BOTÕES DE PRESET RÁPIDO */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '38px' }}>
              {[2, 5, 10, 15].map(p => (
                <button
                  key={p}
                  type="button"
                  className="reajuste-preset-btn"
                  onClick={() => setReajustePct(p)}
                  title={`Definir ${tipoReajuste === 'ACRESCIMO' ? '+' : '-'}${p}%`}
                >
                  {tipoReajuste === 'ACRESCIMO' ? `+${p}%` : `-${p}%`}
                </button>
              ))}
            </div>

            {/* BOTÃO PRINCIPAL DE APLICAÇÃO */}
            <button 
              type="button" 
              className={`btn ${tipoReajuste === 'ACRESCIMO' ? 'btn-primary' : 'btn-danger'}`}
              onClick={handleSolicitarReajuste}
              style={{ 
                fontWeight: 800, 
                height: '38px', 
                padding: '0 20px',
                backgroundColor: tipoReajuste === 'DESCONTO' ? '#DC2626' : undefined,
                borderColor: tipoReajuste === 'DESCONTO' ? '#B91C1C' : undefined,
                color: '#FFFFFF'
              }}
            >
              Aplicar {tipoReajuste === 'ACRESCIMO' ? 'Acréscimo' : 'Desconto'} em Massa
            </button>
          </div>

          {/* SIMULADOR EM TEMPO REAL & IMPACTO PREVISTO */}
          <div 
            style={{ 
              marginTop: '14px', 
              padding: '10px 14px', 
              borderRadius: 'var(--radius-md)', 
              background: tipoReajuste === 'ACRESCIMO' ? '#F0FDF4' : '#FEF2F2',
              border: `1px solid ${tipoReajuste === 'ACRESCIMO' ? '#BBF7D0' : '#FECACA'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              fontSize: '12.5px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span 
                style={{ 
                  fontWeight: 800, 
                  color: tipoReajuste === 'ACRESCIMO' ? '#047857' : '#B91C1C',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {tipoReajuste === 'ACRESCIMO' ? '📈 Acréscimo Previsto:' : '📉 Desconto Previsto:'}
                <span className="font-mono" style={{ fontSize: '13px' }}>
                  {tipoReajuste === 'ACRESCIMO' ? `+${reajustePct}%` : `-${reajustePct}%`}
                </span>
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>•</span>
              <span style={{ color: 'var(--text-secondary)' }}>
                Afetará: <strong>{produtosAlvo.length} produto(s)</strong> no alvo selecionado
              </span>
            </div>

            <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Simulação:</span>
              <span className="font-mono" style={{ fontWeight: 600 }}>R$ 100,00</span>
              <span>➔</span>
              <span 
                className="font-mono" 
                style={{ 
                  fontWeight: 800, 
                  color: tipoReajuste === 'ACRESCIMO' ? '#047857' : '#B91C1C' 
                }}
              >
                R$ {(100 * fatorAtual).toFixed(2)}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                ({tipoReajuste === 'ACRESCIMO' ? '+' : '-'}R$ {Math.abs(100 - (100 * fatorAtual)).toFixed(2)})
              </span>
            </div>
          </div>
        </div>
      </div>
      ) : (
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🔒</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Modo Consulta de Tabela de Preços
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                Visualização oficial de balcão. Reajuste em massa e alteração de valores de catálogo são exclusivos para <strong>Administradores</strong>.
              </div>
            </div>
          </div>
          <span className="badge-tag" style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #10B981', fontSize: '11px', fontWeight: 700, padding: '4px 8px' }}>
            ✓ Tabela Vigente
          </span>
        </div>
      )}

      {/* TABELA DE PREÇOS OFICIAL */}
      <div className="panel">
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="panel-title">Tabela Oficial de Preços</span>
            <span className="badge-tag" style={{ background: '#F1F5F9', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 700 }}>
              {filteredProducts.length} de {products.length} itens
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* FILTRAR POR CATEGORIA */}
            <select
              className="form-select"
              value={categoriaFilter}
              onChange={e => setCategoriaFilter(e.target.value)}
              style={{ width: '180px', fontSize: '12px', height: '32px' }}
            >
              <option value="TODAS">Todas as Categorias</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>
                  {cat} ({contagemPorCategoria[cat] || 0})
                </option>
              ))}
            </select>

            

            {/* FILTRAR POR TEXTO */}
            <input 
              type="text" 
              className="form-input" 
              placeholder="Buscar código ou produto..."
              style={{ width: '200px', fontSize: '12px', height: '32px' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="dense-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '85px' }}>Código</th>
                <th>Nome do Produto / Madeira</th>
                <th style={{ width: '180px' }}>Categorias</th>
                <th style={{ width: '60px' }} className="align-center">Unid.</th>
                <th style={{ width: '140px' }} className="align-right">Preço Unit. À Vista</th>
                <th style={{ width: '150px' }} className="align-right">Preço Unit. Bruto (+{pctBruto}%)</th>
                <th style={{ width: '100px' }} className="align-center">Estoque</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    Nenhum produto encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map(p => {
                  const precoAVista = parseFloat(p.preco_unitario) || 0;
                  const precoBruto = CalcEngine.calcularPrecoBruto(precoAVista, pctBruto);
                  const pCats = Array.isArray(p.categorias) && p.categorias.length > 0 
                    ? p.categorias 
                    : (p.categoria ? [p.categoria] : []);

                  return (
                    <tr key={p.id}>
                      <td className="font-mono" style={{ fontWeight: 700, color: 'var(--primary-green)' }}>
                        {p.codigo}
                      </td>
                      <td>
                        <strong>{p.nome}</strong>
                        {p.permite_plaina ? (
                          <span className="badge-tag" style={{ marginLeft: '6px', fontSize: '9.5px', background: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC', padding: '1px 5px', fontWeight: 700 }} title="Aceita plaina / aparelhamento">
                            Plaina
                          </span>
                        ) : null}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {pCats.length > 0 ? (
                            pCats.map(c => (
                              <span key={c} className="category-chip" style={{ fontSize: '10px', padding: '1px 6px' }}>
                                {c}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Geral</span>
                          )}
                        </div>
                      </td>
                      <td className="align-center font-mono">{p.tipo_calculo}</td>
                      <td className="align-right">
                        {isAdmin ? (
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                              <input 
                                type="number" 
                                step="0.10" 
                                min="0"
                                className="table-input font-mono" 
                                style={{ width: '92px', textAlign: 'right', fontWeight: 800, color: '#047857' }}
                                value={p.preco_unitario}
                                onChange={e => handleEditarPrecoDirect(p.id, e.target.value)}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-secondary"
                                style={{ padding: '2px 5px', height: '26px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}
                                onClick={() => handleAbrirFormador(p)}
                                title="Formar Preço: Custo Fornecedor + Margem %"
                              >
                                ⚡
                              </button>
                            </div>
                            {(p.preco_custo > 0 || p.margem_lucro_pct > 0) && (
                              <div style={{ fontSize: '9.5px', color: '#64748B', marginTop: '2px', textAlign: 'right' }}>
                                {p.preco_custo > 0 ? `Custo: ${CalcEngine.formatBRL(p.preco_custo)}` : ''}
                                {p.margem_lucro_pct > 0 ? ` (+${p.margem_lucro_pct}%)` : ''}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="font-mono" style={{ fontWeight: 800, color: '#047857', fontSize: '13px' }}>
                            {CalcEngine.formatBRL(precoAVista)}
                          </span>
                        )}
                      </td>
                      <td className="align-right font-mono" style={{ fontWeight: 800, color: '#1E40AF', fontSize: '13px' }}>
                        {CalcEngine.formatBRL(precoBruto)}
                      </td>
                      <td className="align-center font-mono">{p.estoque_atual || 0} un</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={filteredProducts.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel="produtos"
        />
      </div>

      {/* MODAL FORMADOR DE PREÇO (CUSTO FORNECEDOR + MARGEM % = PREÇO À VISTA & CARTÃO) */}
      {modalFormador.isOpen && modalFormador.product && (() => {
        const custoF = parseFloat(modalFormador.preco_custo) || 0;
        const precoF = parseFloat(modalFormador.preco_unitario) || 0;
        const lucroF = (custoF > 0 && precoF >= custoF) ? parseFloat((precoF - custoF).toFixed(2)) : 0;
        const precoBrutoF = CalcEngine.calcularPrecoBruto(modalFormador.preco_unitario, pctBruto);

        return (
          <div className="modal-overlay active" style={{ display: 'flex', zIndex: 1100 }}>
            <div className="modal-container" style={{ maxWidth: '640px', width: '92%' }}>
              <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🧮</span>
                    <span>Formador de Preço de Venda</span>
                  </span>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    <strong style={{ color: 'var(--primary-green)' }}>#{modalFormador.product.codigo}</strong> • <strong>{modalFormador.product.nome}</strong> ({modalFormador.product.tipo_calculo || 'UN'})
                  </div>
                </div>
                <button 
                  type="button" 
                  className="modal-close" 
                  onClick={() => setModalFormador({ isOpen: false, product: null, preco_custo: '', margem_lucro_pct: 30, preco_unitario: 0 })}
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', padding: '8px 12px', borderRadius: '6px', fontSize: '11.5px', color: '#92400E', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>🔒 <strong>Uso exclusivo do Administrador:</strong> Informe o preço que pagou ao vendedor e sua porcentagem de ganho para calcular a tabela automaticamente.</span>
                  {lucroF > 0 && (
                    <span className="font-mono" style={{ fontWeight: 800, color: '#047857', background: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #86EFAC', whiteSpace: 'nowrap', marginLeft: '6px' }}>
                      Lucro: +{CalcEngine.formatBRL(lucroF)}
                    </span>
                  )}
                </div>

                <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                  {/* JANELA 1: PREÇO DO VENDEDOR / CUSTO */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '11.5px', color: '#475569' }}>
                      1. Preço Fornecedor / Custo (R$):
                    </label>
                    <input 
                      type="number" 
                      step="0.05" 
                      min="0"
                      placeholder="Ex: 30,00"
                      className="form-input font-mono" 
                      style={{ height: '36px', fontSize: '13.5px', fontWeight: 700, background: '#FFFFFF' }}
                      value={modalFormador.preco_custo === '' ? '' : modalFormador.preco_custo}
                      onChange={e => handleFormadorCustoChange(e.target.value)}
                      title="Valor pago ao vendedor ou fornecedor da mercadoria"
                      autoFocus
                    />
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                      Quanto você pagou
                    </span>
                  </div>

                  {/* JANELA 2: MARGEM DE GANHO % */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '11.5px', color: '#475569' }}>
                      2. Margem de Ganho (%):
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="number" 
                        step="1" 
                        placeholder="Ex: 30"
                        className="form-input font-mono" 
                        style={{ height: '36px', fontSize: '13.5px', fontWeight: 700, paddingRight: '25px', background: '#FFFFFF' }}
                        value={modalFormador.margem_lucro_pct === '' ? '' : modalFormador.margem_lucro_pct}
                        onChange={e => handleFormadorMargemChange(e.target.value)}
                        title="Porcentagem de lucro sobre o custo"
                      />
                      <span style={{ position: 'absolute', right: '8px', top: '8px', fontSize: '13px', fontWeight: 700, color: '#64748B' }}>
                        %
                      </span>
                    </div>
                    {/* Botões rápidos */}
                    <div style={{ display: 'flex', gap: '3px', marginTop: '3px', flexWrap: 'wrap' }}>
                      {[20, 30, 40, 50, 100].map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => handleFormadorMargemChange(m)}
                          style={{
                            background: parseFloat(modalFormador.margem_lucro_pct) === m ? '#1E293B' : '#FFFFFF',
                            color: parseFloat(modalFormador.margem_lucro_pct) === m ? '#FFFFFF' : '#475569',
                            border: '1px solid #CBD5E1',
                            borderRadius: '3px',
                            padding: '1px 5px',
                            fontSize: '9.5px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          +{m}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* JANELA 3: PREÇO CERTO À VISTA */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 800, fontSize: '11.5px', color: '#047857' }}>
                      3. Preço Venda À Vista (R$):
                    </label>
                    <input 
                      type="number" 
                      step="0.05" 
                      min="0"
                      className="form-input font-mono" 
                      style={{ height: '36px', fontSize: '14px', fontWeight: 800, color: '#047857', border: '1.5px solid #10B981', background: '#ECFDF5' }}
                      value={modalFormador.preco_unitario === '' ? '' : modalFormador.preco_unitario}
                      onChange={e => handleFormadorPrecoUnitarioChange(e.target.value)}
                      placeholder="0,00"
                      title="Preço oficial de venda à vista (Pix e Dinheiro)"
                    />
                    <span style={{ fontSize: '10px', color: '#065F46', marginTop: '2px', display: 'block', fontWeight: 600 }}>
                      Pix ou Dinheiro (Tabela)
                    </span>
                  </div>

                  {/* JANELA 4: PREÇO NO CARTÃO (+20%) */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 800, fontSize: '11.5px', color: '#1E40AF' }}>
                      4. Preço no Cartão (+{pctBruto}%):
                    </label>
                    <div 
                      className="form-input font-mono" 
                      style={{ height: '36px', fontSize: '14px', fontWeight: 800, color: '#1E40AF', background: '#EFF6FF', border: '1.5px solid #93C5FD', display: 'flex', alignItems: 'center' }}
                    >
                      {CalcEngine.formatBRL(precoBrutoF)}
                    </div>
                    <span style={{ fontSize: '10px', color: '#1D4ED8', marginTop: '2px', display: 'block', fontWeight: 600 }}>
                      Até 5x no Cartão
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 16px', background: '#F8FAFC', borderTop: '1px solid var(--border-light)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalFormador({ isOpen: false, product: null, preco_custo: '', margem_lucro_pct: 30, preco_unitario: 0 })}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSalvarFormadorPreco}
                  style={{ fontWeight: 800, background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Salvar Preço de Tabela</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL DE GERENCIAMENTO DE CATEGORIAS */}
      <GerenciadorCategoriasModal 
        isOpen={isGerenciadorOpen}
        onClose={() => setIsGerenciadorOpen(false)}
      />

      {/* MODAL DE CONFIRMAÇÃO DO REAJUSTE COLETIVO */}
      {modalConfirmacao.isOpen && (
        <div className="modal-overlay active" style={{ display: 'flex' }} onClick={() => setModalConfirmacao(prev => ({ ...prev, isOpen: false }))}>
          <div 
            className="modal-container" 
            style={{ maxWidth: '640px' }} 
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-title" style={{ color: modalConfirmacao.tipo === 'ACRESCIMO' ? '#047857' : '#DC2626' }}>
                {modalConfirmacao.tipo === 'ACRESCIMO' ? 'Confirmar Acréscimo em Massa' : 'Confirmar Desconto em Massa'}
              </span>
              <button className="modal-close" onClick={() => setModalConfirmacao(prev => ({ ...prev, isOpen: false }))}>&times;</button>
            </div>

            <div className="modal-body">
              <div 
                style={{ 
                  background: modalConfirmacao.tipo === 'ACRESCIMO' ? '#ECFDF5' : '#FEF2F2',
                  border: `1.5px solid ${modalConfirmacao.tipo === 'ACRESCIMO' ? '#6EE7B7' : '#FCA5A5'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  marginBottom: '14px'
                }}
              >
                <div style={{ fontSize: '15px', fontWeight: 800, color: modalConfirmacao.tipo === 'ACRESCIMO' ? '#047857' : '#B91C1C', marginBottom: '6px' }}>
                  {modalConfirmacao.tipo === 'ACRESCIMO' ? '📈 Acréscimo de +' : '📉 Desconto de -'}{modalConfirmacao.percentual}%
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  <strong>Alvo:</strong> {modalConfirmacao.alvoLabel}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Total de produtos que terão seus preços alterados: <strong>{modalConfirmacao.produtosAfetados.length} itens</strong>
                </div>
              </div>

              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                Prévia de Preços (Primeiros Itens Afetados):
              </div>

              <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', maxHeight: '200px', overflowY: 'auto' }}>
                <table className="dense-table" style={{ width: '100%', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Produto</th>
                      <th className="align-right">Preço Atual</th>
                      <th className="align-right">Novo Preço</th>
                      <th className="align-right">Diferença</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalConfirmacao.produtosAfetados.slice(0, 5).map(p => {
                      const atual = parseFloat(p.preco_unitario) || 0;
                      const novo = Math.max(0.01, parseFloat((atual * modalConfirmacao.fator).toFixed(2)));
                      const diff = novo - atual;

                      return (
                        <tr key={p.id}>
                          <td className="font-mono" style={{ fontWeight: 700 }}>{p.codigo}</td>
                          <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nome}</td>
                          <td className="align-right font-mono">{CalcEngine.formatBRL(atual)}</td>
                          <td className="align-right font-mono" style={{ fontWeight: 800, color: modalConfirmacao.tipo === 'ACRESCIMO' ? '#047857' : '#DC2626' }}>
                            {CalcEngine.formatBRL(novo)}
                          </td>
                          <td className="align-right font-mono" style={{ fontSize: '11px', color: diff >= 0 ? '#047857' : '#DC2626' }}>
                            {diff >= 0 ? `+${CalcEngine.formatBRL(diff)}` : `-${CalcEngine.formatBRL(Math.abs(diff))}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '12px' }}>
                ⚠️ Esta alteração atualiza a tabela oficial de preços no banco de dados e afetará imediatamente todos os novos orçamentos e vendas de balcão.
              </p>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setModalConfirmacao(prev => ({ ...prev, isOpen: false }))}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className={`btn ${modalConfirmacao.tipo === 'ACRESCIMO' ? 'btn-primary' : 'btn-danger'}`}
                onClick={handleConfirmarReajuste}
                style={{ 
                  fontWeight: 800,
                  backgroundColor: modalConfirmacao.tipo === 'DESCONTO' ? '#DC2626' : undefined,
                  borderColor: modalConfirmacao.tipo === 'DESCONTO' ? '#B91C1C' : undefined,
                  color: '#FFFFFF'
                }}
              >
                Sim, Aplicar Reajuste Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
