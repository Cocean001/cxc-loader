/**
 * Triple Spinner Loader
 * Three concentric spinners rotating at different speeds
 */

(function () {
    const CATEGORY = "spinner";
    const NAME = "triple";

    /**
     * Create loader DOM element
     * @param {Object} config - Configuration options
     * @returns {HTMLElement} Loader DOM element
     */
    function create(config) {
        // Make sure we have valid config values
        const safeConfig = {
            color: config.color || "blue",
            shade: config.shade || 500,
            speed: config.speed || 1.0,
        };

        const color = CXCLoader.getColor(safeConfig.color, safeConfig.shade);
        const baseAnimationDuration = (1.5 / safeConfig.speed).toFixed(2);

        const spinner = document.createElement("div");
        spinner.className = "cxc-spinner-triple";
        spinner.style.width = "40px";
        spinner.style.height = "40px";
        spinner.style.position = "relative";

        // Create outer ring
        const outerRing = document.createElement("div");
        outerRing.className = "cxc-spinner-triple-outer";
        outerRing.style.position = "absolute";
        outerRing.style.width = "40px";
        outerRing.style.height = "40px";
        outerRing.style.border = "3px solid transparent";
        outerRing.style.borderTopColor = color;
        outerRing.style.borderRadius = "50%";
        outerRing.style.animation = `cxcSpinnerTripleSpin ${baseAnimationDuration}s linear infinite`;

        // Create middle ring
        const middleRing = document.createElement("div");
        middleRing.className = "cxc-spinner-triple-middle";
        middleRing.style.position = "absolute";
        middleRing.style.width = "30px";
        middleRing.style.height = "30px";
        middleRing.style.top = "5px";
        middleRing.style.left = "5px";
        middleRing.style.border = "3px solid transparent";
        middleRing.style.borderRightColor = color;
        middleRing.style.borderRadius = "50%";
        middleRing.style.animation = `cxcSpinnerTripleSpinReverse ${(baseAnimationDuration * 0.8).toFixed(2)}s linear infinite`;

        // Create inner ring
        const innerRing = document.createElement("div");
        innerRing.className = "cxc-spinner-triple-inner";
        innerRing.style.position = "absolute";
        innerRing.style.width = "20px";
        innerRing.style.height = "20px";
        innerRing.style.top = "10px";
        innerRing.style.left = "10px";
        innerRing.style.border = "3px solid transparent";
        innerRing.style.borderBottomColor = color;
        innerRing.style.borderLeftColor = color;
        innerRing.style.borderRadius = "50%";
        innerRing.style.animation = `cxcSpinnerTripleSpin ${(baseAnimationDuration * 0.6).toFixed(2)}s linear infinite`;

        spinner.appendChild(outerRing);
        spinner.appendChild(middleRing);
        spinner.appendChild(innerRing);

        // Add a method to update the spinner's speed
        spinner.updateSpeed = function (newSpeed) {
            const newBaseDuration = (1.5 / newSpeed).toFixed(2);
            const outerRing = this.querySelector(".cxc-spinner-triple-outer");
            const middleRing = this.querySelector(".cxc-spinner-triple-middle");
            const innerRing = this.querySelector(".cxc-spinner-triple-inner");

            if (outerRing) {
                outerRing.style.animation = `cxcSpinnerTripleSpin ${newBaseDuration}s linear infinite`;
            }

            if (middleRing) {
                middleRing.style.animation = `cxcSpinnerTripleSpinReverse ${(newBaseDuration * 0.8).toFixed(2)}s linear infinite`;
            }

            if (innerRing) {
                innerRing.style.animation = `cxcSpinnerTripleSpin ${(newBaseDuration * 0.6).toFixed(2)}s linear infinite`;
            }
        };

        // Add a method to update the spinner's color
        spinner.updateColor = function (newColor, newShade) {
            const color = CXCLoader.getColor(newColor, newShade);
            const outerRing = this.querySelector(".cxc-spinner-triple-outer");
            const middleRing = this.querySelector(".cxc-spinner-triple-middle");
            const innerRing = this.querySelector(".cxc-spinner-triple-inner");

            if (outerRing) {
                outerRing.style.borderTopColor = color;
            }

            if (middleRing) {
                middleRing.style.borderRightColor = color;
            }

            if (innerRing) {
                innerRing.style.borderBottomColor = color;
                innerRing.style.borderLeftColor = color;
            }
        };

        // Ensure keyframes are added to the document
        ensureKeyframes();

        return spinner;
    }

    /**
     * Get loader CSS code
     * @param {Object} config - Configuration options
     * @returns {string} CSS code
     */
    function getCSS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const baseAnimationDuration = (1.5 / config.speed).toFixed(2);

        return `.cxc-spinner-triple {
  width: 40px;
  height: 40px;
  position: relative;
}

.cxc-spinner-triple-outer {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 3px solid transparent;
  border-top-color: ${color};
  border-radius: 50%;
  animation: cxcSpinnerTripleSpin ${baseAnimationDuration}s linear infinite;
}

.cxc-spinner-triple-middle {
  position: absolute;
  width: 30px;
  height: 30px;
  top: 5px;
  left: 5px;
  border: 3px solid transparent;
  border-right-color: ${color};
  border-radius: 50%;
  animation: cxcSpinnerTripleSpinReverse ${(baseAnimationDuration * 0.8).toFixed(2)}s linear infinite;
}

.cxc-spinner-triple-inner {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 10px;
  left: 10px;
  border: 3px solid transparent;
  border-bottom-color: ${color};
  border-left-color: ${color};
  border-radius: 50%;
  animation: cxcSpinnerTripleSpin ${(baseAnimationDuration * 0.6).toFixed(2)}s linear infinite;
}

@keyframes cxcSpinnerTripleSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes cxcSpinnerTripleSpinReverse {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
}`;
    }

    /**
     * Get loader JS code (implementation example)
     * @param {Object} config - Configuration options
     * @returns {string} JS code
     */
    function getJS(config) {
        const color = CXCLoader.getColor(config.color, config.shade);
        const baseAnimationDuration = (1.5 / config.speed).toFixed(2);

        return `// Create a triple spinner
const spinner = document.createElement('div');
spinner.style.width = '40px';
spinner.style.height = '40px';
spinner.style.position = 'relative';

// Create outer ring
const outerRing = document.createElement('div');
outerRing.style.position = 'absolute';
outerRing.style.width = '40px';
outerRing.style.height = '40px';
outerRing.style.border = '3px solid transparent';
outerRing.style.borderTopColor = '${color}';
outerRing.style.borderRadius = '50%';
outerRing.style.animation = 'spinTriple ${baseAnimationDuration}s linear infinite';

// Create middle ring
const middleRing = document.createElement('div');
middleRing.style.position = 'absolute';
middleRing.style.width = '30px';
middleRing.style.height = '30px';
middleRing.style.top = '5px';
middleRing.style.left = '5px';
middleRing.style.border = '3px solid transparent';
middleRing.style.borderRightColor = '${color}';
middleRing.style.borderRadius = '50%';
middleRing.style.animation = 'spinTripleReverse ${(baseAnimationDuration * 0.8).toFixed(2)}s linear infinite';

// Create inner ring
const innerRing = document.createElement('div');
innerRing.style.position = 'absolute';
innerRing.style.width = '20px';
innerRing.style.height = '20px';
innerRing.style.top = '10px';
innerRing.style.left = '10px';
innerRing.style.border = '3px solid transparent';
innerRing.style.borderBottomColor = '${color}';
innerRing.style.borderLeftColor = '${color}';
innerRing.style.borderRadius = '50%';
innerRing.style.animation = 'spinTriple ${(baseAnimationDuration * 0.6).toFixed(2)}s linear infinite';

spinner.appendChild(outerRing);
spinner.appendChild(middleRing);
spinner.appendChild(innerRing);

// Add it to your document
document.querySelector('.your-container').appendChild(spinner);

// Don't forget to add the keyframes in your CSS
/*
@keyframes spinTriple {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes spinTripleReverse {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
}
*/`;
    }

    /**
     * Ensure animation keyframes are added to the document
     */
    function ensureKeyframes() {
        if (!document.getElementById("cxc-spinner-triple-keyframes")) {
            const style = document.createElement("style");
            style.id = "cxc-spinner-triple-keyframes";
            style.textContent = `
        @keyframes cxcSpinnerTripleSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes cxcSpinnerTripleSpinReverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
      `;
            document.head.appendChild(style);
        }
    }

    // Register loader
    CXCLoader.registerLoader(CATEGORY, NAME, {
        create,
        getCSS,
        getJS,
    });
})();
