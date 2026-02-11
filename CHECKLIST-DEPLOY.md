# ✅ Checklist de Deploy a Netlify

Usa esta lista para asegurarte de que todo esté listo antes de desplegar.

## 📋 Antes del Deploy

### Verificaciones Locales

- [ ] El proyecto funciona correctamente en local (`npm run dev`)
- [ ] Puedes enviar mensajes y ver el efecto
- [ ] El QR aparece cuando no hay mensajes
- [ ] Todas las páginas HTML funcionan:
  - [ ] `index.html` - Valla publicitaria
  - [ ] `send.html` - Formulario de envío
  - [ ] `qr-generator.html` - Generador de QR
  - [ ] `test-firebase.html` - Test de conexión

### Archivos de Configuración

- [ ] `netlify.toml` existe en la raíz
- [ ] `public/_redirects` existe
- [ ] `vite.config.js` tiene configuración de múltiples HTML
- [ ] `.gitignore` incluye `.env`
- [ ] `.env` NO está en Git (verificar con `git status`)

### Variables de Entorno

- [ ] Archivo `.env` configurado localmente
- [ ] Todas las variables empiezan con `VITE_`
- [ ] Tienes las credenciales de Firebase listas para Netlify

### Build Local

- [ ] Ejecutar `npm run pre-deploy` sin errores
- [ ] Ejecutar `npm run build` exitosamente
- [ ] Carpeta `dist/` se genera correctamente
- [ ] Verificar que `dist/` contiene todos los HTML:
  ```bash
  dir dist\*.html
  ```

## 🚀 Durante el Deploy

### Si usas GitHub (Recomendado)

- [ ] Código subido a GitHub
- [ ] Repositorio conectado a Netlify
- [ ] Build settings configurados:
  - Build command: `npm run build`
  - Publish directory: `dist`
  - Node version: 20 (automático)

### Variables de Entorno en Netlify

- [ ] Ir a Site settings → Environment variables
- [ ] Agregar cada variable (8 en total):
  - [ ] `VITE_FIREBASE_API_KEY`
  - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
  - [ ] `VITE_FIREBASE_DATABASE_URL`
  - [ ] `VITE_FIREBASE_PROJECT_ID`
  - [ ] `VITE_FIREBASE_STORAGE_BUCKET`
  - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `VITE_FIREBASE_APP_ID`
  - [ ] `VITE_FIREBASE_MEASUREMENT_ID`

### Deploy

- [ ] Hacer clic en "Deploy site"
- [ ] Esperar a que termine el build (2-3 minutos)
- [ ] Verificar que no hay errores en el log

## ✅ Después del Deploy

### Verificaciones en Producción

- [ ] Visitar la URL de Netlify
- [ ] Verificar página principal (`/`)
  - [ ] Se muestra el QR
  - [ ] No hay errores en consola (F12)
- [ ] Verificar página de envío (`/send.html`)
  - [ ] El formulario se carga
  - [ ] Se puede escribir un mensaje
- [ ] Verificar test de Firebase (`/test-firebase.html`)
  - [ ] Muestra "✅ Conectado a Firebase"
  - [ ] No hay errores de variables undefined

### Prueba Funcional Completa

- [ ] Enviar un mensaje desde `/send.html`
- [ ] Verificar que aparece en la página principal
- [ ] Verificar que el efecto de disolución funciona
- [ ] Verificar que después del efecto vuelve a aparecer el QR

### QR de Producción

- [ ] Visitar `/qr-generator.html` en producción
- [ ] Descargar el QR con la URL de producción
- [ ] Probar escanear el QR desde un móvil
- [ ] Verificar que el móvil puede enviar mensajes

### Firebase

- [ ] Verificar en Firebase Console que los mensajes se guardan
- [ ] Actualizar reglas de Firebase para producción (opcional)
- [ ] Configurar rate limiting si es necesario

## 🔧 Configuración Adicional (Opcional)

### Dominio Personalizado

- [ ] Configurar dominio personalizado en Netlify
- [ ] Esperar a que se active HTTPS
- [ ] Generar nuevo QR con el dominio personalizado

### Optimizaciones

- [ ] Habilitar Netlify Analytics (opcional)
- [ ] Configurar notificaciones de deploy
- [ ] Configurar branch deploys si usas múltiples ramas

## 🐛 Si Algo Sale Mal

### Error: "crypto.hash is not a function"

**Causa**: Versión de Node.js incompatible (Vite 7 requiere Node 20+)

**Solución**:
1. [ ] Verificar que `netlify.toml` tenga `NODE_VERSION = "20"`
2. [ ] Verificar que existe `.nvmrc` con contenido `20`
3. [ ] Hacer "Clear cache and deploy" en Netlify
4. [ ] Si persiste, contactar soporte de Netlify

### Error: "Page Not Found" en send.html

1. [ ] Verificar que `netlify.toml` está en la raíz
2. [ ] Verificar que `public/_redirects` existe
3. [ ] Hacer "Clear cache and deploy" en Netlify

### Error: Variables de entorno undefined

1. [ ] Verificar variables en Netlify UI
2. [ ] Verificar que empiezan con `VITE_`
3. [ ] Hacer "Clear cache and deploy"

### Error: No se conecta a Firebase

1. [ ] Verificar credenciales en Netlify
2. [ ] Verificar reglas de Firebase
3. [ ] Revisar consola del navegador (F12)

### Error de Build

1. [ ] Revisar el deploy log en Netlify
2. [ ] Verificar que `package.json` tiene todas las dependencias
3. [ ] Probar build local: `npm run build`

## 📝 Notas Finales

- Guarda la URL de tu sitio: `https://tu-sitio.netlify.app`
- Comparte el QR con los usuarios
- Monitorea el uso en Firebase Console
- Configura alertas si es necesario

## 🎉 ¡Deploy Exitoso!

Si completaste todos los checks, tu valla publicitaria está en producción y lista para usar.

**Próximos pasos:**
1. Compartir la URL
2. Imprimir el QR
3. Monitorear mensajes
4. Disfrutar del efecto espectacular

---

**Fecha del deploy**: _______________
**URL del sitio**: _______________
**Notas**: _______________
