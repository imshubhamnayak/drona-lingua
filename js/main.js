// ==================== DRONA LINGUA - MAIN JS ====================
const BACKEND_URL = "https://drona-lingua.onrender.com";

let currentUser = null;
let userProgress = {
    practicedWords: [],
    totalPracticed: 0,
    accuracy: 0
};

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

        await loadUserProgress();

    } catch (err) {
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
            userProgress = data;
            updatePerformanceUI();
        }
    } catch (err) {
        console.log("No previous progress found");
    }
}

async function saveProgress() {
    if (!currentUser) return;

    try {
        await fetch(`${BACKEND_URL}/save-progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: currentUser,
                progress: userProgress
            })
        });
    } catch (err) {
        console.error("Failed to save progress");
    }
}

function updatePerformanceUI() {
    // You can expand this later to show in a Performance tab
    console.log("Current Progress:", userProgress);
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

    // === Contextual Help (Only for the current sound) ===
    let helpHTML = '';

    if (type === "S") {
        helpHTML = `
            <div class="bg-blue-950 border border-blue-600/40 p-4 rounded-2xl mb-4 text-sm">
                <div class="font-semibold text-blue-400 mb-1">S Sound Help</div>
                <div>Tongue forward, close to upper teeth ridge</div>
                <div>Thin, sharp air → <span class="font-mono">sssss</span></div>
                <div>Lips relaxed or slightly smiling</div>
            </div>
        `;
    } 
    else if (type === "SH") {
        helpHTML = `
            <div class="bg-orange-950 border border-orange-600/40 p-4 rounded-2xl mb-4 text-sm">
                <div class="font-semibold text-orange-400 mb-1">SH Sound Help</div>
                <div>Tongue slightly back and rounded</div>
                <div>Softer air through wider channel → <span class="font-mono">shhhhh</span></div>
                <div>Lips slightly rounded</div>
            </div>
        `;
    } 
    else if (type === "Z") {
        helpHTML = `
            <div class="bg-emerald-950 border border-emerald-600/40 p-4 rounded-2xl mb-4 text-sm">
                <div class="font-semibold text-emerald-400 mb-1">Z Sound Help</div>
                <div>Tongue forward near upper teeth</div>
                <div>Continuous buzzing sound (vocal cords vibrate)</div>
                <div>You can hold it: <span class="font-mono">zzzzzz</span></div>
            </div>
        `;
    } 
    else if (type === "G") {
        helpHTML = `
            <div class="bg-green-950 border border-green-600/40 p-4 rounded-2xl mb-4 text-sm">
                <div class="font-semibold text-green-400 mb-1">G Sound Help</div>
                <div>Tongue back, touching soft palate</div>
                <div>Short stop + release sound</div>
                <div>Cannot hold it (quick "guh")</div>
            </div>
        `;
    }

    modal.innerHTML = `
        <div class="p-6">
            <div class="text-center mb-6">
                <div class="text-6xl font-bold mb-2">${word}</div>
                <div class="text-emerald-400">${cue}</div>
            </div>

            ${helpHTML}

            <div class="flex gap-3">
                <button onclick="closeModal()" class="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl">Close</button>
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

    if (!userProgress.practicedWords.includes(word)) {
        userProgress.practicedWords.push(word);
        userProgress.totalPracticed = userProgress.practicedWords.length;
    }

    saveProgress();
    alert(`Great! You practiced "${word}". Progress saved.`);
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

// ==================== INIT ====================
function init() {
    console.log('%c[Drona Lingua] Updated with contextual help + performance tracking', 'color:#22c55e');
}

window.onload = init;
