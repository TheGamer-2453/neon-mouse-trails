const canvas = document.getElementById('echoCanvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const neonColors = [
  '#FF0055',
  '#00FFCC',
  '#9900FF',
  '#CCFF00',
  '#FF6600' 
];

let activeStroke = {points: [], color = '', active:false, timer: null};
let ghost =[];

function getRandomVelocity(){
    return (Math.random() - 0.5) * 1.5;
}

window.addEventListener('mousemove', (e) => {
    if (!activeStroke.active) {
        activeStroke.active = true;
        activeStroke.color = neonColors[Math.floor(Math.random() * neonColors.length)];
        activeStroke.points = [];
    }

    activeStroke.points.push({ x: e.clientX, y: e.clientY});

    clearTimeout(activeStroke.timer);
    activeStroke.timer = setTimeout(() => {
        if ()
    })
})