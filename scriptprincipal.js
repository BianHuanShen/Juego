const CONFIG = {
    size: 10,
    cell: 30
};

const LEVELS = [
    {
        name: "Escalera",
        points: [
            {x:1,y:1},{x:1,y:3},{x:3,y:3},{x:3,y:5},{x:5,y:5}
        ]
    },
    {
        name: "Pirámide",
        points: [
            {x:5,y:1},{x:2,y:5},{x:8,y:5},{x:5,y:1}
        ]
    }
];

let currentLevel = 0;
let playerPoints = [];

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");

const btnPlay = document.getElementById("btnPlay");
const btnVerify = document.getElementById("btnVerify");
const btnClear = document.getElementById("btnClear");

const targetCanvas = document.getElementById("targetCanvas");
const playerCanvas = document.getElementById("playerCanvas");

const tCtx = targetCanvas.getContext("2d");
const pCtx = playerCanvas.getContext("2d");

targetCanvas.width = playerCanvas.width = CONFIG.size * CONFIG.cell;
targetCanvas.height = playerCanvas.height = CONFIG.size * CONFIG.cell;

// =======================
// INICIAR JUEGO
// =======================
btnPlay.onclick = () => {
    startScreen.classList.remove("active");
    gameScreen.classList.add("active");
    loadLevel();
};

// =======================
// CARGAR NIVEL
// =======================
function loadLevel() {
    playerPoints = [];
    drawGrid(tCtx);
    drawTarget();
    clearCanvas();
}

// =======================
// DIBUJAR CUADRICULA
// =======================
function drawGrid(ctx){
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,targetCanvas.width,targetCanvas.height);

    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;

    for(let i=0;i<=CONFIG.size;i++){
        // vertical
        ctx.beginPath();
        ctx.moveTo(i*CONFIG.cell,0);
        ctx.lineTo(i*CONFIG.cell,targetCanvas.height);
        ctx.stroke();

        // horizontal
        ctx.beginPath();
        ctx.moveTo(0,i*CONFIG.cell);
        ctx.lineTo(targetCanvas.width,i*CONFIG.cell);
        ctx.stroke();
    }
}

// =======================
// DIBUJAR FIGURA OBJETIVO
// =======================
function drawTarget() {
    const level = LEVELS[currentLevel];

    tCtx.strokeStyle = "#3b82f6";
    tCtx.lineWidth = 3;

    tCtx.beginPath();

    level.points.forEach((p,i)=>{
        let x = p.x * CONFIG.cell + CONFIG.cell/2;
        let y = p.y * CONFIG.cell + CONFIG.cell/2;

        if(i === 0) tCtx.moveTo(x,y);
        else tCtx.lineTo(x,y);
    });

    tCtx.stroke();
}

// =======================
// OBTENER POSICION (TOUCH + CLICK)
// =======================
function getPos(evt){
    const rect = playerCanvas.getBoundingClientRect();

    let clientX = evt.clientX;
    let clientY = evt.clientY;

    if(evt.touches){
        clientX = evt.touches[0].clientX;
        clientY = evt.touches[0].clientY;
    }

    const x = Math.floor((clientX - rect.left)/CONFIG.cell);
    const y = Math.floor((clientY - rect.top)/CONFIG.cell);

    return {x,y};
}

// =======================
// EVENTOS (CLICK + TOUCH)
// =======================
function handleDraw(e){
    e.preventDefault();

    const pos = getPos(e);

    playerPoints.push(pos);
    drawPlayer();
}

playerCanvas.addEventListener("click", handleDraw);
playerCanvas.addEventListener("touchstart", handleDraw);

// =======================
// DIBUJAR JUGADOR
// =======================
function drawPlayer(){
    drawGrid(pCtx);

    pCtx.strokeStyle = "#ef4444";
    pCtx.lineWidth = 4;

    pCtx.beginPath();

    playerPoints.forEach((p,i)=>{
        let x = p.x * CONFIG.cell + CONFIG.cell/2;
        let y = p.y * CONFIG.cell + CONFIG.cell/2;

        if(i === 0) pCtx.moveTo(x,y);
        else pCtx.lineTo(x,y);
    });

    pCtx.stroke();

    // dibujar puntos visibles
    playerPoints.forEach(p=>{
        let x = p.x * CONFIG.cell + CONFIG.cell/2;
        let y = p.y * CONFIG.cell + CONFIG.cell/2;

        pCtx.fillStyle = "#ef4444";
        pCtx.beginPath();
        pCtx.arc(x,y,5,0,Math.PI*2);
        pCtx.fill();
    });
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
// VERIFICAR
// =======================
btnVerify.onclick = ()=>{
    const target = LEVELS[currentLevel].points;

    if(JSON.stringify(target) === JSON.stringify(playerPoints)){
        alert("✅ Correcto!");
        currentLevel++;

        if(currentLevel >= LEVELS.length){
            alert("🎉 Ganaste!");
            currentLevel = 0;
        }

        loadLevel();
    }else{
        alert("❌ Intenta de nuevo");
    }
};
