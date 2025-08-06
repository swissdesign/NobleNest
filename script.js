'use strict';

/** Created by P. Heiniger Design as a weird nerdy love letter to Andrina Schnyder *
 * Main script for the Noble Nests website.
 * This script handles all core interactive functionalities including mobile navigation,
 * a sticky header effect, and scroll-triggered animations.
 * It is written in vanilla JavaScript, following modern best practices for performance and readability.
 */
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Initializes all interactive components of the site.
     */
    function initApp() {
        initMobileNav();
        initStickyHeader();
        initScrollAnimations();
    }

    /**
     * Sets up the mobile navigation toggle functionality.
     * Toggles the '.is-open' class for the menu and hamburger icon.
     * Prevents background scrolling when the menu is open.
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
     * Handles the sticky header effect.
     * Adds a '.scrolled' class to the header when the user scrolls past a certain threshold.
     * This function is designed to be lightweight.
     */
    function initStickyHeader() {
        const header = document.querySelector('.main-header');
        const scrollThreshold = 50; // Pixels to scroll before the header becomes "sticky"

        if (!header) {
            console.warn('Header element not found.');
            return;
        }

        // A simple flag to avoid unnecessary DOM manipulation
        let isScrolled = false;

        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold && !isScrolled) {
                header.classList.add('scrolled');
                isScrolled = true;
            } else if (window.scrollY <= scrollThreshold && isScrolled) {
                header.classList.remove('scrolled');
                isScrolled = false;
            }
        }, { passive: true }); // Use passive listener for better scroll performance
    }

    /**
     * Initializes scroll-triggered fade-in animations using the IntersectionObserver API.
     * This is a highly performant method compared to using scroll event listeners.
     */
    function initScrollAnimations() {
        const elementsToAnimate = document.querySelectorAll('.fade-in-on-scroll');

        if (elementsToAnimate.length === 0) {
            return; // No elements to observe
        }

        const observerOptions = {
            root: null, // observes intersections relative to the viewport
            rootMargin: '0px 0px -100px 0px', // triggers animation a bit before the element is fully in view
            threshold: 0.1 // triggers when 10% of the element is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // When the element is intersecting the viewport
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Stop observing the element once it has been animated to save resources
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Start observing each of the target elements
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }

    // Run the application
    initApp();

});
