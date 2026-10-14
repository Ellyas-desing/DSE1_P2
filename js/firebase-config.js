/**
 * Firebase - configuração do projeto dse-2ab
 * (esses valores do app Web podem ficar no front-end; a segurança vem das
 *  Regras do banco e do Authentication, não de esconder esta config)
 *
 * NUNCA coloque aqui a chave de conta de serviço (JSON de admin).
 */
const firebaseConfig = {
  apiKey: "AIzaSyAUGOz1dJE31ptVZF56Fd7pcXThLmL2JWY",
  authDomain: "dse-2ab.firebaseapp.com",
  databaseURL: "https://dse-2ab-default-rtdb.firebaseio.com",
  projectId: "dse-2ab",
  storageBucket: "dse-2ab.firebasestorage.app",
  messagingSenderId: "276646407684",
  appId: "1:276646407684:web:2a3c2ca6d13312d12fcf51",
  measurementId: "G-LJW5QYH4YB"
};

firebase.initializeApp(firebaseConfig);
