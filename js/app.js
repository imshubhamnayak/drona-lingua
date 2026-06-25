// js/app.js

let currentSoundPair = 's-sh';

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
                <!-- Sound Lab -->
                <div onclick="goToSoundLab()" class="section-card bg-slate-900 border border-slate-700 hover:border-orange-500 rounded-3xl p-6 cursor-pointer">
                    <div class="flex items-center gap-x-3 mb-4">
                        <i class="fa-solid fa-book text-orange-400 text-2xl"></i>
                        <h3 class="font-semibold text-xl">Sound Lab</h3>
                    </div>
                    <p class="text-slate-400">Learn how S and SH are produced with clear visuals.</p>
                </div>

                <!-- Practice Arena -->
                <div onclick="goToPracticeArena()" class="section-card bg-slate-900 border border-slate-700 hover:border-emerald-500 rounded-3xl p-6 cursor-pointer">
                    <div class="flex items-center gap-x-3 mb-4">
                        <i class="fa-solid fa-microphone text-emerald-400 text-2xl"></i>
                        <h3 class="font-semibold text-xl">Practice Arena</h3>
                    </div>
                    <p class="text-slate-400">Practice words, minimal pairs & sentences.</p>
                </div>

                <!-- Mastery -->
                <div onclick="goToMastery()" class="section-card bg-slate-900 border border-slate-700 hover:border-purple-500 rounded-3xl p-6 cursor-pointer">
                    <div class="flex items-center gap-x-3 mb-4">
                        <i class="fa-solid fa-chart-line text-purple-400 text-2xl"></i>
                        <h3 class="font-semibold text-xl">Mastery</h3>
                    </div>
                    <p class="text-slate-400">Track your accuracy and progress.</p>
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
                <i class="fa-solid fa-arrow-left"></i>
                <span>Back</span>
            </button>
            <h2 class="text-2xl font-semibold">S vs SH — Sound Lab</h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- S -->
            <div class="bg-slate-900 border border-slate-700 rounded-3xl p-6">
                <div class="flex items-center gap-x-3 mb-5">
                    <div class="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                        <span class="font-bold text-xl">S</span>
                    </div>
                    <h3 class="font-semibold text-xl">S as in <span class="text-blue-400">sun</span></h3>
                </div>
                <div class="space-y-4 text-sm">
                    <div><span class="font-medium text-blue-400">Tongue:</span> Forward, close to upper teeth ridge</div>
                    <div><span class="font-medium text-blue-400">Airflow:</span> Thin, sharp hiss through narrow gap</div>
                    <div><span class="font-medium text-blue-400">Lips:</span> Relaxed or slightly smiling</div>
                    <div><span class="font-medium text-blue-400">Sound:</span> <span class="font-mono">sssss</span></div>
                </div>
            </div>

            <!-- SH -->
            <div class="bg-slate-900 border border-slate-700 rounded-3xl p-6">
                <div class="flex items-center gap-x-3 mb-5">
                    <div class="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center">
                        <span class="font-bold text-xl">SH</span>
                    </div>
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
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>Back</span>
                </button>
                <h2 class="text-2xl font-semibold">Practice Arena — S vs SH</h2>
            </div>
            <div class="text-sm text-slate-400">Level 1 • Beginner</div>
        </div>

        <!-- Practice Mode Tabs -->
        <div class="flex gap-2 mb-6">
            <button onclick="startMinimalPairs()" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-sm font-medium">Minimal Pairs</button>
            <button onclick="startWordPractice()" class="px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded-2xl text-sm font-medium">Word Practice</button>
            <button onclick="startSentencePractice()" class="px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded-2xl text-sm font-medium">Sentences</button>
        </div>

        <div id="practice-content">
            <div class="text-center py-12 text-slate-400">
                Choose a practice mode above to begin.
            </div>
        </div>
    `;
}

// ==================== MINIMAL PAIRS ====================
function startMinimalPairs() {
    const container = document.getElementById('practice-content');
    
    container.innerHTML = `
        <div class="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-2xl mx-auto">
            <div class="text-center mb-8">
                <div class="text-sm text-emerald-400 mb-1">MINIMAL PAIRS</div>
                <h3 class="text-2xl font-semibold">Choose the correct pronunciation</h3>
            </div>

            <div class="text-center mb-8">
                <div class="text-5xl font-semibold tracking-wide mb-2" id="minimal-pair-word">sip</div>
                <div class="text-slate-400">Which one did you hear?</div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-8">
                <button onclick="checkMinimalPairAnswer(this, 'S')" 
                        class="py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-2xl text-lg font-medium">S</button>
                <button onclick="checkMinimalPairAnswer(this, 'SH')" 
                        class="py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-2xl text-lg font-medium">SH</button>
            </div>

            <div class="text-center">
                <button onclick="nextMinimalPair()" class="px-8 py-3 bg-orange-600 hover:bg-orange-500 rounded-2xl font-medium">
                    Next Pair
                </button>
            </div>
        </div>
    `;
    
    // Load first pair
    window.currentMinimalPair = { word: "sip", correct: "S" };
}

function checkMinimalPairAnswer(button, answer) {
    const correct = window.currentMinimalPair.correct;
    
    if (answer === correct) {
        button.classList.add('!bg-emerald-600', '!border-emerald-500');
        setTimeout(() => {
            alert("Correct! Good job.");
            nextMinimalPair();
        }, 600);
    } else {
        button.classList.add('!bg-red-600', '!border-red-500');
        setTimeout(() => {
            alert(`Not quite. The correct answer was ${correct}.`);
        }, 600);
    }
}

function nextMinimalPair() {
    const container = document.getElementById('practice-content');
    // Simple demo pairs
    const pairs = [
        { word: "sip", correct: "S" },
        { word: "ship", correct: "SH" },
        { word: "see", correct: "S" },
        { word: "she", correct: "SH" },
        { word: "sell", correct: "S" },
        { word: "shell", correct: "SH" }
    ];
    
    const random = pairs[Math.floor(Math.random() * pairs.length)];
    window.currentMinimalPair = random;
    
    container.innerHTML = `
        <div class="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-2xl mx-auto">
            <div class="text-center mb-8">
                <div class="text-sm text-emerald-400 mb-1">MINIMAL PAIRS</div>
                <h3 class="text-2xl font-semibold">Choose the correct pronunciation</h3>
            </div>

            <div class="text-center mb-8">
                <div class="text-5xl font-semibold tracking-wide mb-2" id="minimal-pair-word">${random.word}</div>
                <div class="text-slate-400">Which one did you hear?</div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-8">
                <button onclick="checkMinimalPairAnswer(this, 'S')" class="py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-2xl text-lg font-medium">S</button>
                <button onclick="checkMinimalPairAnswer(this, 'SH')" class="py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-2xl text-lg font-medium">SH</button>
            </div>

            <div class="text-center">
                <button onclick="nextMinimalPair()" class="px-8 py-3 bg-orange-600 hover:bg-orange-500 rounded-2xl font-medium">
                    Next Pair
                </button>
            </div>
        </div>
    `;
}

// ==================== WORD PRACTICE (Placeholder) ====================
function startWordPractice() {
    const container = document.getElementById('practice-content');
    container.innerHTML = `
        <div class="text-center py-12">
            <h3 class="text-xl font-semibold mb-2">Word Practice</h3>
            <p class="text-slate-400">Coming in the next update (with voice recording).</p>
            <button onclick="goToPracticeArena()" class="mt-6 px-6 py-2 bg-slate-700 rounded-2xl">Back to Practice Arena</button>
        </div>
    `;
}

function startSentencePractice() {
    const container = document.getElementById('practice-content');
    container.innerHTML = `
        <div class="text-center py-12">
            <h3 class="text-xl font-semibold mb-2">Sentence Practice</h3>
            <p class="text-slate-400">Coming soon...</p>
            <button onclick="goToPracticeArena()" class="mt-6 px-6 py-2 bg-slate-700 rounded-2xl">Back</button>
        </div>
    `;
}

// ==================== MASTERY ====================
function goToMastery() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div class="text-center py-12">
            <h2 class="text-2xl font-semibold mb-2">Mastery</h2>
            <p class="text-slate-400">Progress tracking will be added soon.</p>
            <button onclick="loadSoundPairContent('s-sh')" class="mt-6 px-6 py-2 bg-slate-700 rounded-2xl">Back</button>
        </div>
    `;
}

// Initialize
window.onload = function() {
    loadSoundPairContent('s-sh');
};
