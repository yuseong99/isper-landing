import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrbitControls } from '../utils/OrbitControls.js';
import GlobeShader from '../shaders/GlobeShader.js';

export default class DemoSection {
  constructor(camera, renderer, isMobile) {
    this.camera = camera;
    this.renderer = renderer;
    this.isMobile = isMobile;
    this.scene = new THREE.Scene();
    this.globe = null;
    this.pins = [];
    this.controls = null;
    this.dropZone = null;
    this.locations = [
      { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
      { name: 'Paris, France', lat: 48.8566, lon: 2.3522 },
      { name: 'New York, USA', lat: 40.7128, lon: -74.0060 },
      { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093 }
    ];
    this.detectedLocations = [];
  }

  init() {
    this.setupLighting();
    this.createGlobe();
    this.setupControls();
    this.setupDropZone();
    this.createBackground();
    
    this.camera.position.set(0, 0, 8);
    this.camera.lookAt(0, 0, 0);
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4fc3f7, 0.5);
    pointLight.position.set(-5, -5, -5);
    this.scene.add(pointLight);
  }

  createGlobe() {
    const geometry = new THREE.SphereGeometry(2.5, 64, 64);
    const material = new THREE.ShaderMaterial(GlobeShader);
    
    this.globe = new THREE.Mesh(geometry, material);
    this.scene.add(this.globe);
    
    const outlineGeometry = new THREE.SphereGeometry(2.55, 64, 64);
    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: 0x4fc3f7,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.1
    });
    
    const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
    this.globe.add(outline);
  }

  createBackground() {
    const particleCount = this.isMobile ? 200 : 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 15 + Math.random() * 10;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.1,
      color: 0x4fc3f7,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const stars = new THREE.Points(geometry, material);
    this.scene.add(stars);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.5;
    this.controls.enablePan = false;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 12;
  }

  setupDropZone() {
    this.dropZone = document.querySelector('.drop-zone');
    const locationList = document.getElementById('location-list');
    const ocrOutput = document.querySelector('.ocr-output');
    
    this.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dropZone.classList.add('drag-over');
    });
    
    this.dropZone.addEventListener('dragleave', () => {
      this.dropZone.classList.remove('drag-over');
    });
    
    this.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dropZone.classList.remove('drag-over');
      
      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith('video/')) {
        this.processVideo(files[0]);
      }
    });
  }

  processVideo(file) {
    this.dropZone.innerHTML = '<p>Processing video...</p>';
    
    setTimeout(() => {
      this.dropZone.innerHTML = '<p>Video processed!</p>';
      
      const mockLocations = this.locations.slice(0, Math.floor(Math.random() * 3) + 2);
      this.detectedLocations = mockLocations;
      
      const locationList = document.getElementById('location-list');
      locationList.innerHTML = '';
      
      mockLocations.forEach((location, index) => {
        const li = document.createElement('li');
        li.textContent = location.name;
        li.style.opacity = '0';
        locationList.appendChild(li);
        
        gsap.to(li, {
          opacity: 1,
          x: 20,
          duration: 0.5,
          delay: index * 0.2
        });
        
        this.addPin(location.lat, location.lon, location.name, index);
      });
      
      document.querySelector('.ocr-output').classList.add('visible');
      
      setTimeout(() => {
        this.dropZone.innerHTML = '<p>Drop another video</p>';
      }, 3000);
    }, 2000);
  }

  addPin(lat, lon, name, index) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -2.5 * Math.sin(phi) * Math.cos(theta);
    const y = 2.5 * Math.cos(phi);
    const z = 2.5 * Math.sin(phi) * Math.sin(theta);
    
    const pinGeometry = new THREE.ConeGeometry(0.1, 0.3, 8);
    const pinMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b6b,
      emissive: 0xff6b6b,
      emissiveIntensity: 0.5
    });
    
    const pin = new THREE.Mesh(pinGeometry, pinMaterial);
    pin.position.set(x, y, z);
    pin.lookAt(0, 0, 0);
    pin.rotateX(Math.PI);
    
    const ringGeometry = new THREE.RingGeometry(0.15, 0.2, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6b6b,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(pin.position);
    ring.lookAt(0, 0, 0);
    
    this.globe.add(pin);
    this.globe.add(ring);
    this.pins.push({ pin, ring, name });
    
    gsap.from(pin.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.5,
      delay: index * 0.2,
      ease: 'back.out(1.7)'
    });
    
    gsap.to(ring.scale, {
      x: 2,
      y: 2,
      z: 2,
      duration: 2,
      repeat: -1,
      ease: 'power2.inOut'
    });
    
    gsap.to(ring.material, {
      opacity: 0,
      duration: 2,
      repeat: -1,
      ease: 'power2.inOut'
    });
    
    const labelCanvas = this.createLabelCanvas(name);
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });
    const label = new THREE.Sprite(labelMaterial);
    
    label.position.copy(pin.position);
    label.position.multiplyScalar(1.2);
    label.scale.set(1, 0.5, 1);
    
    this.globe.add(label);
  }

  createLabelCanvas(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px -apple-system, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    return canvas;
  }

  update(deltaTime, elapsedTime) {
    if (this.globe) {
      this.globe.rotation.y += deltaTime * 0.05;
      this.globe.material.uniforms.time.value = elapsedTime;
    }
    
    if (this.controls) {
      this.controls.update();
    }
    
    this.pins.forEach((pinData, index) => {
      pinData.pin.position.y = pinData.pin.userData.baseY || pinData.pin.position.y;
      pinData.pin.position.y += Math.sin(elapsedTime * 2 + index) * 0.02;
    });
  }

  onResize(width, height) {
    if (this.controls) {
      this.controls.update();
    }
  }

  dispose() {
    if (this.controls) {
      this.controls.dispose();
    }
    
    this.pins.forEach(({ pin, ring }) => {
      pin.geometry.dispose();
      pin.material.dispose();
      ring.geometry.dispose();
      ring.material.dispose();
    });
    
    if (this.globe) {
      this.globe.geometry.dispose();
      this.globe.material.dispose();
    }
  }
}