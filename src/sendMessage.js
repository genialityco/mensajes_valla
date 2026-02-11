// sendMessage.js
import { sendMessage } from './firebase.js';

const form = document.getElementById('message-form');
const input = document.getElementById('message-input');
const charCount = document.getElementById('char-count');
const statusMessage = document.getElementById('status-message');
const sendButton = document.getElementById('send-button');

// Contador de caracteres
input.addEventListener('input', () => {
  charCount.textContent = input.value.length;
});

// Enviar mensaje
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const message = input.value.trim();
  
  if (!message) {
    showMessage('Por favor escribe un mensaje', 'error');
    return;
  }

  // Deshabilitar botón mientras se envía
  sendButton.disabled = true;
  sendButton.textContent = 'Enviando...';

  try {
    await sendMessage(message);
    showMessage('¡Mensaje enviado con éxito! 🎉', 'success');
    input.value = '';
    charCount.textContent = '0';
    
    // Rehabilitar botón después de 2 segundos
    setTimeout(() => {
      sendButton.disabled = false;
      sendButton.textContent = 'Enviar a la Valla';
    }, 2000);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    showMessage('Error al enviar el mensaje. Intenta de nuevo.', 'error');
    sendButton.disabled = false;
    sendButton.textContent = 'Enviar a la Valla';
  }
});

function showMessage(text, type) {
  statusMessage.textContent = text;
  statusMessage.className = `message ${type}`;
  
  setTimeout(() => {
    statusMessage.className = 'message';
  }, 5000);
}
