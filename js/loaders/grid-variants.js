/**
 * CXC-Loader - Grid Variants
 * A collection of grid pattern animations with different flow patterns
 */

(function () {
    // Define all variants
    const variants = [
        { name: "Diagonal Sweep", id: "diag" },
        { name: "Spiral Inward", id: "spiral" },
        { name: "Row Pulse", id: "row" },
        { name: "Column Pulse", id: "col" },
        { name: "Center Out", id: "center" },
        { name: "Reverse Row", id: "revRow" },
        { name: "Reverse Col", id: "revCol" },
        { name: "Wave Sweep", id: "wave" },
        { name: "Step Flash", id: "step" },
        { name: "Perimeter Blink", id: "perimeter" },
    ];

    // Helper function to calculate delay for each variant - optimized for visual appeal
    function delayFor(variant, r, c, idx) {
        switch (variant) {
            case "diag":
                return (r + c) * 0.06; // Slightly faster for smoother diagonal flow
            case "spiral": {
                const layer = Math.max(Math.abs(2 - r), Math.abs(2 - c));
                return layer * 0.12 + (r === layer ? c : c === 4 - layer ? r : r === 4 - layer ? 4 - c : 4 - r) * 0.025; // Smoother spiral
            }
            case "row":
                return r * 0.12; // Slightly faster row animation
            case "col":
                return c * 0.12; // Slightly faster column animation
            case "center":
                return (Math.abs(2 - r) + Math.abs(2 - c)) * 0.08; // Faster center-out effect
            case "revRow":
                return (4 - r) * 0.1; // Smoother reverse row
            case "revCol":
                return (4 - c) * 0.1; // Smoother reverse column
            case "wave":
                return (Math.sin((r * 5 + c) / 2.5) + 1) * 0.2; // More subtle wave pattern
            case "step":
                return idx * 0.03; // Faster step animation
            case "perimeter":
                return r === 0 || c === 0 || r === 4 || c === 4 ? 0.15 : 0.4; // More distinct perimeter effect
            default:
                return 0;
        }
    }

    // Add global CSS for all grid variants with enhanced animations
    const globalStyle = document.createElement("style");
    globalStyle.id = "grid-variants-global-style";
    globalStyle.textContent = `
        @keyframes pulse {
            0% { opacity: 0.1; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 0.1; transform: scale(0.95); }
        }
    `;
    document.head.appendChild(globalStyle);

    // Register each variant as a separate loader
    variants.forEach((variant) => {
        const CATEGORY = "grid";
        const NAME = variant.id;

        // Create the loader element
        function createLoader(config) {
            // Create container
            const container = document.createElement("div");
            container.className = "loader";
            container.style.display = "grid";
            container.style.gridTemplateColumns = "repeat(5, 1fr)";
            container.style.gridTemplateRows = "repeat(5, 1fr)";
            container.style.gap = "2px";
            container.style.width = config.size || "60px";
            container.style.height = config.size || "60px";

            // Create grid cells with specific delays
            for (let i = 0; i < 25; i++) {
                const cell = document.createElement("div");
                const r = Math.floor(i / 5);
                const c = i % 5;

                // Apply styles directly to match the example
                cell.style.background = CXCLoader.getColor(config.color, config.shade);
                cell.style.width = "100%";
                cell.style.height = "100%";
                cell.style.opacity = "0.1";

                // Calculate animation duration based on speed
                const speed = config.speed || 1.0;
                const duration = (2 / speed).toFixed(2);

                // Apply animation
                cell.style.animation = `pulse ${duration}s infinite ease-in-out`;

                // Apply delay based on variant
                const delay = delayFor(variant.id, r, c, i);
                cell.style.animationDelay = `${delay}s`;

                container.appendChild(cell);
            }

            return container;
        }

        // Generate CSS for this loader
        function generateCSS(config) {
            const color = CXCLoader.getColor(config.color, config.shade);
            const size = config.size || "60px";
            const speed = config.speed || 1.0;
            const duration = (2 / speed).toFixed(2) + "s";

            // Generate delay CSS for this specific variant
            let delayCSS = "";
            for (let i = 0; i < 25; i++) {
                const r = Math.floor(i / 5);
                const c = i % 5;
                const delay = delayFor(variant.id, r, c, i);
                delayCSS += `div:nth-child(${i + 1}) { animation-delay: ${delay}s; }\n`;
            }

            return `
/* Grid ${variant.name} Loader */
.loader {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 2px;
    width: ${size};
    height: ${size};
}

.loader div {
    background: ${color};
    width: 100%;
    height: 100%;
    opacity: 0.1;
    animation: pulse ${duration} infinite ease-in-out;
}

/* Animation delays for each cell */
${delayCSS}

@keyframes pulse {
    0% { opacity: 0.1; transform: scale(0.95); }
    50% { opacity: 1; transform: scale(1.05); }
    100% { opacity: 0.1; transform: scale(0.95); }
}`;
        }

        // Generate JS for this loader
        function generateJS(config) {
            return `
// Create a grid ${variant.name} loader
function createGrid${variant.name.replace(/\\s+/g, "")}(config = {}) {
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
    container.className = 'loader';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(5, 1fr)';
    container.style.gridTemplateRows = 'repeat(5, 1fr)';
    container.style.gap = '2px';
    container.style.width = mergedConfig.size;
    container.style.height = mergedConfig.size;

    // Helper function to calculate delay for each cell - optimized for visual appeal
    function delayFor(r, c, idx) {
        ${variant.id === "diag" ? "return (r + c) * 0.06;" : ""}
        ${
            variant.id === "spiral"
                ? `
        const layer = Math.max(Math.abs(2 - r), Math.abs(2 - c));
        return layer * 0.12 + (r === layer ? c : (c === 4 - layer ? r : (r === 4 - layer ? 4 - c : 4 - r))) * 0.025;`
                : ""
        }
        ${variant.id === "row" ? "return r * 0.12;" : ""}
        ${variant.id === "col" ? "return c * 0.12;" : ""}
        ${variant.id === "center" ? "return (Math.abs(2 - r) + Math.abs(2 - c)) * 0.08;" : ""}
        ${variant.id === "revRow" ? "return (4 - r) * 0.1;" : ""}
        ${variant.id === "revCol" ? "return (4 - c) * 0.1;" : ""}
        ${variant.id === "wave" ? "return (Math.sin((r * 5 + c) / 2.5) + 1) * 0.2;" : ""}
        ${variant.id === "step" ? "return idx * 0.03;" : ""}
        ${variant.id === "perimeter" ? "return (r === 0 || c === 0 || r === 4 || c === 4) ? 0.15 : 0.4;" : ""}
    }

    // Get animation duration based on speed
    const duration = (2 / mergedConfig.speed).toFixed(2) + 's';

    // Create grid cells
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        const r = Math.floor(i / 5);
        const c = i % 5;

        cell.style.background = mergedConfig.color;
        cell.style.width = '100%';
        cell.style.height = '100%';
        cell.style.opacity = '0.1';
        cell.style.animation = \`pulse \${duration} infinite ease-in-out\`;
        cell.style.animationDelay = \`\${delayFor(r, c, i)}s\`;

        container.appendChild(cell);
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
        window[`createGrid${variant.name.replace(/\s+/g, "")}`] = function (config = {}) {
            return createLoader(config);
        };
    });
})();
