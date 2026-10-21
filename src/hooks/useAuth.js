import { useState, useCallback } from 'react';
import { DB } from '../services/data.js';

const SESSION_KEY = 'serraria_sessao_ativa';

/**
 * Custom Hook: useAuth
 * Controle de acesso baseado em papéis (RBAC): Administrador vs Funcionário
 */
export function useAuth(showToast) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const userDb = DB.getUsuarios().find(u => u.id === parsed.id && u.ativo);
        if (userDb) return userDb;
      }
    } catch (e) {}

    const users = DB.getUsuarios();
    return users.find(u => u.perfil === 'ADMIN' && u.ativo) || users[0] || {
      id: 'u_1',
      nome: 'Carlos Eduardo',
      perfil: 'ADMIN',
      cargo: 'Gerente Geral'
    };
  });

  const switchUser = useCallback((user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch (e) {}
  }, []);

  const login = useCallback((username, password) => {
    const users = DB.getUsuarios();
    const user = users.find(u => 
      (u.username.toLowerCase() === username.trim().toLowerCase() || u.email.toLowerCase() === username.trim().toLowerCase()) &&
      u.senha === password
    );

    if (!user) {
      if (showToast) showToast('Usuário ou senha incorretos.', 'error');
      return { success: false, error: 'Credenciais inválidas.' };
    }

    if (!user.ativo) {
      if (showToast) showToast('Esta conta de acesso está desativada.', 'error');
      return { success: false, error: 'Conta desativada.' };
    }

    switchUser(user);
    if (showToast) showToast(`Bem-vindo(a), ${user.nome}!`, 'success');
    return { success: true, user };
  }, [switchUser, showToast]);

  const isAdmin = currentUser?.perfil === 'ADMIN';

  return {
    currentUser,
    setCurrentUser,
    switchUser,
    login,
    isAdmin
  };
}
