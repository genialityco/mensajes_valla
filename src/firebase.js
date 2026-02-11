// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validar que las variables de entorno estén configuradas
if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
  console.error('⚠️ Error: Las variables de entorno de Firebase no están configuradas correctamente.');
  console.error('Por favor, crea un archivo .env en la raíz del proyecto con las credenciales de Firebase.');
  console.error('Puedes usar .env.example como plantilla.');
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Referencia a los mensajes
const messagesRef = ref(database, 'billboard-messages');

// Función para escuchar el mensaje actual
export function listenToCurrentMessage(callback) {
  const currentMessageRef = ref(database, 'billboard-messages/current');
  onValue(currentMessageRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.text) {
      callback(data.text);
    }
  });
}

// Función para enviar un nuevo mensaje
export function sendMessage(messageText) {
  const currentMessageRef = ref(database, 'billboard-messages/current');
  return set(currentMessageRef, {
    text: messageText,
    timestamp: Date.now()
  });
}

export { database, messagesRef };
