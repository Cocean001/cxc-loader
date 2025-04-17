/**
 * CXC-Loader - Particle Converge
 * A converging particles loader inspired by PositiveGPT
 */

(function () {
    // Category and name for this loader
    const CATEGORY = "pulse";
    const NAME = "particle-converge";

    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement("div");
        container.className = "cxc-particle-converge";

        // Create particles
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement("div");
            particle.className = "cxc-particle";
            container.appendChild(particle);
        }

        // Apply custom styles
        applyStyles(container, config);

        return container;
    }

    // Apply styles based on configuration
    function applyStyles(element, config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "48px";
        const speed = config.speed || 1.0;
        const duration = (1.8 / speed).toFixed(2) + "s";

        // Apply styles to container
        element.style.position = "relative";
        element.style.width = size;
        element.style.height = size;

        // Define particle positions - shifted right 30px and down 30px
        const positions = [
            { x: 0, y: 0, delay: 0 },
            { x: 60, y: 5, delay: 0.2 },
            { x: -5, y: 35, delay: 0.4 },
            { x: 65, y: 55, delay: 0.6 },
            { x: 5, y: 60, delay: 0.8 },
            { x: 55, y: 0, delay: 1 },
            { x: 30, y: -5, delay: 1.2 },
            { x: 0, y: 25, delay: 1.4 },
            { x: 60, y: 45, delay: 1.6 },
            { x: 50, y: 60, delay: 1.8 },
            { x: 5, y: 10, delay: 2 },
            { x: 40, y: 55, delay: 2.2 },
        ];

        // Apply styles to particles
        const particles = element.querySelectorAll(".cxc-particle");
        particles.forEach((particle, index) => {
            if (index < positions.length) {
                const pos = positions[index];

                particle.style.position = "absolute";
                particle.style.width = "7px";
                particle.style.height = "7px";
                particle.style.background = `radial-gradient(circle at center, ${color}, ${adjustColor(color, -20)})`;
                particle.style.borderRadius = "50%";
                particle.style.opacity = "0";
                particle.style.boxShadow = `0 0 7px rgba(${getRGBValues(color)}, 0.4)`;

                // Set animation with custom properties
                particle.style.setProperty("--x", `${pos.x}px`);
                particle.style.setProperty("--y", `${pos.y}px`);
                particle.style.animation = `cxc-float-in ${duration} cubic-bezier(0.42, 0, 0.58, 1) infinite`;
                particle.style.animationDelay = `${pos.delay}s`;
            }
        });

        // Add keyframes if they don't exist
        if (!document.getElementById("cxc-float-in-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-float-in-keyframes";
            style.textContent = `
                @keyframes cxc-float-in {
                    0% {
                        transform: translate(var(--x), var(--y)) scale(0.3);
                        opacity: 0;
                        filter: blur(2px);
                    }
                    40% {
                        opacity: 1;
                        filter: blur(0px);
                    }
                    100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0;
                        filter: blur(1px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Helper function to adjust color brightness
    function adjustColor(color, amount) {
        // Convert hex to RGB
        let r, g, b;
        if (color.startsWith("#")) {
            const hex = color.substring(1);
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else if (color.startsWith("rgb")) {
            const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
            if (match) {
                r = parseInt(match[1]);
                g = parseInt(match[2]);
                b = parseInt(match[3]);
            } else {
                return color;
            }
        } else {
            return color;
        }

        // Adjust brightness
        r = Math.max(0, Math.min(255, r + amount));
        g = Math.max(0, Math.min(255, g + amount));
        b = Math.max(0, Math.min(255, b + amount));

        return `rgb(${r}, ${g}, ${b})`;
    }

    // Helper function to get RGB values from color
    function getRGBValues(color) {
        // Convert hex to RGB
        let r, g, b;
        if (color.startsWith("#")) {
            const hex = color.substring(1);
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
            return `${r}, ${g}, ${b}`;
        } else if (color.startsWith("rgb")) {
            const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
            if (match) {
                return `${match[1]}, ${match[2]}, ${match[3]}`;
            }
        }
        return "50, 196, 141"; // Default fallback
    }

    // Generate CSS for this loader
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "48px";
        const speed = config.speed || 1.0;
        const duration = (1.8 / speed).toFixed(2) + "s";
        const darkerColor = adjustColor(color, -20);
        const rgbValues = getRGBValues(color);

        return `
/* Particle Converge Loader */
.cxc-particle-converge {
    position: relative;
    width: ${size};
    height: ${size};
}

.cxc-particle {
    position: absolute;
    width: 7px;
    height: 7px;
    background: radial-gradient(circle at center, ${color}, ${darkerColor});
    border-radius: 50%;
    opacity: 0;
    animation: cxc-float-in ${duration} cubic-bezier(0.42, 0, 0.58, 1) infinite;
    box-shadow: 0 0 7px rgba(${rgbValues}, 0.4);
}

.cxc-particle:nth-child(1) { --x: 0px; --y: 0px; animation-delay: 0s; }
.cxc-particle:nth-child(2) { --x: 60px; --y: 5px; animation-delay: 0.2s; }
.cxc-particle:nth-child(3) { --x: -5px; --y: 35px; animation-delay: 0.4s; }
.cxc-particle:nth-child(4) { --x: 65px; --y: 55px; animation-delay: 0.6s; }
.cxc-particle:nth-child(5) { --x: 5px; --y: 60px; animation-delay: 0.8s; }
.cxc-particle:nth-child(6) { --x: 55px; --y: 0px; animation-delay: 1s; }
.cxc-particle:nth-child(7) { --x: 30px; --y: -5px; animation-delay: 1.2s; }
.cxc-particle:nth-child(8) { --x: 0px; --y: 25px; animation-delay: 1.4s; }
.cxc-particle:nth-child(9) { --x: 60px; --y: 45px; animation-delay: 1.6s; }
.cxc-particle:nth-child(10) { --x: 50px; --y: 60px; animation-delay: 1.8s; }
.cxc-particle:nth-child(11) { --x: 5px; --y: 10px; animation-delay: 2s; }
.cxc-particle:nth-child(12) { --x: 40px; --y: 55px; animation-delay: 2.2s; }

@keyframes cxc-float-in {
    0% {
        transform: translate(var(--x), var(--y)) scale(0.3);
        opacity: 0;
        filter: blur(2px);
    }
    40% {
        opacity: 1;
        filter: blur(0px);
    }
    100% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
        filter: blur(1px);
    }
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        return `
// Create a particle converge loader
function createParticleConverge(config = {}) {
    // Default configuration
    const defaultConfig = {
        color: '${config.color}',
        shade: ${config.shade},
        size: '48px',
        speed: ${config.speed}
    };

    // Merge configurations
    const mergedConfig = {...defaultConfig, ...config};

    // Create container
    const container = document.createElement('div');
    container.className = 'cxc-particle-converge';
    container.style.position = 'relative';
    container.style.width = mergedConfig.size;
    container.style.height = mergedConfig.size;

    // Get animation duration based on speed
    const duration = (1.8 / mergedConfig.speed).toFixed(2) + 's';

    // Helper function to adjust color brightness
    function adjustColor(color, amount) {
        // Convert hex to RGB
        let r, g, b;
        if (color.startsWith('#')) {
            const hex = color.substring(1);
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else if (color.startsWith('rgb')) {
            const match = color.match(/rgba?\\(\\d+,\\s*\\d+,\\s*\\d+(?:,\\s*[\\d.]+)?\\)/);
            if (match) {
                r = parseInt(match[1]);
                g = parseInt(match[2]);
                b = parseInt(match[3]);
            } else {
                return color;
            }
        } else {
            return color;
        }

        // Adjust brightness
        r = Math.max(0, Math.min(255, r + amount));
        g = Math.max(0, Math.min(255, g + amount));
        b = Math.max(0, Math.min(255, b + amount));

        return \`rgb(\${r}, \${g}, \${b})\`;
    }

    // Helper function to get RGB values from color
    function getRGBValues(color) {
        // Convert hex to RGB
        let r, g, b;
        if (color.startsWith('#')) {
            const hex = color.substring(1);
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
            return \`\${r}, \${g}, \${b}\`;
        } else if (color.startsWith('rgb')) {
            const match = color.match(/rgba?\\(\\d+,\\s*\\d+,\\s*\\d+(?:,\\s*[\\d.]+)?\\)/);
            if (match) {
                return \`\${match[1]}, \${match[2]}, \${match[3]}\`;
            }
        }
        return '50, 196, 141'; // Default fallback
    }

    // Define particle positions - shifted right 30px and down 30px
    const positions = [
        { x: 0, y: 0, delay: 0 },
        { x: 60, y: 5, delay: 0.2 },
        { x: -5, y: 35, delay: 0.4 },
        { x: 65, y: 55, delay: 0.6 },
        { x: 5, y: 60, delay: 0.8 },
        { x: 55, y: 0, delay: 1 },
        { x: 30, y: -5, delay: 1.2 },
        { x: 0, y: 25, delay: 1.4 },
        { x: 60, y: 45, delay: 1.6 },
        { x: 50, y: 60, delay: 1.8 },
        { x: 5, y: 10, delay: 2 },
        { x: 40, y: 55, delay: 2.2 }
    ];

    // Create particles
    const darkerColor = adjustColor(mergedConfig.color, -20);
    const rgbValues = getRGBValues(mergedConfig.color);

    for (let i = 0; i < positions.length; i++) {
        const particle = document.createElement('div');
        particle.className = 'cxc-particle';

        // Set styles
        particle.style.position = 'absolute';
        particle.style.width = '7px';
        particle.style.height = '7px';
        particle.style.background = \`radial-gradient(circle at center, \${mergedConfig.color}, \${darkerColor})\`;
        particle.style.borderRadius = '50%';
        particle.style.opacity = '0';
        particle.style.boxShadow = \`0 0 7px rgba(\${rgbValues}, 0.4)\`;

        // Set animation with custom properties
        particle.style.setProperty('--x', \`\${positions[i].x}px\`);
        particle.style.setProperty('--y', \`\${positions[i].y}px\`);
        particle.style.animation = \`cxc-float-in \${duration} cubic-bezier(0.42, 0, 0.58, 1) infinite\`;
        particle.style.animationDelay = \`\${positions[i].delay}s\`;

        container.appendChild(particle);
    }

    // Add keyframes if they don't exist
    if (!document.getElementById('cxc-float-in-keyframes')) {
        const style = document.createElement('style');
        style.id = 'cxc-float-in-keyframes';
        style.textContent = \`
            @keyframes cxc-float-in {
                0% {
                    transform: translate(var(--x), var(--y)) scale(0.3);
                    opacity: 0;
                    filter: blur(2px);
                }
                40% {
                    opacity: 1;
                    filter: blur(0px);
                }
                100% {
                    transform: translate(0, 0) scale(1);
                    opacity: 0;
                    filter: blur(1px);
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

    // Log registration
    console.log(`Registered loader: ${CATEGORY}-${NAME}`);

    // Force registration to global object
    if (!window.CXCLoader.loaderExists(CATEGORY, NAME)) {
        console.warn(`Loader ${CATEGORY}-${NAME} not properly registered, forcing registration...`);
        window.CXCLoader.registerLoader(CATEGORY, NAME, createLoader, generateCSS, generateJS);
    }
})();
