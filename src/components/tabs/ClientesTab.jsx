import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DocMascara, DB, STORAGE_KEYS } from '../../services/data.js';
import Pagination from '../common/Pagination.jsx';

export const ClientesTab = () => {
  const { clients, carpenters, showToast, saveClient, saveCarpenter } = useApp();

  const [subtab, setSubtab] = useState('clientes');
  const [searchTerm, setSearchTerm] = useState('');

  // Paginação Clientes
  const [pageClientes, setPageClientes] = useState(1);
  const [pageSizeClientes, setPageSizeClientes] = useState(10);

  // Paginação Carpinteiros
  const [pageCarpinteiros, setPageCarpinteiros] = useState(1);
  const [pageSizeCarpinteiros, setPageSizeCarpinteiros] = useState(10);

  // Modal Novo Cliente
  const [modalCliente, setModalCliente] = useState(false);
  const [formCliente, setFormCliente] = useState({
    nome: '',
    telefone: '',
    documento: '',
    endereco_obra: '',
    bairro: '',
    cidade: 'Caçapava'
  });

  // Modal Novo Carpinteiro
  const [modalCarpinteiro, setModalCarpinteiro] = useState(false);
  const [formCarpinteiro, setFormCarpinteiro] = useState({
    nome: '',
    telefone: '',
    especialidade: 'Mestre Telhadista',
    comissao_padrao_pct: 3.0,
    pix: ''
  });

  const handleSalvarCliente = (e) => {
    e.preventDefault();
    if (!formCliente.nome.trim()) {
      showToast('Informe o nome do cliente.', 'warning');
      return;
    }

    const saved = saveClient({
      ...formCliente,
      data_cadastro: new Date().toISOString()
    });
    setModalCliente(false);
    setFormCliente({ nome: '', telefone: '', documento: '', endereco_obra: '', bairro: '', cidade: 'Caçapava' });
    showToast(`Cliente ${saved.nome} cadastrado com sucesso!`, 'success');
  };

  const handleSalvarCarpinteiro = (e) => {
    e.preventDefault();
    if (!formCarpinteiro.nome.trim()) {
      showToast('Informe o nome do parceiro carpinteiro.', 'warning');
      return;
    }

    const saved = saveCarpenter(formCarpinteiro);
    setModalCarpinteiro(false);
    setFormCarpinteiro({ nome: '', telefone: '', especialidade: 'Mestre Telhadista', comissao_padrao_pct: 3.0, pix: '' });
  };

  const filteredClientes = useMemo(() => {
    return clients.filter(c => {
      if (!searchTerm.trim()) return true;
      const t = searchTerm.toLowerCase();
      return (c.nome || '').toLowerCase().includes(t) || (c.telefone || '').includes(t) || (c.documento || '').includes(t);
    });
  }, [clients, searchTerm]);

  const filteredCarpinteiros = useMemo(() => {
    return carpenters.filter(c => {
      if (!searchTerm.trim()) return true;
      const t = searchTerm.toLowerCase();
      return (c.nome || '').toLowerCase().includes(t) || (c.telefone || '').includes(t) || (c.especialidade || '').toLowerCase().includes(t);
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
      {/* NAVEGAÇÃO DE SUB-ABAS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn ${subtab === 'clientes' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSubtab('clientes')}
          >
            Clientes Finais ({clients.length})
          </button>
          <button 
            className={`btn ${subtab === 'carpinteiros' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSubtab('carpinteiros')}
          >
            Carpinteiros & Mestres ({carpenters.length})
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Buscar por nome, telefone ou documento..."
            style={{ width: '280px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          {subtab === 'clientes' ? (
            <button className="btn btn-primary" onClick={() => setModalCliente(true)}>
              + Novo Cliente
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setModalCarpinteiro(true)}>
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
                  <th style={{ width: '140px' }}>Telefone</th>
                  <th style={{ width: '150px' }}>CPF / CNPJ</th>
                  <th>Endereço da Obra</th>
                  <th style={{ width: '130px' }}>Bairro</th>
                  <th style={{ width: '110px' }}>Cidade</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClientes.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
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
                  <th style={{ width: '140px' }}>Telefone</th>
                  <th style={{ width: '160px' }}>Especialidade</th>
                  <th style={{ width: '110px' }} className="align-center">Comissão (%)</th>
                  <th style={{ width: '150px' }}>Chave Pix</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCarpinteiros.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
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

      {/* MODAL NOVO CLIENTE */}
      {modalCliente && (
        <div className="modal-overlay active" style={{ display: 'flex' }}>
          <div className="modal-container" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <span className="modal-title">Novo Cliente</span>
              <button className="modal-close" onClick={() => setModalCliente(false)}>&times;</button>
            </div>
            <form onSubmit={handleSalvarCliente}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nome Completo / Razão Social:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
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
                      value={formCliente.telefone}
                      onChange={e => setFormCliente(prev => ({ ...prev, telefone: DocMascara.formatarTelefone(e.target.value) }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CPF / CNPJ:</label>
                    <input 
                      type="text" 
                      className="form-input font-mono" 
                      value={formCliente.documento}
                      onChange={e => setFormCliente(prev => ({ ...prev, documento: DocMascara.formatar(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Endereço da Obra:</label>
                  <input 
                    type="text" 
                    className="form-input" 
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
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalCliente(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVO CARPINTEIRO */}
      {modalCarpinteiro && (
        <div className="modal-overlay active" style={{ display: 'flex' }}>
          <div className="modal-container" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <span className="modal-title">Novo Parceiro Carpinteiro</span>
              <button className="modal-close" onClick={() => setModalCarpinteiro(false)}>&times;</button>
            </div>
            <form onSubmit={handleSalvarCarpinteiro}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nome do Carpinteiro / Mestre:</label>
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
                <button type="button" className="btn btn-secondary" onClick={() => setModalCarpinteiro(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar Parceiro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
