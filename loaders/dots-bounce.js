/**
 * CXC-Loader - Bouncing Dots
 * A bouncing dots loader
 */

(function() {
    // Category and name for this loader
    const CATEGORY = 'dots';
    const NAME = 'bounce';
    
    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement('div');
        container.className = 'cxc-dots-bounce';
        
        // Create dots
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'cxc-bounce-dot';
            container.appendChild(dot);
        }
        
        // Apply custom styles
        applyStyles(container, config);
        
        return container;
    }
    
    // Apply styles based on configuration
    function applyStyles(element, config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || '10px';
        const gap = config.gap || '5px';
        const speed = config.speed || 1.0;
        const duration = (0.6 / speed).toFixed(2) + 's';
        
        // Set CSS variables
        element.style.setProperty('--bounce-dots-color', color);
        element.style.setProperty('--bounce-dots-size', size);
        element.style.setProperty('--bounce-dots-gap', gap);
        element.style.setProperty('--bounce-dots-duration', duration);
    }
    
    // Generate CSS for this loader
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || '10px';
        const gap = config.gap || '5px';
        const speed = config.speed || 1.0;
        const duration = (0.6 / speed).toFixed(2) + 's';
        
        return `
/* Bouncing Dots Loader */
.cxc-dots-bounce {
    display: flex;
    align-items: center;
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
    animation-delay: -0.3s;
}

.cxc-bounce-dot:nth-child(2) {
    animation-delay: -0.15s;
}

@keyframes cxc-bounce-animation {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(-10px);
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
        size: '10px',
        gap: '5px',
        speed: ${config.speed}
    };
    
    // Merge configurations
    const mergedConfig = {...defaultConfig, ...config};
    
    // Create container
    const container = document.createElement('div');
    container.className = 'cxc-dots-bounce';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = mergedConfig.gap;
    
    // Get animation duration based on speed
    const duration = (0.6 / mergedConfig.speed).toFixed(2) + 's';
    
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
            dot.style.animationDelay = '-0.3s';
        } else if (i === 1) {
            dot.style.animationDelay = '-0.15s';
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
                    transform: translateY(-10px);
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
