import { ParticleSystem } from './scenes/ParticleSystem.js';

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    const loading = document.querySelector('.loading');
    
    const particleSystem = new ParticleSystem(container);
    
    setTimeout(() => {
        loading.classList.add('hidden');
    }, 1000);
});