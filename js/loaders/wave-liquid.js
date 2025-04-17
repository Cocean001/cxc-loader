/**
 * Liquid Wave Loader
 * A fluid, flowing wave animation
 */

(function () {
    const CATEGORY = "fluid";
    const NAME = "liquid"; // This will create a loader with ID "fluid-liquid"

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
        const fadeColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.1)`;

        // Create container
        const container = document.createElement("div");
        container.className = "cxc-fluid-liquid";
        container.style.width = safeConfig.size;
        container.style.height = safeConfig.size;
        container.style.position = "relative";
        container.style.overflow = "hidden";
        container.style.borderRadius = "50%";
        container.style.boxShadow = `0 0 10px ${lighterColor}`;

        // Create the liquid wave
        const wave = document.createElement("div");
        wave.className = "cxc-liquid-wave";
        wave.style.position = "absolute";
        wave.style.bottom = "0";
        wave.style.left = "0";
        wave.style.width = "200%";
        wave.style.height = "100%";
        wave.style.background = `linear-gradient(to bottom, ${fadeColor} 0%, ${color} 80%)`;
        wave.style.borderRadius = "38%";
        wave.style.animation = `cxcLiquidWave ${animationDuration}s linear infinite`;

        container.appendChild(wave);

        // Create a second wave with different timing
        const wave2 = document.createElement("div");
        wave2.className = "cxc-liquid-wave";
        wave2.style.position = "absolute";
        wave2.style.bottom = "0";
        wave2.style.left = "0";
        wave2.style.width = "200%";
        wave2.style.height = "100%";
        wave2.style.background = `linear-gradient(to bottom, ${fadeColor} 0%, ${lighterColor} 80%)`;
        wave2.style.borderRadius = "43%";
        wave2.style.opacity = "0.6";
        wave2.style.animation = `cxcLiquidWave ${animationDuration * 1.2}s linear infinite`;
        wave2.style.animationDelay = "-0.5s";

        container.appendChild(wave2);

        // Add a method to update the wave's speed
        container.updateSpeed = function (newSpeed) {
            const newDuration = (3.0 / newSpeed).toFixed(2);

            const waves = this.querySelectorAll(".cxc-liquid-wave");
            waves[0].style.animation = `cxcLiquidWave ${newDuration}s linear infinite`;
            if (waves[1]) {
                waves[1].style.animation = `cxcLiquidWave ${newDuration * 1.2}s linear infinite`;
                waves[1].style.animationDelay = "-0.5s";
            }
        };

        // Add a method to update the wave's color
        container.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const rgbColor = hexToRgb(color);
            const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;
            const fadeColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.1)`;

            this.style.boxShadow = `0 0 10px ${lighterColor}`;

            const waves = this.querySelectorAll(".cxc-liquid-wave");
            if (waves[0]) {
                waves[0].style.background = `linear-gradient(to bottom, ${fadeColor} 0%, ${color} 80%)`;
            }
            if (waves[1]) {
                waves[1].style.background = `linear-gradient(to bottom, ${fadeColor} 0%, ${lighterColor} 80%)`;
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
        if (document.getElementById("cxc-liquid-wave-keyframes")) return;

        const style = document.createElement("style");
        style.id = "cxc-liquid-wave-keyframes";
        style.textContent = `
@keyframes cxcLiquidWave {
  0% {
    transform: translate(-50%, 0) rotateZ(0deg);
  }
  50% {
    transform: translate(-30%, 2%) rotateZ(180deg);
  }
  100% {
    transform: translate(-50%, 0) rotateZ(360deg);
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
        const fadeColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.1)`;

        return `.cxc-fluid-liquid {
  width: ${config.size || "60px"};
  height: ${config.size || "60px"};
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0 0 10px ${lighterColor};
}

.cxc-liquid-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  border-radius: 38%;
}

.cxc-liquid-wave:nth-child(1) {
  background: linear-gradient(to bottom, ${fadeColor} 0%, ${color} 80%);
  animation: cxcLiquidWave ${animationDuration}s linear infinite;
}

.cxc-liquid-wave:nth-child(2) {
  background: linear-gradient(to bottom, ${fadeColor} 0%, ${lighterColor} 80%);
  border-radius: 43%;
  opacity: 0.6;
  animation: cxcLiquidWave ${animationDuration * 1.2}s linear infinite;
  animation-delay: -0.5s;
}

@keyframes cxcLiquidWave {
  0% {
    transform: translate(-50%, 0) rotateZ(0deg);
  }
  50% {
    transform: translate(-30%, 2%) rotateZ(180deg);
  }
  100% {
    transform: translate(-50%, 0) rotateZ(360deg);
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
        const fadeColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.1)`;

        return `// Create a Liquid Wave Loader
const container = document.createElement('div');
container.style.width = '${size}';
container.style.height = '${size}';
container.style.position = 'relative';
container.style.overflow = 'hidden';
container.style.borderRadius = '50%';
container.style.boxShadow = '0 0 10px ${lighterColor}';

// Create the liquid wave
const wave = document.createElement('div');
wave.style.position = 'absolute';
wave.style.bottom = '0';
wave.style.left = '0';
wave.style.width = '200%';
wave.style.height = '100%';
wave.style.background = 'linear-gradient(to bottom, ${fadeColor} 0%, ${color} 80%)';
wave.style.borderRadius = '38%';
wave.style.animation = \`liquidWave ${animationDuration}s linear infinite\`;

container.appendChild(wave);

// Create a second wave with different timing
const wave2 = document.createElement('div');
wave2.style.position = 'absolute';
wave2.style.bottom = '0';
wave2.style.left = '0';
wave2.style.width = '200%';
wave2.style.height = '100%';
wave2.style.background = 'linear-gradient(to bottom, ${fadeColor} 0%, ${lighterColor} 80%)';
wave2.style.borderRadius = '43%';
wave2.style.opacity = '0.6';
wave2.style.animation = \`liquidWave ${animationDuration * 1.2}s linear infinite\`;
wave2.style.animationDelay = '-0.5s';

container.appendChild(wave2);

// Add it to your document
document.querySelector('.your-container').appendChild(container);

// Don't forget to add the keyframes in your CSS
/*
@keyframes liquidWave {
  0% {
    transform: translate(-50%, 0) rotateZ(0deg);
  }
  50% {
    transform: translate(-30%, 2%) rotateZ(180deg);
  }
  100% {
    transform: translate(-50%, 0) rotateZ(360deg);
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
