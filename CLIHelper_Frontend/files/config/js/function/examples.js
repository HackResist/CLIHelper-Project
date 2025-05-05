// files/config/js/function/examples.js

/**
 * Hides the command examples container.
 */
function hideCommandExamples() {
    const examplesDiv = document.getElementById('command-examples');
    if (examplesDiv) {
        // Add a class for CSS transitions first
        examplesDiv.classList.add('hidden');

        // Optional: After the transition, set display: none for accessibility and layout
        // Adjust timeout to match CSS transition duration
        setTimeout(() => {
            if (examplesDiv.classList.contains('hidden')) { // Check if it wasn't shown again quickly
                 examplesDiv.style.display = 'none';
            }
        }, 300); // 300ms matches the CSS transition duration
    }
}

/**
 * Shows the command examples container.
 * (Optional: Call this if you want to show examples again, e.g., when input is cleared)
 */
function showCommandExamples() {
    const examplesDiv = document.getElementById('command-examples');
    if (examplesDiv) {
        examplesDiv.style.display = ''; // Reset display property
        // Force reflow before removing class to ensure transition plays
        void examplesDiv.offsetWidth;
        examplesDiv.classList.remove('hidden');
    }
}

// --- Optional: Add click functionality to examples ---
document.addEventListener('DOMContentLoaded', () => {
    const examplesDiv = document.getElementById('command-examples');
    const commandInput = document.getElementById('commandInput');

    if (examplesDiv && commandInput) {
        examplesDiv.addEventListener('click', (event) => {
            // Check if the clicked element is a <code> tag inside a list item
            if (event.target.tagName === 'CODE' && event.target.closest('li')) {
                const commandText = event.target.textContent;
                commandInput.value = commandText; // Put example command in input
                commandInput.focus(); // Focus the input field
                // Optionally, trigger explanation immediately:
                // if (typeof getExplanation === 'function') {
                //     getExplanation();
                // }
            }
        });
    }
});

// Expose functions globally if needed by other scripts (like script.js)
window.hideCommandExamples = hideCommandExamples;
window.showCommandExamples = showCommandExamples; // Expose if needed elsewhere

