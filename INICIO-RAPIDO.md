# 🚀 Inicio Rápido - Valla Publicitaria Interactiva

Guía rápida para poner en marcha el proyecto en 5 minutos.

## 📦 Paso 1: Instalar Dependencias

```bash
npm install
```

## 🔐 Paso 2: Configurar Firebase

### Opción A: Usar las credenciales incluidas (para pruebas)

El proyecto ya incluye un archivo `.env` con credenciales de prueba. Puedes usarlo directamente.

### Opción B: Usar tus propias credenciales

1. Copia el archivo de ejemplo:
```bash
copy .env.example .env
```

2. Edita `.env` con tus credenciales de Firebase

3. Verifica la configuración:
```bash
npm run check-env
```

## ✅ Paso 3: Verificar Configuración

Ejecuta el script de verificación:

```bash
npm run check-env
```

Deberías ver:
```
✅ Archivo .env encontrado
✅ VITE_FIREBASE_API_KEY: Configurada
✅ VITE_FIREBASE_AUTH_DOMAIN: Configurada
...
🎉 ¡Todas las variables están configuradas correctamente!
```

## 🎬 Paso 4: Iniciar el Servidor

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:5173`

## 📱 Paso 5: Probar el Sistema

### Opción 1: Desde el mismo dispositivo

1. Abre en tu navegador: `http://localhost:5173/`
2. Verás el código QR en pantalla
3. Abre en otra pestaña: `http://localhost:5173/send.html`
4. Envía un mensaje
5. ¡Observa el efecto en la primera pestaña!

### Opción 2: Desde tu móvil

1. Abre en tu PC: `http://localhost:5173/`
2. Escanea el QR que aparece en pantalla con tu móvil
3. Envía un mensaje desde el móvil
4. ¡Observa el efecto en la PC!

**Nota**: Tu móvil debe estar en la misma red WiFi que tu PC.

## 🧪 Paso 6: Probar Firebase (Opcional)

Abre la página de pruebas:
```
http://localhost:5173/test-firebase.html
```

Aquí puedes:
- Verificar la conexión a Firebase
- Enviar mensajes de prueba
- Ver el historial de mensajes

## 🎯 Páginas Disponibles

| Página | URL | Descripción |
|--------|-----|-------------|
| Valla Publicitaria | `http://localhost:5173/` | Pantalla principal con efecto |
| Enviar Mensajes | `http://localhost:5173/send.html` | Formulario para enviar mensajes |
| Generador QR | `http://localhost:5173/qr-generator.html` | Genera QR para imprimir |
| Test Firebase | `http://localhost:5173/test-firebase.html` | Prueba la conexión |

## 🐛 Problemas Comunes

### El servidor no inicia

```bash
# Verifica que Node.js esté instalado
node --version

# Reinstala las dependencias
rm -rf node_modules
npm install
```

### No se conecta a Firebase

```bash
# Verifica las variables de entorno
npm run check-env

# Revisa la consola del navegador (F12)
```

### El QR no funciona desde el móvil

1. Verifica que estén en la misma red WiFi
2. Usa la IP local en lugar de localhost:
   - Abre `http://localhost:5173/qr-generator.html`
   - Escanea el QR generado

### El navegador no soporta WebGPU

- Usa Chrome o Edge versión 113+
- Habilita WebGPU en `chrome://flags`

## 📚 Documentación Completa

- [README.md](README.md) - Documentación completa del proyecto
- [VARIABLES-ENTORNO.md](VARIABLES-ENTORNO.md) - Guía de variables de entorno
- [CONFIGURACION-FIREBASE.md](CONFIGURACION-FIREBASE.md) - Configuración de Firebase
- [INSTRUCCIONES.md](INSTRUCCIONES.md) - Instrucciones detalladas

## 🎉 ¡Listo!

Tu valla publicitaria interactiva está funcionando. Ahora puedes:

1. Personalizar los mensajes
2. Ajustar la duración del efecto
3. Cambiar los colores y estilos
4. Desplegar en producción

¡Disfruta creando mensajes espectaculares! 🚀
