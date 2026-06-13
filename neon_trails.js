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

let isDrawing = false;
let activeStroke = { points: [], color: '' };
let ghosts = []; 

function getRandomVelocity() {
  return (Math.random() - 0.5) * 1.5; 
}

function startDrawing(x, y) {
  isDrawing = true;
  activeStroke.color = neonColors[Math.floor(Math.random() * neonColors.length)];
  activeStroke.points = [{ x, y }];
}

function drawPoint(x, y) {
  if (!isDrawing) return;
  activeStroke.points.push({ x, y });
}

function stopDrawing() {
  if (!isDrawing) return;
  isDrawing = false;
  
  if (activeStroke.points.length > 0) {
    const clonedPoints = activeStroke.points.map(p => ({ x: p.x, y: p.y }));
    
    ghosts.push({
      points: clonedPoints, 
      color: activeStroke.color,
      vx: getRandomVelocity(),
      vy: getRandomVelocity(),
      phase: Math.random() * Math.PI * 2 
    });
  }
  activeStroke.points = [];
}

window.addEventListener('mousedown', (e) => startDrawing(e.clientX, e.clientY));
window.addEventListener('mousemove', (e) => drawPoint(e.clientX, e.clientY));
window.addEventListener('mouseup', stopDrawing);

window.addEventListener('touchstart', (e) => {
  startDrawing(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

window.addEventListener('touchmove', (e) => {
  e.preventDefault(); 
  drawPoint(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

window.addEventListener('touchend', stopDrawing);

window.addEventListener('dblclick', () => {
  ghosts = []; 
  activeStroke.points = [];
  isDrawing = false;
});


function drawPath(points, color, opacity, blur) {
  if (points.length < 2) return;
  
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = opacity;
  ctx.shadowBlur = blur;
  ctx.shadowColor = color;
  ctx.stroke();
}

function animate() {
  ctx.fillStyle = '#030303';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const time = Date.now() / 500; 

  for (let ghost of ghosts) {
    let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0;
    
    for (let p of ghost.points) {
      p.x += ghost.vx;
      p.y += ghost.vy;
      
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }

    if (minX <= 0 || maxX >= canvas.width) ghost.vx *= -1;
    if (minY <= 0 || maxY >= canvas.height) ghost.vy *= -1;

    const opacity = 0.1 + 0.3 * Math.abs(Math.sin(time + ghost.phase));
    drawPath(ghost.points, ghost.color, opacity, 10);
  }

  if (isDrawing) {
    drawPath(activeStroke.points, activeStroke.color, 1.0, 20); 
  }

  requestAnimationFrame(animate);
}

animate();