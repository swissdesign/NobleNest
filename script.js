'use strict';

/** Created by P. Heiniger Design as a weird nerdy love letter to Andrina Schnyder *
 * Main script for the Noble Nests website.
 * This script handles all core interactive functionalities including mobile navigation,
 * a sticky header effect, and scroll-triggered animations.
 */
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Initializes all interactive components of the site.
     */
    function initApp() {
        initMobileNav();
        initScrollAnimations();

        // Check if GSAP and ScrollTrigger are loaded before initializing GSAP-based animations
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            initStickyHeaderWithGSAP();
            initPinnedScrollAnimation();
        } else {
            console.warn('GSAP or ScrollTrigger not loaded. Advanced animations disabled.');
            // Fallback to non-GSAP sticky header if needed
            initStickyHeader(); 
        }
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
            console.warn('Pinned scroll elements not found.');
            return;
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: pinContainer,
                pin: true,
                scrub: 1,
                start: "top top",
                end: "+=2000" // FIX: Changed to a more reasonable scroll length
            }
        });

        // Set initial state for all lines
        gsap.set(narrativeLines, { opacity: 0, y: 20 });

        narrativeLines.forEach((line, index) => {
            // Animate the line into view
            tl.to(line, { opacity: 1, y: 0, duration: 1 }, index * 0.8);
            
            // Hold it, then fade it out (unless it's the last one)
            if (index < narrativeLines.length - 1) {
                tl.to(line, { opacity: 0, y: -20, duration: 1 }, index * 0.8 + 0.8);
            }
        });
    }

    // Run the application
    initApp();

});


    // Run the application
    initApp();

});
