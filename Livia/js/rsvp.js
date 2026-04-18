// ==========================================
// RSVP MODAL — Confirmação de Presença
// Envio via Google Apps Script → Gmail SMTP
// URL configurada em js/config.js
// ==========================================

const rsvpModal     = document.getElementById('rsvpModal');
const rsvpOpenBtn   = document.getElementById('rsvpOpenBtn');
const rsvpCloseBtn  = document.getElementById('rsvpModalClose');
const rsvpBackdrop  = document.getElementById('rsvpBackdrop');
const rsvpSuccess   = document.getElementById('rsvpSuccess');
const rsvpForm      = document.getElementById('rsvpForm');
const btnMinus      = document.getElementById('btnMinus');
const btnPlus       = document.getElementById('btnPlus');
const guestInput    = document.getElementById('rsvp-acompanhantes');
const rsvpSubmitBtn = document.getElementById('rsvpSubmitBtn');

/* ---- Abrir / Fechar ---- */

const openRsvpModal = () => {
    if (!rsvpModal) return;
    rsvpForm.style.display = '';
    rsvpSuccess.classList.remove('is-visible');
    if (guestInput) guestInput.value = 0;
    rsvpForm.reset();
    rsvpModal.classList.add('is-open');
    rsvpModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

const closeRsvpModal = () => {
    if (!rsvpModal) return;
    rsvpModal.classList.remove('is-open');
    rsvpModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

if (rsvpOpenBtn)  rsvpOpenBtn.addEventListener('click', openRsvpModal);
if (rsvpCloseBtn) rsvpCloseBtn.addEventListener('click', closeRsvpModal);
if (rsvpBackdrop) rsvpBackdrop.addEventListener('click', closeRsvpModal);

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && rsvpModal?.classList.contains('is-open')) closeRsvpModal();
});

/* ---- Contador de convidados & Atualização de Total ---- */

const updateTotal = () => {
    const guests    = parseInt(guestInput.value, 10) || 0;
    const totalInput = document.getElementById('rsvp-total');
    if (totalInput) totalInput.value = guests + 1;
};

if (btnMinus && btnPlus && guestInput) {
    btnMinus.addEventListener('click', () => {
        const v = parseInt(guestInput.value, 10);
        if (v > 0) {
            guestInput.value = v - 1;
            updateTotal();
        }
    });

    btnPlus.addEventListener('click', () => {
        const v   = parseInt(guestInput.value, 10);
        const max = parseInt(guestInput.max,   10);
        if (v < max) {
            guestInput.value = v + 1;
            updateTotal();
        }
    });
}

/* ---- UI de Sucesso (O envio agora é nativo via HTML) ---- */

if (rsvpForm) {
    rsvpForm.addEventListener('submit', () => {
        // Como o target é o iframe, a página não recarrega.
        // Apenas mostramos a animação de sucesso.
        const btnLabel = rsvpSubmitBtn.querySelector('.btn-label');
        if (btnLabel) btnLabel.textContent = 'Enviando...';
        rsvpSubmitBtn.disabled = true;

        setTimeout(() => {
            rsvpForm.style.display = 'none';
            rsvpSuccess.classList.add('is-visible');
        }, 1000);
    });
}
