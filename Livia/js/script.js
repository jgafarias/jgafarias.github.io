setTimeout (() => {
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

const giftCards = document.querySelectorAll('.gift-card');
const modal = document.getElementById('giftModal');

if (modal) {
    const giftValue = document.getElementById('giftValue');
    const form = document.getElementById('giftForm');
    const formStep = modal.querySelector('.modal-form');
    const qrStep = modal.querySelector('.modal-qr');
    const closeTargets = modal.querySelectorAll('[data-close]');

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
        formStep.classList.remove('is-active');
        qrStep.classList.add('is-active');
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