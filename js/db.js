/**
 * Db - acesso ao Realtime Database, sempre limitado ao usuário logado.
 * Requer: firebase-database-compat, firebase-config.js e auth.js.
 *
 * As Regras (firebase/database.rules.json) são a barreira real de segurança:
 * mesmo que alguém altere este arquivo no navegador, o servidor recusa
 * qualquer leitura de dados que não pertençam ao usuário.
 */
const Db = (() => {
  const db = firebase.database();

  const uid = () => {
    const user = firebase.auth().currentUser;
    if (!user) throw new Error('Usuário não autenticado.');
    return user.uid;
  };

  return {
    // Grava o perfil do próprio usuário (nome e email)
    saveProfile(user) {
      return db.ref(`users/${user.uid}/profile`).set({
        name: user.displayName || '',
        email: user.email || ''
      });
    },

    // IDs dos dispositivos vinculados ao usuário logado
    async myDevices() {
      const snap = await db.ref(`users/${uid()}/devices`).get();
      return snap.exists() ? Object.keys(snap.val()) : [];
    },

    // Leitura mais recente de um dispositivo. Retorna função para parar de ouvir.
    watchLatest(deviceId, callback, onError) {
      const ref = db.ref(`sensores/${deviceId}/ultima`);
      const handler = ref.on(
        'value',
        (snap) => callback(snap.val()),
        (err) => (onError || console.error)(err)
      );
      return () => ref.off('value', handler);
    },

    // Últimas N leituras do histórico (mais antigas primeiro)
    async history(deviceId, limit = 100) {
      const snap = await db
        .ref(`sensores/${deviceId}/historico`)
        .orderByChild('t')
        .limitToLast(limit)
        .get();
      const out = [];
      snap.forEach((child) => out.push(child.val()));
      return out;
    }
  };
})();
