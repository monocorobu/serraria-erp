import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { CalcEngine } from '../../services/calc.js';
import { DB } from '../../services/data.js';
import { GerenciadorCategoriasModal } from '../modals/GerenciadorCategoriasModal.jsx';
import Pagination from '../common/Pagination.jsx';

export const EstoqueTab = () => {
  const { 
    products, 
    updateProduct, 
    deleteProduct,
    adjustStock, 
    showToast, 
    config, 
    categorias, 
    salvarCategoria,
    isAdmin 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('TODAS');
  const [statusEstoqueFilter, setStatusEstoqueFilter] = useState('TODOS'); // 'TODOS' | 'ZERADOS' | 'BAIXO' | 'ATENCAO' | 'NORMAL'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isGerenciadorOpen, setIsGerenciadorOpen] = useState(false);

  // Modal Produto (Novo ou Edição)
  const [modalProduto, setModalProduto] = useState({
    isOpen: false,
    isEdit: false
  });

  const [formProduto, setFormProduto] = useState({
    id: '',
    codigo: '',
    nome: '',
    categorias: [],
    especie: 'Garapeira',
    tipo_calculo: 'ML',
    largura_cm: 12,
    espessura_cm: 6,
    comprimento_padrao_m: 4.5,
    densidade_kg_m3: 750,
    preco_unitario: 24.50,
    estoque_atual: 100,
    estoque_minimo: 20
  });

  const [novaCatInline, setNovaCatInline] = useState('');

  // Modal Ajuste de Saldo
  const [modalAjuste, setModalAjuste] = useState({
    isOpen: false,
    product: null,
    novoSaldo: 0
  });

  // Modal de Confirmação para Excluir Produto
  const [modalExcluir, setModalExcluir] = useState({
    isOpen: false,
    product: null
  });

  // Normalização de texto para validação de unicidade de nome
  const normalizarNome = (str) => {
    return (str || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');
  };

  // Verifica produto duplicado em tempo real enquanto o usuário digita
  const produtoDuplicado = useMemo(() => {
    const nomeDigitado = (formProduto.nome || '').trim();
    if (!nomeDigitado) return null;
    const norm = normalizarNome(nomeDigitado);
    return products.find(p => p.id !== formProduto.id && normalizarNome(p.nome) === norm) || null;
  }, [formProduto.nome, formProduto.id, products]);

  const pctBruto = config.percentual_preco_bruto !== undefined ? config.percentual_preco_bruto : CalcEngine.getPercentualPrecoBruto();

  // Contagem de produtos por categoria
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

  // Filtragem de produtos
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const saldo = parseFloat(p.estoque_atual) || 0;
      const min = parseFloat(p.estoque_minimo) || 10;
      const isZerado = saldo <= 0;
      const isBaixo = saldo > 0 && saldo <= min;

      if (statusEstoqueFilter === 'ZERADOS' && !isZerado) return false;
      if (statusEstoqueFilter === 'BAIXO' && !isBaixo) return false;
      if (statusEstoqueFilter === 'ATENCAO' && (!isZerado && !isBaixo)) return false;
      if (statusEstoqueFilter === 'NORMAL' && (isZerado || isBaixo)) return false;

      if (categoriaFilter !== 'TODAS') {
        const pCats = Array.isArray(p.categorias) && p.categorias.length > 0 
          ? p.categorias 
          : (p.categoria ? [p.categoria] : []);
        if (!pCats.includes(categoriaFilter)) return false;
      }
      if (searchTerm.trim()) {
        const t = searchTerm.toLowerCase();
        const cod = (p.codigo || '').toLowerCase();
        const nome = (p.nome || '').toLowerCase();
        const esp = (p.especie || '').toLowerCase();
        const cats = (Array.isArray(p.categorias) ? p.categorias.join(' ') : (p.categoria || '')).toLowerCase();
        if (!cod.includes(t) && !nome.includes(t) && !esp.includes(t) && !cats.includes(t)) return false;
      }
      return true;
    });
  }, [products, statusEstoqueFilter, categoriaFilter, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, safeCurrentPage, pageSize]);

  // KPIs de Estoque
  const kpis = useMemo(() => {
    const totalItens = products.length;
    const zerados = products.filter(p => (parseFloat(p.estoque_atual) || 0) <= 0).length;
    const baixos = products.filter(p => {
      const at = parseFloat(p.estoque_atual) || 0;
      const min = parseFloat(p.estoque_minimo) || 10;
      return at > 0 && at <= min;
    }).length;
    return { totalItens, zerados, baixos };
  }, [products]);

  // Abrir modal para novo produto
  const handleAbrirNovo = () => {
    const proximoCodigo = DB.gerarProximoCodigo();
    setFormProduto({
      id: '',
      codigo: proximoCodigo,
      nome: '',
      categorias: [],
      especie: '',
      tipo_calculo: 'ML',
      permite_plaina: false,
      largura_cm: '',
      espessura_cm: '',
      comprimento_padrao_m: '',
      densidade_kg_m3: '',
      preco_unitario: '',
      estoque_atual: '',
      estoque_minimo: ''
    });
    setNovaCatInline('');
    setModalProduto({ isOpen: true, isEdit: false });
  };

  // Abrir modal para editar produto existente
  const handleAbrirEditar = (prod) => {
    const pCats = Array.isArray(prod.categorias) && prod.categorias.length > 0 
      ? [...prod.categorias] 
      : (prod.categoria ? [prod.categoria] : []);

    setFormProduto({
      id: prod.id,
      codigo: prod.codigo || '',
      nome: prod.nome || '',
      categorias: pCats,
      especie: prod.especie || 'Garapeira',
      tipo_calculo: prod.tipo_calculo || 'ML',
      permite_plaina: prod.permite_plaina !== undefined ? Boolean(prod.permite_plaina) : (prod.tipo_calculo === 'ML' || prod.tipo_calculo === 'M2'),
      largura_cm: prod.largura_cm || 0,
      espessura_cm: prod.espessura_cm || 0,
      comprimento_padrao_m: prod.comprimento_padrao_m || 3.0,
      densidade_kg_m3: prod.densidade_kg_m3 || 750,
      preco_unitario: prod.preco_unitario || 0,
      estoque_atual: prod.estoque_atual || 0,
      estoque_minimo: prod.estoque_minimo || 10
    });
    setNovaCatInline('');
    setModalProduto({ isOpen: true, isEdit: true });
  };

  // Toggle categoria selecionada
  const handleToggleCategoria = (catNome) => {
    setFormProduto(prev => {
      const exists = prev.categorias.includes(catNome);
      const updated = exists 
        ? prev.categorias.filter(c => c !== catNome)
        : [...prev.categorias, catNome];
      return { ...prev, categorias: updated };
    });
  };

  // Criar categoria inline dentro do modal
  const handleCriarCategoriaInline = (e) => {
    e.preventDefault();
    const nomeLimpo = novaCatInline.trim();
    if (!nomeLimpo) return;

    salvarCategoria(nomeLimpo);
    setFormProduto(prev => {
      if (!prev.categorias.includes(nomeLimpo)) {
        return { ...prev, categorias: [...prev.categorias, nomeLimpo] };
      }
      return prev;
    });
    setNovaCatInline('');
  };

  // Salvar produto
  const handleSalvarProduto = (e) => {
    e.preventDefault();
    const nomeLimpo = (formProduto.nome || '').trim();
    if (!nomeLimpo || !formProduto.codigo) {
      showToast('Preencha pelo menos o código e o nome do produto.', 'warning');
      return;
    }

    if (produtoDuplicado) {
      showToast(`Não é permitido cadastrar produtos com o mesmo nome! Já existe o produto "${produtoDuplicado.nome}" (Código: ${produtoDuplicado.codigo}).`, 'warning');
      return;
    }

    const savedProd = {
      ...formProduto,
      id: formProduto.id || ('prod_' + Date.now()),
      nome: nomeLimpo,
      permite_plaina: Boolean(formProduto.permite_plaina),
      categorias: formProduto.categorias.length > 0 ? formProduto.categorias : ['Geral'],
      categoria: formProduto.categorias[0] || 'Geral',
      preco_unitario: Math.max(0, parseFloat(formProduto.preco_unitario) || 0),
      estoque_atual: Math.max(0, parseFloat(formProduto.estoque_atual) || 0),
      estoque_minimo: Math.max(0, parseFloat(formProduto.estoque_minimo) || 0),
      largura_cm: parseFloat(formProduto.largura_cm) || 0,
      espessura_cm: parseFloat(formProduto.espessura_cm) || 0,
      comprimento_padrao_m: parseFloat(formProduto.comprimento_padrao_m) || 0
    };

    const res = updateProduct(savedProd);
    if (res) {
      setModalProduto({ isOpen: false, isEdit: false });
    }
  };

  // Solicitar exclusão com modal de confirmação (restrito a admin)
  const handleSolicitarExcluir = (prod) => {
    if (!isAdmin) {
      showToast('Apenas administradores possuem permissão para excluir produtos do catálogo.', 'error');
      return;
    }
    setModalExcluir({
      isOpen: true,
      product: prod
    });
  };

  // Confirmar exclusão do produto
  const handleConfirmarExcluir = () => {
    if (!modalExcluir.product) return;
    const p = modalExcluir.product;
    deleteProduct(p.id);
    showToast(`Produto "${p.nome}" (${p.codigo}) foi apagado do estoque com sucesso.`, 'info');
    setModalExcluir({ isOpen: false, product: null });
    if (modalProduto.isOpen && formProduto.id === p.id) {
      setModalProduto({ isOpen: false, isEdit: false });
    }
  };

  // Confirmar ajuste físico de estoque
  const handleConfirmarAjuste = () => {
    if (!modalAjuste.product) return;
    adjustStock(modalAjuste.product.id, modalAjuste.novoSaldo, true);
    setModalAjuste({ isOpen: false, product: null, novoSaldo: 0 });
    showToast(`Estoque de "${modalAjuste.product.nome}" atualizado para ${modalAjuste.novoSaldo} un.`, 'success');
  };

  return (
    <div className="estoque-layout">
      {/* KPIS DE ESTOQUE INTERATIVOS (CLIQUE PARA FILTRAR) */}
      <div className="kpi-grid">
        <div 
          className="kpi-card" 
          onClick={() => { setStatusEstoqueFilter('TODOS'); setCurrentPage(1); }}
          style={{ 
            padding: '14px 16px', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: statusEstoqueFilter === 'TODOS' ? '#F0FDF4' : '#FFFFFF', 
            border: statusEstoqueFilter === 'TODOS' ? '2px solid #059669' : '1.5px solid var(--border-medium)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: statusEstoqueFilter === 'TODOS' ? '0 2px 8px rgba(5,150,105,0.15)' : 'none'
          }}
          title="Clique para ver todos os produtos"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-secondary)' }}>Total de Produtos no Pátio</span>
            {statusEstoqueFilter === 'TODOS' && (
              <span style={{ fontSize: '10px', background: '#059669', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>Todos</span>
            )}
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{kpis.totalItens} itens</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Clique para ver catálogo completo</div>
        </div>

        <div 
          className="kpi-card" 
          onClick={() => {
            setStatusEstoqueFilter(prev => prev === 'BAIXO' ? 'TODOS' : 'BAIXO');
            setCurrentPage(1);
          }}
          style={{ 
            padding: '14px 16px', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: statusEstoqueFilter === 'BAIXO' ? '#FFFBEB' : '#FFFFFF', 
            border: statusEstoqueFilter === 'BAIXO' ? '2px solid #D97706' : '1.5px solid var(--border-medium)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: statusEstoqueFilter === 'BAIXO' ? '0 2px 8px rgba(217,119,6,0.15)' : 'none'
          }}
          title="Clique para filtrar apenas produtos com estoque baixo (≤ mínimo)"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#D97706' }}>Estoque Baixo (&le; Mínimo)</span>
            {statusEstoqueFilter === 'BAIXO' && (
              <span style={{ fontSize: '10px', background: '#D97706', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>Ativo</span>
            )}
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>{kpis.baixos} itens</div>
          <div style={{ fontSize: '11px', color: statusEstoqueFilter === 'BAIXO' ? '#B45309' : 'var(--text-muted)', marginTop: '2px', fontWeight: statusEstoqueFilter === 'BAIXO' ? 700 : 400 }}>
            {statusEstoqueFilter === 'BAIXO' ? '✓ Filtrando estoque baixo (clique p/ limpar)' : '⚡ Clique para filtrar estoque baixo'}
          </div>
        </div>

        <div 
          className="kpi-card" 
          onClick={() => {
            setStatusEstoqueFilter(prev => prev === 'ZERADOS' ? 'TODOS' : 'ZERADOS');
            setCurrentPage(1);
          }}
          style={{ 
            padding: '14px 16px', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: statusEstoqueFilter === 'ZERADOS' ? '#FEF2F2' : '#FFFFFF', 
            border: statusEstoqueFilter === 'ZERADOS' ? '2px solid #DC2626' : '1.5px solid var(--border-medium)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: statusEstoqueFilter === 'ZERADOS' ? '0 2px 8px rgba(220,38,38,0.15)' : 'none'
          }}
          title="Clique para filtrar apenas produtos com estoque zerado"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#DC2626' }}>Estoque Crítico (Zerados)</span>
            {statusEstoqueFilter === 'ZERADOS' && (
              <span style={{ fontSize: '10px', background: '#DC2626', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>Ativo</span>
            )}
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626', marginTop: '4px' }}>{kpis.zerados} itens</div>
          <div style={{ fontSize: '11px', color: statusEstoqueFilter === 'ZERADOS' ? '#B91C1C' : 'var(--text-muted)', marginTop: '2px', fontWeight: statusEstoqueFilter === 'ZERADOS' ? 700 : 400 }}>
            {statusEstoqueFilter === 'ZERADOS' ? '✓ Filtrando zerados (clique p/ limpar)' : '⚡ Clique para filtrar zerados'}
          </div>
        </div>
      </div>

      {/* BARRA DE FILTROS & AÇÃO */}
      <div className="panel" style={{ marginBottom: '14px' }}>
        <div className="panel-body" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Buscar por Código, Madeira, Espécie ou Categoria..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* FILTRAR POR STATUS DE SALDO */}
              <select 
                className="form-select font-mono"
                style={{ 
                  width: '210px', 
                  fontWeight: statusEstoqueFilter !== 'TODOS' ? 700 : 500,
                  borderColor: statusEstoqueFilter === 'ZERADOS' ? '#DC2626' : (statusEstoqueFilter === 'BAIXO' ? '#D97706' : (statusEstoqueFilter === 'ATENCAO' ? '#EA580C' : 'inherit')),
                  backgroundColor: statusEstoqueFilter === 'ZERADOS' ? '#FEF2F2' : (statusEstoqueFilter === 'BAIXO' ? '#FFFBEB' : (statusEstoqueFilter === 'ATENCAO' ? '#FFF7ED' : 'inherit'))
                }}
                value={statusEstoqueFilter}
                onChange={e => {
                  setStatusEstoqueFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="TODOS">Todos os Saldos ({products.length})</option>
                <option value="ZERADOS">🔴 Apenas Zerados ({kpis.zerados})</option>
                <option value="BAIXO">🟡 Apenas Baixo ({kpis.baixos})</option>
                <option value="ATENCAO">⚠️ Zerados ou Baixo ({kpis.zerados + kpis.baixos})</option>
                <option value="NORMAL">🟢 Saldo Normal</option>
              </select>

              {/* FILTRAR POR CATEGORIA DINÂMICA */}
              <select 
                className="form-select"
                style={{ width: '190px' }}
                value={categoriaFilter}
                onChange={e => { setCategoriaFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="TODAS">Todas as Categorias ({products.length})</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>
                    {cat} ({contagemPorCategoria[cat] || 0})
                  </option>
                ))}
              </select>

              {statusEstoqueFilter !== 'TODOS' && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setStatusEstoqueFilter('TODOS'); setCurrentPage(1); }}
                  style={{ color: '#DC2626', borderColor: '#FECACA', fontWeight: 600, fontSize: '11.5px' }}
                  title="Limpar filtro de saldo"
                >
                  Limpar Filtro &times;
                </button>
              )}

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsGerenciadorOpen(true)}
                style={{ fontWeight: 600, gap: '6px' }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
                Categorias ({categorias.length})
              </button>

              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleAbrirNovo}
                style={{ fontWeight: 700 }}
              >
                + Novo Produto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABELA DE ESTOQUE */}
      <div className="panel">
        <div className="table-responsive">
          <table className="dense-table estoque-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '70px', whiteSpace: 'nowrap' }}>Código</th>
                <th>Descrição do Produto & Espécie</th>
                <th style={{ width: '135px' }}>Categorias</th>
                <th style={{ width: '45px', whiteSpace: 'nowrap' }} className="align-center">Unid.</th>
                <th style={{ width: '95px', whiteSpace: 'nowrap' }} className="align-right">Preço À Vista</th>
                <th style={{ width: '105px', whiteSpace: 'nowrap' }} className="align-right">Preço Bruto (+{pctBruto}%)</th>
                <th style={{ width: '80px', whiteSpace: 'nowrap' }} className="align-center">Saldo Atual</th>
                <th style={{ width: '75px', whiteSpace: 'nowrap' }} className="align-center">Status</th>
                <th style={{ width: '155px', whiteSpace: 'nowrap' }} className="align-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    Nenhum produto encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map(p => {
                  const saldo = parseFloat(p.estoque_atual) || 0;
                  const min = parseFloat(p.estoque_minimo) || 10;
                  const isZerado = saldo <= 0;
                  const isBaixo = saldo > 0 && saldo <= min;
                  const precoAVista = parseFloat(p.preco_unitario) || 0;
                  const precoBruto = CalcEngine.calcularPrecoBruto(precoAVista, pctBruto);
                  const pCats = Array.isArray(p.categorias) && p.categorias.length > 0 
                    ? p.categorias 
                    : (p.categoria ? [p.categoria] : []);

                  return (
                    <tr key={p.id}>
                      <td className="font-mono" style={{ fontWeight: 700, color: 'var(--primary-green)', whiteSpace: 'nowrap' }}>
                        {p.codigo}
                      </td>
                      <td>
                        <strong>{p.nome}</strong>
                        {p.especie && <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '6px' }}>({p.especie})</span>}
                        {p.largura_cm ? (
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '6px', fontFamily: 'var(--font-mono)' }}>
                            [{p.espessura_cm || 0}x{p.largura_cm}cm]
                          </span>
                        ) : null}
                        {p.permite_plaina ? (
                          <span className="badge-tag" style={{ marginLeft: '6px', fontSize: '9.5px', background: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC', padding: '1px 5px', fontWeight: 700 }} title="Aceita plaina / aparelhamento">
                            Plaina
                          </span>
                        ) : null}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                          {pCats.length > 0 ? (
                            pCats.map(c => (
                              <span key={c} className="category-chip" style={{ fontSize: '10px', padding: '1px 5px', whiteSpace: 'nowrap' }}>
                                {c}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Geral</span>
                          )}
                        </div>
                      </td>
                      <td className="align-center font-mono" style={{ whiteSpace: 'nowrap' }}>{p.tipo_calculo}</td>
                      <td className="align-right font-mono" style={{ fontWeight: 700, color: '#047857', whiteSpace: 'nowrap' }}>
                        {CalcEngine.formatBRL(precoAVista)}
                      </td>
                      <td className="align-right font-mono" style={{ fontWeight: 700, color: '#1E40AF', whiteSpace: 'nowrap' }}>
                        {CalcEngine.formatBRL(precoBruto)}
                      </td>
                      <td className="align-center font-mono" style={{ fontWeight: 800, fontSize: '12.5px', whiteSpace: 'nowrap' }}>
                        {saldo} un
                      </td>
                      <td className="align-center">
                        {isZerado ? (
                          <span className="badge-tag" style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5', fontSize: '10px', fontWeight: 700 }}>
                            Zerado
                          </span>
                        ) : isBaixo ? (
                          <span className="badge-tag" style={{ background: '#FEF3C7', color: '#D97706', border: '1px solid #FCD34D', fontSize: '10px', fontWeight: 700 }}>
                            Baixo
                          </span>
                        ) : (
                          <span className="badge-tag" style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #10B981', fontSize: '10px', fontWeight: 700 }}>
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="align-center">
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
                          <button 
                            type="button"
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '11px', padding: '2px 6px', height: '24px' }}
                            onClick={() => handleAbrirEditar(p)}
                            title="Editar Dados e Categorias do Produto"
                          >
                            Editar
                          </button>
                          <button 
                            type="button"
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '11px', padding: '2px 6px', height: '24px' }}
                            onClick={() => setModalAjuste({ isOpen: true, product: p, novoSaldo: saldo })}
                            title="Ajustar Saldo Físico em Estoque"
                          >
                            Saldo
                          </button>
                          {isAdmin && (
                            <button 
                              type="button"
                              className="btn btn-sm" 
                              style={{ 
                                fontSize: '11px', 
                                padding: '2px 6px', 
                                height: '24px',
                                background: '#FEE2E2', 
                                color: '#DC2626', 
                                border: '1px solid #FCA5A5',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                cursor: 'pointer'
                              }}
                              onClick={() => handleSolicitarExcluir(p)}
                              title={`Apagar ${p.nome} do estoque`}
                            >
                              <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" fill="none" strokeWidth="2.2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                              <span>Apagar</span>
                            </button>
                          )}
                        </div>
                      </td>
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

      {/* MODAL NOVO / EDITAR PRODUTO COM MULTI-CATEGORIAS */}
      {modalProduto.isOpen && (
        <div className="modal-overlay active" style={{ display: 'flex' }} onClick={() => setModalProduto({ isOpen: false, isEdit: false })}>
          <div 
            className="modal-container" 
            style={{ maxWidth: '640px', maxHeight: '90vh' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-title">
                {modalProduto.isEdit ? `Editar Produto: ${formProduto.nome || formProduto.codigo}` : 'Novo Produto / Madeira'}
              </span>
              <button className="modal-close" onClick={() => setModalProduto({ isOpen: false, isEdit: false })}>&times;</button>
            </div>
            <form onSubmit={handleSalvarProduto} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div className="modal-body" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* CÓDIGO E NOME */}
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
                  <div className="form-group">
                    <label className="form-label">Código:</label>
                    <input 
                      type="text" 
                      className="form-input font-mono" 
                      placeholder="Ex: MAT-1050" 
                      required
                      value={formProduto.codigo}
                      onChange={e => setFormProduto(prev => ({ ...prev, codigo: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nome do Produto:</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Prancha Garapeira 4x20" 
                      required
                      value={formProduto.nome}
                      onChange={e => setFormProduto(prev => ({ ...prev, nome: e.target.value }))}
                      style={produtoDuplicado ? { borderColor: '#DC2626', backgroundColor: '#FEF2F2' } : {}}
                    />
                    {produtoDuplicado && (
                      <div style={{ color: '#DC2626', fontSize: '11px', marginTop: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" strokeWidth="2.4"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <span>Já existe um produto com este nome: <strong>"{produtoDuplicado.nome}"</strong> ({produtoDuplicado.codigo})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* MULTI-CATEGORIAS SECTION */}
                <div style={{ background: '#F8FAFC', border: '1.5px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="form-label" style={{ fontWeight: 700, margin: 0 }}>
                      Categorias Vinculadas ({formProduto.categorias.length}):
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Pode selecionar mais de uma categoria
                    </span>
                  </div>

                  {/* CHIPS SELECIONADOS */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', minHeight: '32px', alignItems: 'center', marginBottom: '10px' }}>
                    {formProduto.categorias.length === 0 ? (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Nenhuma categoria selecionada. Clique nas opções abaixo para vincular:
                      </span>
                    ) : (
                      formProduto.categorias.map(cat => (
                        <span key={cat} className="category-chip">
                          {cat}
                          <button
                            type="button"
                            className="category-chip-remove"
                            onClick={() => handleToggleCategoria(cat)}
                            title="Remover Categoria"
                          >
                            &times;
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* NUVEM DE CATEGORIAS DISPONÍVEIS PARA SELEÇÃO */}
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Clique para adicionar ou remover:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxHeight: '110px', overflowY: 'auto', marginBottom: '10px', paddingRight: '4px' }}>
                    {categorias.map(cat => {
                      const isSelected = formProduto.categorias.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          className={`category-pill-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => handleToggleCategoria(cat)}
                        >
                          {isSelected ? '✓ ' : '+ '}{cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* CRIAR NOVA CATEGORIA INLINE */}
                  <div style={{ display: 'flex', gap: '6px', paddingTop: '8px', borderTop: '1px solid #E2E8F0' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Criar nova categoria e vincular..."
                      value={novaCatInline}
                      onChange={e => setNovaCatInline(e.target.value)}
                      style={{ fontSize: '12px', padding: '4px 10px', height: '30px' }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCriarCategoriaInline(e);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={handleCriarCategoriaInline}
                      style={{ fontWeight: 700, height: '30px', whiteSpace: 'nowrap' }}
                    >
                      + Criar e Vincular
                    </button>
                  </div>
                </div>

                {/* TIPO DE CÁLCULO E PREÇOS */}
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Tipo de Cálculo:</label>
                    <select 
                      className="form-select"
                      value={formProduto.tipo_calculo}
                      onChange={e => setFormProduto(prev => ({ ...prev, tipo_calculo: e.target.value }))}
                    >
                      <option value="ML">ML (Metro Linear)</option>
                      <option value="M2">M² (Metro Quadrado)</option>
                      <option value="M3">M³ (Metro Cúbico)</option>
                      <option value="UN">UN (Peça / Unidade)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preço À Vista (R$):</label>
                    <input 
                      type="number" 
                      step="0.05" 
                      min="0"
                      className="form-input font-mono" 
                      value={formProduto.preco_unitario}
                      onChange={e => setFormProduto(prev => ({ ...prev, preco_unitario: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preço Bruto (+{pctBruto}%):</label>
                    <div className="form-input font-mono" style={{ backgroundColor: 'var(--bg-hover)', fontWeight: 700, color: '#1E40AF', display: 'flex', alignItems: 'center' }}>
                      {CalcEngine.formatBRL(CalcEngine.calcularPrecoBruto(formProduto.preco_unitario, pctBruto))}
                    </div>
                  </div>
                </div>

                {/* DIMENSÕES E ESPÉCIE */}
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Espécie / Material:</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Garapeira, Tauari, Pinus..." 
                      value={formProduto.especie}
                      onChange={e => setFormProduto(prev => ({ ...prev, especie: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Largura (cm):</label>
                    <input 
                      type="number" 
                      step="0.5"
                      min="0"
                      className="form-input font-mono" 
                      value={formProduto.largura_cm}
                      onChange={e => setFormProduto(prev => ({ ...prev, largura_cm: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Espessura (cm):</label>
                    <input 
                      type="number" 
                      step="0.5"
                      min="0"
                      className="form-input font-mono" 
                      value={formProduto.espessura_cm}
                      onChange={e => setFormProduto(prev => ({ ...prev, espessura_cm: e.target.value }))}
                    />
                  </div>
                </div>

                {/* PERMISSÃO DE PLAINA / APARELHAMENTO */}
                <div style={{
                  padding: '8px 12px',
                  background: formProduto.permite_plaina ? '#F0FDF4' : '#F8FAFC',
                  border: `1.5px solid ${formProduto.permite_plaina ? '#86EFAC' : '#E2E8F0'}`,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                      <input 
                        type="checkbox" 
                        style={{ width: '18px', height: '18px', accentColor: '#059669', cursor: 'pointer' }}
                        checked={Boolean(formProduto.permite_plaina)}
                        onChange={e => setFormProduto(prev => ({ ...prev, permite_plaina: e.target.checked }))}
                      />
                      <span style={{ fontWeight: 700, fontSize: '13px', color: formProduto.permite_plaina ? '#15803D' : 'var(--text-primary)' }}>
                        Aceita Plaina / Aparelhamento na Serraria
                      </span>
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginLeft: '26px', marginTop: '2px' }}>
                      Se marcado, os atendentes poderão marcar a opção "Plainar" para esta madeira no balcão de vendas.
                    </span>
                  </div>
                  <span className="badge-tag" style={{
                    backgroundColor: formProduto.permite_plaina ? '#DCFCE7' : '#F1F5F9',
                    color: formProduto.permite_plaina ? '#166534' : 'var(--text-muted)',
                    border: `1.5px solid ${formProduto.permite_plaina ? '#86EFAC' : '#CBD5E1'}`,
                    fontWeight: 700,
                    fontSize: '11px',
                    padding: '3px 8px'
                  }}>
                    {formProduto.permite_plaina ? 'Plaina Habilitada' : 'Sem Plaina'}
                  </span>
                </div>

                {/* ESTOQUE */}
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Estoque Atual / Inicial:</label>
                    <input 
                      type="number" 
                      min="0"
                      className="form-input font-mono" 
                      value={formProduto.estoque_atual}
                      onChange={e => setFormProduto(prev => ({ ...prev, estoque_atual: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Estoque Mínimo de Alerta:</label>
                    <input 
                      type="number" 
                      min="0"
                      className="form-input font-mono" 
                      value={formProduto.estoque_minimo}
                      onChange={e => setFormProduto(prev => ({ ...prev, estoque_minimo: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <div>
                  {modalProduto.isEdit && (
                    <button
                      type="button"
                      className="btn btn-sm"
                      style={{
                        background: '#FEE2E2',
                        color: '#DC2626',
                        border: '1px solid #FCA5A5',
                        fontWeight: 600,
                        fontSize: '11.5px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        const prod = products.find(p => p.id === formProduto.id) || formProduto;
                        handleSolicitarExcluir(prod);
                      }}
                      title="Excluir este produto do catálogo"
                    >
                      <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="2.2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      <span>Excluir Produto</span>
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setModalProduto({ isOpen: false, isEdit: false })}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ 
                      fontWeight: 700, 
                      opacity: produtoDuplicado ? 0.6 : 1, 
                      cursor: produtoDuplicado ? 'not-allowed' : 'pointer' 
                    }}
                    disabled={!!produtoDuplicado}
                  >
                    {modalProduto.isEdit ? 'Salvar Alterações' : 'Cadastrar Produto'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AJUSTE DE SALDO FÍSICO */}
      {modalAjuste.isOpen && (
        <div className="modal-overlay active" style={{ display: 'flex' }} onClick={() => setModalAjuste({ isOpen: false, product: null, novoSaldo: 0 })}>
          <div className="modal-container" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Ajuste de Saldo de Estoque</span>
              <button className="modal-close" onClick={() => setModalAjuste({ isOpen: false, product: null, novoSaldo: 0 })}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '12px' }}>
                <strong>{modalAjuste.product?.nome}</strong> ({modalAjuste.product?.codigo})
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Saldo atual registrado: {modalAjuste.product?.estoque_atual} un</div>
              </div>
              <div className="form-group">
                <label className="form-label">Novo Saldo Real Contado no Pátio:</label>
                <input 
                  type="number" 
                  min="0"
                  className="form-input font-mono" 
                  style={{ fontSize: '16px', fontWeight: 800 }}
                  value={modalAjuste.novoSaldo}
                  onChange={e => setModalAjuste(prev => ({ ...prev, novoSaldo: Math.max(0, parseInt(e.target.value) || 0) }))}
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="btn btn-secondary" onClick={() => setModalAjuste({ isOpen: false, product: null, novoSaldo: 0 })}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleConfirmarAjuste}>Confirmar Ajuste</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO PARA EXCLUIR PRODUTO */}
      {modalExcluir.isOpen && (
        <div className="modal-overlay active" style={{ display: 'flex' }} onClick={() => setModalExcluir({ isOpen: false, product: null })}>
          <div className="modal-container" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ borderBottomColor: '#FEE2E2' }}>
              <span className="modal-title" style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2.2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Excluir Produto do Estoque
              </span>
              <button className="modal-close" onClick={() => setModalExcluir({ isOpen: false, product: null })}>&times;</button>
            </div>
            <div className="modal-body" style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: '13px', marginBottom: '12px', color: 'var(--text-primary)' }}>
                Tem certeza que deseja apagar o produto abaixo do catálogo?
              </p>
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '6px', padding: '10px 14px', marginBottom: '14px' }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)' }}>
                  {modalExcluir.product?.nome}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <span>Código: <strong className="font-mono">{modalExcluir.product?.codigo}</strong></span>
                  <span>Saldo: <strong className="font-mono">{modalExcluir.product?.estoque_atual} un</strong></span>
                  <span>Preço: <strong className="font-mono">{CalcEngine.formatBRL(modalExcluir.product?.preco_unitario || 0)}</strong></span>
                </div>
              </div>
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', padding: '8px 12px', fontSize: '11.5px', color: '#991B1B' }}>
                ⚠️ <strong>Atenção:</strong> Este item será removido do catálogo e não aparecerá mais para busca rápida no balcão de vendas nem no inventário.
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', background: '#F8FAFC' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setModalExcluir({ isOpen: false, product: null })}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn"
                style={{
                  background: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  padding: '0 16px',
                  height: '36px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
                onClick={handleConfirmarExcluir}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2.2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Sim, Apagar Produto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL GERENCIADOR DE CATEGORIAS */}
      <GerenciadorCategoriasModal
        isOpen={isGerenciadorOpen}
        onClose={() => setIsGerenciadorOpen(false)}
      />
    </div>
  );
};
