import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { DB } from '../../services/data.js';
import { Security } from '../../services/security.js';

export default function AuthModal({ isOpen, onClose }) {
  const { currentUser, switchUser, showToast } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const users = DB.getUsuarios();

  const handleFormLogin = (e) => {
    e.preventDefault();
    const cleanId = Security.sanitizeString(username).toLowerCase();
    const cleanPass = String(password || '').trim();

    if (!cleanId || !cleanPass) {
      setErrorMsg('Informe o usuário e a senha.');
      return;
    }

    const rateLimit = Security.checkRateLimit(cleanId);
    if (!rateLimit.allowed) {
      setErrorMsg(rateLimit.message);
      return;
    }

    const user = users.find(u => 
      u.username?.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId
    );

    if (!user) {
      Security.recordFailedLogin(cleanId);
      setErrorMsg('Credenciais inválidas. Verifique o usuário e a senha.');
      return;
    }

    const isMatch = Security.verifyPassword(cleanPass, user.hash, user.salt, user.senha);
    if (!isMatch) {
      Security.recordFailedLogin(cleanId);
      setErrorMsg('Credenciais inválidas. Verifique o usuário e a senha.');
      return;
    }

    if (!user.ativo) {
      setErrorMsg('Esta conta de acesso está desativada. Fale com a gerência.');
      return;
    }

    Security.clearFailedLogin(cleanId);
    switchUser(user);
    showToast(`Bem-vindo(a), ${user.nome}!`, 'success');
    onClose();
  };

  const handleSelectUserToLogin = (u) => {
    setUsername(u.username);
    setPassword('');
    setErrorMsg('');
  };

  return (
    <div className="modal-overlay active" id="modal-auth-login">
      <div className="modal-container" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--brand-primary-light)', color: 'var(--brand-primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <span className="modal-title">Alternar Conta de Acesso</span>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Autenticação obrigatória com senha</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleFormLogin}>
            {errorMsg && (
              <div className="alert-box alert-danger" style={{ marginBottom: 14, fontSize: 12, padding: '8px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger-border)', color: 'var(--danger-text)' }}>
                {errorMsg}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Usuário de Acesso ou E-mail:</label>
              <input
                type="text"
                className="form-input font-mono"
                placeholder="Ex: admin ou rodrigo"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setErrorMsg(''); }}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 18 }}>
              <label className="form-label">Senha de Acesso:</label>
              <input
                type="password"
                className="form-input font-mono"
                placeholder="Digite a senha da conta..."
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                required
                autoFocus
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 10, fontSize: '13.5px', fontWeight: 700 }}>
              <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}>
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Confirmar Troca de Usuário</span>
            </button>
          </form>

          {/* CONTAS DISPONÍVEIS */}
          <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Contas Cadastradas (Clique para preencher o login)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {users.filter(u => u.perfil !== 'DEV').map(u => {
                const initials = (u.nome || 'US').split(' ').map(n => n[0]).slice(0, 2).join('');
                const isAdmin = u.perfil === 'ADMIN';
                const isCurrent = currentUser?.id === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    style={{
                      border: isCurrent ? '2px solid var(--brand-primary)' : '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: isCurrent ? 'var(--brand-primary-light)' : '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onClick={() => handleSelectUserToLogin(u)}
                    title={`Preencher login @${u.username}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span 
                        className="user-avatar-badge" 
                        style={{ 
                          width: 28, 
                          height: 28, 
                          fontSize: 11, 
                          background: isDev ? 'linear-gradient(135deg, #4338CA, #6D28D9)' : (isAdmin ? '#0F172A' : '#059669'), 
                          color: '#fff', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: 700 
                        }}
                      >
                        {isDev ? '⚡' : initials}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--text-primary)' }}>
                          {u.nome} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>(@{u.username})</span>
                          {isCurrent && <span style={{ marginLeft: 6, fontSize: 10, color: 'var(--brand-primary)', fontWeight: 700 }}>• Sessão Atual</span>}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                          {u.cargo}
                        </div>
                      </div>
                    </div>
                    <span className={`badge-role-tag ${isDev ? 'badge-role-dev' : (isAdmin ? 'badge-role-admin' : 'badge-role-func')}`}>
                      {isDev ? 'DEV MASTER' : u.perfil}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
