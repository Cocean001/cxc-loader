/**
 * Basic Ripple Loader
 * A circular ripple effect that expands outward
 */

(function () {
    const CATEGORY = "ripple";
    const NAME = "basic";

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
        const animationDuration = (1.5 / safeConfig.speed).toFixed(2);

        const container = document.createElement("div");
        container.className = "cxc-ripple-basic";
        container.style.width = "40px";
        container.style.height = "40px";
        container.style.position = "relative";

        // Create three ripple circles
        for (let i = 0; i < 3; i++) {
            const circle = document.createElement("div");
            circle.className = "cxc-ripple-basic-circle";
            circle.style.position = "absolute";
            circle.style.border = `2px solid ${color}`;
            circle.style.borderRadius = "50%";
            circle.style.top = "0";
            circle.style.left = "0";
            circle.style.right = "0";
            circle.style.bottom = "0";
            circle.style.opacity = "0";
            circle.style.animation = `cxcRippleBasic ${animationDuration}s ease-out infinite`;
            circle.style.animationDelay = `${(i * 0.5).toFixed(1)}s`;

            container.appendChild(circle);
        }

        // Add a method to update the ripple's speed
        container.updateSpeed = function (newSpeed) {
            const newDuration = (1.5 / newSpeed).toFixed(2);
            const circles = this.querySelectorAll(".cxc-ripple-basic-circle");
            circles.forEach((circle, i) => {
                circle.style.animation = `cxcRippleBasic ${newDuration}s ease-out infinite`;
                circle.style.animationDelay = `${(i * 0.5).toFixed(1)}s`;
            });
        };

        // Add a method to update the ripple's color
        container.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const circles = this.querySelectorAll(".cxc-ripple-basic-circle");
            circles.forEach(circle => {
                circle.style.border = `2px solid ${color}`;
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
        const animationDuration = (1.5 / config.speed).toFixed(2);

        return `.cxc-ripple-basic {
  width: 40px;
  height: 40px;
  position: relative;
}

.cxc-ripple-basic-circle {
  position: absolute;
  border: 2px solid ${color};
  border-radius: 50%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  animation: cxcRippleBasic ${animationDuration}s ease-out infinite;
}

.cxc-ripple-basic-circle:nth-child(2) {
  animation-delay: 0.5s;
}

.cxc-ripple-basic-circle:nth-child(3) {
  animation-delay: 1.0s;
}

@keyframes cxcRippleBasic {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}`;
    }

    /**
     * Get loader JS code (implementation example)
     * @param {Object} config - Configuration options
     * @returns {string} JS code
     */
    function getJS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const animationDuration = (1.5 / config.speed).toFixed(2);

        return `// Create a ripple effect animation
const container = document.createElement('div');
container.style.width = '40px';
container.style.height = '40px';
container.style.position = 'relative';

// Create three ripple circles
for (let i = 0; i < 3; i++) {
  const circle = document.createElement('div');
  circle.style.position = 'absolute';
  circle.style.border = '2px solid ${color}';
  circle.style.borderRadius = '50%';
  circle.style.top = '0';
  circle.style.left = '0';
  circle.style.right = '0';
  circle.style.bottom = '0';
  circle.style.opacity = '0';
  circle.style.animation = 'ripple ${animationDuration}s ease-out infinite';
  circle.style.animationDelay = (i * 0.5).toFixed(1) + 's';
  
  container.appendChild(circle);
}

// Add it to your document
document.querySelector('.your-container').appendChild(container);

// Don't forget to add the keyframes in your CSS
/*
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
*/`;
    }

    /**
     * Ensure animation keyframes are added to the document
     */
    function ensureKeyframes() {
        if (!document.getElementById("cxc-ripple-basic-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-ripple-basic-keyframes";
            style.textContent = `
        @keyframes cxcRippleBasic {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
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
