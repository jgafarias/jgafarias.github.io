// ==========================================
// GIFT MODAL — Pix / Presentes
// ==========================================

const giftCards = document.querySelectorAll('.gift-option');
const modal     = document.getElementById('giftModal');

if (modal) {
    const giftValue    = document.getElementById('giftValue');
    const form         = document.getElementById('giftForm');
    const formStep     = modal.querySelector('.modal-form');
    const qrStep       = modal.querySelector('.modal-qr');
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

    giftCards.forEach((card) => card.addEventListener('click', () => openModal(card.dataset.value)));
    closeTargets.forEach((target) => target.addEventListener('click', closeModal));

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const submitBtn       = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        submitBtn.textContent = 'Gerando Pix...';
        submitBtn.disabled    = true;

        const valorText  = String(giftValue?.textContent ?? '');
        const valorClean = valorText.replace(/[^\d,]/g, '');

        setTimeout(() => {
            const qrData = `00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540${valorClean.replace(',', '.')}`;
            const qrUrl  = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrData)}`;

            const qrContainer = modal.querySelector('.qr-placeholder');
            if (qrContainer) {
                qrContainer.innerHTML    = `<img src="${qrUrl}" alt="QR Code Pix" style="border-radius: 8px;">`;
                qrContainer.style.background = 'white';
            }

            formStep.classList.remove('is-active');
            qrStep.classList.add('is-active');
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled    = false;
        }, 1500);
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeModal();
    });
}
