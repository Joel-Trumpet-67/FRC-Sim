import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { TOWER, FIELD } from './FieldDimensions.js';

function buildSingleTower(scene, world, x, color) {
  const mat = new THREE.MeshLambertMaterial({ color });

  // Vertical uprights (4 corners)
  const upW = 0.05;
  const upH = TOWER.HEIGHT;
  const corners = [
    [ TOWER.WIDTH/2,  TOWER.DEPTH/2],
    [-TOWER.WIDTH/2,  TOWER.DEPTH/2],
    [ TOWER.WIDTH/2, -TOWER.DEPTH/2],
    [-TOWER.WIDTH/2, -TOWER.DEPTH/2],
  ];

  corners.forEach(([ox, oz]) => {
    const geo = new THREE.BoxGeometry(upW, upH, upW);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x + ox, upH / 2, oz);
    scene.add(mesh);

    const body = new CANNON.Body({ mass: 0 });
    body.addShape(new CANNON.Box(new CANNON.Vec3(upW/2, upH/2, upW/2)));
    body.position.set(x + ox, upH / 2, oz);
    world.addBody(body);
  });

  // Rungs
  [TOWER.RUNG_LOW, TOWER.RUNG_MID, TOWER.RUNG_HIGH].forEach(height => {
    const rGeo = new THREE.CylinderGeometry(
      TOWER.RUNG_DIAMETER / 2,
      TOWER.RUNG_DIAMETER / 2,
      TOWER.WIDTH, 12
    );
    const rMesh = new THREE.Mesh(rGeo, mat);
    rMesh.rotation.z = Math.PI / 2;
    rMesh.position.set(x, height, 0);
    scene.add(rMesh);

    const rBody = new CANNON.Body({ mass: 0 });
    rBody.addShape(new CANNON.Cylinder(
      TOWER.RUNG_DIAMETER/2, TOWER.RUNG_DIAMETER/2, TOWER.WIDTH, 12
    ));
    rBody.quaternion.setFromEuler(0, 0, Math.PI/2);
    rBody.position.set(x, height, 0);
    world.addBody(rBody);
  });
}

export function buildTowers(scene, world) {
  // Towers are at the far end of each alliance zone
  const redX  =  FIELD.WIDTH / 2 - 0.5;
  const blueX = -FIELD.WIDTH / 2 + 0.5;
  buildSingleTower(scene, world, redX,  0xff4444);
  buildSingleTower(scene, world, blueX, 0x4444ff);
}