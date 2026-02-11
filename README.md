# 📢 Valla Publicitaria Interactiva con Firebase

Sistema de mensajería en tiempo real para valla publicitaria con efectos visuales espectaculares usando WebGPU, Three.js y Firebase Realtime Database.

![Gommage Effect](https://tympanus.net/codrops/wp-content/uploads/2026/01/gommage-1.webp)

> 🚀 **[Ver Guía de Inicio Rápido](INICIO-RAPIDO.md)** para empezar en 5 minutos

## ✨ Características

- 🔥 Mensajes en tiempo real con Firebase
- 🎨 Efecto de disolución visual con partículas (Gommage Effect)
- 📱 Interfaz móvil para envío de mensajes
- 🔗 Código QR automático cuando no hay mensajes
- ⚡ Actualización automática sin recargar
- 🎭 Efectos de partículas de polvo y pétalos

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Configuración de Firebase

1. Copia el archivo de ejemplo de variables de entorno:
```bash
copy .env.example .env
```

2. Edita el archivo `.env` con tus credenciales de Firebase (ver [VARIABLES-ENTORNO.md](VARIABLES-ENTORNO.md))

### Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:5173`

## 📱 Páginas del Sistema

> 🌐 **Para desplegar en Netlify**: Ver [RESUMEN-NETLIFY.md](RESUMEN-NETLIFY.md) y [DEPLOY-NETLIFY.md](DEPLOY-NETLIFY.md)

### 1. Valla Publicitaria (index.html)
- **URL**: `http://localhost:5173/`
- Pantalla principal que muestra los mensajes
- Muestra código QR automáticamente cuando no hay mensajes
- Escucha automáticamente Firebase
- Activa el efecto visual cuando llega un mensaje nuevo

### 2. Envío de Mensajes (send.html)
- **URL**: `http://localhost:5173/send.html`
- Interfaz para que los usuarios envíen mensajes
- Límite de 50 caracteres
- Diseño responsive para móviles

### 3. Generador de QR (qr-generator.html)
- **URL**: `http://localhost:5173/qr-generator.html`
- Genera código QR para acceso móvil
- Descarga e impresión del QR
- Instrucciones para producción

### 4. Test de Firebase (test-firebase.html)
- **URL**: `http://localhost:5173/test-firebase.html`
- Herramienta de prueba de conexión
- Envío de mensajes de prueba
- Visualización del historial

## 🔧 Configuración

### Firebase

Las credenciales de Firebase se configuran mediante variables de entorno en el archivo `.env`.

**Importante**: Nunca subas el archivo `.env` a Git. Usa `.env.example` como plantilla.

Para más detalles, consulta [VARIABLES-ENTORNO.md](VARIABLES-ENTORNO.md).

La estructura de datos en Firebase es:

```
billboard-messages/
  └── current/
      ├── text: "Mensaje actual"
      └── timestamp: 1234567890
```

### Reglas de Firebase
Aplicar las reglas desde `firebase-rules.json` en Firebase Console:
1. Ir a Firebase Console
2. Realtime Database → Reglas
3. Copiar el contenido de `firebase-rules.json`

## 🎯 Uso

### Para Desarrollo Local

1. Iniciar el servidor:
```bash
npm run dev
```

2. Abrir la valla en el navegador principal:
```
http://localhost:5173/
```
(Verás el código QR en pantalla cuando no haya mensajes)

3. Puedes usar el QR de dos formas:
   - Escanear el QR que aparece en la valla misma
   - O abrir el generador de QR para imprimirlo:
```
http://localhost:5173/qr-generator.html
```

4. Escanear el QR con tu móvil (debe estar en la misma red WiFi)

5. Enviar mensajes desde el móvil

### Para Producción

1. Verificar y construir el proyecto:
```bash
npm run deploy
```

Esto ejecutará verificaciones automáticas y construirá el proyecto.

2. Desplegar en tu hosting preferido:
   - **Netlify** (Recomendado): Ver [DEPLOY-NETLIFY.md](DEPLOY-NETLIFY.md) - Guía completa paso a paso
   - Vercel: `vercel deploy`
   - Firebase Hosting: `firebase deploy`

3. **Importante**: Configurar variables de entorno en tu plataforma de hosting
   - Ver `.env.netlify.example` para Netlify
   - Todas las variables deben empezar con `VITE_`

4. Generar QR con la URL pública de `send.html` (o usar el QR que aparece automáticamente en la valla)

5. Imprimir y colocar el QR cerca de la valla (opcional, ya que la valla muestra el QR cuando no hay mensajes)

## 🎨 Personalización

### Cambiar texto inicial
En `src/gommageOrchestrator.js`:
```javascript
'Esperando mensaje...'  // Cambiar este texto
```

### Ajustar duración del efecto
En `src/gommageOrchestrator.js`:
```javascript
duration: 6  // Segundos del efecto
```

### Modificar límite de caracteres
En `send.html`:
```html
maxlength="50"  // Cambiar el límite
```

## 🛠️ Tecnologías

- **Three.js (WebGPU)**: Renderizado 3D
- **Firebase Realtime Database**: Base de datos en tiempo real
- **GSAP**: Animaciones
- **Vite**: Build tool
- **MSDF Text**: Renderizado de texto de alta calidad

## 📋 Estructura del Proyecto

```
├── src/
│   ├── experience.js          # Configuración Three.js
│   ├── gommageOrchestrator.js # Orquestador principal + Firebase
│   ├── msdfText.js            # Renderizado de texto
│   ├── dustParticles.js       # Partículas de polvo
│   ├── petalParticles.js      # Partículas de pétalos
│   ├── firebase.js            # Configuración Firebase
│   └── sendMessage.js         # Lógica de envío
├── index.html                 # Valla publicitaria
├── send.html                  # Página de envío
├── qr-generator.html          # Generador de QR
├── test-firebase.html         # Test de conexión
└── firebase-rules.json        # Reglas de seguridad
```

## 🔒 Seguridad

Las reglas actuales permiten lectura y escritura pública. Para producción, considera:

1. Implementar autenticación
2. Rate limiting
3. Validación de contenido
4. Filtro de palabras inapropiadas

## 🐛 Solución de Problemas

### El navegador no soporta WebGPU
- Usar Chrome/Edge versión 113+
- Habilitar WebGPU en `chrome://flags`

### Los mensajes no se actualizan
- Verificar consola del navegador (F12)
- Comprobar conexión a Firebase
- Revisar reglas de Firebase

### El QR no funciona desde el móvil
- Verificar que estén en la misma red WiFi
- Usar la IP local en lugar de localhost
- Verificar firewall

## 📄 Créditos

- Efecto Gommage basado en [Clair Obscur: Expedition 33](https://tympanus.net/codrops/?p=107900)
- [three-msdf-text-utils](https://github.com/leochocolat/three-msdf-text-utils) by Léo Mouraire
- [msdf-bmfont-xml](https://github.com/soimy/msdf-bmfont-xml) by Shen Yiming
- Perlin Texture from [Screaming Brain Studios](https://screamingbrainstudios.com/downloads/)

## 📄 Licencia

[MIT](LICENSE)
