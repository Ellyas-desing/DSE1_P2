/**
 * Auth - Módulo de Autenticação
 * Gerencia registro, login e verificação de contas
 * NOTA: Para produção, use autenticação servidor-side com JWT
 */
const Auth = (() => {
  const KEY = 'usuarios';
  const SESSION = 'sessao';
  
  const norm = (str) => str.trim().toLowerCase();
  
  const sanitize = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };
  
  const all = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      console.error('Erro ao ler localStorage:', e);
      return [];
    }
  };
  
  const save = (list) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error('Erro ao salvar em localStorage:', e);
      return false;
    }
  };
  
  async function hash(user, pass) {
    const text = norm(user) + ':' + pass;
    
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return [...new Uint8Array(buf)]
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
    
    return btoa(unescape(encodeURIComponent(text)));
  }
  
  return {
    find: (username) => {
      if (!username || username.length < 3) return null;
      return all().find((a) => a.id === norm(username)) || null;
    },
    
    getByEmail: (email) => {
      if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return [];
      return all().filter((a) => a.email === norm(email));
    },
    
    async register(user, email, pass) {
      // Validação básica
      if (!user || user.length < 3) return 'invalid-user';
      if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'invalid-email';
      if (!pass || pass.length < 6) return 'invalid-pass';
      
      const list = all();
      
      // Verificar duplicatas
      if (list.some((a) => a.id === norm(user))) return 'exists';
      if (list.some((a) => a.email === norm(email))) return 'email-exists';
      
      // Criar conta com dados sanitizados
      list.push({
        id: norm(user),
        user: sanitize(user.trim()),
        email: norm(email),
        hash: await hash(user, pass)
      });
      
      return save(list) ? 'ok' : 'storage';
    },
    
    async verify(account, pass) {
      if (!account || !pass) return false;
      return account.hash === await hash(account.user, pass);
    },
    
    login: (username) => {
      if (username) {
        sessionStorage.setItem(SESSION, sanitize(username));
      }
    },
    
    current: () => sessionStorage.getItem(SESSION),
    
    logout: () => sessionStorage.removeItem(SESSION),
    
    isLoggedIn: () => !!sessionStorage.getItem(SESSION)
  };
})();