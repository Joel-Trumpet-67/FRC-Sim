import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { TRENCH, FIELD, HUB, BUMP } from './FieldDimensions.js';

function buildSingleTrench(scene, world, cx, cz, flipped) {
  const mat = new THREE.MeshStandardMaterial({
    color: 0x777777,
    roughness: 0.4,
    metalness: 0.6,
  });

  const T = TRENCH.THICKNESS;
  const H = TRENCH.HEIGHT;
  const D = TRENCH.DEPTH;
  const W = TRENCH.WIDTH;

  // Top horizontal arm — runs along X axis, sits at guardrail
  const topGeo = new THREE.BoxGeometry(D, T, W);
  const topMesh = new THREE.Mesh(topGeo, mat);
  topMesh.position.set(cx, H, cz);
  topMesh.castShadow = true;
  scene.add(topMesh);

  const topBody = new CANNON.Body({ mass: 0 });
  topBody.addShape(new CANNON.Box(new CANNON.Vec3(D/2, T/2, W/2)));
  topBody.position.set(cx, H, cz);
  world.addBody(topBody);

  // Support posts at each end
  [-D/2, D/2].forEach(dx => {
    const postGeo = new THREE.BoxGeometry(T, H, T);
    const post = new THREE.Mesh(postGeo, mat);
    post.position.set(cx + dx, H/2, cz);
    scene.add(post);
  });
}

export function buildTrenches(scene, world) {
  const redX  =  FIELD.WIDTH / 2 - HUB.DIST_FROM_WALL;
  const blueX = -FIELD.WIDTH / 2 + HUB.DIST_FROM_WALL;

  // Trench X: between bump outer edge and alliance wall
  // Bump outer edge = hubX + HUB.WIDTH/2 + BUMP.WIDTH (along Z) 
  // But trench runs along X axis, from bump to guardrail
  const redTrenchX  =  FIELD.WIDTH/2 - TRENCH.DEPTH/2 - 0.05;
  const blueTrenchX = -FIELD.WIDTH/2 + TRENCH.DEPTH/2 + 0.05;

  // Z position: along guardrail (near +Z and -Z edges)
  const zNear =  FIELD.DEPTH/2 - TRENCH.WIDTH/2;
  const zFar  = -FIELD.DEPTH/2 + TRENCH.WIDTH/2;

  buildSingleTrench(scene, world, redTrenchX,  zNear);
  buildSingleTrench(scene, world, redTrenchX,  zFar);
  buildSingleTrench(scene, world, blueTrenchX, zNear);
  buildSingleTrench(scene, world, blueTrenchX, zFar);
}