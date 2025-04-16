/**
 * Progress Bar Loader
 * A simple horizontal progress bar with a loading effect
 */

(function () {
    const CATEGORY = "progress";
    const NAME = "bar";

    /**
     * Create loader DOM element
     * @param {Object} config - Configuration options
     * @returns {HTMLElement} Loader DOM element
     */
    function create(config) {
        // Make sure we have valid config values
        const safeConfig = {
            color: config.color || "blue",
            shade: config.shade || 500,
            speed: config.speed || 1.0,
        };

        const color = CXCLoader.getColor(safeConfig.color, safeConfig.shade);
        const animationDuration = (3 / safeConfig.speed).toFixed(2);

        const container = document.createElement("div");
        container.className = "cxc-progress-bar";
        container.style.width = "100px";
        container.style.height = "10px";
        container.style.backgroundColor = "#eee";
        container.style.borderRadius = "5px";
        container.style.overflow = "hidden";
        container.style.position = "relative";

        const bar = document.createElement("div");
        bar.className = "cxc-progress-bar-fill";
        bar.style.height = "100%";
        bar.style.width = "30%";
        bar.style.backgroundColor = color;
        bar.style.position = "absolute";
        bar.style.left = "0";
        bar.style.top = "0";
        bar.style.animation = `cxcProgressBarAnim ${animationDuration}s ease-in-out infinite`;

        container.appendChild(bar);

        // Add a method to update the progress bar's speed
        container.updateSpeed = function (newSpeed) {
            const newDuration = (3 / newSpeed).toFixed(2);
            const bar = this.querySelector(".cxc-progress-bar-fill");
            if (bar) {
                bar.style.animation = `cxcProgressBarAnim ${newDuration}s ease-in-out infinite`;
            }
        };

        // Add a method to update the progress bar's color
        container.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const bar = this.querySelector(".cxc-progress-bar-fill");
            if (bar) {
                bar.style.backgroundColor = color;
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
    function getCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const animationDuration = (3 / config.speed).toFixed(2);

        return `.cxc-progress-bar {
  width: 100px;
  height: 10px;
  background-color: #eee;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.cxc-progress-bar-fill {
  height: 100%;
  width: 30%;
  background-color: ${color};
  position: absolute;
  left: 0;
  top: 0;
  animation: cxcProgressBarAnim ${animationDuration}s ease-in-out infinite;
}

@keyframes cxcProgressBarAnim {
  0% { left: -30%; }
  100% { left: 100%; }
}`;
    }

    /**
     * Get loader JS code (implementation example)
     * @param {Object} config - Configuration options
     * @returns {string} JS code
     */
    function getJS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const animationDuration = (3 / config.speed).toFixed(2);

        return `// Create a progress bar animation
const container = document.createElement('div');
container.style.width = '100px';
container.style.height = '10px';
container.style.backgroundColor = '#eee';
container.style.borderRadius = '5px';
container.style.overflow = 'hidden';
container.style.position = 'relative';

const bar = document.createElement('div');
bar.style.height = '100%';
bar.style.width = '30%';
bar.style.backgroundColor = '${color}';
bar.style.position = 'absolute';
bar.style.left = '0';
bar.style.top = '0';
bar.style.animation = 'progressBar ${animationDuration}s ease-in-out infinite';

container.appendChild(bar);

// Add it to your document
document.querySelector('.your-container').appendChild(container);

// Don't forget to add the keyframes in your CSS
/*
@keyframes progressBar {
  0% { left: -30%; }
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
          100% { left: 100%; }
        }
      `;
            document.head.appendChild(style);
        }
    }

    // Register loader
    CXCLoader.registerLoader(CATEGORY, NAME, {
        create,
        getCSS,
        getJS,
    });
})();
