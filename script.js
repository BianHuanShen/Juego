// =======================
// CONFIG
// =======================
const CONFIG = {
    size: 10,
    cell: 30
};

// =======================
// ESTADO
// =======================
let currentLevel = 0;
let playerPoints = [];
let score = 0;

// =======================
// DOM
// =======================
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const levelDisplay = document.getElementById("levelDisplay");

const btnPlay = document.getElementById("btnPlay");
const btnClear = document.getElementById("btnClear");

const targetCanvas = document.getElementById("targetCanvas");
const playerCanvas = document.getElementById("playerCanvas");

const tCtx = targetCanvas.getContext("2d");
const pCtx = playerCanvas.getContext("2d");

// =======================
// AUDIO + VIBRACIÓN
// =======================
function playSound(freq = 600){
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = freq;
    osc.type = "sine";

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
}

function vibrate(pattern = 30){
    if(navigator.vibrate) navigator.vibrate(pattern);
}

// =======================
// IA NIVELES
// =======================
function generateLevel(difficulty){
    const length = 4 + difficulty * 2;

    let path = [];
    let x = Math.floor(CONFIG.size/2);
    let y = Math.floor(CONFIG.size/2);

    path.push({x,y});

    const dirs = [
        {x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}
    ];

    for(let i=1;i<length;i++){
        let valid = false;

        while(!valid){
            const d = dirs[Math.floor(Math.random()*dirs.length)];
            const nx = x + d.x;
            const ny = y + d.y;

            if(nx>=0 && nx<CONFIG.size && ny>=0 && ny<CONFIG.size){
                if(!path.some(p=>p.x===nx && p.y===ny)){
                    x = nx;
                    y = ny;
                    path.push({x,y});
                    valid = true;
                }
            }
        }
    }

    return path;
}

// =======================
// CANVAS RESPONSIVE
// =======================
function resizeCanvas(){
    const size = Math.min(window.innerWidth * 0.9, 320);

    targetCanvas.width = playerCanvas.width = size;
    targetCanvas.height = playerCanvas.height = size;

    CONFIG.cell = size / CONFIG.size;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// =======================
// INICIO
// =======================
btnPlay.onclick = ()=>{
    startScreen.classList.remove("active");
    gameScreen.classList.add("active");
    loadLevel();
};

// =======================
// NIVEL
// =======================
let currentTarget = [];

function loadLevel(){
    playerPoints = [];

    const difficulty = Math.floor(currentLevel/2)+1;
    currentTarget = generateLevel(difficulty);

    levelDisplay.textContent = `Nivel ${currentLevel+1} | ⭐ ${score}`;

    drawGrid(tCtx);
    drawTarget();
    clearCanvas();
}

// =======================
// GRID
// =======================
function drawGrid(ctx){
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,targetCanvas.width,targetCanvas.height);

    ctx.strokeStyle = "#e2e8f0";

    for(let i=0;i<=CONFIG.size;i++){
        ctx.beginPath();
        ctx.moveTo(i*CONFIG.cell,0);
        ctx.lineTo(i*CONFIG.cell,targetCanvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0,i*CONFIG.cell);
        ctx.lineTo(targetCanvas.width,i*CONFIG.cell);
        ctx.stroke();
    }
}

// =======================
// TARGET
// =======================
function drawTarget(){
    tCtx.strokeStyle = "#3b82f6";
    tCtx.lineWidth = 3;

    tCtx.beginPath();

    currentTarget.forEach((p,i)=>{
        let x = p.x*CONFIG.cell + CONFIG.cell/2;
        let y = p.y*CONFIG.cell + CONFIG.cell/2;

        if(i===0) tCtx.moveTo(x,y);
        else tCtx.lineTo(x,y);
    });

    tCtx.stroke();
}

// =======================
// INPUT
// =======================
function getPos(e){
    const rect = playerCanvas.getBoundingClientRect();

    let x = e.clientX;
    let y = e.clientY;

    if(e.touches){
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    }

    return {
        x: Math.floor((x - rect.left)/CONFIG.cell),
        y: Math.floor((y - rect.top)/CONFIG.cell)
    };
}

function handleDraw(e){
    e.preventDefault();

    const pos = getPos(e);

    const last = playerPoints[playerPoints.length-1];
    if(last && last.x===pos.x && last.y===pos.y) return;

    playerPoints.push(pos);

    vibrate(20);
    playSound(700);

    drawPlayer();
    checkProgress();
}

playerCanvas.addEventListener("click", handleDraw);
playerCanvas.addEventListener("touchstart", handleDraw);

// =======================
// DIBUJO PRO
// =======================
function drawPlayer(){
    drawGrid(pCtx);

    pCtx.shadowColor = "#ef4444";
    pCtx.shadowBlur = 10;

    pCtx.strokeStyle = "#ef4444";
    pCtx.lineWidth = 4;

    pCtx.beginPath();

    playerPoints.forEach((p,i)=>{
        let x = p.x*CONFIG.cell + CONFIG.cell/2;
        let y = p.y*CONFIG.cell + CONFIG.cell/2;

        if(i===0) pCtx.moveTo(x,y);
        else pCtx.lineTo(x,y);
    });

    pCtx.stroke();

    playerPoints.forEach(p=>{
        let x = p.x*CONFIG.cell + CONFIG.cell/2;
        let y = p.y*CONFIG.cell + CONFIG.cell/2;

        pCtx.beginPath();
        pCtx.arc(x,y,5,0,Math.PI*2);
        pCtx.fillStyle = "#ef4444";
        pCtx.fill();
    });

    pCtx.shadowBlur = 0;
}

// =======================
// LIMPIAR
// =======================
function clearCanvas(){
    drawGrid(pCtx);
    playerPoints = [];
}
btnClear.onclick = clearCanvas;

// =======================
// DETECCIÓN AUTOMÁTICA
// =======================
function checkProgress(){

    if(playerPoints.length > currentTarget.length){
        fail();
        return;
    }

    for(let i=0;i<playerPoints.length;i++){
        if(
            playerPoints[i].x !== currentTarget[i].x ||
            playerPoints[i].y !== currentTarget[i].y
        ){
            fail();
            return;
        }
    }

    if(playerPoints.length === currentTarget.length){
        success();
    }
}

// =======================
// RESULTADOS
// =======================
function success(){
    vibrate([100,50,100]);
    playSound(1000);

    score += 10;

    setTimeout(()=>{
        currentLevel++;
        loadLevel();
    }, 400);
}

function fail(){
    vibrate([50,30,50]);
    playSound(200);

    setTimeout(()=>{
        loadLevel();
    }, 300);
}
