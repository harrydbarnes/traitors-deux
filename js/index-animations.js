const AppState = {
    audioStarted: false,
    inverted: false,
    staticTransitionCount: 0,
    ellipsisInterval: null,
    crackInterval: null,
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to handle sequential fade-in for initial page elements
async function startInitialFadeInSequence() {
    const fadeElements = document.querySelectorAll('.fade-element');
    const fadeDelay = 600; // 600ms between each element

    for (let i = 0; i < fadeElements.length; i++) {
        const element = fadeElements[i];
        await delay(fadeDelay);
        element.style.transition = "opacity 1s ease-in-out";
        element.style.opacity = "1";
    }

    // Start animating underlines after the last element has faded in
    await delay(500);
    const paragraph = document.querySelector('.justified-text');
    if (paragraph) {
        const boldElements = paragraph.querySelectorAll('strong');
        const delay = 10000 / boldElements.length; // Distribute over 10 seconds

        for (let i = 0; i < boldElements.length; i++) {
            const boldElement = boldElements[i];
            await delay(delay);
            boldElement.classList.add('highlight-active');
        }
    }
}

// Function to animate underlines for bold text elements one by one
async function animateUnderlines() {
    const boldElements = document.querySelectorAll('strong');
    const delay = 10000 / boldElements.length; // Distribute over 10 seconds

    for (let i = 0; i < boldElements.length; i++) {
        const element = boldElements[i];
        await delay(delay);
        element.classList.add('highlight-active');
    }
}

// Function to animate ellipsis
function animateEllipsis(element) {
    if (AppState.ellipsisInterval) {
        clearInterval(AppState.ellipsisInterval);
    }

    let count = 0;
    AppState.ellipsisInterval = setInterval(() => {
        count = (count + 1) % 4;
        element.textContent = '.'.repeat(count || 1);
    }, 500);
}

async function tvStaticTransition() {
    const staticOverlay = document.getElementById("static");
    if (staticOverlay) {
        staticOverlay.style.opacity = "1";
        staticOverlay.style.animation = "none";

        // Start playing audio immediately with first transition
        fadeInAudio();

        // Increment static transition counter
        AppState.staticTransitionCount++;

        // Create image teaser element if it doesn't exist
        let keyImageElement = document.getElementById("keyImage");
        if (!keyImageElement) {
            keyImageElement = document.createElement("div");
            keyImageElement.id = "keyImage";
            keyImageElement.style.position = "fixed";
            keyImageElement.style.top = "50%";
            keyImageElement.style.left = "50%";
            keyImageElement.style.transform = "translate(-50%, -50%)";
            keyImageElement.style.height = "80vh";
            keyImageElement.style.display = "flex";
            keyImageElement.style.justifyContent = "center";
            keyImageElement.style.alignItems = "center";
            keyImageElement.style.backgroundColor = "black";
            keyImageElement.style.zIndex = "20";
            keyImageElement.style.opacity = "0";

            const img = document.createElement("img");
            img.src = "Key-Image-Art.jpeg";
            img.style.height = "100%";
            img.style.width = "auto";
            img.style.maxWidth = "100%";
            img.style.objectFit = "contain";

            keyImageElement.appendChild(img);
            document.body.appendChild(keyImageElement);
        }

        const maxFlickers = Math.floor(Math.random() * 6) + 5; // Random between 5-10 flickers
        const showKeyImageOnFlicker = Math.floor(Math.random() * maxFlickers);

        // Ensure key image only appears after first full heading set
        const checkFullTextAppeared = () => {
            const heading1 = document.querySelector('h1.glitch-text');
            const heading2 = document.querySelector('h2.glitch-text:nth-of-type(1)');
            return heading1 && heading2 &&
                   heading1.style.opacity === '1' &&
                   heading2.style.opacity === '1';
        };

        for (let i = 0; i < maxFlickers; i++) {
            if (i === showKeyImageOnFlicker) {
                if (checkFullTextAppeared()) {
                    staticOverlay.style.opacity = "0";
                    keyImageElement.style.opacity = "1";

                    await delay(200);

                    if (i < maxFlickers -1) {
                        keyImageElement.style.opacity = "0";
                        staticOverlay.style.opacity = "1";
                    }
                }
            } else {
                staticOverlay.style.opacity = staticOverlay.style.opacity === "1" ? "0" : "1";
                keyImageElement.style.opacity = "0";
            }
            await delay(100);
        }

        staticOverlay.style.opacity = "0";
        keyImageElement.style.opacity = "0";

        if (AppState.staticTransitionCount >= 3) {
            showSurvey();
        } else {
            showNotEverythingIsAsItSeems();
        }
    }
}

function startEllipsisAnimation() {
    const ellipsisElement = document.querySelector('.ellipsis');
    if (ellipsisElement) {
        animateEllipsis(ellipsisElement);
    }
}