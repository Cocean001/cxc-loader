/**
 * AI Pulse Wave Loader
 * A fluid, AI-inspired wave animation with pulsating elements
 */

(function () {
    const CATEGORY = "wave";
    const NAME = "ai-pulse"; // This will create a loader with ID "wave-ai-pulse"

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
        container.className = "cxc-wave-ai-pulse";
        container.style.width = safeConfig.size;
        container.style.height = safeConfig.size;
        container.style.position = "relative";
        
        // Create the wave container
        const waveContainer = document.createElement("div");
        waveContainer.className = "cxc-ai-wave-container";
        waveContainer.style.position = "absolute";
        waveContainer.style.top = "50%";
        waveContainer.style.left = "0";
        waveContainer.style.transform = "translateY(-50%)";
        waveContainer.style.width = "100%";
        waveContainer.style.height = "60%";
        waveContainer.style.display = "flex";
        waveContainer.style.alignItems = "center";
        waveContainer.style.justifyContent = "center";
        
        // Create the AI wave elements
        const elementCount = 20;
        const waveWidth = 100; // percentage of container width
        
        for (let i = 0; i < elementCount; i++) {
            const element = document.createElement("div");
            element.className = "cxc-ai-wave-element";
            
            // Calculate position along the wave
            const position = (i / (elementCount - 1)) * waveWidth;
            
            element.style.position = "absolute";
            element.style.left = `${position}%`;
            element.style.width = "3px";
            element.style.height = "3px";
            element.style.borderRadius = "50%";
            element.style.background = color;
            element.style.boxShadow = `0 0 5px ${lighterColor}`;
            
            // Set animation with varying delays based on position
            element.style.animation = `cxcAiWave ${animationDuration}s ease-in-out infinite`;
            element.style.animationDelay = `${(position / waveWidth) * 0.5}s`;
            
            waveContainer.appendChild(element);
        }
        
        // Create connecting lines between elements
        for (let i = 0; i < elementCount - 1; i++) {
            const line = document.createElement("div");
            line.className = "cxc-ai-wave-line";
            
            // Calculate positions
            const startPos = (i / (elementCount - 1)) * waveWidth;
            const endPos = ((i + 1) / (elementCount - 1)) * waveWidth;
            
            line.style.position = "absolute";
            line.style.left = `${startPos}%`;
            line.style.width = `${endPos - startPos}%`;
            line.style.height = "1px";
            line.style.background = `linear-gradient(to right, ${color}, ${lighterColor})`;
            line.style.opacity = "0.6";
            line.style.transformOrigin = "left center";
            
            // Set animation with varying delays based on position
            line.style.animation = `cxcAiLine ${animationDuration}s ease-in-out infinite`;
            line.style.animationDelay = `${(startPos / waveWidth) * 0.5}s`;
            
            waveContainer.appendChild(line);
        }
        
        container.appendChild(waveContainer);

        // Add a method to update the spinner's speed
        container.updateSpeed = function (newSpeed) {
            const newDuration = (3 / newSpeed).toFixed(2);
            
            const elements = this.querySelectorAll(".cxc-ai-wave-element");
            elements.forEach((element, i) => {
                const position = (i / (elements.length - 1)) * 100;
                element.style.animation = `cxcAiWave ${newDuration}s ease-in-out infinite`;
                element.style.animationDelay = `${(position / 100) * 0.5}s`;
            });
            
            const lines = this.querySelectorAll(".cxc-ai-wave-line");
            lines.forEach((line, i) => {
                const position = (i / (lines.length)) * 100;
                line.style.animation = `cxcAiLine ${newDuration}s ease-in-out infinite`;
                line.style.animationDelay = `${(position / 100) * 0.5}s`;
            });
        };

        // Add a method to update the spinner's color
        container.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const rgbColor = hexToRgb(color);
            const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;
            
            const elements = this.querySelectorAll(".cxc-ai-wave-element");
            elements.forEach(element => {
                element.style.background = color;
                element.style.boxShadow = `0 0 5px ${lighterColor}`;
            });
            
            const lines = this.querySelectorAll(".cxc-ai-wave-line");
            lines.forEach(line => {
                line.style.background = `linear-gradient(to right, ${color}, ${lighterColor})`;
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

        return `.cxc-wave-ai-pulse {
  width: ${config.size || "60px"};
  height: ${config.size || "60px"};
  position: relative;
}

.cxc-ai-wave-container {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cxc-ai-wave-element {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: ${color};
  box-shadow: 0 0 5px ${lighterColor};
}

.cxc-ai-wave-line {
  position: absolute;
  height: 1px;
  background: linear-gradient(to right, ${color}, ${lighterColor});
  opacity: 0.6;
  transform-origin: left center;
}

@keyframes cxcAiWave {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes cxcAiLine {
  0%, 100% {
    transform: scaleY(1) rotate(0deg);
  }
  50% {
    transform: scaleY(2) rotate(-5deg);
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

        return `// Create an AI Pulse Wave Loader
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
waveContainer.style.height = '60%';
waveContainer.style.display = 'flex';
waveContainer.style.alignItems = 'center';
waveContainer.style.justifyContent = 'center';

// Create the AI wave elements
const elementCount = 20;
const waveWidth = 100; // percentage of container width

for (let i = 0; i < elementCount; i++) {
  const element = document.createElement('div');
  
  // Calculate position along the wave
  const position = (i / (elementCount - 1)) * waveWidth;
  
  element.style.position = 'absolute';
  element.style.left = \`\${position}%\`;
  element.style.width = '3px';
  element.style.height = '3px';
  element.style.borderRadius = '50%';
  element.style.background = '${color}';
  element.style.boxShadow = '0 0 5px ${lighterColor}';
  
  // Set animation with varying delays based on position
  element.style.animation = \`aiWave ${animationDuration}s ease-in-out infinite\`;
  element.style.animationDelay = \`\${(position / waveWidth) * 0.5}s\`;
  
  waveContainer.appendChild(element);
}

// Create connecting lines between elements
for (let i = 0; i < elementCount - 1; i++) {
  const line = document.createElement('div');
  
  // Calculate positions
  const startPos = (i / (elementCount - 1)) * waveWidth;
  const endPos = ((i + 1) / (elementCount - 1)) * waveWidth;
  
  line.style.position = 'absolute';
  line.style.left = \`\${startPos}%\`;
  line.style.width = \`\${endPos - startPos}%\`;
  line.style.height = '1px';
  line.style.background = 'linear-gradient(to right, ${color}, ${lighterColor})';
  line.style.opacity = '0.6';
  line.style.transformOrigin = 'left center';
  
  // Set animation with varying delays based on position
  line.style.animation = \`aiLine ${animationDuration}s ease-in-out infinite\`;
  line.style.animationDelay = \`\${(startPos / waveWidth) * 0.5}s\`;
  
  waveContainer.appendChild(line);
}

container.appendChild(waveContainer);

// Add it to your document
document.querySelector('.your-container').appendChild(container);

// Don't forget to add the keyframes in your CSS
/*
@keyframes aiWave {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes aiLine {
  0%, 100% {
    transform: scaleY(1) rotate(0deg);
  }
  50% {
    transform: scaleY(2) rotate(-5deg);
  }
}
*/`;
    }

    /**
     * Ensure animation keyframes are added to the document
     */
    function ensureKeyframes() {
        if (!document.getElementById("cxc-ai-wave-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-ai-wave-keyframes";
            style.textContent = `
        @keyframes cxcAiWave {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes cxcAiLine {
          0%, 100% {
            transform: scaleY(1) rotate(0deg);
          }
          50% {
            transform: scaleY(2) rotate(-5deg);
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
