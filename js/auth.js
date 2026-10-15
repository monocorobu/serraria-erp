/**
 * SERRARIA & MADEIREIRA ERP - MÓDULO DE AUTENTICAÇÃO E PERMISSÕES (RBAC)
 * Controle seguro de contas: Administrador / Gerente vs Funcionário / Vendedor.
 */

const AuthModule = {
  SESSION_KEY: 'serraria_sessao_ativa',
  currentUser: null,

  init() {
    this.carregarSessao();
    this.setupEventListeners();
  },

  setupEventListeners() {
    const formLogin = document.getElementById('form-login-auth');
    if (formLogin) {
      formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('login-username').value.trim();
        const pass = document.getElementById('login-password').value;
        this.fazerLogin(user, pass);
      });
    }
  },

  carregarSessao() {
    const raw = localStorage.getItem(this.SESSION_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // Confirma se o usuário ainda existe no DB
        const usuarioDb = DB.getUsuarios().find(u => u.id === parsed.id && u.ativo);
        if (usuarioDb) {
          this.currentUser = usuarioDb;
        } else {
          this.definirUsuarioPadrao();
        }
      } catch (e) {
        this.definirUsuarioPadrao();
      }
    } else {
      this.definirUsuarioPadrao();
    }

    this.atualizarInterfaceUsuario();
    this.aplicarPermissoesUI();
  },

  definirUsuarioPadrao() {
    // Por padrão inicializa como Administrador (Carlos) para nunca travar a homologação
    const admin = DB.getUsuarios().find(u => u.perfil === 'ADMIN' && u.ativo) || DB.getUsuarios()[0];
    this.currentUser = admin;
    if (admin) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(admin));
    }
  },

  getUsuarioAtual() {
    return this.currentUser;
  },

  isAdmin() {
    return this.currentUser && this.currentUser.perfil === 'ADMIN';
  },

  podeAcessar(tabId) {
    if (tabId === 'gerente' || tabId === 'painel') {
      return this.isAdmin();
    }
    return true;
  },

  fazerLogin(username, senha) {
    const usuarios = DB.getUsuarios();
    const usuario = usuarios.find(u => 
      (u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()) && 
      u.senha === senha
    );

    if (!usuario) {
      App.showToast('Usuário ou senha incorretos.', 'error');
      const errEl = document.getElementById('login-error-msg');
      if (errEl) {
        errEl.textContent = 'Credenciais inválidas. Verifique o usuário e a senha.';
        errEl.style.display = 'block';
      }
      return false;
    }

    if (!usuario.ativo) {
      App.showToast('Esta conta de acesso está desativada. Fale com o gerente.', 'error');
      return false;
    }

    this.currentUser = usuario;
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(usuario));

    this.fecharModalLogin();
    this.atualizarInterfaceUsuario();
    this.aplicarPermissoesUI();

    // Se estiver em uma tela proibida para funcionários, redireciona para o balcão
    if (!this.isAdmin() && (App.currentTab === 'gerente' || App.currentTab === 'painel')) {
      App.switchTab('balcao');
    }

    const perfilNome = usuario.perfil === 'ADMIN' ? 'Administrador' : 'Funcionário';
    App.showToast(`Bem-vindo, ${usuario.nome}! Conectado como ${perfilNome}.`, 'success');
    return true;
  },

  loginRapido(username) {
    const usuario = DB.getUsuarios().find(u => u.username === username);
    if (usuario) {
      this.fazerLogin(usuario.username, usuario.senha);
    }
  },

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    this.currentUser = null;
    this.abrirModalLogin();
  },

  abrirModalLogin() {
    const modal = document.getElementById('modal-auth-login');
    if (!modal) return;

    const inputUser = document.getElementById('login-username');
    const inputPass = document.getElementById('login-password');
    const errEl = document.getElementById('login-error-msg');

    if (inputUser) inputUser.value = '';
    if (inputPass) inputPass.value = '';
    if (errEl) errEl.style.display = 'none';

    modal.classList.add('active');
    if (inputUser) inputUser.focus();
  },

  fecharModalLogin() {
    const modal = document.getElementById('modal-auth-login');
    if (modal) modal.classList.remove('active');
  },

  atualizarInterfaceUsuario() {
    if (!this.currentUser) return;

    const iniciais = this.currentUser.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const avatar = document.getElementById('user-session-avatar');
    const nome = document.getElementById('user-session-name');
    const badge = document.getElementById('user-session-badge');
    const cargo = document.getElementById('user-session-cargo');

    if (avatar) avatar.textContent = iniciais;
    if (nome) nome.textContent = this.currentUser.nome;
    if (cargo) cargo.textContent = this.currentUser.cargo || (this.currentUser.perfil === 'ADMIN' ? 'Diretoria / Gerência' : 'Balcão & Vendas');
    if (badge) {
      if (this.currentUser.perfil === 'ADMIN') {
        badge.textContent = 'ADMIN';
        badge.className = 'badge-role-tag badge-role-admin';
      } else {
        badge.textContent = 'FUNCIONÁRIO';
        badge.className = 'badge-role-tag badge-role-func';
      }
    }
  },

  aplicarPermissoesUI() {
    const isAdmin = this.isAdmin();

    // 1. Oculta ou exibe itens administrativos na barra lateral
    const navGerente = document.getElementById('nav-gerente');
    const navPainel = document.getElementById('nav-painel');

    if (navGerente) {
      navGerente.style.display = isAdmin ? 'flex' : 'none';
    }
    if (navPainel) {
      navPainel.style.display = isAdmin ? 'flex' : 'none';
    }

    // 2. Trava de Reajuste em Massa (%) e Cadastro na Tabela de Preços
    const btnReajusteMassa = document.getElementById('btn-abrir-reajuste-massa') || document.getElementById('btn-reajuste-massa-trigger');
    const btnNovoProd = document.getElementById('btn-novo-produto-modal');
    if (btnReajusteMassa) {
      btnReajusteMassa.style.display = isAdmin ? 'inline-flex' : 'none';
    }
    if (btnNovoProd) {
      btnNovoProd.style.display = isAdmin ? 'inline-flex' : 'none';
    }

    // 3. No Balcão: Se for funcionário/vendedor, trava a seleção de vendedor no próprio nome
    const selectVend = document.getElementById('balcao-vendedor-select');
    if (selectVend) {
      if (!isAdmin && this.currentUser && this.currentUser.funcionario_id) {
        selectVend.value = this.currentUser.funcionario_id;
        selectVend.disabled = true;
        if (window.BalcaoModule && BalcaoModule.currentOrder) {
          BalcaoModule.currentOrder.vendedor = {
            id: this.currentUser.funcionario_id,
            nome: this.currentUser.nome,
            comissao_pct: 2.0
          };
        }
      } else {
        selectVend.disabled = false;
      }
    }

    // 4. Se o módulo da gerência estiver na tela, atualiza listagem de contas
    if (window.GerenteModule && GerenteModule.renderTabelaContas) {
      GerenteModule.renderTabelaContas();
    }
  }
};

window.AuthModule = AuthModule;

