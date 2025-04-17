/**
 * CXC-Loader - Particle Flow
 * Particles flowing in a circular pattern
 */

(function () {
    // Category and name for this loader
    const CATEGORY = "particle";
    const NAME = "flow";

    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement("div");
        container.className = "cxc-particle-flow";

        // Create particles
        for (let i = 0; i < 4; i++) {
            const particle = document.createElement("div");
            particle.className = "cxc-particle-flow-dot";
            container.appendChild(particle);
        }

        // Apply custom styles
        applyStyles(container, config);

        return container;
    }

    // Apply styles based on configuration
    function applyStyles(element, config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "60px";
        const dotSize = config.dotSize || "6px";
        const speed = config.speed || 1.0;
        const duration = (1.6 / speed).toFixed(2) + "s";

        // Apply styles to container
        element.style.position = "relative";
        element.style.width = size;
        element.style.height = size;

        // Get particles
        const particles = element.querySelectorAll(".cxc-particle-flow-dot");

        // Apply styles to particles
        particles.forEach((particle, index) => {
            particle.style.position = "absolute";
            particle.style.width = dotSize;
            particle.style.height = dotSize;
            particle.style.backgroundColor = color;
            particle.style.borderRadius = "50%";
            particle.style.animation = `cxc-particle-flow-animation ${duration} ease-in-out infinite`;
            
            // Position particles at different points
            if (index === 0) {
                particle.style.top = "0";
                particle.style.left = "50%";
                particle.style.transform = "translateX(-50%)";
                particle.style.animationDelay = "0s";
            } else if (index === 1) {
                particle.style.top = "50%";
                particle.style.left = "0";
                particle.style.transform = "translateY(-50%)";
                particle.style.animationDelay = "0.2s";
            } else if (index === 2) {
                particle.style.top = "100%";
                particle.style.left = "50%";
                particle.style.transform = "translateX(-50%)";
                particle.style.animationDelay = "0.4s";
            } else if (index === 3) {
                particle.style.top = "50%";
                particle.style.left = "100%";
                particle.style.transform = "translateY(-50%)";
                particle.style.animationDelay = "0.6s";
            }
        });

        // Add keyframes if they don't exist
        if (!document.getElementById("cxc-particle-flow-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-particle-flow-keyframes";
            style.textContent = `
                @keyframes cxc-particle-flow-animation {
                    0% { transform: scale(0.5); opacity: 0.3; }
                    50% { transform: scale(1.5); opacity: 1; }
                    100% { transform: scale(0.5); opacity: 0.3; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Generate CSS for this loader
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "60px";
        const dotSize = config.dotSize || "6px";
        const speed = config.speed || 1.0;
        const duration = (1.6 / speed).toFixed(2);

        return `
/* Particle Flow Loader */
.cxc-particle-flow {
    position: relative;
    width: ${size};
    height: ${size};
}

.cxc-particle-flow-dot {
    position: absolute;
    width: ${dotSize};
    height: ${dotSize};
    background-color: ${color};
    border-radius: 50%;
    animation: cxc-particle-flow-animation ${duration}s ease-in-out infinite;
}

.cxc-particle-flow-dot:nth-child(1) {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    animation-delay: 0s;
}

.cxc-particle-flow-dot:nth-child(2) {
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    animation-delay: 0.2s;
}

.cxc-particle-flow-dot:nth-child(3) {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    animation-delay: 0.4s;
}

.cxc-particle-flow-dot:nth-child(4) {
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    animation-delay: 0.6s;
}

@keyframes cxc-particle-flow-animation {
    0% { transform: scale(0.5); opacity: 0.3; }
    50% { transform: scale(1.5); opacity: 1; }
    100% { transform: scale(0.5); opacity: 0.3; }
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        return `
// Create a particle flow loader
function createParticleFlow(config = {}) {
    // Default configuration
    const defaultConfig = {
        color: '${config.color}',
        shade: ${config.shade},
        size: '60px',
        dotSize: '6px',
        speed: ${config.speed}
    };

    // Merge configurations
    const mergedConfig = {...defaultConfig, ...config};

    // Create container
    const container = document.createElement('div');
    container.className = 'cxc-particle-flow';
    container.style.position = 'relative';
    container.style.width = mergedConfig.size;
    container.style.height = mergedConfig.size;

    // Calculate animation duration based on speed
    const duration = (1.6 / mergedConfig.speed).toFixed(2);

    // Create particles
    const positions = [
        { top: '0', left: '50%', transform: 'translateX(-50%)', delay: '0s' },
        { top: '50%', left: '0', transform: 'translateY(-50%)', delay: '0.2s' },
        { top: '100%', left: '50%', transform: 'translateX(-50%)', delay: '0.4s' },
        { top: '50%', left: '100%', transform: 'translateY(-50%)', delay: '0.6s' }
    ];

    positions.forEach(pos => {
        const particle = document.createElement('div');
        particle.className = 'cxc-particle-flow-dot';
        particle.style.position = 'absolute';
        particle.style.width = mergedConfig.dotSize;
        particle.style.height = mergedConfig.dotSize;
        particle.style.backgroundColor = mergedConfig.color;
        particle.style.borderRadius = '50%';
        particle.style.top = pos.top;
        particle.style.left = pos.left;
        particle.style.transform = pos.transform;
        particle.style.animation = \`cxc-particle-flow-animation \${duration}s ease-in-out infinite\`;
        particle.style.animationDelay = pos.delay;
        
        container.appendChild(particle);
    });

    // Add keyframes if they don't exist
    if (!document.getElementById('cxc-particle-flow-keyframes')) {
        const style = document.createElement('style');
        style.id = 'cxc-particle-flow-keyframes';
        style.textContent = \`
            @keyframes cxc-particle-flow-animation {
                0% { transform: scale(0.5); opacity: 0.3; }
                50% { transform: scale(1.5); opacity: 1; }
                100% { transform: scale(0.5); opacity: 0.3; }
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
