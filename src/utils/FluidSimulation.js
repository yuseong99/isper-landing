export class FluidSimulation {
    constructor(width = 64, height = 64) {
        this.gridWidth = width;
        this.gridHeight = height;
        this.cellSize = 1.0;
        
        // Velocity field (staggered grid)
        this.velocityX = new Float32Array((width + 1) * height);
        this.velocityY = new Float32Array(width * (height + 1));
        
        // Temporary arrays for simulation
        this.divergence = new Float32Array(width * height);
        this.pressure = new Float32Array(width * height);
        
        // Parameters
        this.viscosity = 0.1; // Increased viscosity for less spinning
        this.dt = 0.016; // 60 FPS
        this.iterations = 10; // Reduced iterations for performance
    }
    
    // Convert world position to grid coordinates
    worldToGrid(x, y) {
        return {
            x: (x + 50) / 100 * this.gridWidth,
            y: (y + 50) / 100 * this.gridHeight
        };
    }
    
    // Convert grid coordinates to world position
    gridToWorld(x, y) {
        return {
            x: (x / this.gridWidth) * 100 - 50,
            y: (y / this.gridHeight) * 100 - 50
        };
    }
    
    // Sample velocity at arbitrary position using bilinear interpolation
    sampleVelocity(x, y) {
        // Sample U component (horizontal velocity)
        const u = this.interpolate(x - 0.5, y, this.velocityX, this.gridWidth + 1, this.gridHeight);
        
        // Sample V component (vertical velocity)
        const v = this.interpolate(x, y - 0.5, this.velocityY, this.gridWidth, this.gridHeight + 1);
        
        return { x: u, y: v };
    }
    
    // Bilinear interpolation
    interpolate(x, y, field, width, height) {
        x = Math.max(0, Math.min(width - 1.001, x));
        y = Math.max(0, Math.min(height - 1.001, y));
        
        const x0 = Math.floor(x);
        const y0 = Math.floor(y);
        const x1 = x0 + 1;
        const y1 = y0 + 1;
        
        const sx = x - x0;
        const sy = y - y0;
        
        const idx00 = y0 * width + x0;
        const idx10 = y0 * width + x1;
        const idx01 = y1 * width + x0;
        const idx11 = y1 * width + x1;
        
        return (1 - sx) * (1 - sy) * field[idx00] +
               sx * (1 - sy) * field[idx10] +
               (1 - sx) * sy * field[idx01] +
               sx * sy * field[idx11];
    }
    
    // Add force at position (like mouse interaction)
    addForce(x, y, forceX, forceY, radius = 5) {
        const gridPos = this.worldToGrid(x, y);
        
        // Add to velocity field
        for (let j = 0; j < this.gridHeight; j++) {
            for (let i = 0; i < this.gridWidth; i++) {
                const dx = i - gridPos.x;
                const dy = j - gridPos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < radius) {
                    const factor = 1 - dist / radius;
                    const smoothFactor = factor * factor;
                    
                    // Add to U component
                    if (i < this.gridWidth) {
                        const idxU = j * (this.gridWidth + 1) + i;
                        this.velocityX[idxU] += forceX * smoothFactor;
                    }
                    
                    // Add to V component
                    if (j < this.gridHeight) {
                        const idxV = j * this.gridWidth + i;
                        this.velocityY[idxV] += forceY * smoothFactor;
                    }
                }
            }
        }
    }
    
    // Calculate divergence of velocity field
    calculateDivergence() {
        const scale = 1.0 / this.cellSize;
        
        for (let j = 0; j < this.gridHeight; j++) {
            for (let i = 0; i < this.gridWidth; i++) {
                const idx = j * this.gridWidth + i;
                
                // Get velocities at cell faces
                const uLeft = this.velocityX[j * (this.gridWidth + 1) + i];
                const uRight = this.velocityX[j * (this.gridWidth + 1) + i + 1];
                const vBottom = this.velocityY[j * this.gridWidth + i];
                const vTop = this.velocityY[(j + 1) * this.gridWidth + i];
                
                this.divergence[idx] = scale * ((uRight - uLeft) + (vTop - vBottom));
            }
        }
    }
    
    // Solve for pressure using Jacobi iteration
    solvePressure() {
        // Clear pressure
        this.pressure.fill(0);
        
        for (let iter = 0; iter < this.iterations; iter++) {
            const newPressure = new Float32Array(this.pressure);
            
            for (let j = 1; j < this.gridHeight - 1; j++) {
                for (let i = 1; i < this.gridWidth - 1; i++) {
                    const idx = j * this.gridWidth + i;
                    
                    const left = this.pressure[idx - 1];
                    const right = this.pressure[idx + 1];
                    const bottom = this.pressure[idx - this.gridWidth];
                    const top = this.pressure[idx + this.gridWidth];
                    
                    newPressure[idx] = (left + right + bottom + top - this.divergence[idx]) * 0.25;
                }
            }
            
            this.pressure = newPressure;
        }
    }
    
    // Subtract pressure gradient from velocity field
    subtractPressureGradient() {
        const scale = 1.0 / this.cellSize;
        
        // Update U component
        for (let j = 0; j < this.gridHeight; j++) {
            for (let i = 1; i < this.gridWidth; i++) {
                const idxU = j * (this.gridWidth + 1) + i;
                const idxP0 = j * this.gridWidth + i - 1;
                const idxP1 = j * this.gridWidth + i;
                
                this.velocityX[idxU] -= scale * (this.pressure[idxP1] - this.pressure[idxP0]);
            }
        }
        
        // Update V component
        for (let j = 1; j < this.gridHeight; j++) {
            for (let i = 0; i < this.gridWidth; i++) {
                const idxV = j * this.gridWidth + i;
                const idxP0 = (j - 1) * this.gridWidth + i;
                const idxP1 = j * this.gridWidth + i;
                
                this.velocityY[idxV] -= scale * (this.pressure[idxP1] - this.pressure[idxP0]);
            }
        }
    }
    
    // Apply boundary conditions
    applyBoundaries() {
        // Zero out velocities at boundaries
        // Left and right walls
        for (let j = 0; j < this.gridHeight; j++) {
            this.velocityX[j * (this.gridWidth + 1)] = 0;
            this.velocityX[j * (this.gridWidth + 1) + this.gridWidth] = 0;
        }
        
        // Top and bottom walls
        for (let i = 0; i < this.gridWidth; i++) {
            this.velocityY[i] = 0;
            this.velocityY[this.gridHeight * this.gridWidth + i] = 0;
        }
    }
    
    // Apply viscosity using simple diffusion
    applyViscosity() {
        if (this.viscosity <= 0) return;
        
        const visc = this.viscosity * this.dt;
        const a = visc / (1 + 4 * visc);
        
        // Simple Jacobi iteration for diffusion
        for (let iter = 0; iter < 5; iter++) {
            const newVelX = new Float32Array(this.velocityX);
            const newVelY = new Float32Array(this.velocityY);
            
            // Diffuse X velocity
            for (let j = 1; j < this.gridHeight - 1; j++) {
                for (let i = 1; i < this.gridWidth; i++) {
                    const idx = j * (this.gridWidth + 1) + i;
                    newVelX[idx] = (this.velocityX[idx] + a * (
                        this.velocityX[idx - 1] + this.velocityX[idx + 1] +
                        this.velocityX[idx - (this.gridWidth + 1)] + 
                        this.velocityX[idx + (this.gridWidth + 1)]
                    )) / (1 + 4 * a);
                }
            }
            
            // Diffuse Y velocity
            for (let j = 1; j < this.gridHeight; j++) {
                for (let i = 1; i < this.gridWidth - 1; i++) {
                    const idx = j * this.gridWidth + i;
                    newVelY[idx] = (this.velocityY[idx] + a * (
                        this.velocityY[idx - 1] + this.velocityY[idx + 1] +
                        this.velocityY[idx - this.gridWidth] + 
                        this.velocityY[idx + this.gridWidth]
                    )) / (1 + 4 * a);
                }
            }
            
            this.velocityX = newVelX;
            this.velocityY = newVelY;
        }
    }
    
    // Main simulation step
    step() {
        // Apply viscosity
        this.applyViscosity();
        
        // Apply boundary conditions
        this.applyBoundaries();
        
        // Make velocity field divergence-free
        this.calculateDivergence();
        this.solvePressure();
        this.subtractPressureGradient();
        
        // Apply boundaries again
        this.applyBoundaries();
        
        // Dissipate velocity over time (stronger dissipation)
        const dissipation = Math.pow(0.95, this.dt);
        for (let i = 0; i < this.velocityX.length; i++) {
            this.velocityX[i] *= dissipation;
        }
        for (let i = 0; i < this.velocityY.length; i++) {
            this.velocityY[i] *= dissipation;
        }
    }
    
    // Clear the velocity field
    clear() {
        this.velocityX.fill(0);
        this.velocityY.fill(0);
        this.divergence.fill(0);
        this.pressure.fill(0);
    }
}