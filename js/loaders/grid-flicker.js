/**
 * CXC-Loader - Grid Flicker
 * A grid with flickering cells
 */

(function () {
    // Category and name for this loader
    const CATEGORY = "grid";
    const NAME = "flicker";

    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement("div");
        container.className = "grid grid-flicker";

        // Create grid cells with specific delays matching the example
        const delays = [0.1, 0.2, 0.3, 0.4, 0.5, 0.2, 0.3, 0.4, 0.5, 0.6, 0.3, 0.4, 0.5, 0.6, 0.7, 0.4, 0.5, 0.6, 0.7, 0.8, 0.5, 0.6, 0.7, 0.8, 0.9];

        // Create 25 cells with specific delays
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement("div");
            cell.style.animationDelay = `${delays[i]}s`;
            container.appendChild(cell);
        }

        // Apply custom styles
        applyStyles(container, config);

        return container;
    }

    // Apply styles based on configuration
    function applyStyles(element, config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "60px";
        const speed = config.speed || 1.0;
        const duration = (2 / speed).toFixed(2) + "s";

        // Apply styles to container
        element.style.display = "grid";
        element.style.gridTemplateColumns = "repeat(5, 1fr)";
        element.style.gridTemplateRows = "repeat(5, 1fr)";
        element.style.gap = "2px";
        element.style.width = size;
        element.style.height = size;

        // Apply styles to cells
        const cells = element.querySelectorAll("div");
        cells.forEach((cell) => {
            cell.style.background = color;
            cell.style.width = "100%";
            cell.style.height = "100%";
            cell.style.animation = `flicker ${duration} infinite ease-in-out`;
        });

        // Add keyframes if they don't exist
        if (!document.getElementById("flicker-keyframes")) {
            const style = document.createElement("style");
            style.id = "flicker-keyframes";
            style.textContent = `
                @keyframes flicker {
                    0% { opacity: 0.1; }
                    25% { opacity: 0.7; }
                    50% { opacity: 0.2; }
                    75% { opacity: 1; }
                    100% { opacity: 0.1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Generate CSS for this loader
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "60px";
        const speed = config.speed || 1.0;
        const duration = (2 / speed).toFixed(2) + "s";

        return `
/* Grid Flicker Loader */
.grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 2px;
    width: ${size};
    height: ${size};
}

.grid div {
    background: ${color};
    width: 100%;
    height: 100%;
}

.grid-flicker div {
    animation: flicker ${duration} infinite ease-in-out;
}

/* Animation delays for each cell */
.grid-flicker div:nth-child(1) { animation-delay: 0.1s; }
.grid-flicker div:nth-child(2) { animation-delay: 0.2s; }
.grid-flicker div:nth-child(3) { animation-delay: 0.3s; }
.grid-flicker div:nth-child(4) { animation-delay: 0.4s; }
.grid-flicker div:nth-child(5) { animation-delay: 0.5s; }
.grid-flicker div:nth-child(6) { animation-delay: 0.2s; }
.grid-flicker div:nth-child(7) { animation-delay: 0.3s; }
.grid-flicker div:nth-child(8) { animation-delay: 0.4s; }
.grid-flicker div:nth-child(9) { animation-delay: 0.5s; }
.grid-flicker div:nth-child(10) { animation-delay: 0.6s; }
.grid-flicker div:nth-child(11) { animation-delay: 0.3s; }
.grid-flicker div:nth-child(12) { animation-delay: 0.4s; }
.grid-flicker div:nth-child(13) { animation-delay: 0.5s; }
.grid-flicker div:nth-child(14) { animation-delay: 0.6s; }
.grid-flicker div:nth-child(15) { animation-delay: 0.7s; }
.grid-flicker div:nth-child(16) { animation-delay: 0.4s; }
.grid-flicker div:nth-child(17) { animation-delay: 0.5s; }
.grid-flicker div:nth-child(18) { animation-delay: 0.6s; }
.grid-flicker div:nth-child(19) { animation-delay: 0.7s; }
.grid-flicker div:nth-child(20) { animation-delay: 0.8s; }
.grid-flicker div:nth-child(21) { animation-delay: 0.5s; }
.grid-flicker div:nth-child(22) { animation-delay: 0.6s; }
.grid-flicker div:nth-child(23) { animation-delay: 0.7s; }
.grid-flicker div:nth-child(24) { animation-delay: 0.8s; }
.grid-flicker div:nth-child(25) { animation-delay: 0.9s; }

@keyframes flicker {
    0% { opacity: 0.1; }
    25% { opacity: 0.7; }
    50% { opacity: 0.2; }
    75% { opacity: 1; }
    100% { opacity: 0.1; }
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        return `
// Create a grid flicker loader
function createGridFlicker(config = {}) {
    // Default configuration
    const defaultConfig = {
        color: '${config.color}',
        shade: ${config.shade},
        size: '60px',
        speed: ${config.speed}
    };

    // Merge configurations
    const mergedConfig = {...defaultConfig, ...config};

    // Create container
    const container = document.createElement('div');
    container.className = 'grid grid-flicker';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(5, 1fr)';
    container.style.gridTemplateRows = 'repeat(5, 1fr)';
    container.style.gap = '2px';
    container.style.width = mergedConfig.size;
    container.style.height = mergedConfig.size;

    // Get animation duration based on speed
    const duration = (2 / mergedConfig.speed).toFixed(2) + 's';

    // Create grid cells with delays
    const delays = [
        0.1, 0.2, 0.3, 0.4, 0.5,
        0.2, 0.3, 0.4, 0.5, 0.6,
        0.3, 0.4, 0.5, 0.6, 0.7,
        0.4, 0.5, 0.6, 0.7, 0.8,
        0.5, 0.6, 0.7, 0.8, 0.9
    ];

    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.style.background = mergedConfig.color;
        cell.style.width = '100%';
        cell.style.height = '100%';
        cell.style.animation = \`flicker \${duration} infinite ease-in-out\`;
        cell.style.animationDelay = \`\${delays[i]}s\`;
        container.appendChild(cell);
    }

    // Add keyframes if they don't exist
    if (!document.getElementById('flicker-keyframes')) {
        const style = document.createElement('style');
        style.id = 'flicker-keyframes';
        style.textContent = \`
            @keyframes flicker {
                0% { opacity: 0.1; }
                25% { opacity: 0.7; }
                50% { opacity: 0.2; }
                75% { opacity: 1; }
                100% { opacity: 0.1; }
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

    // Expose the create function globally for direct access
    window.createGridFlicker = function (config = {}) {
        return createLoader(config);
    };
})();
