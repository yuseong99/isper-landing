import * as THREE from 'three';
import { gsap } from 'gsap';

export default class FeatureTunnel {
  constructor(camera, renderer, isMobile) {
    this.camera = camera;
    this.renderer = renderer;
    this.isMobile = isMobile;
    this.scene = new THREE.Scene();
    this.panels = [];
    this.curve = null;
    this.cameraProgress = 0;
    this.features = [
      { title: 'Video Analysis', description: 'AI-powered video processing', icon: '🎥' },
      { title: 'OCR Detection', description: 'Extract text from frames', icon: '📝' },
      { title: 'Location Mapping', description: 'Map detected locations', icon: '📍' },
      { title: 'Itinerary Generation', description: 'Create travel plans', icon: '✈️' }
    ];
  }

  init() {
    this.setupLighting();
    this.createTunnelPath();
    this.createFeaturePanels();
    this.createTunnelMesh();
    this.setupCamera();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    this.scene.add(ambientLight);

    const spotLight1 = new THREE.SpotLight(0x4fc3f7, 1);
    spotLight1.position.set(0, 10, 0);
    spotLight1.angle = Math.PI / 6;
    this.scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0xff6b6b, 0.5);
    spotLight2.position.set(0, -10, 10);
    spotLight2.angle = Math.PI / 6;
    this.scene.add(spotLight2);
  }

  createTunnelPath() {
    const points = [];
    const segments = 20;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2;
      const radius = 5 + Math.sin(t * Math.PI * 4) * 2;
      
      points.push(new THREE.Vector3(
        Math.sin(angle) * radius,
        Math.cos(angle) * radius * 0.5,
        -t * 50
      ));
    }
    
    this.curve = new THREE.CatmullRomCurve3(points);
  }

  createFeaturePanels() {
    const panelGeometry = new THREE.PlaneGeometry(4, 3);
    
    this.features.forEach((feature, index) => {
      const canvas = this.createFeatureCanvas(feature);
      const texture = new THREE.CanvasTexture(canvas);
      
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        emissive: new THREE.Color(0x4fc3f7),
        emissiveIntensity: 0.2,
        roughness: 0.1,
        metalness: 0.5,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });
      
      const panel = new THREE.Mesh(panelGeometry, material);
      
      const t = (index + 1) / (this.features.length + 1);
      const position = this.curve.getPoint(t);
      const tangent = this.curve.getTangent(t);
      
      panel.position.copy(position);
      panel.position.x += (index % 2 === 0 ? 5 : -5);
      panel.lookAt(position.clone().add(tangent));
      
      panel.userData = {
        index,
        originalPosition: panel.position.clone(),
        feature
      };
      
      this.panels.push(panel);
      this.scene.add(panel);
      
      this.createFloatingElements(position, index);
    });
  }

  createFeatureCanvas(feature) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(79, 195, 247, 0.9)');
    gradient.addColorStop(1, 'rgba(41, 182, 246, 0.9)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px -apple-system, Arial';
    ctx.textAlign = 'center';
    ctx.fillText(feature.icon, canvas.width / 2, 100);
    
    ctx.font = 'bold 36px -apple-system, Arial';
    ctx.fillText(feature.title, canvas.width / 2, 200);
    
    ctx.font = '24px -apple-system, Arial';
    ctx.fillText(feature.description, canvas.width / 2, 250);
    
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    
    return canvas;
  }

  createFloatingElements(position, index) {
    const geometry = new THREE.IcosahedronGeometry(0.3, 1);
    const material = new THREE.MeshStandardMaterial({
      color: index % 2 === 0 ? 0x4fc3f7 : 0xff6b6b,
      emissive: index % 2 === 0 ? 0x4fc3f7 : 0xff6b6b,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8
    });
    
    for (let i = 0; i < 5; i++) {
      const floater = new THREE.Mesh(geometry, material);
      floater.position.copy(position);
      floater.position.x += (Math.random() - 0.5) * 10;
      floater.position.y += (Math.random() - 0.5) * 5;
      floater.position.z += (Math.random() - 0.5) * 3;
      
      floater.userData.offset = Math.random() * Math.PI * 2;
      floater.userData.speed = 0.5 + Math.random() * 0.5;
      
      this.scene.add(floater);
    }
  }

  createTunnelMesh() {
    const tubeGeometry = new THREE.TubeGeometry(this.curve, 100, 3, 8, false);
    const tubeMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      emissive: 0x4fc3f7,
      emissiveIntensity: 0.1,
      roughness: 0.8,
      metalness: 0.2,
      side: THREE.BackSide,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    
    const tunnel = new THREE.Mesh(tubeGeometry, tubeMaterial);
    this.scene.add(tunnel);
  }

  setupCamera() {
    const startPoint = this.curve.getPoint(0);
    this.camera.position.copy(startPoint);
    this.camera.position.z += 5;
  }

  onScroll(progress) {
    this.cameraProgress = progress;
    
    const point = this.curve.getPoint(progress);
    const tangent = this.curve.getTangent(progress);
    
    gsap.to(this.camera.position, {
      x: point.x,
      y: point.y,
      z: point.z + 5,
      duration: 0.5,
      ease: 'power2.out'
    });
    
    const lookAtPoint = point.clone().add(tangent.multiplyScalar(10));
    gsap.to(this.camera.rotation, {
      x: Math.atan2(lookAtPoint.y - this.camera.position.y, lookAtPoint.z - this.camera.position.z),
      y: Math.atan2(lookAtPoint.x - this.camera.position.x, lookAtPoint.z - this.camera.position.z),
      duration: 0.5,
      ease: 'power2.out'
    });
    
    this.panels.forEach((panel, index) => {
      const panelProgress = (index + 1) / (this.panels.length + 1);
      const distance = Math.abs(progress - panelProgress);
      const scale = 1 + (1 - distance) * 0.2;
      
      gsap.to(panel.scale, {
        x: scale,
        y: scale,
        z: scale,
        duration: 0.3
      });
      
      gsap.to(panel.material, {
        opacity: 0.5 + (1 - distance) * 0.5,
        emissiveIntensity: 0.2 + (1 - distance) * 0.3,
        duration: 0.3
      });
    });
  }

  update(deltaTime, elapsedTime) {
    this.scene.traverse((child) => {
      if (child.userData.offset !== undefined) {
        child.position.y += Math.sin(elapsedTime * child.userData.speed + child.userData.offset) * 0.01;
        child.rotation.x += deltaTime * 0.5;
        child.rotation.y += deltaTime * 0.3;
      }
    });
    
    this.panels.forEach((panel, index) => {
      const offset = Math.sin(elapsedTime + index) * 0.1;
      panel.position.y = panel.userData.originalPosition.y + offset;
    });
  }

  onResize(width, height) {
    
  }

  dispose() {
    this.panels.forEach(panel => {
      panel.geometry.dispose();
      panel.material.dispose();
      if (panel.material.map) panel.material.map.dispose();
    });
    
    this.scene.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    });
  }
}