// --- Login Logic ---
const loginForm = document.getElementById('loginForm');
const loginContainer = document.getElementById('loginContainer');
const mainContainer = document.getElementById('mainContainer');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Simple validation
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    if (username && email && password) {
        // Hide login, show main
        loginContainer.style.display = 'none';
        mainContainer.style.display = 'block';
    } else {
        alert('Please fill in all fields.');
    }
});

// --- Pomodoro Logic ---
const timerText = document.getElementById('timerText');
const progressCircle = document.getElementById('progressCircle');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

let studyDuration = 25; // minutes
let breakDuration = 5; // minutes
let isStudy = true;
let timerInterval = null;
let timeLeft = studyDuration * 60; // seconds
let totalDuration = studyDuration * 60; // seconds

// Circle progress
const radius = 100;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = circumference;
progressCircle.style.strokeDashoffset = 0;

function updateTimerDisplay() {
    const min = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const sec = (timeLeft % 60).toString().padStart(2, '0');
    timerText.textContent = `${min}:${sec}`;

    // Update circle progress
    const progress = timeLeft / totalDuration;
    progressCircle.style.strokeDashoffset = circumference * (1 - progress);
}

function startTimer() {
    if (timerInterval) return;

    // Notification at start
    showNotification(isStudy ? "Study session started!" : "Break started!");

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            // Notification at end
            showNotification(isStudy ? "Study session ended! Time for a break." : "Break ended! Back to study.");
            // Switch session
            isStudy = !isStudy;
            totalDuration = isStudy ? studyDuration * 60 : breakDuration * 60;
            timeLeft = totalDuration;
            updateTimerDisplay();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isStudy = true;
    totalDuration = studyDuration * 60;
    timeLeft = totalDuration;
    updateTimerDisplay();
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

updateTimerDisplay();

// --- Settings Modal Logic ---
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const settingsForm = document.getElementById('settingsForm');
const studyDurationInput = document.getElementById('studyDuration');
const breakDurationInput = document.getElementById('breakDuration');

settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
    studyDurationInput.value = studyDuration;
    breakDurationInput.value = breakDuration;
});
closeSettings.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});
window.onclick = function(event) {
    if (event.target === settingsModal) {
        settingsModal.style.display = "none";
    }
};

settingsForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let newStudy = parseInt(studyDurationInput.value);
    let newBreak = parseInt(breakDurationInput.value);
    if (newStudy >= 1 && newStudy <= 120 && newBreak >= 1 && newBreak <= 60) {
        studyDuration = newStudy;
        breakDuration = newBreak;
        resetTimer();
        settingsModal.style.display = 'none';
    } else {
        alert('Please enter valid durations.');
    }
});

// --- Notification Logic ---
function showNotification(message) {
    // Try browser notification
    if ("Notification" in window) {
        if (Notification.permission === "granted") {
            new Notification(message);
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(message);
                } else {
                    alert(message);
                }
            });
        } else {
            alert(message);
        }
    } else {
        alert(message);
    }
}

// Request notification permission on load
if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
}
