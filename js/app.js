// js/app.js - Drona Lingua (Updated with Word Practice + Recording)

let currentSoundPair = 's-sh';
let mediaRecorder;
let audioChunks = [];

// ==================== SOUND PAIR SELECTION ====================
function selectSoundPair(pair) {
    currentSoundPair = pair;
    document.querySelectorAll('.sound-tab').forEach(tab => tab.classList.remove('active'));
    event.currentTarget.classList.add('active');
    loadSoundPairContent(pair);
}

function loadSoundPairContent(pair) {
    const container = document.getElementById('main-content');

    if (pair === 's-sh') {
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onclick="goToSoundLab()" class="section-card bg-slate-900 border border-slate-700 hover:border-orange-500 rounded-3xl p-6 cursor-pointer">
                    <div class="flex items-center gap-x-3 mb-4">
                        <i class="fa-solid fa-book text-orange-400 text-2xl"></i>
                        <h3 class="font-semibold text-xl">Sound Lab</h3>
                    </div>
                    <p class="text-slate-400">Learn how S and SH are produced.</p>
                </div>

                <div onclick="goToPracticeArena()" class="section-card bg-slate-900 border border-slate-700 hover:border-emerald-500 rounded-3xl p-6 cursor-pointer">
                    <div class="flex items-center gap-x-3 mb-4">
                        <i class="fa-solid fa-microphone text-emerald-400 text-2xl"></i>
                        <h3 class="font-semibold text-xl">Practice Arena</h3>
                    </div>
                    <p class="text-slate-400">Practice words, minimal pairs & sentences.</p>
                </div>

                <div onclick="goToMastery()" class="section-card bg-slate-900 border border-slate-700 hover:border-purple-500 rounded-3xl p-6 cursor-pointer">
                    <div class="flex items-center gap-x-3 mb-4">
                        <i class="fa-solid fa-chart-line text-purple-400 text-2xl"></i>
                        <h3 class="font-semibold text-xl">Mastery</h3>
                    </div>
                    <p class="text-slate-400">Track your progress.</p>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `<div class="text-center py-12 text-slate-400">Z vs G coming soon...</div>`;
    }
}

// ==================== SOUND LAB ====================
function goToSoundLab() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div class="mb-6 flex items-center gap-x-3">
            <button onclick="loadSoundPairContent('s-sh')" class="flex items-center gap-x-2 text-slate-400 hover:text-white">
                <i class="fa-solid fa-arrow-left"></i> <span>Back</span>
            </button>
            <h2 class="text-2xl font-semibold">S vs SH — Sound Lab</h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- S -->
            <div class="bg-slate-900 border border-slate-700 rounded-3xl p-6">
                <div class="flex items-center gap-x-3 mb-5">
                    <div class="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center"><span class="font-bold text-xl">S</span></div>
                    <h3 class="font-semibold text-xl">S as in <span class="text-blue-400">sun</span></h3>
                </div>
                <div class="space-y-4 text-sm">
                    <div><span class="font-medium text-blue-400">Tongue:</span> Forward, close to upper teeth ridge</div>
                    <div><span class="font-medium text-blue-400">Airflow:</span> Thin, sharp hiss</div>
                    <div><span class="font-medium text-blue-400">Lips:</span> Relaxed / slightly smiling</div>
                    <div><span class="font-medium text-blue-400">Sound:</span> <span class="font-mono">sssss</span></div>
                </div>
            </div>

            <!-- SH -->
            <div class="bg-slate-900 border border-slate-700 rounded-3xl p-6">
                <div class="flex items-center gap-x-3 mb-5">
                    <div class="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center"><span class="font-bold text-xl">SH</span></div>
                    <h3 class="font-semibold text-xl">SH as in <span class="text-orange-400">shoe</span></h3>
                </div>
                <div class="space-y-4 text-sm">
                    <div><span class="font-medium text-orange-400">Tongue:</span> Slightly back and rounded</div>
                    <div><span class="font-medium text-orange-400">Airflow:</span> Softer air through wider channel</div>
                    <div><span class="font-medium text-orange-400">Lips:</span> Slightly rounded</div>
                    <div><span class="font-medium text-orange-400">Sound:</span> <span class="font-mono">shhhhh</span></div>
                </div>
            </div>
        </div>

        <div class="mt-8 text-center">
            <button onclick="goToPracticeArena()" class="px-8 py-3 bg-orange-600 hover:bg-orange-500 rounded-2xl font-medium">
                Start Practicing →
            </button>
        </div>
    `;
}

// ==================== PRACTICE ARENA ====================
function goToPracticeArena() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center gap-x-3">
                <button onclick="loadSoundPairContent('s-sh')" class="flex items-center gap-x-2 text-slate-400 hover:text-white">
                    <i class="fa-solid fa-arrow-left"></i> <span>Back</span>
                </button>
                <h2 class="text-2xl font-semibold">Practice Arena — S vs SH</h2>
            </div>
            <div class="text-sm text-slate-400">Level 1 • Beginner</div>
        </div>

        <div class="flex gap-2 mb-6">
            <button onclick="startMinimalPairs()" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-sm font-medium">Minimal Pairs</button>
            <button onclick="startWordPractice()" class="px-5 py-2 bg-orange-600 hover:bg-orange-500 rounded-2xl text-sm font-medium">Word Practice (Recording)</button>
            <button onclick="startSentencePractice()" class="px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded-2xl text-sm font-medium">Sentences</button>
        </div>

        <div id="practice-content">
            <div class="text-center py-12 text-slate-400">
                Choose a practice mode above.
            </div>
        </div>
    `;
}

// ==================== WORD PRACTICE WITH RECORDING ====================
let currentWord = "";

function startWordPractice() {
    const container = document.getElementById('practice-content');
    
    const words = ["ship", "sip", "shoe", "see", "she", "shell", "seat", "sheet", "save", "shave"];
    currentWord = words[Math.floor(Math.random() * words.length)];

    container.innerHTML = `
        <div class="max-w-md mx-auto bg-slate-900 border border-slate-700 rounded-3xl p-8 text-center">
            <div class="mb-6">
                <div class="text-sm text-orange-400 mb-1">WORD PRACTICE</div>
                <div class="text-6xl font-bold tracking-wide mb-2" id="practice-word">${currentWord}</div>
                <p class="text-slate-400">Listen → Record → Compare</p>
            </div>

            <div class="flex justify-center gap-4 mb-8">
                <button onclick="playWord()" class="flex items-center gap-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl">
                    <i class="fa-solid fa-volume-up"></i>
                    <span>Listen</span>
                </button>

                <button id="record-btn" onclick="startRecording()" class="flex items-center gap-x-2 px-6 py-3 bg-red-600 hover:bg-red-500 rounded-2xl">
                    <i class="fa-solid fa-microphone"></i>
                    <span>Record</span>
                </button>
            </div>

            <div id="recording-status" class="text-sm text-slate-400 mb-4"></div>

            <div class="flex justify-center gap-4">
                <button onclick="checkRecording()" class="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-medium">Check My Pronunciation</button>
                <button onclick="nextWord()" class="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl">Next Word</button>
            </div>
        </div>
    `;
}

function playWord() {
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
}

function startRecording() {
    const status = document.getElementById('recording-status');
    const recordBtn = document.getElementById('record-btn');

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                window.lastRecordedAudio = audioUrl;
                status.innerHTML = `✅ Recording saved. Click "Check My Pronunciation".`;
                recordBtn.innerHTML = `<i class="fa-solid fa-microphone"></i> <span>Record Again</span>`;
            };

            mediaRecorder.start();
            status.innerHTML = `🎙️ Recording... Click again to stop.`;
            recordBtn.onclick = stopRecording;
        })
        .catch(err => {
            alert("Microphone access denied. Please allow microphone permission.");
        });
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }
}

function checkRecording() {
    const status = document.getElementById('recording-status');
    if (!window.lastRecordedAudio) {
        status.innerHTML = `Please record first.`;
        return;
    }

    // Simple feedback for MVP
    status.innerHTML = `
        <div class="text-emerald-400 font-medium">Great effort!</div>
        <div class="text-sm mt-1">Listen to your recording and compare with the correct one.</div>
    `;

    // Play back recording
    const audio = new Audio(window.lastRecordedAudio);
    audio.play();
}

function nextWord() {
    const words = ["ship", "sip", "shoe", "see", "she", "shell", "seat", "sheet", "save", "shave"];
    currentWord = words[Math.floor(Math.random() * words.length)];
    startWordPractice(); // reload with new word
}

// ==================== MINIMAL PAIRS (Existing) ====================
function startMinimalPairs() {
    const container = document.getElementById('practice-content');
    container.innerHTML = `<div class="text-center py-12">Minimal Pairs will be improved in next step.</div>`;
}

function startSentencePractice() {
    const container = document.getElementById('practice-content');
    container.innerHTML = `<div class="text-center py-12">Sentence Practice coming soon.</div>`;
}

function goToMastery() {
    const container = document.getElementById('main-content');
    container.innerHTML = `<div class="text-center py-12">Mastery screen coming soon.</div>`;
}

// Initialize
window.onload = function() {
    loadSoundPairContent('s-sh');
};
