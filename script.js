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

targetCanvas.width = playerCanvas.width = 300;
targetCanvas.height = playerCanvas.height = 300;

// INICIAR JUEGO
btnPlay.onclick = () => {
    startScreen.classList.remove("active");
    gameScreen.classList.add("active");
    loadLevel();
};

// CARGAR NIVEL
function loadLevel() {
    playerPoints = [];
    drawTarget();
    clearCanvas();
}

// DIBUJAR FIGURA OBJETIVO
function drawTarget() {
    tCtx.clearRect(0,0,300,300);

    const level = LEVELS[currentLevel];
    tCtx.beginPath();

    level.points.forEach((p,i)=>{
        let x = p.x * CONFIG.cell;
        let y = p.y * CONFIG.cell;

        if(i === 0) tCtx.moveTo(x,y);
        else tCtx.lineTo(x,y);
    });

    tCtx.stroke();
}

// CLICK EN CANVAS
playerCanvas.addEventListener("click", (e)=>{
    const rect = playerCanvas.getBoundingClientRect();

    const x = Math.floor((e.clientX - rect.left)/CONFIG.cell);
    const y = Math.floor((e.clientY - rect.top)/CONFIG.cell);

    playerPoints.push({x,y});
    drawPlayer();
});

// DIBUJAR JUGADOR
function drawPlayer(){
    pCtx.clearRect(0,0,300,300);

    pCtx.beginPath();

    playerPoints.forEach((p,i)=>{
        let x = p.x * CONFIG.cell;
        let y = p.y * CONFIG.cell;

        if(i === 0) pCtx.moveTo(x,y);
        else pCtx.lineTo(x,y);
    });

    pCtx.stroke();
}

// LIMPIAR
function clearCanvas(){
    pCtx.clearRect(0,0,300,300);
    playerPoints = [];
}

btnClear.onclick = clearCanvas;

// VERIFICAR
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
