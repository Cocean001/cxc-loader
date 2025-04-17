/**
 * CXC-Loader - Jelly Merge
 * A jelly-like animation that merges and transforms
 */

(function () {
    // Category and name for this loader
    const CATEGORY = "jelly";
    const NAME = "merge";

    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement("div");
        container.className = "cxc-jelly-merge";

        // Apply custom styles
        applyStyles(container, config);

        return container;
    }

    // Apply styles based on configuration
    function applyStyles(element, config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "24px";
        const speed = config.speed || 1.0;
        const duration = (1.6 / speed).toFixed(2) + "s";

        // Apply styles to container
        element.style.width = size;
        element.style.height = size;
        element.style.backgroundColor = color;
        element.style.borderRadius = "50%";
        element.style.animation = `cxc-jelly-merge-animation ${duration} ease-in-out infinite`;

        // Add keyframes if they don't exist
        if (!document.getElementById("cxc-jelly-merge-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-jelly-merge-keyframes";
            style.textContent = `
                @keyframes cxc-jelly-merge-animation {
                    0%, 100% {
                        transform: scale(1);
                        border-radius: 50%;
                    }
                    25% {
                        transform: scale(1.1, 0.9) translateX(5px);
                        border-radius: 45% 55% 55% 45%;
                    }
                    50% {
                        transform: scale(1.2, 0.8) translateX(0);
                        border-radius: 50%;
                    }
                    75% {
                        transform: scale(0.9, 1.1) translateX(-5px);
                        border-radius: 55% 45% 45% 55%;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Generate CSS for this loader
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "24px";
        const speed = config.speed || 1.0;
        const duration = (1.6 / speed).toFixed(2);

        return `
/* Jelly Merge Loader */
.cxc-jelly-merge {
    width: ${size};
    height: ${size};
    background-color: ${color};
    border-radius: 50%;
    animation: cxc-jelly-merge-animation ${duration}s ease-in-out infinite;
}

@keyframes cxc-jelly-merge-animation {
    0%, 100% {
        transform: scale(1);
        border-radius: 50%;
    }
    25% {
        transform: scale(1.1, 0.9) translateX(5px);
        border-radius: 45% 55% 55% 45%;
    }
    50% {
        transform: scale(1.2, 0.8) translateX(0);
        border-radius: 50%;
    }
    75% {
        transform: scale(0.9, 1.1) translateX(-5px);
        border-radius: 55% 45% 45% 55%;
    }
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        return `
// Create a jelly merge loader
function createJellyMerge(config = {}) {
    // Default configuration
    const defaultConfig = {
        color: '${config.color}',
        shade: ${config.shade},
        size: '24px',
        speed: ${config.speed}
    };

    // Merge configurations
    const mergedConfig = {...defaultConfig, ...config};

    // Create jelly element
    const jelly = document.createElement('div');
    jelly.style.width = mergedConfig.size;
    jelly.style.height = mergedConfig.size;
    jelly.style.backgroundColor = mergedConfig.color;
    jelly.style.borderRadius = '50%';

    // Calculate animation duration based on speed
    const duration = (1.6 / mergedConfig.speed).toFixed(2);
    jelly.style.animation = \`cxc-jelly-merge-animation \${duration}s ease-in-out infinite\`;

    // Add keyframes if they don't exist
    if (!document.getElementById('cxc-jelly-merge-keyframes')) {
        const style = document.createElement('style');
        style.id = 'cxc-jelly-merge-keyframes';
        style.textContent = \`
            @keyframes cxc-jelly-merge-animation {
                0%, 100% {
                    transform: scale(1);
                    border-radius: 50%;
                }
                25% {
                    transform: scale(1.1, 0.9) translateX(5px);
                    border-radius: 45% 55% 55% 45%;
                }
                50% {
                    transform: scale(1.2, 0.8) translateX(0);
                    border-radius: 50%;
                }
                75% {
                    transform: scale(0.9, 1.1) translateX(-5px);
                    border-radius: 55% 45% 45% 55%;
                }
            }
        \`;
        document.head.appendChild(style);
    }

    return jelly;
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
