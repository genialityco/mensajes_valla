//starParticles.js

import * as THREE from 'three/webgpu';
import {
  attribute,
  uniform,
  positionLocal,
  vec4,
  time,
  vec2,
  clamp,
  sin,
  smoothstep,
  float,
  mul,
  add,
  cos,
} from 'three/tsl';

export default class StarParticles {
  constructor() {}

  #spawnPos;
  #starProperties; // size, twinkleSpeed, brightness, phase
  #starMesh;
  #MAX_STARS = 200;

  async initialize() {
    // Crear geometría de estrella (simple quad)
    const starGeometry = new THREE.PlaneGeometry(0.02, 0.02);
    
    this.#spawnPos = new Float32Array(this.#MAX_STARS * 3);
    // Propiedades: x=size, y=twinkleSpeed, z=brightness, w=phase
    this.#starProperties = new Float32Array(this.#MAX_STARS * 4);

    // Generar estrellas en posiciones aleatorias
    this.generateStars();

    starGeometry.setAttribute('aSpawnPos', new THREE.InstancedBufferAttribute(this.#spawnPos, 3));
    starGeometry.setAttribute('aStarProperties', new THREE.InstancedBufferAttribute(this.#starProperties, 4));
    
    const material = this.createStarMaterial();
    this.#starMesh = new THREE.InstancedMesh(starGeometry, material, this.#MAX_STARS);
    
    return this.#starMesh;
  }

  generateStars() {
    for (let i = 0; i < this.#MAX_STARS; i++) {
      // Posición aleatoria en el espacio visible
      // Distribuir en un área más amplia para cubrir toda la pantalla
      this.#spawnPos[i * 3 + 0] = (Math.random() * 2 - 1) * 2.5; // x: -2.5 a 2.5
      this.#spawnPos[i * 3 + 1] = (Math.random() * 2 - 1) * 1.5; // y: -1.5 a 1.5
      this.#spawnPos[i * 3 + 2] = -0.5; // z: detrás del texto

      // Propiedades de la estrella
      this.#starProperties[i * 4 + 0] = Math.random() * 0.8 + 0.3; // size: 0.3 a 1.1
      this.#starProperties[i * 4 + 1] = Math.random() * 2.0 + 0.5; // twinkleSpeed: 0.5 a 2.5
      this.#starProperties[i * 4 + 2] = Math.random() * 0.6 + 0.4; // brightness: 0.4 a 1.0
      this.#starProperties[i * 4 + 3] = Math.random() * Math.PI * 2; // phase: 0 a 2π
    }
  }

  createStarMaterial() {
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending, // Blending aditivo para efecto de brillo
    });

    const aSpawnPos = attribute('aSpawnPos', 'vec3');
    const aStarProperties = attribute('aStarProperties', 'vec4');
    const aSize = aStarProperties.x;
    const aTwinkleSpeed = aStarProperties.y;
    const aBrightness = aStarProperties.z;
    const aPhase = aStarProperties.w;

    const uStarColor = uniform(new THREE.Color('#FFFFFF'));

    // Efecto de parpadeo usando seno con diferentes velocidades y fases
    const twinkle1 = sin(time.mul(aTwinkleSpeed).add(aPhase));
    const twinkle2 = sin(time.mul(aTwinkleSpeed.mul(1.7)).add(aPhase.mul(2.3)));
    
    // Combinar múltiples ondas para un parpadeo más natural
    const twinkleEffect = twinkle1.mul(0.5).add(twinkle2.mul(0.3)).add(0.5);
    
    // Aplicar brillo base y efecto de parpadeo
    const finalBrightness = aBrightness.mul(twinkleEffect);
    
    // Efecto de pulso lento adicional para algunas estrellas
    const slowPulse = sin(time.mul(0.3).add(aPhase)).mul(0.15).add(0.85);
    const combinedBrightness = finalBrightness.mul(slowPulse);

    // Gradiente radial para hacer las estrellas más brillantes en el centro
    const center = vec2(0.5, 0.5);
    const uv = attribute('uv');
    const dist = uv.sub(center).length();
    const radialGradient = smoothstep(float(0.5), float(0.0), dist);

    // Color final con brillo
    const starAlpha = radialGradient.mul(combinedBrightness);
    
    material.colorNode = vec4(uStarColor.mul(combinedBrightness.mul(1.5)), starAlpha);
    material.positionNode = aSpawnPos.add(positionLocal.mul(aSize));
    material.opacityNode = starAlpha;

    return material;
  }

  // Método para regenerar estrellas si es necesario
  regenerateStars() {
    this.generateStars();
    this.#starMesh.geometry.attributes.aSpawnPos.needsUpdate = true;
    this.#starMesh.geometry.attributes.aStarProperties.needsUpdate = true;
  }
}
