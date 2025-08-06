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
            initVideoScrub(); // ADDED: Initialize the new video scrub effect
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
            // This is not an error, the element just might not be on the current page.
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
     * NEW: Creates the scroll-controlled video playback effect for property heroes.
     */
    function initVideoScrub() {
        const videos = document.querySelectorAll('.property-video');
        if (videos.length === 0) {
            // Not an error, just means we are not on the residenzen.html page
            return;
        }

        videos.forEach(video => {
            const videoContainer = video.closest('.property-video-hero');
            if (!videoContainer) return;

            video.pause();

            // Use a GSAP timeline to link scroll position to video playback time
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: videoContainer,
                    scrub: true,
                    start: "top top",
                    end: "bottom top" // The video will play through its full duration as you scroll from the top to the bottom of the container
                },
                defaults: { ease: "none" }
            });

            // Once the video metadata is loaded, we know its duration
            video.onloadedmetadata = function() {
                // Animate the video's currentTime property from 0 to its full duration
                tl.to(video, { currentTime: video.duration });
            };
        });
    }

    // Run the application
    initApp();

});

