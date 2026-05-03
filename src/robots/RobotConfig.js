import { ROBOT } from '../field/FieldDimensions.js';

export const config = {
  mass:          ROBOT.MASS,
  frameWidth:    ROBOT.FRAME_WIDTH,
  frameLength:   ROBOT.FRAME_LENGTH,
  frameHeight:   0.1016,              // 4" aluminum tube height
  wheelRadius:   ROBOT.WHEEL_RADIUS,
  wheelWidth:    0.038,               // 1.5" HiGrip wheel width
  trackWidth:    ROBOT.TRACK_WIDTH,
  wheelbase:     ROBOT.WHEELBASE,
  bumperThick:   ROBOT.BUMPER_THICKNESS,
  bumperHeight:  0.1397,              // 5.5" bumper height (rule minimum)
  maxSpeed:      4.5,                 // m/s (~15 ft/s free speed)
  maxTorque:     25,                  // Nm per side
  linearDamping: 0.99,
  angularDamping: 0.99,
};