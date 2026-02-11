// messageState.js
// Sistema de eventos para coordinar el estado de los mensajes

class MessageState {
  constructor() {
    this.listeners = [];
    this.currentMessage = null;
    this.isEffectRunning = false;
  }

  // Notificar cambio de mensaje
  setMessage(message) {
    this.currentMessage = message;
    this.notifyListeners();
  }

  // Notificar que el efecto está corriendo
  setEffectRunning(isRunning) {
    this.isEffectRunning = isRunning;
    this.notifyListeners();
  }

  // Verificar si debe mostrar QR
  shouldShowQR() {
    const hasNoMessage = !this.currentMessage || 
                        this.currentMessage.trim() === '' || 
                        this.currentMessage === 'Esperando mensaje...';
    const effectFinished = !this.isEffectRunning;
    
    return hasNoMessage || (effectFinished && this.currentMessage);
  }

  // Suscribirse a cambios
  subscribe(callback) {
    this.listeners.push(callback);
    // Llamar inmediatamente con el estado actual
    callback(this.shouldShowQR(), this.currentMessage);
  }

  // Notificar a todos los listeners
  notifyListeners() {
    const shouldShow = this.shouldShowQR();
    this.listeners.forEach(callback => callback(shouldShow, this.currentMessage));
  }
}

// Exportar instancia única (singleton)
export const messageState = new MessageState();
