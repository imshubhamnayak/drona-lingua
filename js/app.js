// js/app.js

let currentSoundPair = 's-sh';

function selectSoundPair(pair) {
    currentSoundPair = pair;
    
    // Remove active from all tabs
    document.querySelectorAll('.sound-tab').forEach(tab => tab.classList.remove('active'));
    
    // Add active to clicked tab
    event.currentTarget.classList.add('active');

    loadSoundPairContent(pair);
}

function loadSoundPairContent(pair) {
    const container = document.getElementById('main-content');
    
    if (pair === 's-sh') {
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Sound Lab -->
                <div onclick="goToSoundLab()" class="section-card bg-slate-900 border border-slate-700 rounded-3xl p-6 cursor-pointer">
                    <div class="flex items-center gap-x-3 mb-4">
                        <i class="fa-solid fa-book text-orange-400 text-2xl"></i>
                        <h3 class="font-semibold text-xl">Sound Lab</h3>
                    </div>
                    <p class="text-slate-400">Learn how S and SH are produced with visuals and cues.</p>
                </div>

                <!-- Practice Arena -->
                <div onclick="goToPracticeArena()" class="section-card bg-slate-900 border border-slate-700 rounded-3xl p-6 cursor-pointer">
                    <div class="flex items-center gap-x-3 mb-4">
                        <i class="fa-solid fa-microphone text-emerald-400 text-2xl"></i>
                        <h3 class="font-semibold text-xl">Practice Arena</h3>
                    </div>
                    <p class="text-slate-400">Practice minimal pairs, words, and sentences with feedback.</p>
                </div>

                <!-- Mastery -->
                <div onclick="goToMastery()" class="section-card bg-slate-900 border border-slate-700 rounded-3xl p-6 cursor-pointer">
                    <div class="flex items-center gap-x-3 mb-4">
                        <i class="fa-solid fa-tachometer-alt text-purple-400 text-2xl"></i>
                        <h3 class="font-semibold text-xl">Mastery</h3>
                    </div>
                    <p class="text-slate-400">Track your accuracy and progress for S vs SH.</p>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `<div class="text-center py-12 text-slate-400">Z vs G coming soon...</div>`;
    }
}

// Navigation functions (we'll build these next)
function goToSoundLab() {
    alert("Sound Lab screen will be built next");
}

function goToPracticeArena() {
    alert("Practice Arena will be built next");
}

function goToMastery() {
    alert("Mastery screen will be built next");
}

// Initialize
window.onload = function() {
    loadSoundPairContent('s-sh');
};
