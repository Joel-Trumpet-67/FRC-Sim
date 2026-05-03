import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FIELD } from './FieldDimensions.js';
import { fieldWallMaterial } from '../physics/Materials.js';

const H = FIELD.GUARDRAIL_HEIGHT;
const W = FIELD.WIDTH;
const D = FIELD.DEPTH;

function addWall(scene, world, w, h, d, px, py, pz) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshLambertMaterial({
    color: 0xaaddff,
    transparent: true,
    opacity: 0.35,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(px, py, pz);
  scene.add(mesh);

  const body = new CANNON.Body({ mass: 0, material: fieldWallMaterial });
  body.addShape(new CANNON.Box(new CANNON.Vec3(w / 2, h / 2, d / 2)));
  body.position.set(px, py, pz);
  world.addBody(body);
}

export function buildGuardrails(scene, world) {
  const y = H / 2;
  const thick = 0.025; // 1" polycarbonate panel thickness

  // Long sides (along field width)
  addWall(scene, world, W, H, thick,  0,      y,  D / 2);
  addWall(scene, world, W, H, thick,  0,      y, -D / 2);
  // Short ends (alliance walls - simplified)
  addWall(scene, world, thick, H, D,  W / 2,  y,  0);
  addWall(scene, world, thick, H, D, -W / 2,  y,  0);
}