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

    // Sort loaders by category and then by tag
    filteredLoaders.sort((a, b) => {
        // First sort by category
        if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
        }
        // Then sort by tag
        return a.tag.localeCompare(b.tag);
    });

    // Display message if no loaders match the filters
    if (filteredLoaders.length === 0) {
        const noResults = document.createElement("div");
        noResults.className = "no-results";
        noResults.textContent = "No loaders match your criteria";
        loadersGrid.appendChild(noResults);
        return;
    }

    // Create cards for each loader
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

        // Then load loaders in batches to prevent UI freezing
        const batchSize = 4; // Process 4 loaders at a time
        let currentIndex = 0;

        function loadNextBatch() {
            if (currentIndex >= filteredLoaders.length) return;

            const endIndex = Math.min(currentIndex + batchSize, filteredLoaders.length);
            const batch = filteredLoaders.slice(currentIndex, endIndex);

            batch.forEach((loader) => {
                const card = document.querySelector(`.loader-card[data-loader-id="${loader.id}"]`);
                if (!card) return;

                const placeholder = card.querySelector(".loader-placeholder");
                if (!placeholder) return;

                try {
                    const [category, type] = loader.id.split("-");

                    // Map loader IDs to correct category/type
                    let loaderCategory = category;
                    let loaderType = type;

                    // Special cases for loader IDs
                    if (loader.id === "dots-default") {
                        loaderCategory = "dots";
                        loaderType = "default";
                    } else if (loader.id === "pulse-basic") {
                        loaderCategory = "pulse";
                        loaderType = "basic";
                    } else if (loader.id === "spinner-basic") {
                        // spinner-basic could be either in spinner.js or spinner-basic.js
                        if (!CXCLoader.loaderExists("spinner", "basic")) {
                            console.log("Trying alternative registration for spinner-basic");
                            // Try to register it manually
                            if (typeof createBasicSpinner === "function") {
                                CXCLoader.registerLoader("spinner", "basic", createBasicSpinner);
                            }
                        }
                    } else if (loader.id === "pulse-whisper-float") {
                        loaderCategory = "pulse";
                        loaderType = "whisper-float";
                    } else if (loader.id === "pulse-particle-converge") {
                        loaderCategory = "pulse";
                        loaderType = "particle-converge";
                    } else if (loader.id === "dots-bounce") {
                        loaderCategory = "dots";
                        loaderType = "bounce";
                    } else if (loader.id === "spinner-triple") {
                        loaderCategory = "spinner";
                        loaderType = "triple";
                    }

                    if (CXCLoader.loaderExists(loaderCategory, loaderType)) {
                        const loaderElement = CXCLoader.createLoader(loaderCategory, loaderType);
                        placeholder.innerHTML = "";
                        placeholder.appendChild(loaderElement);
                        card.classList.add("loader-loaded");
                    } else {
                        console.warn(`Loader ${loader.id} (${loaderCategory}-${loaderType}) not found in registry`);
                        placeholder.innerHTML = `<div class="error-message">Loader not available</div>`;
                    }
                } catch (error) {
                    console.error(`Error creating loader ${loader.id}:`, error);
                    placeholder.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
                }
            });

            currentIndex = endIndex;

            // Schedule next batch with a small delay to allow UI to breathe
            if (currentIndex < filteredLoaders.length) {
                setTimeout(loadNextBatch, 50);
            }
        }

        // Start loading the first batch after a short delay
        setTimeout(loadNextBatch, 50);
    };

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
    } else if (loaderId === "pulse-particle-converge") {
        loaderCategory = "pulse";
        loaderType = "particle-converge";
    } else if (loaderId === "dots-bounce") {
        loaderCategory = "dots";
        loaderType = "bounce";
    } else if (loaderId === "spinner-triple") {
        loaderCategory = "spinner";
        loaderType = "triple";
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
    updateCodeSnippets(category, type);

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
    } else if (category === "pulse" && type === "particle-converge") {
        loaderCategory = "pulse";
        loaderType = "particle-converge";
    } else if (category === "dots" && type === "bounce") {
        loaderCategory = "dots";
        loaderType = "bounce";
    } else if (category === "spinner" && type === "triple") {
        loaderCategory = "spinner";
        loaderType = "triple";
    }

    // Get current config
    const config = CXCLoader.getGlobalConfig();

    // Update CSS code
    try {
        if (CXCLoader.loaderExists(loaderCategory, loaderType)) {
            const css = CXCLoader.getLoaderCSS(loaderCategory, loaderType, config);
            cssCode.textContent = css;
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
        } else if (loaderId === "pulse-particle-converge") {
            loaderCategory = "pulse";
            loaderType = "particle-converge";
        } else if (loaderId === "dots-bounce") {
            loaderCategory = "dots";
            loaderType = "bounce";
        } else if (loaderId === "spinner-triple") {
            loaderCategory = "spinner";
            loaderType = "triple";
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
        updateCodeSnippets(category, type);
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

// Initialize code expand buttons
function initCodeTabs() {
    const expandCssBtn = document.getElementById("expandCssBtn");
    const expandJsBtn = document.getElementById("expandJsBtn");
    const cssPanel = document.getElementById("cssPanel");
    const jsPanel = document.getElementById("jsPanel");

    if (expandCssBtn && cssPanel) {
        expandCssBtn.addEventListener("click", () => {
            cssPanel.classList.remove("collapsed");
            cssPanel.classList.add("expanded");
            expandCssBtn.textContent = "Hide code";
            expandCssBtn.addEventListener(
                "click",
                () => {
                    if (cssPanel.classList.contains("expanded")) {
                        cssPanel.classList.remove("expanded");
                        cssPanel.classList.add("collapsed");
                        expandCssBtn.textContent = "Show all code";
                    } else {
                        cssPanel.classList.remove("collapsed");
                        cssPanel.classList.add("expanded");
                        expandCssBtn.textContent = "Hide code";
                    }
                },
                { once: true }
            );
        });
    }

    if (expandJsBtn && jsPanel) {
        expandJsBtn.addEventListener("click", () => {
            jsPanel.classList.remove("collapsed");
            jsPanel.classList.add("expanded");
            expandJsBtn.textContent = "Hide code";
            expandJsBtn.addEventListener(
                "click",
                () => {
                    if (jsPanel.classList.contains("expanded")) {
                        jsPanel.classList.remove("expanded");
                        jsPanel.classList.add("collapsed");
                        expandJsBtn.textContent = "Show all code";
                    } else {
                        jsPanel.classList.remove("collapsed");
                        jsPanel.classList.add("expanded");
                        expandJsBtn.textContent = "Hide code";
                    }
                },
                { once: true }
            );
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
    }, 1500);
});
