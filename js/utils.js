/**
 * CXC-Loader - Utility Functions
 * Contains helper functions used across the application
 */

// Update site colors based on selected color and shade
function updateSiteColors(color, shade) {
    // If shade is not provided, use the current shade from config
    if (!shade) {
        shade = currentLoader.config.shade;
    }

    // Update current loader config
    currentLoader.config.color = color;
    currentLoader.config.shade = shade;

    // Update global config
    CXCLoader.updateGlobalConfig({
        color: color,
        shade: shade
    });

    // Get the color value
    const colorValue = CXCLoader.getColor(color, shade);
    
    // Get RGB values for CSS variables
    const rgb = hexToRgb(colorValue);
    const rgbString = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    
    // Calculate hover color (slightly darker)
    const hoverShade = shade + 100 <= 900 ? shade + 100 : shade;
    const hoverColor = CXCLoader.getColor(color, hoverShade);
    
    // Calculate shadow color (transparent version of the color)
    const shadowColor = `rgba(${rgbString}, 0.3)`;
    
    // Set CSS variables
    document.documentElement.style.setProperty('--loader-color', colorValue);
    document.documentElement.style.setProperty('--loader-color-rgb', rgbString);
    document.documentElement.style.setProperty('--loader-color-hover', hoverColor);
    document.documentElement.style.setProperty('--loader-color-shadow', shadowColor);
    document.documentElement.style.setProperty('--primary-color', colorValue);
    
    // Update loader tags
    updateLoaderTags();
}

// Update loader tags to match current theme
function updateLoaderTags() {
    const tags = document.querySelectorAll('.loader-tag');
    const color = currentLoader.config.color;
    const shade = currentLoader.config.shade;
    
    tags.forEach(tag => {
        // Get the category from the tag
        const category = tag.dataset.category;
        
        // Set the background color based on the current color theme
        tag.style.backgroundColor = `rgba(var(--loader-color-rgb), 0.8)`;
    });
}

// Toggle code block expansion
function toggleCodeBlock(block) {
    block.classList.toggle('expanded');
    
    // Update button text
    const expandBtn = block.querySelector('.code-expand-btn');
    if (expandBtn) {
        expandBtn.textContent = block.classList.contains('expanded') ? 'Show less' : 'Show all code';
    }
}

// Update site colors with loader color
function updateSiteWithLoaderColor(color, shade) {
    // Update current loader config
    currentLoader.config.color = color;
    currentLoader.config.shade = shade;
    
    // Update global config
    CXCLoader.updateGlobalConfig({
        color: color,
        shade: shade
    });
    
    // Update site colors
    updateSiteColors(color, shade);
    
    // Update all loaders
    updateAllLoaders();
}
