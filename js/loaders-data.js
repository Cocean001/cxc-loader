/**
 * CXC-Loader - Loader Data
 * Contains metadata for all available loaders
 */

// Loader data with metadata
const loaderData = [
    {
        id: "spinner-basic",
        category: "spinner",
        name: "Basic Spinner",
        tag: "S-001", // S for Spinner, 001 is the first in Spinner category
        createdAt: "2023-05-15", // Creation date (for sorting)
        totalIndex: 1, // Overall index across all loaders
    },
    {
        id: "spinner-dual",
        category: "spinner",
        name: "Dual Spinner",
        tag: "S-002", // Second spinner
        createdAt: "2023-06-20",
        totalIndex: 2,
    },
    {
        id: "spinner-triple",
        category: "spinner",
        name: "Triple Spinner",
        tag: "S-003", // Third spinner
        createdAt: "2023-09-15",
        totalIndex: 5,
    },
    {
        id: "pulse-basic",
        category: "pulse",
        name: "Pulse Loader",
        tag: "P-001", // P for Pulse, 001 is the first in Pulse category
        createdAt: "2023-07-10",
        totalIndex: 3,
    },
    {
        id: "pulse-wave",
        category: "pulse",
        name: "Pulse Wave",
        tag: "P-002", // Second pulse
        createdAt: "2023-09-18",
        totalIndex: 6,
    },
    {
        id: "dots-bounce",
        category: "dots",
        name: "Bouncing Dots",
        tag: "D-001", // D for Dots, 001 is the first in Dots category
        createdAt: "2023-08-05",
        totalIndex: 4,
    },
    {
        id: "dots-fade",
        category: "dots",
        name: "Fading Dots",
        tag: "D-002", // Second dots
        createdAt: "2023-09-20",
        totalIndex: 7,
    },
    {
        id: "progress-bar",
        category: "progress",
        name: "Progress Bar",
        tag: "PR-001", // PR for Progress, 001 is the first in Progress category
        createdAt: "2023-09-22",
        totalIndex: 8,
    },
    {
        id: "ripple-basic",
        category: "ripple",
        name: "Basic Ripple",
        tag: "R-001", // R for Ripple, 001 is the first in Ripple category
        createdAt: "2023-09-25",
        totalIndex: 9,
    },
];

// Sort loaders by creation date (newest first)
loaderData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

// Current selected loader and configuration
let currentLoader = {
    id: "spinner-basic", // Default loader
    config: {
        color: "blue",
        shade: 500,
        speed: 1.0,
    },
};
