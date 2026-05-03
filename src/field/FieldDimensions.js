const IN = 0.0254;

export const FIELD = {
  WIDTH:  651.2 * IN,
  DEPTH:  317.7 * IN,
  GUARDRAIL_HEIGHT: 20 * IN,
  GUARDRAIL_THICKNESS: 0.025,
};

export const BUMP = {
  WIDTH:  73.0  * IN,
  DEPTH:  44.4  * IN,
  HEIGHT: 6.513 * IN,
  RAMP_ANGLE: 15 * Math.PI / 180,
};

export const TRENCH = {
  WIDTH:        65.65 * IN,
  DEPTH:        47.0  * IN,
  HEIGHT:       40.25 * IN,
  CLEAR_WIDTH:  50.34 * IN,
  CLEAR_HEIGHT: 22.25 * IN,
  THICKNESS:    0.05,
};

export const HUB = {
  WIDTH:          47 * IN,
  DEPTH:          47 * IN,
  HEIGHT:         72 * IN,
  OPENING:        41.7 * IN,
  WALL:           0.05,
  DIST_FROM_WALL: 158.6 * IN,
};

export const TOWER = {
  WIDTH:        49.25 * IN,
  DEPTH:        45.0  * IN,
  HEIGHT:       78.25 * IN,
  RUNG_LOW:     27 * IN,
  RUNG_MID:     45 * IN,
  RUNG_HIGH:    63 * IN,
  RUNG_RADIUS:  0.016,
  UPRIGHT_SIZE: 0.05,
};

export const DEPOT = {
  WIDTH:          42 * IN,
  DEPTH:          27 * IN,
  BARRIER_HEIGHT: 1.125 * IN,
  BARRIER_WIDTH:  3.0 * IN,
};

export const FUEL = {
  RADIUS: (5.91 / 2) * IN,
  MASS:   0.226,
};

export const ROBOT = {
  FRAME_WIDTH:       26.5 * IN,
  FRAME_LENGTH:      32.3 * IN,
  FRAME_HEIGHT:      0.1016,
  WHEEL_RADIUS:      3.0  * IN,
  WHEEL_WIDTH:       0.038,
  BUMPER_THICKNESS:  3.5  * IN,
  BUMPER_HEIGHT:     3.5  * IN,
  TOTAL_WIDTH:       33.5 * IN,
  TOTAL_LENGTH:      39.3 * IN,
  MAX_HEIGHT:        30   * IN,
  MASS:              52.2,
  TRACK_WIDTH:       26.5 * IN,
  WHEELBASE:         20.0 * IN,
};