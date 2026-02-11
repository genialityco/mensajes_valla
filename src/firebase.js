// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCogkgz7k0qxQDJp1_zXqX3Azo1IQ5TCYE",
  authDomain: "webinar-chat-5e700.firebaseapp.com",
  databaseURL: "https://webinar-chat-5e700-default-rtdb.firebaseio.com",
  projectId: "webinar-chat-5e700",
  storageBucket: "webinar-chat-5e700.firebasestorage.app",
  messagingSenderId: "787279273547",
  appId: "1:787279273547:web:0b5e53b94fa467742437ce",
  measurementId: "G-6DZ8V1YKD7"
};

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
