// This file will contain all the audio-related logic.
let audioStarted = false;

function fadeInAudio() {
    // Only start audio if it hasn't been started yet
    if (!audioStarted) {
        const audioElement = document.getElementById("backgroundAudio");

        // Ensure audio plays as a direct response to user interaction
        const playPromise = audioElement.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Audio successfully started playing
                audioStarted = true;
                console.log("Audio started playing successfully");

                // Fade in audio over 6 seconds to 80% volume
                let volume = 0;
                const maxVolume = 0.8;
                const fadeSteps = 60; // 60 steps over 6 seconds = 100ms per step
                const volumeIncrement = maxVolume / fadeSteps;

                const intervalId = setInterval(() => {
                    volume += volumeIncrement;
                    if (volume >= maxVolume) {
                        clearInterval(intervalId);
                        volume = maxVolume; // Set to 80% max volume
                    }
                    audioElement.volume = volume;
                    console.log("Audio volume:", volume);
                }, 100); // 100ms per step for 6 seconds total
            }).catch(e => {
                // Fallback for cases where autoplay is blocked
                console.log("Audio play failed: ", e);

                // Add a click-to-play fallback
                const clickToPlay = function() {
                    audioElement.play().then(() => {
                        audioStarted = true;

                        // Fade in audio over 6 seconds to 80% volume
                        let volume = 0;
                        const maxVolume = 0.8;
                        const fadeSteps = 60;
                        const volumeIncrement = maxVolume / fadeSteps;

                        const intervalId = setInterval(() => {
                            volume += volumeIncrement;
                            if (volume >= maxVolume) {
                                clearInterval(intervalId);
                                volume = maxVolume;
                            }
                            audioElement.volume = volume;
                        }, 100);

                        // Remove event listeners once audio plays
                        document.removeEventListener('click', clickToPlay);
                        document.removeEventListener('touchstart', clickToPlay);
                    });
                };

                document.addEventListener('click', clickToPlay);
                document.addEventListener('touchstart', clickToPlay);
            });
        }
    }
}