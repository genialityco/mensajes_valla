# ⚡ Comandos Rápidos

Referencia rápida de comandos útiles para el proyecto.

## 🚀 Desarrollo

```bash
# Instalar dependencias
npm install

# Verificar variables de entorno
npm run check-env

# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
# http://localhost:5173/
```

## 🔨 Build y Deploy

```bash
# Verificar antes de desplegar
npm run pre-deploy

# Construir para producción
npm run build

# Verificar y construir (todo en uno)
npm run deploy

# Preview del build local
npm run preview
```

## 📱 URLs Locales

```bash
# Valla publicitaria
http://localhost:5173/

# Enviar mensajes
http://localhost:5173/send.html

# Generador de QR
http://localhost:5173/qr-generator.html

# Test de Firebase
http://localhost:5173/test-firebase.html
```

## 🔧 Git

```bash
# Inicializar repositorio
git init

# Agregar archivos
git add .

# Commit
git commit -m "Mensaje del commit"

# Subir a GitHub
git push origin main

# Ver estado
git status

# Ver archivos ignorados
git status --ignored
```

## 🌐 Netlify CLI (Opcional)

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy manual
netlify deploy

# Deploy a producción
netlify deploy --prod

# Ver sitio en el navegador
netlify open
```

## 🔥 Firebase

```bash
# Ver datos en Firebase Console
# https://console.firebase.google.com/

# Exportar datos (desde Firebase Console)
# Database → Export JSON

# Importar datos (desde Firebase Console)
# Database → Import JSON
```

## 🐛 Debugging

```bash
# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules
npm install

# Limpiar build
rm -rf dist

# Ver logs de Netlify
# Netlify Dashboard → Deploys → Deploy log

# Ver errores en el navegador
# F12 → Console
```

## 📦 Verificaciones

```bash
# Verificar versión de Node
node --version

# Verificar versión de npm
npm --version

# Listar archivos en dist
dir dist

# Ver tamaño del build
dir dist /s

# Verificar que .env no esté en Git
git status --ignored | findstr .env
```

## 🔐 Variables de Entorno

```bash
# Copiar archivo de ejemplo
copy .env.example .env

# Editar variables (Windows)
notepad .env

# Verificar variables
npm run check-env
```

## 📊 Monitoreo

```bash
# Ver uso de Firebase
# Firebase Console → Usage and billing

# Ver analytics de Netlify
# Netlify Dashboard → Analytics

# Ver logs en tiempo real
# Netlify Dashboard → Functions → Logs
```

## 🧪 Testing

```bash
# Test de conexión Firebase
# Abrir: http://localhost:5173/test-firebase.html

# Test de envío de mensajes
# 1. Abrir: http://localhost:5173/send.html
# 2. Enviar mensaje
# 3. Verificar en: http://localhost:5173/

# Test de QR
# 1. Abrir: http://localhost:5173/qr-generator.html
# 2. Escanear con móvil
# 3. Enviar mensaje desde móvil
```

## 📝 Documentación

```bash
# Ver documentación completa
# README.md

# Guía de inicio rápido
# INICIO-RAPIDO.md

# Guía de deploy
# DEPLOY-NETLIFY.md

# Checklist de deploy
# CHECKLIST-DEPLOY.md

# Variables de entorno
# VARIABLES-ENTORNO.md

# Resumen de Netlify
# RESUMEN-NETLIFY.md
```

## 🎨 Personalización

```bash
# Editar duración del efecto
# src/gommageOrchestrator.js → duration: 6

# Editar límite de caracteres
# send.html → maxlength="50"

# Editar colores
# css/base.css

# Editar texto del QR
# src/qrOverlay.js
```

## 🔄 Actualizar Proyecto

```bash
# Actualizar dependencias
npm update

# Ver dependencias desactualizadas
npm outdated

# Actualizar una dependencia específica
npm install firebase@latest

# Actualizar todas a la última versión
npm install -g npm-check-updates
ncu -u
npm install
```

## 💡 Tips

```bash
# Abrir proyecto en VS Code
code .

# Abrir Firebase Console
start https://console.firebase.google.com/

# Abrir Netlify Dashboard
start https://app.netlify.com/

# Ver este archivo
type COMANDOS-RAPIDOS.md
```

---

**Guarda este archivo como referencia rápida** 📌
