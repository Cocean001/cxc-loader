/**
 * CXC-Loader - Main JavaScript
 * Contains core functionality for the loader showcase
 */

// Define updateAllLoaders function first
function updateAllLoaders() {
    const globalConfig = CXCLoader.getGlobalConfig();
    console.log("Updating all loaders with global config:", globalConfig);

    // Get all loader placeholders
    const loaderPlaceholders = document.querySelectorAll(".loader-placeholder");
    console.log(`Found ${loaderPlaceholders.length} loaders to update`);

    // Update each loader
    loaderPlaceholders.forEach((placeholder) => {
        // Get the loader card and its ID
        const card = placeholder.closest(".loader-card");
        if (!card) return;

        // Get the loader ID from the onclick attribute
        const onclickAttr = card.getAttribute("onclick");
        if (!onclickAttr) return;

        // Extract the loader ID
        const match = onclickAttr.match(/openModal\(['"](.*?)['"]\)/);
        if (!match || !match[1]) return;

        const loaderId = match[1];
        const [category, name] = loaderId.split("-");

        // Get the current loader element
        const existingLoader = placeholder.firstElementChild;

        // Always recreate the loader to ensure it's fresh
        console.log(`Recreating ${category}-${name} loader with config:`, globalConfig);
        placeholder.innerHTML = "";
        const loader = CXCLoader.createLoader(category, name, { ...globalConfig });
        placeholder.appendChild(loader);
    });

    // Also update the modal content if it's open
    updateModalContent();
}

// Make updateAllLoaders available globally immediately
window.updateAllLoaders = updateAllLoaders;
console.log("Exposed updateAllLoaders to global scope immediately");

// Wait for all loader modules to load
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM content loaded, initializing...");

    // Initialize global config with default values
    CXCLoader.updateGlobalConfig(currentLoader.config);

    // Initialize loader previews on the page
    setTimeout(initLoaderPreviews, 100); // Give loader modules time to register

    // Initialize color picker
    initColorPicker();

    // Initialize speed controller
    initSpeedControl();

    // Initialize copy buttons
    initCopyButtons();

    // Initialize theme toggle
    initThemeToggle();

    // Initialize control panel
    initControlPanel();

    // Initialize category filter
    initCategoryFilter();

    // Update loader tags to match current theme
    updateLoaderTags();

    // Ensure updateAllLoaders is in global scope
    if (typeof window.updateAllLoaders !== "function") {
        window.updateAllLoaders = updateAllLoaders;
        console.log("Re-exposed updateAllLoaders to global scope");
    }
});

// Initialize loader previews on the page
function initLoaderPreviews() {
    const loadersGrid = document.getElementById("loadersGrid");
    loadersGrid.innerHTML = ""; // Clear grid

    // Generate loader cards from loaderData (already sorted by date)
    loaderData.forEach((loader) => {
        // Create loader card
        const card = document.createElement("div");
        card.className = "loader-card";
        card.dataset.category = loader.category;
        card.onclick = function () {
            openModal(loader.id);
        };

        // Create loader tag
        const tag = document.createElement("div");
        tag.className = "loader-tag";
        tag.dataset.category = loader.category;
        tag.textContent = loader.tag;
        card.appendChild(tag);

        // Create loader placeholder
        const placeholder = document.createElement("div");
        placeholder.className = "loader-placeholder";
        card.appendChild(placeholder);

        // Create loader name
        const name = document.createElement("div");
        name.className = "loader-name";
        name.textContent = loader.name;
        card.appendChild(name);

        // Add card to grid
        loadersGrid.appendChild(card);

        // Add loader animation
        const [category, type] = loader.id.split("-");
        // Use global config when creating loaders
        const globalConfig = CXCLoader.getGlobalConfig();
        placeholder.appendChild(CXCLoader.createLoader(category, type, globalConfig));
    });
}

// Update modal content if it's open
function updateModalContent() {
    const modal = document.getElementById("loaderModal");
    // Only update if modal is visible
    if (modal && modal.classList.contains("visible")) {
        const loaderDemo = document.getElementById("loaderDemo");
        const cssCode = document.getElementById("cssCode");
        const jsCode = document.getElementById("jsCode");

        // Get category and name from the current loader ID
        const [category, name] = currentLoader.id.split("-");
        console.log(`Updating modal content for: ${currentLoader.id}, category: ${category}, name: ${name}`);

        // Verify that the loader exists in the registry
        const loaderExists = CXCLoader.loaderExists(category, name);
        console.log(`Loader exists in registry: ${loaderExists}`);

        // Clear modal demo area if it exists
        if (loaderDemo) {
            loaderDemo.innerHTML = "";

            // Create new loader for modal
            const loader = CXCLoader.createLoader(category, name, currentLoader.config);
            loaderDemo.appendChild(loader);
        }

        // Update code
        if (cssCode) {
            const css = CXCLoader.getLoaderCSS(category, name, currentLoader.config);
            console.log(`Generated CSS code length: ${css.length} characters`);
            cssCode.textContent = css;
            // Trigger Prism.js to highlight the updated code
            Prism.highlightElement(cssCode);
        }

        if (jsCode) {
            const js = CXCLoader.getLoaderJS(category, name, currentLoader.config);
            console.log(`Generated JS code length: ${js.length} characters`);
            jsCode.textContent = js;
            // Trigger Prism.js to highlight the updated code
            Prism.highlightElement(jsCode);
        }
    }
}

// Update loader and code in real-time (legacy function, kept for compatibility)
function updateLoaderAndCode() {
    // Update all loaders on the page
    updateAllLoaders();

    // Update modal content
    updateModalContent();
}

// Note: updateAllLoaders is now defined at the top of the file

// Open modal
function openModal(loaderId) {
    const modal = document.getElementById("loaderModal");
    const modalTitle = document.getElementById("modalTitle");

    // Parse the loader ID to get category and name
    const [category, name] = loaderId.split("-");

    console.log(`Opening modal for loader: ${loaderId}, category: ${category}, name: ${name}`);

    // Find the loader data
    const loader = loaderData.find((l) => l.id === loaderId);

    // Set the modal title with tag
    if (loader) {
        modalTitle.textContent = `${loader.name} `;

        // Add tag as a small element
        const tagSpan = document.createElement("span");
        tagSpan.style.fontSize = "0.8rem";
        tagSpan.style.opacity = "0.7";
        tagSpan.style.marginLeft = "5px";
        tagSpan.style.fontWeight = "400";
        tagSpan.textContent = loader.tag;
        modalTitle.appendChild(tagSpan);
    } else {
        modalTitle.textContent = loaderId;
    }

    // Update current loader info
    currentLoader.id = loaderId;

    // Show modal with animation first
    modal.classList.add("visible");

    // Then update loader and code
    setTimeout(() => {
        updateLoaderAndCode();
    }, 50);

    // Ensure code blocks are expanded by default
    document.querySelectorAll(".code-block").forEach((block) => {
        if (block.classList.contains("collapsed")) {
            toggleCodeBlock(block);
        }
    });

    // Add click event listener to close modal when clicking outside
    modal.addEventListener("click", handleModalOutsideClick);
}

function closeModal() {
    const modal = document.getElementById("loaderModal");

    // Hide modal with animation
    modal.classList.remove("visible");

    // Remove the click event listener
    modal.removeEventListener("click", handleModalOutsideClick);
}

// Handle clicks outside the modal content
function handleModalOutsideClick(event) {
    // If the click is on the modal overlay (not on the modal content)
    if (event.target === event.currentTarget) {
        closeModal();
    }
}

// Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            // Show success message with a toast instead of alert
            const toast = document.createElement("div");
            toast.className = "toast";
            toast.textContent = "Copied to clipboard!";
            document.body.appendChild(toast);

            // Show the toast
            setTimeout(() => toast.classList.add("visible"), 10);

            // Hide and remove the toast after 2 seconds
            setTimeout(() => {
                toast.classList.remove("visible");
                setTimeout(() => document.body.removeChild(toast), 300);
            }, 2000);
        })
        .catch((err) => {
            console.error("Failed to copy: ", err);
        });
}
