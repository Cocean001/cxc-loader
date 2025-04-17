/**
 * Wave Liquid Loader
 * A fluid, liquid-like wave animation
 */

(function () {
    const CATEGORY = "wave";
    const NAME = "liquid"; // This will create a loader with ID "wave-liquid"

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
        const transparentColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.1)`;

        // Create container
        const container = document.createElement("div");
        container.className = "cxc-wave-liquid";
        container.style.width = safeConfig.size;
        container.style.height = safeConfig.size;
        container.style.position = "relative";
        container.style.borderRadius = "50%";
        container.style.overflow = "hidden";
        container.style.background = transparentColor;
        container.style.boxShadow = `0 0 15px ${lighterColor}`;
        
        // Create the liquid waves
        const waveCount = 2;
        
        for (let i = 0; i < waveCount; i++) {
            const wave = document.createElement("div");
            wave.className = "cxc-liquid-wave";
            wave.style.position = "absolute";
            wave.style.bottom = "0";
            wave.style.left = "0";
            wave.style.width = "200%";
            wave.style.height = "100%";
            wave.style.background = color;
            wave.style.borderRadius = "38%";
            wave.style.opacity = i === 0 ? "0.8" : "0.5";
            wave.style.animation = `cxcLiquidWave ${animationDuration}s linear infinite`;
            wave.style.animationDelay = i === 0 ? "0s" : `${animationDuration / 2}s`;
            wave.style.transformOrigin = "center bottom";
            
            container.appendChild(wave);
        }
        
        // Create floating bubbles
        const bubbleCount = 6;
        
        for (let i = 0; i < bubbleCount; i++) {
            const size = 4 + Math.random() * 6; // Random size between 4-10%
            const bubble = document.createElement("div");
            bubble.className = "cxc-liquid-bubble";
            bubble.style.position = "absolute";
            bubble.style.bottom = `${Math.random() * 40}%`;
            bubble.style.left = `${10 + Math.random() * 80}%`;
            bubble.style.width = `${size}%`;
            bubble.style.height = `${size}%`;
            bubble.style.borderRadius = "50%";
            bubble.style.background = lighterColor;
            bubble.style.opacity = "0.7";
            bubble.style.animation = `cxcLiquidBubble ${1 + Math.random() * 2}s ease-in infinite`;
            bubble.style.animationDelay = `${Math.random() * 2}s`;
            
            container.appendChild(bubble);
        }

        // Add a method to update the spinner's speed
        container.updateSpeed = function (newSpeed) {
            const newDuration = (3 / newSpeed).toFixed(2);
            
            const waves = this.querySelectorAll(".cxc-liquid-wave");
            waves.forEach((wave, i) => {
                wave.style.animation = `cxcLiquidWave ${newDuration}s linear infinite`;
                wave.style.animationDelay = i === 0 ? "0s" : `${newDuration / 2}s`;
            });
        };

        // Add a method to update the spinner's color
        container.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const rgbColor = hexToRgb(color);
            const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;
            const transparentColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.1)`;
            
            this.style.background = transparentColor;
            this.style.boxShadow = `0 0 15px ${lighterColor}`;
            
            const waves = this.querySelectorAll(".cxc-liquid-wave");
            waves.forEach(wave => {
                wave.style.background = color;
            });
            
            const bubbles = this.querySelectorAll(".cxc-liquid-bubble");
            bubbles.forEach(bubble => {
                bubble.style.background = lighterColor;
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
        const animationDuration = (3 / config.speed).toFixed(2);
        
        // Create color variations
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;
        const transparentColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.1)`;

        return `.cxc-wave-liquid {
  width: ${config.size || "60px"};
  height: ${config.size || "60px"};
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  background: ${transparentColor};
  box-shadow: 0 0 15px ${lighterColor};
}

.cxc-liquid-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: ${color};
  border-radius: 38%;
  transform-origin: center bottom;
}

.cxc-liquid-wave:nth-child(1) {
  opacity: 0.8;
  animation: cxcLiquidWave ${animationDuration}s linear infinite;
  animation-delay: 0s;
}

.cxc-liquid-wave:nth-child(2) {
  opacity: 0.5;
  animation: cxcLiquidWave ${animationDuration}s linear infinite;
  animation-delay: ${animationDuration / 2}s;
}

.cxc-liquid-bubble {
  position: absolute;
  border-radius: 50%;
  background: ${lighterColor};
  opacity: 0.7;
}

@keyframes cxcLiquidWave {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes cxcLiquidBubble {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
  100% {
    transform: translateY(-100px) scale(0);
    opacity: 0;
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
        const transparentColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.1)`;

        return `// Create a Wave Liquid Loader
const container = document.createElement('div');
container.style.width = '${size}';
container.style.height = '${size}';
container.style.position = 'relative';
container.style.borderRadius = '50%';
container.style.overflow = 'hidden';
container.style.background = '${transparentColor}';
container.style.boxShadow = '0 0 15px ${lighterColor}';

// Create the liquid waves
const waveCount = 2;

for (let i = 0; i < waveCount; i++) {
  const wave = document.createElement('div');
  wave.style.position = 'absolute';
  wave.style.bottom = '0';
  wave.style.left = '0';
  wave.style.width = '200%';
  wave.style.height = '100%';
  wave.style.background = '${color}';
  wave.style.borderRadius = '38%';
  wave.style.opacity = i === 0 ? '0.8' : '0.5';
  wave.style.animation = \`liquidWave ${animationDuration}s linear infinite\`;
  wave.style.animationDelay = i === 0 ? '0s' : \`\${${animationDuration} / 2}s\`;
  wave.style.transformOrigin = 'center bottom';
  
  container.appendChild(wave);
}

// Create floating bubbles
const bubbleCount = 6;

for (let i = 0; i < bubbleCount; i++) {
  const size = 4 + Math.random() * 6; // Random size between 4-10%
  const bubble = document.createElement('div');
  bubble.style.position = 'absolute';
  bubble.style.bottom = \`\${Math.random() * 40}%\`;
  bubble.style.left = \`\${10 + Math.random() * 80}%\`;
  bubble.style.width = \`\${size}%\`;
  bubble.style.height = \`\${size}%\`;
  bubble.style.borderRadius = '50%';
  bubble.style.background = '${lighterColor}';
  bubble.style.opacity = '0.7';
  bubble.style.animation = \`liquidBubble \${1 + Math.random() * 2}s ease-in infinite\`;
  bubble.style.animationDelay = \`\${Math.random() * 2}s\`;
  
  container.appendChild(bubble);
}

// Add it to your document
document.querySelector('.your-container').appendChild(container);

// Don't forget to add the keyframes in your CSS
/*
@keyframes liquidWave {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes liquidBubble {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
  100% {
    transform: translateY(-100px) scale(0);
    opacity: 0;
  }
}
*/`;
    }

    /**
     * Ensure animation keyframes are added to the document
     */
    function ensureKeyframes() {
        if (!document.getElementById("cxc-liquid-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-liquid-keyframes";
            style.textContent = `
        @keyframes cxcLiquidWave {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes cxcLiquidBubble {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
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
