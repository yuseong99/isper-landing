import * as THREE from 'three';
import { gsap } from 'gsap';
import { lerp } from '../utils/performance.js';
import TileToGlobeShader from '../shaders/TileToGlobeShader.js';

export default class HeroScene {
  constructor(camera, renderer, isMobile) {
    this.camera = camera;
    this.renderer = renderer;
    this.isMobile = isMobile;
    this.scene = new THREE.Scene();
    this.tiles = [];
    this.tileGroup = new THREE.Group();
    this.globe = null;
    this.mouse = new THREE.Vector2();
    this.targetMouse = new THREE.Vector2();
    this.scrollProgress = 0;
    this.isTransitioningToGlobe = false;
    this.tilePositions = [];
    this.letterPositions = this.calculateLetterPositions();
  }

  init() {
    this.setupLighting();
    this.createVideoTiles();
    this.createParticles();
    this.scene.add(this.tileGroup);
    
    this.camera.position.set(0, 0, this.isMobile ? 8 : 5);
    this.camera.lookAt(0, 0, 0);
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = !this.isMobile;
    this.scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0x4fc3f7, 0.3);
    rimLight.position.set(-5, 0, -5);
    this.scene.add(rimLight);
  }

  calculateLetterPositions() {
    const letterWidth = 0.8;
    const spacing = 0.1;
    const word = "ISPER";
    const totalWidth = word.length * letterWidth + (word.length - 1) * spacing;
    const startX = -totalWidth / 2 + letterWidth / 2;
    
    return word.split('').map((letter, index) => ({
      letter,
      x: startX + index * (letterWidth + spacing),
      y: 0,
      z: 0
    }));
  }

  createVideoTiles() {
    const tileGeometry = new THREE.PlaneGeometry(0.6, 0.4);
    const tileCount = this.isMobile ? 15 : 25;
    
    const videoTextures = this.createVideoTextures();
    
    for (let i = 0; i < tileCount; i++) {
      const material = new THREE.MeshStandardMaterial({
        map: videoTextures[i % videoTextures.length],
        emissive: new THREE.Color(0x4fc3f7),
        emissiveIntensity: 0.1,
        roughness: 0.3,
        metalness: 0.7,
        side: THREE.DoubleSide
      });
      
      const tile = new THREE.Mesh(tileGeometry, material);
      
      const angle = (i / tileCount) * Math.PI * 2;
      const radius = 2 + Math.random() * 2;
      tile.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 3,
        Math.sin(angle) * radius
      );
      
      tile.rotation.x = Math.random() * Math.PI;
      tile.rotation.y = Math.random() * Math.PI;
      tile.userData.originalPosition = tile.position.clone();
      tile.userData.velocity = new THREE.Vector3();
      tile.userData.index = i;
      
      this.tiles.push(tile);
      this.tileGroup.add(tile);
      
      this.tilePositions.push({
        original: tile.position.clone(),
        current: tile.position.clone(),
        target: tile.position.clone()
      });
    }
  }

  createVideoTextures() {
    const textures = [];
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    const colors = ['#4fc3f7', '#29b6f6', '#039be5', '#0288d1', '#0277bd'];
    
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = colors[i];
      ctx.fillRect(0, 0, 256, 256);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let j = 0; j < 10; j++) {
        ctx.fillRect(
          Math.random() * 256,
          Math.random() * 256,
          Math.random() * 50 + 10,
          Math.random() * 50 + 10
        );
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      textures.push(texture);
    }
    
    return textures;
  }

  createParticles() {
    const particleCount = this.isMobile ? 500 : 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      sizes[i] = Math.random() * 0.05 + 0.01;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x4fc3f7,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  onMouseMove(mouse) {
    this.targetMouse.copy(mouse);
  }

  onScroll(progress) {
    this.scrollProgress = progress;
    
    if (progress > 0.5 && !this.isTransitioningToGlobe) {
      this.startGlobeTransition();
    }
  }

  startGlobeTransition() {
    this.isTransitioningToGlobe = true;
    
    this.tiles.forEach((tile, index) => {
      const letterIndex = Math.floor((index / this.tiles.length) * this.letterPositions.length);
      const letterPos = this.letterPositions[letterIndex];
      
      gsap.to(tile.position, {
        x: letterPos.x,
        y: letterPos.y,
        z: letterPos.z,
        duration: 1.5,
        ease: 'power3.inOut',
        delay: index * 0.02
      });
      
      gsap.to(tile.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.5,
        ease: 'power3.inOut',
        delay: index * 0.02
      });
    });
    
    gsap.delayedCall(2, () => {
      this.transitionToGlobe();
    });
  }

  transitionToGlobe() {
    const globeGeometry = new THREE.SphereGeometry(2, 64, 64);
    const globeMaterial = new THREE.ShaderMaterial(TileToGlobeShader);
    
    this.globe = new THREE.Mesh(globeGeometry, globeMaterial);
    this.scene.add(this.globe);
    
    gsap.to(this.tileGroup, {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        this.tileGroup.visible = false;
      }
    });
    
    gsap.to(this.camera.position, {
      z: 10,
      duration: 2,
      ease: 'power2.inOut'
    });
  }

  update(deltaTime, elapsedTime) {
    this.mouse.lerp(this.targetMouse, 0.1);
    
    if (!this.isTransitioningToGlobe) {
      this.tiles.forEach((tile, index) => {
        const pos = this.tilePositions[index];
        const distance = tile.position.distanceTo(
          new THREE.Vector3(this.mouse.x * 5, this.mouse.y * 5, 0)
        );
        
        if (distance < 2) {
          const force = (2 - distance) / 2;
          const direction = tile.position.clone().sub(
            new THREE.Vector3(this.mouse.x * 5, this.mouse.y * 5, 0)
          ).normalize();
          
          tile.userData.velocity.add(direction.multiplyScalar(force * 0.1));
        }
        
        tile.userData.velocity.multiplyScalar(0.95);
        tile.position.add(tile.userData.velocity);
        
        const returnForce = pos.original.clone().sub(tile.position).multiplyScalar(0.02);
        tile.position.add(returnForce);
        
        tile.rotation.x += deltaTime * 0.2;
        tile.rotation.y += deltaTime * 0.1;
      });
    }
    
    if (this.particles) {
      this.particles.rotation.y += deltaTime * 0.05;
    }
    
    if (this.globe) {
      this.globe.rotation.y += deltaTime * 0.1;
      this.globe.material.uniforms.time.value = elapsedTime;
    }
  }

  onResize(width, height) {
    
  }

  dispose() {
    this.tiles.forEach(tile => {
      tile.geometry.dispose();
      tile.material.dispose();
      if (tile.material.map) tile.material.map.dispose();
    });
    
    if (this.particles) {
      this.particles.geometry.dispose();
      this.particles.material.dispose();
    }
    
    if (this.globe) {
      this.globe.geometry.dispose();
      this.globe.material.dispose();
    }
  }
}