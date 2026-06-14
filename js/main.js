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

// 20 Progressive Modules with Sa/Sha & Z/G focus
const practiceWords = [
    // Module 1-5: Basic Sounds
    { hindi: "साथ", roman: "saath", expected: "saath", type: "S", cue: "Smile lightly, thin sharp hiss" },
    { hindi: "शाम", roman: "shaam", expected: "shaam", type: "SH", cue: "Round lips slightly, soft hush" },
    { hindi: "सब", roman: "sab", expected: "sab", type: "S", cue: "Tongue forward, sharp air" },
    { hindi: "शेर", roman: "sher", expected: "sher", type: "SH", cue: "Tongue slightly back" },
    { hindi: "साल", roman: "saal", expected: "saal", type: "S", cue: "Sharp hiss" },
    
    // Module 6-10: More Pairs
    { hindi: "शादी", roman: "shaadi", expected: "shaadi", type: "SH", cue: "Soft air, rounded lips" },
    { hindi: "सामान", roman: "samaan", expected: "samaan", type: "S", cue: "Clear 's' sound" },
    { hindi: "शहर", roman: "shahar", expected: "shahar", type: "SH", cue: "Hush sound" },
    { hindi: "zoo", roman: "zoo", expected: "zoo", type: "Z", cue: "Vibrate vocal cords - zzz" },
    { hindi: "go", roman: "go", expected: "go", type: "G", cue: "Hard 'g' like goat" },
    
    // Module 11-15: Sentences
    { hindi: "साथ में शाम", roman: "saath mein shaam", expected: "saath mein shaam", type: "Mixed", cue: "Differentiate Sa and Sha" },
    { hindi: "शेर को साथ दो", roman: "sher ko saath do", expected: "sher ko saath do", type: "Mixed", cue: "Clear difference" },
    { hindi: "साल भर का सामान", roman: "saal bhar ka samaan", expected: "saal bhar ka samaan", type: "S", cue: "Focus on S" },
    { hindi: "शहर की शादी", roman: "shahar ki shaadi", expected: "shahar ki shaadi", type: "SH", cue: "Focus on SH" },
    { hindi: "zoo में go", roman: "zoo mein go", expected: "zoo mein go", type: "Z/G", cue: "Z vs G" },
    
    // Module 16-20: Advanced
    { hindi: "सुबह शहर की सैर", roman: "subah shahar ki sair", expected: "subah shahar ki sair", type: "Mixed", cue: "Multiple sounds" },
    { hindi: "सामान शेर के साथ", roman: "samaan sher ke saath", expected: "samaan sher ke saath", type: "Mixed", cue: "Practice flow" },
    { hindi: "ज़ोर से बोलो", roman: "zor se bolo", expected: "zor se bolo", type: "Z", cue: "Strong Z sound" },
    { hindi: "गर्म पानी", roman: "garm paani", expected: "garm paani", type: "G", cue: "Hard G" },
    { hindi: "शाम को साथ चलो", roman: "shaam ko saath chalo", expected: "shaam ko saath chalo", type: "Mixed", cue: "Final challenge" }
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
    document.getElementById('display-username').textContent = username || "Guest";
    document.getElementById('display-level').textContent = level;
}

// Username Screen
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
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        mediaRecorder.onstop = processRecording;
        
        mediaRecorder.start();
        isRecording = true;
        document.getElementById('recordBtn').innerHTML = `<i class="fa-solid fa-stop"></i> Stop Recording`;
    } catch (err) {
        alert("Microphone access needed");
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
    // Simulate accuracy (in real version use speech recognition)
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

// Show Performance Page
function showPerformance() {
    if (username) {
        localStorage.setItem('dronaUsername', username);
    }
    saveProgress();
    window.location.href = 'performance.html';
}

// Initialize App
function initApp() {
    loadProgress();
    if (username) {
        showMainApp();
    } else {
        document.getElementById('username-screen').classList.remove('hidden');
    }
}

window.onload = initApp;

// Make functions globally available for onclick
window.startWithUsername = startWithUsername;
window.showMainApp = showMainApp;
window.nextWord = nextWord;
window.startRecording = startRecording;
window.stopRecording = stopRecording;
window.showPerformance = showPerformance;
