// qrOverlay.js
import { messageState } from './messageState.js';

class QROverlay {
  constructor() {
    this.overlay = document.getElementById('qr-overlay');
    this.qrCodeDisplay = document.getElementById('qr-code-display');
    this.qrUrlText = document.getElementById('qr-url-text');
    this.qrGenerated = false;
    
    this.init();
  }

  init() {
    // Generar QR al cargar
    this.generateQR();
    
    // Suscribirse a cambios de estado
    messageState.subscribe((shouldShowQR, currentMessage) => {
      console.log('QR Overlay - shouldShowQR:', shouldShowQR, 'mensaje:', currentMessage);
      if (shouldShowQR) {
        this.showQR();
      } else {
        this.hideQR();
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
        width: 256,
        height: 256,
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
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new QROverlay();
  });
} else {
  new QROverlay();
}
