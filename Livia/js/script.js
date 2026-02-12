setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
}, 3500);

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
});

document.body.classList.remove('loading');

// Carousel functionality
const carouselTrack = document.querySelector('.carousel-track');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const dots = document.querySelectorAll('.carousel-indicators .dot');

if (carouselTrack && carouselSlides.length > 0) {
    let currentSlide = 0;
    const totalSlides = carouselSlides.length;

    const updateCarousel = () => {
        // Move track
        const slideWidth = carouselSlides[0].offsetWidth;
        carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

        // Update active states
        carouselSlides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    };

    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    };

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
    });

    // Auto-play (optional)
    setInterval(nextSlide, 5000);

    // Initialize
    updateCarousel();
}


const giftCards = document.querySelectorAll('.gift-option');
const modal = document.getElementById('giftModal');

if (modal) {
    const giftValue = document.getElementById('giftValue');
    const form = document.getElementById('giftForm');
    const formStep = modal.querySelector('.modal-form');
    const qrStep = modal.querySelector('.modal-qr');
    const closeTargets = modal.querySelectorAll('[data-close]');
    const thanksText = modal.querySelector('.thanks-text');

    const openModal = (value) => {
        giftValue.textContent = `R$ ${value}`;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        formStep.classList.add('is-active');
        qrStep.classList.remove('is-active');
        form.reset();
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
    };

    giftCards.forEach((card) => {
        card.addEventListener('click', () => {
            openModal(card.dataset.value);
        });
    });

    closeTargets.forEach((target) => {
        target.addEventListener('click', closeModal);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // 1. Loading State
        submitBtn.textContent = 'Gerando Pix...';
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const valorText = String(giftValue?.textContent ?? '');
        // Clean value for display/logic
        const valorClean = valorText.replace(/[^\d,]/g, '');

        // Simulate API delay for better UX
        setTimeout(() => {
            // 2. Generate Real-looking QR (using placeholder API with value)
            const qrData = `00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540${valorClean.replace(',', '.')}`; // Mock Pix String
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrData)}`;

            const qrContainer = modal.querySelector('.qr-placeholder');
            if (qrContainer) {
                qrContainer.innerHTML = `<img src="${qrUrl}" alt="QR Code Pix" style="border-radius: 8px;">`;
                qrContainer.style.background = 'white'; // Clean background for image
            }

            // 3. Swap Steps "After" processing
            formStep.classList.remove('is-active');
            qrStep.classList.add('is-active');

            // Reset Form State
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }, 1500);
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const sections = document.querySelectorAll('.section');

const setActiveSection = (sectionId) => {
    if (!sectionId) {
        return;
    }

    let found = false;
    sections.forEach((section) => {
        const isActive = section.id === sectionId;
        section.classList.toggle('is-active', isActive);
        if (isActive) {
            found = true;
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${sectionId}`);
    });

    if (!found && sections.length) {
        sections.forEach((section, index) => {
            section.classList.toggle('is-active', index === 0);
        });
    }
};

const normalizeHash = (hashValue) => {
    if (!hashValue) {
        return '';
    }
    return hashValue.replace('#', '');
};

setActiveSection(normalizeHash(window.location.hash) || 'inicio');

if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
        const isOpen = siteNav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = normalizeHash(link.getAttribute('href'));
        setActiveSection(targetId);
        window.history.replaceState(null, '', `#${targetId}`);

        if (siteNav) {
            siteNav.classList.remove('is-open');
        }
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

window.addEventListener('hashchange', () => {
    setActiveSection(normalizeHash(window.location.hash) || 'inicio');
});
