import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CalcEngine } from '../../services/calc.js';
import { DB, STORAGE_KEYS } from '../../services/data.js';

export const PrecosTab = () => {
  const { products, setProducts, showToast, config } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [especieFilter, setEspecieFilter] = useState('TODAS');
  const [reajustePct, setReajustePct] = useState(5.0);
  const [reajusteAlvo, setReajusteAlvo] = useState('TODOS');

  const pctBruto = config.percentual_preco_bruto !== undefined ? config.percentual_preco_bruto : CalcEngine.getPercentualPrecoBruto();

  const especies = useMemo(() => {
    const set = new Set();
    products.forEach(p => { if (p.especie) set.add(p.especie); });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (especieFilter !== 'TODAS' && p.especie !== especieFilter) return false;
      if (searchTerm.trim()) {
        const t = searchTerm.toLowerCase();
        return (p.nome || '').toLowerCase().includes(t) || (p.codigo || '').toLowerCase().includes(t);
      }
      return true;
    });
  }, [products, especieFilter, searchTerm]);

  const handleAplicarReajuste = () => {
    const pct = parseFloat(reajustePct) || 0;
    if (pct === 0) {
      showToast('Informe um percentual de reajuste diferente de zero.', 'warning');
      return;
    }

    const fator = 1 + (pct / 100);
    const updated = products.map(p => {
      if (reajusteAlvo !== 'TODOS' && p.especie !== reajusteAlvo) return p;
      const novoPreco = parseFloat((p.preco_unitario * fator).toFixed(2));
      return { ...p, preco_unitario: novoPreco };
    });

    DB.set(STORAGE_KEYS.PRODUTOS, updated);
    setProducts([...updated]);
    showToast(`Reajuste de ${pct > 0 ? '+' : ''}${pct}% aplicado com sucesso!`, 'success');
  };

  const handleEditarPrecoDirect = (productId, novoPreco) => {
    const val = parseFloat(novoPreco) || 0;
    const updated = products.map(p => p.id === productId ? { ...p, preco_unitario: val } : p);
    DB.set(STORAGE_KEYS.PRODUTOS, updated);
    setProducts([...updated]);
  };

  return (
    <div className="precos-layout">
      {/* PAINEL DE REAJUSTE EM MASSA */}
      <div className="panel" style={{ marginBottom: '14px' }}>
        <div className="panel-header">
          <span className="panel-title">
            <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Reajuste Coletivo de Preços de Tabela
          </span>
        </div>
        <div className="panel-body">
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ width: '220px' }}>
              <label className="form-label">Aplicar Em:</label>
              <select 
                className="form-select"
                value={reajusteAlvo}
                onChange={e => setReajusteAlvo(e.target.value)}
              >
                <option value="TODOS">Todos os Produtos ({products.length} itens)</option>
                {especies.map(esp => (
                  <option key={esp} value={esp}>Apenas Madeiras {esp}</option>
                ))}
              </select>
            </div>

            <div style={{ width: '150px' }}>
              <label className="form-label">Percentual (%):</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input 
                  type="number" 
                  step="0.5" 
                  className="form-input font-mono" 
                  value={reajustePct}
                  onChange={e => setReajustePct(parseFloat(e.target.value) || 0)}
                />
                <span style={{ fontWeight: 700 }}>%</span>
              </div>
            </div>

            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleAplicarReajuste}
              style={{ fontWeight: 700, height: '36px' }}
            >
              Aplicar Reajuste em Massa
            </button>
          </div>
        </div>
      </div>

      {/* TABELA DE PREÇOS */}
      <div className="panel">
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="panel-title">Tabela Oficial de Preços</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Filtrar por nome ou código..."
              style={{ width: '240px' }}
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
                <th style={{ width: '110px' }}>Espécie</th>
                <th style={{ width: '60px' }} className="align-center">Unid.</th>
                <th style={{ width: '140px' }} className="align-right">Preço Unit. À Vista</th>
                <th style={{ width: '150px' }} className="align-right">Preço Unit. Bruto (+{pctBruto}%)</th>
                <th style={{ width: '100px' }} className="align-center">Estoque</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => {
                const precoAVista = parseFloat(p.preco_unitario) || 0;
                const precoBruto = CalcEngine.calcularPrecoBruto(precoAVista, pctBruto);

                return (
                  <tr key={p.id}>
                    <td className="font-mono" style={{ fontWeight: 700, color: 'var(--primary-green)' }}>
                      {p.codigo}
                    </td>
                    <td><strong>{p.nome}</strong></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{p.especie || '-'}</td>
                    <td className="align-center font-mono">{p.tipo_calculo}</td>
                    <td className="align-right">
                      <input 
                        type="number" 
                        step="0.10" 
                        className="table-input font-mono" 
                        style={{ width: '110px', textAlign: 'right', fontWeight: 800, color: '#047857' }}
                        value={p.preco_unitario}
                        onChange={e => handleEditarPrecoDirect(p.id, e.target.value)}
                      />
                    </td>
                    <td className="align-right font-mono" style={{ fontWeight: 800, color: '#1E40AF', fontSize: '13px' }}>
                      {CalcEngine.formatBRL(precoBruto)}
                    </td>
                    <td className="align-center font-mono">{p.estoque_atual || 0} un</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
