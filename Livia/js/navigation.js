// ==========================================
// NAVEGAÇÃO & SEÇÕES (SPA)
// ==========================================

const navToggle = document.querySelector('.nav-toggle');
const siteNav   = document.querySelector('.site-nav');
const navLinks  = document.querySelectorAll('.site-nav a');
const sections  = document.querySelectorAll('.section');

const setActiveSection = (sectionId) => {
    if (!sectionId) return;

    let found = false;
    sections.forEach((section) => {
        const isActive = section.id === sectionId;
        section.classList.toggle('is-active', isActive);
        if (isActive) found = true;
    });

    navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${sectionId}`);
    });

    if (!found && sections.length) {
        sections.forEach((s, i) => s.classList.toggle('is-active', i === 0));
    }
};

const normalizeHash = (h) => (h ? h.replace('#', '') : '');

// Inicializa a seção correta ao carregar
setActiveSection(normalizeHash(window.location.hash) || 'inicio');

// Toggle do menu mobile
if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
        const isOpen = siteNav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

// Clique nos links de navegação
navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = normalizeHash(link.getAttribute('href'));
        setActiveSection(targetId);
        window.history.replaceState(null, '', `#${targetId}`);
        if (siteNav)   siteNav.classList.remove('is-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Mudança de hash via URL
window.addEventListener('hashchange', () => {
    setActiveSection(normalizeHash(window.location.hash) || 'inicio');
});
