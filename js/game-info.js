// Logic for game-info.html
const FAQ = {
    init: function() {
        this.setupListeners();
        this.fadeInContent();
    },

    setupListeners: function() {
        const questions = document.querySelectorAll('.faq-question');
        let activeAnswer = null;

        questions.forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;

                if (activeAnswer && activeAnswer !== answer) {
                    activeAnswer.style.display = 'none';
                }

                answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
                activeAnswer = answer.style.display === 'block' ? answer : null;
            });
        });
    },

    fadeInContent: function() {
        setTimeout(() => {
            const imgContainer = document.getElementById('imageContainer');
            const infoBox = document.querySelector('.info-box');

            if (imgContainer) imgContainer.style.opacity = '1';
            if (infoBox) infoBox.style.opacity = '1';
        }, 100);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    FAQ.init();
});
