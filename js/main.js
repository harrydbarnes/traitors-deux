document.addEventListener("DOMContentLoaded", () => {
    document.body.style.transition = "background-color 1s ease-in-out";
    document.body.style.backgroundColor = "#111b34";

    const countdownElement = document.getElementById("countdown");
    if (countdownElement) {
        countdownElement.style.opacity = "0";
        countdownElement.style.visibility = "hidden";
    }

    // Initial page fade-in sequence
    startInitialFadeInSequence();

    // Start the ellipsis animation for "stay tuned"
    const stayTunedEllipsis = document.querySelector('.ellipsis');
    if (stayTunedEllipsis) {
        animateEllipsis(stayTunedEllipsis);
    }

    setTimeout(() => {
        startCracking();
    }, 500); // Glass effect starts within 0.5s
});

function showSurvey() {
    // Clear ellipsis animation if it's running
    if (window.ellipsisInterval) {
        clearInterval(window.ellipsisInterval);
    }

    // Fade out current content
    const contentElement = document.getElementById("content");
    contentElement.style.opacity = "0";

    // Make sure countdown is visible and ready
    const countdownElement = document.getElementById("countdown");
    if (countdownElement) {
        countdownElement.style.opacity = "1";
        countdownElement.style.visibility = "visible";
    }

    // Ensure logo container stays on top
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.style.zIndex = "15";
    }

    setTimeout(() => {
        // Replace with survey content using the wrapper structure to prevent scrolling
        contentElement.innerHTML = `
            <div class="survey-wrapper">
                <h1 class="glitch-text survey-heading">Claudio needs help with a quick survey. Please fill in the below - zoom out or use a larger screen to avoid issues submitting:</h1>
                <div class="survey-container">
                    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfWxhnc6D1mUzPOtiOdiG70yXaVOUCCWDfUZVtmW5vO7GpnpQ/viewform?embedded=true" width="620" height="500" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
                </div>
            </div>
        `;

        // Reset content container styles
        contentElement.style.opacity = "1";
        contentElement.style.overflow = "hidden";
        contentElement.style.maxHeight = "calc(100vh - 140px)"; // Leave room for countdown
        contentElement.style.paddingBottom = "25px"; // Reduce padding to minimize whitespace
        contentElement.style.maxWidth = "620px"; // More constrained width to prevent horizontal scroll

        // Ensure proper positioning
        contentElement.style.display = "flex";
        contentElement.style.flexDirection = "column";
        contentElement.style.justifyContent = "center";
        contentElement.style.marginTop = "100px"; // Push content below logo
    }, 1000);
}

async function showNotEverythingIsAsItSeems() {
    document.body.style.backgroundColor = "white";
    AppState.inverted = true; // Invert crack colors
    document.body.style.color = "#001f3f";

    // Switch WPP logo from inverse to regular
    const wppLogo = document.getElementById("wpp-logo");
    wppLogo.src = "WPP-logo.png";

    // Clear content first
    document.getElementById("content").innerHTML = '';

    // Create text elements (all initially hidden)
    const heading1 = document.createElement('h1');
    heading1.className = 'glitch-text fade-in-element';
    heading1.textContent = 'Everything is not as it seems';
    heading1.style.opacity = '0';
    heading1.style.transition = 'opacity 1s ease-in-out';

    const heading2 = document.createElement('h2');
    heading2.className = 'glitch-text fade-in-element';
    heading2.textContent = 'Some of you have guessed it... there is no training, instead you will be playing a game';
    heading2.style.opacity = '0';
    heading2.style.transition = 'opacity 1s ease-in-out';

    const heading3 = document.createElement('h2');
    heading3.className = 'glitch-text fade-in-element';
    heading3.textContent = 'Claudio will see you soon';
    heading3.style.opacity = '0';
    heading3.style.transition = 'opacity 1s ease-in-out';

    const loadingText = document.createElement('p');
    loadingText.className = 'glitch-text loading-text';
    loadingText.style.opacity = '0';
    loadingText.style.transition = 'opacity 1s ease-in-out';
    loadingText.innerHTML = 'Please remain on the page - loading<span class="ellipsis">.</span>';

    // Add elements to the content container
    const contentElement = document.getElementById("content");
    contentElement.appendChild(heading1);
    contentElement.appendChild(heading2);
    contentElement.appendChild(heading3);
    contentElement.appendChild(loadingText);

    // Start countdown but keep it hidden
    startCountdown();
    const countdownElement = document.getElementById("countdown");
    countdownElement.style.opacity = "0";
    countdownElement.style.visibility = "visible";
    countdownElement.style.transition = "opacity 1s ease-in-out";

    document.getElementById("static").style.opacity = "0";

    // Check if we've already shown this screen before
    if (window.notEverythingShown) {
        // If already shown, just make all elements visible immediately
        heading1.style.opacity = '1';
        heading2.style.opacity = '1';
        heading3.style.opacity = '1';
        loadingText.style.opacity = '1';
        countdownElement.style.opacity = '1';

        // Start ellipsis animation for loading text
        startEllipsisAnimation();
    } else {
        await delay(500);
        heading1.style.opacity = '1';

        await delay(2000);
        heading2.style.opacity = '1';

        await delay(2000);
        heading3.style.opacity = '1';

        await delay(2000);
        loadingText.style.opacity = '1';
        startEllipsisAnimation();

        await delay(2000);
        countdownElement.style.opacity = '1';

        window.notEverythingShown = true;
    }

    // Only schedule next transition if we haven't shown the survey yet
    if (AppState.staticTransitionCount < 3) {
        let nextEffectTime = Math.floor(Math.random() * (8000 - 2000 + 1)) + 2000;
        setTimeout(() => {
            // Don't restart cracking, just ensure cracks are visible
            cracks.forEach(crack => {
                crack.opacity = 1;
            });
            setTimeout(tvStaticTransition, 1000);
        }, nextEffectTime);
    }
}

// Changed from 10000 to 11000 (11 seconds) as requested
setTimeout(() => {
    tvStaticTransition();
}, 12000);