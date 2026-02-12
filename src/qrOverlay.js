// qrOverlay.js
import { messageState } from './messageState.js';

class QROverlay {
  constructor() {
    this.overlay = document.getElementById('qr-overlay');
    this.qrCodeDisplay = document.getElementById('qr-code-display');
    this.qrUrlText = document.getElementById('qr-url-text');
    this.lastMessageDisplay = document.getElementById('last-message-display');
    this.lastMessageText = document.getElementById('last-message-text');
    this.qrGenerated = false;
    
    this.init();
  }

  init() {
    // Generar QR al cargar
    this.generateQR();
    
    // Suscribirse a cambios de estado
    messageState.subscribe((shouldShowQR, currentMessage, lastShownMessage) => {
      console.log('QR Overlay - shouldShowQR:', shouldShowQR, 'mensaje:', currentMessage, 'último:', lastShownMessage);
      
      // El QR se muestra siempre excepto durante el efecto
      if (shouldShowQR) {
        this.showQR();
      } else {
        this.hideQR();
      }

      // El último mensaje ya no se muestra porque el mensaje actual permanece visible
      // Solo mostrar si no hay mensaje actual
      if (!currentMessage && lastShownMessage) {
        this.showLastMessage(lastShownMessage);
      } else {
        this.hideLastMessage();
      }
    });
  }

  generateQR() {
    if (this.qrGenerated) return;

    const hostname = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;
    const url = `${protocol}//${hostname}${port ? ':' + port : ''}/send.html`;

    // Limpiar contenido previo
    this.qrCodeDisplay.innerHTML = '';

    // Generar código QR
    try {
      new QRCode(this.qrCodeDisplay, {
        text: url,
        width: 180,
        height: 180,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });

      this.qrUrlText.textContent = url;
      this.qrGenerated = true;
      console.log('QR generado para:', url);
    } catch (error) {
      console.error('Error generando QR:', error);
      this.qrCodeDisplay.innerHTML = '<p style="color: white;">Error al generar QR</p>';
    }
  }

  showQR() {
    console.log('Mostrando QR');
    this.overlay.style.display = 'flex';
  }

  hideQR() {
    console.log('Ocultando QR');
    this.overlay.style.display = 'none';
  }

  showLastMessage(message) {
    console.log('Mostrando último mensaje:', message);
    this.lastMessageText.textContent = message;
    this.lastMessageDisplay.style.display = 'block';
  }

  hideLastMessage() {
    console.log('Ocultando último mensaje');
    this.lastMessageDisplay.style.display = 'none';
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new QROverlay();
  });
} else {
  new QROverlay();
}
