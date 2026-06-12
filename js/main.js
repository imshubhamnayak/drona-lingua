// ==================== DRONA LINGUA - MAIN JS ====================
const BACKEND_URL = "https://drona-lingua.onrender.com";

let currentUser = null;

// Word Data
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
    const username = document.getElementById('username').value.trim();
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

    } catch (err) {
        alert("Backend connection failed. Check Render URL.");
    }
}

function logout() {
    currentUser = null;
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('username').value = '';
}

// ==================== PRACTICE ====================
function startModule(type) {
    if (type === 's_sh') {
        showWordList(sShWords, "S vs SH Practice");
    } else if (type === 'z_g') {
        showWordList(zgWords, "Z vs G Practice");
    }
}

function showWordList(words, title) {
    const modal = createModal(title);
    let html = `<div class="p-6"><div class="grid grid-cols-2 gap-3">`;

    words.forEach((item) => {
        html += `
            <div onclick="practiceWord('${item.word}', '${item.type}', '${item.cue}')" 
                 class="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-4 rounded-2xl cursor-pointer">
                <div class="font-semibold text-lg">${item.word}</div>
                <div class="text-xs text-slate-400 mt-1">${item.cue}</div>
            </div>
        `;
    });

    html += `</div></div>`;
    modal.innerHTML = html;
}

function practiceWord(word, type, cue) {
    closeModal();

    const modal = createModal(`Practice: ${word}`);

    let guide = '';

    if (type === 'S' || type === 'SH') {
        guide = `
            <div class="bg-slate-950 border border-slate-700 rounded-2xl p-4 mb-4 text-sm">
                <div class="font-semibold text-blue-400 mb-2">S vs SH Help</div>
                <div><strong>Tongue:</strong> Forward (S) vs Slightly back (SH)</div>
                <div><strong>Air:</strong> Thin & sharp (S) vs Wider & softer (SH)</div>
                <div><strong>Lips:</strong> Relaxed (S) vs Slightly rounded (SH)</div>
            </div>
        `;
    } else {
        guide = `
            <div class="bg-slate-950 border border-slate-700 rounded-2xl p-4 mb-4 text-sm">
                <div class="font-semibold text-emerald-400 mb-2">Z vs G Help</div>
                <div><strong>Z:</strong> Continuous buzzing (can hold it)</div>
                <div><strong>G:</strong> Short stop + release (cannot hold it)</div>
            </div>
        `;
    }

    modal.innerHTML = `
        <div class="p-6">
            <div class="text-center mb-6">
                <div class="text-6xl font-bold mb-2">${word}</div>
                <div class="text-emerald-400">${cue}</div>
            </div>

            ${guide}

            <div class="flex gap-3">
                <button onclick="closeModal()" class="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl">Close</button>
                <button onclick="markPracticed('${word}')" class="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-medium">
                    Mark as Practiced
                </button>
            </div>
        </div>
    `;
}

function markPracticed(word) {
    closeModal();
    alert(`Good job! You practiced "${word}".`);
    // Later we can save this to backend
}

// ==================== MODAL ====================
function createModal(title) {
    const modal = document.createElement('div');
    modal.className = `fixed inset-0 bg-black/70 flex items-center justify-center z-[999]`;
    modal.innerHTML = `
        <div class="bg-slate-900 border border-slate-700 w-full max-w-md mx-4 rounded-3xl overflow-hidden">
            <div class="flex justify-between items-center px-6 py-4 border-b border-slate-700">
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
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) modal.remove();
}

// Init
function init() {
    console.log('%c[Drona Lingua] main.js loaded successfully', 'color:#22c55e');
}
window.onload = init;
