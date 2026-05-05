const keys = {};

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup',   e => keys[e.code] = false);

export function getDriveInputs() {
  let left  = 0;
  let right = 0;

  if (keys['KeyW']) { left += 1;  right += 1;  }
  if (keys['KeyS']) { left -= 1;  right -= 1;  }
  if (keys['KeyA']) { left -= 0.6; right += 0.6; }
  if (keys['KeyD']) { left += 0.6; right -= 0.6; }

  left  = Math.max(-1, Math.min(1, left));
  right = Math.max(-1, Math.min(1, right));

  return { left, right };
}

export function getMechanismInputs() {
  return {
    buttonA:     keys['KeyE'] ? 1 : 0,
    buttonB:     keys['KeyQ'] ? 1 : 0,
    buttonX:     keys['KeyR'] ? 1 : 0,
    leftTrigger: keys['KeyF'] ? 1 : keys['KeyV'] ? -1 : 0,
  };
}

export function getGamepadInputs() {
  const gp = navigator.getGamepads?.()[0];
  if (!gp) return null;
  return {
    left:  -gp.axes[1],
    right: -gp.axes[3],
  };
}

export function getGamepadMechanismInputs() {
  const gp = navigator.getGamepads?.()[0];
  if (!gp) return {};
  return {
    buttonA:     gp.buttons[0]?.value || 0,
    buttonB:     gp.buttons[1]?.value || 0,
    buttonX:     gp.buttons[2]?.value || 0,
    leftTrigger: (gp.buttons[6]?.value || 0) - (gp.buttons[7]?.value || 0),
  };
}