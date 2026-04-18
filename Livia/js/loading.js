// ==========================================
// LOADING SCREEN
// ==========================================

setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
}, 3500);

window.addEventListener('scroll', () => {
    document.body.classList.toggle('scrolled', window.scrollY > 50);
});

document.body.classList.remove('loading');
