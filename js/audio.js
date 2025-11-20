const AudioController = {
    init: function() {
        // Wait for user interaction to initialize audio context/play
        this.setupInteraction();
        this.setupMuteButton();
    },

    setupMuteButton: function() {
        let muteButton = document.getElementById('muteButton');
        if (!muteButton) {
            // Some pages might not have it in HTML, create it
            muteButton = document.createElement('button');
            muteButton.id = 'muteButton';
            muteButton.textContent = 'Click Page To Enable Audio';
            document.body.appendChild(muteButton);
        }

        // Dispatch event that mute button is ready
        window.dispatchEvent(new CustomEvent('MuteButtonReady', { detail: { button: muteButton } }));

        // If we are on credits page, the mute button logic is slightly different (pauses/plays instead of just muting sometimes?)
        // The original code in credits.html:
        // if (isMuted) { audio.pause(); ... } else { if(creditsVisible) audio.play(); ... }
        // Standardizing: standard behavior is mute/unmute property.
        // But credits page pauses audio when muted.
        // For now, let's stick to standard mute/unmute for simplicity unless credits need special handling.
        // Actually, let's check if we are on credits page.
        const isCredits = window.location.pathname.includes('credits');

        muteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const audio = document.getElementById('backgroundAudio');

            if (!audio) return;

            if (audio.paused && !audio.muted && !isCredits) {
                 // If it was paused (e.g. blocked autoplay), play it
                 this.playAudio(audio);
                 muteButton.textContent = 'Mute';
            } else {
                if (isCredits) {
                    if (audio.paused) {
                        audio.play();
                        audio.muted = false;
                        muteButton.textContent = 'Mute';
                    } else {
                        audio.pause();
                        muteButton.textContent = 'Unmute';
                    }
                } else {
                    audio.muted = !audio.muted;
                    muteButton.textContent = audio.muted ? 'Unmute' : 'Mute';
                }
            }
        });
    },

    setupInteraction: function() {
        const startAudio = () => {
            const audio = document.getElementById('backgroundAudio');
            const muteButton = document.getElementById('muteButton');

            if (audio) {
                // Credits page handles its own playback start logic (waits for credits to scroll)
                if (window.location.pathname.includes('credits')) {
                    // Let credits.js handle the .play() call when appropriate,
                    // but we can mark that interaction happened.
                    window.hasInteracted = true;
                    if (muteButton) muteButton.textContent = 'Mute';
                } else {
                     this.playAudio(audio).then(() => {
                        if (muteButton) muteButton.textContent = 'Mute';
                     });
                }
            }

            document.removeEventListener('click', startAudio);
            document.removeEventListener('touchstart', startAudio);
        };

        document.addEventListener('click', startAudio);
        document.addEventListener('touchstart', startAudio);
    },

    playAudio: function(audio) {
        audio.volume = 0;
        return audio.play().then(() => {
            this.fadeIn(audio);
        }).catch(e => console.log("Audio autoplay blocked", e));
    },

    fadeIn: function(audio, duration = 2000) {
        let volume = 0;
        const step = 0.05;
        const intervalTime = duration / (1 / step);

        const interval = setInterval(() => {
            volume = Math.min(volume + step, 1);
            audio.volume = volume;
            if (volume >= 1) clearInterval(interval);
        }, intervalTime);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AudioController.init();
});
