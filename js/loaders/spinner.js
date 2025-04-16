/**
 * CXC-Loader - Spinner
 * A simple spinning loader
 */

(function () {
    // Category and name for this loader
    const CATEGORY = "spinner";
    const NAME = "basic";

    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement("div");
        container.className = "cxc-spinner";

        // Apply custom styles
        applyStyles(container, config);

        return container;
    }

    // Apply styles based on configuration
    function applyStyles(element, config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "40px";
        const borderWidth = config.borderWidth || "4px";
        const speed = config.speed || 1.0;
        const duration = (0.8 / speed).toFixed(2) + "s";

        // Apply styles directly
        element.style.width = size;
        element.style.height = size;
        element.style.border = `${borderWidth} solid rgba(0, 0, 0, 0.1)`;
        element.style.borderRadius = "50%";
        element.style.borderTopColor = color;
        element.style.animation = `cxc-spinner-rotation ${duration} linear infinite`;

        // Add keyframes if they don't exist
        if (!document.querySelector("#cxc-spinner-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-spinner-keyframes";
            style.textContent = `
                @keyframes cxc-spinner-rotation {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Generate CSS for this loader
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "40px";
        const borderWidth = config.borderWidth || "4px";
        const speed = config.speed || 1.0;
        const duration = (0.8 / speed).toFixed(2) + "s";

        return `
/* Spinner Loader */
.cxc-spinner {
    width: ${size};
    height: ${size};
    border: ${borderWidth} solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: ${color};
    animation: cxc-spinner-rotation ${duration} linear infinite;
}

@keyframes cxc-spinner-rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        return `
// Create a spinner loader
function createSpinner(config = {}) {
    // Default configuration
    const defaultConfig = {
        color: '${config.color}',
        shade: ${config.shade},
        size: '40px',
        borderWidth: '4px',
        speed: ${config.speed}
    };

    // Merge configurations
    const mergedConfig = {...defaultConfig, ...config};

    // Create container
    const spinner = document.createElement('div');
    spinner.className = 'cxc-spinner';

    // Apply styles
    const color = mergedConfig.color;
    const size = mergedConfig.size;
    const borderWidth = mergedConfig.borderWidth;
    const speed = mergedConfig.speed;
    const duration = (0.8 / speed).toFixed(2) + 's';

    // Set inline styles
    spinner.style.width = size;
    spinner.style.height = size;
    spinner.style.border = \`\${borderWidth} solid rgba(0, 0, 0, 0.1)\`;
    spinner.style.borderRadius = '50%';
    spinner.style.borderTopColor = color;
    spinner.style.animation = \`cxc-spinner-rotation \${duration} linear infinite\`;

    return spinner;
}

// Add the keyframes if they don't exist
if (!document.querySelector('#cxc-spinner-keyframes')) {
    const style = document.createElement('style');
    style.id = 'cxc-spinner-keyframes';
    style.textContent = \`
        @keyframes cxc-spinner-rotation {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    \`;
    document.head.appendChild(style);
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
