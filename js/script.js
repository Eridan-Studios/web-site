
// ===== MOBILE NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    // No overlay - using CSS effects instead
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.classList.toggle('menu-open');
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        body.classList.remove('menu-open');
    }
    
    // Event listeners
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking on nav links
    navLinks.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking outside navigation
    document.addEventListener('click', function(e) {
        // Check if menu is open
        if (navLinks.classList.contains('active')) {
            // Check if click is outside navigation area
            const nav = document.querySelector('nav');
            if (!nav.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close menu on window resize (if resizing to desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});