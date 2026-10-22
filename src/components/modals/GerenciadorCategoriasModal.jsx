import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';

export const GerenciadorCategoriasModal = ({ isOpen, onClose }) => {
  const { categorias, salvarCategoria, excluirCategoria, renomearCategoria, products, showToast } = useApp();

  const [novaCategoria, setNovaCategoria] = useState('');
  const [busca, setBusca] = useState('');
  const [editando, setEditando] = useState({ ativo: false, antigoNome: '', novoNome: '' });
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState(null);

  // Mapeia contagem de produtos por categoria
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

  // Filtra categorias pela busca
  const categoriasFiltradas = useMemo(() => {
    if (!busca.trim()) return categorias;
    const t = busca.toLowerCase();
    return categorias.filter(c => c.toLowerCase().includes(t));
  }, [categorias, busca]);

  if (!isOpen) return null;

  const handleCriar = (e) => {
    e.preventDefault();
    const nomeLimpo = novaCategoria.trim();
    if (!nomeLimpo) {
      showToast('Digite um nome para a categoria.', 'warning');
      return;
    }
    const jaExiste = categorias.some(c => c.toLowerCase() === nomeLimpo.toLowerCase());
    if (jaExiste) {
      showToast(`A categoria "${nomeLimpo}" já existe.`, 'warning');
      return;
    }
    salvarCategoria(nomeLimpo);
    setNovaCategoria('');
  };

  const handleIniciarEdicao = (cat) => {
    setEditando({ ativo: true, antigoNome: cat, novoNome: cat });
  };

  const handleSalvarEdicao = () => {
    const novoLimpo = editando.novoNome.trim();
    if (!novoLimpo) {
      showToast('O nome da categoria não pode ficar vazio.', 'warning');
      return;
    }
    if (novoLimpo.toLowerCase() !== editando.antigoNome.toLowerCase()) {
      const jaExiste = categorias.some(c => c.toLowerCase() === novoLimpo.toLowerCase());
      if (jaExiste) {
        showToast(`Já existe uma categoria chamada "${novoLimpo}".`, 'warning');
        return;
      }
    }
    renomearCategoria(editando.antigoNome, novoLimpo);
    setEditando({ ativo: false, antigoNome: '', novoNome: '' });
  };

  const handleConfirmarExclusao = () => {
    if (!categoriaParaExcluir) return;
    excluirCategoria(categoriaParaExcluir);
    setCategoriaParaExcluir(null);
  };

  return (
    <div className="modal-overlay active" style={{ display: 'flex' }} onClick={onClose}>
      <div 
        className="modal-container" 
        style={{ maxWidth: '620px', width: '100%', maxHeight: '88vh' }} 
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="modal-title">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              Gerenciador de Categorias
            </span>
            <span className="badge-tag" style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #10B981', fontSize: '11px', fontWeight: 700 }}>
              {categorias.length} categorias
            </span>
          </div>
          <button className="modal-close" onClick={onClose} title="Fechar">&times;</button>
        </div>

        {/* BODY */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
          {/* FORM CRIAR NOVA CATEGORIA */}
          <form onSubmit={handleCriar} style={{ background: '#F8FAFC', padding: '12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-light)' }}>
            <label className="form-label" style={{ fontWeight: 700, marginBottom: '6px', display: 'block' }}>
              Adicionar Nova Categoria:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Madeiras Aparelhadas, Pregos & Fixadores, Isolamento..."
                value={novaCategoria}
                onChange={e => setNovaCategoria(e.target.value)}
                style={{ flex: 1 }}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ fontWeight: 700, whiteSpace: 'nowrap' }}
              >
                + Adicionar
              </button>
            </div>
          </form>

          {/* BARRA DE FILTRO */}
          {categorias.length > 5 && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Filtrar categorias..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                style={{ fontSize: '12.5px', padding: '6px 10px' }}
              />
              {busca && (
                <button 
                  type="button" 
                  className="btn btn-sm btn-secondary" 
                  onClick={() => setBusca('')}
                >
                  Limpar
                </button>
              )}
            </div>
          )}

          {/* LISTA DE CATEGORIAS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Categorias Existentes ({categoriasFiltradas.length}):
            </div>

            {categoriasFiltradas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                Nenhuma categoria encontrada com o termo pesquisado.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
                {categoriasFiltradas.map(cat => {
                  const qtdProdutos = contagemPorCategoria[cat] || 0;
                  const isEditingThis = editando.ativo && editando.antigoNome === cat;

                  return (
                    <div
                      key={cat}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: '#FFFFFF',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isEditingThis ? (
                        <div style={{ display: 'flex', gap: '8px', flex: 1, alignItems: 'center', marginRight: '8px' }}>
                          <input
                            type="text"
                            className="form-input"
                            value={editando.novoNome}
                            onChange={e => setEditando(prev => ({ ...prev, novoNome: e.target.value }))}
                            autoFocus
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSalvarEdicao();
                              if (e.key === 'Escape') setEditando({ ativo: false, antigoNome: '', novoNome: '' });
                            }}
                            style={{ fontSize: '13px', padding: '4px 8px' }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={handleSalvarEdicao}
                            style={{ fontWeight: 700, height: '28px' }}
                          >
                            Salvar
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditando({ ativo: false, antigoNome: '', novoNome: '' })}
                            style={{ height: '28px' }}
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                            {cat}
                          </span>
                          <span 
                            className="font-mono" 
                            style={{ 
                              fontSize: '11px', 
                              padding: '1px 7px', 
                              borderRadius: '9999px',
                              background: qtdProdutos > 0 ? '#E0F2FE' : '#F1F5F9',
                              color: qtdProdutos > 0 ? '#0284C7' : '#64748B',
                              fontWeight: 700 
                            }}
                          >
                            {qtdProdutos} {qtdProdutos === 1 ? 'item' : 'itens'}
                          </span>
                        </div>
                      )}

                      {!isEditingThis && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleIniciarEdicao(cat)}
                            title="Renomear Categoria"
                            style={{ height: '28px', padding: '0 8px', fontSize: '11.5px' }}
                          >
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => setCategoriaParaExcluir(cat)}
                            title="Excluir Categoria"
                            style={{ height: '28px', padding: '0 8px', fontSize: '11.5px', color: '#DC2626' }}
                          >
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* DICA DE USO */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '11.5px', color: '#1E40AF', lineHeight: 1.5 }}>
            <strong>💡 Multi-categorias:</strong> Ao cadastrar ou editar um produto, você pode selecionar <strong>múltiplas categorias</strong> para o mesmo item. Ao aplicar o Reajuste Coletivo de Preços por Categoria, qualquer produto que contenha a categoria selecionada será reajustado automaticamente!
          </div>
        </div>

        {/* FOOTER */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={onClose} style={{ fontWeight: 700 }}>
            Concluir / Fechar
          </button>
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {categoriaParaExcluir && (
        <div className="modal-overlay active" style={{ display: 'flex', zIndex: 1100 }} onClick={() => setCategoriaParaExcluir(null)}>
          <div className="modal-container" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title" style={{ color: '#DC2626' }}>
                Excluir Categoria?
              </span>
              <button className="modal-close" onClick={() => setCategoriaParaExcluir(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Tem certeza que deseja excluir a categoria <strong>"{categoriaParaExcluir}"</strong>?
              </p>
              {(contagemPorCategoria[categoriaParaExcluir] || 0) > 0 ? (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', padding: '10px', fontSize: '12px', color: '#B91C1C' }}>
                  ⚠️ Esta categoria está atribuída a <strong>{contagemPorCategoria[categoriaParaExcluir]} produto(s)</strong>. Ela será desvinculada desses produtos automaticamente sem excluí-los.
                </div>
              ) : (
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Nenhum produto está utilizando esta categoria no momento.
                </p>
              )}
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="btn btn-secondary" onClick={() => setCategoriaParaExcluir(null)}>
                Cancelar
              </button>
              <button className="btn btn-danger" style={{ background: '#DC2626', color: '#FFFFFF', borderColor: '#DC2626' }} onClick={handleConfirmarExclusao}>
                Sim, Excluir Categoria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
