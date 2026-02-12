// autoModerator.js
// Sistema automático de moderación que procesa mensajes pendientes

import { listenToPendingMessages, updateMessageStatus } from './firebase.js';
import { moderateMessage, isModeratorConfigured } from './moderator.js';

class AutoModerator {
  constructor() {
    this.isProcessing = false;
    this.processedMessages = new Set();
  }

  start() {
    if (!isModeratorConfigured()) {
      console.warn('⚠️ Gemini API no configurada. Los mensajes se aprobarán automáticamente sin moderación.');
    }

    console.log('🤖 Auto-moderador iniciado');

    listenToPendingMessages(async (messages) => {
      for (const message of messages) {
        // Evitar procesar el mismo mensaje múltiples veces
        if (this.processedMessages.has(message.id)) {
          continue;
        }

        this.processedMessages.add(message.id);
        await this.processMessage(message);
      }
    });
  }

  async processMessage(message) {
    console.log(`🔍 Moderando mensaje: "${message.text}"`);

    try {
      let moderation;

      if (isModeratorConfigured()) {
        // Moderar con Gemini
        moderation = await moderateMessage(message.text);
      } else {
        // Sin API key, aprobar automáticamente
        moderation = {
          status: 'approved',
          correctedText: message.text,
          reason: null
        };
      }

      console.log(`✅ Resultado: ${moderation.status}`, moderation);

      // Actualizar el mensaje en Firebase
      await updateMessageStatus(
        message.id,
        moderation.status,
        moderation.correctedText
      );

      if (moderation.status === 'approved') {
        console.log(`✅ Mensaje aprobado: "${moderation.correctedText}"`);
      } else {
        console.log(`❌ Mensaje rechazado: ${moderation.reason}`);
      }

    } catch (error) {
      console.error('Error al moderar mensaje:', error);
      
      // En caso de error, aprobar el mensaje original
      await updateMessageStatus(message.id, 'approved', message.text);
    }
  }

  // Limpiar mensajes procesados periódicamente
  clearProcessedCache() {
    this.processedMessages.clear();
  }
}

// Exportar instancia única
export const autoModerator = new AutoModerator();

// Limpiar cache cada 5 minutos
setInterval(() => {
  autoModerator.clearProcessedCache();
}, 5 * 60 * 1000);
