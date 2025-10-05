// ===== CAROUSEL =====
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextBtn = document.querySelector('.carousel-btn.next');
const prevBtn = document.querySelector('.carousel-btn.prev');
const indicators = Array.from(document.querySelectorAll('.carousel-indicator'));

let currentSlide = 0;
const totalSlides = slides.length;
let autoplayInterval;

function updateCarousel(index) {
    slides.forEach((slide, i) => {
        // Remove all position classes
        slide.classList.remove('active', 'prev', 'next', 'hidden');
        
        // Calculate position relative to current slide
        const position = (i - index + totalSlides) % totalSlides;
        
        if (position === 0) {
            slide.classList.add('active');
        } else if (position === totalSlides - 1) {
            slide.classList.add('prev');
        } else if (position === 1) {
            slide.classList.add('next');
        } else {
            slide.classList.add('hidden');
        }
    });
    
    // Update indicators
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
    
    currentSlide = index;
}

function nextSlide() {
    const next = (currentSlide + 1) % totalSlides;
    updateCarousel(next);
}

function prevSlide() {
    const prev = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel(prev);
}

// Button controls
nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
});

// Click on side slides to navigate
slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
        if (!slide.classList.contains('active')) {
            updateCarousel(index);
            resetAutoplay();
        }
    });
});

// Indicator controls
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        updateCarousel(index);
        resetAutoplay();
    });
});

// Autoplay
function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
}

function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoplay();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoplay();
    }
});

// Initialize carousel
updateCarousel(0);
startAutoplay();

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
