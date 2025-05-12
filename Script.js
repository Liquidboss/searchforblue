const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create particles
const particleCount = 10000; // Try 10k first for performance, scale later
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;
  positions[i3 + 0] = (Math.random() - 0.5) * 20;
  positions[i3 + 1] = (Math.random() - 0.5) * 20;
  positions[i3 + 2] = (Math.random() - 0.5) * 20;

  // 10 blue dots, the rest white
  if (i < 10) {
    colors[i3 + 0] = 0.0;
    colors[i3 + 1] = 0.4;
    colors[i3 + 2] = 1.0;
  } else {
    colors[i3 + 0] = 1.0;
    colors[i3 + 1] = 1.0;
    colors[i3 + 2] = 1.0;
  }
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({ size: 0.05, vertexColors: true });
const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Animate
function animate() {
  requestAnimationFrame(animate);
  particles.rotation.y += 0.0005;
  particles.rotation.x += 0.0002;
  renderer.render(scene, camera);
}
animate();

// Touch drag interaction
let isDragging = false;
let previousX, previousY;

function onPointerDown(e) {
  isDragging = true;
  previousX = e.touches ? e.touches[0].clientX : e.clientX;
  previousY = e.touches ? e.touches[0].clientY : e.clientY;
}

function onPointerMove(e) {
  if (!isDragging) return;
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;

  const deltaX = x - previousX;
  const deltaY = y - previousY;

  particles.rotation.y += deltaX * 0.005;
  particles.rotation.x += deltaY * 0.005;

  previousX = x;
  previousY = y;
}

function onPointerUp() {
  isDragging = false;
}

document.addEventListener('mousedown', onPointerDown);
document.addEventListener('mousemove', onPointerMove);
document.addEventListener('mouseup', onPointerUp);

document.addEventListener('touchstart', onPointerDown);
document.addEventListener('touchmove', onPointerMove);
document.addEventListener('touchend', onPointerUp);
