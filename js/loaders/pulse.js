/**
 * CXC-Loader - Pulse
 * A simple pulsing loader
 */

(function () {
    // Category and name for this loader
    const CATEGORY = "pulse";
    const NAME = "basic";

    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement("div");
        container.className = "cxc-pulse";

        // Apply custom styles
        applyStyles(container, config);

        return container;
    }

    // Apply styles based on configuration
    function applyStyles(element, config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "40px";
        const speed = config.speed || 1.0;
        const duration = (1.5 / speed).toFixed(2) + "s";

        // Apply styles directly
        element.style.width = size;
        element.style.height = size;
        element.style.backgroundColor = color;
        element.style.borderRadius = "50%";
        element.style.animation = `cxc-pulse-animation ${duration} infinite ease-in-out`;

        // Add keyframes if they don't exist
        if (!document.getElementById("cxc-pulse-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-pulse-keyframes";
            style.textContent = `
                @keyframes cxc-pulse-animation {
                    0% {
                        transform: scale(0.6);
                        opacity: 0.3;
                    }
                    50% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(0.6);
                        opacity: 0.3;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Generate CSS for this loader
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "40px";
        const speed = config.speed || 1.0;
        const duration = (1.5 / speed).toFixed(2) + "s";

        return `
/* Pulse Loader */
.cxc-pulse {
    width: ${size};
    height: ${size};
    background-color: ${color};
    border-radius: 50%;
    animation: cxc-pulse-animation ${duration} infinite ease-in-out;
}

@keyframes cxc-pulse-animation {
    0% {
        transform: scale(0.6);
        opacity: 0.3;
    }
    50% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(0.6);
        opacity: 0.3;
    }
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        return `
// Create a pulse loader
function createPulse(config = {}) {
    // Default configuration
    const defaultConfig = {
        color: '${config.color}',
        shade: ${config.shade},
        size: '40px',
        speed: ${config.speed}
    };

    // Merge configurations
    const mergedConfig = {...defaultConfig, ...config};

    // Create container
    const pulse = document.createElement('div');
    pulse.className = 'cxc-pulse';

    // Apply styles
    const color = mergedConfig.color;
    const size = mergedConfig.size;
    const speed = mergedConfig.speed;
    const duration = (1.5 / speed).toFixed(2) + 's';

    // Set inline styles
    pulse.style.width = size;
    pulse.style.height = size;
    pulse.style.backgroundColor = color;
    pulse.style.borderRadius = '50%';
    pulse.style.animation = \`cxc-pulse-animation \${duration} infinite ease-in-out\`;

    // Add keyframes if they don't exist
    if (!document.getElementById('cxc-pulse-keyframes')) {
        const style = document.createElement('style');
        style.id = 'cxc-pulse-keyframes';
        style.textContent = \`
            @keyframes cxc-pulse-animation {
                0% {
                    transform: scale(0.6);
                    opacity: 0.3;
                }
                50% {
                    transform: scale(1);
                    opacity: 1;
                }
                100% {
                    transform: scale(0.6);
                    opacity: 0.3;
                }
            }
        \`;
        document.head.appendChild(style);
    }

    return pulse;
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
})();
