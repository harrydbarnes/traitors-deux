const Credits = {
    init: function() {
        this.introCredits = [
            document.getElementById('director'),
            document.getElementById('writer'),
            document.getElementById('producer'),
            document.getElementById('executive')
        ];
        this.creditsContainer = document.getElementById('creditsContainer');
        this.creditsContent = document.getElementById('creditsContent');
        this.finalMessage = document.getElementById('finalMessage');
        this.gameTitle = document.getElementById('gameTitle');
        this.fadeOverlay = document.getElementById('fadeOverlay');
        this.audio = document.getElementById('backgroundAudio');

        // Global var used by audio.js
        window.hasInteracted = false;

        this.startSequence();
    },

    startSequence: function() {
        setTimeout(() => {
            this.creditsContainer.style.opacity = '1';
            document.body.style.backgroundColor = '#000000';

            setTimeout(() => {
                if (this.gameTitle) this.gameTitle.style.display = 'none';
                this.showIntroCreditsSequentially(0);
            }, 4000);
        }, 1000);
    },

    showIntroCreditsSequentially: function(index) {
        if (index >= this.introCredits.length) {
            this.startScrollingCredits();
            return;
        }

        const credit = this.introCredits[index];
        if (credit) {
            credit.style.opacity = '1';
            setTimeout(() => {
                credit.style.opacity = '0';
                setTimeout(() => {
                    this.showIntroCreditsSequentially(index + 1);
                }, 500);
            }, 2000);
        } else {
            // Skip if element missing
            this.showIntroCreditsSequentially(index + 1);
        }
    },

    startScrollingCredits: function() {
        this.introCredits.forEach(c => { if(c) c.style.opacity = '0'; });

        setTimeout(() => {
            if (this.creditsContent) {
                this.creditsContent.style.opacity = '1';
                this.creditsContent.style.animation = 'scrollCredits 90s linear forwards';

                // Try playing music if user has interacted
                if (window.hasInteracted && this.audio && !this.audio.muted) {
                     this.audio.play().catch(e => console.log("Audio playback failed:", e));
                }
            }

            setTimeout(() => {
                if (this.finalMessage) this.finalMessage.style.opacity = '1';

                setTimeout(() => {
                    if (this.fadeOverlay) this.fadeOverlay.style.opacity = '1';
                    setTimeout(() => {
                        window.location.href = '/cloakpixel/';
                    }, 2000);
                }, 4000);
            }, 62000);
        }, 500);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Credits.init();
});
