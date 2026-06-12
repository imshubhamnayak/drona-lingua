// ==================== DRONA LINGUA - MAIN JS ====================
const BACKEND_URL = "https://drona-lingua.onrender.com";

let currentUser = null;

// ==================== WORD DATA ====================
const sShWords = [
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

const zgWords = [
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

// ==================== AUTH ====================
async function loginUser() {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
    if (!username) return alert("Please enter your name");

    try {
        let res = await fetch(`${BACKEND_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });

        if (!res.ok) {
            await fetch(`${BACKEND_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
        }

        currentUser = username;
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('user-display').innerText = username;
        loadUserProgress();

    } catch (error) {
        alert("Backend connection failed");
    }
}

function logout() {
    currentUser = null;
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
}

// ==================== PROGRESS ====================
async function loadUserProgress() {
    if (!currentUser) return;
    try {
        const res = await fetch(`${BACKEND_URL}/get-progress/${currentUser}`);
        if (res.ok) {
            const data = await res.json();
            console.log("Progress loaded:", data);
        }
    } catch (err) {}
}

async function saveProgress(progress) {
    if (!currentUser) return;
    try {
        await fetch(`${BACKEND_URL}/save-progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: currentUser, progress })
        });
    } catch (err) {}
}

// ==================== EXERCISE ====================
function startModule(type) {
    if (type === 's_sh') {
        showWordList(sShWords, "S vs SH Practice");
    } else if (type === 'z_g') {
        showWordList(zgWords, "Z vs G Practice");
    }
}

function showWordList(words, title) {
    const modal = createModal(title);
    
    let html = `<div class="p-6">`;
    html += `<div class="grid grid-cols-2 md:grid-cols-3 gap-3">`;

    words.forEach((item, index) => {
        html += `
            <div onclick="practiceWord(${index}, '${item.type}', '${item.word}', '${item.cue}')" 
                 class="word-card bg-slate-800 hover:bg-slate-700 border border-slate-700 p-4 rounded-2xl cursor-pointer">
                <div class="font-semibold text-lg">${item.word}</div>
                <div class="text-xs text-slate-400 mt-1">${item.cue}</div>
            </div>
        `;
    });

    html += `</div></div>`;
    modal.innerHTML = html;
}

function practiceWord(index, type, word, cue) {
    closeModal(); // close word list

    const modal = createModal(`Practice: ${word}`);

    let guideHTML = '';

    if (type === 'S' || type === 'SH') {
        guideHTML = `
            <div class="bg-slate-950 border border-slate-700 rounded-2xl p-4 mb-4 text-sm">
                <div class="font-semibold mb-2 text-blue-400">S vs SH Guide</div>
                <div><strong>Tongue:</strong> Forward (S) vs Slightly back (SH)</div>
                <div><strong>Air:</strong> Thin & sharp (S) vs Wider & softer (SH)</div>
                <div><strong>Lips:</strong> Relaxed (S) vs Slightly rounded (SH)</div>
            </div>
        `;
    } else if (type === 'Z' || type === 'G') {
        guideHTML = `
            <div class="bg-slate-950 border border-slate-700 rounded-2xl p-4 mb-4 text-sm">
                <div class="font-semibold mb-2 text-emerald-400">Z vs G Guide</div>
                <div><strong>Z:</strong> Continuous buzzing sound (can hold it)</div>
                <div><strong>G:</strong> Short stop + release sound (cannot hold it)</div>
            </div>
        `;
    }

    modal.innerHTML = `
        <div class="p-6">
            <div class="text-center mb-6">
                <div class="text-6xl font-bold tracking-wider mb-2">${word}</div>
                <div class="text-emerald-400">${cue}</div>
            </div>

            ${guideHTML}

            <div class="flex gap-3 mt-6">
                <button onclick="closeModal()" 
                        class="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl">
                    Close
                </button>
                <button onclick="markAsPracticed('${word}', '${type}')" 
                        class="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-medium">
                    Mark as Practiced
                </button>
            </div>
        </div>
    `;
}

function markAsPracticed(word, type) {
    closeModal();
    alert(`Great! You practiced "${word}". Progress will be saved in the next update.`);
    // Later we can save this to backend
}

// ==================== MODAL HELPER ====================
function createModal(title) {
    const modal = document.createElement('div');
    modal.className = `fixed inset-0 bg-black/70 flex items-center justify-center z-[999]`;
    modal.innerHTML = `
        <div class="bg-slate-900 border border-slate-700 w-full max-w-md mx-4 rounded-3xl overflow-hidden">
            <div class="flex justify-between items-center px-6 py-4 border-b border-slate-700">
                <h3 class="font-semibold">${title}</h3>
                <button onclick="closeModal()" class="text-2xl text-slate-400 hover:text-white">×</button>
            </div>
            <div id="modal-content"></div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal.querySelector('#modal-content');
}

function closeModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) modal.remove();
}

// ==================== INIT ====================
function init() {
    console.log('%c[Drona Lingua] Updated main.js with word practice + contextual help loaded', 'color:#22c55e');
}

window.onload = init;
