/* ============================================
   POLYMATHICS — Main JavaScript
   ============================================ */

import { initLayout } from './layout.js';

// ---------- DOM Ready ----------
document.addEventListener('DOMContentLoaded', () => {
    initLayout();
    initScrollAnimations();
    initNavbar();
    initMobileMenu();
    initMegaMenu();
    initSmoothScroll();
    initCounters();
    initCalculator();
    initCalendly();
    initContactForm();
});

// ---------- Contact Form (mailto compose, no backend required) ----------
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const note = document.getElementById('contactFormNote');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            note.textContent = 'Please fill in your name, a valid email, and a message.';
            note.className = 'form-note is-error';
            form.reportValidity();
            return;
        }

        const data = new FormData(form);
        const name = data.get('name');
        const email = data.get('email');
        const practice = data.get('practice') || 'N/A';
        const message = data.get('message');

        const subject = `New inquiry from ${name}${practice !== 'N/A' ? ` (${practice})` : ''}`;
        const body = `Name: ${name}\nEmail: ${email}\nPractice: ${practice}\n\n${message}`;
        window.location.href = `mailto:dagfarias@polymathicsai.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        note.textContent = 'Opening your email client… if nothing happens, email us directly at dagfarias@polymathicsai.com.';
        note.className = 'form-note is-success';
    });
}

// ---------- Scroll Animations (Intersection Observer) ----------
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        }
    );
    elements.forEach((el) => observer.observe(el));
}

// ---------- Navbar Scroll Effect ----------
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 60) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ---------- Mobile Menu ----------
function initMobileMenu() {
    const hamburger = document.getElementById('navHamburger');
    const navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
        if (!open) closeAllMega();
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
            closeAllMega();
        });
    });
}

// ---------- Mega Menu (desktop hover + mobile accordion + a11y) ----------
function initMegaMenu() {
    const items = document.querySelectorAll('.nav-item.has-mega');
    if (!items.length) return;

    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
    let hoverTimeout;

    items.forEach((item) => {
        const trigger = item.querySelector('.nav-trigger');
        if (!trigger) return;

        const open = () => {
            items.forEach((other) => {
                if (other !== item) {
                    other.classList.remove('is-open');
                    const otherTrigger = other.querySelector('.nav-trigger');
                    if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                }
            });
            item.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
        };

        const close = () => {
            item.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
        };

        item.addEventListener('mouseenter', () => {
            if (isMobile()) return;
            clearTimeout(hoverTimeout);
            open();
        });

        item.addEventListener('mouseleave', () => {
            if (isMobile()) return;
            hoverTimeout = setTimeout(close, 150);
        });

        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            if (item.classList.contains('is-open')) {
                close();
            } else {
                open();
            }
        });

        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item.has-mega')) closeAllMega();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllMega();
    });
}

function closeAllMega() {
    document.querySelectorAll('.nav-item.has-mega').forEach((item) => {
        item.classList.remove('is-open');
        const trigger = item.querySelector('.nav-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
}

// ---------- Smooth Scroll ----------
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });
}

// ---------- Animated Counters ----------
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let counted = false;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !counted) {
                    counted = true;
                    counters.forEach((counter) => {
                        const target = parseInt(counter.dataset.target, 10);
                        animateCounter(counter, target);
                    });
                }
            });
        },
        { threshold: 0.5 }
    );

    const statsSection = document.getElementById('stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateCounter(el, target) {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        const current = Math.round(eased * target);
        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ---------- Calendly Integration ----------
function initCalendly() {
    const defaultCalendlyUrl = 'https://calendly.com/dagfarias-polymathicsai/polymathics-ai-demo'; 
    
    document.querySelectorAll('.calendly-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.Calendly) {
                window.Calendly.initPopupWidget({ url: defaultCalendlyUrl });
            } else {
                console.warn('Calendly script not loaded yet.');
                // Fallback in case the script fails to load or is blocked
                window.open(defaultCalendlyUrl, '_blank');
            }
        });
    });
}

// ---------- Revenue Calculator ----------
function initCalculator() {
    const sliderMissed = document.getElementById('slider-missed');
    const sliderConvert = document.getElementById('slider-convert');
    const sliderPrice = document.getElementById('slider-price');
    
    const valMissed = document.getElementById('val-missed');
    const valConvert = document.getElementById('val-convert');
    const valPrice = document.getElementById('val-price');
    
    const toggleBtns = document.querySelectorAll('.calc-toggle');
    const resultPeriodLabel = document.getElementById('result-period-label');
    const resultAmount = document.getElementById('result-amount');
    const resultSubtext = document.getElementById('result-subtext');
    
    if(!sliderMissed) return; // Calculator not on page
    
    let currentPeriod = 'Monthly'; // Daily, Weekly, Monthly, Annually
    const daysMultiplier = {
        'Daily': 1,
        'Weekly': 7,
        'Monthly': 30, // As explicitly agreed by user
        'Annually': 365
    };
    
    function updateCalculator() {
        const missedVal = parseInt(sliderMissed.value, 10);
        const convertVal = parseInt(sliderConvert.value, 10);
        const priceVal = parseInt(sliderPrice.value, 10);
        
        // Update labels
        valMissed.textContent = missedVal;
        valConvert.textContent = convertVal + '%';
        valPrice.textContent = '$' + priceVal.toLocaleString();
        
        // Update slider colors (CSS gradient from accent to subtle border)
        updateSliderFill(sliderMissed);
        updateSliderFill(sliderConvert);
        updateSliderFill(sliderPrice);
        
        // Compute loss
        const multiplier = daysMultiplier[currentPeriod];
        const totalMissedInPeriod = missedVal * multiplier;
        
        // Round up the DAILY missed customers since you cannot have half a customer
        const dailyLostCustomers = Math.ceil(missedVal * (convertVal / 100.0));
        const totalLoss = dailyLostCustomers * multiplier * priceVal;
        
        // Render results
        resultPeriodLabel.textContent = currentPeriod;
        
        // Animate or set amount
        resultAmount.textContent = '$' + totalLoss.toLocaleString('en-US', {maximumFractionDigits: 0});
        resultSubtext.textContent = `Based on ${totalMissedInPeriod.toLocaleString()} missed opportunities per ${currentPeriod.toLowerCase()}`;
    }
    
    function updateSliderFill(slider) {
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        // Background linear-gradient to fill track
        slider.style.background = `linear-gradient(to right, var(--accent-blue) ${value}%, var(--border-subtle) ${value}%)`;
    }
    
    // Add event listeners to sliders
    [sliderMissed, sliderConvert, sliderPrice].forEach(slider => {
        slider.addEventListener('input', updateCalculator);
    });
    
    // Add event listeners to toggles
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentPeriod = e.target.getAttribute('data-period');
            updateCalculator();
        });
    });
    
    // Initial run
    updateCalculator();
}
