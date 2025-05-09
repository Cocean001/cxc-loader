/**
 * CXC-Loader - Main JavaScript
 * Handles UI interactions and loader display
 */

// Global variables
let currentFilter = "all";
let searchQuery = "";

// Function to update all loaders on the page
function updateAllLoaders() {
    console.log("Updating all loaders with current configuration");

    // Get current global config
    const globalConfig = CXCLoader.getGlobalConfig();
    console.log("Current global config:", globalConfig);

    // Update each loader in the grid
    document.querySelectorAll(".loader-placeholder").forEach((placeholder) => {
        const card = placeholder.closest(".loader-card");
        if (!card) return;

        const loaderId = card.dataset.loaderId;
        if (!loaderId) return;

        const [category, type] = loaderId.split("-");

        try {
            // Clear placeholder
            placeholder.innerHTML = "";

            // Create new loader with updated config
            if (CXCLoader.loaderExists(category, type)) {
                const loaderElement = CXCLoader.createLoader(category, type, globalConfig);
                placeholder.appendChild(loaderElement);
                card.classList.add("loader-loaded");
            } else {
                placeholder.innerHTML = `<div class="error-message">Loader not found</div>`;
            }
        } catch (error) {
            console.error(`Error updating loader ${loaderId}:`, error);
            placeholder.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
        }
    });

    // Update modal content if it's open
    updateModalContent();
}

// Initialize loader cards on the page
function initLoaderCards() {
    console.log("Initializing loader cards");

    const loadersGrid = document.getElementById("loadersGrid");
    if (!loadersGrid) {
        console.error("Could not find loadersGrid element");
        return;
    }

    // Clear the grid
    loadersGrid.innerHTML = "";

    // Filter loaders based on current filter and search query
    const filteredLoaders = loaderData.filter((loader) => {
        // Filter by category
        const categoryMatch = currentFilter === "all" || loader.category === currentFilter;

        // Filter by search query
        const searchMatch =
            !searchQuery ||
            loader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loader.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loader.tag.toLowerCase().includes(searchQuery.toLowerCase());

        return categoryMatch && searchMatch;
    });

    // Sort loaders by creation date (newest first)
    filteredLoaders.sort((a, b) => {
        // Sort by creation date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Display message if no loaders match the filters
    if (filteredLoaders.length === 0) {
        const noResults = document.createElement("div");
        noResults.className = "no-results";
        noResults.textContent = "No loaders match your criteria";
        loadersGrid.appendChild(noResults);
        return;
    }

    // Create cards for each loader with lazy loading
    const createCards = () => {
        // Create all card elements first without loaders
        filteredLoaders.forEach((loader) => {
            // Create card element
            const card = document.createElement("div");
            card.className = "loader-card";
            card.dataset.category = loader.category;
            card.dataset.loaderId = loader.id;

            // Add click event to open modal
            card.addEventListener("click", () => openLoaderModal(loader.id));

            // Create tag element
            const tag = document.createElement("div");
            tag.className = "loader-tag";
            tag.dataset.category = loader.category;
            tag.textContent = loader.tag;
            card.appendChild(tag);

            // Create placeholder for loader
            const placeholder = document.createElement("div");
            placeholder.className = "loader-placeholder";
            placeholder.innerHTML = '<div class="loader-loading"></div>';
            card.appendChild(placeholder);

            // Create name element
            const name = document.createElement("div");
            name.className = "loader-name";
            name.textContent = loader.name;
            card.appendChild(name);

            // Add card to grid
            loadersGrid.appendChild(card);
        });

        // Set up intersection observer for lazy loading
        setupLazyLoading();
    };

    // Set up lazy loading with Intersection Observer
    function setupLazyLoading() {
        // Options for the observer
        const options = {
            root: null, // viewport is the root
            rootMargin: "200px", // load when within 200px of viewport
            threshold: 0.01, // trigger when 1% of the element is visible
        };

        // Create a map to track which cards have been loaded
        const loadedCards = new Map();

        // Create the observer
        const observer = new IntersectionObserver((entries, observer) => {
            // Process visible cards in batches
            const visibleCards = entries
                .filter((entry) => entry.isIntersecting)
                .map((entry) => entry.target)
                .filter((card) => !loadedCards.get(card.dataset.loaderId));

            if (visibleCards.length === 0) return;

            // Process cards in small batches to prevent UI freezing
            const batchSize = 4;
            for (let i = 0; i < visibleCards.length; i += batchSize) {
                const batch = visibleCards.slice(i, i + batchSize);

                // Use setTimeout to stagger the loading
                setTimeout(() => {
                    batch.forEach((card) => {
                        loadCard(card);
                        // Mark this card as loaded
                        loadedCards.set(card.dataset.loaderId, true);
                        // Stop observing this card
                        observer.unobserve(card);
                    });
                }, i * 50); // Stagger the loading of each batch
            }
        }, options);

        // Start observing all cards
        document.querySelectorAll(".loader-card").forEach((card) => {
            observer.observe(card);
        });

        // Load the first two rows immediately (typically 4 cards per row)
        const firstRowCards = Array.from(document.querySelectorAll(".loader-card")).slice(0, 8);
        firstRowCards.forEach((card) => {
            loadCard(card);
            loadedCards.set(card.dataset.loaderId, true);
            observer.unobserve(card);
        });

        // Force a scroll event to trigger the observer
        setTimeout(() => {
            window.dispatchEvent(new Event("scroll"));
        }, 500);
    }

    // Function to load a single card
    function loadCard(card) {
        const loaderId = card.dataset.loaderId;
        if (!loaderId) return;

        const placeholder = card.querySelector(".loader-placeholder");
        if (!placeholder) return;

        try {
            const [category, type] = loaderId.split("-");

            // Map loader IDs to correct category/type
            let loaderCategory = category;
            let loaderType = type;

            // Special cases for loader IDs
            if (loaderId === "dots-default") {
                loaderCategory = "dots";
                loaderType = "default";
            } else if (loaderId === "pulse-basic") {
                loaderCategory = "pulse";
                loaderType = "basic";
            } else if (loaderId === "spinner-basic") {
                // spinner-basic could be either in spinner.js or spinner-basic.js
                if (!CXCLoader.loaderExists("spinner", "basic")) {
                    console.log("Trying alternative registration for spinner-basic");
                    // Try to register it manually
                    if (typeof createBasicSpinner === "function") {
                        CXCLoader.registerLoader("spinner", "basic", createBasicSpinner);
                    }
                }
            } else if (loaderId === "pulse-whisper-float") {
                loaderCategory = "pulse";
                loaderType = "whisper-float";
                // Force registration if needed
                if (!CXCLoader.loaderExists(loaderCategory, loaderType)) {
                    console.log(`Forcing registration for ${loaderCategory}-${loaderType}`);
                    window.CXCLoader.registerLoader(loaderCategory, loaderType, window.createWhisperFloat);
                }
            } else if (loaderId === "pulse-particle-converge") {
                loaderCategory = "pulse";
                loaderType = "particle-converge";
                // Force registration if needed
                if (!CXCLoader.loaderExists(loaderCategory, loaderType)) {
                    console.log(`Forcing registration for ${loaderCategory}-${loaderType}`);
                    window.CXCLoader.registerLoader(loaderCategory, loaderType, window.createParticleConverge);
                }
            } else if (loaderId === "dots-bounce") {
                loaderCategory = "dots";
                loaderType = "bounce";
            } else if (loaderId === "spinner-triple") {
                loaderCategory = "spinner";
                loaderType = "triple";
            } else if (loaderId === "spinner-siri-wave") {
                loaderCategory = "spinner";
                loaderType = "siri-wave";
            } else if (loaderId === "spinner-bubble-pulse") {
                loaderCategory = "spinner";
                loaderType = "bubble-pulse";
            } else if (loaderId === "spinner-fluid-orbit") {
                loaderCategory = "spinner";
                loaderType = "fluid-orbit";
            } else if (loaderId === "wave-oscillate") {
                loaderCategory = "wave";
                loaderType = "oscillate";
            } else if (loaderId === "fluid-liquid") {
                loaderCategory = "fluid";
                loaderType = "liquid";
            }

            if (CXCLoader.loaderExists(loaderCategory, loaderType)) {
                const loaderElement = CXCLoader.createLoader(loaderCategory, loaderType);
                placeholder.innerHTML = "";
                placeholder.appendChild(loaderElement);
                card.classList.add("loader-loaded");
            } else {
                console.warn(`Loader ${loaderId} (${loaderCategory}-${loaderType}) not found in registry`);
                placeholder.innerHTML = `<div class="error-message">Loader not available</div>`;
            }
        } catch (error) {
            console.error(`Error creating loader ${loaderId}:`, error);
            placeholder.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
        }
    }

    // Execute the card creation process
    createCards();
}

// Open loader modal
function openLoaderModal(loaderId) {
    console.log(`Opening modal for loader: ${loaderId}`);

    const modal = document.getElementById("loaderModal");
    const modalTitle = document.getElementById("modalTitle");
    const loaderPreview = document.getElementById("loaderPreview");

    if (!modal || !modalTitle || !loaderPreview) {
        console.error("Modal elements not found");
        return;
    }

    // Find loader data
    const loader = loaderData.find((l) => l.id === loaderId);
    if (!loader) {
        console.error(`Loader with ID ${loaderId} not found`);
        return;
    }

    // Set current loader ID in modal dataset
    modal.dataset.currentLoader = loaderId;

    // Update modal title
    modalTitle.textContent = loader.name;

    // Clear loader preview
    loaderPreview.innerHTML = "";

    // Create loader for preview
    const [category, type] = loaderId.split("-");

    // Map loader IDs to correct category/type
    let loaderCategory = category;
    let loaderType = type;

    // Special cases for loader IDs
    if (loaderId === "dots-default") {
        loaderCategory = "dots";
        loaderType = "default";
    } else if (loaderId === "pulse-basic") {
        loaderCategory = "pulse";
        loaderType = "basic";
    } else if (loaderId === "pulse-whisper-float") {
        loaderCategory = "pulse";
        loaderType = "whisper-float";
        // Force registration if needed
        if (!CXCLoader.loaderExists(loaderCategory, loaderType)) {
            console.log(`Forcing registration for ${loaderCategory}-${loaderType}`);
            window.CXCLoader.registerLoader(loaderCategory, loaderType, window.createWhisperFloat);
        }
    } else if (loaderId === "pulse-particle-converge") {
        loaderCategory = "pulse";
        loaderType = "particle-converge";
        // Force registration if needed
        if (!CXCLoader.loaderExists(loaderCategory, loaderType)) {
            console.log(`Forcing registration for ${loaderCategory}-${loaderType}`);
            window.CXCLoader.registerLoader(loaderCategory, loaderType, window.createParticleConverge);
        }
    } else if (loaderId === "dots-bounce") {
        loaderCategory = "dots";
        loaderType = "bounce";
    } else if (loaderId === "spinner-triple") {
        loaderCategory = "spinner";
        loaderType = "triple";
    } else if (loaderId === "spinner-siri-wave") {
        loaderCategory = "spinner";
        loaderType = "siri-wave";
    } else if (loaderId === "spinner-bubble-pulse") {
        loaderCategory = "spinner";
        loaderType = "bubble-pulse";
    } else if (loaderId === "spinner-fluid-orbit") {
        loaderCategory = "spinner";
        loaderType = "fluid-orbit";
    } else if (loaderId === "fluid-liquid") {
        loaderCategory = "fluid";
        loaderType = "liquid";
    }

    try {
        if (CXCLoader.loaderExists(loaderCategory, loaderType)) {
            const loaderElement = CXCLoader.createLoader(loaderCategory, loaderType);
            loaderPreview.appendChild(loaderElement);
        } else {
            console.warn(`Loader ${loaderId} (${loaderCategory}-${loaderType}) not found in registry`);
            loaderPreview.innerHTML = `<div class="error-message">Loader not available</div>`;
        }
    } catch (error) {
        console.error(`Error creating loader for modal: ${error.message}`);
        loaderPreview.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
    }

    // Update code snippets
    if (loaderId === "pulse-particle-converge") {
        // Special case for P004
        const config = CXCLoader.getGlobalConfig();
        const cssCode = document.getElementById("cssCode");
        const jsCode = document.getElementById("jsCode");

        if (cssCode) {
            cssCode.textContent = generateParticleConvergeCSS(config);
            Prism.highlightElement(cssCode);
        }

        if (jsCode) {
            jsCode.textContent = generateParticleConvergeJS(config);
            Prism.highlightElement(jsCode);
        }
    } else if (loaderId === "pulse-whisper-float") {
        // Special case for P003
        const config = CXCLoader.getGlobalConfig();
        const cssCode = document.getElementById("cssCode");
        const jsCode = document.getElementById("jsCode");

        if (cssCode) {
            cssCode.textContent = generateWhisperFloatCSS(config);
            Prism.highlightElement(cssCode);
        }

        if (jsCode) {
            jsCode.textContent = generateWhisperFloatJS(config);
            Prism.highlightElement(jsCode);
        }
    } else {
        updateCodeSnippets(category, type);
    }

    // Show modal
    modal.classList.add("active");
    document.body.classList.add("modal-open");
}

// Update code snippets in the modal
function updateCodeSnippets(category, type) {
    const cssCode = document.getElementById("cssCode");
    const jsCode = document.getElementById("jsCode");

    if (!cssCode || !jsCode) {
        console.error("Code elements not found");
        return;
    }

    // Map loader IDs to correct category/type
    let loaderCategory = category;
    let loaderType = type;

    // Special cases for loader IDs
    if (category === "dots" && type === "default") {
        loaderCategory = "dots";
        loaderType = "default";
    } else if (category === "pulse" && type === "basic") {
        loaderCategory = "pulse";
        loaderType = "basic";
    } else if (category === "pulse" && type === "whisper-float") {
        loaderCategory = "pulse";
        loaderType = "whisper-float";
        // Force registration if needed
        if (!CXCLoader.loaderExists(loaderCategory, loaderType)) {
            console.log(`Forcing registration for ${loaderCategory}-${loaderType}`);
            window.CXCLoader.registerLoader(loaderCategory, loaderType, window.createWhisperFloat);
        }
    } else if (category === "pulse" && type === "particle-converge") {
        loaderCategory = "pulse";
        loaderType = "particle-converge";
        // Force registration if needed
        if (!CXCLoader.loaderExists(loaderCategory, loaderType)) {
            console.log(`Forcing registration for ${loaderCategory}-${loaderType}`);
            window.CXCLoader.registerLoader(loaderCategory, loaderType, window.createParticleConverge);
        }
    } else if (category === "dots" && type === "bounce") {
        loaderCategory = "dots";
        loaderType = "bounce";
    } else if (category === "spinner" && type === "triple") {
        loaderCategory = "spinner";
        loaderType = "triple";
    } else if (category === "spinner" && type === "siri-wave") {
        loaderCategory = "spinner";
        loaderType = "siri-wave";
    } else if (category === "spinner" && type === "bubble-pulse") {
        loaderCategory = "spinner";
        loaderType = "bubble-pulse";
    } else if (category === "spinner" && type === "fluid-orbit") {
        loaderCategory = "spinner";
        loaderType = "fluid-orbit";
    } else if (category === "wave" && type === "oscillate") {
        loaderCategory = "wave";
        loaderType = "oscillate";
    } else if (category === "fluid" && type === "liquid") {
        loaderCategory = "fluid";
        loaderType = "liquid";
    }

    // Get current config
    const config = CXCLoader.getGlobalConfig();

    // Update CSS code
    try {
        if (CXCLoader.loaderExists(loaderCategory, loaderType)) {
            const css = CXCLoader.getLoaderCSS(loaderCategory, loaderType, config);
            cssCode.textContent = css;
            Prism.highlightElement(cssCode);
        } else if (loaderCategory === "pulse" && loaderType === "whisper-float") {
            // Special case for whisper-float
            const whisperFloatCSS = generateWhisperFloatCSS(config);
            cssCode.textContent = whisperFloatCSS;
            Prism.highlightElement(cssCode);
        } else if (loaderCategory === "pulse" && loaderType === "particle-converge") {
            // Special case for particle-converge
            const particleConvergeCSS = generateParticleConvergeCSS(config);
            cssCode.textContent = particleConvergeCSS;
            Prism.highlightElement(cssCode);
        } else {
            cssCode.textContent = "/* Loader not available */";
            Prism.highlightElement(cssCode);
        }
    } catch (error) {
        console.error(`Error generating CSS: ${error.message}`);
        cssCode.textContent = `/* Error: ${error.message} */`;
        Prism.highlightElement(cssCode);
    }

    // Update JS code
    try {
        if (CXCLoader.loaderExists(loaderCategory, loaderType)) {
            const js = CXCLoader.getLoaderJS(loaderCategory, loaderType, config);
            jsCode.textContent = js;
            Prism.highlightElement(jsCode);
        } else if (loaderCategory === "pulse" && loaderType === "whisper-float") {
            // Special case for whisper-float
            const whisperFloatJS = generateWhisperFloatJS(config);
            jsCode.textContent = whisperFloatJS;
            Prism.highlightElement(jsCode);
        } else if (loaderCategory === "pulse" && loaderType === "particle-converge") {
            // Special case for particle-converge
            const particleConvergeJS = generateParticleConvergeJS(config);
            jsCode.textContent = particleConvergeJS;
            Prism.highlightElement(jsCode);
        } else {
            jsCode.textContent = "// Loader not available";
            Prism.highlightElement(jsCode);
        }
    } catch (error) {
        console.error(`Error generating JS: ${error.message}`);
        jsCode.textContent = `// Error: ${error.message}`;
        Prism.highlightElement(jsCode);
    }
}

// Update modal content
function updateModalContent() {
    const modal = document.getElementById("loaderModal");

    // Only update if modal is visible
    if (modal && modal.classList.contains("active")) {
        const loaderPreview = document.getElementById("loaderPreview");

        if (!loaderPreview) return;

        // Get current loader ID from the modal
        const loaderId = modal.dataset.currentLoader;
        if (!loaderId) return;

        const [category, type] = loaderId.split("-");

        // Map loader IDs to correct category/type
        let loaderCategory = category;
        let loaderType = type;

        // Special cases for loader IDs
        if (loaderId === "dots-default") {
            loaderCategory = "dots";
            loaderType = "default";
        } else if (loaderId === "pulse-basic") {
            loaderCategory = "pulse";
            loaderType = "basic";
        } else if (loaderId === "pulse-whisper-float") {
            loaderCategory = "pulse";
            loaderType = "whisper-float";
            // Force registration if needed
            if (!CXCLoader.loaderExists(loaderCategory, loaderType)) {
                console.log(`Forcing registration for ${loaderCategory}-${loaderType}`);
                window.CXCLoader.registerLoader(loaderCategory, loaderType, window.createWhisperFloat);
            }
        } else if (loaderId === "pulse-particle-converge") {
            loaderCategory = "pulse";
            loaderType = "particle-converge";
            // Force registration if needed
            if (!CXCLoader.loaderExists(loaderCategory, loaderType)) {
                console.log(`Forcing registration for ${loaderCategory}-${loaderType}`);
                window.CXCLoader.registerLoader(loaderCategory, loaderType, window.createParticleConverge);
            }
        } else if (loaderId === "dots-bounce") {
            loaderCategory = "dots";
            loaderType = "bounce";
        } else if (loaderId === "spinner-triple") {
            loaderCategory = "spinner";
            loaderType = "triple";
        } else if (loaderId === "spinner-siri-wave") {
            loaderCategory = "spinner";
            loaderType = "siri-wave";
        } else if (loaderId === "spinner-bubble-pulse") {
            loaderCategory = "spinner";
            loaderType = "bubble-pulse";
        } else if (loaderId === "spinner-fluid-orbit") {
            loaderCategory = "spinner";
            loaderType = "fluid-orbit";
        } else if (loaderId === "wave-oscillate") {
            loaderCategory = "wave";
            loaderType = "oscillate";
        } else if (loaderId === "fluid-liquid") {
            loaderCategory = "fluid";
            loaderType = "liquid";
        }

        // Update loader preview
        loaderPreview.innerHTML = "";

        try {
            if (CXCLoader.loaderExists(loaderCategory, loaderType)) {
                const loaderElement = CXCLoader.createLoader(loaderCategory, loaderType);
                loaderPreview.appendChild(loaderElement);
            } else {
                console.warn(`Loader ${loaderId} (${loaderCategory}-${loaderType}) not found in registry`);
                loaderPreview.innerHTML = `<div class="error-message">Loader not available</div>`;
            }
        } catch (error) {
            console.error(`Error updating loader in modal: ${error.message}`);
            loaderPreview.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
        }

        // Update code snippets
        if (loaderId === "pulse-particle-converge") {
            // Special case for P004
            const config = CXCLoader.getGlobalConfig();
            const cssCode = document.getElementById("cssCode");
            const jsCode = document.getElementById("jsCode");

            if (cssCode) {
                cssCode.textContent = generateParticleConvergeCSS(config);
                Prism.highlightElement(cssCode);
            }

            if (jsCode) {
                jsCode.textContent = generateParticleConvergeJS(config);
                Prism.highlightElement(jsCode);
            }
        } else if (loaderId === "pulse-whisper-float") {
            // Special case for P003
            const config = CXCLoader.getGlobalConfig();
            const cssCode = document.getElementById("cssCode");
            const jsCode = document.getElementById("jsCode");

            if (cssCode) {
                cssCode.textContent = generateWhisperFloatCSS(config);
                Prism.highlightElement(cssCode);
            }

            if (jsCode) {
                jsCode.textContent = generateWhisperFloatJS(config);
                Prism.highlightElement(jsCode);
            }
        } else {
            updateCodeSnippets(loaderCategory, loaderType);
        }
    }
}

// Close loader modal
function closeLoaderModal() {
    const modal = document.getElementById("loaderModal");

    if (modal) {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
    }
}

// Initialize color options in the control panel
function initColorOptions() {
    const colorOptions = document.getElementById("colorOptions");

    if (!colorOptions) {
        console.error("Color options element not found");
        return;
    }

    // Get available colors
    const colors = CXCLoader.getAvailableColors();

    // Clear existing options
    colorOptions.innerHTML = "";

    // Create color buttons
    colors.forEach((color) => {
        const button = document.createElement("button");
        button.className = "color-option";
        button.dataset.color = color;
        button.style.backgroundColor = CXCLoader.getColor(color, 500);

        // Mark current color as selected
        const currentConfig = CXCLoader.getGlobalConfig();
        if (color === currentConfig.color) {
            button.classList.add("selected");
        }

        // Add click event
        button.addEventListener("click", () => {
            // Update selected color
            document.querySelectorAll(".color-option").forEach((btn) => {
                btn.classList.remove("selected");
            });
            button.classList.add("selected");

            // Update global config
            const config = CXCLoader.getGlobalConfig();
            CXCLoader.updateGlobalConfig({
                ...config,
                color: color,
            });

            // Update shade options
            initShadeOptions(color);

            // Update all loaders
            updateAllLoaders();
        });

        colorOptions.appendChild(button);
    });
}

// Initialize shade options in the control panel
function initShadeOptions(color) {
    const shadeOptions = document.getElementById("shadeOptions");

    if (!shadeOptions) {
        console.error("Shade options element not found");
        return;
    }

    // Get current color if not provided
    if (!color) {
        const config = CXCLoader.getGlobalConfig();
        color = config.color;
    }

    // Get available shades for the color
    const shades = CXCLoader.getAvailableShades(color);

    // Clear existing options
    shadeOptions.innerHTML = "";

    // Create shade buttons
    shades.forEach((shade) => {
        const button = document.createElement("button");
        button.className = "shade-option";
        button.dataset.shade = shade;
        button.textContent = shade;
        button.style.backgroundColor = CXCLoader.getColor(color, shade);

        // Set text color based on shade (light or dark)
        const rgb = CXCLoader.getRGB(color, shade);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        button.style.color = brightness > 125 ? "#000" : "#fff";

        // Mark current shade as selected
        const currentConfig = CXCLoader.getGlobalConfig();
        if (shade === currentConfig.shade) {
            button.classList.add("selected");
        }

        // Add click event
        button.addEventListener("click", () => {
            // Update selected shade
            document.querySelectorAll(".shade-option").forEach((btn) => {
                btn.classList.remove("selected");
            });
            button.classList.add("selected");

            // Update global config
            const config = CXCLoader.getGlobalConfig();
            CXCLoader.updateGlobalConfig({
                ...config,
                shade: shade,
            });

            // Update all loaders
            updateAllLoaders();
        });

        shadeOptions.appendChild(button);
    });
}

// Initialize speed control
function initSpeedControl() {
    const speedSlider = document.getElementById("speedSlider");
    const speedValue = document.getElementById("speedValue");

    if (!speedSlider || !speedValue) {
        console.error("Speed control elements not found");
        return;
    }

    // Set initial value
    const config = CXCLoader.getGlobalConfig();
    speedSlider.value = config.speed;
    speedValue.textContent = `${config.speed.toFixed(1)}x`;

    // Add input event
    speedSlider.addEventListener("input", () => {
        const speed = parseFloat(speedSlider.value);
        speedValue.textContent = `${speed.toFixed(1)}x`;

        // Update global config
        CXCLoader.updateGlobalConfig({
            ...config,
            speed: speed,
        });

        // Update all loaders
        updateAllLoaders();
    });
}

// Initialize category filter
function initCategoryFilter() {
    const categoryButtons = document.querySelectorAll(".category-btn");

    // Calculate and add category counts
    updateCategoryCounts(categoryButtons);

    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Update selected category
            categoryButtons.forEach((btn) => {
                btn.classList.remove("active");
            });
            button.classList.add("active");

            // Update current filter
            currentFilter = button.dataset.category;

            // Reinitialize loader cards
            initLoaderCards();
        });
    });
}

// Update category counts
function updateCategoryCounts(categoryButtons) {
    // Count loaders by category
    const categoryCounts = {};

    // Count total loaders
    let totalCount = loaderData.length;

    // Count loaders in each category
    loaderData.forEach((loader) => {
        if (!categoryCounts[loader.category]) {
            categoryCounts[loader.category] = 0;
        }
        categoryCounts[loader.category]++;
    });

    // Update category buttons with counts
    categoryButtons.forEach((button) => {
        const category = button.dataset.category;
        const count = category === "all" ? totalCount : categoryCounts[category] || 0;

        // Create count element if it doesn't exist
        let countElement = button.querySelector(".category-count");
        if (!countElement) {
            countElement = document.createElement("span");
            countElement.className = "category-count";
            button.appendChild(countElement);
        }

        // Update count text
        countElement.textContent = count;
    });
}

// Initialize search functionality
function initSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const searchContainer = document.querySelector(".search-container");

    if (!searchInput || !searchButton || !searchContainer) {
        console.error("Search elements not found");
        return;
    }

    // Add input event
    searchInput.addEventListener("input", () => {
        searchQuery = searchInput.value.trim();
        initLoaderCards();
    });

    // Add click event to search button
    searchButton.addEventListener("click", () => {
        searchContainer.classList.toggle("active");
        if (searchContainer.classList.contains("active")) {
            // Animate search button rotation
            searchButton.style.transform = "rotate(90deg)";
            setTimeout(() => searchInput.focus(), 300);
        } else {
            // Reset search button rotation
            searchButton.style.transform = "rotate(0)";
            searchInput.value = "";
            searchQuery = "";
            initLoaderCards();
        }
    });

    // Add key event to search input
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            searchInput.value = "";
            searchQuery = "";
            searchContainer.classList.remove("active");
            searchButton.style.transform = "rotate(0)";
            initLoaderCards();
        }
    });

    // Close search when clicking outside
    document.addEventListener("click", (e) => {
        if (!searchContainer.contains(e.target) && searchContainer.classList.contains("active")) {
            searchContainer.classList.remove("active");
            searchButton.style.transform = "rotate(0)";
        }
    });
}

// Initialize theme toggle
function initThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) {
        console.error("Theme toggle element not found");
        return;
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Add click event
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        // Update icon
        if (document.body.classList.contains("dark-mode")) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem("theme", "dark");
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem("theme", "light");
        }
    });
}

// Initialize control panel
function initControlPanel() {
    const customizeBtn = document.getElementById("customizeBtn");
    const controlPanel = document.getElementById("controlPanel");
    const closePanel = document.getElementById("closePanel");
    const panelHeader = document.querySelector(".control-panel-header");
    const mainContent = document.querySelector(".main-content");

    if (!customizeBtn || !controlPanel || !closePanel) {
        console.error("Control panel elements not found");
        return;
    }

    // Function to close panel
    function closeControlPanel() {
        controlPanel.classList.remove("active");
        customizeBtn.classList.remove("hidden");
    }

    // Add click event to open panel
    customizeBtn.addEventListener("click", () => {
        controlPanel.classList.add("active");
        customizeBtn.classList.add("hidden");
    });

    // Add click event to close panel
    closePanel.addEventListener("click", closeControlPanel);

    // Close panel when clicking on main content
    if (mainContent) {
        mainContent.addEventListener("click", (e) => {
            if (controlPanel.classList.contains("active")) {
                closeControlPanel();
            }
        });
    }

    // Close panel when clicking anywhere outside the panel
    document.addEventListener("click", (e) => {
        if (
            controlPanel.classList.contains("active") &&
            !controlPanel.contains(e.target) &&
            e.target !== customizeBtn &&
            !customizeBtn.contains(e.target)
        ) {
            closeControlPanel();
        }
    });

    // Make panel draggable
    if (panelHeader) {
        let isDragging = false;
        let offsetX, offsetY;

        panelHeader.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - controlPanel.getBoundingClientRect().left;
            offsetY = e.clientY - controlPanel.getBoundingClientRect().top;
            controlPanel.style.transition = "none";
        });

        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                controlPanel.style.left = `${x}px`;
                controlPanel.style.top = `${y}px`;
                controlPanel.style.transform = "none";
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            controlPanel.style.transition = "transform 0.3s ease";
        });
    }
}

// Helper function to generate WhisperFloat CSS
function generateWhisperFloatCSS(config) {
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

// Helper function to generate WhisperFloat JS
function generateWhisperFloatJS(config) {
    // Make sure createWhisperFloat is defined globally
    if (!window.createWhisperFloat) {
        window.createWhisperFloat = function (config = {}) {
            // Default configuration
            const defaultConfig = {
                color: config.color || "blue",
                shade: config.shade || 500,
                size: "80px",
                speed: config.speed || 1.0,
            };

            // Merge configurations
            const mergedConfig = { ...defaultConfig, ...config };

            // Create container
            const container = document.createElement("div");
            container.className = "cxc-whisper-float";
            container.style.position = "relative";
            container.style.width = mergedConfig.size;
            container.style.height = mergedConfig.size;

            // Get animation duration based on speed
            const duration = (3 / mergedConfig.speed).toFixed(2) + "s";

            // Create floating particles
            const positions = [
                { top: "70%", left: "30%", delay: "0s" },
                { top: "80%", left: "50%", delay: "0.6s" },
                { top: "75%", left: "70%", delay: "1.2s" },
                { top: "85%", left: "40%", delay: "1.8s" },
                { top: "78%", left: "60%", delay: "2.4s" },
            ];

            for (let i = 0; i < 5; i++) {
                const float = document.createElement("div");
                float.className = "cxc-float";
                float.style.position = "absolute";
                float.style.width = "6px";
                float.style.height = "6px";
                float.style.backgroundColor = CXCLoader.getColor(mergedConfig.color, mergedConfig.shade);
                float.style.borderRadius = "50%";
                float.style.opacity = "0";
                float.style.animation = `cxc-float-up ${duration} ease-in-out infinite`;

                // Set position and delay
                float.style.top = positions[i].top;
                float.style.left = positions[i].left;
                float.style.animationDelay = positions[i].delay;

                container.appendChild(float);
            }

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

            return container;
        };
    }
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

// Helper function to generate ParticleConverge CSS
function generateParticleConvergeCSS(config) {
    const color = CXCLoader.getColor(config.color, config.shade);
    const size = config.size || "48px";
    const speed = config.speed || 1.0;
    const duration = (1.8 / speed).toFixed(2) + "s";

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

// Helper function to generate ParticleConverge JS
function generateParticleConvergeJS(config) {
    // Make sure createParticleConverge is defined globally
    if (!window.createParticleConverge) {
        window.createParticleConverge = function (config = {}) {
            // Default configuration
            const defaultConfig = {
                color: config.color || "blue",
                shade: config.shade || 500,
                size: "48px",
                speed: config.speed || 1.0,
            };

            // Merge configurations
            const mergedConfig = { ...defaultConfig, ...config };

            // Create container
            const container = document.createElement("div");
            container.className = "cxc-particle-converge";
            container.style.position = "relative";
            container.style.width = mergedConfig.size;
            container.style.height = mergedConfig.size;

            // Get animation duration based on speed
            const duration = (1.8 / mergedConfig.speed).toFixed(2) + "s";

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
                    const match = color.match(/rgba?\(\d+,\s*\d+,\s*\d+(?:,\s*[\d.]+)?\)/);
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
                    const match = color.match(/rgba?\(\d+,\s*\d+,\s*\d+(?:,\s*[\d.]+)?\)/);
                    if (match) {
                        return `${match[1]}, ${match[2]}, ${match[3]}`;
                    }
                }
                return "50, 196, 141"; // Default fallback
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
                { x: 40, y: 55, delay: 2.2 },
            ];

            // Create particles
            const color = CXCLoader.getColor(mergedConfig.color, mergedConfig.shade);
            const darkerColor = adjustColor(color, -20);
            const rgbValues = getRGBValues(color);

            for (let i = 0; i < positions.length; i++) {
                const particle = document.createElement("div");
                particle.className = "cxc-particle";

                // Set styles
                particle.style.position = "absolute";
                particle.style.width = "7px";
                particle.style.height = "7px";
                particle.style.background = `radial-gradient(circle at center, ${color}, ${darkerColor})`;
                particle.style.borderRadius = "50%";
                particle.style.opacity = "0";
                particle.style.boxShadow = `0 0 7px rgba(${rgbValues}, 0.4)`;

                // Set animation with custom properties
                particle.style.setProperty("--x", `${positions[i].x}px`);
                particle.style.setProperty("--y", `${positions[i].y}px`);
                particle.style.animation = `cxc-float-in ${duration} cubic-bezier(0.42, 0, 0.58, 1) infinite`;
                particle.style.animationDelay = `${positions[i].delay}s`;

                container.appendChild(particle);
            }

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

            return container;
        };
    }
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

// Initialize code expand buttons
function initCodeTabs() {
    const expandCssBtn = document.getElementById("expandCssBtn");
    const expandJsBtn = document.getElementById("expandJsBtn");
    const cssPanel = document.getElementById("cssPanel");
    const jsPanel = document.getElementById("jsPanel");

    if (expandCssBtn && cssPanel) {
        expandCssBtn.addEventListener("click", () => {
            if (cssPanel.classList.contains("expanded")) {
                cssPanel.classList.remove("expanded");
                cssPanel.classList.add("collapsed");
                expandCssBtn.textContent = "Show all code";
            } else {
                cssPanel.classList.remove("collapsed");
                cssPanel.classList.add("expanded");
                expandCssBtn.textContent = "Hide code";
            }
        });
    }

    if (expandJsBtn && jsPanel) {
        expandJsBtn.addEventListener("click", () => {
            if (jsPanel.classList.contains("expanded")) {
                jsPanel.classList.remove("expanded");
                jsPanel.classList.add("collapsed");
                expandJsBtn.textContent = "Show all code";
            } else {
                jsPanel.classList.remove("collapsed");
                jsPanel.classList.add("expanded");
                expandJsBtn.textContent = "Hide code";
            }
        });
    }
}

// Initialize copy buttons
function initCopyButtons() {
    const copyCssBtn = document.getElementById("copyCssBtn");
    const copyJsBtn = document.getElementById("copyJsBtn");

    if (copyCssBtn) {
        copyCssBtn.addEventListener("click", () => {
            const cssCode = document.getElementById("cssCode");
            if (cssCode) {
                copyToClipboard(cssCode.textContent);
                showToast("CSS copied to clipboard!");
            }
        });
    }

    if (copyJsBtn) {
        copyJsBtn.addEventListener("click", () => {
            const jsCode = document.getElementById("jsCode");
            if (jsCode) {
                copyToClipboard(jsCode.textContent);
                showToast("JavaScript copied to clipboard!");
            }
        });
    }
}

// Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            console.log("Text copied to clipboard");
        })
        .catch((err) => {
            console.error("Failed to copy text: ", err);
        });
}

// Show toast message
function showToast(message) {
    // Create toast element
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    // Add to body
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => {
        toast.classList.add("visible");
    }, 10);

    // Hide and remove toast after delay
    setTimeout(() => {
        toast.classList.remove("visible");
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Initialize modal close button and dragging
function initModalClose() {
    const closeModal = document.getElementById("closeModal");
    const modal = document.getElementById("loaderModal");
    const modalContent = modal ? modal.querySelector(".modal-content") : null;
    const modalHeader = modal ? modal.querySelector(".modal-header") : null;

    if (closeModal) {
        closeModal.addEventListener("click", closeLoaderModal);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeLoaderModal();
            }
        });
    }

    // Make modal draggable by header
    if (modalHeader && modalContent) {
        let isDragging = false;
        let offsetX, offsetY;

        modalHeader.addEventListener("mousedown", (e) => {
            // Prevent dragging when clicking on close button
            if (e.target.closest(".close-btn")) return;

            isDragging = true;
            offsetX = e.clientX - modalContent.getBoundingClientRect().left;
            offsetY = e.clientY - modalContent.getBoundingClientRect().top;
            modalContent.style.transition = "none";
            modalContent.style.margin = "0";
            modalContent.style.position = "absolute";
        });

        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;

                // Keep modal within viewport
                const maxX = window.innerWidth - modalContent.offsetWidth;
                const maxY = window.innerHeight - modalContent.offsetHeight;

                modalContent.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
                modalContent.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });
    }
}

// Verify the loader system is working
function verifyLoaderSystem() {
    console.log("Verifying loader system");

    // Check if spinner-basic loader exists
    if (CXCLoader.loaderExists("spinner", "basic")) {
        console.log("Spinner-basic loader found in registry");
    } else {
        console.warn("Spinner-basic loader not found in registry");
    }
}

// Handle page loading animation
function handlePageLoading() {
    const pageLoader = document.getElementById("pageLoader");
    if (!pageLoader) return;

    // Add a failsafe to ensure the loader is removed even if there are errors
    window.addEventListener("load", () => {
        // Hide the loader after initialization is complete
        setTimeout(() => {
            pageLoader.classList.add("hidden");

            // Remove the loader from DOM after animation completes
            setTimeout(() => {
                if (pageLoader.parentNode) {
                    pageLoader.remove();
                }
            }, 500);
        }, 1000); // Show loader for at least 1 second after full page load
    });

    // Backup timeout to ensure loader is removed even if 'load' event doesn't fire
    setTimeout(() => {
        if (pageLoader.parentNode) {
            pageLoader.classList.add("hidden");
            setTimeout(() => {
                if (pageLoader.parentNode) {
                    pageLoader.remove();
                }
            }, 500);
        }
    }, 3000); // Failsafe timeout of 3 seconds

    // Force a scroll event to trigger lazy loading
    setTimeout(() => {
        window.dispatchEvent(new Event("scroll"));
    }, 2000);
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded, initializing application");

    // Initialize global config
    CXCLoader.updateGlobalConfig({
        color: "blue",
        shade: 500,
        speed: 1.0,
    });

    // Verify loader system after a delay to ensure registry is loaded
    setTimeout(verifyLoaderSystem, 1000);

    // Initialize UI components
    setTimeout(() => {
        initLoaderCards();
        initColorOptions();
        initShadeOptions();
        initSpeedControl();
        initCategoryFilter();
        initSearch();
        initThemeToggle();
        initControlPanel();
        initCodeTabs();
        initCopyButtons();
        initModalClose();

        // Handle page loading animation
        handlePageLoading();
    }, 1500);
});
