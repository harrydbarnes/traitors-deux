document.addEventListener("DOMContentLoaded", function() {
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

    // Intro credits elements
    const introCredits = [
        document.getElementById('director'),
        document.getElementById('writer'),
        document.getElementById('producer'),
        document.getElementById('executive')
    ];

    // Fade in the credits container after page load
    setTimeout(() => {
        creditsContainer.style.opacity = '1';
        body.style.backgroundColor = '#000000';

        // Keep game title visible for 4 seconds before starting the sequence
        setTimeout(() => {
            // Hide game title
            gameTitle.style.display = 'none';

            // Start the intro credits sequence
            showIntroCreditsSequentially(0);
        }, 4000);
    }, 1000);

    // Function to show intro credits one by one
    function showIntroCreditsSequentially(index) {
        if (index >= introCredits.length) {
            // All intro credits have been shown, start the scrolling cast credits
            introCredits.forEach(credit => {
                credit.style.opacity = '0';
            });

            // Make the scrolling credits visible and start music
            setTimeout(() => {
                // Make the scrolling credits visible
                creditsContent.style.opacity = '1';

                // Start playing the credit music
                playBackgroundMusic();

                // Start the scrolling animation
                creditsContent.style.animation = 'scrollCredits 90s linear forwards';

                // Show "Claudio Will Return" 54 seconds after credits start (corrected from 72s)
                setTimeout(() => {
                    finalMessage.style.opacity = '1';

                    // Add fade to black and redirect after 2 more seconds
                    setTimeout(() => {
                        fadeOverlay.style.opacity = '1';

                        // Redirect after fade completes
                        setTimeout(() => {
                            window.location.href = 'https://claudio-wpp.github.io/cloakpixel/';
                        }, 2000);
                    }, 4000);
                }, 62000); // Corrected timing (18s earlier)
            }, 500);

            return;
        }

        // Show current credit
        introCredits[index].style.opacity = '1';

        // Wait 2 seconds, then fade out
        setTimeout(() => {
            introCredits[index].style.opacity = '0';

            // After fade out, show next credit
            setTimeout(() => {
                showIntroCreditsSequentially(index + 1);
            }, 500); // 0.5s for fade out
        }, 2000); // 2s display time
    }

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
        if (e.clientY < 60) { // Only show if mouse is near top of screen
            menuBar.style.opacity = '1';
        } else {
            menuBar.style.opacity = '0';
        }
    });
});