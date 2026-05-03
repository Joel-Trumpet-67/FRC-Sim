import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FIELD } from './FieldDimensions.js';
import { fieldWallMaterial } from '../physics/Materials.js';

const H = FIELD.GUARDRAIL_HEIGHT;
const W = FIELD.WIDTH;
const D = FIELD.DEPTH;
const T = FIELD.GUARDRAIL_THICKNESS;

function addWall(scene, world, w, h, d, px, py, pz) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x88bbff,
    transparent: true,
    opacity: 0.25,
    roughness: 0.05,
    metalness: 0.1,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(px, py, pz);
  scene.add(mesh);

  // Aluminum extrusion top and bottom rails
  [h / 2, -h / 2].forEach(dy => {
    const railGeo = new THREE.BoxGeometry(w, 0.03, 0.03);
    const railMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.set(px, py + dy, pz);
    scene.add(rail);
  });

  const body = new CANNON.Body({ mass: 0, material: fieldWallMaterial });
  body.addShape(new CANNON.Box(new CANNON.Vec3(w / 2, h / 2, d / 2)));
  body.position.set(px, py, pz);
  world.addBody(body);
}

export function buildGuardrails(scene, world) {
  const y = H / 2;
  // Long sides
  addWall(scene, world, W, H, T, 0, y,  D / 2);
  addWall(scene, world, W, H, T, 0, y, -D / 2);
  // Short ends
  addWall(scene, world, T, H, D, W / 2,  y, 0);
  addWall(scene, world, T, H, D, -W / 2, y, 0);
}