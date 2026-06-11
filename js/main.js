const API_URL = "https://drona-lingua-backend.onrender.com";

let currentUser = null;
let currentModuleData = null;
let timerInterval = null;
let sessionStartTime = null;
let moduleStartTime = null;
let currentIndex = 0;
let isMinimalPairs = false;

let xp = 0;
let level = 1;
let completedModules = [];

// ==================== WORDBANK ====================
const wordBank = [
  { hindi: "सही", roman: "Sahi", tip: "Soft dental 'Sa'" },
  { hindi: "सरकार", roman: "Sarkar", tip: "Soft 'Sa'" },
  { hindi: "सामान", roman: "Samaan", tip: "Soft 'Sa'" },
  { hindi: "सड़क", roman: "Sadak", tip: "Soft 'Sa'" },
  { hindi: "सफल", roman: "Safal", tip: "Soft 'Sa'" },
  { hindi: "शहर", roman: "Shahar", tip: "Strong 'Sha'" },
  { hindi: "शेर", roman: "Sher", tip: "Strong 'Sha'" },
  { hindi: "शाम", roman: "Shaam", tip: "Strong 'Sha'" },
  { hindi: "शुरू", roman: "Shuru", tip: "Strong 'Sha'" },
  { hindi: "शक्ति", roman: "Shakti", tip: "Strong 'Sha'" },
  { hindi: "Station", roman: "Station", tip: "S-TAY-shun" },
  { hindi: "Attention", roman: "Attention", tip: "uh-TEN-shun" },
  { hindi: "Special", roman: "Special", tip: "SPE-shul" },
  { hindi: "Information", roman: "Information", tip: "in-for-MAY-shun" },
  { hindi: "Education", roman: "Education", tip: "ed-yoo-KAY-shun" },
  { hindi: "Nation", roman: "Nation", tip: "NAY-shun" },
  { hindi: "Action", roman: "Action", tip: "AK-shun" },
  { hindi: "Mention", roman: "Mention", tip: "MEN-shun" },
  { hindi: "Sugar", roman: "Sugar", tip: "SHOO-gar" },
  { hindi: "Sure", roman: "Sure", tip: "SHOOR" },
  { hindi: "Go to the station on time", roman: "Go to the station on time", tip: "Real sentence" },
  { hindi: "Pay attention in class", roman: "Pay attention in class", tip: "School context" },
  { hindi: "शहर में सही सामान है", roman: "Shahar mein sahi samaan hai", tip: "Mixed practice" }
];

// ==================== 20 MODULES ====================
const modules = [
  { id: 1, title: "Module 1: Pure 'Sa' Sound (स)", type: "single", words: [0,1,2,3,4] },
  { id: 2, title: "Module 2: Pure 'Sha' Sound (श)", type: "single", words: [5,6,7,8,9] },
  { id: 3, title: "Module 3: Minimal Pairs Drill", type: "minimal_pairs", pairs: [[0,5], [1,6], [2,7]] },
  { id: 4, title: "Module 4: English - Station & Attention", type: "single", words: [10,11] },
  { id: 5, title: "Module 5: English - Special, Sugar, Sure", type: "single", words: [12,18,19] },
  { id: 6, title: "Module 6: More English Words", type: "single", words: [13,14,15,16,17] },
  { id: 7, title: "Module 7: Real Life Sentences", type: "single", words: [20,21,22] },
  { id: 8, title: "Module 8: Minimal Pairs + English", type: "minimal_pairs", pairs: [[0,5], [10,11]] },
  { id: 9, title: "Module 9: Sales Context", type: "single", words: [0,1,4,5] },
  { id: 10, title: "Module 10: Mixed Review", type: "single", words: [0,5,10,11,12] },
  { id: 11, title: "Module 11: Long Sentences", type: "single", words: [20,21,22] },
  { id: 12, title: "Module 12: Speed Round", type: "single", words: [0,5,10,11,12] },
  { id: 13, title: "Module 13: Hindi Heavy Review", type: "single", words: [0,1,2,3,4] },
  { id: 14, title: "Module 14: English Heavy Review", type: "single", words: [10,11,12,13,14,15] },
  { id: 15, title: "Module 15: Minimal Pairs Challenge", type: "minimal_pairs", pairs: [[0,5], [10,11], [18,19]] },
  { id: 16, title: "Module 16: Complex Sentences", type: "single", words: [20,21,22] },
  { id: 17, title: "Module 17: High Speed Mixed", type: "single", words: [0,5,10,11,12] },
  { id: 18, title: "Module 18: Long Practice", type: "single", words: [20,21,22] },
  { id: 19, title: "Module 19: Full Review Round", type: "single", words: [0,5,10,11,12,18] },
  { id: 20, title: "Module 20: Final Mastery Challenge", type: "single", words: [10,11,12,13,14,15,18] }
];

// ==================== ENTER KEY ====================
function setupEnterKey() {
  const input = document.getElementById("usernameInput");
  if (input) {
    input.addEventListener("keypress", function(e) {
      if (e.key === "Enter") registerUser();
    });
  }
}

// ==================== TIMER ====================
function startSessionTimer() {
  if (sessionStartTime === null) sessionStartTime = Date.now();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
    const min = Math.floor(elapsed / 60);
    const sec = elapsed % 60;
    document.getElementById("timer").textContent = 
      `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
  }, 1000);
}

// ==================== TONGUE POSITION ====================
function showTonguePosition(wordObj) {
  const box = document.getElementById("tonguePositionBox");
  const imageBox = document.getElementById("tongueImage");
  const title = document.getElementById("tongueTitle");
  const tip = document.getElementById("tongueTip");

  box.style.display = "block";
  const hindi = wordObj.hindi.toLowerCase();

  if (hindi.includes("स") || hindi.includes("sa")) {
    imageBox.innerHTML = "👅<br>Upper Teeth";
    title.textContent = "Dental Sound (स)";
    tip.textContent = "Touch the tip of your tongue to your upper front teeth.";
  } else if (hindi.includes("श") || hindi.includes("sha") || hindi.includes("sh")) {
    imageBox.innerHTML = "👅<br>Roof of Mouth";
    title.textContent = "Palatal Sound (श)";
    tip.textContent = "Lift your tongue towards the roof of your mouth.";
  } else {
    imageBox.innerHTML = "👅";
    title.textContent = "Tongue Position";
    tip.textContent = "Focus on where your tongue touches.";
  }
}

// ==================== START MODULE ====================
function startModule(module) {
  currentModuleData = module;
  isMinimalPairs = module.type === "minimal_pairs";
  currentIndex = 0;
  moduleStartTime = Date.now();

  document.getElementById("modulesScreen").style.display = "none";
  document.getElementById("practiceScreen").style.display = "block";
  document.getElementById("moduleTitle").textContent = module.title;

  if (sessionStartTime === null) startSessionTimer();

  if (isMinimalPairs) {
    document.getElementById("singleWordMode").style.display = "none";
    document.getElementById("minimalPairsMode").style.display = "block";
    document.getElementById("listenBtn").style.display = "none";
    loadMinimalPair();
  } else {
    document.getElementById("singleWordMode").style.display = "block";
    document.getElementById("minimalPairsMode").style.display = "none";
    document.getElementById("listenBtn").style.display = "inline-block";
    loadWordFromModule();
  }
}

// ==================== FINISH MODULE ====================
function finishModule() {
  const endTime = Date.now();
  const timeTakenSeconds = Math.floor((endTime - moduleStartTime) / 1000);

  if (currentModuleData && currentUser) {
    fetch(`${API_URL}/api/complete_module/${currentUser}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module_id: currentModuleData.id, time_taken: timeTakenSeconds })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        xp = data.xp;
        level = data.level;
        completedModules = data.completed_modules || [];
      }
      document.getElementById("practiceScreen").style.display = "none";
      document.getElementById("modulesScreen").style.display = "block";
      loadModules();
      updateUI();
    })
    .catch(() => {
      document.getElementById("practiceScreen").style.display = "none";
      document.getElementById("modulesScreen").style.display = "block";
      loadModules();
      updateUI();
    });
  } else {
    document.getElementById("practiceScreen").style.display = "none";
    document.getElementById("modulesScreen").style.display = "block";
    loadModules();
    updateUI();
  }
}

// ==================== LOAD MODULES ====================
function loadModules() {
  const container = document.getElementById("modulesList");
  container.innerHTML = "";

  modules.forEach((mod, index) => {
    const isCompleted = completedModules.includes(mod.id);
    const previousModuleCompleted = index === 0 || completedModules.includes(modules[index - 1].id);
    const isLocked = !previousModuleCompleted;

    const div = document.createElement("div");
    div.className = `module-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
    
    let badge = mod.type === "minimal_pairs" ? " <span style='color:#a78bfa'>[Minimal Pairs]</span>" : "";

    div.innerHTML = `
      <strong>Module ${mod.id}: ${mod.title}</strong>${badge}<br>
      ${isCompleted ? '<span style="color:#22c55e">✓ Completed</span>' : ''}
      ${isLocked ? '<span style="color:#ef4444">🔒 Locked</span>' : ''}
    `;

    if (!isLocked) div.onclick = () => startModule(mod);
    container.appendChild(div);
  });
}

// ==================== REGISTER ====================
async function registerUser() {
  const username = document.getElementById("usernameInput").value.trim();
  if (!username) return alert("Please enter your name");

  const res = await fetch(`${API_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });
  const result = await res.json();
  if (result.status === "success") {
    currentUser = username;
    document.getElementById("registerScreen").style.display = "none";
    document.getElementById("modulesScreen").style.display = "block";
    document.getElementById("userName").textContent = username;
    loadModules();
  }
}

// ==================== LOAD CONTENT ====================
function loadWordFromModule() {
  const wordIndex = currentModuleData.words[currentIndex];
  const q = wordBank[wordIndex];
  document.getElementById("currentWord").textContent = q.hindi;
  document.getElementById("roman").textContent = `${q.roman} — ${q.tip}`;
  showTonguePosition(q);
}

function loadMinimalPair() {
  const pair = currentModuleData.pairs[currentIndex];
  const w1 = wordBank[pair[0]];
  const w2 = wordBank[pair[1]];
  document.getElementById("pairWord1").textContent = w1.hindi;
  document.getElementById("pairRoman1").textContent = w1.roman;
  document.getElementById("pairWord2").textContent = w2.hindi;
  document.getElementById("pairRoman2").textContent = w2.roman;
  showTonguePosition(w1);
}

// ==================== LISTEN ====================
function listenPair(side) {
  const pair = currentModuleData.pairs[currentIndex];
  const idx = side === 0 ? pair[0] : pair[1];
  const utterance = new SpeechSynthesisUtterance(wordBank[idx].hindi);
  utterance.lang = 'hi-IN';
  window.speechSynthesis.speak(utterance);
}

function listenWord() {
  const wordIndex = currentModuleData.words[currentIndex];
  const utterance = new SpeechSynthesisUtterance(wordBank[wordIndex].hindi);
  utterance.lang = 'hi-IN';
  window.speechSynthesis.speak(utterance);
}

// ==================== MARK & NEXT ====================
function markCorrect() {
  xp += 40;
  updateUI();
  nextItem();
}

function markIncorrect() {
  xp += 15;
  updateUI();
  nextItem();
}

function nextItem() {
  currentIndex++;
  const total = isMinimalPairs ? currentModuleData.pairs.length : currentModuleData.words.length;

  if (currentIndex < total) {
    if (isMinimalPairs) loadMinimalPair();
    else loadWordFromModule();
  } else {
    finishModule();
  }
}

function updateUI() {
  document.getElementById("xp").textContent = xp;
  document.getElementById("level").textContent = level;
}

// ==================== INIT ====================
function init() {
  setupEnterKey();
}

init();
