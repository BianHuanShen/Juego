// ============================================================
// BRAIN GRID PRO - Juego Completo
// ============================================================

const CONFIG = {
    GRID: 10,
    CELL: 36,
    MEMO_TIME: 6,
    COUNTDOWN_TIME: 3,
    HINT_COST: 5,
    MAX_USERS: 3,
    BASE_SCORE: 100,
    SPEED_BONUS: 50,
    COMBO_MULTIPLIER: 1.5,
    MAX_COMBO: 5
};

// Colores disponibles para usuarios
const USER_COLORS = [
    '#667eea', '#ef4444', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#f97316'
];

// Skins desbloqueables
const SKINS = [
    { id: 'default', name: 'Clásico', emoji: '🔵', color: '#667eea', price: 0, owned: true },
    { id: 'fire', name: 'Fuego', emoji: '🔥', color: '#ef4444', price: 50, owned: false },
    { id: 'nature', name: 'Naturaleza', emoji: '🌿', color: '#10b981', price: 100, owned: false },
    { id: 'gold', name: 'Oro', emoji: '✨', color: '#fbbf24', price: 200, owned: false },
    { id: 'ocean', name: 'Océano', emoji: '🌊', color: '#06b6d4', price: 150, owned: false },
    { id: 'purple', name: 'Real', emoji: '👑', color: '#8b5cf6', price: 300, owned: false },
    { id: 'neon', name: 'Neón', emoji: '⚡', color: '#d946ef', price: 400, owned: false },
    { id: 'rainbow', name: 'Arcoíris', emoji: '🌈', color: 'rainbow', price: 500, owned: false },
    { id: 'matrix', name: 'Matrix', emoji: '💚', color: '#22c55e', price: 600, owned: false }
];

// Dificultades
const DIFFICULTIES = [
    { name: 'Fácil', minLen: 5, maxLen: 8, branches: 0 },
    { name: 'Normal', minLen: 8, maxLen: 12, branches: 1 },
    { name: 'Difícil', minLen: 12, maxLen: 16, branches: 2 },
    { name: 'Experto', minLen: 16, maxLen: 20, branches: 3 },
    { name: 'Maestro', minLen: 20, maxLen: 25, branches: 4 }
];

// ===== AUDIO ENGINE (Web Audio API) =====
class AudioEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.init();
    }

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {
            console.warn('Web Audio no soportado');
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, duration, type = 'sine', volume = 0.3) {
        if (!this.enabled || !this.ctx) return;
        this.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + duration);
    }

    tick(pitch = 1) {
        this.playTone(800 * pitch, 0.1, 'sine', 0.2);
    }

    error() {
        this.playTone(150, 0.3, 'sawtooth', 0.3);
        setTimeout(() => this.playTone(100, 0.3, 'sawtooth', 0.3), 100);
    }

    win() {
        [523, 659, 784, 1047].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.25), i * 100);
        });
    }

    combo(level) {
        const freq = 600 + (level * 100);
        this.playTone(freq, 0.15, 'sine', 0.2);
    }

    hint() {
        this.playTone(1200, 0.2, 'sine', 0.15);
    }

    clear() {
        this.playTone(400, 0.15, 'triangle', 0.15);
    }
}

const audio = new AudioEngine();

// ===== ESTADO GLOBAL =====
let state = {
    currentUser: null,
    users: [],
    game: {
        level: 1,
        score: 0,
        coins: 0,
        stars: 0,
        streak: 0,
        maxStreak: 0,
        combo: 0,
        targetShape: [],
        playerShape: [],
        currentIndex: 0,
        isMemorizing: false,
        startTime: 0,
        elapsedTime: 0,
        timerInterval: null,
        difficulty: 0,
        patternHistory: [],
        failCount: 0,
        successCount: 0,
        avgTime: 0
    },
    settings: {
        darkMode: true,
        sound: true,
        vibrate: true,
        memoTime: 6
    }
};

// ===== CANVAS =====
const canvasTarget = document.getElementById('targetCanvas');
const canvasPlayer = document.getElementById('playerCanvas');
const canvasConfetti = document.getElementById('confettiCanvas');
const ctxTarget = canvasTarget.getContext('2d');
const ctxPlayer = canvasPlayer.getContext('2d');
const ctxConfetti = canvasConfetti.getContext('2d');

// ===== LOCAL STORAGE =====
function saveData() {
    try {
        localStorage.setItem('brainGridPro', JSON.stringify({
            users: state.users,
            currentUser: state.currentUser,
            settings: state.settings
        }));
    } catch(e) {}
}

function loadData() {
    try {
        const data = JSON.parse(localStorage.getItem('brainGridPro'));
        if (data) {
            state.users = data.users || [];
            state.currentUser = data.currentUser;
            state.settings = data.settings || state.settings;

            // Restaurar skins
            if (data.users) {
                data.users.forEach(u => {
                    if (u.skins) {
                        u.skins.forEach(skinId => {
                            const skin = SKINS.find(s => s.id === skinId);
                            if (skin) skin.owned = true;
                        });
                    }
                });
            }
        }
    } catch(e) {}
}

// ===== SCREEN MANAGEMENT =====
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// ===== TOAST =====
let toastTimeout;
function showToast(msg) {
    clearTimeout(toastTimeout);
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2000);
}

// ===== VIBRATION =====
function vibrate(pattern) {
    const patterns = {
        tick: [10],
        error: [50, 30, 50],
        win: [30, 50, 30, 50, 100],
        hint: [20, 10, 20],
        clear: [15]
    };
    if (state.settings.vibrate && navigator.vibrate && patterns[pattern]) {
        navigator.vibrate(patterns[pattern]);
    }
}

// ===== IA PROCEDURAL - GENERACIÓN DE NIVELES =====
function generateLevelIA() {
    const diff = DIFFICULTIES[Math.min(state.game.difficulty, DIFFICULTIES.length - 1)];
    const length = Math.floor(Math.random() * (diff.maxLen - diff.minLen + 1)) + diff.minLen;

    const used = new Set();
    const points = [];

    // Punto inicial aleatorio
    let x = Math.floor(Math.random() * CONFIG.GRID);
    let y = Math.floor(Math.random() * CONFIG.GRID);

    points.push({x, y});
    used.add(`${x},${y}`);

    const dirs = [[0,1], [0,-1], [1,0], [-1,0]];

    for (let i = 1; i < length; i++) {
        // Mezclar direcciones
        const shuffled = [...dirs].sort(() => Math.random() - 0.5);
        let placed = false;

        for (const [dx, dy] of shuffled) {
            const nx = x + dx;
            const ny = y + dy;
            const key = `${nx},${ny}`;

            if (nx >= 0 && nx < CONFIG.GRID && ny >= 0 && ny < CONFIG.GRID && !used.has(key)) {
                // Evitar patrones muy rectos (más de 3 en línea)
                if (points.length >= 3) {
                    const p1 = points[points.length - 2];
                    const p2 = points[points.length - 1];
                    if (p1.x === p2.x && p2.x === nx) continue; // 3 verticales
                    if (p1.y === p2.y && p2.y === ny) continue; // 3 horizontales
                }

                points.push({x: nx, y: ny});
                used.add(key);
                x = nx;
                y = ny;
                placed = true;
                break;
            }
        }

        if (!placed) break; // No hay más movimientos posibles
    }

    // Asegurar longitud mínima
    if (points.length < diff.minLen) {
        return generateLevelIA(); // Reintentar
    }

    return points;
}

// ===== IA ADAPTATIVA =====
function adjustDifficulty() {
    const g = state.game;
    const total = g.successCount + g.failCount;

    if (total < 3) return; // No hay suficiente datos

    const successRate = g.successCount / total;
    const avgTime = g.avgTime || 0;

    // Subir dificultad si acierta mucho y rápido
    if (successRate > 0.8 && avgTime < 10 && g.difficulty < DIFFICULTIES.length - 1) {
        g.difficulty++;
        showToast('📈 ¡Dificultad aumentada!');
    }
    // Bajar dificultad si falla mucho
    else if (successRate < 0.4 && g.difficulty > 0) {
        g.difficulty--;
        showToast('📉 Dificultad ajustada');
    }

    // Reset contadores
    g.successCount = 0;
    g.failCount = 0;
}

// ===== DIBUJAR GRID =====
function drawGrid(ctx) {
    const w = CONFIG.GRID * CONFIG.CELL;
    const h = CONFIG.GRID * CONFIG.CELL;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    // Puntos
    ctx.fillStyle = '#94a3b8';
    for (let i = 0; i < CONFIG.GRID; i++) {
        for (let j = 0; j < CONFIG.GRID; j++) {
            ctx.beginPath();
            ctx.arc(i * CONFIG.CELL + CONFIG.CELL/2, j * CONFIG.CELL + CONFIG.CELL/2, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ===== OBTENER COLOR DEL SKIN ACTUAL =====
function getCurrentColor() {
    const user = state.users.find(u => u.id === state.currentUser);
    if (!user) return '#667eea';

    const skin = SKINS.find(s => s.id === user.currentSkin);
    if (!skin) return '#667eea';

    if (skin.color === 'rainbow') {
        const hues = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
        return hues[state.game.level % hues.length];
    }
    return skin.color;
}

// ===== DIBUJAR FIGURA =====
function drawFigure(ctx, points, color, isTarget, showNumbers = true) {
    if (points.length === 0) return;

    const cs = CONFIG.CELL;

    // Líneas
    ctx.strokeStyle = color;
    ctx.lineWidth = isTarget ? 3 : 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (!isTarget) {
        ctx.shadowColor = color + '60';
        ctx.shadowBlur = 12;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x * cs + cs/2, points[0].y * cs + cs/2);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x * cs + cs/2, points[i].y * cs + cs/2);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Puntos
    points.forEach((p, i) => {
        const cx = p.x * cs + cs/2;
        const cy = p.y * cs + cs/2;

        ctx.beginPath();
        ctx.arc(cx, cy, isTarget ? 5 : 7, 0, Math.PI * 2);
        ctx.fillStyle = isTarget ? '#fff' : color;
        ctx.fill();
        ctx.strokeStyle = isTarget ? color : '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Números
        if (showNumbers) {
            ctx.fillStyle = isTarget ? color : '#fff';
            ctx.font = 'bold 9px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(i + 1, cx, cy);
        }
    });

    // Indicador del siguiente punto (solo en modo jugador)
    if (!isTarget && state.game.currentIndex < state.game.targetShape.length) {
        const next = state.game.targetShape[state.game.currentIndex];
        const ncx = next.x * cs + cs/2;
        const ncy = next.y * cs + cs/2;

        ctx.strokeStyle = color + '40';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(ncx, ncy, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

// ===== DIBUJAR OBJETIVO =====
function drawTarget() {
    drawGrid(ctxTarget);
    const color = getCurrentColor();
    drawFigure(ctxTarget, state.game.targetShape, color, true);
}

// ===== DIBUJAR JUGADOR =====
function drawPlayer(highlightCells = []) {
    drawGrid(ctxPlayer);

    // Highlight hints
    highlightCells.forEach(p => {
        ctxPlayer.fillStyle = 'rgba(245, 158, 11, 0.4)';
        ctxPlayer.beginPath();
        ctxPlayer.arc(p.x * CONFIG.CELL + CONFIG.CELL/2, p.y * CONFIG.CELL + CONFIG.CELL/2, 14, 0, Math.PI * 2);
        ctxPlayer.fill();
    });

    const color = getCurrentColor();
    drawFigure(ctxPlayer, state.game.playerShape, color, false, !state.game.isMemorizing);

    updateProgressBar();
}

// ===== BARRA DE PROGRESO =====
function updateProgressBar() {
    const g = state.game;
    const total = g.targetShape.length;
    const current = g.currentIndex;
    const pct = total > 0 ? (current / total) * 100 : 0;

    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressText').textContent = current + '/' + total;
}

// ===== INICIAR NIVEL =====
function startLevel() {
    const g = state.game;
    g.targetShape = generateLevelIA();
    g.playerShape = [];
    g.currentIndex = 0;
    g.isMemorizing = true;
    g.elapsedTime = 0;

    // Actualizar UI
    const diff = DIFFICULTIES[g.difficulty];
    document.getElementById('levelNum').textContent = g.level;
    document.getElementById('diffBadge').textContent = diff.name;
    document.getElementById('streak').textContent = g.streak;
    document.getElementById('score').textContent = g.score;
    document.getElementById('timer').textContent = '0s';

    drawTarget();
    drawPlayer();

    // Iniciar cuenta regresiva
    startCountdown();
}

// ===== CUENTA REGRESIVA =====
function startCountdown() {
    let phase = 'memo';
    let memoTime = state.settings.memoTime;
    let count = CONFIG.COUNTDOWN_TIME;

    const overlay = document.getElementById('countdownOverlay');
    const num = document.getElementById('countdownNumber');
    const text = document.getElementById('countdownText');
    const bar = document.getElementById('memoProgress');
    const fill = document.getElementById('memoFill');

    overlay.classList.add('show');
    bar.style.display = 'block';
    fill.style.width = '100%';
    num.textContent = '👁️';
    num.style.fontSize = '4rem';
    text.textContent = 'Memoriza el patrón';

    const interval = setInterval(() => {
        if (phase === 'memo') {
            memoTime--;
            fill.style.width = (memoTime / state.settings.memoTime * 100) + '%';

            if (memoTime <= 0) {
                phase = 'count';
                num.style.fontSize = '';
                num.textContent = count;
                text.textContent = 'Prepárate...';
                bar.style.display = 'none';
                animateCountdown();
            }
        } else {
            count--;

            if (count > 0) {
                num.textContent = count;
                animateCountdown();
            } else if (count === 0) {
                num.textContent = '✏️';
                text.textContent = '¡Dibuja!';
                animateCountdown();
            } else {
                clearInterval(interval);
                overlay.classList.remove('show');
                g.isMemorizing = false;
                g.startTime = Date.now();
                startTimer();

                // Ocultar objetivo
                drawGrid(ctxTarget);
                showToast('🧠 ¡Reproduce el patrón!');
            }
        }
    }, 1000);
}

function animateCountdown() {
    const num = document.getElementById('countdownNumber');
    num.style.animation = 'none';
    num.offsetHeight;
    num.style.animation = '';
}

// ===== TIMER =====
function startTimer() {
    clearInterval(state.game.timerInterval);
    state.game.timerInterval = setInterval(() => {
        state.game.elapsedTime = Math.floor((Date.now() - state.game.startTime) / 1000);
        document.getElementById('timer').textContent = state.game.elapsedTime + 's';
    }, 1000);
}

function stopTimer() {
    clearInterval(state.game.timerInterval);
}

// ===== INPUT DEL JUGADOR =====
function getGridCoords(clientX, clientY) {
    const rect = canvasPlayer.getBoundingClientRect();
    const scaleX = canvasPlayer.width / rect.width;
    const scaleY = canvasPlayer.height / rect.height;
    const x = Math.floor(((clientX - rect.left) * scaleX) / CONFIG.CELL);
    const y = Math.floor(((clientY - rect.top) * scaleY) / CONFIG.CELL);
    return { x, y };
}

function handleInput(e) {
    const g = state.game;

    if (g.isMemorizing) {
        showToast('⏳ Espera...');
        return;
    }

    const coords = getGridCoords(e.clientX, e.clientY);
    if (coords.x < 0 || coords.x >= CONFIG.GRID || coords.y < 0 || coords.y >= CONFIG.GRID) return;

    const expected = g.targetShape[g.currentIndex];
    if (!expected) return;

    // Verificar si es el punto correcto
    if (expected.x === coords.x && expected.y === coords.y) {
        // ACIERTO
        g.playerShape.push({ ...coords });
        g.currentIndex++;

        // Combo
        g.combo = Math.min(g.combo + 1, CONFIG.MAX_COMBO);
        const pitch = 1 + (g.combo * 0.1);

        if (state.settings.sound) audio.tick(pitch);
        vibrate('tick');

        // Score por punto
        const pointScore = 10 * (1 + g.combo * 0.2);
        g.score += Math.floor(pointScore);
        document.getElementById('score').textContent = g.score;

        // ¿Nivel completado?
        if (g.currentIndex === g.targetShape.length) {
            stopTimer();
            levelComplete();
        } else {
            drawPlayer();
        }
    } else {
        // FALLO
        const alreadyTouched = g.playerShape.some(p => p.x === coords.x && p.y === coords.y);
        if (!alreadyTouched) {
            // Reset combo
            g.combo = 0;
            g.failCount++;

            if (state.settings.sound) audio.error();
            vibrate('error');

            canvasPlayer.classList.add('shake');
            setTimeout(() => canvasPlayer.classList.remove('shake'), 400);

            showToast('❌ ¡Orden incorrecto!');

            // Penalización: borrar últimos 2 puntos si hay suficientes
            if (g.playerShape.length >= 2) {
                g.playerShape.pop();
                g.playerShape.pop();
                g.currentIndex = Math.max(0, g.currentIndex - 2);
            } else if (g.playerShape.length >= 1) {
                g.playerShape.pop();
                g.currentIndex = Math.max(0, g.currentIndex - 1);
            }

            drawPlayer();

            // Ajustar dificultad si falla mucho
            if (g.failCount >= 3) {
                adjustDifficulty();
            }
        }
    }
}

// Event listeners
canvasPlayer.addEventListener('click', handleInput);
canvasPlayer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleInput(e.touches[0]);
});

// ===== NIVEL COMPLETADO =====
function levelComplete() {
    const g = state.game;
    const user = state.users.find(u => u.id === state.currentUser);

    // Calcular score
    const baseScore = CONFIG.BASE_SCORE + (g.difficulty * 50);
    const speedBonus = Math.max(0, CONFIG.SPEED_BONUS - g.elapsedTime * 3);
    const comboBonus = g.combo * 20;
    const streakBonus = g.streak * 10;
    const levelScore = baseScore + speedBonus + comboBonus + streakBonus;

    g.score += levelScore;

    // Calcular estrellas
    const timePerPoint = g.elapsedTime / g.targetShape.length;
    let stars = 1;
    if (timePerPoint < 1.5) stars = 3;
    else if (timePerPoint < 2.5) stars = 2;

    // Monedas
    const coins = 10 + (stars * 5) + (g.difficulty * 3);
    g.coins += coins;
    user.coins = (user.coins || 0) + coins;
    user.stars = (user.stars || 0) + stars;

    // Streak
    g.streak++;
    if (g.streak > g.maxStreak) g.maxStreak = g.streak;

    // Stats para IA
    g.successCount++;
    g.avgTime = (g.avgTime * (g.successCount - 1) + g.elapsedTime) / g.successCount;

    // Guardar
    user.score = Math.max(user.score || 0, g.score);
    user.level = Math.max(user.level || 1, g.level);
    saveData();

    // Ajustar dificultad
    adjustDifficulty();

    // Audio y vibración
    if (state.settings.sound) audio.win();
    vibrate('win');

    // Mostrar pantalla de victoria
    const titles = ['👍 ¡Bien!', '✨ ¡Muy Bien!', '🏆 ¡Perfecto!'];
    const colors = ['#10b981', '#6366f1', '#f59e0b'];

    document.getElementById('winTitle').textContent = titles[stars - 1];
    document.getElementById('winTitle').style.color = colors[stars - 1];
    document.getElementById('winStars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    document.getElementById('winScore').textContent = '+' + levelScore;
    document.getElementById('winTime').textContent = g.elapsedTime + 's';
    document.getElementById('winCoins').textContent = '+' + coins;
    document.getElementById('comboDisplay').textContent = g.combo > 2 ? '🔥 Combo x' + g.combo : '';

    // Verificar desbloqueos
    checkUnlocks(user);

    showScreen('screenWin');
    fireConfetti();
}

// ===== VERIFICAR DESBLOQUEOS =====
function checkUnlocks(user) {
    const msg = document.getElementById('unlockMessage');
    msg.textContent = '';

    // Desbloquear skins por nivel
    const unlocks = [
        { level: 3, skin: 'fire', msg: '🔥 Skin Fuego desbloqueado!' },
        { level: 5, skin: 'nature', msg: '🌿 Skin Naturaleza desbloqueado!' },
        { level: 8, skin: 'ocean', msg: '🌊 Skin Océano desbloqueado!' },
        { level: 10, skin: 'gold', msg: '✨ Skin Oro desbloqueado!' },
        { level: 15, skin: 'purple', msg: '👑 Skin Real desbloqueado!' },
        { level: 20, skin: 'neon', msg: '⚡ Skin Neón desbloqueado!' },
        { level: 30, skin: 'rainbow', msg: '🌈 Skin Arcoíris desbloqueado!' },
        { level: 50, skin: 'matrix', msg: '💚 Skin Matrix desbloqueado!' }
    ];

    for (const u of unlocks) {
        if (state.game.level === u.level) {
            const skin = SKINS.find(s => s.id === u.skin);
            if (skin && !skin.owned) {
                skin.owned = true;
                if (!user.skins) user.skins = [];
                user.skins.push(u.skin);
                msg.textContent = u.msg;
                saveData();
                break;
            }
        }
    }
}

// ===== SIGUIENTE NIVEL =====
function nextLevel() {
    state.game.level++;
    showScreen('screenGame');
    startLevel();
}

// ===== REINTENTAR =====
function retryLevel() {
    state.game.streak = 0;
    state.game.combo = 0;
    showScreen('screenGame');
    startLevel();
}

// ===== REINICIAR NIVEL =====
function restartLevel() {
    state.game.streak = 0;
    state.game.combo = 0;
    showScreen('screenGame');
    startLevel();
}

// ===== LIMPIAR =====
function clearBoard() {
    const g = state.game;
    g.playerShape = [];
    g.currentIndex = 0;
    g.combo = 0;
    drawPlayer();
    if (state.settings.sound) audio.clear();
    vibrate('clear');
    showToast('🗑️ Limpiado');
}

// ===== PISTA =====
function useHint() {
    const g = state.game;
    const user = state.users.find(u => u.id === state.currentUser);

    if ((user.coins || 0) < CONFIG.HINT_COST) {
        showToast('💰 Necesitas ' + CONFIG.HINT_COST + '🪙');
        return;
    }

    const next = g.targetShape[g.currentIndex];
    if (next) {
        user.coins -= CONFIG.HINT_COST;
        saveData();
        document.getElementById('hintCost').textContent = CONFIG.HINT_COST;
        drawPlayer([next]);
        if (state.settings.sound) audio.hint();
        vibrate('hint');
        showToast('💡 Punto ' + (g.currentIndex + 1));
    }
}

// ===== PAUSA =====
function pauseGame() {
    stopTimer();
    showScreen('screenPause');
}

function resumeGame() {
    showScreen('screenGame');
    if (!state.game.isMemorizing) {
        state.game.startTime = Date.now() - state.game.elapsedTime * 1000;
        startTimer();
    }
}

// ===== SISTEMA DE USUARIOS =====
function renderUsers() {
    const list = document.getElementById('usersList');
    list.innerHTML = '';

    if (state.users.length === 0) {
        list.innerHTML = '<div style="color:#64748b;text-align:center;padding:20px">No hay usuarios. Crea uno para empezar.</div>';
        return;
    }

    state.users.forEach(user => {
        const card = document.createElement('div');
        card.className = 'user-card' + (user.id === state.currentUser ? ' active' : '');
        card.innerHTML = `
            <div class="user-avatar" style="background:${user.color}">👤</div>
            <div class="user-info">
                <div class="user-name">${user.name}</div>
                <div class="user-stats">Nivel ${user.level || 1} | ⭐${user.stars || 0} | 🪙${user.coins || 0}</div>
            </div>
            <button class="user-delete" onclick="deleteUser(event, '${user.id}')">🗑️</button>
        `;
        card.onclick = (e) => {
            if (!e.target.classList.contains('user-delete')) {
                selectUser(user.id);
            }
        };
        list.appendChild(card);
    });
}

function showCreateUser() {
    if (state.users.length >= CONFIG.MAX_USERS) {
        showToast('⚠️ Máximo 3 usuarios');
        return;
    }

    // Renderizar color picker
    const picker = document.getElementById('colorPicker');
    picker.innerHTML = '';
    USER_COLORS.forEach((color, i) => {
        const div = document.createElement('div');
        div.className = 'color-option' + (i === 0 ? ' selected' : '');
        div.style.background = color;
        div.dataset.color = color;
        div.onclick = () => {
            picker.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
            div.classList.add('selected');
        };
        picker.appendChild(div);
    });

    document.getElementById('newUserName').value = '';
    showScreen('screenCreateUser');
}

function createUser() {
    const name = document.getElementById('newUserName').value.trim();
    if (!name) {
        showToast('⚠️ Ingresa un nombre');
        return;
    }

    const selectedColor = document.querySelector('.color-option.selected');
    const color = selectedColor ? selectedColor.dataset.color : USER_COLORS[0];

    const user = {
        id: 'user_' + Date.now(),
        name: name,
        color: color,
        score: 0,
        coins: 0,
        stars: 0,
        level: 1,
        streak: 0,
        maxStreak: 0,
        skins: ['default'],
        currentSkin: 'default',
        history: []
    };

    state.users.push(user);
    state.currentUser = user.id;
    saveData();

    showToast('✅ Usuario creado: ' + name);
    showStartScreen();
}

function selectUser(id) {
    state.currentUser = id;
    saveData();
    showStartScreen();
}

function deleteUser(e, id) {
    e.stopPropagation();
    if (confirm('¿Eliminar este usuario?')) {
        state.users = state.users.filter(u => u.id !== id);
        if (state.currentUser === id) state.currentUser = null;
        saveData();
        renderUsers();
    }
}

// ===== PANTALLA INICIO =====
function showStartScreen() {
    const user = state.users.find(u => u.id === state.currentUser);
    if (!user) {
        showScreen('screenUsers');
        return;
    }

    document.getElementById('welcomeUser').textContent = '¡Hola, ' + user.name + '!';
    document.getElementById('startStars').textContent = user.stars || 0;
    document.getElementById('startCoins').textContent = user.coins || 0;
    document.getElementById('startStreak').textContent = user.streak || 0;

    showScreen('screenStart');
}

// ===== INICIAR JUEGO =====
function startGame() {
    const user = state.users.find(u => u.id === state.currentUser);
    if (!user) return;

    // Reset game state
    state.game = {
        level: user.level || 1,
        score: 0,
        coins: 0,
        stars: 0,
        streak: 0,
        maxStreak: 0,
        combo: 0,
        targetShape: [],
        playerShape: [],
        currentIndex: 0,
        isMemorizing: false,
        startTime: 0,
        elapsedTime: 0,
        timerInterval: null,
        difficulty: Math.min(Math.floor((user.level || 1) / 3), DIFFICULTIES.length - 1),
        patternHistory: [],
        failCount: 0,
        successCount: 0,
        avgTime: 0
    };

    showScreen('screenGame');
    startLevel();
}

// ===== SKINS =====
function showSkins() {
    const user = state.users.find(u => u.id === state.currentUser);
    if (!user) return;

    document.getElementById('skinCoins').textContent = user.coins || 0;

    const grid = document.getElementById('skinsGrid');
    grid.innerHTML = '';

    SKINS.forEach(skin => {
        const isOwned = skin.owned || (user.skins && user.skins.includes(skin.id));
        const isSelected = user.currentSkin === skin.id;

        const card = document.createElement('div');
        card.className = 'skin-card' + (isOwned ? ' owned' : ' locked') + (isSelected ? ' selected' : '');
        card.innerHTML = `
            <div class="skin-preview">${skin.emoji}</div>
            <div class="skin-name">${skin.name}</div>
            <div class="skin-price">${isOwned ? (isSelected ? '✅ Activo' : 'Usar') : skin.price + '🪙'}</div>
        `;

        card.onclick = () => {
            if (isOwned) {
                user.currentSkin = skin.id;
                saveData();
                showSkins();
                showToast('🎨 ' + skin.name + ' activado');
            } else if ((user.coins || 0) >= skin.price) {
                user.coins -= skin.price;
                skin.owned = true;
                if (!user.skins) user.skins = [];
                user.skins.push(skin.id);
                user.currentSkin = skin.id;
                saveData();
                showSkins();
                showToast('🎉 ' + skin.name + ' comprado!');
            } else {
                showToast('💰 Necesitas ' + skin.price + '🪙');
            }
        };

        grid.appendChild(card);
    });

    showScreen('screenSkins');
}

// ===== RANKING =====
function showLeaderboard() {
    const list = document.getElementById('leaderboardList');
    list.innerHTML = '';

    // Combinar usuarios locales
    let allScores = state.users.map(u => ({
        name: u.name,
        score: u.score || 0,
        level: u.level || 1,
        stars: u.stars || 0,
        isLocal: true
    }));

    // Añadir scores de localStorage
    try {
        const saved = JSON.parse(localStorage.getItem('brainGridLeaderboard'));
        if (saved && Array.isArray(saved)) {
            allScores = allScores.concat(saved.filter(s => !allScores.find(u => u.name === s.name)));
        }
    } catch(e) {}

    // Ordenar
    allScores.sort((a, b) => b.score - a.score);
    allScores = allScores.slice(0, 10);

    // Guardar
    localStorage.setItem('brainGridLeaderboard', JSON.stringify(allScores));

    // Renderizar
    allScores.forEach((entry, i) => {
        const div = document.createElement('div');
        div.className = 'lb-item';
        const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
        div.innerHTML = `
            <div class="lb-rank ${rankClass}">${i + 1}</div>
            <div class="lb-info">
                <div class="lb-name">${entry.name} ${entry.isLocal ? '(Tú)' : ''}</div>
                <div class="lb-details">Nivel ${entry.level} | ⭐${entry.stars}</div>
            </div>
            <div class="lb-score">${entry.score}</div>
        `;
        list.appendChild(div);
    });

    if (allScores.length === 0) {
        list.innerHTML = '<div style="text-align:center;color:#64748b;padding:20px">No hay puntuaciones aún. ¡Juega!</div>';
    }

    showScreen('screenLeaderboard');
}

// ===== AJUSTES =====
function showSettings() {
    document.getElementById('darkModeToggle').checked = state.settings.darkMode;
    document.getElementById('soundToggle').checked = state.settings.sound;
    document.getElementById('vibrateToggle').checked = state.settings.vibrate;
    document.getElementById('memoTimeSelect').value = state.settings.memoTime;
    showScreen('screenSettings');
}

function toggleDarkMode() {
    state.settings.darkMode = document.getElementById('darkModeToggle').checked;
    document.body.classList.toggle('light-mode', !state.settings.darkMode);
    saveData();
}

function toggleSound() {
    state.settings.sound = document.getElementById('soundToggle').checked;
    audio.enabled = state.settings.sound;
    saveData();
}

function toggleVibrate() {
    state.settings.vibrate = document.getElementById('vibrateToggle').checked;
    saveData();
}

function changeMemoTime() {
    state.settings.memoTime = parseInt(document.getElementById('memoTimeSelect').value);
    saveData();
}

function resetProgress() {
    if (confirm('⚠️ ¿Borrar TODO el progreso? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('brainGridPro');
        localStorage.removeItem('brainGridLeaderboard');
        state.users = [];
        state.currentUser = null;
        SKINS.forEach((s, i) => { s.owned = i === 0; });
        showToast('🗑️ Progreso borrado');
        showScreen('screenUsers');
        renderUsers();
    }
}

// ===== CONFETTI =====
function fireConfetti() {
    const particles = [];
    const colors = ['#f43f5e', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#667eea', '#764ba2'];

    canvasConfetti.width = window.innerWidth;
    canvasConfetti.height = window.innerHeight;

    for (let i = 0; i < 100; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 16,
            vy: (Math.random() - 0.5) * 16 - 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 3,
            life: 1,
            decay: Math.random() * 0.02 + 0.01,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 8
        });
    }

    function animate() {
        ctxConfetti.clearRect(0, 0, canvasConfetti.width, canvasConfetti.height);
        let alive = false;

        particles.forEach(p => {
            if (p.life > 0) {
                alive = true;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.25;
                p.life -= p.decay;
                p.rotation += p.rotSpeed;

                ctxConfetti.save();
                ctxConfetti.globalAlpha = p.life;
                ctxConfetti.translate(p.x, p.y);
                ctxConfetti.rotate(p.rotation * Math.PI / 180);
                ctxConfetti.fillStyle = p.color;
                ctxConfetti.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                ctxConfetti.restore();
            }
        });

        if (alive) requestAnimationFrame(animate);
    }

    animate();
}

// ===== INICIALIZACIÓN =====
function init() {
    loadData();

    // Aplicar modo oscuro
    if (!state.settings.darkMode) {
        document.body.classList.add('light-mode');
    }

    // Configurar audio
    audio.enabled = state.settings.sound;

    // Resize confetti canvas
    canvasConfetti.width = window.innerWidth;
    canvasConfetti.height = window.innerHeight;
    window.addEventListener('resize', () => {
        canvasConfetti.width = window.innerWidth;
        canvasConfetti.height = window.innerHeight;
    });

    // Mostrar pantalla inicial
    if (state.currentUser && state.users.find(u => u.id === state.currentUser)) {
        showStartScreen();
    } else {
        showScreen('screenUsers');
        renderUsers();
    }
}

// Iniciar
init();
