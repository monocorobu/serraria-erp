import { useState, useCallback, useEffect } from 'react';
import { DB } from '../services/data.js';
import { Security } from '../services/security.js';

const SESSION_KEY = 'serraria_sessao_ativa';

/**
 * Custom Hook: useAuth
 * Controle de autenticação e controle de acesso baseado em papéis (RBAC):
 * - DEV: Acesso Supremo / Superusuário (Todas as permissões + root de engenharia)
 * - ADMIN: Acesso Total (Gerência, Preços, Comissões, Caixa, Parâmetros e Exclusões)
 * - FUNCIONARIO: Acesso Operacional (Balcão de Vendas, Histórico, Pátio, Clientes e Consulta de Estoque)
 */
export function useAuth(showToast) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      if (typeof localStorage === 'undefined') return null;
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) {
          // Verificação de integridade da sessão contra adulteração no navegador
          if (!Security.verifySessionIntegrity(parsed)) {
            console.warn('Alerta de segurança: violação de integridade na sessão. Sessão descartada.');
            localStorage.removeItem(SESSION_KEY);
            return null;
          }

          const userDb = DB.getUsuarios().find(u => u.id === parsed.id && u.ativo);
          if (userDb) {
            return Security.sanitizeUser(userDb);
          }
        }
      }
    } catch (e) {
      console.error('Erro ao ler sessão de usuário:', e);
    }
    // Sem sessão salva ou sessão inválida: o sistema exige login obrigatório na tela inicial
    return null;
  });

  // Logout seguro: encerra a sessão ativa e limpa o armazenamento local
  const logout = useCallback(() => {
    setCurrentUser(null);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(SESSION_KEY);
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {}
    if (showToast) showToast('Sessão encerrada com sucesso.', 'info');
  }, [showToast]);

  // Validação contínua da conta ativa
  useEffect(() => {
    if (currentUser) {
      const userDb = DB.getUsuarios().find(u => u.id === currentUser.id);
      if (!userDb || !userDb.ativo) {
        logout();
      }
    }
  }, [currentUser, logout]);

  // Autenticação com verificação de credenciais criptografadas e proteção contra força bruta
  const login = useCallback((identifier, password, remember = true) => {
    const cleanId = Security.sanitizeString(identifier).toLowerCase();
    const cleanPass = String(password || '').trim();

    if (!cleanId || !cleanPass) {
      if (showToast) showToast('Preencha seu usuário e senha.', 'warning');
      return { success: false, error: 'Usuário e senha são obrigatórios.' };
    }

    // 1. Defesa contra Brute Force (Rate Limit)
    const rateLimit = Security.checkRateLimit(cleanId);
    if (!rateLimit.allowed) {
      if (showToast) showToast(rateLimit.message, 'error');
      return { success: false, error: rateLimit.message };
    }

    const users = DB.getUsuarios();
    const user = users.find(u => 
      (u.username?.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId)
    );

    if (!user) {
      Security.recordFailedLogin(cleanId);
      if (showToast) showToast('Usuário ou senha incorretos.', 'error');
      return { success: false, error: 'Credenciais inválidas. Verifique seu usuário e senha.' };
    }

    // 2. Verificação criptográfica da senha (SHA-256 + Salt em tempo constante)
    const isPasswordValid = Security.verifyPassword(
      cleanPass,
      user.hash,
      user.salt,
      user.senha // Fallback para migração de contas legadas
    );

    if (!isPasswordValid) {
      Security.recordFailedLogin(cleanId);
      if (showToast) showToast('Usuário ou senha incorretos.', 'error');
      return { success: false, error: 'Credenciais inválidas. Verifique seu usuário e senha.' };
    }

    if (!user.ativo) {
      if (showToast) showToast('Esta conta de acesso está desativada.', 'error');
      return { success: false, error: 'Conta de acesso inativa. Contate a gerência.' };
    }

    // Sucesso: reseta histórico de tentativas
    Security.clearFailedLogin(cleanId);

    // 3. Sanitização absoluta: NENHUMA senha ou hash permanece na sessão ou estado
    const safeUser = Security.sanitizeUser(user);
    const signature = Security.createSessionSignature(safeUser);
    const sessionPayload = { ...safeUser, signature };

    setCurrentUser(safeUser);

    try {
      if (typeof localStorage !== 'undefined') {
        if (remember) {
          localStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
        } else {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
        }
      }
    } catch (e) {}

    if (showToast) showToast(`Bem-vindo(a), ${safeUser.nome}!`, 'success');
    return { success: true, user: safeUser };
  }, [showToast]);

  const switchUser = useCallback((user) => {
    if (!user || !user.ativo) {
      logout();
      return;
    }
    const safeUser = Security.sanitizeUser(user);
    const signature = Security.createSessionSignature(safeUser);
    const sessionPayload = { ...safeUser, signature };

    setCurrentUser(safeUser);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
      }
    } catch (e) {}
  }, [logout]);

  const isDev = currentUser?.perfil === 'DEV';
  const isAdmin = currentUser?.perfil === 'ADMIN' || isDev;

  // Verificador granular de permissões
  const hasPermission = useCallback((recurso) => {
    if (!currentUser) return false;
    // Perfis DEV e ADMIN possuem acesso irrestrito
    if (currentUser.perfil === 'DEV' || currentUser.perfil === 'ADMIN') return true;

    // Recursos restritos exclusivamente para ADMIN e DEV
    const recursosRestritosAdmin = [
      'gerente',               // Central do Gerente
      'painel',                // Painel do Dono & Fluxo de Caixa
      'reajuste_precos',       // Reajuste em Massa (%)
      'excluir_produto',       // Excluir produtos do catálogo
      'gerenciar_equipe',      // Cadastro/exclusão de funcionários
      'gerenciar_contas',      // Gerenciamento de senhas e logins
      'pagar_comissao'         // Quitação de comissões
    ];

    if (recursosRestritosAdmin.includes(recurso)) {
      return false;
    }

    // Recursos liberados para FUNCIONARIO
    const recursosOperacionais = [
      'balcao',
      'historico',
      'patio',
      'precos',
      'estoque',
      'clientes',
      'tutorial'
    ];

    return recursosOperacionais.includes(recurso);
  }, [currentUser]);

  return {
    currentUser,
    setCurrentUser,
    login,
    logout,
    switchUser,
    isDev,
    isAdmin,
    hasPermission
  };
}
