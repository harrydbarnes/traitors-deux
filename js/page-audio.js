document.addEventListener("DOMContentLoaded", function() {
    const audio = document.getElementById('backgroundAudio');
    const muteButton = document.getElementById('muteButton');
    let isMuted = false;

    if (audio && muteButton) {
        muteButton.addEventListener('click', function() {
            isMuted = !isMuted;
            audio.muted = isMuted;
            muteButton.textContent = isMuted ? 'Unmute' : 'Mute';
        });

        function initAudio() {
            audio.volume = 0;
            audio.play().then(() => {
                muteButton.textContent = 'Mute';
                let volume = 0;
                const fadeInterval = setInterval(() => {
                    volume += 0.05;
                    if (volume >= 1) {
                        clearInterval(fadeInterval);
                        volume = 1;
                    }
                    audio.volume = volume;
                }, 100);
            }).catch((error) => {
                console.log("Audio play failed:", error);
            });

            document.removeEventListener('click', initAudio);
            document.removeEventListener('touchstart', initAudio);
        }

        document.addEventListener('click', initAudio);
        document.addEventListener('touchstart', initAudio);
    }
});