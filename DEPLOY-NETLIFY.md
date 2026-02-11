# 🚀 Guía de Despliegue en Netlify

Guía paso a paso para desplegar tu valla publicitaria en Netlify.

## 📋 Requisitos Previos

- Cuenta en [Netlify](https://www.netlify.com/) (gratis)
- Cuenta en [GitHub](https://github.com/) (opcional, pero recomendado)
- Proyecto funcionando localmente

## 🎯 Método 1: Despliegue desde GitHub (Recomendado)

### Paso 1: Subir el Proyecto a GitHub

1. Crea un nuevo repositorio en GitHub
2. Sube tu código:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

**Importante**: El archivo `.env` NO se subirá (está en `.gitignore`)

### Paso 2: Conectar con Netlify

1. Ve a [Netlify](https://app.netlify.com/)
2. Haz clic en **"Add new site"** → **"Import an existing project"**
3. Selecciona **GitHub**
4. Autoriza a Netlify a acceder a tus repositorios
5. Selecciona tu repositorio

### Paso 3: Configurar el Build

Netlify debería detectar automáticamente la configuración desde `netlify.toml`, pero verifica:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

### Paso 4: Configurar Variables de Entorno

**MUY IMPORTANTE**: Debes configurar las variables de entorno en Netlify.

1. En tu sitio de Netlify, ve a **Site settings**
2. Ve a **Environment variables** (en el menú lateral)
3. Haz clic en **Add a variable**
4. Agrega cada variable:

```
VITE_FIREBASE_API_KEY = tu_api_key
VITE_FIREBASE_AUTH_DOMAIN = tu_proyecto.firebaseapp.com
VITE_FIREBASE_DATABASE_URL = https://tu_proyecto-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID = tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET = tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = tu_sender_id
VITE_FIREBASE_APP_ID = tu_app_id
VITE_FIREBASE_MEASUREMENT_ID = tu_measurement_id
```

**Nota**: Copia los valores desde tu archivo `.env` local.

### Paso 5: Desplegar

1. Haz clic en **Deploy site**
2. Espera a que termine el build (2-3 minutos)
3. ¡Tu sitio estará en línea!

Netlify te dará una URL como: `https://tu-sitio-123abc.netlify.app`

## 🎯 Método 2: Despliegue Manual (Drag & Drop)

### Paso 1: Construir el Proyecto

```bash
npm run build
```

Esto creará la carpeta `dist/` con todos los archivos de producción.

### Paso 2: Configurar Variables de Entorno Localmente

Antes de construir, asegúrate de que tu archivo `.env` tenga las credenciales correctas.

**Alternativa**: Crea un archivo `.env.production`:

```env
VITE_FIREBASE_API_KEY=tu_api_key_produccion
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
# ... resto de variables
```

Luego construye con:
```bash
npm run build
```

### Paso 3: Subir a Netlify

1. Ve a [Netlify](https://app.netlify.com/)
2. Arrastra la carpeta `dist/` a la zona de "Drag and drop"
3. Espera a que se suba
4. ¡Listo!

**Desventaja**: No hay despliegue automático. Cada cambio requiere rebuild y resubida manual.

## 🔧 Configuración Post-Despliegue

### 1. Configurar Dominio Personalizado (Opcional)

1. En Netlify, ve a **Domain settings**
2. Haz clic en **Add custom domain**
3. Sigue las instrucciones para configurar tu dominio

### 2. Habilitar HTTPS

Netlify habilita HTTPS automáticamente. Solo espera unos minutos.

### 3. Generar Nuevo QR

Una vez desplegado:

1. Visita: `https://tu-sitio.netlify.app/qr-generator.html`
2. Descarga el QR con la URL de producción
3. Imprime y coloca el QR cerca de la valla

## ✅ Verificar el Despliegue

### Prueba 1: Página Principal
Visita: `https://tu-sitio.netlify.app/`
- Deberías ver el QR en pantalla

### Prueba 2: Envío de Mensajes
Visita: `https://tu-sitio.netlify.app/send.html`
- Deberías ver el formulario de envío

### Prueba 3: Test de Firebase
Visita: `https://tu-sitio.netlify.app/test-firebase.html`
- Deberías ver "✅ Conectado a Firebase"

### Prueba 4: Enviar un Mensaje
1. Envía un mensaje desde `send.html`
2. Verifica que aparezca en la página principal
3. Observa el efecto de disolución

## 🐛 Solución de Problemas

### Error: "Page Not Found" en send.html

**Causa**: Netlify no encuentra el archivo HTML.

**Solución**:
1. Verifica que `netlify.toml` esté en la raíz del proyecto
2. Verifica que `public/_redirects` exista
3. Reconstruye el proyecto: `npm run build`
4. Redespliega

### Error: Variables de entorno no definidas

**Síntomas**: 
- Consola muestra "undefined" en las variables
- No se conecta a Firebase

**Solución**:
1. Ve a Netlify → Site settings → Environment variables
2. Verifica que todas las variables estén configuradas
3. Asegúrate de que empiecen con `VITE_`
4. Haz un nuevo deploy (Deploys → Trigger deploy → Clear cache and deploy)

### Error: "Failed to load module"

**Causa**: Rutas incorrectas en producción.

**Solución**:
1. Verifica que `vite.config.js` tenga `base: './'`
2. Reconstruye: `npm run build`
3. Redespliega

### El QR no funciona

**Causa**: El QR tiene la URL de desarrollo (localhost).

**Solución**:
1. Visita `https://tu-sitio.netlify.app/qr-generator.html`
2. Genera un nuevo QR con la URL de producción
3. Descarga e imprime el nuevo QR

## 🔄 Despliegue Continuo

Si usaste el Método 1 (GitHub), cada vez que hagas push a tu repositorio:

```bash
git add .
git commit -m "Actualización"
git push
```

Netlify automáticamente:
1. Detecta el cambio
2. Construye el proyecto
3. Despliega la nueva versión

## 📊 Monitoreo

### Ver Logs de Build

1. Ve a **Deploys** en Netlify
2. Haz clic en el deploy más reciente
3. Ve a **Deploy log** para ver detalles

### Analytics (Opcional)

Netlify ofrece analytics básicos gratis:
- Visitas
- Páginas más vistas
- Fuentes de tráfico

## 🔒 Seguridad en Producción

### Reglas de Firebase

Actualiza las reglas de Firebase para producción:

```json
{
  "rules": {
    "billboard-messages": {
      "current": {
        ".read": true,
        ".write": "!data.exists() || (now - data.child('timestamp').val() > 5000)",
        ".validate": "newData.hasChildren(['text', 'timestamp'])",
        "text": {
          ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 50"
        },
        "timestamp": {
          ".validate": "newData.isNumber() && newData.val() == now"
        }
      }
    }
  }
}
```

Esto agrega:
- Rate limiting (5 segundos entre mensajes)
- Validación de timestamp

## 💰 Costos

### Netlify
- **Plan gratuito**: 
  - 100 GB de ancho de banda/mes
  - 300 minutos de build/mes
  - Suficiente para la mayoría de proyectos

### Firebase
- **Plan Spark (gratuito)**:
  - 1 GB de datos descargados/día
  - 10 GB de almacenamiento
  - 100 conexiones simultáneas

## 🎉 ¡Listo!

Tu valla publicitaria está en producción. Ahora puedes:

1. Compartir la URL con otros
2. Generar QR para imprimir
3. Monitorear el uso
4. Hacer actualizaciones fácilmente

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de Netlify
2. Verifica la consola del navegador (F12)
3. Consulta [Netlify Docs](https://docs.netlify.com/)
4. Revisa [Firebase Console](https://console.firebase.google.com/)

## 🔗 Enlaces Útiles

- [Netlify Dashboard](https://app.netlify.com/)
- [Netlify Docs](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Firebase Console](https://console.firebase.google.com/)
