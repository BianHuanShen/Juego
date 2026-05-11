const levels = [

/* =========================================
   FÁCIL
   NIVELES 1 - 25
========================================= */

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
},

{
  level:6,
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
  level:7,
  name:"Triángulo",
  points:[
    {x:2,y:6},
    {x:4,y:2},
    {x:6,y:6},
    {x:2,y:6}
  ]
},

{
  level:8,
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
  level:9,
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
  level:10,
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
  level:11,
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
  level:12,
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
  level:13,
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
  level:14,
  name:"Helado",
  points:[
    {x:2,y:3},
    {x:6,y:3},
    {x:4,y:7},
    {x:2,y:3}
  ]
},

{
  level:15,
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
  level:16,
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
  level:17,
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
  level:18,
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
  level:19,
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
  level:20,
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
  level:21,
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
  level:22,
  name:"Rayo",
  points:[
    {x:4,y:1},
    {x:2,y:4},
    {x:4,y:4},
    {x:3,y:7},
    {x:6,y:3},
    {x:4,y:3}
  ]
},

{
  level:23,
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
  level:24,
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
  level:25,
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

/* =========================================
   NIVELES 26 - 50
   DIFICULTAD MEDIA
========================================= */

{
  level:26,
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
  level:27,
  name:"Casa Doble",
  points:[
    {x:1,y:7},
    {x:1,y:4},
    {x:3,y:2},
    {x:5,y:4},
    {x:5,y:7},
    {x:1,y:7}
  ]
},

{
  level:28,
  name:"Ventana",
  points:[
    {x:2,y:2},
    {x:6,y:2},
    {x:6,y:6},
    {x:2,y:6},
    {x:2,y:2},
    {x:4,y:2},
    {x:4,y:6}
  ]
},

{
  level:29,
  name:"Puerta",
  points:[
    {x:3,y:7},
    {x:3,y:3},
    {x:5,y:3},
    {x:5,y:7}
  ]
},

{
  level:30,
  name:"Techo",
  points:[
    {x:2,y:5},
    {x:4,y:2},
    {x:6,y:5}
  ]
},

{
  level:31,
  name:"Barco",
  points:[
    {x:1,y:6},
    {x:3,y:7},
    {x:6,y:7},
    {x:8,y:6},
    {x:1,y:6}
  ]
},

{
  level:32,
  name:"Velero",
  points:[
    {x:4,y:1},
    {x:4,y:6},
    {x:7,y:6},
    {x:4,y:1}
  ]
},

{
  level:33,
  name:"Ancla",
  points:[
    {x:4,y:1},
    {x:4,y:7},
    {x:2,y:5},
    {x:4,y:7},
    {x:6,y:5}
  ]
},

{
  level:34,
  name:"Pez",
  points:[
    {x:1,y:4},
    {x:3,y:2},
    {x:6,y:2},
    {x:8,y:4},
    {x:6,y:6},
    {x:3,y:6},
    {x:1,y:4}
  ]
},

{
  level:35,
  name:"Ola",
  points:[
    {x:1,y:5},
    {x:2,y:4},
    {x:3,y:5},
    {x:4,y:4},
    {x:5,y:5},
    {x:6,y:4},
    {x:7,y:5}
  ]
},

{
  level:36,
  name:"Copa",
  points:[
    {x:2,y:1},
    {x:6,y:1},
    {x:5,y:4},
    {x:4,y:5},
    {x:3,y:4},
    {x:2,y:1}
  ]
},

{
  level:37,
  name:"Corona",
  points:[
    {x:1,y:7},
    {x:2,y:2},
    {x:4,y:5},
    {x:6,y:2},
    {x:7,y:7}
  ]
},

{
  level:38,
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
  level:39,
  name:"Estrella Simple",
  points:[
    {x:4,y:1},
    {x:5,y:4},
    {x:8,y:4},
    {x:6,y:6},
    {x:7,y:8},
    {x:4,y:7},
    {x:1,y:8},
    {x:2,y:6},
    {x:0,y:4},
    {x:3,y:4},
    {x:4,y:1}
  ]
},

{
  level:40,
  name:"Flor",
  points:[
    {x:4,y:1},
    {x:6,y:3},
    {x:4,y:5},
    {x:2,y:3},
    {x:4,y:1}
  ]
},

{
  level:41,
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
  level:42,
  name:"Árbol",
  points:[
    {x:4,y:1},
    {x:6,y:3},
    {x:5,y:3},
    {x:7,y:5},
    {x:1,y:5},
    {x:3,y:3},
    {x:2,y:3},
    {x:4,y:1}
  ]
},

{
  level:43,
  name:"Robot",
  points:[
    {x:2,y:1},
    {x:6,y:1},
    {x:6,y:5},
    {x:2,y:5},
    {x:2,y:1}
  ]
},

{
  level:44,
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
  level:45,
  name:"Cohete",
  points:[
    {x:4,y:1},
    {x:6,y:4},
    {x:5,y:7},
    {x:3,y:7},
    {x:2,y:4},
    {x:4,y:1}
  ]
},

{
  level:46,
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
  level:47,
  name:"Escudo",
  points:[
    {x:2,y:2},
    {x:6,y:2},
    {x:7,y:4},
    {x:4,y:8},
    {x:1,y:4},
    {x:2,y:2}
  ]
},

{
  level:48,
  name:"Rayo",
  points:[
    {x:4,y:1},
    {x:2,y:4},
    {x:4,y:4},
    {x:3,y:7},
    {x:6,y:3},
    {x:4,y:3}
  ]
},

{
  level:49,
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
  level:50,
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

/* =========================================
   NIVELES 51 - 75
   DIFICULTAD INTERMEDIA
========================================= */

{
  level:51,
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
  level:52,
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
  level:53,
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
  level:54,
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
},

{
  level:55,
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
  level:56,
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
  level:57,
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
  level:58,
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
  level:59,
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
},

{
  level:60,
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
  level:61,
  name:"Doble Flecha",
  points:[
    {x:1,y:4},
    {x:4,y:1},
    {x:4,y:3},
    {x:7,y:3},
    {x:4,y:6},
    {x:4,y:8},
    {x:1,y:4}
  ]
},

{
  level:62,
  name:"Reloj",
  points:[
    {x:4,y:1},
    {x:6,y:3},
    {x:6,y:6},
    {x:4,y:8},
    {x:2,y:6},
    {x:2,y:3},
    {x:4,y:1},
    {x:4,y:4},
    {x:5,y:5}
  ]
},

{
  level:63,
  name:"Pirámide",
  points:[
    {x:1,y:7},
    {x:4,y:1},
    {x:7,y:7},
    {x:1,y:7}
  ]
},

{
  level:64,
  name:"Puente",
  points:[
    {x:1,y:5},
    {x:2,y:3},
    {x:4,y:2},
    {x:6,y:3},
    {x:7,y:5}
  ]
},

{
  level:65,
  name:"Cometa",
  points:[
    {x:4,y:1},
    {x:7,y:4},
    {x:4,y:7},
    {x:1,y:4},
    {x:4,y:1},
    {x:4,y:8}
  ]
},

{
  level:66,
  name:"Hexágono",
  points:[
    {x:2,y:2},
    {x:6,y:2},
    {x:8,y:4},
    {x:6,y:6},
    {x:2,y:6},
    {x:0,y:4},
    {x:2,y:2}
  ]
},

{
  level:67,
  name:"Diana",
  points:[
    {x:4,y:1},
    {x:7,y:4},
    {x:4,y:7},
    {x:1,y:4},
    {x:4,y:1},
    {x:4,y:4}
  ]
},

{
  level:68,
  name:"Escorpión",
  points:[
    {x:1,y:7},
    {x:3,y:5},
    {x:5,y:5},
    {x:7,y:3},
    {x:5,y:1},
    {x:4,y:3},
    {x:2,y:2}
  ]
},

{
  level:69,
  name:"Máscara",
  points:[
    {x:2,y:2},
    {x:6,y:2},
    {x:7,y:5},
    {x:6,y:7},
    {x:2,y:7},
    {x:1,y:5},
    {x:2,y:2},
    {x:3,y:4},
    {x:5,y:4}
  ]
},

{
  level:70,
  name:"Tridente",
  points:[
    {x:2,y:1},
    {x:2,y:5},
    {x:4,y:1},
    {x:4,y:7},
    {x:6,y:1},
    {x:6,y:5}
  ]
},

{
  level:71,
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
  level:72,
  name:"Satélite",
  points:[
    {x:4,y:1},
    {x:7,y:4},
    {x:4,y:7},
    {x:1,y:4},
    {x:4,y:1},
    {x:8,y:4}
  ]
},

{
  level:73,
  name:"Serpiente Real",
  points:[
    {x:1,y:2},
    {x:3,y:2},
    {x:3,y:4},
    {x:5,y:4},
    {x:5,y:6},
    {x:7,y:6},
    {x:7,y:8}
  ]
},

{
  level:74,
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
  level:75,
  name:"Constelación Real",
  points:[
    {x:1,y:1},
    {x:3,y:2},
    {x:5,y:1},
    {x:7,y:3},
    {x:6,y:5},
    {x:8,y:7},
    {x:4,y:8},
    {x:2,y:6},
    {x:1,y:1}
  ]
},

/* =========================================
   NIVELES 76 - 100
   DIFICULTAD DIFÍCIL / EXPERTA
========================================= */

{
  level:76,
  name:"Fortaleza",
  points:[
    {x:1,y:7},
    {x:1,y:2},
    {x:3,y:2},
    {x:3,y:4},
    {x:5,y:4},
    {x:5,y:2},
    {x:7,y:2},
    {x:7,y:7},
    {x:1,y:7}
  ]
},

{
  level:77,
  name:"Castillo Real",
  points:[
    {x:1,y:7},
    {x:1,y:3},
    {x:2,y:3},
    {x:2,y:5},
    {x:4,y:1},
    {x:6,y:5},
    {x:6,y:3},
    {x:7,y:3},
    {x:7,y:7},
    {x:1,y:7}
  ]
},

{
  level:78,
  name:"Labirinto Complejo",
  points:[
    {x:1,y:1},
    {x:7,y:1},
    {x:7,y:7},
    {x:1,y:7},
    {x:1,y:2},
    {x:6,y:2},
    {x:6,y:6},
    {x:2,y:6},
    {x:2,y:3},
    {x:5,y:3},
    {x:5,y:5}
  ]
},

{
  level:79,
  name:"Espiral",
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
  level:80,
  name:"Dragón Supremo",
  points:[
    {x:1,y:7},
    {x:2,y:4},
    {x:4,y:2},
    {x:6,y:1},
    {x:8,y:3},
    {x:7,y:5},
    {x:8,y:7},
    {x:6,y:8},
    {x:4,y:6},
    {x:2,y:6},
    {x:1,y:7}
  ]
},

{
  level:81,
  name:"Serpiente Alfa",
  points:[
    {x:1,y:2},
    {x:3,y:2},
    {x:3,y:4},
    {x:5,y:4},
    {x:5,y:6},
    {x:7,y:6},
    {x:7,y:8},
    {x:5,y:8}
  ]
},

{
  level:82,
  name:"Catedral",
  points:[
    {x:1,y:7},
    {x:2,y:2},
    {x:4,y:1},
    {x:6,y:2},
    {x:7,y:7},
    {x:5,y:7},
    {x:5,y:4},
    {x:3,y:4},
    {x:3,y:7},
    {x:1,y:7}
  ]
},

{
  level:83,
  name:"Cráneo",
  points:[
    {x:2,y:2},
    {x:6,y:2},
    {x:7,y:4},
    {x:6,y:7},
    {x:4,y:8},
    {x:2,y:7},
    {x:1,y:4},
    {x:2,y:2}
  ]
},

{
  level:84,
  name:"Ciclope",
  points:[
    {x:2,y:3},
    {x:6,y:3},
    {x:6,y:6},
    {x:2,y:6},
    {x:2,y:3},
    {x:4,y:5},
    {x:6,y:3}
  ]
},

{
  level:85,
  name:"Trono",
  points:[
    {x:2,y:7},
    {x:2,y:3},
    {x:4,y:3},
    {x:4,y:1},
    {x:6,y:3},
    {x:6,y:7},
    {x:2,y:7}
  ]
},

{
  level:86,
  name:"Guardián",
  points:[
    {x:4,y:1},
    {x:6,y:3},
    {x:6,y:6},
    {x:4,y:8},
    {x:2,y:6},
    {x:2,y:3},
    {x:4,y:1}
  ]
},

{
  level:87,
  name:"Ojo",
  points:[
    {x:1,y:4},
    {x:4,y:1},
    {x:7,y:4},
    {x:4,y:7},
    {x:1,y:4},
    {x:4,y:4}
  ]
},

{
  level:88,
  name:"Reloj Antiguo",
  points:[
    {x:4,y:1},
    {x:6,y:3},
    {x:6,y:6},
    {x:4,y:8},
    {x:2,y:6},
    {x:2,y:3},
    {x:4,y:1},
    {x:4,y:4},
    {x:5,y:5}
  ]
},

{
  level:89,
  name:"Relámpago Doble",
  points:[
    {x:4,y:1},
    {x:2,y:4},
    {x:4,y:4},
    {x:3,y:7},
    {x:6,y:3},
    {x:4,y:3},
    {x:5,y:6}
  ]
},

{
  level:90,
  name:"Murciélago Alfa",
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
  level:91,
  name:"Labrys Final",
  points:[
    {x:4,y:0},
    {x:6,y:2},
    {x:5,y:4},
    {x:7,y:6},
    {x:4,y:8},
    {x:1,y:6},
    {x:3,y:4},
    {x:2,y:2},
    {x:4,y:0},
    {x:4,y:4}
  ]
},

{
  level:92,
  name:"Fénix Supremo",
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
    {x:4,y:0},
    {x:4,y:4}
  ]
},

{
  level:93,
  name:"Constelación Final",
  points:[
    {x:1,y:1},
    {x:3,y:2},
    {x:5,y:1},
    {x:7,y:3},
    {x:6,y:5},
    {x:8,y:7},
    {x:4,y:8},
    {x:2,y:6},
    {x:1,y:1},
    {x:4,y:4}
  ]
},

{
  level:94,
  name:"Estructura Cuántica",
  points:[
    {x:1,y:2},
    {x:3,y:1},
    {x:5,y:2},
    {x:7,y:1},
    {x:7,y:4},
    {x:5,y:6},
    {x:3,y:6},
    {x:1,y:4},
    {x:1,y:2}
  ]
},

{
  level:95,
  name:"Núcleo",
  points:[
    {x:4,y:1},
    {x:6,y:4},
    {x:4,y:7},
    {x:2,y:4},
    {x:4,y:1},
    {x:4,y:4}
  ]
},

{
  level:96,
  name:"Vórtice",
  points:[
    {x:1,y:1},
    {x:7,y:1},
    {x:7,y:7},
    {x:1,y:7},
    {x:2,y:2},
    {x:6,y:2},
    {x:6,y:6},
    {x:2,y:6}
  ]
},

{
  level:97,
  name:"Espiral Final",
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
    {x:5,y:3},
    {x:4,y:4}
  ]
},

{
  level:98,
  name:"Dominio",
  points:[
    {x:2,y:2},
    {x:6,y:2},
    {x:7,y:5},
    {x:6,y:7},
    {x:2,y:7},
    {x:1,y:5},
    {x:2,y:2},
    {x:4,y:4},
    {x:6,y:2}
  ]
},

{
  level:99,
  name:"Abismo",
  points:[
    {x:1,y:1},
    {x:7,y:1},
    {x:7,y:7},
    {x:1,y:7},
    {x:4,y:4},
    {x:2,y:2},
    {x:6,y:2},
    {x:6,y:6},
    {x:2,y:6}
  ]
},

{
  level:100,
  name:"Leyenda",
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
    {x:4,y:0},
    {x:4,y:4}
  ]
  }
   ];
/*const SIZE = 9;
const levels = [];

// =========================
// 🧠 PLANTILLAS BASE
// =========================

const TEMPLATES = {

  line: [
    { x: 1, y: 4 },
    { x: 4, y: 4 },
    { x: 7, y: 4 }
  ],

  square: [
    { x: 2, y: 2 },
    { x: 6, y: 2 },
    { x: 6, y: 6 },
    { x: 2, y: 6 },
    { x: 2, y: 2 }
  ],

  triangle: [
    { x: 4, y: 1 },
    { x: 7, y: 7 },
    { x: 1, y: 7 },
    { x: 4, y: 1 }
  ],

  cross: [
    { x: 4, y: 1 },
    { x: 4, y: 7 },
    { x: 4, y: 4 },
    { x: 1, y: 4 },
    { x: 7, y: 4 }
  ],

  star: [
    { x: 4, y: 0 },
    { x: 5, y: 3 },
    { x: 8, y: 3 },
    { x: 6, y: 5 },
    { x: 7, y: 8 },
    { x: 4, y: 6 },
    { x: 1, y: 8 },
    { x: 2, y: 5 },
    { x: 0, y: 3 },
    { x: 3, y: 3 },
    { x: 4, y: 0 }
  ]
};

// =========================
// 🎮 SELECTOR DE DIFICULTAD
// =========================

function getTemplate(level) {

  if (level <= 15) return "line";
  if (level <= 30) return "square";
  if (level <= 50) return "triangle";
  if (level <= 75) return "cross";
  return "star";
}

// =========================
// 🧠 IA DE TRANSFORMACIÓN
// =========================

function transform(points, level) {

  const noise = level * 0.05; // más nivel = más distorsión

  return points.map(p => ({
    x: clamp(p.x + rand(-noise, noise)),
    y: clamp(p.y + rand(-noise, noise))
  }));
}

// =========================
// 🔁 SIMETRÍA AAA
// =========================

function mirror(points) {
  return points.map(p => ({
    x: 8 - p.x,
    y: p.y
  }));
}

// =========================
// ⚙️ CLAMP Y RANDOM
// =========================

function clamp(v) {
  return Math.max(0, Math.min(SIZE - 1, Math.round(v)));
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// =========================
// 🔥 GENERADOR AAA
// =========================

function generateLevel(level) {

  let base = getTemplate(level);
  let points = structuredClone(TEMPLATES[base]);

  // 🧠 transformación inteligente
  points = transform(points, level);

  // 🔁 niveles altos = simetría
  if (level >= 40) {
    const mirrored = mirror(points);
    points = [...points, ...mirrored];
  }

  // 🔒 cerrar figura si no lo está
  if (points.length > 2 &&
      (points[0].x !== points.at(-1).x ||
       points[0].y !== points.at(-1).y)) {
    points.push(points[0]);
  }

  return {
    level,
    name: `Nivel ${level} - ${base}`,
    points
  };
}

// =========================
// 🚀 GENERAR 100 NIVELES AAA
// =========================

for (let i = 1; i <= 100; i++) {
  levels.push(generateLevel(i));
   }*/
/* GAME LOGIC */
function generatePath(){

  const index =
    Math.min(
      level - 1,
      levels.length - 1
    );

  return levels[index].points.slice();
}
