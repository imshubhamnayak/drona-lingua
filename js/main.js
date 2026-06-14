// ==================== DRONA LINGUA - FULL MAIN LOGIC ====================

let username = localStorage.getItem('dronaUsername') || "";
let score = 0;
let streak = 0;
let level = 1;
let totalWordsPracticed = 0;
let currentWordIndex = 0;
let isRecording = false;
let mediaRecorder;
let audioChunks = [];

const practiceWords = [
    { hindi: "साथ", roman: "saath", expected: "saath", type: "S", cue: "Smile lightly, thin sharp hiss" },
    { hindi: "शाम", roman: "shaam", expected: "shaam", type: "SH", cue: "Round lips slightly, soft hush" },
    { hindi: "सब", roman: "sab", expected: "sab", type: "S", cue: "Tongue forward, sharp air" },
    { hindi: "शेर", roman: "sher", expected: "sher", type: "SH", cue: "Tongue slightly back" },
    { hindi: "साल", roman: "saal", expected: "saal", type: "S", cue: "Sharp hiss" },
    { hindi: "शादी", roman: "shaadi", expected: "shaadi", type: "SH", cue: "Soft air, rounded lips" },
    { hindi: "zoo", roman: "zoo", expected: "zoo", type: "Z", cue: "zzz-oo" },
    { hindi: "go", roman: "go", expected: "go", type: "G", cue: "guh-oh" }
];

// Load Progress
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
    document.getElementById('display-username').textContent = username || "Guest";
    document.getElementById('display-level').textContent = level;
}

// Show Username Screen
function showUsernameScreen() {
    document.getElementById('username-screen').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');
}

// Start with Username
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

// Next Word
function nextWord() {
    currentWordIndex = (currentWordIndex + 1) % practiceWords.length;
    const word = practiceWords[currentWordIndex];
    
    document.getElementById('current-word').textContent = word.hindi;
    document.getElementById('roman').textContent = word.roman;
    document.getElementById('cue').textContent = word.cue || "";
    
    clearWaveforms();
}

function clearWaveforms() {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        if (canvas.getContext) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    });
}

// Recording
async function startRecording() {
    if (isRecording) return;
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
        mediaRecorder.onstop = () => processRecording();
        
        mediaRecorder.start();
        isRecording = true;
        document.getElementById('recordBtn').innerHTML = `<i class="fa-solid fa-stop"></i> Stop Recording`;
        
    } catch (err) {
        alert("Microphone access denied or not available");
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
    const accuracy = Math.floor(Math.random() * 35) + 65; // Simulate score
    
    score += Math.floor(accuracy / 8);
    streak++;
    totalWordsPracticed++;
    
    if (streak % 5 === 0 && level < 10) level++;
    
    saveProgress();
    updateUI();
    
    const feedbackDiv = document.getElementById('feedback');
    const word = practiceWords[currentWordIndex];
    
    if (accuracy > 85) {
        feedbackDiv.innerHTML = `<div class="text-emerald-400 text-2xl font-semibold">Excellent! 🎉</div>`;
    } else if (accuracy > 70) {
        feedbackDiv.innerHTML = `<div class="text-orange-400">Good! Try: ${word.cue}</div>`;
    } else {
        feedbackDiv.innerHTML = `<div class="text-red-400">Focus on: ${word.cue}</div>`;
    }
    
    setTimeout(nextWord, 2500);
}

// Show Performance
function showPerformance() {
    alert(`Progress for ${username || "Guest"}\n\nScore: ${score}\nStreak: ${streak}\nLevel: ${level}\nWords Practiced: ${totalWordsPracticed}`);
}

// Initialize
function init() {
    loadProgress();
    if (username) {
        showMainApp();
    } else {
        document.getElementById('username-screen').classList.remove('hidden');
    }
}

window.onload = init;
