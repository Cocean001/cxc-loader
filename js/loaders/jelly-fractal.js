/**
 * CXC-Loader - Jelly Fractal
 * A morphing jelly loader with fractal-like transformation
 */

(function () {
    // Category and name for this loader
    const CATEGORY = "jelly";
    const NAME = "fractal";

    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement("div");
        container.className = "jelly-fractal";

        // Apply custom styles
        applyStyles(container, config);

        return container;
    }

    // Apply styles based on configuration
    function applyStyles(element, config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "60px";
        const speed = config.speed || 1.0;
        const duration = (1.5 / speed).toFixed(2) + "s";

        // Apply styles to container
        element.style.position = "relative";
        element.style.width = size;
        element.style.height = size;
        element.style.backgroundColor = color;
        element.style.borderRadius = "50%";
        element.style.animation = `jelly ${duration} infinite ease-in-out`;

        // Add keyframes if they don't exist
        if (!document.getElementById("jelly-keyframes")) {
            const style = document.createElement("style");
            style.id = "jelly-keyframes";
            style.textContent = `
                @keyframes jelly {
                    0%, 100% { transform: scale(1); }
                    50% {
                        transform: scale(1.3) rotate(45deg);
                        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Generate CSS for this loader
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "60px";
        const speed = config.speed || 1.0;
        const duration = (1.5 / speed).toFixed(2) + "s";

        return `
/* Jelly Fractal Loader */
.jelly-fractal {
    position: relative;
    width: ${size};
    height: ${size};
    background-color: ${color};
    border-radius: 50%;
    animation: jelly ${duration} infinite ease-in-out;
}

@keyframes jelly {
    0%, 100% { transform: scale(1); }
    50% {
        transform: scale(1.3) rotate(45deg);
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    }
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        return `
// Create a jelly fractal loader
function createJellyFractal(config = {}) {
    // Default configuration
    const defaultConfig = {
        color: '${config.color}',
        shade: ${config.shade},
        size: '60px',
        speed: ${config.speed}
    };

    // Merge configurations
    const mergedConfig = {...defaultConfig, ...config};

    // Create container
    const container = document.createElement('div');
    container.className = 'jelly-fractal';
    container.style.position = 'relative';
    container.style.width = mergedConfig.size;
    container.style.height = mergedConfig.size;
    container.style.backgroundColor = mergedConfig.color;
    container.style.borderRadius = '50%';

    // Get animation duration based on speed
    const duration = (1.5 / mergedConfig.speed).toFixed(2) + 's';
    container.style.animation = \`jelly \${duration} infinite ease-in-out\`;

    // Add keyframes if they don't exist
    if (!document.getElementById('jelly-keyframes')) {
        const style = document.createElement('style');
        style.id = 'jelly-keyframes';
        style.textContent = \`
            @keyframes jelly {
                0%, 100% { transform: scale(1); }
                50% {
                    transform: scale(1.3) rotate(45deg);
                    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
                }
            }
        \`;
        document.head.appendChild(style);
    }

    return container;
}`;
    }

    // Register this loader
    CXCLoader.registerLoader(CATEGORY, NAME, createLoader, generateCSS, generateJS);

    // Log registration
    console.log(`Registered loader: ${CATEGORY}-${NAME}`);

    // Force registration to global object
    if (!window.CXCLoader.loaderExists(CATEGORY, NAME)) {
        console.warn(`Loader ${CATEGORY}-${NAME} not properly registered, forcing registration...`);
        window.CXCLoader.registerLoader(CATEGORY, NAME, createLoader, generateCSS, generateJS);
    }

    // Expose the create function globally for direct access
    window.createJellyFractal = function (config = {}) {
        return createLoader(config);
    };
})();
