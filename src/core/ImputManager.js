const keys = {};

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup',   e => keys[e.code] = false);

export function getDriveInputs() {
  // WASD tank-ish: W/S = both sides, A/D = turn
  let left  = 0;
  let right = 0;

  if (keys['KeyW']) { left += 1;  right += 1;  }
  if (keys['KeyS']) { left -= 1;  right -= 1;  }
  if (keys['KeyA']) { left -= 0.6; right += 0.6; }
  if (keys['KeyD']) { left += 0.6; right -= 0.6; }

  // Clamp
  left  = Math.max(-1, Math.min(1, left));
  right = Math.max(-1, Math.min(1, right));

  return { left, right };
}

// Gamepad support
export function getGamepadInputs() {
  const gp = navigator.getGamepads?.()[0];
  if (!gp) return null;
  return {
    left:  -gp.axes[1],  // left stick Y
    right: -gp.axes[3],  // right stick Y
  };
}