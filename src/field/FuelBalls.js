import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FUEL, FIELD } from './FieldDimensions.js';

export const fuelBallMaterial = new CANNON.Material('fuelBall');

const BALL_COLOR   = 0xf5c200;
const BALL_COUNT   = 20;
const SPAWN_X_HALF = FIELD.WIDTH  / 2 - 2.0;
const SPAWN_Z_HALF = FIELD.DEPTH  / 2 - 0.5;

export function buildFuelBalls(scene, world) {
  const geo = new THREE.SphereGeometry(FUEL.RADIUS, 16, 12);
  const mat = new THREE.MeshLambertMaterial({ color: BALL_COLOR });

  // Deterministic grid scatter so positions are consistent across reloads
  const cols = Math.ceil(Math.sqrt(BALL_COUNT));
  const rows = Math.ceil(BALL_COUNT / cols);
  const xStep = (SPAWN_X_HALF * 2) / (cols + 1);
  const zStep = (SPAWN_Z_HALF * 2) / (rows + 1);

  for (let i = 0; i < BALL_COUNT; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = -SPAWN_X_HALF + xStep * (col + 1);
    const z = -SPAWN_Z_HALF + zStep * (row + 1);
    const y = FUEL.RADIUS + 0.02; // just above carpet

    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const body = new CANNON.Body({ mass: FUEL.MASS, material: fuelBallMaterial });
    body.addShape(new CANNON.Sphere(FUEL.RADIUS));
    body.position.set(x, y, z);
    body.linearDamping  = 0.4;
    body.angularDamping = 0.4;
    world.addBody(body);

    // Keep mesh in sync each frame via a reference stored on the body
    body.userData = { mesh };
  }

  // Return a tick function to sync mesh positions from physics each frame
  return function syncFuelBalls() {
    world.bodies.forEach(b => {
      if (b.userData?.mesh) {
        b.userData.mesh.position.copy(b.position);
        b.userData.mesh.quaternion.copy(b.quaternion);
      }
    });
  };
}
