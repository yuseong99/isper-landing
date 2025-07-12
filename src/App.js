import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParticleSystem } from './scenes/ParticleSystem.js';
import HeroScene from './scenes/HeroScene.js';
import FeatureTunnel from './scenes/FeatureTunnel.js';
import DemoSection from './scenes/DemoSection.js';
import { isMobile, setupPerformanceMonitor } from './utils/performance.js';

gsap.registerPlugin(ScrollTrigger);

export default class App {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.currentScene = null;
    this.scenes = {};
    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2();
    this.isMobile = isMobile();
    this.particleSystem = null;
  }

  init() {
    this.setupParticleSystem();
    this.setupRenderer();
    this.setupCamera();
    this.setupScenes();
    this.setupEventListeners();
    this.setupScrollTriggers();
    
    if (!this.isMobile) {
      setupPerformanceMonitor();
    }
    
    this.animate();
  }

  setupParticleSystem() {
    this.particleSystem = new ParticleSystem(this.container);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isMobile,
      alpha: true,
      powerPreference: this.isMobile ? 'low-power' : 'high-performance'
    });
    
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
    this.renderer.shadowMap.enabled = !this.isMobile;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    
    this.container.appendChild(this.renderer.domElement);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.z = 5;
  }

  setupScenes() {
    this.scenes.hero = new HeroScene(this.camera, this.renderer, this.isMobile);
    this.scenes.tunnel = new FeatureTunnel(this.camera, this.renderer, this.isMobile);
    this.scenes.demo = new DemoSection(this.camera, this.renderer, this.isMobile);
    
    this.currentScene = this.scenes.hero;
    this.currentScene.init();
  }

  setupEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this));
    
    if (!this.isMobile) {
      window.addEventListener('mousemove', this.onMouseMove.bind(this));
    } else {
      window.addEventListener('touchmove', this.onTouchMove.bind(this));
    }
  }

  setupScrollTriggers() {
    ScrollTrigger.create({
      trigger: '#hero-section',
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        if (this.currentScene === this.scenes.hero) {
          this.scenes.hero.onScroll(self.progress);
        }
      },
      onLeave: () => {
        this.transitionToScene('tunnel');
      },
      onEnterBack: () => {
        this.transitionToScene('hero');
      }
    });

    ScrollTrigger.create({
      trigger: '#feature-section',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        if (this.currentScene === this.scenes.tunnel) {
          this.scenes.tunnel.onScroll(self.progress);
        }
      },
      onLeave: () => {
        this.transitionToScene('demo');
      },
      onEnterBack: () => {
        this.transitionToScene('tunnel');
      }
    });
  }

  transitionToScene(sceneName) {
    if (this.currentScene) {
      this.currentScene.dispose();
    }
    
    this.currentScene = this.scenes[sceneName];
    this.currentScene.init();
    
    gsap.fromTo(this.renderer.domElement, {
      opacity: 0
    }, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    });
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / this.width) * 2 - 1;
    this.mouse.y = -(event.clientY / this.height) * 2 + 1;
    
    if (this.currentScene && this.currentScene.onMouseMove) {
      this.currentScene.onMouseMove(this.mouse);
    }
  }

  onTouchMove(event) {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.mouse.x = (touch.clientX / this.width) * 2 - 1;
      this.mouse.y = -(touch.clientY / this.height) * 2 + 1;
      
      if (this.currentScene && this.currentScene.onMouseMove) {
        this.currentScene.onMouseMove(this.mouse);
      }
    }
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(this.width, this.height);
    
    if (this.currentScene && this.currentScene.onResize) {
      this.currentScene.onResize(this.width, this.height);
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    const deltaTime = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();
    
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(deltaTime, elapsedTime);
    }
    
    if (this.currentScene && this.currentScene.scene) {
      this.renderer.render(this.currentScene.scene, this.camera);
    }
  }
}