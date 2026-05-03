// All official dimensions converted from inches to meters
// Source: 2026 REBUILT Game Manual + field-dimension-dwgs.pdf
const IN = 0.0254; // 1 inch in meters

export const FIELD = {
  WIDTH:  651.2 * IN,   // 16.54m - long axis
  DEPTH:  317.7 * IN,   // 8.07m  - short axis
  GUARDRAIL_HEIGHT: 20 * IN,
};

export const BUMP = {
  WIDTH:  73.0  * IN,
  DEPTH:  44.4  * IN,
  HEIGHT: 6.513 * IN,
  RAMP_ANGLE_DEG: 15,
};

export const TRENCH = {
  WIDTH:        65.65 * IN,
  DEPTH:        47.0  * IN,
  HEIGHT:       40.25 * IN,
  CLEAR_WIDTH:  50.34 * IN,
  CLEAR_HEIGHT: 22.25 * IN,
};

export const HUB = {
  WIDTH:         47 * IN,
  DEPTH:         47 * IN,
  HEIGHT:        72 * IN,  // top opening height from carpet
  OPENING_SIZE:  41.7 * IN, // hexagonal opening diameter
  // Center of hub is 158.6in from alliance wall
  DIST_FROM_WALL: 158.6 * IN,
};

export const TOWER = {
  WIDTH:  49.25 * IN,
  DEPTH:  45.0  * IN,
  HEIGHT: 78.25 * IN,
  RUNG_LOW:  27 * IN,
  RUNG_MID:  45 * IN,
  RUNG_HIGH: 63 * IN,
  RUNG_SPACING: 18 * IN,
  RUNG_DIAMETER: 1.25 * IN,
};

export const DEPOT = {
  WIDTH: 42 * IN,
  DEPTH: 27 * IN,
  BARRIER_HEIGHT: 1.125 * IN,
};

export const ALLIANCE_ZONE = {
  DEPTH: 158.6 * IN, // from alliance wall to hub center
};

export const FUEL = {
  RADIUS: (5.91 / 2) * IN,
  MASS: 0.226, // kg (midpoint of 0.203–0.227kg)
};

export const ROBOT = {
  // AM14U6 KitBot Long Configuration with bumpers
  FRAME_WIDTH:  26.5  * IN,  // chassis only
  FRAME_LENGTH: 32.3  * IN,
  WHEEL_RADIUS:  3.0  * IN,  // 6" wheel diameter
  BUMPER_THICKNESS: 3.5 * IN,
  // With bumpers
  TOTAL_WIDTH:  33.5  * IN,
  TOTAL_LENGTH: 39.3  * IN,
  MAX_HEIGHT:   30    * IN,
  MASS: 52.2, // kg (115 lbs)
  TRACK_WIDTH:  26.5  * IN,
  WHEELBASE:    20.0  * IN,   // center wheel to front/back wheel
};