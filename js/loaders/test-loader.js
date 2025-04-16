/**
 * CXC-Loader - Test Loader
 * A simple test loader to verify the loader system is working
 */

(function () {
    // Category and name for this loader
    const CATEGORY = "test";
    const NAME = "basic";

    // Create the loader element
    function createLoader(config) {
        console.log("Creating test loader with config:", config);
        
        // Create container
        const container = document.createElement("div");
        container.className = "cxc-test-loader";
        container.style.width = "50px";
        container.style.height = "50px";
        container.style.backgroundColor = "red";
        container.style.borderRadius = "50%";
        
        // Add text to show it's working
        container.textContent = "TEST";
        container.style.color = "white";
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.fontWeight = "bold";
        
        return container;
    }

    // Generate CSS for this loader
    function generateCSS(config) {
        return `
/* Test Loader */
.cxc-test-loader {
    width: 50px;
    height: 50px;
    background-color: red;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}`;
    }

    // Generate JS for this loader
    function generateJS(config) {
        return `
// Create a test loader
function createTestLoader() {
    const container = document.createElement('div');
    container.className = 'cxc-test-loader';
    container.style.width = '50px';
    container.style.height = '50px';
    container.style.backgroundColor = 'red';
    container.style.borderRadius = '50%';
    container.textContent = 'TEST';
    container.style.color = 'white';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.fontWeight = 'bold';
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
