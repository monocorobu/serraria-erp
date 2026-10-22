import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { Header } from './components/Header.jsx';
import { ToastContainer } from './components/ToastContainer.jsx';
import { PrintModal } from './components/modals/PrintModal.jsx';
import AuthModal from './components/modals/AuthModal.jsx';

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
  const { activeTab, setActiveTab, setEditingOrderId, orders, openPrintModal } = useApp();
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
          {activeTab === 'gerente' && <GerenteTab />}
          {activeTab === 'painel' && <PainelTab />}
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
