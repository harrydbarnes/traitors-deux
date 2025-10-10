// This file will contain all the countdown-related logic.

function startCountdown() {
    const countdownElement = document.getElementById("countdown");
    if (countdownElement) {

        // Reset any existing styles
        countdownElement.style = "";

        // Set initial styles
        countdownElement.style.opacity = "0";
        countdownElement.style.fontFamily = "'YaroCut', sans-serif";
        countdownElement.style.transition = "opacity 1.5s ease-in-out";
        countdownElement.style.visibility = "visible"; // Make sure it's visible before fading in

        // Force the browser to apply the initial styles before changing them
        void countdownElement.offsetWidth;

        // Set the countdown text before starting the fade-in
        updateCountdownText();

         // Start the fade-in effect after a small delay
        setTimeout(() => {
            countdownElement.style.opacity = "1";
        }, 500);

        // Update the countdown text every second
        function updateCountdownText() {
            const targetDate = new Date("March 26, 2025 11:00:00").getTime();
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                countdownElement.innerHTML = "The event has started!";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        // Set up the interval to update the countdown
        const countdownInterval = setInterval(() => {
            const targetDate = new Date("March 26, 2025 11:00:00").getTime();
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                countdownElement.innerHTML = "The event has started!";
                return;
            }

            updateCountdownText();
        }, 1000);
    }
}