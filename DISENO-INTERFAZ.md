# 🎨 Diseño de Interfaz - Valla Publicitaria

Documentación del diseño visual de la valla publicitaria interactiva.

## 📐 Distribución de Elementos

### Vista Principal

```
┌─────────────────────────────────────────────────┐
│                                    ┌──────────┐ │
│                                    │   QR     │ │
│                                    │  Code    │ │
│                                    └──────────┘ │
│                                                 │
│                                                 │
│                  MENSAJE                        │
│               (con efecto)                      │
│                                                 │
│                                                 │
│                                                 │
│         ┌─────────────────────────┐            │
│         │   Último mensaje        │            │
│         └─────────────────────────┘            │
└─────────────────────────────────────────────────┘
```

## 🎯 Elementos de la Interfaz

### 1. Código QR (Arriba Derecha)

**Posición**: `top: 20px, right: 20px`

**Características**:
- Tamaño compacto: 180x180px
- Fondo semi-transparente negro
- Borde sutil dorado
- Animación de entrada desde la derecha
- Siempre visible cuando no hay mensaje activo

**Contenido**:
- Título: "📱 Envía tu mensaje"
- Subtítulo: "Escanea el código QR"
- Código QR
- URL en texto pequeño

**Cuándo se muestra**:
- ✅ Al iniciar (sin mensajes en cola)
- ✅ Después de mostrar un mensaje (2 segundos después)
- ❌ Durante el efecto de disolución

### 2. Mensaje Principal (Centro)

**Posición**: Centro de la pantalla

**Características**:
- Texto 3D con efecto de construcción (partículas)
- Partículas de polvo y pétalos
- Duración del efecto: 6 segundos
- Fuente: Cinzel (elegante)
- Color: Dorado (#ECCFA3)
- **Permanece visible después del efecto**

**Estados**:
1. **Construcción**: Texto se forma desde partículas (6s)
2. **Visible**: Texto completamente formado
3. **Permanencia**: Permanece hasta que llegue un nuevo mensaje

**Comportamiento**:
- El mensaje se "construye" con partículas (efecto inverso)
- Una vez construido, permanece visible
- Cuando llega un nuevo mensaje, el anterior se reemplaza
- El QR permanece visible junto al mensaje

### 3. Último Mensaje (Abajo Centro)

**Posición**: `bottom: 40px, center`

**Características**:
- Fondo semi-transparente negro
- Borde sutil dorado
- Animación de entrada desde abajo
- Texto más pequeño que el mensaje principal

**Contenido**:
- Label: "ÚLTIMO MENSAJE"
- Texto del último mensaje mostrado

**Cuándo se muestra**:
- ✅ Solo cuando NO hay ningún mensaje en pantalla
- ❌ Cuando hay un mensaje visible (el mensaje actual permanece)
- ❌ Durante el efecto de construcción

## 🎨 Paleta de Colores

```css
--color-text: #d5cbb2      /* Dorado claro */
--color-bg: #000           /* Negro */
--color-link: #a9161b      /* Rojo oscuro */
--color-link-hover: #d5cbb2 /* Dorado claro */
```

### Colores Adicionales

- **QR Background**: `rgba(0, 0, 0, 0.85)` - Negro semi-transparente
- **QR Border**: `rgba(213, 203, 178, 0.3)` - Dorado muy sutil
- **Last Message BG**: `rgba(0, 0, 0, 0.75)` - Negro semi-transparente
- **Last Message Border**: `rgba(213, 203, 178, 0.2)` - Dorado muy sutil

## 📱 Responsive Design

### Desktop (>768px)

- QR: `top: 20px, right: 20px`
- QR Size: 180x180px
- Last Message: `bottom: 40px`
- Font Size: 1.5rem

### Mobile (<768px)

- QR: `top: 10px, right: 10px`
- QR Size: 150x150px (escalado)
- Last Message: `bottom: 20px`
- Font Size: 1.2rem
- Max Width: 90%

## ✨ Animaciones

### QR Code

```css
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

**Duración**: 0.5s
**Easing**: ease-out

### Último Mensaje

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
```

**Duración**: 0.5s
**Easing**: ease-out

### Mensaje Principal

- **Efecto**: Construcción con partículas (Gommage inverso)
- **Duración**: 6 segundos
- **Partículas**: Polvo y pétalos
- **Easing**: Linear
- **Dirección**: De invisible (1) a visible (0)
- **Permanencia**: Infinita hasta nuevo mensaje

## 🔄 Flujo Visual

### Secuencia Completa

1. **Estado Inicial / Recarga** (0s)
   - Sistema busca último mensaje "shown" en Firebase
   - Si existe, lo muestra sin efecto
   - QR visible arriba derecha
   - Mensaje visible en centro (si existe)

2. **Mensaje Entrante** (0s)
   - QR se oculta temporalmente
   - Mensaje anterior se elimina (si existe)
   - Nuevo mensaje comienza a construirse en centro

3. **Efecto Activo - Construcción** (0-6s)
   - Mensaje se construye desde partículas
   - Partículas de polvo y pétalos
   - Progreso: invisible → visible

4. **Mensaje Completo** (6s+)
   - Efecto termina
   - Mensaje completamente visible
   - QR reaparece arriba derecha
   - **Mensaje permanece visible indefinidamente**

5. **Espera** (6s+)
   - QR visible arriba derecha
   - Mensaje visible en centro
   - Esperando siguiente mensaje

6. **Nuevo Mensaje** (cuando llega)
   - Mensaje anterior se elimina
   - QR se oculta temporalmente
   - Nuevo mensaje comienza a construirse
   - Ciclo se repite desde paso 2

7. **Sin Mensajes Nuevos**
   - Último mensaje permanece visible
   - QR permanece visible
   - Sistema en espera

## 🎯 Jerarquía Visual

### Prioridad 1: Mensaje Principal
- Tamaño más grande
- Centro de la pantalla
- Efecto visual llamativo
- Z-index: 50

### Prioridad 2: Código QR
- Tamaño mediano
- Posición destacada pero no invasiva
- Siempre accesible
- Z-index: 100

### Prioridad 3: Último Mensaje
- Tamaño pequeño
- Posición discreta
- Información contextual
- Z-index: 99

## 💡 Mejores Prácticas

### Legibilidad

- Contraste alto: texto claro sobre fondo oscuro
- Fuente elegante pero legible
- Tamaño de texto apropiado para distancia
- Sin elementos que distraigan durante el efecto

### Accesibilidad

- QR siempre visible cuando es necesario
- Último mensaje proporciona contexto
- Animaciones suaves (no bruscas)
- Colores con buen contraste

### Performance

- Animaciones CSS (GPU accelerated)
- Elementos ocultos con `display: none`
- Backdrop filter solo donde es necesario
- Optimización de z-index

## 🔧 Personalización

### Cambiar Posición del QR

En `css/base.css`:

```css
#qr-overlay {
  top: 20px;    /* Cambiar aquí */
  right: 20px;  /* Cambiar aquí */
}
```

### Cambiar Tamaño del QR

En `src/qrOverlay.js`:

```javascript
new QRCode(this.qrCodeDisplay, {
  width: 180,   // Cambiar aquí
  height: 180,  // Cambiar aquí
});
```

### Cambiar Posición del Último Mensaje

En `css/base.css`:

```css
#last-message-display {
  bottom: 40px;  /* Cambiar aquí */
}
```

### Cambiar Duración del Efecto de Construcción

En `src/gommageOrchestrator.js`:

```javascript
this.#gommageTween = gsap.to(this.#uProgress, {
  value: 0,      // De 1 (invisible) a 0 (visible)
  duration: 6,   // Cambiar aquí (segundos)
});
```

## 📊 Métricas de Diseño

- **Tiempo de construcción**: 6 segundos por mensaje
- **Tiempo de permanencia**: Infinito (hasta nuevo mensaje)
- **Visibilidad del QR**: 100% excepto durante construcción
- **Área de mensaje**: ~60% de la pantalla
- **Área de QR**: ~10% de la pantalla
- **Área de último mensaje**: ~15% de la pantalla (solo sin mensaje actual)

---

**Diseño optimizado para máxima visibilidad y engagement** ✨
