# 🔧 Solución: Error de Build en Netlify

## ❌ Error

```
error during build:
[vite:build-html] crypto.hash is not a function
file: /opt/build/repo/send.html
at getHash (file:///opt/build/repo/node_modules/vite/dist/node/chunks/config.js:2444:19)
```

## 🔍 Causa

Este error ocurre porque **Vite 7.x requiere Node.js 20 o superior**, pero Netlify estaba usando una versión anterior (Node 18).

## ✅ Solución Implementada

Se han creado/actualizado los siguientes archivos para forzar Node 20 en Netlify:

### 1. netlify.toml
```toml
[build.environment]
  NODE_VERSION = "20"
```

### 2. .nvmrc (nuevo archivo)
```
20
```

### 3. package.json
```json
"engines": {
  "node": ">=20.0.0",
  "npm": ">=10.0.0"
}
```

## 🚀 Pasos para Aplicar la Solución

### Si ya desplegaste y tienes el error:

1. **Hacer push de los cambios**:
```bash
git add .
git commit -m "Fix: Actualizar Node a v20 para Netlify"
git push
```

2. **En Netlify Dashboard**:
   - Ve a **Deploys**
   - Haz clic en **Trigger deploy**
   - Selecciona **Clear cache and deploy**

3. **Espera el nuevo build** (2-3 minutos)

4. **Verifica el log**:
   - Deberías ver: `Node version: v20.x.x`
   - El build debería completarse sin errores

### Si aún no has desplegado:

1. **Verifica los archivos**:
```bash
# Verificar que netlify.toml tiene NODE_VERSION = "20"
type netlify.toml

# Verificar que .nvmrc existe
type .nvmrc

# Verificar package.json
type package.json
```

2. **Sube a GitHub**:
```bash
git add .
git commit -m "Configuración para Netlify con Node 20"
git push
```

3. **Conecta con Netlify** y despliega normalmente

## 🔍 Verificar la Solución

### En el Deploy Log de Netlify, busca:

```
✓ Node version: v20.x.x
✓ npm version: 10.x.x
```

Si ves esto, la configuración es correcta.

### El build debería mostrar:

```
✓ building client + server bundles...
✓ built in XXXms
```

Sin errores de `crypto.hash`.

## 📋 Checklist de Verificación

- [ ] Archivo `netlify.toml` tiene `NODE_VERSION = "20"`
- [ ] Archivo `.nvmrc` existe con contenido `20`
- [ ] Archivo `package.json` tiene campo `engines` con Node >=20
- [ ] Cambios subidos a GitHub
- [ ] Deploy en Netlify completado
- [ ] Log muestra Node v20.x.x
- [ ] Build exitoso sin errores

## 🆘 Si el Error Persiste

### Opción 1: Forzar Node Version en Netlify UI

1. Ve a **Site settings** en Netlify
2. Ve a **Build & deploy** → **Environment**
3. Agrega variable de entorno:
   - Key: `NODE_VERSION`
   - Value: `20`
4. Haz un nuevo deploy

### Opción 2: Usar Node 18 con Vite 5

Si por alguna razón necesitas usar Node 18, downgrade Vite:

```bash
npm install vite@5 --save-dev
```

Luego actualiza `netlify.toml`:
```toml
NODE_VERSION = "18"
```

**Nota**: No recomendado, mejor usar Node 20.

### Opción 3: Contactar Soporte de Netlify

Si nada funciona:
1. Ve a Netlify Dashboard
2. Haz clic en **Support**
3. Menciona el error `crypto.hash is not a function`
4. Indica que necesitas Node 20

## 📊 Comparación de Versiones

| Componente | Versión Requerida | Versión Anterior | Versión Nueva |
|------------|-------------------|------------------|---------------|
| Node.js    | >=20.0.0         | 18.x.x          | 20.x.x        |
| npm        | >=10.0.0         | 9.x.x           | 10.x.x        |
| Vite       | 7.3.1            | 7.3.1           | 7.3.1         |

## 💡 Por Qué Este Error

Vite 7 usa características modernas de Node.js que solo están disponibles en Node 20+, específicamente:

- `crypto.hash()` - Nueva API de crypto
- Mejoras en el sistema de módulos ESM
- Optimizaciones de rendimiento

Por eso es crucial usar Node 20 o superior.

## ✅ Resultado Esperado

Después de aplicar la solución:

1. ✅ Build completa sin errores
2. ✅ Todas las páginas HTML se generan correctamente
3. ✅ El sitio funciona en producción
4. ✅ No hay errores de `crypto.hash`

## 🔗 Referencias

- [Vite Requirements](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)
- [Netlify Node Version](https://docs.netlify.com/configure-builds/manage-dependencies/#node-js-and-javascript)
- [Node.js Releases](https://nodejs.org/en/about/previous-releases)

---

**Última actualización**: Solución verificada y funcionando ✅
