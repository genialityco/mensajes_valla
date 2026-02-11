# Public Assets

Esta carpeta contiene los archivos estáticos que se copian directamente al build.

## Estructura

```
public/
├── _redirects          # Reglas de redirección para Netlify
├── fonts/              # Fuentes MSDF
│   └── Cinzel/
├── models/             # Modelos 3D (.glb)
│   └── petal.glb
├── textures/           # Texturas
│   ├── dustParticle.png
│   └── perlin.webp
└── preview.png         # Imagen de preview
```

## Importante

- Los archivos en esta carpeta se copian tal cual al directorio `dist/` durante el build
- No necesitan ser importados en el código
- Se acceden con rutas relativas desde la raíz: `/fonts/...`, `/models/...`, etc.
- El archivo `_redirects` es crucial para que Netlify sirva correctamente las páginas HTML
