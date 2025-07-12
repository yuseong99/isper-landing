import * as THREE from 'three';

const GlobeShader = {
  uniforms: {
    time: { value: 0 },
    earthTexture: { value: null },
    nightTexture: { value: null }
  },
  
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  fragmentShader: `
    uniform float time;
    uniform sampler2D earthTexture;
    uniform sampler2D nightTexture;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
      
      vec3 baseColor = vec3(0.05, 0.15, 0.3);
      vec3 landColor = vec3(0.1, 0.3, 0.2);
      
      float continents = step(0.3, sin(vUv.x * 20.0) * sin(vUv.y * 10.0));
      vec3 earthColor = mix(baseColor, landColor, continents);
      
      float grid = step(0.98, max(sin(vUv.x * 50.0), sin(vUv.y * 50.0)));
      earthColor = mix(earthColor, vec3(0.3, 0.8, 1.0), grid * 0.5);
      
      vec3 atmosphereColor = vec3(0.3, 0.7, 1.0);
      vec3 finalColor = mix(earthColor, atmosphereColor, fresnel * 0.5);
      
      float glow = fresnel * 0.8;
      finalColor += glow * vec3(0.3, 0.7, 1.0);
      
      float pulse = sin(time * 2.0) * 0.1 + 0.9;
      finalColor *= pulse;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

export default GlobeShader;