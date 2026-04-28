const viewport = document.querySelector('.timer-list');
const list = document.querySelector('.timer-list-inner');
const spans = Array.from(list.querySelectorAll('span'));

const ITEM_WIDTH = 100;
const GAP = 20;
const STEP = ITEM_WIDTH + GAP;
const VISIBLE = 3;
const maxIndex = spans.length - VISIBLE;

let current = 0;
let startX = 0;
let dragDelta = 0;
let isDragging = false;
let hasMoved = false;

// Dots
const dotsContainer = document.createElement('div');
dotsContainer.className = 'carousel-dots';
viewport.insertAdjacentElement('afterend', dotsContainer);

const dotEls = Array.from({ length: maxIndex + 1 }, (_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    dotsContainer.appendChild(d);
    return d;
});

function setTransform(x, animated) {
    list.style.transition = animated ? 'transform 0.35s cubic-bezier(.4,0,.2,1)' : 'none';
    list.style.transform = `translateX(${x}px)`;
}

function snapTo(index) {
    current = Math.max(0, Math.min(maxIndex, index));
    setTransform(-(current * STEP), true);
    dotEls.forEach((d, i) => d.classList.toggle('active', i === current));
}

// Touch
viewport.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    dragDelta = 0;
    isDragging = true;
    hasMoved = false;
    list.style.transition = 'none';
}, { passive: true });

viewport.addEventListener('touchmove', e => {
    if (!isDragging) return;
    dragDelta = e.touches[0].clientX - startX;
    hasMoved = true;
    const rawX = -(current * STEP) + dragDelta;
    const boundedX = Math.max(-(maxIndex * STEP) - 30, Math.min(30, rawX));
    setTransform(boundedX, false);
}, { passive: true });

viewport.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    const threshold = STEP * 0.3;
    if (dragDelta < -threshold) snapTo(current + 1);
    else if (dragDelta > threshold) snapTo(current - 1);
    else setTransform(-(current * STEP), true);
});

// Mouse drag
viewport.addEventListener('mousedown', e => {
    startX = e.clientX;
    dragDelta = 0;
    isDragging = true;
    hasMoved = false;
    viewport.classList.add('dragging');
    list.style.transition = 'none';
    e.preventDefault();
});

window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    dragDelta = e.clientX - startX;
    if (Math.abs(dragDelta) > 4) hasMoved = true;
    const rawX = -(current * STEP) + dragDelta;
    const boundedX = Math.max(-(maxIndex * STEP) - 30, Math.min(30, rawX));
    setTransform(boundedX, false);
});

window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('dragging');
    const threshold = STEP * 0.3;
    if (dragDelta < -threshold) snapTo(current + 1);
    else if (dragDelta > threshold) snapTo(current - 1);
    else setTransform(-(current * STEP), true);
});

// Tap pour sélectionner
spans.forEach(span => {
    span.addEventListener('click', () => {
        if (hasMoved) return;
        spans.forEach(s => s.classList.remove('active'));
        span.classList.add('active');
    });
});

snapTo(0);

function setTheme(n) {
    document.body.className = `theme-${n}`;
    localStorage.setItem('theme', n);

    // met à jour le bouton actif
    document.querySelectorAll('.theme-switcher button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === String(n));
    });
}

// restaure le thème au chargement
const savedTheme = parseInt(localStorage.getItem('theme')) || 0;
setTheme(savedTheme);

spans.forEach(span => {
    span.addEventListener('click', () => {
        if (hasMoved) return;

        const seconds = parseInt(span.dataset.seconds);
        window.location.href = `/FastTimer-GO/cooldown.html?seconds=${seconds}`;
    });
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        this.navigator.serviceWorker
            .register("/serviceWorker.js")
            .the (res => console.log("Service Worker registered"))
            .catch(err => console.log("Service Worker registration failed:", err));
    });
}
