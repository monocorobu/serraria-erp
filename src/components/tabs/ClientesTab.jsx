import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DocMascara } from '../../services/data.js';
import Pagination from '../common/Pagination.jsx';

export const ClientesTab = () => {
  const { 
    clients, 
    carpenters, 
    showToast, 
    saveClient, 
    deleteClient, 
    saveCarpenter, 
    deleteCarpenter 
  } = useApp();

  const [subtab, setSubtab] = useState('clientes');
  const [searchTerm, setSearchTerm] = useState('');

  // Paginação Clientes
  const [pageClientes, setPageClientes] = useState(1);
  const [pageSizeClientes, setPageSizeClientes] = useState(10);

  // Paginação Carpinteiros
  const [pageCarpinteiros, setPageCarpinteiros] = useState(1);
  const [pageSizeCarpinteiros, setPageSizeCarpinteiros] = useState(10);

  // Modal Novo / Editar Cliente
  const [modalCliente, setModalCliente] = useState(false);
  const [clienteEmEdicao, setClienteEmEdicao] = useState(null);
  const [formCliente, setFormCliente] = useState({
    id: null,
    nome: '',
    telefone: '',
    documento: '',
    email: '',
    endereco_obra: '',
    bairro: '',
    cidade: 'Caçapava',
    observacoes: ''
  });

  // Modal Excluir Cliente
  const [modalExcluirCliente, setModalExcluirCliente] = useState({
    isOpen: false,
    cliente: null
  });

  // Modal Novo / Editar Carpinteiro
  const [modalCarpinteiro, setModalCarpinteiro] = useState(false);
  const [carpinteiroEmEdicao, setCarpinteiroEmEdicao] = useState(null);
  const [formCarpinteiro, setFormCarpinteiro] = useState({
    id: null,
    nome: '',
    telefone: '',
    especialidade: 'Mestre Telhadista',
    comissao_padrao_pct: 3.0,
    pix: ''
  });

  // Modal Excluir Carpinteiro
  const [modalExcluirCarpinteiro, setModalExcluirCarpinteiro] = useState({
    isOpen: false,
    carpinteiro: null
  });

  // --- HANDLERS CLIENTE ---
  const handleAbrirNovoCliente = () => {
    setClienteEmEdicao(null);
    setFormCliente({
      id: null,
      nome: '',
      telefone: '',
      documento: '',
      email: '',
      endereco_obra: '',
      bairro: '',
      cidade: 'Caçapava',
      observacoes: ''
    });
    setModalCliente(true);
  };

  const handleAbrirEditarCliente = (c) => {
    setClienteEmEdicao(c);
    setFormCliente({
      id: c.id,
      nome: c.nome || '',
      telefone: c.telefone || '',
      documento: c.documento || '',
      email: c.email || '',
      endereco_obra: c.endereco_obra || '',
      bairro: c.bairro || '',
      cidade: c.cidade || 'Caçapava',
      observacoes: c.observacoes || ''
    });
    setModalCliente(true);
  };

  const handleSalvarCliente = (e) => {
    e.preventDefault();
    if (!formCliente.nome.trim()) {
      showToast('Informe o nome do cliente.', 'warning');
      return;
    }

    const payload = {
      ...formCliente,
      nome: formCliente.nome.trim()
    };
    if (clienteEmEdicao && clienteEmEdicao.id) {
      payload.id = clienteEmEdicao.id;
      payload.data_cadastro = clienteEmEdicao.data_cadastro || new Date().toISOString();
    } else {
      payload.data_cadastro = new Date().toISOString();
    }

    const saved = saveClient(payload);
    setModalCliente(false);
    setClienteEmEdicao(null);
    setFormCliente({
      id: null,
      nome: '',
      telefone: '',
      documento: '',
      email: '',
      endereco_obra: '',
      bairro: '',
      cidade: 'Caçapava',
      observacoes: ''
    });
    showToast(
      clienteEmEdicao 
        ? `Cliente "${saved.nome}" atualizado com sucesso!` 
        : `Cliente "${saved.nome}" cadastrado com sucesso!`, 
      'success'
    );
  };

  const handleSolicitarExcluirCliente = (c) => {
    setModalExcluirCliente({
      isOpen: true,
      cliente: c
    });
  };

  const handleConfirmarExcluirCliente = () => {
    if (!modalExcluirCliente.cliente) return;
    const { id, nome } = modalExcluirCliente.cliente;
    deleteClient(id);
    setModalExcluirCliente({ isOpen: false, cliente: null });
  };

  // --- HANDLERS CARPINTEIRO ---
  const handleAbrirNovoCarpinteiro = () => {
    setCarpinteiroEmEdicao(null);
    setFormCarpinteiro({
      id: null,
      nome: '',
      telefone: '',
      especialidade: 'Mestre Telhadista',
      comissao_padrao_pct: 3.0,
      pix: ''
    });
    setModalCarpinteiro(true);
  };

  const handleAbrirEditarCarpinteiro = (c) => {
    setCarpinteiroEmEdicao(c);
    setFormCarpinteiro({
      id: c.id,
      nome: c.nome || '',
      telefone: c.telefone || '',
      especialidade: c.especialidade || 'Mestre Telhadista',
      comissao_padrao_pct: c.comissao_padrao_pct !== undefined ? c.comissao_padrao_pct : 3.0,
      pix: c.pix || ''
    });
    setModalCarpinteiro(true);
  };

  const handleSalvarCarpinteiro = (e) => {
    e.preventDefault();
    if (!formCarpinteiro.nome.trim()) {
      showToast('Informe o nome do parceiro carpinteiro.', 'warning');
      return;
    }

    const payload = {
      ...formCarpinteiro,
      nome: formCarpinteiro.nome.trim()
    };
    if (carpinteiroEmEdicao && carpinteiroEmEdicao.id) {
      payload.id = carpinteiroEmEdicao.id;
    }

    const saved = saveCarpenter(payload);
    setModalCarpinteiro(false);
    setCarpinteiroEmEdicao(null);
    setFormCarpinteiro({
      id: null,
      nome: '',
      telefone: '',
      especialidade: 'Mestre Telhadista',
      comissao_padrao_pct: 3.0,
      pix: ''
    });
  };

  const handleSolicitarExcluirCarpinteiro = (c) => {
    setModalExcluirCarpinteiro({
      isOpen: true,
      carpinteiro: c
    });
  };

  const handleConfirmarExcluirCarpinteiro = () => {
    if (!modalExcluirCarpinteiro.carpinteiro) return;
    const { id } = modalExcluirCarpinteiro.carpinteiro;
    deleteCarpenter(id);
    setModalExcluirCarpinteiro({ isOpen: false, carpinteiro: null });
  };

  // --- FILTROS & BUSCA ---
  const filteredClientes = useMemo(() => {
    return clients.filter(c => {
      if (!searchTerm.trim()) return true;
      const t = searchTerm.toLowerCase();
      return (
        (c.nome || '').toLowerCase().includes(t) || 
        (c.telefone || '').includes(t) || 
        (c.documento || '').includes(t) ||
        (c.bairro || '').toLowerCase().includes(t)
      );
    });
  }, [clients, searchTerm]);

  const filteredCarpinteiros = useMemo(() => {
    return carpenters.filter(c => {
      if (!searchTerm.trim()) return true;
      const t = searchTerm.toLowerCase();
      return (
        (c.nome || '').toLowerCase().includes(t) || 
        (c.telefone || '').includes(t) || 
        (c.especialidade || '').toLowerCase().includes(t)
      );
    });
  }, [carpenters, searchTerm]);

  // Itens paginados
  const totalPagesClientes = Math.max(1, Math.ceil(filteredClientes.length / pageSizeClientes));
  const safePageClientes = Math.min(Math.max(1, pageClientes), totalPagesClientes);
  const paginatedClientes = useMemo(() => {
    const start = (safePageClientes - 1) * pageSizeClientes;
    return filteredClientes.slice(start, start + pageSizeClientes);
  }, [filteredClientes, safePageClientes, pageSizeClientes]);

  const totalPagesCarpinteiros = Math.max(1, Math.ceil(filteredCarpinteiros.length / pageSizeCarpinteiros));
  const safePageCarpinteiros = Math.min(Math.max(1, pageCarpinteiros), totalPagesCarpinteiros);
  const paginatedCarpinteiros = useMemo(() => {
    const start = (safePageCarpinteiros - 1) * pageSizeCarpinteiros;
    return filteredCarpinteiros.slice(start, start + pageSizeCarpinteiros);
  }, [filteredCarpinteiros, safePageCarpinteiros, pageSizeCarpinteiros]);

  return (
    <div className="clientes-layout">
      {/* NAVEGAÇÃO DE SUB-ABAS & BUSCA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            type="button"
            className={`btn ${subtab === 'clientes' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setSubtab('clientes'); setSearchTerm(''); }}
          >
            Clientes Finais ({clients.length})
          </button>
          <button 
            type="button"
            className={`btn ${subtab === 'carpinteiros' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setSubtab('carpinteiros'); setSearchTerm(''); }}
          >
            Carpinteiros & Mestres ({carpenters.length})
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder={subtab === 'clientes' ? "Buscar por nome, telefone, CPF ou bairro..." : "Buscar parceiro..."}
            style={{ width: '280px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          {subtab === 'clientes' ? (
            <button type="button" className="btn btn-primary" onClick={handleAbrirNovoCliente} style={{ fontWeight: 700 }}>
              + Novo Cliente
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={handleAbrirNovoCarpinteiro} style={{ fontWeight: 700 }}>
              + Novo Carpinteiro
            </button>
          )}
        </div>
      </div>

      {/* CONTEÚDO CLIENTES */}
      {subtab === 'clientes' && (
        <div className="panel">
          <div className="table-responsive">
            <table className="dense-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Nome do Cliente</th>
                  <th style={{ width: '135px', whiteSpace: 'nowrap' }}>Telefone</th>
                  <th style={{ width: '145px', whiteSpace: 'nowrap' }}>CPF / CNPJ</th>
                  <th>Endereço da Obra</th>
                  <th style={{ width: '120px' }}>Bairro</th>
                  <th style={{ width: '100px' }}>Cidade</th>
                  <th style={{ width: '140px', whiteSpace: 'nowrap' }} className="align-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClientes.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                ) : (
                  paginatedClientes.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.nome}</strong></td>
                      <td className="font-mono">{c.telefone || '-'}</td>
                      <td className="font-mono">{c.documento || '-'}</td>
                      <td>{c.endereco_obra || '-'}</td>
                      <td>{c.bairro || '-'}</td>
                      <td>{c.cidade || 'Caçapava'}</td>
                      <td className="align-center">
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
                          <button 
                            type="button"
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '11px', padding: '2px 7px', height: '24px' }}
                            onClick={() => handleAbrirEditarCliente(c)}
                            title={`Editar dados de ${c.nome}`}
                          >
                            Editar
                          </button>
                          <button 
                            type="button"
                            className="btn btn-sm" 
                            style={{ 
                              fontSize: '11px', 
                              padding: '2px 7px', 
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
                            onClick={() => handleSolicitarExcluirCliente(c)}
                            title={`Apagar cadastro de ${c.nome}`}
                          >
                            <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" fill="none" strokeWidth="2.2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            <span>Apagar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={pageClientes}
            totalItems={filteredClientes.length}
            pageSize={pageSizeClientes}
            onPageChange={setPageClientes}
            onPageSizeChange={setPageSizeClientes}
            itemLabel="clientes"
          />
        </div>
      )}

      {/* CONTEÚDO CARPINTEIROS */}
      {subtab === 'carpinteiros' && (
        <div className="panel">
          <div className="table-responsive">
            <table className="dense-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Nome do Parceiro</th>
                  <th style={{ width: '135px', whiteSpace: 'nowrap' }}>Telefone</th>
                  <th style={{ width: '150px' }}>Especialidade</th>
                  <th style={{ width: '110px' }} className="align-center">Comissão (%)</th>
                  <th style={{ width: '140px' }}>Chave Pix</th>
                  <th style={{ width: '140px', whiteSpace: 'nowrap' }} className="align-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCarpinteiros.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      Nenhum parceiro carpinteiro encontrado.
                    </td>
                  </tr>
                ) : (
                  paginatedCarpinteiros.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.nome}</strong></td>
                      <td className="font-mono">{c.telefone || '-'}</td>
                      <td>{c.especialidade || 'Mestre Telhadista'}</td>
                      <td className="align-center font-mono" style={{ fontWeight: 700, color: '#047857' }}>
                        {c.comissao_padrao_pct || 3.0}%
                      </td>
                      <td className="font-mono" style={{ fontSize: '11.5px' }}>{c.pix || '-'}</td>
                      <td className="align-center">
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
                          <button 
                            type="button"
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '11px', padding: '2px 7px', height: '24px' }}
                            onClick={() => handleAbrirEditarCarpinteiro(c)}
                            title={`Editar parceiro ${c.nome}`}
                          >
                            Editar
                          </button>
                          <button 
                            type="button"
                            className="btn btn-sm" 
                            style={{ 
                              fontSize: '11px', 
                              padding: '2px 7px', 
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
                            onClick={() => handleSolicitarExcluirCarpinteiro(c)}
                            title={`Apagar parceiro ${c.nome}`}
                          >
                            <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" fill="none" strokeWidth="2.2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            <span>Apagar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={pageCarpinteiros}
            totalItems={filteredCarpinteiros.length}
            pageSize={pageSizeCarpinteiros}
            onPageChange={setPageCarpinteiros}
            onPageSizeChange={setPageSizeCarpinteiros}
            itemLabel="parceiros"
          />
        </div>
      )}

      {/* MODAL NOVO / EDITAR CLIENTE */}
      {modalCliente && (
        <div className="modal-overlay active" style={{ display: 'flex', zIndex: 1050 }}>
          <div className="modal-container" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <span className="modal-title">
                {clienteEmEdicao ? 'Editar Dados do Cliente' : 'Novo Cliente'}
              </span>
              <button 
                type="button" 
                className="modal-close" 
                onClick={() => { setModalCliente(false); setClienteEmEdicao(null); }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSalvarCliente}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nome Completo / Razão Social: *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
                    placeholder="Ex: João Silva ou Construtora Vale Verde"
                    value={formCliente.nome}
                    onChange={e => setFormCliente(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Telefone / WhatsApp:</label>
                    <input 
                      type="text" 
                      className="form-input font-mono" 
                      placeholder="(12) 99999-9999"
                      value={formCliente.telefone}
                      onChange={e => setFormCliente(prev => ({ ...prev, telefone: DocMascara.formatarTelefone(e.target.value) }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CPF / CNPJ:</label>
                    <input 
                      type="text" 
                      className="form-input font-mono" 
                      placeholder="000.000.000-00"
                      value={formCliente.documento}
                      onChange={e => setFormCliente(prev => ({ ...prev, documento: DocMascara.formatar(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">E-mail (Opcional):</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="cliente@exemplo.com"
                    value={formCliente.email}
                    onChange={e => setFormCliente(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Endereço da Obra / Entrega:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Rua, número, complemento"
                    value={formCliente.endereco_obra}
                    onChange={e => setFormCliente(prev => ({ ...prev, endereco_obra: e.target.value }))}
                  />
                </div>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Bairro:</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Aldeias da Serra"
                      value={formCliente.bairro}
                      onChange={e => setFormCliente(prev => ({ ...prev, bairro: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cidade:</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formCliente.cidade}
                      onChange={e => setFormCliente(prev => ({ ...prev, cidade: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Observações / Preferências:</label>
                  <textarea 
                    className="form-input" 
                    rows="2"
                    placeholder="Instruções de entrega, referências, preferências de madeira..."
                    value={formCliente.observacoes}
                    onChange={e => setFormCliente(prev => ({ ...prev, observacoes: e.target.value }))}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => { setModalCliente(false); setClienteEmEdicao(null); }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
                  {clienteEmEdicao ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO EXCLUIR CLIENTE */}
      {modalExcluirCliente.isOpen && modalExcluirCliente.cliente && (
        <div className="modal-overlay active" style={{ display: 'flex', zIndex: 1100 }}>
          <div className="modal-container" style={{ maxWidth: '460px' }}>
            <div className="modal-header" style={{ background: '#FEF2F2', borderBottom: '1px solid #FECACA' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2.2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </div>
                <span className="modal-title" style={{ color: '#991B1B', fontWeight: 800 }}>Excluir Cliente</span>
              </div>
              <button 
                type="button" 
                className="modal-close" 
                onClick={() => setModalExcluirCliente({ isOpen: false, cliente: null })}
              >
                &times;
              </button>
            </div>
            <div className="modal-body" style={{ padding: '16px' }}>
              <p style={{ fontSize: '13px', marginBottom: '12px', color: 'var(--text-primary)' }}>
                Tem certeza que deseja apagar o cliente abaixo da sua base de contatos?
              </p>
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '6px', padding: '12px 14px', marginBottom: '14px' }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)' }}>
                  {modalExcluirCliente.cliente.nome}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {modalExcluirCliente.cliente.documento && (
                    <span>CPF/CNPJ: <strong className="font-mono">{modalExcluirCliente.cliente.documento}</strong></span>
                  )}
                  {modalExcluirCliente.cliente.telefone && (
                    <span>Telefone: <strong className="font-mono">{modalExcluirCliente.cliente.telefone}</strong></span>
                  )}
                  {modalExcluirCliente.cliente.bairro && (
                    <span>Bairro: <strong>{modalExcluirCliente.cliente.bairro} ({modalExcluirCliente.cliente.cidade || 'Caçapava'})</strong></span>
                  )}
                </div>
              </div>
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', padding: '8px 12px', fontSize: '11.5px', color: '#991B1B' }}>
                ⚠️ <strong>Atenção:</strong> O cliente será removido da lista e do preenchimento rápido do balcão. Pedidos já emitidos no passado permanecem preservados no histórico.
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', background: '#F8FAFC' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setModalExcluirCliente({ isOpen: false, cliente: null })}
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
                onClick={handleConfirmarExcluirCliente}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2.2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Sim, Apagar Cliente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVO / EDITAR CARPINTEIRO */}
      {modalCarpinteiro && (
        <div className="modal-overlay active" style={{ display: 'flex', zIndex: 1050 }}>
          <div className="modal-container" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <span className="modal-title">
                {carpinteiroEmEdicao ? 'Editar Parceiro Carpinteiro' : 'Novo Parceiro Carpinteiro'}
              </span>
              <button 
                type="button" 
                className="modal-close" 
                onClick={() => { setModalCarpinteiro(false); setCarpinteiroEmEdicao(null); }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSalvarCarpinteiro}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nome do Carpinteiro / Mestre: *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
                    value={formCarpinteiro.nome}
                    onChange={e => setFormCarpinteiro(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Telefone / WhatsApp:</label>
                    <input 
                      type="text" 
                      className="form-input font-mono" 
                      value={formCarpinteiro.telefone}
                      onChange={e => setFormCarpinteiro(prev => ({ ...prev, telefone: DocMascara.formatarTelefone(e.target.value) }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Comissão Padrão (%):</label>
                    <input 
                      type="number" 
                      step="0.5" 
                      className="form-input font-mono" 
                      value={formCarpinteiro.comissao_padrao_pct}
                      onChange={e => setFormCarpinteiro(prev => ({ ...prev, comissao_padrao_pct: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Especialidade Principal:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Mestre Telhadista, Decks & Pérgolas..."
                    value={formCarpinteiro.especialidade}
                    onChange={e => setFormCarpinteiro(prev => ({ ...prev, especialidade: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Chave Pix (Para Pagamento):</label>
                  <input 
                    type="text" 
                    className="form-input font-mono" 
                    placeholder="CPF, Telefone, E-mail ou Aleatória"
                    value={formCarpinteiro.pix}
                    onChange={e => setFormCarpinteiro(prev => ({ ...prev, pix: e.target.value }))}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => { setModalCarpinteiro(false); setCarpinteiroEmEdicao(null); }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
                  {carpinteiroEmEdicao ? 'Salvar Alterações' : 'Salvar Parceiro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO EXCLUIR CARPINTEIRO */}
      {modalExcluirCarpinteiro.isOpen && modalExcluirCarpinteiro.carpinteiro && (
        <div className="modal-overlay active" style={{ display: 'flex', zIndex: 1100 }}>
          <div className="modal-container" style={{ maxWidth: '460px' }}>
            <div className="modal-header" style={{ background: '#FEF2F2', borderBottom: '1px solid #FECACA' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2.2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </div>
                <span className="modal-title" style={{ color: '#991B1B', fontWeight: 800 }}>Excluir Parceiro Carpinteiro</span>
              </div>
              <button 
                type="button" 
                className="modal-close" 
                onClick={() => setModalExcluirCarpinteiro({ isOpen: false, carpinteiro: null })}
              >
                &times;
              </button>
            </div>
            <div className="modal-body" style={{ padding: '16px' }}>
              <p style={{ fontSize: '13px', marginBottom: '12px', color: 'var(--text-primary)' }}>
                Tem certeza que deseja apagar o parceiro carpinteiro abaixo?
              </p>
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '6px', padding: '12px 14px', marginBottom: '14px' }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)' }}>
                  {modalExcluirCarpinteiro.carpinteiro.nome}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <span>Especialidade: <strong>{modalExcluirCarpinteiro.carpinteiro.especialidade || 'Mestre Telhadista'}</strong></span>
                  {modalExcluirCarpinteiro.carpinteiro.telefone && (
                    <span>Telefone: <strong className="font-mono">{modalExcluirCarpinteiro.carpinteiro.telefone}</strong></span>
                  )}
                  {modalExcluirCarpinteiro.carpinteiro.pix && (
                    <span>Pix: <strong className="font-mono">{modalExcluirCarpinteiro.carpinteiro.pix}</strong></span>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', background: '#F8FAFC' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setModalExcluirCarpinteiro({ isOpen: false, carpinteiro: null })}
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
                onClick={handleConfirmarExcluirCarpinteiro}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2.2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Sim, Apagar Parceiro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
