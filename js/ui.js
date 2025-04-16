/**
 * CXC-Loader - UI JavaScript
 */

// Initialize color picker
function initColorPicker() {
    const colorOptions = document.getElementById("colorOptions");
    const colors = CXCLoader.getAvailableColors();

    if (!colorOptions) return;

    // Create color options
    colors.forEach((color) => {
        const colorOption = document.createElement("div");
        colorOption.className = "color-option";
        colorOption.dataset.color = color;

        const backgroundColor = CXCLoader.getColor(color, 500);
        colorOption.style.backgroundColor = backgroundColor;
        colorOption.title = color;

        colorOption.addEventListener("click", function () {
            document.querySelectorAll(".color-option").forEach((el) => {
                el.classList.remove("selected");
            });

            this.classList.add("selected");

            const selectedColor = this.dataset.color;
            currentLoader.config.color = selectedColor;

            updateShadeOptions(selectedColor);
            updateSiteColors(selectedColor);
            updateModalContent();
        });

        colorOptions.appendChild(colorOption);
    });

    // Default select blue
    const defaultColor = colorOptions.querySelector('[data-color="blue"]');
    if (defaultColor) {
        defaultColor.classList.add("selected");
        updateShadeOptions("blue");
        updateSiteColors("blue");
    }
}

// Update shade options
function updateShadeOptions(color) {
    const shadeOptions = document.getElementById("shadeOptions");
    if (!shadeOptions) return;

    shadeOptions.innerHTML = "";

    const shades = CXCLoader.getAvailableShades(color);

    shades.forEach((shade) => {
        const shadeOption = document.createElement("div");
        shadeOption.className = "shade-option";
        shadeOption.dataset.shade = shade;
        shadeOption.textContent = shade;

        const backgroundColor = CXCLoader.getColor(color, shade);
        shadeOption.style.backgroundColor = backgroundColor;

        const rgb = hexToRgb(backgroundColor);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

        shadeOption.style.color = brightness > 125 ? "#333333" : "white";

        shadeOption.addEventListener("click", function () {
            document.querySelectorAll(".shade-option").forEach((el) => {
                el.classList.remove("selected");
            });

            this.classList.add("selected");

            const shade = parseInt(this.dataset.shade);
            currentLoader.config.shade = shade;

            const currentColor = currentLoader.config.color;
            updateSiteColors(currentColor, shade);
            updateModalContent();
        });

        shadeOptions.appendChild(shadeOption);
    });

    const currentShade = currentLoader.config.shade.toString();
    const defaultShade = shadeOptions.querySelector(`[data-shade="${currentShade}"]`) || shadeOptions.querySelector('[data-shade="500"]');
    if (defaultShade) {
        defaultShade.classList.add("selected");
    }
}

// Initialize speed controller
function initSpeedControl() {
    const speedControl = document.getElementById("speedControl");
    const speedValue = document.getElementById("speedValue");

    if (!speedControl || !speedValue) return;

    speedValue.textContent = currentLoader.config.speed.toFixed(1) + "x";
    speedControl.value = currentLoader.config.speed;

    speedControl.addEventListener("input", function () {
        const speed = parseFloat(this.value);
        speedValue.textContent = speed.toFixed(1) + "x";
        currentLoader.config.speed = speed;

        CXCLoader.updateGlobalConfig({ speed: speed });
        updateAllLoaders();
        updateModalContent();
    });
}

// Initialize theme toggle
function initThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");
    const icon = themeToggle.querySelector("i");

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
            localStorage.setItem("darkMode", "true");
        } else {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
            localStorage.setItem("darkMode", "false");
        }

        const currentColor = currentLoader.config.color;
        const currentShade = currentLoader.config.shade;
        updateSiteColors(currentColor, currentShade);
    });
}

// Initialize control panel
function initControlPanel() {
    const customizeButton = document.getElementById("customizeButton");
    const controlPanel = document.getElementById("controlPanel");
    const closeButton = document.getElementById("closeControlPanel");

    if (!customizeButton || !controlPanel || !closeButton) return;

    customizeButton.addEventListener("click", () => {
        const isPanelOpen = controlPanel.classList.contains("visible");

        if (isPanelOpen) {
            // 关闭面板
            controlPanel.classList.remove("visible");
            customizeButton.classList.remove("panel-open");
            removeSidebarOverlay();
        } else {
            // 打开面板
            controlPanel.classList.add("visible");
            customizeButton.classList.add("panel-open");
            addSidebarOverlay();
        }
    });

    closeButton.addEventListener("click", () => {
        controlPanel.classList.remove("visible");
        customizeButton.classList.remove("panel-open");
        removeSidebarOverlay();
    });
}

// Add overlay to capture clicks outside the sidebar
function addSidebarOverlay() {
    if (!document.getElementById("sidebar-overlay")) {
        const overlay = document.createElement("div");
        overlay.id = "sidebar-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.right = "0";
        overlay.style.bottom = "0";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.2)"; // 半透明背景
        overlay.style.backdropFilter = "blur(2px)"; // 轻微模糊效果
        overlay.style.zIndex = "98";
        overlay.style.transition = "opacity 0.3s ease";

        overlay.addEventListener("click", () => {
            const controlPanel = document.getElementById("controlPanel");
            const customizeButton = document.getElementById("customizeButton");

            if (controlPanel) {
                controlPanel.classList.remove("visible");
                if (customizeButton) {
                    customizeButton.classList.remove("panel-open");
                }
                removeSidebarOverlay();
            }
        });

        document.body.appendChild(overlay);

        // 添加渐变动画
        setTimeout(() => {
            overlay.style.opacity = "1";
        }, 10);
    }
}

// Remove the sidebar overlay
function removeSidebarOverlay() {
    const overlay = document.getElementById("sidebar-overlay");
    if (overlay) {
        // 添加淡出效果
        overlay.style.opacity = "0";

        // 等待动画完成后移除元素
        setTimeout(() => {
            if (overlay.parentNode) {
                document.body.removeChild(overlay);
            }
        }, 300);
    }
}

// Initialize category filter and search
function initCategoryFilter() {
    // Initialize more categories dropdown
    initMoreCategoriesDropdown();

    // Initialize search functionality
    initSearchFunctionality();

    // Initialize category filter buttons
    initCategoryButtons();
}

// Initialize more categories dropdown
function initMoreCategoriesDropdown() {
    const moreButton = document.getElementById("moreCategories");
    const moreDropdown = document.getElementById("moreCategoriesDropdown");
    const selectedMoreCategory = document.getElementById("selectedMoreCategory");

    if (moreButton && moreDropdown) {
        // Toggle dropdown on button click
        moreButton.addEventListener("click", function (e) {
            e.stopPropagation();
            this.classList.toggle("active");
            moreDropdown.classList.toggle("visible");

            // Add document click listener to close dropdown
            if (moreDropdown.classList.contains("visible")) {
                setTimeout(() => {
                    document.addEventListener("click", closeMoreDropdown);
                }, 10);
            }
        });

        // Handle clicks on more category options
        const moreOptions = moreDropdown.querySelectorAll(".more-option");
        moreOptions.forEach((option) => {
            option.addEventListener("click", function (e) {
                e.stopPropagation();

                // Get category data
                const category = this.dataset.category;
                const categoryText = this.textContent;

                // Create a clone of this button to show in the main categories
                if (selectedMoreCategory) {
                    // Clear previous selection
                    selectedMoreCategory.innerHTML = "";

                    // Create new button
                    const newButton = document.createElement("button");
                    newButton.className = "filter-option";
                    newButton.dataset.category = category;
                    newButton.textContent = categoryText;

                    // Add click handler
                    newButton.addEventListener("click", function () {
                        // Select this category
                        selectCategory(this);
                    });

                    // Add to the selected area
                    selectedMoreCategory.appendChild(newButton);

                    // Select this category
                    selectCategory(newButton);
                }

                // Close dropdown
                closeMoreDropdown();
            });
        });

        // Prevent dropdown from closing when clicking inside it
        moreDropdown.addEventListener("click", function (e) {
            e.stopPropagation();
        });
    }
}

// Close more categories dropdown
function closeMoreDropdown() {
    const moreButton = document.getElementById("moreCategories");
    const moreDropdown = document.getElementById("moreCategoriesDropdown");

    if (moreButton && moreDropdown) {
        moreButton.classList.remove("active");
        moreDropdown.classList.remove("visible");
    }

    document.removeEventListener("click", closeMoreDropdown);
}

// Initialize search functionality
function initSearchFunctionality() {
    const searchToggle = document.getElementById("searchToggle");
    const searchContainer = document.getElementById("headerSearchContainer");
    const searchInput = document.getElementById("headerSearchInput");
    const clearSearch = document.getElementById("headerClearSearch");

    if (searchToggle && searchContainer) {
        // Toggle search input visibility
        searchToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            searchContainer.classList.toggle("visible");

            if (searchContainer.classList.contains("visible")) {
                // Focus the input
                setTimeout(() => {
                    searchInput.focus();
                }, 300); // Wait for animation to complete

                // Add document click listener to close search
                setTimeout(() => {
                    document.addEventListener("click", closeHeaderSearch);
                }, 10);
            }
        });
    }

    if (searchInput && clearSearch) {
        // Handle search input
        searchInput.addEventListener("input", function () {
            const searchTerm = this.value.trim().toLowerCase();
            clearSearch.classList.toggle("visible", searchTerm.length > 0);
            filterLoaders();
        });

        // Handle clear search
        clearSearch.addEventListener("click", function (e) {
            e.stopPropagation();
            searchInput.value = "";
            this.classList.remove("visible");
            filterLoaders();
            searchInput.focus();
        });

        // Prevent search from closing when clicking inside it
        searchContainer.addEventListener("click", function (e) {
            e.stopPropagation();
        });

        // Handle escape key to close search
        searchInput.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                closeHeaderSearch();
            }
        });
    }
}

// Close header search
function closeHeaderSearch() {
    const searchContainer = document.getElementById("headerSearchContainer");

    if (searchContainer) {
        searchContainer.classList.remove("visible");
    }

    document.removeEventListener("click", closeHeaderSearch);
}

// Initialize category filter buttons
function initCategoryButtons() {
    const filterOptions = document.querySelectorAll(".filter-option:not(.more-option)");

    filterOptions.forEach((option) => {
        option.addEventListener("click", function () {
            // Select this category
            selectCategory(this);
        });
    });
}

// Select a category
function selectCategory(categoryButton) {
    // Update selected state for all filter options
    const allFilterOptions = document.querySelectorAll(".filter-option");
    allFilterOptions.forEach((opt) => opt.classList.remove("selected"));

    // Mark this button as selected
    categoryButton.classList.add("selected");

    // Filter loaders
    filterLoaders();
}

// Filter loaders based on category and search term
function filterLoaders() {
    const selectedCategory = document.querySelector(".filter-option.selected");
    if (!selectedCategory) return;

    const category = selectedCategory.dataset.category;
    const searchTerm = document.getElementById("headerSearchInput")?.value.trim().toLowerCase() || "";

    // Filter by category and search term
    filterLoadersByCategory(category, searchTerm);
}

// Filter loaders by category and search term
function filterLoadersByCategory(category, searchTerm = "") {
    console.log(`Filtering by category: ${category}, search: ${searchTerm}`);
    const loaderCards = document.querySelectorAll(".loader-card");
    let visibleCount = 0;

    loaderCards.forEach((card) => {
        // Get card data for search
        const cardName = card.querySelector(".loader-name")?.textContent.toLowerCase() || "";
        const cardCategory = card.dataset.category?.toLowerCase() || "";
        const onclickAttr = card.getAttribute("onclick") || "";
        const cardIdMatch = onclickAttr.match(/openModal\(['"](.+?)['"]\)/);
        const cardId = cardIdMatch ? cardIdMatch[1].toLowerCase() : "";

        // Check if card matches both category and search term
        const matchesCategory = category === "all" || cardCategory === category;
        const matchesSearch = searchTerm === "" || cardName.includes(searchTerm) || cardCategory.includes(searchTerm) || cardId.includes(searchTerm);

        if (matchesCategory && matchesSearch) {
            card.style.display = "flex";
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, 50 * (visibleCount % 10)); // Stagger animation for better visual effect
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    console.log(`Found ${visibleCount} matching loaders`);

    // Show message if no results
    const noResultsMessage = document.getElementById("noResultsMessage");
    if (visibleCount === 0 && (searchTerm !== "" || category !== "all")) {
        if (!noResultsMessage) {
            const message = document.createElement("div");
            message.id = "noResultsMessage";
            message.className = "no-results-message";

            if (searchTerm !== "") {
                message.textContent = `No loaders found matching "${searchTerm}"`;
            } else {
                message.textContent = `No loaders found in the "${category}" category`;
            }

            const loadersGrid = document.getElementById("loadersGrid");
            if (loadersGrid) {
                loadersGrid.appendChild(message);
            }
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
}

// Initialize copy buttons
function initCopyButtons() {
    document.getElementById("copyCssButton").addEventListener("click", () => {
        copyToClipboard(document.getElementById("cssCode").textContent);
    });

    document.getElementById("copyJsButton").addEventListener("click", () => {
        copyToClipboard(document.getElementById("jsCode").textContent);
    });

    document.getElementById("toggleCssCode").addEventListener("click", () => {
        toggleCodeBlock(document.getElementById("toggleCssCode").closest(".code-block"));
    });

    document.getElementById("toggleJsCode").addEventListener("click", () => {
        toggleCodeBlock(document.getElementById("toggleJsCode").closest(".code-block"));
    });

    document.getElementById("expandCssBtn").addEventListener("click", (e) => {
        toggleExpandCode(e.target);
    });

    document.getElementById("expandJsBtn").addEventListener("click", (e) => {
        toggleExpandCode(e.target);
    });
}

// Toggle code expansion
function toggleExpandCode(button) {
    const codeBlock = button.closest(".code-block");
    const isExpanded = codeBlock.classList.toggle("expanded");

    button.textContent = isExpanded ? "Show less code" : "Show all code";

    if (isExpanded && codeBlock.classList.contains("collapsed")) {
        toggleCodeBlock(codeBlock);
    }
}

// Toggle code block visibility
function toggleCodeBlock(codeBlock) {
    codeBlock.classList.toggle("collapsed");

    const toggleBtn = codeBlock.querySelector(".code-toggle");
    const icon = toggleBtn.querySelector("i");

    if (codeBlock.classList.contains("collapsed")) {
        icon.classList.remove("fa-chevron-down");
        icon.classList.add("fa-chevron-right");

        if (codeBlock.classList.contains("expanded")) {
            codeBlock.classList.remove("expanded");
            const expandBtn = codeBlock.querySelector(".code-expand-btn");
            if (expandBtn) {
                expandBtn.textContent = "Show all code";
            }
        }
    } else {
        icon.classList.remove("fa-chevron-right");
        icon.classList.add("fa-chevron-down");
    }
}

// Update site colors based on selected color
function updateSiteColors(colorName, shade) {
    const currentShade = shade || (currentLoader && currentLoader.config ? currentLoader.config.shade : 500);

    const mainColor = CXCLoader.getColor(colorName, currentShade);
    const hoverColor = CXCLoader.getColor(colorName, currentShade + 100 > 900 ? 900 : currentShade + 100);

    const rgbValues = hexToRgb(mainColor);
    const lightColor = `rgba(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}, 0.6)`;
    const shadowColor = `rgba(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}, 0.3)`;

    const isDarkMode = document.body.classList.contains("dark-mode");
    const primaryShade = isDarkMode ? Math.max(400, currentShade - 100) : Math.min(600, currentShade + 100);
    const primaryColor = CXCLoader.getColor(colorName, primaryShade);
    const primaryHoverColor = CXCLoader.getColor(colorName, primaryShade + 100 > 900 ? 900 : primaryShade + 100);

    document.documentElement.style.setProperty("--loader-color", mainColor);
    document.documentElement.style.setProperty("--loader-color-hover", hoverColor);
    document.documentElement.style.setProperty("--loader-color-light", lightColor);
    document.documentElement.style.setProperty("--loader-color-shadow", shadowColor);
    document.documentElement.style.setProperty("--loader-color-rgb", `${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}`);

    document.documentElement.style.setProperty("--primary-color", primaryColor);
    document.documentElement.style.setProperty("--primary-color-hover", primaryHoverColor);

    if (currentLoader && currentLoader.config) {
        currentLoader.config.color = colorName;
        if (shade) {
            currentLoader.config.shade = shade;
        }

        const configUpdate = { color: colorName };
        if (shade) {
            configUpdate.shade = shade;
        }

        console.log("Updating global config from updateSiteColors:", configUpdate);
        CXCLoader.updateGlobalConfig(configUpdate);
    }

    updateLoaderTags();
}

// Update all loader tags to match the current color theme
function updateLoaderTags() {
    const loaderTags = document.querySelectorAll(".loader-tag");
    const loaderColor = getComputedStyle(document.documentElement).getPropertyValue("--loader-color-light").trim();

    loaderTags.forEach((tag) => {
        tag.style.backgroundColor = loaderColor;

        const rgbMatch = loaderColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
        if (rgbMatch) {
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;

            tag.style.color = brightness > 125 ? "#333333" : "white";
        }
    });
}

// Helper function to convert hex color to RGB
function hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

// Copy text to clipboard
function copyToClipboard(text) {
    // Use the modern Clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                showToast("Copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
                // Fallback to the old method
                copyToClipboardFallback(text);
            });
    } else {
        // Fallback for browsers that don't support the Clipboard API
        copyToClipboardFallback(text);
    }
}

// Fallback method for copying to clipboard
function copyToClipboardFallback(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed"; // Prevent scrolling to the element
    document.body.appendChild(textarea);
    textarea.select();

    try {
        const successful = document.execCommand("copy");
        if (successful) {
            showToast("Copied to clipboard!");
        } else {
            showToast("Copy failed. Please try again.");
        }
    } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
        showToast("Copy failed. Please try again.");
    }

    document.body.removeChild(textarea);
}

// Show toast notification
function showToast(message) {
    let toast = document.querySelector(".toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("visible");

    setTimeout(() => {
        toast.classList.remove("visible");
    }, 2000);
}
