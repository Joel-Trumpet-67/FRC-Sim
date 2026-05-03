import * as THREE from 'three';
import { FIELD } from './FieldDimensions.js';

export function buildAllianceWalls(scene) {
  const wallH = 1.6;
  const wallT = 0.1;

  [
    { x:  FIELD.WIDTH/2, color: 0xff2200 },
    { x: -FIELD.WIDTH/2, color: 0x0044ff },
  ].forEach(({ x, color }) => {
    // Main wall
    const geo = new THREE.BoxGeometry(wallT, wallH, FIELD.DEPTH);
    const mat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, wallH/2, 0);
    mesh.castShadow = true;
    scene.add(mesh);

    // Three driver station windows
    [-FIELD.DEPTH/3, 0, FIELD.DEPTH/3].forEach(z => {
      const winGeo = new THREE.BoxGeometry(wallT + 0.01, 0.6, 0.8);
      const winMat = new THREE.MeshStandardMaterial({
        color,
        transparent: true,
        opacity: 0.4,
        roughness: 0.05,
      });
      const win = new THREE.Mesh(winGeo, winMat);
      win.position.set(x, wallH/2, z);
      scene.add(win);
    });
  });
}