let workTime = 25 * 60;
let breakTime = 5 * 60;
let longBreakTime = 15 * 60;
let isBreak = false;
let isRunning = false;
let timer;
let sessionCount = parseInt(localStorage.getItem('pomodoroSessions')) || 0;
let timeLeft = workTime;

const timerText = document.getElementById('timerText');
const modeLabel = document.getElementById('modeLabel');
const sessionCounter = document.getElementById('sessionCount');
const circle = document.querySelector('.circle-progress');
const radius = 104;
const circumference = 2 * Math.PI * radius;
const alarmSound = document.getElementById('alarmSound');
const bgMusic = document.getElementById('bgMusic');
const workInput = document.getElementById('workInput');
const breakInput = document.getElementById('breakInput');
const longBreakInput = document.getElementById('longBreakInput');

circle.style.strokeDasharray = `${circumference}`;
sessionCounter.textContent = sessionCount;

function formatTime(totalSeconds) {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    return `${hrs > 0 ? String(hrs).padStart(2, '0') + ':' : ''}${String(mins).padStart(2, '0')}:${String(totalSeconds % 60).padStart(2, '0')}`;
}

function updateTimer() {
    timerText.textContent = formatTime(timeLeft);
    const total = isBreak ? (sessionCount % 4 === 0 && sessionCount !== 0 ? longBreakTime : breakTime) : workTime;
    const offset = circumference - (timeLeft / total) * circumference;
    circle.style.strokeDashoffset = offset;
}

function updateDurations() {
    workTime = parseInt(workInput.value) * 60;
    breakTime = parseInt(breakInput.value) * 60;
    longBreakTime = parseInt(longBreakInput.value) * 60;
}

function startTimer() {
    if (isRunning) return;
    updateDurations();
    isRunning = true;
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimer();
        } else {
            clearInterval(timer);
            isRunning = false;
            alarmSound.play();

            if (!isBreak) {
                sessionCount++;
                localStorage.setItem('pomodoroSessions', sessionCount);
                sessionCounter.textContent = sessionCount;
            }

            updateDurations();
            timeLeft = (!isBreak && sessionCount % 4 === 0) ? longBreakTime : (isBreak ? workTime : breakTime);
            isBreak = !isBreak;
            modeLabel.textContent = isBreak ? (sessionCount % 4 === 0 ? "Long Break" : "Break Time") : "Focus Time";
            updateTimer();
            startTimer();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    pauseTimer();
    updateDurations();
    timeLeft = isBreak ? breakTime : workTime;
    updateTimer();
}

function toggleBreak() {
    isBreak = !isBreak;
    updateDurations();
    timeLeft = isBreak ? breakTime : workTime;
    modeLabel.textContent = isBreak ? "Break Time" : "Focus Time";
    resetTimer();
}

function toggleTheme() {
    const isLight = document.body.classList.toggle("light");
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
    }
}

function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.volume = 0.3;
        bgMusic.play();
    } else {
        bgMusic.pause();
    }
}

applySavedTheme();
updateTimer();
