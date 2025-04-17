/**
 * Wave Oscillate Loader
 * A smooth, oscillating wave pattern inspired by sound waves
 */

(function () {
    const CATEGORY = "wave";
    const NAME = "oscillate"; // This will create a loader with ID "wave-oscillate"

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
        const animationDuration = (2.5 / safeConfig.speed).toFixed(2);
        
        // Create color variations
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        // Create container
        const container = document.createElement("div");
        container.className = "cxc-wave-oscillate";
        container.style.width = safeConfig.size;
        container.style.height = safeConfig.size;
        container.style.position = "relative";
        
        // Create the wave container
        const waveContainer = document.createElement("div");
        waveContainer.className = "cxc-oscillate-container";
        waveContainer.style.position = "absolute";
        waveContainer.style.top = "50%";
        waveContainer.style.left = "0";
        waveContainer.style.transform = "translateY(-50%)";
        waveContainer.style.width = "100%";
        waveContainer.style.height = "40%";
        waveContainer.style.display = "flex";
        waveContainer.style.alignItems = "center";
        waveContainer.style.justifyContent = "space-around";
        
        // Create the wave bars
        const barCount = 5;
        
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement("div");
            bar.className = "cxc-oscillate-bar";
            bar.style.width = "12%";
            bar.style.height = "100%";
            bar.style.background = color;
            bar.style.borderRadius = "2px";
            bar.style.animation = `cxcOscillate ${animationDuration}s ease-in-out infinite`;
            bar.style.animationDelay = `${i * 0.15}s`;
            bar.style.boxShadow = `0 0 8px ${lighterColor}`;
            bar.style.transformOrigin = "center center";
            
            waveContainer.appendChild(bar);
        }
        
        container.appendChild(waveContainer);

        // Add a method to update the spinner's speed
        container.updateSpeed = function (newSpeed) {
            const newDuration = (2.5 / newSpeed).toFixed(2);
            
            const bars = this.querySelectorAll(".cxc-oscillate-bar");
            bars.forEach((bar, i) => {
                bar.style.animation = `cxcOscillate ${newDuration}s ease-in-out infinite`;
                bar.style.animationDelay = `${i * 0.15}s`;
            });
        };

        // Add a method to update the spinner's color
        container.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const rgbColor = hexToRgb(color);
            const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;
            
            const bars = this.querySelectorAll(".cxc-oscillate-bar");
            bars.forEach(bar => {
                bar.style.background = color;
                bar.style.boxShadow = `0 0 8px ${lighterColor}`;
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
        const animationDuration = (2.5 / config.speed).toFixed(2);
        
        // Create color variations
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        return `.cxc-wave-oscillate {
  width: ${config.size || "60px"};
  height: ${config.size || "60px"};
  position: relative;
}

.cxc-oscillate-container {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 40%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.cxc-oscillate-bar {
  width: 12%;
  height: 100%;
  background: ${color};
  border-radius: 2px;
  box-shadow: 0 0 8px ${lighterColor};
  transform-origin: center center;
}

.cxc-oscillate-bar:nth-child(1) {
  animation: cxcOscillate ${animationDuration}s ease-in-out infinite;
  animation-delay: 0s;
}

.cxc-oscillate-bar:nth-child(2) {
  animation: cxcOscillate ${animationDuration}s ease-in-out infinite;
  animation-delay: 0.15s;
}

.cxc-oscillate-bar:nth-child(3) {
  animation: cxcOscillate ${animationDuration}s ease-in-out infinite;
  animation-delay: 0.3s;
}

.cxc-oscillate-bar:nth-child(4) {
  animation: cxcOscillate ${animationDuration}s ease-in-out infinite;
  animation-delay: 0.45s;
}

.cxc-oscillate-bar:nth-child(5) {
  animation: cxcOscillate ${animationDuration}s ease-in-out infinite;
  animation-delay: 0.6s;
}

@keyframes cxcOscillate {
  0%, 100% {
    height: 20%;
  }
  50% {
    height: 100%;
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
        const animationDuration = (2.5 / config.speed).toFixed(2);
        const size = config.size || "60px";
        
        // Create color variations
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        return `// Create a Wave Oscillate Loader
const container = document.createElement('div');
container.style.width = '${size}';
container.style.height = '${size}';
container.style.position = 'relative';

// Create the wave container
const waveContainer = document.createElement('div');
waveContainer.style.position = 'absolute';
waveContainer.style.top = '50%';
waveContainer.style.left = '0';
waveContainer.style.transform = 'translateY(-50%)';
waveContainer.style.width = '100%';
waveContainer.style.height = '40%';
waveContainer.style.display = 'flex';
waveContainer.style.alignItems = 'center';
waveContainer.style.justifyContent = 'space-around';

// Create the wave bars
const barCount = 5;

for (let i = 0; i < barCount; i++) {
  const bar = document.createElement('div');
  bar.style.width = '12%';
  bar.style.height = '100%';
  bar.style.background = '${color}';
  bar.style.borderRadius = '2px';
  bar.style.animation = \`oscillate ${animationDuration}s ease-in-out infinite\`;
  bar.style.animationDelay = \`\${i * 0.15}s\`;
  bar.style.boxShadow = '0 0 8px ${lighterColor}';
  bar.style.transformOrigin = 'center center';
  
  waveContainer.appendChild(bar);
}

container.appendChild(waveContainer);

// Add it to your document
document.querySelector('.your-container').appendChild(container);

// Don't forget to add the keyframes in your CSS
/*
@keyframes oscillate {
  0%, 100% {
    height: 20%;
  }
  50% {
    height: 100%;
  }
}
*/`;
    }

    /**
     * Ensure animation keyframes are added to the document
     */
    function ensureKeyframes() {
        if (!document.getElementById("cxc-oscillate-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-oscillate-keyframes";
            style.textContent = `
        @keyframes cxcOscillate {
          0%, 100% {
            height: 20%;
          }
          50% {
            height: 100%;
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
