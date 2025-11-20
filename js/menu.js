const Menu = {
    init: function() {
        // Look for existing menu bar or create one
        let menuContainer = document.querySelector('.menu-bar');
        if (!menuContainer) {
            menuContainer = document.createElement('div');
            menuContainer.className = 'menu-bar';
            // Insert as first child of body
            document.body.insertBefore(menuContainer, document.body.firstChild);
        }

        // Check if we are on credits page for specific ID
        if (window.location.pathname.includes('credits')) {
            menuContainer.id = 'menuBar';
        }

        // Inject menu items
        menuContainer.innerHTML = `
            <a href="/cloakpixel/" id="home-link">Home</a>
            <a href="/cloakpixel/games" id="games-link">Games</a>
            <a href="/cloakpixel/schedule" id="schedule-link">Schedule</a>
            <a href="/cloakpixel/photo-wall" id="photo-wall-link">Photo Wall</a>
            <a href="/cloakpixel/game-info" id="game-info-link">Game Info</a>
            <a href="/cloakpixel/journal" id="journal-link">Journal</a>
            <a href="/cloakpixel/credits" id="credits-link">Credits</a>
        `;

        this.setupHoverEffects();
    },

    setupHoverEffects: function() {
        // Only for credits page which has specific hover requirement
        if (window.location.pathname.includes('credits')) {
             const menuBar = document.getElementById('menuBar');
             if (menuBar) {
                 document.addEventListener('mousemove', function(e) {
                    if (e.clientY < 60) { // Only show if mouse is near top of screen
                        menuBar.style.opacity = '1';
                    } else {
                        menuBar.style.opacity = '0';
                    }
                });
             }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Menu.init();
});
