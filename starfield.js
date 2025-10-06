// ===== STARFIELD =====
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let stars = [];
let animationFrameId;

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
}

// Star class
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 1.5;
        this.opacity = Math.random();
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.velocityX = (Math.random() - 0.5) * 0.1;
        this.velocityY = (Math.random() - 0.5) * 0.1;
        this.maxOpacity = Math.random() * 0.5 + 0.5;
        this.minOpacity = Math.random() * 0.2;
    }

    update() {
        // Twinkle effect
        this.opacity += this.twinkleSpeed;
        if (this.opacity > this.maxOpacity || this.opacity < this.minOpacity) {
            this.twinkleSpeed *= -1;
        }

        // Subtle movement
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow for larger stars
        if (this.radius > 1) {
            ctx.globalAlpha = this.opacity * 0.3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Initialize stars
function initStars() {
    stars = [];
    // Adjust star count based on screen size
    const starCount = Math.floor((canvas.width * canvas.height) / 3000);
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    
    animationFrameId = requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
    cancelAnimationFrame(animationFrameId);
    resizeCanvas();
    animate();
});

// Initialize
resizeCanvas();
animate();
