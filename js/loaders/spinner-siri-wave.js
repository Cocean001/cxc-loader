/**
 * Siri Wave Spinner Loader
 * A fluid, wave-like spinner inspired by Siri's voice interface
 */

(function () {
    const CATEGORY = "spinner";
    const NAME = "siri-wave"; // This will create a loader with ID "spinner-siri-wave"

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
        
        // Create a lighter shade for subtle effects
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        // Create container
        const container = document.createElement("div");
        container.className = "cxc-siri-wave-spinner";
        container.style.width = safeConfig.size;
        container.style.height = safeConfig.size;
        container.style.position = "relative";
        
        // Create the wave bars
        const barCount = 5;
        const barWidth = 4;
        const spacing = 4;
        const totalWidth = (barWidth + spacing) * barCount - spacing;
        
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement("div");
            bar.className = "cxc-siri-wave-bar";
            bar.style.position = "absolute";
            bar.style.bottom = "30%";
            bar.style.width = `${barWidth}px`;
            bar.style.height = "40%";
            bar.style.background = color;
            bar.style.borderRadius = "2px";
            bar.style.left = `calc(50% - ${totalWidth / 2}px + ${i * (barWidth + spacing)}px)`;
            bar.style.transformOrigin = "center bottom";
            bar.style.animation = `cxcSiriWave ${animationDuration}s ease-in-out infinite`;
            bar.style.animationDelay = `${i * 0.15}s`;
            bar.style.boxShadow = `0 0 8px ${lighterColor}`;
            
            container.appendChild(bar);
        }

        // Add a method to update the spinner's speed
        container.updateSpeed = function (newSpeed) {
            const newDuration = (2.5 / newSpeed).toFixed(2);
            const bars = this.querySelectorAll(".cxc-siri-wave-bar");
            bars.forEach((bar, i) => {
                bar.style.animation = `cxcSiriWave ${newDuration}s ease-in-out infinite`;
                bar.style.animationDelay = `${i * 0.15}s`;
            });
        };

        // Add a method to update the spinner's color
        container.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const rgbColor = hexToRgb(color);
            const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;
            
            const bars = this.querySelectorAll(".cxc-siri-wave-bar");
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
        
        // Create a lighter shade for subtle effects
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        return `.cxc-siri-wave-spinner {
  width: ${config.size || "60px"};
  height: ${config.size || "60px"};
  position: relative;
}

.cxc-siri-wave-bar {
  position: absolute;
  bottom: 30%;
  width: 4px;
  height: 40%;
  background: ${color};
  border-radius: 2px;
  transform-origin: center bottom;
  box-shadow: 0 0 8px ${lighterColor};
}

.cxc-siri-wave-bar:nth-child(1) {
  left: calc(50% - 10px);
  animation: cxcSiriWave ${animationDuration}s ease-in-out infinite;
  animation-delay: 0s;
}

.cxc-siri-wave-bar:nth-child(2) {
  left: calc(50% - 2px);
  animation: cxcSiriWave ${animationDuration}s ease-in-out infinite;
  animation-delay: 0.15s;
}

.cxc-siri-wave-bar:nth-child(3) {
  left: calc(50% + 6px);
  animation: cxcSiriWave ${animationDuration}s ease-in-out infinite;
  animation-delay: 0.3s;
}

.cxc-siri-wave-bar:nth-child(4) {
  left: calc(50% + 14px);
  animation: cxcSiriWave ${animationDuration}s ease-in-out infinite;
  animation-delay: 0.45s;
}

.cxc-siri-wave-bar:nth-child(5) {
  left: calc(50% + 22px);
  animation: cxcSiriWave ${animationDuration}s ease-in-out infinite;
  animation-delay: 0.6s;
}

@keyframes cxcSiriWave {
  0%, 100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1.2);
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
        
        // Create a lighter shade for subtle effects
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        return `// Create a Siri Wave Spinner
const container = document.createElement('div');
container.style.width = '${size}';
container.style.height = '${size}';
container.style.position = 'relative';

// Create the wave bars
const barCount = 5;
const barWidth = 4;
const spacing = 4;
const totalWidth = (barWidth + spacing) * barCount - spacing;

for (let i = 0; i < barCount; i++) {
  const bar = document.createElement('div');
  bar.style.position = 'absolute';
  bar.style.bottom = '30%';
  bar.style.width = '${barWidth}px';
  bar.style.height = '40%';
  bar.style.background = '${color}';
  bar.style.borderRadius = '2px';
  bar.style.left = \`calc(50% - \${totalWidth / 2}px + \${i * (barWidth + spacing)}px)\`;
  bar.style.transformOrigin = 'center bottom';
  bar.style.animation = 'siriWave ${animationDuration}s ease-in-out infinite';
  bar.style.animationDelay = \`\${i * 0.15}s\`;
  bar.style.boxShadow = '0 0 8px ${lighterColor}';
  
  container.appendChild(bar);
}

// Add it to your document
document.querySelector('.your-container').appendChild(container);

// Don't forget to add the keyframes in your CSS
/*
@keyframes siriWave {
  0%, 100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1.2);
  }
}
*/`;
    }

    /**
     * Ensure animation keyframes are added to the document
     */
    function ensureKeyframes() {
        if (!document.getElementById("cxc-siri-wave-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-siri-wave-keyframes";
            style.textContent = `
        @keyframes cxcSiriWave {
          0%, 100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1.2);
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
