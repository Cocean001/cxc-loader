/**
 * Fading Dots Loader
 * Dots that fade in and out in sequence
 */

(function () {
    const CATEGORY = "dots";
    const NAME = "fade";

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
        const animationDuration = (1.2 / safeConfig.speed).toFixed(2);

        const container = document.createElement("div");
        container.className = "cxc-dots-fade";
        container.style.display = "flex";
        container.style.gap = "8px";
        container.style.alignItems = "center";

        // Create five dots
        for (let i = 0; i < 5; i++) {
            const dot = document.createElement("div");
            dot.className = "cxc-dots-fade-dot";
            dot.style.width = "8px";
            dot.style.height = "8px";
            dot.style.backgroundColor = color;
            dot.style.borderRadius = "50%";
            dot.style.opacity = "0.3";
            dot.style.animation = `cxcDotsFade ${animationDuration}s ease infinite`;
            dot.style.animationDelay = `${(i * 0.2).toFixed(1)}s`;

            container.appendChild(dot);
        }

        // Add a method to update the dots' speed
        container.updateSpeed = function (newSpeed) {
            const newDuration = (1.2 / newSpeed).toFixed(2);
            const dots = this.querySelectorAll(".cxc-dots-fade-dot");
            dots.forEach((dot, i) => {
                dot.style.animation = `cxcDotsFade ${newDuration}s ease infinite`;
                dot.style.animationDelay = `${(i * 0.2).toFixed(1)}s`;
            });
        };

        // Add a method to update the dots' color
        container.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const dots = this.querySelectorAll(".cxc-dots-fade-dot");
            dots.forEach(dot => {
                dot.style.backgroundColor = color;
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
    function getCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const animationDuration = (1.2 / config.speed).toFixed(2);

        return `.cxc-dots-fade {
  display: flex;
  gap: 8px;
  align-items: center;
}

.cxc-dots-fade-dot {
  width: 8px;
  height: 8px;
  background-color: ${color};
  border-radius: 50%;
  opacity: 0.3;
  animation: cxcDotsFade ${animationDuration}s ease infinite;
}

.cxc-dots-fade-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.cxc-dots-fade-dot:nth-child(3) {
  animation-delay: 0.4s;
}

.cxc-dots-fade-dot:nth-child(4) {
  animation-delay: 0.6s;
}

.cxc-dots-fade-dot:nth-child(5) {
  animation-delay: 0.8s;
}

@keyframes cxcDotsFade {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}`;
    }

    /**
     * Get loader JS code (implementation example)
     * @param {Object} config - Configuration options
     * @returns {string} JS code
     */
    function getJS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const animationDuration = (1.2 / config.speed).toFixed(2);

        return `// Create a fading dots animation
const container = document.createElement('div');
container.style.display = 'flex';
container.style.gap = '8px';
container.style.alignItems = 'center';

// Create five dots
for (let i = 0; i < 5; i++) {
  const dot = document.createElement('div');
  dot.style.width = '8px';
  dot.style.height = '8px';
  dot.style.backgroundColor = '${color}';
  dot.style.borderRadius = '50%';
  dot.style.opacity = '0.3';
  dot.style.animation = 'dotsFade ${animationDuration}s ease infinite';
  dot.style.animationDelay = (i * 0.2).toFixed(1) + 's';
  
  container.appendChild(dot);
}

// Add it to your document
document.querySelector('.your-container').appendChild(container);

// Don't forget to add the keyframes in your CSS
/*
@keyframes dotsFade {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
*/`;
    }

    /**
     * Ensure animation keyframes are added to the document
     */
    function ensureKeyframes() {
        if (!document.getElementById("cxc-dots-fade-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-dots-fade-keyframes";
            style.textContent = `
        @keyframes cxcDotsFade {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
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
