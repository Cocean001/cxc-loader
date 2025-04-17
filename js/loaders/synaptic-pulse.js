/**
 * CXC-Loader - Synaptic Pulse
 * A series of pulsing dots that mimic synaptic activity
 */

(function () {
    // Category and name for this loader
    const CATEGORY = "synaptic";
    const NAME = "pulse";

    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement("div");
        container.className = "cxc-synaptic-pulse";

        // Create dots
        for (let i = 0; i < 5; i++) {
            const dot = document.createElement("div");
            dot.className = "cxc-synaptic-pulse-dot";
            container.appendChild(dot);
        }

        // Apply custom styles
        applyStyles(container, config);

        return container;
    }

    // Apply styles based on configuration
    function applyStyles(element, config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const dotSize = config.dotSize || "6px";
        const gap = config.gap || "6px";
        const speed = config.speed || 1.0;
        const duration = (1.2 / speed).toFixed(2) + "s";

        // Apply styles to container
        element.style.display = "flex";
        element.style.gap = gap;

        // Get dots
        const dots = element.querySelectorAll(".cxc-synaptic-pulse-dot");

        // Apply styles to dots
        dots.forEach((dot, index) => {
            dot.style.width = dotSize;
            dot.style.height = dotSize;
            dot.style.backgroundColor = color;
            dot.style.borderRadius = "50%";
            dot.style.animation = `cxc-synaptic-pulse-animation ${duration} infinite ease-in-out`;
            
            // Set different delays for each dot
            dot.style.animationDelay = `${index * 0.2}s`;
        });

        // Add keyframes if they don't exist
        if (!document.getElementById("cxc-synaptic-pulse-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-synaptic-pulse-keyframes";
            style.textContent = `
                @keyframes cxc-synaptic-pulse-animation {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.6); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Generate CSS for this loader
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const dotSize = config.dotSize || "6px";
        const gap = config.gap || "6px";
        const speed = config.speed || 1.0;
        const duration = (1.2 / speed).toFixed(2);

        return `
/* Synaptic Pulse Loader */
.cxc-synaptic-pulse {
    display: flex;
    gap: ${gap};
}

.cxc-synaptic-pulse-dot {
    width: ${dotSize};
    height: ${dotSize};
    background-color: ${color};
    border-radius: 50%;
    animation: cxc-synaptic-pulse-animation ${duration}s infinite ease-in-out;
}

.cxc-synaptic-pulse-dot:nth-child(1) { animation-delay: 0s; }
.cxc-synaptic-pulse-dot:nth-child(2) { animation-delay: 0.2s; }
.cxc-synaptic-pulse-dot:nth-child(3) { animation-delay: 0.4s; }
.cxc-synaptic-pulse-dot:nth-child(4) { animation-delay: 0.6s; }
.cxc-synaptic-pulse-dot:nth-child(5) { animation-delay: 0.8s; }

@keyframes cxc-synaptic-pulse-animation {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.6); }
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        return `
// Create a synaptic pulse loader
function createSynapticPulse(config = {}) {
    // Default configuration
    const defaultConfig = {
        color: '${config.color}',
        shade: ${config.shade},
        dotSize: '6px',
        gap: '6px',
        speed: ${config.speed}
    };

    // Merge configurations
    const mergedConfig = {...defaultConfig, ...config};

    // Create container
    const container = document.createElement('div');
    container.className = 'cxc-synaptic-pulse';
    container.style.display = 'flex';
    container.style.gap = mergedConfig.gap;

    // Calculate animation duration based on speed
    const duration = (1.2 / mergedConfig.speed).toFixed(2);

    // Create dots
    for (let i = 0; i < 5; i++) {
        const dot = document.createElement('div');
        dot.className = 'cxc-synaptic-pulse-dot';
        dot.style.width = mergedConfig.dotSize;
        dot.style.height = mergedConfig.dotSize;
        dot.style.backgroundColor = mergedConfig.color;
        dot.style.borderRadius = '50%';
        dot.style.animation = \`cxc-synaptic-pulse-animation \${duration}s infinite ease-in-out\`;
        dot.style.animationDelay = \`\${i * 0.2}s\`;
        
        container.appendChild(dot);
    }

    // Add keyframes if they don't exist
    if (!document.getElementById('cxc-synaptic-pulse-keyframes')) {
        const style = document.createElement('style');
        style.id = 'cxc-synaptic-pulse-keyframes';
        style.textContent = \`
            @keyframes cxc-synaptic-pulse-animation {
                0%, 100% { opacity: 0.2; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.6); }
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
