// =====================================
// NAVBAR SCROLL & HAMBURGER MENU
// =====================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Sticky Navbar Background on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close Mobile Menu on Link Click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// =====================================
// HERO SLIDER ANIMATION
// =====================================
const heroSlider = document.querySelector('.hero-slider');
const allSlides = document.querySelectorAll('.slide');
const realSlides = document.querySelectorAll('.slide:not(.clone)');
const dots = document.querySelectorAll('.slider-dot');
let currentSlide = 0;
let slideIntervalTimer;
const slideInterval = 4000; // 4 seconds per slide auto-play
let isTransitioning = false;

function updateSlider(animate = true) {
    if (!heroSlider) return;
    if (animate) {
        heroSlider.style.transition = 'transform 0.8s ease-in-out';
        isTransitioning = true;

        // Listen for transition end to reset if needed
        heroSlider.addEventListener('transitionend', handleTransitionEnd, { once: true });
    } else {
        heroSlider.style.transition = 'none';
    }

    // 4 slides total = 25% per slide
    heroSlider.style.transform = `translateX(-${currentSlide * 25}%)`;

    // Update active dot based on current real slide
    dots.forEach(dot => dot.classList.remove('active'));
    // If currentSlide is the clone (last index), light up dot 0
    const activeDot = currentSlide === realSlides.length ? 0 : currentSlide;
    if (dots[activeDot]) {
        dots[activeDot].classList.add('active');
    }
}

function handleTransitionEnd() {
    isTransitioning = false;
    if (currentSlide === realSlides.length) {
        // We reached the clone, jump instantly to real first slide without animation
        currentSlide = 0;
        updateSlider(false);
    }
}

function nextSlide() {
    if (isTransitioning) return;
    currentSlide++;
    updateSlider(true);
}

// Start auto slider
function startSlider() {
    slideIntervalTimer = setInterval(nextSlide, slideInterval);
}

// Reset timer on manual interaction
function resetSliderTimer() {
    clearInterval(slideIntervalTimer);
    startSlider();
}

// Click event for navigation dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (isTransitioning) return;
        currentSlide = index;
        updateSlider(true);
        resetSliderTimer(); // pause/reset auto-sliding when user interacts
    });
});

if (heroSlider) {
    startSlider();
}


// =====================================
// STATS COUNTER ANIMATION
// =====================================
const counters = document.querySelectorAll('.counter');
const speed = 200; // The lower the slower

// Function to animate the counting
const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;

            // Calculate increment
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

// Intersection Observer to trigger counter animation when in view
const statsSection = document.querySelector('.stats-section');
let animated = false;

const observerOptions = {
    root: null,
    threshold: 0.5 // Trigger when 50% of the section is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
            animateCounters();
            animated = true; // Prevent running multiple times
        }
    });
}, observerOptions);

if (statsSection) {
    observer.observe(statsSection);
}

// =====================================
// SMOOTH SCROLLING FOR IN-PAGE LINKS
// =====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Adjust scroll position to account for sticky navbar
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// =====================================
// CONTACT FORM SUBMISSION TO WHATSAPP
// =====================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('contact-name').value;
        const phone = document.getElementById('contact-phone').value;
        const service = document.getElementById('contact-service').value;
        const msg = document.getElementById('contact-msg').value;

        // This is the number you provide for receiving inquiries
        const targetWhatsAppNumber = '919949750999'; // Adding country code for India assuming +91 based on phone number format

        const text = `Hello DaddyCars!\n\nNew Inquiry:\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${msg}`;
        const whatsappUrl = `https://wa.me/${targetWhatsAppNumber}?text=${encodeURIComponent(text)}`;

        // Direct redirect without alert
        window.open(whatsappUrl, '_blank');
        this.reset();
    });
}

// =====================================
// WASHING CARDS SLIDE-BY-SLIDE ANIMATION
// =====================================
const washSliders = document.querySelectorAll('.wash-slider');

washSliders.forEach((slider, index) => {
    const images = Array.from(slider.querySelectorAll('img'));
    const imageCount = images.length;

    // Only animate if there's more than 1 image
    if (imageCount > 1) {
        let currentSlide = 0;
        let isHovered = false;
        let isTransitioning = false;

        // Clone the first image and append to the end for seamless looping
        const firstClone = images[0].cloneNode(true);
        slider.appendChild(firstClone);

        // Pause on hover via JS to ensure clean transition stops
        slider.parentElement.addEventListener('mouseenter', () => isHovered = true);
        slider.parentElement.addEventListener('mouseleave', () => isHovered = false);

        // Handle when the slide finishes sliding into place
        slider.addEventListener('transitionend', () => {
            isTransitioning = false;
            // If we just slid into the cloned first image (the very end)
            if (currentSlide === imageCount) {
                // Instantly jump back to the actual first image without animation
                slider.style.transition = 'none';
                currentSlide = 0;
                slider.style.transform = `translateX(0)`;
            }
        });

        // Base delay 3000ms. Each subsequent card gets an extra 500ms offset
        const intervalTime = 3000 + (index * 500);

        setInterval(() => {
            if (!isHovered && !isTransitioning) {
                currentSlide++;
                isTransitioning = true;

                // Allow CSS transition to show sliding effect
                slider.style.transition = 'transform 0.8s ease-in-out';
                slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            }
        }, intervalTime);
    }
});

// =====================================
// CAR CARDS SLIDE-BY-SLIDE ANIMATION
// =====================================
const carSliders = document.querySelectorAll('.car-slider');

carSliders.forEach((slider, index) => {
    const images = Array.from(slider.querySelectorAll('img'));
    const imageCount = images.length;

    if (imageCount > 1) {
        let currentSlide = 0;
        let isHovered = false;
        let isTransitioning = false;

        const firstClone = images[0].cloneNode(true);
        slider.appendChild(firstClone);

        slider.parentElement.addEventListener('mouseenter', () => isHovered = true);
        slider.parentElement.addEventListener('mouseleave', () => isHovered = false);

        slider.addEventListener('transitionend', () => {
            isTransitioning = false;
            if (currentSlide === imageCount) {
                slider.style.transition = 'none';
                currentSlide = 0;
                slider.style.transform = `translateX(0)`;
            }
        });

        const intervalTime = 3500 + (index * 200);

        setInterval(() => {
            if (!isHovered && !isTransitioning) {
                currentSlide++;
                isTransitioning = true;
                slider.style.transition = 'transform 0.8s ease-in-out';
                slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            }
        }, intervalTime);
    }
});

// =====================================
// SERVICE CARDS VERTICAL SLIDE ANIMATION
// =====================================
const serviceBgSliders = document.querySelectorAll('.service-bg-slider');

serviceBgSliders.forEach((slider, index) => {
    const images = Array.from(slider.querySelectorAll('img'));
    const imageCount = images.length;

    if (imageCount > 1) {
        let currentSlide = 0;
        let isHovered = false;
        let isTransitioning = false;

        // Clone the first image for seamless vertical looping
        const firstClone = images[0].cloneNode(true);
        slider.appendChild(firstClone);

        // Pause on hover
        slider.parentElement.addEventListener('mouseenter', () => isHovered = true);
        slider.parentElement.addEventListener('mouseleave', () => isHovered = false);

        slider.addEventListener('transitionend', () => {
            isTransitioning = false;
            // If slid into the clone
            if (currentSlide === imageCount) {
                slider.style.transition = 'none';
                currentSlide = 0;
                slider.style.transform = `translateY(0)`; // Vertical reset
            }
        });

        // Different timings (e.g. 3.5s base + offset)
        const serviceInterval = 3500 + (index * 600);

        setInterval(() => {
            if (!isHovered && !isTransitioning) {
                currentSlide++;
                isTransitioning = true;

                // Bottom to top sliding
                slider.style.transition = 'transform 0.8s ease-in-out';
                slider.style.transform = `translateY(-${currentSlide * 100}%)`;
            }
        }, serviceInterval);
    }
});
// =====================================
// SELF DRIVE CATEGORY NAVIGATION
// =====================================
const clickableCards = document.querySelectorAll('.clickable-card');

if (clickableCards) {
    clickableCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // If the 'Book Now' button was clicked, don't trigger the card navigation
            if (e.target.classList.contains('btn-primary') || e.target.closest('.btn-primary')) {
                return;
            }

            const category = this.getAttribute('data-category');
            if (category) {
                // Navigate to the details page and scroll to the specific category section
                window.location.href = `self-drive-details.html#category-${category}`;
            }
        });
    });
}

// =====================================
// DYNAMIC NAVBAR HIGHLIGHTING (SCROLL SPY)
// =====================================
const sections = document.querySelectorAll('section[id], main[id]');
const navItems = document.querySelectorAll('.nav-link');

if (sections.length > 0 && navItems.length > 0) {
    const options = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${id}` || href.endsWith(`#${id}`)) {
                        navItems.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                });
            }
        });
    }, options);

    sections.forEach(section => observer.observe(section));
}
