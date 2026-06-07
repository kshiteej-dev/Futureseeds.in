/* ==========================================================================
   FUTURE SEEDS INTERACTIVE LOGIC (index.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({
            icons: lucide.icons
        });
    }

    /* ----------------------------------------------------------------------
       1. THEME TOGGLE (LIGHT / DARK MODE)
       ---------------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });


    /* ----------------------------------------------------------------------
       2. MOBILE MENU TOGGLE
       ---------------------------------------------------------------------- */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        
        // Toggle icons
        const isMenuIconVisible = mobileMenuBtn.querySelector('.icon-menu').style.display !== 'none';
        if (navMenu.classList.contains('active')) {
            mobileMenuBtn.querySelector('.icon-menu').style.display = 'none';
            mobileMenuBtn.querySelector('.icon-close').style.display = 'block';
        } else {
            mobileMenuBtn.querySelector('.icon-menu').style.display = 'block';
            mobileMenuBtn.querySelector('.icon-close').style.display = 'none';
        }
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });


    /* ----------------------------------------------------------------------
       3. SCROLL PROGRESS & HEADER SHADOW
       ---------------------------------------------------------------------- */
    const scrollProgress = document.getElementById('scroll-progress');
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        // Scroll progress
        const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScrollHeight > 0) {
            const scrollPercentage = (window.scrollY / totalScrollHeight) * 100;
            scrollProgress.style.width = scrollPercentage + '%';
        }

        // Header bottom shadow
        if (window.scrollY > 20) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
        } else {
            header.style.boxShadow = 'none';
        }
    });


    /* ----------------------------------------------------------------------
       4. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
       ---------------------------------------------------------------------- */
    const animatedElements = document.querySelectorAll('.scroll-animate');

    const scrollObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, scrollObserverOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));


    /* ----------------------------------------------------------------------
       5. ANIMATED IMPACT COUNTERS
       ---------------------------------------------------------------------- */
    const counterElements = document.querySelectorAll('.counter');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 1500; // milliseconds
        const stepTime = Math.max(Math.floor(duration / target), 15);
        let start = 0;

        const timer = setInterval(() => {
            start += Math.ceil(target / (duration / stepTime));
            if (start >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = start.toLocaleString();
            }
        }, stepTime);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    counterElements.forEach(counter => counterObserver.observe(counter));


    /* ----------------------------------------------------------------------
       6. TESTIMONIALS SLIDER
       ---------------------------------------------------------------------- */
    const sliderContainer = document.getElementById('slider-container');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    let currentSlideIndex = 0;
    let autoPlayTimer;

    const updateSlider = (index) => {
        // Bound checks
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        currentSlideIndex = index;
        
        // Translate slider container
        sliderContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
        
        // Toggle active states
        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentSlideIndex);
        });
        
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlideIndex);
        });
    };

    const nextSlide = () => updateSlider(currentSlideIndex + 1);
    const prevSlide = () => updateSlider(currentSlideIndex - 1);

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'), 10);
            updateSlider(index);
            resetAutoPlay();
        });
    });

    const startAutoPlay = () => {
        autoPlayTimer = setInterval(nextSlide, 6000);
    };

    const resetAutoPlay = () => {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    };

    // Hover pauses autoplay
    const sliderWrapper = document.querySelector('.slider-wrapper');
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
        sliderWrapper.addEventListener('mouseleave', startAutoPlay);
        startAutoPlay();
    }


    /* ----------------------------------------------------------------------
       7. OVERLAY MODALS REGISTRATION & EVENT HANDLING
       ---------------------------------------------------------------------- */
    const modalStudent = document.getElementById('modal-student');
    const modalMentor = document.getElementById('modal-mentor');
    const modalEvent = document.getElementById('modal-event');
    const allModals = [modalStudent, modalMentor, modalEvent];

    // Open Student Modal
    document.querySelectorAll('.open-student-modal').forEach(btn => {
        btn.addEventListener('click', () => openModal(modalStudent));
    });

    // Open Mentor Modal
    document.querySelectorAll('.open-mentor-modal').forEach(btn => {
        btn.addEventListener('click', () => openModal(modalMentor));
    });

    // Open Event / Program Modal
    document.querySelectorAll('.open-event-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const subject = btn.getAttribute('data-subject') || 'General Registration';
            document.getElementById('e-subject').value = subject;
            document.getElementById('event-modal-subtitle').textContent = `Subject: ${subject}`;
            openModal(modalEvent);
        });
    });

    const openModal = (modal) => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop body scrolling
    };

    const closeModal = (modal) => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Resume body scrolling
        resetFormErrors(modal.querySelector('form'));
    };

    // Close buttons event
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    // Close on background click
    allModals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            allModals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
            const lightbox = document.getElementById('modal-lightbox');
            if (lightbox.classList.contains('active')) {
                closeLightbox();
            }
        }
    });


    /* ----------------------------------------------------------------------
       8. TOAST NOTIFICATION UTILITY
       ---------------------------------------------------------------------- */
    const formToast = document.getElementById('form-toast');
    
    const showToast = (title, description) => {
        formToast.querySelector('.toast-title').textContent = title;
        formToast.querySelector('.toast-desc').textContent = description;
        formToast.classList.add('active');
        
        setTimeout(() => {
            formToast.classList.remove('active');
        }, 5000);
    };


    /* ----------------------------------------------------------------------
       9. FORM VALIDATIONS & MOCK SUBMISSIONS
       ---------------------------------------------------------------------- */
    const resetFormErrors = (form) => {
        if (!form) return;
        form.reset();
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
    };

    const validateInput = (input) => {
        const group = input.closest('.form-group');
        let isValid = true;

        if (input.required && !input.value.trim()) {
            isValid = false;
        } else if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(input.value.trim());
        } else if (input.type === 'tel' && input.value.trim()) {
            const phoneRegex = /^[6-9]\d{9}$/; // 10 digit Indian number format check
            isValid = phoneRegex.test(input.value.trim());
        } else if (input.type === 'url' && input.value.trim()) {
            try {
                new URL(input.value.trim());
                isValid = true;
            } catch (_) {
                isValid = false;
            }
        }

        if (!isValid) {
            group.classList.add('error');
        } else {
            group.classList.remove('error');
        }

        return isValid;
    };

    const handleFormSubmit = (form, successTitle, successMsg, closeTargetModal = null) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = form.querySelectorAll('input, select, textarea');
            let isFormValid = true;

            inputs.forEach(input => {
                const isValid = validateInput(input);
                if (!isValid) isFormValid = false;
            });

            if (isFormValid) {
                // Mocking API delay
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing...';

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;

                    // Clear fields and success alert
                    resetFormErrors(form);
                    if (closeTargetModal) {
                        closeModal(closeTargetModal);
                    }
                    showToast(successTitle, successMsg);
                }, 1000);
            }
        });

        // Add blur listeners for dynamic check validation
        form.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                group.classList.remove('error');
            });
        });
    };

    // Attach form validations
    handleFormSubmit(
        document.getElementById('contact-form'),
        'Message Sent!',
        'Thank you for contacting us. Kshiteej and the Future Seeds team will reply soon!'
    );

    handleFormSubmit(
        document.getElementById('student-reg-form'),
        'Application Submitted!',
        'Welcome aboard! We have recorded your application and will email updates shortly.',
        modalStudent
    );

    handleFormSubmit(
        document.getElementById('mentor-reg-form'),
        'Application Received!',
        'Thank you for volunteering. Our team will review your profile and reach out within 48 hours.',
        modalMentor
    );

    handleFormSubmit(
        document.getElementById('event-reg-form'),
        'Registration Confirmed!',
        'Your seat has been reserved. Check your email for direct access codes and calendar links.',
        modalEvent
    );


    /* ----------------------------------------------------------------------
       10. GALLERY FILTERING
       ---------------------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from others
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });


    /* ----------------------------------------------------------------------
       11. GALLERY LIGHTBOX
       ---------------------------------------------------------------------- */
    const lightboxModal = document.getElementById('modal-lightbox');
    const lightboxImgBox = document.getElementById('lightbox-img-box');
    const lightboxEmoji = document.getElementById('lightbox-emoji');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxCloseBtn = document.querySelector('.lightbox-close');

    const openLightbox = (item) => {
        const title = item.getAttribute('data-title');
        const desc = item.getAttribute('data-desc');
        
        const galleryImg = item.querySelector('.gallery-img');
        const lightboxImg = document.getElementById('lightbox-img');
        
        if (galleryImg) {
            // Show image, hide emoji
            lightboxImg.src = galleryImg.src;
            lightboxImg.alt = title;
            lightboxImg.style.display = 'block';
            lightboxEmoji.style.display = 'none';
        } else {
            // Fallback to emoji
            const emojiEl = item.querySelector('.gallery-placeholder-emoji');
            const emoji = emojiEl ? emojiEl.textContent : '🌱';
            lightboxEmoji.textContent = emoji;
            lightboxEmoji.style.display = 'block';
            lightboxImg.style.display = 'none';
        }
        
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = desc;

        // Sync visual color classes
        const placeholder = item.querySelector('.gallery-card-placeholder');
        if (placeholder) {
            const gradientClass = Array.from(placeholder.classList).find(c => c.startsWith('gradient-'));
            
            // Remove current gradient classes from lightbox
            Array.from(lightboxImgBox.classList).forEach(c => {
                if (c.startsWith('gradient-')) lightboxImgBox.classList.remove(c);
            });
            if (gradientClass) {
                lightboxImgBox.classList.add(gradientClass);
            }
        }

        // Show Modal
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear image src when closed
        const lightboxImg = document.getElementById('lightbox-img');
        if (lightboxImg) {
            lightboxImg.src = '';
        }
    };

    galleryItems.forEach(item => {
        item.addEventListener('click', () => openLightbox(item));
    });

    if (lightboxCloseBtn) {
        lightboxCloseBtn.addEventListener('click', closeLightbox);
    }
    
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target.classList.contains('lightbox-container')) {
                closeLightbox();
            }
        });
    }


    /* ----------------------------------------------------------------------
       12. FAQ ACCORDION INTERACTIVITY
       ---------------------------------------------------------------------- */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all open FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });

            // If not active before, toggle active
            if (!isActive) {
                faqItem.classList.add('active');
                const answer = faqItem.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
});
