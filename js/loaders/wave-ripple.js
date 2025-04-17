/**
 * Ripple Wave Loader
 * A smooth rippling wave effect inspired by water
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
        const animationDuration = (3.0 / safeConfig.speed).toFixed(2);
        
        // Create color variations
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        // Create container
        const container = document.createElement("div");
        container.className = "cxc-wave-ripple";
        container.style.width = safeConfig.size;
        container.style.height = safeConfig.size;
        container.style.position = "relative";
        
        // Create the ripple circles
        const circleCount = 3;
        
        for (let i = 0; i < circleCount; i++) {
            const circle = document.createElement("div");
            circle.className = "cxc-ripple-circle";
            circle.style.position = "absolute";
            circle.style.top = "50%";
            circle.style.left = "50%";
            circle.style.transform = "translate(-50%, -50%)";
            circle.style.width = "20%";
            circle.style.height = "20%";
            circle.style.borderRadius = "50%";
            circle.style.border = `2px solid ${color}`;
            circle.style.opacity = "0";
            circle.style.animation = `cxcRippleWave ${animationDuration}s ease-out infinite`;
            circle.style.animationDelay = `${i * 0.8}s`;
            
            container.appendChild(circle);
        }

        // Create center dot
        const centerDot = document.createElement("div");
        centerDot.className = "cxc-ripple-center";
        centerDot.style.position = "absolute";
        centerDot.style.top = "50%";
        centerDot.style.left = "50%";
        centerDot.style.transform = "translate(-50%, -50%)";
        centerDot.style.width = "10%";
        centerDot.style.height = "10%";
        centerDot.style.borderRadius = "50%";
        centerDot.style.backgroundColor = color;
        centerDot.style.boxShadow = `0 0 10px ${lighterColor}`;
        
        container.appendChild(centerDot);

        // Add a method to update the ripple's speed
        container.updateSpeed = function (newSpeed) {
            const newDuration = (3.0 / newSpeed).toFixed(2);
            
            const circles = this.querySelectorAll(".cxc-ripple-circle");
            circles.forEach((circle, i) => {
                circle.style.animation = `cxcRippleWave ${newDuration}s ease-out infinite`;
                circle.style.animationDelay = `${i * 0.8}s`;
            });
        };

        // Add a method to update the ripple's color
        container.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const rgbColor = hexToRgb(color);
            const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;
            
            const circles = this.querySelectorAll(".cxc-ripple-circle");
            circles.forEach(circle => {
                circle.style.border = `2px solid ${color}`;
            });
            
            const center = this.querySelector(".cxc-ripple-center");
            if (center) {
                center.style.backgroundColor = color;
                center.style.boxShadow = `0 0 10px ${lighterColor}`;
            }
        };

        // Ensure keyframes are added to the document
        ensureKeyframes();

        return container;
    }

    /**
     * Ensure the keyframes are added to the document
     */
    function ensureKeyframes() {
        if (document.getElementById("cxc-ripple-wave-keyframes")) return;

        const style = document.createElement("style");
        style.id = "cxc-ripple-wave-keyframes";
        style.textContent = `
@keyframes cxcRippleWave {
  0% {
    width: 20%;
    height: 20%;
    opacity: 0.8;
  }
  100% {
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}`;
        document.head.appendChild(style);
    }

    /**
     * Get loader CSS code
     * @param {Object} config - Configuration options
     * @returns {string} CSS code
     */
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const animationDuration = (3.0 / config.speed).toFixed(2);
        
        // Create color variations
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        return `.cxc-wave-ripple {
  width: ${config.size || "60px"};
  height: ${config.size || "60px"};
  position: relative;
}

.cxc-ripple-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  height: 20%;
  border-radius: 50%;
  border: 2px solid ${color};
  opacity: 0;
}

.cxc-ripple-circle:nth-child(1) {
  animation: cxcRippleWave ${animationDuration}s ease-out infinite;
}

.cxc-ripple-circle:nth-child(2) {
  animation: cxcRippleWave ${animationDuration}s ease-out infinite;
  animation-delay: 0.8s;
}

.cxc-ripple-circle:nth-child(3) {
  animation: cxcRippleWave ${animationDuration}s ease-out infinite;
  animation-delay: 1.6s;
}

.cxc-ripple-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10%;
  height: 10%;
  border-radius: 50%;
  background-color: ${color};
  box-shadow: 0 0 10px ${lighterColor};
}

@keyframes cxcRippleWave {
  0% {
    width: 20%;
    height: 20%;
    opacity: 0.8;
  }
  100% {
    width: 100%;
    height: 100%;
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
        const animationDuration = (3.0 / config.speed).toFixed(2);
        const size = config.size || "60px";
        
        // Create color variations
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        return `// Create a Ripple Wave Loader
const container = document.createElement('div');
container.style.width = '${size}';
container.style.height = '${size}';
container.style.position = 'relative';

// Create the ripple circles
const circleCount = 3;

for (let i = 0; i < circleCount; i++) {
  const circle = document.createElement('div');
  circle.style.position = 'absolute';
  circle.style.top = '50%';
  circle.style.left = '50%';
  circle.style.transform = 'translate(-50%, -50%)';
  circle.style.width = '20%';
  circle.style.height = '20%';
  circle.style.borderRadius = '50%';
  circle.style.border = '2px solid ${color}';
  circle.style.opacity = '0';
  circle.style.animation = \`rippleWave ${animationDuration}s ease-out infinite\`;
  circle.style.animationDelay = \`\${i * 0.8}s\`;
  
  container.appendChild(circle);
}

// Create center dot
const centerDot = document.createElement('div');
centerDot.style.position = 'absolute';
centerDot.style.top = '50%';
centerDot.style.left = '50%';
centerDot.style.transform = 'translate(-50%, -50%)';
centerDot.style.width = '10%';
centerDot.style.height = '10%';
centerDot.style.borderRadius = '50%';
centerDot.style.backgroundColor = '${color}';
centerDot.style.boxShadow = '0 0 10px ${lighterColor}';

container.appendChild(centerDot);

// Add it to your document
document.querySelector('.your-container').appendChild(container);

// Don't forget to add the keyframes in your CSS
/*
@keyframes rippleWave {
  0% {
    width: 20%;
    height: 20%;
    opacity: 0.8;
  }
  100% {
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
*/`;
    }

    // Helper function to convert hex to RGB
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
