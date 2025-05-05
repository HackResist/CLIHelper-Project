// /home/windows/Desktop/Minor Project/CLIHelper Client Side/files/config/js/function/history.js
// UPDATED: Removed .slice().reverse() to display newest entries first

document.addEventListener('DOMContentLoaded', () => {
    const historyContainer = document.getElementById('history-container');
    const clearHistoryButton = document.getElementById('clear-history-button');

    // Configure marked.js (optional, if explanations use Markdown)
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            breaks: true,
            gfm: true
        });
    }

    function loadHistory() {
        // Clear previous entries before loading
        historyContainer.innerHTML = '';

        try {
            // History is already stored newest-first because script.js uses unshift()
            const history = JSON.parse(localStorage.getItem("commandHistory") || "[]");

            if (history.length === 0) {
                historyContainer.innerHTML = '<p class="no-history-message">No command history found.</p>';
                return;
            }

            // --- CORRECTED LINE ---
            // Iterate directly over the history array. Since it's stored newest-first,
            // this will display them in the correct order (newest at the top).
            history.forEach(entry => { // <-- REMOVED .slice().reverse()
                const entryDiv = document.createElement('div');
                entryDiv.classList.add('history-entry');

                // Format timestamp
                const timestamp = new Date(entry.timestamp);
                const formattedDate = timestamp.toLocaleString(undefined, {
                    dateStyle: 'medium', // e.g., Jan 1, 2023
                    timeStyle: 'short'   // e.g., 10:30 AM
                });

                // Create HTML structure for the entry
                entryDiv.innerHTML = `
                    <span class="timestamp">${formattedDate}</span>
                    <div class="command-section">
                        <strong>Command:</strong>
                        <code>${escapeHtml(entry.command)}</code>
                    </div>
                    <div class="explanation-section">
                        <strong>Explanation:</strong>
                        <div class="explanation-content">
                            ${renderExplanation(entry.explanation)}
                        </div>
                    </div>
                `;

                historyContainer.appendChild(entryDiv);
            });
            // --- END OF CORRECTION ---

            // Apply highlighting to code blocks within explanations
            if (typeof hljs !== 'undefined') {
                historyContainer.querySelectorAll('.explanation-content pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }

        } catch (error) {
            console.error("Error loading command history:", error);
            historyContainer.innerHTML = '<p class="no-history-message">Error loading history.</p>';
        }
    }

    function renderExplanation(explanationText) {
        try {
            // If using marked.js for Markdown rendering
            if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
                // Ensure explanationText is not null/undefined before parsing
                return marked(explanationText || '');
            } else {
                // Fallback: display as preformatted text (escape HTML)
                return `<pre><code>${escapeHtml(explanationText || '')}</code></pre>`;
            }
        } catch (error) {
            console.error("Error rendering explanation:", error);
            // Provide a safe fallback in case of rendering errors
            return `<pre><code>${escapeHtml(explanationText || 'Error rendering explanation.')}</code></pre>`;
        }
    }

    // Basic HTML escaping function
    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return ''; // Handle non-string inputs
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
     }


    // Event listener for the clear history button
    if (clearHistoryButton) {
        clearHistoryButton.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear all command history? This cannot be undone.")) {
                try {
                    localStorage.removeItem("commandHistory");
                    loadHistory(); // Reload the display (will show "No history")
                } catch (error) {
                    console.error("Error clearing history:", error);
                    alert("Could not clear history.");
                }
            }
        });
    } else {
        console.warn("Clear history button not found.");
    }

    // Initial load of history when the page is ready
    loadHistory();
});
