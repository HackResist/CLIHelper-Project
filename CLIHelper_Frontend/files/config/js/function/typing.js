    // After 2 seconds, start typing effect
    setTimeout(() => {
        let text = "AI-Powered Linux & Git Command Explainer";
        let i = 0;
        document.getElementById("title").innerHTML = ""; // Clear "CLIHELPER"

        function typeEffect() {
            if (i < text.length) {
                document.getElementById("title").innerHTML += text.charAt(i);
                i++;
                setTimeout(typeEffect, 100); // Typing speed (100ms)
            }
        }

        typeEffect(); // Start typing effect
    }, 1000);