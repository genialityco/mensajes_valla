//gommageOrchestrator.js

import * as THREE from 'three/webgpu';
import MSDFText from './msdfText.js';
import { uniform } from 'three/tsl';
import DustParticles from './dustParticles.js';
import PetalParticles from './petalParticles.js';
import Debug, { DEBUG_FOLDERS } from './debug.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { listenToCurrentMessage } from './firebase.js';
import { messageState } from './messageState.js';

export default class GommageOrchestrator {
  #uProgress = uniform(0.0);

  #MSDFTextEntity = null;
  #DustParticlesEntity = null;
  #PetalParticlesEntity = null;

  #dustInterval = 0.125;
  #petalInterval = 0.05;
  #gommageTween = null;
  #spawnDustTween = null;
  #spawnPetalTween = null;

  #scene = null;
  #currentTextMesh = null;
  #perlinTexture = null;
  #fontAtlasTexture = null;
  #dustParticleTexture = null;

  constructor() {}

  async initialize(scene) {
    this.#scene = scene;
    const { perlinTexture, dustParticleTexture, fontAtlasTexture } = await this.loadTextures();
    this.#perlinTexture = perlinTexture;
    this.#fontAtlasTexture = fontAtlasTexture;
    this.#dustParticleTexture = dustParticleTexture;
    
    const petalGeometry = await this.loadPetalGeometry();

    const debugFolder = Debug.getInstance().getFolder(DEBUG_FOLDERS.MSDF_TEXT);
    
    // No crear texto inicial, esperar mensaje de Firebase
    this.#MSDFTextEntity = new MSDFText();
    this.#currentTextMesh = null;

    this.#DustParticlesEntity = new DustParticles();
    const dustParticles = await this.#DustParticlesEntity.initialize(perlinTexture, dustParticleTexture);
    scene.add(dustParticles);

    this.#PetalParticlesEntity = new PetalParticles();
    const petalParticles = await this.#PetalParticlesEntity.initialize(perlinTexture, petalGeometry);
    scene.add(petalParticles);

    const GommageButton = debugFolder.addButton({
      title: 'GOMMAGE',
    });
    const ResetButton = debugFolder.addButton({
      title: 'RESET',
    });
    const DustButton = debugFolder.addButton({
      title: 'DUST',
    });
    const PetalButton = debugFolder.addButton({
      title: 'PETAL',
    });
    GommageButton.on('click', () => {
      this.triggerGommage();
    });
    ResetButton.on('click', () => {
      this.resetGommage();
    });
    DustButton.on('click', () => {
      const randomPosition = this.#MSDFTextEntity.getRandomPositionInMesh();
      this.#DustParticlesEntity.spawnDust(randomPosition);
    });
    PetalButton.on('click', () => {
      this.#PetalParticlesEntity.debugSpawnPetal();
    });

    // Escuchar mensajes de Firebase
    listenToCurrentMessage((newMessage) => {
      console.log('Nuevo mensaje recibido:', newMessage);
      this.updateText(newMessage);
    });
  }

  async updateText(newText) {
    console.log('updateText llamado con:', newText);
    
    // Actualizar el estado global
    messageState.setMessage(newText);
    
    // Si el texto está vacío o es el mensaje inicial, remover el mesh y mostrar QR
    if (!newText || newText.trim() === '' || newText === 'Esperando mensaje...') {
      if (this.#currentTextMesh) {
        this.#scene.remove(this.#currentTextMesh);
        this.#currentTextMesh.geometry.dispose();
        this.#currentTextMesh.material.dispose();
        this.#currentTextMesh = null;
      }
      return;
    }

    // Remover el mesh actual si existe
    if (this.#currentTextMesh) {
      this.#scene.remove(this.#currentTextMesh);
      this.#currentTextMesh.geometry.dispose();
      this.#currentTextMesh.material.dispose();
    }

    // Crear nuevo texto
    this.#MSDFTextEntity = new MSDFText();
    const msdfText = await this.#MSDFTextEntity.initialize(
      newText,
      new THREE.Vector3(0, 0, 0),
      this.#uProgress,
      this.#perlinTexture,
      this.#fontAtlasTexture
    );
    this.#currentTextMesh = msdfText;
    this.#scene.add(msdfText);

    // Resetear el progreso y activar el efecto automáticamente
    this.resetGommage();
    setTimeout(() => {
      this.triggerGommage();
    }, 500);
  }

  async loadPetalGeometry() {
    const modelLoader = new GLTFLoader();
    const petalScene = await modelLoader.loadAsync('./models/petal.glb');
    const petalMesh = petalScene.scene.getObjectByName('PetalV2');
    return petalMesh.geometry;
  }

  async loadTextures() {
    const textureLoader = new THREE.TextureLoader();

    const dustParticleTexture = await textureLoader.loadAsync('./textures/dustParticle.png');
    dustParticleTexture.colorSpace = THREE.NoColorSpace;
    dustParticleTexture.minFilter = THREE.LinearFilter;
    dustParticleTexture.magFilter = THREE.LinearFilter;
    dustParticleTexture.generateMipmaps = false;

    const perlinTexture = await textureLoader.loadAsync('./textures/perlin.webp');
    perlinTexture.colorSpace = THREE.NoColorSpace;
    perlinTexture.minFilter = THREE.LinearFilter;
    perlinTexture.magFilter = THREE.LinearFilter;
    perlinTexture.wrapS = THREE.RepeatWrapping;
    perlinTexture.wrapT = THREE.RepeatWrapping;
    perlinTexture.generateMipmaps = false;

    const fontAtlasTexture = await textureLoader.loadAsync('./fonts/Cinzel/Cinzel.png');
    fontAtlasTexture.colorSpace = THREE.NoColorSpace;
    fontAtlasTexture.minFilter = THREE.LinearFilter;
    fontAtlasTexture.magFilter = THREE.LinearFilter;
    fontAtlasTexture.wrapS = THREE.ClampToEdgeWrapping;
    fontAtlasTexture.wrapT = THREE.ClampToEdgeWrapping;
    fontAtlasTexture.generateMipmaps = false;

    return { perlinTexture, dustParticleTexture, fontAtlasTexture };
  }

  triggerGommage() {
    // Don't start if already running
    if (this.#gommageTween || this.#spawnDustTween || this.#spawnPetalTween) return;
    this.#uProgress.value = 0;

    // Notificar que el efecto está corriendo
    messageState.setEffectRunning(true);

    this.#spawnDustTween = gsap.to(
      {},
      {
        duration: this.#dustInterval,
        repeat: -1,
        onRepeat: () => {
          const p = this.#MSDFTextEntity.getRandomPositionInMesh();
          this.#DustParticlesEntity.spawnDust(p);
        },
      }
    );

    this.#spawnPetalTween = gsap.to(
      {},
      {
        duration: this.#petalInterval,
        repeat: -1,
        onRepeat: () => {
          const p = this.#MSDFTextEntity.getRandomPositionInMesh();
          this.#PetalParticlesEntity.spawnPetal(p);
        },
      }
    );

    this.#gommageTween = gsap.to(this.#uProgress, {
      value: 1,
      duration: 6,
      ease: 'linear',
      onComplete: () => {
        this.#spawnDustTween?.kill();
        this.#spawnPetalTween?.kill();
        this.#spawnDustTween = null;
        this.#gommageTween = null;
        this.#spawnPetalTween = null;
        
        // Notificar que el efecto terminó
        messageState.setEffectRunning(false);
        
        // Después de 2 segundos, limpiar el mensaje para mostrar el QR
        setTimeout(() => {
          if (this.#currentTextMesh) {
            this.#scene.remove(this.#currentTextMesh);
            this.#currentTextMesh.geometry.dispose();
            this.#currentTextMesh.material.dispose();
            this.#currentTextMesh = null;
          }
          // Resetear el mensaje para mostrar el QR
          messageState.setMessage('');
        }, 2000);
      },
    });
  }

  resetGommage() {
    this.#gommageTween?.kill();
    this.#spawnDustTween?.kill();
    this.#spawnPetalTween?.kill();

    this.#gommageTween = null;
    this.#spawnDustTween = null;
    this.#spawnPetalTween = null;

    this.#uProgress.value = 0;
  }
}
