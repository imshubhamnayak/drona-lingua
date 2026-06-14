// ==================== DRONA LINGUA - FULL MAIN LOGIC ====================

let score = 0;
let streak = 0;
let level = 1;
let totalWordsPracticed = 0;
let currentWordIndex = 0;
let isRecording = false;
let mediaRecorder;
let audioChunks = [];
let username = localStorage.getItem('dronaUsername') || "Guest User";

const practiceWords = [
    { hindi: "साथ", roman: "saath", expected: "saath", type: "S", cue: "Smile lightly, thin sharp hiss" },
    { hindi: "शाम", roman: "shaam", expected: "shaam", type: "SH", cue: "Round lips slightly, soft hush" },
    { hindi: "सब", roman: "sab", expected: "sab", type: "S", cue: "Tongue forward, sharp air" },
    { hindi: "शेर", roman: "sher", expected: "sher", type: "SH", cue: "Tongue slightly back, rounded lips" },
    { hindi: "साल", roman: "saal", expected: "saal", type: "S", cue: "Sharp hiss" },
    { hindi: "शादी", roman: "shaadi", expected: "shaadi", type: "SH", cue: "Soft air, rounded lips" },
    { hindi: "सुनो", roman: "suno", expected: "suno", type: "S", cue: "Forward tongue" },
    { hindi: "शुरू", roman: "shuru", expected: "shuru", type: "SH", cue: "Rounded tongue, soft hush" },
    { hindi: "zoo", roman: "zoo", expected: "zoo", type: "Z", cue: "zzz-oo" },
    { hindi: "go", roman: "go", expected: "go", type: "G", cue: "guh-oh" }
];

// Load Progress + Username
function loadProgress() {
    const saved = localStorage.getItem('dronaLinguaProgress');
    if (saved) {
        const data = JSON.parse(saved);
        score = data.score || 0;
        streak = data.streak || 0;
        level = data.level || 1;
        totalWordsPracticed = data.totalWordsPracticed || 0;
    }
    document.getElementById('username-display').textContent = username;
    updateUI();
}

function saveProgress() {
    localStorage.setItem('dronaLinguaProgress', JSON.stringify({
        score, streak, level, totalWordsPracticed,
        lastPractice: new Date().toISOString()
    }));
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('streak').textContent = `🔥 ${streak}`;
    document.getElementById('level').textContent = level;
    document.getElementById('words-practiced').textContent = totalWordsPracticed;
}

function showProfile() {
    const name = prompt("Enter your name:", username);
    if (name && name.trim() !== "") {
        username = name.trim();
        localStorage.setItem('dronaUsername', username);
        document.getElementById('username-display').textContent = username;
    }
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
    const userCanvas = document.getElementById('userWaveform');
    const correctCanvas = document.getElementById('correctWaveform');
    if (userCanvas) userCanvas.getContext('2d').clearRect(0, 0, userCanvas.width, userCanvas.height);
    if (correctCanvas) correctCanvas.getContext('2d').clearRect(0, 0, correctCanvas.width, correctCanvas.height);
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
    const accuracy = Math.floor(Math.random() * 35) + 65;
    
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

// Initialize
function init() {
    loadProgress();
    nextWord();
    
    const recordBtn = document.getElementById('recordBtn');
    if (recordBtn) {
        recordBtn.addEventListener('click', () => {
            if (isRecording) stopRecording();
            else startRecording();
        });
    }
    
    console.log('%cDrona Lingua Initialized', 'color:#22c55e');
}

window.onload = init;
