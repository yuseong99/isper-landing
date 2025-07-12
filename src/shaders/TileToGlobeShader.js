import * as THREE from 'three';

const TileToGlobeShader = {
  uniforms: {
    time: { value: 0 },
    resolution: { value: new THREE.Vector2() },
    globeTexture: { value: null },
    transitionProgress: { value: 0 }
  },
  
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    uniform float time;
    uniform float transitionProgress;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      vec3 pos = position;
      
      float noise = sin(position.x * 5.0 + time) * cos(position.y * 5.0 + time * 0.8) * 0.02;
      pos += normal * noise * (1.0 - transitionProgress);
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  
  fragmentShader: `
    uniform float time;
    uniform float transitionProgress;
    uniform sampler2D globeTexture;
    uniform vec2 resolution;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    vec3 palette(float t) {
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.263, 0.416, 0.557);
      
      return a + b * cos(6.28318 * (c * t + d));
    }
    
    void main() {
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
      
      vec3 baseColor = vec3(0.31, 0.765, 0.969);
      
      float pattern = sin(vUv.x * 20.0 + time * 2.0) * sin(vUv.y * 20.0 + time * 1.5);
      pattern = smoothstep(0.0, 0.1, pattern);
      
      vec3 color = mix(baseColor * 0.8, baseColor * 1.2, pattern);
      
      color += fresnel * vec3(0.4, 0.8, 1.0) * 0.5;
      
      float glow = fresnel * 0.3;
      color += glow * vec3(0.31, 0.765, 0.969);
      
      float alpha = 0.9 + fresnel * 0.1;
      
      gl_FragColor = vec4(color, alpha);
    }
  `
};

export default TileToGlobeShader;