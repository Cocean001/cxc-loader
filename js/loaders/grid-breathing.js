/**
 * CXC-Loader - Grid Breathing Center
 * A grid with a breathing center cell
 */

(function () {
    // Category and name for this loader
    const CATEGORY = "grid";
    const NAME = "breathing";

    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement("div");
        container.className = "grid grid-center-breath";

        // Create grid cells - exactly matching the example HTML structure
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement("div");
            // Center cell (index 12) gets special class
            if (i === 12) {
                cell.className = "center";
            }
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

        // Apply styles to all cells
        const cells = element.querySelectorAll("div");
        cells.forEach((cell) => {
            cell.style.background = color;
            cell.style.width = "100%";
            cell.style.height = "100%";
            cell.style.opacity = "0.1";
        });

        // Apply styles to center cell
        const centerCell = element.querySelector(".center");
        if (centerCell) {
            centerCell.style.animation = `pulse-center ${duration} infinite ease-in-out`;
        }

        // Add keyframes if they don't exist
        if (!document.getElementById("pulse-center-keyframes")) {
            const style = document.createElement("style");
            style.id = "pulse-center-keyframes";
            style.textContent = `
                @keyframes pulse-center {
                    0%, 100% { transform: scale(1); opacity: 0.4; }
                    50% { transform: scale(1.8); opacity: 1; }
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
/* Grid Breathing Center Loader */
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

.grid-center-breath div {
    opacity: 0.1;
}

.grid-center-breath div.center {
    animation: pulse-center ${duration} infinite ease-in-out;
}

@keyframes pulse-center {
    0%, 100% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.8); opacity: 1; }
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        return `
// Create a grid breathing center loader
function createGridBreathing(config = {}) {
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
    container.className = 'grid grid-center-breath';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(5, 1fr)';
    container.style.gridTemplateRows = 'repeat(5, 1fr)';
    container.style.gap = '2px';
    container.style.width = mergedConfig.size;
    container.style.height = mergedConfig.size;

    // Get animation duration based on speed
    const duration = (2 / mergedConfig.speed).toFixed(2) + 's';

    // Create grid cells
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.style.background = mergedConfig.color;
        cell.style.width = '100%';
        cell.style.height = '100%';
        cell.style.opacity = '0.1';

        // Center cell (index 12) gets special animation
        if (i === 12) {
            cell.className = 'center';
            cell.style.animation = \`pulse-center \${duration} infinite ease-in-out\`;
        }

        container.appendChild(cell);
    }

    // Add keyframes if they don't exist
    if (!document.getElementById('pulse-center-keyframes')) {
        const style = document.createElement('style');
        style.id = 'pulse-center-keyframes';
        style.textContent = \`
            @keyframes pulse-center {
                0%, 100% { transform: scale(1); opacity: 0.4; }
                50% { transform: scale(1.8); opacity: 1; }
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
    window.createGridBreathing = function (config = {}) {
        return createLoader(config);
    };
})();
