import * as THREE from 'three';

export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < 768;
}

export function setupPerformanceMonitor() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      console.log('Idle time detected, loading additional assets...');
    });
  }
}

export function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function loadTexture(url, onProgress) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (texture) => {
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        resolve(texture);
      },
      (xhr) => {
        if (onProgress) {
          onProgress((xhr.loaded / xhr.total) * 100);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
}

export function createCompressedTexture(canvas, quality = 0.8) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const texture = new THREE.TextureLoader().load(url, () => {
        URL.revokeObjectURL(url);
      });
      resolve(texture);
    }, 'image/jpeg', quality);
  });
}