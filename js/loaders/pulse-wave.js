/**
 * Pulse Wave Loader
 * A pulsing wave effect
 */

(function () {
    const CATEGORY = "pulse";
    const NAME = "wave";

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
        const animationDuration = (1.8 / safeConfig.speed).toFixed(2);

        const container = document.createElement("div");
        container.className = "cxc-pulse-wave";
        container.style.width = "72px";
        container.style.height = "72px";
        container.style.position = "relative";

        // Create the center dot
        const centerDot = document.createElement("div");
        centerDot.className = "cxc-pulse-wave-center";
        centerDot.style.position = "absolute";
        centerDot.style.top = "50%";
        centerDot.style.left = "50%";
        centerDot.style.width = "12px";
        centerDot.style.height = "12px";
        centerDot.style.marginTop = "-6px";
        centerDot.style.marginLeft = "-6px";
        centerDot.style.backgroundColor = color;
        centerDot.style.borderRadius = "50%";

        // Create three wave rings
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement("div");
            wave.className = "cxc-pulse-wave-ring";
            wave.style.position = "absolute";
            wave.style.top = "50%";
            wave.style.left = "50%";
            wave.style.width = "72px";
            wave.style.height = "72px";
            wave.style.marginTop = "-36px";
            wave.style.marginLeft = "-36px";
            wave.style.border = `2px solid ${color}`;
            wave.style.borderRadius = "50%";
            wave.style.opacity = "0";
            wave.style.animation = `cxcPulseWave ${animationDuration}s ease-out infinite`;
            wave.style.animationDelay = `${(i * 0.6).toFixed(1)}s`;

            container.appendChild(wave);
        }

        container.appendChild(centerDot);

        // Add a method to update the wave's speed
        container.updateSpeed = function (newSpeed) {
            const newDuration = (1.8 / newSpeed).toFixed(2);
            const waves = this.querySelectorAll(".cxc-pulse-wave-ring");
            waves.forEach((wave, i) => {
                wave.style.animation = `cxcPulseWave ${newDuration}s ease-out infinite`;
                wave.style.animationDelay = `${(i * 0.6).toFixed(1)}s`;
            });
        };

        // Add a method to update the wave's color
        container.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const centerDot = this.querySelector(".cxc-pulse-wave-center");
            const waves = this.querySelectorAll(".cxc-pulse-wave-ring");

            if (centerDot) {
                centerDot.style.backgroundColor = color;
            }

            waves.forEach((wave) => {
                wave.style.border = `2px solid ${color}`;
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
        const animationDuration = (1.8 / config.speed).toFixed(2);

        return `.cxc-pulse-wave {
  width: 72px;
  height: 72px;
  position: relative;
}

.cxc-pulse-wave-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  margin-top: -6px;
  margin-left: -6px;
  background-color: ${color};
  border-radius: 50%;
}

.cxc-pulse-wave-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 72px;
  height: 72px;
  margin-top: -36px;
  margin-left: -36px;
  border: 2px solid ${color};
  border-radius: 50%;
  opacity: 0;
  animation: cxcPulseWave ${animationDuration}s ease-out infinite;
}

.cxc-pulse-wave-ring:nth-child(2) {
  animation-delay: 0.6s;
}

.cxc-pulse-wave-ring:nth-child(3) {
  animation-delay: 1.2s;
}

@keyframes cxcPulseWave {
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
        const animationDuration = (1.8 / config.speed).toFixed(2);

        return `// Create a pulse wave animation
const container = document.createElement('div');
container.style.width = '72px';
container.style.height = '72px';
container.style.position = 'relative';

// Create the center dot
const centerDot = document.createElement('div');
centerDot.style.position = 'absolute';
centerDot.style.top = '50%';
centerDot.style.left = '50%';
centerDot.style.width = '12px';
centerDot.style.height = '12px';
centerDot.style.marginTop = '-6px';
centerDot.style.marginLeft = '-6px';
centerDot.style.backgroundColor = '${color}';
centerDot.style.borderRadius = '50%';

// Create three wave rings
for (let i = 0; i < 3; i++) {
  const wave = document.createElement('div');
  wave.style.position = 'absolute';
  wave.style.top = '50%';
  wave.style.left = '50%';
  wave.style.width = '72px';
  wave.style.height = '72px';
  wave.style.marginTop = '-36px';
  wave.style.marginLeft = '-36px';
  wave.style.border = '2px solid ${color}';
  wave.style.borderRadius = '50%';
  wave.style.opacity = '0';
  wave.style.animation = 'pulseWave ${animationDuration}s ease-out infinite';
  wave.style.animationDelay = (i * 0.6).toFixed(1) + 's';

  container.appendChild(wave);
}

container.appendChild(centerDot);

// Add it to your document
document.querySelector('.your-container').appendChild(container);

// Don't forget to add the keyframes in your CSS
/*
@keyframes pulseWave {
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
        if (!document.getElementById("cxc-pulse-wave-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-pulse-wave-keyframes";
            style.textContent = `
        @keyframes cxcPulseWave {
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
    CXCLoader.registerLoader(CATEGORY, NAME, create, getCSS, getJS);

    // Log registration
    console.log(`Registered loader: ${CATEGORY}-${NAME}`);

    // Force registration to global object
    if (!window.CXCLoader.loaderExists(CATEGORY, NAME)) {
        console.warn(`Loader ${CATEGORY}-${NAME} not properly registered, forcing registration...`);
        window.CXCLoader.registerLoader(CATEGORY, NAME, create, getCSS, getJS);
    }
})();
