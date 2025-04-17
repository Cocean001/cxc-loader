/**
 * CXC-Loader - Whisper Float
 * A floating particles loader inspired by PositiveGPT
 */

(function () {
    // Category and name for this loader
    const CATEGORY = "pulse";
    const NAME = "whisper-float";

    // Create the loader element
    function createLoader(config) {
        // Create container
        const container = document.createElement("div");
        container.className = "cxc-whisper-float";

        // Create floating particles
        for (let i = 0; i < 5; i++) {
            const float = document.createElement("div");
            float.className = "cxc-float";
            container.appendChild(float);
        }

        // Apply custom styles
        applyStyles(container, config);

        return container;
    }

    // Apply styles based on configuration
    function applyStyles(element, config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "80px";
        const speed = config.speed || 1.0;
        const duration = (3 / speed).toFixed(2) + "s";

        // Apply styles to container
        element.style.position = "relative";
        element.style.width = size;
        element.style.height = size;

        // Apply styles to float elements
        const floats = element.querySelectorAll(".cxc-float");
        floats.forEach((float, index) => {
            float.style.position = "absolute";
            float.style.width = "6px";
            float.style.height = "6px";
            float.style.backgroundColor = color;
            float.style.borderRadius = "50%";
            float.style.opacity = "0";
            float.style.animation = `cxc-float-up ${duration} ease-in-out infinite`;

            // Set different positions and delays
            const positions = [
                { top: "70%", left: "30%" },
                { top: "80%", left: "50%" },
                { top: "75%", left: "70%" },
                { top: "85%", left: "40%" },
                { top: "78%", left: "60%" },
            ];

            if (index < positions.length) {
                float.style.top = positions[index].top;
                float.style.left = positions[index].left;
                float.style.animationDelay = (index * 0.6).toFixed(1) + "s";
            }
        });

        // Add keyframes if they don't exist
        if (!document.getElementById("cxc-float-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-float-keyframes";
            style.textContent = `
                @keyframes cxc-float-up {
                    0% {
                        transform: translateY(0) scale(0.8);
                        opacity: 0;
                    }
                    40% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-60px) scale(1);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Generate CSS for this loader
    function generateCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const size = config.size || "80px";
        const speed = config.speed || 1.0;
        const duration = (3 / speed).toFixed(2) + "s";

        return `
/* Whisper Float Loader */
.cxc-whisper-float {
    position: relative;
    width: ${size};
    height: ${size};
}

.cxc-float {
    position: absolute;
    width: 6px;
    height: 6px;
    background: ${color};
    border-radius: 50%;
    opacity: 0;
    animation: cxc-float-up ${duration} ease-in-out infinite;
}

.cxc-float:nth-child(1) { top: 70%; left: 30%; animation-delay: 0s; }
.cxc-float:nth-child(2) { top: 80%; left: 50%; animation-delay: 0.6s; }
.cxc-float:nth-child(3) { top: 75%; left: 70%; animation-delay: 1.2s; }
.cxc-float:nth-child(4) { top: 85%; left: 40%; animation-delay: 1.8s; }
.cxc-float:nth-child(5) { top: 78%; left: 60%; animation-delay: 2.4s; }

@keyframes cxc-float-up {
    0% {
        transform: translateY(0) scale(0.8);
        opacity: 0;
    }
    40% {
        opacity: 1;
    }
    100% {
        transform: translateY(-60px) scale(1);
        opacity: 0;
    }
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        return `
// Create a whisper float loader
function createWhisperFloat(config = {}) {
    // Default configuration
    const defaultConfig = {
        color: '${config.color}',
        shade: ${config.shade},
        size: '80px',
        speed: ${config.speed}
    };

    // Merge configurations
    const mergedConfig = {...defaultConfig, ...config};

    // Create container
    const container = document.createElement('div');
    container.className = 'cxc-whisper-float';
    container.style.position = 'relative';
    container.style.width = mergedConfig.size;
    container.style.height = mergedConfig.size;

    // Get animation duration based on speed
    const duration = (3 / mergedConfig.speed).toFixed(2) + 's';

    // Create floating particles
    const positions = [
        { top: '70%', left: '30%', delay: '0s' },
        { top: '80%', left: '50%', delay: '0.6s' },
        { top: '75%', left: '70%', delay: '1.2s' },
        { top: '85%', left: '40%', delay: '1.8s' },
        { top: '78%', left: '60%', delay: '2.4s' }
    ];

    for (let i = 0; i < 5; i++) {
        const float = document.createElement('div');
        float.className = 'cxc-float';
        float.style.position = 'absolute';
        float.style.width = '6px';
        float.style.height = '6px';
        float.style.backgroundColor = mergedConfig.color;
        float.style.borderRadius = '50%';
        float.style.opacity = '0';
        float.style.animation = \`cxc-float-up \${duration} ease-in-out infinite\`;

        // Set position and delay
        float.style.top = positions[i].top;
        float.style.left = positions[i].left;
        float.style.animationDelay = positions[i].delay;

        container.appendChild(float);
    }

    // Add keyframes if they don't exist
    if (!document.getElementById('cxc-float-keyframes')) {
        const style = document.createElement('style');
        style.id = 'cxc-float-keyframes';
        style.textContent = \`
            @keyframes cxc-float-up {
                0% {
                    transform: translateY(0) scale(0.8);
                    opacity: 0;
                }
                40% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-60px) scale(1);
                    opacity: 0;
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

    // Expose the create function globally for direct access
    window.createWhisperFloat = function (config = {}) {
        return createLoader(config);
    };
})();
