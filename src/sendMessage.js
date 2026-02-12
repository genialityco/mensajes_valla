// sendMessage.js
import { createMessage, listenToMessagePosition } from './firebase.js';

const form = document.getElementById('message-form');
const input = document.getElementById('message-input');
const charCount = document.getElementById('char-count');
const statusMessage = document.getElementById('status-message');
const sendButton = document.getElementById('send-button');

let currentMessageId = null;
let positionListener = null;

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
    const result = await createMessage(message);
    currentMessageId = result.messageId;
    
    //showMessage('¡Mensaje enviado! 🎉 Está en moderación...', 'success');
    input.value = '';
    charCount.textContent = '0';
    
    // Mostrar sección de posición en cola
    showQueuePosition();
    
    // Escuchar cambios en la posición
    if (positionListener) {
      positionListener(); // Detener listener anterior si existe
    }
    
    listenToMessagePosition(currentMessageId, (position) => {
      updateQueuePosition(position);
    });
    
    // Rehabilitar botón después de 3 segundos
    setTimeout(() => {
      sendButton.disabled = false;
      sendButton.textContent = 'Enviar a la Valla';
    }, 3000);
    
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    showMessage('Error al enviar el mensaje. Intenta de nuevo.', 'error');
    sendButton.disabled = false;
    sendButton.textContent = 'Enviar a la Valla';
  }
});

function showMessage(text, type) {
  console.log("mensage: ", text)
  statusMessage.textContent = text;
  statusMessage.className = `message ${type}`;
  
  setTimeout(() => {
    if (type === 'error') {
      statusMessage.className = 'message';
    }
  }, 5000);
}

function showQueuePosition() {
  let queueSection = document.getElementById('queue-section');
  
  if (!queueSection) {
    queueSection = document.createElement('div');
    queueSection.id = 'queue-section';
    queueSection.className = 'queue-section';
    queueSection.innerHTML = `
      <h3>📊 Estado de tu Mensaje</h3>
      <div id="queue-info" class="queue-info">
        <div class="queue-status">
          <span class="status-label">Estado:</span>
          <span id="message-status" class="status-value">Moderando...</span>
        </div>
        <div class="queue-position">
          <span class="position-label">Posición en cola:</span>
          <span id="position-value" class="position-value">Calculando...</span>
        </div>
        <div class="queue-text">
          <span class="text-label">Tu mensaje:</span>
          <span id="message-text" class="text-value"></span>
        </div>
      </div>
    `;
    
    statusMessage.parentElement.appendChild(queueSection);
  }
  
  queueSection.style.display = 'block';
}

function updateQueuePosition(position) {
  console.log(position)
  if (!position) {
    document.getElementById('queue-section').style.display = 'none';
    return;
  }
  
  const statusElement = document.getElementById('message-status');
  const positionElement = document.getElementById('position-value');
  const textElement = document.getElementById('message-text');
  
  // Actualizar texto del mensaje
  textElement.textContent = position.text;
  
  // Actualizar estado
  const statusMap = {
    'pending': { text: '⏳ En moderación', class: 'status-pending' },
    'approved': { text: '✅ Aprobado', class: 'status-approved' },
    'rejected': { text: '❌ Rechazado', class: 'status-rejected' },
    'shown': { text: '✨ Mostrado', class: 'status-shown' }
  };
  
  const statusInfo = statusMap[position.status] || { text: position.status, class: '' };
  statusElement.textContent = statusInfo.text;
  statusElement.className = `status-value ${statusInfo.class}`;
  
  // Actualizar posición según el estado
  if (position.status === 'approved' && position.position !== null) {
    positionElement.textContent = `${position.position} de ${position.total}`;
    positionElement.className = 'position-value position-active';
    showMessage('✅ ¡Tu mensaje fue aprobado! Está en la cola para mostrarse.', 'success');
  } else if (position.status === 'shown') {
    positionElement.textContent = '¡Ya se mostró!';
    positionElement.className = 'position-value position-shown';
    showMessage('✨ ¡Tu mensaje ya se mostró en la valla!', 'success');
  } else if (position.status === 'rejected') {
    positionElement.textContent = 'No se mostrará';
    positionElement.className = 'position-value position-rejected';
    showMessage('❌ Tu mensaje fue rechazado por no cumplir con las políticas de contenido. Por favor, intenta con otro mensaje.', 'error');
  } else if (position.status === 'pending') {
    if (position.position !== null) {
      positionElement.textContent = `${position.position} de ${position.total}`;
    } else {
      positionElement.textContent = 'En moderación';
    }
    positionElement.className = 'position-value position-pending';
  } else {
    positionElement.textContent = 'Calculando...';
    positionElement.className = 'position-value';
  }
}

