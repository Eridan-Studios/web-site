// ===== CAROUSEL =====
const CAROUSEL_JSON_URL = 'content/carousel.json';
let track, slides, nextBtn, prevBtn, indicators;
let currentSlide = 0;
let totalSlides = 0;
let autoplayInterval;

// Load carousel images from JSON
async function loadCarouselImages() {
    try {
        const response = await fetch(CAROUSEL_JSON_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const images = await response.json();
        populateCarousel(images);
    } catch (error) {
        console.error('Error loading carousel images:', error);
        // Fallback: use default images
        const fallbackImages = [
            'https://eridangames.com/Maro1.png',
            'https://eridangames.com/Liguni.Zelen.png',
            'https://eridangames.com/Dindra.Zemlja.png'
        ];
        populateCarousel(fallbackImages);
    }
}

// Populate carousel with images
function populateCarousel(images) {
    track = document.getElementById('carousel-track');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    
    // Clear existing content
    track.innerHTML = '';
    indicatorsContainer.innerHTML = '';
    
    // Create slides
    images.forEach((imageSrc, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        
        const img = document.createElement('img');
        // Check if it's a local image or external URL
        if (imageSrc.startsWith('http')) {
            img.src = imageSrc;
        } else {
            img.src = `content/images/${imageSrc}`;
        }
        img.alt = `Carousel Image ${index + 1}`;
        
        slide.appendChild(img);
        track.appendChild(slide);
        
        // Create indicator
        const indicator = document.createElement('span');
        indicator.className = 'carousel-indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.setAttribute('data-slide', index);
        indicatorsContainer.appendChild(indicator);
    });
    
    // Re-initialize carousel elements
    slides = Array.from(track.children);
    nextBtn = document.querySelector('.carousel-btn.next');
    prevBtn = document.querySelector('.carousel-btn.prev');
    indicators = Array.from(document.querySelectorAll('.carousel-indicator'));
    totalSlides = slides.length;
    
    // Set up event listeners
    setupCarouselEvents();
    
    // Initialize carousel
    updateCarousel(0);
    startAutoplay();
}

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

function setupCarouselEvents() {
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
}

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

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', loadCarouselImages);

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

// ===== GAMES GALLERY =====
const GAMES_JSON_URL = 'https://eridan-studios.github.io/web-site/content/games.json';
const gamesGallery = document.getElementById('games-gallery');
const gameCardTemplate = document.getElementById('game-card-template');

// Fetch games data and populate gallery
async function loadGames() {
    try {
        const response = await fetch(GAMES_JSON_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const games = await response.json();
        populateGamesGallery(games);
    } catch (error) {
        console.error('Error loading games:', error);
        // Fallback: show error message or placeholder content
        gamesGallery.innerHTML = '<p>Unable to load games. Please try again later.</p>';
    }
}

// Populate the games gallery with data from JSON
function populateGamesGallery(games) {
    // Clear existing content
    gamesGallery.innerHTML = '';
    
    // Sort games by distribution order
    const sortedGames = sortGamesByDistributionOrder(games);
    
    sortedGames.forEach(game => {
        const gameCard = createGameCard(game);
        gamesGallery.appendChild(gameCard);
    });
}

// Sort games by distribution order
function sortGamesByDistributionOrder(games) {
    return games.sort((a, b) => {
        const orderA = a.distributionOrder || 999; // Games without order go last
        const orderB = b.distributionOrder || 999;
        
        // Sort by distribution order
        return orderA - orderB;
    });
}

// Create a game card element from game data
function createGameCard(game) {
    // Clone the template
    const gameCard = gameCardTemplate.content.cloneNode(true);
    
    // Get elements from the cloned template
    const cardLink = gameCard.querySelector('.game-card');
    const cardImage = gameCard.querySelector('.game-card-image img');
    const statusBadge = gameCard.querySelector('.status-badge');
    const cardTitle = gameCard.querySelector('.game-card-content h3');
    const cardDescription = gameCard.querySelector('.game-card-content p');
    const tagsContainer = gameCard.querySelector('.game-tags');
    const galleryContainer = gameCard.querySelector('.game-gallery');
    
    // Set card link (you can customize this URL structure)
    cardLink.href = `#game-${game.slug}`;
    
    // Set image source and alt text
    const imagePath = game.image.startsWith('/') ? game.image : `content/images/${game.image}`;
    cardImage.src = imagePath;
    cardImage.alt = game.title;
    
    // Set status badge
    statusBadge.textContent = game.status;
    
    // Set title and description
    cardTitle.textContent = game.title;
    cardDescription.textContent = game.shortDescription;
    
    // Create and add genre tags
    tagsContainer.innerHTML = '';
    if (game.genre && Array.isArray(game.genre)) {
        game.genre.slice(0, 3).forEach(genre => { // Limit to 3 tags for display
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = genre;
            tagsContainer.appendChild(tag);
        });
    }
    
    // Populate gallery if it exists
    if (game.gallery && Array.isArray(game.gallery) && game.gallery.length > 0) {
        populateGameGallery(galleryContainer, game.gallery, game.title);
    }
    
    return gameCard;
}

// Populate gallery container with images
function populateGameGallery(galleryContainer, galleryImages, gameTitle) {
    galleryContainer.innerHTML = '';
    
    // Filter out placeholder images that don't exist
    const validImages = galleryImages.filter(imagePath => {
        // Skip placeholder images
        return !imagePath.includes('placeholder.svg') && !imagePath.includes('placeholder.jpg');
    });
    
    // If no valid images, don't populate the gallery
    if (validImages.length === 0) {
        return;
    }
    
    validImages.forEach((imagePath, index) => {
        const galleryImage = document.createElement('img');
        const fullImagePath = imagePath.startsWith('/') ? imagePath : `content/images${imagePath}`;
        galleryImage.src = fullImagePath;
        galleryImage.alt = `${gameTitle} - Gallery Image ${index + 1}`;
        galleryImage.className = 'gallery-image';
        
        // Handle image load errors
        galleryImage.onerror = () => {
            console.warn(`Failed to load gallery image: ${fullImagePath}`);
            galleryImage.style.display = 'none';
        };
        
        galleryContainer.appendChild(galleryImage);
    });
    
    // Add gallery navigation functionality
    addGalleryNavigation(galleryContainer);
}

// Add gallery navigation functionality
function addGalleryNavigation(galleryContainer) {
    const images = galleryContainer.querySelectorAll('.gallery-image');
    if (images.length <= 1) return;
    
    let currentImageIndex = 0;
    
    // Show only the first image initially
    images.forEach((img, index) => {
        img.style.display = index === 0 ? 'block' : 'none';
    });
    
    // Add navigation arrows
    const prevArrow = document.createElement('div');
    prevArrow.className = 'gallery-nav gallery-prev';
    prevArrow.innerHTML = '‹';
    prevArrow.style.display = 'none';
    
    const nextArrow = document.createElement('div');
    nextArrow.className = 'gallery-nav gallery-next';
    nextArrow.innerHTML = '›';
    nextArrow.style.display = 'none';
    
    galleryContainer.appendChild(prevArrow);
    galleryContainer.appendChild(nextArrow);
    
    // Navigation functions
    function showImage(index) {
        images.forEach((img, i) => {
            img.style.display = i === index ? 'block' : 'none';
        });
        prevArrow.style.display = index > 0 ? 'block' : 'none';
        nextArrow.style.display = index < images.length - 1 ? 'block' : 'none';
    }
    
    function nextImage() {
        if (currentImageIndex < images.length - 1) {
            currentImageIndex++;
            showImage(currentImageIndex);
        }
    }
    
    function prevImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            showImage(currentImageIndex);
        }
    }
    
    // Event listeners
    nextArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });
    
    prevArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });
    
    // Auto-advance gallery on hover
    let galleryInterval;
    const gameCard = galleryContainer.closest('.game-card');
    
    gameCard.addEventListener('mouseenter', () => {
        if (images.length > 1) {
            galleryInterval = setInterval(nextImage, 2000); // Change image every 2 seconds
        }
    });
    
    gameCard.addEventListener('mouseleave', () => {
        if (galleryInterval) {
            clearInterval(galleryInterval);
            currentImageIndex = 0; // Reset to first image
            showImage(currentImageIndex);
        }
    });
}

// Initialize games gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', loadGames);

// ===== WORLDS GALLERY =====
const WORLDS_JSON_URL = 'https://eridan-studios.github.io/web-site/content/worlds.json';
const worldsGrid = document.getElementById('worlds-grid');
const worldCardTemplate = document.getElementById('world-card-template');

// Fetch worlds data and populate gallery
async function loadWorlds() {
    try {
        const response = await fetch(WORLDS_JSON_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const worlds = await response.json();
        populateWorldsGrid(worlds);
    } catch (error) {
        console.error('Error loading worlds:', error);
        // Fallback: show error message or placeholder content
        worldsGrid.innerHTML = '<p>Unable to load worlds. Please try again later.</p>';
    }
}

// Populate the worlds grid with data from JSON
function populateWorldsGrid(worlds) {
    // Clear existing content
    worldsGrid.innerHTML = '';
    
    // Sort worlds alphabetically by name
    const sortedWorlds = sortWorldsByName(worlds);
    
    sortedWorlds.forEach(world => {
        const worldCard = createWorldCard(world);
        worldsGrid.appendChild(worldCard);
    });
}

// Sort worlds by world priority, then alphabetically by name within each world
function sortWorldsByName(worlds) {
    const worldPriority = {
        'the-age-of-rika': 1,
        'haven-world': 2,
        'atomic-horizon': 3
    };
    
    return worlds.sort((a, b) => {
        const priorityA = worldPriority[a.id] || 999; // Unknown worlds go last
        const priorityB = worldPriority[b.id] || 999;
        
        // First sort by world priority
        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }
        
        // If same world priority, sort alphabetically by name
        return a.name.localeCompare(b.name);
    });
}

// Create a world card element from world data
function createWorldCard(world) {
    // Clone the template
    const worldCard = worldCardTemplate.content.cloneNode(true);
    
    // Get elements from the cloned template
    const cardImage = worldCard.querySelector('.world-card-image img');
    const cardTitle = worldCard.querySelector('.world-card-content h3');
    const gamesCount = worldCard.querySelector('.games-count');
    const cardDescription = worldCard.querySelector('.world-card-content p');
    const cardFooter = worldCard.querySelector('.world-card-footer');
    
    // Set image source and alt text
    const imagePath = world.image.startsWith('/') ? world.image : `content/images/${world.image}`;
    cardImage.src = imagePath;
    cardImage.alt = world.name;
    
    // Set title
    cardTitle.textContent = world.name;
    
    // Set games count
    const gameCount = world.games ? world.games.length : 0;
    gamesCount.textContent = `🎮 ${gameCount} game${gameCount !== 1 ? 's' : ''}`;
    
    // Set description (use tagline if available, otherwise fall back to description)
    cardDescription.textContent = world.tagline || world.description;
    
    // Set footer link (you can customize this URL structure)
    cardFooter.onclick = () => {
        window.location.href = `#world-${world.slug}`;
    };
    
    return worldCard;
}

// Initialize worlds grid when DOM is loaded
document.addEventListener('DOMContentLoaded', loadWorlds);
