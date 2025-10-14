// ===== WORLD PAGE FUNCTIONALITY =====
(function() {
    'use strict';
    
    // Local constants to avoid conflicts

// Get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Load world data from JSON
async function loadWorldData() {
    const worldSlug = getUrlParameter('world');
    
    if (!worldSlug) {
        showError('No world specified. Please select a world from the <a href="worlds.html">worlds page</a>.');
        return;
    }
    
    try {
        const worldsUrl = await window.domainConfig.getContentUrl('worlds.json');
        const response = await fetch(worldsUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const worlds = await response.json();
        
        // Find the world with matching slug
        const world = worlds.find(w => w.slug === worldSlug);
        
        if (!world) {
            showError(`World "${worldSlug}" not found. Please check the URL or visit the <a href="worlds.html">worlds page</a>.`);
            return;
        }
        
        populateWorldPage(world);
        
    } catch (error) {
        console.error('Error loading world data:', error);
        showError('Unable to load world data. Please try again later.');
    }
}

// Populate the world page with data
async function populateWorldPage(world) {
    // Update page title
    document.getElementById('page-title').textContent = `${world.name} - Eridan Games`;
    
    // Update hero section
    const worldBannerImage = document.getElementById('world-banner-image');
    const worldDescription = document.getElementById('world-description');
    const wikiLink = document.getElementById('wiki-link');
    
    // Set banner image
    const imagePath = world.image.startsWith('/') ? world.image : `content/images/${world.image}`;
    worldBannerImage.src = imagePath;
    worldBannerImage.alt = world.name;
    
    // Set description - use innerHTML to render any HTML content and convert newlines to breaks
    worldDescription.innerHTML = world.description.replace(/\n/g, '<br>');
    
    // Set wiki link if available
    if (world.wiki_url) {
        wikiLink.href = world.wiki_url;
        wikiLink.textContent = '📖 Dive Deeper into the Wiki';
        wikiLink.style.display = 'inline-block';
    } else {
        wikiLink.href = 'https://eridan-studios.github.io/eridan-wiki/';
        wikiLink.textContent = '📖 Dive Deeper into the Wiki';
        wikiLink.style.display = 'inline-block';
    }
    
    // Populate features cards
    populateFeaturesCards(world.gameplay_pillars || []);
    
    // Update games section
    const worldGamesTitle = document.getElementById('world-games-title');
    
    worldGamesTitle.textContent = `Games in ${world.name}`;
    
    // Load and populate games
    await populateWorldGames(world.games || []);
}

// Populate features carousel
function populateFeaturesCards(pillars) {
    const featuresTrack = document.getElementById('features-track');
    const featuresIndicators = document.getElementById('features-indicators');
    
    // Clear existing content
    featuresTrack.innerHTML = '';
    featuresIndicators.innerHTML = '';
    
    if (!pillars || pillars.length === 0) {
        // Hide the entire features section if no pillars
        document.querySelector('.world-features').style.display = 'none';
        return;
    }
    
    // Create feature slides
    pillars.forEach((pillar, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        if (index === 0) slide.classList.add('active');
        
        slide.innerHTML = `
            <div class="feature-content">
                <h3 class="feature-title">${pillar.title}</h3>
                <div class="feature-description">
                    ${pillar.text.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
                </div>
            </div>
        `;
        
        featuresTrack.appendChild(slide);
        
        // Create numbered indicator
        const indicator = document.createElement('button');
        indicator.className = 'carousel-indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.textContent = index + 1;
        indicator.setAttribute('aria-label', `Go to feature ${index + 1}`);
        
        featuresIndicators.appendChild(indicator);
    });
    
    // Initialize carousel
    initializeFeaturesCarousel();
}

// Initialize features carousel functionality
function initializeFeaturesCarousel() {
    const track = document.getElementById('features-track');
    const slides = track.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('#features-indicators .carousel-indicator');
    const prevBtn = document.getElementById('features-prev');
    const nextBtn = document.getElementById('features-next');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    if (totalSlides === 0) return;
    
    // Function to show specific slide with smooth transition
    function showSlide(index, direction = 'next') {
        if (index === currentIndex) return;
        
        const currentSlide = slides[currentIndex];
        const nextSlide = slides[index];
        
        // Add slide-out class to current slide
        if (direction === 'next') {
            currentSlide.classList.add('slide-out-left');
        } else {
            currentSlide.classList.add('slide-out-right');
        }
        
        // Remove active class from current slide
        currentSlide.classList.remove('active');
        
        // Position and show next slide
        if (direction === 'next') {
            nextSlide.classList.add('slide-in-right');
        } else {
            nextSlide.classList.add('slide-in-left');
        }
        
        // Update indicators
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        // Clean up classes after transition
        setTimeout(() => {
            currentSlide.classList.remove('slide-out-left', 'slide-out-right', 'active');
            nextSlide.classList.remove('slide-in-left', 'slide-in-right');
            nextSlide.classList.add('active');
        }, 500);
        
        currentIndex = index;
    }
    
    // Function to go to next slide
    function nextSlide() {
        const nextIndex = (currentIndex + 1) % totalSlides;
        showSlide(nextIndex, 'next');
    }
    
    // Function to go to previous slide
    function prevSlide() {
        const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        showSlide(prevIndex, 'prev');
    }
    
    // Add event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            const direction = index > currentIndex ? 'next' : 'prev';
            showSlide(index, direction);
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('.world-features').contains(document.activeElement) || 
            document.querySelector('.world-features').contains(e.target)) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        }
    });
}


// Populate world games
async function populateWorldGames(gameIds) {
    const worldGamesGrid = document.getElementById('world-games-grid');
    
    // Clear existing content
    worldGamesGrid.innerHTML = '';
    
    if (!gameIds || gameIds.length === 0) {
        worldGamesGrid.innerHTML = '<p>No games available for this world yet.</p>';
        return;
    }
    
    try {
        // Load games data
        const gamesUrl = await window.domainConfig.getContentUrl('games.json');
        const response = await fetch(gamesUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const games = await response.json();
        
        // Filter games that belong to this world
        const worldGames = games.filter(game => gameIds.includes(game.id));
        
        // Sort games by distribution order
        worldGames.sort((a, b) => (a.distributionOrder || 999) - (b.distributionOrder || 999));
        
        // Create game cards
        worldGames.forEach(game => {
            const gameCard = createGameCard(game);
            worldGamesGrid.appendChild(gameCard);
        });
        
    } catch (error) {
        console.error('Error loading games data:', error);
        worldGamesGrid.innerHTML = '<p>Unable to load games information.</p>';
    }
}

// Create a game card element
function createGameCard(game) {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card';
    
    const imagePath = game.image.startsWith('/') ? game.image : `content/images/${game.image}`;
    
    gameCard.innerHTML = `
        <div class="game-card-image">
            <img src="${imagePath}" alt="${game.title}">
            <div class="status-badge">${game.status || 'In Development'}</div>
        </div>
        <div class="game-card-content">
            <h3>${game.title}</h3>
            <p>${game.description}</p>
        </div>
        <a href="game.html?game=${game.slug}" class="game-card-cta">Learn More →</a>
    `;
    
    return gameCard;
}

// Show error message
function showError(message) {
    const worldHero = document.querySelector('.world-hero');
    const worldFeatures = document.querySelector('.world-features');
    const worldGames = document.querySelector('.world-games');
    
    // Hide other sections
    worldFeatures.style.display = 'none';
    worldGames.style.display = 'none';
    
    // Show error in hero section
    const worldDescription = document.getElementById('world-description');
    worldDescription.innerHTML = message;
    worldDescription.style.color = '#ff6b6b';
    worldDescription.style.textAlign = 'center';
    worldDescription.style.padding = '2rem';
    
    // Hide banner image
    document.getElementById('world-banner-image').style.display = 'none';
    document.getElementById('wiki-link').style.display = 'none';
}

// Load world data when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadWorldData();
});

})(); // End of IIFE
