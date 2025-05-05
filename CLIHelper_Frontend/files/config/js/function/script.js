
function saveHistoryEntry(command, explanation) {
    const timestamp = new Date().toISOString(); // Use ISO format for consistency
    const historyEntry = { command, explanation, timestamp };

    try {
        let history = JSON.parse(localStorage.getItem("commandHistory") || "[]");
        //Limit history size (e.g., keep last 50 entries)
        const maxHistorySize = 50;
       // Add the new entry to the beginning (most recent first)
        history.unshift(historyEntry); // Always add the new entry to the front

        // Enforce the size limit (removes the OLDEST entries if limit is exceeded)
        if (history.length > maxHistorySize) {
            // Keep the first 'maxHistorySize' elements (which are the newest ones because we used unshift)
            history = history.slice(0, maxHistorySize);
        }
        localStorage.setItem("commandHistory", JSON.stringify(history));
        console.log("Command saved to history (stack behavior):", command); // For debugging

    } catch (error) {
        console.error("Error saving command history:", error);
        // Optionally notify the user or handle the error
    }
}

// Core function to fetch and display explanation
async function getExplanation() {
    const commandInput = document.getElementById("commandInput");
    const responseElement = document.getElementById("response");
    const command = commandInput.value.trim();

    if (!command) {
        // Use a less intrusive notification or update the response area
        responseElement.innerHTML = '<p class="error">Please enter a command.</p>';
        responseElement.style.display = "block"; // Ensure response area is visible for the message
        return;
    }

    // --- HIDE EXAMPLES when loading starts ---
    // Check if the function exists (loaded from examples.js) before calling
    if (typeof window.hideCommandExamples === 'function') {
        window.hideCommandExamples();
    }
    // --- END HIDE EXAMPLES ---

    responseElement.innerHTML = '<p class="loading">⏳ Loading...</p>'; // Use a class for styling
    responseElement.style.display = "block"; // Make sure response area is visible

    try {
        // --- Use the specified API endpoint ---
        const apiEndpoint = `https://clihelper-gemeni-api.onrender.com/explain?command=${encodeURIComponent(command)}`;

        const response = await fetch(apiEndpoint);

        // Check for HTTP errors (like 404, 500)
        if (!response.ok) {
             const errorText = await response.text(); // Get error details if available
             throw new Error(`HTTP error! status: ${response.status}, message: ${errorText || 'Failed to fetch'}`);
        }

        const data = await response.json();

        //  Process and Display Explanation
        if (data.explanation) {
            const explanationText = data.explanation; // Store raw explanation text

            // Use marked.js (ensure it's loaded) to convert Markdown to HTML
            // Check if marked is loaded and configured
            if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
                 responseElement.innerHTML = marked.parse(explanationText); // Set final content
            } else {
                 console.warn("marked.js not available, displaying raw text.");
                 // Fallback: display as preformatted text (escape HTML to prevent XSS)
                 responseElement.innerHTML = `<pre>${explanationText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`; // Set final content
            }


            // Highlight code blocks if using highlight.js
            // Check if hljs is loaded
            if (typeof hljs !== 'undefined') {
                responseElement.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            } else {
                 console.warn("highlight.js not available, skipping highlighting.");
            }

            // --- SAVE TO HISTORY (only after successful fetch and display) ---
            saveHistoryEntry(command, explanationText); // Save command and the raw explanation text
            // --- END SAVE TO HISTORY ---

        } else {
            responseElement.innerHTML = '<p class="warning">⚠️ No explanation found for this command.</p>'; // Set final content, use a class
        }

    } catch (error) {
        console.error("Error fetching explanation:", error);
        // Display a user-friendly error message
        responseElement.innerHTML = `<p class="error">❌ Error fetching explanation: ${error.message || 'Please try again later.'}</p>`; // Set final content
    }
}
// --- End of getExplanation function ---


// --- Theme Toggling Function ---
function toggleTheme() {
    // Determine the current theme and toggle
    const isDarkMode = document.body.classList.contains("dark-mode");
    const newTheme = isDarkMode ? "light-mode" : "dark-mode";

    // Update body class
    document.body.classList.remove("dark-mode", "light-mode"); // Clear existing
    document.body.classList.add(newTheme); // Add the new one

    // Save preference to localStorage using the key "theme"
    localStorage.setItem("theme", newTheme);

    // Update toggle button text/icon
    const themeToggleButton = document.querySelector(".theme-toggle");
    if (themeToggleButton) {
        // Use appropriate icons or text based on the NEW theme
        themeToggleButton.textContent = newTheme === "dark-mode" ? "☀️" : "🌙"; // Sun icon means it's currently dark, Moon icon means it's currently light
    }
}
// --- End of toggleTheme function ---


// --- Function to Load Theme Preference on Startup ---
function loadThemePreference() {
    // Use "theme" as the key, default to "dark-mode"
    const savedTheme = localStorage.getItem("theme") || "dark-mode";
    document.body.classList.remove("dark-mode", "light-mode"); // Ensure clean state
    document.body.classList.add(savedTheme);

    // Update toggle button text/icon based on the loaded theme
    const themeToggleButton = document.querySelector(".theme-toggle");
    if (themeToggleButton) {
        themeToggleButton.textContent = savedTheme === "dark-mode" ? "☀️" : "🌙"; // Sun icon for dark mode, Moon icon for light mode
    }
}
// --- End of loadThemePreference function ---


// --- Function to Fetch and Display User IP ---
async function displayUserIP() {
    const ipElement = document.getElementById("user-ip");
    if (!ipElement) {
        console.warn("Element with ID 'user-ip' not found.");
        return;
    }
    ipElement.textContent = "Your IP: Fetching...";

    try {
        // Using ipinfo.io as in the example
        const response = await fetch('https://ipinfo.io/json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        ipElement.textContent = data.ip ? `Your IP: ${data.ip}` : "Your IP: N/A";
    } catch (error) {
        console.error("Error fetching IP from ipinfo.io:", error);
        ipElement.textContent = "Your IP: Error";
    }
}
// --- End of displayUserIP function ---


// --- Function to Update Daily Visit Count (Client-Side) ---
function updateVisitCount() {
    const visitCountElement = document.getElementById("visit-count");
    if (!visitCountElement) {
        console.warn("Element with ID 'visit-count' not found.");
        return;
    }

    try {
        let today = new Date().toISOString().split("T")[0];
        // Use "visitData" key for consistency if needed elsewhere, or keep separate keys
        let lastVisitData = JSON.parse(localStorage.getItem("visitData") || "{}");

        let visitCount = 0;
        // Check if the last recorded visit was today
        if (lastVisitData.date === today) {
            // Increment today's count
            visitCount = (lastVisitData.count || 0) + 1;
        } else {
            // It's a new day, reset count to 1
            visitCount = 1;
        }

        // Save the updated date and count
        localStorage.setItem("visitData", JSON.stringify({ date: today, count: visitCount }));
        visitCountElement.textContent = `Visits Today: ${visitCount}`;

    } catch (error) {
        console.error("Error updating visit count:", error);
        visitCountElement.textContent = `Visits Today: Error`;
    }
}
// --- End of updateVisitCount function ---


// --- DOMContentLoaded Event Listener (Runs once when the page is ready) ---
document.addEventListener("DOMContentLoaded", function () {
    // 1. Load saved theme or default
    loadThemePreference();

    // 2. Add event listener for Enter key on the command input field
    const commandInput = document.getElementById("commandInput");
    if (commandInput) {
        commandInput.addEventListener("keypress", function (event) {
            // Check if the key pressed is 'Enter'
            if (event.key === "Enter") {
                event.preventDefault(); // Prevent default form submission behavior (if inside a form)
                getExplanation();     // Call the single explanation function
            }
        });
        // Optional: Show examples again if input is cleared manually
        // commandInput.addEventListener('input', () => {
        //     if (commandInput.value.trim() === '' && typeof window.showCommandExamples === 'function') {
        //         const responseElement = document.getElementById("response");
        //         // Only show examples if response area is hidden or empty
        //         if (!responseElement || responseElement.style.display === 'none' || responseElement.innerHTML.trim() === '') {
        //              window.showCommandExamples();
        //         }
        //     }
        // });
    } else {
        console.error("Error: commandInput element not found. Enter key listener not added.");
    }

    // 3. Update the client-side visit count display
    updateVisitCount();

    // 4. Fetch and display the user's IP address
    displayUserIP();

    // 5. Configure marked.js (if available)
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            breaks: true, // Add <br> on single line breaks
            gfm: true     // Enable GitHub Flavored Markdown
        });
        console.log("marked.js configured.");
    } else {
        console.warn("marked.js library not found. Markdown rendering might not work.");
    }

    // 6. Check for highlight.js (just a check, highlighting is done in getExplanation)
    if (typeof hljs === 'undefined') {
        console.warn("highlight.js library not found. Code highlighting will be skipped.");
    } else {
         console.log("highlight.js found.");
    }

    // Note: The typing effect from typing.js and menu toggle from menu-toggle.js
    // should be handled by their respective files or integrated here if desired.
    // Ensure those scripts are also loaded correctly in your HTML.
});
// --- End of DOMContentLoaded ---


// --- Expose functions to global scope for HTML onclick attributes ---
// This allows calling these functions directly from HTML like onclick="getExplanation()"
window.getExplanation = getExplanation;
window.toggleTheme = toggleTheme;
// Assuming toggleMenu is defined globally in menu-toggle.js or you expose it similarly if needed.
// If menu-toggle.js defines toggleMenu locally, you might need:
// import { toggleMenu } from './menu-toggle.js'; // If using modules
// window.toggleMenu = toggleMenu; // If menu-toggle.js defines it globally or you need to expose it
