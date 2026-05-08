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

/* USERS */
function saveUsers(){
  localStorage.setItem("users", JSON.stringify(users));
}

function renderUsers(){
  const container = document.getElementById("profiles");
  container.innerHTML = "";

  users.forEach((u,i)=>{
    const btn = document.createElement("button");
    btn.textContent = `${u.name} ${u.score}`;
    btn.onclick = ()=> selectUser(i);
    container.appendChild(btn);
  });
}

function createUser(){
  if(users.length >= 3) return alert("Máximo 3 usuarios");
  const name = prompt("Nombre:");
  if(!name) return;

  users.push({name, score:0, level:1});
  saveUsers();
  renderUsers();
}

function selectUser(i){
  currentUser = users[i];
  document.getElementById("playerName").textContent = currentUser.name;
  showScreen("gameScreen");
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
  },1000);
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

  // Tiempo en segundos
  const elapsedTime = (Date.now() - startTime) / 1000;

  // Bonus entero basado en velocidad
  const speedBonus = Math.floor(
    Math.max(1, 5 - elapsedTime)
  );

  // Puntos base
  const basePoints = 10 * combo;

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

/* =========================
   INIT
========================= */

renderUsers();
