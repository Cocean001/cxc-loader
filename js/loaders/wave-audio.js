/**
 * Audio Wave Loader
 * An animation that mimics audio waveforms
 */

(function () {
    const CATEGORY = "wave";
    const NAME = "audio"; // This will create a loader with ID "wave-audio"

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
        const animationDuration = (1.2 / safeConfig.speed).toFixed(2);
        
        // Create color variations
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        // Create container
        const container = document.createElement("div");
        container.className = "cxc-wave-audio";
        container.style.width = safeConfig.size;
        container.style.height = safeConfig.size;
        container.style.position = "relative";
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        
        // Create the audio bars
        const barCount = 5;
        const barWidth = 4;
        const spacing = 3;
        const totalWidth = (barWidth + spacing) * barCount - spacing;
        
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement("div");
            bar.className = "cxc-audio-bar";
            bar.style.width = `${barWidth}px`;
            bar.style.height = "40%";
            bar.style.background = color;
            bar.style.borderRadius = "2px";
            bar.style.margin = `0 ${spacing/2}px`;
            bar.style.animation = `cxcAudioWave ${animationDuration}s ease-in-out infinite`;
            bar.style.animationDelay = `${i * 0.15}s`;
            bar.style.boxShadow = `0 0 5px ${lighterColor}`;
            
            container.appendChild(bar);
        }

        // Add a method to update the audio wave's speed
        container.updateSpeed = function (newSpeed) {
            const newDuration = (1.2 / newSpeed).toFixed(2);
            
            const bars = this.querySelectorAll(".cxc-audio-bar");
            bars.forEach((bar, i) => {
                bar.style.animation = `cxcAudioWave ${newDuration}s ease-in-out infinite`;
                bar.style.animationDelay = `${i * 0.15}s`;
            });
        };

        // Add a method to update the audio wave's color
        container.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const rgbColor = hexToRgb(color);
            const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;
            
            const bars = this.querySelectorAll(".cxc-audio-bar");
            bars.forEach(bar => {
                bar.style.background = color;
                bar.style.boxShadow = `0 0 5px ${lighterColor}`;
            });
        };

        // Ensure keyframes are added to the document
        ensureKeyframes();

        return container;
    }

    /**
     * Ensure the keyframes are added to the document
     */
    function ensureKeyframes() {
        if (document.getElementById("cxc-audio-wave-keyframes")) return;

        const style = document.createElement("style");
        style.id = "cxc-audio-wave-keyframes";
        style.textContent = `
@keyframes cxcAudioWave {
  0%, 100% {
    height: 15%;
  }
  50% {
    height: 70%;
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
        const animationDuration = (1.2 / config.speed).toFixed(2);
        
        // Create color variations
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        return `.cxc-wave-audio {
  width: ${config.size || "60px"};
  height: ${config.size || "60px"};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cxc-audio-bar {
  width: 4px;
  height: 40%;
  background: ${color};
  border-radius: 2px;
  margin: 0 1.5px;
  box-shadow: 0 0 5px ${lighterColor};
}

.cxc-audio-bar:nth-child(1) {
  animation: cxcAudioWave ${animationDuration}s ease-in-out infinite;
}

.cxc-audio-bar:nth-child(2) {
  animation: cxcAudioWave ${animationDuration}s ease-in-out infinite;
  animation-delay: 0.15s;
}

.cxc-audio-bar:nth-child(3) {
  animation: cxcAudioWave ${animationDuration}s ease-in-out infinite;
  animation-delay: 0.3s;
}

.cxc-audio-bar:nth-child(4) {
  animation: cxcAudioWave ${animationDuration}s ease-in-out infinite;
  animation-delay: 0.45s;
}

.cxc-audio-bar:nth-child(5) {
  animation: cxcAudioWave ${animationDuration}s ease-in-out infinite;
  animation-delay: 0.6s;
}

@keyframes cxcAudioWave {
  0%, 100% {
    height: 15%;
  }
  50% {
    height: 70%;
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
        const animationDuration = (1.2 / config.speed).toFixed(2);
        const size = config.size || "60px";
        
        // Create color variations
        const rgbColor = hexToRgb(color);
        const lighterColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;

        return `// Create an Audio Wave Loader
const container = document.createElement('div');
container.style.width = '${size}';
container.style.height = '${size}';
container.style.position = 'relative';
container.style.display = 'flex';
container.style.alignItems = 'center';
container.style.justifyContent = 'center';

// Create the audio bars
const barCount = 5;
const barWidth = 4;
const spacing = 3;

for (let i = 0; i < barCount; i++) {
  const bar = document.createElement('div');
  bar.style.width = \`\${barWidth}px\`;
  bar.style.height = '40%';
  bar.style.background = '${color}';
  bar.style.borderRadius = '2px';
  bar.style.margin = \`0 \${spacing/2}px\`;
  bar.style.animation = \`audioWave ${animationDuration}s ease-in-out infinite\`;
  bar.style.animationDelay = \`\${i * 0.15}s\`;
  bar.style.boxShadow = '0 0 5px ${lighterColor}';
  
  container.appendChild(bar);
}

// Add it to your document
document.querySelector('.your-container').appendChild(container);

// Don't forget to add the keyframes in your CSS
/*
@keyframes audioWave {
  0%, 100% {
    height: 15%;
  }
  50% {
    height: 70%;
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
