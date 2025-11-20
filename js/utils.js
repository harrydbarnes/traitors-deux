const Utils = {
    fadeIn: function(element, duration = 1000) {
        element.style.opacity = 0;
        element.style.display = 'block';

        let start = null;
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = Math.min(progress / duration, 1);
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }
};
