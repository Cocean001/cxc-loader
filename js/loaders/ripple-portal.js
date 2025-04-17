/**
 * CXC-Loader - Portal Ripple
 * A portal-like ripple effect
 */

(function () {
    // Category and name for this loader
    const CATEGORY = "ripple";
    const NAME = "portal";

    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement("div");
        container.className = "cxc-ripple-portal";

        // Apply custom styles
        applyStyles(container, config);

        return container;
    }

    // Apply styles based on configuration
    function applyStyles(element, config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "20px";
        const speed = config.speed || 1.0;
        const duration = (1.6 / speed).toFixed(2) + "s";

        // Apply styles to container
        element.style.width = size;
        element.style.height = size;
        element.style.borderRadius = "50%";
        element.style.backgroundColor = color;
        element.style.boxShadow = `0 0 0 0 rgba(${hexToRgb(color)},0.4)`;
        element.style.animation = `cxc-ripple-portal-animation ${duration} infinite ease-in-out`;

        // Add keyframes if they don't exist
        if (!document.getElementById("cxc-ripple-portal-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-ripple-portal-keyframes";
            style.textContent = `
                @keyframes cxc-ripple-portal-animation {
                    0% { box-shadow: 0 0 0 0 rgba(${hexToRgb(color)},0.3); }
                    70% { box-shadow: 0 0 0 20px rgba(${hexToRgb(color)},0); }
                    100% { box-shadow: 0 0 0 0 rgba(${hexToRgb(color)},0); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Helper function to convert hex to rgb
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Parse the hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return `${r},${g},${b}`;
    }

    // Generate CSS for this loader
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "20px";
        const speed = config.speed || 1.0;
        const duration = (1.6 / speed).toFixed(2);
        const rgbColor = hexToRgb(color);

        return `
/* Portal Ripple Loader */
.cxc-ripple-portal {
    width: ${size};
    height: ${size};
    border-radius: 50%;
    background-color: ${color};
    box-shadow: 0 0 0 0 rgba(${rgbColor},0.4);
    animation: cxc-ripple-portal-animation ${duration}s infinite ease-in-out;
}

@keyframes cxc-ripple-portal-animation {
    0% { box-shadow: 0 0 0 0 rgba(${rgbColor},0.3); }
    70% { box-shadow: 0 0 0 20px rgba(${rgbColor},0); }
    100% { box-shadow: 0 0 0 0 rgba(${rgbColor},0); }
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        return `
// Create a portal ripple loader
function createPortalRipple(config = {}) {
    // Default configuration
    const defaultConfig = {
        color: '${config.color}',
        shade: ${config.shade},
        size: '20px',
        speed: ${config.speed}
    };

    // Merge configurations
    const mergedConfig = {...defaultConfig, ...config};

    // Helper function to convert hex to rgb
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Parse the hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return \`\${r},\${g},\${b}\`;
    }

    // Create portal element
    const portal = document.createElement('div');
    portal.className = 'cxc-ripple-portal';
    portal.style.width = mergedConfig.size;
    portal.style.height = mergedConfig.size;
    portal.style.borderRadius = '50%';
    portal.style.backgroundColor = mergedConfig.color;
    
    // Convert color to RGB for box-shadow
    const rgbColor = hexToRgb(mergedConfig.color);
    portal.style.boxShadow = \`0 0 0 0 rgba(\${rgbColor},0.4)\`;
    
    // Calculate animation duration based on speed
    const duration = (1.6 / mergedConfig.speed).toFixed(2);
    portal.style.animation = \`cxc-ripple-portal-animation \${duration}s infinite ease-in-out\`;

    // Add keyframes if they don't exist
    if (!document.getElementById('cxc-ripple-portal-keyframes')) {
        const style = document.createElement('style');
        style.id = 'cxc-ripple-portal-keyframes';
        style.textContent = \`
            @keyframes cxc-ripple-portal-animation {
                0% { box-shadow: 0 0 0 0 rgba(\${rgbColor},0.3); }
                70% { box-shadow: 0 0 0 20px rgba(\${rgbColor},0); }
                100% { box-shadow: 0 0 0 0 rgba(\${rgbColor},0); }
            }
        \`;
        document.head.appendChild(style);
    }

    return portal;
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
