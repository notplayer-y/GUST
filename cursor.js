(function () {
  // Prevent duplicate initialization or running on touch-only devices
  if (document.getElementById('sleek-cursor-dot') || window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  // 1. Inject custom CSS for the cursor elements, ripple, and link hover states
  const style = document.createElement('style');
  style.textContent = `
    /* Hide the default system cursor */
    *, *::before, *::after {
      cursor: none !important;
    }

    /* Primary inner dot */
    #sleek-cursor-dot {
      position: fixed;
      top: 0;
      left: 0;
      width: 8px;
      height: 8px;
      background-color: #d4a017;
      border-radius: 50%;
      pointer-events: none;
      z-index: 999999;
      transform: translate(-50%, -50%);
      transition: transform 0.15s ease-out, background-color 0.2s ease;
    }

    /* Outer trailing ring */
    #sleek-cursor-ring {
      position: fixed;
      top: 0;
      left: 0;
      width: 32px;
      height: 32px;
      border: 1px solid rgba(212, 160, 23, 0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 999998;
      transform: translate(-50%, -50%);
      transition: width 0.2s ease, height 0.2s ease, border-color 0.2s ease;
    }

    /* Expand cursor on hoverable elements */
    body.cursor-hover #sleek-cursor-dot {
      transform: translate(-50%, -50%) scale(1.5);
      background-color: #f5f1e6;
    }
    body.cursor-hover #sleek-cursor-ring {
      width: 48px;
      height: 48px;
      border-color: rgba(245, 241, 230, 0.8);
    }

    /* Click ripple animation */
    .sleek-cursor-ripple {
      position: fixed;
      width: 10px;
      height: 10px;
      border: 1px solid #d4a017;
      border-radius: 50%;
      pointer-events: none;
      z-index: 999997;
      transform: translate(-50%, -50%) scale(1);
      animation: sleek-ripple-out 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
    }

    @keyframes sleek-ripple-out {
      0% {
        opacity: 0.8;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(6);
      }
    }
  `;
  document.head.appendChild(style);

  // 2. Create and attach cursor elements
  const dot = document.createElement('div');
  dot.id = 'sleek-cursor-dot';

  const ring = document.createElement('div');
  ring.id = 'sleek-cursor-ring';

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  // Positional state variables
  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  // 3. Track mouse movement
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Instant update for the inner dot
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  }, { passive: true });

  // 4. Smooth lerp (linear interpolation) loop for trailing ring
  function animate() {
    // Lerp factor (0.15 = smooth delay)
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // 5. Click ripple effect
  window.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'sleek-cursor-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;

    document.body.appendChild(ripple);

    // Remove ripple DOM node after animation finishes
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  });

  // 6. Expand cursor when hovering interactive elements
  const interactiveSelector = 'a, button, input, textarea, select, code, [role="button"]';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.remove('cursor-hover');
    }
  });
})();