# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Three.js WebGL landing page for Isper, a tool for extracting locations from videos. The project uses vanilla JavaScript with ES6 modules and is built with Vite.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (opens at http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

The application follows a scene-based architecture with scroll-driven animations:

- **src/main.js**: Entry point, initializes the App
- **src/App.js**: Main application class that manages scenes and scroll behavior
- **src/scenes/**: Contains Three.js scene modules
  - `HeroScene.js`: Landing hero section with globe visualization
  - `FeatureTunnel.js`: Feature showcase with tunnel effect
  - `DemoSection.js`: Interactive demo section
- **src/pages/**: Contains page-specific modules
  - `Maps/index.js`: Interactive map page with procedural terrain generation
  - `Maps/MapControls.js`: Custom camera controls for map interaction
  - `Maps/TerrainShader.js`: WebGL shaders for terrain visualization
- **src/shaders/**: Custom WebGL shaders for visual effects
- **src/utils/**: Utility modules for controls and performance

## Key Development Notes

1. **Scroll-based Animations**: The app uses GSAP ScrollTrigger extensively. When modifying animations, ensure proper cleanup in `destroy()` methods.

2. **Performance Considerations**: 
   - Separate rendering paths for mobile vs desktop (check `isMobile` flags)
   - Performance monitoring utility in `src/utils/performance.js`
   - Scenes are initialized but not all are rendered based on device capabilities

3. **Three.js Scene Management**: Each scene extends a base pattern with `init()`, `update()`, and `destroy()` methods.

4. **Asset Loading**: Currently no centralized asset management system. Assets are loaded directly in scenes.

5. **No Testing Infrastructure**: The project currently has no test suite. Consider adding tests before major refactoring.

## Common Tasks

### Adding a New Scene
1. Create a new file in `src/scenes/`
2. Follow the pattern of existing scenes (init, update, destroy methods)
3. Import and initialize in `src/App.js`
4. Add corresponding HTML section in `index.html`

### Modifying Shaders
Shaders are in `src/shaders/`. They export vertex and fragment shader strings used by Three.js materials.

### Debugging Performance
Use the performance utility to monitor FPS and identify bottlenecks:
```javascript
import { performanceMonitor } from './utils/performance.js';
performanceMonitor.startMonitoring();
```

## Build Configuration

The project uses Vite with the following key settings:
- Development port: 3000
- Build output: `dist/`
- Source maps enabled in production
- No code splitting configured

## Pages Structure

The application includes several pages beyond the landing page:

### Company Page (`/company`)
- Mission statement and company values
- Leadership team section
- Company values showcase (Accuracy, Privacy, Innovation)
- Contact call-to-action

### Contact Page (`/contact`)
- Contact form with validation and reCAPTCHA
- Multiple contact emails (general, sales, support, press)
- Office locations (San Francisco, London)
- Social media links
- Form submission via Formspree

### Isper Page (`/isper`)
- Product landing with hero section
- Typewriter animation ("Copy, Paste... GO!")
- App store download buttons (iOS/Android)
- Product branding elements

### Maps Page (`/maps`)
- **Interactive 3D Visualization**: Procedural terrain with Perlin noise
- **Product Info**: AI-powered trip planner description
- **Feature Cards**: 6 "How it works" sections
- **Technical Implementation**:
  - Custom terrain shader with elevation-based coloring
  - OrbitControls-based camera system
  - 200x200 grid terrain generation
  - Performance optimized for 60fps

### News Page (`/news`)
- News articles listing
- Category filtering (All, Product, Funding, Partnership)
- Newsletter subscription form
- Article metadata (date, category, read time)

## Recent Updates

### Page System Implementation
- Created modular page system with consistent structure
- Each page follows class-based pattern with `render()`, `addStyles()`, and `destroy()` methods
- Integrated Navigation component across all pages
- Consistent fade-in animations and dark theme styling

### Maps 3D Visualization
- Implemented procedural terrain generation using Perlin noise
- Custom camera controls with pan, zoom, and rotation
- Terrain shader with elevation-based coloring (beaches, grass, mountains, snow)
- Responsive design with mobile touch support