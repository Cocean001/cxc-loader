/**
 * Wave Ripple Loader
 * A fluid, rippling wave effect inspired by water surface
 */

(function () {
    const CATEGORY = "wave";
    const NAME = "ripple"; // This will create a loader with ID "wave-ripple"

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
        const animationDuration = (3 / safeConfig.speed).toFixed(2);
        
        // Create color variations
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        // Create container
        const container = document.createElement("div");
        container.className = "cxc-wave-ripple";
        container.style.width = safeConfig.size;
        container.style.height = safeConfig.size;
        container.style.position = "relative";
        container.style.overflow = "hidden";
        
        // Create the wave container
        const waveContainer = document.createElement("div");
        waveContainer.className = "cxc-wave-container";
        waveContainer.style.position = "absolute";
        waveContainer.style.top = "50%";
        waveContainer.style.left = "50%";
        waveContainer.style.transform = "translate(-50%, -50%)";
        waveContainer.style.width = "100%";
        waveContainer.style.height = "100%";
        
        // Create multiple wave rings
        const ringCount = 4;
        
        for (let i = 0; i < ringCount; i++) {
            const ring = document.createElement("div");
            ring.className = "cxc-wave-ring";
            ring.style.position = "absolute";
            ring.style.top = "50%";
            ring.style.left = "50%";
            ring.style.transform = "translate(-50%, -50%)";
            ring.style.borderRadius = "50%";
            ring.style.border = `2px solid ${color}`;
            ring.style.opacity = "0";
            ring.style.width = "10%";
            ring.style.height = "10%";
            ring.style.animation = `cxcWaveRipple ${animationDuration}s ease-out infinite`;
            ring.style.animationDelay = `${i * (animationDuration / ringCount)}s`;
            
            waveContainer.appendChild(ring);
        }
        
        // Create center dot
        const centerDot = document.createElement("div");
        centerDot.className = "cxc-wave-center";
        centerDot.style.position = "absolute";
        centerDot.style.top = "50%";
        centerDot.style.left = "50%";
        centerDot.style.transform = "translate(-50%, -50%)";
        centerDot.style.width = "15%";
        centerDot.style.height = "15%";
        centerDot.style.borderRadius = "50%";
        centerDot.style.background = color;
        centerDot.style.boxShadow = `0 0 10px ${lighterColor}`;
        centerDot.style.animation = `cxcWavePulse ${animationDuration / 2}s ease-in-out infinite alternate`;
        
        waveContainer.appendChild(centerDot);
        container.appendChild(waveContainer);

        // Add a method to update the spinner's speed
        container.updateSpeed = function (newSpeed) {
            const newDuration = (3 / newSpeed).toFixed(2);
            
            const rings = this.querySelectorAll(".cxc-wave-ring");
            rings.forEach((ring, i) => {
                ring.style.animation = `cxcWaveRipple ${newDuration}s ease-out infinite`;
                ring.style.animationDelay = `${i * (newDuration / rings.length)}s`;
            });
            
            const center = this.querySelector(".cxc-wave-center");
            if (center) {
                center.style.animation = `cxcWavePulse ${newDuration / 2}s ease-in-out infinite alternate`;
            }
        };

        // Add a method to update the spinner's color
        container.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const rgbColor = hexToRgb(color);
            const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;
            
            const rings = this.querySelectorAll(".cxc-wave-ring");
            rings.forEach(ring => {
                ring.style.border = `2px solid ${color}`;
            });
            
            const center = this.querySelector(".cxc-wave-center");
            if (center) {
                center.style.background = color;
                center.style.boxShadow = `0 0 10px ${lighterColor}`;
            }
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
        const animationDuration = (3 / config.speed).toFixed(2);
        
        // Create color variations
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        return `.cxc-wave-ripple {
  width: ${config.size || "60px"};
  height: ${config.size || "60px"};
  position: relative;
  overflow: hidden;
}

.cxc-wave-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
}

.cxc-wave-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid ${color};
  opacity: 0;
  width: 10%;
  height: 10%;
}

.cxc-wave-ring:nth-child(1) {
  animation: cxcWaveRipple ${animationDuration}s ease-out infinite;
  animation-delay: 0s;
}

.cxc-wave-ring:nth-child(2) {
  animation: cxcWaveRipple ${animationDuration}s ease-out infinite;
  animation-delay: ${animationDuration / 4}s;
}

.cxc-wave-ring:nth-child(3) {
  animation: cxcWaveRipple ${animationDuration}s ease-out infinite;
  animation-delay: ${(animationDuration / 4) * 2}s;
}

.cxc-wave-ring:nth-child(4) {
  animation: cxcWaveRipple ${animationDuration}s ease-out infinite;
  animation-delay: ${(animationDuration / 4) * 3}s;
}

.cxc-wave-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 15%;
  height: 15%;
  border-radius: 50%;
  background: ${color};
  box-shadow: 0 0 10px ${lighterColor};
  animation: cxcWavePulse ${animationDuration / 2}s ease-in-out infinite alternate;
}

@keyframes cxcWaveRipple {
  0% {
    width: 10%;
    height: 10%;
    opacity: 0.8;
  }
  100% {
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}

@keyframes cxcWavePulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
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
        const animationDuration = (3 / config.speed).toFixed(2);
        const size = config.size || "60px";
        
        // Create color variations
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        return `// Create a Wave Ripple Loader
const container = document.createElement('div');
container.style.width = '${size}';
container.style.height = '${size}';
container.style.position = 'relative';
container.style.overflow = 'hidden';

// Create the wave container
const waveContainer = document.createElement('div');
waveContainer.style.position = 'absolute';
waveContainer.style.top = '50%';
waveContainer.style.left = '50%';
waveContainer.style.transform = 'translate(-50%, -50%)';
waveContainer.style.width = '100%';
waveContainer.style.height = '100%';

// Create multiple wave rings
const ringCount = 4;

for (let i = 0; i < ringCount; i++) {
  const ring = document.createElement('div');
  ring.style.position = 'absolute';
  ring.style.top = '50%';
  ring.style.left = '50%';
  ring.style.transform = 'translate(-50%, -50%)';
  ring.style.borderRadius = '50%';
  ring.style.border = '2px solid ${color}';
  ring.style.opacity = '0';
  ring.style.width = '10%';
  ring.style.height = '10%';
  ring.style.animation = \`waveRipple ${animationDuration}s ease-out infinite\`;
  ring.style.animationDelay = \`\${i * (${animationDuration} / ringCount)}s\`;
  
  waveContainer.appendChild(ring);
}

// Create center dot
const centerDot = document.createElement('div');
centerDot.style.position = 'absolute';
centerDot.style.top = '50%';
centerDot.style.left = '50%';
centerDot.style.transform = 'translate(-50%, -50%)';
centerDot.style.width = '15%';
centerDot.style.height = '15%';
centerDot.style.borderRadius = '50%';
centerDot.style.background = '${color}';
centerDot.style.boxShadow = '0 0 10px ${lighterColor}';
centerDot.style.animation = \`wavePulse ${animationDuration / 2}s ease-in-out infinite alternate\`;

waveContainer.appendChild(centerDot);
container.appendChild(waveContainer);

// Add it to your document
document.querySelector('.your-container').appendChild(container);

// Don't forget to add the keyframes in your CSS
/*
@keyframes waveRipple {
  0% {
    width: 10%;
    height: 10%;
    opacity: 0.8;
  }
  100% {
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}

@keyframes wavePulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
*/`;
    }

    /**
     * Ensure animation keyframes are added to the document
     */
    function ensureKeyframes() {
        if (!document.getElementById("cxc-wave-ripple-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-wave-ripple-keyframes";
            style.textContent = `
        @keyframes cxcWaveRipple {
          0% {
            width: 10%;
            height: 10%;
            opacity: 0.8;
          }
          100% {
            width: 100%;
            height: 100%;
            opacity: 0;
          }
        }
        
        @keyframes cxcWavePulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
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
