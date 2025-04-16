/**
 * CXC-Loader - Dual Spinner
 * A dual ring spinning loader
 */

(function() {
    // Category and name for this loader
    const CATEGORY = 'spinner';
    const NAME = 'dual';
    
    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement('div');
        container.className = 'cxc-spinner-dual';
        
        // Apply custom styles
        applyStyles(container, config);
        
        return container;
    }
    
    // Apply styles based on configuration
    function applyStyles(element, config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || '40px';
        const borderWidth = config.borderWidth || '4px';
        const speed = config.speed || 1.0;
        const duration = (1.2 / speed).toFixed(2) + 's';
        
        // Set CSS variables
        element.style.setProperty('--spinner-dual-color', color);
        element.style.setProperty('--spinner-dual-size', size);
        element.style.setProperty('--spinner-dual-border-width', borderWidth);
        element.style.setProperty('--spinner-dual-duration', duration);
    }
    
    // Generate CSS for this loader
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || '40px';
        const borderWidth = config.borderWidth || '4px';
        const speed = config.speed || 1.0;
        const duration = (1.2 / speed).toFixed(2) + 's';
        
        return `
/* Dual Spinner Loader */
.cxc-spinner-dual {
    display: inline-block;
    width: ${size};
    height: ${size};
    position: relative;
}

.cxc-spinner-dual::after,
.cxc-spinner-dual::before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: ${borderWidth} solid transparent;
}

.cxc-spinner-dual::before {
    border-top-color: ${color};
    border-bottom-color: ${color};
    animation: cxc-spinner-dual-rotation ${duration} linear infinite;
}

.cxc-spinner-dual::after {
    border-left-color: ${color};
    border-right-color: ${color};
    animation: cxc-spinner-dual-rotation ${duration} linear infinite reverse;
}

@keyframes cxc-spinner-dual-rotation {
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
// Create a dual spinner loader
function createDualSpinner(config = {}) {
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
    spinner.className = 'cxc-spinner-dual';
    
    // Apply styles
    const color = mergedConfig.color;
    const size = mergedConfig.size;
    const borderWidth = mergedConfig.borderWidth;
    const speed = mergedConfig.speed;
    const duration = (1.2 / speed).toFixed(2) + 's';
    
    // Set inline styles
    spinner.style.width = size;
    spinner.style.height = size;
    spinner.style.position = 'relative';
    spinner.style.display = 'inline-block';
    
    // Add the CSS for pseudo-elements
    const styleId = 'cxc-spinner-dual-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = \`
            .cxc-spinner-dual::after,
            .cxc-spinner-dual::before {
                content: '';
                box-sizing: border-box;
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                border: \${borderWidth} solid transparent;
            }
            
            .cxc-spinner-dual::before {
                border-top-color: \${color};
                border-bottom-color: \${color};
                animation: cxc-spinner-dual-rotation \${duration} linear infinite;
            }
            
            .cxc-spinner-dual::after {
                border-left-color: \${color};
                border-right-color: \${color};
                animation: cxc-spinner-dual-rotation \${duration} linear infinite reverse;
            }
            
            @keyframes cxc-spinner-dual-rotation {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        \`;
        document.head.appendChild(style);
    }
    
    return spinner;
}`;
    }
    
    // Register this loader
    CXCLoader.registerLoader(CATEGORY, NAME, createLoader, generateCSS, generateJS);
})();
