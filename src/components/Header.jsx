import React from 'react';
import { useApp } from '../context/AppContext';

const TAB_TITLES = {
  balcao: {
    title: 'Balcão de Vendas / Novo Orçamento',
    subtitle: 'Lançamento dinâmico de madeiramento, plaina e fechamento de pedidos'
  },
  historico: {
    title: 'Histórico de Pedidos & Gestão de Vendas',
    subtitle: 'Acompanhamento de orçamentos, vendas aprovadas, status e emissões'
  },
  patio: {
    title: 'Pátio, Maquinário & Expedição de Cargas',
    subtitle: 'Controle visual de corte, aparelhamento, carregamento e romaneios'
  },
  precos: {
    title: 'Tabela de Preços & Reajuste em Massa',
    subtitle: 'Gerenciamento de preços por metro linear, m² ou m³ e reajustes percentuais'
  },
  estoque: {
    title: 'Estoque Digital & Controle de Pátio',
    subtitle: 'Inventário completo de madeiras brutas, aparelhadas e materiais de telhado'
  },
  clientes: {
    title: 'Clientes & Parceiros Carpinteiros',
    subtitle: 'CRM comercial, histórico de compras por obra e comissões de parceiros'
  },
  gerente: {
    title: 'Central do Gerente & Parâmetros Executivos',
    subtitle: 'Gestão de equipe, comissões, auditoria de descontos e regras de preços'
  },
  painel: {
    title: 'Painel do Dono & Fluxo de Caixa',
    subtitle: 'Visão executiva em tempo real de faturamento, ticket médio e lucros'
  },
  tutorial: {
    title: 'Tutorial Interativo & Guia de Treinamento',
    subtitle: 'Manual visual passo a passo do fluxo operacional da Serraria'
  }
};

export const Header = ({ onOpenMobile, onOpenAuth }) => {
  const { activeTab, setActiveTab, currentUser, logout, showToast, cloudSyncStatus, syncWithCloud } = useApp();
  const info = TAB_TITLES[activeTab] || TAB_TITLES.balcao;

  return (
    <header className="top-header no-print">
      <div className="header-left-group">
        <button 
          type="button" 
          className="mobile-menu-btn" 
          id="btn-mobile-sidebar" 
          aria-label="Abrir Menu de Navegação" 
          title="Abrir Menu"
          onClick={onOpenMobile}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="header-title-block">
          <span className="header-title" id="header-active-title">{info.title}</span>
          <span className="header-subtitle" id="header-active-subtitle">{info.subtitle}</span>
        </div>
      </div>

      <div className="header-right-group">
        <div className="header-shortcuts" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="header-cloud-btn"
            onClick={() => syncWithCloud(false)}
            title={cloudSyncStatus?.isConnected ? `Nuvem ${cloudSyncStatus.provider || 'PostgreSQL'} sincronizada (${cloudSyncStatus.lastSync || 'agora'}). Clique para sincronizar agora.` : 'Modo local (clique para sincronizar com o banco na nuvem)'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '20px',
              border: cloudSyncStatus?.isConnected ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
              background: cloudSyncStatus?.isConnected ? '#F0FDF4' : '#F8FAFC',
              color: cloudSyncStatus?.isConnected ? '#15803D' : '#64748B',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: cloudSyncStatus?.isConnected ? '#22C55E' : '#94A3B8',
              boxShadow: cloudSyncStatus?.isConnected ? '0 0 6px #22C55E' : 'none',
              display: 'inline-block',
              flexShrink: 0
            }} />
            <span className="header-cloud-text">{cloudSyncStatus?.isConnected ? `${cloudSyncStatus.provider || 'Nuvem'} Conectado` : 'Modo Local'}</span>
          </button>

          <button 
            className="shortcut-btn btn-primary header-novo-btn" 
            id="btn-header-novo" 
            onClick={() => {
              setActiveTab('balcao');
              window.dispatchEvent(new CustomEvent('serraria:novo_orcamento'));
              showToast('Novo orçamento iniciado [F2]', 'info');
            }}
          >
            <kbd>F2</kbd>
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Novo Orçamento</span>
          </button>
        </div>

        <div className="header-divider-v"></div>

        {/* WIDGET DE SESSÃO & SEGURANÇA */}
        <div className="user-session-widget" id="user-session-widget">
          <div className="user-avatar-badge" id="user-session-avatar">
            {currentUser?.nome ? currentUser.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'US'}
          </div>
          <div className="user-info-text">
            <div className="user-name-line">
              <span className="user-display-name" id="user-session-name">
                {currentUser?.nome || 'Usuário'}
              </span>
              <span 
                className={`badge-role-tag ${
                  currentUser?.perfil === 'DEV' 
                    ? 'badge-role-dev' 
                    : currentUser?.perfil === 'ADMIN' 
                      ? 'badge-role-admin' 
                      : 'badge-role-func'
                }`} 
                id="user-session-badge"
              >
                {currentUser?.perfil === 'DEV' ? '👑 DEV MASTER' : (currentUser?.perfil || 'FUNCIONARIO')}
              </span>
            </div>
            <span className="user-cargo-line" id="user-session-cargo">
              {currentUser?.cargo || 'Colaborador'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button 
              type="button" 
              className="btn-user-switch" 
              onClick={onOpenAuth} 
              title="Alternar usuário / Trocar de conta"
            >
              <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M17 11l4-4-4-4"/><path d="M21 7H13"/></svg>
              <span>Trocar</span>
            </button>

            <button 
              type="button" 
              className="btn-user-switch" 
              onClick={logout} 
              title="Encerrar sessão / Sair do sistema"
              style={{
                background: '#FEF2F2',
                color: '#DC2626',
                borderColor: '#FECACA'
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
