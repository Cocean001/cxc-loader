/**
 * Fluid Orbit Spinner Loader
 * A smooth, orbiting particles spinner with fluid motion
 */

(function () {
    const CATEGORY = "spinner";
    const NAME = "fluid-orbit"; // This will create a loader with ID "spinner-fluid-orbit"

    /**
     * Create loader DOM element
     * @param {Object} config - Configuration options
     * @returns {HTMLElement} Loader DOM element
     */
    function createLoader(config) {
        // Make sure we have valid config values
        const safeConfig = {
            color: config.color || "blue",
            shade: config.shade || 500,
            speed: config.speed || 1.0,
            size: config.size || "60px",
        };

        const color = CXCLoader.getColor(safeConfig.color, safeConfig.shade);
        const animationDuration = (3.5 / safeConfig.speed).toFixed(2);
        
        // Create color variations
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        // Create container
        const container = document.createElement("div");
        container.className = "cxc-fluid-orbit-spinner";
        container.style.width = safeConfig.size;
        container.style.height = safeConfig.size;
        container.style.position = "relative";
        
        // Create center dot
        const centerDot = document.createElement("div");
        centerDot.className = "cxc-orbit-center";
        centerDot.style.position = "absolute";
        centerDot.style.top = "50%";
        centerDot.style.left = "50%";
        centerDot.style.transform = "translate(-50%, -50%)";
        centerDot.style.width = "20%";
        centerDot.style.height = "20%";
        centerDot.style.borderRadius = "50%";
        centerDot.style.background = color;
        centerDot.style.boxShadow = `0 0 10px ${lighterColor}`;
        centerDot.style.animation = `cxcOrbitPulse ${animationDuration / 2}s ease-in-out infinite alternate`;
        
        container.appendChild(centerDot);
        
        // Create orbiting particles
        const particleCount = 3;
        
        for (let i = 0; i < particleCount; i++) {
            const orbit = document.createElement("div");
            orbit.className = "cxc-orbit-ring";
            orbit.style.position = "absolute";
            orbit.style.top = "50%";
            orbit.style.left = "50%";
            orbit.style.transform = "translate(-50%, -50%)";
            orbit.style.width = "100%";
            orbit.style.height = "100%";
            orbit.style.borderRadius = "50%";
            orbit.style.animation = `cxcOrbitRotate ${animationDuration}s cubic-bezier(0.34, 1.56, 0.64, 1) infinite`;
            orbit.style.animationDelay = `${i * (animationDuration / 3)}s`;
            
            const particle = document.createElement("div");
            particle.className = "cxc-orbit-particle";
            particle.style.position = "absolute";
            particle.style.top = "0";
            particle.style.left = "50%";
            particle.style.transform = "translate(-50%, -50%)";
            particle.style.width = "15%";
            particle.style.height = "15%";
            particle.style.borderRadius = "50%";
            particle.style.background = color;
            particle.style.boxShadow = `0 0 8px ${lighterColor}`;
            particle.style.animation = `cxcOrbitPulse ${animationDuration / 2}s ease-in-out infinite alternate`;
            particle.style.animationDelay = `${i * 0.2}s`;
            
            orbit.appendChild(particle);
            container.appendChild(orbit);
        }

        // Add a method to update the spinner's speed
        container.updateSpeed = function (newSpeed) {
            const newDuration = (3.5 / newSpeed).toFixed(2);
            
            const centerDot = this.querySelector(".cxc-orbit-center");
            if (centerDot) {
                centerDot.style.animation = `cxcOrbitPulse ${newDuration / 2}s ease-in-out infinite alternate`;
            }
            
            const orbits = this.querySelectorAll(".cxc-orbit-ring");
            orbits.forEach((orbit, i) => {
                orbit.style.animation = `cxcOrbitRotate ${newDuration}s cubic-bezier(0.34, 1.56, 0.64, 1) infinite`;
                orbit.style.animationDelay = `${i * (newDuration / 3)}s`;
                
                const particle = orbit.querySelector(".cxc-orbit-particle");
                if (particle) {
                    particle.style.animation = `cxcOrbitPulse ${newDuration / 2}s ease-in-out infinite alternate`;
                    particle.style.animationDelay = `${i * 0.2}s`;
                }
            });
        };

        // Add a method to update the spinner's color
        container.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const rgbColor = hexToRgb(color);
            const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;
            
            const centerDot = this.querySelector(".cxc-orbit-center");
            if (centerDot) {
                centerDot.style.background = color;
                centerDot.style.boxShadow = `0 0 10px ${lighterColor}`;
            }
            
            const particles = this.querySelectorAll(".cxc-orbit-particle");
            particles.forEach(particle => {
                particle.style.background = color;
                particle.style.boxShadow = `0 0 8px ${lighterColor}`;
            });
        };

        // Ensure keyframes are added to the document
        ensureKeyframes();

        return container;
    }

    /**
     * Get loader CSS code
     * @param {Object} config - Configuration options
     * @returns {string} CSS code
     */
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const animationDuration = (3.5 / config.speed).toFixed(2);
        
        // Create color variations
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        return `.cxc-fluid-orbit-spinner {
  width: ${config.size || "60px"};
  height: ${config.size || "60px"};
  position: relative;
}

.cxc-orbit-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  height: 20%;
  border-radius: 50%;
  background: ${color};
  box-shadow: 0 0 10px ${lighterColor};
  animation: cxcOrbitPulse ${animationDuration / 2}s ease-in-out infinite alternate;
}

.cxc-orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.cxc-orbit-ring:nth-child(2) {
  animation: cxcOrbitRotate ${animationDuration}s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
  animation-delay: 0s;
}

.cxc-orbit-ring:nth-child(3) {
  animation: cxcOrbitRotate ${animationDuration}s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
  animation-delay: ${animationDuration / 3}s;
}

.cxc-orbit-ring:nth-child(4) {
  animation: cxcOrbitRotate ${animationDuration}s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
  animation-delay: ${(animationDuration / 3) * 2}s;
}

.cxc-orbit-particle {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 15%;
  height: 15%;
  border-radius: 50%;
  background: ${color};
  box-shadow: 0 0 8px ${lighterColor};
}

.cxc-orbit-ring:nth-child(2) .cxc-orbit-particle {
  animation: cxcOrbitPulse ${animationDuration / 2}s ease-in-out infinite alternate;
  animation-delay: 0s;
}

.cxc-orbit-ring:nth-child(3) .cxc-orbit-particle {
  animation: cxcOrbitPulse ${animationDuration / 2}s ease-in-out infinite alternate;
  animation-delay: 0.2s;
}

.cxc-orbit-ring:nth-child(4) .cxc-orbit-particle {
  animation: cxcOrbitPulse ${animationDuration / 2}s ease-in-out infinite alternate;
  animation-delay: 0.4s;
}

@keyframes cxcOrbitRotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes cxcOrbitPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.7;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}`;
    }

    /**
     * Get loader JS code (implementation example)
     * @param {Object} config - Configuration options
     * @returns {string} JS code
     */
    function generateJS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const animationDuration = (3.5 / config.speed).toFixed(2);
        const size = config.size || "60px";
        
        // Create color variations
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        return `// Create a Fluid Orbit Spinner
const container = document.createElement('div');
container.style.width = '${size}';
container.style.height = '${size}';
container.style.position = 'relative';

// Create center dot
const centerDot = document.createElement('div');
centerDot.style.position = 'absolute';
centerDot.style.top = '50%';
centerDot.style.left = '50%';
centerDot.style.transform = 'translate(-50%, -50%)';
centerDot.style.width = '20%';
centerDot.style.height = '20%';
centerDot.style.borderRadius = '50%';
centerDot.style.background = '${color}';
centerDot.style.boxShadow = '0 0 10px ${lighterColor}';
centerDot.style.animation = \`orbitPulse ${animationDuration / 2}s ease-in-out infinite alternate\`;

container.appendChild(centerDot);

// Create orbiting particles
const particleCount = 3;

for (let i = 0; i < particleCount; i++) {
  const orbit = document.createElement('div');
  orbit.style.position = 'absolute';
  orbit.style.top = '50%';
  orbit.style.left = '50%';
  orbit.style.transform = 'translate(-50%, -50%)';
  orbit.style.width = '100%';
  orbit.style.height = '100%';
  orbit.style.borderRadius = '50%';
  orbit.style.animation = \`orbitRotate ${animationDuration}s cubic-bezier(0.34, 1.56, 0.64, 1) infinite\`;
  orbit.style.animationDelay = \`\${i * (${animationDuration} / 3)}s\`;
  
  const particle = document.createElement('div');
  particle.style.position = 'absolute';
  particle.style.top = '0';
  particle.style.left = '50%';
  particle.style.transform = 'translate(-50%, -50%)';
  particle.style.width = '15%';
  particle.style.height = '15%';
  particle.style.borderRadius = '50%';
  particle.style.background = '${color}';
  particle.style.boxShadow = '0 0 8px ${lighterColor}';
  particle.style.animation = \`orbitPulse ${animationDuration / 2}s ease-in-out infinite alternate\`;
  particle.style.animationDelay = \`\${i * 0.2}s\`;
  
  orbit.appendChild(particle);
  container.appendChild(orbit);
}

// Add it to your document
document.querySelector('.your-container').appendChild(container);

// Don't forget to add the keyframes in your CSS
/*
@keyframes orbitRotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes orbitPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.7;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}
*/`;
    }

    /**
     * Ensure animation keyframes are added to the document
     */
    function ensureKeyframes() {
        if (!document.getElementById("cxc-orbit-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-orbit-keyframes";
            style.textContent = `
        @keyframes cxcOrbitRotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        
        @keyframes cxcOrbitPulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.7;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Helper function to convert hex to RGB
     * @param {string} hex - Hex color code
     * @returns {Object} RGB color object
     */
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace("#", "");

        // Parse hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return { r, g, b };
    }

    // Register the loader
    CXCLoader.registerLoader(CATEGORY, NAME, createLoader, {
        css: generateCSS,
        js: generateJS,
    });
})();
