/ --- User Greeting and Auth Check ---
// Only allow access if logged in and came from landing page
const user = JSON.parse(sessionStorage.getItem('pomodoroUser'));
if (!user) {
    window.location.href = "auth.html";
} else if (document.referrer.indexOf('landing.html') === -1) {
    // Not coming from landing page
    window.location.href = "landing.html";
}

const mainContainer = document.getElementById('mainContainer');
const welcomeDiv = document.getElementById('welcome');
const logoutBtn = document.getElementById('logoutBtn');

//function checkLogin() {
  //  const user = JSON.parse(sessionStorage.getItem('pomodoroUser'));
    //if (!user) {
      //  window.location.href = "auth.html";
    //} else {
      //  mainContainer.style.display = "block";
        //if (welcomeDiv) {
          //  welcomeDiv.textContent = `Welcome, ${user.username}! (${user.email})`;
        //}
    //}
//}
//checkLogin();
//function handleSuccessfulLogin(userData) {
  //sessionStorage.setItem('pomodoroUser', JSON.stringify(userData));
  //window.location.href = 'pomodoro.html'; // Redirect to your Pomodoro timer page
  ////if (goToPomodoroBtn){
     // goToPomodoroBtn.style.display='block';
  //}
//}

if (logoutBtn) {
    logoutBtn.onclick = function() {
        sessionStorage.removeItem('pomodoroUser');
        window.location.href = 'auth.html';
    };
}

// --- Pomodoro Logic ---
const timerText = document.getElementById('timerText');
const progressCircle = document.getElementById('progressCircle');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const pausebtn =document.getElementById('pauseBtn')
const startSound = document.getElementById('startSound');
const endSound = document.getElementById('endSound');

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
function playSound(audioElement){
    if(audioElement){
        audioElement.currentTime=0;
        audioElement.play();
    }
}

// --- Notification and Sound Logic ---
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


function startTimer() {
    if (timerInterval) return;

    // Notification at start
    showNotification(isStudy ? "Study session started!" : "Break started!");
    playSound(startSound);

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            // Notification at end
            showNotification(isStudy ? "Study session ended! Time for a break." : "Break ended! Back to study.");
            playSound(endSound);
            // Switch session
            isStudy = !isStudy;
            totalDuration = isStudy ? studyDuration * 60 : breakDuration * 60;
            timeLeft = totalDuration;
            updateTimerDisplay();
        }
    }, 1000);
}
function pauseTimer(){
    if(yimerInterval){

clearInterval(timerInterval);
    timerInterval =null;
    isPaused =true;
    }
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


function playSound(audioElement) {
    if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play();
    }
}

// Request notification permission on load
if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
}

const pauseBtn = document.getElementById('pauseBtn');

let isPaused = false;

function startTimer() {
    if (timerInterval || isPaused) return;

    showNotification(isStudy ? "Study session started!" : "Break started!");
    playSound(startSound);

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            showNotification(isStudy ? "Study session ended! Time for a break." : "Break ended! Back to study.");
            playSound(endSound);
            isStudy = !isStudy;
            totalDuration = isStudy ? studyDuration * 60 : breakDuration * 60;
            timeLeft = totalDuration;
            updateTimerDisplay();
        }
    }, 1000);
}

function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = true;
    }
}

pauseBtn.addEventListener('click', pauseTimer);

// Optionally, allow resuming after pause with Start
startBtn.addEventListener('click', function() {
    if (isPaused) {
        isPaused = false;
        startTimer();
    } else {
        startTimer();
    }
});

loginForm.onsubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    let users = JSON.parse(localStorage.getItem('pomodoroUsers') || '[]');
    let user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        alert('Invalid credentials.');
        return;
    }
    sessionStorage.setItem('pomodoroUser', JSON.stringify(user));
    window.location.href = 'landing.html';
};









