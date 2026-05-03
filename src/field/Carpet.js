import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FIELD } from './FieldDimensions.js';
import { carpetMaterial } from '../physics/Materials.js';

export function buildCarpet(scene, world) {
  // Visual
  const geo = new THREE.PlaneGeometry(FIELD.WIDTH, FIELD.DEPTH);
  const mat = new THREE.MeshLambertMaterial({ color: 0x2d5a27 }); // dark carpet green
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // Physics ground plane
  const body = new CANNON.Body({ mass: 0, material: carpetMaterial });
  body.addShape(new CANNON.Plane());
  body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(body);

  return { mesh, body };
}