/**
 * Triple Spinner Loader
 * Three concentric spinners rotating at different speeds
 */

(function () {
    const CATEGORY = "spinner";
    const NAME = "triple";

    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement("div");
        container.className = "cxc-spinner-triple";

        // Create rings
        const outerRing = document.createElement("div");
        outerRing.className = "cxc-spinner-triple-outer";
        container.appendChild(outerRing);

        const middleRing = document.createElement("div");
        middleRing.className = "cxc-spinner-triple-middle";
        container.appendChild(middleRing);

        const innerRing = document.createElement("div");
        innerRing.className = "cxc-spinner-triple-inner";
        container.appendChild(innerRing);

        // Apply custom styles
        applyStyles(container, config);

        return container;
    }

    // Apply styles based on configuration
    function applyStyles(element, config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "40px";
        const speed = config.speed || 1.0;
        const baseDuration = (1.5 / speed).toFixed(2) + "s";

        // Apply styles to container
        element.style.position = "relative";
        element.style.width = size;
        element.style.height = size;

        // Get rings
        const outerRing = element.querySelector(".cxc-spinner-triple-outer");
        const middleRing = element.querySelector(".cxc-spinner-triple-middle");
        const innerRing = element.querySelector(".cxc-spinner-triple-inner");

        // Apply styles to outer ring
        if (outerRing) {
            outerRing.style.position = "absolute";
            outerRing.style.width = size;
            outerRing.style.height = size;
            outerRing.style.border = "3px solid transparent";
            outerRing.style.borderTopColor = color;
            outerRing.style.borderRadius = "50%";
            outerRing.style.animation = `cxc-spinner-triple-spin ${baseDuration} linear infinite`;
        }

        // Apply styles to middle ring
        if (middleRing) {
            middleRing.style.position = "absolute";
            middleRing.style.width = "30px";
            middleRing.style.height = "30px";
            middleRing.style.top = "5px";
            middleRing.style.left = "5px";
            middleRing.style.border = "3px solid transparent";
            middleRing.style.borderRightColor = color;
            middleRing.style.borderRadius = "50%";
            middleRing.style.animation = `cxc-spinner-triple-spin-reverse ${((1.5 / speed) * 0.8).toFixed(2)}s linear infinite`;
        }

        // Apply styles to inner ring
        if (innerRing) {
            innerRing.style.position = "absolute";
            innerRing.style.width = "20px";
            innerRing.style.height = "20px";
            innerRing.style.top = "10px";
            innerRing.style.left = "10px";
            innerRing.style.border = "3px solid transparent";
            innerRing.style.borderBottomColor = color;
            innerRing.style.borderLeftColor = color;
            innerRing.style.borderRadius = "50%";
            innerRing.style.animation = `cxc-spinner-triple-spin ${((1.5 / speed) * 0.6).toFixed(2)}s linear infinite`;
        }

        // Add keyframes if they don't exist
        if (!document.getElementById("cxc-spinner-triple-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-spinner-triple-keyframes";
            style.textContent = `
                @keyframes cxc-spinner-triple-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes cxc-spinner-triple-spin-reverse {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(-360deg); }
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
        const baseDuration = (1.5 / speed).toFixed(2);

        return `
/* Triple Spinner Loader */
.cxc-spinner-triple {
    position: relative;
    width: ${size};
    height: ${size};
}

.cxc-spinner-triple-outer {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-top-color: ${color};
    border-radius: 50%;
    animation: cxc-spinner-triple-spin ${baseDuration}s linear infinite;
}

.cxc-spinner-triple-middle {
    position: absolute;
    width: 30px;
    height: 30px;
    top: 5px;
    left: 5px;
    border: 3px solid transparent;
    border-right-color: ${color};
    border-radius: 50%;
    animation: cxc-spinner-triple-spin-reverse ${(baseDuration * 0.8).toFixed(2)}s linear infinite;
}

.cxc-spinner-triple-inner {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 10px;
    left: 10px;
    border: 3px solid transparent;
    border-bottom-color: ${color};
    border-left-color: ${color};
    border-radius: 50%;
    animation: cxc-spinner-triple-spin ${(baseDuration * 0.6).toFixed(2)}s linear infinite;
}

@keyframes cxc-spinner-triple-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes cxc-spinner-triple-spin-reverse {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(-360deg); }
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        return `
// Create a triple spinner loader
function createTripleSpinner(config = {}) {
    // Default configuration
    const defaultConfig = {
        color: '${config.color}',
        shade: ${config.shade},
        size: '40px',
        speed: ${config.speed}
    };

    // Merge configurations
    const mergedConfig = {...defaultConfig, ...config};

    // Get color and animation durations
    const color = mergedConfig.color;
    const baseDuration = (1.5 / mergedConfig.speed).toFixed(2);

    // Create container
    const container = document.createElement('div');
    container.className = 'cxc-spinner-triple';
    container.style.position = 'relative';
    container.style.width = mergedConfig.size;
    container.style.height = mergedConfig.size;

    // Create outer ring
    const outerRing = document.createElement('div');
    outerRing.className = 'cxc-spinner-triple-outer';
    outerRing.style.position = 'absolute';
    outerRing.style.width = '100%';
    outerRing.style.height = '100%';
    outerRing.style.border = '3px solid transparent';
    outerRing.style.borderTopColor = color;
    outerRing.style.borderRadius = '50%';
    outerRing.style.animation = \`cxc-spinner-triple-spin \${baseDuration}s linear infinite\`;

    // Create middle ring
    const middleRing = document.createElement('div');
    middleRing.className = 'cxc-spinner-triple-middle';
    middleRing.style.position = 'absolute';
    middleRing.style.width = '30px';
    middleRing.style.height = '30px';
    middleRing.style.top = '5px';
    middleRing.style.left = '5px';
    middleRing.style.border = '3px solid transparent';
    middleRing.style.borderRightColor = color;
    middleRing.style.borderRadius = '50%';
    middleRing.style.animation = \`cxc-spinner-triple-spin-reverse \${(baseDuration * 0.8).toFixed(2)}s linear infinite\`;

    // Create inner ring
    const innerRing = document.createElement('div');
    innerRing.className = 'cxc-spinner-triple-inner';
    innerRing.style.position = 'absolute';
    innerRing.style.width = '20px';
    innerRing.style.height = '20px';
    innerRing.style.top = '10px';
    innerRing.style.left = '10px';
    innerRing.style.border = '3px solid transparent';
    innerRing.style.borderBottomColor = color;
    innerRing.style.borderLeftColor = color;
    innerRing.style.borderRadius = '50%';
    innerRing.style.animation = \`cxc-spinner-triple-spin \${(baseDuration * 0.6).toFixed(2)}s linear infinite\`;

    // Add rings to container
    container.appendChild(outerRing);
    container.appendChild(middleRing);
    container.appendChild(innerRing);

    // Add keyframes if they don't exist
    if (!document.getElementById('cxc-spinner-triple-keyframes')) {
        const style = document.createElement('style');
        style.id = 'cxc-spinner-triple-keyframes';
        style.textContent = \`
            @keyframes cxc-spinner-triple-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes cxc-spinner-triple-spin-reverse {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(-360deg); }
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
})();
