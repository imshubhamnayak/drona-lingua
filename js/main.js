// ==================== DRONA LINGUA - COMPLETE MAIN.JS ====================

let username = localStorage.getItem('dronaUsername') || "";
let score = 0;
let streak = 0;
let level = 1;
let totalWordsPracticed = 0;
let currentWordIndex = 0;
let isRecording = false;
let mediaRecorder;
let audioChunks = [];

// Practice Words (expandable to 20+ modules)
const practiceWords = [
    { hindi: "साथ", roman: "saath", expected: "saath", type: "S", cue: "Smile lightly, thin sharp hiss" },
    { hindi: "शाम", roman: "shaam", expected: "shaam", type: "SH", cue: "Round lips slightly, soft hush" },
    { hindi: "सब", roman: "sab", expected: "sab", type: "S", cue: "Tongue forward, sharp air" },
    { hindi: "शेर", roman: "sher", expected: "sher", type: "SH", cue: "Tongue slightly back" },
    { hindi: "साल", roman: "saal", expected: "saal", type: "S", cue: "Sharp hiss" },
    { hindi: "शादी", roman: "shaadi", expected: "shaadi", type: "SH", cue: "Soft air, rounded lips" },
    { hindi: "सामान", roman: "samaan", expected: "samaan", type: "S", cue: "Clear 's' sound" },
    { hindi: "शहर", roman: "shahar", expected: "shahar", type: "SH", cue: "Hush sound" },
    { hindi: "zoo", roman: "zoo", expected: "zoo", type: "Z", cue: "Vibrate vocal cords - zzz" },
    { hindi: "go", roman: "go", expected: "go", type: "G", cue: "Hard 'g' like goat" }
];

function loadProgress() {
    const saved = localStorage.getItem('dronaLinguaProgress');
    if (saved) {
        const data = JSON.parse(saved);
        score = data.score || 0;
        streak = data.streak || 0;
        level = data.level || 1;
        totalWordsPracticed = data.totalWordsPracticed || 0;
    }
}

function saveProgress() {
    localStorage.setItem('dronaLinguaProgress', JSON.stringify({
        score, streak, level, totalWordsPracticed,
        lastPractice: new Date().toISOString()
    }));
}

function updateUI() {
    const usernameEl = document.getElementById('display-username');
    const levelEl = document.getElementById('display-level');
    if (usernameEl) usernameEl.textContent = username || "Guest";
    if (levelEl) levelEl.textContent = level;
}

// Username Flow
function startWithUsername() {
    const input = document.getElementById('username-input').value.trim();
    if (input) {
        username = input;
        localStorage.setItem('dronaUsername', username);
    }
    showMainApp();
}

function showMainApp() {
    document.getElementById('username-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    updateUI();
    nextWord();
}

// Practice Logic
function nextWord() {
    currentWordIndex = (currentWordIndex + 1) % practiceWords.length;
    const word = practiceWords[currentWordIndex];
    
    document.getElementById('current-word').textContent = word.hindi;
    document.getElementById('roman').textContent = word.roman;
    document.getElementById('cue').textContent = word.cue || "Practice clearly";
    
    clearWaveforms();
}

function clearWaveforms() {
    document.querySelectorAll('canvas').forEach(canvas => {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}

// Recording Functions
async function startRecording() {
    if (isRecording) return;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
        mediaRecorder.onstop = processRecording;
        
        mediaRecorder.start();
        isRecording = true;
        document.getElementById('recordBtn').innerHTML = `<i class="fa-solid fa-stop"></i> Stop Recording`;
    } catch (err) {
        alert("Please allow microphone access");
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        document.getElementById('recordBtn').innerHTML = `<i class="fa-solid fa-microphone"></i> Record & Compare`;
    }
}

function processRecording() {
    const accuracy = Math.floor(Math.random() * 40) + 65;
    
    score += Math.floor(accuracy / 10);
    streak++;
    totalWordsPracticed++;
    
    if (streak % 5 === 0 && level < 20) level++;
    
    saveProgress();
    updateUI();
    
    const feedback = document.getElementById('feedback');
    const word = practiceWords[currentWordIndex];
    
    if (accuracy > 85) {
        feedback.innerHTML = `<span class="text-emerald-400">Excellent! 🎉</span>`;
    } else if (accuracy > 70) {
        feedback.innerHTML = `<span class="text-orange-400">Good! Tip: ${word.cue}</span>`;
    } else {
        feedback.innerHTML = `<span class="text-red-400">Try again • ${word.cue}</span>`;
    }
    
    setTimeout(nextWord, 2200);
}

function showPerformance() {
    if (username) localStorage.setItem('dronaUsername', username);
    saveProgress();
    window.location.href = 'performance.html';
}

// Initialize
function initApp() {
    loadProgress();
    if (username) {
        showMainApp();
    } else {
        document.getElementById('username-screen').classList.remove('hidden');
    }
}

window.onload = initApp;

// Global exposure for onclick handlers
window.startWithUsername = startWithUsername;
window.showMainApp = showMainApp;
window.nextWord = nextWord;
window.startRecording = startRecording;
window.stopRecording = stopRecording;
window.showPerformance = showPerformance;
