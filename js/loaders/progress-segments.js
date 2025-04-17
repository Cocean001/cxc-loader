/**
 * Segmented Progress Bar Loader
 * An elegant segmented progress bar with fluid motion
 */

(function () {
    const CATEGORY = "progress";
    const NAME = "segments"; // This will create a loader with ID "progress-segments"

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
            segments: 6, // Number of segments
        };

        const color = CXCLoader.getColor(safeConfig.color, safeConfig.shade);
        const animationDuration = (3 / safeConfig.speed).toFixed(2);

        // Create a lighter shade for subtle effects
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        const container = document.createElement("div");
        container.className = "cxc-progress-segments";
        container.style.width = "140px";
        container.style.height = "6px";
        container.style.backgroundColor = "rgba(0,0,0,0.05)";
        container.style.borderRadius = "8px";
        container.style.overflow = "hidden";
        container.style.position = "relative";
        container.style.display = "flex";
        container.style.gap = "3px";
        container.style.padding = "2px";
        container.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.1)";

        // Create segments
        for (let i = 0; i < safeConfig.segments; i++) {
            const segment = document.createElement("div");
            segment.className = "cxc-progress-segment";
            segment.style.flex = "1";
            segment.style.height = "100%";
            segment.style.backgroundColor = color;
            segment.style.borderRadius = "4px";
            segment.style.transform = "scaleY(0.6)";
            segment.style.opacity = "0";
            segment.style.boxShadow = `0 0 8px ${lighterColor}`;
            segment.style.animation = `cxcProgressSegmentAnim ${animationDuration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`;
            segment.style.animationDelay = `${(i * animationDuration) / (safeConfig.segments * 2)}s`;

            container.appendChild(segment);
        }

        // Add a method to update the speed
        container.updateSpeed = function (newSpeed) {
            const newDuration = (3 / newSpeed).toFixed(2);
            const segments = this.querySelectorAll(".cxc-progress-segment");
            segments.forEach((segment, i) => {
                segment.style.animation = `cxcProgressSegmentAnim ${newDuration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`;
                segment.style.animationDelay = `${(i * newDuration) / (safeConfig.segments * 2)}s`;
            });
        };

        // Add a method to update the color
        container.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const rgbColor = hexToRgb(color);
            const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

            const segments = this.querySelectorAll(".cxc-progress-segment");
            segments.forEach((segment) => {
                segment.style.backgroundColor = color;
                segment.style.boxShadow = `0 0 8px ${lighterColor}`;
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
        const segments = 6;

        // Create a lighter shade for subtle effects
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        let css = `.cxc-progress-segments {
  width: 140px;
  height: 6px;
  background-color: rgba(0,0,0,0.05);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  gap: 3px;
  padding: 2px;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}

.cxc-progress-segment {
  flex: 1;
  height: 100%;
  background-color: ${color};
  border-radius: 4px;
  transform: scaleY(0.6);
  opacity: 0;
  box-shadow: 0 0 8px ${lighterColor};
  animation: cxcProgressSegmentAnim ${animationDuration}s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes cxcProgressSegmentAnim {
  0% { opacity: 0; transform: scaleY(0.6); }
  20% { opacity: 1; transform: scaleY(1); }
  40%, 100% { opacity: 0; transform: scaleY(0.6); }
}`;

        // Add animation delays for each segment
        for (let i = 0; i < segments; i++) {
            const delay = (i * animationDuration) / (segments * 2);
            css += `\n\n.cxc-progress-segments .cxc-progress-segment:nth-child(${i + 1}) {
  animation-delay: ${delay}s;
}`;
        }

        return css;
    }

    /**
     * Get loader JS code (implementation example)
     * @param {Object} config - Configuration options
     * @returns {string} JS code
     */
    function generateJS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const animationDuration = (3 / config.speed).toFixed(2);
        const segments = 6;

        // Create a lighter shade for subtle effects
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        return `// Create a segmented progress bar animation
const container = document.createElement('div');
container.style.width = '140px';
container.style.height = '6px';
container.style.backgroundColor = 'rgba(0,0,0,0.05)';
container.style.borderRadius = '8px';
container.style.overflow = 'hidden';
container.style.position = 'relative';
container.style.display = 'flex';
container.style.gap = '3px';
container.style.padding = '2px';
container.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.1)';

// Create segments
for (let i = 0; i < ${segments}; i++) {
  const segment = document.createElement('div');
  segment.style.flex = '1';
  segment.style.height = '100%';
  segment.style.backgroundColor = '${color}';
  segment.style.borderRadius = '4px';
  segment.style.transform = 'scaleY(0.6)';
  segment.style.opacity = '0';
  segment.style.boxShadow = '0 0 8px ${lighterColor}';
  segment.style.animation = 'progressSegmentAnim ${animationDuration}s cubic-bezier(0.4, 0, 0.2, 1) infinite';
  segment.style.animationDelay = \`\${(i * ${animationDuration}) / (${segments} * 2)}s\`;

  container.appendChild(segment);
}

// Add it to your document
document.querySelector('.your-container').appendChild(container);

// Don't forget to add the keyframes in your CSS
/*
@keyframes progressSegmentAnim {
  0% { opacity: 0; transform: scaleY(0.6); }
  20% { opacity: 1; transform: scaleY(1); }
  40%, 100% { opacity: 0; transform: scaleY(0.6); }
}
*/`;
    }

    /**
     * Ensure animation keyframes are added to the document
     */
    function ensureKeyframes() {
        if (!document.getElementById("cxc-progress-segments-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-progress-segments-keyframes";
            style.textContent = `
        @keyframes cxcProgressSegmentAnim {
          0% { opacity: 0; transform: scaleY(0.6); }
          20% { opacity: 1; transform: scaleY(1); }
          40%, 100% { opacity: 0; transform: scaleY(0.6); }
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
