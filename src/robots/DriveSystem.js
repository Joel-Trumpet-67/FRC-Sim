import { config } from './RobotConfig.js';
import * as CANNON from 'cannon-es';

export function applyDrive(body, leftPower, rightPower) {
  leftPower  = Math.max(-1, Math.min(1, leftPower));
  rightPower = Math.max(-1, Math.min(1, rightPower));

  const force = config.maxTorque / config.wheelRadius * 3;

  const localForward = new CANNON.Vec3(1, 0, 0);
  const localRight   = new CANNON.Vec3(0, 0, 1);
  const worldForward = body.quaternion.vmult(localForward);
  const worldRight   = body.quaternion.vmult(localRight);

  const leftPos  = body.position.vadd(worldRight.scale(-config.trackWidth / 2));
  const rightPos = body.position.vadd(worldRight.scale( config.trackWidth / 2));

  body.applyForce(worldForward.scale(leftPower  * force), leftPos);
  body.applyForce(worldForward.scale(rightPower * force), rightPos);
}