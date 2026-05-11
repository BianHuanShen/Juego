const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d", {
  alpha: false,
  desynchronized: true
});

/* =========================================
   CANVAS ENGINE
========================================= */

let canvasSize = 400;

let dpr = Math.min(
  window.devicePixelRatio || 1,
  2
);

let lastFrameTime = 0;

let deltaTime = 0;

let needsRender = true;

let animationFrameId = null;

/* =========================================
   GAME STATE
========================================= */

let size = 9;

let cellSize = 0;

let path = [];

let playerPath = [];

let level = 1;

let score = 0;

let combo = 1;

let speed = 0;

let startTime = 0;

let currentUser = null;

let users =
  JSON.parse(
    localStorage.getItem("users")
  ) || [];

/* =========================================
   POINTER
========================================= */

let pointerActive = false;

let inputLocked = false;

let lastPointerX = -1;

let lastPointerY = -1;

/* =========================================
   AUDIO
========================================= */

let audioCtx = null;

function initAudio() {

  if(audioCtx)
    return;

  try {

    audioCtx =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

  } catch(err) {

    console.warn(
      "AudioContext not supported"
    );
  }
}

function playSound(freq, duration){

  if(!audioCtx)
    return;

  const osc =
    audioCtx.createOscillator();

  const gain =
    audioCtx.createGain();

  osc.connect(gain);

  gain.connect(audioCtx.destination);

  osc.frequency.value = freq;

  gain.gain.value = 0.05;

  osc.start();

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + duration
  );

  osc.stop(
    audioCtx.currentTime + duration
  );
}

/* =========================================
   VIBRATION
========================================= */

function vibrate(ms){

  if(
    navigator.vibrate &&
    typeof navigator.vibrate === "function"
  ){
    navigator.vibrate(ms);
  }
}

/* =========================================
   LEVELS
========================================= */

const levels = [
  {
    level:1,
    name:"Mini Línea",
    points:[
      {x:3,y:4},
      {x:4,y:4}
    ]
  },
  {
    level:2,
    name:"Línea Fácil",
    points:[
      {x:2,y:4},
      {x:3,y:4},
      {x:4,y:4}
    ]
  },
  {
    level:3,
    name:"Cuadrado Simple",
    points:[
      {x:3,y:3},
      {x:5,y:3},
      {x:5,y:5},
      {x:3,y:5},
      {x:3,y:3}
    ]
  },
  {
    level:4,
    name:"Triángulo Fácil",
    points:[
      {x:4,y:2},
      {x:6,y:6},
      {x:2,y:6},
      {x:4,y:2}
    ]
  },
  {
    level:5,
    name:"Línea",
    points:[
      {x:2,y:4},
      {x:3,y:4},
      {x:4,y:4},
      {x:5,y:4}
    ]
  }
];

/* =========================================
   GAME LOGIC
========================================= */

function generatePath(){

  const index =
    Math.min(
      level - 1,
      levels.length - 1
    );

  return levels[index].points.slice();
}

/* =========================================
   RENDER ENGINE
========================================= */

function requestRender(){

  needsRender = true;
}

function resizeCanvas(){

  const rect =
    canvas.getBoundingClientRect();

  canvasSize =
    Math.floor(
      Math.min(
        rect.width || 400,
        rect.height || 400
      )
    );

  if(canvasSize <= 0){
    canvasSize = 400;
  }

  dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );

  canvas.width =
    Math.floor(canvasSize * dpr);

  canvas.height =
    Math.floor(canvasSize * dpr);

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

  cellSize =
    canvasSize / size;

  if(!isFinite(cellSize) || cellSize <= 0){
    cellSize = 40;
  }

  ctx.lineCap = "round";

  ctx.lineJoin = "round";

  requestRender();
}

function render(){

  if(!needsRender)
    return;

  ctx.clearRect(
    0,
    0,
    canvasSize,
    canvasSize
  );

  drawGrid();

  if(path.length && !inputLocked){
    drawPath();
  }

  if(playerPath.length){
    drawPlayerPath();
  }

  needsRender = false;
}

function gameLoop(timestamp){

  if(!lastFrameTime){
    lastFrameTime = timestamp;
  }

  deltaTime =
    (timestamp - lastFrameTime) / 1000;

  if(deltaTime > 0.1){
    deltaTime = 0.1;
  }

  lastFrameTime = timestamp;

  render();

  animationFrameId =
    requestAnimationFrame(gameLoop);
}

/* =========================================
   GRID
========================================= */

function drawGrid(){

  ctx.fillStyle = "#0b1020";

  ctx.fillRect(
    0,
    0,
    canvasSize,
    canvasSize
  );

  ctx.fillStyle = "#222";

  for(let x = 0; x < size; x++){

    for(let y = 0; y < size; y++){

      ctx.beginPath();

      ctx.arc(
        x * cellSize + cellSize / 2,
        y * cellSize + cellSize / 2,
        Math.max(
          4,
          cellSize * 0.12
        ),
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  }
}

function drawPath(){

  if(!path.length)
    return;

  ctx.save();

  ctx.strokeStyle = "cyan";

  ctx.lineWidth =
    Math.max(
      3,
      cellSize * 0.10
    );

  if(dpr <= 1.5){

    ctx.shadowBlur = 10;

    ctx.shadowColor = "cyan";
  }

  ctx.beginPath();

  for(let i = 0; i < path.length; i++){

    const p = path[i];

    const x =
      p.x * cellSize + cellSize / 2;

    const y =
      p.y * cellSize + cellSize / 2;

    if(i === 0){
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();

  ctx.restore();
}

function drawPlayerPath(){

  if(!playerPath.length)
    return;

  ctx.save();

  ctx.strokeStyle = "lime";

  ctx.lineWidth =
    Math.max(
      3,
      cellSize * 0.10
    );

  if(dpr <= 1.5){

    ctx.shadowBlur = 10;

    ctx.shadowColor = "lime";
  }

  ctx.beginPath();

  for(let i = 0; i < playerPath.length; i++){

    const p = playerPath[i];

    const x =
      p.x * cellSize + cellSize / 2;

    const y =
      p.y * cellSize + cellSize / 2;

    if(i === 0){
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();

  ctx.restore();
}

/* =========================================
   START GAME
========================================= */

function startGame(){

  inputLocked = true;

  path = generatePath();

  playerPath = [];

  updateProgress();

  updateFigureName();

  requestRender();

  const previewTime =
    Math.max(
      1500,
      4000 - (level * 20)
    );

  setTimeout(() => {

    inputLocked = false;

    startTime = performance.now();

    requestRender();

  }, previewTime);
}

function updateFigureName(){

  const index =
    Math.min(
      level - 1,
      levels.length - 1
    );

  const figure =
    levels[index];

  const figureName =
    document.getElementById(
      "figureName"
    );

  if(figureName){

    figureName.textContent =
      figure.name || "";
  }
}

/* =========================================
   INPUT
========================================= */

function getCanvasPosition(clientX, clientY){

  const rect =
    canvas.getBoundingClientRect();

  const scaleX =
    canvasSize / rect.width;

  const scaleY =
    canvasSize / rect.height;

  const x =
    Math.floor(
      ((clientX - rect.left) * scaleX) /
      cellSize
    );

  const y =
    Math.floor(
      ((clientY - rect.top) * scaleY) /
      cellSize
    );

  return { x, y };
}

canvas.addEventListener(
  "pointerdown",
  e => {

    e.preventDefault();

    initAudio();

    pointerActive = true;

    canvas.setPointerCapture(
      e.pointerId
    );

    const pos =
      getCanvasPosition(
        e.clientX,
        e.clientY
      );

    lastPointerX = pos.x;

    lastPointerY = pos.y;

    handleInput(
      pos.x,
      pos.y
    );
  },
  { passive:false }
);

canvas.addEventListener(
  "pointermove",
  e => {

    if(!pointerActive)
      return;

    e.preventDefault();

    const pos =
      getCanvasPosition(
        e.clientX,
        e.clientY
      );

    if(
      pos.x === lastPointerX &&
      pos.y === lastPointerY
    ){
      return;
    }

    lastPointerX = pos.x;

    lastPointerY = pos.y;

    handleInput(
      pos.x,
      pos.y
    );
  },
  { passive:false }
);

function stopPointer(){

  pointerActive = false;

  lastPointerX = -1;

  lastPointerY = -1;
}

canvas.addEventListener(
  "pointerup",
  stopPointer,
  { passive:true }
);

canvas.addEventListener(
  "pointercancel",
  stopPointer,
  { passive:true }
);

canvas.addEventListener(
  "lostpointercapture",
  stopPointer,
  { passive:true }
);

/* =========================================
   HANDLE INPUT
========================================= */

function handleInput(x, y){

  if(inputLocked)
    return;

  if(
    x < 0 ||
    y < 0 ||
    x >= size ||
    y >= size
  ){
    return;
  }

  const expected =
    path[playerPath.length];

  if(!expected){

    fail();

    return;
  }

  if(
    expected.x !== x ||
    expected.y !== y
  ){

    fail();

    return;
  }

  vibrate(10);

  playSound(
    400 + playerPath.length * 50,
    0.08
  );

  playerPath.push({ x, y });

  updateProgress();

  requestRender();

  if(
    playerPath.length ===
    path.length
  ){

    success();
  }
}

/* =========================================
   PROGRESS
========================================= */

function updateProgress(){

  const progress =
    document.getElementById(
      "progress"
    );

  const percent =
    path.length
      ? (
          playerPath.length /
          path.length
        ) * 100
      : 0;

  progress.style.width =
    percent + "%";
}

/* =========================================
   RESULTS
========================================= */

function success(){

  inputLocked = true;

  vibrate([50,50,100]);

  playSound(800,0.2);

  const elapsedTime =
    startTime
      ? (
          performance.now() -
          startTime
        ) / 1000
      : 0;

  const speedBonus =
    Math.floor(
      Math.max(
        1,
        5 - elapsedTime
      )
    );

  const basePoints =
    10 * combo;

  score =
    Number(score) || 0;

  score +=
    basePoints + speedBonus;

  score =
    Math.floor(score);

  combo++;

  level++;

  updateScore();

  setTimeout(
    startGame,
    500
  );
}

function fail(){

  inputLocked = true;

  vibrate(300);

  playSound(100,0.25);

  combo = 1;

  level = Math.max(
    1,
    level - 1
  );

  setTimeout(
    startGame,
    800
  );
}

/* =========================================
   SCORE
========================================= */

function updateScore(){

  document
    .getElementById("score")
    .textContent =
      Math.floor(score);

  document
    .getElementById("level")
    .textContent =
      level;

  if(currentUser){

    currentUser.score =
      Math.floor(score);

    currentUser.level =
      level;

    saveUsers();
  }
}

/* =========================================
   USERS
========================================= */

function saveUsers(){

  localStorage.setItem(
    "users",
    JSON.stringify(users)
  );
}

function renderUsers(){

  const container =
    document.getElementById(
      "profiles"
    );

  container.innerHTML = "";

  const sortedUsers =
    users.slice().sort(
      (a, b) =>
        b.score - a.score
    );

  sortedUsers.forEach(user => {

    const realIndex =
      users.findIndex(
        u => u.name === user.name
      );

    const card =
      document.createElement(
        "button"
      );

    card.className =
      "profile-card glow";

    let rankIcon = "⚡";

    if(user.score >= 1000){
      rankIcon = "👑";
    } else if(user.score >= 500){
      rankIcon = "🔥";
    } else if(user.score >= 200){
      rankIcon = "⭐";
    }

    card.innerHTML = `
      <div class="profile-header">
        <div class="profile-avatar">
          ${rankIcon}
        </div>

        <div class="profile-info">
          <h3>${user.name}</h3>
          <p>Nivel ${user.level || 1}</p>
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

    card.onclick =
      () => selectUser(realIndex);

    container.appendChild(card);
  });
}

function createUser(){

  if(
    document.getElementById(
      "userModal"
    )
  ){
    return;
  }

  const modal =
    document.createElement("div");

  modal.id = "userModal";

  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-box glow">

        <h2>👤 Crear Perfil</h2>

        <p>
          Ingresa tu nombre
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

  document.body.appendChild(modal);

  const input =
    document.getElementById(
      "usernameInput"
    );

  input.focus();

  document
    .getElementById(
      "cancelUserBtn"
    )
    .onclick = () => {

      modal.remove();
    };

  document
    .getElementById(
      "saveUserBtn"
    )
    .onclick = saveUser;

  input.addEventListener(
    "keydown",
    e => {

      if(e.key === "Enter"){
        saveUser();
      }
    }
  );

  function saveUser(){

    const cleanName =
      input.value.trim();

    if(cleanName.length < 3){

      input.style.border =
        "2px solid red";

      input.placeholder =
        "Mínimo 3 caracteres";

      return;
    }

    const exists =
      users.some(
        u =>
          u.name.toLowerCase() ===
          cleanName.toLowerCase()
      );

    if(exists){

      input.value = "";

      input.style.border =
        "2px solid red";

      input.placeholder =
        "Ese nombre ya existe";

      return;
    }

    users.push({
      name: cleanName,
      score: 0,
      level: 1
    });

    saveUsers();

    renderUsers();

    modal.remove();
  }
}

function selectUser(i){

  currentUser = users[i];

  score =
    Number(
      currentUser.score
    ) || 0;

  level =
    Number(
      currentUser.level
    ) || 1;

  document
    .getElementById(
      "playerName"
    )
    .textContent =
      currentUser.name;

  document
    .getElementById(
      "score"
    )
    .textContent =
      Math.floor(score);

  document
    .getElementById(
      "level"
    )
    .textContent =
      level;

  showScreen(
    "gameScreen"
  );

  setTimeout(() => {

    resizeCanvas();

    requestRender();

  }, 50);

  startGame();
}
/* =========================================
   SCREENS
========================================= */

function showScreen(id){

  document
    .querySelectorAll(".screen")
    .forEach(screen => {

      screen.classList.remove(
        "active"
      );
    });

  document
    .getElementById(id)
    .classList.add(
      "active"
    );
}

/* =========================================
   EDIT USER
========================================= */

document
  .getElementById(
    "editUserBtn"
  )
  .onclick =
    openEditUserModal;

function openEditUserModal(){

  if(!currentUser)
    return;

  const modal =
    document.getElementById(
      "editUserModal"
    );

  const input =
    document.getElementById(
      "editUsernameInput"
    );

  input.value =
    currentUser.name;

  modal.style.display =
    "flex";

  input.focus();
}

document
  .getElementById(
    "cancelEditBtn"
  )
  .onclick = () => {

    document
      .getElementById(
        "editUserModal"
      )
      .style.display = "none";
  };

document
  .getElementById(
    "confirmEditBtn"
  )
  .onclick =
    saveEditedUser;

document
  .getElementById(
    "editUsernameInput"
  )
  .addEventListener(
    "keydown",
    e => {

      if(e.key === "Enter"){
        saveEditedUser();
      }
    }
  );

function saveEditedUser(){

  if(!currentUser)
    return;

  const input =
    document.getElementById(
      "editUsernameInput"
    );

  const newName =
    input.value.trim();

  if(newName.length < 3){

    input.style.border =
      "2px solid red";

    input.value = "";

    input.placeholder =
      "Mínimo 3 caracteres";

    return;
  }

  const exists =
    users.some(
      u =>
        u.name.toLowerCase() ===
        newName.toLowerCase() &&
        u !== currentUser
    );

  if(exists){

    input.value = "";

    input.style.border =
      "2px solid red";

    input.placeholder =
      "Ese nombre ya existe";

    return;
  }

  currentUser.name =
    newName;

  saveUsers();

  renderUsers();

  document
    .getElementById(
      "playerName"
    )
    .textContent =
      newName;

  document
    .getElementById(
      "editUserModal"
    )
    .style.display =
      "none";
}

/* =========================================
   DELETE USER
========================================= */

document
  .getElementById(
    "deleteUserBtn"
  )
  .onclick =
    openDeleteModal;

function openDeleteModal(){

  if(!currentUser)
    return;

  document
    .getElementById(
      "deleteUserModal"
    )
    .style.display =
      "flex";
}

document
  .getElementById(
    "cancelDeleteBtn"
  )
  .onclick = () => {

    document
      .getElementById(
        "deleteUserModal"
      )
      .style.display =
        "none";
  };

document
  .getElementById(
    "confirmDeleteBtn"
  )
  .onclick =
    deleteCurrentUser;

function deleteCurrentUser(){

  if(!currentUser)
    return;

  const index =
    users.findIndex(
      u =>
        u.name ===
        currentUser.name
    );

  if(index !== -1){

    users.splice(index, 1);

    saveUsers();

    renderUsers();
  }

  currentUser = null;

  score = 0;

  level = 1;

  combo = 1;

  document
    .getElementById(
      "deleteUserModal"
    )
    .style.display =
      "none";

  showScreen(
    "userScreen"
  );
}

/* =========================================
   EVENTS
========================================= */

window.addEventListener(
  "resize",
  resizeCanvas,
  { passive:true }
);

window.addEventListener(
  "orientationchange",
  () => {

    setTimeout(
      resizeCanvas,
      120
    );
  },
  { passive:true }
);

/* =========================================
   INIT
========================================= */

resizeCanvas();

renderUsers();

requestAnimationFrame(
  gameLoop
);
