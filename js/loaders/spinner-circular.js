/**
 * Circular Spinner Loader
 * An elegant circular spinner with pulsing effect
 */

(function () {
    const CATEGORY = "spinner";
    const NAME = "circular"; // This will create a loader with ID "spinner-circular"

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
        };

        const color = CXCLoader.getColor(safeConfig.color, safeConfig.shade);
        const animationDuration = (3 / safeConfig.speed).toFixed(2);

        // Create a lighter shade for glow effects
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.2)`;

        const container = document.createElement("div");
        container.className = "cxc-spinner-circular";
        container.style.width = "40px";
        container.style.height = "40px";
        container.style.position = "relative";

        // Create the circular track
        const track = document.createElement("div");
        track.className = "cxc-spinner-circular-track";
        track.style.width = "100%";
        track.style.height = "100%";
        track.style.borderRadius = "50%";
        track.style.border = "3px solid rgba(0,0,0,0.05)";
        track.style.boxSizing = "border-box";
        track.style.boxShadow = "inset 0 0 2px rgba(0,0,0,0.1)";

        // Create the progress indicator
        const progress = document.createElement("div");
        progress.className = "cxc-spinner-circular-indicator";
        progress.style.width = "100%";
        progress.style.height = "100%";
        progress.style.borderRadius = "50%";
        progress.style.border = `3px solid ${color}`;
        progress.style.borderColor = `${color} transparent transparent transparent`;
        progress.style.boxSizing = "border-box";
        progress.style.position = "absolute";
        progress.style.top = "0";
        progress.style.left = "0";
        progress.style.animation = `cxcSpinnerCircularRotate ${animationDuration}s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite`;
        progress.style.filter = `drop-shadow(0 0 1px ${color})`;

        // Create a pulsing glow effect
        const glow = document.createElement("div");
        glow.className = "cxc-spinner-circular-glow";
        glow.style.width = "100%";
        glow.style.height = "100%";
        glow.style.borderRadius = "50%";
        glow.style.position = "absolute";
        glow.style.top = "0";
        glow.style.left = "0";
        glow.style.boxShadow = `0 0 10px ${lighterColor}`;
        glow.style.animation = `cxcSpinnerCircularPulse ${animationDuration * 0.7}s ease-in-out infinite alternate`;

        container.appendChild(track);
        container.appendChild(progress);
        container.appendChild(glow);

        // Add a method to update the speed
        container.updateSpeed = function (newSpeed) {
            const newDuration = (3 / newSpeed).toFixed(2);
            const indicator = this.querySelector(".cxc-spinner-circular-indicator");
            if (indicator) {
                indicator.style.animation = `cxcSpinnerCircularRotate ${newDuration}s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite`;
            }

            const glow = this.querySelector(".cxc-spinner-circular-glow");
            if (glow) {
                glow.style.animation = `cxcSpinnerCircularPulse ${newDuration * 0.7}s ease-in-out infinite alternate`;
            }
        };

        // Add a method to update the color
        container.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const rgbColor = hexToRgb(color);
            const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.2)`;

            const indicator = this.querySelector(".cxc-spinner-circular-indicator");
            if (indicator) {
                indicator.style.borderColor = `${color} transparent transparent transparent`;
                indicator.style.filter = `drop-shadow(0 0 1px ${color})`;
            }

            const glow = this.querySelector(".cxc-spinner-circular-glow");
            if (glow) {
                glow.style.boxShadow = `0 0 10px ${lighterColor}`;
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

        // Create a lighter shade for glow effects
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.2)`;

        return `.cxc-spinner-circular {
  width: 40px;
  height: 40px;
  position: relative;
}

.cxc-spinner-circular-track {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid rgba(0,0,0,0.05);
  box-sizing: border-box;
  box-shadow: inset 0 0 2px rgba(0,0,0,0.1);
}

.cxc-spinner-circular-indicator {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid ${color};
  border-color: ${color} transparent transparent transparent;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  animation: cxcSpinnerCircularRotate ${animationDuration}s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite;
  filter: drop-shadow(0 0 1px ${color});
}

.cxc-spinner-circular-glow {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: 0 0 10px ${lighterColor};
  animation: cxcSpinnerCircularPulse ${animationDuration * 0.7}s ease-in-out infinite alternate;
}

@keyframes cxcSpinnerCircularRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes cxcSpinnerCircularPulse {
  0% { opacity: 0.3; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1.05); }
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

        // Create a lighter shade for glow effects
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.2)`;

        return `// Create a circular spinner animation
const container = document.createElement('div');
container.style.width = '40px';
container.style.height = '40px';
container.style.position = 'relative';

// Create the circular track
const track = document.createElement('div');
track.style.width = '100%';
track.style.height = '100%';
track.style.borderRadius = '50%';
track.style.border = '3px solid rgba(0,0,0,0.05)';
track.style.boxSizing = 'border-box';
track.style.boxShadow = 'inset 0 0 2px rgba(0,0,0,0.1)';

// Create the spinner indicator
const progress = document.createElement('div');
progress.style.width = '100%';
progress.style.height = '100%';
progress.style.borderRadius = '50%';
progress.style.border = '3px solid ${color}';
progress.style.borderColor = '${color} transparent transparent transparent';
progress.style.boxSizing = 'border-box';
progress.style.position = 'absolute';
progress.style.top = '0';
progress.style.left = '0';
progress.style.animation = 'spinnerCircularRotate ${animationDuration}s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite';
progress.style.filter = 'drop-shadow(0 0 1px ${color})';

// Create a pulsing glow effect
const glow = document.createElement('div');
glow.style.width = '100%';
glow.style.height = '100%';
glow.style.borderRadius = '50%';
glow.style.position = 'absolute';
glow.style.top = '0';
glow.style.left = '0';
glow.style.boxShadow = '0 0 10px ${lighterColor}';
glow.style.animation = 'spinnerCircularPulse ${animationDuration * 0.7}s ease-in-out infinite alternate';

container.appendChild(track);
container.appendChild(progress);
container.appendChild(glow);

// Add it to your document
document.querySelector('.your-container').appendChild(container);

// Don't forget to add the keyframes in your CSS
/*
@keyframes spinnerCircularRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes spinnerCircularPulse {
  0% { opacity: 0.3; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1.05); }
}
*/`;
    }

    /**
     * Ensure animation keyframes are added to the document
     */
    function ensureKeyframes() {
        if (!document.getElementById("cxc-spinner-circular-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-spinner-circular-keyframes";
            style.textContent = `
        @keyframes cxcSpinnerCircularRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes cxcSpinnerCircularPulse {
          0% { opacity: 0.3; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1.05); }
        }
      `;
            document.head.appendChild(style);
        }
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

    // Register loader
    CXCLoader.registerLoader(CATEGORY, NAME, createLoader, generateCSS, generateJS);

    // Log registration
    console.log(`Registered loader: ${CATEGORY}-${NAME}`);

    // Force registration to global object
    if (!window.CXCLoader.loaderExists(CATEGORY, NAME)) {
        console.warn(`Loader ${CATEGORY}-${NAME} not properly registered, forcing registration...`);
        window.CXCLoader.registerLoader(CATEGORY, NAME, createLoader, generateCSS, generateJS);
    }
})();
