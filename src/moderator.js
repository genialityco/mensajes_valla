// moderator.js
// Sistema de moderación de mensajes usando Gemini AI

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function moderateMessage(text) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `Eres un moderador de mensajes para una valla publicitaria pública.

Analiza el siguiente mensaje y determina:
Actúa como un moderador de contenido estricto y experto en español regional (incluyendo jerga ofensiva de México, Colombia, Argentina y España).

Analiza el siguiente mensaje: "${text}"

### Criterios de Evaluación:
1. **Tolerancia Cero a Groserías:** Rechaza cualquier mensaje que contenga insultos, palabras soeces o derivados, incluso si están mal escritos o camuflados (ej: "p_to", "m4lparido", "hpta"). 
2. **Contenido Prohibido:** Sin violencia, contenido sexual, discriminación, spam o datos personales.
3. **Corrección Técnica:** Si es aprobado, corrige ortografía y gramática sin alterar el tono ni el sentido.
4. **Restricción de Longitud:** El 'correctedText' no debe exceder los 50 caracteres.

### Reglas de Salida:
- Si el mensaje contiene UNA SOLA palabra ofensiva de la lista negra (incluyendo "puto", "malparido", "gonorrea", "pendejo" y similares), el status DEBE ser "rejected".
- Si el mensaje es aprobado pero excede los 50 caracteres, recórtalo manteniendo el sentido o recházalo por longitud.

Responde ÚNICAMENTE con un JSON válido:
{
  "status": "approved" | "rejected",
  "correctedText": "mensaje corregido o null si es rechazado",
  "reason": "explicación breve del rechazo o null si es aprobado"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    console.log("mensaje AI ", responseText)
    
    // Extraer JSON de la respuesta (puede venir con markdown)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se pudo extraer JSON de la respuesta');
    }
    
    const moderation = JSON.parse(jsonMatch[0]);
    
    // Validar estructura
    if (!moderation.status) {
      throw new Error('Respuesta de moderación inválida: falta status');
    }
    
    // Si es aprobado, debe tener correctedText
    if (moderation.status === 'approved' && !moderation.correctedText) {
      throw new Error('Respuesta de moderación inválida: mensaje aprobado sin correctedText');
    }
    
    // Si es rechazado, correctedText puede ser null
    let finalCorrectedText = moderation.status === 'rejected' 
      ? null 
      : moderation.correctedText;
    
    // Asegurar que el texto corregido no exceda 50 caracteres (solo si existe)
    if (finalCorrectedText && finalCorrectedText.length > 50) {
      finalCorrectedText = finalCorrectedText.substring(0, 50);
    }
    
    return {
      status: moderation.status === 'approved' ? 'approved' : 'rejected',
      correctedText: finalCorrectedText,
      reason: moderation.reason || null
    };
    
  } catch (error) {
    console.error('Error en moderación:', error);
    
    // En caso de error, aprobar el mensaje original pero registrar el error
    return {
      status: 'approved',
      correctedText: text.substring(0, 50),
      reason: null,
      error: 'Error en moderación automática'
    };
  }
}

// Función para validar que la API key esté configurada
export function isModeratorConfigured() {
  return !!import.meta.env.VITE_GEMINI_API_KEY && 
         import.meta.env.VITE_GEMINI_API_KEY !== 'tu_gemini_api_key_aqui';
}
