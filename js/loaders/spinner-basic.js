/**
 * CXC-Loader - Basic Spinner
 * A simple spinning loader
 */

(function () {
    // Category and name for this loader
    const CATEGORY = "spinner";
    const NAME = "basic";

    // Create the loader element
    function createLoader(config) {
        // Get color from config
        const color = CXCLoader.getColor(config.color, config.shade);
        
        // Create container
        const container = document.createElement("div");
        container.className = "cxc-spinner-basic";
        
        // Apply color and speed
        container.style.borderTopColor = color;
        container.style.animationDuration = `${1.0 / config.speed}s`;
        
        return container;
    }

    // Generate CSS for this loader
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const duration = 1.0 / config.speed;
        
        return `
/* Basic Spinner */
.cxc-spinner-basic {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top: 4px solid ${color};
    border-radius: 50%;
    animation: cxc-spin ${duration}s linear infinite;
}

@keyframes cxc-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const duration = 1.0 / config.speed;
        
        return `
// Create a basic spinner
function createBasicSpinner(color = "${color}", duration = ${duration}) {
    const spinner = document.createElement('div');
    spinner.style.width = '40px';
    spinner.style.height = '40px';
    spinner.style.border = '4px solid rgba(0, 0, 0, 0.1)';
    spinner.style.borderTop = \`4px solid \${color}\`;
    spinner.style.borderRadius = '50%';
    spinner.style.animation = \`cxc-spin \${duration}s linear infinite\`;
    
    // Add keyframes if they don't exist
    if (!document.getElementById('cxc-spin-keyframes')) {
        const style = document.createElement('style');
        style.id = 'cxc-spin-keyframes';
        style.textContent = \`
            @keyframes cxc-spin {
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

    // Log registration
    console.log(`Registered loader: ${CATEGORY}-${NAME}`);
})();
