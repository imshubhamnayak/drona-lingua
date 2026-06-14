// ==================== DRONA LINGUA - FULL APP ====================

let username = "";
let score = 0;
let streak = 0;
let level = 1;
let totalWordsPracticed = 0;

const modules = [
    "S vs SH Basics", "Sharp S Practice", "Soft SH Practice", 
    "Minimal Pairs 1", "Minimal Pairs 2", "Z vs G Sounds",
    "Common Words", "Sentence Practice", "Speed Drills", "Advanced Mix"
];

// Show Username Screen
function initApp() {
    username = localStorage.getItem('dronaUsername') || "";
    if (username) {
        showMainApp();
    } else {
        document.getElementById('username-screen').classList.remove('hidden');
    }
}

function startWithUsername() {
    const input = document.getElementById('username-input').value.trim();
    if (input) {
        username = input;
        localStorage.setItem('dronaUsername', username);
        showMainApp();
    }
}

function showMainApp() {
    document.getElementById('username-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    
    document.getElementById('display-username').textContent = username;
    document.getElementById('display-level').textContent = level;
    
    renderModules();
}

function renderModules() {
    const container = document.getElementById('modules-grid');
    container.innerHTML = modules.map((moduleName, index) => `
        <div onclick="startModule(${index})" 
             class="bg-slate-900 hover:bg-slate-800 p-6 rounded-3xl cursor-pointer transition-all">
            <div class="font-semibold text-lg">${moduleName}</div>
            <div class="text-xs text-slate-400 mt-2">20 words • Intermediate</div>
        </div>
    `).join('');
}

function startModule(index) {
    alert(`Starting Module: ${modules[index]}\n\n(Practice screen coming next)`);
    // Here you can later switch to practice mode
}

function showPerformance() {
    alert(`Performance Dashboard for ${username}\n\nScore: ${score}\nStreak: ${streak}\nLevel: ${level}\nWords Practiced: ${totalWordsPracticed}`);
}

// Initialize
window.onload = initApp;
