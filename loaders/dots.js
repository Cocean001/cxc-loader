/**
 * CXC-Loader - Dots
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
        container.className = "cxc-dots";

        // Create dots
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement("div");
            dot.className = "cxc-dot";
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
        element.style.setProperty("--dots-color", color);
        element.style.setProperty("--dots-size", size);
        element.style.setProperty("--dots-gap", gap);
        element.style.setProperty("--dots-duration", duration);
    }

    // Generate CSS for this loader
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "10px";
        const gap = config.gap || "5px";
        const speed = config.speed || 1.0;
        const duration = (1.4 / speed).toFixed(2) + "s";

        return `
/* Dots Loader */
.cxc-dots {
    display: flex;
    align-items: center;
    gap: ${gap};
}

.cxc-dot {
    width: ${size};
    height: ${size};
    background-color: ${color};
    border-radius: 50%;
    animation: cxc-dots-pulse ${duration} infinite ease-in-out;
}

.cxc-dot:nth-child(1) {
    animation-delay: -0.32s;
}

.cxc-dot:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes cxc-dots-pulse {
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
// Create a dots loader
function createDots(config = {}) {
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
    container.className = 'cxc-dots';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = mergedConfig.gap;
    
    // Get animation duration based on speed
    const duration = (1.4 / mergedConfig.speed).toFixed(2) + 's';
    
    // Create dots
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'cxc-dot';
        dot.style.width = mergedConfig.size;
        dot.style.height = mergedConfig.size;
        dot.style.backgroundColor = mergedConfig.color;
        dot.style.borderRadius = '50%';
        dot.style.animation = \`cxc-dots-pulse \${duration} infinite ease-in-out\`;
        
        // Set different delays for each dot
        if (i === 0) {
            dot.style.animationDelay = '-0.32s';
        } else if (i === 1) {
            dot.style.animationDelay = '-0.16s';
        }
        
        container.appendChild(dot);
    }
    
    // Add keyframes if they don't exist
    if (!document.getElementById('cxc-dots-keyframes')) {
        const style = document.createElement('style');
        style.id = 'cxc-dots-keyframes';
        style.textContent = \`
            @keyframes cxc-dots-pulse {
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
