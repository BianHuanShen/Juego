const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let size = 5;
let cellSize;
let path = [];
let playerPath = [];
let level = 1;
let score = 0;
let combo = 1;
let speed = 0;
let startTime;

let currentUser = null;
let users = JSON.parse(localStorage.getItem("users")) || [];

canvas.width = 400;
canvas.height = 400;

function vibrate(ms){
  if(navigator.vibrate) navigator.vibrate(ms);
}

/* AUDIO */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(freq, duration){
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.frequency.value = freq;
  osc.start();

  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  osc.stop(audioCtx.currentTime + duration);
}
/* =========================================
   USERS SYSTEM
========================================= */
function saveUsers() {
  localStorage.setItem(
    "users",
    JSON.stringify(users)
  );
}
function renderUsers() {
  const container =
    document.getElementById("profiles");
  container.innerHTML = "";
  // Ordenar por score descendente
  const sortedUsers = [...users].sort(
    (a, b) => b.score - a.score
  );
  sortedUsers.forEach((user) => {
    // Índice real del usuario
    const realIndex = users.findIndex(
      u => u.name === user.name
    );
    // Card principal
    const card =
      document.createElement("button");
    card.className = "profile-card glow";
    // Rank visual
    let rankIcon = "⚡";
    if (user.score >= 1000) rankIcon = "👑";
    else if (user.score >= 500) rankIcon = "🔥";
    else if (user.score >= 200) rankIcon = "⭐";
    // Contenido HTML
    card.innerHTML = `

      <div class="profile-header">

        <div class="profile-avatar">
          ${rankIcon}
        </div>
        <div class="profile-info">
          <h3>
            ${user.name}
          </h3>
          <p>
            Nivel ${user.level || 1}
          </p>
        </div>
      </div>
      <div class="profile-score">
        <span class="score-label">
          SCORE
        </span>
        <span class="score-value">
          ${Math.floor(user.score)}
        </span>
      </div>
    `;
    // Evento selección
    card.onclick = () => selectUser(realIndex);
    container.appendChild(card);
  });
}
/* =========================================
   CREATE USER MODAL - GOD MODE
========================================= */
function createUser() {
  // Evitar duplicar modal
  if (document.getElementById("userModal")) return;
  // Crear fondo modal
  const modal = document.createElement("div");
  modal.id = "userModal";
  modal.innerHTML = `

    <div class="modal-overlay">

      <div class="modal-box glow">

        <h2>
          👤 Crear Perfil
        </h2>

        <p>
          Ingresa tu nombre de jugador
        </p>

        <input
          type="text"
          id="usernameInput"
          placeholder="Ej: ShadowX"
          maxlength="14"
          autocomplete="off"
        >

        <div class="modal-buttons">

          <button id="cancelUserBtn">
            Cancelar
          </button>

          <button id="saveUserBtn">
            Crear Perfil
          </button>

        </div>

      </div>

    </div>

  `;
  // Insertar modal
  document.body.appendChild(modal);
  // Focus automático
  const input =
    document.getElementById("usernameInput");
  input.focus();
  // Cancelar modal
  document
    .getElementById("cancelUserBtn")
    .onclick = () => {
      modal.remove();
    };
  // Guardar usuario
  document
    .getElementById("saveUserBtn")
    .onclick = saveUser;
  // Enter para guardar
  input.addEventListener("keydown", e => {

    if (e.key === "Enter") {
      saveUser();
    }
  });
  /* =========================
     SAVE USER
  ========================= */
  function saveUser() {
    const cleanName =
      input.value.trim();
    // Validación longitud
    if (cleanName.length < 3) {
      input.style.border =
        "2px solid red";
      input.placeholder =
        "Mínimo 3 caracteres";
      return;
    }
    // Verificar duplicados
    const exists = users.some(
      u =>
        u.name.toLowerCase() ===
        cleanName.toLowerCase()
    );
    if (exists) {
      input.value = "";
      input.style.border =
        "2px solid red";
      input.placeholder =
        "Ese nombre ya existe";
      return;
    }
    // Crear perfil
    users.push({
      name: cleanName,
      score: 0,
      level: 1
    });
    // Guardar
    saveUsers();
    // Actualizar UI
    renderUsers();
    // Cerrar modal
    modal.remove();
  }
}

function selectUser(i) {
  currentUser = users[i];
  // ===== LÍNEA MODIFICADA =====
  score = Number(currentUser.score) || 0;
  level = Number(currentUser.level) || 1;
  // Actualizar UI
  document.getElementById(
    "playerName"
  ).textContent = currentUser.name;
  document.getElementById(
    "score"
  ).textContent = Math.floor(
    score
  );
  // ===== LÍNEA MODIFICADA =====
  document.getElementById(
    "level"
  ).textContent = level;
  // Cambiar pantalla
  showScreen("gameScreen");
  // Iniciar juego
  startGame();
}

/* SCREENS */
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* GAME LOGIC */
function generatePath(){
  let p = [{x:2,y:2}];
  let length = 3 + Math.floor(level/2);
  while(p.length < length){
    let last = p[p.length-1];
    let moves = [
      {x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}
    ];
    let valid = moves
      .map(m=>({x:last.x+m.x,y:last.y+m.y}))
      .filter(n=> n.x>=0 && n.y>=0 && n.x<size && n.y<size &&
        !p.some(pp=>pp.x===n.x && pp.y===n.y));
    if(valid.length===0) break;
    p.push(valid[Math.floor(Math.random()*valid.length)]);
  }
  return p;
}

function drawGrid(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  cellSize = canvas.width / size;
  for(let x=0;x<size;x++){
    for(let y=0;y<size;y++){
      ctx.fillStyle="#222";
      ctx.beginPath();
      ctx.arc(
        x*cellSize+cellSize/2,
        y*cellSize+cellSize/2,
        8,0,Math.PI*2
      );
      ctx.fill();
    }
  }
}

function drawPath(showAll=true){
  ctx.strokeStyle="cyan";
  ctx.lineWidth=5;
  ctx.shadowBlur=15;
  ctx.shadowColor="cyan";
  ctx.beginPath();
  path.forEach((p,i)=>{
    let x = p.x*cellSize+cellSize/2;
    let y = p.y*cellSize+cellSize/2;
    if(i===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  });
  ctx.stroke();
}

function startGame(){
  path = generatePath();
  playerPath = [];
  drawGrid();
  drawPath();
  setTimeout(()=>{
    drawGrid();
    startTime = Date.now();
  },4000);
}
/* INPUT */
canvas.addEventListener("pointerdown", e=>{
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX-rect.left)/cellSize);
  const y = Math.floor((e.clientY-rect.top)/cellSize);
  handleInput(x,y);
});

function handleInput(x,y){
  vibrate(10);
  playSound(400 + playerPath.length*50,0.1);
  const expected = path[playerPath.length];
  if(!expected || expected.x!==x || expected.y!==y){
    fail();
    return;
  }
  playerPath.push({x,y});
  drawGrid();
  drawPlayerPath();
  updateProgress();
  if(playerPath.length === path.length){
    success();
  }
}

function drawPlayerPath(){
  ctx.strokeStyle="lime";
  ctx.lineWidth=5;
  ctx.shadowBlur=15;
  ctx.shadowColor="lime";

  ctx.beginPath();
  playerPath.forEach((p,i)=>{
    let x = p.x*cellSize+cellSize/2;
    let y = p.y*cellSize+cellSize/2;
    if(i===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  });
  ctx.stroke();
}

function updateProgress(){
  const percent = (playerPath.length / path.length)*100;
  document.getElementById("progress").style.width = percent+"%";
}

/* =========================
   RESULTS SYSTEM
========================= */
function success() {
  // Feedback
  vibrate([50, 50, 100]);
  playSound(800, 0.2);
  // ===== LÍNEA MODIFICADA =====
  const elapsedTime = startTime
    ? (Date.now() - startTime) / 1000
    : 0;
  // Bonus entero basado en velocidad
  const speedBonus = Math.floor(
    Math.max(1, 5 - elapsedTime)
  );
  // Puntos base
  const basePoints = 10 * combo;
  // ===== LÍNEA MODIFICADA =====
  score = Number(score) || 0;
  // Score final (solo enteros)
  score += basePoints + speedBonus;
  // Seguridad extra para evitar decimales
  score = Math.floor(score);
  // Incrementos de progreso
  combo++;
  level++;
  // Actualizar UI y guardar datos
  updateScore();
  // Siguiente ronda
  setTimeout(startGame, 500);
}

function fail() {
  // Feedback de error
  vibrate(300);
  playSound(100, 0.3);
  // Reiniciar combo
  combo = 1;
  // Evitar nivel menor a 1
  level = Math.max(1, level - 1);

  // Reiniciar partida
  setTimeout(startGame, 800);
}

function updateScore() {
  // Mostrar score entero
  document.getElementById("score").textContent = Math.floor(score);
  // Guardar progreso usuario
  currentUser.score = Math.floor(score);
  currentUser.level = level;
  // Persistencia local
  saveUsers();
}
function updateScore() {
  // Mostrar score entero
  document.getElementById("score").textContent = Math.floor(score);
  document.getElementById("level").textContent = level;
  // Guardar progreso usuario
  currentUser.score = Math.floor(score);
  currentUser.level = level;
  saveUsers();
}
/* =========================
   INIT
========================= */
renderUsers();
