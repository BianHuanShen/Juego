const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let size = 9;
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

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + duration
  );

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

  const sortedUsers = [...users].sort(
    (a, b) => b.score - a.score
  );

  sortedUsers.forEach((user) => {

    const realIndex = users.findIndex(
      u => u.name === user.name
    );

    const card =
      document.createElement("button");

    card.className =
      "profile-card glow";

    let rankIcon = "⚡";

    if(user.score >= 1000)
      rankIcon = "👑";
    else if(user.score >= 500)
      rankIcon = "🔥";
    else if(user.score >= 200)
      rankIcon = "⭐";

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

    card.onclick = () =>
      selectUser(realIndex);

    container.appendChild(card);
  });
}

/* =========================================
   CREATE USER
========================================= */

function createUser() {

  if(document.getElementById("userModal"))
    return;

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
    document.getElementById("usernameInput");

  input.focus();

  document
    .getElementById("cancelUserBtn")
    .onclick = () => {
      modal.remove();
    };

  document
    .getElementById("saveUserBtn")
    .onclick = saveUser;

  input.addEventListener("keydown", e => {

    if(e.key === "Enter"){
      saveUser();
    }

  });

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

    const exists = users.some(
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
    Number(currentUser.score) || 0;

  level =
    Number(currentUser.level) || 1;

  document.getElementById(
    "playerName"
  ).textContent = currentUser.name;

  document.getElementById(
    "score"
  ).textContent = Math.floor(score);

  document.getElementById(
    "level"
  ).textContent = level;

  showScreen("gameScreen");

  startGame();
}

/* SCREENS */

function showScreen(id){

  document
    .querySelectorAll(".screen")
    .forEach(s =>
      s.classList.remove("active")
    );

  document
    .getElementById(id)
    .classList.add("active");
}

/* =========================================
   FIGURAS POR NIVELES
========================================= */

const levels = [

{
  level:1,
  name:"Línea",
  points:[
    {x:2,y:4},
    {x:3,y:4},
    {x:4,y:4},
    {x:5,y:4}
  ]
},

{
  level:2,
  name:"Escalera",
  points:[
    {x:1,y:6},
    {x:1,y:5},
    {x:2,y:5},
    {x:2,y:4},
    {x:3,y:4}
  ]
},

{
  level:3,
  name:"Triángulo",
  points:[
    {x:2,y:6},
    {x:4,y:2},
    {x:6,y:6},
    {x:2,y:6}
  ]
},

{
  level:4,
  name:"Casa",
  points:[
    {x:2,y:7},
    {x:2,y:4},
    {x:4,y:2},
    {x:6,y:4},
    {x:6,y:7},
    {x:2,y:7}
  ]
},

{
  level:5,
  name:"Flecha",
  points:[
    {x:1,y:4},
    {x:4,y:1},
    {x:4,y:3},
    {x:7,y:3},
    {x:7,y:5},
    {x:4,y:5},
    {x:4,y:7},
    {x:1,y:4}
  ]
},

{
  level:6,
  name:"Diamante",
  points:[
    {x:4,y:1},
    {x:7,y:4},
    {x:4,y:7},
    {x:1,y:4},
    {x:4,y:1}
  ]
},

{
  level:7,
  name:"Barco",
  points:[
    {x:1,y:6},
    {x:3,y:7},
    {x:6,y:7},
    {x:8,y:6},
    {x:6,y:6},
    {x:6,y:2},
    {x:4,y:1},
    {x:4,y:6},
    {x:1,y:6}
  ]
},

{
  level:8,
  name:"Copa",
  points:[
    {x:2,y:1},
    {x:6,y:1},
    {x:5,y:4},
    {x:4,y:5},
    {x:4,y:7},
    {x:5,y:8},
    {x:3,y:8},
    {x:4,y:7},
    {x:4,y:5},
    {x:3,y:4},
    {x:2,y:1}
  ]
},

{
  level:9,
  name:"Rayo",
  points:[
    {x:4,y:1},
    {x:2,y:4},
    {x:4,y:4},
    {x:3,y:7},
    {x:6,y:3},
    {x:4,y:3},
    {x:4,y:1}
  ]
},

{
  level:10,
  name:"Pez",
  points:[
    {x:1,y:4},
    {x:3,y:2},
    {x:6,y:2},
    {x:8,y:4},
    {x:6,y:6},
    {x:3,y:6},
    {x:1,y:4},
    {x:0,y:2},
    {x:1,y:4},
    {x:0,y:6}
  ]
},

{
  level:11,
  name:"Estrella",
  points:[
    {x:4,y:0},
    {x:5,y:3},
    {x:8,y:3},
    {x:6,y:5},
    {x:7,y:8},
    {x:4,y:6},
    {x:1,y:8},
    {x:2,y:5},
    {x:0,y:3},
    {x:3,y:3},
    {x:4,y:0}
  ]
},

{
  level:12,
  name:"Árbol",
  points:[
    {x:4,y:1},
    {x:6,y:3},
    {x:5,y:3},
    {x:7,y:5},
    {x:5,y:5},
    {x:6,y:7},
    {x:2,y:7},
    {x:3,y:5},
    {x:1,y:5},
    {x:3,y:3},
    {x:2,y:3},
    {x:4,y:1},
    {x:4,y:8}
  ]
},

{
  level:13,
  name:"Robot",
  points:[
    {x:2,y:1},
    {x:6,y:1},
    {x:6,y:5},
    {x:5,y:5},
    {x:5,y:7},
    {x:3,y:7},
    {x:3,y:5},
    {x:2,y:5},
    {x:2,y:1}
  ]
},

{
  level:14,
  name:"Mariposa",
  points:[
    {x:4,y:4},
    {x:1,y:1},
    {x:2,y:4},
    {x:1,y:7},
    {x:4,y:5},
    {x:7,y:7},
    {x:6,y:4},
    {x:7,y:1},
    {x:4,y:4}
  ]
},

{
  level:15,
  name:"Corona",
  points:[
    {x:1,y:7},
    {x:2,y:2},
    {x:4,y:5},
    {x:6,y:2},
    {x:7,y:7},
    {x:1,y:7}
  ]
},

{
  level:16,
  name:"Dragón",
  points:[
    {x:1,y:6},
    {x:3,y:3},
    {x:5,y:4},
    {x:7,y:1},
    {x:8,y:3},
    {x:6,y:5},
    {x:8,y:7},
    {x:5,y:6},
    {x:3,y:8},
    {x:1,y:6}
  ]
},

{
  level:17,
  name:"Castillo",
  points:[
    {x:1,y:7},
    {x:1,y:2},
    {x:2,y:2},
    {x:2,y:4},
    {x:4,y:1},
    {x:6,y:4},
    {x:6,y:2},
    {x:7,y:2},
    {x:7,y:7},
    {x:1,y:7}
  ]
},

{
  level:18,
  name:"Murciélago",
  points:[
    {x:0,y:4},
    {x:2,y:2},
    {x:4,y:4},
    {x:6,y:2},
    {x:8,y:4},
    {x:6,y:6},
    {x:4,y:5},
    {x:2,y:6},
    {x:0,y:4}
  ]
},

{
  level:19,
  name:"Labrys",
  points:[
    {x:4,y:0},
    {x:6,y:2},
    {x:5,y:4},
    {x:7,y:6},
    {x:4,y:8},
    {x:1,y:6},
    {x:3,y:4},
    {x:2,y:2},
    {x:4,y:0}
  ]
},

{
  level:20,
  name:"Fénix",
  points:[
    {x:4,y:0},
    {x:6,y:2},
    {x:8,y:1},
    {x:7,y:4},
    {x:8,y:7},
    {x:5,y:6},
    {x:4,y:8},
    {x:3,y:6},
    {x:0,y:7},
    {x:1,y:4},
    {x:0,y:1},
    {x:2,y:2},
    {x:4,y:0}
  ]
}

];

/* GAME LOGIC */

function generatePath(){

  const currentLevel =
    levels.find(
      l => l.level === level
    );

  if(currentLevel){
    return currentLevel.points;
  }

  return levels[
    levels.length - 1
  ].points;
}

function drawGrid(){

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  cellSize =
    canvas.width / size;

  for(let x=0;x<size;x++){

    for(let y=0;y<size;y++){

      ctx.fillStyle="#222";

      ctx.beginPath();

      ctx.arc(
        x*cellSize+cellSize/2,
        y*cellSize+cellSize/2,
        8,
        0,
        Math.PI*2
      );

      ctx.fill();
    }
  }
}

function drawPath(){

  ctx.strokeStyle="cyan";
  ctx.lineWidth=5;
  ctx.shadowBlur=15;
  ctx.shadowColor="cyan";

  ctx.beginPath();

  path.forEach((p,i)=>{

    let x =
      p.x*cellSize+cellSize/2;

    let y =
      p.y*cellSize+cellSize/2;

    if(i===0)
      ctx.moveTo(x,y);
    else
      ctx.lineTo(x,y);

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

canvas.addEventListener(
  "pointerdown",
  e=>{

    const rect =
      canvas.getBoundingClientRect();

    const x = Math.floor(
      (e.clientX-rect.left)/cellSize
    );

    const y = Math.floor(
      (e.clientY-rect.top)/cellSize
    );

    handleInput(x,y);
  }
);

function handleInput(x,y){

  vibrate(10);

  playSound(
    400 + playerPath.length*50,
    0.1
  );

  const expected =
    path[playerPath.length];

  if(
    !expected ||
    expected.x!==x ||
    expected.y!==y
  ){
    fail();
    return;
  }

  playerPath.push({x,y});

  drawGrid();
  drawPlayerPath();

  updateProgress();

  if(
    playerPath.length ===
    path.length
  ){
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

    let x =
      p.x*cellSize+cellSize/2;

    let y =
      p.y*cellSize+cellSize/2;

    if(i===0)
      ctx.moveTo(x,y);
    else
      ctx.lineTo(x,y);

  });

  ctx.stroke();
}

function updateProgress(){

  const percent =
    (
      playerPath.length /
      path.length
    ) * 100;

  document
    .getElementById("progress")
    .style.width =
      percent + "%";
}

/* RESULTS SYSTEM */

function success(){

  vibrate([50,50,100]);

  playSound(800,0.2);

  const elapsedTime =
    startTime
      ? (Date.now()-startTime)/1000
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

  vibrate(300);

  playSound(100,0.3);

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

function updateScore(){

  document
    .getElementById("score")
    .textContent =
      Math.floor(score);

  document
    .getElementById("level")
    .textContent =
      level;

  currentUser.score =
    Math.floor(score);

  currentUser.level =
    level;

  saveUsers();
}

/* INIT */

renderUsers();
