/**
 * Progress Bar Loader
 * An elegant horizontal progress bar with a smooth loading effect
 */

(function () {
    const CATEGORY = "progress";
    const NAME = "bar"; // This will create a loader with ID "progress-bar"

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

        // Create a lighter shade for subtle effects
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        const container = document.createElement("div");
        container.className = "cxc-progress-bar";
        container.style.width = "140px";
        container.style.height = "6px";
        container.style.backgroundColor = "rgba(0,0,0,0.05)";
        container.style.borderRadius = "8px";
        container.style.overflow = "hidden";
        container.style.position = "relative";
        container.style.padding = "2px";
        container.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.1)";

        const bar = document.createElement("div");
        bar.className = "cxc-progress-bar-fill";
        bar.style.height = "100%";
        bar.style.width = "30%";
        bar.style.backgroundColor = color;
        bar.style.position = "absolute";
        bar.style.left = "0";
        bar.style.top = "0";
        bar.style.borderRadius = "4px";
        bar.style.boxShadow = `0 0 8px ${lighterColor}`;
        bar.style.animation = `cxcProgressBarAnim ${animationDuration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`;

        container.appendChild(bar);

        // Add a method to update the progress bar's speed
        container.updateSpeed = function (newSpeed) {
            const newDuration = (3 / newSpeed).toFixed(2);
            const bar = this.querySelector(".cxc-progress-bar-fill");
            if (bar) {
                bar.style.animation = `cxcProgressBarAnim ${newDuration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`;
            }
        };

        // Add a method to update the progress bar's color
        container.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const rgbColor = hexToRgb(color);
            const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

            const bar = this.querySelector(".cxc-progress-bar-fill");
            if (bar) {
                bar.style.backgroundColor = color;
                bar.style.boxShadow = `0 0 8px ${lighterColor}`;
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

        // Create a lighter shade for subtle effects
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        return `.cxc-progress-bar {
  width: 140px;
  height: 6px;
  background-color: rgba(0,0,0,0.05);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  padding: 2px;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}

.cxc-progress-bar-fill {
  height: 100%;
  width: 30%;
  background-color: ${color};
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 4px;
  box-shadow: 0 0 8px ${lighterColor};
  animation: cxcProgressBarAnim ${animationDuration}s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes cxcProgressBarAnim {
  0% { left: -30%; }
  50% { left: 40%; }
  100% { left: 100%; }
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

        // Create a lighter shade for subtle effects
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        return `// Create a progress bar animation
const container = document.createElement('div');
container.style.width = '140px';
container.style.height = '6px';
container.style.backgroundColor = 'rgba(0,0,0,0.05)';
container.style.borderRadius = '8px';
container.style.overflow = 'hidden';
container.style.position = 'relative';
container.style.padding = '2px';
container.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.1)';

const bar = document.createElement('div');
bar.style.height = '100%';
bar.style.width = '30%';
bar.style.backgroundColor = '${color}';
bar.style.position = 'absolute';
bar.style.left = '0';
bar.style.top = '0';
bar.style.borderRadius = '4px';
bar.style.boxShadow = '0 0 8px ${lighterColor}';
bar.style.animation = 'progressBar ${animationDuration}s cubic-bezier(0.4, 0, 0.2, 1) infinite';

container.appendChild(bar);

// Add it to your document
document.querySelector('.your-container').appendChild(container);

// Don't forget to add the keyframes in your CSS
/*
@keyframes progressBar {
  0% { left: -30%; }
  50% { left: 40%; }
  100% { left: 100%; }
}
*/`;
    }

    /**
     * Ensure animation keyframes are added to the document
     */
    function ensureKeyframes() {
        if (!document.getElementById("cxc-progress-bar-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-progress-bar-keyframes";
            style.textContent = `
        @keyframes cxcProgressBarAnim {
          0% { left: -30%; }
          50% { left: 40%; }
          100% { left: 100%; }
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
