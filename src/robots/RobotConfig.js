import { ROBOT } from '../field/FieldDimensions.js';

export const config = {
  mass:           ROBOT.MASS,
  frameWidth:     ROBOT.FRAME_WIDTH,
  frameLength:    ROBOT.FRAME_LENGTH,
  frameHeight:    0.1016,
  wheelRadius:    ROBOT.WHEEL_RADIUS,
  wheelWidth:     0.038,
  bumperThick:    ROBOT.BUMPER_THICKNESS,
  bumperHeight:   0.1397,
  trackWidth:     ROBOT.TRACK_WIDTH,
  wheelbase:      ROBOT.WHEELBASE,
  maxSpeed:       4.5,
  maxTorque:      25,
  linearDamping:  0.3,
  angularDamping: 0.4,
};