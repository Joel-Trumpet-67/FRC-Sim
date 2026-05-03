import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FIELD } from './FieldDimensions.js';
import { carpetMaterial } from '../physics/Materials.js';

export function buildCarpet(scene, world) {
  // Dark charcoal carpet matching XRC
  const geo = new THREE.PlaneGeometry(FIELD.WIDTH, FIELD.DEPTH);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.95,
    metalness: 0.0,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // White center line
  addLine(scene, 0, FIELD.DEPTH, 0.05, 0xffffff);
  // Red alliance line — 158.6in from red wall
  addLine(scene, FIELD.WIDTH/2 - 158.6*0.0254, FIELD.DEPTH, 0.04, 0xdd1100);
  // Blue alliance line
  addLine(scene, -FIELD.WIDTH/2 + 158.6*0.0254, FIELD.DEPTH, 0.04, 0x0011dd);

  // Physics ground
  const body = new CANNON.Body({ mass: 0, material: carpetMaterial });
  body.addShape(new CANNON.Plane());
  body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(body);

  return { mesh, body };
}

function addLine(scene, x, length, width, color) {
  const geo = new THREE.PlaneGeometry(width, length);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, 0.002, 0);
  scene.add(mesh);
}