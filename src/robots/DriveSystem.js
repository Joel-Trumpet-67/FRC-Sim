import { config } from './RobotConfig.js';
import * as CANNON from 'cannon-es';

export function applyDrive(body, leftPower, rightPower) {
  const force = config.maxTorque / config.wheelRadius;

  const forward = new CANNON.Vec3(1, 0, 0);
  const worldForward = body.quaternion.vmult(forward);

  const avgPower  = (leftPower + rightPower) / 2;
  const diffPower = (rightPower - leftPower) / 2;

  body.applyForce(
    worldForward.scale(avgPower * force * 20),
    body.position
  );

  const torqueVec = new CANNON.Vec3(0, diffPower * config.maxTorque * 8, 0);
  const worldTorque = body.quaternion.vmult(torqueVec);
  body.torque.vadd(worldTorque, body.torque);
}