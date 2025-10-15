function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function showIntroCreditsSequentially() {
    const introCredits = [
        document.getElementById('director'),
        document.getElementById('writer'),
        document.getElementById('producer'),
        document.getElementById('executive')
    ];

    for (const credit of introCredits) {
        credit.style.opacity = '1';
        await delay(2000); // 2s display time
        credit.style.opacity = '0';
        await delay(500); // 0.5s for fade out
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    const audio = document.getElementById('backgroundAudio');
    const muteButton = document.getElementById('muteButton');
    const body = document.body;
    const creditsContainer = document.getElementById('creditsContainer');
    const creditsContent = document.getElementById('creditsContent');
    const finalMessage = document.getElementById('finalMessage');
    const gameTitle = document.getElementById('gameTitle');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const fadeOverlay = document.getElementById('fadeOverlay');
    let isMuted = false;
    const menuBar = document.getElementById('menuBar');
    let hasInteracted = false;

    // Fade in the credits container after page load
    await delay(1000);
    creditsContainer.style.opacity = '1';
    body.style.backgroundColor = '#000000';

    // Keep game title visible for 4 seconds before starting the sequence
    await delay(4000);
    // Hide game title
    gameTitle.style.display = 'none';

    // Start the intro credits sequence
    await showIntroCreditsSequentially();

    // Make the scrolling credits visible and start music
    await delay(500);
    creditsContent.style.opacity = '1';

    // Start playing the credit music
    playBackgroundMusic();

    // Start the scrolling animation
    creditsContent.style.animation = 'scrollCredits 90s linear forwards';

    // Show "Claudio Will Return" 54 seconds after credits start
    await delay(62000);
    finalMessage.style.opacity = '1';

    // Add fade to black and redirect after 2 more seconds
    await delay(4000);
    fadeOverlay.style.opacity = '1';

    // Redirect after fade completes
    await delay(2000);
    window.location.href = 'https://claudio-wpp.github.io/cloakpixel/';

    // Function to play background music
    function playBackgroundMusic() {
        if (!isMuted && hasInteracted) {
            audio.play().catch(e => {
                console.log("Audio playback failed:", e);
            });
        }
    }

    // Handle audio initialization on user interaction
    function initAudio() {
        hasInteracted = true;
        muteButton.textContent = 'Mute';

        // If credits are already scrolling, play the music immediately
        if (creditsContent.style.opacity === '1') {
            playBackgroundMusic();
        }

        // Remove event listeners after first interaction
        document.removeEventListener('click', initAudio);
        document.removeEventListener('touchstart', initAudio);
    }

    // Set up event listeners for user interaction to start audio
    document.addEventListener('click', initAudio);
    document.addEventListener('touchstart', initAudio);

    // Mute/Unmute functionality
    muteButton.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering document click
        isMuted = !isMuted;

        if (isMuted) {
            audio.pause();
            muteButton.textContent = 'Unmute';
        } else {
            if (creditsContent.style.opacity === '1') {
                audio.play();
            }
            muteButton.textContent = 'Mute';
        }
    });

    // Show menu only when hovering over menu area
    document.addEventListener('mousemove', function(e) {
        const menuBar = document.querySelector('.menu-bar');
        if (e.clientY < 60) { // Only show if mouse is near top of screen
            menuBar.style.opacity = '1';
        } else {
            menuBar.style.opacity = '0';
        }
    });
});