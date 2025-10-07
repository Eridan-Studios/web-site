// ===== WORLD PAGE FUNCTIONALITY =====
(function() {
    'use strict';
    
    // Local constants to avoid conflicts
    const WORLDS_JSON_URL = 'https://eridan-studios.github.io/web-site/content/worlds.json';
    const GAMES_JSON_URL = 'https://eridan-studios.github.io/web-site/content/games.json';

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
        console.log('Loading worlds from', WORLDS_JSON_URL);
        const response = await fetch(WORLDS_JSON_URL);
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
        
        console.log('World found:', world);
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
    
    // Set description - use innerHTML to render any HTML content
    worldDescription.innerHTML = world.description;
    
    // Set wiki link if available
    if (world.wiki_url && world.wiki_url !== 'wiki') {
        wikiLink.href = world.wiki_url;
        wikiLink.textContent = '📖 Dive Deeper into the Wiki';
    } else {
        wikiLink.style.display = 'none';
    }
    
    // Populate features cards
    populateFeaturesCards(world.gameplay_pillars || []);
    
    // Update games section
    const worldGamesTitle = document.getElementById('world-games-title');
    const worldGamesDescription = document.getElementById('world-games-description');
    
    worldGamesTitle.textContent = `Games in ${world.name}`;
    worldGamesDescription.textContent = `Journey through the ${world.name} universe. With each game, you'll explore a fresh narrative, revealing different story depths of the same universe.`;
    
    // Load and populate games
    await populateWorldGames(world.games || []);
}

// Populate features cards
function populateFeaturesCards(pillars) {
    const featuresGrid = document.getElementById('features-grid');
    
    // Clear existing content
    featuresGrid.innerHTML = '';
    
    if (!pillars || pillars.length === 0) {
        // Hide the entire features section if no pillars
        document.querySelector('.world-features').style.display = 'none';
        return;
    }
    
    // Create feature cards
    pillars.forEach((pillar, index) => {
        const card = document.createElement('div');
        card.className = 'feature-card';
        
        card.innerHTML = `
            <div class="feature-icon">${index + 1}</div>
            <h3>${pillar.title}</h3>
            <div class="feature-content">
                ${pillar.text.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
            </div>
        `;
        
        featuresGrid.appendChild(card);
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
        const response = await fetch(GAMES_JSON_URL);
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
        <a href="#" class="game-card-cta">Learn More →</a>
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

// ===== MOBILE NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinkItems = navLinks.querySelectorAll('a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
    
    // Load world data when DOM is ready
    console.log('DOM loaded, starting world loading...');
    console.log('Current URL:', window.location.href);
    loadWorldData();
});

})(); // End of IIFE
