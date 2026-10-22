import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { CalcEngine } from '../../services/calc.js';
import { DB } from '../../services/data.js';
import { GerenciadorCategoriasModal } from '../modals/GerenciadorCategoriasModal.jsx';

export const EstoqueTab = () => {
  const { 
    products, 
    updateProduct, 
    adjustStock, 
    showToast, 
    config, 
    categorias, 
    salvarCategoria 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('TODAS');
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
  }, [products, categoriaFilter, searchTerm]);

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
      categorias: categorias.length > 0 ? [categorias[0]] : [],
      especie: 'Garapeira',
      tipo_calculo: 'ML',
      largura_cm: 12,
      espessura_cm: 6,
      comprimento_padrao_m: 4.5,
      densidade_kg_m3: 750,
      preco_unitario: 25.00,
      estoque_atual: 50,
      estoque_minimo: 10
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
    if (!formProduto.nome || !formProduto.codigo) {
      showToast('Preencha pelo menos o código e o nome do produto.', 'warning');
      return;
    }

    const savedProd = {
      ...formProduto,
      id: formProduto.id || ('prod_' + Date.now()),
      categorias: formProduto.categorias.length > 0 ? formProduto.categorias : ['Geral'],
      categoria: formProduto.categorias[0] || 'Geral',
      preco_unitario: Math.max(0, parseFloat(formProduto.preco_unitario) || 0),
      estoque_atual: Math.max(0, parseFloat(formProduto.estoque_atual) || 0),
      estoque_minimo: Math.max(0, parseFloat(formProduto.estoque_minimo) || 0),
      largura_cm: parseFloat(formProduto.largura_cm) || 0,
      espessura_cm: parseFloat(formProduto.espessura_cm) || 0,
      comprimento_padrao_m: parseFloat(formProduto.comprimento_padrao_m) || 0
    };

    updateProduct(savedProd);
    setModalProduto({ isOpen: false, isEdit: false });
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
      {/* KPIS DE ESTOQUE */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '14px' }}>
        <div className="kpi-card" style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-medium)' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-secondary)' }}>Total de Produtos no Pátio</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{kpis.totalItens} itens</div>
        </div>
        <div className="kpi-card" style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-medium)' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#D97706' }}>Estoque Baixo (&le; Mínimo)</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>{kpis.baixos} itens</div>
        </div>
        <div className="kpi-card" style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-medium)' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#DC2626' }}>Estoque Crítico (Zerados)</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626', marginTop: '4px' }}>{kpis.zerados} itens</div>
        </div>
      </div>

      {/* BARRA DE FILTROS & AÇÃO */}
      <div className="panel" style={{ marginBottom: '14px' }}>
        <div className="panel-body" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '260px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Buscar por Código, Madeira, Espécie ou Categoria..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* FILTRAR POR CATEGORIA DINÂMICA */}
              <select 
                className="form-select"
                style={{ width: '210px' }}
                value={categoriaFilter}
                onChange={e => setCategoriaFilter(e.target.value)}
              >
                <option value="TODAS">Todas as Categorias ({products.length})</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>
                    {cat} ({contagemPorCategoria[cat] || 0})
                  </option>
                ))}
              </select>

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
          <table className="dense-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '85px' }}>Código</th>
                <th>Descrição do Produto & Espécie</th>
                <th style={{ width: '180px' }}>Categorias</th>
                <th style={{ width: '100px' }} className="align-center">Bitola / Dim.</th>
                <th style={{ width: '60px' }} className="align-center">Unid.</th>
                <th style={{ width: '110px' }} className="align-right">Preço À Vista</th>
                <th style={{ width: '115px' }} className="align-right">Preço Bruto (+{pctBruto}%)</th>
                <th style={{ width: '110px' }} className="align-center">Saldo Atual</th>
                <th style={{ width: '90px' }} className="align-center">Status</th>
                <th style={{ width: '130px' }} className="align-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    Nenhum produto encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
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
                      <td className="font-mono" style={{ fontWeight: 700, color: 'var(--primary-green)' }}>
                        {p.codigo}
                      </td>
                      <td>
                        <strong>{p.nome}</strong>
                        {p.especie && <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '6px' }}>({p.especie})</span>}
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
                      <td className="align-center font-mono" style={{ fontSize: '11.5px' }}>
                        {p.largura_cm ? `${p.espessura_cm || 0}x${p.largura_cm}cm` : '-'}
                      </td>
                      <td className="align-center font-mono">{p.tipo_calculo}</td>
                      <td className="align-right font-mono" style={{ fontWeight: 700, color: '#047857' }}>
                        {CalcEngine.formatBRL(precoAVista)}
                      </td>
                      <td className="align-right font-mono" style={{ fontWeight: 700, color: '#1E40AF' }}>
                        {CalcEngine.formatBRL(precoBruto)}
                      </td>
                      <td className="align-center font-mono" style={{ fontWeight: 800, fontSize: '13px' }}>
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
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button 
                            type="button"
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '11px', padding: '2px 7px' }}
                            onClick={() => handleAbrirEditar(p)}
                            title="Editar Dados e Categorias do Produto"
                          >
                            Editar
                          </button>
                          <button 
                            type="button"
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '11px', padding: '2px 7px' }}
                            onClick={() => setModalAjuste({ isOpen: true, product: p, novoSaldo: saldo })}
                            title="Ajustar Saldo Físico em Estoque"
                          >
                            Saldo
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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
                    />
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

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setModalProduto({ isOpen: false, isEdit: false })}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
                  {modalProduto.isEdit ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
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

      {/* MODAL GERENCIADOR DE CATEGORIAS */}
      <GerenciadorCategoriasModal
        isOpen={isGerenciadorOpen}
        onClose={() => setIsGerenciadorOpen(false)}
      />
    </div>
  );
};
