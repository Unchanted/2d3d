
(function() {
  'use strict';

  const focalLength = 100;
  const zSpacing = 50;
  const beyond = 1.5;
  const frames = 24;
  const orbSpeed = 10;
  const orbTotal = 100;
  const orbWidth = 300;
  const orbHeight = 300;

  let centerX = window.innerWidth / 2;
  let centerY = window.innerHeight / 2;
  let deltaX = centerX;
  let deltaY = centerY;
  let deltaZ = 0;

  const container = document.querySelector('.orbs');
  const orbs = Array.from({ length: orbTotal }, (_, i) => createOrb(i));

  orbs.forEach(orb => container.appendChild(orb.el));
  circularPattern();

  function createOrb(id) {
    const orb = {
      id,
      x: 0,
      y: 0,
      z: id * zSpacing,
      ix: 0,
      iy: 0,
      iz: id * zSpacing,
      el: document.createElement('div'),
    };
    
    orb.el.className = 'orb';
    orb.el.dataset.id = id;
    orb.el.textContent = id + 1;
    orb.el.style.zIndex = orbTotal - id;
    orb.el.style.width = `${orbWidth}px`;
    orb.el.style.height = `${orbHeight}px`;
    orb.el.style.left = `${-orbWidth}px`;
    orb.el.style.top = `${-orbHeight}px`;
    orb.el.style.color = '#fff';
    orb.el.style.background = getRandomHexColor();
    orb.el.style.transform = `scale(${getScale(orb.z)}) translate(-50%, -50%)`;
    orb.el.style.opacity = getScale(orb.z);
    orb.el.addEventListener('click', clickedOrb);

    return orb;
  }

  function getScale(z) {
    return focalLength / (focalLength + z);
  }

  function updateOrbs() {
    deltaX += (targetX - deltaX) / orbSpeed;
    deltaY += (targetY - deltaY) / orbSpeed;
    deltaZ += (targetZ - deltaZ) / orbSpeed;

    orbs.forEach(orb => {
      orb.z = orb.iz - deltaZ;
      const scale = getScale(orb.z);
      orb.x = (orb.ix - deltaX) * scale + centerX;
      orb.y = (orb.iy - deltaY) * scale + centerY;

      orb.el.style.transform = `scale(${scale}) translate(-50%, -50%)`;
      orb.el.style.left = `${orb.x}px`;
      orb.el.style.top = `${orb.y}px`;
      orb.el.style.opacity = scale;
      orb.el.style.visibility = scale > beyond || scale < 0 ? 'hidden' : 'visible';
    });
  }
})();
