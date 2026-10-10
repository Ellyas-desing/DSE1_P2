/* Contas guardadas no navegador (localStorage). Demonstração: para produção, valide num servidor. */
const Auth = (() => {
 const KEY = 'usuarios', SESSION = 'sessao';
 const norm = (u) => u.trim().toLowerCase();
 const all = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
 const save = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)); return true; } catch { return false; } };

 async function hash(user, pass) {
 const text = norm(user) + ':' + pass;
 if (window.crypto && crypto.subtle) {
 const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
 return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
 }
 return btoa(unescape(encodeURIComponent(text)));
 }

 return {
 find: (u) => all().find((a) => a.id === norm(u)) || null,
 getByEmail: (email) => all().filter((a) => a.email === norm(email)),
 async register(user, email, pass) {
 const list = all();
 if (list.some((a) => a.id === norm(user))) return 'exists';
 if (list.some((a) => a.email === norm(email))) return 'email-exists';
 list.push({ id: norm(user), user: user.trim(), email: norm(email), hash: await hash(user, pass) });
 return save(list) ? 'ok' : 'storage';
 },
 async verify(account, pass) { return account.hash === await hash(account.user, pass); },
 login: (u) => sessionStorage.setItem(SESSION, u),
 current: () => sessionStorage.getItem(SESSION),
 logout: () => sessionStorage.removeItem(SESSION)
 };
})();