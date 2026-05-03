import * as THREE from 'three';
import { DEPOT, FIELD } from './FieldDimensions.js';

function buildSingleDepot(scene, x, color) {
  const mat = new THREE.MeshStandardMaterial({
    color: 0x666666,
    roughness: 0.5,
    metalness: 0.5,
  });

  const W = DEPOT.WIDTH;
  const D = DEPOT.DEPTH;
  const BH = DEPOT.BARRIER_HEIGHT;
  const BW = DEPOT.BARRIER_WIDTH;

  // Steel barrier walls
  [
    { w: W,  h: BH, d: BW, px: 0,    pz:  D/2 },
    { w: W,  h: BH, d: BW, px: 0,    pz: -D/2 },
    { w: BW, h: BH, d: D,  px:  W/2, pz: 0    },
    { w: BW, h: BH, d: D,  px: -W/2, pz: 0    },
  ].forEach(p => {
    const geo = new THREE.BoxGeometry(p.w, p.h, p.d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x + p.px, BH/2, p.pz);
    scene.add(mesh);
  });

  // Floor marking
  const floorGeo = new THREE.PlaneGeometry(W, D);
  const floorMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.8,
    opacity: 0.3,
    transparent: true,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(x, 0.002, 0);
  scene.add(floor);
}

export function buildDepots(scene) {
  // Depots sit along alliance wall, centered on Z=0
  const redX  =  FIELD.WIDTH/2 - DEPOT.WIDTH/2 - 0.05;
  const blueX = -FIELD.WIDTH/2 + DEPOT.WIDTH/2 + 0.05;
  buildSingleDepot(scene, redX,  0xff2200);
  buildSingleDepot(scene, blueX, 0x0044ff);
}