import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { TRENCH, FIELD } from './FieldDimensions.js';

function buildSingleTrench(scene, world, x, z, color) {
  const mat = new THREE.MeshLambertMaterial({ color, transparent: true, opacity: 0.7 });
  const thick = 0.03;

  // Top horizontal arm
  const topGeo = new THREE.BoxGeometry(TRENCH.DEPTH, thick, TRENCH.WIDTH);
  const topMesh = new THREE.Mesh(topGeo, mat);
  topMesh.position.set(x, TRENCH.HEIGHT, z);
  scene.add(topMesh);

  const topBody = new CANNON.Body({ mass: 0 });
  topBody.addShape(new CANNON.Box(new CANNON.Vec3(TRENCH.DEPTH/2, thick/2, TRENCH.WIDTH/2)));
  topBody.position.set(x, TRENCH.HEIGHT, z);
  world.addBody(topBody);

  // Support posts
  [-TRENCH.DEPTH/2, TRENCH.DEPTH/2].forEach(dx => {
    const pGeo = new THREE.BoxGeometry(thick, TRENCH.HEIGHT, thick);
    const pMesh = new THREE.Mesh(pGeo, mat);
    pMesh.position.set(x + dx, TRENCH.HEIGHT/2, z);
    scene.add(pMesh);
  });
}

export function buildTrenches(scene, world) {
  // 4 trenches total — one per side per alliance, along the guardrails
  const zOffset = FIELD.DEPTH / 2 - TRENCH.WIDTH / 2;
  const xRed    =  FIELD.WIDTH / 2 - TRENCH.DEPTH / 2;
  const xBlue   = -FIELD.WIDTH / 2 + TRENCH.DEPTH / 2;

  buildSingleTrench(scene, world, xRed,   zOffset, 0xff8888);
  buildSingleTrench(scene, world, xRed,  -zOffset, 0xff8888);
  buildSingleTrench(scene, world, xBlue,  zOffset, 0x8888ff);
  buildSingleTrench(scene, world, xBlue, -zOffset, 0x8888ff);
}