import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { BUMP, FIELD, HUB } from './FieldDimensions.js';

// Bumps are on either side of each hub, one set per alliance
// Alliance side: +X = red, -X = blue (field long axis = X)

function buildSingleBump(scene, world, cx, cz, color) {
  const W = BUMP.WIDTH;
  const D = BUMP.DEPTH;
  const H = BUMP.HEIGHT;

  // Simplified: flat-top box approximation of the 15-degree ramp
  // Full ramp geometry can be added later with wedge shapes
  const geo = new THREE.BoxGeometry(D, H, W);
  const mat = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(cx, H / 2, cz);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const body = new CANNON.Body({ mass: 0 });
  body.addShape(new CANNON.Box(new CANNON.Vec3(D / 2, H / 2, W / 2)));
  body.position.set(cx, H / 2, cz);
  world.addBody(body);
}

export function buildBumps(scene, world) {
  const hubX_red  =  FIELD.WIDTH / 2 - HUB.DIST_FROM_WALL;
  const hubX_blue = -FIELD.WIDTH / 2 + HUB.DIST_FROM_WALL;
  const bumpOffset = HUB.WIDTH / 2 + BUMP.WIDTH / 2;

  // Red alliance (positive X side)
  buildSingleBump(scene, world, hubX_red, -bumpOffset, 0xff4444);
  buildSingleBump(scene, world, hubX_red,  bumpOffset, 0xff4444);

  // Blue alliance (negative X side)
  buildSingleBump(scene, world, hubX_blue, -bumpOffset, 0x4444ff);
  buildSingleBump(scene, world, hubX_blue,  bumpOffset, 0x4444ff);
}