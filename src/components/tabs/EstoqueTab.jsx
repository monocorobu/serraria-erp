import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CalcEngine } from '../../services/calc.js';

export const EstoqueTab = () => {
  const { products, updateProduct, adjustStock, showToast, config } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('TODAS');

  // Modal Novo Produto
  const [modalNovo, setModalNovo] = useState(false);
  const [formProduto, setFormProduto] = useState({
    codigo: '',
    nome: '',
    categoria: 'Madeiras Estruturais',
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

  // Modal Ajuste de Saldo
  const [modalAjuste, setModalAjuste] = useState({
    isOpen: false,
    product: null,
    novoSaldo: 0
  });

  const pctBruto = config.percentual_preco_bruto !== undefined ? config.percentual_preco_bruto : CalcEngine.getPercentualPrecoBruto();

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (categoriaFilter !== 'TODAS' && p.categoria !== categoriaFilter) return false;
      if (searchTerm.trim()) {
        const t = searchTerm.toLowerCase();
        const cod = (p.codigo || '').toLowerCase();
        const nome = (p.nome || '').toLowerCase();
        const esp = (p.especie || '').toLowerCase();
        if (!cod.includes(t) && !nome.includes(t) && !esp.includes(t)) return false;
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

  const handleSalvarNovoProduto = (e) => {
    e.preventDefault();
    if (!formProduto.nome || !formProduto.codigo) {
      showToast('Preencha pelo menos o código e nome do produto.', 'warning');
      return;
    }

    const newProd = {
      ...formProduto,
      id: 'prod_' + Date.now(),
      preco_unitario: parseFloat(formProduto.preco_unitario) || 0,
      estoque_atual: parseFloat(formProduto.estoque_atual) || 0,
      estoque_minimo: parseFloat(formProduto.estoque_minimo) || 0,
      largura_cm: parseFloat(formProduto.largura_cm) || 0,
      espessura_cm: parseFloat(formProduto.espessura_cm) || 0
    };

    updateProduct(newProd);
    setModalNovo(false);
    setFormProduto({
      codigo: '',
      nome: '',
      categoria: 'Madeiras Estruturais',
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
  };

  const handleConfirmarAjuste = () => {
    if (!modalAjuste.product) return;
    adjustStock(modalAjuste.product.id, modalAjuste.novoSaldo);
    setModalAjuste({ isOpen: false, product: null, novoSaldo: 0 });
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
                placeholder="Buscar por Código, Madeira ou Espécie..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select 
                className="form-select"
                style={{ width: '180px' }}
                value={categoriaFilter}
                onChange={e => setCategoriaFilter(e.target.value)}
              >
                <option value="TODAS">Todas as Categorias</option>
                <option value="Madeiras Estruturais">Madeiras Estruturais</option>
                <option value="Acabamentos & Forros">Acabamentos & Forros</option>
                <option value="Telhas & Fixação">Telhas & Fixação</option>
              </select>

              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => setModalNovo(true)}
                style={{ fontWeight: 700 }}
              >
                + Novo Produto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABELA DE ESTOQUE 100% LARGURA */}
      <div className="panel">
        <div className="table-responsive">
          <table className="dense-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '85px' }}>Código</th>
                <th>Descrição do Produto & Espécie</th>
                <th style={{ width: '130px' }}>Categoria</th>
                <th style={{ width: '100px' }} className="align-center">Bitola / Dim.</th>
                <th style={{ width: '60px' }} className="align-center">Unid.</th>
                <th style={{ width: '110px' }} className="align-right">Preço À Vista</th>
                <th style={{ width: '115px' }} className="align-right">Preço Bruto (+{pctBruto}%)</th>
                <th style={{ width: '110px' }} className="align-center">Saldo Atual</th>
                <th style={{ width: '90px' }} className="align-center">Status</th>
                <th style={{ width: '100px' }} className="align-center">Ações</th>
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

                  return (
                    <tr key={p.id}>
                      <td className="font-mono" style={{ fontWeight: 700, color: 'var(--primary-green)' }}>
                        {p.codigo}
                      </td>
                      <td>
                        <strong>{p.nome}</strong>
                        {p.especie && <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '6px' }}>({p.especie})</span>}
                      </td>
                      <td style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        {p.categoria || 'Geral'}
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
                        <button 
                          className="btn btn-sm btn-secondary" 
                          style={{ fontSize: '11px', padding: '2px 8px' }}
                          onClick={() => setModalAjuste({ isOpen: true, product: p, novoSaldo: saldo })}
                          title="Ajustar Saldo em Estoque"
                        >
                          Ajustar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NOVO PRODUTO */}
      {modalNovo && (
        <div className="modal-overlay active" style={{ display: 'flex' }}>
          <div className="modal-container" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <span className="modal-title">Novo Produto / Madeira</span>
              <button className="modal-close" onClick={() => setModalNovo(false)}>&times;</button>
            </div>
            <form onSubmit={handleSalvarNovoProduto}>
              <div className="modal-body">
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 2fr', marginBottom: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Código:</label>
                    <input 
                      type="text" 
                      className="form-input font-mono" 
                      placeholder="Ex: MAD-050" 
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

                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '10px' }}>
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
                      step="0.10" 
                      className="form-input font-mono" 
                      value={formProduto.preco_unitario}
                      onChange={e => setFormProduto(prev => ({ ...prev, preco_unitario: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preço Bruto Estimado:</label>
                    <div className="form-input font-mono" style={{ backgroundColor: 'var(--bg-hover)', fontWeight: 700, color: '#1E40AF' }}>
                      {CalcEngine.formatBRL(CalcEngine.calcularPrecoBruto(formProduto.preco_unitario, pctBruto))}
                    </div>
                  </div>
                </div>

                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Largura (cm):</label>
                    <input 
                      type="number" 
                      className="form-input font-mono" 
                      value={formProduto.largura_cm}
                      onChange={e => setFormProduto(prev => ({ ...prev, largura_cm: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Estoque Inicial:</label>
                    <input 
                      type="number" 
                      className="form-input font-mono" 
                      value={formProduto.estoque_atual}
                      onChange={e => setFormProduto(prev => ({ ...prev, estoque_atual: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Estoque Mínimo:</label>
                    <input 
                      type="number" 
                      className="form-input font-mono" 
                      value={formProduto.estoque_minimo}
                      onChange={e => setFormProduto(prev => ({ ...prev, estoque_minimo: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalNovo(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar Produto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AJUSTE DE SALDO */}
      {modalAjuste.isOpen && (
        <div className="modal-overlay active" style={{ display: 'flex' }}>
          <div className="modal-container" style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <span className="modal-title">Ajuste de Estoque</span>
              <button className="modal-close" onClick={() => setModalAjuste({ isOpen: false, product: null, novoSaldo: 0 })}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '12px' }}>
                <strong>{modalAjuste.product?.nome}</strong> ({modalAjuste.product?.codigo})
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Saldo atual no sistema: {modalAjuste.product?.estoque_atual} un</div>
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
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalAjuste({ isOpen: false, product: null, novoSaldo: 0 })}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleConfirmarAjuste}>Confirmar Ajuste</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
