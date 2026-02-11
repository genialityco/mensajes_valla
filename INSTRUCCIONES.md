# 📢 Sistema de Valla Publicitaria Interactiva

Sistema de mensajería en tiempo real para valla publicitaria con efecto visual espectacular usando Firebase Realtime Database.

## 🚀 Características

- Mensajes en tiempo real usando Firebase
- Efecto de disolución visual con partículas
- Interfaz de envío de mensajes responsive
- Código QR automático en pantalla cuando no hay mensajes
- Actualización automática de mensajes

## 📋 Requisitos

- Node.js instalado
- Navegador compatible con WebGPU (Chrome/Edge reciente)

## 🔧 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## 📱 Uso

### Valla Publicitaria (Pantalla Principal)
- Acceder a: `http://localhost:5173/`
- Esta es la pantalla que se muestra en la valla
- Muestra un código QR automáticamente cuando no hay mensajes
- Escucha automáticamente los mensajes de Firebase
- Muestra el efecto de disolución cuando llega un nuevo mensaje

### Envío de Mensajes
- Acceder a: `http://localhost:5173/send.html`
- Escribir el mensaje (máximo 50 caracteres)
- Hacer clic en "Enviar a la Valla"
- El mensaje aparecerá automáticamente en la valla

## 🔗 Generar Código QR

La valla muestra automáticamente un código QR cuando no hay mensajes activos. Sin embargo, si deseas generar un QR para imprimir:

Para que los usuarios envíen mensajes mediante QR:

1. Obtener la URL pública de `send.html` (cuando despliegues en producción)
2. Generar un código QR con esa URL usando:
   - https://www.qr-code-generator.com/
   - https://www.qrcode-monkey.com/
   - O cualquier generador de QR

Ejemplo de URL para QR:
```
https://tu-dominio.com/send.html
```

## 🎨 Personalización

### Cambiar el texto inicial
En `src/gommageOrchestrator.js`, línea donde se inicializa el texto:
```javascript
'Esperando mensaje...'
```

### Ajustar duración del efecto
En `src/gommageOrchestrator.js`, método `triggerGommage()`:
```javascript
duration: 6  // Duración en segundos
```

### Modificar límite de caracteres
En `send.html`:
```html
maxlength="50"  // Cambiar el número
```

## 🔥 Configuración de Firebase

Las credenciales de Firebase ya están configuradas en `src/firebase.js`.

### Estructura de datos en Firebase:
```
billboard-messages/
  └── current/
      ├── text: "Mensaje actual"
      └── timestamp: 1234567890
```

## 🌐 Despliegue en Producción

1. Construir el proyecto:
```bash
npm run build
```

2. Los archivos estarán en la carpeta `dist/`

3. Subir a tu hosting preferido:
   - Vercel
   - Netlify
   - Firebase Hosting
   - GitHub Pages

4. Configurar las reglas de Firebase Realtime Database:
```json
{
  "rules": {
    "billboard-messages": {
      ".read": true,
      ".write": true
    }
  }
}
```

## 🔒 Seguridad (Recomendado para Producción)

Para evitar spam, considera:

1. Agregar rate limiting
2. Implementar autenticación
3. Validar mensajes en el servidor
4. Filtrar contenido inapropiado

## 📝 Notas

- El efecto se activa automáticamente cuando llega un nuevo mensaje
- Los mensajes se actualizan en tiempo real sin recargar la página
- El botón "Start" manual sigue funcionando para pruebas

## 🐛 Solución de Problemas

### El mensaje no aparece:
- Verificar la consola del navegador
- Comprobar conexión a Firebase
- Revisar las reglas de Firebase

### El efecto no se ve:
- Verificar compatibilidad con WebGPU
- Actualizar el navegador
- Revisar la consola de errores

## 📞 Soporte

Para problemas o preguntas, revisar:
- Consola del navegador (F12)
- Firebase Console para ver los datos
- Logs del servidor de desarrollo
