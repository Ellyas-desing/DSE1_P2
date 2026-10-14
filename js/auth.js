/**
 * Auth - Módulo de Autenticação (Firebase Authentication, email + senha)
 * Requer: firebase-app-compat, firebase-auth-compat e js/firebase-config.js
 */
const Auth = (() => {
  // Descarta as contas antigas que ficavam no localStorage (sistema anterior)
  try {
    localStorage.removeItem('usuarios');
    sessionStorage.removeItem('sessao');
  } catch (e) {}

  const fb = firebase.auth();

  // Traduz os códigos do Firebase para códigos simples usados pelas páginas
  function mapCode(code) {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/invalid-login-credentials':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'invalid-credential';
      case 'auth/email-already-in-use':
        return 'email-exists';
      case 'auth/invalid-email':
        return 'invalid-email';
      case 'auth/weak-password':
        return 'invalid-pass';
      case 'auth/too-many-requests':
        return 'too-many';
      case 'auth/network-request-failed':
        return 'network';
      case 'auth/user-disabled':
        return 'disabled';
      default:
        return 'error';
    }
  }

  // Resolve com o usuário atual (ou null) assim que o Firebase restaurar a sessão
  const ready = () =>
    new Promise((resolve) => {
      const off = fb.onAuthStateChanged((user) => {
        off();
        resolve(user);
      });
    });

  return {
    ready,

    // Garante login: sem usuário, redireciona. Use no topo de páginas protegidas.
    async require(redirect) {
      const user = await ready();
      if (!user) {
        location.replace(redirect);
        return new Promise(() => {}); // não segue a execução da página
      }
      return user;
    },

    nameOf: (user) => (user && (user.displayName || user.email)) || '',

    async register(name, email, pass) {
      try {
        const cred = await fb.createUserWithEmailAndPassword(email.trim(), pass);
        await cred.user.updateProfile({ displayName: name.trim() });
        return 'ok';
      } catch (e) {
        console.error('Auth.register:', e.code || e);
        return mapCode(e.code);
      }
    },

    async login(email, pass) {
      try {
        await fb.signInWithEmailAndPassword(email.trim(), pass);
        return 'ok';
      } catch (e) {
        console.error('Auth.login:', e.code || e);
        return mapCode(e.code);
      }
    },

    logout: () => fb.signOut(),

    current: () => fb.currentUser,

    isLoggedIn: () => !!fb.currentUser
  };
})();
