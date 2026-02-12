// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, set, query, orderByChild, equalTo, get, update } from 'firebase/database';

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
const messagesRef = ref(database, 'messages');

// Función para crear un nuevo mensaje en la cola
export async function createMessage(text) {
  const newMessageRef = push(messagesRef);
  const messageId = newMessageRef.key;
  
  // Obtener el último order para asignar el siguiente
  const snapshot = await get(messagesRef);
  let maxOrder = 0;
  
  if (snapshot.exists()) {
    const messages = snapshot.val();
    Object.values(messages).forEach(msg => {
      if (msg.order > maxOrder) {
        maxOrder = msg.order;
      }
    });
  }
  
  const messageData = {
    text: text,
    status: 'pending',
    createdAt: Date.now(),
    order: maxOrder + 1
  };
  
  await set(newMessageRef, messageData);
  
  return {
    messageId,
    ...messageData
  };
}

// Función para actualizar el estado de un mensaje
export async function updateMessageStatus(messageId, status, correctedText = null) {
  const messageRef = ref(database, `messages/${messageId}`);
  const updates = { status };
  
  if (correctedText) {
    updates.text = correctedText;
  }
  
  if (status === 'shown') {
    updates.shownAt = Date.now();
  }
  
  await update(messageRef, updates);
}

// Función para escuchar mensajes aprobados (para la valla)
export function listenToApprovedMessages(callback) {
  const approvedQuery = query(messagesRef, orderByChild('status'), equalTo('approved'));
  
  onValue(approvedQuery, (snapshot) => {
    if (snapshot.exists()) {
      const messages = [];
      snapshot.forEach((childSnapshot) => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      // Ordenar por order (más antiguo primero)
      messages.sort((a, b) => a.order - b.order);
      
      callback(messages);
    } else {
      callback([]);
    }
  });
}

// Función para escuchar mensajes pendientes (para moderación)
export function listenToPendingMessages(callback) {
  const pendingQuery = query(messagesRef, orderByChild('status'), equalTo('pending'));
  
  onValue(pendingQuery, (snapshot) => {
    if (snapshot.exists()) {
      const messages = [];
      snapshot.forEach((childSnapshot) => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      // Ordenar por createdAt
      messages.sort((a, b) => a.createdAt - b.createdAt);
      
      callback(messages);
    } else {
      callback([]);
    }
  });
}

// Función para obtener la posición en la cola de un mensaje
export async function getMessagePosition(messageId) {
  const snapshot = await get(messagesRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  // Primero buscar el mensaje específico
  let targetMessage = null;
  snapshot.forEach((childSnapshot) => {
    if (childSnapshot.key === messageId) {
      targetMessage = {
        id: childSnapshot.key,
        ...childSnapshot.val()
      };
    }
  });
  
  // Si no se encuentra el mensaje, retornar null
  if (!targetMessage) {
    return null;
  }
  
  // Si el mensaje está rechazado o mostrado, retornar su estado sin posición en cola
  if (targetMessage.status === 'rejected') {
    return {
      position: null,
      total: null,
      status: targetMessage.status,
      text: targetMessage.text
    };
  }
  
  if (targetMessage.status === 'shown') {
    return {
      position: null,
      total: null,
      status: targetMessage.status,
      text: targetMessage.text
    };
  }
  
  // Para mensajes pending o approved, calcular posición en cola
  const messages = [];
  snapshot.forEach((childSnapshot) => {
    const msg = childSnapshot.val();
    if (msg.status === 'pending' || msg.status === 'approved') {
      messages.push({
        id: childSnapshot.key,
        ...msg
      });
    }
  });
  
  // Ordenar por order
  messages.sort((a, b) => a.order - b.order);
  
  // Encontrar la posición
  const position = messages.findIndex(msg => msg.id === messageId);
  
  if (position === -1) {
    return null;
  }
  
  return {
    position: position + 1,
    total: messages.length,
    status: targetMessage.status,
    text: targetMessage.text
  };
}

// Función para escuchar la posición de un mensaje específico
export function listenToMessagePosition(messageId, callback) {
  // Escuchar cambios en todos los mensajes para calcular la posición
  onValue(messagesRef, async (snapshot) => {
    const position = await getMessagePosition(messageId);
    callback(position);
  });
}

// Función para obtener el último mensaje mostrado
export async function getLastShownMessage() {
  const snapshot = await get(messagesRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  const messages = [];
  snapshot.forEach((childSnapshot) => {
    const msg = childSnapshot.val();
    if (msg.status === 'shown' && msg.shownAt) {
      messages.push({
        id: childSnapshot.key,
        ...msg
      });
    }
  });
  
  // Ordenar por shownAt (más reciente primero)
  messages.sort((a, b) => b.shownAt - a.shownAt);
  
  return messages.length > 0 ? messages[0] : null;
}

export { database, messagesRef };

