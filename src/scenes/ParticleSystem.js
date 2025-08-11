import * as THREE from 'three';
import gsap from 'gsap';
import { FluidSimulation } from '../utils/FluidSimulation.js';

export class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.particles = [];
        this.particleCount = 2000;
        this.textParticles = [];
        this.isTextFormed = false;
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        
        this.clock = new THREE.Clock();
        this.time = 0;
        this.scrollProgress = 0;
        this.isPinned = false;
        this.isBursted = false;
        this.globe = null;
        this.globeGroup = new THREE.Group();
        
        // Globe interaction variables
        this.globeRotationVelocity = { x: 0, y: 0.001 }; // Slower default rotation speed
        this.mouseDown = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.globeInteractionEnabled = false; // Will be true when globe is visible
        
        // Special clickable star
        this.specialStarIndex = null;
        this.specialStar = null;
        
        // Initialize fluid simulation
        this.fluidSim = new FluidSimulation(64, 64);
        this.lastMousePos = new THREE.Vector2();
        this.useFluidSimulation = false; // Toggle for fluid vs simple physics
        
        this.init();
    }
    
    init() {
        console.log('Initializing ParticleSystem');
        this.setupRenderer();
        this.setupCamera();
        this.createParticles();
        this.createTextGeometry();
        this.setupEventListeners();
        this.animate();
        console.log('ParticleSystem initialized');
    }
    
    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x0a0a0a, 1);
        
        // Ensure the canvas stays fixed
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.pointerEvents = 'auto';
        
        this.container.appendChild(this.renderer.domElement);
        console.log('Renderer setup complete', this.renderer.domElement);
    }
    
    setupCamera() {
        this.camera.position.z = 50;
    }
    
    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const velocities = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 100;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;
            
            velocities[i3] = (Math.random() - 0.5) * 0.05;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.05;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.05;
            
            const color = new THREE.Color();
            // Random hue across full spectrum (0-1), high saturation, varied lightness
            color.setHSL(Math.random(), 0.7 + Math.random() * 0.3, 0.4 + Math.random() * 0.3);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            sizes[i] = Math.random() * 2 + 0.5;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const vertexShader = `
            attribute float size;
            attribute vec3 velocity;
            varying vec3 vColor;
            varying vec3 vPosition;
            varying float vSize;
            
            void main() {
                vColor = color;
                vPosition = position;
                vSize = size;
                
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `;
        
        const fragmentShader = `
            uniform float time;
            
            varying vec3 vColor;
            varying vec3 vPosition;
            varying float vSize;
            
            void main() {
                vec2 coord = gl_PointCoord - vec2(0.5);
                float r = length(coord);
                if (r > 0.5) discard;
                
                // Calculate sphere normal for volumetric appearance
                float z = sqrt(max(0.0, 1.0 - r * r * 4.0));
                vec3 normal = normalize(vec3(coord * 2.0, z));
                
                // Multiple light sources for better volume definition
                vec3 lightDir1 = normalize(vec3(0.5, 0.5, 1.0));
                vec3 lightDir2 = normalize(vec3(-0.3, 0.7, 0.5));
                
                float diffuse1 = max(dot(normal, lightDir1), 0.0);
                float diffuse2 = max(dot(normal, lightDir2), 0.0) * 0.5;
                
                // Fresnel rim lighting for volume
                float fresnel = pow(1.0 - z, 1.5);
                
                // Depth-based ambient occlusion
                float depthAO = pow(z, 0.5);
                
                // Simulate volumetric self-shadowing
                float selfShadow = smoothstep(0.0, 0.3, z) * 0.8 + 0.2;
                
                // Combine lighting components
                vec3 ambient = vColor * 0.2;
                vec3 diffuse = vColor * (diffuse1 + diffuse2) * selfShadow;
                vec3 rim = vColor * fresnel * 0.4;
                
                vec3 finalColor = (ambient + diffuse) * depthAO + rim;
                
                // Volumetric alpha with soft edges
                float alpha = 1.0 - smoothstep(0.35, 0.5, r);
                alpha *= pow(z, 0.3) * 0.9 + 0.1;
                
                // Add subtle glow
                float glow = exp(-r * 4.0) * 0.3;
                finalColor += vColor * glow;
                
                gl_FragColor = vec4(finalColor, alpha);
            }
        `;
        
        // Create uniforms
        const uniforms = {
            time: { value: 0 }
        };
        
        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
            blending: THREE.NormalBlending,
            depthTest: true,
            depthWrite: false,
            transparent: true,
            vertexColors: true
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }
    
    createTextGeometry() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 2048;
        canvas.height = 512;
        
        // Enable better text rendering
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        
        context.fillStyle = '#ffffff';
        context.font = '900 300px Montserrat, Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('ISPER', canvas.width / 2, canvas.height / 2);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Sample more densely for better resolution
        for (let y = 0; y < canvas.height; y += 3) {
            for (let x = 0; x < canvas.width; x += 3) {
                const index = (y * canvas.width + x) * 4;
                const brightness = data[index];
                
                if (brightness > 200) {
                    const posX = (x - canvas.width / 2) * 0.05;
                    const posY = -(y - canvas.height / 2) * 0.05;
                    this.textParticles.push(new THREE.Vector3(posX, posY, 0));
                }
            }
        }
        
        // Shuffle particles for better distribution during animation
        for (let i = this.textParticles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.textParticles[i], this.textParticles[j]] = [this.textParticles[j], this.textParticles[i]];
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('click', this.onMouseClick.bind(this));
        window.addEventListener('touchstart', this.onTouchStart.bind(this));
        window.addEventListener('scroll', this.onWindowScroll.bind(this));
    }
    
    onWindowScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
        console.log('Scroll progress:', scrollProgress, 'Text formed:', this.isTextFormed, 'Map formed:', this.isMapFormed);
        this.onScroll(scrollProgress);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    onMouseMove(event) {
        const prevX = this.mouse.x;
        const prevY = this.mouse.y;
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Check if hovering over special star
        if (this.isSpaceFormed && this.specialStarIndex !== null) {
            const rect = this.renderer.domElement.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            const positions = this.particleSystem.geometry.attributes.position.array;
            const i3 = this.specialStarIndex * 3;
            const starPos = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
            
            const projected = starPos.clone().project(this.camera);
            const distance = Math.sqrt(Math.pow(projected.x - x, 2) + Math.pow(projected.y - y, 2));
            
            // Change cursor when hovering over the special star
            if (distance < 0.15) {
                this.renderer.domElement.style.cursor = 'pointer';
            } else {
                this.renderer.domElement.style.cursor = 'default';
            }
        }
        
        // Handle globe interaction when it's visible
        if (this.globeInteractionEnabled && this.mouseDown) {
            const deltaX = event.clientX - this.previousMousePosition.x;
            const deltaY = event.clientY - this.previousMousePosition.y;
            
            // Update rotation velocity based on mouse movement
            // Reduced sensitivity for smoother control
            this.globeRotationVelocity.y += deltaX * 0.00005;
            this.globeRotationVelocity.x += deltaY * 0.00005;
            
            this.previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        }
        
        // Handle particle interaction
        if (!this.isTextFormed && !this.isSpaceFormed) {
            if (this.useFluidSimulation) {
                // Calculate mouse velocity for fluid simulation
                const mouseWorldX = this.mouse.x * 40;
                const mouseWorldY = this.mouse.y * 30;
                const mouseDeltaX = (this.mouse.x - prevX) * 40;
                const mouseDeltaY = (this.mouse.y - prevY) * 30;
                
                // Add force to fluid simulation at mouse position
                this.fluidSim.addForce(mouseWorldX, mouseWorldY, mouseDeltaX * 10, mouseDeltaY * 10, 5);
            } else {
                this.applySimpleMouseForce();
            }
        }
    }
    
    onMouseDown(event) {
        this.mouseDown = true;
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
    
    onMouseUp() {
        this.mouseDown = false;
    }
    
    onMouseClick(event) {
        // Check if clicking on the special star when in space mode
        if (this.isSpaceFormed && this.specialStarIndex !== null) {
            // Convert mouse position to normalized device coordinates
            const rect = this.renderer.domElement.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Create a raycaster to detect clicks
            this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
            
            // Get particle positions
            const positions = this.particleSystem.geometry.attributes.position.array;
            const sizes = this.particleSystem.geometry.attributes.size.array;
            
            // Check if click is near the special star
            const i3 = this.specialStarIndex * 3;
            const starPos = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
            
            // Project star position to screen
            const projected = starPos.clone().project(this.camera);
            const distance = Math.sqrt(Math.pow(projected.x - x, 2) + Math.pow(projected.y - y, 2));
            
            // If clicking near the special star (with larger tolerance for easier clicking)
            if (distance < 0.15) {
                // Navigate to ISPER Maps page
                window.location.href = '/isper-site.html#/maps';
                return;
            }
        }
        
        // Don't trigger animations if we're interacting with the globe
        if (this.globeInteractionEnabled || this.isSpaceFormed) {
            return;
        }
        
        if (!this.isTextFormed) {
            this.transformToText();
        } else if (!this.isMapFormed) {
            // If text is formed but map isn't, burst the particles
            this.burstParticles();
        }
    }
    
    onTouchStart(event) {
        // Don't trigger animations if we're interacting with the globe
        if (this.globeInteractionEnabled || this.isSpaceFormed) {
            return;
        }
        
        if (event.touches.length > 0) {
            const touch = event.touches[0];
            this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
            this.transformToText();
        }
    }
    
    onScroll(progress) {
        this.scrollProgress = progress;
        
        // Burst particles when scrolled down and text is formed
        if (progress > 0.1 && this.isTextFormed && !this.isBursted) {
            console.log('Triggering particle burst!');
            this.burstParticles();
            this.isBursted = true;
        } else if (progress <= 0.1) {
            // Reset burst state when scrolled back up
            this.isBursted = false;
        }
    }
    
    pinParticles() {
        this.isPinned = true;
        // You can add visual effects here when pinning
    }
    
    unpinParticles() {
        this.isPinned = false;
        // Resume normal particle behavior
    }
    
    burstParticles() {
        const positions = this.particleSystem.geometry.attributes.position.array;
        const velocities = this.particleSystem.geometry.attributes.velocity.array;
        const sizes = this.particleSystem.geometry.attributes.size.array;
        const colors = this.particleSystem.geometry.attributes.color.array;
        
        // Create a bright flash effect
        const flashDiv = document.createElement('div');
        flashDiv.style.position = 'fixed';
        flashDiv.style.top = '0';
        flashDiv.style.left = '0';
        flashDiv.style.width = '100%';
        flashDiv.style.height = '100%';
        flashDiv.style.backgroundColor = 'white';
        flashDiv.style.opacity = '0';
        flashDiv.style.pointerEvents = 'none';
        flashDiv.style.zIndex = '9999';
        document.body.appendChild(flashDiv);
        
        // Animate flash
        gsap.to(flashDiv, {
            opacity: 0.6,
            duration: 0.1,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(flashDiv, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.inOut",
                    onComplete: () => {
                        document.body.removeChild(flashDiv);
                    }
                });
            }
        });
        
        const tl = gsap.timeline({
            onUpdate: () => {
                this.particleSystem.geometry.attributes.position.needsUpdate = true;
                this.particleSystem.geometry.attributes.size.needsUpdate = true;
                this.particleSystem.geometry.attributes.color.needsUpdate = true;
            }
        });
        
        // Store original colors and create bright burst colors
        const originalColors = new Float32Array(colors.length);
        for (let i = 0; i < colors.length; i++) {
            originalColors[i] = colors[i];
        }
        
        // First phase: Initial burst outward with enhanced visuals
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const currentX = positions[i3];
            const currentY = positions[i3 + 1];
            
            // Calculate burst direction from center
            const angle = Math.atan2(currentY, currentX) + (Math.random() - 0.5) * 0.5;
            const burstForce = 30 + Math.random() * 40; // Increased force for visibility
            
            // Create spiral burst pattern
            const spiralOffset = i * 0.001;
            
            tl.to(positions, {
                duration: 2.0, // Slower for visibility
                ease: "power2.out",
                [i3]: currentX + Math.cos(angle + spiralOffset) * burstForce,
                [i3 + 1]: currentY + Math.sin(angle + spiralOffset) * burstForce,
                [i3 + 2]: (Math.random() - 0.5) * 20,
            }, i * 0.0005); // More stagger for wave effect
            
            // Make particles glow bright during burst
            tl.to(sizes, {
                duration: 0.5,
                [i]: sizes[i] * 4.0, // Bigger size increase
                ease: "power2.out",
            }, i * 0.0005)
            .to(sizes, {
                duration: 1.5,
                [i]: sizes[i] * 1.5, // Keep slightly larger
                ease: "power2.inOut",
            }, 0.5 + i * 0.0005);
            
            // Brighten colors during burst
            tl.to(colors, {
                duration: 0.8,
                [i3]: Math.min(1.0, colors[i3] * 2),
                [i3 + 1]: Math.min(1.0, colors[i3 + 1] * 2),
                [i3 + 2]: Math.min(1.0, colors[i3 + 2] * 2),
                ease: "power2.out",
            }, i * 0.0005);
        }
        
        // Pick one of the first stars to be the special clickable one
        this.specialStarIndex = 10; // Fixed index for consistency
        
        // Create a small cluster of stars around the special one
        const clusterIndices = [11, 12, 13, 14, 15]; // Stars near the special one
        
        // Second phase: Transform into space dust/stars
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Create spherical distribution for stars
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const radius = 40 + Math.random() * 50; // Between 40-90 units for bigger globe
            
            const starX = radius * Math.sin(phi) * Math.cos(theta);
            const starY = radius * Math.cos(phi);
            const starZ = radius * Math.sin(phi) * Math.sin(theta) - 10;
            
            // Special positioning for the clickable star
            if (i === this.specialStarIndex) {
                // Place it among other stars but slightly prominent
                const specialTheta = Math.PI * 1.2; // Specific angle
                const specialPhi = Math.PI * 0.3; // Upper portion
                const specialRadius = 55; // Medium distance
                
                const specialX = specialRadius * Math.sin(specialPhi) * Math.cos(specialTheta);
                const specialY = specialRadius * Math.cos(specialPhi);
                const specialZ = specialRadius * Math.sin(specialPhi) * Math.sin(specialTheta) - 10;
                
                tl.to(positions, {
                    duration: 2.0,
                    ease: "power3.inOut",
                    [i3]: specialX,
                    [i3 + 1]: specialY,
                    [i3 + 2]: specialZ,
                    delay: 2.5 + (i * 0.0002),
                });
                
                // Subtle blue-white color with slight warmth
                tl.to(colors, {
                    duration: 1.5,
                    [i3]: 0.9,      // Slightly warm
                    [i3 + 1]: 0.9,  // Slightly warm
                    [i3 + 2]: 1.0,  // Full blue
                    delay: 2.5,
                    ease: "power2.inOut",
                }, 0);
                
                // Slightly larger than average stars with gentle pulse
                tl.to(sizes, {
                    duration: 1.5,
                    [i]: 1.5,  // Just slightly bigger than normal stars
                    ease: "power2.inOut",
                    delay: 2.5,
                    onComplete: () => {
                        // Add subtle pulsing
                        gsap.to(sizes, {
                            duration: 3.0,
                            [i]: 2.0,
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut"
                        });
                    }
                }, 0);
            } else if (clusterIndices.includes(i)) {
                // Create a small cluster around the special star
                const clusterOffset = (i - 10) * 0.2;
                const clusterTheta = Math.PI * 1.2 + clusterOffset;
                const clusterPhi = Math.PI * 0.3 + (Math.random() - 0.5) * 0.1;
                const clusterRadius = 55 + (Math.random() - 0.5) * 5;
                
                const clusterX = clusterRadius * Math.sin(clusterPhi) * Math.cos(clusterTheta);
                const clusterY = clusterRadius * Math.cos(clusterPhi);
                const clusterZ = clusterRadius * Math.sin(clusterPhi) * Math.sin(clusterTheta) - 10;
                
                tl.to(positions, {
                    duration: 2.0,
                    ease: "power3.inOut",
                    [i3]: clusterX,
                    [i3 + 1]: clusterY,
                    [i3 + 2]: clusterZ,
                    delay: 2.5 + (i * 0.0002),
                });
                
                // Slightly brighter than normal stars
                const clusterBrightness = 0.7 + Math.random() * 0.3;
                tl.to(colors, {
                    duration: 1.5,
                    [i3]: clusterBrightness,
                    [i3 + 1]: clusterBrightness,
                    [i3 + 2]: clusterBrightness + 0.1,
                    delay: 2.5,
                    ease: "power2.inOut",
                }, 0);
                
                tl.to(sizes, {
                    duration: 1.5,
                    [i]: 0.8 + Math.random() * 0.4,
                    ease: "power2.inOut",
                    delay: 2.5,
                }, 0);
            } else {
                // Normal star animation
                tl.to(positions, {
                    duration: 2.0,
                    ease: "power3.inOut",
                    [i3]: starX,
                    [i3 + 1]: starY,
                    [i3 + 2]: starZ,
                    delay: 2.5 + (i * 0.0002),
                });
                
                const brightness = 0.5 + Math.random() * 0.5;
                tl.to(colors, {
                    duration: 1.5,
                    [i3]: brightness,
                    [i3 + 1]: brightness,
                    [i3 + 2]: brightness + Math.random() * 0.2,
                    delay: 2.5,
                    ease: "power2.inOut",
                }, 0);
                
                tl.to(sizes, {
                    duration: 1.5,
                    [i]: Math.random() * 0.8 + 0.2,
                    ease: "power2.inOut",
                    delay: 2.5,
                }, 0);
            }
        }
        
        // Add camera shake during burst
        const originalCameraPosition = this.camera.position.clone();
        gsap.to(this.camera.position, {
            x: originalCameraPosition.x + (Math.random() - 0.5) * 2,
            y: originalCameraPosition.y + (Math.random() - 0.5) * 2,
            duration: 0.1,
            ease: "power2.out",
            repeat: 10,
            yoyo: true,
            onComplete: () => {
                this.camera.position.copy(originalCameraPosition);
            }
        });
        
        // Show the globe after burst
        gsap.delayedCall(4.5, () => {
            if (!this.globe) {
                this.createGlobe();
            }
            this.isTextFormed = false;
            this.isSpaceFormed = true;
            this.globeInteractionEnabled = true; // Enable mouse interaction with globe
            
            // Remove the hint - let users discover it naturally
        });
    }
    
    createGlobe() {
        // Create globe geometry
        const globeGeometry = new THREE.SphereGeometry(25, 64, 64);
        
        // Load the texture from your Figma design
        const textureLoader = new THREE.TextureLoader();
        
        // Create globe material with your dot pattern texture
        const globeMaterial = new THREE.MeshBasicMaterial({
            map: null, // Will be set when texture loads
            transparent: true,
            opacity: 0
        });
        
        // Load your world map texture
        // You'll need to export your Figma design as a PNG and place it in the public folder
        textureLoader.load('/world-map-dots.png', (texture) => {
            globeMaterial.map = texture;
            globeMaterial.needsUpdate = true;
            
            // Animate globe appearance
            gsap.to(globeMaterial, {
                opacity: 1,
                duration: 2,
                ease: "power2.inOut"
            });
        });
        
        this.globe = new THREE.Mesh(globeGeometry, globeMaterial);
        this.globeGroup.add(this.globe);
        
        // Position globe in center
        this.globeGroup.position.set(0, 0, -10);
        this.scene.add(this.globeGroup);
    }
    
    createContinentDots() {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];
        const radius = 25.1;
        
        // Create a dense grid and only show dots where continents are
        const resolution = 180; // Higher resolution for more dots
        
        for (let lat = -90; lat <= 90; lat += 180/resolution) {
            for (let lon = -180; lon <= 180; lon += 360/resolution) {
                // Check if this lat/lon is on a continent
                if (this.isOnContinent(lat, lon)) {
                    const phi = (90 - lat) * Math.PI / 180;
                    const theta = (lon + 180) * Math.PI / 180;
                    
                    const x = -radius * Math.sin(phi) * Math.cos(theta);
                    const y = radius * Math.cos(phi);
                    const z = radius * Math.sin(phi) * Math.sin(theta);
                    
                    positions.push(x, y, z);
                    
                    // Color based on continent
                    const color = this.getContinentColor(lat, lon);
                    colors.push(color.r, color.g, color.b);
                    
                    sizes.push(0.8 + Math.random() * 0.4);
                }
            }
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 1.2,
            vertexColors: true,
            opacity: 0,
            transparent: true,
            sizeAttenuation: false
        });
        
        const points = new THREE.Points(geometry, material);
        
        // Animate dots appearing
        gsap.to(material, {
            opacity: 0.8,
            duration: 2,
            delay: 0.5,
            ease: "power2.inOut"
        });
        
        return points;
    }
    
    isOnContinent(lat, lon) {
        // Simplified continent boundaries
        // North America
        if (lat > 15 && lat < 75 && lon > -170 && lon < -50) {
            if (lat > 50 || (lat > 25 && lon > -130 && lon < -70)) return true;
        }
        
        // South America  
        if (lat > -60 && lat < 15 && lon > -85 && lon < -35) {
            if (lat < -50 && lon < -70) return false; // Exclude southern tip ocean
            return true;
        }
        
        // Africa
        if (lat > -35 && lat < 40) {
            if (lon > -20 && lon < 55) {
                if (lat > 30 && lon < 10) return false; // Mediterranean gap
                return true;
            }
        }
        
        // Europe
        if (lat > 35 && lat < 72 && lon > -10 && lon < 60) {
            if (lat < 40 && lon > 40) return false; // Middle East gap
            return true;
        }
        
        // Asia
        if (lat > -10 && lat < 75) {
            if (lon > 25 && lon < 180) return true;
            if (lon > -180 && lon < -140 && lat > 50) return true; // Eastern Russia
        }
        
        // Australia
        if (lat > -45 && lat < -10 && lon > 110 && lon < 155) {
            return true;
        }
        
        return false;
    }
    
    getContinentColor(lat, lon) {
        // Return different colors for each continent
        if (lat > 15 && lat < 75 && lon > -170 && lon < -50) {
            return new THREE.Color(0.4, 0.8, 0.4); // Green for North America
        }
        if (lat > -60 && lat < 15 && lon > -85 && lon < -35) {
            return new THREE.Color(1.0, 0.6, 0.2); // Orange for South America
        }
        if (lat > -35 && lat < 40 && lon > -20 && lon < 55) {
            return new THREE.Color(0.9, 0.4, 0.4); // Red for Africa
        }
        if (lat > 35 && lat < 72 && lon > -10 && lon < 60) {
            return new THREE.Color(0.4, 0.6, 1.0); // Blue for Europe
        }
        if ((lat > -10 && lat < 75 && lon > 60) || (lon < -140 && lat > 50)) {
            return new THREE.Color(0.8, 0.4, 0.8); // Purple for Asia
        }
        if (lat > -45 && lat < -10 && lon > 110 && lon < 155) {
            return new THREE.Color(1.0, 0.9, 0.3); // Yellow for Australia
        }
        
        return new THREE.Color(0.5, 0.8, 1.0); // Default blue
    }
    
    createDotGrid() {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];
        const radius = 25.1;
        
        // Create a grid of dots on the sphere surface
        const latitudeSegments = 20;
        const longitudeSegments = 40;
        
        for (let lat = 0; lat <= latitudeSegments; lat++) {
            const theta = (lat / latitudeSegments) * Math.PI;
            
            for (let lon = 0; lon <= longitudeSegments; lon++) {
                const phi = (lon / longitudeSegments) * Math.PI * 2;
                
                const x = radius * Math.sin(theta) * Math.cos(phi);
                const y = radius * Math.cos(theta);
                const z = radius * Math.sin(theta) * Math.sin(phi);
                
                positions.push(x, y, z);
                
                // Create a gradient effect - brighter at equator, dimmer at poles
                const brightness = Math.sin(theta) * 0.5 + 0.5;
                colors.push(0.3 * brightness, 0.6 * brightness, 1.0 * brightness);
                
                // Larger dots for better visibility
                sizes.push(1.0 + Math.random() * 0.5);
            }
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 1.5,  // Larger base size
            vertexColors: true,
            opacity: 0,
            transparent: true,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: false
        });
        
        const points = new THREE.Points(geometry, material);
        
        // Animate dots appearing
        gsap.to(material, {
            opacity: 0.8,  // More visible
            duration: 2,
            delay: 0.5,
            ease: "power2.inOut"
        });
        
        return points;
    }
    
    createSimpleContinentLines() {
        const group = new THREE.Group();
        const radius = 25.2; // Slightly above globe surface
        
        // Helper function to create a line from coordinate arrays
        const createLine = (coordinates, color = 0xffffff) => {
            const points = [];
            
            coordinates.forEach(coord => {
                const [lat, lon] = coord;
                const phi = (90 - lat) * Math.PI / 180;
                const theta = (lon + 180) * Math.PI / 180;
                
                const x = -radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.cos(phi);
                const z = radius * Math.sin(phi) * Math.sin(theta);
                
                points.push(new THREE.Vector3(x, y, z));
            });
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ 
                color: color,
                opacity: 0.8,
                transparent: true
            });
            
            return new THREE.Line(geometry, material);
        };
        
        // Simplified continent outlines
        // North America
        const northAmerica = [
            [70, -130], [60, -140], [55, -130], [50, -125], [45, -124],
            [40, -124], [35, -120], [30, -115], [25, -110], [25, -97],
            [25, -85], [30, -80], [35, -75], [40, -70], [45, -65],
            [50, -60], [55, -55], [60, -50], [65, -55], [70, -60],
            [73, -80], [75, -90], [73, -110], [70, -130]
        ];
        group.add(createLine(northAmerica, 0x66bb6a)); // Green
        
        // South America
        const southAmerica = [
            [10, -75], [5, -78], [0, -80], [-5, -81], [-10, -78],
            [-15, -76], [-20, -72], [-25, -71], [-30, -71], [-35, -72],
            [-40, -73], [-45, -74], [-50, -73], [-54, -70], [-55, -67],
            [-54, -64], [-50, -60], [-45, -58], [-40, -60], [-35, -56],
            [-30, -50], [-25, -45], [-20, -40], [-15, -38], [-10, -35],
            [-5, -35], [0, -40], [5, -50], [8, -60], [10, -65], [10, -75]
        ];
        group.add(createLine(southAmerica, 0xffa726)); // Orange
        
        // Africa
        const africa = [
            [37, 10], [35, 25], [32, 32], [30, 34], [25, 35],
            [20, 37], [15, 40], [10, 42], [5, 42], [0, 42],
            [-5, 40], [-10, 40], [-15, 38], [-20, 35], [-25, 35],
            [-30, 30], [-33, 26], [-34, 20], [-34, 18], [-30, 15],
            [-25, 12], [-20, 10], [-15, 8], [-10, 5], [-5, 2],
            [0, 0], [5, -5], [10, -10], [15, -15], [20, -17],
            [25, -15], [30, -10], [35, -5], [37, 0], [37, 10]
        ];
        group.add(createLine(africa, 0xef5350)); // Red
        
        // Europe
        const europe = [
            [70, 30], [68, 40], [65, 45], [60, 50], [55, 40],
            [50, 35], [45, 30], [40, 25], [38, 20], [36, 15],
            [35, 10], [36, 5], [38, 0], [40, -5], [43, -8],
            [45, -10], [48, -5], [50, -2], [52, 0], [54, 5],
            [56, 10], [58, 15], [60, 20], [65, 25], [70, 30]
        ];
        group.add(createLine(europe, 0x42a5f5)); // Blue
        
        // Asia (eastern part)
        const asia = [
            [70, 130], [65, 140], [60, 145], [55, 140], [50, 135],
            [45, 130], [40, 125], [35, 120], [30, 115], [25, 110],
            [20, 105], [15, 100], [10, 95], [5, 95], [0, 98],
            [5, 102], [10, 105], [15, 108], [20, 110], [25, 115],
            [30, 120], [35, 125], [40, 130], [45, 135], [50, 140],
            [55, 145], [60, 150], [65, 155], [70, 160], [70, 130]
        ];
        group.add(createLine(asia, 0xab47bc)); // Purple
        
        // Australia
        const australia = [
            [-10, 142], [-12, 145], [-15, 148], [-18, 150], [-22, 153],
            [-25, 153], [-28, 153], [-32, 152], [-35, 150], [-37, 147],
            [-38, 143], [-38, 140], [-37, 136], [-35, 133], [-32, 128],
            [-28, 123], [-25, 120], [-22, 118], [-18, 118], [-15, 120],
            [-12, 125], [-10, 130], [-10, 135], [-10, 140], [-10, 142]
        ];
        group.add(createLine(australia, 0xffee58)); // Yellow
        
        // Animate all lines appearing
        group.children.forEach((line, index) => {
            line.material.opacity = 0;
            gsap.to(line.material, {
                opacity: 0.8,
                duration: 1.5,
                delay: 0.8 + index * 0.2,
                ease: "power2.inOut"
            });
        });
        
        return group;
    }
    
    createContinentLines() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const radius = 25.2; // Slightly larger than globe
        
        // Helper to add line segments
        const addLineSegment = (lat1, lon1, lat2, lon2) => {
            const p1 = this.latLonToVector3(lat1, lon1, radius);
            const p2 = this.latLonToVector3(lat2, lon2, radius);
            vertices.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
        };
        
        // Draw continent outlines as connected lines
        const continents = {
            // Simplified North America outline
            northAmerica: [
                [48, -125], [40, -124], [32, -117], [25, -97], [25, -80],
                [30, -82], [35, -76], [40, -74], [45, -68], [50, -60],
                [55, -58], [60, -65], [65, -75], [70, -85], [68, -125], [60, -140], [55, -130], [48, -125]
            ],
            // Simplified Europe
            europe: [
                [36, -9], [40, -10], [45, -5], [50, -4], [54, 0],
                [58, 10], [65, 20], [70, 30], [65, 40], [55, 35],
                [45, 28], [40, 20], [36, 10], [36, -9]
            ],
            // Simplified Africa
            africa: [
                [37, -6], [30, 25], [20, 37], [0, 42], [-25, 35],
                [-34, 18], [-20, 12], [0, 9], [10, -15], [25, -15], [37, -6]
            ],
            // Simplified Asia
            asia: [
                [30, 50], [50, 60], [70, 130], [60, 135], [40, 120],
                [20, 110], [5, 100], [20, 80], [30, 60], [30, 50]
            ],
            // Simplified South America
            southAmerica: [
                [10, -75], [0, -80], [-20, -70], [-40, -73], [-55, -68],
                [-40, -62], [-20, -40], [0, -50], [10, -65], [10, -75]
            ],
            // Simplified Australia
            australia: [
                [-10, 142], [-20, 148], [-38, 147], [-35, 137], [-25, 123],
                [-15, 123], [-10, 135], [-10, 142]
            ]
        };
        
        // Draw each continent
        Object.values(continents).forEach(coords => {
            for (let i = 0; i < coords.length - 1; i++) {
                addLineSegment(coords[i][0], coords[i][1], coords[i+1][0], coords[i+1][1]);
            }
        });
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        
        const material = new THREE.LineBasicMaterial({
            color: 0x4fc3f7,
            opacity: 0.6,
            transparent: true,
            linewidth: 2,
            blending: THREE.AdditiveBlending
        });
        
        const lines = new THREE.LineSegments(geometry, material);
        
        // Animate appearance
        material.opacity = 0;
        gsap.to(material, {
            opacity: 0.6,
            duration: 2,
            delay: 0.5,
            ease: "power2.inOut"
        });
        
        return lines;
    }
    
    createCityPoints() {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];
        const radius = 25.3;
        
        // Major city locations [lat, lon]
        const cities = [
            [40.7, -74],    // New York
            [51.5, -0.1],   // London
            [35.7, 139.7],  // Tokyo
            [48.9, 2.3],    // Paris
            [-33.9, 151.2], // Sydney
            [-23.5, -46.6], // São Paulo
            [55.8, 37.6],   // Moscow
            [39.9, 116.4],  // Beijing
            [19.4, -99.1],  // Mexico City
            [28.6, 77.2],   // Delhi
            [-34.6, -58.4], // Buenos Aires
            [30.0, 31.2],   // Cairo
            [1.3, 103.8],   // Singapore
            [25.3, 55.3],   // Dubai
            [37.8, -122.4], // San Francisco
        ];
        
        cities.forEach((city) => {
            const point = this.latLonToVector3(city[0], city[1], radius);
            positions.push(point.x, point.y, point.z);
            
            // Warm white/yellow color for cities
            colors.push(1.0, 0.9, 0.7);
            sizes.push(3.0);
        });
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            opacity: 0,
            transparent: true,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: false
        });
        
        const points = new THREE.Points(geometry, material);
        
        // Animate city points appearing
        gsap.to(material, {
            opacity: 0.8,
            duration: 2,
            delay: 1,
            ease: "power2.inOut"
        });
        
        return points;
    }
    
    generateContinentPointsArray() {
        // Same as generateContinentPoints but returns raw array
        const points = [];
        const radius = 25.1;
        
        // North America
        for (let i = 0; i < 200; i++) {
            const lat = 30 + Math.random() * 40;
            const lon = -120 + Math.random() * 60;
            const point = this.latLonToVector3(lat, lon, radius);
            points.push(point.x, point.y, point.z);
        }
        
        // Europe
        for (let i = 0; i < 150; i++) {
            const lat = 35 + Math.random() * 35;
            const lon = -10 + Math.random() * 50;
            const point = this.latLonToVector3(lat, lon, radius);
            points.push(point.x, point.y, point.z);
        }
        
        // Asia
        for (let i = 0; i < 300; i++) {
            const lat = -10 + Math.random() * 70;
            const lon = 40 + Math.random() * 100;
            const point = this.latLonToVector3(lat, lon, radius);
            points.push(point.x, point.y, point.z);
        }
        
        // Africa
        for (let i = 0; i < 250; i++) {
            const lat = -35 + Math.random() * 70;
            const lon = -20 + Math.random() * 60;
            const point = this.latLonToVector3(lat, lon, radius);
            points.push(point.x, point.y, point.z);
        }
        
        // South America
        for (let i = 0; i < 150; i++) {
            const lat = -55 + Math.random() * 70;
            const lon = -80 + Math.random() * 40;
            const point = this.latLonToVector3(lat, lon, radius);
            points.push(point.x, point.y, point.z);
        }
        
        // Australia
        for (let i = 0; i < 100; i++) {
            const lat = -40 + Math.random() * 30;
            const lon = 110 + Math.random() * 40;
            const point = this.latLonToVector3(lat, lon, radius);
            points.push(point.x, point.y, point.z);
        }
        
        return points;
    }
    
    generateContinentPoints() {
        const points = [];
        const radius = 25.1; // Slightly larger than globe
        
        // Helper function to add a line of points between two lat/lon coordinates
        const addLine = (lat1, lon1, lat2, lon2, numPoints) => {
            for (let i = 0; i <= numPoints; i++) {
                const t = i / numPoints;
                const lat = lat1 + (lat2 - lat1) * t;
                const lon = lon1 + (lon2 - lon1) * t;
                const point = this.latLonToVector3(lat, lon, radius);
                points.push(point.x, point.y, point.z);
            }
        };
        
        // Helper function to add a curved coastline
        const addCoastline = (coords, numPointsPerSegment = 20) => {
            for (let i = 0; i < coords.length - 1; i++) {
                addLine(coords[i][0], coords[i][1], coords[i+1][0], coords[i+1][1], numPointsPerSegment);
            }
        };
        
        // North America outline
        const northAmerica = [
            [70, -170], [65, -165], [58, -158], [55, -130], [48, -125], // Alaska to Pacific Northwest
            [40, -124], [32, -117], [24, -106], [20, -97], [25, -80], // West Coast to Florida
            [30, -82], [35, -76], [40, -74], [45, -68], [47, -65], // East Coast
            [50, -60], [55, -58], [60, -65], [65, -75], [70, -85], // Canada East
            [73, -95], [70, -110], [68, -140], [70, -170] // Arctic
        ];
        addCoastline(northAmerica);
        
        // South America outline
        const southAmerica = [
            [12, -72], [10, -75], [5, -78], [0, -80], [-5, -81], // North coast
            [-15, -76], [-20, -70], [-30, -71], [-40, -73], [-45, -74], // Pacific coast
            [-52, -74], [-55, -68], [-52, -65], [-48, -60], [-40, -62], // Southern tip
            [-35, -58], [-30, -52], [-25, -48], [-20, -40], [-10, -35], // Atlantic coast
            [-5, -35], [0, -50], [5, -55], [8, -60], [10, -65], [12, -72] // North coast back
        ];
        addCoastline(southAmerica);
        
        // Africa outline
        const africa = [
            [37, -6], [36, 0], [33, 10], [30, 25], [31, 34], // Mediterranean coast
            [27, 35], [25, 35], [20, 37], [12, 43], [0, 42], // Red Sea coast
            [-10, 40], [-25, 35], [-34, 25], [-34, 18], [-30, 17], // East coast
            [-25, 15], [-20, 12], [-15, 10], [-10, 8], [-5, 5], // South coast
            [0, 9], [5, 10], [8, 4], [5, -5], [0, -10], // West Africa
            [5, -10], [10, -15], [15, -17], [20, -17], [25, -15], // Northwest
            [30, -10], [35, -5], [37, -6] // Back to Mediterranean
        ];
        addCoastline(africa);
        
        // Europe outline (simplified)
        const europe = [
            [36, -9], [38, -9], [40, -10], [43, -9], [45, -5], // Iberian Peninsula
            [48, -5], [50, -4], [52, -4], [54, 0], [57, 5], // France to North Sea
            [58, 10], [60, 10], [62, 15], [65, 20], [68, 25], // Scandinavia
            [70, 30], [68, 35], [65, 40], [60, 35], [55, 35], // Northern Russia
            [50, 30], [45, 28], [42, 25], [40, 20], [38, 15], // Eastern Europe
            [37, 12], [36, 10], [35, 5], [36, 0], [36, -9] // Mediterranean
        ];
        addCoastline(europe);
        
        // Asia outline (simplified - just key features)
        const asia = [
            [30, 50], [35, 48], [40, 50], [45, 55], [50, 60], // Middle East to Central Asia
            [55, 70], [60, 90], [65, 110], [70, 130], [65, 140], // Siberia
            [60, 135], [55, 130], [50, 125], [45, 120], [40, 120], // East coast
            [35, 125], [30, 122], [25, 120], [20, 110], [15, 105], // China coast
            [10, 105], [5, 100], [0, 100], [5, 95], [10, 90], // Southeast Asia
            [15, 85], [20, 80], [25, 70], [30, 60], [30, 50] // India back to Middle East
        ];
        addCoastline(asia);
        
        // Australia outline
        const australia = [
            [-10, 142], [-12, 143], [-15, 145], [-20, 148], [-25, 153], // Northeast
            [-30, 153], [-35, 151], [-38, 147], [-38, 142], [-35, 137], // East to South
            [-32, 132], [-30, 128], [-25, 123], [-20, 119], [-15, 123], // South to West
            [-12, 130], [-10, 135], [-10, 142] // North back to start
        ];
        addCoastline(australia);
        
        return new Float32Array(points);
    }
    
    latLonToVector3(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        return new THREE.Vector3(x, y, z);
    }
    
    createMapPositions() {
        // Create a simplified world map with key locations
        const mapPoints = [];
        
        // Add continents outline (simplified)
        // North America
        for (let i = 0; i < 150; i++) {
            const angle = (i / 150) * Math.PI * 0.5;
            mapPoints.push(new THREE.Vector3(
                -35 + Math.cos(angle) * 10,
                15 + Math.sin(angle) * 8,
                0
            ));
        }
        
        // Europe
        for (let i = 0; i < 100; i++) {
            const angle = (i / 100) * Math.PI * 0.7;
            mapPoints.push(new THREE.Vector3(
                5 + Math.cos(angle) * 6,
                18 + Math.sin(angle) * 5,
                0
            ));
        }
        
        // Asia
        for (let i = 0; i < 200; i++) {
            const angle = (i / 200) * Math.PI * 0.8;
            mapPoints.push(new THREE.Vector3(
                25 + Math.cos(angle) * 15,
                10 + Math.sin(angle) * 10,
                0
            ));
        }
        
        // Africa
        for (let i = 0; i < 120; i++) {
            const angle = (i / 120) * Math.PI;
            mapPoints.push(new THREE.Vector3(
                5 + Math.cos(angle) * 8,
                -5 - Math.sin(angle) * 12,
                0
            ));
        }
        
        // South America
        for (let i = 0; i < 100; i++) {
            const angle = (i / 100) * Math.PI * 0.6;
            mapPoints.push(new THREE.Vector3(
                -25 + Math.cos(angle) * 5,
                -15 - Math.sin(angle) * 10,
                0
            ));
        }
        
        // Australia
        for (let i = 0; i < 80; i++) {
            const angle = (i / 80) * Math.PI * 2;
            mapPoints.push(new THREE.Vector3(
                35 + Math.cos(angle) * 4,
                -20 + Math.sin(angle) * 3,
                0
            ));
        }
        
        // Add some scattered points for islands and detail
        for (let i = 0; i < 200; i++) {
            mapPoints.push(new THREE.Vector3(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 5
            ));
        }
        
        // Shuffle for better distribution
        for (let i = mapPoints.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [mapPoints[i], mapPoints[j]] = [mapPoints[j], mapPoints[i]];
        }
        
        this.mapPositions = mapPoints;
    }
    
    transformToText() {
        if (this.isTextFormed) return;
        this.isTextFormed = true;
        
        const positions = this.particleSystem.geometry.attributes.position.array;
        const colors = this.particleSystem.geometry.attributes.color.array;
        const sizes = this.particleSystem.geometry.attributes.size.array;
        
        const availableParticles = Math.min(this.textParticles.length, this.particleCount);
        
        // Create a timeline for smoother animation
        const tl = gsap.timeline({
            onUpdate: () => {
                this.particleSystem.geometry.attributes.position.needsUpdate = true;
                this.particleSystem.geometry.attributes.color.needsUpdate = true;
                this.particleSystem.geometry.attributes.size.needsUpdate = true;
            }
        });
        
        // Animate particles that form the text
        for (let i = 0; i < availableParticles; i++) {
            const i3 = i * 3;
            const target = this.textParticles[i];
            const delay = i * 0.001; // Stagger effect
            
            tl.to(positions, {
                duration: 3,
                ease: "power3.inOut",
                [i3]: target.x,
                [i3 + 1]: target.y,
                [i3 + 2]: target.z,
            }, delay);
            
            // Keep original colors during transition
            // No color change needed - particles retain their random colors
            
            // Make text particles slightly larger
            tl.to(sizes, {
                duration: 2,
                ease: "power2.inOut",
                [i]: sizes[i] * 1.5,
            }, delay);
        }
        
        // Animate excess particles
        for (let i = availableParticles; i < this.particleCount; i++) {
            const i3 = i * 3;
            const angle = (i / this.particleCount) * Math.PI * 2;
            const radius = 100 + Math.random() * 50;
            
            tl.to(positions, {
                duration: 3,
                ease: "power2.inOut",
                [i3]: Math.cos(angle) * radius,
                [i3 + 1]: Math.sin(angle) * radius,
                [i3 + 2]: -50 - Math.random() * 50,
            }, 0);
            
            // Fade out excess particles
            tl.to(colors, {
                duration: 3,
                ease: "power2.inOut",
                [i3]: 0.1,
                [i3 + 1]: 0.1,
                [i3 + 2]: 0.2,
            }, 0);
            
            tl.to(sizes, {
                duration: 3,
                ease: "power2.inOut",
                [i]: sizes[i] * 0.5,
            }, 0);
        }
    }
    
    transformToMap() {
        if (this.isMapFormed) return;
        this.isMapFormed = true;
        
        // Create map positions if not already created
        if (this.mapPositions.length === 0) {
            this.createMapPositions();
        }
        
        const positions = this.particleSystem.geometry.attributes.position.array;
        const colors = this.particleSystem.geometry.attributes.color.array;
        const sizes = this.particleSystem.geometry.attributes.size.array;
        
        const availableParticles = Math.min(this.mapPositions.length, this.particleCount);
        
        const tl = gsap.timeline({
            onUpdate: () => {
                this.particleSystem.geometry.attributes.position.needsUpdate = true;
                this.particleSystem.geometry.attributes.color.needsUpdate = true;
                this.particleSystem.geometry.attributes.size.needsUpdate = true;
            }
        });
        
        // First, make particles spread out from text
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const currentX = positions[i3];
            const currentY = positions[i3 + 1];
            
            // Create an outward burst effect
            const angle = Math.random() * Math.PI * 2;
            const distance = 5 + Math.random() * 10;
            
            tl.to(positions, {
                duration: 0.8,
                ease: "power2.out",
                [i3]: currentX + Math.cos(angle) * distance,
                [i3 + 1]: currentY + Math.sin(angle) * distance,
                [i3 + 2]: (Math.random() - 0.5) * 10,
            }, 0);
        }
        
        // Then animate particles to map positions
        for (let i = 0; i < availableParticles; i++) {
            const i3 = i * 3;
            const target = this.mapPositions[i];
            const delay = 0.8 + (i * 0.001); // Start after spread animation
            
            // Create curved path to target
            tl.to(positions, {
                duration: 2,
                ease: "power2.inOut",
                [i3]: target.x,
                [i3 + 1]: target.y,
                [i3 + 2]: target.z,
            }, delay);
            
            // Change colors to represent different regions
            const regionColor = this.getRegionColor(target);
            tl.to(colors, {
                duration: 1.5,
                ease: "power2.inOut",
                [i3]: regionColor.r,
                [i3 + 1]: regionColor.g,
                [i3 + 2]: regionColor.b,
            }, delay);
            
            // Pulse effect when reaching destination
            tl.to(sizes, {
                duration: 0.5,
                ease: "power2.out",
                [i]: 3.0,
            }, delay + 1.5)
            .to(sizes, {
                duration: 0.5,
                ease: "power2.in",
                [i]: 2.0,
            }, delay + 2.0);
        }
        
        // Hide excess particles
        for (let i = availableParticles; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            tl.to(positions, {
                duration: 2,
                ease: "power2.inOut",
                [i3]: 0,
                [i3 + 1]: -100,
                [i3 + 2]: 0,
            }, 0);
            
            tl.to(sizes, {
                duration: 2,
                ease: "power2.inOut",
                [i]: 0,
            }, 0);
        }
    }
    
    getRegionColor(position) {
        // Color based on rough geographic regions
        if (position.x < -20) {
            // Americas - Blue
            return new THREE.Color(0.2, 0.5, 1.0);
        } else if (position.x > 20) {
            // Asia/Australia - Orange
            return new THREE.Color(1.0, 0.6, 0.2);
        } else if (position.y > 10) {
            // Europe - Green
            return new THREE.Color(0.2, 0.8, 0.4);
        } else {
            // Africa - Yellow
            return new THREE.Color(1.0, 0.8, 0.2);
        }
    }
    
    applySimpleMouseForce() {
        const positions = this.particleSystem.geometry.attributes.position.array;
        const velocities = this.particleSystem.geometry.attributes.velocity.array;
        const sizes = this.particleSystem.geometry.attributes.size.array;
        
        // Convert mouse position to world coordinates - match particle bounds
        const mousePos3D = new THREE.Vector3(this.mouse.x * 50, this.mouse.y * 50, 0);
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const particlePos = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
            const distance = particlePos.distanceTo(mousePos3D);
            
            if (distance < 20 && distance > 0.1) {
                // Fluid repulsion with smooth falloff
                const force = particlePos.clone().sub(mousePos3D).normalize();
                // Scale force inversely with particle size - smaller particles move more
                const sizeScale = 1.0 / (sizes[i] * 0.5);
                // Consistent force application
                const strength = Math.exp(-distance * 0.08) * 1.0 * sizeScale;
                
                velocities[i3] += force.x * strength;
                velocities[i3 + 1] += force.y * strength;
                velocities[i3 + 2] += force.z * strength * 0.5;
            }
        }
        
        this.particleSystem.geometry.attributes.velocity.needsUpdate = true;
    }
    
    updateParticlesWithFluid() {
        const positions = this.particleSystem.geometry.attributes.position.array;
        const velocities = this.particleSystem.geometry.attributes.velocity.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Get particle position
            const x = positions[i3];
            const y = positions[i3 + 1];
            
            // Convert to grid coordinates and sample fluid velocity
            const gridPos = this.fluidSim.worldToGrid(x, y);
            const fluidVel = this.fluidSim.sampleVelocity(gridPos.x, gridPos.y);
            
            // Blend fluid velocity with particle velocity
            const blendFactor = 0.02; // Much lower influence
            velocities[i3] += fluidVel.x * blendFactor;
            velocities[i3 + 1] += fluidVel.y * blendFactor;
        }
        
        this.particleSystem.geometry.attributes.velocity.needsUpdate = true;
    }
    
    updateParticles() {
        if (this.isTextFormed || this.isPinned || this.isSpaceFormed) return;
        
        // Only use fluid simulation if enabled
        if (this.useFluidSimulation) {
            // Step fluid simulation
            this.fluidSim.step();
            
            // Update particles with fluid velocities
            this.updateParticlesWithFluid();
        }
        
        const positions = this.particleSystem.geometry.attributes.position.array;
        const velocities = this.particleSystem.geometry.attributes.velocity.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            positions[i3] += velocities[i3];
            positions[i3 + 1] += velocities[i3 + 1];
            positions[i3 + 2] += velocities[i3 + 2];
            
            // Dynamic damping - less damping for slow particles to maintain responsiveness
            const currentSpeed = Math.sqrt(velocities[i3] * velocities[i3] + velocities[i3 + 1] * velocities[i3 + 1]);
            const dampingFactor = currentSpeed > 0.5 ? 0.92 : 0.96;
            velocities[i3] *= dampingFactor;
            velocities[i3 + 1] *= dampingFactor;
            velocities[i3 + 2] *= dampingFactor;
            
            // Only add random motion if particle is moving (to prevent shaking when idle)
            const speed = Math.sqrt(velocities[i3] * velocities[i3] + velocities[i3 + 1] * velocities[i3 + 1]);
            if (speed > 0.01) {
                velocities[i3] += (Math.random() - 0.5) * 0.001;
                velocities[i3 + 1] += (Math.random() - 0.5) * 0.001;
                velocities[i3 + 2] += (Math.random() - 0.5) * 0.001;
            }
            
            // Radial constraint for organic shape
            const distFromCenter = Math.sqrt(positions[i3] * positions[i3] + positions[i3 + 1] * positions[i3 + 1]);
            if (distFromCenter > 60) {
                // Gentle radial force pulling particles back
                const radialForce = (distFromCenter - 60) * 0.00005;
                const angle = Math.atan2(positions[i3 + 1], positions[i3]);
                velocities[i3] -= Math.cos(angle) * radialForce;
                velocities[i3 + 1] -= Math.sin(angle) * radialForce;
            }
            
            // Z-axis only gentle constraint
            if (Math.abs(positions[i3 + 2]) > 30) {
                velocities[i3 + 2] -= positions[i3 + 2] * 0.0001;
            }
        }
        
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.velocity.needsUpdate = true;
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        this.time += this.clock.getDelta();
        this.updateParticles();
        
        // Update shader uniforms
        if (this.particleSystem.material.uniforms) {
            this.particleSystem.material.uniforms.time.value = this.time;
        }
        
        // Only rotate particle system if not in space mode
        if (!this.isSpaceFormed) {
            this.particleSystem.rotation.y = Math.sin(this.time * 0.1) * 0.1;
        }
        // Stars should remain stationary - no rotation when in space mode
        
        // Only rotate the globe, not the star field
        if (this.globeGroup) {
            // Apply rotation velocity with smoothing
            this.globeGroup.rotation.y += this.globeRotationVelocity.y;
            this.globeGroup.rotation.x += this.globeRotationVelocity.x;
            
            // Clamp X rotation to prevent flipping (limit to 60 degrees up/down)
            this.globeGroup.rotation.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, this.globeGroup.rotation.x));
            
            // Apply smoother damping to slow down rotation over time
            this.globeRotationVelocity.x *= 0.98;  // Slower deceleration
            this.globeRotationVelocity.y *= 0.98;
            
            // Limit maximum velocity for smoother motion
            this.globeRotationVelocity.x = Math.max(-0.02, Math.min(0.02, this.globeRotationVelocity.x));
            this.globeRotationVelocity.y = Math.max(-0.02, Math.min(0.02, this.globeRotationVelocity.y));
            
            // If velocity is very small, set a minimum rotation to keep globe moving
            if (Math.abs(this.globeRotationVelocity.y) < 0.0005) {
                this.globeRotationVelocity.y = 0.001; // Slower default rotation
            }
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    destroy() {
        window.removeEventListener('resize', this.onWindowResize.bind(this));
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
        window.removeEventListener('click', this.onMouseClick.bind(this));
        window.removeEventListener('touchstart', this.onTouchStart.bind(this));
        window.removeEventListener('scroll', this.onWindowScroll.bind(this));
        
        this.particleSystem.geometry.dispose();
        this.particleSystem.material.dispose();
        this.renderer.dispose();
        
        if (this.container.contains(this.renderer.domElement)) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}