import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { Header } from './components/Header.jsx';
import { ToastContainer } from './components/ToastContainer.jsx';
import { PrintModal } from './components/modals/PrintModal.jsx';
import AuthModal from './components/modals/AuthModal.jsx';
import LoginScreen from './components/LoginScreen.jsx';

import { BalcaoTab } from './components/tabs/BalcaoTab.jsx';
import { HistoricoTab } from './components/tabs/HistoricoTab.jsx';
import { PatioTab } from './components/tabs/PatioTab.jsx';
import { PrecosTab } from './components/tabs/PrecosTab.jsx';
import { EstoqueTab } from './components/tabs/EstoqueTab.jsx';
import { ClientesTab } from './components/tabs/ClientesTab.jsx';
import { GerenteTab } from './components/tabs/GerenteTab.jsx';
import { PainelTab } from './components/tabs/PainelTab.jsx';
import TutorialTab from './components/tabs/TutorialTab.jsx';

export default function App() {
  const { 
    activeTab, 
    setActiveTab, 
    setEditingOrderId, 
    orders, 
    openPrintModal,
    currentUser,
    login,
    isAdmin
  } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Atalhos Globais de Teclado (F2, F9, Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setActiveTab('balcao');
        window.dispatchEvent(new CustomEvent('serraria:novo_orcamento'));
      } else if (e.key === 'F9') {
        e.preventDefault();
        if (orders && orders.length > 0) {
          openPrintModal(orders[0], 'CLIENTE');
        }
      } else if (e.key === 'Escape') {
        setIsAuthModalOpen(false);
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orders, openPrintModal, setActiveTab]);

  // BLOQUEIO OBRIGATÓRIO: SE NÃO HOUVER USUÁRIO AUTENTICADO, EXIBE A TELA DE LOGIN
  if (!currentUser) {
    return (
      <div className="app-container" style={{ minHeight: '100vh', width: '100vw' }}>
        <LoginScreen onLoginSuccess={login} />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* SIDEBAR CORPORATIVA */}
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onCloseMobile={() => setIsMobileSidebarOpen(false)} 
      />

      {/* BACKDROP PARA DISPOSITIVOS MÓVEIS */}
      {isMobileSidebarOpen && (
        <div 
          className="sidebar-backdrop active" 
          id="sidebar-backdrop" 
          onClick={() => setIsMobileSidebarOpen(false)} 
        />
      )}

      {/* ÁREA PRINCIPAL */}
      <main className="main-wrapper">
        <Header 
          onOpenMobile={() => setIsMobileSidebarOpen(true)} 
          onOpenAuth={() => setIsAuthModalOpen(true)} 
        />

        <div className={`content-area ${activeTab === 'balcao' ? 'content-area-balcao' : ''}`}>
          {activeTab === 'balcao' && <BalcaoTab />}
          {activeTab === 'historico' && <HistoricoTab />}
          {activeTab === 'patio' && <PatioTab />}
          {activeTab === 'precos' && <PrecosTab />}
          {activeTab === 'estoque' && <EstoqueTab />}
          {activeTab === 'clientes' && <ClientesTab />}
          {activeTab === 'gerente' && (
            isAdmin ? (
              <GerenteTab />
            ) : (
              <div className="panel" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '500px', margin: '40px auto' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" fill="none" strokeWidth="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Acesso Restrito ao Administrador</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                  A <strong>Central do Gerente</strong> contém parâmetros comerciais confidenciais, regras de margem, senhas e controle financeiro. Seu perfil atual (<strong>{currentUser?.perfil}</strong>) não possui autorização.
                </p>
                <button type="button" className="btn btn-primary" onClick={() => setActiveTab('balcao')}>
                  Voltar para o Balcão de Vendas
                </button>
              </div>
            )
          )}
          {activeTab === 'painel' && (
            isAdmin ? (
              <PainelTab />
            ) : (
              <div className="panel" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '500px', margin: '40px auto' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" fill="none" strokeWidth="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Acesso Restrito ao Administrador</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                  O <strong>Painel do Dono & Fluxo de Caixa</strong> contém métricas financeiras globais e faturamento executivo. Seu perfil atual (<strong>{currentUser?.perfil}</strong>) não possui autorização.
                </p>
                <button type="button" className="btn btn-primary" onClick={() => setActiveTab('balcao')}>
                  Voltar para o Balcão de Vendas
                </button>
              </div>
            )
          )}
          {activeTab === 'tutorial' && (
            <TutorialTab 
              onCarregarExemplo={(pedidoId) => {
                setEditingOrderId(pedidoId);
                setActiveTab('balcao');
              }} 
            />
          )}
        </div>
      </main>

      {/* MODAL DE IMPRESSÃO A5 DEITADA COM DUPLO PREÇO */}
      <PrintModal />

      {/* MODAL DE AUTENTICAÇÃO E TROCA DE USUÁRIO */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* NOTIFICAÇÕES TOAST DO SISTEMA */}
      <ToastContainer />
    </div>
  );
}
