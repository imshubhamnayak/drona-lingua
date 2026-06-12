// ==================== DRONA LINGUA - MAIN JS ====================
const BACKEND_URL = "https://drona-lingua.onrender.com";

let currentUser = null;

// ==================== AUTH ====================
async function loginUser() {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();

    if (!username) {
        alert("Please enter your name");
        return;
    }

    try {
        // Try login first
        let res = await fetch(`${BACKEND_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });

        if (!res.ok) {
            // If user doesn't exist, register
            await fetch(`${BACKEND_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
        }

        currentUser = username;

        // Hide login, show main content
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('user-display').innerText = username;

        // Load progress
        loadUserProgress();

    } catch (error) {
        console.error(error);
        alert("Failed to connect to backend. Please check your Render URL.");
    }
}

function logout() {
    currentUser = null;
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('username').value = '';
}

// ==================== PROGRESS ====================
async function loadUserProgress() {
    if (!currentUser) return;

    try {
        const res = await fetch(`${BACKEND_URL}/get-progress/${currentUser}`);
        if (res.ok) {
            const data = await res.json();
            console.log("User progress loaded:", data);
            // You can update UI with progress here later
        }
    } catch (err) {
        console.log("No previous progress found");
    }
}

async function saveProgress(progress) {
    if (!currentUser) return;

    try {
        await fetch(`${BACKEND_URL}/save-progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: currentUser,
                progress: progress
            })
        });
        console.log("Progress saved successfully");
    } catch (err) {
        console.error("Failed to save progress", err);
    }
}

// ==================== MODULES ====================
function startModule(type) {
    if (type === 's_sh') {
        showSvsSHModule();
    } else if (type === 'z_g') {
        showZvsGModule();
    }
}

function showSvsSHModule() {
    const modal = createModal("S vs SH Practice");
    modal.innerHTML = `
        <div class="p-6">
            <h3 class="text-xl font-semibold mb-4">S vs SH Practice</h3>
            <p class="text-slate-400 mb-4">Coming soon: Interactive practice with scoring.</p>
            
            <div class="space-y-2">
                <div class="bg-slate-800 p-3 rounded-2xl">sun — sip — see — sell — seat</div>
                <div class="bg-slate-800 p-3 rounded-2xl">shoe — ship — she — shell — sheet</div>
            </div>

            <button onclick="closeModal()" 
                    class="mt-6 w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-2xl font-medium">
                Close
            </button>
        </div>
    `;
}

function showZvsGModule() {
    const modal = createModal("Z vs G Practice");
    modal.innerHTML = `
        <div class="p-6">
            <h3 class="text-xl font-semibold mb-4">Z vs G Practice</h3>
            <p class="text-slate-400 mb-4">Coming soon: Interactive practice with scoring.</p>
            
            <div class="space-y-2">
                <div class="bg-slate-800 p-3 rounded-2xl">zoo — zip — zero — zebra — zone — cozy — lazy — buzz</div>
                <div class="bg-slate-800 p-3 rounded-2xl">go — game — good — gate — give — grape</div>
            </div>

            <button onclick="closeModal()" 
                    class="mt-6 w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-2xl font-medium">
                Close
            </button>
        </div>
    `;
}

function createModal(title) {
    const modal = document.createElement('div');
    modal.className = `fixed inset-0 bg-black/70 flex items-center justify-center z-50`;
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

// ==================== INITIALIZATION ====================
function init() {
    console.log('%c[Drona Lingua] main.js loaded successfully', 'color:#22c55e');

    // Auto-login if user was previously logged in (simple version)
    const savedUser = localStorage.getItem('drona_user');
    if (savedUser) {
        currentUser = savedUser;
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('user-display').innerText = savedUser;
        loadUserProgress();
    }
}

window.onload = init;
