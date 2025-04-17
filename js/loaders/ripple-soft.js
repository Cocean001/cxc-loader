/**
 * CXC-Loader - Soft Ripple
 * A soft ripple effect loader with a core and expanding rings
 */

(function () {
    // Category and name for this loader
    const CATEGORY = "ripple";
    const NAME = "soft";

    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement("div");
        container.className = "cxc-ripple-soft";

        // Create core
        const core = document.createElement("div");
        core.className = "cxc-ripple-soft-core";
        container.appendChild(core);

        // Create rings
        for (let i = 0; i < 3; i++) {
            const ring = document.createElement("div");
            ring.className = "cxc-ripple-soft-ring";
            container.appendChild(ring);
        }

        // Apply custom styles
        applyStyles(container, config);

        return container;
    }

    // Apply styles based on configuration
    function applyStyles(element, config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "38px";
        const speed = config.speed || 1.0;
        const duration = (1.6 / speed).toFixed(2) + "s";

        // Apply styles to container
        element.style.position = "relative";
        element.style.width = size;
        element.style.height = size;

        // Get core and rings
        const core = element.querySelector(".cxc-ripple-soft-core");
        const rings = element.querySelectorAll(".cxc-ripple-soft-ring");

        // Calculate core size (25% of container)
        const coreSize = `calc(${size} * 0.25)`;

        // Apply styles to core
        if (core) {
            core.style.position = "absolute";
            core.style.top = "50%";
            core.style.left = "50%";
            core.style.width = coreSize;
            core.style.height = coreSize;
            core.style.backgroundColor = color;
            core.style.borderRadius = "50%";
            core.style.transform = "translate(-50%, -50%)";
            core.style.zIndex = "2";
        }

        // Apply styles to rings
        rings.forEach((ring, index) => {
            ring.style.position = "absolute";
            ring.style.top = "50%";
            ring.style.left = "50%";
            ring.style.width = "100%";
            ring.style.height = "100%";
            ring.style.border = `2px solid ${color}`;
            ring.style.borderRadius = "50%";
            ring.style.transform = "translate(-50%, -50%) scale(0.3)";
            ring.style.opacity = "0.4";
            ring.style.animation = `cxc-ripple-soft-animation ${duration} ease-out infinite`;

            // Set different delays for each ring
            if (index === 0) {
                ring.style.animationDelay = "0s";
            } else if (index === 1) {
                ring.style.animationDelay = "0.4s";
            } else if (index === 2) {
                ring.style.animationDelay = "0.8s";
            }
        });

        // Add keyframes if they don't exist
        if (!document.getElementById("cxc-ripple-soft-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-ripple-soft-keyframes";
            style.textContent = `
                @keyframes cxc-ripple-soft-animation {
                    0% {
                        transform: translate(-50%, -50%) scale(0.3);
                        opacity: 0.4;
                    }
                    70% {
                        transform: translate(-50%, -50%) scale(3);
                        opacity: 0;
                    }
                    100% {
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Generate CSS for this loader
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "38px";
        const speed = config.speed || 1.0;
        const duration = (1.6 / speed).toFixed(2);

        return `
/* Soft Ripple Loader */
.cxc-ripple-soft {
    position: relative;
    width: ${size};
    height: ${size};
}

.cxc-ripple-soft-core {
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(${size} * 0.25);
    height: calc(${size} * 0.25);
    background-color: ${color};
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
}

.cxc-ripple-soft-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border: 2px solid ${color};
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 0.4;
    animation: cxc-ripple-soft-animation ${duration}s ease-out infinite;
}

.cxc-ripple-soft-ring:nth-child(2) {
    animation-delay: 0s;
}

.cxc-ripple-soft-ring:nth-child(3) {
    animation-delay: 0.4s;
}

.cxc-ripple-soft-ring:nth-child(4) {
    animation-delay: 0.8s;
}

@keyframes cxc-ripple-soft-animation {
    0% {
        transform: translate(-50%, -50%) scale(0.3);
        opacity: 0.4;
    }
    70% {
        transform: translate(-50%, -50%) scale(3);
        opacity: 0;
    }
    100% {
        opacity: 0;
    }
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        return `
// Create a soft ripple loader
function createSoftRipple(config = {}) {
    // Default configuration
    const defaultConfig = {
        color: '${config.color}',
        shade: ${config.shade},
        size: '38px',
        speed: ${config.speed}
    };

    // Merge configurations
    const mergedConfig = {...defaultConfig, ...config};

    // Get color and animation duration
    const color = mergedConfig.color;
    const duration = (1.6 / mergedConfig.speed).toFixed(2);

    // Create container
    const container = document.createElement('div');
    container.className = 'cxc-ripple-soft';
    container.style.position = 'relative';
    container.style.width = mergedConfig.size;
    container.style.height = mergedConfig.size;

    // Create core
    const core = document.createElement('div');
    core.className = 'cxc-ripple-soft-core';
    core.style.position = 'absolute';
    core.style.top = '50%';
    core.style.left = '50%';
    core.style.width = \`calc(\${mergedConfig.size} * 0.25)\`;
    core.style.height = \`calc(\${mergedConfig.size} * 0.25)\`;
    core.style.backgroundColor = color;
    core.style.borderRadius = '50%';
    core.style.transform = 'translate(-50%, -50%)';
    core.style.zIndex = '2';
    container.appendChild(core);

    // Create rings
    for (let i = 0; i < 3; i++) {
        const ring = document.createElement('div');
        ring.className = 'cxc-ripple-soft-ring';
        ring.style.position = 'absolute';
        ring.style.top = '50%';
        ring.style.left = '50%';
        ring.style.width = '100%';
        ring.style.height = '100%';
        ring.style.border = \`2px solid \${color}\`;
        ring.style.borderRadius = '50%';
        ring.style.transform = 'translate(-50%, -50%) scale(0.3)';
        ring.style.opacity = '0.4';
        ring.style.animation = \`cxc-ripple-soft-animation \${duration}s ease-out infinite\`;

        // Set different delays for each ring
        if (i === 0) {
            ring.style.animationDelay = '0s';
        } else if (i === 1) {
            ring.style.animationDelay = '0.4s';
        } else if (i === 2) {
            ring.style.animationDelay = '0.8s';
        }

        container.appendChild(ring);
    }

    // Add keyframes if they don't exist
    if (!document.getElementById('cxc-ripple-soft-keyframes')) {
        const style = document.createElement('style');
        style.id = 'cxc-ripple-soft-keyframes';
        style.textContent = \`
            @keyframes cxc-ripple-soft-animation {
                0% {
                    transform: translate(-50%, -50%) scale(0.3);
                    opacity: 0.4;
                }
                70% {
                    transform: translate(-50%, -50%) scale(3);
                    opacity: 0;
                }
                100% {
                    opacity: 0;
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
