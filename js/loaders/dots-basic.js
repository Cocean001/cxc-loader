/**
 * CXC-Loader - Basic Dots
 * A simple dots loader
 */

(function () {
    // Category and name for this loader
    const CATEGORY = "dots";
    const NAME = "basic";

    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement("div");
        container.className = "cxc-dots-basic";

        // Create dots
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement("div");
            dot.className = "cxc-basic-dot";
            container.appendChild(dot);
        }

        // Apply custom styles
        applyStyles(container, config);

        return container;
    }

    // Apply styles based on configuration
    function applyStyles(element, config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "10px";
        const gap = config.gap || "5px";
        const speed = config.speed || 1.0;
        const duration = (1.4 / speed).toFixed(2) + "s";

        // Set CSS variables
        element.style.setProperty("--dots-basic-color", color);
        element.style.setProperty("--dots-basic-size", size);
        element.style.setProperty("--dots-basic-gap", gap);
        element.style.setProperty("--dots-basic-duration", duration);

        // Apply inline styles for better compatibility
        element.style.display = "flex";
        element.style.alignItems = "center";
        element.style.gap = gap;

        // Apply styles to dots
        const dots = element.querySelectorAll(".cxc-basic-dot");
        dots.forEach((dot, index) => {
            dot.style.width = size;
            dot.style.height = size;
            dot.style.backgroundColor = color;
            dot.style.borderRadius = "50%";
            dot.style.animation = `cxc-dots-basic-pulse ${duration} infinite ease-in-out`;

            // Set different delays for each dot
            if (index === 0) {
                dot.style.animationDelay = "-0.32s";
            } else if (index === 1) {
                dot.style.animationDelay = "-0.16s";
            }
        });

        // Add keyframes if they don't exist
        if (!document.getElementById("cxc-dots-basic-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-dots-basic-keyframes";
            style.textContent = `
                @keyframes cxc-dots-basic-pulse {
                    0%, 80%, 100% {
                        transform: scale(0);
                        opacity: 0.2;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Generate CSS for this loader
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "10px";
        const gap = config.gap || "5px";
        const speed = config.speed || 1.0;
        const duration = (1.4 / speed).toFixed(2) + "s";

        return `
/* Basic Dots Loader */
.cxc-dots-basic {
    display: flex;
    align-items: center;
    gap: ${gap};
}

.cxc-basic-dot {
    width: ${size};
    height: ${size};
    background-color: ${color};
    border-radius: 50%;
    animation: cxc-dots-basic-pulse ${duration} infinite ease-in-out;
}

.cxc-basic-dot:nth-child(1) {
    animation-delay: -0.32s;
}

.cxc-basic-dot:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes cxc-dots-basic-pulse {
    0%, 80%, 100% {
        transform: scale(0);
        opacity: 0.2;
    }
    40% {
        transform: scale(1);
        opacity: 1;
    }
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        return `
// Create a basic dots loader
function createBasicDots(config = {}) {
    // Default configuration
    const defaultConfig = {
        color: '${config.color}',
        shade: ${config.shade},
        size: '10px',
        gap: '5px',
        speed: ${config.speed}
    };

    // Merge configurations
    const mergedConfig = {...defaultConfig, ...config};

    // Create container
    const container = document.createElement('div');
    container.className = 'cxc-dots-basic';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = mergedConfig.gap;

    // Get animation duration based on speed
    const duration = (1.4 / mergedConfig.speed).toFixed(2) + 's';

    // Create dots
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'cxc-basic-dot';
        dot.style.width = mergedConfig.size;
        dot.style.height = mergedConfig.size;
        dot.style.backgroundColor = mergedConfig.color;
        dot.style.borderRadius = '50%';
        dot.style.animation = \`cxc-dots-basic-pulse \${duration} infinite ease-in-out\`;

        // Set different delays for each dot
        if (i === 0) {
            dot.style.animationDelay = '-0.32s';
        } else if (i === 1) {
            dot.style.animationDelay = '-0.16s';
        }

        container.appendChild(dot);
    }

    // Add keyframes if they don't exist
    if (!document.getElementById('cxc-dots-basic-keyframes')) {
        const style = document.createElement('style');
        style.id = 'cxc-dots-basic-keyframes';
        style.textContent = \`
            @keyframes cxc-dots-basic-pulse {
                0%, 80%, 100% {
                    transform: scale(0);
                    opacity: 0.2;
                }
                40% {
                    transform: scale(1);
                    opacity: 1;
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
})();
