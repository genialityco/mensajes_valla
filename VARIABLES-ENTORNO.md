# 🔐 Configuración de Variables de Entorno

Este proyecto usa variables de entorno para proteger las credenciales de Firebase.

## 📋 Configuración Inicial

### 1. Crear archivo .env

Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
# En Windows (CMD)
copy .env.example .env

# En Windows (PowerShell)
Copy-Item .env.example .env

# En Linux/Mac
cp .env.example .env
```

### 2. Configurar tus credenciales

Abre el archivo `.env` y reemplaza los valores con tus credenciales de Firebase:

```env
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://tu_proyecto-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

## 🔍 Obtener Credenciales de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Configuración del proyecto** (ícono de engranaje)
4. En la sección **Tus apps**, selecciona tu app web
5. Copia las credenciales del objeto `firebaseConfig`

## ⚠️ Importante

### Seguridad

- ❌ **NUNCA** subas el archivo `.env` a Git
- ✅ El archivo `.env` está en `.gitignore` por defecto
- ✅ Comparte solo el archivo `.env.example` (sin credenciales reales)
- ✅ Cada desarrollador debe tener su propio archivo `.env`

### Vite y Variables de Entorno

Este proyecto usa **Vite**, por lo que:

- Las variables deben empezar con `VITE_` para ser accesibles en el cliente
- Se acceden con `import.meta.env.VITE_NOMBRE_VARIABLE`
- Los cambios en `.env` requieren reiniciar el servidor de desarrollo

## 🔄 Reiniciar el Servidor

Después de modificar el archivo `.env`, debes reiniciar el servidor:

```bash
# Detener el servidor (Ctrl+C)
# Luego iniciar de nuevo
npm run dev
```

## 🚀 Despliegue en Producción

### Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega cada variable:
   - Name: `VITE_FIREBASE_API_KEY`
   - Value: `tu_valor`

### Netlify

1. Ve a tu sitio en Netlify
2. Site settings → Environment variables
3. Agrega cada variable con su valor

### Firebase Hosting

Crea un archivo `.env.production`:

```env
VITE_FIREBASE_API_KEY=tu_api_key_produccion
# ... resto de variables
```

## 🧪 Verificar Configuración

Para verificar que las variables están cargadas correctamente:

1. Abre la consola del navegador (F12)
2. Escribe: `import.meta.env`
3. Deberías ver tus variables `VITE_*`

O usa la página de test:
```
http://localhost:5173/test-firebase.html
```

Si ves "✅ Conectado a Firebase", todo está correcto.

## 🐛 Solución de Problemas

### Error: "Las variables de entorno no están configuradas"

1. Verifica que el archivo `.env` existe en la raíz del proyecto
2. Verifica que las variables empiezan con `VITE_`
3. Reinicia el servidor de desarrollo

### Error: "undefined" en las variables

1. Asegúrate de que el archivo se llama exactamente `.env` (no `.env.txt`)
2. Verifica que no hay espacios alrededor del `=`
3. No uses comillas en los valores

### Las variables no se actualizan

1. Detén el servidor (Ctrl+C)
2. Inicia de nuevo con `npm run dev`
3. Limpia la caché del navegador (Ctrl+Shift+R)

## 📝 Ejemplo Completo

Archivo `.env` correctamente configurado:

```env
VITE_FIREBASE_API_KEY=AIzaSyABC123def456GHI789jkl
VITE_FIREBASE_AUTH_DOMAIN=mi-proyecto.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://mi-proyecto-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=mi-proyecto
VITE_FIREBASE_STORAGE_BUCKET=mi-proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123DEF4
```

## 🔗 Referencias

- [Vite - Variables de Entorno](https://vitejs.dev/guide/env-and-mode.html)
- [Firebase - Configuración Web](https://firebase.google.com/docs/web/setup)
- [Mejores Prácticas de Seguridad](https://firebase.google.com/docs/projects/api-keys)
