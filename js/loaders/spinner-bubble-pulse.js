/**
 * Bubble Pulse Spinner Loader
 * A fluid, pulsating bubble spinner inspired by AI interfaces
 */

(function () {
    const CATEGORY = "spinner";
    const NAME = "bubble-pulse"; // This will create a loader with ID "spinner-bubble-pulse"

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
        const darkerColor = adjustColor(color, -20);

        // Create container
        const container = document.createElement("div");
        container.className = "cxc-bubble-pulse-spinner";
        container.style.width = safeConfig.size;
        container.style.height = safeConfig.size;
        container.style.position = "relative";
        
        // Create the bubbles
        const bubbleCount = 3;
        
        for (let i = 0; i < bubbleCount; i++) {
            const bubble = document.createElement("div");
            bubble.className = "cxc-bubble";
            bubble.style.position = "absolute";
            bubble.style.top = "50%";
            bubble.style.left = "50%";
            bubble.style.transform = "translate(-50%, -50%)";
            bubble.style.width = "30%";
            bubble.style.height = "30%";
            bubble.style.borderRadius = "50%";
            bubble.style.background = `radial-gradient(circle at 30% 30%, ${color}, ${darkerColor})`;
            bubble.style.opacity = "0";
            bubble.style.animation = `cxcBubblePulse ${animationDuration}s ease-in-out infinite`;
            bubble.style.animationDelay = `${i * 0.8}s`;
            bubble.style.boxShadow = `0 0 15px ${lighterColor}`;
            
            container.appendChild(bubble);
        }

        // Add a method to update the spinner's speed
        container.updateSpeed = function (newSpeed) {
            const newDuration = (3 / newSpeed).toFixed(2);
            const bubbles = this.querySelectorAll(".cxc-bubble");
            bubbles.forEach((bubble, i) => {
                bubble.style.animation = `cxcBubblePulse ${newDuration}s ease-in-out infinite`;
                bubble.style.animationDelay = `${i * 0.8}s`;
            });
        };

        // Add a method to update the spinner's color
        container.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const rgbColor = hexToRgb(color);
            const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;
            const darkerColor = adjustColor(color, -20);
            
            const bubbles = this.querySelectorAll(".cxc-bubble");
            bubbles.forEach(bubble => {
                bubble.style.background = `radial-gradient(circle at 30% 30%, ${color}, ${darkerColor})`;
                bubble.style.boxShadow = `0 0 15px ${lighterColor}`;
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
        const darkerColor = adjustColor(color, -20);

        return `.cxc-bubble-pulse-spinner {
  width: ${config.size || "60px"};
  height: ${config.size || "60px"};
  position: relative;
}

.cxc-bubble {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  height: 30%;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, ${color}, ${darkerColor});
  opacity: 0;
  box-shadow: 0 0 15px ${lighterColor};
}

.cxc-bubble:nth-child(1) {
  animation: cxcBubblePulse ${animationDuration}s ease-in-out infinite;
  animation-delay: 0s;
}

.cxc-bubble:nth-child(2) {
  animation: cxcBubblePulse ${animationDuration}s ease-in-out infinite;
  animation-delay: 0.8s;
}

.cxc-bubble:nth-child(3) {
  animation: cxcBubblePulse ${animationDuration}s ease-in-out infinite;
  animation-delay: 1.6s;
}

@keyframes cxcBubblePulse {
  0% {
    transform: translate(-50%, -50%) scale(0.1);
    opacity: 0;
  }
  25% {
    opacity: 0.8;
  }
  50%, 100% {
    transform: translate(-50%, -50%) scale(1.8);
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
        const darkerColor = adjustColor(color, -20);

        return `// Create a Bubble Pulse Spinner
const container = document.createElement('div');
container.style.width = '${size}';
container.style.height = '${size}';
container.style.position = 'relative';

// Create the bubbles
const bubbleCount = 3;

for (let i = 0; i < bubbleCount; i++) {
  const bubble = document.createElement('div');
  bubble.style.position = 'absolute';
  bubble.style.top = '50%';
  bubble.style.left = '50%';
  bubble.style.transform = 'translate(-50%, -50%)';
  bubble.style.width = '30%';
  bubble.style.height = '30%';
  bubble.style.borderRadius = '50%';
  bubble.style.background = 'radial-gradient(circle at 30% 30%, ${color}, ${darkerColor})';
  bubble.style.opacity = '0';
  bubble.style.animation = \`bubblePulse ${animationDuration}s ease-in-out infinite\`;
  bubble.style.animationDelay = \`\${i * 0.8}s\`;
  bubble.style.boxShadow = '0 0 15px ${lighterColor}';
  
  container.appendChild(bubble);
}

// Add it to your document
document.querySelector('.your-container').appendChild(container);

// Don't forget to add the keyframes in your CSS
/*
@keyframes bubblePulse {
  0% {
    transform: translate(-50%, -50%) scale(0.1);
    opacity: 0;
  }
  25% {
    opacity: 0.8;
  }
  50%, 100% {
    transform: translate(-50%, -50%) scale(1.8);
    opacity: 0;
  }
}
*/`;
    }

    /**
     * Ensure animation keyframes are added to the document
     */
    function ensureKeyframes() {
        if (!document.getElementById("cxc-bubble-pulse-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-bubble-pulse-keyframes";
            style.textContent = `
        @keyframes cxcBubblePulse {
          0% {
            transform: translate(-50%, -50%) scale(0.1);
            opacity: 0;
          }
          25% {
            opacity: 0.8;
          }
          50%, 100% {
            transform: translate(-50%, -50%) scale(1.8);
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
    
    /**
     * Helper function to adjust color brightness
     * @param {string} color - Hex color code
     * @param {number} amount - Amount to adjust brightness
     * @returns {string} Adjusted color
     */
    function adjustColor(color, amount) {
        // Remove # if present
        color = color.replace("#", "");
        
        // Parse hex values
        let r = parseInt(color.substring(0, 2), 16);
        let g = parseInt(color.substring(2, 4), 16);
        let b = parseInt(color.substring(4, 6), 16);
        
        // Adjust values
        r = Math.max(0, Math.min(255, r + amount));
        g = Math.max(0, Math.min(255, g + amount));
        b = Math.max(0, Math.min(255, b + amount));
        
        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    // Register the loader
    CXCLoader.registerLoader(CATEGORY, NAME, createLoader, {
        css: generateCSS,
        js: generateJS,
    });
})();
