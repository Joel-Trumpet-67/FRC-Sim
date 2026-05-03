import { config } from './RobotConfig.js';
import * as CANNON from 'cannon-es';

export function applyDrive(body, leftPower, rightPower) {
  // leftPower/rightPower: -1.0 to 1.0
  const force = config.maxTorque / config.wheelRadius;

  // Get local forward vector
  const forward = new CANNON.Vec3(1, 0, 0);
  const worldForward = body.quaternion.vmult(forward);
  const right = new CANNON.Vec3(0, 0, -1);
  const worldRight = body.quaternion.vmult(right);

  const avgPower   = (leftPower + rightPower) / 2;
  const diffPower  = (rightPower - leftPower) / 2;

  // Linear force
  body.applyForce(
    worldForward.scale(avgPower * force * 2),
    body.position
  );

  // Rotational torque from differential
  const torqueVec = new CANNON.Vec3(0, diffPower * config.maxTorque * 1.5, 0);
  const worldTorque = body.quaternion.vmult(torqueVec);
  body.torque.vadd(worldTorque, body.torque);
}