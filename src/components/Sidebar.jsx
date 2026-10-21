import React from 'react';
import { useApp } from '../context/AppContext';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, orders, products } = useApp();

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const pendingPatioCount = orders.filter(o => o.status === 'APROVADO' && o.etapa_patio !== 'ENTREGUE').length;
  const totalStockCount = products.length;

  return (
    <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <div className="brand-info">
          <h1>Serraria Bom Jesus</h1>
          <span>Caçapava - SP</span>
        </div>
        <button 
          className="sidebar-close-btn" 
          id="btn-sidebar-close" 
          aria-label="Fechar Menu"
          onClick={onCloseMobile}
        >
          &times;
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Comercial & Vendas</div>
        
        <a 
          className={`nav-item ${activeTab === 'balcao' ? 'active' : ''}`} 
          onClick={() => handleSelectTab('balcao')}
          style={{ cursor: 'pointer' }}
        >
          <div className="nav-item-left">
            <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            <span>Balcão / Novo Orçamento</span>
          </div>
          <kbd className="nav-badge">F2</kbd>
        </a>

        <a 
          className={`nav-item ${activeTab === 'historico' ? 'active' : ''}`} 
          onClick={() => handleSelectTab('historico')}
          style={{ cursor: 'pointer' }}
        >
          <div className="nav-item-left">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Histórico & Vendas</span>
          </div>
        </a>

        <div className="nav-section-title">Operacional de Carga</div>

        <a 
          className={`nav-item ${activeTab === 'patio' ? 'active' : ''}`} 
          onClick={() => handleSelectTab('patio')}
          style={{ cursor: 'pointer' }}
        >
          <div className="nav-item-left">
            <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            <span>Pátio, Serra & Cargas</span>
          </div>
          <span className="nav-badge badge-amber" id="sidebar-badge-patio">
            {pendingPatioCount > 0 ? `${pendingPatioCount} Fila` : 'Livre'}
          </span>
        </a>

        <div className="nav-section-title">Catálogo & Parceiros</div>

        <a 
          className={`nav-item ${activeTab === 'precos' ? 'active' : ''}`} 
          onClick={() => handleSelectTab('precos')}
          style={{ cursor: 'pointer' }}
        >
          <div className="nav-item-left">
            <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span>Tabela de Preços (%)</span>
          </div>
        </a>

        <a 
          className={`nav-item ${activeTab === 'estoque' ? 'active' : ''}`} 
          onClick={() => handleSelectTab('estoque')}
          style={{ cursor: 'pointer' }}
        >
          <div className="nav-item-left">
            <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            <span>Estoque & Inventário</span>
          </div>
          <span className="nav-badge" id="sidebar-badge-estoque">{totalStockCount}</span>
        </a>

        <a 
          className={`nav-item ${activeTab === 'clientes' ? 'active' : ''}`} 
          onClick={() => handleSelectTab('clientes')}
          style={{ cursor: 'pointer' }}
        >
          <div className="nav-item-left">
            <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Clientes & Parceiros</span>
          </div>
        </a>

        <div className="nav-section-title">Gestão & Diretoria</div>

        <a 
          className={`nav-item ${activeTab === 'gerente' ? 'active' : ''}`} 
          onClick={() => handleSelectTab('gerente')}
          style={{ cursor: 'pointer' }}
        >
          <div className="nav-item-left">
            <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Central do Gerente</span>
          </div>
          <span className="nav-badge" style={{ backgroundColor: 'var(--brand-primary)', color: '#FFFFFF' }}>Admin</span>
        </a>

        <a 
          className={`nav-item ${activeTab === 'painel' ? 'active' : ''}`} 
          onClick={() => handleSelectTab('painel')}
          style={{ cursor: 'pointer' }}
        >
          <div className="nav-item-left">
            <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            <span>Painel do Dono & Caixa</span>
          </div>
        </a>

        <a 
          className={`nav-item ${activeTab === 'tutorial' ? 'active' : ''}`} 
          onClick={() => handleSelectTab('tutorial')}
          style={{ cursor: 'pointer' }}
        >
          <div className="nav-item-left">
            <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <span>Tutorial do Sistema</span>
          </div>
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status-tag">
          <span className="status-dot"></span>
          <span>React 19 + Vite • Online</span>
        </div>
        <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
          Serraria ERP • Alta Eficiência
        </div>
      </div>
    </aside>
  );
};
