import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalcEngine } from '../../services/calc.js';
import { DB, STORAGE_KEYS, DocMascara } from '../../services/data.js';

export const GerenteTab = () => {
  const { config, updateConfig, employees, refreshAll, showToast, carpenters } = useApp();

  const [subtab, setSubtab] = useState('parametros');

  // Estado dos parâmetros do formulário
  const [paramsForm, setParamsForm] = useState({
    senha_gerente: config.senha_gerente || '1234',
    desconto_maximo_livre: config.desconto_maximo_livre !== undefined ? config.desconto_maximo_livre : 5.0,
    percentual_preco_bruto: config.percentual_preco_bruto !== undefined ? config.percentual_preco_bruto : 20.0,
    taxa_plaina_padrao_ml: config.taxa_plaina_padrao_ml || 3.50,
    taxa_plaina_padrao_m2: config.taxa_plaina_padrao_m2 || 8.00,
    meta_faturamento_mensal: config.meta_faturamento_mensal || 150000,
    nome_madeireira: config.nome_madeireira || 'Serraria e Madeireira Bom Jesus',
    cnpj_madeireira: config.cnpj_madeireira || '16.482.988/0001-02',
    telefone_madeireira: config.telefone_madeireira || '(12) 99603-3793',
    endereco_madeireira: config.endereco_madeireira || 'Av. Adhemar Pinto de Siqueira, 1000 - Vila Galvão, Caçapava - SP'
  });

  // Modal Pagar Comissão
  const [modalPagar, setModalPagar] = useState({
    isOpen: false,
    beneficiario: null,
    tipo: 'VENDEDOR',
    valor: 0,
    pix: ''
  });

  const handleSalvarParametros = (e) => {
    e.preventDefault();
    if (!paramsForm.senha_gerente.trim()) {
      showToast('A senha do gerente não pode ser vazia.', 'error');
      return;
    }

    const updated = {
      ...config,
      ...paramsForm,
      desconto_maximo_livre: parseFloat(paramsForm.desconto_maximo_livre) || 5.0,
      percentual_preco_bruto: parseFloat(paramsForm.percentual_preco_bruto) || 20.0,
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

  return (
    <div className="gerente-layout">
      {/* SUB-ABAS DA CENTRAL DO GERENTE */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-medium)', paddingBottom: '10px' }}>
        <button 
          className={`btn ${subtab === 'parametros' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSubtab('parametros')}
        >
          ⚙️ Parâmetros & Preço Bruto (%)
        </button>
        <button 
          className={`btn ${subtab === 'equipe' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSubtab('equipe')}
        >
          👥 Equipe de Vendas ({employees.length})
        </button>
        <button 
          className={`btn ${subtab === 'comissoes' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSubtab('comissoes')}
        >
          💰 Comissões & Saldos
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

          <button type="submit" className="btn btn-primary btn-lg" style={{ fontWeight: 700 }}>
            💾 Salvar Parâmetros e Configurações
          </button>
        </form>
      )}

      {/* ABA 2: EQUIPE DE FUNCIONÁRIOS */}
      {subtab === 'equipe' && (
        <div className="panel">
          <div className="table-responsive">
            <table className="dense-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Nome do Funcionário</th>
                  <th style={{ width: '140px' }}>Cargo / Função</th>
                  <th style={{ width: '130px' }} className="align-center">Comissão (%)</th>
                  <th style={{ width: '140px' }} className="align-right">Vendas no Mês</th>
                  <th style={{ width: '130px' }} className="align-right">Saldo Comissão</th>
                  <th style={{ width: '120px' }} className="align-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(f => (
                  <tr key={f.id}>
                    <td><strong>{f.nome}</strong></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{f.cargo}</td>
                    <td className="align-center font-mono">{f.comissao_pct || 1.0}%</td>
                    <td className="align-right font-mono" style={{ fontWeight: 700 }}>
                      {CalcEngine.formatBRL(f.vendas_mes || 0)}
                    </td>
                    <td className="align-right font-mono" style={{ fontWeight: 800, color: (f.saldo_comissao || 0) > 0 ? '#047857' : 'inherit' }}>
                      {CalcEngine.formatBRL(f.saldo_comissao || 0)}
                    </td>
                    <td className="align-center">
                      <button 
                        className="btn btn-sm btn-success" 
                        style={{ fontSize: '11px', padding: '2px 8px' }}
                        disabled={(f.saldo_comissao || 0) <= 0}
                        onClick={() => setModalPagar({ isOpen: true, beneficiario: f, tipo: 'VENDEDOR', valor: f.saldo_comissao || 0, pix: f.pix || '' })}
                      >
                        Pagar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 3: COMISSÕES CONSOLIDADAS */}
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
        <div className="modal-overlay active" style={{ display: 'flex' }}>
          <div className="modal-container" style={{ maxWidth: '420px' }}>
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
    </div>
  );
};
