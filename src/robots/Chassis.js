import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { config } from './RobotConfig.js';
import { bumperMaterial } from '../physics/Materials.js';

export function buildChassis(scene, world, startPosition = [0, 0.25, 0]) {
  const [sx, sy, sz] = startPosition;

  const body = new CANNON.Body({ mass: config.mass, material: bumperMaterial });
  const chassisShape = new CANNON.Box(new CANNON.Vec3(
    config.frameLength / 2,
    config.frameHeight / 2,
    config.frameWidth / 2,
  ));
  body.addShape(chassisShape);
  body.position.set(sx, sy, sz);
  body.linearDamping  = config.linearDamping;
  body.angularDamping = config.angularDamping;
  world.addBody(body);

  const group = new THREE.Group();

  // Main frame
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6, metalness: 0.8 });
  const frameGeo = new THREE.BoxGeometry(config.frameLength, config.frameHeight, config.frameWidth);
  group.add(new THREE.Mesh(frameGeo, frameMat));

  // Bumpers — 4 panels around perimeter
  const bumperMat2 = new THREE.MeshStandardMaterial({ color: 0xcc2222, roughness: 0.8 });
  const H = config.bumperHeight;
  const T = config.bumperThick;
  const FL = config.frameLength;
  const FW = config.frameWidth;
  const Y = -config.frameHeight / 2 + H / 2;

  const bumperY = -bumpH / 2 + config.frameHeight / 2;
  // Front/back panels: thin in X (bumpT), span full Z including corners (fW + 2*bumpT)
  addBumperPanel(group, bumperMat2, bumpT, bumpH, fW + bumpT * 2,  fL / 2 + bumpT / 2, bumperY, 0);
  addBumperPanel(group, bumperMat2, bumpT, bumpH, fW + bumpT * 2, -fL / 2 - bumpT / 2, bumperY, 0);
  // Left/right panels: span inner X length (fL), thin in Z (bumpT)
  addBumperPanel(group, bumperMat2, fL, bumpH, bumpT, 0, bumperY,  fW / 2 + bumpT / 2);
  addBumperPanel(group, bumperMat2, fL, bumpH, bumpT, 0, bumperY, -fW / 2 - bumpT / 2);

  // Left and right
  [FW/2 + T/2, -FW/2 - T/2].forEach(z => {
    const geo = new THREE.BoxGeometry(FL, H, T);
    const mesh = new THREE.Mesh(geo, bumperMat2);
    mesh.position.set(0, Y, z);
    group.add(mesh);
  });

  // Wheels
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
  const wheelGeo = new THREE.CylinderGeometry(config.wheelRadius, config.wheelRadius, config.wheelWidth, 20);
  wheelGeo.rotateZ(Math.PI / 2);

  [config.wheelbase, 0, -config.wheelbase].forEach(wx => {
    [config.trackWidth / 2, -config.trackWidth / 2].forEach(wz => {
      const wMesh = new THREE.Mesh(wheelGeo, wheelMat);
      wMesh.position.set(wx, -config.frameHeight / 2, wz);
      group.add(wMesh);
    });
  });

  scene.add(group);
  return { body, group };
}