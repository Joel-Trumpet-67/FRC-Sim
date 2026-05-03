import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { config } from './RobotConfig.js';
import { bumperMaterial } from '../physics/Materials.js';

export function buildChassis(scene, world, startPosition = [0, 0.15, 0]) {
  const [sx, sy, sz] = startPosition;

  // === CANNON physics body ===
  const body = new CANNON.Body({ mass: config.mass, material: bumperMaterial });

  // Main chassis box
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

  // === THREE.js visual group ===
  const group = new THREE.Group();

  // Frame
  const frameMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const frameGeo = new THREE.BoxGeometry(
    config.frameLength,
    config.frameHeight,
    config.frameWidth,
  );
  const frameMesh = new THREE.Mesh(frameGeo, frameMat);
  group.add(frameMesh);

  // Bumpers
  const bumperMat2 = new THREE.MeshLambertMaterial({ color: 0xcc2222 }); // red default
  const bumpH = config.bumperHeight;
  const bumpT = config.bumperThick;
  const fL = config.frameLength;
  const fW = config.frameWidth;

  const bumperY = -bumpH / 2 + config.frameHeight / 2;
  // Front/back panels: thin in X (bumpT), span full Z including corners (fW + 2*bumpT)
  addBumperPanel(group, bumperMat2, bumpT, bumpH, fW + bumpT * 2,  fL / 2 + bumpT / 2, bumperY, 0);
  addBumperPanel(group, bumperMat2, bumpT, bumpH, fW + bumpT * 2, -fL / 2 - bumpT / 2, bumperY, 0);
  // Left/right panels: span inner X length (fL), thin in Z (bumpT)
  addBumperPanel(group, bumperMat2, fL, bumpH, bumpT, 0, bumperY,  fW / 2 + bumpT / 2);
  addBumperPanel(group, bumperMat2, fL, bumpH, bumpT, 0, bumperY, -fW / 2 - bumpT / 2);

  // Wheels (visual only — drive handled by physics forces on body)
  const wheelMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
  const wheelGeo = new THREE.CylinderGeometry(
    config.wheelRadius, config.wheelRadius, config.wheelWidth, 20
  );
  wheelGeo.rotateZ(Math.PI / 2);

  const wheelPositions = [
    [ config.wheelbase,  0,  config.trackWidth / 2],
    [ config.wheelbase,  0, -config.trackWidth / 2],
    [ 0,                 0,  config.trackWidth / 2],
    [ 0,                 0, -config.trackWidth / 2],
    [-config.wheelbase,  0,  config.trackWidth / 2],
    [-config.wheelbase,  0, -config.trackWidth / 2],
  ];

  wheelPositions.forEach(([wx, wy, wz]) => {
    const wMesh = new THREE.Mesh(wheelGeo, wheelMat);
    wMesh.position.set(wx, wy - config.frameHeight/2, wz);
    group.add(wMesh);
  });

  scene.add(group);

  return { body, group };
}

function addBumperPanel(group, mat, w, h, d, x, y, z) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  group.add(mesh);
}