'use strict';

/** Created by P. Heiniger Design as a weird nerdy love letter to Andrina Schnyder *
 * Main script for the Noble Nests website.
 * This script handles all core interactive functionalities including the loading animation,
 * the header logo hover animation, mobile navigation, a sticky header, and scroll-triggered animations.
 */
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Initializes all interactive components of the site.
     */
    function initApp() {
        // Run the new loader first
        initLoader();
        
        // Initialize existing components
        initMobileNav();
        initScrollAnimations();

        // Check if GSAP and ScrollTrigger are loaded before initializing GSAP-based animations
        if (typeof gsap !== 'undefined') {
            // Initialize the new header logo hover animation
            initHeaderLogoAnimation();
            
            // Check for ScrollTrigger specifically for scroll-based animations
            if (typeof ScrollTrigger !== 'undefined') {
                 gsap.registerPlugin(ScrollTrigger);
                 initStickyHeaderWithGSAP();
                 initPinnedScrollAnimation();
                 initVideoScrubAndOverlay(); // For residenzen.html
            } else {
                console.warn('ScrollTrigger not loaded. Scroll-based animations disabled.');
                initStickyHeader(); // Fallback for sticky header
            }
        } else {
            console.warn('GSAP not loaded. All advanced animations disabled.');
            initStickyHeader(); 
        }
    }

    /**
     * --- NEW: Initializes and controls the loading animation ---
     */
    function initLoader() {
        const loader = document.querySelector('#loader');
        if (!loader) return;

        document.body.classList.add('loading');

        const slideDistance = 1800;
        gsap.set("#endLogoLoader", { opacity: 0 });
        gsap.set("#startNsLoader", { transformOrigin: "50% 50%" });

        const loadingTl = gsap.timeline({
            defaults: { ease: "power2.inOut", duration: 0.8 },
            onComplete: () => {
                // When the timeline completes, hide the loader and show the site
                document.body.classList.add('loaded');
                document.body.classList.remove('loading');
            }
        });

        loadingTl.to(["#N_left_loader", "#N_right_loader"], {
            x: (i, t) => (t.id === 'N_left_loader' ? -slideDistance : slideDistance),
            opacity: 0
        }, 0)
        .to("#endLogoLoader", { opacity: 1 }, 0.2)
        .to("#endLogoLoader", { opacity: 0 }, "+=1.5")
        .to(["#N_left_loader", "#N_right_loader"], { x: 0, opacity: 1 }, "<0.2")
        .to("#startNsLoader", { rotation: "+=180" });
        
        // --- FIX: Start the animation ---
        loadingTl.play();
    }

    /**
     * --- NEW: Initializes the hover animation for the header SVG logo ---
     */
    function initHeaderLogoAnimation() {
        const headerLogo = document.querySelector("#headerLogo");
        if (!headerLogo) return;
        
        const slideDistance = 1800;

        const tl = gsap.timeline({
            paused: true,
            defaults: { duration: 0.7, ease: "power2.inOut" }
        });

        gsap.set("#endLogoHeader", { opacity: 0 });

        tl.to(["#N_left_header", "#N_right_header"], {
            x: (index, target) => (target.id === 'N_left_header' ? -slideDistance : slideDistance),
            opacity: 0,
        }, 0);

        tl.to("#endLogoHeader", {
            opacity: 1
        }, 0.2);

        headerLogo.addEventListener("mouseenter", () => tl.play());
        headerLogo.addEventListener("mouseleave", () => tl.reverse());
    }


    /**
     * Sets up the mobile navigation toggle functionality.
     */
    function initMobileNav() {
        const navToggle = document.querySelector('.mobile-nav-toggle');
        const mainNav = document.querySelector('.main-nav');

        if (!navToggle || !mainNav) {
            console.warn('Mobile navigation elements not found.');
            return;
        }

        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('is-open');
            mainNav.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll');
        });
    }

    /**
     * Handles the sticky header effect using GSAP's ScrollTrigger for better performance.
     */
    function initStickyHeaderWithGSAP() {
        const header = document.querySelector('.main-header');
        if (!header) {
            console.warn('Header element not found.');
            return;
        }

        ScrollTrigger.create({
            start: "top top-=" + (header.offsetHeight + 10), // Triggers after scrolling a bit past the header height
            onEnter: () => header.classList.add('scrolled'),
            onLeaveBack: () => header.classList.remove('scrolled')
        });
    }
    
    /**
     * Fallback sticky header for when GSAP is not available.
     */
    function initStickyHeader() {
        const header = document.querySelector('.main-header');
        const scrollThreshold = 50; 

        if (!header) {
            console.warn('Header element not found.');
            return;
        }

        let isScrolled = false;

        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold && !isScrolled) {
                header.classList.add('scrolled');
                isScrolled = true;
            } else if (window.scrollY <= scrollThreshold && isScrolled) {
                header.classList.remove('scrolled');
                isScrolled = false;
            }
        }, { passive: true });
    }


    /**
     * Initializes scroll-triggered fade-in animations using the IntersectionObserver API.
     */
    function initScrollAnimations() {
        const elementsToAnimate = document.querySelectorAll('.fade-in-on-scroll');

        if (elementsToAnimate.length === 0) {
            return; // No elements to observe
        }

        const observerOptions = {
            root: null, 
            rootMargin: '0px 0px -100px 0px', 
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }

    /**
     * Creates the pinned scroll narrative for the "Offer" section using GSAP.
     */
    function initPinnedScrollAnimation() {
        const pinContainer = document.querySelector('#pin-container');
        const narrativeLines = gsap.utils.toArray('.narrative-line');

        if (!pinContainer || narrativeLines.length === 0) {
            return;
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: pinContainer,
                pin: true,
                scrub: 1,
                start: "top top",
                end: `+=${narrativeLines.length * 100}%`
            }
        });

        narrativeLines.forEach((line, index) => {
            tl.to(line, { opacity: 1, duration: 1 }, index);
            if (index < narrativeLines.length - 1) {
                tl.to(line, { opacity: 0, duration: 1 }, index + 0.8);
            }
        });
    }

    /**
     * Creates the scroll-controlled video playback and text overlay effect.
     */
    function initVideoScrubAndOverlay() {
        const propertyItems = document.querySelectorAll('.property-item');
        if (propertyItems.length === 0) return;

        propertyItems.forEach(item => {
            const video = item.querySelector('.property-video');
            const videoContainer = item.querySelector('.property-video-hero');
            const textOverlay = item.querySelector('.property-header-overlay');

            if (!video || !videoContainer || !textOverlay) return;

            video.pause();

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: videoContainer,
                    scrub: 1,
                    pin: true, 
                    start: "top top",
                    end: "bottom+=100% top" 
                },
                defaults: { ease: "none" }
            });

            video.onloadedmetadata = function() {
                tl.to(video, { currentTime: video.duration });
            };
            
            tl.to(textOverlay, { opacity: 0 }, 0);
        });
    }

    // Run the application
    initApp();

});

