// ==========================================
// CAROUSEL — Seção Momentos
// ==========================================

const carouselTrack  = document.querySelector('.carousel-track');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const prevBtn        = document.querySelector('.carousel-btn.prev');
const nextBtn        = document.querySelector('.carousel-btn.next');
const dots           = document.querySelectorAll('.carousel-indicators .dot');

if (carouselTrack && carouselSlides.length > 0) {
    let currentSlide  = 0;
    const totalSlides = carouselSlides.length;

    const updateCarousel = () => {
        const slideWidth = carouselSlides[0].offsetWidth;
        carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        carouselSlides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
        dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    };

    const nextSlide = () => { currentSlide = (currentSlide + 1) % totalSlides; updateCarousel(); };
    const prevSlide = () => { currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; updateCarousel(); };

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, i) => dot.addEventListener('click', () => { currentSlide = i; updateCarousel(); }));

    setInterval(nextSlide, 5000);
    updateCarousel();
}
