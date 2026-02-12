## 🤖 Sistema de Cola y Moderación con IA

Sistema completo de gestión de mensajes con cola, moderación automática por IA (Gemini) y seguimiento en tiempo real.

## 📋 Características

- ✅ Cola de mensajes con orden automático
- 🤖 Moderación automática con Gemini AI
- 📊 Seguimiento de posición en cola en tiempo real
- ✨ Estados de mensaje: pending → approved/rejected → shown
- 🔄 Procesamiento automático de mensajes aprobados
- 📱 Interfaz de usuario con feedback en tiempo real

## 🔄 Flujo del Sistema

```
Usuario envía mensaje
    ↓
status: "pending" (en Firebase)
    ↓
Auto-moderador detecta mensaje pendiente
    ↓
Gemini AI analiza el mensaje
    ├─ Corrige ortografía
    ├─ Valida contenido apropiado
    └─ Devuelve: approved/rejected
    ↓
status: "approved" o "rejected"
    ↓
Valla escucha mensajes "approved"
    ↓
Muestra mensaje más antiguo primero
    ↓
Efecto de disolución (6 segundos)
    ↓
status: "shown"
    ↓
Pasa al siguiente mensaje en cola
```

## 📊 Estructura de Datos en Firebase

```javascript
messages: {
  messageId1: {
    text: "Hola Bogotá",
    status: "approved",  // pending | approved | rejected | shown
    createdAt: 1700000000,
    order: 1,
    shownAt: 1700000100  // Solo cuando status = "shown"
  },
  messageId2: {
    text: "Feliz cumpleaños",
    status: "pending",
    createdAt: 1700000100,
    order: 2
  }
}
```

## 🔑 Configuración de Gemini API

### 1. Obtener API Key

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Haz clic en "Create API Key"
3. Copia la API key generada

### 2. Configurar en el Proyecto

Agrega la API key a tu archivo `.env`:

```env
VITE_GEMINI_API_KEY=tu_api_key_de_gemini_aqui
```

### 3. Configurar en Netlify

En Netlify → Site settings → Environment variables:

```
VITE_GEMINI_API_KEY = tu_api_key_de_gemini_aqui
```

## 🤖 Moderación con Gemini

### Modelo Usado

- **Modelo**: `gemini-2.0-flash-exp`
- **Velocidad**: Ultra rápida
- **Costo**: Gratuito (con límites)

### Criterios de Moderación

El sistema rechaza mensajes con:
- Contenido ofensivo o vulgar
- Violencia o amenazas
- Contenido sexual explícito
- Discriminación o hate speech
- Spam o publicidad
- Información personal (teléfonos, emails, direcciones)

### Corrección Automática

- Corrige errores de ortografía
- Mantiene el tono original
- No agrega ni quita palabras innecesariamente
- Limita a 50 caracteres máximo

### Ejemplo de Respuesta de Gemini

```json
{
  "status": "approved",
  "correctedText": "Feliz cumpleaños María",
  "reason": null
}
```

O si es rechazado:

```json
{
  "status": "rejected",
  "correctedText": "",
  "reason": "Contenido inapropiado"
}
```

## 📱 Interfaz de Usuario

### Página de Envío (send.html)

Después de enviar un mensaje, el usuario ve:

```
📊 Estado de tu Mensaje

Estado: ⏳ En moderación
Posición en cola: En moderación
Tu mensaje: Hola mundo

↓ (después de moderación)

Estado: ✅ Aprobado
Posición en cola: 3 de 5
Tu mensaje: Hola mundo
```

### Estados Visuales

- **⏳ En moderación** (pending) - Amarillo
- **✅ Aprobado** (approved) - Verde
- **❌ Rechazado** (rejected) - Rojo
- **✨ Mostrado** (shown) - Azul

## 🔧 Archivos del Sistema

### Nuevos Archivos Creados

1. **`src/moderator.js`** - Integración con Gemini AI
2. **`src/autoModerator.js`** - Sistema automático de moderación
3. **`src/firebase.js`** - Actualizado con funciones de cola
4. **`src/sendMessage.js`** - Actualizado con seguimiento de posición
5. **`src/gommageOrchestrator.js`** - Actualizado para procesar cola

### Funciones Principales

#### firebase.js

```javascript
// Crear mensaje en cola
createMessage(text)

// Actualizar estado de mensaje
updateMessageStatus(messageId, status, correctedText)

// Escuchar mensajes aprobados
listenToApprovedMessages(callback)

// Escuchar mensajes pendientes
listenToPendingMessages(callback)

// Obtener posición en cola
getMessagePosition(messageId)

// Escuchar cambios de posición
listenToMessagePosition(messageId, callback)
```

#### moderator.js

```javascript
// Moderar mensaje con Gemini
moderateMessage(text)

// Verificar si está configurado
isModeratorConfigured()
```

#### autoModerator.js

```javascript
// Iniciar auto-moderador
autoModerator.start()
```

## 🚀 Uso

### En la Valla (index.html)

El sistema funciona automáticamente:

1. Auto-moderador se inicia al cargar la página
2. Escucha mensajes pendientes
3. Los modera con Gemini
4. Actualiza el estado en Firebase
5. La valla muestra mensajes aprobados en orden

### Enviar Mensaje (send.html)

```javascript
import { createMessage } from './firebase.js';

// Enviar mensaje
const result = await createMessage("Hola mundo");
console.log(result.messageId); // ID del mensaje
console.log(result.order); // Posición en cola
```

### Seguir Posición

```javascript
import { listenToMessagePosition } from './firebase.js';

listenToMessagePosition(messageId, (position) => {
  console.log(`Posición: ${position.position} de ${position.total}`);
  console.log(`Estado: ${position.status}`);
});
```

## 🔒 Reglas de Firebase

Actualiza las reglas en Firebase Console:

```json
{
  "rules": {
    "messages": {
      "$messageId": {
        ".read": true,
        ".write": "!data.exists() || data.child('status').val() == 'pending'",
        ".validate": "newData.hasChildren(['text', 'status', 'createdAt', 'order'])",
        "text": {
          ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 50"
        },
        "status": {
          ".validate": "newData.isString() && (newData.val() == 'pending' || newData.val() == 'approved' || newData.val() == 'rejected' || newData.val() == 'shown')"
        }
      }
    }
  }
}
```

## 📊 Monitoreo

### Ver Mensajes en Firebase Console

1. Ve a Firebase Console → Realtime Database
2. Navega a `messages/`
3. Verás todos los mensajes con sus estados

### Filtrar por Estado

```javascript
// En la consola del navegador
import { query, orderByChild, equalTo } from 'firebase/database';

// Ver solo aprobados
const approvedQuery = query(messagesRef, orderByChild('status'), equalTo('approved'));
```

## 🐛 Solución de Problemas

### Gemini API no funciona

**Síntomas**: Todos los mensajes se aprueban sin moderación

**Solución**:
1. Verifica que `VITE_GEMINI_API_KEY` esté configurada
2. Verifica que la API key sea válida
3. Revisa la consola del navegador para errores

### Mensajes no se muestran

**Síntomas**: Mensajes aprobados pero no aparecen en la valla

**Solución**:
1. Verifica que el auto-moderador esté iniciado
2. Revisa la consola: debe decir "🤖 Auto-moderador iniciado"
3. Verifica que haya mensajes con status "approved"

### Posición en cola no se actualiza

**Síntomas**: La posición se queda en "Calculando..."

**Solución**:
1. Verifica la conexión a Firebase
2. Revisa las reglas de Firebase (deben permitir lectura)
3. Verifica que el messageId sea correcto

## 💰 Costos

### Gemini API (Gratuito)

- **Límite gratuito**: 15 requests/minuto
- **Suficiente para**: ~900 mensajes/hora
- **Costo adicional**: $0.00 (dentro del límite gratuito)

### Firebase

- **Realtime Database**: Incluido en plan gratuito
- **Límite**: 100 conexiones simultáneas
- **Datos**: 1 GB descargado/día

## 🎯 Mejoras Futuras

- [ ] Panel de administración para revisar mensajes rechazados
- [ ] Estadísticas de moderación
- [ ] Filtros personalizados de palabras
- [ ] Moderación manual opcional
- [ ] Priorización de mensajes
- [ ] Límite de mensajes por usuario

## 📚 Referencias

- [Gemini API Docs](https://ai.google.dev/docs)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)
- [Google AI Studio](https://makersuite.google.com/)

---

**Sistema implementado y funcionando** ✅
