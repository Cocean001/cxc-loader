/**
 * CXC-Loader - Tail Blink
 * A blinking dot with a tail effect
 */

(function () {
    // Category and name for this loader
    const CATEGORY = "tail";
    const NAME = "blink";

    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement("div");
        container.className = "cxc-tail-blink";

        // Apply custom styles
        applyStyles(container, config);

        return container;
    }

    // Apply styles based on configuration
    function applyStyles(element, config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const width = config.width || "80px";
        const dotSize = config.dotSize || "8px";
        const speed = config.speed || 1.0;
        const duration = (1.2 / speed).toFixed(2) + "s";

        // Apply styles to container
        element.style.width = width;
        element.style.height = dotSize;
        element.style.position = "relative";

        // Add pseudo-element for the moving dot
        element.style.setProperty("--tail-blink-color", color);
        element.style.setProperty("--tail-blink-dot-size", dotSize);
        element.style.setProperty("--tail-blink-duration", duration);
        element.style.setProperty("--tail-blink-width", `calc(${width} - ${dotSize})`);

        // Add keyframes if they don't exist
        if (!document.getElementById("cxc-tail-blink-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-tail-blink-keyframes";
            style.textContent = `
                .cxc-tail-blink::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: var(--tail-blink-dot-size);
                    height: var(--tail-blink-dot-size);
                    background: var(--tail-blink-color);
                    border-radius: 50%;
                    animation: cxc-tail-blink-animation var(--tail-blink-duration) linear infinite;
                    box-shadow: 0 0 6px rgba(var(--tail-blink-color-rgb), 0.5);
                }
                
                @keyframes cxc-tail-blink-animation {
                    0% { left: 0; opacity: 0.2; }
                    50% { opacity: 1; }
                    100% { left: var(--tail-blink-width); opacity: 0.2; }
                }
            `;
            document.head.appendChild(style);
        }

        // Set RGB values for box-shadow
        const rgbColor = hexToRgb(color);
        element.style.setProperty("--tail-blink-color-rgb", rgbColor);
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
        const width = config.width || "80px";
        const dotSize = config.dotSize || "8px";
        const speed = config.speed || 1.0;
        const duration = (1.2 / speed).toFixed(2);
        const rgbColor = hexToRgb(color);

        return `
/* Tail Blink Loader */
.cxc-tail-blink {
    width: ${width};
    height: ${dotSize};
    position: relative;
}

.cxc-tail-blink::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: ${dotSize};
    height: ${dotSize};
    background: ${color};
    border-radius: 50%;
    animation: cxc-tail-blink-animation ${duration}s linear infinite;
    box-shadow: 0 0 6px rgba(${rgbColor}, 0.5);
}

@keyframes cxc-tail-blink-animation {
    0% { left: 0; opacity: 0.2; }
    50% { opacity: 1; }
    100% { left: calc(${width} - ${dotSize}); opacity: 0.2; }
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        return `
// Create a tail blink loader
function createTailBlink(config = {}) {
    // Default configuration
    const defaultConfig = {
        color: '${config.color}',
        shade: ${config.shade},
        width: '80px',
        dotSize: '8px',
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

    // Create container
    const container = document.createElement('div');
    container.className = 'cxc-tail-blink';
    container.style.width = mergedConfig.width;
    container.style.height = mergedConfig.dotSize;
    container.style.position = 'relative';

    // Calculate animation duration based on speed
    const duration = (1.2 / mergedConfig.speed).toFixed(2);
    
    // Convert color to RGB for box-shadow
    const rgbColor = hexToRgb(mergedConfig.color);

    // Add keyframes and styles if they don't exist
    if (!document.getElementById('cxc-tail-blink-styles')) {
        const style = document.createElement('style');
        style.id = 'cxc-tail-blink-styles';
        style.textContent = \`
            .cxc-tail-blink::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                width: \${mergedConfig.dotSize};
                height: \${mergedConfig.dotSize};
                background: \${mergedConfig.color};
                border-radius: 50%;
                animation: cxc-tail-blink-animation \${duration}s linear infinite;
                box-shadow: 0 0 6px rgba(\${rgbColor}, 0.5);
            }
            
            @keyframes cxc-tail-blink-animation {
                0% { left: 0; opacity: 0.2; }
                50% { opacity: 1; }
                100% { left: calc(\${mergedConfig.width} - \${mergedConfig.dotSize}); opacity: 0.2; }
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
