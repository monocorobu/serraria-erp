import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CalcEngine } from '../../services/calc.js';
import { DB, STORAGE_KEYS, DocMascara } from '../../services/data.js';
import Pagination from '../common/Pagination.jsx';

export const GerenteTab = () => {
  const { 
    config, 
    updateConfig, 
    employees, 
    saveEmployee, 
    deleteEmployee, 
    users, 
    saveUser, 
    deleteUser, 
    currentUser, 
    refreshAll, 
    showToast, 
    carpenters,
    isDev,
    zerarSistema 
  } = useApp();

  const [subtab, setSubtab] = useState('parametros');

  // Paginação Funcionários
  const [pageEmployees, setPageEmployees] = useState(1);
  const [pageSizeEmployees, setPageSizeEmployees] = useState(10);
  const totalPagesEmployees = Math.max(1, Math.ceil(employees.length / pageSizeEmployees));
  const safePageEmployees = Math.min(Math.max(1, pageEmployees), totalPagesEmployees);
  const paginatedEmployees = useMemo(() => {
    const start = (safePageEmployees - 1) * pageSizeEmployees;
    return employees.slice(start, start + pageSizeEmployees);
  }, [employees, safePageEmployees, pageSizeEmployees]);

  // Paginação Contas
  const [pageUsers, setPageUsers] = useState(1);
  const [pageSizeUsers, setPageSizeUsers] = useState(10);
  const totalPagesUsers = Math.max(1, Math.ceil(users.length / pageSizeUsers));
  const safePageUsers = Math.min(Math.max(1, pageUsers), totalPagesUsers);
  const paginatedUsers = useMemo(() => {
    const start = (safePageUsers - 1) * pageSizeUsers;
    return users.slice(start, start + pageSizeUsers);
  }, [users, safePageUsers, pageSizeUsers]);

  // Estado dos parâmetros do formulário
  const [paramsForm, setParamsForm] = useState({
    senha_gerente: config.senha_gerente || '1234',
    desconto_maximo_livre: config.desconto_maximo_livre !== undefined ? config.desconto_maximo_livre : 5.0,
    percentual_preco_bruto: config.percentual_preco_bruto !== undefined ? config.percentual_preco_bruto : 20.0,
    percentual_taxa_debito: config.percentual_taxa_debito !== undefined ? config.percentual_taxa_debito : 2.5,
    taxa_plaina_padrao_ml: config.taxa_plaina_padrao_ml || 3.50,
    taxa_plaina_padrao_m2: config.taxa_plaina_padrao_m2 || 8.00,
    meta_faturamento_mensal: config.meta_faturamento_mensal || 150000,
    nome_madeireira: config.nome_madeireira || 'Serraria e Madeireira Bom Jesus',
    cnpj_madeireira: config.cnpj_madeireira || '16.482.988/0001-02',
    telefone_madeireira: config.telefone_madeireira || '(12) 99603-3793',
    endereco_madeireira: config.endereco_madeireira || 'Av. Adhemar Pinto de Siqueira, 1000 - Vila Galvão, Caçapava - SP'
  });

  useEffect(() => {
    if (config) {
      setParamsForm({
        senha_gerente: config.senha_gerente || '1234',
        desconto_maximo_livre: config.desconto_maximo_livre !== undefined ? config.desconto_maximo_livre : 5.0,
        percentual_preco_bruto: config.percentual_preco_bruto !== undefined ? config.percentual_preco_bruto : 20.0,
        percentual_taxa_debito: config.percentual_taxa_debito !== undefined ? config.percentual_taxa_debito : 2.5,
        taxa_plaina_padrao_ml: config.taxa_plaina_padrao_ml || 3.50,
        taxa_plaina_padrao_m2: config.taxa_plaina_padrao_m2 || 8.00,
        meta_faturamento_mensal: config.meta_faturamento_mensal || 150000,
        nome_madeireira: config.nome_madeireira || 'Serraria e Madeireira Bom Jesus',
        cnpj_madeireira: config.cnpj_madeireira || '16.482.988/0001-02',
        telefone_madeireira: config.telefone_madeireira || '(12) 99603-3793',
        endereco_madeireira: config.endereco_madeireira || 'Av. Adhemar Pinto de Siqueira, 1000 - Vila Galvão, Caçapava - SP'
      });
    }
  }, [config]);

  // Modal Pagar Comissão
  const [modalPagar, setModalPagar] = useState({
    isOpen: false,
    beneficiario: null,
    tipo: 'VENDEDOR',
    valor: 0,
    pix: ''
  });

  // Modal Novo / Editar Funcionário
  const [modalFuncionario, setModalFuncionario] = useState({
    isOpen: false,
    isEdit: false
  });

  const [formFuncionario, setFormFuncionario] = useState({
    id: '',
    nome: '',
    cargo: 'Vendedor de Balcão',
    telefone: '',
    email: '',
    comissao_pct: 2.0,
    salario_base: 2200.00,
    pix: '',
    ativo: true
  });

  // Modal Excluir Funcionário
  const [modalExcluirFuncionario, setModalExcluirFuncionario] = useState({
    isOpen: false,
    funcionario: null
  });

  // Modal Novo / Editar Conta de Usuário
  const [modalUsuario, setModalUsuario] = useState({
    isOpen: false,
    isEdit: false
  });

  const [formUsuario, setFormUsuario] = useState({
    id: '',
    username: '',
    nome: '',
    email: '',
    senha: '',
    perfil: 'FUNCIONARIO',
    cargo: 'Vendedor de Balcão',
    funcionario_id: '',
    ativo: true
  });

  // Modal Excluir Usuário
  const [modalExcluirUsuario, setModalExcluirUsuario] = useState({
    isOpen: false,
    usuario: null
  });

  // Toggle visualização de senhas na tabela
  const [mostrarSenhas, setMostrarSenhas] = useState({});

  const handleSalvarParametros = (e) => {
    e.preventDefault();
    if (!paramsForm.senha_gerente.trim()) {
      showToast('A senha do gerente não pode ser vazia.', 'error');
      return;
    }

    const updated = {
      ...config,
      ...paramsForm,
      senha_gerente: paramsForm.senha_gerente.trim(),
      desconto_maximo_livre: parseFloat(paramsForm.desconto_maximo_livre) || 5.0,
      percentual_preco_bruto: parseFloat(paramsForm.percentual_preco_bruto) || 20.0,
      percentual_taxa_debito: parseFloat(paramsForm.percentual_taxa_debito) || 2.5,
      taxa_plaina_padrao_ml: parseFloat(paramsForm.taxa_plaina_padrao_ml) || 3.50,
      taxa_plaina_padrao_m2: parseFloat(paramsForm.taxa_plaina_padrao_m2) || 8.00,
      meta_faturamento_mensal: parseFloat(paramsForm.meta_faturamento_mensal) || 150000
    };

    updateConfig(updated);
  };

  const handleConfirmarPagamentoComissao = () => {
    if (modalPagar.valor <= 0) {
      showToast('Informe um valor válido para pagamento.', 'warning');
      return;
    }

    DB.registrarPagamentoComissao({
      beneficiario_tipo: modalPagar.tipo,
      beneficiario_id: modalPagar.beneficiario.id,
      beneficiario_nome: modalPagar.beneficiario.nome,
      valor: parseFloat(modalPagar.valor),
      forma_pagamento: 'Pix'
    });

    refreshAll();
    setModalPagar({ isOpen: false, beneficiario: null, tipo: 'VENDEDOR', valor: 0, pix: '' });
    showToast(`Pagamento de ${CalcEngine.formatBRL(modalPagar.valor)} registrado com sucesso!`, 'success');
  };

  // Handlers Funcionário
  const handleAbrirNovoFuncionario = () => {
    setFormFuncionario({
      id: '',
      nome: '',
      cargo: 'Vendedor de Balcão',
      telefone: '',
      email: '',
      comissao_pct: 2.0,
      salario_base: 2200.00,
      pix: '',
      ativo: true
    });
    setModalFuncionario({ isOpen: true, isEdit: false });
  };

  const handleAbrirEditarFuncionario = (f) => {
    setFormFuncionario({
      id: f.id,
      nome: f.nome || '',
      cargo: f.cargo || 'Vendedor de Balcão',
      telefone: f.telefone || '',
      email: f.email || '',
      comissao_pct: f.comissao_pct !== undefined ? f.comissao_pct : 2.0,
      salario_base: f.salario_base || 0,
      pix: f.pix || '',
      ativo: f.ativo !== false
    });
    setModalFuncionario({ isOpen: true, isEdit: true });
  };

  const handleSalvarFuncionario = (e) => {
    e.preventDefault();
    if (!formFuncionario.nome.trim()) {
      showToast('O nome do funcionário é obrigatório.', 'warning');
      return;
    }

    const payload = {
      ...formFuncionario,
      id: formFuncionario.id || ('func_' + Date.now()),
      nome: formFuncionario.nome.trim(),
      comissao_pct: Math.max(0, parseFloat(formFuncionario.comissao_pct) || 0),
      salario_base: Math.max(0, parseFloat(formFuncionario.salario_base) || 0)
    };

    saveEmployee(payload);
    setModalFuncionario({ isOpen: false, isEdit: false });
  };

  const handleConfirmarExcluirFuncionario = () => {
    if (!modalExcluirFuncionario.funcionario) return;
    deleteEmployee(modalExcluirFuncionario.funcionario.id);
    setModalExcluirFuncionario({ isOpen: false, funcionario: null });
  };

  // Handlers Usuário / Contas de Acesso
  const handleAbrirNovoUsuario = () => {
    setFormUsuario({
      id: '',
      username: '',
      nome: '',
      email: '',
      senha: '',
      perfil: 'FUNCIONARIO',
      cargo: 'Vendedor de Balcão',
      funcionario_id: '',
      ativo: true
    });
    setModalUsuario({ isOpen: true, isEdit: false });
  };

  const handleAbrirEditarUsuario = (usr) => {
    setFormUsuario({
      id: usr.id,
      username: usr.username || '',
      nome: usr.nome || '',
      email: usr.email || '',
      senha: '', // Em edição, o campo de senha inicia vazio por segurança
      perfil: usr.perfil || 'FUNCIONARIO',
      cargo: usr.cargo || '',
      funcionario_id: usr.funcionario_id || '',
      ativo: usr.ativo !== false
    });
    setModalUsuario({ isOpen: true, isEdit: true });
  };

  const handleSalvarUsuario = (e) => {
    e.preventDefault();
    const cleanUsername = formUsuario.username.trim().toLowerCase().replace(/\s+/g, '');
    if (!cleanUsername) {
      showToast('O nome de usuário (login) é obrigatório.', 'warning');
      return;
    }
    if (!modalUsuario.isEdit && !formUsuario.senha.trim()) {
      showToast('A senha de acesso é obrigatória para novas contas.', 'warning');
      return;
    }

    const jaExiste = users.find(u => u.id !== formUsuario.id && u.username.toLowerCase() === cleanUsername);
    if (jaExiste) {
      showToast(`O nome de usuário "${cleanUsername}" já está em uso por ${jaExiste.nome}. Escolha outro login.`, 'warning');
      return;
    }

    const funcRef = employees.find(f => f.id === formUsuario.funcionario_id);

    const payload = {
      ...formUsuario,
      id: formUsuario.id || ('usr_' + Date.now()),
      username: cleanUsername,
      nome: formUsuario.nome.trim() || cleanUsername,
      cargo: funcRef ? funcRef.cargo : formUsuario.cargo,
      data_criacao: formUsuario.data_criacao || new Date().toISOString()
    };

    // Se a senha estiver em branco na edição, remove para não sobrescrever o hash existente
    if (modalUsuario.isEdit && !formUsuario.senha.trim()) {
      delete payload.senha;
    }

    saveUser(payload);
    showToast('Conta de acesso salva com sucesso!', 'success');
    setModalUsuario({ isOpen: false, isEdit: false });
  };

  const handleConfirmarExcluirUsuario = async () => {
    if (!modalExcluirUsuario.usuario) return;
    const usr = modalExcluirUsuario.usuario;

    // Proteção absoluta: a conta DEV jamais pode ser excluída
    if (usr.perfil === 'DEV' || usr.username === 'thales' || usr.email === 'thalesgabriel.war@gmail.com') {
      showToast('A conta de Desenvolvedor Master (DEV) é protegida e não pode ser excluída.', 'error');
      setModalExcluirUsuario({ isOpen: false, usuario: null });
      return;
    }

    if (currentUser && currentUser.id === usr.id) {
      showToast('Você não pode excluir a sua própria conta conectada no momento.', 'error');
      setModalExcluirUsuario({ isOpen: false, usuario: null });
      return;
    }

    // Se for conta de Administrador Geral sendo excluída por alguém que não é DEV:
    const isMainAdmin = usr.id === 'usr_admin' || usr.username === 'admin';
    if (isMainAdmin && !isDev) {
      showToast('Apenas a conta de Desenvolvedor (DEV) possui privilégio para excluir o Administrador Geral.', 'error');
      setModalExcluirUsuario({ isOpen: false, usuario: null });
      return;
    }

    setModalExcluirUsuario({ isOpen: false, usuario: null });
    await deleteUser(usr.id);
    showToast(`Conta de acesso "${usr.username}" (${usr.perfil}) excluída com sucesso!`, 'info');
  };

  return (
    <div className="gerente-layout">
      {/* SUB-ABAS DA CENTRAL DO GERENTE */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-medium)', paddingBottom: '10px', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${subtab === 'parametros' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSubtab('parametros')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span>Parâmetros & Senha</span>
        </button>
        <button 
          className={`btn ${subtab === 'equipe' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSubtab('equipe')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Equipe de Funcionários ({employees.length})</span>
        </button>
        <button 
          className={`btn ${subtab === 'contas' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSubtab('contas')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span>Contas de Acesso ao App ({users.length})</span>
        </button>
        <button 
          className={`btn ${subtab === 'comissoes' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSubtab('comissoes')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span>Comissões & Saldos</span>
        </button>
      </div>

      {/* ABA 1: PARÂMETROS E PREÇO BRUTO */}
      {subtab === 'parametros' && (
        <form onSubmit={handleSalvarParametros} style={{ maxWidth: '800px' }}>
          {/* PAINEL DE POLÍTICA DE PREÇO BRUTO */}
          <div className="panel" style={{ marginBottom: '16px' }}>
            <div className="panel-header">
              <span className="panel-title">
                <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Política de Preço Bruto (Venda a Prazo / Cartão)
              </span>
            </div>
            <div className="panel-body">
              <div className="form-grid" style={{ gridTemplateColumns: '1.2fr 1.8fr', gap: '16px', alignItems: 'center' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>Acréscimo Preço Bruto sobre À Vista (%):</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="number" 
                      step="1" 
                      min="0" 
                      max="100" 
                      className="form-input font-mono" 
                      style={{ fontWeight: 800, fontSize: '15px', width: '140px', color: '#1E40AF' }}
                      value={paramsForm.percentual_preco_bruto}
                      onChange={e => setParamsForm(prev => ({ ...prev, percentual_preco_bruto: e.target.value }))}
                    />
                    <span style={{ fontWeight: 800, color: '#1E40AF', fontSize: '14px' }}>%</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                    Percentual adicional aplicado sobre o valor à vista. Padrão: <code>20%</code>.
                  </span>
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1.45, color: 'var(--text-secondary)', background: '#EFF6FF', border: '1px solid #BFDBFE', borderLeft: '3px solid #3B82F6', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                  <strong style={{ color: '#1E40AF' }}>Visibilidade Automática:</strong> O Preço Bruto é calculado e exibido simultaneamente ao Preço À Vista no fechamento do orçamento no balcão e em todos os comprovantes impressos para o cliente.
                </div>
              </div>
            </div>
          </div>

          {/* PAINEL DE SEGURANÇA E DESCONTOS */}
          <div className="panel" style={{ marginBottom: '16px' }}>
            <div className="panel-header">
              <span className="panel-title">
                <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Segurança de Desconto & Trava no Balcão
              </span>
            </div>
            <div className="panel-body">
              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label className="form-label">Senha do Gerente (Liberação de Desconto):</label>
                  <input 
                    type="text" 
                    className="form-input font-mono" 
                    style={{ fontWeight: 700 }}
                    value={paramsForm.senha_gerente}
                    onChange={e => setParamsForm(prev => ({ ...prev, senha_gerente: e.target.value }))}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Exigida quando o desconto passar do teto livre. Padrão: <code>1234</code>.</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Teto de Desconto Livre para Vendedor (%):</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    className="form-input font-mono" 
                    value={paramsForm.desconto_maximo_livre}
                    onChange={e => setParamsForm(prev => ({ ...prev, desconto_maximo_livre: e.target.value }))}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Descontos até este percentual são aplicados sem pedir senha.</span>
                </div>
              </div>
            </div>
          </div>

          {/* PAINEL DE TAXAS DE CARTÃO E PRECIFICAÇÃO */}
          <div className="panel" style={{ marginBottom: '16px' }}>
            <div className="panel-header">
              <span className="panel-title">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Precificação & Taxas de Cartão (Débito e A Prazo)
              </span>
            </div>
            <div className="panel-body">
              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Taxa no Débito / Cartão à Vista (%):</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    className="form-input font-mono" 
                    value={paramsForm.percentual_taxa_debito}
                    onChange={e => setParamsForm(prev => ({ ...prev, percentual_taxa_debito: e.target.value }))}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Taxa da maquininha/banco para pagamento no débito ou 1x no cartão (Padrão: <code>2.5%</code>).
                  </span>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Acréscimo Preço Bruto / A Prazo (%):</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    className="form-input font-mono" 
                    value={paramsForm.percentual_preco_bruto}
                    onChange={e => setParamsForm(prev => ({ ...prev, percentual_preco_bruto: e.target.value }))}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Acréscimo comercial para vendas a prazo ou parceladas no crédito (Padrão: <code>20.0%</code>).
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PAINEL DE TAXAS OPERACIONAIS */}
          <div className="panel" style={{ marginBottom: '16px' }}>
            <div className="panel-header">
              <span className="panel-title">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Taxas Operacionais de Madeira & Metas
              </span>
            </div>
            <div className="panel-body">
              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <div className="form-group">
                  <label className="form-label">Taxa Plaina / Benefic. (R$/ML):</label>
                  <input 
                    type="number" 
                    step="0.50" 
                    className="form-input font-mono" 
                    value={paramsForm.taxa_plaina_padrao_ml}
                    onChange={e => setParamsForm(prev => ({ ...prev, taxa_plaina_padrao_ml: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Taxa Plaina Área (R$/M²):</label>
                  <input 
                    type="number" 
                    step="0.50" 
                    className="form-input font-mono" 
                    value={paramsForm.taxa_plaina_padrao_m2}
                    onChange={e => setParamsForm(prev => ({ ...prev, taxa_plaina_padrao_m2: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Meta Mensal da Serraria (R$):</label>
                  <input 
                    type="number" 
                    step="5000" 
                    className="form-input font-mono" 
                    value={paramsForm.meta_faturamento_mensal}
                    onChange={e => setParamsForm(prev => ({ ...prev, meta_faturamento_mensal: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PAINEL DE IDENTIFICAÇÃO DA MADEIREIRA */}
          <div className="panel" style={{ marginBottom: '20px' }}>
            <div className="panel-header">
              <span className="panel-title">Identificação da Madeireira (Romaneios & Orçamentos)</span>
            </div>
            <div className="panel-body">
              <div className="form-grid" style={{ gridTemplateColumns: '2fr 1.5fr' }}>
                <div className="form-group">
                  <label className="form-label">Razão Social / Nome Fantasia:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={paramsForm.nome_madeireira}
                    onChange={e => setParamsForm(prev => ({ ...prev, nome_madeireira: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CNPJ:</label>
                  <input 
                    type="text" 
                    className="form-input font-mono" 
                    value={paramsForm.cnpj_madeireira}
                    onChange={e => setParamsForm(prev => ({ ...prev, cnpj_madeireira: DocMascara.formatar(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="form-grid" style={{ gridTemplateColumns: '1.5fr 2fr', marginTop: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Telefone / WhatsApp:</label>
                  <input 
                    type="text" 
                    className="form-input font-mono" 
                    value={paramsForm.telefone_madeireira}
                    onChange={e => setParamsForm(prev => ({ ...prev, telefone_madeireira: DocMascara.formatarTelefone(e.target.value) }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Endereço Completo:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={paramsForm.endereco_madeireira}
                    onChange={e => setParamsForm(prev => ({ ...prev, endereco_madeireira: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button type="submit" className="btn btn-primary btn-lg" style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              <span>Salvar Parâmetros e Configurações</span>
            </button>
          </div>

          {/* PAINEL DE ZERAMENTO / INÍCIO DE TESTES REAIS */}
          <div className="panel" style={{ marginTop: '24px', border: '1px dashed #F59E0B', background: '#FFFBEB' }}>
            <div className="panel-header" style={{ borderBottom: '1px solid #FDE68A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="panel-title" style={{ color: '#B45309', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Preparação para Testes Reais (Zeramento de Movimentações)
              </span>
            </div>
            <div className="panel-body">
              <p style={{ fontSize: '13px', color: '#92400E', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                Caso precise recomeçar os testes reais do zero a qualquer momento, clique no botão abaixo. Isso irá zerar <strong>todos os pedidos, orçamentos, clientes e comissões</strong>, mantendo <strong>100% íntegro todo o estoque de produtos, preços, categorias e usuários</strong>.
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ borderColor: '#D97706', color: '#B45309', fontWeight: 700, background: '#FEF3C7' }}
                onClick={() => {
                  if (window.confirm('Atenção: Deseja realmente zerar todos os pedidos e clientes cadastrados para iniciar testes reais? O catálogo de produtos, estoque e contas de acesso continuarão intactos.')) {
                    zerarSistema();
                  }
                }}
              >
                Zerar Pedidos & Clientes Agora
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ABA 2: EQUIPE DE FUNCIONÁRIOS */}
      {subtab === 'equipe' && (
        <div className="panel">
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="panel-title">Equipe & Funcionários Cadastrados ({employees.length})</span>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleAbrirNovoFuncionario}
              style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>+ Novo Funcionário</span>
            </button>
          </div>
          <div className="table-responsive">
            <table className="dense-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Nome do Funcionário & Contato</th>
                  <th style={{ width: '150px' }}>Cargo / Função</th>
                  <th style={{ width: '100px' }} className="align-center">Comissão (%)</th>
                  <th style={{ width: '110px' }} className="align-right">Salário Base</th>
                  <th style={{ width: '130px' }} className="align-right">Vendas no Mês</th>
                  <th style={{ width: '120px' }} className="align-right">Saldo Comissão</th>
                  <th style={{ width: '70px' }} className="align-center">Status</th>
                  <th style={{ width: '160px' }} className="align-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      Nenhum funcionário cadastrado. Clique no botão acima para adicionar.
                    </td>
                  </tr>
                ) : (
                  paginatedEmployees.map(f => (
                    <tr key={f.id}>
                      <td>
                        <strong>{f.nome}</strong>
                        {(f.telefone || f.email) && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {f.telefone} {f.email ? `• ${f.email}` : ''}
                          </div>
                        )}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{f.cargo}</td>
                      <td className="align-center font-mono" style={{ fontWeight: 600 }}>
                        {f.comissao_pct !== undefined ? f.comissao_pct : 2.0}%
                      </td>
                      <td className="align-right font-mono" style={{ color: 'var(--text-secondary)' }}>
                        {CalcEngine.formatBRL(f.salario_base || 0)}
                      </td>
                      <td className="align-right font-mono" style={{ fontWeight: 700 }}>
                        {CalcEngine.formatBRL(f.vendas_mes || 0)}
                      </td>
                      <td className="align-right font-mono" style={{ fontWeight: 800, color: (f.saldo_comissao || 0) > 0 ? '#047857' : 'inherit' }}>
                        {CalcEngine.formatBRL(f.saldo_comissao || 0)}
                      </td>
                      <td className="align-center">
                        {f.ativo !== false ? (
                          <span className="badge-tag" style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', fontSize: '10px' }}>Ativo</span>
                        ) : (
                          <span className="badge-tag" style={{ background: '#F1F5F9', color: '#64748B', border: '1px solid #CBD5E1', fontSize: '10px' }}>Inativo</span>
                        )}
                      </td>
                      <td className="align-center">
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button 
                            type="button"
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '11px', padding: '2px 7px' }}
                            onClick={() => handleAbrirEditarFuncionario(f)}
                            title="Editar Dados do Funcionário"
                          >
                            Editar
                          </button>
                          {(f.saldo_comissao || 0) > 0 && (
                            <button 
                              type="button"
                              className="btn btn-sm btn-success" 
                              style={{ fontSize: '11px', padding: '2px 7px' }}
                              onClick={() => setModalPagar({ isOpen: true, beneficiario: f, tipo: 'VENDEDOR', valor: f.saldo_comissao || 0, pix: f.pix || '' })}
                              title="Pagar Comissão Pendente"
                            >
                              Pagar
                            </button>
                          )}
                          <button 
                            type="button"
                            className="btn btn-sm" 
                            style={{ 
                              fontSize: '11px', 
                              padding: '2px 7px', 
                              background: '#FEE2E2', 
                              color: '#DC2626', 
                              border: '1px solid #FCA5A5',
                              cursor: 'pointer' 
                            }}
                            onClick={() => setModalExcluirFuncionario({ isOpen: true, funcionario: f })}
                            title="Remover Funcionário"
                          >
                            Excluir
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
            currentPage={pageEmployees}
            totalItems={employees.length}
            pageSize={pageSizeEmployees}
            onPageChange={setPageEmployees}
            onPageSizeChange={setPageSizeEmployees}
            itemLabel="funcionários"
          />
        </div>
      )}

      {/* ABA 3: CONTAS DE ACESSO AO APP */}
      {subtab === 'contas' && (
        <div className="panel">
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="panel-title">Contas de Acesso ao Sistema ({users.length})</span>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Gerencie os logins, permissões (Admin ou Funcionário) e senhas dos colaboradores
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleAbrirNovoUsuario}
              style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>+ Nova Conta de Acesso</span>
            </button>
          </div>
          <div className="table-responsive">
            <table className="dense-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>Usuário / Login</th>
                  <th>Nome Completo</th>
                  <th style={{ width: '130px' }} className="align-center">Nível de Acesso</th>
                  <th style={{ width: '150px' }}>Cargo</th>
                  <th style={{ width: '150px' }}>Funcionário Vinculado</th>
                  <th style={{ width: '140px' }} className="align-center">Senha</th>
                  <th style={{ width: '70px' }} className="align-center">Status</th>
                  <th style={{ width: '130px' }} className="align-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      Nenhuma conta cadastrada.
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map(u => {
                  const vinculado = employees.find(e => e.id === u.funcionario_id);
                  const isExibindoSenha = mostrarSenhas[u.id];
                  const isCurrent = currentUser && currentUser.id === u.id;
                  const isMainAdmin = u.id === 'usr_admin';

                  return (
                    <tr key={u.id}>
                      <td className="font-mono" style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                        @{u.username}
                        {isCurrent && (
                          <span style={{ fontSize: '9.5px', background: '#DBEAFE', color: '#1E40AF', padding: '1px 5px', borderRadius: '3px', marginLeft: '5px' }}>Você</span>
                        )}
                      </td>
                      <td>
                        <strong>{u.nome}</strong>
                        {u.email && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.email}</div>}
                      </td>
                      <td className="align-center">
                        {u.perfil === 'DEV' ? (
                          <span className="badge-role-tag badge-role-dev" style={{ fontSize: '10px', padding: '2px 8px' }}>
                            ⚡ DEV MASTER
                          </span>
                        ) : u.perfil === 'ADMIN' ? (
                          <span className="badge-tag" style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FCD34D', fontWeight: 700, fontSize: '10.5px' }}>
                            👑 ADMIN (Total)
                          </span>
                        ) : (
                          <span className="badge-tag" style={{ background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', fontWeight: 600, fontSize: '10.5px' }}>
                            👤 FUNCIONÁRIO
                          </span>
                        )}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{u.cargo || '-'}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {vinculado ? vinculado.nome : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Não vinculado</span>}
                      </td>
                      <td className="align-center font-mono">
                        <span style={{ fontSize: '11px', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '3px 8px', borderRadius: '4px', color: '#0F766E', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                          <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="2.2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                          SHA-256
                        </span>
                      </td>
                      <td className="align-center">
                        {u.ativo !== false ? (
                          <span className="badge-tag" style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', fontSize: '10px' }}>Ativo</span>
                        ) : (
                          <span className="badge-tag" style={{ background: '#F1F5F9', color: '#64748B', border: '1px solid #CBD5E1', fontSize: '10px' }}>Inativo</span>
                        )}
                      </td>
                      <td className="align-center">
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button 
                            type="button"
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '11px', padding: '2px 7px' }}
                            onClick={() => handleAbrirEditarUsuario(u)}
                            title="Editar Conta e Redefinir Senha"
                          >
                            Editar
                          </button>
                          {!isCurrent && u.perfil !== 'DEV' && (isDev || !isMainAdmin) && (
                            <button 
                              type="button"
                              className="btn btn-sm" 
                              style={{ 
                                fontSize: '11px', 
                                padding: '2px 7px', 
                                background: '#FEE2E2', 
                                color: '#DC2626', 
                                border: '1px solid #FCA5A5',
                                cursor: 'pointer' 
                              }}
                              onClick={() => setModalExcluirUsuario({ isOpen: true, usuario: u })}
                              title="Remover Conta de Acesso"
                            >
                              Excluir
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={pageUsers}
            totalItems={users.length}
            pageSize={pageSizeUsers}
            onPageChange={setPageUsers}
            onPageSizeChange={setPageSizeUsers}
            itemLabel="contas"
          />
        </div>
      )}

      {/* ABA 4: COMISSÕES CONSOLIDADAS */}
      {subtab === 'comissoes' && (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Saldos de Comissões Pendentes (Vendedores & Parceiros)</span>
          </div>
          <div className="table-responsive">
            <table className="dense-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Beneficiário</th>
                  <th style={{ width: '120px' }}>Tipo</th>
                  <th style={{ width: '120px' }} className="align-center">Taxa (%)</th>
                  <th style={{ width: '150px' }} className="align-right">Saldo a Receber</th>
                  <th style={{ width: '130px' }} className="align-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {employees.filter(f => (f.saldo_comissao || 0) > 0).map(f => (
                  <tr key={f.id}>
                    <td><strong>{f.nome}</strong></td>
                    <td>Vendedor Balcão</td>
                    <td className="align-center font-mono">{f.comissao_pct}%</td>
                    <td className="align-right font-mono" style={{ fontWeight: 800, color: '#047857' }}>
                      {CalcEngine.formatBRL(f.saldo_comissao)}
                    </td>
                    <td className="align-center">
                      <button 
                        type="button"
                        className="btn btn-sm btn-success"
                        style={{ fontSize: '11px', padding: '2px 8px' }}
                        onClick={() => setModalPagar({ isOpen: true, beneficiario: f, tipo: 'VENDEDOR', valor: f.saldo_comissao, pix: f.pix || '' })}
                      >
                        Pagar Pix
                      </button>
                    </td>
                  </tr>
                ))}

                {carpenters.filter(c => (c.saldo_comissao || 0) > 0).map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.nome}</strong></td>
                    <td>Parceiro Carpinteiro</td>
                    <td className="align-center font-mono">{c.comissao_padrao_pct}%</td>
                    <td className="align-right font-mono" style={{ fontWeight: 800, color: '#047857' }}>
                      {CalcEngine.formatBRL(c.saldo_comissao)}
                    </td>
                    <td className="align-center">
                      <button 
                        type="button"
                        className="btn btn-sm btn-success"
                        style={{ fontSize: '11px', padding: '2px 8px' }}
                        onClick={() => setModalPagar({ isOpen: true, beneficiario: c, tipo: 'CARPINTEIRO', valor: c.saldo_comissao, pix: c.pix || '' })}
                      >
                        Pagar Pix
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL PAGAR COMISSÃO */}
      {modalPagar.isOpen && (
        <div className="modal-overlay active" style={{ display: 'flex' }} onClick={() => setModalPagar({ isOpen: false, beneficiario: null, tipo: 'VENDEDOR', valor: 0, pix: '' })}>
          <div className="modal-container" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Pagar Comissão</span>
              <button className="modal-close" onClick={() => setModalPagar({ isOpen: false, beneficiario: null, tipo: 'VENDEDOR', valor: 0, pix: '' })}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '12px' }}>
                <strong>{modalPagar.beneficiario?.nome}</strong> ({modalPagar.tipo})
                {modalPagar.pix && <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Chave Pix: {modalPagar.pix}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Valor do Pagamento (R$):</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-input font-mono" 
                  style={{ fontSize: '16px', fontWeight: 800 }}
                  value={modalPagar.valor}
                  onChange={e => setModalPagar(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalPagar({ isOpen: false, beneficiario: null, tipo: 'VENDEDOR', valor: 0, pix: '' })}>Cancelar</button>
              <button className="btn btn-success" onClick={handleConfirmarPagamentoComissao}>Confirmar Quitação</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVO / EDITAR FUNCIONÁRIO */}
      {modalFuncionario.isOpen && (
        <div className="modal-overlay active" style={{ display: 'flex' }} onClick={() => setModalFuncionario({ isOpen: false, isEdit: false })}>
          <div className="modal-container" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">
                {modalFuncionario.isEdit ? `Editar Funcionário: ${formFuncionario.nome}` : 'Cadastrar Novo Funcionário / Membro da Equipe'}
              </span>
              <button className="modal-close" onClick={() => setModalFuncionario({ isOpen: false, isEdit: false })}>&times;</button>
            </div>
            <form onSubmit={handleSalvarFuncionario}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Nome Completo:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: João da Silva"
                    required
                    value={formFuncionario.nome}
                    onChange={e => setFormFuncionario(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>

                <div className="form-grid" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Cargo / Função:</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: Vendedor de Balcão"
                      required
                      value={formFuncionario.cargo}
                      onChange={e => setFormFuncionario(prev => ({ ...prev, cargo: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Comissão sobre Vendas (%):</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      className="form-input font-mono"
                      value={formFuncionario.comissao_pct}
                      onChange={e => setFormFuncionario(prev => ({ ...prev, comissao_pct: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Telefone / WhatsApp:</label>
                    <input
                      type="text"
                      className="form-input font-mono"
                      placeholder="(12) 99000-0000"
                      value={formFuncionario.telefone}
                      onChange={e => setFormFuncionario(prev => ({ ...prev, telefone: DocMascara.formatarTelefone(e.target.value) }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Salário Base (R$):</label>
                    <input
                      type="number"
                      step="50"
                      min="0"
                      className="form-input font-mono"
                      value={formFuncionario.salario_base}
                      onChange={e => setFormFuncionario(prev => ({ ...prev, salario_base: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">E-mail (opcional):</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="joao@madeireira.com.br"
                      value={formFuncionario.email}
                      onChange={e => setFormFuncionario(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Chave Pix (p/ Comissões):</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="CPF, E-mail ou Telefone"
                      value={formFuncionario.pix}
                      onChange={e => setFormFuncionario(prev => ({ ...prev, pix: e.target.value }))}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    id="func-ativo-check"
                    checked={formFuncionario.ativo}
                    onChange={e => setFormFuncionario(prev => ({ ...prev, ativo: e.target.checked }))}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <label htmlFor="func-ativo-check" style={{ fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', margin: 0 }}>
                    Funcionário Ativo (aparece para seleção de vendedor no balcão)
                  </label>
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModalFuncionario({ isOpen: false, isEdit: false })}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
                  {modalFuncionario.isEdit ? 'Salvar Alterações' : 'Cadastrar Funcionário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EXCLUIR FUNCIONÁRIO */}
      {modalExcluirFuncionario.isOpen && (
        <div className="modal-overlay active" style={{ display: 'flex' }} onClick={() => setModalExcluirFuncionario({ isOpen: false, funcionario: null })}>
          <div className="modal-container" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ borderBottomColor: '#FEE2E2' }}>
              <span className="modal-title" style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                Remover Funcionário da Equipe
              </span>
              <button className="modal-close" onClick={() => setModalExcluirFuncionario({ isOpen: false, funcionario: null })}>&times;</button>
            </div>
            <div className="modal-body" style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: '13px', marginBottom: '12px' }}>
                Tem certeza que deseja remover o funcionário abaixo da equipe?
              </p>
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '6px', padding: '10px 14px', marginBottom: '12px' }}>
                <div style={{ fontWeight: 800, fontSize: '14px' }}>{modalExcluirFuncionario.funcionario?.nome}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Cargo: <strong>{modalExcluirFuncionario.funcionario?.cargo}</strong> • Comissão: {modalExcluirFuncionario.funcionario?.comissao_pct}%
                </div>
              </div>
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', padding: '8px 12px', fontSize: '11.5px', color: '#991B1B' }}>
                ⚠️ O funcionário não aparecerá mais para novos orçamentos no balcão. O histórico de pedidos já emitidos por ele será preservado.
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setModalExcluirFuncionario({ isOpen: false, funcionario: null })}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn"
                style={{ background: '#DC2626', color: '#FFFFFF', border: 'none', fontWeight: 700, padding: '0 16px', height: '36px' }}
                onClick={handleConfirmarExcluirFuncionario}
              >
                Sim, Remover Funcionário
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVO / EDITAR CONTA DE USUÁRIO */}
      {modalUsuario.isOpen && (
        <div className="modal-overlay active" style={{ display: 'flex' }} onClick={() => setModalUsuario({ isOpen: false, isEdit: false })}>
          <div className="modal-container" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">
                {modalUsuario.isEdit ? `Editar Conta de Acesso: @${formUsuario.username}` : 'Criar Nova Conta de Acesso ao Sistema'}
              </span>
              <button className="modal-close" onClick={() => setModalUsuario({ isOpen: false, isEdit: false })}>&times;</button>
            </div>
            <form onSubmit={handleSalvarUsuario}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Usuário de Login:</label>
                    <input
                      type="text"
                      className="form-input font-mono"
                      placeholder="Ex: joao.silva"
                      required
                      value={formUsuario.username}
                      onChange={e => setFormUsuario(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/\s+/g, '') }))}
                    />
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Sem espaços ou maiúsculas</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      {modalUsuario.isEdit ? 'Nova Senha (Opcional):' : 'Senha de Acesso:'}
                    </label>
                    <input
                      type="password"
                      className="form-input font-mono"
                      placeholder={modalUsuario.isEdit ? 'Manter senha atual...' : 'Digite a senha...'}
                      required={!modalUsuario.isEdit}
                      value={formUsuario.senha}
                      onChange={e => setFormUsuario(prev => ({ ...prev, senha: e.target.value }))}
                      autoComplete="new-password"
                    />
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                      {modalUsuario.isEdit ? 'Preencha apenas se desejar redefinir' : 'Criptografada com SHA-256 + Salt'}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nome Completo / Exibição:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: João da Silva (Vendedor)"
                    required
                    value={formUsuario.nome}
                    onChange={e => setFormUsuario(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>

                <div className="form-grid" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Nível de Permissão:</label>
                    <select
                      className="form-select"
                      value={formUsuario.perfil}
                      onChange={e => setFormUsuario(prev => ({ ...prev, perfil: e.target.value }))}
                    >
                      <option value="FUNCIONARIO">FUNCIONÁRIO (Balcão, Pátio e Histórico)</option>
                      <option value="ADMIN">ADMINISTRADOR (Acesso Total + Central Gerente)</option>
                      {currentUser?.perfil === 'DEV' && (
                        <option value="DEV">DEV MASTER (Acesso Supremo & Engenharia)</option>
                      )}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vincular a Funcionário:</label>
                    <select
                      className="form-select"
                      value={formUsuario.funcionario_id}
                      onChange={e => {
                        const f = employees.find(emp => emp.id === e.target.value);
                        setFormUsuario(prev => ({
                          ...prev,
                          funcionario_id: e.target.value,
                          cargo: f ? f.cargo : prev.cargo,
                          nome: prev.nome || (f ? f.nome : '')
                        }));
                      }}
                    >
                      <option value="">Nenhum (Usuário Avulso)</option>
                      {employees.map(f => (
                        <option key={f.id} value={f.id}>{f.nome} ({f.cargo})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">E-mail (opcional):</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="usuario@madeireira.com.br"
                    value={formUsuario.email}
                    onChange={e => setFormUsuario(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    id="usr-ativo-check"
                    checked={formUsuario.ativo}
                    onChange={e => setFormUsuario(prev => ({ ...prev, ativo: e.target.checked }))}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <label htmlFor="usr-ativo-check" style={{ fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', margin: 0 }}>
                    Conta Ativa (permite fazer login no sistema)
                  </label>
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModalUsuario({ isOpen: false, isEdit: false })}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
                  {modalUsuario.isEdit ? 'Salvar Alterações' : 'Criar Conta de Acesso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EXCLUIR CONTA DE USUÁRIO */}
      {modalExcluirUsuario.isOpen && (
        <div className="modal-overlay active" style={{ display: 'flex' }} onClick={() => setModalExcluirUsuario({ isOpen: false, usuario: null })}>
          <div className="modal-container" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ borderBottomColor: '#FEE2E2' }}>
              <span className="modal-title" style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                Excluir Conta de Acesso
              </span>
              <button className="modal-close" onClick={() => setModalExcluirUsuario({ isOpen: false, usuario: null })}>&times;</button>
            </div>
            <div className="modal-body" style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: '13px', marginBottom: '12px' }}>
                Tem certeza que deseja apagar a conta de acesso abaixo?
              </p>
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '6px', padding: '10px 14px', marginBottom: '12px' }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--brand-primary)' }}>
                  @{modalExcluirUsuario.usuario?.username}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {modalExcluirUsuario.usuario?.nome} ({modalExcluirUsuario.usuario?.perfil})
                </div>
              </div>
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', padding: '8px 12px', fontSize: '11.5px', color: '#991B1B' }}>
                ⚠️ O colaborador não conseguirá mais fazer login no sistema com este usuário.
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setModalExcluirUsuario({ isOpen: false, usuario: null })}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn"
                style={{ background: '#DC2626', color: '#FFFFFF', border: 'none', fontWeight: 700, padding: '0 16px', height: '36px' }}
                onClick={handleConfirmarExcluirUsuario}
              >
                Sim, Excluir Conta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
