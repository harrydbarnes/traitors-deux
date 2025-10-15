// This file will contain all the countdown-related logic.

function startCountdown() {
    const countdownElement = document.getElementById("countdown");
    if (countdownElement) {
        const COUNTDOWN_TARGET_DATE = "March 26, 2025 11:00:00";
        const targetTime = new Date(COUNTDOWN_TARGET_DATE).getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetTime - now;

            if (distance < 0) {
                countdownElement.innerHTML = "The event has started!";
                clearInterval(countdownInterval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        };

        updateCountdown();

        // Set up the interval to update the countdown
        const countdownInterval = setInterval(updateCountdown, 1000);
    }
}