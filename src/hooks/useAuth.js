import { useState, useCallback, useEffect } from 'react';
import { DB } from '../services/data.js';
import { Security } from '../services/security.js';
import { ApiClient } from '../services/api.js';

const SESSION_KEY = 'serraria_sessao_ativa';

/**
 * Calcula o horário de expiração da sessão com corte diário às 19:00.
 * Regra da Serraria:
 * - Se o login foi realizado antes das 19:00, a sessão encerra pontualmente às 19:00:00 de hoje.
 * - Se o login foi realizado às 19:00 ou após (acesso noturno extraordinário), a sessão é válida até as 19:00:00 do dia seguinte.
 */
export function calcularExpiracaoExpediente(dataLogin = new Date()) {
  const exp = new Date(dataLogin);
  if (dataLogin.getHours() >= 19) {
    exp.setDate(exp.getDate() + 1);
  }
  exp.setHours(19, 0, 0, 0);
  return exp.getTime();
}

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
          const now = Date.now();
          // 1. Verificação de Expiração do Expediente (Corte Diário às 19:00)
          const expiresAt = parsed.expires_at || (parsed.login_at ? calcularExpiracaoExpediente(new Date(parsed.login_at)) : 0);
          if (now >= expiresAt) {
            console.info('[Auth] Sessão anterior expirada pelo corte das 19:00. Necessário novo login.');
            localStorage.removeItem(SESSION_KEY);
            return null;
          }

          // 2. Verificação de integridade da sessão contra adulteração no navegador
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
  const logout = useCallback((motivo = 'MANUAL') => {
    setCurrentUser(null);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(SESSION_KEY);
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {}

    if (showToast) {
      if (motivo === 'EXPEDIENTE') {
        showToast('Expediente encerrado (19:00). A sessão foi finalizada por segurança. Até amanhã!', 'info');
      } else if (motivo === 'DESATIVADO') {
        showToast('Esta conta foi desativada pelo administrador.', 'warning');
      } else {
        showToast('Sessão encerrada com sucesso.', 'info');
      }
    }
  }, [showToast]);

  // Validação contínua da conta ativa e monitoramento do corte diário às 19:00
  useEffect(() => {
    if (!currentUser) return;

    const checarCorteExpediente = () => {
      try {
        const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
        if (!raw) {
          logout();
          return;
        }

        const session = JSON.parse(raw);
        const now = Date.now();
        const expiresAt = session.expires_at || (session.login_at ? calcularExpiracaoExpediente(new Date(session.login_at)) : 0);

        if (now >= expiresAt) {
          logout('EXPEDIENTE');
          return;
        }

        const userDb = DB.getUsuarios().find(u => u.id === currentUser.id);
        if (!userDb || !userDb.ativo) {
          logout('DESATIVADO');
        }
      } catch (e) {
        console.warn('[Auth] Erro ao validar expiração da sessão:', e);
      }
    };

    // Checagem a cada 10 segundos para desconectar pontualmente às 19h
    const timerId = setInterval(checarCorteExpediente, 10000);

    // Checagem imediata ao focar na janela ou acordar o computador
    window.addEventListener('focus', checarCorteExpediente);
    document.addEventListener('visibilitychange', checarCorteExpediente);

    return () => {
      clearInterval(timerId);
      window.removeEventListener('focus', checarCorteExpediente);
      document.removeEventListener('visibilitychange', checarCorteExpediente);
    };
  }, [currentUser, logout]);

  // Autenticação com verificação de credenciais criptografadas e proteção contra força bruta
  const login = useCallback(async (identifier, password, remember = true) => {
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

    let users = DB.getUsuarios();
    let user = users.find(u => 
      (u.username?.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId)
    );

    // Se o usuário não foi localizado no navegador local, busca do Neon imediatamente
    if (!user) {
      try {
        const remoteUsers = await ApiClient.getUsuarios();
        if (Array.isArray(remoteUsers) && remoteUsers.length > 0) {
          const merged = DB.mergeUsuarios(remoteUsers);
          users = merged;
          user = users.find(u => 
            (u.username?.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId)
          );
        }
      } catch (e) {}
    }

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
    const loginNow = Date.now();
    const expiresAt = calcularExpiracaoExpediente(new Date(loginNow));
    const sessionPayload = { 
      ...safeUser, 
      signature, 
      login_at: loginNow, 
      expires_at: expiresAt 
    };

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
      logout('DESATIVADO');
      return;
    }
    const safeUser = Security.sanitizeUser(user);
    const signature = Security.createSessionSignature(safeUser);
    const loginNow = Date.now();
    const expiresAt = calcularExpiracaoExpediente(new Date(loginNow));
    const sessionPayload = { 
      ...safeUser, 
      signature, 
      login_at: loginNow, 
      expires_at: expiresAt 
    };

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
