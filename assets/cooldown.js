
const params = new URLSearchParams(window.location.search);
const totalSeconds = parseInt(params.get('seconds'));
let remaining = totalSeconds;
let interval = null;
const theme = localStorage.getItem('theme') || '0';
document.body.className = `theme-${theme}`;
const controls = document.getElementById('timerControls');

controls.style.visibility = 'hidden';

const fill = document.getElementById('timerFill');
const display = document.getElementById('timerDisplay');

function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
}

function updateFill() {
    const progress = 1 - (remaining / totalSeconds);
    fill.style.transform = `scaleX(${progress})`;
}

function tick() {
    remaining--;
    display.textContent = formatTime(remaining);
    updateFill();

    if (remaining <= 0) {
        clearInterval(interval);
        controls.style.visibility = 'visible';
        if (navigator.vibrate) navigator.vibrate[(500, 200, 500)];
    }
}

function goBack() {
    window.location.href = '/';
}

function restart() {
    controls.style.visibility = 'hidden';
    remaining = totalSeconds;
    display.textContent = formatTime(remaining);
    fill.style.transform = 'scaleX(0)';
    startTimer();
}

function startTimer() {
    interval = setInterval(tick, 1000);
}


display.textContent = formatTime(remaining);
updateFill();
interval = setInterval(tick, 1000);