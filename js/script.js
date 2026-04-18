// Script do efeito de digitação
const typingTextElement = document.getElementById('typing-text');
const textArray = ["Python", "C#"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let animationTimeout;

function type() {
    clearTimeout(animationTimeout);
    const currentText = textArray[textIndex];
    let displayText = currentText.substring(0, charIndex);
    typingTextElement.textContent = displayText;

    if (!isDeleting && charIndex < currentText.length) {
        charIndex++;
        animationTimeout = setTimeout(type, 100);
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        animationTimeout = setTimeout(type, 50);
    } else {
        isDeleting = !isDeleting;
        textIndex = !isDeleting ? (textIndex + 1) % textArray.length : textIndex;
        animationTimeout = setTimeout(type, 1000);
    }
}

document.addEventListener('DOMContentLoaded', type);

// Script da seção de Experiências (menu vertical)
const experienciaBtns = document.querySelectorAll('#trabalhos .experiencias-menu .menu-btn');
const experienciaDetalhes = document.querySelectorAll('#trabalhos .experiencias-detalhe');

experienciaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;

        experienciaBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        experienciaDetalhes.forEach(detalhe => {
            if (detalhe.id === targetId) {
                detalhe.classList.add('active');
            } else {
                detalhe.classList.remove('active');
            }
        });
    });
});

// Script da seção de Cursos (menu vertical)
const cursosBtns = document.querySelectorAll('#cursos .experiencias-menu .menu-btn');
const cursosDetalhes = document.querySelectorAll('#cursos .experiencias-detalhe');

cursosBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;

        cursosBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        cursosDetalhes.forEach(detalhe => {
            if (detalhe.id === targetId) {
                detalhe.classList.add('active');
            } else {
                detalhe.classList.remove('active');
            }
        });
    });
});

// Script para as abas principais (Trabalhos/Cursos)
const tabBtns = document.querySelectorAll('.tabs-menu .tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.tabTarget;

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        tabContents.forEach(content => {
            if (content.id === targetId) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    });
});

// Script para o menu de navegação lateral (paginação)
const pageLinks = document.querySelectorAll('.page-navigation a');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    pageLinks.forEach(link => {
        link.classList.remove('active');
        if (link.href.includes(current)) {
            link.classList.add('active');
        }
    });
});