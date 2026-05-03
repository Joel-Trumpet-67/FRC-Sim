import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { TOWER, FIELD } from './FieldDimensions.js';

function buildSingleTower(scene, world, x, color) {
  const mat = new THREE.MeshStandardMaterial({
    color: 0x444444,
    roughness: 0.4,
    metalness: 0.7,
  });

  const rungMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.2,
    metalness: 0.9,
  });

  const S = TOWER.UPRIGHT_SIZE;
  const H = TOWER.HEIGHT;
  const W = TOWER.WIDTH;
  const D = TOWER.DEPTH;

  // Four corner uprights
  [
    [ W/2,  D/2],
    [-W/2,  D/2],
    [ W/2, -D/2],
    [-W/2, -D/2],
  ].forEach(([ox, oz]) => {
    const geo = new THREE.BoxGeometry(S, H, S);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x + ox, H/2, oz);
    mesh.castShadow = true;
    scene.add(mesh);

    const body = new CANNON.Body({ mass: 0 });
    body.addShape(new CANNON.Box(new CANNON.Vec3(S/2, H/2, S/2)));
    body.position.set(x + ox, H/2, oz);
    world.addBody(body);
  });

  // Three rungs
  [TOWER.RUNG_LOW, TOWER.RUNG_MID, TOWER.RUNG_HIGH].forEach(height => {
    const geo = new THREE.CylinderGeometry(
      TOWER.RUNG_RADIUS, TOWER.RUNG_RADIUS, W, 16
    );
    const mesh = new THREE.Mesh(geo, rungMat);
    mesh.rotation.z = Math.PI / 2;
    mesh.position.set(x, height, 0);
    mesh.castShadow = true;
    scene.add(mesh);

    const body = new CANNON.Body({ mass: 0 });
    body.addShape(new CANNON.Cylinder(
      TOWER.RUNG_RADIUS, TOWER.RUNG_RADIUS, W, 16
    ));
    body.quaternion.setFromEuler(0, 0, Math.PI/2);
    body.position.set(x, height, 0);
    world.addBody(body);
  });

  // Base plate
  const baseGeo = new THREE.BoxGeometry(W + 0.1, 0.05, D + 0.1);
  const baseMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.set(x, 0.025, 0);
  scene.add(base);
}

export function buildTowers(scene, world) {
  // Tower sits inside alliance zone, touching alliance wall
  // Red tower at far right, blue at far left
  const redX  =  FIELD.WIDTH/2 - TOWER.DEPTH/2 - 0.1;
  const blueX = -FIELD.WIDTH/2 + TOWER.DEPTH/2 + 0.1;
  buildSingleTower(scene, world, redX,  0xff2200);
  buildSingleTower(scene, world, blueX, 0x0044ff);
}