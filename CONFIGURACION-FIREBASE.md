# 🔥 Configuración de Firebase Realtime Database

## Paso 1: Configurar Reglas de Seguridad

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `webinar-chat-5e700`
3. En el menú lateral, ve a **Realtime Database**
4. Haz clic en la pestaña **Reglas**
5. Copia y pega las siguientes reglas:

```json
{
  "rules": {
    "billboard-messages": {
      "current": {
        ".read": true,
        ".write": true,
        ".validate": "newData.hasChildren(['text', 'timestamp'])",
        "text": {
          ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 50"
        },
        "timestamp": {
          ".validate": "newData.isNumber()"
        }
      }
    }
  }
}
```

6. Haz clic en **Publicar**

## Paso 2: Verificar la Estructura de Datos

Tu base de datos debe tener esta estructura:

```
webinar-chat-5e700-default-rtdb
└── billboard-messages
    └── current
        ├── text: "Tu mensaje aquí"
        └── timestamp: 1234567890
```

## Paso 3: Probar la Conexión

1. Inicia el servidor de desarrollo:
```bash
npm run dev
```

2. Abre en tu navegador:
```
http://localhost:5173/test-firebase.html
```

3. Deberías ver:
   - ✅ Estado de conexión: "Conectado a Firebase"
   - Botones para enviar mensajes de prueba
   - El mensaje actual se actualiza en tiempo real

## Paso 4: Enviar un Mensaje de Prueba

### Opción A: Desde la página de test
1. Abre `http://localhost:5173/test-firebase.html`
2. Haz clic en cualquier botón de mensaje de prueba
3. Verifica que aparezca en la sección "Mensaje Actual"

### Opción B: Desde la página de envío
1. Abre `http://localhost:5173/send.html`
2. Escribe un mensaje
3. Haz clic en "Enviar a la Valla"
4. Deberías ver "¡Mensaje enviado con éxito! 🎉"

### Opción C: Directamente desde Firebase Console
1. Ve a Firebase Console → Realtime Database
2. Navega a `billboard-messages/current`
3. Edita el campo `text` con un nuevo mensaje
4. El cambio se reflejará automáticamente en la valla

## Paso 5: Ver el Efecto en la Valla

1. Abre la valla publicitaria:
```
http://localhost:5173/
```

2. Envía un mensaje desde otra pestaña o dispositivo

3. Deberías ver:
   - El texto cambia automáticamente
   - Se activa el efecto de disolución
   - Aparecen partículas de polvo y pétalos

## 🔒 Reglas de Seguridad Explicadas

### Regla Actual (Desarrollo)
```json
".read": true,
".write": true
```
- Cualquiera puede leer y escribir
- ⚠️ Solo para desarrollo/pruebas

### Validaciones Incluidas
- El mensaje debe tener `text` y `timestamp`
- El texto debe ser string
- Longitud entre 1 y 50 caracteres
- El timestamp debe ser número

### Para Producción (Recomendado)

Agrega rate limiting y autenticación:

```json
{
  "rules": {
    "billboard-messages": {
      "current": {
        ".read": true,
        ".write": "auth != null && 
                  !data.exists() || 
                  (now - data.child('timestamp').val() > 5000)",
        ".validate": "newData.hasChildren(['text', 'timestamp'])",
        "text": {
          ".validate": "newData.isString() && 
                       newData.val().length > 0 && 
                       newData.val().length <= 50"
        },
        "timestamp": {
          ".validate": "newData.isNumber() && 
                       newData.val() == now"
        }
      }
    }
  }
}
```

Esto requiere:
- Autenticación de Firebase
- Mínimo 5 segundos entre mensajes
- Timestamp debe ser el momento actual

## 🐛 Solución de Problemas

### Error: "Permission denied"
- Verifica que las reglas estén publicadas
- Revisa que la ruta sea exactamente `billboard-messages/current`

### Los mensajes no se actualizan
- Abre la consola del navegador (F12)
- Busca errores de Firebase
- Verifica la URL de la base de datos en `src/firebase.js`

### Error de CORS
- Firebase Realtime Database no tiene problemas de CORS
- Si ves este error, verifica la configuración del proyecto

## 📊 Monitorear Uso

1. Ve a Firebase Console
2. Realtime Database → Uso
3. Verifica:
   - Conexiones simultáneas
   - Datos descargados
   - Operaciones de escritura

## 💡 Consejos

1. **Backup**: Exporta tus datos regularmente desde Firebase Console
2. **Límites**: Firebase tiene límites gratuitos, monitorea tu uso
3. **Seguridad**: Cambia las reglas antes de producción
4. **Testing**: Usa `test-firebase.html` para verificar cambios

## 🔗 Enlaces Útiles

- [Firebase Console](https://console.firebase.google.com/)
- [Documentación de Realtime Database](https://firebase.google.com/docs/database)
- [Reglas de Seguridad](https://firebase.google.com/docs/database/security)
- [Límites y Cuotas](https://firebase.google.com/docs/database/usage/limits)
