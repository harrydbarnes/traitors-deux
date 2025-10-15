const menuHtml = `
<div class="menu-bar">
    <a href="/cloakpixel/" id="home-link">Home</a>
    <a href="/cloakpixel/games" id="games-link">Games</a>
    <a href="/cloakpixel/schedule" id="schedule-link">Schedule</a>
    <a href="/cloakpixel/photo-wall" id="photo-wall-link">Photo Wall</a>
    <a href="/cloakpixel/game-info" id="game-info-link">Game Info</a>
    <a href="/cloakpixel/journal" id="journal-link">Journal</a>
    <a href="/cloakpixel/credits" id="credits-link">Credits</a>
</div>
`;

document.getElementById('menu-placeholder').outerHTML = menuHtml;