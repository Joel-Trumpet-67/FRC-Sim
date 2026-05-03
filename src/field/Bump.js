import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { BUMP, FIELD, HUB } from './FieldDimensions.js';

function buildSingleBump(scene, world, cx, cz, color) {
  const W = BUMP.WIDTH;
  const D = BUMP.DEPTH;
  const H = BUMP.HEIGHT;
  const angle = BUMP.RAMP_ANGLE;

  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.5,
    metalness: 0.05,
  });

  // Front ramp (toward neutral zone)
  const frontGeo = new THREE.BoxGeometry(D/2, H, W);
  const frontMesh = new THREE.Mesh(frontGeo, mat);
  frontMesh.rotation.z = angle;
  frontMesh.position.set(cx - D/4, H/2, cz);
  frontMesh.castShadow = true;
  frontMesh.receiveShadow = true;
  scene.add(frontMesh);

  // Back ramp (toward alliance zone)
  const backGeo = new THREE.BoxGeometry(D/2, H, W);
  const backMesh = new THREE.Mesh(backGeo, mat);
  backMesh.rotation.z = -angle;
  backMesh.position.set(cx + D/4, H/2, cz);
  backMesh.castShadow = true;
  backMesh.receiveShadow = true;
  scene.add(backMesh);

  // Physics box
  const body = new CANNON.Body({ mass: 0 });
  body.addShape(new CANNON.Box(new CANNON.Vec3(D/2, H/2, W/2)));
  body.position.set(cx, H/2, cz);
  world.addBody(body);
}

export function buildBumps(scene, world) {
  const redX  =  FIELD.WIDTH / 2 - HUB.DIST_FROM_WALL;
  const blueX = -FIELD.WIDTH / 2 + HUB.DIST_FROM_WALL;

  // Bumps are on either side of hub along Z axis
  const zOffset = HUB.DEPTH / 2 + BUMP.WIDTH / 2;

  buildSingleBump(scene, world, redX,   zOffset, 0xff5500);
  buildSingleBump(scene, world, redX,  -zOffset, 0xff5500);
  buildSingleBump(scene, world, blueX,  zOffset, 0x0055ff);
  buildSingleBump(scene, world, blueX, -zOffset, 0x0055ff);
}