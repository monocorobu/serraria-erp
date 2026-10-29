import React, { useState } from 'react';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Informe o usuário e a senha para entrar.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await onLoginSuccess(username, password, rememberMe);
      if (res && !res.success) {
        setErrorMsg(res.error || 'Credenciais inválidas.');
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg('Falha na autenticação. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        padding: '20px',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99999
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* CABEÇALHO DO CARD */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)',
            padding: '28px 24px 22px',
            textAlign: 'center',
            color: '#FFFFFF'
          }}
        >
          <img 
            src="/logo.png" 
            alt="Serraria Bom Jesus" 
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'contain',
              margin: '0 auto 12px',
              display: 'block',
              filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.45))'
            }}
          />
          <h1 style={{ fontSize: '19px', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.3px', color: '#FFFFFF' }}>
            Serraria Bom Jesus
          </h1>
          <p style={{ fontSize: '12px', color: '#CBD5E1', margin: 0, fontWeight: 500 }}>
            Caçapava - SP • Sistema Integrado de Gestão (ERP)
          </p>
        </div>

        {/* CORPO DO FORMULÁRIO */}
        <div style={{ padding: '24px 24px 20px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Autenticação de Usuário
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Informe suas credenciais para acessar o painel do sistema.
              </div>
            </div>

            {errorMsg && (
              <div 
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#991B1B',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2.2" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* CAMPO USUÁRIO */}
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '12px' }}>
                Usuário de Acesso ou E-mail:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input font-mono"
                  placeholder="Ex: admin ou rodrigo"
                  autoFocus
                  required
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  style={{
                    height: '42px',
                    fontSize: '13.5px',
                    paddingLeft: '36px'
                  }}
                />
                <div style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2.2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* CAMPO SENHA */}
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '12px' }}>
                Senha de Acesso:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input font-mono"
                  placeholder="Digite sua senha..."
                  required
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  style={{
                    height: '42px',
                    fontSize: '13.5px',
                    paddingLeft: '36px',
                    paddingRight: '40px'
                  }}
                />
                <div style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2.2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '11px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" fill="none" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" fill="none" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* LEMBRAR ACESSO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '18px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-secondary)', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{ width: '15px', height: '15px' }}
                />
                <span>Manter conectado durante o expediente</span>
              </label>
              <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px', paddingLeft: '23px' }}>
                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>Desconexão automática às 19:00 (requer login no dia seguinte).</span>
              </div>
            </div>

            {/* BOTÃO ENTRAR */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                height: '44px',
                fontSize: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2.2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>{loading ? 'Validando Acesso...' : 'Entrar no Sistema ERP'}</span>
            </button>
          </form>

          {/* INDICADOR DE SEGURANÇA AVANÇADA */}
          <div 
            style={{ 
              marginTop: '22px', 
              paddingTop: '16px', 
              borderTop: '1px solid #E2E8F0',
              fontSize: '11px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#059669" fill="none" strokeWidth="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span style={{ color: '#475569', fontWeight: 600 }}>
              Criptografia SHA-256 • Proteção Ativa contra Invasão & Força Bruta
            </span>
          </div>
        </div>

        {/* RODAPÉ DO CARD */}
        <div 
          style={{
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            padding: '10px 24px',
            textAlign: 'center',
            fontSize: '11px',
            color: 'var(--text-muted)'
          }}
        >
          Proteção de Dados & Controle de Acesso Baseado em Papéis (RBAC)
        </div>
      </div>
    </div>
  );
}
