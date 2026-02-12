//gommageOrchestrator.js

import * as THREE from 'three/webgpu';
import MSDFText from './msdfText.js';
import { uniform } from 'three/tsl';
import DustParticles from './dustParticles.js';
import PetalParticles from './petalParticles.js';
import StarParticles from './starParticles.js';
import Debug, { DEBUG_FOLDERS } from './debug.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { listenToApprovedMessages, updateMessageStatus } from './firebase.js';
import { messageState } from './messageState.js';
import { autoModerator } from './autoModerator.js';

export default class GommageOrchestrator {
  #uProgress = uniform(0.0);

  #MSDFTextEntity = null;
  #DustParticlesEntity = null;
  #PetalParticlesEntity = null;
  #StarParticlesEntity = null;

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
  #messageQueue = [];
  #currentMessage = null;
  #isShowingMessage = false;

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

    // Inicializar estrellas de fondo
    this.#StarParticlesEntity = new StarParticles();
    const starParticles = await this.#StarParticlesEntity.initialize();
    scene.add(starParticles);

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
    const RegenerateStarsButton = debugFolder.addButton({
      title: 'REGENERATE STARS',
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
    RegenerateStarsButton.on('click', () => {
      this.#StarParticlesEntity.regenerateStars();
    });

    // Iniciar auto-moderador
    autoModerator.start();

    // Escuchar mensajes aprobados de Firebase
    listenToApprovedMessages((messages) => {
      console.log('Mensajes aprobados recibidos:', messages);
      this.#messageQueue = messages;
      this.processQueue();
    });
  }

  processQueue() {
    // Si ya está mostrando un mensaje o no hay mensajes, no hacer nada
    if (this.#isShowingMessage || this.#messageQueue.length === 0) {
      return;
    }

    // Tomar el primer mensaje de la cola
    const nextMessage = this.#messageQueue[0];
    
    if (!nextMessage || nextMessage.status !== 'approved') {
      return;
    }

    console.log('Mostrando mensaje:', nextMessage);
    this.#currentMessage = nextMessage;
    this.#isShowingMessage = true;
    
    this.updateText(nextMessage.text, nextMessage.id);
  }

async updateText(newText, messageId = null) {
    console.log('updateText llamado con:', newText, 'messageId:', messageId);
    
    messageState.setMessage(newText);
    
    if (!newText || newText.trim() === '' || newText === 'Esperando mensaje...') {
        if (this.#currentTextMesh) {
            this.#scene.remove(this.#currentTextMesh);
            this.#currentTextMesh.geometry.dispose();
            this.#currentTextMesh.material.dispose();
            this.#currentTextMesh = null;
        }
        return;
    }

    // Limpiar anterior
    if (this.#currentTextMesh) {
        this.#scene.remove(this.#currentTextMesh);
        this.#currentTextMesh.geometry.dispose();
        this.#currentTextMesh.material.dispose();
        this.#currentTextMesh = null;
    }

    // Crear nuevo texto (aún NO lo añadimos a la escena)
    this.#MSDFTextEntity = new MSDFText();
    const msdfText = await this.#MSDFTextEntity.initialize(
        newText,
        new THREE.Vector3(0, 0, 0),
        this.#uProgress,
        this.#perlinTexture,
        this.#fontAtlasTexture
    );

    this.#currentTextMesh = msdfText;

    // Importante: preparamos el estado disuelto ANTES de mostrarlo
    this.#uProgress.value = 1.0;

    // Ahora sí lo añadimos → el usuario solo verá el texto ya disuelto
    this.#scene.add(msdfText);

    // Lanzamos la animación inmediatamente (o con muy poco delay si quieres)
    this.triggerGommage(messageId);
    // Si aún quieres un pequeño retraso visual puedes dejar:
    // setTimeout(() => this.triggerGommage(messageId), 50); // o 0~100ms
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

  triggerGommage(messageId = null) {
    // Don't start if already running
    if (this.#gommageTween || this.#spawnDustTween || this.#spawnPetalTween) return;
    
    // Iniciar desde completamente disuelto (1) hacia visible (0)
    this.#uProgress.value = 1;

    // Notificar que el efecto está corriendo
    messageState.setEffectRunning(true);

    // Iniciar partículas inmediatamente
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

    // Iniciar el efecto del texto 1 segundo después
    setTimeout(() => {
      // Animar de 1 (invisible) a 0 (visible) - efecto inverso
      this.#gommageTween = gsap.to(this.#uProgress, {
        value: 0,
        duration: 6,
        ease: 'linear',
        onComplete: async () => {
          // Detener las partículas
          this.#spawnDustTween?.kill();
          this.#spawnPetalTween?.kill();
          this.#spawnDustTween = null;
          this.#gommageTween = null;
          this.#spawnPetalTween = null;
          
          // Notificar que el efecto terminó
          messageState.setEffectRunning(false);
          
          // Marcar el mensaje como mostrado en Firebase
          if (messageId) {
            try {
              await updateMessageStatus(messageId, 'shown');
              console.log('Mensaje marcado como mostrado:', messageId);
              
              // Guardar el último mensaje mostrado
              const messageText = this.#currentMessage?.text || '';
              messageState.setLastShownMessage(messageText);
            } catch (error) {
              console.error('Error al marcar mensaje como mostrado:', error);
            }
          }
          
          // El mensaje permanece visible, no se limpia
          // Marcar que ya no está mostrando mensaje para procesar el siguiente
          this.#isShowingMessage = false;
          
          // Procesar el siguiente mensaje de la cola después de un breve delay
          setTimeout(() => {
            this.processQueue();
          }, 1000);
        },
      });
    }, 1500); // Delay de 1 segundo antes de iniciar el efecto del texto
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
