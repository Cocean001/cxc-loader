/**
 * CXC-Loader - Bouncing Dots
 * A bouncing dots loader
 */

(function () {
    // Category and name for this loader
    const CATEGORY = "dots";
    const NAME = "bounce";

    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement("div");
        container.className = "cxc-dots-bounce";

        // Create dots
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement("div");
            dot.className = "cxc-bounce-dot";
            container.appendChild(dot);
        }

        // Apply custom styles
        applyStyles(container, config);

        return container;
    }

    // Apply styles based on configuration
    function applyStyles(element, config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "12px";
        const gap = config.gap || "6px";
        const speed = config.speed || 1.0;
        const duration = (0.5 / speed).toFixed(2) + "s";

        // Apply styles to container
        element.style.display = "flex";
        element.style.alignItems = "center";
        element.style.justifyContent = "center";
        element.style.gap = gap;

        // Apply styles to dots
        const dots = element.querySelectorAll(".cxc-bounce-dot");
        dots.forEach((dot, index) => {
            dot.style.width = size;
            dot.style.height = size;
            dot.style.backgroundColor = color;
            dot.style.borderRadius = "50%";
            dot.style.animation = `cxc-bounce-animation ${duration} infinite alternate`;

            // Set different delays for each dot
            if (index === 0) {
                dot.style.animationDelay = "-0.32s";
            } else if (index === 1) {
                dot.style.animationDelay = "-0.16s";
            }
        });

        // Add keyframes if they don't exist
        if (!document.getElementById("cxc-bounce-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-bounce-keyframes";
            style.textContent = `
                @keyframes cxc-bounce-animation {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(-15px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Generate CSS for this loader
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "12px";
        const gap = config.gap || "6px";
        const speed = config.speed || 1.0;
        const duration = (0.5 / speed).toFixed(2) + "s";

        return `
/* Bouncing Dots Loader */
.cxc-dots-bounce {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${gap};
}

.cxc-bounce-dot {
    width: ${size};
    height: ${size};
    background-color: ${color};
    border-radius: 50%;
    animation: cxc-bounce-animation ${duration} infinite alternate;
}

.cxc-bounce-dot:nth-child(1) {
    animation-delay: -0.32s;
}

.cxc-bounce-dot:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes cxc-bounce-animation {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(-15px);
    }
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        return `
// Create a bouncing dots loader
function createBouncingDots(config = {}) {
    // Default configuration
    const defaultConfig = {
        color: '${config.color}',
        shade: ${config.shade},
        size: '12px',
        gap: '6px',
        speed: ${config.speed}
    };

    // Merge configurations
    const mergedConfig = {...defaultConfig, ...config};

    // Create container
    const container = document.createElement('div');
    container.className = 'cxc-dots-bounce';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.gap = mergedConfig.gap;

    // Get animation duration based on speed
    const duration = (0.5 / mergedConfig.speed).toFixed(2) + 's';

    // Create dots
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'cxc-bounce-dot';
        dot.style.width = mergedConfig.size;
        dot.style.height = mergedConfig.size;
        dot.style.backgroundColor = mergedConfig.color;
        dot.style.borderRadius = '50%';
        dot.style.animation = \`cxc-bounce-animation \${duration} infinite alternate\`;

        // Set different delays for each dot
        if (i === 0) {
            dot.style.animationDelay = '-0.32s';
        } else if (i === 1) {
            dot.style.animationDelay = '-0.16s';
        }

        container.appendChild(dot);
    }

    // Add keyframes if they don't exist
    if (!document.getElementById('cxc-bounce-keyframes')) {
        const style = document.createElement('style');
        style.id = 'cxc-bounce-keyframes';
        style.textContent = \`
            @keyframes cxc-bounce-animation {
                0% {
                    transform: translateY(0);
                }
                100% {
                    transform: translateY(-15px);
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
})();
