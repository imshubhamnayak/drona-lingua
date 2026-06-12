const BACKEND_URL = "https://drona-lingua.onrender.com";

let currentUser = null;
let userProgress = { modules: {}, totalPracticed: 0, overallScore: 0 };

// ==================== 20 PROGRESSIVE MODULES ====================
const modules = {
    // Phase 1: Basic (Hindi influence)
    "mod_1": { id: "mod_1", title: "S vs SH - Basic", level: 1, totalWords: 10, words: [ /* S & SH words */ ] },
    "mod_2": { id: "mod_2", title: "Z vs G - Basic", level: 1, totalWords: 12, words: [ /* Z & G words */ ] },
    "mod_3": { id: "mod_3", title: "V vs W", level: 1, totalWords: 10, words: [] },
    "mod_4": { id: "mod_4", title: "P vs F", level: 1, totalWords: 10, words: [] },
    "mod_5": { id: "mod_5", title: "T vs TH", level: 1, totalWords: 10, words: [] },

    // Phase 2: Vowels
    "mod_6": { id: "mod_6", title: "Short vs Long Vowels", level: 2, totalWords: 12, words: [] },
    "mod_7": { id: "mod_7", title: "A Sound Variations", level: 2, totalWords: 10, words: [] },
    "mod_8": { id: "mod_8", title: "I & E Sounds", level: 2, totalWords: 10, words: [] },

    // Phase 3: Common Confusions
    "mod_9": { id: "mod_9", title: "B vs V", level: 3, totalWords: 10, words: [] },
    "mod_10": { id: "mod_10", title: "D vs T", level: 3, totalWords: 10, words: [] },
    "mod_11": { id: "mod_11", title: "R Sound Mastery", level: 3, totalWords: 10, words: [] },
    "mod_12": { id: "mod_12", title: "L Sound", level: 3, totalWords: 10, words: [] },

    // Phase 4: Advanced
    "mod_13": { id: "mod_13", title: "CH vs J", level: 4, totalWords: 10, words: [] },
    "mod_14": { id: "mod_14", title: "SH vs ZH", level: 4, totalWords: 8, words: [] },
    "mod_15": { id: "mod_15", title: "Nasal Sounds", level: 4, totalWords: 10, words: [] },

    // Phase 5: Fluency
    "mod_16": { id: "mod_16", title: "Minimal Pairs in Sentences", level: 5, totalWords: 12, words: [] },
    "mod_17": { id: "mod_17", title: "Tongue Twisters", level: 5, totalWords: 8, words: [] },
    "mod_18": { id: "mod_18", title: "Connected Speech", level: 5, totalWords: 10, words: [] },

    // Phase 6: Mastery
    "mod_19": { id: "mod_19", title: "Mixed Review", level: 6, totalWords: 15, words: [] },
    "mod_20": { id: "mod_20", title: "Final Mastery Test", level: 6, totalWords: 20, words: [] }
};

// Fill first two modules with real data (you can expand others similarly)
modules.mod_1.words = [
    { word: "sun", type: "S", cue: "Sharp air, relaxed lips" },
    { word: "sip", type: "S", cue: "Tongue forward" },
    { word: "see", type: "S", cue: "Smile slightly" },
    { word: "shoe", type: "SH", cue: "Rounded lips, soft air" },
    { word: "ship", type: "SH", cue: "Tongue slightly back" },
    { word: "she", type: "SH", cue: "Round lips gently" }
];

modules.mod_2.words = [
    { word: "zoo", type: "Z", cue: "zzz-oo" },
    { word: "zip", type: "Z", cue: "zzz-ip" },
    { word: "cozy", type: "Z", cue: "koh-zee" },
    { word: "go", type: "G", cue: "guh-oh" },
    { word: "game", type: "G", cue: "gaym" },
    { word: "good", type: "G", cue: "guud" }
];

// ==================== AUTH + PROGRESS ====================
async function loginUser() {
    const username = document.getElementById('username').value.trim();
    if (!username) return alert("Please enter your name");

    try {
        let res = await fetch(`${BACKEND_URL}/login`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        if (!res.ok) {
            await fetch(`${BACKEND_URL}/register`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
        }
        currentUser = username;
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('header-user').classList.remove('hidden');
        document.getElementById('user-display').innerText = username;

        await loadUserProgress();
        renderModules();
    } catch (err) {
        alert("Backend connection failed");
    }
}

function logout() {
    currentUser = null;
    location.reload();
}

async function loadUserProgress() {
    if (!currentUser) return;
    try {
        const res = await fetch(`${BACKEND_URL}/get-progress/${currentUser}`);
        if (res.ok) userProgress = await res.json();
    } catch (err) {}
}

async function saveProgress() {
    if (!currentUser) return;
    await fetch(`${BACKEND_URL}/save-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser, progress: userProgress })
    });
}

// ==================== RENDER MODULES ====================
function renderModules() {
    const container = document.getElementById('modules-container');
    container.innerHTML = '';

    Object.values(modules).forEach(mod => {
        const progress = userProgress.modules?.[mod.id] || { completed: 0, score: 0 };
        const percentage = Math.round((progress.completed / mod.totalWords) * 100);

        const div = document.createElement('div');
        div.className = `bg-slate-900 border border-slate-700 p-5 rounded-3xl hover:border-emerald-500 transition cursor-pointer`;
        div.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <div>
                    <div class="font-semibold">${mod.title}</div>
                    <div class="text-xs text-slate-400">Level ${mod.level}</div>
                </div>
                <div class="text-right">
                    <div class="text-emerald-400 font-bold">${percentage}%</div>
                    <div class="text-xs text-slate-400">${progress.completed}/${mod.totalWords}</div>
                </div>
            </div>

            <div class="h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                <div class="h-2 bg-emerald-500 rounded-full" style="width: ${percentage}%"></div>
            </div>

            <div class="flex justify-between text-sm">
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

// ==================== PERFORMANCE MODAL ====================
function showPerformance() {
    const modal = createModal("Your Learning Performance");

    let html = `<div class="p-6">`;
    html += `<div class="mb-4"><strong>Total Words Practiced:</strong> ${userProgress.totalPracticed || 0}</div>`;

    html += `<div class="space-y-3">`;
    Object.values(modules).forEach(mod => {
        const p = userProgress.modules?.[mod.id] || { completed: 0, score: 0 };
        html += `
            <div class="flex justify-between text-sm">
                <div>${mod.title}</div>
                <div class="text-emerald-400">${p.completed}/${mod.totalWords} • Score: ${p.score || 0}</div>
            </div>
        `;
    });
    html += `</div></div>`;

    modal.innerHTML = html;
}

// ==================== PRACTICE FLOW ====================
function startModule(moduleId) {
    const mod = modules[moduleId];
    const modal = createModal(mod.title);

    let html = `<div class="p-6 grid grid-cols-2 gap-3">`;
    mod.words.forEach(item => {
        html += `
            <div onclick="practiceWord('${moduleId}', '${item.word}', '${item.type}', '${item.cue}')" 
                 class="bg-slate-800 hover:bg-slate-700 p-4 rounded-2xl cursor-pointer">
                <div class="font-semibold">${item.word}</div>
                <div class="text-xs text-slate-400">${item.cue}</div>
            </div>
        `;
    });
    html += `</div>`;
    modal.innerHTML = html;
}

function practiceWord(moduleId, word, type, cue) {
    closeModal();
    const modal = createModal(`Practice: ${word}`);

    const help = getContextualHelp(type);

    modal.innerHTML = `
        <div class="p-6">
            <div class="text-center mb-6">
                <div class="text-6xl font-bold">${word}</div>
                <div class="text-emerald-400 mt-1">${cue}</div>
            </div>
            ${help}
            <div class="flex gap-3 mt-6">
                <button onclick="closeModal()" class="flex-1 py-3 bg-slate-700 rounded-2xl">Close</button>
                <button onclick="completeWord('${moduleId}', '${word}')" 
                        class="flex-1 py-3 bg-emerald-600 rounded-2xl font-medium">
                    Mark as Practiced
                </button>
            </div>
        </div>
    `;
}

function getContextualHelp(type) {
    if (type === "S") return `<div class="bg-blue-950 p-4 rounded-2xl text-sm mb-4">Tongue forward • Thin sharp air • Relaxed lips</div>`;
    if (type === "SH") return `<div class="bg-orange-950 p-4 rounded-2xl text-sm mb-4">Tongue slightly back • Softer air • Slightly rounded lips</div>`;
    if (type === "Z") return `<div class="bg-emerald-950 p-4 rounded-2xl text-sm mb-4">Continuous buzzing • Can hold it</div>`;
    if (type === "G") return `<div class="bg-green-950 p-4 rounded-2xl text-sm mb-4">Short stop + release • Cannot hold it</div>`;
    return '';
}

function completeWord(moduleId, word) {
    closeModal();

    if (!userProgress.modules[moduleId]) {
        userProgress.modules[moduleId] = { completed: 0, score: 0, practicedWords: [] };
    }

    const modP = userProgress.modules[moduleId];
    if (!modP.practicedWords.includes(word)) {
        modP.practicedWords.push(word);
        modP.completed = modP.practicedWords.length;
        modP.score = Math.round((modP.completed / modules[moduleId].totalWords) * 100);
    }

    userProgress.totalPracticed = Object.values(userProgress.modules).reduce((sum, m) => sum + (m.completed || 0), 0);
    saveProgress();
    renderModules();
    alert(`Good! "${word}" marked as practiced.`);
}

// ==================== MODAL + INIT ====================
function createModal(title) {
    const modal = document.createElement('div');
    modal.className = `fixed inset-0 bg-black/70 flex items-center justify-center z-[999]`;
    modal.innerHTML = `
        <div class="bg-slate-900 border border-slate-700 w-full max-w-md mx-4 rounded-3xl overflow-hidden">
            <div class="flex justify-between px-6 py-4 border-b border-slate-700">
                <h3 class="font-semibold">${title}</h3>
                <button onclick="closeModal()" class="text-2xl">×</button>
            </div>
            <div id="modal-content"></div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal.querySelector('#modal-content');
}

function closeModal() {
    document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
}

function init() {
    console.log('%c[Drona Lingua] 20 Modules + Performance Ready', 'color:#22c55e');
}
window.onload = init;
