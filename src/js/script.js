!function() {
  'use_strict';

  // setup perspective
  const focalLength = 100;
  const zSpacing = 50;
  const beyond = 1.5; // maximum scale visibility

  // frames per second
  const frames = 24;
  const orbSpeed = 10;

  // center points
  let centerX = window.innerWidth * 0.5;
  let centerY = window.innerHeight * 0.5;
  let centerZ = 0;

  // change in position
  let deltaX = centerX;
  let deltaY = centerY;
  let deltaZ = centerZ;

  // target position
  let targetX, targetY, targetZ;

  // setup orbs
  const orbTotal = 100;
  const orbWidth = 300;
  const orbHeight = 300;
  const container = document.querySelector('.orbs');
  const orbs = [];
  let id = 0; // start on first orb

  for (let i = 0; i < orbTotal; i++) {
    // create orb object
    orbs[i] = {};
    orbs[i].id = i;

    // create orb element
    orbs[i].el = document.createElement('div');
    orbs[i].el.setAttribute('class', 'orb');
    orbs[i].el.dataset.id = i;
    orbs[i].el.textContent = i + 1;

    // scale and position
    orbs[i].x = 0;
    orbs[i].y = 0;
    orbs[i].z = i * zSpacing;
    const scale = focalLength / (focalLength + orbs[i].z); // perspective formula
    orbs[i].el.style.zIndex = orbTotal - i;

    // position off screen
    orbs[i].el.style.left = -orbWidth + 'px';
    orbs[i].el.style.top = -orbHeight + 'px';

    // save initial position
    orbs[i].iz = orbs[i].z;
    orbs[i].ix = orbs[i].x;
    orbs[i].iy = orbs[i].y;

    // set width and height
    orbs[i].el.style.width = orbWidth + 'px';
    orbs[i].el.style.height = orbHeight + 'px';
    orbs[i].el.style.transform = `scale(${scale}, ${scale}) translate(-50%, -50%)`; // translate to adjust center

    // set random colors
    orbs[i].el.style.color = '#fff';
    orbs[i].el.style.background = getRandomHexColor();

    // set opacity
    orbs[i].el.style.opacity = scale;

    // click event
    orbs[i].el.addEventListener('click', clickedOrb);

    // append orb to container
    container.appendChild(orbs[i].el);
  }

  // set inital pattern
  circularPattern();

  // shift perspective
  function updateOrbs() {
    // change in position (easing formula)
    deltaX += (targetX - deltaX) / orbSpeed;
    deltaY += (targetY - deltaY) / orbSpeed;
    deltaZ += (targetZ - deltaZ) / orbSpeed;

    for (let i = 0; i < orbTotal; i++) {
      // scale and reposition
      orbs[i].z = orbs[i].iz - deltaZ;
      const scale = focalLength / (focalLength + orbs[i].z); // perspective formula
      orbs[i].x = (orbs[i].ix - deltaX) * scale + centerX;
      orbs[i].y = (orbs[i].iy - deltaY) * scale + centerY;
      orbs[i].el.style.transform = `scale(${scale}, ${scale}) translate(-50%, -50%)`; // translate to adjust center
      orbs[i].el.style.left = orbs[i].x + 'px';
      orbs[i].el.style.top = orbs[i].y + 'px';

      // reset opacity
      orbs[i].el.style.opacity = scale;

      // hide if beyond visibility
      if (scale > beyond || scale < 0) {
        orbs[i].el.style.visibility = 'hidden';
      } else {
        orbs[i].el.style.visibility = 'visible';
      }
    }
  }

  // set repeating interval
  setInterval(updateOrbs, 1000 / frames); // 24 frames per second

  // reposition to target orb
  /
function targetOrb(_id = id) {
  const orb = orbs[_id];
  targetX = orb.ix;
  targetY = orb.iy;
  targetZ = orb.iz;
  id = _id;
}

// Set initial orb
targetOrb();

// Window resize and orientation change event listeners
const resizeHandler = () => {
  centerX = window.innerWidth / 2;
  centerY = window.innerHeight / 2;
};

['resize', 'onorientationchange'].forEach(eventType =>
  window.addEventListener(eventType, resizeHandler)
);

// Move to clicked orb
function clickedOrb(event) {
  const targetId = Number(event.target.dataset.id);
  if (id !== targetId) {
    targetOrb(targetId);
  }
}

// Mouse wheel support
window.addEventListener('wheel', event => {
  const delta = Math.sign(event.deltaY);
  if (delta === -1 && id > 0) {
    targetOrb(--id); // Previous orb
  } else if (delta === 1 && id < orbTotal - 1) {
    targetOrb(++id); // Next orb
  }
});

// Keyboard shortcuts
window.addEventListener('keydown', event => {
  const { which } = event;
  const keys = { up: 38, down: 40, left: 37, right: 39, space: 32 };

  if (which === keys.up || which === keys.space) {
    if (id < orbTotal - 1) targetOrb(++id); // Next orb
  } else if (which === keys.down && id > 0) {
    targetOrb(--id); // Previous orb
  } else if (which === keys.left) {
    targetOrb(0); // First orb
  } else if (which === keys.right) {
    targetOrb(orbTotal - 1); // Last orb
  }
});

// Random pattern event listener
document.querySelector('.patterns__random').addEventListener('click', event => {
  event.preventDefault();
  randomPattern();
  targetOrb();
});

function randomPattern() {
  orbs.forEach(orb => {
    orb.ix = getRandomRange(0, window.innerWidth - orbWidth);
    orb.iy = getRandomRange(0, window.innerHeight - orbHeight);
  });
}
