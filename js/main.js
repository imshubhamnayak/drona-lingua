// ==================== DRONA LINGUA - MAIN JS (20 Modules) ====================
const BACKEND_URL = "https://drona-lingua.onrender.com";

let currentUser = null;
let userProgress = {
    modules: {},
    totalPracticed: 0,
    overallScore: 0
};

// ==================== 20 MODULES STRUCTURE ====================
const modules = {
    // ===== PHASE 1: Basic Consonants =====
    "module_1": { id: "module_1", title: "S vs SH - Basic", level: 1, totalWords: 10, words: [...] },
    "module_2": { id: "module_2", title: "Z vs G - Basic", level: 1, totalWords: 12, words: [...] },
    "module_3": { id: "module_3", title: "V vs W", level: 1, totalWords: 10, words: [] },
    "module_4": { id: "module_4", title: "P vs F", level: 1, totalWords: 10, words: [] },
    "module_5": { id: "module_5", title: "T vs TH", level: 1, totalWords: 10, words: [] },

    // ===== PHASE 2: Vowels =====
    "module_6": { id: "module_6", title: "Short vs Long Vowels", level: 2, totalWords: 12, words: [] },
    "module_7": { id: "module_7", title: "A Sound Variations", level: 2, totalWords: 10, words: [] },
    "module_8": { id: "module_8", title: "I Sound Variations", level: 2, totalWords: 10, words: [] },

    // ===== PHASE 3: Common Confusions =====
    "module_9": { id: "module_9", title: "B vs V", level: 3, totalWords: 10, words: [] },
    "module_10": { id: "module_10", title: "D vs T", level: 3, totalWords: 10, words: [] },
    "module_11": { id: "module_11", title: "R Sound", level: 3, totalWords: 10, words: [] },
    "module_12": { id: "module_12", title: "L Sound", level: 3, totalWords: 10, words: [] },

    // ===== PHASE 4: Advanced Pairs =====
    "module_13": { id: "module_13", title: "CH vs J", level: 4, totalWords: 10, words: [] },
    "module_14": { id: "module_14", title: "SH vs ZH", level: 4, totalWords: 8, words: [] },
    "module_15": { id: "module_15", title: "Nasal Sounds (N/NG)", level: 4, totalWords: 10, words: [] },

    // ===== PHASE 5: Fluency & Sentences =====
    "module_16": { id: "module_16", title: "Minimal Pairs in Sentences", level: 5, totalWords: 12, words: [] },
    "module_17": { id: "module_17", title: "Tongue Twisters", level: 5, totalWords: 8, words: [] },
    "module_18": { id: "module_18", title: "Connected Speech", level: 5, totalWords: 10, words: [] },

    // ===== PHASE 6: Mastery =====
    "module_19": { id: "module_19", title: "Mixed Review - Level 1", level: 6, totalWords: 15, words: [] },
    "module_20": { id: "module_20", title: "Final Mastery Test", level: 6, totalWords: 20, words: [] }
};

// Fill S vs SH module with real data (example)
modules.module_1.words = [
    { word: "sun", type: "S", cue: "Sharp air, relaxed lips" },
    { word: "sip", type: "S", cue: "Tongue forward" },
    { word: "see", type: "S", cue: "Smile slightly, thin air" },
    { word: "bus", type: "S", cue: "End with sharp S" },
    { word: "sell", type: "S", cue: "Tongue near teeth ridge" },
    { word: "shoe", type: "SH", cue: "Rounded lips, soft air" },
    { word: "ship", type: "SH", cue: "Tongue slightly back" },
    { word: "she", type: "SH", cue: "Round lips gently" },
    { word: "fish", type: "SH", cue: "End with soft SH" },
    { word: "shell", type: "SH", cue: "Tongue back, lips rounded" }
];

// Fill Z vs G module
modules.module_2.words = [
    { word: "zoo", type: "Z", cue: "zzz-oo" },
    { word: "zip", type: "Z", cue: "zzz-ip" },
    { word: "zero", type: "Z", cue: "zee-ro" },
    { word: "zebra", type: "Z", cue: "zee-bra" },
    { word: "cozy", type: "Z", cue: "koh-zee" },
    { word: "lazy", type: "Z", cue: "lay-zee" },
    { word: "buzz", type: "Z", cue: "buhzz" },
    { word: "go", type: "G", cue: "guh-oh" },
    { word: "game", type: "G", cue: "gaym" },
    { word: "good", type: "G", cue: "guud" },
    { word: "gate", type: "G", cue: "gayt" },
    { word: "give", type: "G", cue: "giv" }
];

// ==================== REST OF THE CODE (Auth, Progress, Scoring) ====================
// (Same as previous version - login, saveProgress, createModal, etc.)

async function loginUser() { /* ... same as before ... */ }
function logout() { /* ... */ }
async function loadUserProgress() { /* ... */ }
async function saveProgress() { /* ... */ }

// Render modules with progress
function renderModules() {
    const container = document.getElementById('modules-container');
    if (!container) return;
    container.innerHTML = '';

    Object.values(modules).forEach(mod => {
        const progress = userProgress.modules?.[mod.id] || { completed: 0, score: 0 };
        const percentage = mod.totalWords > 0 ? Math.round((progress.completed / mod.totalWords) * 100) : 0;

        const div = document.createElement('div');
        div.className = `bg-slate-900 border border-slate-700 p-5 rounded-3xl hover:border-emerald-500 transition cursor-pointer`;
        div.innerHTML = `
            <div class="flex justify-between">
                <div>
                    <div class="font-semibold">${mod.title}</div>
                    <div class="text-xs text-slate-400">Level ${mod.level}</div>
                </div>
                <div class="text-right">
                    <div class="text-emerald-400 font-bold">${percentage}%</div>
                    <div class="text-xs">${progress.completed}/${mod.totalWords}</div>
                </div>
            </div>

            <div class="h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div class="h-2 bg-emerald-500 rounded-full" style="width: ${percentage}%"></div>
            </div>

            <div class="flex justify-between mt-3 text-sm">
                <div>Score: <span class="font-medium">${progress.score || 0}</span></div>
                <button onclick="event.stopImmediatePropagation(); startModule('${mod.id}')" 
                        class="px-4 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-sm">
                    Practice
                </button>
            </div>
        `;
        div.onclick = () => startModule(mod.id);
        container.appendChild(div);
    });
}

// Practice flow with scoring
function startModule(moduleId) {
    const mod = modules[moduleId];
    // ... (same logic as before but using mod.words)
}

function completeWord(moduleId, word) {
    // Update score and progress
    if (!userProgress.modules[moduleId]) {
        userProgress.modules[moduleId] = { completed: 0, score: 0, practicedWords: [] };
    }

    const modProgress = userProgress.modules[moduleId];
    if (!modProgress.practicedWords.includes(word)) {
        modProgress.practicedWords.push(word);
        modProgress.completed = modProgress.practicedWords.length;
        modProgress.score = Math.round((modProgress.completed / modules[moduleId].totalWords) * 100);
    }

    userProgress.totalPracticed = Object.values(userProgress.modules).reduce((sum, m) => sum + (m.completed || 0), 0);
    saveProgress();
    renderModules();
    closeModal();
}

// ==================== INIT ====================
function init() {
    console.log('%c[Drona Lingua] 20 Modules + Scoring System Loaded', 'color:#22c55e');
}

window.onload = init;
