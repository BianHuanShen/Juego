/* =========================================
   LEVELS EXTENSION
   NUEVAS FIGURAS EDUCATIVAS
========================================= */

levels.push(

/* =========================================
   NIVELES EDUCATIVOS INTERMEDIOS
========================================= */

{
  level:105,
  name:"Cruz",
  points:[
    {x:4,y:1},
    {x:4,y:7},
    {x:4,y:4},
    {x:1,y:4},
    {x:7,y:4}
  ]
},

{
  level:110,
  name:"Ventana",
  points:[
    {x:2,y:2},
    {x:6,y:2},
    {x:6,y:6},
    {x:2,y:6},
    {x:2,y:2},
    {x:4,y:2},
    {x:4,y:6},
    {x:2,y:4},
    {x:6,y:4}
  ]
},

{
  level:115,
  name:"Flor",
  points:[
    {x:4,y:1},
    {x:5,y:3},
    {x:7,y:4},
    {x:5,y:5},
    {x:4,y:7},
    {x:3,y:5},
    {x:1,y:4},
    {x:3,y:3},
    {x:4,y:1}
  ]
},

{
  level:120,
  name:"Cohete",
  points:[
    {x:4,y:1},
    {x:6,y:4},
    {x:5,y:4},
    {x:5,y:7},
    {x:3,y:7},
    {x:3,y:4},
    {x:2,y:4},
    {x:4,y:1}
  ]
},

{
  level:125,
  name:"Helado",
  points:[
    {x:2,y:3},
    {x:6,y:3},
    {x:4,y:7},
    {x:2,y:3}
  ]
},

/* =========================================
   NIVELES AVANZADOS
========================================= */

{
  level:130,
  name:"Serpiente",
  points:[
    {x:1,y:2},
    {x:3,y:2},
    {x:3,y:4},
    {x:5,y:4},
    {x:5,y:6},
    {x:7,y:6}
  ]
},

{
  level:135,
  name:"Espada",
  points:[
    {x:4,y:1},
    {x:5,y:3},
    {x:4,y:7},
    {x:3,y:3},
    {x:4,y:1}
  ]
},

{
  level:140,
  name:"Cara Feliz",
  points:[
    {x:2,y:2},
    {x:6,y:2},
    {x:7,y:5},
    {x:6,y:7},
    {x:2,y:7},
    {x:1,y:5},
    {x:2,y:2}
  ]
},

{
  level:145,
  name:"Montaña",
  points:[
    {x:1,y:7},
    {x:3,y:3},
    {x:5,y:6},
    {x:7,y:2},
    {x:8,y:7}
  ]
},

{
  level:150,
  name:"Relámpago",
  points:[
    {x:4,y:1},
    {x:2,y:4},
    {x:4,y:4},
    {x:3,y:7},
    {x:6,y:3},
    {x:4,y:3}
  ]
},

/* =========================================
   NIVELES EXPERTOS
========================================= */

{
  level:155,
  name:"Araña",
  points:[
    {x:2,y:2},
    {x:6,y:2},
    {x:7,y:4},
    {x:6,y:6},
    {x:2,y:6},
    {x:1,y:4},
    {x:2,y:2},
    {x:4,y:0},
    {x:4,y:8}
  ]
},

{
  level:160,
  name:"Molino",
  points:[
    {x:4,y:1},
    {x:6,y:3},
    {x:4,y:4},
    {x:7,y:4},
    {x:5,y:5},
    {x:4,y:8},
    {x:3,y:5},
    {x:1,y:4},
    {x:4,y:4},
    {x:2,y:3},
    {x:4,y:1}
  ]
},

{
  level:165,
  name:"Laberinto",
  points:[
    {x:1,y:1},
    {x:7,y:1},
    {x:7,y:7},
    {x:2,y:7},
    {x:2,y:2},
    {x:6,y:2},
    {x:6,y:6},
    {x:3,y:6},
    {x:3,y:3},
    {x:5,y:3}
  ]
},

{
  level:170,
  name:"Dragón Real",
  points:[
    {x:1,y:7},
    {x:2,y:4},
    {x:4,y:2},
    {x:6,y:1},
    {x:8,y:3},
    {x:7,y:5},
    {x:8,y:7},
    {x:5,y:8},
    {x:3,y:6},
    {x:1,y:7}
  ]
},

{
  level:175,
  name:"Constelación",
  points:[
    {x:1,y:2},
    {x:3,y:1},
    {x:5,y:3},
    {x:7,y:2},
    {x:6,y:5},
    {x:8,y:7},
    {x:4,y:8},
    {x:2,y:6},
    {x:1,y:2}
  ]
}

);

/* =========================================
   NUEVA PROGRESIÓN
========================================= */

function generatePath(){

  if(level <= 4){
    return levels[level - 1].points;
  }

  const figureIndex =
    Math.floor((level - 5) / 5) + 4;

  const safeIndex =
    Math.min(
      figureIndex,
      levels.length - 1
    );

  return levels[safeIndex].points;
}

/* =========================================
   NUEVAS FUNCIONES EDUCATIVAS
========================================= */

function getCurrentFigureName(){

  if(level <= 4){
    return levels[level - 1].name;
  }

  const figureIndex =
    Math.floor((level - 5) / 5) + 4;

  const safeIndex =
    Math.min(
      figureIndex,
      levels.length - 1
    );

  return levels[safeIndex].name;
}

function updateFigureHUD(){

  const figureName =
    document.getElementById("figureName");

  if(!figureName)
    return;

  figureName.textContent =
    getCurrentFigureName();
}

/* =========================================
   INTEGRACIÓN AUTOMÁTICA
========================================= */

const originalStartGame = startGame;

startGame = function(){

  updateFigureHUD();

  originalStartGame();
};
