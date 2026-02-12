// messageState.js
// Sistema de eventos para coordinar el estado de los mensajes

class MessageState {
  constructor() {
    this.listeners = [];
    this.currentMessage = null;
    this.isEffectRunning = false;
    this.lastShownMessage = null;
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

  // Guardar el último mensaje mostrado
  setLastShownMessage(message) {
    this.lastShownMessage = message;
    this.notifyListeners();
  }

  // Verificar si debe mostrar QR
  shouldShowQR() {
    // Mostrar QR solo si no hay mensaje actual Y no está corriendo el efecto
    const hasNoMessage = !this.currentMessage || 
                        this.currentMessage.trim() === '' || 
                        this.currentMessage === 'Esperando mensaje...';
    
    // El QR se oculta solo durante el efecto de construcción
    return hasNoMessage || !this.isEffectRunning;
  }

  // Suscribirse a cambios
  subscribe(callback) {
    this.listeners.push(callback);
    // Llamar inmediatamente con el estado actual
    callback(this.shouldShowQR(), this.currentMessage, this.lastShownMessage);
  }

  // Notificar a todos los listeners
  notifyListeners() {
    const shouldShow = this.shouldShowQR();
    this.listeners.forEach(callback => callback(shouldShow, this.currentMessage, this.lastShownMessage));
  }
}

// Exportar instancia única (singleton)
export const messageState = new MessageState();
