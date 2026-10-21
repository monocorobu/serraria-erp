import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { DB } from '../../services/data.js';

export default function AuthModal({ isOpen, onClose }) {
  const { currentUser, switchUser, showToast } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const users = DB.getUsuarios();

  const handleFormLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => 
      (u.username.toLowerCase() === username.trim().toLowerCase() || u.email.toLowerCase() === username.trim().toLowerCase()) &&
      u.senha === password
    );

    if (!user) {
      setErrorMsg('Credenciais inválidas. Verifique o usuário e a senha.');
      return;
    }

    if (!user.ativo) {
      setErrorMsg('Esta conta de acesso está desativada. Fale com o gerente.');
      return;
    }

    switchUser(user);
    showToast(`Bem-vindo(a), ${user.nome}!`, 'success');
    onClose();
  };

  const handleQuickLogin = (user) => {
    switchUser(user);
    showToast(`Sessão alternada para ${user.nome}!`, 'success');
    onClose();
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
              <span className="modal-title">Acesso Seguro ao Sistema ERP</span>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Controle de Contas: Administrador vs Funcionário</div>
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
              <label className="form-label">Usuário ou E-mail:</label>
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
                placeholder="Digite sua senha..."
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 10, fontSize: '13.5px', fontWeight: 700 }}>
              <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}>
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Entrar no Sistema</span>
            </button>
          </form>

          {/* ACESSO RÁPIDO PARA TESTE / DEMONSTRAÇÃO */}
          <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Acesso Rápido de Demonstração (1 Clique)</span>
              <span style={{ fontSize: 10, color: 'var(--brand-primary)', fontWeight: 600 }}>Homologação</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {users.map(u => {
                const initials = u.nome.split(' ').map(n => n[0]).slice(0, 2).join('');
                const isAdmin = u.perfil === 'ADMIN';
                const isCurrent = currentUser?.id === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    className="btn-demo-account"
                    style={{
                      border: isCurrent ? '2px solid var(--brand-primary)' : '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: isCurrent ? 'var(--brand-primary-light)' : '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleQuickLogin(u)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="user-avatar-badge" style={{ width: 28, height: 28, fontSize: 11, background: isAdmin ? '#0F172A' : '#059669', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        {initials}
                      </span>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--text-primary)' }}>
                          {u.nome} ({u.username})
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                          {u.cargo} • {isAdmin ? 'Acesso Total (Gerência, Preços e Caixa)' : 'Acesso Operacional (Balcão & Pátio)'}
                        </div>
                      </div>
                    </div>
                    <span className={`badge-role-tag ${isAdmin ? 'badge-role-admin' : 'badge-role-func'}`}>
                      {u.perfil}
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
