const Home = {
    init: function() {
        document.body.style.transition = "background-color 1s ease-in-out";
        document.body.style.backgroundColor = "#111b34";

        this.setupAudio();
        this.setupCanvas();

        // Determine if we are on the "Intro" flow or "Endgame" flow.
        // script.js was seemingly used for the intro flow which transitions to "Everything is not as it seems".
        // However, the current index.html has "Thank you for playing" text.
        // The script.js logic OVERWRITES the content after 12 seconds.
        // I will preserve this behavior.

        // Initial page fade-in sequence for existing elements
        this.startInitialFadeInSequence();

        const stayTunedEllipsis = document.querySelector('.ellipsis');
        if (stayTunedEllipsis) {
            this.animateEllipsis(stayTunedEllipsis);
        }

        setTimeout(() => {
            this.startCracking();
        }, 500);

        // Start the transition sequence after 12 seconds
        setTimeout(() => {
            this.tvStaticTransition();
        }, 12000);
    },

    setupAudio: function() {
        // Handled by audio.js primarily, but script.js created it dynamically.
        // We'll rely on audio.js checking for it or creating it.
        // But if we need to create it here specifically:
        if (!document.getElementById('backgroundAudio')) {
            const audioElement = document.createElement("audio");
            audioElement.id = "backgroundAudio";
            audioElement.src = "key-art-audio.wav";
            audioElement.loop = true;
            audioElement.volume = 0;
            audioElement.preload = "auto";
            document.body.appendChild(audioElement);
        }
    },

    startInitialFadeInSequence: function() {
        const fadeElements = document.querySelectorAll('.fade-element');
        const fadeDelay = 600;

        fadeElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.transition = "opacity 1s ease-in-out";
                element.style.opacity = "1";
            }, fadeDelay * index);
        });

        const lastElementIndex = fadeElements.length - 1;
        setTimeout(() => {
            const paragraph = document.querySelector('.justified-text');
            if (paragraph) {
                const boldElements = paragraph.querySelectorAll('strong');
                const delay = 10000 / boldElements.length;

                boldElements.forEach((boldElement, boldIndex) => {
                    setTimeout(() => {
                        boldElement.classList.add('highlight-active');
                    }, delay * boldIndex);
                });
            }
        }, fadeDelay * (lastElementIndex + 1) + 500);
    },

    animateEllipsis: function(element) {
        let count = 0;
        const ellipsisInterval = setInterval(() => {
            count = (count + 1) % 4;
            element.textContent = '.'.repeat(count || 1);
        }, 500);
        window.ellipsisInterval = ellipsisInterval;
    },

    // Canvas and Cracking Logic
    setupCanvas: function() {
        this.canvas = document.getElementById("crackCanvas");
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.cracks = [];
        this.crackCount = 20;
        this.opacity = 0;
        this.inverted = false;
        this.mouseX = -1000;
        this.mouseY = -1000;
        this.mouseInWindow = false;
        this.mouseFollowingCracks = 0;
        this.mouseFollowingTimes = {};
        this.staticTransitionCount = 0;

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.mouseInWindow = true;
        });

        // Initial cracks
        for (let i = 0; i < this.crackCount; i++) {
            this.cracks.push(this.createNewCrack());
        }
    },

    createNewCrack: function() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 1.5 + 0.7,
            dx: (Math.random() - 0.5) * 2,
            dy: (Math.random() - 0.5) * 2,
            opacity: this.opacity,
            maxLength: 2.4 + Math.random() * 3.6,
            currentLength: 0.72,
            followMouse: Math.random() < 0.25,
            circlingMouse: false,
            angleAroundMouse: Math.random() * Math.PI * 2,
            radiusFromMouse: 0,
            circlingSpeed: (Math.random() * 0.02) + 0.01,
            id: Math.random().toString(36).substr(2, 9),
            startedFollowingAt: 0
        };
    },

    drawCracks: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let cracksToRegenerate = [];
        this.mouseFollowingCracks = this.cracks.filter(crack => crack.followMouse && this.mouseInWindow).length;
        const currentTime = Date.now();

        this.cracks.forEach((crack, index) => {
            // Growth logic
            if (!crack.circlingMouse && crack.currentLength < crack.maxLength && Math.random() > 0.2) {
                crack.currentLength += 0.14;
            }

            // Mouse following logic
            if (crack.followMouse && this.mouseFollowingTimes[crack.id]) {
                if (currentTime - this.mouseFollowingTimes[crack.id] > 3000) {
                    if (this.mouseFollowingCracks >= 5) {
                        crack.followMouse = false;
                        crack.circlingMouse = false;
                        delete this.mouseFollowingTimes[crack.id];
                        this.mouseFollowingCracks--;
                    }
                }
            }

            if (crack.followMouse && !this.mouseFollowingTimes[crack.id] && this.mouseFollowingCracks <= 5) {
                this.mouseFollowingTimes[crack.id] = currentTime;
            } else if (crack.followMouse && this.mouseFollowingCracks > 5) {
                crack.followMouse = false;
            }

            // Drawing
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(${this.inverted ? "17, 27, 52" : "255, 255, 255"}, ${crack.opacity})`;
            this.ctx.lineWidth = crack.size;

            if (crack.circlingMouse) {
                const x = this.mouseX + Math.cos(crack.angleAroundMouse) * crack.radiusFromMouse;
                const y = this.mouseY + Math.sin(crack.angleAroundMouse) * crack.radiusFromMouse;
                this.ctx.moveTo(crack.x, crack.y);
                this.ctx.lineTo(x, y);
                crack.x = x;
                crack.y = y;
                crack.angleAroundMouse += crack.circlingSpeed;
            } else {
                this.ctx.moveTo(crack.x, crack.y);
                this.ctx.lineTo(crack.x + crack.dx * crack.currentLength, crack.y + crack.dy * crack.currentLength);
            }
            this.ctx.stroke();

            // Movement and influence
            if (crack.followMouse && this.mouseInWindow && !crack.circlingMouse) {
                const dx = this.mouseX - crack.x;
                const dy = this.mouseY - crack.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 250) {
                    if (distance < 40) {
                        crack.circlingMouse = true;
                        crack.radiusFromMouse = Math.random() * 30 + 15;
                        crack.angleAroundMouse = Math.atan2(crack.y - this.mouseY, crack.x - this.mouseX);
                    } else {
                        const influence = (250 - distance) / 1000;
                        crack.dx += dx * influence;
                        crack.dy += dy * influence;
                        const speed = Math.sqrt(crack.dx * crack.dx + crack.dy * crack.dy);
                        if (speed > 4) {
                            crack.dx = (crack.dx / speed) * 4;
                            crack.dy = (crack.dy / speed) * 4;
                        }
                    }
                }
            }

            if (!crack.circlingMouse) {
                crack.x += crack.dx;
                crack.y += crack.dy;
                crack.dx += (Math.random() - 0.5) * 0.1;
                crack.dy += (Math.random() - 0.5) * 0.1;
                const speed = Math.sqrt(crack.dx * crack.dx + crack.dy * crack.dy);
                if (speed < 0.5) { crack.dx *= 1.5; crack.dy *= 1.5; }
            }

            // Check boundaries
            if (!crack.circlingMouse) {
                const buffer = 50;
                if (crack.x < -buffer || crack.x > this.canvas.width + buffer ||
                    crack.y < -buffer || crack.y > this.canvas.height + buffer) {
                    cracksToRegenerate.push(index);
                    return;
                }
            }

             if (crack.circlingMouse && this.mouseInWindow) {
                const dx = crack.x - this.mouseX;
                const dy = crack.y - this.mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > crack.radiusFromMouse + 50) {
                    crack.circlingMouse = false;
                    crack.dx = dx / distance * 2;
                    crack.dy = dy / distance * 2;
                }
            }
        });

        cracksToRegenerate.forEach(index => {
            this.cracks[index] = this.createNewCrack();
        });

        if (this.opacity < 1) {
            this.opacity += 0.02;
            this.cracks.forEach(c => c.opacity = this.opacity);
        }
    },

    startCracking: function() {
        this.opacity = 0;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.cracks.forEach(c => { c.opacity = 0; c.currentLength = 0.72; });
        if (!window.crackInterval) {
            window.crackInterval = setInterval(() => this.drawCracks(), 33);
        }
    },

    tvStaticTransition: function() {
        // Assuming HTML has #static element. If not create it.
        let staticOverlay = document.getElementById("static");
        if (!staticOverlay) {
            staticOverlay = document.createElement('div');
            staticOverlay.id = 'static';
            staticOverlay.className = 'static-screen';
            document.body.appendChild(staticOverlay);
        }

        staticOverlay.style.opacity = "1";
        staticOverlay.style.animation = "none";

        // Ensure audio is playing
        const audio = document.getElementById('backgroundAudio');
        if (audio && audio.paused && window.hasInteracted) audio.play();

        this.staticTransitionCount++;

        // Using existing image container element as requested by user
        let keyImageElement = document.getElementById("imageContainer");
        if (keyImageElement) {
             keyImageElement.style.opacity = "0";
        }

        let flickerCount = 0;
        const maxFlickers = Math.floor(Math.random() * 6) + 5;
        const showKeyImageOnFlicker = Math.floor(Math.random() * maxFlickers);

        let flickerInterval = setInterval(() => {
            flickerCount++;

            if (flickerCount === showKeyImageOnFlicker) {
                 // Simplified check logic
                 staticOverlay.style.opacity = "0";
                 if (keyImageElement) keyImageElement.style.opacity = "1";
                 setTimeout(() => {
                     if (flickerCount < maxFlickers) {
                         if (keyImageElement) keyImageElement.style.opacity = "0";
                         staticOverlay.style.opacity = "1";
                     }
                 }, 200);
            } else {
                staticOverlay.style.opacity = staticOverlay.style.opacity === "1" ? "0" : "1";
                if (keyImageElement) keyImageElement.style.opacity = "0";
            }

            if (flickerCount >= maxFlickers) {
                clearInterval(flickerInterval);
                staticOverlay.style.opacity = "0";
                if (keyImageElement) keyImageElement.style.opacity = "0";

                if (this.staticTransitionCount >= 3) {
                    this.showSurvey();
                } else {
                    this.showNotEverythingIsAsItSeems();
                }
            }

        }, 100);
    },

    showNotEverythingIsAsItSeems: function() {
        document.body.style.backgroundColor = "white";
        this.inverted = true;
        document.body.style.color = "#001f3f";

        const wppLogo = document.getElementById("wpp-logo");
        if (wppLogo) wppLogo.src = "WPP-logo.png";

        // The content container in index.html is class "content", but script.js references "content" ID.
        // index.html: <div class="content">
        // I need to make sure we are targeting the right element.
        let contentElement = document.getElementById("content");
        if (!contentElement) contentElement = document.querySelector('.content');
        if (contentElement) {
            contentElement.innerHTML = '';
            // ... (Code to create elements as in script.js)
            // Shortened for brevity but keeping logic
            const h1 = document.createElement('h1'); h1.className='glitch-text fade-in-element'; h1.textContent='Everything is not as it seems'; h1.style.opacity='0';
            const h2 = document.createElement('h2'); h2.className='glitch-text fade-in-element'; h2.textContent='Some of you have guessed it... there is no training, instead you will be playing a game'; h2.style.opacity='0';
             const h3 = document.createElement('h2'); h3.className='glitch-text fade-in-element'; h3.textContent='Claudio will see you soon'; h3.style.opacity='0';
             const p = document.createElement('p'); p.className='glitch-text loading-text'; p.innerHTML='Please remain on the page - loading<span class="ellipsis">.</span>'; p.style.opacity='0';

             contentElement.appendChild(h1); contentElement.appendChild(h2); contentElement.appendChild(h3); contentElement.appendChild(p);

             this.startCountdown();

             // Animation sequence
             if (window.notEverythingShown) {
                 h1.style.opacity='1'; h2.style.opacity='1'; h3.style.opacity='1'; p.style.opacity='1';
                 this.animateEllipsis(p.querySelector('.ellipsis'));
             } else {
                 setTimeout(() => h1.style.opacity='1', 500);
                 setTimeout(() => h2.style.opacity='1', 2500);
                 setTimeout(() => h3.style.opacity='1', 4500);
                 setTimeout(() => { p.style.opacity='1'; this.animateEllipsis(p.querySelector('.ellipsis')); }, 6500);
                 window.notEverythingShown = true;
             }
        }

        document.getElementById("static").style.opacity = "0";

        if (this.staticTransitionCount < 3) {
            let nextEffectTime = Math.floor(Math.random() * (8000 - 2000 + 1)) + 2000;
            setTimeout(() => {
                this.cracks.forEach(c => c.opacity = 1);
                setTimeout(() => this.tvStaticTransition(), 1000);
            }, nextEffectTime);
        }
    },

    showSurvey: function() {
        if (window.ellipsisInterval) clearInterval(window.ellipsisInterval);
        let contentElement = document.querySelector('.content');
        if (contentElement) {
            contentElement.style.opacity = "0";
            setTimeout(() => {
                contentElement.innerHTML = `
                    <div class="survey-wrapper">
                        <h1 class="glitch-text survey-heading">Claudio needs help with a quick survey. Please fill in the below - zoom out or use a larger screen to avoid issues submitting:</h1>
                        <div class="survey-container">
                            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfWxhnc6D1mUzPOtiOdiG70yXaVOUCCWDfUZVtmW5vO7GpnpQ/viewform?embedded=true" width="620" height="500" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
                        </div>
                    </div>
                `;
                contentElement.style.opacity = "1";
                contentElement.style.overflow = "hidden";
                contentElement.style.maxHeight = "calc(100vh - 140px)";
                contentElement.style.display = "flex";
                contentElement.style.flexDirection = "column";
                contentElement.style.justifyContent = "center";
                contentElement.style.marginTop = "100px";
            }, 1000);
        }
    },

    startCountdown: function() {
         // Assuming countdown element exists or we create it
         let countdownElement = document.getElementById("countdown");
         if (!countdownElement) {
             countdownElement = document.createElement('div');
             countdownElement.id = 'countdown';
             countdownElement.className = 'countdown';
             document.body.appendChild(countdownElement);
         }

         countdownElement.style.opacity = "0";
         countdownElement.style.visibility = "visible";

         setTimeout(() => { countdownElement.style.opacity = "1"; }, 500);

         const updateCountdownText = () => {
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
         };

         updateCountdownText();
         setInterval(updateCountdownText, 1000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Home.init();
});
