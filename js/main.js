const BACKEND_URL = "https://drona-lingua.onrender.com";

let currentUser = null;
let userProgress = { modules: {}, totalPracticed: 0, overallScore: 0 };
let currentModuleId = null;

// ==================== 20 MODULES ====================
const modules = {
    "mod_1": { id: "mod_1", title: "S vs SH - Basic", level: 1, totalWords: 10, words: [
        { word: "sun", type: "S", cue: "Sharp air, relaxed lips" },
        { word: "sip", type: "S", cue: "Tongue forward" },
        { word: "see", type: "S", cue: "Smile slightly" },
        { word: "bus", type: "S", cue: "End with sharp S" },
        { word: "sell", type: "S", cue: "Tongue near teeth ridge" },
        { word: "shoe", type: "SH", cue: "Rounded lips, soft air" },
        { word: "ship", type: "SH", cue: "Tongue slightly back" },
        { word: "she", type: "SH", cue: "Round lips gently" },
        { word: "fish", type: "SH", cue: "End with soft SH" },
        { word: "shell", type: "SH", cue: "Tongue back, lips rounded" }
    ]},
    "mod_2": { id: "mod_2", title: "Z vs G - Basic", level: 1, totalWords: 12, words: [
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
    ]},
    // Add remaining 18 modules here as needed...
};

// ==================== AUTH ====================
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

// ==================== PROGRESS ====================
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
            <div class="flex justify-between items-start">
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

// ==================== PRACTICE AREA (Dedicated Section) ====================
function startModule(moduleId) {
    currentModuleId = moduleId;
    const mod = modules[moduleId];

    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('practice-area').classList.remove('hidden');

    document.getElementById('practice-module-title').innerText = mod.title;
    document.getElementById('practice-module-subtitle').innerText = `Level ${mod.level} • ${mod.totalWords} words`;

    const listContainer = document.getElementById('practice-words-list');
    listContainer.innerHTML = '';

    mod.words.forEach(item => {
        const div = document.createElement('div');
        div.className = `bg-slate-900 border border-slate-700 p-4 rounded-2xl flex justify-between items-center`;
        div.innerHTML = `
            <div>
                <div class="font-semibold text-lg">${item.word}</div>
                <div class="text-sm text-slate-400">${item.cue}</div>
            </div>
            <button onclick="practiceWord('${item.word}', '${item.type}', '${item.cue}', this)" 
                    class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-sm">
                Practice
            </button>
        `;
        listContainer.appendChild(div);
    });
}

function practiceWord(word, type, cue, buttonElement) {
    const help = getContextualHelp(type);

    const practiceDiv = document.createElement('div');
    practiceDiv.className = `mt-4 bg-slate-800 border border-emerald-600 p-5 rounded-2xl`;
    practiceDiv.innerHTML = `
        <div class="text-center mb-4">
            <div class="text-5xl font-bold">${word}</div>
            <div class="text-emerald-400 mt-1">${cue}</div>
        </div>
        ${help}
        <div class="flex gap-3 mt-5">
            <button onclick="this.closest('.bg-slate-800').remove()" 
                    class="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-2xl">Close</button>
            <button onclick="markWordPracticed('${word}', this)" 
                    class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-medium">
                Mark as Practiced
            </button>
        </div>
    `;

    buttonElement.parentElement.appendChild(practiceDiv);
    buttonElement.style.display = 'none';
}

function getContextualHelp(type) {
    if (type === "S") return `<div class="text-sm bg-blue-950 p-3 rounded-xl">Tongue forward • Thin sharp air • Relaxed lips</div>`;
    if (type === "SH") return `<div class="text-sm bg-orange-950 p-3 rounded-xl">Tongue slightly back • Softer air • Slightly rounded lips</div>`;
    if (type === "Z") return `<div class="text-sm bg-emerald-950 p-3 rounded-xl">Continuous buzzing • Can hold it</div>`;
    if (type === "G") return `<div class="text-sm bg-green-950 p-3 rounded-xl">Short stop + release • Cannot hold it</div>`;
    return '';
}

function markWordPracticed(word, element) {
    const modProgress = userProgress.modules[currentModuleId] || { completed: 0, score: 0, practicedWords: [] };

    if (!modProgress.practicedWords.includes(word)) {
        modProgress.practicedWords.push(word);
        modProgress.completed = modProgress.practicedWords.length;
        modProgress.score = Math.round((modProgress.completed / modules[currentModuleId].totalWords) * 100);
    }

    userProgress.modules[currentModuleId] = modProgress;
    userProgress.totalPracticed = Object.values(userProgress.modules).reduce((sum, m) => sum + (m.completed || 0), 0);

    saveProgress();
    renderModules();

    element.closest('.bg-slate-800').remove();
    alert(`Good! "${word}" marked as practiced.`);
}

function backToModules() {
    document.getElementById('practice-area').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
}

// ==================== PERFORMANCE PAGE ====================
function goToPerformance() {
    if (currentUser) {
        window.location.href = `performance.html?user=${currentUser}`;
    }
}

// ==================== INIT ====================
function init() {
    console.log('%c[Drona Lingua] Refined version loaded', 'color:#22c55e');
}
window.onload = init;
