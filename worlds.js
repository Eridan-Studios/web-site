// ===== WORLDS PAGE FUNCTIONALITY =====
const WORLDS_JSON_URL = 'https://eridan-studios.github.io/web-site/content/worlds.json';

// Load worlds data from JSON
async function loadWorlds() {
    const worldsGrid = document.getElementById('worlds-grid');
    
    if (!worldsGrid) {
        console.error('Worlds grid element not found');
        return;
    }
    
    try {
        console.log('Loading worlds from', WORLDS_JSON_URL);
        const response = await fetch(WORLDS_JSON_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const worlds = await response.json();
        console.log('Worlds loaded successfully:', worlds);
        populateWorldsGrid(worlds);
    } catch (error) {
        console.error('Error loading worlds:', error);
        // Fallback: show error message or placeholder content
        worldsGrid.innerHTML = '<p>Unable to load worlds. Please try again later.</p>';
    }
}

// Populate the worlds grid with data from JSON
function populateWorldsGrid(worlds) {
    const worldsGrid = document.getElementById('worlds-grid');
    const worldCardTemplate = document.getElementById('world-card-template-worlds');
    
    if (!worldsGrid || !worldCardTemplate) {
        console.error('Required elements not found:', { worldsGrid, worldCardTemplate });
        return;
    }
    
    // Clear existing content
    worldsGrid.innerHTML = '';
    
    // Sort worlds alphabetically by name
    const sortedWorlds = sortWorldsByName(worlds);
    
    sortedWorlds.forEach(world => {
        const worldCard = createWorldCard(world, worldCardTemplate);
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
function createWorldCard(world, template) {
    // Clone the template
    const worldCard = template.content.cloneNode(true);
    
    // Get elements from the cloned template
    const cardImage = worldCard.querySelector('.world-card-image img');
    const cardTitle = worldCard.querySelector('.world-card-content h3');
    const cardDescription = worldCard.querySelector('.world-card-content p');
    const gamesGrid = worldCard.querySelector('.world-card-games-grid');
    const cardFooter = worldCard.querySelector('.world-card-footer');
    
    // Set image source and alt text
    const imagePath = world.image.startsWith('/') ? world.image : `content/images/${world.image}`;
    cardImage.src = imagePath;
    cardImage.alt = world.name;
    
    // Set title
    cardTitle.textContent = world.name;
    
    // Set description (use tagline if available, otherwise fall back to description)
    // Use innerHTML to render any HTML content in the description and convert newlines to breaks
    const descriptionText = world.tagline || world.description;
    cardDescription.innerHTML = descriptionText.replace(/\n/g, '<br>');
    cardDescription.classList.add('mb-1-5');
    
    // Populate games grid
    populateWorldGamesGrid(gamesGrid, world.games || []);
    
    // Set footer link to world.html with world slug parameter
    cardFooter.onclick = () => {
        window.location.href = `world.html?world=${world.slug}`;
    };

    return worldCard;
}

// Populate games grid within a world card
async function populateWorldGamesGrid(gamesGrid, gameIds) {
    // Clear existing content
    gamesGrid.innerHTML = '';
    
    if (!gameIds || gameIds.length === 0) {
        return;
    }
    
    try {
        // Load games data to get full game information
        const games = await loadGamesData();
        
        // Filter games that belong to this world
        const worldGames = games.filter(game => gameIds.includes(game.id));
        
        // Sort games by distribution order
        worldGames.sort((a, b) => (a.distributionOrder || 999) - (b.distributionOrder || 999));
        
        // Create game items
        worldGames.forEach(game => {
            const gameItem = document.createElement('a');
            gameItem.className = 'world-game-item';
            gameItem.href = `game.html?game=${game.slug}`;
            
            const gameImage = document.createElement('div');
            gameImage.className = 'world-game-image';
            
            const img = document.createElement('img');
            const imagePath = game.image.startsWith('/') ? game.image : `content/images/${game.image}`;
            img.src = imagePath;
            img.alt = game.title;
            
            const gameTitle = document.createElement('div');
            gameTitle.className = 'world-game-title';
            gameTitle.textContent = game.title;
            
            gameImage.appendChild(img);
            gameItem.appendChild(gameImage);
            gameItem.appendChild(gameTitle);
            
            gamesGrid.appendChild(gameItem);
        });
    } catch (error) {
        console.error('Error loading games data for world:', error);
    }
}

// Load games data from JSON
async function loadGamesData() {
    try {
        const response = await fetch('https://eridan-studios.github.io/web-site/content/games.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading games data:', error);
        return [];
    }
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
});

// Initialize worlds grid when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting worlds loading...');
    console.log('Current URL:', window.location.href);
    loadWorlds();
});
